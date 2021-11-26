const Discord = require('discord.js');
const { Profiles } = require('../../models');
module.exports = {
    event: "presenceUpdate",
    once: false,
    run: async(oldPresence, newPresence, client)=> {
        // function checkChanges() {
        //     if(newPresence.status == 'online'){
        //         if(!oldPresence || oldPresence.status == 'offline'){
        //             onlinePresence()
        //         }
        //     }else if(oldPresence.status == 'online'){
        //         if(!newPresence || newPresence.status == 'offline'){
        //             offlinePresence()
        //         }
        //     }
        // }

        // checkChanges()

        // function onlinePresence(){
        //     client.guilds.cache.forEach(async g => {
        //         await Profiles.findOne({
        //             guildID: g.id,
        //             userID: newPresence.user.id
        //         }).then(res => {
        //             if(!res){
        //                 saveData('online', g)
        //             }else {
        //                 saveData('online', g)
        //             }
        //         })
        //         .catch(err => {
        //             return console.log(err)
        //         });
        //     });
        // }

        // function offlinePresence(){
        //     client.guilds.cache.forEach(async g => {
        //         await Profiles.findOne({
        //             guildID: g.id,
        //             userID: newPresence.user.id
        //         }).then(res => {
        //             if(!res){
        //                 saveData('offline', g)
        //             }else {
        //                 saveData('offline', g)
        //             }
        //         })
        //         .catch(err => {
        //             return console.log(err)
        //         });
        //     });
        // }

        // async function saveData(option, g) {
        //     switch(option){
        //         case 'online':
        //             await Profiles.findOneAndUpdate({
        //                 guildID: g.id,
        //                 userID: newPresence.user.id
        //             }, {
        //                 [`OnlineTime.OnlineSince`]: new Date(),
        //                 [`OnlineTime.LastOnline`]: null,
        //             }).catch(err => {
        //                 return console.log(err)
        //             })
        //         break;

        //         case 'offline':
        //             await Profiles.findOneAndUpdate({
        //                 guildID: g.id,
        //                 userID: newPresence.user.id
        //             }, {
        //                 [`OnlineTime.OnlineSince`]: null,
        //                 [`OnlineTime.LastOnline`]: new Date(),
        //             }).catch(err => {
        //                 return console.log(err)
        //             })
        //         break;
        //     }
        // }
    }
}