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
           ownerID: this.guild.ownerId,
           Settings: new Discord.Collection(),
           Modules: new Discord.Collection(),
           Commands: new Discord.Collection()
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
                    Modules: new Discord.Collection(),
                    Commands: new Discord.Collection(),
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

    async setGuildChannels(){
        await GuildChannel.findOne({
            guildID: this.guild.id,
            Data: {$exists: true}
        })
        .then(async res => {
            if(!res) return

            res.Data.forEach(data => {
                if(data.name.toLowerCase() == 'banlog'){
                    this.updateData('Logchannels', 'banlog', data.channel)
                }
                if(data.name.toLowerCase() == 'messagelog'){
                    this.updateData('Logchannels', 'messagelog', data.channel)
                }
                if(data.name.toLowerCase() == 'userlog'){
                    this.updateData('Logchannels', 'userlog', data.channel)
                }
                if(data.name.toLowerCase() == 'myStoryLog'){
                    this.updateData('Logchannels', 'storylog', data.channel)
                }
                if(data.name.toLowerCase() == 'alertlog'){
                    this.updateData('Logchannels', 'alertlog', data.channel)
                }
            })
        }).catch(err => {return console.log(err.stack)})
        return this
    }

    async updateData(option ,type, data){
        await Guild.findOne({
            guildID: this.guild.id,
            [`${option}.${type}`]: {$exists: true}
        })
        .then(async res => {
            if(!res) return

            switch(type){
                case 'manager':
                case 'moderator':
                    GuildRole.deleteMany({
                        guildID: this.guild.id,
                    })
                break;
                default:
                    GuildChannel.deleteMany({
                        guildID: this.guild.id,
                    })
            }
        })
        await Guild.findOne({
            guildID: this.guild.id,
            [`${option}.${type}`]: {$exists: false}
        })
        .then(async res => {
            if(!res) return;

            await Guild.updateOne({
                guildID: this.guild.id,
                [`${option}.${type}`]: {$exists: false}
            }, {
                $set: {
                    [`${option}.${type}`]: data
                }
            })
            .catch(err => {return console.log(err.stack)});
        })
        .catch(err => {return console.log(err.stack)});
    }

    async setGuildRoles(){
        await GuildRole.findOne({
            guildID: this.guild.id,
            Roles: {$exists: true}
        })
        .then(async res => {
            if(!res) return

            res.Roles.forEach(data => {
                if(data.Name.toLowerCase() == 'manager'){
                    this.updateData('Roles', 'manager', data.Roles)
                }
                if(data.Name.toLowerCase() == 'moderator'){
                    this.updateData('Roles', 'moderator', data.Roles)
                }
            })
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