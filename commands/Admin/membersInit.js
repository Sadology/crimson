const Discord = require('discord.js');
const fs = require('fs');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

module.exports = {
    name: 'membersinit',
    aliases: ['rolemember'],
    description: "Members in a single role",
    permissions: ["ADMINISTRATOR", "MANAGE_GUILD"],
    botPermission: ["SEND_MESSAGES"],
    usage: "memberinit [ role ]",
    category: "Administrator",
    cooldown: 3000,
    run: async(client, message, args,prefix) =>{
        const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setStyle("SUCCESS")
                .setLabel("Next")
                .setCustomId("NextPageMemberInit")
        )
        .addComponents(
            new MessageButton()
                .setStyle("DANGER")
                .setLabel("Previous")
                .setCustomId("PreviousPageMemberInit")
        )

        if(!args.length){
            return message.channel.send({embeds: [
                new Discord.MessageEmbed()
                    .setDescription(`Please mention a valid role \n\n**Usage:** \`${prefix}membersinit [ role name ]\``)
                    .setColor("RED")
                ]
            })
        }else {
            fetchRole()
        }

        function fetchRole(){
            let roleArgs = message.content.split(" ").slice(1)
            let roleItem = roleArgs.join(' ')
            let role = message.mentions.roles.first() || 
            message.guild.roles.cache.find(r => r.name.toLowerCase() == roleItem.toLowerCase()) || 
            message.guild.roles.cache.find(r => r.id == args[0]);
            if(!role){
                return message.channel.send({embeds: [
                    new Discord.MessageEmbed()
                        .setDescription(`Coudldn't find any role. Please mention a valid role \n\n**Usage:** \`${prefix}membersinit [ role name ]\``)
                        .setColor("RED")
                    ]
                })
            }

            constructData(role)
        }

        async function constructData(Role){
            let memberArr = new Array();
            Role.members.forEach(user => {
                if(user){
                    memberArr.push(`${user} - ${user.id}`);
                }
            });

            if(memberArr.length == 0){
                return message.channel.send({embeds: [
                    new Discord.MessageEmbed()
                        .setDescription("No one LoL")
                        .setColor("#fffafa")
                    ]
                }).catch(err => {return console.log(err.stack)})
            };

            let currentIndex = 0
            let MakeEmbed = start => {
                const current = memberArr.slice(start, start + 10)
    
                const Embed = new Discord.MessageEmbed()
                    .setColor("#fffafa")
                    .setAuthor(`Total Members [${memberArr.length}]`)
                for (i = 0; i < current.length; i++){
                    Embed.setDescription(current.join('\n'))
                }
                if(memberArr.length <= 10){
                    return ({embeds: [Embed]})
                }else if (start + current.length >= memberArr.length){
                    row.components[0].setDisabled(true)
                    row.components[1].setDisabled(false)
                    return ({embeds: [Embed], components: [row]})
                }else if(currentIndex == 0){
                    row.components[1].setDisabled(true)
                    row.components[0].setDisabled(false)
                    return ({embeds: [Embed], components: [row]})
                }else if(currentIndex !== 0){
                    row.components[1].setDisabled(false)
                    row.components[0].setDisabled(false)
                    return ({embeds: [Embed], components: [row]})
                }else if (currentIndex + 10 <= memberArr.length){
                    row.components[1].setDisabled(true)
                    row.components[0].setDisabled(false)
                    return ({embeds: [Embed], components: [row]})
                }
            }
            await message.channel.send(MakeEmbed(0)).then(async msg => {
                const collector = msg.createMessageComponentCollector({ componentType: 'BUTTON', time: 1000 * 60 * 10 });

                collector.on('collect',async b => {
                    if(b.user.id !== message.author.id) return
                    if(b.customId === 'NextPageMemberInit'){
                        currentIndex += 10
                        await b.update(MakeEmbed(currentIndex)).catch(err => {return console.log(err.stack)})
                    }
                    if(b.customId === "PreviousPageMemberInit"){
                        currentIndex -= 10
                        await b.update(MakeEmbed(currentIndex)).catch(err => {return console.log(err.stack)})
                    }
                });
                collector.on("end", async() =>{
                    // When the collector ends
                    if(currentIndex !== 0){
                        row.components[0].setDisabled(true)
                        row.components[1].setDisabled(true)
                        await msg.edit({components: [row]}).catch(err => {return console.log(err.stack)})
                    }
                })
            }).catch(err => {return console.log(err.stack)})
        }
    }
}