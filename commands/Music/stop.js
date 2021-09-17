// const { MessageEmbed } = require('discord.js');
// module.exports = {
//     name: 'stop',
//     run: async(client, message, args, prefix, cmd) =>{
//         const voice_channel = message.member.voice.channel;
//         if (!voice_channel) return message.channel.send('You need to be in a channel to execute this command!');
//         const permissions = voice_channel.permissionsFor(message.client.user);
//         if (!permissions.has('CONNECT')) return message.channel.send('You dont have the correct permissins');
//         if (!permissions.has('SPEAK')) return message.channel.send('You dont have the correct permissins');

//         const server_queue = message.client.queue.get(message.guild.id);
//         stop_song(message, server_queue, client);
//     }
// }

// const stop_song = (message, song_queue, client) => {
//     if (!message.member.voice.channel) return message.channel.send('You need to be in a channel to execute this command!');
//     client.queue.delete(message.guild.id);
//     song_queue.connection.dispatcher.end();
//     let embed = new MessageEmbed()
//         .setDescription("Stopped playing songs")
//         .setColor("#45f766")
//     message.channel.send({embeds: [embed]});
// }