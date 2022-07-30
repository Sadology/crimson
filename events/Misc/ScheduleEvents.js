const Discord = require('discord.js');
const client = require('../..');
const { Schedule } = require('../../localDb');
const { CrimsonSettings } = require('../../models');

client.eventEmitter.on('scheduleCheck', async(data) => {
    var today = new Date();
    var utc = today.getTime() + (today.getTimezoneOffset() * 60000);
    var nd = new Date(utc + (3600000*'+6'));
    var dd = String(nd.getDate()).padStart(2, '0');
    var mm = String(nd.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = nd.getFullYear();

    let db = await CrimsonSettings.findOne({
        sentID: {$exists: true},
        ownerPass: "35689"
    }).catch(err => {return console.log(err.stack)});

    Schedule.forEach(async data => {
        if(db){
            const found = db.sentID.find(el => el == data.ID);
            if(found) return;
        }

        if(dd == data.day && mm == data.month && yyyy == data.year){
            let guild = await client.guilds.cache.get(data.server);
            if(!guild) return;

            let channel = await guild.channels.cache.get(data.channel);
            if(!channel) return;

            channel.send({content: data.message}).catch(err => {
                return console.log(err.stack)
            });

            await CrimsonSettings.findOneAndUpdate({
                sentID: {$exists: true},
                ownerPass: "35689"
            }, {
                $push: {
                    "sentID": data.ID
                }
            }, {upsert: true}).catch(err => {return console.log(err.stack)});
        }
    });
});