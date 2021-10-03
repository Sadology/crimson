const Discord = require('discord.js');
const { commandUsed } = require('../../Functions/CommandUsage');
const { permission } = require('../../Functions/CommandPerms');
const { GuildRole } = require('../../models');
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

        if(!message.member.permissions.has("MANAGE_MESSAGES")){
            return message.author.send('None of your role proccess to use this command')
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
            return message.channel.send({embeds: [ErrorEmbed]}).then(m=>setTimeout(() => m.delete(), 1000 * 30))
        };

        const Embed = new Discord.MessageEmbed()
            .setAuthor("Commane - Ban", author.displayAvatarURL({dynamic: false, format: "png", size: 1024}))

        if(!args[0]){
            return message.channel.send({embeds: [
                new Discord.MessageEmbed()
                    .setDescription(`Please mention a member. \n\n**Usage:** ${prefix}ban [ user ] [ reason ]`)
            ]}).then(m=>setTimeout(() => m.delete(), 1000 * 20))
        }
        const FindMembers = new Member(args[0], message);
        await message.guild.members.fetch();
        const member = message.guild.members.cache.get(FindMembers.mentionedMember);
        const banReason = message.content.split(/\s+/).slice(2).join(" ");

        if(!member){
            try {
                let hackMember = FindMembers.mentionedMember

                if(isNaN(hackMember)){
                    return message.channel.send({embeds: [
                        new Discord.MessageEmbed()
                        .setDescription(`Please mention a valid user. \n\n**Usage:** ${prefix}ban [ user ] [ reason ]`)
                        .setColor("RED")
                    ]}).then(m=>setTimeout(() => m.delete(), 1000 * 20))
                }

                let banList = await message.guild.bans.fetch();
                let bannedMember = banList.find(u => u.user.id === hackMember);

                if(bannedMember){
                    return message.reply({
                        embeds: [new Discord.MessageEmbed()
                            .setDescription(`<@${hackMember}> is already banned.`)
                            .setColor("RED")
                        ], ephemeral: true
                    })
                }else {
                    await message.guild.members.ban(hackMember, {reason: banReason ? banReason + ' | ' + `${hackMember}` + ' | ' + `${message.author.tag}` : `No reason provided | ${hackMember} | ${message.author.tag}`});
                    commandUsed( guild.id, guild.name, message.author.id, message.author.tag, "Ban", 1, content );

                    return message.channel.send({embeds: [new Discord.MessageEmbed()
                        .setDescription(`<@${hackMember}> is Banned from the server | ${banReason ? banReason : 'No reason provivded'}`)
                        .setColor( "#45f766" )
                    ]
                    }).then(m=>setTimeout(() => m.delete(), 1000 * 20))
                }
            }catch(err){
                console.log(err)
            }
        }else {
            const authorHighestRole1 = message.member.roles.highest.position;
            const mentionHighestRole1 = member.roles.highest.position;
            const clientHighestRole = message.guild.members.resolve( client.user ).roles.highest.position;

            if(member.user.id === message.author.id){
                Embed.setDescription(`You can't ban yourself`)
                Embed.setColor( '#ff303e' )

                return message.channel.send( {embeds: [Embed]} ).then(m=>setTimeout(() => m.delete(), 1000 * 10));
            }else if(member.user.id === client.user.id){
                Embed.setDescription(`I can't ban myself -_-`)
                Embed.setColor( '#ff303e' )

                return message.channel.send( {embeds: [Embed]} ).then(m=>setTimeout(() => m.delete(), 1000 * 10));
            }else if (member.bannable === false){  

                Embed.setDescription(`I can't ban a Mod/Admin 😔`)
                Embed.setColor( '#ff303e' )

                return message.channel.send( {embeds: [Embed]} ).then(m=>setTimeout(() => m.delete(), 1000 * 10));
            }else if (member.permissions.has("BAN_MEMBERS", "KICK_MEMBERS", "MANAGE_CHANNELS", "MANAGE_ROLES", "MANAGE_MESSAGES", "MANAGE_GUILD", "ADMINISTRATOR", { checkAdmin: true, checkOwner: true })){
                
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
                    await message.guild.members.ban(member.id, {reason: banReason ? banReason + ' | ' + `${member.user.id}` + ' | ' + `${message.author.tag}` : `No reason provided | ${member.user.id} | ${message.author.tag}`});
                    commandUsed( guild.id, guild.name, message.author.id, message.author.tag, "Ban", 1, content );

                    return message.channel.send({embeds: [new Discord.MessageEmbed()
                        .setDescription(`${member} is Banned from the server | ${banReason ? banReason : 'No reason provivded'}`)
                        .setColor( "#45f766" )
                    ]
                    }).then(m=>setTimeout(() => m.delete(), 1000 * 10))
                    
                }catch(err){
                    console.log(err)
                }
            }
        }
    }
}