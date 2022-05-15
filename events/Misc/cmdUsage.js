const Discord = require('discord.js');
const client = require('../..');
const {Stats} = require('../../models')

client.eventEmitter.on('CmdUsed', async(Member, cmd, guild) => {
    if(Member.user){
        if(Member.user.bot == true) return
    }

    else if (Member.bot == true) return;

    let memId = Member.user ? Member.user.id : Member.id ? Member.id : Member

    let data = await Stats.findOne({
        guildID: guild.id ? guild.id : guild,
        userID: memId,
        Stats: {$exists: true}
    }).catch(err => {return console.log(err.stack)})

    if(!data){
        await Stats.updateOne({
            guildID: guild.id ? guild.id : guild,
            userID: memId,
        }, {
            "Stats": {
                "Mute": 0,
                "Warn": 0,
                "Ban": 0,
                "Timeout": 0,
                "Kick": 0
            }
        }, {upsert: true}).catch(err => {return console.log(err.stack)})
        return;
    }

    await Stats.updateOne({
        guildID: guild.id ? guild.id : guild,
        userID: memId
    }, {
        $inc: {
            [`Stats.${cmd}`]: 1
        }
    }, {upsert: true}).catch(err => {return console.log(err.stack)})
});