const Discord = require('discord.js');
const { LogsDatabase, GuildChannel } = require('../models')
const { LogChannel } = require('../Functions/logChannelFunctions');
module.exports = (client, message) =>{
    const checkMute = async () =>{
        const now = new Date()
        const conditional = {
            Expire: {
                $lt: now
            }, 
            Muted: true
        }

        const results = await LogsDatabase.find(conditional)
        if(results && results.length){
           for (const result of results) {
                const {guildID, userID} = result

                const guild = client.guilds.cache.get(guildID)
                const member = await guild.members.fetch()
                const memberID = member.get(userID)

                const muteRole = guild.roles.cache.find(role =>{
                   return role.name === "Muted"
                })
                if( !memberID ){
                  await LogsDatabase.findOneAndUpdate({
                    guildID: guildID,
                    userID: userID,
                    Muted: true
                },{
                    Muted: false
                })
                }

                if( muteRole ){
                    memberID.roles.remove(muteRole.id)
                }else {
                    await LogsDatabase.findOneAndUpdate({
                        guildID: guildID,
                        userID: userID,
                        Muted: true
                    },{
                        Muted: false
                    })
                }

                LogChannel('actionLog', guild).then(c =>{
                    if(!c) return;
                    if(c === null) return;

                    else {
                        const informations = {
                            color: "#45f766",
                            author: {
                                name: `Unmute - ${memberID.user.userName}`,
                                icon_url: memberID.user.displayAvatarURL({dynamic: false, type: "png", size: 1024})
                            },
                            fields: [
                                {
                                    name: "User",
                                    value: `\`\`\`${memberID.user.tag}\`\`\``,
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
                                text: `User ID: ${memberID.user.id}`
                            }

                        }
                        const hasPermInChannel = c
                        .permissionsFor(client.user)
                        .has('SEND_MESSAGES', false);
                        if (hasPermInChannel) {
                            c.send({embeds: [informations]})
                        }
                    }
                })
           }
        }

        setTimeout(checkMute, 1000)
        

        await LogsDatabase.updateMany(conditional,{
            Muted: false
        })
    }
    checkMute()

    client.on('guildMemberAdd', async (member) => {
        const { guild, id} = member

        const muteEvade = await LogsDatabase.findOne({
            userID: member.id,
            guildID: guild.id,
            Muted: true
        })

        function caseID() {
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
          
            for (var i = 0; i < 10; i++)
              text += possible.charAt(Math.floor(Math.random() * possible.length));
          
            return text;
        }

        let genCaseID = ""
        genCaseID = caseID()

        if(muteEvade){
            const muteRole = guild.roles.cache.find(role =>{
                return role.name === "Muted"
            })

            if(muteRole){
                try{
                    member.roles.add(muteRole.id)

                    await new LogsDatabase({
                        CaseID: genCaseID,
                        guildID: guild.id,
                        guildName: guild.name,
                        userID: member.id,
                        userName: member.user.tag,
                        ActionType: "Mute",
                        Reason: "[ Sadbot mute evade. Auto muted ]",
                        Moderator: client.user.tag,
                        ModeratorID: client.user.id,
                        Duration:"∞",
                        ActionDate: new Date(),
                    }).save()
                }catch(err){
                    console.log(err)
                }
                LogChannel('actionLog', guild).then(c =>{
                    if(!c) return;
                    if(c === null) return;

                    else {
                        const informations = {
                            color: "#ff303e",
                            author: {
                                name: `Unmute - ${memberID.user.username}`,
                                icon_url: member.user.displayAvatarURL({dynamic: false, type: "png", size: 1024})
                            },
                            fields: [
                                {
                                    name: "User",
                                    value: `\`\`\`${member.user.tag}\`\`\``,
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
                                text: `User ID: ${member.user.id}`
                            }

                        }
                        const hasPermInChannel = c
                        .permissionsFor(client.user)
                        .has('SEND_MESSAGES', false);
                        if (hasPermInChannel) {
                            c.send({embeds: [informations]})
                        }
                    }
                })
            }
        }
    })
}