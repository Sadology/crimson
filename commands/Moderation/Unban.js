const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

class BanManager{
    constructor(client, guild, interaction){
        this.client = client;
        this.guild = guild;
        this.interaction = interaction;
    }

    async MainFrame(user, reason){
        let Member = this.guild.members.cache.get(user);
        let Embed = new Discord.MessageEmbed();

        if(Member){
            Embed.setDescription(`<:error:1011174128503500800> <@${user}> is not banned`)
            Embed.setColor("#2f3136")
            return this.erroMessage(Embed);
        }

        let oldBan = await this.FetchBanAudit(user);
        if(!oldBan) {

            Embed.setDescription(`<:error:1011174128503500800> <@${user}> is not banned`)
            Embed.setColor("#2f3136")
            return this.erroMessage(Embed);

        }
        
        this.BanRemove(user, reason)
    }

    async BanRemove(User, reason){
        await this.guild.bans.remove(User, `${this.client.user.username} unban`)
        .then((msg) => {
            let Embed = new Discord.MessageEmbed()
                .setDescription(`<:check:1011170584996106300> ${User.user ? User.user : "<@"+User+">"} was Unbanned`)
                .setColor("#2f3136")

            return this.erroMessage(Embed)
        })
        .catch(err => {return console.log(err.stack)});
    };

    async FetchBanAudit(User){
        let userID = User.user ? User.user.id : User

        await this.guild.bans.fetch();
        let Data = this.guild.bans.resolve(userID);

        if(Data){
            return true;
        };

        return false;
    };

    erroMessage(embed){
        this.interaction.reply({embeds: [embed], ephemeral: true}).catch(err => {return console.log(err.stack)})
    };

}

module.exports.run = {
    run: async(client, interaction, args,prefix) =>{

        const {options} = interaction;
        let user = options.getUser('user');
        let reason = options.getString('reason');

        // Calling the log resolver class for slash command
        let data = new BanManager(client, interaction.guild, interaction).MainFrame(user ? user.id : user, reason);
    }
}

// Slash command export
module.exports.slash = {
    data: new SlashCommandBuilder()
        .setName("unban")
        .setDescription("Unban a member from server")
        .addUserOption(option =>
            option
            .setName("user")
            .setDescription("The user you want to unban")
            .setRequired(true)),
    Permissions: ["BAN_MEMBERS"],
    ClientPermissions: ["BAN_MEMBERS"],
    category: "Moderation",
}