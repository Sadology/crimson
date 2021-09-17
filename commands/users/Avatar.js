// const Discord = require('discord.js');
// const { MessageEmbed } = require('discord.js')
// const { GuildRole } = require("../../models")

// module.exports = {
//     name: 'avatar',
//     aliases: ["av"],
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
//                             return await message.channel.send({embeds: [missingPerm]}).then(m=>setTimeout(() => m.delete(), 1000 * 10));
//                         }
//                     }
//                 }else if(permData.ModOptions.Enabled === false){
//                     if(!message.member.permissions.has(["BAN_MEMBERS", "MANAGE_GUILD", "ADMINISTRATOR"])){
//                         return await message.channel.send({embeds: [missingPerm]}).then(m=>setTimeout(() => m.delete(), 1000 * 10));
//                     }
//                 }
//             }
//         }
//         let authorEmbed = new Discord.MessageEmbed()
//             .setAuthor(message.author.tag, message.author.displayAvatarURL({dynamic: true, size: 1024, type: "png"}))
//             .setTitle( "Avatar")
//             .setImage(message.author.avatarURL({dynamic: true, size: 4096, type: "png"}) ? message.author.displayAvatarURL({dynamic: true, size: 4096, type: "png"}) : message.author.displayAvatarURL({dynamic: true, size: 4096, type: "png"}))
//             .setColor("#fffafa")
//         if(!args.length){
//             await message.channel.send({embeds: [authorEmbed]}) 
//         }

//         if(args[0]){
//             const findMember = message.content.split(/\s+/)[1];
//         const member = findMember.replace('<@', '').replace('>', '').replace('!', '').trim();

//         const regexx = /[\d+]/g
//         if(!args[0].match( regexx )){
//             return message.channel.send({embeds: [new Discord.MessageEmbed()
//                 .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({dynamic: false, size: 1024, type: "png"}))
//                 .setColor("#fc5947")
//                 .setDescription(`Please mention a valid Member.`)
//             ]
//             }).then(m=>setTimeout(() => m.delete(), 1000 * 10))
//         }

//         const regex = /[\d]/g;
//         if(member.match(regex)){
//             const Member = message.guild.members.cache.get(member)
//             if(Member){
                
//                     let Embed = new Discord.MessageEmbed()
//                     .setAuthor(Member.user.tag, Member.user.displayAvatarURL({dynamic: true, size: 1024, type: "png"}))
//                     .setTitle( "Avatar")
//                     .setImage(Member.user.avatarURL({dynamic: true, size: 4096, type: "png"}) ? Member.user.displayAvatarURL({dynamic: true, size: 4096, type: "png"}) : Member.user.displayAvatarURL({dynamic: true, size: 4096, type: "png"}))
//                     .setColor("#fffafa")
//                 await message.channel.send({embeds: [Embed]})
//             }else {
//                 await message.channel.send({embeds: [authorEmbed]}) 
//             }
//         }
//         }else {
//             await message.channel.send({embeds: [authorEmbed]}) 
//         }
//     }
// };