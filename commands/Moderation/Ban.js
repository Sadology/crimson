const Discord = require('discord.js');
const { commandUsed } = require('../../Functions/CommandUsage');
const {Member} = require('../../Functions/MemberFunction');
module.exports = {
    name: 'ban',
    description: "Bans a member from the server",
    permissions: ["BAN_MEMBERS"],
    usage: "ban [ member ]",
    category: "Moderation",

    run: async(client, message, args,prefix) =>{
        if(message.guild.me.permissions.has(["MANAGE_MESSAGES"])){
            await message.delete();
        }

        if(!message.member.permissions.has("BAN_MEMBERS")){
            return message.author.send('None of your role proccess to use this command')
        }

        const { guild, content, channel, author } = message;
        const ErrorEmbed = {
            color: "#fffafa",
            author: {
                name: `Command - BAN`,
                icon_url: client.user.displayAvatarURL({dynamic: false, format: "png", size: 1024})
            },
            description: `Ban a member from server.\nBot can ban a member if they are not in server. 
            \n**Usage:** \`${prefix}ban [ Member ] [ Reason ]\` \n**Example:** \`${prefix}ban @shadow~ Spamming too much\``,
            footer: {
                text: "Bot require \"Ban_Members\" permission"
            },
            timestamp: new Date()
        }

        if( !args.length ){
            return message.channel.send({embeds: [ErrorEmbed]}).then(m=>setTimeout(() => m.delete(), 1000 * 60))
        };

        if(!args[0]){
            return message.channel.send({embeds: [
                new Discord.MessageEmbed()
                    .setDescription(`Please mention a member. \n\n**Usage:** ${prefix}ban [ user ] [ reason ]`)
            ]}).then(m=>setTimeout(() => m.delete(), 1000 * 20))
        }

        const getMembers = new Member(args[0], message);
        await message.guild.members.fetch();
        const banReason = message.content.split(/\s+/).slice(2).join(" ") || "No reason Provided"

        function findMember(Member){
            try {
                if(Member){
                    const member = message.guild.members.cache.get(Member);

                    if(member){
                        MemberPermissionCheck(member);
                    } else {
                        HackBan(Member);
                    }
                }else {
                    return message.channel.send({embeds: [new Discord.MessageEmbed()
                        .setDescription(`Please mention a valid member.`)
                        .setColor("RED")
                    ]}).then(m=>setTimeout(() => m.delete(), 1000 * 30))
                }
            }catch(err){
                message.channel.send({embeds: [new Discord.MessageEmbed()
                    .setDescription(err.message)
                    .setColor("RED")
                ]})
                return console.log(err);
            }

        }

        async function HackBan(Member){
            let banList = await message.guild.bans.fetch();
            let bannedMember = banList.find(u => u.user.id === Member);

            if(bannedMember){
                return message.channel.send({embeds: [new Discord.MessageEmbed()
                    .setDescription(`<@${Member}> is already banned.`)
                    .setColor("RED")
                ]}).then(m=>setTimeout(() => m.delete(), 1000 * 30))
            }else {
                try {
                    await message.guild.members.ban(Member, {reason: banReason + ' | ' + `${Member}` + ' | ' + `${message.author.tag}`});
                    commandUsed( guild.id, guild.name, message.author.id, message.author.tag, "Ban", 1, content );

                    return message.channel.send({embeds: [new Discord.MessageEmbed()
                        .setDescription(`<@${Member}> is Banned from the server | ${banReason}`)
                        .setColor( "#45f766" )
                    ]
                    }).then(m=>setTimeout(() => m.delete(), 1000 * 20))
                } catch(err){
                    message.channel.send({embeds: [new Discord.MessageEmbed()
                        .setDescription(err.message)
                        .setColor("RED")
                    ]})

                    return console.log(err)
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

                }else if (Member.permissions.has("BAN_MEMBERS", "KICK_MEMBERS", "MANAGE_CHANNELS", "MANAGE_ROLES", "MANAGE_MESSAGES", "MANAGE_GUILD", "ADMINISTRATOR", { checkAdmin: true, checkOwner: true })){
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
                await message.guild.members.ban(Member.id, {reason: banReason + ' | ' + `${Member.user.id}` + ' | ' + `${message.author.tag}`});
                return message.channel.send({embeds: [new Discord.MessageEmbed()
                    .setDescription(`${Member} is Banned from the server | ${banReason}`)
                    .setColor( "#45f766" )
                ]
                }).then(m=>setTimeout(() => m.delete(), 1000 * 30))
                
            }catch(err){
                message.channel.send({embeds: [new Discord.MessageEmbed()
                    .setDescription(err.message)
                    .setColor("RED")
                ]})
                return console.log(err)
            }
        }

        findMember(getMembers.mentionedMember)
    }
}