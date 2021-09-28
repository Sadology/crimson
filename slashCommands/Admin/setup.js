// const { SlashCommandBuilder, roleMention } = require('@discordjs/builders');
// const wait = require('util').promisify(setTimeout);
// const Discord = require('discord.js');
// const { GuildChannel } = require('../../models');
// const { errLog } = require('../../Functions/erroHandling');
// module.exports = {
//     data: new SlashCommandBuilder()
//         .setName('set-logChannels')
//         .setDescription('Setup any log channels/mod roles.')
//         .addStringOption(option =>
//             option.setName("options")
//             .setDescription("Options you would like to change.")
//             .setRequired(true)
//             .addChoice('action-log','actionLog')
//             .addChoice('announce-log','announcelog')
//             .addChoice('ban-log','banlog')
//             .addChoice('message-log','messageLog')
//             .addChoice('roles-log','rolesLog')
//             .addChoice('status-log','statusLog')
//             .addChoice('user-log','userLog'))
//         .addStringOption(option =>
//             option.setName("value")
//             .setDescription("Enable/disable or reset a log channel.")
//             .setRequired(true)
//             .addChoice('enable', 'enableLog')
//             .addChoice('disable', 'disableLog')
//             .addChoice('reset', 'resetLog'))
//         .addChannelOption(option =>
//             option.setName("log-channel")
//             .setDescription('Selected log option will log into the selected channel')),
//     permission: ["ADMINISTRATOR"],
//     run: async(client, interaction) =>{
//         const { options } = interaction;

//         const logOption = options.getString('options');
//         const value = options.getString('value');
//         const channels = options.getString('log-channel');

//         if(logOption){
//             if(value){
//                 switch(value){
//                     case 'enableLog':
//                         if(channels){
//                             async function saveToDatabase(option,,value){
//                                 try {
//                                     await GuildChannel.findOneAndUpdate({
//                                         guildID: message.guild.id,
//                                         Active: true
//                                     },{
//                                         guildName: message.guild.name,
//                                         [`ActionLog.${option}`]: value
//                                         [`ActionLog.${option}`]: value
//                                         ActionLog: {
//                                             MuteChannel: value,
//                                             MuteEnabled: true,
//                                             UnMuteChannel: value,
//                                             UnMuteEnanled: true
//                                         }
//                                     },{
//                                         upsert: true,
//                                     })
//                                 } catch (err) {
//                                     errLog(err.stack.toString(), "text", "slashSetup", "Error in Database Function")
//                                 }
//                             }
//                         }
//                     break;
//                 }
//             }
//         }
//     }
// }