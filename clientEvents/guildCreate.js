const { Guild, GuildRole, GuildChannel } = require('../models')
const Discord = require('discord.js');
let moduleMap = new Map();
let cmdMap = new Map();

module.exports = async client =>{
    class GuildManager{
        constructor(client){
            this.Client = client
        }
        async GuildData(guild){
            createMap(this.Client)
            await Guild.findOneAndUpdate({
                guildID: guild.id,
            }, {
                guildName: guild.name,
                Active: true,
                prefix: ">",
                ownerID: guild.ownerId,
                Balance: 100000,
                Modules: moduleMap,
                Commands: cmdMap,
                RankSettings: {
                    Channel: '',
                    NoExpRole: 'no exp role',
                    NoExpChannel: [],
                    MinExp: 10,
                    MaxExp: 25,
                    ExpCD: 60000,
                    ExpMulti: 1,
                    GuildCard: "https://media.discordapp.net/attachments/880768542482509874/923233761523544095/sadbotRankcard.png",
                    LvlupMsg: "GG {member}, you have reached level {level} 🎉",
                },
            }, {upsert: true})
            .catch(err => {return console.log(err)})
        }

        async GuildChannels(guild){
            await GuildChannel.findOneAndUpdate({
                guildID: guild.id
            }, {
                guildName: guild.name,
                Active: true
            }, {upsert: true})
            .catch(err => {return console.log(err)})
        }

        async GuildRoles(guild){
            await GuildRole.findOneAndUpdate({
                guildID: guild.id
            }, {
                guildName: guild.name,
                Active: true
            }, {upsert: true})
            .catch(err => {return console.log(err.stack)})
        }
    }

    const GuildCreate = new GuildManager(client)

    client.on('guildCreate', async guild => {
        await Guild.findOne({guildID: guild.id})
        .then((res) =>{
            if(!res){
                GuildCreate.GuildData(guild)
            }
        })
        .catch(err => {return console.log(err.stack)});

        await GuildChannel.findOne({guildID: guild.id})
        .then((res) =>{
            if(!res){
                GuildCreate.GuildChannels(guild)
            }
        })
        .catch(err => {return console.log(err.stack)});

        await GuildRole.findOne({guildID: guild.id})
        .then((res) =>{
            if(!res){
                GuildCreate.GuildRoles(guild)
            }
        })
        .catch(err => {return console.log(err.stack)});
    });

    client.guilds.cache.forEach(async (guild) =>{
        const GuildDataCheck = async () =>{
            await Guild.findOne({guildID: guild.id})
            .then(async(res) =>{
                if(!res){
                    GuildCreate.GuildData(guild) 
                }else {
                    await Guild.findOneAndUpdate({
                        guildID: guild.id,
                        RankSettings: {$exists : false},
                    }, {
                        $set: {
                            'RankSettings.Channel': "",
                            'RankSettings.NoExpRole': 'exp blocker',
                            'RankSettings.NoExpChannel': [],
                            'RankSettings.MinExp': 10,
                            'RankSettings.MaxExp': 25,
                            'RankSettings.ExpCD': 60000,
                            'RankSettings.ExpMulti': 1,
                            'RankSettings.GuildCard': "https://media.discordapp.net/attachments/880768542482509874/923233761523544095/sadbotRankcard.png",
                            'RankSettings.LvlupMsg': "GG {member}, you have reached level {level} 🎉"
                        }
                    }).then(res => {
                    })

                    createMap(client).then(async() => {
                        await Guild.findOneAndUpdate({
                            guildID: guild.id,
                            Modules: {$exists : false},
                            Commands: {$exists : false},
                        }, {
                            $set: {
                                'Modules': moduleMap,
                                'Commands': cmdMap
                            }
                        }).then(res => {
                        }).catch(err => {return console.log(err.stack)});
                    });
                }
            })
            .catch(err => {return console.log(err.stack)});
    
            await GuildChannel.findOne({guildID: guild.id})
            .then((res) =>{
                if(!res){
                    GuildCreate.GuildChannels(guild)
                }
            })
            .catch(err => {return console.log(err.stack)});
    
            await GuildRole.findOne({guildID: guild.id})
            .then((res) =>{
                if(!res){
                    GuildCreate.GuildRoles(guild)
                }
            })
            .catch(err => {return console.log(err.stack)});
        
            setTimeout(GuildDataCheck, 1000 * 60 * 30 )
        }
        GuildDataCheck()
    })
}
async function createMap(client){
    client.commands.forEach(cmds => {
        if(!cmds.category || cmds.category == "Owner"){
            return
        }
        if(cmds.category.toLowerCase() == 'ranks'){
            moduleMap.set('ranks', new Discord.Collection())
        }
        if(!moduleMap.has(cmds.category.toLowerCase())){
            moduleMap.set(cmds.category.toLowerCase(), new Discord.Collection())
        }
        let moduleData = moduleMap.get(cmds.category.toLowerCase())
        moduleData.set("Enabled", true)
    })
    client.commands.forEach(cmds => {
        if(!cmds.category || cmds.category == "Owner"){
            return
        }
        if(!cmdMap.has(cmds.name.toLowerCase())){
            cmdMap.set(cmds.name.toLowerCase(), new Discord.Collection())
        }

        let cmdData = cmdMap.get(cmds.name.toLowerCase())
        cmdData.set("Enabled", true)
        cmdData.set("Permissions", [])
        cmdData.set("NotAllowedRole", [])
        cmdData.set("NotAllowedChannel", [])
        cmdData.set("AllowedChannel", [])
    })
    client.slash.forEach(slash => {
        if(!slash.category){
            return
        }
        if(!moduleMap.has(slash.category.toLowerCase())){
            moduleMap.set(slash.category.toLowerCase(), new Discord.Collection())
        }
        let moduleData = moduleMap.get(slash.category.toLowerCase())
        moduleData.set("Enabled", true)
    })
    client.slash.forEach(cmds => {
        if(!cmds.category){
            return
        }
        if(!cmdMap.has(cmds.data.name.toLowerCase())){
            cmdMap.set(cmds.data.name.toLowerCase(), new Discord.Collection())
        }

        let cmdData = cmdMap.get(cmds.data.name.toLowerCase())
        cmdData.set("Enabled", true)
        cmdData.set("Permissions", [])
        cmdData.set("NotAllowedRole", [])
        cmdData.set("NotAllowedChannel", [])
        cmdData.set("AllowedChannel", [])
    })
}

// Guild.findOneAndUpdate({
//     Active: true,
//     Balance: {$exists : false}
// }, {
//     $set: {'Balance': 1000000}
// }).catch(err => {return console.log(err)})