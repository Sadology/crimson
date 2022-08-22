const Discord = require('discord.js');
const { GuildMember, Permissions } = require('../../Functions');
const { SlashCommandBuilder } = require('@discordjs/builders');

class KickManager{
    constructor(client, guild, interaction){
        this.client = client;
        this.guild = guild;
        this.interaction = interaction;
    }

    async MainFrame(user, reason){
        let Member = this.guild.members.cache.get(user);
        let Embed = new Discord.MessageEmbed();

        if(!Member){

            Embed.setDescription(`<:error:1011174128503500800> Mentioned member is invalid`)
            Embed.setColor("#2f3136")
            return this.erroMessage(Embed);

        }
        
        let ErrorEmbed = new Discord.MessageEmbed()
            .setDescription("Can't Kick a Mod/Admin :(")
            .setColor("RED")

        let RolePosition = this.RolePosition(Member);
        if(!RolePosition) return;

        if(Member.permissions.any(["BAN_MEMBERS", "KICK_MEMBERS", "MANAGE_CHANNELS", "MANAGE_ROLES", "MANAGE_MESSAGES", "MANAGE_GUILD", "ADMINISTRATOR"])){
            return this.erroMessage(ErrorEmbed);
        };
        
        this.KickCreate(Member, reason)
    }

    async KickCreate(User, reason){
        if(!reason){
            reason = "No reason was provided"
        };
        
        await User.kick(`${reason} | ${User.user ? User.user.id : User} | ${this.interaction.member.user.tag}`)
        .then((msg) => {
            let Embed = new Discord.MessageEmbed()
                .setDescription(`🦿 ${User.user ? User.user : "<@"+User+">"} was Kicked | ${reason}`)
                .setColor("#2f3136")

            return this.erroMessage(Embed)
        })
        .catch(err => {return console.log(err.stack)});
    };

    RolePosition(User){
        const authorHighest = this.interaction.member.roles.highest.position;
        const UserHighest = User.roles.highest.position;
        const clientHighest = this.guild.members.resolve( this.client.user ).roles.highest.position;

        if(User.user.id == this.client.user.id){
            let Embed = new Discord.MessageEmbed()
                .setDescription(`🦿 There you go i kicked my self ... you happy now? it hurts!! 😔`)
                .setColor("#2f3136")
            
            this.erroMessage(Embed)
            return false;
        };

        if(User.user.id == this.interaction.member.user.id){
            let Embed = new Discord.MessageEmbed()
                .setDescription(`Wish i could kick you 😔`)
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
        let user = options.getUser('member');
        let reason = options.getString('reason');

        new KickManager(client, interaction.guild, interaction).MainFrame(user ? user.id : user, reason);
    }
}

module.exports.slash = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription("Kick a member from the server")
        .addUserOption(option => 
            option.setName('member')
            .setDescription("The member you want to kick")
            .setRequired(true))
        .addStringOption(option =>
            option
            .setName('reason')
            .setDescription("Reason for kicking the member")),
    Permissions: ["KICK_MEMBERS"],
    ClientPermissions: ["KICK_MEMBERS"],
    category: "Moderation",
};