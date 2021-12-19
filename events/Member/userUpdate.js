const Discord = require('discord.js');
const { GuildChannel } = require('../../models');
const { errLog } = require('../../Functions/erroHandling');
const { LogManager } = require('../../Functions')
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
                EmbedOption(type).then((data) => {
                    new LogManager(guild).sendData({type: 'userlog', data: data, client})
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