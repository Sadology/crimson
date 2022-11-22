const moment = require('moment');
const ms = require('ms');
const { SlashCommandBuilder } = require('@discordjs/builders');

class CommandBuilder{
    constructor(){
        this.slashCmd = new SlashCommandBuilder();
        this.slashCmd.setName('bot-info');
        this.slashCmd.setDescription("Check information about bot");
    }
};

class Main{
    constructor(client, interaction){
        this.client = client;
        this.interaction = interaction;
    };

    async Mainframe(){
        const guilds = this.client.guilds.cache.size;
        let totalmember = 0;

        this.client.guilds.cache.forEach(g => {
            totalmember += parseInt(g.memberCount);
        });
        let uptime = ms(this.client.uptime, {long: true});

        const Embeds = {
            author: {
                name: `${this.client.user.username}`,
                icon_url: this.client.user.avatarURL({dynamic: false, size: 1024, format: 'png'})
            },
            description: "The beginning after the end",
            fields: [
                {
                    name: "Version",
                    value: '1',
                    inline: true
                },
                {
                    name: "Library Used",
                    value: 'Djs v13',
                    inline: true
                },
                {
                    name: "Node Version",
                    value: 'v16',
                    inline: true
                },
                {
                    name: "Total Guilds",
                    value: `${guilds}`.toString(),
                    inline: true
                },
                {
                    name: "Uptime",
                    value: `${uptime}`,
                    inline: true
                },
                {
                    name: "Total users",
                    value: `${totalmember}`,
                    inline: true
                },
                {
                    name: "Creation Date",
                    value: `${moment(this.client.user.createdAt).format('MMMM Do YYYY')} - ${moment(this.client.user.createdAt, "YYYYMMDD").fromNow()}`.toString(),
                    inline: true
                },
                {
                    name: "Devs",
                    value: `shadow~#8363`,
                    inline: true
                },
            ],
            color: "#2f3136",
            footer: {
                text: "Made with 🖤"
            }
        }

        return this.interaction.reply({embeds: [Embeds]}).catch(err => {return console.log(err.stack)})
    };
};

module.exports.test = {Main, CommandBuilder};