const Discord = require('discord.js');
const { GuildChannel } = require('../../models')
const { LogChannel } = require('../../Functions/logChannelFunctions')
module.exports = {
    event: "guildMemberAdd",
    once: false,
    run: async(member)=> {

        const { guild } = member;
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

            let fetchData = await GuildChannel.findOne({
                guildID: guild.id,
                Active: true
            })

            let Embed = new Discord.MessageEmbed()
            .setAuthor(`${member.user.tag} - ${guild.memberCount.toLocaleString()}` , `${member.user.displayAvatarURL({
                dynamic: true, 
                format: 'png'
            })}`)
            .setThumbnail(`${member.user.displayAvatarURL({
                dynamic: true , type: 'png', size: 1024
            })}`)
            .setFooter(member.user.id)
            .setTimestamp()
            .setColor(guild.me.displayColor)

            let randomMessages = [];
            if(fetchData.customMessage){
                if(fetchData.customMessage.JoinedMsg.length){
                    let arrData = fetchData.customMessage.JoinedMsg
                    arrData.forEach(data => {
                        randomMessages.push(data)
                    })
                }
            }

            const randomMsg = welcomeArray[Math.floor(Math.random() * welcomeArray.length)];
            const databaseMsg = randomMessages[Math.floor(Math.random() * randomMessages.length)];

            function variable(Array) {
                return Array
                .replace(/{member}/g, `${member.user}`)
                .replace(/{member.id}/g, `${member.user.id}`)
                .replace(/{member.tag}/g, `${member.user.tag}`)
                .replace(/{member.name}/g, `${member.user.username}`)
                .replace(/{server}/g, `${guild.name}`)
                .replace(/{server.id}/g, `${guild.id}`)
            }
            LogChannel("joinedLog", guild).then(async (c) => {
                if(!c) return;
                if(c === null) return;

    			const hooks = await c.fetchWebhooks();
                const webHook = hooks.find(i => i.owner.id == client.user.id && i.name == 'sadbot')

                if(!webHook){
                    c.createWebhook("sadbot", {
                        avatar: "https://i.ibb.co/86GB8LZ/images.jpg"
                    })
                }

                if(fetchData.customMessage.JoinedMsg.length){
                    Embed.setDescription(`${variable(databaseMsg)}`)
                    webHook.send({embeds: [Embed]})
                }else {
                    Embed.setDescription(`\`\`\`${randomMsg}\`\`\``)
                    webHook.send({embeds: [Embed]})
                }
            })
    }
}