const { SlashCommandBuilder } = require('@discordjs/builders');
const {MessageEmbed, MessageActionRow, MessageButton} = require('discord.js');
const wait = require('util').promisify(setTimeout);

class MeterManager{
    constructor(client, guild, interaction) {
        this.client = client;
        this.guild = guild;
        this.interaction = interaction;
    }

    PercentageGen(max){
        let Number = Math.floor(Math.random() * max)

        return Number;
    }

    Mainframe(type, user){
        let embed = new MessageEmbed()
        .setColor("#2f3136")

        let percentage;
        user = user ? user : this.interaction.user

        switch(type){
            case 'love':
                percentage = this.PercentageGen(10);
                
                if(percentage == 0){
                    embed.setDescription(`**${user.username}** literally has **${percentage}** love 💀`)
                }
                
                else {
                    embed.setDescription(`**${user.username}** has **${percentage}** love 💏`)
                }
            break;

            case 'crush':
                percentage = this.PercentageGen(10);
                
                if(percentage == 0){
                    embed.setDescription(`**${user.username}** has **${percentage}** crush on them <:dielaughing:962091762057379910>`)
                }
                
                else {
                    embed.setDescription(`**${user.username}** has **${percentage}** crush on them 😳`)
                }
            break;

            case 'baby':
                percentage = this.PercentageGen(10);
                
                if(percentage == 0){
                    embed.setDescription(`**${user.username}** gonna have **${percentage}** babies 💀`)
                }
                
                else {
                    embed.setDescription(`**${user.username}** gonna have **${percentage}** babies 👶`)
                }
            break;

            case 'fbi-agent':
                percentage = this.PercentageGen(10);
                
                if(percentage == 0){
                    embed.setDescription(`**${user.username}** has **${percentage}** fbi-agent watching them. Wonder how 🤔`)
                }
                else if(percentage == 10){
                    embed.setDescription(`**${user.username}** has **${percentage}** fbi-agent watching them. Damn bro, what you've been upto? 😬`)
                }
                else {
                    embed.setDescription(`**${user.username}** has **${percentage}** fbi-agent watching them <:uhm:854293548219236353>`) 
                }
            break;
        }

        this.HandleInt(embed, false)
    }

    HandleInt(embed, ephemeral) {
        this.interaction.reply({embeds: [embed], ephemeral: ephemeral})
    }
}

module.exports.run = {
    run: async(client, interaction ) =>{
        const {options} = interaction;
        
        let user = options.getUser('member');
        let type = options.getSubcommand();
        
        let data = new MeterManager(client, interaction.guild, interaction).Mainframe(type, user);
    }
}

module.exports.slash = {
    data: new SlashCommandBuilder()
        .setName('how-many')
        .setDescription("Find out how many you have")
        .addSubcommand(option =>
            option
            .setName('love')
            .setDescription("How many love you have")
            .addUserOption(option => 
                option.setName('member')
                .setDescription("How many love another person have")
            )
        )
        .addSubcommand(option =>
            option
            .setName('crush')
            .setDescription("How many crush you have")
            .addUserOption(option => 
                option.setName('member')
                .setDescription("How many crush another person have")
            )
        )
        .addSubcommand(option =>
            option
            .setName('baby')
            .setDescription("How many baby you gonna have")
            .addUserOption(option => 
                option.setName('member')
                .setDescription("How many baby another person gonna have")
            )
        )
        .addSubcommand(option =>
            option
            .setName('fbi-agent')
            .setDescription("How many fbi agent watching you")
            .addUserOption(option => 
                option.setName('member')
                .setDescription("How many fbi agent watching another person")
            )
        )
            ,
    category: "Fun",
}