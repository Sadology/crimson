const { Guild, GuildRole, GuildChannel } = require('../models');
const Discord = require('discord.js');
class GuildManager{
    constructor(Client, Guild){
        this.client = Client
    }

    async guildCreate(guild){
        await Guild.findOne({
            guildID: guild.id
        }).then(async res => {
            if(res){
                return this.guildUpdate()
            }else {
                await Guild.updateOne({
                    guildID: guild.id
                }, {
                    $set: {
                        prefix: ">",
                        ownerID: guild.ownerId,
                        Settings: new Discord.Collection(),
                        Modules: new Discord.Collection(),
                        Commands: new Discord.Collection(),
                        EarlySupporter: true,
                    }
                }, {
                    upsert: true
                }).catch(err => {return console.log(err.stack)}); 
            }
        }).catch(err => {return console.log(err.stack)}); 
    }
    async guildUpdate(){
        // Fix Prefix
        await Guild.updateMany({
            prefix: {$exists : false}
        }, {
            $set: {
                prefix: ">"
            }
        }).catch(err => {return console.log(err.stack)});

        // Fix Settings
        await Guild.updateMany({
            Settings: {$exists : false}
        }, {
            $set: {
                Settings: new Discord.Collection()
            }
        }).catch(err => {return console.log(err.stack)});

        // Fix Modules
        await Guild.updateMany({
            Modules: {$exists : false}
        }, {
            $set: {
                Modules: new Discord.Collection()
            }
        }).catch(err => {return console.log(err.stack)});

        // Fix commands
        await Guild.updateMany({
            Commands: {$exists : false}
        }, {
            $set: {
                Commands: new Discord.Collection()
            }
        }).catch(err => {return console.log(err.stack)});

        // Early supporter (remove after verified)
        await Guild.updateMany({
            EarlySupporter: {$exists : false}
        }, {
            $set: {
                EarlySupporter: true,
            }
        }).catch(err => {return console.log(err.stack)});

        return this
    }

    async setGuildChannels(){
        await GuildChannel.deleteMany().catch(err => {return console.log(err.stack)})
    };

    async setGuildRoles(){
        await GuildRole.deleteMany().catch(err => {return console.log(err.stack)});
        return this
    }

    async deleteJunk(){
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
    }
}

module.exports = GuildManager