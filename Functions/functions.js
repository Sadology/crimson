const { LogsDatabase } = require('../models');
const { LogManager } = require('./index');
const { Profiles } = require('../models')

async function saveData({
    guildID, 
    guildName,
    userID, 
    userName,
    actionType, 
    actionReason, 
    Expire,
    actionLength,
    moderator,
    moderatorID
}) {
    function caseID() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      
        for (var i = 0; i < 10; i++)
          text += possible.charAt(Math.floor(Math.random() * possible.length));
      
        return text;
    }

    let genCaseID = ""
    genCaseID = caseID()
    
    let Data = {
        userID, 
        userName,
        caseID: genCaseID, 
        actionType, 
        actionReason,
        actionLength,
        moderator,
        moderatorID,
        actionDate: new Date()
    }

    await LogsDatabase.findOneAndUpdate({
        guildID: guildID,
        userID: userID
    }, {
        guildName: guildName,
        Muted: true,
        Expire: Expire,
        $push: {
            [`Action`]: {
                ...Data
            }
        }
    },{
        upsert: true,
    })
}

function sendLogData({data, client, Member, guild}){
    switch(data.actionType){
        case "Mute":
            const muteData = {
                color: "#ff303e",
                author: {
                    name: `Mute Detection`,
                    icon_url: Member.user.displayAvatarURL({dynamic: false, type: "png", size: 1024})
                },
                fields: [
                    {
                        name: "User",
                        value: `\`\`\`${Member.user.tag}\`\`\``,
                        inline: true
                    },
                    {
                        name: "Moderator",
                        value: `\`\`\`${data.moderator}\`\`\``,
                        inline: true
                    },
                    {
                        name: "Duration",
                        value: `\`\`\`${data.actionLength === null ? "∞" : data.actionLength}\`\`\``,
                        inline: true
                    },
                    {
                        name: "Reason",
                        value: `\`\`\`${data.actionReason == null ? "No reason provided" : data.actionReason}\`\`\``,
                    },
                ],
                timestamp: new Date(),
                footer: {
                    text: `User ID: ${Member.user.id}`
                }
            }

            new LogManager(guild).sendData({type: 'actionlog', data: muteData, client})
        break;
    }
}

function sendMoreLogData({data, dataType, Member ,client, guild}){
    switch(dataType){
        case "unmute":
            const unMuteData = {
                color: "#45f766",
                author: {
                    name: `Unmute - ${Member.user.tag}`,
                    icon_url: Member.user.displayAvatarURL({
                        dynamic: false, 
                        type: "png", 
                        size: 1024
                    })
                },
                fields: [
                    {
                        name: "User",
                        value: `\`\`\`${Member.user.tag}\`\`\``,
                        inline: true
                    },
                    {
                        name: "Moderator",
                        value: `\`\`\`${client.user.tag}\`\`\``,
                        inline: true
                    },
                    {
                        name: "Reason",
                        value: `\`\`\`[ AUTO ]\`\`\``,
                    },
                ],
                timestamp: new Date(),
                footer: {
                    text: `User ID: ${Member.user.id}`
                }

            }
            new LogManager(guild).sendData({type: 'actionlog', data: unMuteData, client})
        break;

        case 'muteEvade':
            const evadeData = {
                color: "#ff303e",
                author: {
                    name: `Auto Mute - ${Member.user.username}`,
                    icon_url: Member.user.displayAvatarURL({dynamic: false, type: "png", size: 1024})
                },
                fields: [
                    {
                        name: "User",
                        value: `\`\`\`${Member.user.tag}\`\`\``,
                        inline: true
                    },
                    {
                        name: "Moderator",
                        value: `\`\`\`${client.user.tag}\`\`\``,
                        inline: true
                    },
                    {
                        name: "Reason",
                        value: `\`\`\`Mute evade detection [ Auto muted ]\`\`\``,
                    },
                ],
                timestamp: new Date(),
                footer: {
                    text: `User ID: ${Member.user.id}`
                }
            }
            new LogManager(guild).sendData({type: 'actionlog', data: evadeData, client})
        break;
    }
}

async function ModStatus({type, guild, member, content}) {
    await Profiles.findOneAndUpdate({
        guildID: guild.id,
        userID: member.id
    }, {
        guildName: guild.name,
        userName: member.tag,
        [`ModerationStats.Recent`]: content,
        $inc: {
            [`ModerationStats.${[type]}`]: 1,
            [`ModerationStats.Total`]: 1
        }
    }, {
        upsert: true,
    })
}

class LogSend{
    constructor(){
        
    }
}
module.exports = { saveData, sendLogData, sendMoreLogData, ModStatus }