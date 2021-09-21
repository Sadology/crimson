const Discord = require('discord.js');
const { commandUsed } = require('../../Functions/CommandUsage');
const { permission } = require('../../Functions/CommandPerms');
const { GuildRole } = require('../../models')
module.exports = {
    name: 'ban',
    description: "Bans a member from the server",
    permissions: ["BAN_MEMBERS"],
    usage: "ban [ member ]",
    category: "Moderation",

    run: async(client, message, args,prefix) =>{
        await message.delete();
        const permData = await GuildRole.findOne({
            guildID: message.guild.id,
            Active: true
        });

        const missingPerm = new Discord.MessageEmbed()
            .setAuthor(author.tag, author.displayAvatarURL({dynamic: false, format: "png", size: 1024}))
            .setDescription("Missing permission to execute this command")
            .setTimestamp()
            .setColor('#ff303e')

        const roleSet = permData.Moderator;
        try {
            if (message.guild.ownerID !== message.author.id){
                if(!message.member.permissions.has(["ADMINISTRATOR"])){
                    if(permData.ModOptions.Enabled === true){
                        if(!message.member.roles.cache.some(r=>roleSet.includes(r.id))){
                            if(!message.member.permissions.has(["MANAGE_GUILD", "ADMINISTRATOR", "BAN_MEMBERS"])){
                                return await message.channel.send({embeds: [missingPerm]}).then(m=>setTimeout(() => m.delete(), 1000 * 10));
                            }
                        }
                    }else if(permData.ModOptions.Enabled === false){
                        if(!message.member.permissions.has(["BAN_MEMBERS", "MANAGE_GUILD", "ADMINISTRATOR"])){
                            return await message.channel.send({embeds: [missingPerm]}).then(m=>setTimeout(() => m.delete(), 1000 * 10));
                        }
                    }
                }
            }
        } catch (err){
            errLog(err.stack.toString(), "text", "Mute", "Error in fetching User Role");
        }
        const { guild, content, channel, author } = message;
        const ErrorEmbed = {
            color: "#fffafa",
            author: {
                name: `Command - BAN`,
                icon_url: client.user.displayAvatarURL({dynamic: false, format: "png", size: 1024})
            },
            description: `Ban a member from server if they are being too naughty 😛.\nBot can ban a member if they are not in server. 
            \n**Usage:** \`${prefix}ban [ Member ] [ Reason ]\` \n**Example:** \`${prefix}ban @shadow~ Spamming too much\``,
            footer: {
                text: "Bot require \"Ban_Members\" permission"
            },
            timestamp: new Date()
        }

        if( !args.length ){
            return message.channel.send({embeds: [ErrorEmbed]}).then(m=>setTimeout(() => m.delete(), 1000 * 10))
        };

        const Embed = new Discord.MessageEmbed()
            .setAuthor("Commane - Ban", author.displayAvatarURL({dynamic: false, format: "png", size: 1024}))

        const regex = /[\d+]/g
        if(!args[0].match( regex )){
            return message.channel.send({embeds: [new Discord.MessageEmbed()
                .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({dynamic: false, size: 1024, type: "png"}))
                .setColor("#fc5947")
                .setDescription(`Please mention a valid Member. If the member isn't in server, provide their user ID`)
            ]
            }).then(m=>setTimeout(() => m.delete(), 1000 * 10))
        }

        let findMember = args[0];
        const memberString = findMember.replace('<@', '').replace('>', '').replace('!', '').trim();

        const banReason = message.content.split(/\s+/).slice(2).join(" ");
        const ServerMember = await guild.members.fetch();
        const memberID = ServerMember.get(memberString);

        if(!memberID){
            const IfMember = await client.users.fetch(memberString);

            if(IfMember){
                const banList = await message.guild.fetchBans();
                const bannedMember = banList.find(u => u.user.id === IfMember)

                if(bannedMember){
                    Embed.setDescription(`${bannedMember.user.tag} is already Banned`)
                    Embed.setColor( '#ff303e' )

                    return message.channel.send( {embeds: [Embed]} ).then(m=>setTimeout(() => m.delete(), 1000 * 10));
                }else {

                    try {
                        await message.guild.members.ban(IfMember.id, {reason: banReason ? banReason + ' | ' + `${IfMember.id}` + ' | ' + `${message.author.tag}` : `No reason provided | ${IfMember.id} | ${message.author.tag}`});
                        commandUsed( guild.id, guild.name, message.author.id, message.author.tag, "Ban", 1, content );
    
                        return message.channel.send({embeds: [new Discord.MessageEmbed()
                            .setDescription(`${IfMember} is Banned from the server | ${banReason ? banReason : 'No reason provivded'}`)
                            .setColor( "#45f766" )
                        ]
                        }).then(m=>setTimeout(() => m.delete(), 1000 * 10))
                        
                    }catch(err){
                        console.log(err)
                    }
                }
            } else {
                Embed.setDescription(`Please mention a valid user. If the member is not in the server, provide user ID`)
                Embed.setColor( '#ff303e' )

                return message.channel.send( {embeds: [Embed]} ).then(m=>setTimeout(() => m.delete(), 1000 * 10));
            }
        } else {
            const Member = await message.guild.members.fetch(memberID)
            
                if(Member){
                    if(message.member.permissions.has("ADMINISTRATOR")){
                        try {
                            await message.guild.members.ban(Member, {reason: banReason ? banReason + ' | ' + `${Member.user.id}` + ' | ' + `${message.author.tag}` : `No reason provided | ${Member.user.id} | ${message.author.tag}`});
                            commandUsed( guild.id, guild.name, message.author.id, message.author.tag, "Ban", 1, content );
    
                            return message.channel.send({embeds: [new Discord.MessageEmbed()
                                .setDescription(`${Member} is Banned from the server | ${banReason ? banReason : 'No reason provivded'}`)
                                .setColor( "#45f766" )
                            ]
                            }).then(m=>setTimeout(() => m.delete(), 1000 * 10))
                            
                        }catch(err){
                            console.log(err)
                        }
                    }
                    const authorHighestRole1 = message.member.roles.highest.position;
                    const mentionHighestRole1 = Member.roles.highest.position;
                    const clientHighestRole = message.guild.members.resolve( client.user ).roles.highest.position;

                    if(Member.user.id === message.author.id){
                        Embed.setDescription(`You can't ban yourself`)
                        Embed.setColor( '#ff303e' )

                        return message.channel.send( {embeds: [Embed]} ).then(m=>setTimeout(() => m.delete(), 1000 * 10));
                    }else if(Member.user.id === client.user.id){
                        Embed.setDescription(`I can't ban myself -_-`)
                        Embed.setColor( '#ff303e' )

                        return message.channel.send( {embeds: [Embed]} ).then(m=>setTimeout(() => m.delete(), 1000 * 10));
                    }else if (Member.bannable === false){  

                        Embed.setDescription(`I can't ban a Mod/Admin 😔`)
                        Embed.setColor( '#ff303e' )

                        return message.channel.send( {embeds: [Embed]} ).then(m=>setTimeout(() => m.delete(), 1000 * 10));
                    }else if (Member.hasPermissiopermissions.has("BAN_MEMBERS", "KICK_MEMBERS", "MANAGE_CHANNELS", "MANAGE_ROLES", "MANAGE_MESSAGES", "MANAGE_GUILD", { checkAdmin: true, checkOwner: true })){
                        
                        Embed.setDescription(`I can't ban a Mod/Admin 😔`)
                        Embed.setColor( '#ff303e' )

                        return message.channel.send( {embeds: [Embed]} ).then(m=>setTimeout(() => m.delete(), 1000 * 10));
                    }else if (mentionHighestRole1 >= authorHighestRole1) {

                        Embed.setDescription(`You can't Ban a member with higher or equal role as your`)
                        Embed.setColor( '#ff303e' )

                        return message.channel.send( {embeds: [Embed]} ).then(m=>setTimeout(() => m.delete(), 1000 * 10));
                    }else if (mentionHighestRole1 >= clientHighestRole){

                        Embed.setDescription(`I can't Ban a member with higher or equal role as me`)
                        Embed.setColor( '#ff303e' )

                        return message.channel.send( {embeds: [Embed]} ).then(m=>setTimeout(() => m.delete(), 1000 * 10));
                    }else {
                        try {

                            await message.guild.members.ban(Member, {reason: banReason ? banReason + ' | ' + `${Member.user.id}` + ' | ' + `${message.author.tag}` : `No reason provided | ${Member.user.id} | ${message.author.tag}`});
                            commandUsed( guild.id, guild.name, message.author.id, message.author.tag, "Ban", 1, content );

                            return message.channel.send({embeds: [new Discord.MessageEmbed()
                                .setDescription(`${Member} is Banned from the server | ${banReason ? banReason : 'No reason provivded'}`)
                                .setColor( "#45f766" )
                            ]
                            }).then(m=>setTimeout(() => m.delete(), 1000 * 10))
                            
                        }catch(err){
                            console.log(err)
                        }
                }
            }else {
                Embed.setDescription(`Please mention a valid user. If the member is not in the server, provide user ID`)
                Embed.setColor( '#ff303e' )

                return message.channel.send( {embeds: [Embed]} ).then(m=>setTimeout(() => m.delete(), 1000 * 10));
            }
        }
    }
}