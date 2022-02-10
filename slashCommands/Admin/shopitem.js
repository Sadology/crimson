// const { SlashCommandBuilder, roleMention } = require('@discordjs/builders');
// const wait = require('util').promisify(setTimeout);
// const Discord = require('discord.js');
// const { Guild } = require('../../models');
// const ms = require('ms')
// module.exports = {
//     data: new SlashCommandBuilder()
//         .setName('item')
//         .setDescription('Shop items')
//         .addSubcommand(subcommand =>
//             subcommand
//                 .setName('create')
//                 .setDescription('Create an item for the shop')
//                 .addStringOption(option =>
//                     option
//                         .setName('name')
//                         .setDescription("Name of the item")
//                         .setRequired(true)
//                 )
//                 .addRoleOption(option =>
//                     option
//                         .setName('role')
//                         .setDescription("The role item to purchase")
//                         .setRequired(true)
//                 )
//                 .addNumberOption(option =>
//                     option
//                         .setName('price')
//                         .setDescription("Price of the item")
//                         .setRequired(true)
//                 )
//                 .addStringOption(option =>
//                     option
//                         .setName('description')
//                         .setDescription("Items description")  
//                 )
//                 .addStringOption(option =>
//                     option
//                         .setName('duration')
//                         .setDescription("How long member will have the item")
//                 ))
//         .addSubcommand(subcommand =>
//             subcommand
//                 .setName('edit')
//                 .setDescription('Edit a item for the shop.')),
//     description: "Items for the roles shop",
//     permissions: ["ADMINISTRATOR", "MANAGE_GUILD"],
//     botPermission: ["SEND_MESSAGES"],
//     category: "Slash",
//     run: async(client, interaction) =>{
//         const { options, guild } = interaction;

//         let type = options.getSubcommand();
//         let name = options.getString('name');
//         let role = options.getRole('role');
//         let price = options.getNumber('price');
//         let desc = options.getString('description');
//         let duration = options.getString('duration');

//         switch (type){
//             case 'create':
//                 let itemName = name.split(/\s+/g).slice(0, 25)
//                 let itemDesc
//                 let itemTime

//                 let Data = {
//                     name: itemName.join(' '),
//                     description: itemDesc? itemDesc : "",
//                     role: role.id,
//                     price: price,
//                     duration: itemTime ? itemTime : null
//                 }

//                 itemSave(Data)
//             break;
//         }


//         async function itemSave(data){
//             let datacounter = await Guild.findOne({
//                 guildID: interaction.guild.id,
//             })

//             let count
//             datacounter.itemShop ? count = datacounter.itemShop.size + 1 : count = 1
//             await Guild.updateOne( {
//                 guildID: interaction.guild.id
//             }, {
//                 $set: {
//                     [`itemShop.${count}`]: data
//                 }
//             }).then(() => {
//                 interaction.reply("Done")
//             })
//         }
//     }
// }