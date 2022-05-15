// const MapFilter = new Map();
// const LIMIT = 5;
// const DIFF = 5000;
// const Discord = require('discord.js');
// module.exports = {
//     event: "messageCreate",
//     once: false,
//     run: async(message)=> {
//         if(message.author.bot) return;
//         if(!MapFilter.has(message.guild.id)){
//             return MapFilter.set(message.guild.id, new Discord.Collection());
//         }

//         let guild = MapFilter.get(message.guild.id);
//         if(!guild) return;

//         if(guild.has(message.author.id)){
//             let userData = guild.get(message.author.id);
//             let { lastMessage, timer, msgCount } = userData;
//             const difference = message.createdTimestamp - lastMessage.createdTimestamp;
//             console.log(msgCount+"MMM")
//             let messageCount = msgCount;
//             if(difference > DIFF){
//                 clearTimeout(timer)

//                 msgCount = 1;
//                 lastMessage = message;
//                 timer = setTimeout(() => {
//                     guild.delete(message.author.id);
//                 }, 5000);
//                 guild.set(message.author.id, userData);
//             }
//             else {
//                 ++messageCount;
//                 let Arr = [];

//                 console.log(messageCount)
//                 if(parseInt(messageCount) === LIMIT) {
//                     await message.channel.messages.fetch({
//                         limit: 100
//                     }).then(async msg => {
//                         msg.forEach(items => {
//                             Arr.push(...[items].filter((m)=> m.author.id == message.author.id && !m.pinned))
//                         })
//                     });

//                     let Messages = Arr.slice(0, messageCount)
//                     await message.channel.bulkDelete(Messages, true).catch(err => {return console.log(err)})
//                     await message.channel.send(`${message.author} Spamming is not allowed`).then(m=>setTimeout(() => m.delete(), 1000 * 5))
//                 } else {
//                     console.log("This in else: "+msgCount)
//                     msgCount = messageCount;
//                     guild.set(message.author.id, userData);
//                 }
//             }
//         }
//         else {
//             let fn = setTimeout(() => {
//                 guild.delete(message.author.id);
//             }, 5000);
//             guild.set(message.author.id, {
//                 msgCount: 1,
//                 lastMessage : message,
//                 timer : fn
//             });
//         }
//     }
// }