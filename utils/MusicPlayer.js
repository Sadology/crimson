// const ytdl = require("discord-ytdl-core");
// const { MessageEmbed } = require("discord.js");
// const ytSearch = require('yt-search');

// module.exports = {
//     async play(client, message, song, filters){
//         let queue = client.queue.get(message);

//         let encoderArgstoset;
//         let oldSeekTime = queue.realseek
//         let seekTime = 0;
//         if(filters === 'remove'){
//             queue.filters = ['-af','bass=g=0,dynaudnorm=f=200'];
//             encoderArgstoset = queue.filters;

//             try{
//                 seekTime = (queue.connection.dispatcher.streamTime - queue.connection.dispatcher.pausedTime) / 1000 + oldSeekTime;
//                 console.log(seekTime, queue.connection.dispatcher.streamTime)
//             } catch{
//                 seekTime = 0;
//             } 
//             queue.realseek = seekTime;
//         }else if(filters){
//             try{
//                 seekTime = (queue.connection.dispatcher.streamTime - queue.connection.dispatcher.pausedTime) / 1000 + oldSeekTime;
//                 console.log(seekTime, queue.connection.dispatcher.streamTime)
//             } catch(err){
//                 console.log(err)
//             } 
//             queue.realseek = seekTime;
//             queue.filters = filters
//             encoderArgstoset = ['-af', queue.filters]
//         }
//         video_player(client, message, song, encoderArgstoset, seekTime)
//     }
// }

// const video_player = async (client, message, song, filter, seekTime) => {
//     const song_queue = client.queue.get(message);

//     if (!song) {
//         client.queue.delete(message);
//         return;
//     }
//     const stream = ytdl(song.url, { 
//         filter: 'audioonly',
//         opusEncoded: true,
//         highWaterMark: 1<<25,
//         encoderArgs: filter ? filter : ['-af','bass=g=0,dynaudnorm=f=200']

//     });
//     song_queue.connection.play(stream, {seek: seekTime, volume: 1, type: "opus", quality: "highestaudio", bitrate: 640})
//     .on('finish', () => {
//         song_queue.songs.shift();
//         video_player(client, message, song_queue.songs[0]);
//     });
//     const embed = new MessageEmbed()
//         .setAuthor(`Sadbot Music - Now Playing`)
//         .setDescription(`[${song.title}](${song.url})`)
//         .addField("Duration", `\`${song.timestamp}\``, true)
//         .setColor("#fffafa")
//         .addField("Artist", `\`${song.author}\``, true)
//         .setThumbnail(song.thumbnails)
        
//     await song_queue.text_channel.send({embeds: [embed]})
// }