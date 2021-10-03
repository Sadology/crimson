const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const ms = require('ms');
const { LogsDatabase, GuildChannel} = require('../../models');
const { commandUsed } = require('../../Functions/CommandUsage');
const { errLog } = require('../../Functions/erroHandling');
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
    run: async(client, interaction) =>{
        const { options, guild } = interaction;

        const MemberID = options.getUser('user');

        interaction.deferReply()
        await new Promise(resolve => setTimeout(resolve, 1000))

        if(!MemberID){
            return interaction.editReply({embeds: [new Discord.MessageEmbed()
                .setDescription("Please mention a user to check logs")
                .setColor("RED")
            ], ephemeral: true
            })
        }

        const CreateNextRow = new Discord.MessageActionRow()
        let nextButton = CreateNextRow.addComponents(
            new Discord.MessageButton()
                .setStyle("PRIMARY")
                .setLabel("Next")
                .setCustomId("NextPageModLog")
            )
        const CreatePrevRow = new Discord.MessageActionRow()
        let prevButton = CreatePrevRow.addComponents(
            new Discord.MessageButton()
                .setStyle("PRIMARY")
                .setLabel("Previous")
                .setCustomId("PreviousPageModLog")
            )

        let Member;
        Member = interaction.guild.members.cache.get(MemberID.id);

        async function DataConstructor(Member){
            await LogsDatabase.find({
                guildID: interaction.guild.id,
                userID: Member
            }).sort([
                ['ActionDate','ascending']
            ]).exec(async(err, res) => {
                if(err) return console.log(err);

                if(res.length == 0){
                    return interaction.editReply({embeds: [
                        new Discord.MessageEmbed()
                            .setDescription("This user don't have any logs yet")
                            .setColor("RED")
                    ]})
                }

                let currentIndex = 0
                const MakeData = start =>{
                    const currentPage = res.slice(start, start + 5);

                    let Embed = new Discord.MessageEmbed()
                        .setDescription(`<@${Member}> - Moderation Logs \`[${res.length}]\``)
                        .setFooter(`${start + 1} - ${start + currentPage.length}/${res.length}`)
                        .setColor("#fffafa")
                        
                    for (i = 0; i < currentPage.length; i++){
                        Embed.addField(`${start + i + 1} - [ ${currentPage[i] && currentPage[i].ActionType} ]`,[
                            `\`\`\`py\nUser     - ${currentPage[i] && currentPage[i].userName}`,
                            `\nReason   - ${currentPage[i] && currentPage[i].Reason}`,
                            `\nMod      - ${currentPage[i] && currentPage[i].Moderator}`,
                            `\nDuration - ${currentPage[i] && currentPage[i].Duration ? currentPage[i] && currentPage[i].Duration : "∞"}`, 
                            `\nDate     - ${moment(currentPage[i] && currentPage[i].ActionDate).format('llll')}`,
                            `\nLogID    - ${currentPage[i] && currentPage[i].CaseID}\`\`\``
                        ].toString())
                    }

                    if(res.length <= 5){
                        return ({embeds: [Embed]})
                    }else if (start + currentPage.length >= res.length){
                        return ({embeds: [Embed], components: [prevButton]})
                    }else if(currentPage.length == 0){
                        return ({embeds: [Embed], components: [prevButton]})
                    }else if(currentIndex !== 0){
                        return ({embeds: [Embed], components: [nextButton, prevButton]})
                    }else if (currentIndex + 10 < res.length){
                        return ({embeds: [Embed], components: [nextButton]})
                    }
                }

                await interaction.editReply(MakeData(0)).then(async inter => {
                    const filter = (button) => button.clicker.user.id === interaction.user.id;
                    const collector = interaction.channel.createMessageComponentCollector(filter, { time: 1000 * 120, errors: ['time'] });

                    collector.on('collect',async b => {
                        if(b.customId === 'NextPageModLog'){
                            currentIndex += 5
                            await b.update(MakeData(currentIndex))
                        }
                        if(b.customId === "PreviousPageModLog"){
                            currentIndex -= 5
                            await b.update(MakeData(currentIndex))
                        }
                    });
                    collector.on("end", () =>{})
                })  
            })
        }
        if(Member){
            try {
                DataConstructor(Member.id)
            }catch (err){
                console.log(err)
            }
        }else if(!Member){
            try {
                DataConstructor(MemberID)
            }catch(err){
                console.log(err)
            }
        }
    }
}