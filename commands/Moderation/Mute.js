// const Discord = require('discord.js');
// const { Permissions } = require('discord.js')
// const ms = require('ms');
// const { LogsDatabase, GuildChannel, GuildRole } = require('../../models');
// const { commandUsed } = require('../../Functions/CommandUsage');
// const { errLog } = require('../../Functions/erroHandling');

// module.exports = {
//     name: 'mute',

//     run: async(client, message, args, prefix) =>{
//         if(message.guild.me.permissions.has(["MANAGE_MESSAGES"])){
//             await message.delete();
//         }

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
//         try {
//             if (message.guild.ownerID !== message.author.id){
//                 if(!message.member.permissions.has(["ADMINISTRATOR"])){
//                     if(permData.ModOptions.Enabled === true){
//                         if(!message.member.roles.cache.some(r=>roleSet.includes(r.id))){
//                             if(!message.member.permissions.has(["MANAGE_GUILD", "ADMINISTRATOR", "BAN_MEMBERS"])){
//                                 return await message.channel.send({embeds: [missingPerm]}).then(m=>setTimeout(() => m.delete(), 1000 * 10));
//                             }
//                         }
//                     }else if(permData.ModOptions.Enabled === false){
//                         if(!message.member.permissions.has(["BAN_MEMBERS", "MANAGE_GUILD", "ADMINISTRATOR"])){
//                             return await message.channel.send({embeds: [missingPerm]}).then(m=>setTimeout(() => m.delete(), 1000 * 10));
//                         }
//                     }
//                 }
//             }
//         } catch (err){
//             errLog(err.stack.toString(), "text", "Mute", "Error in fetching User Role");
//         }
        
//         const TutEmbed = new Discord.MessageEmbed()
//         .setAuthor( "Command - MUTE", author.displayAvatarURL({dynamic: false, format: "png", size: 1024}) )

//         try {
//             if( !args.length ){
//                 TutEmbed.setDescription( `Mutes someone to pause them from chatting or speaking \n**Usage**: ${prefix}mute [ Member ] [ duration ] [ reason ] \n**Example:** \n${prefix}mute @shadow~ 20m for Spamming \n${prefix}mute @shadow~ 3h Deserve it!` )
//                 TutEmbed.setFooter( "Bot require \"MANAGE_ROLES\" permission to add \"Muted\" role" )
//                 TutEmbed.setColor( "#fffafa" )
//                 return message.channel.send( {embeds: [TutEmbed]} ).then(m=>setTimeout(() => m.delete(), 1000 * 10));
//             }
//         } catch (err) {
//             errLog(err.stack.toString(), "text", "Mute", "Error in sending expected args");
//         }

//         const regexx = /[\d+]/g
//         if(!args[0].match( regexx )){
//             try {
//                 if( !args.length ){
//                     return message.channel.send({embeds: [new Discord.MessageEmbed()
//                         .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({dynamic: false, size: 1024, type: "png"}))
//                         .setColor("#fc5947")
//                         .setDescription(`Please mention a valid Member.`)
//                     ]
//                     }).then(m=>setTimeout(() => m.delete(), 1000 * 10))
//                 }
//             } catch (err) {
//                 errLog(err.stack.toString(), "text", "Mute", "Error in finding Member ID");
//             }
//         }
        
//         const regex = /[\d]/g;
//         const findMember = message.content.split(/\s+/)[1];
//         const member = findMember.replace('<@', '').replace('>', '').replace('!', '').trim();

//         if(member.match(regex)){
//             try {
//                 if(await message.guild.members.fetch(member)){
//                     const Member = await message.guild.members.fetch(member)
            
//                     if(!member){
//                         TutEmbed.setDescription( `Invalid user | Couldn't find the user` )
            
//                         TutEmbed.setColor( "#ff303e" )
//                         return message.channel.send( {embeds: [TutEmbed] }).then(m=>setTimeout(() => m.delete(), 1000 * 10))
//                     }else {
//                         if(Member.permissions.has([ "MANAGE_MESSAGES", "MANAGE_ROLES", "MANAGE_GUILD", "ADMINISTRATOR" ])){
//                             TutEmbed.setDescription( `Can't mute a Mod/Admin` )
//                             TutEmbed.setColor( '#ff303e' )
                
//                             return await message.channel.send({embeds: [TutEmbed]}).then(m=>setTimeout(() => m.delete(), 1000 * 10))
//                         }
                
//                         const previosMute = await LogsDatabase.find({
//                             userID: Member.id,
//                         })
                
//                         const currentlyMuted = previosMute.filter(mute => {
//                             return mute.Muted === true
//                         })
                
//                         if ( currentlyMuted.length ){
//                             let error = new Discord.MessageEmbed()
//                                 .setDescription( `${Member.user.username} is already Muted`)
//                                 .setColor( '#ff303e' )
//                             return message.channel.send({embeds: [error]
//                             }).then(m=>setTimeout(() => m.delete(), 1000 * 10));
//                         }
                
