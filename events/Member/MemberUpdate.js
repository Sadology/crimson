// const Discord = require('discord.js');
// const { GuildChannel } = require('../../models');
// const { errLog } = require('../../Functions/erroHandling');

// module.exports = {
//     event: "userUpdate",
//     once: false,
//     run: async(oldMember, newMember)=> {

//         const guild = newMember.guilds.map(guild => guild.id);
//         console.log(guild);

//         if(newMember.username !== oldMember.username) {
//             try{
//                 const userNameData = await GuildChannel.findOne({
//                     guildID: guild.id,
//                     Active: true,
//                     'UserLog.UserEnabled': true
//                 })

//                 if(userNickData){
//                     const DataChannel = userNameData.UserLog.UserChannel;
//                     const logChannel = guild.channels.cache.find(c => c.id === DataChannel);
        
//                     if(logChannel){
//                         try {
//                             const hasPermissionInChannel = logChannel
//                                 .permissionsFor(guild.me)
//                                 .has('SEND_MESSAGES', false);
//                             if (!hasPermissionInChannel) {
//                                 return
//                             }else {
//                                 const nameEmbed = {
//                                     color: "#fcdb35",
//                                     author: {
//                                         name: newMember.user.tag,
//                                         icon_url: newMember.user.displayAvatarURL({dynamic: true, type: "png", size: 1024})
//                                     },
//                                     thumbnail: {
//                                         url: newMember.user.displayAvatarURL({dynamic: true, type: "png", size: 1024})
//                                     },
//                                     description: `User-Name Updated`,
//                                     fields: [
//                                         {
//                                             name: "Before",
//                                             value: oldMember.user.username,
//                                             inline: true
//                                         },
//                                         {
//                                             name: "After",
//                                             value: newMember.user.username,
//                                             inline: true
//                                         },
//                                     ],
//                                     footer: {
//                                         text: newMember.user.id,
//                                     },
//                                     timestamp: new Date()
//                                 }

//                                 logChannel.send({embed: nameEmbed})
//                             }
//                         }catch(err) {
//                             errLog(err.stack.toString(), "text", "Name", "Error in sending data");
//                         }
//                     }else {
//                         return
//                     }
//                 }
//             }catch(err){
//                 errLog(err.stack.toString(), "text", "Name", "Error in finding member Name");
//             }
//         }

//         if(newMember.displayAvatarURL() !== oldMember.displayAvatarURL()) {
//             try{
//                 const userAvatarData = await GuildChannel.findOne({
//                     guildID: guild.id,
//                     Active: true,
//                     'UserLog.UserEnabled': true
//                 })

//                 if(userAvatarData){
//                     const DataChannelAv = userAvatarData.UserLog.UserChannel;
//                     const logChannelAv = guild.channels.cache.find(c => c.id === DataChannelAv);
        
//                     if(logChannelAv){
//                         try {
//                             const hasPermissionInChannel = logChannelAv
//                                 .permissionsFor(guild.me)
//                                 .has('SEND_MESSAGES', false);
//                             if (!hasPermissionInChannel) {
//                                 return
//                             }else {
//                                 const AvatarEmbed = {
//                                     color: "#fcdb35",
//                                     author: {
//                                         name: newMember.user.tag,
//                                         icon_url: newMember.user.displayAvatarURL({dynamic: true, type: "png", size: 1024})
//                                     },
//                                     thumbnail: {
//                                         url: newMember.user.displayAvatarURL({dynamic: true, type: "png", size: 1024})
//                                     },
//                                     description: `Avatar Changed`,
//                                     fields: [
//                                         {
//                                             name: "Before",
//                                             value: oldMember.user.displayAvatarURL(),
//                                             inline: true
//                                         },
//                                         {
//                                             name: "After",
//                                             value: newMember.user.displayAvatarURL(),
//                                             inline: true
//                                         },
//                                     ],
//                                     footer: {
//                                         text: newMember.user.id,
//                                     },
//                                     timestamp: new Date()
//                                 }

//                                 logChannelAv.send({embed: AvatarEmbed})
//                             }
//                         }catch(err) {
//                             errLog(err.stack.toString(), "text", "Avatar", "Error in sending data");
//                         }
//                     }else {
//                         return
//                     }
//                 }
//             }catch(err){
//                 errLog(err.stack.toString(), "text", "Avatar", "Error in finding Avatar");
//             }
//         }
//     }
// }