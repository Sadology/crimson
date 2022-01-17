const { GuildManager } = require('../../Functions')
const { Guild } = require('../../models')
module.exports = {
    name: 'update-db-logs',
    category: "Owner",
    run: async(client, message, args,prefix) =>{
        if(message.author.id !== "571964900646191104"){
            return
        }

            await Guild.find({
                Modules: {$exists : true},
                Commands: {$exists : true},
            })
            .then(res => {
                res.forEach(async data => {
                    let modls = data.Modules;
                    let cmds = data.Commands;
                    if(!modls) return
                    if(!cmds) return
    
                    for(let [key] of modls){
                        let arr = []
                        this.client.commands.forEach(data => {
                            if(data.category){
                                (arr.push(data.category.toLowerCase()))
                            }
                        })
                        this.client.slash.forEach(data => {
                            if(data.category){
                                (arr.push(data.category.toLowerCase()))
                            }
                        })
                        if(!arr.includes(key.toLowerCase())){
                            await Guild.updateMany({
                                [`Modules.${key}`]: {$exists: true}
                            }, {
                                $unset: {
                                    [`Modules.${key}`]: {$exists: true}
                                }
                            }).catch(err => {return console.log(err.stack)})
                        }
                        await Guild.updateMany({
                            [`Modules.${key}.Enabled`]: true
                        }, {
                            $unset: {
                                [`Modules.${key}`]: {$exists: true}
                            }
                        }).catch(err => {return console.log(err.stack)})
                    }
    
                    for(let [key, value] of cmds){
                        let arr = []
                        this.client.commands.forEach(data => {
                            if(!data.name) return
                            if(!data.category || data.category == 'Owner') return
    
                            arr.push(data.name.toLowerCase())
                        })
                        this.client.slash.forEach(slash => {
                            arr.push(slash.data.name.toLowerCase())
                        })
    
                        await Guild.updateMany({
                            [`Commands.${key}.Enabled`]: true,
                            [`Commands.${key}.Permissions`]: [],
                            [`Commands.${key}.NotAllowedRole`]: [],
                            [`Commands.${key}.NotAllowedChannel`]: [],
                            [`Commands.${key}.AllowedChannel`]: [],
                        }, {
                            $unset: {
                                [`Commands.${key}`]: {$exists: true},
                            }
                        }).catch(err => {return console.log(err.stack)})
    
                        if(!arr.includes(key.toLowerCase())){
                            await Guild.updateMany({
                                [`Commands.${key}`]: {$exists: true}
                            }, {
                                $unset: {
                                    [`Commands.${key}`]: {$exists: true}
                                }
                            }).catch(err => {return console.log(err.stack)})
                        }
                    }
                })
            }).catch(err => {return console.log(err.stack)})

            console.log("WORKING ON IT")
    }
}