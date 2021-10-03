const Discord = require('discord.js');
const { GuildChannel } = require('../../models');
const { errLog } = require('../../Functions/erroHandling');

module.exports = {
    event: "guildMemberUpdate",
    once: false,
    disabled: true,
    run: async(oldMember, newMember, client)=> {

        const { guild } = oldMember;

        newMember.roles.cache.forEach(async (value) => {
            try {
                if (!oldMember.roles.cache.find((role) => role.id === value.id)) {
                    const rolesAddData = await GuildChannel.findOne({
                        guildID: guild.id,
                        Active: true,
                        'RolesLog.RolesAddEnabled': true
                    })
    
                    if(rolesAddData){
                        const dataChannel = rolesAddData.RolesLog.RolesAddChannel;
                        const LogChannel = guild.channels.cache.find(c => c.id === dataChannel)
            
                        if(LogChannel){
                            try {
                                const hasPermissionInChannel = LogChannel
                                    .permissionsFor(guild.me)
                                    .has('SEND_MESSAGES', false);
                                if (!hasPermissionInChannel) {
                                    return
                                }else {
                                    const roleAddedEmbed = {
                                        color: "#45f766",
                                        author: {
                                            name: newMember.user.username,
                                            icon_url: newMember.user.displayAvatarURL({dynamic: true, type: "png", size: 1024})
                                        },
                                        description: `Added a role \`${value.name}\` to ${newMember.user}`,
                                        footer: {
                                            text: newMember.user.id,
                                        },
                                        timestamp: new Date()
                                    }
    
                                    LogChannel.send({embeds: [roleAddedEmbed]})
                                }
                            }catch(err) {
                                errLog(err.stack.toString(), "text", "Role-Added", "Error in sending data");
                            }
                        }else {
                            return
                        }
                    }
                }
            }catch(err) {
                errLog(err.stack.toString(), "text", "Role-Added", "Error in finding member role");
            }
        });

        oldMember.roles.cache.forEach(async (value) => {
            try {
                if (!newMember.roles.cache.find((role) => role.id === value.id)) {
                    const rolesRmData = await GuildChannel.findOne({
                        guildID: guild.id,
                        Active: true,
                        'RolesLog.RolesRemoveEnabled': true
                    })
    
                    if(rolesRmData){
                        const DataChannel = rolesRmData.RolesLog.RolesRemoveChannel;
                        const logChannel = guild.channels.cache.find(c => c.id === DataChannel)
            
                        if(logChannel){
                                const hasPermissionInChannel = logChannel
                                    .permissionsFor(guild.me)
                                    .has('SEND_MESSAGES', false);
                                if (!hasPermissionInChannel) {
                                    return
                                }else {
                                    const roleRemovedEmbed = {
                                        color: '#ff303e',
                                        author: {
                                            name: newMember.user.username,
                                            icon_url: newMember.user.displayAvatarURL({dynamic: true, type: "png", size: 1024})
                                        },
                                        description: `Role removed \`${value.name}\` from ${newMember.user}`,
                                        footer: {
                                            text: newMember.user.id,
                                        },
                                        timestamp: new Date()
                                    }
    
                                    logChannel.send({embeds: [roleRemovedEmbed]})
                                }
                        }else {
                            return
                        }
                    }
                }
            }catch(err) {
                errLog(err.stack.toString(), "text", "Role-Added", "Error in finding member role");
            }
        });
    }
}