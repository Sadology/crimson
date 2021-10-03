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

        const FindMembers = new Member(args[0], message);
        message.guild.members.fetch()
        const member = message.guild.members.cache.get(FindMembers.mentionedMember)

        const next = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setStyle("SUCCESS")
                    .setLabel("Next")
                    .setCustomId("NextPageModLog")
            )

        const prev = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setStyle("DANGER")
                    .setLabel("Previous")
                    .setCustomId("PreviousPageModLog")
            )

        if(member){
            try {
                await LogsDatabase.find({
                    guildID: message.guild.id,
                    userID: member.user.id
                }).sort([
                    ['ActionDate','ascending']
                ]).exec(async (err, res) => {
                    if(err){
                        console.log(err)
                    }
                    if(res.length == 0) {
                        return message.channel.send({embeds: [new Discord.MessageEmbed()
                            .setAuthor("Mod-Logs")
                            .setDescription(`${member.user} doesn't have any logs`)
                            .setColor("#fc5947")
                        ]
                        }).then(m=>setTimeout(() =>m.delete(), 1000 * 10))
                    }
                    
                    let currentIndex = 0
                    const generateEmbed = start => {
                        const current = res.slice(start, start + 5)

                        const Embed = new Discord.MessageEmbed()
                            .setDescription(`${member.user} Mod-Logs - \`[${res.length}]\``)
                            .setFooter(`Logs ${start + 1} - ${start + current.length}/${res.length}`)
                            .setColor("#fffafa")

                        for (i = 0; i < current.length; i++){
                            Embed.addField(`**${start + i + 1}**• [ ${current[i] && current[i].ActionType} ]`,[
                                `\`\`\`py\nUser     - ${current[i] && current[i].userName}`,
                                `\nReason   - ${current[i] && current[i].Reason}`,
                                `\nMod      - ${current[i] && current[i].Moderator}`,
                                `\nDuration - ${current[i] && current[i].Duration ? current[i] && current[i].Duration : "∞"}`, 
                                `\nDate     - ${moment(current[i] && current[i].ActionDate).format('llll')}`,
                                `\nLogID    - ${current[i] && current[i].CaseID}\`\`\``
                            ].toString())
                        }
                        try {

                            if(res.length <= 5){
                                return ({embeds: [Embed]})
                            }
                            if (start + current.length >= res.length){
                                return ({embeds: [Embed], components: [prev]})
                            }
                            if(current.length == 0){
                                return ({embeds: [Embed], components: [prev]})
                            }                  
                            if(currentIndex !== 0){
                                return ({embeds: [Embed], components: [next, prev]})
                            }
                            if (currentIndex + 5 <= res.length){
                              return ({embeds: [Embed], components: [next]})
                            }
                        }catch(err) {
                            console.log(err)
                        }
                    }

                    await message.channel.send(generateEmbed(0)).then(async msg => {

                    const filter = (button) => button.clicker.user.id === message.author.id;
                    const collector = msg.createMessageComponentCollector(filter, { time: 1000 * 60, errors: ['time'] });

                    collector.on('collect',async b => {
                        if(b.customId === 'NextPageModLog'){
                            currentIndex += 5
                            await b.update(generateEmbed(currentIndex))
                        }
                        if(b.customId === "PreviousPageModLog"){
                            currentIndex -= 5
                            await b.update(generateEmbed(currentIndex))
                        }
                    });
                    collector.on("end", () =>{
                        // When the collector ends
                    })
                    })
                })
            }catch(err){
                errLog(err.stack.toString(), "text", "Mod-Log", "Error in Searching member");
            }
            }else if(!member){
                try {
                    let memberID = FindMembers.mentionedMember;
                    await LogsDatabase.find({
                        guildID: message.guild.id,
                        userID: memberID
                    }).sort([
                        ['ActionDate','ascending']
                    ]).exec(async(err, res) => {
                        if(err){
                            console.log(err)
                        }

                        if(res.length == 0) {
                            return message.channel.send({embeds: [new Discord.MessageEmbed()
                                .setAuthor("Mod-Logs")
                                .setDescription(`${memberID} doesn't have any logs`)
                                .setColor("#fc5947")
                            ]
                            }).then(m=>setTimeout(() =>m.delete(), 1000 * 10))
                        }
                        
                        let currentIndex = 0
                        const generateEmbed = start => {
                            const current = res.slice(start, start + 5)
    
                            const embed = new Discord.MessageEmbed()
                                .setDescription(`<@${memberID}> Mod-Logs - \`[${res.length}]\``)
                                .setFooter(`Logs ${start + 1} - ${start + current.length}/${res.length}`)
                                .setColor("#fffafa")
    
                            for (i = 0; i < current.length; i++){
                                embed.addField(`**${start + i + 1}**• [ ${current[i] && current[i].ActionType} ]`,[
                                    `\`\`\`py\nUser     - ${current[i] && current[i].userName}`,
                                    `\nReason   - ${current[i] && current[i].Reason}`,
                                    `\nMod      - ${current[i] && current[i].Moderator}`,
                                    `\nDuration - ${current[i] && current[i].Duration ? current[i] && current[i].Duration : "∞"}`, 
                                    `\nDate     - ${moment(current[i] && current[i].ActionDate).format('llll')}`,
                                    `\nLogID    - ${current[i] && current[i].CaseID}\`\`\``
                                ].toString())
                            }       

                            if(res.length <= 5){
                                return ({embeds: [embed]})
                            }
                            if (start + current.length >= res.length){
                                return ({embeds: [embed], components: [prev]})
                            }
                            if(current.length == 0){
                                return ({embeds: [embed], components: [prev]})
                            }                            
                            if(currentIndex !== 0){
                                return ({embeds: [embed], components: [next, prev]})
                            }
                            if (currentIndex + 5 <= res.length){
                              return ({embeds: [embed], components: [next]})
                            }
                        }
    
                        await message.channel.send(generateEmbed(0)).then(async msg => {
    
                        const filter = (button) => button.clicker.user.id === message.author.id;
                        const collector = msg.createMessageComponentCollector(filter, { time: 1000 * 60, errors: ['time'] });
    
                        collector.on('collect',async b => {
                            if(b.customId === 'NextPageModLog'){
                                currentIndex += 5
                                await b.update(generateEmbed(currentIndex))
                            }
                            if(b.customId === "PreviousPageModLog"){
                                currentIndex -= 5
                                await b.update(generateEmbed(currentIndex))
                            }
                        });
                        collector.on("end", () =>{
    
                        })
                        })
                    })
                } catch (err){
                    errLog(err.stack.toString(), "text", "Mod-Log", "Error in Searching member");
                }
            }else {
                return message.channel.send({embeds: [new Discord.MessageEmbed()
                    .setDescription(`Couldn't find ${muteMember}`)
                    .setColor("#fc5947")
                ]
                }).then(m=>setTimeout(() =>m.delete(), 1000 * 10))
            }
    }
}