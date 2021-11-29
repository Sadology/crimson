const Discord = require('discord.js');
const { ModStatus } = require('../../Functions/functions');
const {Member} = require('../../Functions/MemberFunction');
module.exports = {
    name: 'kick',
    description: "Kick out a member from the server.",
    permissions: ["KICK_MEMBERS"],
    usage: "kick [ member ]",
    category: "Moderation",

    run: async(client, message, args,prefix) =>{
        if(message.guild.me.permissions.has(["MANAGE_MESSAGES"])){
            await message.delete();
        }

        if(!message.member.permissions.has("KICK_MEMBERS")){
            return message.author.send('None of your role proccess to use this command')
        }

        const { guild, content, channel, author } = message;
        const ErrorEmbed = {
            color: "#fffafa",
            author: {
                name: `Command - Kick`,
                icon_url: client.user.displayAvatarURL({dynamic: false, format: "png", size: 1024})
            },
            description: `Kick a member from the server 
            \n**Usage:** \`${prefix}kick [ Member ] [ Reason ]\` \n**Example:** \`${prefix}kick @shadow~ sending nsfw content\``,
            footer: {
                text: "Bot require \"Kick_Members\" permission"
            },
            timestamp: new Date()
        }

        if( !args.length ){
            return message.channel.send({embeds: [ErrorEmbed]}).then(m=>setTimeout(() => m.delete(), 1000 * 60))
        };

        if(!args[0]){
            return message.channel.send({embeds: [
                new Discord.MessageEmbed()
                    .setDescription(`Please mention a member. \n\n**Usage:** ${prefix}kick [ user ] [ reason ]`)
            ]}).then(m=>setTimeout(() => m.delete(), 1000 * 20))
        }

        const getMembers = new Member(args[0], message);
        await message.guild.members.fetch();
        const kickReason = message.content.split(/\s+/).slice(2).join(" ") || "No reason Provided"

        function findMember(Member){
            try {
                if(Member){
                    const member = message.guild.members.cache.get(Member);

                    if(member){
                        MemberPermissionCheck(member);
                    } else {
                        return message.channel.send({embeds: [new Discord.MessageEmbed()
                            .setDescription(`Couldn't find the member. Please mention a valid member`)
                            .setColor("RED")
                        ]}).then(m=>setTimeout(() => m.delete(), 1000 * 30))
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
                    ErrorEmbed.setDescription(`Why you want to kicl me ;-;`)
                    return message.channel.send( {embeds: [ErrorEmbed]} ).then(m=>setTimeout(() => m.delete(), 1000 * 20));

                }else if (Member.kickable === false){  
                    ErrorEmbed.setDescription(`Can't kick a Mod/Admin.`)
                    return message.channel.send( {embeds: [ErrorEmbed]} ).then(m=>setTimeout(() => m.delete(), 1000 * 20));

                }else if (Member.permissions.has("BAN_MEMBERS", "KICK_MEMBERS", "MANAGE_CHANNELS", "MANAGE_ROLES", "MANAGE_MESSAGES", "MANAGE_GUILD", "ADMINISTRATOR", { checkAdmin: true, checkOwner: true })){
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
                return console.log(err) 
            }
        }

        async function kickMember(Member){
            try {
                await message.guild.members.kick(Member.id, kickReason + ' | ' + `${Member.user.id}` + ' | ' + `${message.author.tag}`);
                message.channel.send({embeds: [new Discord.MessageEmbed()
                    .setDescription(`${Member} was kicked from the server | ${kickReason}`)
                    .setColor( "#45f766" )
                ]
                }).then(m=>setTimeout(() => m.delete(), 1000 * 30))
                
                ModStatus({type: "Kick", guild: message.guild, member: message.author, content: content})
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