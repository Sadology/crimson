// const Discord = require('discord.js');
// const { Guild } = require('../../models');
// const { LogsDatabase }= require('../../models');
// const { MessageButton } = require('discord-buttons');
// const { errLog } = require('../../Functions/erroHandling');

// module.exports = {
//     name: 'reset-log',

//     run: async(client, message, args,prefix) =>{

//         if (!message.member.permissions.has("ADMINISTRATOR")){
//             return
//         }

//         const confirm = new MessageButton()
//             .setStyle("red")
//             .setLabel("Confirm")
//             .setID("resetConfirm")

//         const Cancel = new MessageButton()
//             .setStyle("green")
//             .setLabel("Cancel")
//             .setID("resetCancel")

//         if( !args.length ){
//             return message.channel.send({embeds: [new Discord.MessageEmbed()
//                 .setAuthor(`Command - Reset-Log`, message.author.displayAvatarURL({dynamic: false, size: 1024, type: "png"}))
//                 .setColor("#fffafa")
//                 .setDescription(`Deletes every log data of the mentioned member *(currently only works for those who are in the server)* \n**Example**: \`${prefix}reset-log [ Member ]\``)
//             ]
//             }).then(m=>m.delete({timeout: 1000 * 10}))
//         }

//         const regexx = /[\d+]/g
//         if(!args[0].match( regexx )){
//             try {
//                 return message.channel.send({embed: new Discord.MessageEmbed()
//                     .setAuthor(`Command - Reset-Log`, message.author.displayAvatarURL({dynamic: false, size: 1024, type: "png"}))
//                     .setColor('#ff303e')
//                     .setDescription(`Please mention a valid Member`)
//                 }).then(m=>m.delete({timeout: 1000 * 10}))
//             } catch (err) {
//                 errLog(err.stack.toString(), "text", "Reset-Log", "Error in finding Member ID");
//             }
//         }
//         const TutEmbed = new Discord.MessageEmbed()
//             .setAuthor("Command - Reset-Log", message.author.displayAvatarURL({dynamic: false, type: "png", size: 1024}))
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
//                         return message.channel.send( TutEmbed ).then(m =>m.delete({ timeout: 1000 * 10 }))
//                     }else {
//                         const Embed = new Discord.MessageEmbed()
//                             .setAuthor('Command - Reset=Log')
//                             .setDescription(`<:sadAlert:855894860880281600> | ${Member.user} logs will get permanently deleted from database. Do you Wish to continue?`)
//                             .setColor('#f25044')

//                         let MSG = await message.channel.send(`<:sadAlert:855894860880281600> | ${Member.user}'s Logs will get deleted from database. Do you wish to continue?`,{embed: Embed, button: [confirm, Cancel]})

//                         const filter = (button) => button.clicker.user.id === message.author.id;
//                         const collector = MSG.createButtonCollector(filter, { time: 1000 * 60, max: 1 });

//                         collector.on('collect',async b => {
//                             b.defer()
//                             if(b.id === 'resetConfirm'){
//                                 try{
//                                     await LogsDatabase.deleteMany({
//                                         guildID: message.guild.id, 
//                                         userID: Member.id}, 
//                                     function(err, doc){
//                                         if(err) {
//                                             errLog(err.stack.toString(), "text", "Reset-Log", "Error in Deleteting Logs");
//                                         }
//                                     })
                    
//                                     return MSG.edit({embed: new Discord.MessageEmbed()
//                                         .setAuthor(`Command - Reset-Log` , Member.user.displayAvatarURL({dynamic: false, type: "png", size: 1024}))
//                                         .setDescription(`Logs Reset | ${Member.user}`)
//                                         .setColor("#66ff6b")
//                                         .setFooter("Once a data has been delete, there's no way to retrieve it")
//                                         .setThumbnail("https://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/sign-check-icon.png")
//                                     })
//                                 } catch (err){
//                                     errLog(err.stack.toString(), "text", "Reset-Log", "Error in deleting logs");
//                                 }
//                             }
//                             if(b.id === "resetCancel"){
//                                 try {
//                                     MSG.edit({embed: new Discord.MessageEmbed()
//                                         .setAuthor(`Command - Reset-Log`,  message.author.displayAvatarURL({dynamic: false, type: "png", size: 1024}))
//                                         .setDescription(`Command Canceled`)
//                                         .setColor("#66ff6b")
//                                     })
//                                     return
//                                 } catch (err) {
//                                     errLog(err.stack.toString(), "text", "Reset-Log", "Error in cancelling command");
//                                 }
//                             }
//                         });
//                         collector.on("end", () =>{

//                         })

//                     }
//                 }else {
//                     TutEmbed.setDescription( `Invalid user | Couldn't find the user` )
            
//                     TutEmbed.setColor( "#ff303e" )
//                     return message.channel.send( TutEmbed ).then(m =>m.delete({ timeout: 1000 * 10 }))
//                 }
//             } catch (err){
//                 errLog(err.stack.toString(), "text", "Mute", "Error in finding Member");
//             }
//         }else {
//             TutEmbed.setDescription( `Invalid user | Couldn't find the user` )
        
//             TutEmbed.setColor( "#ff303e" )
//             return message.channel.send( TutEmbed ).then(m =>m.delete({ timeout: 1000 * 10 }))
//         }
//     }
// }