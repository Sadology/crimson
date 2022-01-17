const { SlashCommandBuilder } = require('@discordjs/builders');
const wait = require('util').promisify(setTimeout);
const Discord = require('discord.js');
const { Guild } = require('../../models');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('settings')
        .setDescription('Servers settings'),
    permissions: ["ADMINISTRATOR", "MANAGE_GUILD"],
    botPermission: ["SEND_MESSAGES"],
    category: "Slash",
    run: async(client, interaction) =>{
        const { options } = interaction;
        
        async function fetchData() {
            await Guild.findOne({
                guildID: interaction.guild.id,
            })
            .then(res => {
                if(!res) return interaction.reply({embeds: [
                    new Discord.MessageEmbed()
                        .setDescription(`No settings were found`)
                        .setColor("RED")
                    ]})

                let data = {
                    Prefix: res.prefix,
                    Roles: res.Roles,
                    Logchannels: res.Logchannels,
                    manager: [],
                    moderators: [],
                    Channels: []
                }

                for(let [key, val] of data.Roles){
                    for(let i=0; i < val.length; i++){
                        if(key == 'manager'){
                            let r = interaction.guild.roles.resolve(val[i])
                            if(r){
                                data.manager.push(r.toString())
                            }
                        }else if(key == 'moderator'){
                            let r = interaction.guild.roles.resolve(val[i])
                            if(r){
                                data.moderators.push(r.toString())
                            }
                        }
                    }
                }
                for(let [key, val] of data.Logchannels){
                    let c = interaction.guild.channels.resolve(val)
                    if(c){
                        data.Channels.push(`**${key}:** ${c.toString()}`)
                    }
                }
                return interaction.reply({embeds: [
                    new Discord.MessageEmbed()
                    .setAuthor({
                        name: `${interaction.guild.name} - Settings`,
                        iconURL: interaction.guild.iconURL({format: 'png'})
                    })
                    .setDescription(`
                    **Prefix:** ${data.Prefix}

                    __Moderation-Roles__
                    **Bot-manager:** ${data.manager}
                    **Moderators:** ${data.moderators}

                    __Log-Channels__
                    ${data.Channels.join("\n ")}
                    `)
                    .setColor("WHITE")
                ]})
            })
            .catch(err => {
                return console.log(err)
            }) 
        }
        fetchData()
    }
}