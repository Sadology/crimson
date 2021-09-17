// const discord = require('discord.js');
// const { Profiles } = require('../../models');
// module.exports = {
//     name: 'work',
//     run: async(client, message, args, prefix) =>{
//         const amt = Math.floor(Math.random() * 1000)

//         const playerProfile = await Profiles.findOneAndUpdate({
//             guildID: message.guild.id,
//             userID: message.author.id
//         }, {
//             userName: message.author.tag,
//             guildName: message.guild.name,
//             Economy: null

//         }, {
//             upsert: true
//         })
//     }
// }