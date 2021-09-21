const Discord = require('discord.js');
const { GuildChannel } = require('../../models');
const { errLog } = require('../../Functions/erroHandling');
module.exports = {
    name: 'action-log',
    aliases: ["actionlog"],
    category: "Administrator",
    
    run: async(client, message, args,prefix) =>{
        
        if(!message.member.permissions.has("ADMINISTRATOR")){
            return message.author.send('None of your role proccess to use this command')
        }

        const Data = await GuildChannel.findOne({
            guildID: message.guild.id,
            Active: true
        })

        const fetchedData = message.guild.channels.cache.find(c=>c.id === Data.ActionLog.MuteChannel)

        if(!args.length){
            const expectedArgs = new Discord.MessageEmbed()
                .setAuthor(`${message.author.tag} - Action-log`, client.user.displayAvatarURL({dynamic: false, type: "png", size: 1024}))
                .setDescription(`Action-Log Channel - ${fetchedData ? fetchedData : 'NONE'}
                    **Usage:** \`${prefix}action-log [ enable | disable ] [ Channel ]\``)
                .setColor("#fffafa")
                .setFooter("Mute & Unmute will log into action-log channel")
                    
            return await message.channel.send({embeds: [expectedArgs]}).then((m) => setTimeout(() => m.delete(), 1000 * 10));
        };



        const { content, guild } = message;
        const option = args[0];

        const Tutorial = new Discord.MessageEmbed()
            .setAuthor(`Command - Action-Log`, client.user.displayAvatarURL({dynamic: false, type: "png", size: 1024}))
            .addField("Usage", `${prefix}action-log [ enable | disable ] [ channel ] \n${prefix}action-log enable #moderation-log \n${prefix}action-log disable`)
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
                            ActionLog: {
                                MuteChannel: value,
                                MuteEnabled: boolean,
                                UnMuteChannel: value,
                                UnMuteEnanled: boolean
                            }
                        },{
                            upsert: true,
                        })
                    } catch (err) {
                        errLog(err.stack.toString(), "text", "Action-log-Channel", "Error in Database Function")
                    }
                }

                const valueOfChannel = args[1];

                if(!valueOfChannel){
                    Tutorial.setDescription("Please specify a channel. `[ #action-log ]`")
                    try {
                        return message.channel.send({embeds: [Tutorial]}).then((m) => setTimeout(() => m.delete(), 1000 * 10));
                    } catch (err){
                        errLog(err.stack.toString(), "text", "Action-log-Channel", "Error in ValueOfChannel")
                    }
                }
                const logChan = guild.channels.cache.find(c => c.id == valueOfChannel.replace( '<#' , '' ).replace( '>' , '' )) || 
                    guild.channels.cache.find(r => r.name.toLowerCase() == valueOfChannel.toLowerCase()) || 
                    guild.channels.cache.find(c => c.id == valueOfChannel);

                if(!logChan){
                    Tutorial.setDescription(`Couldn't find any channel by this name ${valueOfChannel}.`)
                    try {
                        return message.channel.send({embeds: [Tutorial]}).then((m) => setTimeout(() => m.delete(), 1000 * 10));
                    } catch (err){
                        errLog(err.stack.toString(), "text", "Action-log-Channel", "Error in !LogChan")
                    }
                }else if(logChan){
                    try {
                        Database(logChan, true)

                        const enabledEmbed = new Discord.MessageEmbed()
                            .setAuthor(`${client.user.username} - Action-Log`)
                            .setDescription(`Action-Log channel updated to ${logChan}`)
                            .setColor("#fffafa")
                            .setTimestamp()
                        await message.channel.send({embeds: [enabledEmbed]})

                    } catch (err){
                        errLog(err.stack.toString(), "text", "Action-log-Channel", "Error in LogChan")
                    }
                    
                }
            break;

            case "disable":

                try {
                    Database(null, false)

                    const disabledEmbed = new Discord.MessageEmbed()
                        .setAuthor(`${client.user.username} - Action-Log`)
                        .setDescription(`Action-Log channel has been disabled`)
                        .setColor("#fffafa")
                        .setTimestamp()
                    await message.channel.send({embeds: [disabledEmbed]})

                } catch (err){
                    errLog(err.stack.toString(), "text", "Action-log-Channel", "Error in Disable")
                }
            break;

            default: 
                Tutorial.setDescription("Which option you would like to change [ enable | disable ]")
                return message.channel.send({embeds: [Tutorial]}).then((m) => setTimeout(() => m.delete(), 1000 * 10))
        }
    }
}