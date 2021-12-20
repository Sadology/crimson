const Discord = require('discord.js');
const { Profiles, GuildRole } = require('../../models');
module.exports = {
    event: "presenceUpdate",
    once: false,
    run: async(oldPresence, newPresence, client)=> {
        if(!newPresence.guild.me.permissions.has("VIEW_AUDIT_LOG")){
            return
        }
        try{
            if(newPresence == undefined) return
            if(oldPresence == undefined) return

            let oldStatusCode = Object.keys(newPresence)
            let newStatusCode = Object.keys(oldPresence)
            let ifNewStatus = newStatusCode.find(i => i.toLowerCase() === 'status')
            let ifOldStatus = oldStatusCode.find(i => i.toLowerCase() === 'status')
            if(!ifNewStatus) return;
            if(!ifOldStatus) return;

            async function checkPermission(pres, guild){
                let procced = true
                await GuildRole.findOne({
                    guildID: guild.id,
                    Active: true,
                })
                .then(async (res) => {
                    if(res){
                        let data = res.Roles.find(i => i.Name.toLowerCase() == "moderator")
                        if(!data) return procced = false
                        let rolesData = data.Roles;
                        if(!rolesData) return procced = false
            
                        if(!pres.roles.cache.some(r=> rolesData.includes(r.id))){
                            return procced = false
                        }else {
                            return procced = true
                        }
                    }else {
                        return procced = false
                    }
                })
                .catch(err => {return console.log(err)})
                return procced
            }

            function checkChanges() {
                if(newPresence.status == 'online'){
                    onlinePresence()
                }else if(newPresence.status !== 'online'){
                    offlinePresence()
                }
            }

            checkChanges()

            function onlinePresence(){
                client.guilds.cache.forEach(async g => {
                    let member = g.members.cache.get(newPresence.user.id)
                    if(!member) return

                    checkPermission(member, g).then(async(item) => {
                        if(item == false) return;

                        await Profiles.findOne({
                            guildID: g.id,
                            userID: newPresence.user.id
                        }).then(res => {
                            if(!res){
                                saveData('online', g)
                            }else {
                                saveData('online', g)
                            }
                        })
                        .catch(err => {
                            return console.log(err.stack)
                        });
                    })
                });
            }

            function offlinePresence(){
                client.guilds.cache.forEach(async g => {
                    let member = g.members.cache.get(newPresence.user.id)
                    if(!member) return

                    checkPermission(member, g).then(async(item) => {
                        if(item == false) return;

                        await Profiles.findOne({
                            guildID: g.id,
                            userID: newPresence.user.id
                        }).then(res => {
                            if(!res){
                                saveData('offline', g)
                            }else {
                                saveData('offline', g)
                            }
                        })
                        .catch(err => {
                            return console.log(err.stack)
                        });
                    })
                });
            }

            async function saveData(option, g) {
                switch(option){
                    case 'online':
                        await Profiles.findOneAndUpdate({
                            guildID: g.id,
                            userID: newPresence.user.id
                        }, {
                            [`OnlineTime.OnlineSince`]: new Date(),
                            [`OnlineTime.LastOnline`]: null,
                        }).catch(err => {
                            return console.log(err.stack)
                        })
                    break;

                    case 'offline':
                        await Profiles.findOneAndUpdate({
                            guildID: g.id,
                            userID: newPresence.user.id
                        }, {
                            [`OnlineTime.OnlineSince`]: null,
                            [`OnlineTime.LastOnline`]: new Date(),
                        }).catch(err => {
                            return console.log(err.stack)
                        })
                    break;
                }
            }
        }catch(err) {
            return console.log(err.stack)
        }
    }
}