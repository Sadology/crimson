const Discord = require('discord.js');
const { LogsDatabase } = require('../../models');
const { MessageButton, MessageActionRow, MessageEmbed } = require('discord.js');
const moment = require('moment');
const { errLog } = require('../../Functions/erroHandling');
module.exports = {
    name: 'admin-log',
    aliases: ["adminlog"],
    description: "Most powerful log, view every single log in the server",
    permissions: ["ADMINISTRATOR"],
    usage: "admin-log [ options ]",
    category: "Administrator",

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

        const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setStyle("SUCCESS")
                .setLabel("Next")
                .setCustomId("NextPageAdminLog")
        )
        .addComponents(
            new MessageButton()
                .setStyle("DANGER")
                .setLabel("Previous")
                .setCustomId("PreviousPageAdminLog")
        )

        switch(cmd){
            case "action":
                async function fetchData(){
                    let Data = await LogsDatabase.findOne({
                        guildID: message.guild.id,
                    })

                    if(Data){
                        return createData(Data)
                    }else {
                        return message.channel.send({embeds: [
                            new Discord.MessageEmbed()
                                .setDescription(`This server has no Mod-log history.`)
                                .setColor("RED")
                        ]}).then(m => setTimeout(() => m.delete(), 1000 * 20))
                    }
                }

                async function createData(Data){
                    if(Data.Action.length == 0){
                        return message.channel.send({embeds: [
                            new Discord.MessageEmbed()
                                .setDescription(`This server has no Mod-log history.`)
                                .setColor("RED")
                        ]}).then(m => setTimeout(() => m.delete(), 1000 * 20))
                    }
                    let arr = []
                    Data.Action.forEach(data => {
                        arr.push(data)
                    })

                    logFunction(arr)
                }

                async function logFunction(Data){
                    let currentIndex = 0
                    let MakeEmbed = start => {
                        const current = Data.slice(start, start + 5)

                        const Embed = new Discord.MessageEmbed()
                            .setDescription(`${message.guild.name} Mod-Logs - \`[ ${Data.length} ]\``)
                            .setFooter(`Logs ${start + 1} - ${start + current.length}/${Data.length}`)
                            .setColor("#fffafa")

                        for (i = 0; i < current.length; i++){
                            Embed.addField(`**${start + i + 1}**• [ ${current[i].Data.ActionType} ]`,[
                                `\`\`\`py\nUser     - ${current[i].Data.userName}`,
                                `\nReason   - ${current[i].Data.Reason}`,
                                `\nMod      - ${current[i].Data.Moderator}`,
                                `\nDuration - ${current[i].Data.Duration ? current[i].Data.Duration : "∞"}`, 
                                `\nDate     - ${moment(current[i].Data.ActionDate).format('llll')}`,
                                `\nLogID    - ${current[i].Data.CaseID}\`\`\``
                            ].toString())
                        }
                        
                        if(Data.length <= 5){
                            return ({embeds: [Embed]})
                        }else if (start + current.length >= Data.length){
                            row.components[0].setDisabled(true)
                            row.components[1].setDisabled(false)
                            return ({embeds: [Embed], components: [row]})
                        }else if(current.length == 0){
                            row.components[0].setDisabled(true)
                            row.components[1].setDisabled(false)
                            return ({embeds: [Embed], components: [row]})
                        }else if(currentIndex !== 0){
                            row.components[1].setDisabled(false)
                            row.components[0].setDisabled(false)
                            return ({embeds: [Embed], components: [row]})
                        }else if (currentIndex + 5 <= Data.length){
                            row.components[1].setDisabled(true)
                            row.components[0].setDisabled(false)
                            return ({embeds: [Embed], components: [row]})
                        }
                    }
                    await message.channel.send(MakeEmbed(0)).then(async msg => {
                        const filter = (button) => button.clicker.user.id == message.author.id;
                        const collector = msg.createMessageComponentCollector({ componentType: 'BUTTON', time: 1000 * 120 });

                        collector.on('collect',async b => {
                            if(b.user.id !== message.author.id) return
                            if(b.customId === 'NextPageAdminLog'){
                                currentIndex += 5
                                await b.update(MakeEmbed(currentIndex))
                            }
                            if(b.customId === "PreviousPageAdminLog"){
                                currentIndex -= 5
                                await b.update(MakeEmbed(currentIndex))
                            }
                        });
                        collector.on("end", () =>{
                            // When the collector ends
                        })
                    })
                }
                fetchData()
            break;

            default:
                return message.channel.send({embeds: [ErrorEmbed]}).then(m=>setTimeout(() => m.delete(), 1000 * 10))
        }
    }
}