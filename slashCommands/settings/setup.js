// const { SlashCommandBuilder } = require('@discordjs/builders');
// const Discord = require('discord.js');
// const { Guild } = require('../../models');
// const { MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');
// const wait = require('util').promisify(setTimeout);

// module.exports = {
//     data: new SlashCommandBuilder()
//         .setName('setup')
//         .setDescription('Setup sadbot on your server'),
//     permissions: ["ADMINISTRATOR", "MANAGE_GUILD"],
//     botPermission: ["SEND_MESSAGES"],
//     category: "Slash",
//     run: async(client, interaction) =>{
//         interaction.deferReply();
//         await new Promise(resolve => setTimeout(resolve, 1000))

//         const { options } = interaction;

//         const menuRow = new MessageActionRow()
//             .addComponents(
//                 new MessageSelectMenu()
//                     .setCustomId("setupmainmenu")
//                     .setPlaceholder("Please select a option")
//                     .setOptions([
//                         {
//                             label: "Prefix",
//                             description: "Change server prefix",
//                             value: 'prefixoption'
//                         },
//                         {
//                             label: "Log-Channels",
//                             description: "Setup server log channels",
//                             value: 'logoption'
//                         },
//                         {
//                             label: "Moderation-Roles",
//                             description: "Setup moderation type roles",
//                             value: 'roleoption'
//                         },
//                     ])
//             )
//         const logRow = new MessageActionRow()
//             .addComponents(
//                 new MessageSelectMenu()
//                     .setCustomId("setuplogmenu")
//                     .setOptions([
//                         {
//                             label: "Action-log",
//                             description: "Mute/unmute log channel",
//                             value: 'actionlog'
//                         },
//                         {
//                             label: "Ban-log",
//                             description: "Ban/unban log channel",
//                             value: 'banlog'
//                         },
//                         {
//                             label: "Message-log",
//                             description: "Message delete/edit log channel",
//                             value: 'messagelog'
//                         },
//                         {
//                             label: "Limit-log",
//                             description: "Log limit reached alert log channel",
//                             value: 'alertlog'
//                         },
//                         {
//                             label: "Welcome",
//                             description: "New member greeting log channel",
//                             value: 'welcomelog'
//                         },
//                         {
//                             label: "Goodbye",
//                             description: "Farewell for the member who left log channel",
//                             value: 'byelog'
//                         },
//                         {
//                             label: "Story-log",
//                             description: "Story command message log channel",
//                             value: 'storylog'
//                         },
//                     ])
//             )
//         function Menu(){
//             interaction.editReply({embeds: [
//                 new Discord.MessageEmbed()
//                     .setDescription(`Please select a category`)
//             ], components: [menuRow]})
//             .then( i => {
//                 let collector = i.createMessageComponentCollector({time: 1000 * 60})

//                 collector.on('collect', (menu) => {
//                     if(menu.customId == 'setupmainmenu'){
//                         i.edit({components: []})
//                         MenuType(menu.values.join(" "), menu, i)
//                         collector.stop()
//                     }
//                 })
//             })
//         }
//         Menu();

//         function MenuType(type, menu, i){
//             switch (type){
//                 case 'logoption':
//                     LogMenu(menu, i)
//                 break;
//             }
//         }

//         function LogMenu(menuInter, i){
//             menuInter.update({embeds: [
//                 new Discord.MessageEmbed()
//                     .setDescription("Select log option")
//             ], components: [logRow]})
//             .then(()=> {
//                 let collector = i.createMessageComponentCollector({time: 1000 * 60})

//                 collector.on('collect', (menu) => {
//                     if(menu.customId == 'setuplogmenu'){
//                         SaveData(menu.values.join(" "), i)
//                     }
//                 })
//             })
//         }

//         async function SaveData(type){
//             return interaction.
//         }

//         function filterName(data){
//             return data
//             .replace("actionlog", "Action-log")
//             .replace("banlog", "Ban-log")
//             .replace("messagelog", "Message-log")
//             .replace("altertlog", "Limit-Alert-log")
//             .replace("welcomelog", "Welcome-log")
//             .replace("byelog", "Bye-log")
//             .replace("storylog", "Story-log")
//         }
//     }
// }