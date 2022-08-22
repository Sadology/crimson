const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { LogsDatabase } = require('../../models');
const wait = require('util').promisify(setTimeout);

let row = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setCustomId('confirm')
            .setLabel("Continue")
            .setStyle("DANGER")
    )
    .addComponents(
        new MessageButton()
            .setCustomId('cancel')
            .setLabel("Cancel")
            .setStyle("SUCCESS")
    )
class UserLogs{
    constructor(client, guild, interaction){
        this.client = client;
        this.guild = guild;
        this.interaction = interaction;
    }

    async fetchData(user){
        let data = await LogsDatabase.findOne({
            guildID: this.guild.id,
            userID: user
        })

        if(data) {
            return data;
        }

        else return false;
    };

    async DeleteLog(user){
        let data = await this.fetchData(user);

        if(!data){
            return this.interaction.reply({embeds: [
                new MessageEmbed()
                    .setDescription(`<:error:1011174128503500800> The user doesn't have any logs`)
                    .setColor("RED")
            ]})
        }

        let Embed = new MessageEmbed()
        .setDescription(`• ⚠ **WARNING**
        <:reply:1011174493252755537> This action will wipe out all moderation log of <@${user}>. Do you still want to continue?`)
        .setColor("RED")

        this.interaction.deferReply();
        await wait(1000);

        row.components[0].setDisabled(false)
        row.components[1].setDisabled(false)

        this.interaction.editReply({embeds: [Embed], components: [row]}).then( m => {
            this.CollectorHandle(m, user)
        })
    };

    CollectorHandle(msg, id){
        const filter = (button) => button.member.user.id == this.interaction.member.id;
        const collector = msg.createMessageComponentCollector({ filter, componentType: 'BUTTON', time: 1000 * 60 * 5 });

        collector.on('collect', (b) => {
            if(b.customId === 'confirm'){
                this.saveData(b, id);
                collector.stop();
            }
            if(b.customId === 'cancel'){
                b.reply({
                    embeds: [new MessageEmbed()
                        .setDescription(`<:check:1011170584996106300> canceled`)
                        .setColor("#2f3136")
                    ], ephemeral: true
                });

                collector.stop();
            }
        })

        collector.on('end', () => {
            row.components[0].setDisabled(true)
            row.components[1].setDisabled(true)

            msg.edit({components: [row]}).catch(err => {return console.log(err.stack)});
        })
    }

    async saveData(msg, id){
        await LogsDatabase.deleteMany({
            guildID: this.guild.id,
            userID: id
        }).catch(err => {return console.log(err.stack)});

        msg.reply({
            embeds: [new MessageEmbed()
                .setDescription(`<:check:1011170584996106300> <@${id}>'s data was wiped out.`)
                .setColor("#2f3136")
            ]
        });
    };

}

module.exports.run = {
    run: async(client, interaction, args,prefix) =>{

        const {options} = interaction;
        let user = options.getUser('user')

        let data = new UserLogs(client, interaction.guild, interaction).DeleteLog(user ? user.id : user)
    
    }
}


module.exports.slash = {
    data: new SlashCommandBuilder()
        .setName("reset-log")
        .setDescription("Reset moderation log of a user")
        .addUserOption(option => 
            option.setName('user')
            .setDescription("The user you want to reset log")
            .setRequired(true)),
    category: "Administration",
    Permissions: ["MANAGE_GUILD"],
}