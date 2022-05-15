const Discord = require('discord.js');
const { GuildMember } = require('../../Functions');
const { SlashCommandBuilder } = require('@discordjs/builders');

class AvatarManager{
    constructor(client, guild, interaction){
        this.client = client;
        this.guild = guild;
        this.interaction = interaction;
    }

    async MainFrame(User){
        let Member;

        Member = this.guild.members.cache.get(User);
        if(!Member){
            Member = this.client.users.resolve(User);
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
    }

    sendData(embed){
        this.interaction.reply({embeds: [embed], allowedMentions: [{repliedUser: false}]})
        .catch(err => {return console.log(err.stack)})
    }

}

module.exports.run = {
    run: async(client, interaction, args,prefix) =>{

        const {options} = interaction;
        let user = options.getUser('user');

        // Calling the log resolver class for slash command
        new AvatarManager(client, interaction.guild, interaction).MainFrame(user ? user.id : interaction.member.user.id);
    
    }
};

// Slash command export
module.exports.slash = {
    data: new SlashCommandBuilder()
        .setName("avatar")
        .setDescription("Your account avatar")
        .addUserOption(option =>
            option
            .setName("user")
            .setDescription("Avatar of another user")),
    category: "Utility",
}