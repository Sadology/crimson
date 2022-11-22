const Discord = require('discord.js');
const { GuildMember, Permissions } = require('../../Functions');
const { SlashCommandBuilder } = require('@discordjs/builders');

class CommandBuilder{
    constructor(){
        this.slashCmd = new SlashCommandBuilder()
            .setName('kick')
            .setDescription("Kick a member from the server")
            .addUserOption(option => 
                option.setName('member')
                .setDescription("The member you want to kick")
                .setRequired(true))
            .addStringOption(option =>
                option
                .setName('reason')
                .setDescription("Reason for kicking the member"))
        this.Permissions = ["KICK_MEMBERS"];
        this.ClientPermissions = ["KICK_MEMBERS"];
        this.category = "Moderation";
    }
};

class Main{
    constructor(client, interaction){
        this.client = client;
        this.interaction = interaction;
        this.guild = interaction;
    };

    async Mainframe(){
        const {options} = this.interaction;
        let user = options.getUser('member');
        let reason = options.getString('reason');
        let Member = this.guild.members.cache.get(user.id);
        let Embed = new Discord.MessageEmbed();

        if(!Member){
            Embed.setDescription(`<:error:1011174128503500800> Mentioned member is invalid`)
            Embed.setColor("#2f3136")
            return this.erroMessage(Embed);
        }

        let RolePosition = this.RolePosition(Member);
        if(!RolePosition) return;

        this.KickCreate(Member, reason)
    };

    async KickCreate(User, reason){
        if(!reason){
            reason = "No reason was provided"
        };
        
        await User.kick(`${reason} | ${User.user ? User.user.id : User} | ${this.interaction.member.user.tag}`)
        .then((msg) => {
            let Embed = new Discord.MessageEmbed()
                .setDescription(`${User.user ? User.user : "<@"+User+">"} was Kicked | ${reason}`)
                .setColor("#2f3136")

            return this.erroMessage(Embed)
        })
        .catch(err => {return console.log(err.stack)});
    };

    RolePosition(User){
        let Embed = new Discord.MessageEmbed()
        if(Member.permissions.any([
            "BAN_MEMBERS", 
            "KICK_MEMBERS", 
            "MANAGE_CHANNELS", 
            "MANAGE_ROLES", 
            "MANAGE_MESSAGES", 
            "MANAGE_GUILD",
            "ADMINISTRATOR"
        ])){
            Embed.setDescription("Unable Kick a Mod/Admin")
            Embed.setColor("RED")
            this.erroMessage(Embed);
            return false;
        };
        
        const authorHighest = this.interaction.member.roles.highest.position;
        const UserHighest = User.roles.highest.position;
        const clientHighest = this.guild.members.resolve( this.client.user ).roles.highest.position;

        if(User.user.id == this.client.user.id){
            Embed.setDescription(`🦿 There you go i kicked my self ... you happy now? it hurts!! 😔`)
            Embed.setColor("#2f3136")
            
            this.erroMessage(Embed)
            return false;
        };

        if(User.user.id == this.interaction.member.user.id){
            Embed.setDescription(`Only if i could 😔`)
            Embed.setColor("#2f3136")

            this.erroMessage(Embed)
            return false;
        };

        if(UserHighest > clientHighest || UserHighest > authorHighest){
            Embed.setDescription("Can't Ban a member with Higher or Equal role")
            Embed.setColor("RED")

            this.erroMessage(Embed)
            return false;
        };

        return true;
    }

    erroMessage(embed){
        this.interaction.reply({embeds: [embed], ephemeral: true}).catch(err => {return console.log(err.stack)})
    };
};

module.exports.test = {Main, CommandBuilder};