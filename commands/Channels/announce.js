const Discord = require('discord.js');
const { GuildChannel, GuildRole } = require('../../models');
const { errLog } = require('../../Functions/erroHandling')

module.exports = {
    name: 'announce',
    category: "Administrator",
    
    run: async(client, message, args,prefix) =>{

        if(!message.member.permissions.has("ADMINISTRATOR")){
            return message.author.send('None of your role proccess to use this command')
        }
        
        const Data = await GuildChannel.findOne({
            guildID: message.guild.id,
            Active: true
        });
        const fetchedJoined = message.guild.channels.cache.find(c=>c.id === Data.Announce.JOIN);
        const fetchedLeft = message.guild.channels.cache.find(c=>c.id === Data.Announce.LEAVE);

        if(!args.length){
            const expectedArgs = new Discord.MessageEmbed()
                .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({dynamic : false, size: 1024, type: "png"}))
                .setDescription(`Announce Channel \`Joined\` - ${fetchedJoined ? fetchedJoined : 'NONE'} \nAnnounce Channel \`Left\` - ${fetchedLeft ? fetchedLeft : 'NONE'}
                    **Usage:** \`${prefix}announce [ enable | disable ] [ joined | left ] [ Channel ]\``)
                .setColor("#fffafa")
                
            await message.channel.send({embeds: [expectedArgs]}).then(m=>setTimeout(() => m.delete(), 1000 * 10));
        };

        const { content, guild } = message;
        const option = args[0];

        const Tutorial = new Discord.MessageEmbed()
            .setAuthor(`Command - Announce`)
            .addField("Usage", `\`\`\`${prefix}announce [ enable | disable ] [ joined | left ] [ channel ] \n${prefix}announce enable joined #welcome \n${prefix}announce enable left #good-bye \n${prefix}announce disable joined\`\`\``)
            .setColor("#fffafa")

        const Embed = new Discord.MessageEmbed()
            .setAuthor(`Command - Announce`)
            .setColor("#fffafa")
            .setTimestamp()

            async function Database ( options, value, boolean){  
                switch(options){
                    case "joined":
                        try {
                            await GuildChannel.findOneAndUpdate({
                                guildID: message.guild.id,
                                Active: true
                            },{
                                guildName: message.guild.name,
                                "Announce.JOIN": value,
                                "Announce.JoinEnable": boolean
    
                            },{
                                upsert: true,
                            })
                        } catch(err){
                            errLog(err.stack.toString(), "text", "Announce-logs", "Error in Joined Function")
                        }
                    break;

                    case "left":
                        try {
                            await GuildChannel.findOneAndUpdate({
                                guildID: message.guild.id,
                                Active: true
                            },{
                                guildName: message.guild.name,
                                "Announce.LEAVE": value,
                                "Announce.leaveEnabled": boolean
                            },{
                                upsert: true,
                            })
                        } catch (err){
                            errLog(err.stack.toString(), "text", "Announce-logs", "Error in Left Function")
                        }
                    break;
                }   
            }

        const eventOptions = args[1]; // Edit | delete | all options

        switch(option){
            case "enable":
                
                if(!eventOptions){
                    Tutorial.setDescription("Please specify which option you want to change `[ joined | left ]`")
                    try {
                        return message.channel.send({embeds: [Tutorial]}).then(m=>setTimeout(() => m.delete(), 1000 * 10));
                    } catch (err){
                        errLog(err.stack.toString(), "text", "Announce-logs", "Error in EventOption")
                    }
                }else {

                    const valueOfChannel = args[2]; // Log channel

                    if(!valueOfChannel){
                        Tutorial.setDescription("Please mention a channel.")
                        
                        try {
                            return message.channel.send({embeds: [Tutorial]}).then(m=>setTimeout(() => m.delete(), 1000 * 10));
                        } catch (err){
                            errLog(err.stack.toString(), "text", "Announce-logs", "Error in ValueOfChannel")
                        }
                    }else {
                        const logChan = guild.channels.cache.find(c => c.id == valueOfChannel.replace( '<#' , '' ).replace( '>' , '' )) || 
                        guild.channels.cache.find(r => r.name.toLowerCase() == valueOfChannel.toLowerCase()) || 
                        guild.channels.cache.find(c => c.id == valueOfChannel);

                        if(!logChan){
                            Tutorial.setDescription(`Could't find any channel by the name ${valueOfChannel}`)
                            try {
                                return message.channel.send({embeds: [Tutorial]}).then(m=>setTimeout(() => m.delete(), 1000 * 10));
                            } catch (err){
                                errLog(err.stack.toString(), "text", "Announce-logs", "Error in ValueOfChannel")
                            }
                            
                        }else if(logChan){
    
                            switch(eventOptions){
                                
                                case "joined": // EDITED MESSAGES
                                    try {
                                        
                                        Database("joined",logChan.id, true)
        
                                        Embed.setDescription(`Announce Joined updated to ${logChan}`)
                                        await message.channel.send({embeds: [Embed]})

                                    } catch (err){
                                        errLog(err.stack.toString(), "text", "Announce-logs", "Error in Joined Value")
                                    }

                                break;
            
                                case "left": // DELETED MESSAGES
                                    try {
                                            
                                        Database("left",logChan.id, true)
        
                                        Embed.setDescription(`Announce Left updated to ${logChan}`)

                                        await message.channel.send({embeds: [Embed]})

                                    } catch (err){
                                        errLog(err.stack.toString(), "text", "Announce-logs", "Error in Left Value")
                                    }

                                break;
                            }
                        }
                    }
                break;
                }

            case "disable":
                if(!eventOptions.toLowerCase()){
                    Tutorial.setDescription("Please specify which option you want to change `[ edit | delete | default ]`")
                    return message.channel.send({embeds:[Tutorial]}).then(m=>setTimeout(() => m.delete(), 1000 * 10)); 
                }else {
                    switch(eventOptions){
                        case "joined":
                            try {
                                        
                                Database("joined", null , false)
    
                                Embed.setDescription(`Announce joined channel has been disabled`)
                                await message.channel.send({embeds: [Embed]})

                            } catch (err){
                                errLog(err.stack.toString(), "text", "Announce-logs", "Error in Disable Joined Value")
                            }

                        break;
    
                        case "left":
                            try {
                                        
                                Database("left", null , false)
    
                                Embed.setDescription(`Announce Left channel has been disabled`)
                                await message.channel.send({embeds: [Embed]})

                            } catch (err){
                                errLog(err.stack.toString(), "text", "Announce-logs", "Error in Disable Left Value")
                            }
    
                        break;
                    }
                }
            break;

            default:
                try {
                                        
                    Tutorial.setDescription("Which option you would like to change [ enable | disable ]")
                    return message.channel.send({embeds: [Tutorial]}).then(m=>setTimeout(() => m.delete(), 1000 * 10))

                } catch (err){
                    errLog(err.stack.toString(), "text", "Announce-logs", "Error in Default value")
                }
            break;
        }
    }
}