// const Discord = require("discord.js");
// const { play } = require("../../utils/MusicPlayer");

// module.exports = {
//     name: 'bassboost',
//     aliases: ['bass-boost'],
//     run: async(client, message, args, prefix, cmd) =>{
//         const voice_channel = message.member.voice.channel;
//         if (!voice_channel) return message.channel.send('You need to be in a channel to execute this command!');
//         const permissions = voice_channel.permissionsFor(message.client.user);
//         if (!permissions.has('CONNECT')) return message.channel.send('You dont have the correct permissins');
//         if (!permissions.has('SPEAK')) return message.channel.send('You dont have the correct permissins');
        
//         const server_queue = message.client.queue.get(message.guild.id);
//         const tutEmbed = new Discord.MessageEmbed()
//             .setAuthor("Sadbot Music - Filters")
//             .setColor("#fffafa")
//         if(server_queue){
//             const filterArr = server_queue.filters

//             const filters = [
//                 'bass=g=5',//Low
//                 'bass=g=7', // Friendly
//                 'bass=g=10',//Medium
//                 'bass=g=15',//High
//                 'bass=g=20',//Extreme
//                 'bass=g=30', // Crazy
//                 'bass=g=0,dynaudnorm=f=200',//Clear
//                 'bass=g=100', // UNBELIVEABLE
//             ];

//             const filterName = filterArr.replace('bass=g=5,dynaudnorm=f=200', 'Low')
//                 .replace('bass=g=6', 'Friendly')
//                 .replace('bass=g=10', 'Medium')
//                 .replace('bass=g=15', 'High')
//                 .replace('bass=g=20', 'Extreme')
//                 .replace('bass=g=30', 'Crazy')
//                 .replace('bass=g=0,dynaudnorm=f=200', 'None')

//             if (!args.length){
//                 tutEmbed.setDescription(`Bass-Boost Level: ${server_queue.filters ? filterName : "None"}`)
//                 tutEmbed.addField("Filters", [
//                     `Low`,
//                     `friendly`,
//                     `Medium`,
//                     `High`,
//                     `Extreme`,
//                     `Crazy`,
//                     `clear`
//                 ])
//                 tutEmbed.setFooter(`${prefix}bass-boost [ Level ]`)
//                 message.channel.send({embeds: [tutEmbed]})
//                 return
//             }
    
//             let filterVar; let filter;
//             switch(args[0]){
//                 case "low":
//                     filterVar = 0
//                     break;
//                 case "friendly":
//                     filterVar = 1
//                     break;
//                 case "medium":
//                     filterVar = 2
//                     break;
//                 case "high":
//                     filterVar = 3
//                     break;
//                 case "extreme":
//                     filterVar = 4
//                     break;
//                 case "crazy":
//                     filterVar = 5
//                     break;
//                 case "clear":
//                 case "off":
//                     filterVar = 6
//                     break;
//                 case "unbeliveable":
//                     filterVar = 7
//                     break;
//                 default:
//                     tutEmbed.setDescription(`Bass-Boost Level: ${server_queue.filters ? filterName : "None"}`)
//                     tutEmbed.addField("Filters", [
//                         `Low`,
//                         `friendly`,
//                         `Medium`,
//                         `High`,
//                         `Extreme`,
//                         `Crazy`,
//                         `clear`
//                     ])
//                     tutEmbed.setFooter(`${prefix}bass-boost [ Level ]`)
//                     return message.channel.send({embeds: [tutEmbed]})
                
//             }
//             filter = filters[filterVar]
//             if(filterVar === 404){
//                 return
//             }
//             const song = server_queue.songs[0];
//             play(client, message.guild.id, song, filter);
//         }else {
//             tutEmbed.setDescription(`Play a song to use bass-boost`)
//             tutEmbed.addField("Filters", [
//                 `Low`,
//                 `friendly`,
//                 `Medium`,
//                 `High`,
//                 `Extreme`,
//                 `Crazy`,
//                 `clear`
//             ])
//             tutEmbed.setFooter(`${prefix}bass-boost [ Level ]`)
//             message.channel.send({embeds: [tutEmbed]})
//         }
//     }
// }