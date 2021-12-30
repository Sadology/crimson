const { SlashCommandBuilder } = require('@discordjs/builders');
const wait = require('util').promisify(setTimeout);
const Discord = require('discord.js');
const { Profiles } = require('../../models')
const moment = require('moment');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription('Set a custom status message that shows on mention')
        .addStringOption(option => 
            option.setName("message")
            .setDescription("Custom message will show when someone pings you")),
    permissions: ["MANAGE_MESSAGES"],
    botPermission: ["SEND_MESSAGES"],
    category: "Slash",
    run: async(client, interaction) =>{
        interaction.deferReply()
        await new Promise(resolve => setTimeout(resolve, 1000))

        const { options } = interaction;
        let Reason = options.getString('message');

        let errorEmbed = new Discord.MessageEmbed()
        .setAuthor(`${interaction.user.tag} - Status`, interaction.user.displayAvatarURL({
            dynamic: true , type: 'png'}))
        .setDescription("Show a custom message when pinged")
        .addFields(
            {
                name: 'Usage', value: `/status \`message:\` [ Your custom message ]`,
            },
            {
                name: 'Example', value: `/status \`message:\` Busy right now. Ping another mod.`
            }
        )
        .setFooter("Require `Moderator` permission to use")
        .setColor("#fffafa")
        
        async function fetchData() {
            await Profiles.findOne({
                guildID: interaction.guild.id,
                userID: interaction.user.id
            }).then((res) => {
                if(res){
                    editData(res)
                }else {
                    if(!Reason){
                        return interaction.editReply({
                            embeds: [errorEmbed], ephemeral: true
                        })
                    }
                    saveData('true', Reason)
                }
            }).catch(err => {return console.log(err)});
        }

        function editData(data) {
            if(data.Status.Active == false){
                if(!Reason){
                    return interaction.editReply({
                        embeds: [errorEmbed], ephemeral: true
                    })
                }
                saveData('true', Reason)
            }else if(data.Status.Active == true){
                saveData('false', Reason)
            }else {
                if(!Reason){
                    return interaction.editReply({
                        embeds: [errorEmbed], ephemeral: true
                    })
                }
                saveData('true', Reason)
            }
        }

        async function saveData(option, msg) {
            let act;
            let reason;
            switch (option){
                case 'true':
                    act = true
                    reason = msg

                    let SaveEmbed = new Discord.MessageEmbed()
                    .setAuthor(`${interaction.user.tag}`, interaction.user.displayAvatarURL({
                        dynamic: true , type: 'png'}))
                    .setDescription(`> ${reason}`)
                    .setColor("#fffafa")
                    moment(SaveEmbed.setTimestamp()).format("LL")
                    
                    interaction.editReply({
                        embeds: [SaveEmbed]
                    })
                break;
                case 'false':
                    act = false
                    reason = null

                    let RemoveEmbed = new Discord.MessageEmbed()
                    .setAuthor(`${interaction.user.tag}`, interaction.user.displayAvatarURL({
                        dynamic: true , type: 'png'}))
                    .setDescription('> Status has been removed')
                    .setColor("#fffafa")
                    moment(RemoveEmbed.setTimestamp()).format("LL")
                    
                    interaction.editReply({
                        embeds: [RemoveEmbed]
                    })
                break;
            };

            await Profiles.findOneAndUpdate({
                guildID: interaction.guild.id,
                userID: interaction.user.id
            }, {
                Status: {
                    Active: act,
                    MSG: reason,
                    Time: new Date()
                }
            }, {upsert: true}).catch(err => {return console.log(err)});
        }

        fetchData()
    }
}