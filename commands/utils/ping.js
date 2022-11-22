const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const wait = require('util').promisify(setTimeout);
const ms = require('ms');

class CommandBuilder{
    constructor(){
        this.slashCmd = new SlashCommandBuilder();
        this.slashCmd.setName('ping');
        this.slashCmd.setDescription("Ping! Pong! 🏓");
    }
};

class Main{
    constructor(client, interaction){
        this.client = client;
        this.interaction = interaction;
    };

    async Mainframe(){
        this.interaction.deferReply();
        await wait(1000);

        await this.interaction.editReply({content: "Pinging..."
        }).then(async (m) =>{
            let Ping = m.createdTimestamp - this.interaction.createdTimestamp
            this.interaction.editReply({content: `Pong \`${ms(Ping, {long: true})}\``})
        })
    };
};

//Slash command export
module.exports.test = {Main, CommandBuilder};