//                         const duration = content.split(/\s+/)[2];
                        
//                         if( !duration ){
//                             TutEmbed.setDescription( `Mutes someone to pause them from chatting or speaking \n**Usage**: ${prefix}mute [ Member ] [ duration ] [ reason ] \n**Example:** \n${prefix}mute @shadow~ 20m for Spamming \n${prefix}mute @shadow~ 3h Deserve it!` )
//                             TutEmbed.setFooter( "Bot require \"MANAGE_ROLES\" permission to add \"Muted\" role" )
//                             TutEmbed.setColor( "#fffafa" )
//                             return message.channel.send( {embeds: [TutEmbed] }).then(m=>setTimeout(() => m.delete(), 1000 * 10));
//                         }
    
//                         const timeex = /[\d*]/g;
    
//                         if(!duration.match(timeex)){
//                             TutEmbed.setDescription( `Please define duration for the mute 
//                             \n**Usage**: \`${prefix}mute [ user ] [ duration ] [ reason ]\`` )
//                             TutEmbed.setColor( "#fffafa" )
//                             return message.channel.send( {embeds: [TutEmbed]} ).then(m=>setTimeout(() => m.delete(), 1000 * 10));
//                         }
    
//                         let muteLength = ms( duration ) ; // Converting args[1] *Duration* into milli-seconds.
//                         const durationFormat = ms(muteLength, { long: true }) // Formatting the short form to long form, e.g m > minute.
//                         const muteDuration = new Date(); // Getting the current date and time.
//                         muteDuration.setMilliseconds(muteDuration.getMilliseconds() + muteLength); //Increment current time with mute duration
                
//                         const muteReason = content.split(/\s+/).slice(3).join(" ") || 'No reason provided'
//                         if(message.cleanContent.length >= 500) {
//                             let failed = new Discord.MessageEmbed()
//                             .setDescription("Please provide a reason less than 500 words")
//                             .setColor('#ff303e')
//                             return message.channel.send({embeds: [failed]
//                             })
//                         }
                
//                         const muteRole = await message.guild.roles.cache.find(r => r.name === 'Muted')
//                         if( !muteRole ){
//                             if(guild.me.permissions.has("MANAGE_ROLES", "ADMINISTRATOR")){
//                                 try {
//                                     await message.guild.roles.create({
//                                             name: 'Muted',
//                                             color: '#000000',
//                                             permissions: [],
//                                             reason: 'sadBot mute role creation'
//                                     })
//                                     if(guild.me.permissions.has("MANAGE_CHANNELS", "ADMINISTRATOR")){
//                                         await guild.channels.cache.forEach(channel => {
//                                             channel.permissionOverwrites.set([
//                                                 {
//                                                     id: muteRole.id,
//                                                     deny : ['SEND_MESSAGES', 'ADD_REACTIONS', 'VIEW_CHANNEL'],
//                                                 }
//                                             ], "Muted role overWrites")
//                                         })
//                                     }else {
//                                         let successEmbed = new Discord.MessageEmbed()
//                                             .setDescription("Missing permission to create ovrride for **Muted** role. | Require **MANAGE CHANNELS** permission to block sending messages for Muted roles")
//                                             .setColor("#ff303e")
//                                         return channel.send({embeds: [successEmbed]
//                                         })
//                                     }
//                                 }catch(err){
//                                     errLog(err.stack.toString(), "text", "Mute", "Error in creating Muted role");
//                                 }
//                             }else {
//                                 return channel.send({embeds: [new Discord.MessageEmbed()
//                                     .setDescription("Missing permission to create **Muted** role. | Please provide permission or create a role called **Muted**")
//                                     .setColor("#ff303e")
//                                 ]
//                                 })
//                             }
//                         }
                
//                         const authorHighestRole = message.guild.members.resolve( client.user ).roles.highest.position;
//                         const mentionHighestRole = Member.roles.highest.position;
    
//                         if(mentionHighestRole >= authorHighestRole) {
//                             TutEmbed.setDescription( `Can't mute a Member with higher role than me` )
//                             TutEmbed.setColor( '#ff303e' )
                
//                             return await message.channel.send({ embeds: [TutEmbed] }).then(m => setTimeout(() => m.delete(), 1000 * 20))
//                         }
                
//                         if(Member.roles.cache.has(muteRole.id)){
//                             try{
//                                 if(!message.guild.me.permissions.has(["MANAGE_ROLES"])){
//                                     return message.channel.send({embeds: [new Discord.MessageEmbed()
//                                         .setDescription("I don't have permission to \"Add Roles\" to member")
//                                         .setColor('#ff303e')
//                                     ]
//                                     });
//                                 }

