// const Discord = require('discord.js');
// const { LogsDatabase, GuildRole} = require('../../models');
// const moment = require('moment');
// const { errLog } = require('../../Functions/erroHandling');
// const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js')

// module.exports = {
//     name: 'logs',
//     aliases: ['modlogs', 'modlog', 'log'],

//     run: async(client, message, args,prefix) =>{

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
//                             return await message.channel.send({embeds: [missingPerm]}).then(m=>setTimeout(() =>m.delete(), 1000 * 10));
//                         }
//                     }
//                 }else if(permData.ModOptions.Enabled === false){
//                     if(!message.member.permissions.has(["BAN_MEMBERS", "MANAGE_GUILD", "ADMINISTRATOR"])){
//                         return await message.channel.send({embeds: [missingPerm]}).then(m=>setTimeout(() =>m.delete(), 1000 * 10));
//                     }
//                 }
//             }
//         }

//         if(!args.length){
//             return message.channel.send({embeds: [new Discord.MessageEmbed()
//                 .setAuthor(`${message.author.tag} - Mod Logs`)
//                 .setColor("#fc5947")
//                 .setDescription(`Mention a user to fetch their logs \n\n**Usage:** \`${prefix}logs [ user ]\` \n**Example:** \`${prefix}logs @shadow~\``)
//             ]
//             }).then(m=>setTimeout(() =>m.delete(), 1000 * 10))
//         }

//         const regex = /[\d+]/g
//         if(!args[0].match( regex )){
//             return message.channel.send({embeds: [new Discord.MessageEmbed()
//                 .setAuthor(`${message.author.tag}`)
//                 .setColor("#fc5947")
//                 .setDescription(`Please mention a valid user`)
//             ]
//             }).then(m=>setTimeout(() =>m.delete(), 1000 * 10))
//         }

//         let findMember = args[0];
//         const muteMember = findMember.replace('<@', '').replace('>', '').replace('!', '').trim();

//         const UserData = await LogsDatabase.findOne({
//             guildID: message.guild.id,
//             userID: muteMember
//         })

//         const next = new MessageActionRow()
//             .addComponents(
//                 new MessageButton()
//                     .setStyle("SUCCESS")
//                     .setLabel("Next")
//                     .setCustomId("NextPageModLog")
//             )

//         const prev = new MessageActionRow()
//             .addComponents(
//                 new MessageButton()
//                     .setStyle("DANGER")
//                     .setLabel("Previous")
//                     .setCustomId("PreviousPageModLog")
//             )

//         if(UserData){
//             const ServerMember = await guild.members.fetch();
//             const memberID = ServerMember.get(muteMember);

//             if(!memberID){
//                 try {
//                     await LogsDatabase.find({
//                         guildID: message.guild.id,
//                         userID: muteMember
//                     }).sort([
//                         ['ActionDate','ascending']
//                     ]).exec(async(err, res) => {
//                         if(err){
//                             console.log(err)
//                         }
    
//                         if(res.length == 0) {
//                             return message.channel.send({embeds: [new Discord.MessageEmbed()
//                                 .setAuthor("Mod-Logs")
//                                 .setDescription(`${memberID} doesn't have any logs`)
//                                 .setColor("#fc5947")
//                             ]
//                             }).then(m=>setTimeout(() =>m.delete(), 1000 * 10))
//                         }
                        
//                         let currentIndex = 0
//                         const generateEmbed = start => {
//                             const current = res.slice(start, start + 5)
    
//                             const embed = new Discord.MessageEmbed()
//                                 .setDescription(`${memberID} Mod-Logs - \`[${res.length}]\``)
//                                 .setFooter(`Logs ${start + 1} - ${start + current.length} out of ${res.length}`)
//                                 .setColor("#fffafa")
    
//                             for (i = 0; i < current.length; i++){
//                                 embed.addField(`**${i + 1}**• [ ${current[i] && current[i].ActionType} ]`,[
//                                     `\`\`\`py\nUser     - ${current[i] && current[i].userName}`,
//                                     `\nReason   - ${current[i] && current[i].Reason}`,
//                                     `\nMod      - ${current[i] && current[i].Moderator}`,
//                                     `\nDuration - ${current[i] && current[i].Duration ? current[i] && current[i].Duration : "∞"}`, 
//                                     `\nDate     - ${moment(current[i] && current[i].ActionDate).format('llll')}`,
//                                     `\nLogID    - ${current[i] && current[i].CaseID}\`\`\``
//                                 ].toString())
//                             }       
//                             if(res.length <= 5){
//                                 return ({embeds: [embed]})
//                             }else if (start + current.length >= res.length){
//                                 return ({embeds: [Embed], components: [prev]})
//                             }else if(current.length == 0){
//                                 return ({embeds: [embed], components: [prev]})
//                             }else if(currentIndex !== 0){
//                                 return ({embeds: [embed], components: [next, prev]})
//                             }else if (currentIndex + 10 < res.length){
//                                 return ({embeds: [embed], components: [next]})
//                             }
//                         }
    
