const Discord = require('discord.js');
const { Guild } = require('../../models');
module.exports = {
    name: 'prefix',
    description: "Change prefix of the bot or show current prefix",
    permissions: ["MANAGE_GUILDS"],
    usage: "prefix [ new prefix ]",
    category: "Administrator",
    run: async(client, message, args,prefix) =>{
        const newPrefix = args[0]

        function showPrefix(params) {
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
            let removeBlanks = newPrefix.trim()

            await Guild.findOneAndUpdate({
                guildID: message.guild.id,
                Active: true
            }, {
                prefix: removeBlanks
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