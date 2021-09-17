// const Discord = require('discord.js');
// const { MessageEmbed } = require('discord.js')
// const { LogsDatabase, GuildRole} = require('../../models')
// const moment = require('moment');
// const { MessageButton } = require('discord-buttons');
// const { errLog } = require('../../Functions/erroHandling');

// module.exports = {
//     name: 'whois',
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
//                             return await message.channel.send(missingPerm).then(m=>m.delete({timeout: 1000 * 10}));
//                         }
//                     }
//                 }else if(permData.ModOptions.Enabled === false){
//                     if(!message.member.permissions.has(["BAN_MEMBERS", "MANAGE_GUILD", "ADMINISTRATOR"])){
//                         return await message.channel.send(missingPerm).then(m=>m.delete({timeout: 1000 * 10}));
//                     }
//                 }
//             }
//         }

//         const TutEmbed = new MessageEmbed()
//         .setAuthor("Command - Whois")
//         if( !args.length ){
//             TutEmbed.setDescription( `Show info about a Member \n**Usage**: ${prefix}whois [ Member ] \n**Example:** \n${prefix}whois @shadow~` )
//             TutEmbed.setColor( "#fffafa" )
//             return message.channel.send( TutEmbed ).then(m=>m.delete({ timeout: 1000 * 20 }));
//         }

//         const Member = await message.mentions.members.first() || await message.channel.guild.members.fetch({cache : false}).then(members=>members.find(member=>member.user.tag === args[0])) || await message.guild.members.fetch(args[0]);

//         const MoreInfo = new MessageButton()
//             .setStyle("green")
//             .setLabel("More")
//             .setID("whoisInfo")

//         if(Member){
//             const roles = Member.roles.cache
//                 .sort((a,b) => b.position - a.position)
//                 .map(role => role.toString())
//                 .slice(0, -1)
//                 .join(', ') || "None"
    
//             let array = Member.permissions.toArray()

//             const permFlag = [
//                 "ADMINISTRATOR", 
//                 "MANAGE_GUILD",
//                 "VIEW_GUILD_INSIGHTS",
//                 "KICK_MEMBERS", 
//                 "BAN_MEMBERS", 
//                 "MANAGE_CHANNELS", 
//                 "MANAGE_MESSAGES",
//                 "MUTE_MEMBERS",
//                 "DEAFEN_MEMBERS",
//                 "MOVE_MEMBERS",
//                 "MENTION_EVERYONE",
//                 "MANAGE_NICKNAMES",
//                 "MANAGE_ROLES",
//                 "MANAGE_WEBHOOKS",
//                 "MANAGE_EMOJIS",
//                 "ADD_REACTIONS",
//                 "VIEW_AUDIT_LOG"
//             ]
//             const perms = array.filter( i => permFlag.includes(i))
//             const permArr = perms.join(", ")
//             const permData = permArr.split("_").join(" ");


//             const Embed = new MessageEmbed()
//                 .setAuthor(`${Member.user.username}'s Informations`, Member.user.displayAvatarURL({
//                     dynamic: true, 
//                     type: 'png', 
//                     size: 1024
//                 }))
//                 .setDescription(`User: ${Member.user} - \`${Member.user.tag}\``)

//                 Embed.setThumbnail(Member.user.displayAvatarURL({
//                     dynamic: true, 
//                     type: 'png', 
//                     size: 1024
//                 }))
//                 .addFields(
//                     {
//                         name: 'Joined-At', value: `${moment(Member.joinedAt).format('MMMM Do YYYY, h:mm:ss a')} - ${moment(Member.joinedAt, "YYYYMMDD").fromNow()}`, inline: true,
//                     },
//                     {
//                         name: 'Created-At', value: `${moment(Member.user.createdAt).format('MMMM Do YYYY, h:mm:ss a')} - ${moment(Member.user.createdAt, "YYYYMMDD").fromNow()}`, inline: true,
//                     },
//                     {
//                         name: 'Avatar-Url', value: ` [URL](${Member.user.displayAvatarURL()}) `,
//                     },
//                     {
//                         name: 'Booster-Since', value: `${Member.user.premiumSinceTimestamp ? Member.user.premiumSinceTimestamp : "Not a booster"}`, inline: true,
//                     },
//                     {
//                         name: 'Presence', value: `${Member.user.presence.status}`, inline: true,
//                     }
//                 )
//                 .setColor(Member.displayColor)

//             const MSG = await message.channel.send({embed: Embed, button: MoreInfo})

//             const filter = (button) => button.clicker.user.id === message.author.id;
//             const collector = MSG.createButtonCollector(filter, { time: 1000 * 60, max: 1 });

//             collector.on('collect',async b => {
//                 b.defer()
//                 if(b.id === "whoisInfo"){
//                     try{
//                         const EditedEmbed = new MessageEmbed()
//                             EditedEmbed.setAuthor(`${Member.user.tag}'s Informations`, Member.user.displayAvatarURL({dynamic: true, type: 'png', size: 1024}))
//                             EditedEmbed.addField(`Roles [${Member.roles.cache.size -1 }]`, roles)
//                             EditedEmbed.addField('Key perms', `\`\`\`${permData ? permData.toLowerCase() : "NONE"}\`\`\``)
//                             EditedEmbed.setColor(Member.displayColor)
//                         if(message.guild.ownerID === Member.id){
//                             EditedEmbed.addField("Rank", "Server Owner")
//                         }else if(Member.permissions.has("ADMINISTRATOR")){
//                             EditedEmbed.addField("Rank", "Server Admin")
//                         }else if(Member.permissions.has(["MANAGE_GUILD", "VIEW_GUILD_INSIGHTS"])){
//                             EditedEmbed.addField("Rank", "Server Manager")
//                         }else if(Member.permissions.has(["MANAGE_CHANNELS", "KICK_MEMBERS", "BAN_MEMBERS", "VIEW_AUDIT_LOG", "MANAGE_MESSAGES", "MENTION_EVERYONE", "MUTE_MEMBERS", "DEAFEN_MEMBERS", "MOVE_MEMBERS", "MANAGE_NICKNAMES", "MANAGE_ROLES", "MANAGE_EMOJIS"])){
//                             EditedEmbed.addField("Rank", "Server Moderator")
//                         }


//                         MSG.edit({embed: EditedEmbed})
//                     } catch (err){
//                         errLog(err.stack.toString(), "text", "Whois", "Error in Fetching data");
//                     }
//                 }
//             });
//             collector.on("end", () =>{

//             })
//         }else {
//             message.channel.send({embed: new MessageEmbed()
//                 .setDescription("Please mention a valid Member")
//                 .setColor('#ff303e')
//             })
//         }
//     }
// };