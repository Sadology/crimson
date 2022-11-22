const { SlashCommandBuilder, userMention, memberNicknameMention } = require('@discordjs/builders');
const Discord = require('discord.js')
const axios = require('axios');
const {WebhookManager} = require('../../Functions')

class CommandBuilder{
    constructor(){
        this.slashCmd = new SlashCommandBuilder()
        .setName('test')
        .setDescription("Test bot")
        this.category = "Privet"
    }
};

class Main{
    constructor(client, interaction){
        this.client = client;
        this.interaction = interaction;
        this.guild = interaction;
    };

    async Mainframe(){

    };
};

module.exports.test = {Main, CommandBuilder};
