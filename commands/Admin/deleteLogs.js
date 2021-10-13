const Discord = require('discord.js');
const { MessageButton, MessageActionRow, MessageEmbed } = require('discord.js')
const { Guild } = require('../../models');
const { LogsDatabase }= require('../../models')
const moment = require('moment');
module.exports = {
    name: 'delete-log',
    aliases: ["deletelog"],
    description: "Delete a moderation log",
    permissions: ["ADMINISTRATOR"],
    usage: "delete-log [ log ID ]",
    category: "Administrator",
    
    run: async(client, message, args,prefix) =>{

        if(!message.member.permissions.has("ADMINISTRATOR")){
            return message.author.send('None of your role proccess to use this command')
        }

        let logID = args[0]
        if(!logID){
            return message.channel.send({embeds: [new Discord.MessageEmbed()
                .setDescription(`Please provide a Log-ID`)
                .setColor( '#ff303e' )
            ]
            })
        }

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setStyle("DANGER")
                    .setLabel("Confirm")
                    .setCustomId("confirm")
            )
            .addComponents(
                new MessageButton()
                    .setStyle("SUCCESS")
                    .setLabel("Cancel")
                    .setCustomId("cancel")
            )

        let findLog = await LogsDatabase.findOne({guildID: message.guild.id, CaseID: logID})

        if(!findLog){
            return message.channel.send({embeds: [new Discord.MessageEmbed()
                .setDescription(`Please provide a valid Log-ID`)
                .setColor( '#ff303e' )
            ]
            })
        }else{
            const Embed = new MessageEmbed()
                .setAuthor(`${findLog.userName} - Log ID: ${findLog.CaseID}`)
                .setDescription(`\`\`\`yml\nUser:          ${findLog.userName}\nReason:        ${findLog.Reason}\nModerator:     ${findLog.Moderator}\nTime:          ${moment(findLog.Date).format('llll')}\nAuthor:        ${message.author.tag}\`\`\``)
                .setColor("#f25044")
                .setFooter('"Confirm" button to continue, "Cancel" to cancel')

            await message.channel.send({content: "Do you wish to delete this Log?", embeds: [Embed], components: [row]}).then(msg =>{
                const collector = msg.createMessageComponentCollector({ componentType: 'BUTTON', time: 1000 * 60 });

                collector.on('collect',async b => {
                    if(b.user.id !== message.author.id) return
                    if(b.customId === 'confirm'){
                        await LogsDatabase.findOneAndDelete({guildID: message.guild.id, CaseID: logID}, function(err, doc){
                            if(err) console.log(err)
                        })
        
                        await b.update({content: "Log deleted", embeds: [new Discord.MessageEmbed()
                            .setAuthor(`Command - Delete-Log`)
                            .setDescription(`Log **${logID}** has been deleted from database`)
                            .setColor("#66ff6b")
                            .setFooter("Once a data has been delete, there's no way to retrieve it")
                            .setThumbnail("https://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/sign-check-icon.png")
                        ],
                        components: []
                        })
                    }
                    if(b.customId === "cancel"){
                        await b.update({content: "Command canceled",embeds: [new Discord.MessageEmbed()
                            .setAuthor(`Command - Delete-Log`)
                            .setDescription(`Command Canceled`)
                            .setColor("#66ff6b")
                        ],
                        components: []
                        })
                        return
                    }
                });
            }) 
        }
    }
}