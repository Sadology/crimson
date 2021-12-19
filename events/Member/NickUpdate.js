const Discord = require('discord.js');
const { GuildChannel } = require('../../models');
const { errLog } = require('../../Functions/erroHandling');
const { LogManager } = require('../../Functions')
module.exports = {
    event: "guildMemberUpdate",
    once: false,
    run: async(oldMember, newMember, client)=> {
        if(interaction.guild.me.roles.cache.size == 1 && interaction.guild.me.roles.cache.find(r => r.name == '@everyone')){
            return
        }
        if(!newMember.guild.me.permissions.has("VIEW_AUDIT_LOG")){
            return
        }
        nickUpdate()
        function nickUpdate() {
            if(newMember.nickname !== oldMember.nickname){
                sendData()
            }else {
                return
            }
        }

        function sendData() {
            let nickEmbed = {
                color: "#fcdb35",
                author: {
                    name: newMember.user.tag,
                    icon_url: newMember.user.displayAvatarURL({dynamic: true, type: "png", size: 1024})
                },
                thumbnail: {
                    url: newMember.user.displayAvatarURL({dynamic: true, type: "png", size: 1024})
                },
                description: `Nickname Changed`,
                fields: [
                    {
                        name: "Old",
                        value: `${oldMember.nickname}`,
                        inline: true
                    },
                    {
                        name: "New",
                        value: `${newMember.nickname}`,
                        inline: true
                    },
                ],
                footer: {
                    text: "User ID: "+newMember.user.id,
                },
                timestamp: new Date()
            }
            new LogManager(newMember.guild).sendData({type: 'userlog', data: nickEmbed, client})
        }
    }
}