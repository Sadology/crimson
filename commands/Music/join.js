// const { MessageEmbed } = require("discord.js");

// module.exports = {
//     name: 'join',
//     run: async(client, message, args, prefix, cmd) =>{
//         const voice_channel = message.member.voice.channel;
//         if (!voice_channel) return message.channel.send('You need to be in a channel to execute this command!');
//         const permissions = voice_channel.permissionsFor(message.client.user);
//         if (!permissions.has('CONNECT')) return message.channel.send('You dont have the correct permissins');
//         if (!permissions.has('SPEAK')) return message.channel.send('You dont have the correct permissins');

//         voice_channel.join()

//         let embed = new MessageEmbed()
//             .setDescription(`Joined voice-channel ${voice_channel.name}`)
//             .setColor("#45f766")
//         message.channel.send({embeds: [embed]}).then((m) =>{
//             m.delete({timeout: 1000 * 5})
//         })
//     }
// }