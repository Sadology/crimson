// const { SlashCommandBuilder, roleMention } = require('@discordjs/builders');
// const wait = require('util').promisify(setTimeout);
// const Discord = require('discord.js');
// const { Guild } = require('../../models');
// const { errLog } = require('../../Functions/erroHandling');

// module.exports = {
//     data: new SlashCommandBuilder()
//         .setName('welcome-goodbye')
//         .setDescription('Announce message when member leaves or join the server.')
//         .addStringOption(option =>
//             option.setName("options")
//             .setDescription("Options you would like to change.")
//             .setRequired(true)
//             .addChoice('welcome','welcomelog')
//             .addChoice('goodbye','byelog'))
//         .addStringOption(option =>
//             option.setName("settings")
//             .setDescription("Enable/Disable or set a custom message.")
//             .setRequired(true)
//             .addChoice('enable', 'enablelog')
//             .addChoice('disable', 'disablelog')
//             .addChoice('info', 'info'))
//         .addChannelOption(option =>
//             option.setName("channel")
//             .setDescription('Announcement channel. Bot will greet/farewell in the channel.')),
//     permissions: ["ADMINISTRATOR", "MANAGE_GUILD"],
//     botPermission: ["SEND_MESSAGES"],
//     category: "Slash",
//     run: async(client, interaction) =>{
//         const { options } = interaction;

//         const logOption = options.getString('options');
//         const value = options.getString('settings');
//         const channels = options.getChannel('channel');

//         function optionConfig() {
//             if(!value) return interaction.reply({
//                 embeds: [
//                     new Discord.MessageEmbed()
//                     .setDescription("Please select a option to setup welcome/goodbye")
//                     .setColor("RED")
//                 ], ephemeral: true
//             })
//             switch(value){
//                 case 'enablelog':
//                     verifyChannel()
//                     saveLog()
//                 break;
//                 case 'disablelog':
//                     deleteData()
//                 break;
//                 case "info":
//                     logInfo()
//                 break;
//             }
//         }
//         optionConfig()

//         function verifyChannel() {
//             if(!channels) return interaction.reply({
//                 embeds: [
//                     new Discord.MessageEmbed()
//                     .setDescription("please mention channel to set as logging channel.")
//                     .setColor("RED")
//                 ], ephemeral: true
//             })
//         }

//         async function saveLog() {
//             if(!channels) return
//             await Guild.updateOne({
//                 guildID: interaction.guild.id
//             }, {
//                 $set: {
//                     [`Logchannels.${logOption.toLowerCase()}`]: channels
//                 }
//             })
//             .then(() => {
//                 return interaction.reply({embeds: [
//                     new Discord.MessageEmbed()
//                         .setDescription(`<:online:926939036562628658> **${filteranme(logOption.toLowerCase())}** has been __Enabled__\n<:reply:897083777703084035> \`Channel:\` ${channels}`)
//                         .setColor("GREEN")
//                 ]})
//             })
//             .catch(err => {
//                 return console.log(err.stack)
//             })
//         }
//         function filteranme(data){
//             return data
//             .replace("welcomelog", "Welcome-channel")
//             .replace("byelog", "Goodbye-channel")
//         }

//         async function deleteData() {
//             await Guild.updateOne({
//                 guildID: interaction.guild.id
//             }, {
//                 $unset: {
//                     [`Logchannels.${logOption.toLowerCase()}`]: ''
//                 }
//             })
//             .then(() => {
//                 return interaction.reply({embeds: [
//                     new Discord.MessageEmbed()
//                         .setDescription(`<:dnd:926939036281610300> **${filteranme(logOption.toLowerCase())}** has been __Disabled__\n`)
//                         .setColor("GREEN")
//                 ]})
//             })
//             .catch(err => {
//                 interaction.reply({embeds: [
//                     new Discord.MessageEmbed()
//                         .setDescription(`Please setup this log channel before disabling it`)
//                         .setColor("RED")
//                 ]}).catch(err => {return console.log(err.stack)})
//                 return console.log(err.stack)
//             })
//         }

//         async function logInfo(){
//             await Guild.findOne({
//                 guildID: interaction.guild.id
//             })
//             .then((res) => {
//                 if(!res.Logchannels?.has(logOption.toLowerCase())){
//                     return interaction.reply({embeds: [
//                         new Discord.MessageEmbed()
//                             .setAuthor({
//                                 name: 'Log Channels',
//                                 iconURL: client.user.displayAvatarURL({format: 'png'})
//                             })
//                             .setDescription(`
//                             Type - \`${filteranme(logOption.toLowerCase())}\`
//                             **Enabled** \` ⥋ \` false
//                             **Channel** \` ⥋ \` None`)
//                             .setColor("WHITE")
//                     ]}).catch(err => {return console.log(err.stack)})
//                 }else {
//                     let data = res.Logchannels?.get(logOption.toLowerCase())

//                     let channel = interaction.guild.channels.resolve(data)
//                     return interaction.reply({embeds: [
//                         new Discord.MessageEmbed()
//                             .setAuthor({
//                                 name: 'Log Channels',
//                                 iconURL: client.user.displayAvatarURL({format: 'png'})
//                             })
//                             .setDescription(`
//                             Type - \` ${filteranme(logOption.toLowerCase())} \`
//                             **Enabled** \` ⥋ \` ${data ? 'true': 'false'}
//                             **Channel** \` ⥋ \` ${channel ? channel.toString() : "None"}`)
//                             .setColor("WHITE")
//                     ]}).catch(err => {return console.log(err.stack)})
//                 }
//             })
//             .catch(err => {
//                 return console.log(err.stack)
//             })
//         }
//     }
// }