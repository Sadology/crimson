const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const wait = require('util').promisify(setTimeout);
const ms = require('ms');

module.exports.run = {
    run: async(client, interaction, args)=> {

        interaction.deferReply();
        await wait(1000)

        await interaction.editReply({content: "Pinging..."
        }).then(async (m) =>{
            let Ping = m.createdTimestamp - interaction.createdTimestamp
            interaction.editReply({content: `Pong \`${ms(Ping, {long: true})}\``})
        })
        
    }
}

//Slash command export
module.exports.slash = {
    data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Bot latency"),
    category: "Utility",
};