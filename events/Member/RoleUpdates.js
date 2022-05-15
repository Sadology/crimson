// const Discord = require('discord.js');
// const { LogsDatabase } = require('../../models')
// module.exports = {
//     event: "guildMemberUpdate",
//     once: false,
//     run: async(oldMember, newMember, client)=> {
//         try {
//             const clientPerm = newMember.guild.members.resolve( client.user ).permissions.any("VIEW_AUDIT_LOG");
//             if (!clientPerm || clientPerm == false) return

//             const { guild } = newMember;
//             const fetchedLogs = await newMember.guild.fetchAuditLogs({
//                 limit: 1,
//                 type: 'MEMBER_ROLE_UPDATE',
//             });
//             const roleAddLog = fetchedLogs.entries.first();
//             const { executor, changes, target } = roleAddLog;
//             if(!executor || !changes || !target) return;
            
//             if(executor.id == client.user.id) return
//             let addition = changes.find(i => i.key == '$add')
//             if(!addition){
//                 return
//             }
//             else checkMuted()

//             function checkMuted(){
//                 let findRoleNewMember = newMember.roles.cache.find(r => r.name == "muted") || newMember.roles.cache.find(r => r.name == "Muted")
//                 if(findRoleNewMember){
//                     let findRoleOldMember = oldMember.roles.cache.find(r => r.name == "muted") || oldMember.roles.cache.find(r => r.name == "Muted")
//                     if(!findRoleOldMember){
//                         fetchData()
//                     }
//                 }
//             }

//             function fetchData(){
//                 if(executor.bot){
//                     function caseID() {
//                         var text = "";
//                         var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
//                         for (var i = 0; i < 10; i++)
//                             text += possible.charAt(Math.floor(Math.random() * possible.length));
//                         return text;
//                     }

//                     const Data = {
//                         guildID: guild.id,
//                         guildName: guild.name,
//                         userID: target.id,
//                         userName: target.username+"#"+executor.discriminator,
//                         actionType: "Mute",
//                         actionReason: `[ ${executor.username} auto mute ]`,
//                         moderator: executor.username+"#"+executor.discriminator,
//                         moderatorID: executor.id,
//                         actionLength: "∞",
//                         caseID: caseID()
//                     }
//                     saveData(Data)
//                 }
//             }

//             async function saveData(data){
//                 await LogsDatabase.updateOne({
//                     guildID: guild.id,
//                     userID: target.id
//                 }, {
//                     guildName: guild.name,
//                     $push: {
//                         [`Action`]: {
//                             ...data
//                         }
//                     }
//                 },{
//                     upsert: true,
//                 }).catch(err => {
//                     return console.log(err.stack)
//                 })
//             }
//         }catch(err) {
//             return console.log(err.stack)
//         }

//         // newMember.roles.cache.forEach(async (value) => {
//         //     try {
//         //         if (!oldMember.roles.cache.find((role) => role.id === value.id)) {
//         //             const rolesAddData = await GuildChannel.findOne({
//         //                 guildID: guild.id,
//         //                 Active: true,
//         //                 'RolesLog.RolesAddEnabled': true
//         //             })
    
//         //             if(rolesAddData){
//         //                 const dataChannel = rolesAddData.RolesLog.RolesAddChannel;
//         //                 const LogChannel = guild.channels.cache.find(c => c.id === dataChannel)
            
//         //                 if(LogChannel){
//         //                     try {
//         //                         const hasPermissionInChannel = LogChannel
//         //                             .permissionsFor(guild.me)
//         //                             .has('SEND_MESSAGES', false);
//         //                         if (!hasPermissionInChannel) {
//         //                             return
//         //                         }else {
//         //                             const roleAddedEmbed = {
//         //                                 color: "#45f766",
//         //                                 author: {
//         //                                     name: newMember.user.username,
//         //                                     icon_url: newMember.user.displayAvatarURL({dynamic: true, type: "png", size: 1024})
//         //                                 },
//         //                                 description: `Added a role \`${value.name}\` to ${newMember.user}`,
//         //                                 footer: {
//         //                                     text: newMember.user.id,
//         //                                 },
//         //                                 timestamp: new Date()
//         //                             }
    
//         //                             LogChannel.send({embeds: [roleAddedEmbed]})
//         //                         }
//         //                     }catch(err) {
//         //                         errLog(err.stack.toString(), "text", "Role-Added", "Error in sending data");
//         //                     }
//         //                 }else {
//         //                     return
//         //                 }
//         //             }
//         //         }
//         //     }catch(err) {
//         //         errLog(err.stack.toString(), "text", "Role-Added", "Error in finding member role");
//         //     }
//         // });

//         // oldMember.roles.cache.forEach(async (value) => {
//         //     try {
//         //         if (!newMember.roles.cache.find((role) => role.id === value.id)) {
//         //             const rolesRmData = await GuildChannel.findOne({
//         //                 guildID: guild.id,
//         //                 Active: true,
//         //                 'RolesLog.RolesRemoveEnabled': true
//         //             })
    
//         //             if(rolesRmData){
//         //                 const DataChannel = rolesRmData.RolesLog.RolesRemoveChannel;
//         //                 const logChannel = guild.channels.cache.find(c => c.id === DataChannel)
            
//         //                 if(logChannel){
//         //                         const hasPermissionInChannel = logChannel
//         //                             .permissionsFor(guild.me)
//         //                             .has('SEND_MESSAGES', false);
//         //                         if (!hasPermissionInChannel) {
//         //                             return
//         //                         }else {
//         //                             const roleRemovedEmbed = {
//         //                                 color: '#ff303e',
//         //                                 author: {
//         //                                     name: newMember.user.username,
//         //                                     icon_url: newMember.user.displayAvatarURL({dynamic: true, type: "png", size: 1024})
//         //                                 },
//         //                                 description: `Role removed \`${value.name}\` from ${newMember.user}`,
//         //                                 footer: {
//         //                                     text: newMember.user.id,
//         //                                 },
//         //                                 timestamp: new Date()
//         //                             }
    
//         //                             logChannel.send({embeds: [roleRemovedEmbed]})
//         //                         }
//         //                 }else {
//         //                     return
//         //                 }
//         //             }
//         //         }
//         //     }catch(err) {
//         //         errLog(err.stack.toString(), "text", "Role-Added", "Error in finding member role");
//         //     }
//         // });
//     }
// }