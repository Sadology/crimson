// const discord = require('discord.js');
// const { Guild, Profiles } = require('../../models');
// module.exports = {
//     name: 'work',
//     run: async(client, message, args, prefix) =>{
//         let workMon = 10

//         Guild.findOneAndUpdate({
//             guildID: message.guild.id,
//         }, {
//             $inc: {
//                 Balance: -workMon
//             }
//         }).then(() => {
//             Profiles.findOneAndUpdate({
//                 guildID: message.guild.id,
//                 userID: message.author.id
//             }, {
//                 guildName: message.guild.name,
//                 userName: message.author.tag,
//                 $inc: {
//                     'Economy.Balance': workMon
//                 }
//             }, {upsert: true}).then((res) => {
//                 message.channel.send("You've earned "+workMon)
//             }).catch(err => {return console.log(err.stack)})
//         }).catch(err => {return console.log(err.stack)})
//     }
// }