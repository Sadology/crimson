const { SlashCommandBuilder } = require('@discordjs/builders');
const {MessageEmbed, MessageActionRow, MessageButton} = require('discord.js');
const wait = require('util').promisify(setTimeout);

class MeterManager{
    constructor(client, guild, interaction) {
        this.client = client;
        this.guild = guild;
        this.interaction = interaction;
    }

    PercentageGen(){
        let Number = Math.floor(Math.random() * 100)

        return Number;
    }

    Mainframe(type, user){
        let embed = new MessageEmbed();
        let percentage = this.PercentageGen();

        switch(type){
            case 'love':
                embed.setDescription(`**${this.interaction.member.user.username}** x **${user.username}**`)
                .setAuthor({name: "Love Meter ♥"})
                .addField("Result", `**${percentage}%**`)
                .setColor("#2f3136")
            break;

            case 'hot':
                embed.setDescription(`**${user.username}** is **${percentage}%** hot 🥵`)
                .setAuthor({name: "Hotness Meter"})
                .setColor("#2f3136")
            break;

            case 'funny':
                embed.setDescription(`**${user.username}** is **${percentage}%** funny 😂`)
                .setAuthor({name: "Funny Meter"})
                .setColor("#2f3136")
            break;

            case 'cringe':
                embed.setDescription(`**${user.username}** is **${percentage}%** cringe <:cringe:854291715451912202>`)
                .setAuthor({name: "Cringe Meter"})
                .setColor("#2f3136")
            break;

            case 'smart':
                embed.setDescription(`**${user.username}** is **${percentage}%** smart 😎`)
                .setAuthor({name: "Smart Meter"})
                .setColor("#2f3136")
            break;

            case 'sexy':
                embed.setDescription(`**${user.username}** is **${percentage}%** sexy 😍`)
                .setAuthor({name: "Sexy Meter"})
                .setColor("#2f3136")
            break;

            case 'nerd':
                embed.setDescription(`**${user.username}** is **${percentage}%** nerd <:nerd:852918397909729310>`)
                .setAuthor({name: "Nerd Meter"})
                .setColor("#2f3136")
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
        .setName('meter')
        .setDescription("Rate with this epic rate machine")
        .addSubcommand(option =>
            option
            .setName('love')
            .setDescription("Find out how much you love your partner 😳")
            .addUserOption(option => 
                option.setName('member')
                .setDescription("Mention your partner")
                .setRequired(true)
            )
        )
        .addSubcommand(option =>
            option
            .setName('hot')
            .setDescription("How hot are you 🥵")
            .addUserOption(option => 
                option.setName('member')
                .setDescription("The hot person")
                .setRequired(true)
            )
        )
        .addSubcommand(option =>
            option
            .setName('funny')
            .setDescription("How funny are you 😂")
            .addUserOption(option => 
                option.setName('member')
                .setDescription("The funny person")
                .setRequired(true)
            )
        )
        .addSubcommand(option =>
            option
            .setName('cringe')
            .setDescription("How cringe are you")
            .addUserOption(option => 
                option.setName('member')
                .setDescription("The cringy person")
                .setRequired(true)
            )
        )
        .addSubcommand(option =>
            option
            .setName('smart')
            .setDescription("How smart are you 😎")
            .addUserOption(option => 
                option.setName('member')
                .setDescription("The smart person")
                .setRequired(true)
            )
        )
        .addSubcommand(option =>
            option
            .setName('nerd')
            .setDescription("How nerd are you")
            .addUserOption(option => 
                option.setName('member')
                .setDescription("The nerd person 🤓")
                .setRequired(true)
            )
        )
        .addSubcommand(option =>
            option
            .setName('sexy')
            .setDescription("How sexy are you")
            .addUserOption(option => 
                option.setName('member')
                .setDescription("The sexiest person 😍")
                .setRequired(true)
            )
        )
            ,
    category: "Fun",
}