const { Guild, GuildRole, GuildChannel } = require('../models');
const Discord = require('discord.js');
class GuildManager{
    constructor(Client, Guild){
        this.client = Client
        this.guild = Guild
    }

    async saveData(data, dataType){
        await Guild.updateOne({
            guildID: this.guild.id
        }, {
            $set: {
                [`${dataType}`]: data
            }
        }).catch(err => {return console.log(err.stack)})
    }

    async guildCreate(){
        let schema = {
           prefix: ">",
           ownerID: this.guild.ownerId
        }

        await Guild.findOne({
            guildID: this.guild.id
        })
        .then(async res => {
            if(!res){
                await Guild.updateOne({
                    guildID: this.guild.id,
                }, {
                    guildName: this.guild.name,
                    Active: true,
                    prefix: ">",
                    ownerID: this.guild.ownerId,
                    Balance: 100000,
                }, {upsert: true})
                .catch(err => {return console.log(err.stack)})
            }else {
                for (const [key, value] of Object.entries(schema)) {
                    Guild.updateOne({
                        guildID: this.guild.id,
                        [`${key}`]: {$exists : false},
                    }, {
                        $set: {
                            [`${key}`]: value,
                        }
                    }).catch(err => {return console.log(err.stack)})
                }
            }
        }).catch(err => {return console.log(err.stack)})
        return this
    }

    async slashUpdate(){
        await Guild.findOne({
            guildID: this.guild.id,
            Commands: {$exists : true},
        })
        .then(data => {
            if(!data){
                return this.FillMissing('Commands')
            }
            this.client.slash.forEach(cmds => {
                if(!cmds.data || !cmds.data.name) return;
                if(!cmds.category) return;
                if(!data.Commands){
                    return this.FillMissing('Commands')
                }

                if(!data.Commands.has(cmds.data.name.toLowerCase())){
                    data.Commands.set(cmds.data.name.toLowerCase(), new Discord.Collection())
                    let newItem = data.Commands.get(cmds.data.name.toLowerCase())
                        newItem.set("Enabled", true)
                        newItem.set("Permissions", [])
                        newItem.set("NotAllowedRole", [])
                        newItem.set("NotAllowedChannel", [])
                        newItem.set("AllowedChannel", [])
                    this.saveData(data.Commands, 'Commands')
                }
            })
        }).catch(err => {return console.log(err.stack)})
        return this
    }

    async CommandUpdate(){
        await Guild.findOne({
            guildID: this.guild.id,
            Commands: {$exists : true},
        })
        .then(data => {
            if(!data){
                return this.FillMissing('Commands')
            }
            this.client.commands.forEach(cmds => {
                if(!cmds.name) return;
                if(!cmds.category|| cmds.category.toLowerCase() == 'owner') return;
                if(!data.Commands){
                    return this.FillMissing('Commands')
                }
                if(!data.Commands.has(cmds.name.toLowerCase())){
                    data.Commands.set(cmds.name.toLowerCase(), new Discord.Collection())
                    let newItem = data.Commands.get(cmds.name.toLowerCase())
                        newItem.set("Enabled", true)
                        newItem.set("Permissions", [])
                        newItem.set("NotAllowedRole", [])
                        newItem.set("NotAllowedChannel", [])
                        newItem.set("AllowedChannel", [])
                    this.saveData(data.Commands, 'Commands')
                }
            })
        }).catch(err => {return console.log(err.stack)})
        return this
    }

    async ModuleUpdate(){
        await Guild.findOne({
            guildID: this.guild.id,
            Modules: {$exists : true},
        })
        .then(data => {
            if(!data){
                return this.FillMissing('Modules')
            }
            this.client.commands.forEach(async cmds => {
                if(!cmds.category || cmds.category.toLowerCase() == 'owner') return
                if(!data.Modules){
                    return this.FillMissing('Modules')
                }
                if(!data.Modules.has(cmds.category.toLowerCase())){
                    data.Modules.set(cmds.category.toLowerCase(), new Discord.Collection())
                    let newItem = data.Modules.get(cmds.category.toLowerCase())
                    newItem.set("Enabled", true)
                    this.saveData(data.Modules, "Modules")
                }
            })

            this.client.slash.forEach(async cmds => {
                if(!cmds.category) return;
                if(!data.Modules){
                    return this.FillMissing('Modules')
                }
                if(!data.Modules.has(cmds.category.toLowerCase())){
                    data.Modules.set(cmds.category.toLowerCase(), new Discord.Collection())
                    let newItem = data.Modules.get(cmds.category.toLowerCase())
                    newItem.set("Enabled", true)
                    this.saveData(data.Modules, "Modules")
                }
            })
        }).catch(err => {return console.log(err.stack)})
        return this
    }

    async FillMissing(type){
        switch(type){
            case 'Modules':
                await Guild.updateOne({
                    guildID: this.guild.id
                }, {
                    $set: {
                        "Modules": new Discord.Collection()
                    }
                }).catch(err => {return console.log(err.stack)})
                this.ModuleUpdate()
            break;
            case 'Commands':
                await Guild.updateOne({
                    guildID: this.guild.id
                }, {
                    $set: {
                        "Commands": new Discord.Collection()
                    }
                }).catch(err => {return console.log(err.stack)})
                this.CommandUpdate()
            break;
        }
    }

    async setupRanks(){
        await Guild.findOneAndUpdate({
            guildID: this.guild.id,
            RankSettings: {$exists : false},
        }, {
            RankSettings: {
                Channel: '',
                NoExpRole: 'noexp',
                NoExpChannel: [],
                MinExp: 10,
                MaxExp: 25,
                ExpCD: 60000,
                ExpMulti: 1,
                GuildCard: "https://media.discordapp.net/attachments/880768542482509874/923233761523544095/sadbotRankcard.png",
                LvlupMsg: "GG {member}, you have reached level {level} 🎉",
            },
        })
        .catch(err => {return console.log(err.stack)})
        return this
    }

    async setGuildChannels(){
        await GuildChannel.findOne({
            guildID: this.guild.id
        })
        .then(async res => {
            if(!res){
                await GuildChannel.updateOne({
                    guildID: this.guild.id
                }, {
                    guildName: this.guild.name,
                    Active: true
                }, {upsert: true})
                .catch(err => {return console.log(err.stack)})
            }
        }).catch(err => {return console.log(err.stack)})
        return this
    }

    async setGuildRoles(){
        await GuildRole.findOne({
            guildID: this.guild.id
        })
        .then(async res => {
            if(!res){
                await GuildRole.updateOne({
                    guildID: this.guild.id
                }, {
                    guildName: this.guild.name,
                    Active: true
                }, {upsert: true})
                .catch(err => {return console.log(err.stack)})
            }
        }).catch(err => {return console.log(err.stack)})
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
                }

                for(let [key] of cmds){
                    let arr = []
                    this.client.commands.forEach(data => {
                        if(!data.name) return
                        if(!data.category || data.category == 'Owner') return

                        arr.push(data.name.toLowerCase())
                    })
                    this.client.slash.forEach(slash => {
                        arr.push(slash.data.name.toLowerCase())
                    })

                    if(!arr.includes(key.toLowerCase())){
                        await Guild.updateMany({
                            [`Commands.${key}`]: {$exists: true}
                        }, {
                            $unset: {
                                [`Commands.${key}`]: {$exists: true}
                            }
                        })
                    }
                }
            })
        }).catch(err => {return console.log(err.stack)})
    }
}

module.exports = GuildManager