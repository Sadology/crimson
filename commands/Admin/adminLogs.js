const Discord = require('discord.js');
const { LogsDatabase } = require('../../models');
const { MessageButton, MessageActionRow, MessageEmbed } = require('discord.js');
const moment = require('moment');
const { errLog } = require('../../Functions/erroHandling');
module.exports = {
    name: 'admin-log',
    aliases: ["adminlog"],

    run: async(client, message, args,prefix) =>{
        let cmd = args[0];

        if(!message.member.permissions.has("ADMINISTRATOR")){
            return message.author.send('None of your role proccess to use this command')
        }

        const ErrorEmbed = {
            color: "#fffafa",
            author: {
                name: `Command - Admin-Log`,
                icon_url: client.user.displayAvatarURL({dynamic: false, format: "png", size: 1024})
            },
            description: `Moderate whole server with Admin-log.
            \n**Usage:** \`${prefix}admin-log [ option ]\` \n**Example:** \`${prefix}admin-log action\``,
            timestamp: new Date()
        }

        if( !args.length ){
            return message.channel.send({embeds: [ErrorEmbed]}).then((m) => setTimeout(() => m.delete(), 1000 * 10))
        };

        switch(cmd){
            case "action":{
                await LogsDatabase.find({
                    guildID: message.guild.id,
                }).sort([
                    ['Time','ascending']
                ]).exec(async (err, res) => {
                    if(err){
                        console.log(err)
                    }

                    const next = new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                                .setStyle("SUCCESS")
                                .setLabel("Next")
                                .setCustomId("NextPageAdminLog")
                        )
                    const prev = new MessageActionRow()
                        .addComponents(
                            new MessageButton()
                                .setStyle("DANGER")
                                .setLabel("previous")
                                .setCustomId("PreviousPageAdminLog")
                        )

                    if(res.length == 0) {
                        let missing = new Discord.MessageEmbed()
                            .setDescription("Admin-Log - Actions")
                            .setDescription(`No action logs found in ${message.guild.name}`)
                            .setColor("#fc5947")
                        return message.channel.send({embeds: [missing]}).then((m) => setTimeout(() => m.delete(), 1000 * 10))
                    }
                    
                    let currentIndex = 0
                    const generateEmbed = start => {
                        const current = res.slice(start, start + 5)

                        const Embed = new Discord.MessageEmbed()
                            .setDescription(`**${message.guild.name}|** Action-Logs - \`[${res.length}]\``)
                            .setFooter(`Logs ${start + 1} - ${start + current.length} out of ${res.length}`)
                            .setColor("#fffafa")

                        for (i = 0; i < current.length; i++){
                            Embed.addField(`**${i + 1}**• [ ${current[i] && current[i].ActionType} ]`,[
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
                            }else if (start + current.length >= res.length){
                                return ({embeds: [Embed], components: [prev]})
                            }else if(current.length == 0){
                                return ({embeds: [Embed], components: [prev]})
                            }else if(currentIndex !== 0){
                                return ({embeds: [Embed], components: [next, prev]})
                            }else if (currentIndex + 10 <= res.length){
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
                        try{
                            if(b.customId === 'NextPageAdminLog'){
                                currentIndex += 5
                                await b.update(generateEmbed(currentIndex))
                            }
                            if(b.customId === "PreviousPageAdminLog"){
                                    currentIndex -= 5
                                    await b.update(generateEmbed(currentIndex))
                            }
                        } catch (err){
                            errLog(err.stack.toString(), "text", "Reset-Log", "Error in changing page");
                        }
                    });
                    collector.on("end", () =>{

                    })
                    })
                })
            }
            break;

            default:
                return message.channel.send({embeds: [ErrorEmbed]}).then(m=>setTimeout(() => m.delete(), 1000 * 10))
        }
    }
}