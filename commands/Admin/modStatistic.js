const Discord = require('discord.js');
const { Profiles } = require('../../models');
const { Member } = require('../../Functions/MemberFunction');
const moment = require('moment');
module.exports = {
    name: 'mod-stats',
    aliases: ["modstats"],
    description: "Moderators statistic. Moderation data of all time.",
    permissions: ["ADMINISTRATOR", "MANAGE_GUILD"],
    botPermission: ["SEND_MESSAGES"],
    usage: "mod-stats [ user ]",
    category: "Administrator",
    cooldown: 3000,
    run: async(client, message, args,prefix) =>{
        const fetchMember = new Member(args[0], message)
        await message.guild.members.fetch()

        function findMember(Member) {
            if(!Member){
                return message.channel.send({
                    embeds: [
                        new Discord.MessageEmbed()
                            .setDescription("Please mention a moderator to check their statistics")
                            .setColor("RED")
                    ]
                })
            }

            const member = message.guild.members.cache.get(Member)
            if(member){
                return fetchData(member)
            }else {
                return fetchData(Member)
            }
        }

        async function fetchData(Member) {
            await Profiles.findOne({
                guildID: message.guild.id,
                userID: Member.user ? Member.user.id : Member
            })
            .then(res => {
                if(!res || Object.keys(res.ModerationStats).length === 0){
                    return message.channel.send({
                        embeds: [
                            new Discord.MessageEmbed()
                                .setDescription("User doesn't have any moderation history")
                                .setColor("RED")
                        ]
                    })
                }else {
                    return values(res.ModerationStats ,Member)
                }
            })
            .catch(err => {
                return console.log(err)
            })
        }

        function values(Data, Member) {
            let Embed = new Discord.MessageEmbed()
                .setAuthor(`${Member.user ? Member.user.tag : Member}'s - Moderation Statistics`)
                .setDescription(`${Data.Recent ? Data.Recent : "None"}`)
                .setColor("WHITE")
                let values = Object.keys(Data)
                values.shift()
                values.forEach((keys) => {
                    let item = Data[keys]
                    if(item == undefined){
                        item = "0"
                    }
                    Embed.addField(`${keys}`,`\`\`\`${item}\`\`\``, true)
                })
                let Time
                // if(Object.keys(timeData.OnlineTime).length){
                //     if(timeData.OnlineTime.LastOnline == null) {
                //         Time = moment(timeData.OnlineTime.OnlineSince).format("lll") + ' - ' +moment(timeData.OnlineTime.OnlineSince, "YYYYMMDD").fromNow()
                //         Embed.addField("Online Since", `\`\`\`${Time}\`\`\``)
                //     }else if(timeData.OnlineTime.OnlineSince == null) {
                //         Time = moment(timeData.OnlineTime.LastOnline).format("lll") + ' - ' +moment(timeData.OnlineTime.LastOnline, "YYYYMMDD").fromNow()
                //         Embed.addField("Last Online", `\`\`\`${Time}\`\`\``)
                //     }
                // }
            return message.channel.send({
                embeds: [Embed]
            })
        }
        findMember(fetchMember.mentionedMember)
    }
}