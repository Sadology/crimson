const Discord = require('discord.js');
const { MessageButton, MessageActionRow, MessageEmbed } = require('discord.js')
const { LogsDatabase }= require('../../models')
const moment = require('moment');
module.exports = {
    name: 'delete-log',
    aliases: ["deletelog"],
    description: "Delete a moderation log",
    permissions: ["ADMINISTRATOR", "MANAGE_GUILD"],
    botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
    usage: "delete-log [ log ID ]",
    category: "Administrator",
    cooldown: 3000,
    run: async(client, message, args,prefix) =>{
        const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setStyle("DANGER")
                .setLabel("Confirm")
                .setCustomId("confirmDeleteLog")
        )
        .addComponents(
            new MessageButton()
                .setStyle("SUCCESS")
                .setLabel("Cancel")
                .setCustomId("cancelDeleteLog")
        )

        async function fetchData(caseid) {
            let data = await LogsDatabase.findOne({
                guildID: message.guild.id,
                [`Action.caseID`]: caseid
            })
            if(data){
                let items = data.Action.find(i => i.caseID == caseid)
                confirmation(items, caseid) 
            }else {
                return message.reply({embeds: [
                    new Discord.MessageEmbed()
                        .setDescription(`No logs was found by this ID: **${caseid}**`)
                        .setColor("RED")
                ], ephemeral: true})
            }
        }

        function confirmation (data, id){
            message.channel.send({ content: "You you wish to delete this log? (yes/no)",embeds: [
                new Discord.MessageEmbed()
                    .setDescription(`**CaseID - **${data.caseID}
                    **Name - **${data.userName}
                    **Reason - **${data.actionReason}
                    **Type - **${data.actionType}
                    **Duration - **${data.actionLength}
                    **Moderator - **${data.moderator}
                    `)
                    .setColor("RED")
            ], components: [row]}).then(async msg => {
                const collector = msg.createMessageComponentCollector({ componentType: 'BUTTON', time: 1000 * 120 });
                collector.on('collect', async b => {
                    if(b.user.id !== message.author.id) return
                    if(b.customId === 'confirmDeleteLog'){
                        DeleteData(id).then(async () =>{
                            row.components[0].setDisabled(true)
                            row.components[1].setDisabled(true)
                            await b.update({content: "Deleted the log", components: [row]})

                        })
                        .catch(err => {return console.log(err)})
                        collector.stop();
                    }
                    if(b.customId === "cancelDeleteLog"){
                        row.components[0].setDisabled(true)
                        row.components[1].setDisabled(true)
                        await b.update({content: "Canceled the command (timeout)", components: [row]})

                        collector.stop();
                    }
                });
                collector.on("end", (b) =>{
                    // When the collector ends
                    row.components[0].setDisabled(true)
                    row.components[1].setDisabled(true)
                    msg.edit({content: "Canceled the command", components: [row]})

                })
            }).catch(err => {return console.log(err.stack)})
        }

        async function DeleteData(id) {
            await LogsDatabase.findOneAndUpdate({
                guildID: message.guild.id,
                [`Action.caseID`]: id
            }, {
                $pull: {
                    Action: {
                        caseID: id
                    }
                },
            }).catch(err => {return console.log(err.stack)})
        }

        if(!args.length || !args[0]) return message.reply({
            embeds: [
                new Discord.MessageEmbed()
                    .setDescription(`Please provide the case ID you want to delete \n\n**Usage: ** \`${prefix}delete-log [ case ID ]\``)
                    .setColor("WHITE")
            ]}).catch(err => {return console.log(err.stack)})

        fetchData(args[0])
    }
}