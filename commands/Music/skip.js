// const { MessageEmbed } = require("discord.js");

// module.exports = {
//     name: 'skip',
//     aliases: ['s'],
//     run: async(client, message, args, prefix, cmd) =>{
//         const voice_channel = message.member.voice.channel;
//         if (!voice_channel) return message.channel.send('You need to be in a channel to execute this command!');
//         const permissions = voice_channel.permissionsFor(message.client.user);
//         if (!permissions.has('CONNECT')) return message.channel.send('You dont have the correct permissins');
//         if (!permissions.has('SPEAK')) return message.channel.send('You dont have the correct permissins');

//         const server_queue = message.client.queue.get(message.guild.id);

//         skip_song(message, server_queue);
//     }
// }

// const skip_song = (message, server_queue) => {
//     if (!message.member.voice.channel) return message.channel.send('You need to be in a channel to execute this command!');
//     if(!server_queue){
//         let Embed = {
//             description: "There's no songs to skip",
//             color: '#fc4444'
//         }
            
//         return message.channel.send({embeds: [Embed]}).then(m=>setTimeout(() => m.delete(), 1000 * 10))
//     }
//     server_queue.connection.dispatcher.end();

//     const embed = new MessageEmbed()
//         .setDescription("Song skipped")
//         .setColor("#45f766")
//     message.channel.send({embeds: [embed]})
// }