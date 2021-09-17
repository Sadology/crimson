const Discord = require('discord.js');
const { GuildChannel, ModStats } = require('../models');
const moment = require('moment')

module.exports = (client, message) =>{
    const checkData = async () =>{
        const results = await GuildChannel.find({})

        for (const data of results){
            const { guildID, statusLog } = data;

            const guild = client.guilds.cache.get(guildID);
            
            if(guild){
                const channel = guild.channels.cache.find(c =>c.id === statusLog.Channel)

                if(statusLog.Enabled === true){
                    if(channel){
                        channel.messages.fetch({around: statusLog.msgID, limit: 1})
                        .then(msg => {
                            fetchedMsg = msg.first();
                        });

                        await ModStats.find({
                            guildID: guild.id,
                            'Status.Active': true

                        }).sort([
                            ['Time','descending']
                        ]).exec(async (err, res) => {
                            if(err){
                                console.log(err)
                            }
                            const Embed = new Discord.MessageEmbed()
                                .setAuthor(`${guild} - Active Status`, client.user.displayAvatarURL({dunamic: false, type: "png", size: 1024}))
                                .setColor("#fffafa")

                                if(res.length === 0){
                                    if(fetchedMsg){
                                        fetchedMsg.edit("",{embeds: [new Discord.MessageEmbed()
                                            .setAuthor(`${guild} - Active Status`, client.user.displayAvatarURL({dunamic: false, type: "png", size: 1024}))
                                            .setDescription(`\`\`\`No active status yet\`\`\``)
                                            .setThumbnail("https://cdn.discordapp.com/attachments/851135684907106334/854377326699085844/images.png")
                                            .setColor("#fffafa")
                                            .setFooter("Status database refresh every 20 minutes")
                                        ]
                                        })
                                        return
                                    }else {
                                        return
                                    }
                                
                                }else if(res.length < 10){

                                    for(i = 0; i < res.length; i++){
                                        Embed.addField(`**${i + 1}** ${res[i] && res[i].userName} ( ${res[i] && res[i].userID} )`,[
                                            `\`\`\`yml\nUser:    ${res[i] && res[i].userName}`,
                                            `Message: ${res[i] && res[i].Status.MSG}`,
                                            `Time:    ${moment(res[i] && res[i].Status.Time).calendar()}`,
                                            `Active:  ${res[i] && res[i].Status.Active}\`\`\``
                                        ])

                                    }
                                    Embed.setThumbnail("https://cdn.discordapp.com/attachments/851135684907106334/854377306183958589/663d0696b75cef570d6b5c76c3333866.jpg")
                                    Embed.setFooter(`${guild.id}`,)
                                    Embed.setTimestamp()
                                }else {
                                    for(i = 0; i < 10; i++){
                                        Embed.addField(`**${i + 1}** ${res[i] && res[i].userName} ( ${res[i] && res[i].userID} )`,[
                                            `\`\`\`yml\nUser:    ${res[i] && res[i].userName}`,
                                            `Message: ${res[i] && res[i].Status.MSG}`,
                                            `Time:    ${moment(res[i] && res[i].Status.Time).calendar()}`,
                                            `Active:  ${res[i] && res[i].Status.Active}\`\`\``
                                        ])

                                    }
                                    Embed.setThumbnail("https://cdn.discordapp.com/attachments/851135684907106334/854377306183958589/663d0696b75cef570d6b5c76c3333866.jpg")
                                    Embed.setFooter(`${guild.id}`,)
                                    Embed.setTimestamp()
                                }
                                if(fetchedMsg){
                                    fetchedMsg.edit("", {embeds: [Embed]})
                                }else {
                                    return
                                }
                        })
                    }else {
                        return
                    }
                }else if(statusLog.Enabled === false){
                    return
                }
            }
        }

        setTimeout(checkData, 1000 * 60 * 20)
    }
    checkData()
}