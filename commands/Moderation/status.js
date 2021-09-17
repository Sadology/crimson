// const Discord = require('discord.js');
// const { MessageEmbed } = require('discord.js');
// const { ModStats, GuildRole } = require('../../models');
// const moment = require('moment');

// module.exports = {
//     name: "status",

//     run: async(client, message, args,prefix) =>{

//         const permData = await GuildRole.findOne({
//             guildID: message.guild.id,
//             Active: true
//         });

//         const { author, content, guild } = message;

//         const missingPerm = new MessageEmbed()
//             .setAuthor(author.tag, author.displayAvatarURL({dynamic: false, format: "png", size: 1024}))
//             .setDescription("Missing permission to execute this command")
//             .setTimestamp()
//             .setColor('#ff303e')

//         const roleSet = permData.Moderator;
//         if (message.guild.ownerID !== message.author.id){
//             if(!message.member.permissions.has(["ADMINISTRATOR"])){
//                 if(permData.ModOptions.Enabled === true){
//                     if(!message.member.roles.cache.some(r=>roleSet.includes(r.id))){
//                         if(!message.member.permissions.has(["MANAGE_GUILD", "ADMINISTRATOR", "BAN_MEMBERS"])){
//                             return await message.channel.send({embeds: [missingPerm]} ).then(m=>setTimeout(() => m.delete(), 1000 * 10));
//                         }
//                     }
//                 }else if(permData.ModOptions.Enabled === false){
//                     if(!message.member.permissions.has(["BAN_MEMBERS", "MANAGE_GUILD", "ADMINISTRATOR"])){
//                         return await message.channel.send({embeds: [missingPerm]}).then(m=>setTimeout(() => m.delete(), 1000 * 10));
//                     }
//                 }
//             }
//         }

//         const Reason = content.split(/\s+/).slice(1).join(" "); // Message taht will show in status
//         const Time = new Date() // Following day date
//         const Embed = new MessageEmbed(); // EMBED

//         // Database Function
//         async function Status (value, msg, date){
//             await ModStats.findOneAndUpdate({
//                 guildID: message.guild.id, 
//                 userID: message.author.id
//             }, {
//                 userName: message.author.tag,
//                 Status: {
//                     Active: value,
//                     MSG: msg,
//                     Time: date
//                 }
//             }, {
//                 upsert: true
//             })
//         };


//         const Database = await ModStats.findOne({
//             guildID: message.guild.id,
//             userID: message.author.id,
//         });

//         if( !Database ){

//             Status(false, Reason ? Reason : null, Time)

//             if( !args[0] ){
//                 Embed.setAuthor(`${client.user.username} - STATUS`)
//                 Embed.setDescription("If status is enabled it will show your custom message if someone decided to ping you")
//                 Embed.addFields(
//                     {
//                         name: 'Usage', value: `${prefix}status [ Your custom message ]`,
//                     },
//                     {
//                         name: 'Example', value: `${prefix}status Busy right now. Ping another mod`
//                     }
//                 )
//                 Embed.setFooter("Require `Moderator` permission to use")
//                 Embed.setColor("#fffafa")
    
//                 await message.channel.send({embeds: [Embed]}).then((m) =>m.delete({timeout: 1000 * 10}));
//                 return false;
//             }else {

//                 Status(true, Reason ? Reason : null, Time)

//                 Embed.setAuthor(`${author.tag}`, author.displayAvatarURL({
//                     dynamic: true , type: 'png'}))
//                 Embed.setDescription(`> ${Reason}`)
//                 moment(Embed.setTimestamp()).format("LL")
//                 Embed.setColor("#fffafa")
    
//                 await message.channel.send({embeds: [Embed]})
//             }
//         }else if( Database ){

//             if( !Database.Status ){
//                 Status(false, Reason ? Reason : null, Time)
//             }

//             if(Database.Status.Active === false){
//                 if( !args[0] ){

//                     Embed.setAuthor(`${client.user.username} - STATUS`)
//                     Embed.setDescription("If status is enabled it will show your custom message if someone decided to ping you")
//                     Embed.addFields(
//                         {
//                             name: 'Usage', value: `${prefix}status [ Your custom message ]`,
//                         },
//                         {
//                             name: 'Example', value: `${prefix}status Busy right now. Ping another mod`
//                         }
//                     )
//                     Embed.setFooter("Require `Moderator` permission to use")
//                     Embed.setColor("#fffafa")
        
//                     await message.channel.send({embeds: [Embed]}).then(m=>setTimeout(() => m.delete(), 1000 * 10));
//                     return false;

//                 }else {
//                     Status(true, Reason ? Reason : null, Time)

//                     Embed.setAuthor(`${author.tag}`, author.displayAvatarURL({
//                         dynamic: true , type: 'png'}))
//                     Embed.setDescription(`> ${Reason}`)
//                     moment(Embed.setTimestamp()).format("LL")
//                     Embed.setColor("#fffafa")
        
//                     await message.channel.send({embeds: [Embed]})
//                 } 
//             }else if( Database.Status.Active === true ){
//                 Status(false, null, Time)

//                 Embed.setAuthor(`${author.tag}`, author.displayAvatarURL({
//                     dynamic: true , type: 'png'}))
//                 Embed.setDescription('> Status has been removed')
//                 moment(Embed.setTimestamp()).format("LL")
//                 Embed.setColor("#fffafa")
        
//                 await message.channel.send({embeds: [Embed]})
//             }
//         }
//     }
// }