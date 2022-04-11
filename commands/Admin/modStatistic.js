const Discord = require('discord.js');
const { Profiles } = require('../../models');
const { Member } = require('../../Functions');
const moment = require('moment');
module.exports = {
    name: 'mod-stats',
    aliases: ["modstats"],
    description: "Moderators statistic. Moderation data of all time.",
    permissions: ["ADMINISTRATOR", "MANAGE_GUILD"],
    botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
    usage: "mod-stats [ user ]",
    category: "Administrator",
    cooldown: 3000,
    run: async(client, message, args,prefix) =>{
        const member = new Member(message, client).getMember({member: args[0], clientMember: true})
        if(member == false ) return
        fetchData(member)

        async function fetchData(Member) {
            await Profiles.findOne({
                guildID: message.guild.id,
                userID: Member.user ? Member.user.id : Member.id
            })
            .then(res => {
                if(!res || Object.keys(res.ModerationStats).length === 0){
                    return message.channel.send({
                        embeds: [new Discord.MessageEmbed()
                            .setDescription("User doesn't have any moderation history")
                            .setColor("RED")
                        ]}).catch(err => {return console.log(err)})
                }else {
                    return values(res.ModerationStats ,Member, res)
                }
            })
            .catch(err => {
                return console.log(err.stack)
            })
        }

        function values(Data, Member, timeData) {
            let Embed = new Discord.MessageEmbed()
                .setAuthor(`${Member.user ? Member.user.tag : Member.tag}'s - Moderation Statistics`)
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
            return message.channel.send({
                embeds: [Embed]
            }).catch(err => {return console.log(err.stack)})
        }
    }
}