// const { SlashCommandBuilder, roleMention } = require('@discordjs/builders');
// const wait = require('util').promisify(setTimeout);
// const Discord = require('discord.js');
// const { GuildRole } = require('../../models');

// module.exports = {
//     data: new SlashCommandBuilder()
//         .setName('set-roles')
//         .setDescription('setup different roles.')
//         .addStringOption(option =>
//             option.setName("options")
//             .setDescription("Options you would like to change.")
//             .setRequired(true)
//             .addChoice('moderator','modRole')
//             .addChoice('manager','Management'))
//         .addStringOption(option =>
//             option.setName("value")
//             .setDescription("Enable/disable roles.")
//             .setRequired(true)
//             .addChoice('enable', 'enableRoles')
//             .addChoice('disable', 'disableRoles')
//             .addChoice('remove', 'removeRoles')
//             .addChoice('info', 'information'))
//         .addStringOption(option =>
//             option.setName("roles")
//             .setDescription('Mention all the roles you want to set.')),
//     permission: ["ADMINISTRATOR"],
//     run: async(client, interaction) =>{
//         const { options, guild } = interaction;
//         const logOption = options.getString('options');
//         const value = options.getString('value');
//         const roles = options.getString('roles');

//         async function fetchData() {
//             await GuildRole.findOne({
//                 guildID: interaction.guild.id,
//                 Active: true
//             }).then(res => {
//                 if(res){
//                     optionConfig();
//                 }else {
//                     return;
//                 };
//             })
//         }
//         fetchData()

//         function optionConfig() {
//             if(!value) return interaction.reply({
//                 embeds: [
//                     new Discord.MessageEmbed()
//                     .setDescription("Please select a log option")
//                     .setColor("RED")
//                 ], ephemeral: true
//             })
//             switch(value){
//                 case 'enableRoles':
//                     checkRoles(roles)
//                 break;
//                 case 'disableRoles':
//                     disableData(logOption)
//                 break;
//                 case "removeRoles":
//                     info()
//                 break;
//                 case "information":
//                     info()
//                 break;
//             }
//         }

//         let errorEmbed = new Discord.MessageEmbed()
//         function checkRoles(data) {
//             if(!data) return interaction.reply({
//                 embeds: [new Discord.MessageEmbed()
//                     .setDescription("Please mention the roles you want to add/remove")
//                     .setColor("RED")    
//                 ]
//             })

//             let divide = data.split(/,\s+/)
//             let elements = divide.map(function (el) {
//                 return el.trim()});
//             let RolesArr = []
//             let undefinedRole = []

//             elements.forEach(items => {
//                 let guildRoles = guild.roles.cache.find(r => r.id == items.replace( '<@&' , '' ).replace( '>' , '' )) || 
//                 guild.roles.cache.find(r => r.name.toLowerCase() == items.toLowerCase()) || 
//                 guild.roles.cache.find(r => r.id == items);

//                 if(guildRoles){
//                     RolesArr.push(guildRoles.id)
//                 }else if(typeof guildRoles === "undefined"){
//                     function add(value) {
//                         if (undefinedRole.indexOf(value) === -1) {
//                             undefinedRole.push(value);
//                         }
//                     }
//                     add(items)
//                 }
//             })

//             if(undefinedRole.length){
//                 errorEmbed.setDescription(`Can't find this following roles: \n${undefinedRole}`)
//                 return interaction.reply({embeds: [errorEmbed]})
//             }

//             saveLog({DataType: logOption, Data: RolesArr})
//         }

//         async function saveLog({DataType, Data}) {
//             let items = {
//                 Roles: [...Data],
//                 Name: DataType,
//                 Enabled: true
//             } 
//             GuildRole.findOne({
//                 guildID: interaction.guild.id,
//                 Active: true,
//                 ['Roles.Name']: DataType
//             }).then(async (res) => {
//                 if(res){
//                     GuildRole.findOneAndUpdate({
//                         guildID: interaction.guild.id,
//                         Active: true,
//                         ['Roles.Name']: DataType
//                     }, {
//                         ["Roles"]: {
//                             $push: {
//                                 Roles: [...Data]
//                             }
//                         },
//                     }, {
//                         upsert: true
//                     }).then(() =>{
//                         return interaction.reply("Done")
//                     })
//                     .catch(err => {
//                         console.log(err)
//                     })
//                 }else {
//                     GuildRole.findOneAndUpdate({
//                         guildID: interaction.guild.id,
//                         Active: true,
//                     }, {
//                         $push: {
//                             ["Roles"]: {
//                                 ...items
//                             }
//                         },
//                     }, {
//                         upsert: true
//                     }).then(() =>{
//                         return interaction.reply("Done")
//                     })
//                     .catch(err => {
//                         console.log(err)
//                     })
//                 }
//             })
//             .catch(err => {
//                 return console.log(err)
//             })
//         }

//         async function disableData(DataType) {
//             let fetchData = await GuildRole.findOneAndUpdate({
//                 guildID: interaction.guild.id,
//                 Active: true,
//                 [`Roles.Name`]: DataType
//             }, {
//                 ['Roles.Roles']: [],
//                 ['Roles.Enabled']: false
//             }).then(() =>{
//                 interaction.reply("DOne")
//             })
//             .catch(err => {
//                 interaction.reply({embeds: [
//                     new Discord.MessageEmbed()
//                         .setDescription("This log channel does not exist. Set up now by `/set-logchannel`")
//                         .setColor("RED")
//                 ], ephemeral: true})
//                 return console.log(err)
//             })
//         }

//         async function info() {
//             let ifLogChannel = await GuildChannel.findOne({
//                 guildID: interaction.guild.id,
//                 Active: true,
//                 [`Data.name`]: logOption
//             })

//             if(ifLogChannel){
//                 let data = ifLogChannel.Data.find(i => i.name == logOption) 
//                 return interaction.reply({
//                     embeds: [new Discord.MessageEmbed()
//                         .setAuthor("LogChannels", interaction.user.displayAvatarURL({dynamic: true, size: 1024, type: 'png'}))
//                         .setDescription(`**${data.name}:** <#${data.channel}>`)
//                         .setColor("WHITE")
//                     ]
//                 })
//             }else {
//                 return interaction.reply({embeds: [
//                     new Discord.MessageEmbed()
//                         .setDescription("This log channel does not exist. Set up now by `/set-logchannel`")
//                         .setColor("RED")
//                 ], ephemeral: true})
//             }
//         }
//     }
// }