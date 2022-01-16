const { LogsDatabase } = require('../models')
const { LogManager } = require('../Functions');

module.exports = (client) =>{
    const checkMute = async () =>{
        const now = new Date()
        const conditional = {
            Expire: {
                $lt: now
            }, 
            Muted: true
        }

        const results = await LogsDatabase.find(conditional)
        .catch(err => {return console.log(err.stack)});


        if(results && results.length){
           for (const result of results) {
                const {guildID, userID} = result;
                const guild = client.guilds.resolve(guildID);

                if(!guild) {
                    return updateNonExistedData(guildID, userID)
                }

                const member = guild.members.resolve(userID);

                if(!member){
                    updateNonExistedData(guildID, userID)
                    return sendLogData(userID, guild, client)
                }

                let muteRole = guild.roles.cache.find(role =>{
                   return role.name == "Muted" || role.name == "muted"
                })

                if(!muteRole){
                    updateNonExistedData(guildID, userID)
                    return sendLogData(member, guild, client)
                }

                let botRole = guild.members.resolve( client.user ).roles.highest.position;
                if(muteRole.position < botRole){
                    member.roles.remove(muteRole.id).catch(err => {return console.log(err.stack)})
                }

                sendLogData(member, guild, client)
           }
        }

        setTimeout(checkMute, 1000)
        
        await LogsDatabase.updateMany(conditional,{
            Muted: false
        })
        .catch(err => {return console.log(err.stack)})
    }
    checkMute()

    client.on('guildMemberAdd', async (member) => {
        const { guild, id} = member

        await LogsDatabase.findOne({
            userID: member.id,
            guildID: guild.id,
            Muted: true
        })
        .then(res => {
            if(!res) return

            let muteRole = guild.roles.cache.find(role =>{
                return role.name == "Muted" || role.name == "muted"
            })

            if(!muteRole) return

            let botRole = guild.members.resolve( client.user ).roles.highest.position;
            if(muteRole.position < botRole){
                member.roles.add(muteRole.id).catch(err => {return console.log(err.stack)})
            }

            const evadeData = {
                color: "GREEN",
                author: {
                    name: `Auto Mute - ${member.user.username}`,
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
            new LogManager(guild).sendData({type: 'actionlog', data: evadeData, client})
        }).catch(err => {return console.log(err.stack)})
    })
}
async function updateNonExistedData(guildID, userID){
    await LogsDatabase.updateOne({
        guildID: guildID,
        userID: userID,
        Muted: true
    },{
        Muted: false
    })
    .catch(err => {
        return console.log(err.stack)
    })
}

function sendLogData(member, guild, client){
    const informations = {
        color: "GREEN",
        author: {
            name: `Unmute`,
            icon_url: member.user ? member.user.displayAvatarURL({dynamic: false, format: "png", size: 1024}) : client.user.displayAvatarURL({format: 'png'})
        },
        fields: [
            {
                name: "User",
                value: `\`\`\`${member.user? member.user.tag : member}\`\`\``,
                inline: true
            },
            {
                name: "Moderator",
                value: `\`\`\`${client.user.username}\`\`\``,
                inline: true
            },
        ],
        timestamp: new Date(),
        footer: {
            text: `User ID: ${member.user? member.user.id : member}`
        }
    }

    let logmanager = new LogManager(guild, client);
    logmanager.sendData({type: 'actionlog', data: informations, client});
}