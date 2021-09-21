const Discord = require('discord.js');
const { GuildChannel, GuildRole } = require('../../models');
const { errLog } = require('../../Functions/erroHandling');
module.exports = {
    name: 'message-log',
    aliases: ["messagelog"],
    category: "Administrator",
    
    run: async(client, message, args,prefix) =>{

        if(!message.member.permissions.has("ADMINISTRATOR")){
            return message.author.send('None of your role proccess to use this command')
        }
        
        const Data = await GuildChannel.findOne({
            guildID: message.guild.id,
            Active: true
        });

        const fetchedEdit = message.guild.channels.cache.find(c=>c.id === Data.MessageLog.MessageDelete);
        const fetchedDelete = message.guild.channels.cache.find(c=>c.id === Data.MessageLog.MessageEdit);

        if(!args.length){
            const expectedArgs = new Discord.MessageEmbed()
                .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({dynamic: true, size: 1024, type: "png"}))
                .setDescription(`Server Message-edit Channel - ${fetchedEdit ? fetchedEdit : 'NONE'} \nServer Message-delete Channel - ${fetchedDelete ? fetchedDelete : 'NONE'}
                    **Usage:** \`${prefix}message-log [ enable | disable ] [ edit | delete | default ] [ Channel ]\``)
                .setColor("#fffafa")
                
            await message.channel.send({embeds: [expectedArgs]}).then(m=>setTimeout(() => m.delete(), 1000 * 10));
        };

        const { content, guild } = message;
        const option = content.split(" ")[1];

        const Tutorial = new Discord.MessageEmbed()
            .setAuthor(`Command - Message Log`)
            .addField("Usage", `${prefix}message-log [ enable | disable ] [ edit | delete | default ] [ channel ] \n${prefix}message-log enable edit #mod-logs \n${prefix}message-log enable default #mod-logs \n${prefix}message-log disable delete`)
            .setColor("#fffafa")

        const Embed = new Discord.MessageEmbed()
            .setAuthor(`Command - Message Log`)
            .setColor("#fffafa")
            .setTimestamp()

            async function Database ( options, value, boolean){  
                switch(options){
                    case "edit":
                        try {
                            await GuildChannel.findOneAndUpdate({
                                guildID: message.guild.id,
                                Active: true
                            },{
                                guildName: message.guild.name,
                                "MessageLog.MessageEdit": value,
                                "MessageLog.EditEnabled": boolean
    
                            },{
                                upsert: true,
                            })
                        } catch (err) {
                            errLog(err.stack.toString(), "text", "Message-Logs", "Error in Fetching data");
                        }
                        
                    break;

                    case "delete":
                        try {
                            await GuildChannel.findOneAndUpdate({
                                guildID: message.guild.id,
                                Active: true
                            },{
                                guildName: message.guild.name,
                                "MessageLog.MessageDelete": value,
                                "MessageLog.DeleteEnabled": boolean
                            },{
                                upsert: true,
                            })
                        } catch (err) {
                            errLog(err.stack.toString(), "text", "Message-Logs", "Error in delete function");
                        }
                    break;

                    case "default":
                        try {
                            await GuildChannel.findOneAndUpdate({
                                guildID: message.guild.id,
                                Active: true
                            },{
                                guildName: message.guild.name,
                                MessageLog: {
                                    MessageDelete: value,
                                    DeleteEnabled: boolean,
                                    MessageEdit: value,
                                    EditEnabled: boolean,
                                }
                            },{
                                upsert: true,
                            })
                        } catch (err) {
                            errLog(err.stack.toString(), "text", "Message-Logs", "Error in Default function");
                        }
                    break;
                }   
            }

        const eventOptions = args[1]; // Edit | delete | all options

        switch(option){
            case "enable":
                
                if(!eventOptions){
                    Tutorial.setDescription("Please specify which option you want to change `[ edit | delete | default ]`")
                    try {
                        return message.channel.send({embeds: [Tutorial]}).then(m=>setTimeout(() => m.delete(), 1000 * 10));
                    } catch (err) {
                        errLog(err.stack.toString(), "text", "Message-Logs", "Error in Event option");
                    }
                }else {

                    const valueOfChannel = args[2]; // Log channel

                    if(!valueOfChannel){
                        Tutorial.setDescription("Please mention a channel.")
                        try {
                            return message.channel.send({embeds: [Tutorial]}).then(m=>setTimeout(() => m.delete(), 1000 * 10));
                        } catch (err) {
                            errLog(err.stack.toString(), "text", "Message-Logs", "Error in valueOfChannel");
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
                                errLog(err.stack.toString(), "text", "Message-Logs", "Error in !LogChan");
                            }
                        }else if(logChan){
    
                            switch(eventOptions){
                                
                                case "edit": // EDITED MESSAGES
                                    try {
                                        Database("edit",logChan.id, true)
    
                                        Embed.setDescription(`Message edit log updated to ${logChan}`)
                                        await message.channel.send({embeds: [Embed]})
                                    }catch (err){
                                        errLog(err.stack.toString(), "text", "Message-Logs", "Error in Edit value");
                                    }
                                break;
            
                                case "delete": // DELETED MESSAGES
                                    try {
                                        Database("delete",logChan.id, true)
        
                                        Embed.setDescription(`Message delete log updated to ${logChan}`)

                                        await message.channel.send({embeds: [Embed]})
                                    }catch (err){
                                        errLog(err.stack.toString(), "text", "Message-Logs", "Error in Delete value");
                                    }
                                break;
            
                                case "default": // EVERY MESSAGE LOG
                                    try {
                                        Database("default",logChan.id, true)
                        
                                        Embed.setDescription(`Message edit & Message delete log updated to ${logChan}`)
                                        await message.channel.send({embeds: [Embed]})
                                    }catch (err){
                                        errLog(err.stack.toString(), "text", "Message-Logs", "Error in Default value");
                                    }
                                break;
                                
                                default:
                                    Tutorial.setDescription("Which option you would like to enable? [ edit | delete | default (both edit & delete) ]")
                                        return message.channel.send({embeds: [Tutorial]}).then(m=>setTimeout(() => m.delete(), 1000 * 10));
                                break;

                            }
                        }
                    }
                break;
                }

            case "disable":
                if(!eventOptions){
                    Tutorial.setDescription("Please specify which option you want to change `[ edit | delete | default ]`")
                    return message.channel.send(Tutorial).then(m=>setTimeout(() => m.delete(), 1000 * 10)); 
                }else {
                    switch(eventOptions){
                        case "edit":
                            try {
                                Database("edit", null , false)
    
                                Embed.setDescription(`Message edit channel has been disabled`)
                                await message.channel.send({embeds: [Embed]});
                            }catch (err){
                                errLog(err.stack.toString(), "text", "Message-Logs", "Error in edit value - Disable");
                            }
                        break;
    
                        case "delete":
                            try {
                                Database("delete", null , false)
    
                                Embed.setDescription(`Message delete channel has been disabled`)
                                await message.channel.send({embeds: [Embed]})
                            }catch (err){
                                errLog(err.stack.toString(), "text", "Message-Logs", "Error in delete value - Disable");
                            }
                        break;
    
                        case "default":
                            try {
                                Database("default", null , false)
    
                                Embed.setDescription(`Message edit & message delete channel has been disabled`)
                                await message.channel.send({embeds: [Embed]})
                            }catch (err){
                                errLog(err.stack.toString(), "text", "Message-Logs", "Error in default value - Disable");
                            }
                        break;

                        default: 
                            Tutorial.setDescription("Which option you would like to disable? [ edit | delete | default (both edit & delete) ]")
                            try {
                                return message.channel.send({embeds: [Tutorial]}).then(m=>setTimeout(() => m.delete(), 1000 * 10))
                            }catch (err){
                                errLog(err.stack.toString(), "text", "Message-Logs", "Error in default option - Disable");
                            }
                    }
                }
            break;

            default: 
                Tutorial.setDescription("Which option you would like to change [ enable | disable ]")
                try {
                    return message.channel.send({embeds: [Tutorial]}).then(m=>setTimeout(() => m.delete(), 1000 * 10))
                }catch (err){
                    errLog(err.stack.toString(), "text", "Message-Logs", "Error in default option");
                }
        }
    }
}