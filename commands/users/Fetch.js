// const Discord = require('discord.js');
// const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js')
// const { LogsDatabase, GuildRole} = require('../../models')
// const moment = require('moment');
// const { errLog } = require('../../Functions/erroHandling');

// module.exports = {
//     name: 'seek',
//     aliases: ["fetch",],
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
//                             return await message.channel.send({content: missingPerm}).then(m=>setTimeout(() => m.delete(), 1000 * 10));
//                         }
//                     }
//                 }else if(permData.ModOptions.Enabled === false){
//                     if(!message.member.permissions.has(["BAN_MEMBERS", "MANAGE_GUILD", "ADMINISTRATOR"])){
//                         return await message.channel.send({content: missingPerm}).then(m=>setTimeout(() => m.delete(), 1000 * 10));
//                     }
//                 }
//             }
//         }

//         const TutEmbed = new MessageEmbed()
//         .setAuthor("Command - Seek")
//         if( !args.length ){
//             TutEmbed.setDescription( `Members informations \n**Usage**: ${prefix}seek [ Member ] \n**Example:** \n${prefix}seek @shadow~ \n${prefix}fetch @shadow~` )
//             TutEmbed.setColor( "#fffafa" )
//             return message.channel.send( {embeds: [TutEmbed] } ).then(m=>setTimeout(() => m.delete(), 1000 * 10));
//         }

//         const regexx = /[\d+]/g
//         if(!args[0].match( regexx )){
//             let errEmbed = new Discord.MessageEmbed()
//             .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({dynamic: false, size: 1024, type: "png"}))
//             .setColor("#fc5947")
//             .setDescription(`Please mention a valid Member.`)

//             return message.channel.send({embeds:[errEmbed]}).then(m=>setTimeout(() => m.delete(), 1000 * 10))
//         }

//         const regex = /[\d]/g;
//         const findMember = message.content.split(/\s+/)[1];
//         const member = findMember.replace('<@', '').replace('>', '')
//         .replace('&', '')
//         .replace('!', '').trim();

//         const count = await LogsDatabase.countDocuments({
//             guildID: message.guild.id, 
//             userID: member
//         })

//         const row = new MessageActionRow()
//             .addComponents(
//                 new MessageButton()
//                 .setStyle("SUCCESS")
//                 .setLabel("More")
//                 .setCustomId("Info")
//                 .setEmoji("❔")
//             )

//         if(member.match(regex)){
//             const Member = await message.guild.members.fetch(member)
//             if(member){
//                 try {
//                     const roles = Member.roles.cache
//                     .sort((a,b) => b.position - a.position)
//                     .map(role => role.toString())
//                     .slice(0, -1)
//                     .join(', ') || "None"

//                     let array = Member.permissions.toArray()

//                     const permFlag = [
//                         "ADMINISTRATOR", 
//                         "MANAGE_GUILD", 
//                         "KICK_MEMBERS", 
//                         "BAN_MEMBERS", 
//                         "MANAGE_CHANNELS", 
//                         "MANAGE_MESSAGES",
//                         "MUTE_MEMBERS",
//                         "DEAFEN_MEMBERS",
//                         "MOVE_MEMBERS",
//                         "MANAGE_NICKNAMES",
//                         "MANAGE_ROLES",
//                         "MANAGE_WEBHOOKS",
//                         "MANAGE_EMOJIS",
//                         "ADD_REACTIONS",
//                         "VIEW_AUDIT_LOG"
//                     ]
//                     const perms = array.filter( i => permFlag.includes(i))
//                     const permArr = perms.join(", ")
//                     const permData = permArr.split("_").join(" ")

