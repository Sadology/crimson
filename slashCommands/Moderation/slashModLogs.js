const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const { MessageActionRow, MessageButton } = require('discord.js');
const ms = require('ms');
const { LogsDatabase } = require('../../models');
const moment = require("moment");

module.exports = {
    data: new SlashCommandBuilder()
        .setName('logs')
        .setDescription('Check moderation logs of a member.')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The user you want to check logs')
                .setRequired(true)),
    permission: ["MANAGE_MESSAGES",],
    botPermission: ["SEND_MESSAGES"],
    category: "Slash",
    run: async(client, interaction) =>{
        const { options, guild } = interaction;

        const MemberID = options.getUser('user');

        interaction.deferReply()
        await new Promise(resolve => setTimeout(resolve, 1000))

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setStyle("SUCCESS")
                    .setLabel("Next")
                    .setCustomId("NextPageModLog")
            )
            .addComponents(
                new MessageButton()
                    .setStyle("DANGER")
                    .setLabel("Previous")
                    .setCustomId("PreviousPageModLog")
            )


        function FindMember(Member){
            if(Member){
                const member = interaction.guild.members.cache.get(Member.id)
                if(member){
                    return fetchData(member)
                }else {
                    return fetchData(Member)
                }
            }else {
                return interaction.editReply({embeds: [
                    new Discord.MessageEmbed()
                        .setDescription(`Please mention a valid member \n\n**Usage:** ${prefix}logs [ user ]`)
                        .setColor("RED")
                ], ephemeral: true})
            }
        }

        async function fetchData(Member){
            let Data = await LogsDatabase.findOne({
                guildID: interaction.guild.id,
                userID: Member.user ? Member.user.id : Member
            })

            if(Data){
                return createData(Member, Data)
            }else {
                return interaction.editReply({embeds: [
                    new Discord.MessageEmbed()
                        .setDescription(`${Member.user ? Member.user.id : '<@'+Member+'>'} has No logs`)
                        .setColor("RED")
                ]}).then(m => setTimeout(() => m.delete(), 1000 * 20))
            }
        }

        async function createData(Member, Data){
            if(Data.Action.length == 0){
                return interaction.editReply({embeds: [
                    new Discord.MessageEmbed()
                        .setDescription(`${Member.user ? Member.user : '<@'+Member+'>'} has No logs`)
                        .setColor("RED")
                ]}).then(m => setTimeout(() => m.delete(), 1000 * 20))
            }
            let arr = []
            Data.Action.forEach(data => {
                arr.push(data)
            })

            logFunction(Member, arr)
        }

        async function logFunction(Member, Data){
            let currentIndex = 0
            let MakeEmbed = start => {
                const current = Data.slice(start, start + 5)

                const Embed = new Discord.MessageEmbed()
                    .setDescription(`${Member.user ? Member.user : '<@'+Member+'>'} Mod-Logs - \`[ ${Data.length} ]\``)
                    .setFooter(`Logs ${start + 1} - ${start + current.length}/${Data.length}`)
                    .setColor("#fffafa")

                    for (i = 0; i < current.length; i++){
                        Embed.addField(`**${start + i + 1}**• [ ${current[i].actionType} ]`,[
                            `\`\`\`py\nUser     - ${current[i].userName}`,
                            `\nReason   - ${current[i].actionReason}`,
                            `\nMod      - ${current[i].moderator}`,
                            `\nDuration - ${current[i].actionLength ? current[i].actionLength : "∞"}`, 
                            `\nDate     - ${moment(current[i].actionDate).format('llll')}`,
                            `\nLogID    - ${current[i].caseID}\`\`\``
                        ].toString())
                    }
                
                if(Data.length <= 5){
                    return ({embeds: [Embed]})
                }else if (start + current.length >= Data.length){
                    row.components[0].setDisabled(true)
                    row.components[1].setDisabled(false)
                    return ({embeds: [Embed], components: [row]})
                }else if(current.length == 0){
                    row.components[0].setDisabled(true)
                    row.components[1].setDisabled(false)
                    return ({embeds: [Embed], components: [row]})
                }else if(currentIndex !== 0){
                    row.components[1].setDisabled(false)
                    row.components[0].setDisabled(false)
                    return ({embeds: [Embed], components: [row]})
                }else if (currentIndex + 5 <= Data.length){
                    row.components[1].setDisabled(true)
                    row.components[0].setDisabled(false)
                    return ({embeds: [Embed], components: [row]})
                }
            }
            await interaction.editReply(MakeEmbed(0)).then(async msg => {
                const collector = msg.createMessageComponentCollector({ componentType: 'BUTTON', time: 1000 * 60 * 5 });

                collector.on('collect',async b => {
                    if(b.user.id !== interaction.user.id) return
                    if(b.customId === 'NextPageModLog'){
                        currentIndex += 5
                        await b.update(MakeEmbed(currentIndex))
                    }
                    if(b.customId === "PreviousPageModLog"){
                        currentIndex -= 5
                        await b.update(MakeEmbed(currentIndex))
                    }
                });
                collector.on("end", async() =>{
                    // When the collector ends
                    row.components[0].setDisabled(true)
                    row.components[1].setDisabled(true)
                    await msg.editReply({components: [row]})
                })
            })
        }

        if(MemberID) {
            FindMember(MemberID)
        }else return
    }
}