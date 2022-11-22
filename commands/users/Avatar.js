const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

class CommandBuilder{
    constructor(){
        this.slashCmd = new SlashCommandBuilder()
            .setName("avatar")
            .setDescription("Your account avatar")
            .addUserOption(option =>
                option
                .setName("user")
                .setDescription("Avatar of another user"))
        this.category = "Utility"
    }
};

class Main{
    constructor(client, interaction){
        this.client = client;
        this.interaction = interaction;
        this.guild = this.interaction.guild;
    };

    async Mainframe(){
        const {options} = this.interaction;
        let user = options.getUser('user');

        let Member = this.guild.members.cache.get(user);
        if(!Member){
            Member = this.client.users.resolve(user);
        }

        if(!Member){
            Member = this.interaction.member
        }

        let Embed = new Discord.MessageEmbed()
            .setAuthor({name: `${Member.user ? Member.user.username : Member.username}`, iconURL: Member.user ? Member.user.displayAvatarURL({dynamic: true, format: "png"}) : Member.displayAvatarURL({dynamic: true, format: "png"})})
            .setTitle( "Avatar")
            .setImage(Member.user ? Member.user.displayAvatarURL({dynamic: true, size: 4096, format: "png"}) : Member.displayAvatarURL({dynamic: true, size: 4096, format: "png"}))
            .setColor("#2f3136")

        this.sendData(Embed)
    };

    sendData(embed){
        this.interaction.reply({embeds: [embed], allowedMentions: [{repliedUser: false}]})
        .catch(err => {return console.log(err.stack)})
    }
};

module.exports.test = {Main, CommandBuilder};