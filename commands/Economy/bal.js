// const discord = require('discord.js');
// const { Guild, Profiles } = require('../../models');
// module.exports = {
//     name: 'bal',
//     run: async(client, message, args, prefix) =>{
//         let workMon = 10

//         Profiles.findOne({
//                 guildID: message.guild.id,
//                 userID: message.author.id
//             }).then((res) => {
//                 message.channel.send("Balance is "+res.Economy.Balance)
//         }).catch(err => {return console.log(err.stack)})
//     }
// }