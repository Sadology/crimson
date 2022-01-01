const Discord = require('discord.js');
const { ModStatus } = require('../../Functions/functions');
const { Member } = require('../../Functions');
module.exports = {
    name: 'kick',
    description: "Kick out a member from the server.",
    permissions: ["KICK_MEMBERS"],
    botPermission: ["KICK_MEMBERS", "SEND_MESSAGES", "EMBED_LINKS"],
    usage: "kick [ member ]",
    category: "Moderation",
    delete: true,
    cooldown: 1000,
    run: async(client, message, args,prefix) =>{
        const { guild, content, channel, author } = message;

        if(!args.length){
            return message.channel.send({embeds: [
                new Discord.MessageEmbed()
                    .setAuthor(message.author.tag, message.author.displayAvatarURL({type: 'png', dynamic: false}))
                    .setDescription(`<:error:921057346891939840> Mention a member \n\nUsage: \`${prefix}kick [ member ] [ reason ]\``)
                    .setColor("WHITE")
            ]}).catch(err => {return console.log(err)})
        }
        const kickReason = message.content.split(/s+/g).slice(2).join(' ') || "No reason provided"
        const member = new Member(message, client).getMember({member: args[0]})
        if(member == false ) return
        MemberPermissionCheck(member)

        function MemberPermissionCheck(Member){
            try {
                const authorHighestRole1 = message.member.roles.highest.position;
                const mentionHighestRole1 = Member.roles.highest.position;
                const clientHighestRole = message.guild.members.resolve( client.user ).roles.highest.position;

                const ErrorEmbed = new Discord.MessageEmbed()
                    .setAuthor(message.author.tag, message.author.displayAvatarURL({dynamic: false, size: 1024, type: 'png'}))
                    .setColor("RED")

                if(Member.user.id === message.author.id){
                    ErrorEmbed.setDescription(`Unfortunately you can't kick yourself.`)
                    return message.channel.send( {embeds: [ErrorEmbed]} ).then(m=>setTimeout(() => m.delete(), 1000 * 20));

                }else if(Member.user.id === client.user.id){
                    ErrorEmbed.setDescription(`Why you want to kick me ;-;`)
                    return message.channel.send( {embeds: [ErrorEmbed]} ).then(m=>setTimeout(() => m.delete(), 1000 * 20));

                }else if (Member.kickable === false){  
                    ErrorEmbed.setDescription(`Can't kick a Mod/Admin.`)
                    return message.channel.send( {embeds: [ErrorEmbed]} ).then(m=>setTimeout(() => m.delete(), 1000 * 20));

                }else if (Member.permissions.any(["BAN_MEMBERS", "KICK_MEMBERS", "MANAGE_CHANNELS", "MANAGE_ROLES", "MANAGE_MESSAGES", "MANAGE_GUILD", "ADMINISTRATOR"], { checkAdmin: true, checkOwner: true })){
                    ErrorEmbed.setDescription(`Can't kick a Mod/Admin.`)
                    return message.channel.send( {embeds: [ErrorEmbed]} ).then(m=>setTimeout(() => m.delete(), 1000 * 20));

                }else if (mentionHighestRole1 >= authorHighestRole1) {
                    ErrorEmbed.setDescription(`Can't kick member with higher or equal role as you ${message.author}.`)
                    return message.channel.send( {embeds: [ErrorEmbed]} ).then(m=>setTimeout(() => m.delete(), 1000 * 20));

                }else if (mentionHighestRole1 >= clientHighestRole){
                    ErrorEmbed.setDescription(`Can't kick a member higher or equal role as me.`)
                    return message.channel.send( {embeds: [ErrorEmbed]} ).then(m=>setTimeout(() => m.delete(), 1000 * 20));

                }else {
                    kickMember(Member)
                }
            } catch(err){
                message.channel.send({embeds: [new Discord.MessageEmbed()
                    .setDescription(err.message)
                    .setColor("RED")
                ]})
                return console.log(err.stack) 
            }
        }

        async function kickMember(Member){
            try {
                await message.guild.members.kick(Member.id, `${kickReason} | ${Member.user.id} | ${message.author.tag}`).then(() => {
                    message.channel.send({embeds: [new Discord.MessageEmbed()
                        .setDescription(`${Member} was kicked from the server | ${kickReason}`)
                        .setColor( "#45f766" )
                    ]
                    }).then(m=>setTimeout(() => m.delete(), 1000 * 30))
                    .catch(err => {return console.log(err)})
                })
                ModStatus({type: "Kick", guild: message.guild, member: message.author, content: content})
            }catch(err){
                message.channel.send({embeds: [new Discord.MessageEmbed()
                    .setDescription(err.message)
                    .setColor("RED")
                ]})
                return console.log(err)
            }
        }
    }
}