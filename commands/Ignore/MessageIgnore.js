const Discord = require('discord.js');
const { GuildChannel } = require('../../models')
const { errLog } = require('../../Functions/erroHandling')
module.exports = {
    name: 'message-ignore',
    aliases: ["messageignore"],

    run: async(client, message, args,prefix) =>{
        
        if(!message.member.permissions.has("ADMINISTRATOR")){
            return message.author.send('None of your role proccess to use this command')
        }

        const Data = await GuildChannel.findOne({
            guildID: message.guild.id,
            Active: true
        })

        ignoreRoleArr = new Array()
        if(Data){
            for (const role of Data.MessageLog.IgnoreRoles){
                let fetchedRoles = message.guild.roles.cache.find(r=>r.id == role)
                
                await ignoreRoleArr.push(fetchedRoles.toString());
            }
        }
        ignoreChanArr = new Array()
        if(Data){
            for (const chan of Data.MessageLog.IgnoreChannels){
                let fetchedChans = message.guild.channels.cache.find(r=>r.id == chan)
                
                await ignoreChanArr.push(fetchedChans.toString());
            }
        }

        if(!args.length){
            const expectedArgs = new Discord.MessageEmbed()
                .setAuthor(`${message.author.tag} - Message-Ignore`, client.user.displayAvatarURL({dynamic: false, type: "png", size: 1024}))
                .setDescription(`\`Channels\` - ${ignoreChanArr ? ignoreChanArr : 'NONE'} \n \`ROles\` - ${ignoreRoleArr ? ignoreRoleArr : "None"}
                    \n**Usage:** \`${prefix}message-ignore [ add | remove ] [ Channel | role ] [ channels | roles *(each channel/roles seperated by ,)* ]\``)
                .setColor("#fffafa")
                .setFooter("If user send message in channel or has any roles, bot won't log their deleted/edited messages.")
                
            return await message.channel.send({embeds: [expectedArgs]}).then(m=>setTimeout(() => m.delete(), 1000 * 10));
        };

        const { content, guild } = message;
        const option = args[0];

        const Tutorial = new Discord.MessageEmbed()
            .setAuthor(`Command - Message Ignore`, client.user.displayAvatarURL({dynamic: false, type: "png", size: 1024}))
            .addField("Usage", `${prefix}message-ignore [ add | remove ] [ Channel | role ] [ channels | roles \`(each channels/roles seperated by ,)\` ] \n**Example**: \n${prefix}message-ignore add Channel #admin-cafe, #owner-hub ] \n${prefix}message-ignore add roles @admin, @owner`)
            .setColor("#fffafa")

        switch(option){
            case "add":
                const optionType = args[1];
                if(!optionType){
                    return message.channel.send({embeds: [Tutorial]}).then(m=>setTimeout(() => m.delete(), 1000 * 10))
                }

                switch(optionType){
                    case "channel":
                        if(!args[2]){
                            return message.channel.send({embeds: [Tutorial]}).then(m=>setTimeout(() => m.delete(), 1000 * 10))
                        }

                        const channelDivider = content.split(/\s+/).slice(3).join(" ");
                        const channel = channelDivider.split(/,\s+/);
                        const chanSet = new Set(channel);
                
                        const errChan = new Array();
                        const arrChan = new Array();
                        const ChannelArray = [];
        
                        // DATABASE FUNCTION
                        function chanDatabase (){
                            chanSet.forEach(async (chanID) => {
                                try {
                                    Channels = guild.channels.cache.find(c => c.id == chanID.replace( '<#' , '' ).replace( '>' , '' )) || 
                                        guild.channels.cache.find(r => r.name.toLowerCase() == chanID.toLowerCase()) || 
                                        guild.channels.cache.find(c => c.id == chanID);
                    
                                    if(Channels){
                                        arrChan.push(Channels);
                                        ChannelArray.push(Channels.id)
                                        
                                        await GuildChannel.findOneAndUpdate({
                                            guildID: message.guild.id,
                                            Active: true
                                        },{
                                            guildName: message.guild.name,

                                            $set: {
                                                [`MessageLog.IgnoreChannels`] : ChannelArray
                                            }
                                        },{
                                            upsert: true,
                                        })
            
                                    }else if(typeof Channels === "undefined"){
                                        async function adds( value) {
                                            if (errChan.indexOf(value) === -1) {
                                                await errChan.push(value);
                                            }
                                        }
                                        adds(Channels)
                                    }
                                }catch (err){
                                    errLog(err.stack.toString(), "text", "Message-Ignore", "Error in Channel Database Function")
                                }
                            })
                        }
                        chanDatabase()
        
                        if(typeof Channels === "undefined"){
                            const ErrEmbedChan = new Discord.MessageEmbed()
                                .setDescription(`Couldn't find channel ${errChan}`)
                                .setColor("#ff303e")
        
                            return message.channel.send(ErrEmbedChan)
                        }else {
                            await message.channel.send({embeds: [new Discord.MessageEmbed()
                                .setAuthor('Message-Ignore channel updated')
                                .setDescription(`${arrChan}`)
                                .setColor("#fffafa")
                                .setTimestamp()
                            ]
                            })
                        }
                    break;

                    case "role":
                        if(!args[2]){
                            message.channel.send({embeds: [Tutorial]}).then(m=>setTimeout(() => m.delete(), 1000 * 10))
                        }

                        const RoleDivider = content.split(/\s+/).slice(3).join(" ");
                        const roles = RoleDivider.split(/,\s+/);
                        const roleSet = new Set(roles);
                
                        const errArr = new Array();
                        const arrStr = new Array();
                        const RolesArray = []
        
                        // DATABASE FUNCTION
                        function roleDatabase (){
                            roleSet.forEach(async (roleID) => {
                                try {
                                        Roles = guild.roles.cache.find(c => c.id == roleID.replace( '<@&' , '' ).replace( '>' , '' )) || 
                                            guild.roles.cache.find(r => r.name.toLowerCase() == roleID.toLowerCase()) || 
                                            guild.roles.cache.find(c => c.id == roleID);
                        
                                    if(Roles){
                                        arrStr.push(Roles.toString());
                                        RolesArray.push(Roles.id)
                                        
                                        await GuildChannel.findOneAndUpdate({
                                            guildID: message.guild.id,
                                            Active: true
                                        },{
                                            guildName: message.guild.name,

                                            $set: {
                                                [`MessageLog.IgnoreRoles`] : RolesArray
                                            }
                                        },{
                                            upsert: true,
                                        })
            
                                    }else if(typeof Roles === "undefined"){
                                        async function add( value) {
                                            if (errArr.indexOf(value) === -1) {
                                                await errArr.push(value);
                                            }
                                        }
                                        add(roleID)
                                    }
                                }catch (err){
                                    errLog(err.stack.toString(), "text", "Message-Ignore", "Error in Role Database Function")
                                }
                            })
                        }
                        roleDatabase()
        
                        if(typeof Roles === "undefined"){
                            const ErrEmbed = new Discord.MessageEmbed()
                                .setDescription(`Couldn't find role ${errArr}`)
                                .setColor("#ff303e")
        
                            return message.channel.send({embeds: [ErrEmbed]})
                        }else {
                            await message.channel.send({embeds: [new Discord.MessageEmbed()
                                .setAuthor('Message-Ignore roles updated')
                                .setDescription(`${arrStr}`)
                                .setColor("#fffafa")
                                .setTimestamp()
                            ]
                            })
                        }
                    break;
                    default:
                        return message.channel.send({embeds: [Tutorial]}).then(m=>setTimeout(() => m.delete(), 1000 * 10))
                }
            break;
            default:
                return message.channel.send({embeds: [Tutorial]}).then(m=>setTimeout(() => m.delete(), 1000 * 10))
        }
    }
}