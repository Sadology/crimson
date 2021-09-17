// module.exports = {
//     name: 'moosic',
//     run: async(client, message, args, prefix, cmd) =>{

//         const voice_channel = message.member.voice.channel;
//         if (!voice_channel) return message.channel.send('You need to be in a channel to execute this command!');
//         const permissions = voice_channel.permissionsFor(message.client.user);
//         if (!permissions.has('CONNECT')) return message.channel.send('You dont have the correct permissins');
//         if (!permissions.has('SPEAK')) return message.channel.send('You dont have the correct permissins');

//         const music = args.join(" ")
//         const server_queue = client.queue.get(message.guild.id);
//         client.distube.play(message, music)
//     }
    
// }