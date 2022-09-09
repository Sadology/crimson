const {SlashCommandBuilder} = require('@discordjs/builders')
const { MessageEmbed } = require("discord.js");
const { WebhookManager } = require("../../Functions");

class Confession{
    constructor(client, guild, interaction){
        this.client = client;
        this.guild = guild;
        this.interaction = interaction;
    }

    Create(msg){
        let Embed = new MessageEmbed()
            .setAuthor({name: "Confession"})
            .setDescription("> "+msg)
            .setColor("RANDOM")
            .setFooter({text: "/confess to submit your confession"})

        this.interaction.reply({embeds: [
            new MessageEmbed()
                .setDescription("<:check:1011170584996106300> Confession submited")
                .setColor("GREEN")
        ], ephemeral: true})
        new WebhookManager(this.client, this.guild).WebHook(Embed, 'confession').then((d) => {
            if(d == false){
                return this.interaction.reply({
                    embeds: [new MessageEmbed()
                        .setDescription("Confession module is not Enable")
                        .setColor("RED")
                    ]
                })
            }
        });
    }
}

module.exports.run = {
    run: async(client, interaction ) =>{
        const {options} = interaction;
        
        let msg = options.getString('msg');
        
        let data = new Confession(client, interaction.guild, interaction).Create(msg);
    }
}

module.exports.slash = {
    data: new SlashCommandBuilder()
        .setName("confess")
        .setDescription("Confess your deepest darket secret")
        .setDMPermission(false)
        .addStringOption(option =>
            option
            .setMaxLength(4096)
            .setDescription("The message you want to confess")
            .setRequired(true)
            .setName("msg")
        )
}