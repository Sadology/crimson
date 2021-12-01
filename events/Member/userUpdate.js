const Discord = require('discord.js');
const { GuildChannel } = require('../../models');
const { errLog } = require('../../Functions/erroHandling');
const { LogChannel } = require('../../Functions')
module.exports = {
    event: "userUpdate",
    once: false,
    run: async(oldMember, newMember, client)=> {
    try{
        function pfpChange() {
            if(newMember.displayAvatarURL() !== oldMember.displayAvatarURL()){
                client.guilds.cache.forEach(guild => {
                    let m = guild.members.cache.get(newMember.id)
                    if(m){
                        sendData(guild, 'avatar')
                    }else {
                        return
                    }
                })
            }else {
                return
            }
        }

        function userNameChange() {
            if(newMember.username !== oldMember.username || newMember.tag !== oldMember.tag){
                client.guilds.cache.forEach(guild => {
                    let m = guild.members.cache.get(newMember.id)
                    if(m){
                        sendData(guild, 'username')
                    }else {
                        return
                    }
                })
            }else {
                return
            }
        }
        pfpChange()
        userNameChange()

        function sendData(guild, type) {
            LogChannel('userLog', guild).then(async c => {
                if(!c || c == null) return;
                
                const hooks = await c.fetchWebhooks();
                const webHook = hooks.find(i => i.owner.id == client.user.id && i.name == 'sadbot')

                if(!webHook){
                    return c.createWebhook("sadbot", {
                        avatar: "https://i.ibb.co/86GB8LZ/images.jpg"
                    })
                }

                EmbedOption(type).then((data) => {
                    webHook.send({embeds: [data]})
                })
                
            })
        }

        function EmbedOption(type) {
            switch (type){
                case "avatar":
                    let AvatarEmbed = {
                        color: "#fcdb35",
                        author: {
                            name: newMember.tag,
                            icon_url: newMember.displayAvatarURL({dynamic: true, type: "png", size: 1024})
                        },
                        thumbnail: {
                            url: newMember.displayAvatarURL({dynamic: true, type: "png", size: 1024})
                        },
                        description: `Avatar Updated`,
                        fields: [
                            {
                                name: "Old",
                                value: `[URL](${oldMember.displayAvatarURL()})`,
                                inline: true
                            },
                            {
                                name: "New",
                                value: `[URL](${newMember.displayAvatarURL()})`,
                                inline: true
                            },
                        ],
                        footer: {
                            text: "User ID: "+newMember.id,
                        },
                        timestamp: new Date()
                    }
                    return new Promise((resolve) => {
                        resolve(AvatarEmbed)
                    })
                break;

                case 'username':
                    let usernameEmbed = {
                        color: "#fcdb35",
                        author: {
                            name: newMember.tag,
                            icon_url: newMember.displayAvatarURL({dynamic: true, type: "png", size: 1024})
                        },
                        thumbnail: {
                            url: newMember.displayAvatarURL({dynamic: true, type: "png", size: 1024})
                        },
                        description: `UserName Updated`,
                        fields: [
                            {
                                name: "Old",
                                value: `**${oldMember.tag}**`,
                                inline: true
                            },
                            {
                                name: "New",
                                value: `**${newMember.tag}**`,
                                inline: true
                            },
                        ],
                        footer: {
                            text: "User ID: "+newMember.id,
                        },
                        timestamp: new Date()
                    }
                    return new Promise((resolve) => {
                        resolve(usernameEmbed)
                    })
                break;
            }
        }
    }catch(err ){
        return console.log(err)
    }
    }
}