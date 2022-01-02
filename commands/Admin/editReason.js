const Discord = require('discord.js');
const { MessageButton, MessageActionRow, MessageEmbed } = require('discord.js')
const { LogsDatabase }= require('../../models')
const moment = require('moment');
module.exports = {
    name: 'edit-reason',
    aliases: ["edit-log", "editlog", "editreason"],
    description: "Edit a log reason",
    permissions: ["ADMINISTRATOR", "MANAGE_GUILD"],
    botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
    usage: "editreason [ log ID ] [ New reason ]",
    category: "Administrator",
    cooldown: 3000,
    run: async(client, message, args,prefix) =>{
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
                        .setDescription(`No logs were found by this ID: **${caseid}**`)
                        .setColor("RED")
                ], ephemeral: true})
            }
        }

        async function confirmation (data, id){
            let msg = args[1]
            if(!msg){
                return message.reply({embeds: [
                    new Discord.MessageEmbed()
                        .setDescription(`Please type a new reason for the log`)
                        .setColor("RED")
                ], ephemeral: true})
            }

            let maxSize = message.content.split(" ")
            if(maxSize > 250){
                return message.reply({embeds: [
                    new Discord.MessageEmbed()
                        .setDescription(`You can't type a reason longer than 250 words.`)
                        .setColor("RED")
                ], ephemeral: true})
            }
            data.actionReason = message.content.split(/\s+/g).slice(2).join(' ')

            await LogsDatabase.updateOne({
                guildID: message.guild.id,
                [`Action.caseID`]: id
            }, {
                $pull: {
                    Action: {
                        caseID: id
                    }
                },
            })
            .catch(err => {return console.log(err.stack)})

            await LogsDatabase.updateOne({
                guildID: message.guild.id,
                userID: data.userID
            }, {
                $push: {
                    Action: data
                },
            })
            .catch(err => {return console.log(err.stack)})

            message.channel.send({
                embeds: [
                    new Discord.MessageEmbed()
                        .setDescription(`${data.caseID} reason updated | ${data.actionReason}`)
                        .setColor("GREEN")
                ]
            })
        }

        if(!args.length || !args[0]) return message.reply({
            embeds: [
                new Discord.MessageEmbed()
                    .setDescription(`Please provide the case ID you want to edit \n\n**Usage: ** \`${prefix}edit-reason [ case ID ] [ New Reason ]\``)
                    .setColor("WHITE")
            ]}).catch(err => {return console.log(err.stack)})

        fetchData(args[0])
    }
}