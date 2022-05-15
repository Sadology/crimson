// const { SlashCommandBuilder } = require('@discordjs/builders');
// const wait = require('util').promisify(setTimeout);
// const Discord = require('discord.js');

// module.exports = {
//     data: new SlashCommandBuilder()
//         .setName('ping')
//         .setDescription('Ping pong'),
//     permissions: ["USE_APPLICATION_COMMANDS"],
//     botPermission: ["SEND_MESSAGES"],
//     category: "Slash",
//     run: async(client, interaction) =>{
//         interaction.deferReply()
//         await new Promise(resolve => setTimeout(resolve, 1000))

//         interaction.editReply({content: "Pinging..."}).then(i => {
//             let Ping = i.createdTimestamp - interaction.createdTimestamp

//             const resEmbed = new Discord.MessageEmbed()
//             .setDescription(`Bot Latency: **${Ping} ms** | Api Latency: **${client.ws.ping.toString()} ms**`)
//             .setColor("#fafcff")
//             interaction.editReply({content: "Pong", embeds: [resEmbed]})
//         })
//     }
// }