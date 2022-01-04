const Discord = require('discord.js');
const { Guild } = require('../../models');
const { GuildManager } = require('../../Functions')
module.exports = {
    name: 'toggle',
    description: "Toggle between settings",
    permissions: ["MANAGE_GUILD", "ADMINISTRATOR"],
    botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
    usage: "toggle [ settings ]",
    category: "Administrator",
    cooldown: 3000,
    run: async(client, message, args,prefix) =>{
        if(!args.length || !args[0]){
            return message.channel.send({embeds: [
                new Discord.MessageEmbed()
                    .setDescription("Toggle between different settings")
                    .addField("Options", [
                        `loglimit - Bot will notify if a user reached their log limit`,
                    ].toString().split(',').join(' \n'))
                    .setColor("WHITE")
            ]}).catch(err => {return console.log(err.stack)})
        }

        await Guild.findOne({
            guildID: message.guild.id,
            Settings: {$exists : true},
        })
        .then(res => {
            if(!res){
                return new GuildManager(client, message.guild).guildCreate()
            }

            dataManager(res)
        })
        .catch(err => {return console.log(err.stack)})

        function dataManager(data){
            switch(args[0]){
                case 'loglimit':
                    if(!args[1]){
                        return message.channel.send({embeds: [
                                new Discord.MessageEmbed()
                                    .setDescription(`Please provide the limit. \n\n**Usage:** ${prefix}toggle [ option ] [ limit ]\n**Example:** ${prefix}toggle loglimit 5`)
                                    .setColor("RED")
                        ]}).catch(err => {return console.log(err.stack)})
                    }
                    
                    if(isNaN(args[1])){
                        return message.channel.send({embeds: [
                            new Discord.MessageEmbed()
                                .setDescription(`Please provide the limit. \n\n**Usage:** ${prefix}toggle [ option ] [ limit ]\n**Example:** ${prefix}toggle loglimit 5`)
                                .setColor("RED")
                        ]}).catch(err => {return console.log(err.stack)})
                    }
                    let number = parseInt(args[1])

                    data.Settings.set("loglimit", number)
                    saveData({data: data.Settings}).then(() => {
                        message.channel.send({embeds: [
                            new Discord.MessageEmbed()
                                .setDescription(`Log-limit set to __${number}__`)
                                .setColor("GREEN")
                        ]}).catch(err => {return console.log(err.stack)})
                    })
                break;

                default:
                    return message.channel.send({embeds: [
                        new Discord.MessageEmbed()
                            .setDescription("Toggle between different settings")
                            .addField("Options", [
                                `loglimit - Bot will notify if a user reached their log limit`,
                            ].toString().split(',').join(' \n'))
                            .setColor("WHITE")
                    ]}).catch(err => {return console.log(err.stack)}) 
            }
        }

        async function saveData({data, type}){
            await Guild.updateOne({
                guildID: message.guild.id,
            }, {
                $set: {
                    ['Settings']: data
                }
            }).catch(err => {return console.log(err.stack)})
        }
    }
}