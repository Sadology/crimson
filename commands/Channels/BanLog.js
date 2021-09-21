const Discord = require('discord.js');
const { GuildChannel } = require('../../models');
const { errLog } = require('../../Functions/erroHandling');
module.exports = {
    name: 'ban-log',
    aliases: ["banlog"],
    category: "Administrator",
    
    run: async(client, message, args,prefix) =>{

        if(!message.member.permissions.has("ADMINISTRATOR")){
            return message.author.send('None of your role proccess to use this command')
        }
        
        const Data = await GuildChannel.findOne({
            guildID: message.guild.id,
            Active: true
        });

        const fetchedData = message.guild.channels.cache.find(c=>c.id === Data.BanLog.BanLogChannel);

        if(!args.length){
            const expectedArgs = new Discord.MessageEmbed()
                .setAuthor(`${message.author.tag} - Ban-log`, client.user.displayAvatarURL({dynamic: false, type: "png", size: 1024}))
                .setDescription(`Ban-Log Channel - ${fetchedData ? fetchedData : 'NONE'}
                    **Usage:** \`${prefix}ban-log [ enable | disable ] [ Channel ]\``)
                .setColor("#fffafa")
                .setFooter("Bans and Unbans will log into Ban-log channel")
                
            return await message.channel.send({embeds:[expectedArgs]}).then(m=>setTimeout(() => m.delete(), 1000 * 10));
        };

        const { content, guild } = message;
        const option = args[0];

        const Tutorial = new Discord.MessageEmbed()
            .setAuthor(`Command - Ban-Log`, client.user.displayAvatarURL({dynamic: false, type: "png", size: 1024}))
            .addField("Usage", `${prefix}ban-log [ enable | disable ] [ channel ] \n${prefix}ban-log enable #admin-log \n${prefix}ban-log disable`)
            .setColor("#fffafa")

        switch(option){
            case "enable":
                async function Database ( value, boolean ){     
                    try {
                        await GuildChannel.findOneAndUpdate({
                            guildID: message.guild.id,
                            Active: true
                        },{
                            guildName: message.guild.name,
                            BanLog: {
                                BanLogChannel: value,
                                BanLogEnabled: boolean
                            }
                        },{
                            upsert: true,
                        })
                    } catch (err) {
                        errLog(err.stack.toString(), "text", "Ban-Log", "Error in Database function")
                    }
                }

                const valueOfChannel = args[1];

                if(!valueOfChannel){
                    Tutorial.setDescription("Please specify a channel. `[ #Ban-log ]`")
                    try {
                        return message.channel.send({embeds: [Tutorial]}).then(m=>setTimeout(() => m.delete(), 1000 * 10));
                    } catch (err){
                        errLog(err.stack.toString(), "text", "Ban-Log", "Error in ValueOfChannel")
                    }
                }
                const logChan = guild.channels.cache.find(c => c.id == valueOfChannel.replace( '<#' , '' ).replace( '>' , '' )) || 
                    guild.channels.cache.find(r => r.name.toLowerCase() == valueOfChannel.toLowerCase()) || 
                    guild.channels.cache.find(c => c.id == valueOfChannel);

                if(!logChan){
                    Tutorial.setDescription(`Couldn't find any channel by this name ${valueOfChannel}.`)
                    try {
                        return message.channel.send({embeds: [Tutorial]}).then(m=>setTimeout(() => m.delete(), 1000 * 10));
                    } catch {
                        errLog(err.stack.toString(), "text", "Ban-Log", "Error in LogChan")
                    }
                }else if(logChan){
                    try {
                        Database(logChan, true)

                        const enabledEmbed = new Discord.MessageEmbed()
                            .setAuthor(`${client.user.username} - Ban-Log`)
                            .setDescription(`Ban-Log channel updated to ${logChan}`)
                            .setColor("#fffafa")
                            .setTimestamp()
                        await message.channel.send({embeds: [enabledEmbed]})
                    } catch (err) {
                        errLog(err.stack.toString(), "text", "Ban-Log", "Error in Enable Value")
                    }
                }
            break;

            case "disable":
                try {
                    Database(null, false)
                    const disabledEmbed = new Discord.MessageEmbed()
                        .setAuthor(`${client.user.username} - Ban Log`)
                        .setDescription(`Ban-Log channel has been disabled`)
                        .setColor("#fffafa")
                        .setTimestamp()
                    await message.channel.send({embeds: [disabledEmbed]})
                } catch (err) {
                    errLog(err.stack.toString(), "text", "Ban-Log", "Error in Disable Value")
                }
            break;

            default: 
                Tutorial.setDescription("Which option you would like to change [ enable | disable ]")
                return message.channel.send({embeds: [Tutorial]}).then(m=>setTimeout(() => m.delete(), 1000 * 10));
        }
    }
}