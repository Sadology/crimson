const Discord = require('discord.js');
const { LogsDatabase, GuildRole} = require('../../models');
const moment = require('moment');
const { errLog } = require('../../Functions/erroHandling');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js')
const {Member} = require('../../Functions/MemberFunction');
module.exports = {
    name: 'logs',
    aliases: ['modlogs', 'modlog', 'log'],
    description: "Check moderation logs of a member.",
    permissions: ["MANAGE_MESSAGES"],
    usage: "mlogs [ member ]",
    category: "Moderation",

    run: async(client, message, args,prefix) =>{

        if(!message.member.permissions.has("MANAGE_MESSAGES")){
            return message.author.send('None of your role proccess to use this command')
        }

        if(!args.length){
            return message.channel.send({embeds: [new Discord.MessageEmbed()
                .setAuthor(`${message.author.tag} - Mod Logs`)
                .setColor("#fc5947")
                .setDescription(`Mention a user to fetch their logs \n\n**Usage:** \`${prefix}logs [ user ]\` \n**Example:** \`${prefix}logs @shadow~\``)
            ]
            }).then(m=>setTimeout(() =>m.delete(), 1000 * 10))
        }

        const GetMembers = new Member(args[0], message);
        await message.guild.members.fetch()

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
                const member = message.guild.members.cache.get(Member)
                if(member){
                    return fetchData(member)
                }else {
                    return fetchData(Member)
                }
            }else {
                return message.channel.send({embeds: [
                    new Discord.MessageEmbed()
                        .setDescription(`Please mention a valid member \n\n**Usage:** ${prefix}logs [ user ]`)
                        .setColor("RED")
                ]}).then(m => setTimeout(() => m.delete(), 1000 * 20))
            }
        }

        async function fetchData(Member){
            let Data = await LogsDatabase.findOne({
                guildID: message.guild.id,
                userID: Member.user ? Member.user.id : Member
            })

            if(Data){
                return createData(Member, Data)
            }else {
                return message.channel.send({embeds: [
                    new Discord.MessageEmbed()
                        .setDescription(`${Member.user ? Member.user.id : '<@'+Member+'>'} has No logs`)
                        .setColor("RED")
                ]}).then(m => setTimeout(() => m.delete(), 1000 * 20))
            }
        }

        async function createData(Member, Data){
            if(Data.Action.length == 0){
                return message.channel.send({embeds: [
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
            await message.channel.send(MakeEmbed(0)).then(async msg => {
                const filter = (button) => button.clicker.user.id == message.author.id;
                const collector = msg.createMessageComponentCollector({ componentType: 'BUTTON', time: 1000 * 60 * 5 });

                collector.on('collect',async b => {
                    if(b.user.id !== message.author.id) return
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
                    await msg.edit({components: [row]})
                })
            })
        }

        FindMember(GetMembers.mentionedMember)
        return
    }
}