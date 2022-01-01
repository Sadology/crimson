const Discord = require('discord.js');
const { commandUsed } = require('../../Functions/CommandUsage');
const { Member } = require('../../Functions');
module.exports = {
    name: 'ban',
    description: "Bans a member from the server",
    permissions: ["BAN_MEMBERS"],
    botPermission: ["BAN_MEMBERS", "SEND_MESSAGES", "EMBED_LINKS"],
    usage: "ban [ member ]",
    category: "Moderation",
    delete: true,
    cooldown: 1000,
    run: async(client, message, args,prefix) =>{
        const { guild, content, channel, author } = message;

        if(!args.length){
            return message.channel.send({embeds: [
                new Discord.MessageEmbed()
                    .setAuthor(message.author.tag, message.author.displayAvatarURL({type: 'png', dynamic: false}))
                    .setDescription(`<:error:921057346891939840> Mention a member \n\nUsage: \`${prefix}ban [ member ] [ reason ]\``)
                    .setColor("WHITE")
            ]}).catch(err => {return console.log(err)})
        }
        
        function fetchmember(data){
            let Member = data.replace(/<@!/g, '').replace(/>/g, '');
            let guildMember = message.guild.members.resolve(Member)
            if(guildMember){
                return MemberPermissionCheck(guildMember)
            }else {
                return HackBan(Member)
            }
        }

        const banReason = message.content.split(/\s+/).slice(2).join(" ") || "No reason Provided"

        async function HackBan(Member){
            let bannedMember = await message.guild.bans.resolve(Member)
            if(bannedMember){
                return message.channel.send({embeds: [new Discord.MessageEmbed()
                    .setDescription(`<:error:921057346891939840> <@${Member}> is already banned`)
                    .setColor("RED")
                ]}).then(m=>setTimeout(() => m.delete(), 1000 * 30)) 
            }else {
                try {
                    await message.guild.bans.create(Member, {days: 0, reason: `${banReason} | ${Member} | ${message.author.tag}`}).then((res) => {
                        message.channel.send({embeds: [new Discord.MessageEmbed()
                            .setDescription(`${res} was Banned from the server | ${banReason}`)
                            .setColor( "#45f766" )
                        ]}).then(m=>setTimeout(() => m.delete(), 1000 * 30))
                        .catch(err => {return console.log(err.stack)})
                    })
                } catch(err){
                    message.channel.send({embeds: [new Discord.MessageEmbed()
                        .setDescription(err.message)
                        .setColor("RED")
                    ]})
                    return console.log(err.stack)
                }
            }
        }

        function MemberPermissionCheck(Member){
            try {
                const authorHighestRole1 = message.member.roles.highest.position;
                const mentionHighestRole1 = Member.roles.highest.position;
                const clientHighestRole = message.guild.members.resolve( client.user ).roles.highest.position;

                const ErrorEmbed = new Discord.MessageEmbed()
                    .setAuthor(message.author.tag, message.author.displayAvatarURL({dynamic: false, size: 1024, type: 'png'}))
                    .setColor("RED")

                if(Member.user.id === message.author.id){
                    ErrorEmbed.setDescription(`Unfortunately you can't ban yourself.`)
                    return message.channel.send( {embeds: [ErrorEmbed]} ).then(m=>setTimeout(() => m.delete(), 1000 * 20));

                }else if(Member.user.id === client.user.id){
                    ErrorEmbed.setDescription(`Please don't ban me 😔🙏`)
                    return message.channel.send( {embeds: [ErrorEmbed]} ).then(m=>setTimeout(() => m.delete(), 1000 * 20));

                }else if (Member.bannable === false){  
                    ErrorEmbed.setDescription(`Can't ban a Mod/Admin.`)
                    return message.channel.send( {embeds: [ErrorEmbed]} ).then(m=>setTimeout(() => m.delete(), 1000 * 20));

                }else if (Member.permissions.any(["BAN_MEMBERS", "KICK_MEMBERS", "MANAGE_CHANNELS", "MANAGE_ROLES", "MANAGE_MESSAGES", "MANAGE_GUILD", "ADMINISTRATOR"], { checkAdmin: true, checkOwner: true })){
                    ErrorEmbed.setDescription(`Can't ban a Mod/Admin.`)
                    return message.channel.send( {embeds: [ErrorEmbed]} ).then(m=>setTimeout(() => m.delete(), 1000 * 20));

                }else if (mentionHighestRole1 >= authorHighestRole1) {
                    ErrorEmbed.setDescription(`Can't ban member with higher or equal role as you.`)
                    return message.channel.send( {embeds: [ErrorEmbed]} ).then(m=>setTimeout(() => m.delete(), 1000 * 20));

                }else if (mentionHighestRole1 >= clientHighestRole){
                    ErrorEmbed.setDescription(`Can't ban a member higher or equal role as me.`)
                    return message.channel.send( {embeds: [ErrorEmbed]} ).then(m=>setTimeout(() => m.delete(), 1000 * 20));

                }else {
                    BanMember(Member)
                }
            } catch(err){
                message.channel.send({embeds: [new Discord.MessageEmbed()
                    .setDescription(err.message)
                    .setColor("RED")
                ]})
                return console.log(err) 
            }
        }

        async function BanMember(Member){
            try {
                await message.guild.bans.create(Member.id, {days: 0, reason: `${banReason} | ${Member.id} | ${message.author.tag}`}).then((res) => {
                    message.channel.send({embeds: [new Discord.MessageEmbed()
                        .setDescription(`${res} was Banned from the server | ${banReason}`)
                        .setColor( "#45f766" )
                    ]}).then(m=>setTimeout(() => m.delete(), 1000 * 30))
                    .catch(err => {return console.log(err.stack)})
                })
                
            }catch(err){
                message.channel.send({embeds: [new Discord.MessageEmbed()
                    .setDescription(err.message)
                    .setColor("RED")
                ]})
                return console.log(err)
            }
        }

        fetchmember(args[0])
    }
}