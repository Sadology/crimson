const { SlashCommandBuilder } = require('@discordjs/builders');
const {MessageEmbed, MessageActionRow, MessageButton} = require('discord.js');
const wait = require('util').promisify(setTimeout);

const row = new MessageActionRow()
    .addComponents(
        new MessageButton()
        .setCustomId('reaction')
    )

class ReactiontestManager{
    constructor(client, guild, interaction) {
        this.client = client;
        this.guild = guild;
        this.interaction = interaction;
    }

    TimeGenerator(){
        let Number = Math.floor(Math.random() * 8) + 1

        return Number;
    };

    async ClickButtonTest(){
        this.interaction.deferReply();
        await wait(1000);

        row.components[0].setLabel('Wait...')
        row.components[0].setStyle('PRIMARY')

        this.interaction.editReply({embeds: [
            new MessageEmbed()
            .setDescription("Click the Blue button as fast as possible when the button turns green")
        ], components: [row]})
    }
    Mainframe(type){
        switch(type){
            case 'click-button':
                this.ClickButtonTest();
            break;
        }
    }
}

module.exports.run = {
    run: async(client, interaction ) =>{
        const {options} = interaction;
        
        let type = options.getSubcommand();
        
        let data = new ReactiontestManager(client, interaction.guild, interaction).Mainframe(type);
    }
}

module.exports.slash = {
    data: new SlashCommandBuilder()
        .setName('reaction-test')
        .setDescription("Take a test on how fast your reaction")
        .addSubcommand(option =>
            option
            .setName('click-button')
            .setDescription("Click the button as fast it turns green")
        )
        ,
    category: "Fun",
}