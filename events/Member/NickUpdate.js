const Discord = require('discord.js');
const { GuildChannel } = require('../../models');
const { errLog } = require('../../Functions/erroHandling');
const { LogChannel } = require('../../Functions')
module.exports = {
    event: "guildMemberUpdate",
    once: false,
    run: async(oldMember, newMember, client)=> {
        nickUpdate()
        function nickUpdate() {
            if(newMember.nickname !== oldMember.nickname){
                sendData()
            }else {
                return
            }
        }

        function sendData() {
            LogChannel('userLog', newMember.guild).then(async c => {
                if(!c || c == null) return;
                
                const hooks = await c.fetchWebhooks();
                const webHook = hooks.find(i => i.owner.id == client.user.id && i.name == 'sadbot')

                if(!webHook){
                    return c.createWebhook("sadbot", {
                        avatar: "https://i.ibb.co/86GB8LZ/images.jpg"
                    })
                }

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
                webHook.send({embeds: [nickEmbed]})
            })
        }
    }
}