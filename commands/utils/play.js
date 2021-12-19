// const Discord = require('discord.js');
// const ytdl = require('ytdl-core');
// const { joinVoiceChannel, 
//     createAudioPlayer, 
//     createAudioResource,
//     AudioPlayerStatus,
//     NoSubscriberBehavior,
//     demuxProbe,
//     StreamType
// } = require('@discordjs/voice');
// module.exports = {
//     name: 'play',
//     description: "Ping! Pong!. Check bots ping",
//     permissions: ["MANAGE_MESSAGES"],
//     usage: "ping",
//     category: "Utils",
//     show: true,
//     run: async(client, message, args)=> {
//         const audioplayer = createAudioPlayer();

//         connection.on('stateChange', (oldState, newState) => {
//             console.log(`Connection transitioned from ${oldState.status} to ${newState.status}`);
//         });
//         audioplayer.on('stateChange', (oldState, newState) => {
//             console.log(`Audio player transitioned from ${oldState.status} to ${newState.status}`);
//         });

//         let stream = await ytdl(args[0], {
            
//         });

//         const resource = createAudioResource(stream);
//         let connection = joinVoiceChannel({
//             channelId: message.member.voice.channel.id,
//             guildId: message.guild.id,
//             adapterCreator: message.guild.voiceAdapterCreator
//         })

//         audioplayer.play(resource);
//         connection.subscribe(audioplayer);

//         audioplayer.on(AudioPlayerStatus.Playing, () => {
//             console.log('The audio player has started playing!');
//         });
//     }
// }