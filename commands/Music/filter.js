// const Discord = require("discord.js");
// const { play } = require("../../utils/MusicPlayer");

// module.exports = {
//     name: 'filter',
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
//                 'bass=g=20,dynaudnorm=f=200',//bassboost
//                 'apulsator=hz=0.08', //8D
//                 'aresample=48000,asetrate=48000*0.8',//vaporwave
//                 'aresample=48000,asetrate=48000*1.25',//nightcore
//                 'aphaser=in_gain=0.4',//phaser
//                 'tremolo',//tremolo
//                 'vibrato=f=6.5',//vibrato
//                 'surround',//surrounding
//                 'apulsator=hz=1',//pulsator
//                 'asubboost',//subboost
//                 "bass=g=5,dynaudnorm=f=200",
//             ];

//             const filterName = filterArr.replace('bass=g=20,dynaudnorm=f=200', 'Bass-boost')
//                 .replace('apulsator=hz=0.08', '8D')
//                 .replace('aresample=48000,asetrate=48000*0.8', 'Vaporwave')
//                 .replace('aresample=48000,asetrate=48000*1.25', 'Nightcore')
//                 .replace('aphaser=in_gain=0.4', 'Phaser')
//                 .replace('tremolo', 'Tremolo')
//                 .replace('vibrato=f=6.5', 'Vibrato')
//                 .replace('apulsator=hz=1', 'Pulsator')
//                 .replace('apulsator=hz=1', 'Sub-boost')
//                 .replace('bass=g=5,dynaudnorm=f=200', 'None')

//             if (!args.length){
//                 tutEmbed.setDescription(`Active filters: ${server_queue.filters ? filterName : "None"}`)
//                 tutEmbed.addField("Filters", [
//                     `Bass-boost`,
//                     `8D`,
//                     `Vaporwave`,
//                     `Nightcore`,
//                     `Phaser`,
//                     `tremolo`,
//                     `vibrato`,
//                     `surround`,
//                     `pulsator`,
//                     `sub-boost`,
//                     `clear`
//                 ])
//                 tutEmbed.setFooter(`${prefix}filter [ filter name ]`)
//                 message.channel.send({embeds: [tutEmbed]})
//                 return
//             }
    
//             let filterVar; let filter;
//             switch(args[0]){
//                 case "bass-boost":
//                 case "bassboost":
//                     filterVar = 0
//                     break;
//                 case "8D":
//                 case "8d":
//                     filterVar = 1
//                     break;
//                 case "vaporwave":
//                     filterVar = 2
//                     break;
//                 case "nightcore":
//                     filterVar = 3
//                     break;
//                 case "phaser":
//                     filterVar = 4
//                     break;
//                 case "tremolo":
//                     filterVar = 5
//                     break;
//                 case "vibrato":
//                     filterVar = 6
//                     break;
//                 case "surround":
//                     filterVar = 7
//                     break;
//                 case "pulsator":
//                     filterVar = 8
//                     break;
//                 case "subboost":
//                     filterVar = 9
//                     break;
//                 case "clear":
//                 case "off":
//                     filterVar = 10
//                     break;
//                 default:
//                     tutEmbed.setDescription(`Active filters: ${server_queue.filters ? filterName : "None"}`)
//                     tutEmbed.addField("Filters", [
//                         `Bass-boost`,
//                         `8D`,
//                         `Vaporwave`,
//                         `Nightcore`,
//                         `Phaser`,
//                         `tremolo`,
//                         `vibrato`,
//                         `surround`,
//                         `pulsator`,
//                         `sub-boost`,
//                         `clear`
//                     ])
//                     tutEmbed.setFooter(`${prefix}filter [ filter name ]`)
//                     return message.channel.send({embeds: [tutEmbed]})
                
//             }
//             filter = filters[filterVar]
//             if(filterVar === 404){
//                 return
//             }
//             const song = server_queue.songs[0];
//             play(client, message.guild.id, song, filter);
//         }else {
//             tutEmbed.setDescription(`Please play a song to use filters`)
//             tutEmbed.addField("Filters", [
//                 `Bass-boost`,
//                 `8D`,
//                 `Vaporwave`,
//                 `Nightcore`,
//                 `Phaser`,
//                 `tremolo`,
//                 `vibrato`,
//                 `surround`,
//                 `pulsator`,
//                 `sub-boost`,
//                 `clear`
//             ])
//             tutEmbed.setFooter(`${prefix}filter [ filter name ]`)
//             message.channel.send({embeds: [tutEmbed]})
//         }
//     }
// }