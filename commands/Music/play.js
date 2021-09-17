// const ytdl = require("discord-ytdl-core");
// const ytSearch = require('yt-search');
// const { play } = require("../../utils/MusicPlayer");
// const ms = require('ms');
// const { MessageEmbed } = require("discord.js");
// const { joinVoiceChannel } = require('@discordjs/voice');
// module.exports = {
//     name: 'play',
//     aliases: ['p'],
//     run: async(client, message, args, prefix, cmd) =>{
//         const { channel } = message.member.voice;

//         const connect = joinVoiceChannel({
//             channelId: channel.id,
//             guildId: channel.guild.id,
//             adapterCreator: channel.guild.voiceAdapterCreator
//         });

//         const server_queue = client.queue.get(message.guild.id);

//             if (!args.length) return message.channel.send('You need to send the second argument!');
//             let song = {};

//             if (ytdl.validateURL(args[0])) {
//                 const song_info = await ytdl.getInfo(args[0]);

//                 var toHHMMSS = (secs) => {
//                     var sec_num = parseInt(secs, 10)
//                     var hours   = Math.floor(sec_num / 3600)
//                     var minutes = Math.floor(sec_num / 60) % 60
//                     var seconds = sec_num % 60
                
//                     return [hours,minutes,seconds]
//                         .map(v => v < 10 ? "0" + v : v)
//                         .filter((v,i) => v !== "00" || i > 0)
//                         .join(":")
//                 }
//                 song = { 
//                     title: song_info.videoDetails.title, 
//                     url: song_info.videoDetails.video_url, 
//                     timestamp: toHHMMSS(song_info.videoDetails.lengthSeconds), 
//                     thumbnails: song_info.videoDetails.thumbnails[4 ? 3 : 2].url, 
//                     author: song_info.videoDetails.author.name}
//                 } else {

//                 const video_finder = async (query) =>{
//                     const video_result = await ytSearch(query);
//                     return (video_result.videos.length > 1) ? video_result.videos[0] : null;
//                 }

//                 const video = await video_finder(args.join(' '));
//                 if (video){
//                     song = { 
//                         title: video.title, 
//                         url: video.url, 
//                         timestamp: video.timestamp, 
//                         thumbnails: video.thumbnail,
//                         author: video.author.name
//                     }
//                 } else {
//                     message.channel.send('Error finding video.');
//                 }
//             }

//             if (!server_queue){

//                 const queue_constructor = {
//                     voice_channel: channel,
//                     text_channel: message.channel,
//                     connection: null,
//                     songs: [],
//                     filters: "",
//                     loop: false,
//                     volume: 50,
//                     realseek: 0,
//                 }
                
//                 client.queue.set(message.guild.id, queue_constructor);
//                 queue_constructor.songs.push(song);
    
//                 try {
//                     const connection = await channel.join();
//                     queue_constructor.connection = connection;
//                     play(client, message.guild.id, queue_constructor.songs[0]);
//                 } catch (err) {
//                     client.queue.delete(message.guild.id);
//                     let Embed = {
//                         color: "#ff4a4a",
//                         description: `There was an error connecting!`
//                     };

//                     message.channel.send({embeds: [Embed]});
//                     throw err;
//                 }
//             } else{
//                 server_queue.songs.push(song);
                
//                 let Embed = {
//                     color: "#fffafa",
//                     description: `Added to queue - [${song.title}](${song.url})`
//                 };
//                 return message.channel.send({embeds: [Embed]});
//             }
//         }
    
// }