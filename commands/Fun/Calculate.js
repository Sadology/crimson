const { SlashCommandBuilder } = require('@discordjs/builders');
const {MessageEmbed } = require('discord.js');

class MeterManager{
    constructor(client, guild, interaction) {
        this.client = client;
        this.guild = guild;
        this.interaction = interaction;
    }

    PercentageGen(max, min = 0){
        let Number = Math.floor(Math.random() * (max - min + 1)) + min

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
                    embed.setDescription(`**${user.username}** has **${percentage}** crush on them <:pepeLaugh:1011611765303414874>`)
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
                    embed.setDescription(`**${percentage}** fbi-agent watching **${user.username}**. Wonder how 🤔`)
                }
                else if(percentage == 10){
                    embed.setDescription(`**${percentage}** fbi-agent watching **${user.username}**. Damn bro, what you've been upto? 😬`)
                }
                else {
                    embed.setDescription(`**${percentage}** fbi-agent watching **${user.username}** <:uhm:1011612436186546197>`) 
                }
            break;

            // case 'subscriber':
            //     percentage = this.PercentageGen(100000000);
                
            //     if(percentage == 0){
            //         embed.setDescription(`**${user.username}** has **${percentage}** subscribers. Unluckiest guy alive 😔`)
            //     }
            //     else if(percentage == 100000000){
            //         embed.setDescription(`**${user.username}** has **${percentage}** subscribers. Luckiest person alive 🎉`)
            //     }
            //     else {
            //         embed.setDescription(`**${user.username}** has **${percentage}** subscribers`) 
            //     }
            // break;

            case 'homework':
                percentage = this.PercentageGen(100);
                
                if(percentage == 0){
                    embed.setDescription(`**${user.username}** has **${percentage}** homework folder. Bro you're going to haven.`)
                }
                else if(percentage == 100000000){
                    embed.setDescription(`**${user.username}** has **${percentage}** homework folders 🤓`)
                }
                else {
                    embed.setDescription(`**${user.username}** has **${percentage}** homework folders 🤨📸`) 
                }
            break;

            case 'weight':
                percentage = this.PercentageGen(1000, 30);
                
                if(percentage > 300){
                    embed.setDescription(`**${user.username}'s** weight is **${percentage}** kg. Certified discord mod moment.`)
                }
                else {
                    embed.setDescription(`**${user.username}'s** weight is **${percentage}** kg`) 
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
        .setName('calculate')
        .setDescription("Calculate how many of the options you have")
        .addSubcommand(option =>
            option
            .setName('love')
            .setDescription("How many love you have")
            .addUserOption(option => 
                option.setName('member')
                .setDescription("How many love another person has")
            )
        )
        .addSubcommand(option =>
            option
            .setName('crush')
            .setDescription("How many crush you have")
            .addUserOption(option => 
                option.setName('member')
                .setDescription("How many crush another person has")
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
            .setDescription("How many fbi agent watching over you")
            .addUserOption(option => 
                option.setName('member')
                .setDescription("How many fbi agent watching another person")
            )
        )

        .addSubcommand(option =>
            option
            .setName('homework')
            .setDescription("How many homework folder you have")
            .addUserOption(option => 
                option.setName('member')
                .setDescription("How many homework folder another person has")
            )
        )   
        
        .addSubcommand(option =>
            option
            .setName('weight')
            .setDescription("How much weight you have")
            .addUserOption(option => 
                option.setName('member')
                .setDescription("How much weight another person has")
            )
        )   
        ,
    category: "Fun",
}