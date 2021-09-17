const Discord = require('discord.js');
const { GuildChannel } = require('../../models');
const { errLog } = require('../../Functions/erroHandling');

module.exports = {
    name: 'roles-log',
    aliases: ["rolelog", "roleslog", "roles-log"],

    run: async(client, message, args,prefix) =>{

        if(!message.member.permissions.has("ADMINISTRATOR")){
            return message.author.send('None of your role proccess to use this command')
        }
        
        const Data = await GuildChannel.findOne({
            guildID: message.guild.id,
            Active: true
        })

        const fetchedData = message.guild.channels.cache.find(c=>c.id === Data.RolesLog.RolesAddChannel);

        if(!args.length){
            const expectedArgs = new Discord.MessageEmbed()
                .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({dynamic: true, size: 1024, type: "png"}))
                .setDescription(`Roles-log Channel - ${fetchedData ? fetchedData : 'NONE'}
                    **Usage:** \`${prefix}roles-log [ enable | disable ] [ Channel ]\``)
                .setColor("#fffafa")
                
            return await message.channel.send({embeds: [expectedArgs]}).then(m=>setTimeout(() => m.delete(), 1000 * 10));
        };
    

        const { content, guild } = message;
        const option = args[0];

        const Tutorial = new Discord.MessageEmbed()
            .setAuthor(`Command - Roles-Log`)
            .addField("Usage", `${prefix}roles-log [ enable | disable ] [ channel ] \n${prefix}roles-log enable #roles \n${prefix}roles-log disable`)
            .setColor("#fffafa")

        switch(option){
            case "enable":
                async function Database ( value, bool){     
                    try {
                        await GuildChannel.findOneAndUpdate({
                            guildID: message.guild.id,
                            Active: true
                        },{
                            guildName: message.guild.name,
                            RolesLog: {
                                RolesAddChannel: value,
                                RolesAddEnabled: bool,
                                RolesRemoveChannel: value,
                                RolesRemoveEnabled: bool
                            }
                        },{
                            upsert: true,
                        })
                    } catch (err) {
                        errLog(err.stack.toString(), "text", "Roles-log", "Error in Database function");
                    };  
                }

                const valueOfChannel = args[1];
                if(!valueOfChannel){
                    Tutorial.setDescription("Please mention a channel.")
                    try {
                        return message.channel.send({embeds: [Tutorial]}).then(m=>setTimeout(() => m.delete(), 1000 * 10));
                    } catch (err){
                        errLog(err.stack.toString(), "text", "Roles-log", "Error in ValueOfChannel");
                    }
                }
                const logChan = guild.channels.cache.find(c => c.id == valueOfChannel.replace( '<#' , '' ).replace( '>' , '' )) || 
                    guild.channels.cache.find(r => r.name.toLowerCase() == valueOfChannel.toLowerCase()) || 
                    guild.channels.cache.find(c => c.id == valueOfChannel);

                if(!logChan){
                    Tutorial.setDescription(`Could't find any channel by the name ${valueOfChannel}`)
                    try {
                        return message.channel.send({embeds: [Tutorial]}).then(m=>setTimeout(() => m.delete(), 1000 * 10));
                    } catch (err) {
                        errLog(err.stack.toString(), "text", "Roles-log", "Error in !logchan");
                    }
                }else if(logChan){
                    try {
                        Database(logChan, true)
    
                        const enabledEmbed = new Discord.MessageEmbed()
                            .setAuthor(`${client.user.username} - Roles Log`)
                            .setDescription(`Roles Log channel updated to ${logChan}`)
                            .setColor("#fffafa")
                            .setTimestamp()
                        await message.channel.send({embeds: [enabledEmbed]})
                    } catch (err){
                        errLog(err.stack.toString(), "text", "Roles-log", "Error in setting up value");
                    }
                }
            break;

            case "disable":
                try {
                    Database(null, false)
                    const disabledEmbed = new Discord.MessageEmbed()
                        .setAuthor(`${client.user.username} - Roles-Log`)
                        .setDescription(`Roles Log channel has been disabled`)
                        .setColor("#fffafa")
                        .setTimestamp()
                    await message.channel.send({embeds: [disabledEmbed]})
                }catch(err){
                    errLog(err.stack.toString(), "text", "Roles-log", "Error in diable value");
                }
            break;

            default: 
                Tutorial.setDescription("Which option you would like to change [ enable | disable ]")
                try {
                    return message.channel.send({embeds: [Tutorial]}).then(m=>setTimeout(() => m.delete(), 1000 * 10))
                } catch (err) {
                    errLog(err.stack.toString(), "text", "Roles-log", "Error in default value");
                }
        }
    }
}