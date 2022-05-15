// const { SlashCommandBuilder, roleMention } = require('@discordjs/builders');
// const wait = require('util').promisify(setTimeout);
// const Discord = require('discord.js');
// const { Guild } = require('../../models');
// const { errLog } = require('../../Functions/erroHandling');

// module.exports = {
//     data: new SlashCommandBuilder()
//         .setName('setup-rank')
//         .setDescription('Setup rank system for your server')
//         .addIntegerOption(option => option.setName('min-exp').setMinValue(1).setMaxValue(1000).setDescription("Minimum amount of exp member will receive"))
//         .addIntegerOption(option => option.setName('max-exp').setMinValue(1).setMaxValue(1000).setDescription("Maximum amount of exp member will receive"))
//         .addChannelOption(option => option.setName('channel').setDescription("Levelup notification channel"))
//         .addStringOption(option => option.setName('message').setDescription("Levelup message. check vairables by /variables"))
//         .addNumberOption(option => option.setName('multiplier').setMinValue(0).setMaxValue(5).setDescription("Exp multiplier"))
//         .addRoleOption(option => option.setName('noexp-role').setDescription("Role member that won't receive exp"))
//         .addStringOption(option => option.setName('noexp-channel').setDescription("Channels where member won't receive any exp")),
//         description: "Setup ranks on your server",
//     permissions: ["ADMINISTRATOR", "MANAGE_GUILD", "SEND_MESSAGES"],
//     botPermission: ["SEND_MESSAGES"],
//     category: "Slash",
//     run: async(client, interaction) =>{
//         const { options } = interaction;

//         const i = options.getInteger('min-exp');
//         const u = options.getInteger('max-exp');

//         console.log(i, u)

//         interaction.reply("ALLOO")
//     }
// }