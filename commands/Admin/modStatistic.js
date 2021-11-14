const Discord = require('discord.js');
const { Profiles } = require('../../models');
const { Member } = require('../../Functions/MemberFunction');
module.exports = {
    name: 'mod-stats',
    aliases: ["modstats"],
    description: "Moderators statistic. Moderation data of all time.",
    permissions: ["ADMINISTRATOR"],
    usage: "mod-stats [ user ]",
    category: "Administrator",
    
    run: async(client, message, args,prefix) =>{
        await message.delete();
        if(!message.member.permissions.has("ADMINISTRATOR")){
            return message.author.send('None of your role proccess to use this command')
        }

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
            const Data = await Profiles.findOne({
                guildID: message.guild.id,
                userID: Member.user ? Member.user.id : Member
            })

            if(!Data.ModerationStats){
                return message.channel.send({
                    embeds: [
                        new Discord.MessageEmbed()
                            .setDescription("User doesn't have any moderation history")
                            .setColor("RED")
                    ]
                })
            }

            values(Data.ModerationStats, Member)
        }

        function values(Data, Member) {
            let Embed = new Discord.MessageEmbed()
                .setAuthor("Moderation Statistics")
                .setDescription(`${Data.Recent ? Data.Recent : "0"}`)
                .setColor("WHITE")
                let values = Object.keys(Data)
                values.shift()
                values.forEach((keys, index) => {
                    let item = Data[keys]
                    if(item == undefined){
                        item = "0"
                    }
                    Embed.addField(`${keys}`,`\`\`\`${item}\`\`\``, true)
                })
            return message.channel.send({
                embeds: [Embed]
            })
        }
        findMember(fetchMember.mentionedMember)
    }
}