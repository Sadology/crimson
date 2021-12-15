const Discord = require('discord.js');
const { Guild } = require('../../models');
module.exports = {
    name: 'prefix',
    description: "Change prefix of the bot or show current prefix",
    permissions: ["MANAGE_GUILD", "ADMINISTRATOR"],
    botPermission: ["SEND_MESSAGES"],
    usage: "prefix [ new prefix ]",
    category: "Administrator",
    cooldown: 3000,
    run: async(client, message, args,prefix) =>{
        const newPrefix = args[0]

        function showPrefix() {
            return message.channel.send({
                embeds: [new Discord.MessageEmbed()
                    .setDescription(`**Prefix: **` + "\`\`\`"+prefix+"\`\`\`")
                    .setColor("WHITE")
                    .setFooter(prefix+`prefix [ new prefix ] - to change prefix`)
                    .setAuthor(`${message.guild.name}`, message.author.avatarURL({dynamic: false, size: 1024, type: 'png'}))
                ]
            })
        }

        async function changePrefix() {
            if(newPrefix.length >= 6){
                return message.channel.send({
                    embeds: [new Discord.MessageEmbed()
                        .setDescription("Prefix can't be longer than 5 characters")
                        .setColor("RED")
                        .setAuthor(`${message.guild.name}`, message.author.avatarURL({dynamic: false, size: 1024, type: 'png'}))
                    ]
                })
            }
            let removeBlanks = newPrefix.trim()

            await Guild.findOneAndUpdate({
                guildID: message.guild.id,
                Active: true
            }, {
                prefix: removeBlanks.substring(0, 5)
            }, {upsert: true})
            .then((res) => {
                message.channel.send({
                    embeds: [new Discord.MessageEmbed()
                        .setDescription(`Prefix Updated\n\n**old Prefix: **` + "\`\`\`"+res.prefix+"\`\`\`\n**new Prefix: **" + "\`\`\`"+removeBlanks+"\`\`\`")
                        .setColor("WHITE")
                        .setAuthor(`${message.guild.name}`, message.author.avatarURL({dynamic: false, size: 1024, type: 'png'}))
                    ]
                })
            })
            .catch(err => {
                return console.log(err)
            })
        }

        if(!newPrefix){
            showPrefix()
        }else {
            changePrefix()
        }
    }
}