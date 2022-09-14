// const Discord = require('discord.js');
// const { MessageEmbed } = require('discord.js');
// const client = require('../..');

// class EmojiResolver {
//     constructor(client, message){
//         this.client = client;
//         this.message = message;
//         this.found = false;
//     }

//     async Mainframe(){
//         if(!this.message.content.startsWith(':') && !this.message.content.endsWith(':')) return;
//         let sorted = this.message.content.split(':').slice().join('');

//         this.client.guilds.cache.forEach(async g => {
//             if(this.found == true) return;
//             let emote = g.emojis.cache.find(e => e.name.toLowerCase() == sorted.toLowerCase())
    
//             if(!emote) return;
//             this.found = true;

//             // Fetch guild webhooks
//             const hooks = await this.message.channel.fetchWebhooks();
//             const webHook = hooks.find(i => i.owner.id == client.user.id);
    
//             // Create a webhook and send the embed
//             if(!webHook){
//                 this.message.channel.createWebhook(this.client.user.username, {
//                     avatar: "https://media.discordapp.net/attachments/1011166042493554750/1014462638803124235/d8a321eca9d98f6e2fb4f27b634b6c23.png"
//                 })
//                 .then(async web => {
//                     await web.send({content: emote.toString(), username: this.message.author.username, avatarURL: this.message.author.displayAvatarURL({dynamic: true, size: 1024, format: 'png'})})
//                     .catch(err => {
//                         return console.log(err.stack)
//                     })
//                 })
//             }
//             else {
//                 await webHook.send({content: emote.toString(), username: this.message.author.username, avatarURL: this.message.author.displayAvatarURL({dynamic: true, size: 1024, format: 'png'})})
//                 .catch(err => {
//                     return console.log(err.stack)
//                 })
//             }

//             this.message.delete().catch(err => {return console.log(err.stack)})
//         })
//     }
// }
// client.on('messageCreate', async(message) => {
//     if(!message.guild.members.resolve(client.user).permissions.any(["MANAGE_WEBHOOKS"])){
//         return;
//     };

//     let guildArr = ["617360020459225138", "1011170283438223382", "1011160713584189463"]
//     let access = guildArr.find(i => i == message.channel.id)
//     if(!access) return;

//     let resolver = new EmojiResolver(client,  message).Mainframe()
// });