//                                 await Member.roles.remove(muteRole.id)
//                                 await Member.roles.add(muteRole.id)
//                                 let successEmbed = new Discord.MessageEmbed()
//                                     .setDescription(`${Member.user.tag} is now Muted | ${muteReason}`)
//                                     .setColor("#45f766")
//                                 channel.send({embeds: [successEmbed]}).then(m =>setTimeout(() => m.delete(), 1000 * 20))
//                             }catch(err){
//                                 errLog(err.stack.toString(), "text", "Mute", "Error in Addning Muted role");
//                             }
//                         } else{
//                             try{
//                                 if(!message.guild.me.permissions.has(["MANAGE_ROLES"])){
//                                     let failed = new Discord.MessageEmbed()
//                                         .setDescription("I don't have permission to \"Add Roles\" to member")
//                                         .setColor('#ff303e')
//                                     return message.channel.send({embeds: [failed]});
//                                 }

//                                 Member.roles.add(muteRole.id)
//                                 let successEmbed = new Discord.MessageEmbed()
//                                     .setDescription(`${Member.user.tag} is now Muted | ${muteReason}`)
//                                     .setColor("#45f766")
//                                 channel.send({embeds: [successEmbed]}).then(m =>setTimeout(() => m.delete(), 1000 * 20))
//                             }catch(err){
//                                 errLog(err.stack.toString(), "text", "Mute", "Error in Addning Muted role");
//                             }
//                         }
//                         commandUsed( guild.id, guild.name, message.author.id, message.author.tag, "Mute", 1, content );
                
//                         function caseID() {
//                             var text = "";
//                             var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                          
//                             for (var i = 0; i < 10; i++)
//                               text += possible.charAt(Math.floor(Math.random() * possible.length));
                          
//                             return text;
//                         }
//                         let caseIDNo = "";
//                         caseIDNo = caseID();
                
//                         try {
//                             await new LogsDatabase({
//                                 CaseID: caseIDNo,
//                                 guildID: guild.id,
//                                 guildName: guild.name,
//                                 userID: Member.user.id,
//                                 userName: Member.user.tag,
//                                 ActionType: "Mute",
//                                 Reason: muteReason,
//                                 Moderator: author.tag,
//                                 ModeratorID: author.id,
//                                 Muted: true,
//                                 Banned: false,
//                                 softBanned: false,
//                                 Duration: durationFormat,
//                                 Expire: muteDuration,
//                                 ActionDate: new Date(),
//                             }).save().catch(err => errLog(err.stack.toString(), "text", "Mute", "Error in Ctreating Data"));
//                         }catch(err){
//                             errLog(err.stack.toString(), "text", "Mute", "Error in Creating Mute Data");
//                         }
    
//                         const logChannelData = await GuildChannel.findOne({
//                             guildID: message.guild.id,
//                             Active: true,
//                             "ActionLog.MuteEnabled": true
//                         })
//                         if(logChannelData){
//                             try{
//                                 const logChannel = message.guild.channels.cache.get(logChannelData.ActionLog.MuteChannel)
    
//                                 if(logChannel){
    
//                                     const informations = {
//                                         color: "#ff303e",
//                                         author: {
//                                             name: `Mute Detection - ${caseIDNo}`,
//                                             icon_url: Member.user.displayAvatarURL({dynamic: false, type: "png", size: 1024})
//                                         },
//                                         fields: [
//                                             {
//                                                 name: "User",
//                                                 value: `\`\`\`${Member.user.tag}\`\`\``,
//                                                 inline: true
//                                             },
//                                             {
//                                                 name: "Moderator",
//                                                 value: `\`\`\`${message.author.tag}\`\`\``,
//                                                 inline: true
//                                             },
//                                             {
//                                                 name: "Duration",
//                                                 value: `\`\`\`${durationFormat}\`\`\``,
//                                                 inline: true
//                                             },
//                                             {
//                                                 name: "Reason",
//                                                 value: `\`\`\`${muteReason}\`\`\``,
//                                             },
//                                         ],
//                                         timestamp: new Date(),
//                                         footer: {
//                                             text: `User ID: ${Member.user.id}`
//                                         }
    
//                                     }
//                                     const hasPermInChannel = logChannel
//                                         .permissionsFor(client.user)
//                                         .has('SEND_MESSAGES', false);
//                                     if (hasPermInChannel) {
//                                         logChannel.send({embeds: [informations]})
//                                     }
                                    
//                                 }
//                             }catch (err){
//                                 errLog(err.stack.toString(), "text", "Mute", "Error in Sending log message");
//                             }
//                         }
//                     }
//                 }else {
//                     TutEmbed.setDescription( `Invalid user | Couldn't find the user` )
            
//                     TutEmbed.setColor( "#ff303e" )
//                     return message.channel.send( TutEmbed ).then(m=>setTimeout(() => m.delete(), 1000 * 10))
//                 }
//             } catch (err){
//                 errLog(err.stack.toString(), "text", "Mute", "Error in finding Member");
//             }
//         }else {
//             TutEmbed.setDescription( `Invalid user | Couldn't find the user` )
        
//             TutEmbed.setColor( "#ff303e" )
//             return message.channel.send( {embeds: [TutEmbed]} ).then(m=>setTimeout(() => m.delete(), 1000 * 10))
//         }

//     }
// }