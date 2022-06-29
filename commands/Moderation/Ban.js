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

        if(!Member){
            let oldBan = await this.FetchBanAudit(user);
            if(oldBan) {

                Embed.setDescription(`<:error:921057346891939840> <@${user}> is already banned`)
                Embed.setColor("#2f3136")
                return this.erroMessage(Embed);

            }

            return this.BanCreate(user, reason);
        }
        
        let ErrorEmbed = new Discord.MessageEmbed()
            .setDescription("Can't Ban a Mod/Admin :(")
            .setColor("RED")

        let RolePosition = this.RolePosition(Member);
        if(!RolePosition) return;

        if(Member.permissions.any(["BAN_MEMBERS", "KICK_MEMBERS", "MANAGE_CHANNELS", "MANAGE_ROLES", "MANAGE_MESSAGES", "MANAGE_GUILD", "ADMINISTRATOR"])){
            return this.erroMessage(ErrorEmbed);
        };
        
        this.BanCreate(Member, reason)
    }

    async BanCreate(User, reason){
        if(!reason){
            reason = "No reason was provided"
        };
        
        await this.guild.bans.create(User, {days: 0, reason: `${reason} | ${User.user ? User.user.id : User} | ${this.interaction.member.user.tag}`})
        .then((msg) => {
            let Embed = new Discord.MessageEmbed()
                .setDescription(`<:banHammer:921094864073011221> ${User.user ? User.user : "<@"+User+">"} was Banned | ${reason}`)
                .setColor("#2f3136")
           
            this.client.eventEmitter.emit('CmdUsed', this.interaction.member, "Ban", this.guild);
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

    RolePosition(User){
        const authorHighest = this.interaction.member.roles.highest.position;
        const UserHighest = User.roles.highest.position;
        const clientHighest = this.guild.members.resolve( this.client.user ).roles.highest.position;

        if(User.user.id == this.client.user.id){
            let Embed = new Discord.MessageEmbed()
                .setDescription(`<:banHammer:921094864073011221> ${this.client.user} was bann ... wait im ${this.client.user.username} <:sweating:962363501081423923>`)
                .setColor("#2f3136")

            this.erroMessage(Embed)
            return false;
        };

        if(User.user.id == this.interaction.member.user.id){
            let Embed = new Discord.MessageEmbed()
                .setDescription(`If you want to get banned then ask a higher authority to use this command on you :)`)
                .setColor("#2f3136")

            this.erroMessage(Embed)
            return false;
        };

        if(UserHighest > clientHighest || UserHighest > authorHighest){
            let Embed = new Discord.MessageEmbed()
                .setDescription("Can't Ban a member with Higher or Equal role")
                .setColor("RED")

            this.erroMessage(Embed)
            return false;
        };

        return true;
    }

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
        .setName("ban")
        .setDescription("Ban a member from server")
        .addUserOption(option =>
            option
            .setName("user")
            .setDescription("The user you want to ban")
            .setRequired(true))
        .addStringOption(option =>
            option.setName("reason")
            .setDescription("Reason for the ban")),
    Permissions: ["BAN_MEMBERS"],
    ClientPermissions: ["BAN_MEMBERS"],
    category: "Moderation",
}