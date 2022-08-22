const { SlashCommandBuilder } = require('@discordjs/builders');
const {MessageEmbed} = require('discord.js');

class WarnManager{
    constructor(client, guild, interaction){
        this.client = client;
        this.guild = guild;
        this.interaction = interaction;
    }

    Mainframe(user, reason){
        let Member = this.guild.members.cache.get(user)

        if(!Member){
            return this.interaction.reply({
                embeds: [new MessageEmbed()
                    .setDescription(`<:error:1011174128503500800> Mentioned member is invalid`)
                    .setColor("RED")
                ], ephemeral: true
            })
        };

        this.client.eventEmitter.emit('WarnAdded', Member, reason, this.interaction.member);
        
        this.interaction.reply({
            embeds: [
                new MessageEmbed()
                .setDescription(`${Member} was warned | ${reason}`)
                .setColor("RED")
            ]
        })
    }
}

module.exports.run = {
    run: async(client, interaction, args, prefix) =>{
        
        const { options } = interaction;
        let user = options.getUser('member')
        let reason = options.getString('reason')

        let data = new WarnManager(client, interaction.guild, interaction).Mainframe(user ? user.id : user, reason);
    
    }
}

module.exports.slash = {
    data: new SlashCommandBuilder()
        .setName('warn')
        .setDescription("Warn a member")
        .addUserOption(option =>
            option
            .setName('member')
            .setDescription("The member you want to warn")
            .setRequired(true)
        )
        .addStringOption(option => 
            option
            .setName('reason')
            .setDescription("Reason for warning")
            .setRequired(true)
        ),
    Permissions: ["MODERATE_MEMBERS"],
    category: "Moderation",
}