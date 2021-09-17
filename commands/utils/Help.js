// const { MessageButton } = require('discord-buttons');
// const { MessageEmbed } = require('discord.js')

// module.exports = {
//     name: 'help',

//     run: async(client, message, args,prefix) =>{
//         const Menu = new MessageEmbed()
//             .setAuthor(`${client.user.username} - Help Menu `, message.author.displayAvatarURL({dynamic: false, size: 1024, type: "png"}))
//             .addFields(
//                 {
//                     name: "Moderation", value: "Moderation type command such as mute, kick, ban"
//                 },
//                 {
//                     name: "Administration", value: "Administration type commands"
//                 },
//                 {
//                     name: "Fun", value: "Funny commands to have fun with friend"
//                 },
//                 {
//                     name: "Economy", value: "Per server economy"
//                 },
//                 {
//                     name: "Utils", value: "Utility type commands"
//                 }
//             )
//             .setColor("#fffafa")

//         const Mod = new MessageButton()
//             .setStyle("green")
//             .setLabel("Mod")
//             .setID("Moderation")

//         const Admin = new MessageButton()
//             .setStyle("red")
//             .setLabel("Admin")
//             .setID("Admin")

//         const Fun = new MessageButton()
//             .setStyle("green")
//             .setLabel("Fun")
//             .setID("Fun")

//         const Economy = new MessageButton()
//             .setStyle("red")
//             .setLabel("Economy")
//             .setID("Economy")

//         const Utils = new MessageButton()
//             .setStyle("green")
//             .setLabel("Utils")
//             .setID("Utils")

//         const mainMenu = new MessageButton()
//             .setStyle("red")
//             .setLabel("Back")
//             .setID("HelpMenu")

//         const MSG = await message.channel.send({
//             buttons: [Mod, Admin, Fun, Economy, Utils],
//             embeds: [Menu]
//         })

//         const Moderation = new MessageEmbed()
//             .setAuthor(`Help Menu - Moderation`)
//             .addFields(
//                 {
//                     name: "Mute", value: `${prefix}mute [ Member ] [ Duration ] [ Reason ]`
//                 },
//                 {
//                     name: "Unmute", value: `${prefix}unmute [ Member ]`
//                 },
//                 {
//                     name: "Warn", value: `${prefix}warn [ Member ] [ Reason ]`
//                 },
//                 {
//                     name: "seek", value: `${prefix}fetch [ Member ]`
//                 },
//                 {
//                     name: "Logs", value: `${prefix}logs [ Member ]`
//                 },
//                 {
//                     name: "Ban", value: `${prefix}ban [ Member ] [ Reason ]`
//                 },
//                 {
//                     name: "Kick", value: `${prefix}kick [ Member ] [ Reason ]`
//                 },
//                 {
//                     name: "Purge", value: `${prefix}purge [ Amount ] [ Member ]`
//                 },
//                 {
//                     name: "Clean", value: `${prefix}clean [ amount ]`
//                 },
//                 {
//                     name: "Lock", value: `${prefix}lock [ channel ]`
//                 },
//                 {
//                     name: "Unock", value: `${prefix}unlock [ channel ]`
//                 },
//                 {
//                     name: "Slowmode", value: `${prefix}sm [ interval ]`
//                 },
//             )
//             .setColor("#fffafa")

//         const Administration = new MessageEmbed()
//             .setAuthor(`Help Menu - Administraton`)
//             .addFields(
//                 {
//                     name: "Moderator", value: `${prefix}moderator [ enable | Disable ] [ Role(s) ]`
//                 },
//                 {
//                     name: "Overseer", value: `${prefix}overseer [ enable | Disable ] [ Role(s) ]`
//                 },
//                 {
//                     name: "Admin-Log", value: `${prefix}Admin-log [ option ]`
//                 },
//                 {
//                     name: "Action-Log", value: `${prefix}action-log [ enable | Disable ] [ channel ]`
//                 },
//                 {
//                     name: "Message-Log", value: `${prefix}message-log [ enable | Disable ] [ edit | delete | default ] [ channel ]`
//                 },
//                 {
//                     name: "Message-Ignore", value: `${prefix}message-ignore [ add | Dremove ] [ channel | role ] [ Channels | roles ]`
//                 },
//                 {
//                     name: "Announce", value: `${prefix}announce [ enable | Disable ] [ joined | left ] [ channel ]`
//                 },
//                 {
//                     name: "Ban-Log", value: `${prefix}ban-log [ enable | Disable ] [ channel ]`
//                 },
//                 {
//                     name: "Status-Log", value: `${prefix}status-log [ enable | Disable ] [ channel ]`
//                 },
//                 {
//                     name: "User-Log", value: `${prefix}user-log [ enable | Disable ] [ channel ]`
//                 },
//                 {
//                     name: "Roles-Log", value: `${prefix}roles-log [ enable | Disable ] [ channel ]`
//                 },
//                 {
//                     name: "Delete-log", value: `${prefix}delete-log [ Log-ID ]`
//                 },
//                 {
//                     name: "Reset-Log", value: `${prefix}reset-log [ enable | Disable ] [ channel ]`
//                 },
//                 {
//                     name: "Custom-command", value: `${prefix}cc (too big to fit here. type >cc to check the help)`
//                 },
//             )
//             .setColor("#fffafa")

//             const FunType = new MessageEmbed()
//                 .setAuthor(`Help Menu - Fun`)
//                 .addFields(
//                     {
//                         name: "8ball", value: `${prefix}8ball [ message ]`
//                     },
//                     {
//                         name: "Findgf/Findbf", value: `${prefix}findgf`
//                     },
//                 )
//                 .setColor("#fffafa")

//             const EconomyType = new MessageEmbed()
//                 .setAuthor(`Help Menu - Economy`)
//                 .setDescription("Coming Soon")
//                 .setColor("#fffafa")

//             const UtilityType = new MessageEmbed()
//                 .setAuthor(`Help Menu - Administraton`)
//                 .addFields(
//                     {
//                         name: "Ping", value: `${prefix}ping`
//                     },
//                     {
//                         name: "Server", value: `${prefix}server [ info | roles ]`
//                     },
//                     {
//                         name: "Avatar", value: `${prefix}avatar [ Member ]`
//                     },
//                 )
//                 .setColor("#fffafa")

//         client.on('clickButton', async (button) => {
//             button.defer()
//             if(button.clicker.user.id !== message.author.id){
//                 return
//             }else if(button.id === "Moderation"){

//                 await MSG.edit({embesd: [Moderation], button: mainMenu})

//             }else if(button.id === "Admin"){
                
//                 await MSG.edit({embeds: [Administration], button: mainMenu})

//             }else if(button.id === "Fun"){
//                 await MSG.edit({embeds: [FunType], button: mainMenu})

//             }else if(button.id === "Economy"){
//                 await MSG.edit({embeds: [EconomyType], button: mainMenu})

//             }else if(button.id === "Utils"){
//                 await MSG.edit({embeds: [UtilityType], button: mainMenu})

//             }else if(button.id === "HelpMenu"){

//                 await MSG.edit({embeds: [Menu], button: [Mod, Admin, Fun, Economy, Utils]})
//             }
//         });


//     }
// }