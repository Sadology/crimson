const { SlashCommandBuilder } = require('@discordjs/builders');
const wait = require('util').promisify(setTimeout);
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Ping pong'),
    permissions: ["USE_APPLICATION_COMMANDS"],
    botPermission: ["SEND_MESSAGES"],
    category: "Slash",
    run: async(client, interation) =>{
        let choices = ["Checking pings...","Pinging...", "What's my ping?...", "Now checking..."]
        let response = choices[Math.floor(Math.random() * choices.length)]
        const resEmbed = new Discord.MessageEmbed()
            .setDescription(`Api Latency: **${client.ws.ping.toString()}**`)
            .setColor("#fafcff")
        interation.reply({embeds: [resEmbed]})
    }
}