//                         await message.channel.send(generateEmbed(0)).then(async msg => {
    
//                         const filter = (button) => button.clicker.user.id === message.author.id;
//                         const collector = msg.createMessageComponentCollector(filter, { time: 1000 * 60, errors: ['time'] });
    
//                         collector.on('collect',async b => {
//                             if(b.customId === 'NextPageModLog'){
//                                 currentIndex += 5
//                                 await b.update(generateEmbed(currentIndex))
//                             }
//                             if(b.customId === "PreviousPageModLog"){
//                                 currentIndex -= 5
//                                 await b.update(generateEmbed(currentIndex))
//                             }
//                         });
//                         collector.on("end", () =>{
    
//                         })
//                         })
//                     })
//                 } catch (err){
//                     errLog(err.stack.toString(), "text", "Mod-Log", "Error in Searching member");
//                 }
//             }else {
//                 const Member = await message.guild.members.fetch(memberID)
//                 try {
//                     await LogsDatabase.find({
//                         guildID: message.guild.id,
//                         userID: Member.id
//                     }).sort([
//                         ['ActionDate','ascending']
//                     ]).exec(async (err, res) => {
//                         if(err){
//                             console.log(err)
//                         }
//                         if(res.length == 0) {
//                             return message.channel.send({embeds: [new Discord.MessageEmbed()
//                                 .setAuthor("Mod-Logs")
//                                 .setDescription(`${Member.user} doesn't have any logs`)
//                                 .setColor("#fc5947")
//                             ]
//                             }).then(m=>setTimeout(() =>m.delete(), 1000 * 10))
//                         }
                        
//                         let currentIndex = 0
//                         const generateEmbed = start => {
//                             const current = res.slice(start, start + 5)
    
//                             const Embed = new Discord.MessageEmbed()
//                                 .setDescription(`${memberID} Mod-Logs - \`[${res.length}]\``)
//                                 .setFooter(`Logs ${start + 1} - ${start + current.length} out of ${res.length}`)
//                                 .setColor("#fffafa")
    
//                             for (i = 0; i < current.length; i++){
//                                 Embed.addField(`**${i + 1}**• [ ${current[i] && current[i].ActionType} ]`,[
//                                     `\`\`\`py\nUser     - ${current[i] && current[i].userName}`,
//                                     `\nReason   - ${current[i] && current[i].Reason}`,
//                                     `\nMod      - ${current[i] && current[i].Moderator}`,
//                                     `\nDuration - ${current[i] && current[i].Duration ? current[i] && current[i].Duration : "∞"}`, 
//                                     `\nDate     - ${moment(current[i] && current[i].ActionDate).format('llll')}`,
//                                     `\nLogID    - ${current[i] && current[i].CaseID}\`\`\``
//                                 ].toString())
//                             }
//                             try {
//                                 if(res.length <= 5){
//                                     return ({embeds: [Embed]})
//                                 }else if (start + current.length >= res.length){
//                                     return ({embeds: [Embed], components: [prev]})
//                                 }else if(current.length == 0){
//                                     return ({embeds: [Embed], components: [prev]})
//                                 }else if(currentIndex !== 0){
//                                     return ({embeds: [Embed], components: [next, prev]})
//                                 }else if (currentIndex + 10 <= res.length){
//                                     return ({embeds: [Embed], components: [next]})
//                                 }
//                             }catch(err) {
//                                 console.log(err)
//                             }
//                         }
    
//                         await message.channel.send(generateEmbed(0)).then(async msg => {
    
//                         const filter = (button) => button.clicker.user.id === message.author.id;
//                         const collector = msg.createMessageComponentCollector(filter, { time: 1000 * 60, errors: ['time'] });
    
//                         collector.on('collect',async b => {
//                             if(b.customId === 'NextPageModLog'){
//                                 currentIndex += 5
//                                 await b.update(generateEmbed(currentIndex))
//                             }
//                             if(b.customId === "PreviousPageModLog"){
//                                 currentIndex -= 5
//                                 await b.update(generateEmbed(currentIndex))
//                             }
//                         });
//                         collector.on("end", () =>{
//                             // When the collector ends
//                         })
//                         })
//                     })
//                 }catch(err){
//                     errLog(err.stack.toString(), "text", "Mod-Log", "Error in Searching member");
//                 }
//                 }
//             }else {
//                 return message.channel.send({embeds: [new Discord.MessageEmbed()
//                     .setDescription(`Couldn't find ${muteMember}`)
//                     .setColor("#fc5947")
//                 ]
//                 }).then(m=>setTimeout(() =>m.delete(), 1000 * 10))
//         }
//     }
// }