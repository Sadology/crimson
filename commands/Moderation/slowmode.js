const Discord = require('discord.js');
const ms = require('ms');
const { LogsDatabase, GuildChannel, GuildRole } = require('../../models');
const { commandUsed } = require('../../Functions/CommandUsage');
const { errLog } = require('../../Functions/erroHandling');

module.exports = {
    name: 'slowmode',
    aliases: ["sm", "slomo"],
    description: "Sets a slowmode in the channel.",
    permissions: ["MANAGE_CHANNELS"],
    usage: "sm [ limit ]",
    category: "Moderation",

    run: async(client, message, args, prefix) =>{
        if(message.guild.me.permissions.has(["MANAGE_MESSAGES"])){
            await message.delete();
        }

        const permData = await GuildRole.findOne({
            guildID: message.guild.id,
            Active: true
        });

        const { author, content, guild } = message;

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
        
        const TutEmbed = new Discord.MessageEmbed()
        .setAuthor( "Command - Slowmode", author.displayAvatarURL({dynamic: false, format: "png", size: 1024}) )

        try {
            if( !args.length ){
                TutEmbed.setDescription( `Sets slowmode on the channel \n**Usage**: ${prefix}slowmode [ Channel ] [ duration ] \n**Example:** \n${prefix}slowmode 100 #chat` )
                TutEmbed.setFooter( "Bot require \"MANAGE_ROLES\" permission to add \"Muted\" role" )
                TutEmbed.setColor( "#fffafa" )
                return message.channel.send( {embeds: [TutEmbed]} ).then(m=>setTimeout(() => m.delete(), 1000 * 10));
            }
        } catch (err) {
            errLog(err.stack.toString(), "text", "Mute", "Error in sending expected args");
        }
        
        const channel = await message.guild.channels.cache.get(args[1] ? args[1].replace("<#", "").replace(">", "") : message.channel) || message.channel;

        const duration = args[0]
                        
        if( !duration ){
            TutEmbed.setDescription( `Sets a cooldown in the channel \n**Usage**: ${prefix}slowmode [ Channel ] [ duration \`In second\` ] \n**Example:** \n${prefix}slowmode 20` )
            TutEmbed.setFooter( "Bot require \"MANAGE_CHANNEL\" permission to set slowmode" )
            TutEmbed.setColor( "#fffafa" )
            return message.channel.send( {embeds: [TutEmbed]} ).then(m=>setTimeout(() => m.delete(), 1000 * 10));
        }

        const timeex = /[\d*]/g;

        if(!duration.match(timeex)){
            TutEmbed.setDescription( `Please define slowmode duration
            \n**Usage**: \`${prefix}slowmode [ Channel ] [ duration \`In second\`]\`` )
            TutEmbed.setColor( "#fffafa" )
            return message.channel.send( {embeds: [TutEmbed]} ).then(m=>setTimeout(() => m.delete(), 1000 * 10));
        }

        channel.setRateLimitPerUser(duration, "Sadbot Slowmode")
    }
}