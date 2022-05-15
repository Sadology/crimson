const Discord = require('discord.js');
const ms = require('ms');
const { LogsDatabase } = require('../../models');
const { UserRoleManager, LogManagers} = require('../../Functions');
const { SlashCommandBuilder } = require('@discordjs/builders');

class MuteManager {
    constructor (client, guild, interaction){
        this.client = client;
        this.guild = guild;
        this.interaction = interaction;

        this.LogData = new LogManagers(this.client, this.guild)
    }

    async ManageMute(user, executor){
        let Embed = new Discord.MessageEmbed()
        .setColor("RED")

        let Member = this.guild.members.cache.get(user);
        if(!Member){
            Embed.setDescription("<:error:921057346891939840> Mentioned user is invalid")
            return this.errHandler(Embed)
        }

        let oldMute = await this.FetchDatabase(Member);
        if(oldMute){
            Embed.setDescription(`<:error:921057346891939840> ${Member} is currently muted`);

            return this.errHandler(Embed);
        }

        let pendingMute = await new UserRoleManager(this.client, this.guild, this.interaction).AddRole(Member, {name: 'muted', newCreate: true})
        if(!pendingMute) return;

        Embed.setDescription(`<:check:959154334388584509> ${Member.toString()} was muted`);
        Embed.setColor("#2f3136");
        this.errHandler(Embed)

        this.LogData.setUser(Member)
        this.LogData.setExecutor(executor);

        this.client.eventEmitter.emit('MuteAdded', this.LogData.DataToJson(), Member);
    }

    async FetchDatabase(user){
        let data = await LogsDatabase.findOne({
            guildID: this.guild.id,
            userID: user.user.id,
            Muted: true
        })

        if(data){
            return true
        }

        else return false
    }

    DurationFormat(Time){
        if(!Time){
            return this.LogData.setLengths(null, "∞")
        }

        // Coverting args to regex
        const duration = Time;
        const timeex = /[\d]/g;

        // If doesn't matches the duration
        if(!duration.match(timeex)){
            return this.LogData.setLengths(null, "∞")
        // If doesn't matches the duration
        }else if(!duration.match(/^\d/)){
            return this.LogData.setLengths(null, "∞")
        // If matches the duration
        }else {
            let muteLength = ms( duration );
            // Convert duration code to a normal time
            const durationFormat = ms(muteLength, { long: true })
            const muteDuration = new Date();

            // Adding the mute duration to the current time
            muteDuration.setMilliseconds(muteDuration.getMilliseconds() + muteLength);

            return this.LogData.setLengths(muteDuration, durationFormat)
        }
    }

    ReasonFormat(Reason){
        if(!Reason){
            return this.LogData.setActions("Mute", "No reason was provided");
        };

        return this.LogData.setActions("Mute", Reason);
    }

    errHandler(embed){
        this.interaction.reply({embeds: [embed], ephemeral: true, allowedMentions: [{repliedUser: false}]})
        .catch(err => {return console.log(err.stack)});
    }
}
module.exports.run = {
    run: async(client, interaction, args, prefix) =>{
        const {options} = interaction;
        let memid = options.getMember('member');
        let length = options.getString('duration');
        let reason = options.getString('reason');

        let MuteClient = new MuteManager(client, interaction.guild, interaction)
        MuteClient.ManageMute(memid ? memid.id : memid, interaction.member);
        MuteClient.DurationFormat(length);
        MuteClient.ReasonFormat(reason, true);
    }
}

// Slash command export
module.exports.slash = {
    data: new SlashCommandBuilder()
        .setName("mute")
        .setDescription("Mute a member")
        .addUserOption(option =>
            option
            .setName("member")
            .setDescription("User you want to mute")
            .setRequired(true))
        .addStringOption(option =>
            option.setName("duration")
            .setDescription("Length of the mute")
            .setRequired(true))
        .addStringOption(option =>
            option.setName("reason")
            .setDescription("Reason for the mute")),
    Permissions: ["MODERATE_MEMBERS"],
    ClientPermissions: ["MANAGE_ROLES", "MANAGE_CHANNELS"],
    category: "Moderation",
}