//                     const Embed = new MessageEmbed()
//                         .setAuthor(`${Member.user.tag}`, Member.user.displayAvatarURL({
//                             dynamic: true, 
//                             type: 'png', 
//                             size: 1024
//                         }))
//                         .setThumbnail(Member.user.displayAvatarURL({
//                             dynamic: true,
//                             type: 'png',
//                             size: 1024
//                         }))
//                         .addField('User', `\`\`\`${Member.user.tag}\`\`\``, true)
//                         .addField('User ID', `\`\`\`${Member.user.id}\`\`\``, true)
//                         .addField("Logs", count ? `\`\`\`${count}\`\`\`` : "\`\`\`0\`\`\`", true)
//                         .addField('Created At', `\`\`\`${moment(Member.user.createdAt).format('MMMM Do YYYY, h:mm:ss a')} - ${moment(Member.user.createdAt, "YYYYMMDD").fromNow()}\`\`\``,true)
//                         .addField('Joined at', `\`\`\`${moment(Member.user.joinedAt).format('MMMM Do YYYY, h:mm:ss a')} - ${moment(Member.user.joinedAt, "YYYYMMDD").fromNow()}\`\`\``,true)
//                         .setColor(Member.displayColor)

//                     const MSG = await message.channel.send({content:`${Member.user}`,embeds: [ Embed ], components: [row]})

//                     const filter = (button) => button.clicker.user.id === message.author.id;
//                     const collector = MSG.createMessageComponentCollector(filter, { time: 1000 * 60, max: 1 });

//                     collector.on('collect',async b => {
//                         if(b.customId === "Info"){
//                             const EditedEmbed = new MessageEmbed()
//                                 .setAuthor(`${Member.user.tag}`, Member.user.displayAvatarURL({dynamic: true, type: 'png', size: 1024}))
//                                 .addField('User', `\`\`\`${Member.user.tag}\`\`\``, true)
//                                 .addField('User ID', `\`\`\`${Member.user.id}\`\`\``, true)
//                                 .setThumbnail(Member.user.displayAvatarURL({
//                                     dynamic: true, 
//                                     type: 'png', 
//                                     size: 1024
//                                 }))
//                                 .addField("Logs", count ? `\`\`\`${count}\`\`\`` : "\`\`\`0\`\`\`", true)
//                                 .addField('Created At', `\`\`\`${moment(Member.user.createdAt).format('MMMM Do YYYY, h:mm:ss a')} - ${moment(Member.user.createdAt, "YYYYMMDD").fromNow()}\`\`\``,true)
//                                 .addField('Joined at', `\`\`\`${moment(Member.joinedAt).format('MMMM Do YYYY, h:mm:ss a')} - ${moment(Member.joinedAt, "YYYYMMDD").fromNow()}\`\`\``,true)
//                                 .addField(`Roles [${Member.roles.cache.size -1 }]`, roles)
//                                 .addField('Key perms', `\`\`\`${permData ? permData.toLowerCase() : "NONE"}\`\`\``)
//                                 .setColor(Member.displayColor)

//                             b.update({content: `${Member.user}`,embeds: [EditedEmbed], components: []})
//                         }
//                     });
//                 collector.on("end", () =>{
//                 })
//                 }catch(err){
//                     errLog(err.stack.toString(), "text", "Seek/Fetch", "Error in Finding Member");
//                 }
//             }else {
//                 try {
//                     const banList = await message.guild.fetchBans(member);
//                     const bannedMember = banList.find(user => user.user.id == member)
        
//                     if(bannedMember){
//                         const bannedEmbed = new MessageEmbed()
//                             .setAuthor(`${bannedMember.user.username}`)
//                             .addField('User', `\`\`\`${bannedMember.user.tag}\`\`\``, true)
//                             .addField('User ID', `\`\`\`${bannedMember.user.id}\`\`\``, true)
//                             .addField("Logs", count ? `\`\`\`${count}\`\`\`` : "\`\`\`0\`\`\`", true)
//                             .setThumbnail(bannedMember.user.displayAvatarURL({
//                                 dynamic: true, 
//                                 type: 'png', 
//                                 size: 1024
//                             }))
//                             .addField("Ban Reason", `\`\`\`${bannedMember.reason}\`\`\``)
//                             .addField('Created At', `\`\`\`${moment(bannedMember.user.createdAt).format('MMMM Do YYYY, h:mm:ss a')} - ${moment(bannedMember.user.createdAt, "YYYYMMDD").fromNow()}\`\`\``,true)
//                             .setColor("#f22944")
//                         message.channel.send({content: `${bannedMember.user}`, embeds: [bannedEmbed]})
//                     }
//                 }catch (err) {
//                     errLog(err.stack.toString(), "text", "Seek/Fetch", "Error in Finding Data");
//                 }
//             }
//         }
        
//     }
// };