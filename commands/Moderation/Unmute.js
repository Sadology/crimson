// const Discord = require('discord.js');
// const ms = require('ms')
// const { LogsDatabase, GuildChannel, GuildRole } = require('../../models')

// module.exports = {
//     name: 'unmute',

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
//         .setAuthor( "Command - UnMUTE" )

//         if( !args.length ){
//             TutEmbed.setDescription( `Unmutes a muted member to let them chat and speak again \n**Usage**: ${prefix}unmute [ Member ] \n**Example:** \n${prefix}unmute @shadow~` )
//             TutEmbed.setFooter( "Bot require \"MANAGE_ROLES\" permission to remove \"Muted\" role" )
//             TutEmbed.setColor( "#fffafa" )
//             return message.channel.send( {embeds: [TutEmbed]} ).then(m=>setTimeout(() => m.delete(), 1000 * 10));
//         }

//         const regex = /[\d]/g;
//         const findMember = message.content.split(/\s+/)[1];
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

//         if(member.match(regex)){
//             if(await message.guild.members.fetch(member)){
//                 const Member = await message.guild.members.fetch(member)
        
//                 if(!member){
//                     TutEmbed.setDescription( `Invalid user | Couldn't find the user` )
        
//                     TutEmbed.setColor( "#ff303e" )
//                     return message.channel.send({ embeds: [TutEmbed] }).then(m=>setTimeout(() => m.delete(), 1000 * 10))
//                 }else {
//                     const previosMute = await LogsDatabase.find({
//                         userID: Member.id,
//                     });
            
//                     const currentlyMuted = previosMute.filter(mute => {
//                         return mute.Muted === true
//                     });

//                     const muteRole = await message.guild.roles.cache.find(r => r.name === 'Muted');
//                     if( !muteRole ){
//                         TutEmbed.setDescription( `The \`Muted\` role does not exist` )
//                         TutEmbed.setColor( "#fffafa" )
//                         return message.channel.send( {embeds: [TutEmbed]} ).then(m=>setTimeout(() => m.delete(), 1000 * 10));
//                     };

//                     const authorHighestRole = message.guild.members.resolve( client.user ).roles.highest.position;
//                     const  mentionHighestRole = Member.roles.highest.position;

//                     if(mentionHighestRole >= authorHighestRole) {
//                         TutEmbed.setDescription( `Can't Unmute a Member with higher role than me` )
//                         TutEmbed.setColor( '#ff303e' )
            
//                         return await message.channel.send({embeds: [TutEmbed]}).then(m=>setTimeout(() => m.delete(), 1000 * 10))
//                     }
                    
//                     if ( currentlyMuted.length ){

//                         await LogsDatabase.findOneAndUpdate({
//                             guildID: guild.id,
//                             Muted: true
//                         },{
//                             Muted: false
//                         })

//                         try{
//                             await Member.roles.remove(muteRole.id);
                            
//                             channel.send({embeds: [new Discord.MessageEmbed()
//                                 .setDescription(`${Member.user.tag} has been UnMuted `)
//                                 .setColor("#45f766")
//                             ]
//                             }).then(m=>setTimeout(() => m.delete(), 1000 * 10))
//                         }catch(err){
//                             console.log(err)
//                         };
//                     }else if(Member.roles.cache.has(muteRole.id)){
//                         try{
//                             await Member.roles.remove(muteRole.id);

//                             channel.send({embeds: [new Discord.MessageEmbed()
//                                 .setDescription(`${Member.user.tag} has been UnMuted `)
//                                 .setColor("#45f766")
//                             ]
//                             }).then(m=>setTimeout(() => m.delete(), 1000 * 10))
//                         }catch(err){
//                             console.log(err)
//                         };
//                     }else {
//                         return channel.send({embeds: [new Discord.MessageEmbed()
//                             .setDescription(`${Member.user.tag} is not Muted `)
//                             .setColor("#ff303e")
//                         ]
//                         }).then(m=>setTimeout(() => m.delete(), 1000 * 10))
//                     }

//                     const logChannelData = await GuildChannel.findOne({
//                         guildID: message.guild.id,
//                         Active: true,
//                         "ActionLog.UnMuteEnanled": true
//                     })
//                     if(logChannelData){
//                         try{
//                             const logChannel = message.guild.channels.cache.get(logChannelData.ActionLog.UnMuteChannel)

//                             if(logChannel){

//                                 const informations = {
//                                     color: "#45f766",
//                                     author: {
//                                         name: `Unmute Detection`,
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