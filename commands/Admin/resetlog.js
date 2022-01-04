const Discord = require('discord.js');
const { LogsDatabase }= require('../../models');
const { Member } = require('../../Functions');
const { MessageButton, MessageActionRow, MessageEmbed } = require('discord.js')

module.exports = {
    name: 'reset-log',
    aliases: ["resetlog"],
    description: "Reset every mod logs of a user.",
    permissions: ["ADMINISTRATOR", "MANAGE_GUILD"],
    botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
    usage: "reset-log [ user ]",
    category: "Administrator",
    cooldown: 3000,
    run: async(client, message, args,prefix) =>{
        const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setStyle("DANGER")
                .setLabel("Confirm")
                .setCustomId("confirmResetLog")
        )
        .addComponents(
            new MessageButton()
                .setStyle("SUCCESS")
                .setLabel("Cancel")
                .setCustomId("cancelResetLog")
        )   

        const member = new Member(message, client).getMember({member: args[0], clientMember: true})
        if(member == false ) return
        fetchData(member)

        async function fetchData(Member){
            let Data = await LogsDatabase.findOne({
                guildID: message.guild.id,
                userID: Member.user ? Member.user.id : Member.id
            }).catch(err => {return console.log(err.stack)})
            if(!Data){
                return message.channel.send({embeds: [
                    new Discord.MessageEmbed()
                        .setDescription(`User doesn't have any logs yet.`)
                        .setColor("RED")
                ]}).catch(err => {return console.log(err.stack)})
            }else {
                confirmation(Member)
            }
        }

        function confirmation (member){
            message.channel.send({ content: "Do you you wish to reset logs? (confirm/cancel)",embeds: [
                new Discord.MessageEmbed()
                    .setDescription(`⚠ \` Danger \` \n${member}'s every log will be permanently erased from the database and you can't recover it later. \n\n<:dnd:926939036281610300> Procced \n<:online:926939036562628658> Cancel`)
                    .setColor("RED")
            ], components: [row]}).then(async msg => {
                const collector = msg.createMessageComponentCollector({ componentType: 'BUTTON', time: 1000 * 120 });
                collector.on('collect', async b => {
                    if(b.user.id !== message.author.id) return
                    if(b.customId === 'confirmResetLog'){
                        DeleteData(member).then(async () =>{
                            row.components[0].setDisabled(true)
                            row.components[1].setDisabled(true)
                            await b.update({content: "Every data has been erased", components: [row]})

                        })
                        .catch(err => {return console.log(err.stack)})
                        collector.stop();
                    }
                    if(b.customId === "cancelResetLog"){
                        row.components[0].setDisabled(true)
                        row.components[1].setDisabled(true)
                        await b.update({content: "Canceled the command", components: [row]})
                        .catch(err => {return console.log(err.stack)})

                        collector.stop();
                    }
                });
                collector.on("end", (b) =>{
                    // When the collector ends
                    row.components[0].setDisabled(true)
                    row.components[1].setDisabled(true)
                    msg.edit({content: "Canceled the command", components: [row]})
                    .catch(err => {return console.log(err.stack)})

                })
            }).catch(err => {return console.log(err.stack)})
        }

        async function DeleteData(member) {
            await LogsDatabase.deleteOne({
                guildID: message.guild.id,
                userID: member.user ? member.user.id : member.id
            }).catch(err => {return console.log(err.stack)})
        }
    }
}