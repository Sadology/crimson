const Discord = require('discord.js');
const { LogsDatabase }= require('../../models');
const {Member} = require('../../Functions/memberFunction');
const { MessageButton, MessageActionRow, MessageEmbed } = require('discord.js')

module.exports = {
    name: 'reset-log',
    aliases: ["resetlog"],
    description: "Reset every mod logs of a user.",
    permissions: ["ADMINISTRATOR", "MANAGE_GUILD"],
    botPermission: ["SEND_MESSAGES"],
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

        if(!args.length || !args[0]){
            return message.channel.send({embeds: [
                new Discord.MessageEmbed()
                    .setDescription(`Please mention a valid member \n\n**Usage:** ${prefix}reset-log [ user ]`)
                    .setColor("RED")
            ]}).then(m => setTimeout(() => m.delete(), 1000 * 20))
            .catch(err => {return console.log(err.stack)})
        }
        const FindMembers = new Member(args[0], message);
        await message.guild.members.fetch()
        
        function GuildMember(Member){
            if(Member){
                const member = message.guild.members.cache.get(Member)
                if(member){
                    return fetchData(member)
                }else {
                    return fetchData(Member)
                }
            }else {
                return message.channel.send({embeds: [
                    new Discord.MessageEmbed()
                        .setDescription(`Please mention a valid member \n\n**Usage:** ${prefix}reset-log [ user ]`)
                        .setColor("RED")
                ]}).then(m => setTimeout(() => m.delete(), 1000 * 20))
                .catch(err => {return console.log(err.stack)})
            }
        }

        async function fetchData(Member){
            let Data = await LogsDatabase.findOne({
                guildID: message.guild.id,
                userID: Member.user ? Member.user.id : Member
            }).catch(err => {return console.log(err)})
            if(!Data){
                return message.channel.send({embeds: [
                    new Discord.MessageEmbed()
                        .setDescription(`User doesn't have any logs yet.`)
                        .setColor("RED")
                ], ephemeral: true}).catch(err => {return console.log(err.stack)})
            }else {
                confirmation(Member)
            }
        }

        function confirmation (member){
            message.channel.send({ content: "You you wish to reset all log? (yes/no)",embeds: [
                new Discord.MessageEmbed()
                    .setDescription(`Data will be permanently deleted from server and you can't recover it later.`)
                    .setColor("RED")
            ], components: [row]}).then(async msg => {
                const collector = msg.createMessageComponentCollector({ componentType: 'BUTTON', time: 1000 * 120 });
                collector.on('collect', async b => {
                    if(b.user.id !== message.author.id) return
                    if(b.customId === 'confirmResetLog'){
                        DeleteData(member).then(async () =>{
                            row.components[0].setDisabled(true)
                            row.components[1].setDisabled(true)
                            await b.update({content: "All data has been deleted", components: [row]})

                        })
                        .catch(err => {return console.log(err)})
                        collector.stop();
                    }
                    if(b.customId === "cancelResetLog"){
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
                    msg.edit({content: "Canceled the command", components: [row]}).catch(err => {return console.log(err.stack)})

                })
            }).catch(err => {return console.log(err.stack)})
        }

        async function DeleteData(member) {
            await LogsDatabase.findOneAndDelete({
                guildID: message.guild.id,
                userID: member.user ? member.user.id : member
            }).catch(err => {return console.log(err.stack)})
        }

        if(!args.length || !args[0]) return message.reply({
            embeds: [
                new Discord.MessageEmbed()
                    .setDescription(`Please mention a member to reset log \n\n**Usage:** \`${prefix}reset-log @shadow~\``)
                    .setColor("WHITE")
            ]
        }).catch(err => {return console.log(err.stack)})

        GuildMember(FindMembers.mentionedMember)
    }
}