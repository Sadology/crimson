// const Discord = require("discord.js");

// module.exports = {
//     name: 'q',
//     run: async(client, message, args, prefix, cmd) =>{
//         const voice_channel = message.member.voice.channel;
//         if (!voice_channel) return message.channel.send('You need to be in a channel to execute this command!');
//         const permissions = voice_channel.permissionsFor(message.client.user);
//         if (!permissions.has('CONNECT')) return message.channel.send('You dont have the correct permissins');
//         if (!permissions.has('SPEAK')) return message.channel.send('You dont have the correct permissins');

//         const server_queue = message.client.queue.get(message.guild.id)
//         if(!server_queue){
//             const emptyEmbed = new Discord.MessageEmbed()
//                 .setAuthor("SadBot Music")
//                 .setDescription("The queue is empty")
//                 .setColor("#fffafa")
//             return message.channel.send({embeds: [emptyEmbed]})
//         }

//         let description = ""
//         for(let i = 0; i < server_queue.songs.length; i++){
//             description += `**${i + 1}.** [${server_queue.songs[i].title.substring(0,40)}](${server_queue.songs[i].url}) | \`${server_queue.songs[i].timestamp}\`\n`
//         }
//         let queueEmbed = new Discord.MessageEmbed()
//         .setTitle("Music Queue")
//         .setDescription(description)
//         .setColor("#fffafa");

//         message.channel.send({embeds: [queueEmbed]})
//     }
// }