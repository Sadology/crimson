const { SlashCommandBuilder } = require('@discordjs/builders');
const wait = require('util').promisify(setTimeout);
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Ping pong'),
    permission: ["MANAGE_MESSAGES"],
    run: async(client, interation) =>{
        let choices = ["Checking pings...","Pinging...", "What's my ping?...", "Now checking..."]
        let response = choices[Math.floor(Math.random() * choices.length)]
        const resEmbed = new Discord.MessageEmbed()
            .setDescription(`Api Latency: **${client.ws.ping.toString()}**`)
            .setColor("#fafcff")
        await interation.reply({embeds: [resEmbed]})
    }
}