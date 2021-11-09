const Discord = require('discord.js');
const { GuildChannel } = require('../../models')
const { LogChannel } = require('../../Functions/logChannelFunctions')
module.exports = {
    event: "guildMemberRemove",
    once: false,
    run: async(member)=> {
        const { guild } = member;
            const welcomeArray = [
                `${member.user.username} just left us ;-;`, 
                `${member.user.username} has dropped.`, 
                `${member.user.username} has fallen`,
                `Woah ${member.user.username} has stepped down!`,
                `${member.user.username} just left the server`,
                `Hey ${member.user.username} 👋, farewell mate`,
                `${member.user.username} feel free to meet us again.`,
                `i'm literally crying cause ${member.user.username} just left the server.`,
                `Never gonna give you up ${member.user.username}. Never gonna let you down ${member.user.username}`,
                `Sigh ${member.user.username} left, i'm all alone now.`,
                `Let's meet up underneath the sakura tree again ${member.user.username}`,
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
                if(fetchData.customMessage.LeftMsg.length){
                    let arrData = fetchData.customMessage.LeftMsg
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
            LogChannel("leftLog", guild).then(async (c) => {
                if(!c) return;
                if(c === null) return;

                const hooks = await c.fetchWebhooks();
                const webHook = hooks.find(i => i.owner.id == client.user.id && i.name == 'sadbot')

                if(!webHook){
                    c.createWebhook("sadbot", {
                        avatar: "https://i.ibb.co/86GB8LZ/images.jpg"
                    })
                }

                else {
                    if(fetchData.customMessage.LeftMsg.length){
                        Embed.setDescription(`${variable(databaseMsg)}`)
                        webHook.send({embeds: [Embed]})
                    }else {
                        Embed.setDescription(`\`\`\`${randomMsg}\`\`\``)
                        webHook.send({embeds: [Embed]})
                    }
                }
            })
    }
}