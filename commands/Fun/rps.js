const Discord = require('discord.js');
const { MessageActionRow, MessageButton } = require('discord.js');
module.exports = {
    name: 'rps',
    description: "Rock! Paper! Scissor!",
    permissions: ["SEND_MESSAGES"],
    botPermission: ["SEND_MESSAGES"],
    usage: "rps",
    category: "Fun",
    cooldown: 3000,
    run: async(client, message, args,prefix) =>{
        const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setCustomId('Rock')
            .setLabel("Rock")
            .setStyle("PRIMARY")
        )
        .addComponents(
            new MessageButton()
            .setCustomId('Paper')
            .setLabel("Paper")
            .setStyle("PRIMARY")
        )
        .addComponents(
            new MessageButton()
            .setCustomId('Scissor')
            .setLabel("Scissor")
            .setStyle("PRIMARY")
        )

        const choice = [ 'rock', 'paper', 'scissor' ]
        const chosen = choice[Math.floor(Math.random() * choice.length)]

        message.channel.send({embeds: [new Discord.MessageEmbed()
            .setDescription("Select your option within 10 seconds")
            .setColor("WHITE")
        ], components: [row]}).then(msg =>{
            const filter = (button) => button.clicker.user.id === message.author.id

            const collector = msg.createMessageComponentCollector(filter, { time: 1000 * 10, errors: ['time'] });

            collector.on('collect', (b) =>{
                //ROCK
                if(b.customId === 'Rock'){
                    if(chosen === 'rock'){
                        b.update({embeds: [new Discord.MessageEmbed()
                            .setDescription(`Both chosen Rock. Draw!`)
                            .setColor("YELLOW")
                        ], components: []})
                    }else if(chosen === 'paper'){
                        b.update({embeds: [new Discord.MessageEmbed()
                            .setDescription(`${client.user}: \`Paper\` \n${message.author}: \`Rock\` \n\n${client.user} won! 🎉`)
                            .setColor("RED")
                        ], components: []}) 
                    }else if(chosen === 'scissor'){
                        b.update({embeds: [new Discord.MessageEmbed()
                            .setDescription(`${client.user}: \`Scissor\` \n${message.author}: \`Rock\` \n\n${message.author} won! 🎉`)
                            .setColor("GREEN")
                        ], components: []})
                    }
                //PAPER
                }else if(b.customId === 'Paper'){
                    if(chosen === 'rock'){
                        b.update({embeds: [new Discord.MessageEmbed()
                            .setDescription(`${client.user}: \`Rock\` \n${message.author}: \`paper\` \n\n${message.author} won! 🎉`)
                            .setColor("GREEN")
                        ], components: []})
                    }else if(chosen === 'paper'){
                        b.update({embeds: [new Discord.MessageEmbed()
                            .setDescription(`Both chosen Paper. Draw!`)
                            .setColor("YELLOW")
                        ], components: []}) 
                    }else if(chosen === 'scissor'){
                        b.update({embeds: [new Discord.MessageEmbed()
                            .setDescription(`${client.user}: \`Scissor\` \n${message.author}: \`Paper\` \n\n${client.user} won! 🎉`)
                            .setColor("RED")
                        ], components: []})
                    }
                //SCISSOR
                }else if(b.customId === 'Scissor'){
                    if(chosen === 'paper'){
                        b.update({embeds: [new Discord.MessageEmbed()
                            .setDescription(`${client.user}: \`Paper\` \n${message.author} \`Scissor\` \n\n${message.author} won! 🎉`)
                            .setColor("GREEN")
                        ], components: []})
                    }else if(chosen === 'scissor'){
                        b.update({embeds: [new Discord.MessageEmbed()
                            .setDescription(`Both chosen Scissor. Draw!`)
                            .setColor("YELLOW")
                        ], components: []}) 
                    }else if(chosen === 'rock'){
                        b.update({embeds: [new Discord.MessageEmbed()
                            .setDescription(`${client.user}: \`Rock\` \n${message.author}: \`Scissor\` \n\n${client.user} won! 🎉`)
                            .setColor("RED")
                        ], components: []})
                    }
                }
            })

            collector.on('end', () =>{
            })
        })
    }
}