const Discord = require('discord.js');
const { commandUsed } = require('../../Functions/CommandUsage');
const { Member } = require('../../Functions');
module.exports = {
    name: 'unban',
    description: "Unbans a banned member",
    permissions: ["BAN_MEMBERS"],
    botPermission: ["BAN_MEMBERS", "SEND_MESSAGES", "EMBED_LINKS"],
    usage: "unban [ member ]",
    category: "Moderation",
    delete: true,
    cooldown: 1000,
    run: async(client, message, args,prefix) =>{
        const { guild, content, channel, author } = message;
        if(!args.length){
            return message.channel.send({embeds: [
                new Discord.MessageEmbed()
                    .setAuthor(message.author.tag, message.author.displayAvatarURL({type: 'png', dynamic: false}))
                    .setDescription(`<:error:921057346891939840> Mention a member \n\nUsage: \`${prefix}unban [ member ]\``)
                    .setColor("WHITE")
            ]}).catch(err => {return console.log(err)})
        }

        function fetchmember(data){
            let Member = data.replace(/<@!/g, '').replace(/>/g, '');
            let guildMember = message.guild.members.resolve(Member)
            if(guildMember){
                return message.channel.send({embeds: [
                    new Discord.MessageEmbed()
                        .setDescription(`${guildMember} is not banned`)
                        .setColor("RED")
                ]}).then(m=>setTimeout(() => m.delete(), 1000 * 30))
                .catch(err => {return console.log(err.stack)})
            }else {
                return UnBan(Member)
            }
        }

        async function UnBan(Member){
            try {
                let banData = await message.guild.bans.resolve(Member)
                if(banData){
                    return message.channel.send({embeds: [new Discord.MessageEmbed()
                        .setDescription(`${Member} is not Banned`)
                        .setColor("RED")
                    ]}).then(m=>setTimeout(() => m.delete(), 1000 * 30))
                    .catch(err => {return console.log(err.stack)})
                }else {
                    message.guild.bans.remove(Member, `Sadbot Unban`).then(res => {
                        return message.channel.send({embeds: [new Discord.MessageEmbed()
                            .setDescription(`${res} was Unbanned from the server`)
                            .setColor( "#45f766" )
                        ]
                        }).then(m=>setTimeout(() => m.delete(), 1000 * 30))
                        .catch(err => {return console.log(err.stack)})
                    })
                }
            }catch(err){
                message.channel.send({embeds: [new Discord.MessageEmbed()
                    .setDescription(err.message)
                    .setColor("RED")
                ]})
                return console.log(err.stack)
            }
        }
        fetchmember(args[0])
    }
}