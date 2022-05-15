const Discord = require('discord.js');
const client = require('../..');
const {Stats} = require('../../models')

client.eventEmitter.on('CmdUsed', async(Member, cmd) => {
    if(Member.user){
        if(Member.user.bot == true) return
    }

    else if (Member.bot == true) return;

    let memId = Member.user ? Member.user.id : Member.id ? Member.id : Member

    let data = await Stats.findOne({
        guildID: Member.guild.id,
        userID: memId,
        Stats: {$exists: true}
    })

    if(!data){
        await Stats.updateOne({
            guildID: Member.guild.id,
            userID: memId,
        }, {
            "Stats": {
                "Mute": 0,
                "Warn": 0,
                "Ban": 0,
                "Timeout": 0,
                "Kick": 0
            }
        }, {upsert: true})
        return;
    }

    await Stats.updateOne({
        guildID: Member.guild.id,
        userID: memId
    }, {
        $inc: {
            [`Stats.${cmd}`]: 1
        }
    }, {upsert: true})
});