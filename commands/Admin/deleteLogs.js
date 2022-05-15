const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { LogsDatabase } = require('../../models');
const moment = require('moment');
const wait = require('util').promisify(setTimeout);

let row = new MessageActionRow()
    .addComponents(
        new MessageButton()
            .setCustomId('confirm')
            .setLabel("Confirm")
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

    async fetchData(ID, user){
        let data = await LogsDatabase.findOne({
            guildID: this.guild.id,
            [`Action.caseID`]: ID
        })

        if(!data){
            data = await LogsDatabase.findOne({
                guildID: this.guild.id,
                [`Action.LogID`]: ID
            })
        }

        if(data) {
            return data;
        }

        else return false;
    };

    async DeleteLog(id){
        let data = await this.fetchData(id)

        if(!data){
            return this.interaction.reply({embeds: [
                new MessageEmbed()
                    .setDescription(`<:error:921057346891939840> The log-id is invalid`)
                    .setColor("RED")
            ]})
        }

        let userData = data.Action.find(i => i.LogID == id)
        if(!userData) userData = data.Action.find(i => i.caseID == id)

        let Embed = new MessageEmbed()
        .addField(`Log-Id ∙ ${userData.caseID ? userData.caseID : userData.LogID}`,[
            `\`\`\`arm\nUser     ∙ ${userData.userName}`,
            `Reason   ∙ ${userData.actionReason}`,
            `Mod      ∙ ${userData.moderator}`,
            `Duration ∙ ${userData.actionLength ? userData.actionLength : "∞"}`,
            `Date     ∙ ${moment(userData.actionDate).format('llll')}\`\`\``
        ].join(" \n").toString(), true)
        .setColor("#2f3136")

        this.interaction.deferReply();
        await wait(1000);

        row.components[0].setDisabled(false)
        row.components[1].setDisabled(false)
        this.interaction.editReply({embeds: [Embed], components: [row]}).then( m => {
            this.CollectorHandle(m, id)
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
                        .setDescription(`<:check:959154334388584509> canceled`)
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
        await LogsDatabase.updateOne({
            guildID: this.guild.id,
            [`Action.caseID`]: id
        }, {
            $pull: {
                Action: {
                    caseID: id
                }
            }
        }).catch(err => {return console.log(err.stack)});

        await LogsDatabase.updateOne({
            guildID: this.guild.id,
            [`Action.LogID`]: id
        }, {
            $pull: {
                Action: {
                    LogID: id
                }
            }
        }).catch(err => {return console.log(err.stack)});

        msg.reply({
            embeds: [new MessageEmbed()
                .setDescription(`<:check:959154334388584509> Log **${id}** was deleted`)
                .setColor("#2f3136")
            ]
        });
    };

}

module.exports.run = {
    run: async(client, interaction, args,prefix) =>{

        const {options} = interaction;
        let caseID = options.getString('log-id')

        let data = new UserLogs(client, interaction.guild, interaction).DeleteLog(caseID)
    }
}


module.exports.slash = {
    data: new SlashCommandBuilder()
        .setName("delete-log")
        .setDescription("Delete a moderation log")
        .addStringOption(option => 
            option.setName('log-id')
            .setDescription("Log-ID that you want to delete")
            .setRequired(true)),
    category: "Administration",
    Permissions: ["MANAGE_GUILD"],
}