const Discord = require('discord.js');
const client = require('../..');
const {Schedule} = require('../../localDb')
const fs = require("fs");
const path = require('path');
const { CrimsonSettings } = require('../../models')
client.eventEmitter.on('scheduleCheck', async(data) => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();

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

    // function calcTime(city, offset) {
    //     // create Date object for current location
    //     var d = new Date();
    
    //     // convert to msec
    //     // subtract local time zone offset
    //     // get UTC time in msec
    //     var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    
    //     // create new Date object for different city
    //     // using supplied offset
    //     var nd = new Date(utc + (3600000*offset));
    
    //     // return time as a string
    //     return "The local time for city"+ city +" is "+ nd.toLocaleString();
    // }



    // let guild = client.guilds.cache.get('874975341347762206')
    // let channel = guild.channels.cache.get('874975341347762209')

    // console.log(dd + '/' + mm + '/' + yyyy)
    // if(dd == 29 && mm == 6 && yyyy == 2022){
    //     console.log("HMMM")
    //     channel.send("HELLO").catch(err => console.log(err.stack))
    // }
    // console.log(calcTime('Dhaka', '+6'));
});