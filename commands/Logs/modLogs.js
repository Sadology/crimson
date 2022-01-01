const Discord = require('discord.js');
const { LogsDatabase, GuildRole} = require('../../models');
const moment = require('moment');
const { errLog } = require('../../Functions/erroHandling');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js')
const { Member } = require('../../Functions');
module.exports = {
    name: 'logs',
    aliases: ['modlogs', 'modlog', 'log'],
    description: "Check moderation logs of a member.",
    permissions: ["MANAGE_MESSAGES"],
    botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
    usage: "logs [ member ]",
    category: "Moderation",
    cooldown: 1000,
    run: async(client, message, args,prefix) =>{
        if(!args.length){
            return message.channel.send({
                embeds: [new Discord.MessageEmbed()
                    .setAuthor(message.author.tag, message.author.displayAvatarURL({type: 'png', dynamic: false}))
                    .setDescription(`<:error:921057346891939840> Mention a member \n\nUsage: \`${prefix}logs [ member ]\``)
                    .setColor("WHITE")
                ]
            })
        }
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
        
        let member = new Member(message, client).getMemberWithoutErrHandle({member: args[0], clientMember: true})
        if(member == false ) {
            member = args[0].replace(/<@!/g, '').replace(/>/g, '')
        }
        fetchData(member)

        async function fetchData(Member){
            await LogsDatabase.findOne({
                guildID: message.guild.id,
                userID: Member.user ? Member.user.id : Member.id
            }).then((res) => {
                if(res){
                    return createData(Member, res) 
                }else {
                    return message.channel.send({embeds: [
                        new Discord.MessageEmbed()
                            .setDescription(`${Member.user ? Member.user.id : '<@'+Member+'>'} has No logs`)
                            .setColor("RED")
                    ]}).then(m => setTimeout(() => m.delete(), 1000 * 20))
                    .catch(err => {return console.log(err.stack)})
                }
            }).catch(err => {return console.log(err.stack)})
        }

        async function createData(Member, Data){
            if(Data.Action.length == 0){
                return message.channel.send({embeds: [
                    new Discord.MessageEmbed()
                        .setDescription(`${Member.user ? Member.user : Member.tag} has No logs`)
                        .setColor("RED")
                ]}).then(m => setTimeout(() => m.delete(), 1000 * 20))
                .catch(err => {return console.log(err.stack)})
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
                    .setDescription(`${Member.user ? Member.user : Member} Mod-Logs - \`[ ${Data.length} ]\``)
                    .setFooter(`Logs ${start + 1} - ${start + current.length}/${Data.length}`)
                    .setColor("#fffafa")

                for (i = 0; i < current.length; i++){
                    Embed.addField(`**${start + i + 1}**• [ ${current[i].actionType} ]`,[
                        `\`\`\`py\nUser     - ${current[i].userName}`,
                        `Reason   - ${current[i].actionReason}`,
                        `Mod      - ${current[i].moderator}`,
                        `Duration - ${current[i].actionLength ? current[i].actionLength : "∞"}`,
                        `Date     - ${moment(current[i].actionDate).format('llll')}`,
                        `LogID    - ${current[i].caseID}\`\`\``
                    ].join(" \n").toString())
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
                        await b.update(MakeEmbed(currentIndex)).catch(err => {return console.log(err.stack)})
                    }
                    if(b.customId === "PreviousPageModLog"){
                        currentIndex -= 5
                        await b.update(MakeEmbed(currentIndex)).catch(err => {return console.log(err.stack)})
                    }
                });
                collector.on("end", async() =>{
                    // When the collector ends
                    if(currentIndex !== 0){
                        row.components[0].setDisabled(true)
                        row.components[1].setDisabled(true)
                        await msg.edit({components: [row]}).catch(err => {return console.log(err.stack)})
                    }
                })
            }).catch(err => {return console.log(err.stack)})
        }
    }
}