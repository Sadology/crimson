// const Discord = require('discord.js');
// const ms = require('ms')
// const { LogsDatabase, GuildChannel, GuildRole } = require('../../models')
// const { commandUsed } = require('../../Functions/CommandUsage')

// module.exports = {
//     name: 'warn',
//     description: "Warns a member.",
//     permissions: ["MANAGE_MESSAGES"],
//     usage: "warn [ reason ]",
//     category: "Moderation",

//     run: async(client, message, args, prefix) =>{
//         await message.delete();

//         const permData = await GuildRole.findOne({
//             guildID: message.guild.id,
//             Active: true
//         });

//         const { author, content, guild, channel } = message;

//         const missingPerm = new Discord.MessageEmbed()
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
        
//         const TutEmbed = new Discord.MessageEmbed()
//         .setAuthor( "Command - WARN", author.displayAvatarURL({dynamic: false, format: "png", size: 1024}) )

//         if( !args.length ){
//             TutEmbed.setDescription( `Warns a member \n**Usage**: ${prefix}warn [ Member ] [ reason ] \n**Example:** \n${prefix}warn @shadow~ Don't spam!` )
//             TutEmbed.setColor( "#fffafa" )
//             return message.channel.send( {embeds: [TutEmbed]} ).then(m=>setTimeout(() => m.delete(), 1000 * 10));
//         }

//         const regex = /[\d]/g;
//         const findMember = message.content.split(/\s+/)[1];
//         const member = findMember.replace('<@', '').replace('>', '').replace('!', '').trim();

//         const regexx = /[\d+]/g
//         if(!args[0].match( regexx )){
//             return message.channel.send({embeds: new Discord.MessageEmbed()
//                 .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({dynamic: false, size: 1024, type: "png"}))
//                 .setColor("#fc5947")
//                 .setDescription(`Please mention a valid Member.`)
//             }).then(m=>setTimeout(() => m.delete(), 1000 * 10))
//         }

//         if(member.match(regex)){
//             if(await message.guild.members.fetch(member)){
//                 const Member = await message.guild.members.fetch(member)
        
//                 if(!member){
//                     TutEmbed.setDescription( `Invalid user | Couldn't find the user` )
        
//                     TutEmbed.setColor( "#ff303e" )
//                     return message.channel.send( {embeds: [TutEmbed]} ).then(m=>setTimeout(() => m.delete(), 1000 * 10));
//                 }else {
//                     const Reason = content.split(/\s+/).slice(2).join(" ") || 'No reason provided'

//                     if(Member.permissions.has([ "MANAGE_MESSAGES", "MANAGE_GUILD", "ADMINISTRATOR" ])){
//                         TutEmbed.setDescription( `Can't warn a Mod/Admin` )
//                         TutEmbed.setColor( '#ff303e' )
            
//                         return await message.channel.send({embeds: [TutEmbed]}).then(m=>setTimeout(() => m.delete(), 1000 * 20));
//                     }else {
//                         const embed = new Discord.MessageEmbed()
//                         .setDescription(`${Member.user} has been warned | ${Reason}`)
//                         .setColor( "#fffafa" )
//                         message.channel.send({embeds: [embed]}).then(m=>setTimeout(() => m.delete(), 1000 * 30));
//                     }
            
//                     commandUsed( guild.id, guild.name, message.author.id, message.author.tag, "Warn", 1, content );
            
//                     function caseID() {
//                         var text = "";
//                         var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                      
//                         for (var i = 0; i < 10; i++)
//                           text += possible.charAt(Math.floor(Math.random() * possible.length));
                      
//                         return text;
//                     }
//                     let caseIDNo = "";
//                     caseIDNo = caseID();
            
//                     try {
//                         await new LogsDatabase({
//                             CaseID: caseIDNo,
//                             guildID: guild.id,
//                             guildName: guild.name,
//                             userID: Member.user.id,
//                             userName: Member.user.tag,
//                             ActionType: "Warn",
//                             Reason: Reason,
//                             Moderator: author.tag,
//                             ModeratorID: author.id,
//                             Muted: false,
//                             Banned: false,
//                             softBanned: false,
//                             Duration: "∞",
//                             Expire: null,
//                             ActionDate: new Date(),
//                         }).save().catch(err => console.log(err))
//                     }catch(err){
//                         console.log(err)
//                     }

//                     const logChannelData = await GuildChannel.findOne({
//                         guildID: message.guild.id,
//                         Active: true,
//                         "ActionLog.MuteEnabled": true
//                     })
//                     if(logChannelData){
//                         try{
//                             const logChannel = message.guild.channels.cache.get(logChannelData.ActionLog.MuteChannel)

//                             if(logChannel){

//                                 const informations = {
//                                     color: "#fffafa",
//                                     author: {
//                                         name: `Warn Detection - ${caseIDNo}`,
//                                         icon_url: Member.user.displayAvatarURL({dynamic: false, type: "png", size: 1024})
//                                     },
//                                     fields: [
//                                         {
//                                             name: "User",
//                                             value: `\`\`\`${Member.user.tag}\`\`\``,
//                                             inline: true
//                                         },
//                                         {
//                                             name: "Moderator",
//                                             value: `\`\`\`${message.author.tag}\`\`\``,
//                                             inline: true
//                                         },
//                                         {
//                                             name: "Reason",
//                                             value: `\`\`\`${Reason}\`\`\``,
//                                         },
//                                     ],
//                                     timestamp: new Date(),
//                                     footer: {
//                                         text: `User ID: ${Member.user.id}`
//                                     }

//                                 }
//                                 logChannel.send({embeds: [informations]})
//                             }
//                         }catch (err){
//                             console.log(err)
//                         }
//                     }
//                 }
//             }else {
//                 TutEmbed.setDescription( `Invalid user | Couldn't find the user` )
        
//                 TutEmbed.setColor( "#ff303e" )
//                 return message.channel.send( {embeds: [TutEmbed]} ).then(m=>setTimeout(() => m.delete(), 1000 * 10))
//             }
//         }else {
//             TutEmbed.setDescription( `Invalid user | Couldn't find the user` )
        
//             TutEmbed.setColor( "#ff303e" )
//             return message.channel.send( {embeds: [TutEmbed]} ).then(m=>setTimeout(() => m.delete(), 1000 * 10))
//         }

//     }
// }