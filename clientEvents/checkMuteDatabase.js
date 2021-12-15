const { LogsDatabase, GuildChannel } = require('../models')
const { saveData, sendLogData, sendMoreLogData } = require('../Functions/functions');
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
        if(results && results.length){
           for (const result of results) {
                const {guildID, userID} = result;
                const guild = client.guilds.cache.get(guildID);
                const member = await guild.members.fetch();
                const memberID = member.get(userID);

                let muteRole = guild.roles.cache.find(role =>{
                   return role.name == "Muted" || role.name == "muted"
                })

                if( !memberID ){
                  await LogsDatabase.findOneAndUpdate({
                        guildID: guildID,
                        userID: userID,
                        Muted: true
                    },{
                        Muted: false
                    });
                    return;
                }

                if( muteRole ){
                    let botRole = guild.members.resolve( client.user ).roles.highest.position;
                    if(muteRole.position < botRole){
                        memberID.roles.remove(muteRole.id)
                    }
                }else {
                    await LogsDatabase.findOneAndUpdate({
                        guildID: guildID,
                        userID: userID,
                        Muted: true
                    },{
                        Muted: false
                    })
                }

                sendMoreLogData({
                    dataType: "unmute", 
                    client: client,
                    guild: guild,
                    Member: memberID
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

        if(muteEvade){
            let muteRole = guild.roles.cache.find(role =>{
                return role.name == "Muted" || role.name == "muted"
            })

            if(muteRole){
                try{
                    let botRole = guild.members.resolve( client.user ).roles.highest.position;
                    if(muteRole.position < botRole){
                        member.roles.remove(muteRole.id)
                    }

                    const Data = {
                        guildID: guild.id,
                        guildName: guild.name,
                        userID: member.id,
                        userName: member.user.tag,
                        actionType: "Mute",
                        actionReason: "[ Sadbot mute evade. Auto muted ]",
                        moderator: client.user.tag,
                        moderatorID: client.user.id,
                        actionLength: "∞",
                    }
            
                    saveData({
                        ...Data,
                    })
                }catch(err){
                    console.log(err)
                }

                sendMoreLogData({
                    dataType: "muteEvade", 
                    client: client,
                    guild: guild,
                    Member: member
                })
            }
        }
    })
}