const Discord = require('discord.js');
const { Guild, GuildRole, Profiles } = require('../../models');
let config = require('../../config.json');
const { Permissions } = require('discord.js');
let TimeOut = {};
const ms = require('ms')
module.exports = {
    event: 'messageCreate',
    once: false,
    run: async(message, client) =>{
        try {
            if(message.author.bot) return;
            if(message.channel.type === 'DM') return;

            let minExp;
            let maxExp;
            let boost;
            let CD;
            let lvlupMsg;
            let lvlupChan;
            let Module;
            let roles;
            
            async function fetchGuildData(){
                await Guild.findOne({
                    guildID: message.guild.id
                }).then(res => {
                    if(res){
                        const { Modules, Roles } = res;
                        let rankMod = Modules.get("ranks")
                        if(rankMod && rankMod.Enabled == false){
                            Module = false
                        }
                        roles = Roles ? Roles : null

                        const {MinExp, MaxExp, ExpMulti, ExpCD, LvlupMsg, Channel} = res.RankSettings
                        minExp = MinExp ? MinExp : 10
                        maxExp = MaxExp ? MaxExp : 25
                        boost = ExpMulti ? ExpMulti : 1
                        CD = ExpCD ? ExpCD : 60000
                        lvlupMsg = LvlupMsg ? LvlupMsg : "GG {member} you have reached level {level} 🎉"
                        lvlupChan = Channel.length ? Channel : message.channel.id
                    }
                }).catch(err => {return console.log(err.stack)});

                if(Module == false) {return
                }else {
                    coolDown()
                    checkRole()
                }
            }

            async function checkRole(){
                if(!message.guild.me.permissions.has("MANAGE_ROLES")){
                    return
                }
                fetchUserData().then(data => {
                    if(!data) return

                    let { Level } = data.Rank
                    if(!Level) Level = 0

                    if(roles){
                    let rData = roles.get(Level.toString())
                    if(rData){
                    let guildRole = message.guild.roles.resolve(rData)
                    if(guildRole){
                    if(!message.member.roles.cache.has(guildRole.id)){
                    let botRole = message.guild.members.resolve( client.user ).roles.highest.position;
                    if(guildRole.position > botRole){
                        return
                    }else {
                    message.member.roles.add(guildRole.id)
                    .catch(err => {return console.log(err.stack)})}}}}
                }
                })
            }

            async function fetchUserData(){
                let userData = await Profiles.findOne({
                    guildID: message.guild.id,
                    userID: message.author.id
                }).catch(err => {return console.log(err.stack)})

                return userData
            }

            function coolDown(){
                let userData
                let expAmt = Math.floor(Math.random() * (maxExp - minExp)) + minExp * boost

                fetchUserData().then(data => {
                    if(!data){
                        return Increment(expAmt)
                    }else{ 
                        userData = data

                        let { CoolDown } = userData.Rank;

                        if(!CoolDown || CoolDown == undefined || CoolDown <= message.createdTimestamp){
                            Increment(expAmt)
                        }else if(CoolDown && CoolDown >= message.createdTimestamp){
                            return
                        }
                    }
                })
            }

            async function Increment(expAmt){
                await Profiles.findOneAndUpdate({
                    guildID: message.guild.id,
                    userID: message.author.id
                }, {
                    $inc: {
                        "Rank.Experience": expAmt,
                        "Rank.TotalMsg": 1,
                        "Rank.TotalExp": expAmt
                    },
                    'Rank.CoolDown': message.createdTimestamp + 100 //COOLDOWN
                }, {upsert: true})
                .then(() => lvlUp())
                .catch(err => {return console.log(err.stack)})      
            }

            async function lvlUp(){
                await Profiles.findOne({
                    guildID: message.guild.id,
                    userID: message.author.id
                })
                .then(async res => {
                    const ExpInc = (lvl) => lvl * lvl * 200
                    let { Experience, Level } = res.Rank
                    if(!Level) Level = 0
    
                    let required = ExpInc(Level ? Level : 0)
    
                    if(Experience >= required){
                        ++Level
                        Experience -= required
    
                        let nextLvl = ExpInc(Level)

                        await Profiles.updateOne({
                            guildID: message.guild.id,
                            userID: message.author.id
                        }, {
                            $set: {
                                "Rank.Experience": Experience,
                                "Rank.Level": Level,
                                "Rank.NextLvlExp": nextLvl,
                            }
                        }).then(async res => {
                            if(roles){
                                let rData = roles.get(Level.toString())
                                if(rData){
                                    let guildRole = message.guild.roles.resolve(rData)
                                    if(guildRole){
                                        message.member.roles.add(guildRole.id)
                                        .catch(err => {return console.log(err.stack)})
                                    }
                                }
                            }
                            let channel = message.guild.channels.resolve(lvlupChan)

                            if(channel){
                                channel.send({content: vars(lvlupMsg, Level)}).catch(err => {return console.log(err.stack)})
                            }else {
                                message.channel.send({content: vars(lvlupMsg, Level)}).catch(err => {return console.log(err.stack)})
                            } 
                        }) 
                    }
                })
                .catch(err => {return console.log(err.stack)})
            }

            function vars(arr, lvl){
                return arr
                .replace(/{member}/g, `${message.author}`)
                .replace(/{member.name}/g, `${message.author.username}`)
                .replace(/{member.tag}/g, `${message.author.tag}`)
                .replace(/{server}/g, `${message.guild.name}`)
                .replace(/{member.id}/g, `${message.author.id}`)
                .replace(/{server.id}/g, `${message.guild.id}`)
                .replace(/{level}/g, `${lvl}`)
                .replace(/{user}/g, `${message.author}`)
                .replace(/{user.name}/g, `${message.author.username}`)
                .replace(/{user.tag}/g, `${message.author.tag}`)
                .replace(/{user.id}/g, `${message.author.id}`)
            }
            
            fetchGuildData()
        }catch(err){
            return console.log(err.stack)
        }
        
    }
}