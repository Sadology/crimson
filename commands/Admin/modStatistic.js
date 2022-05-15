const { SlashCommandBuilder } = require('@discordjs/builders');
const {MessageEmbed} = require('discord.js');
const {Stats} = require('../../models');

class StatisticsManager{
    constructor(client, guild, interaction){
        this.client = client;
        this.guild = guild;
        this.interaction = interaction;
    }

    async FetchData(user){
        let data = await Stats.findOne({
            guildID: this.guild.id,
            userID: user.user ? user.user.id : user.id ? user.id : user
        }).catch(err => {return console.log(err.stack)})

        if(!data){
            return false;
        }

        else return data;
    }

    async Mainframe(user){
        let data = await this.FetchData(user)

        if(!data){
            let embed = new MessageEmbed()
                .setDescription(`The user doesn't have any stats`)
                .setColor("RED")
            return this.erroMessage(embed)
        }

        let member = this.guild.members.cache.get(user);

        if(!member){
            member = user
        }

        let embed = new MessageEmbed()
            .setDescription(`${member.user ? member.user : "<@"+member+">"} • Moderation statistics`)
            .addField("**Stats**", `Mute • ${data.Stats.Mute}\nWarn • ${data.Stats.Warn}\nTimeout • ${data.Stats.Timeout}\nBan • ${data.Stats.Ban}\nKick • ${data.Stats.Kick}\nTotal • ${data.Stats.Kick + data.Stats.Ban + data.Stats.Timeout + data.Stats.Mute + data.Stats.Warn}`)
            .setColor("#2f3136")

        this.interaction.reply({embeds: [embed]}).catch(err => {return console.log(err.stack)})
            
    }

    erroMessage(embed){
        this.interaction.reply({embeds: [embed], ephemeral: true}).catch(err => {return console.log(err.stack)})
    };
}
module.exports.run = {
    run: (client, interaction) => {
        const {options} = interaction;
        let user = options.getUser('user');
        let data = new StatisticsManager(client, interaction.guild, interaction).Mainframe(user ? user.id : user)
    }
}

module.exports.slash = {
    data: new SlashCommandBuilder()
        .setName('stats')
        .setDescription('Statistic of every command usage')
        .addUserOption(option => 
            option
            .setName('user')
            .setDescription("Check stats of another user")
            .setRequired(true)),
    category: "Administration",
    Permissions: ["MANAGE_GUILD"],
}