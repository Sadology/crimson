const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const { Guild } = require('../../models');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('disable')
        .setDescription('Disable a command/module in the server.')
        .addStringOption(option =>
            option.setName("name")
            .setRequired(true)
            .setDescription("Module/Command name")),
    permissions: ["ADMINISTRATOR", "MANAGE_GUILD"],
    botPermission: ["SEND_MESSAGES"],
    category: "Slash",
    run: async(client, interaction) =>{
        interaction.deferReply()
        await new Promise(resolve => setTimeout(resolve, 1000))

        const { options } = interaction;

        let cmdOpt = options.getString('name');
        cmdOpt.split(/s+/g).slice().join('')
        cmdOpt.toLowerCase()
        
        await Guild.findOne({
            guildID: interaction.guild.id
        }).then(res => {
            if(res){
                let categ = res.Modules.get(cmdOpt)
                if(categ){
                    saveData("category", categ)
                }else{
                    let names = res.Commands.get(cmdOpt)
                    if(names){
                        saveData('cmd', names)
                    }else {
                        return interaction.editReply({
                            embeds: [new Discord.MessageEmbed()
                                .setDescription("Couldn't find any Command/Modules")
                                .setColor("RED")
                        ]})
                    }
                }
            }
        }).catch(err => {return console.log(err.stack)})

        async function saveData(type, data){
            switch(type){
                case "category":
                    await Guild.findOneAndUpdate({
                        guildID: interaction.guild.id,
                    }, {
                        [`Modules.${cmdOpt}.Enabled`]: false
                    }).then((res) => {
                        return interaction.editReply({
                            embeds: [new Discord.MessageEmbed()
                                .setDescription(`Module **${cmdOpt}** has been __disabled__`)
                                .setColor("GREEN")   
                            ]
                        }).catch(err => {return console.log(err.stack)})
                    }).catch(err => {return console.log(err.stack)})
                break;

                case 'cmd':
                    await Guild.findOneAndUpdate({
                        guildID: interaction.guild.id,
                    }, {
                        [`Commands.${cmdOpt}.Enabled`]: false
                    }).then((res) => {
                        return interaction.editReply({
                            embeds: [new Discord.MessageEmbed()
                                .setDescription(`Command **${cmdOpt}** has been __disabled__`)
                                .setColor("GREEN")   
                            ]
                        }).catch(err => {return console.log(err.stack)})
                    }).catch(err => {return console.log(err.stack)})
                break;
            }
        }
    }
}