const Discord = require('discord.js');
const { saveData} = require('../../Functions/functions');
const { LogManager } = require('../../Functions');
module.exports = {
    event: "guildMemberUpdate",
    once: false,
    run: async(oldMember, newMember, client)=> {
        if(!newMember.guild.me.permissions.has("VIEW_AUDIT_LOG")){
            return
        }
        const { guild } = newMember;
        const fetchedLogs = await newMember.guild.fetchAuditLogs({
            limit: 1,
            type: 'MEMBER_ROLE_UPDATE',
        });
        const roleAddLog = fetchedLogs.entries.first();
        const { executor, changes, target } = roleAddLog;
        
        if(executor.id == client.user.id) return
        let addition = changes.find(i => i.key == '$add')
        if(!addition){
            return
        }
        else checkMuted()

        function checkMuted(){
            let findRoleNewMember = newMember.roles.cache.find(r => r.name == "muted") || newMember.roles.cache.find(r => r.name == "Muted")
            if(findRoleNewMember){
                let findRoleOldMember = oldMember.roles.cache.find(r => r.name == "muted") || oldMember.roles.cache.find(r => r.name == "Muted")
                if(!findRoleOldMember){
                    fetchData()
                }
            }
        }

        function fetchData(){
            if(executor.bot){
                const Data = {
                    guildID: guild.id,
                    guildName: guild.name,
                    userID: target.id,
                    userName: target.username+"#"+executor.discriminator,
                    actionType: "Mute",
                    actionReason: `[ ${executor.username} auto mute ]`,
                    moderator: executor.username+"#"+executor.discriminator,
                    moderatorID: executor.id,
                    actionLength: "∞",
                }
        
                saveData({
                    ...Data,
                })
            }
        }

        // newMember.roles.cache.forEach(async (value) => {
        //     try {
        //         if (!oldMember.roles.cache.find((role) => role.id === value.id)) {
        //             const rolesAddData = await GuildChannel.findOne({
        //                 guildID: guild.id,
        //                 Active: true,
        //                 'RolesLog.RolesAddEnabled': true
        //             })
    
        //             if(rolesAddData){
        //                 const dataChannel = rolesAddData.RolesLog.RolesAddChannel;
        //                 const LogChannel = guild.channels.cache.find(c => c.id === dataChannel)
            
        //                 if(LogChannel){
        //                     try {
        //                         const hasPermissionInChannel = LogChannel
        //                             .permissionsFor(guild.me)
        //                             .has('SEND_MESSAGES', false);
        //                         if (!hasPermissionInChannel) {
        //                             return
        //                         }else {
        //                             const roleAddedEmbed = {
        //                                 color: "#45f766",
        //                                 author: {
        //                                     name: newMember.user.username,
        //                                     icon_url: newMember.user.displayAvatarURL({dynamic: true, type: "png", size: 1024})
        //                                 },
        //                                 description: `Added a role \`${value.name}\` to ${newMember.user}`,
        //                                 footer: {
        //                                     text: newMember.user.id,
        //                                 },
        //                                 timestamp: new Date()
        //                             }
    
        //                             LogChannel.send({embeds: [roleAddedEmbed]})
        //                         }
        //                     }catch(err) {
        //                         errLog(err.stack.toString(), "text", "Role-Added", "Error in sending data");
        //                     }
        //                 }else {
        //                     return
        //                 }
        //             }
        //         }
        //     }catch(err) {
        //         errLog(err.stack.toString(), "text", "Role-Added", "Error in finding member role");
        //     }
        // });

        // oldMember.roles.cache.forEach(async (value) => {
        //     try {
        //         if (!newMember.roles.cache.find((role) => role.id === value.id)) {
        //             const rolesRmData = await GuildChannel.findOne({
        //                 guildID: guild.id,
        //                 Active: true,
        //                 'RolesLog.RolesRemoveEnabled': true
        //             })
    
        //             if(rolesRmData){
        //                 const DataChannel = rolesRmData.RolesLog.RolesRemoveChannel;
        //                 const logChannel = guild.channels.cache.find(c => c.id === DataChannel)
            
        //                 if(logChannel){
        //                         const hasPermissionInChannel = logChannel
        //                             .permissionsFor(guild.me)
        //                             .has('SEND_MESSAGES', false);
        //                         if (!hasPermissionInChannel) {
        //                             return
        //                         }else {
        //                             const roleRemovedEmbed = {
        //                                 color: '#ff303e',
        //                                 author: {
        //                                     name: newMember.user.username,
        //                                     icon_url: newMember.user.displayAvatarURL({dynamic: true, type: "png", size: 1024})
        //                                 },
        //                                 description: `Role removed \`${value.name}\` from ${newMember.user}`,
        //                                 footer: {
        //                                     text: newMember.user.id,
        //                                 },
        //                                 timestamp: new Date()
        //                             }
    
        //                             logChannel.send({embeds: [roleRemovedEmbed]})
        //                         }
        //                 }else {
        //                     return
        //                 }
        //             }
        //         }
        //     }catch(err) {
        //         errLog(err.stack.toString(), "text", "Role-Added", "Error in finding member role");
        //     }
        // });
    }
}