const Discord = require('discord.js');
const { GuildChannel } = require('../../models')
module.exports = {
    event: "guildMemberAdd",
    once: false,
    run: async(member)=> {

        const { guild } = member;
        const Data = await GuildChannel.findOne({
            guildID: guild.id,
            Active: true,
            'Announce.JoinEnable': true
        })

        if( Data ){
            const welcomeArray = [
                `${member.user.username} just landed`, 
                `${member.user.username} entered the arena`, 
                `${member.user.username} Just joined, heres some cookies 🍪`,
                `Woah ${member.user.username} just joined!`,
                `${member.user.username} joined, let's start the party`,
                `Hey ${member.user.username} 👋, welcome to ${guild.name}`,
                `${member.user.username} Joined the party, let's drop on the chat 😂`,
                `Is it a bird or is it a cat, nah its just ${member.user.username}`,
                `Hey our friend ${member.user.username} joined the server. Let's go for mining`,
                `POG, look ${member.user.username} just joined the server`,
                `Hey ${member.user.username}, i warmly welcome you`,
                `konnichiwa ${member.user.username}, welcome to the server.`,
                `welcome ${member.user.username}, we hope you brought pizza`,
                `${member.user.username} just hopped intro the server`,
                `A wild ${member.user.username} just appearede`,
                `Everyone welcome ${member.user.username}`,
                `${member.user.username} joined the server to light up the dark cave and lead us the way`,
                `Rockstar release gta 6 or not, i'm happy with that ${member.user.username} joined the server :D`,
                `Welcome ${member.user.username}`,
                `Hoppity poppity ${member.user.username} just landed on our property`,
                `Hey ${member.user.username}! Enjoy your time in the server.`,
                `🤖 Beep boop, boop beep? ${member.user.username}`
            ]

            const dataChannel = Data.Announce.JOIN;
            const LogChannel = guild.channels.cache.find(c => c.id === dataChannel)

            const randomMsg = welcomeArray[Math.floor(Math.random() * welcomeArray.length)]

            if(LogChannel){
                LogChannel.send({embeds: [new Discord.MessageEmbed()
                    .setAuthor(`${member.user.tag} - ${guild.memberCount.toLocaleString()}` , `${member.user.displayAvatarURL({
                        dynamic: true, 
                        format: 'png'
                    })}`)
                    .setThumbnail(`${member.user.displayAvatarURL({
                        dynamic: true , type: 'png', size: 1024
                    })}`)
                    .setDescription(`\`\`\`${randomMsg}\`\`\``)
                    .setFooter(member.user.id)
                    .setTimestamp()
                    .setColor(guild.me.displayColor)
                ]
                })
            }else {
                return
            }
        }else {
            return false
        }
    }
}