const Discord = require('discord.js');
const {Member} = require('../../Functions/MemberFunction');
const { MessageActionRow, MessageButton } = require('discord.js');
module.exports = {
    name: 'rps',
    description: "Rock! Paper! Scissor!",
    permissions: ["SEND_MESSAGES"],
    usage: "rps",
    category: "Fun",
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
        const choosen = choice[Math.floor(Math.random() * choice.length)]

        message.channel.send({embeds: [new Discord.MessageEmbed()
            .setDescription("Select your option within 10 seconds")
            .setColor("WHITE")
        ], components: [row]}).then(msg =>{
            const filter = (button) => button.clicker.user.id === message.author.id

            const collector = msg.createMessageComponentCollector(filter, { time: 1000 * 10, errors: ['time'] });

            collector.on('collect', (b) =>{
                //ROCK
                if(b.customId === 'Rock'){
                    if(choosen === 'rock'){
                        b.update({embeds: [new Discord.MessageEmbed()
                            .setDescription(`Both choosed Rock. Draw!`)
                            .setColor("YELLOW")
                        ], components: []})
                    }else if(choosen === 'paper'){
                        b.update({embeds: [new Discord.MessageEmbed()
                            .setDescription(`${client.user}: \`Paper\` \n${message.author}: \`Rock\` \n\n${client.user} won! 🎉`)
                            .setColor("RED")
                        ], components: []}) 
                    }else if(choosen === 'scissor'){
                        b.update({embeds: [new Discord.MessageEmbed()
                            .setDescription(`${client.user}: \`Scissor\` \n${message.author}: \`Rock\` \n\n${message.author} won! 🎉`)
                            .setColor("GREEN")
                        ], components: []})
                    }
                //PAPER
                }else if(b.customId === 'Paper'){
                    if(choosen === 'rock'){
                        b.update({embeds: [new Discord.MessageEmbed()
                            .setDescription(`${client.user}: \`Rock\` \n${message.author}: \`peper\` \n\n${message.author} won! 🎉`)
                            .setColor("GREEN")
                        ], components: []})
                    }else if(choosen === 'paper'){
                        b.update({embeds: [new Discord.MessageEmbed()
                            .setDescription(`Both choosed Paper. Draw!`)
                            .setColor("YELLOW")
                        ], components: []}) 
                    }else if(choosen === 'scissor'){
                        b.update({embeds: [new Discord.MessageEmbed()
                            .setDescription(`${client.user}: \`Scissor\` \n${message.author}: \`Paper\` \n\n${client.user} won! 🎉`)
                            .setColor("RED")
                        ], components: []})
                    }
                //SCISSOR
                }else if(b.customId === 'Scissor'){
                    if(choosen === 'paper'){
                        b.update({embeds: [new Discord.MessageEmbed()
                            .setDescription(`${client.user}: \`Paper\` \n${message.author} \`Scissor\` \n\n${message.author} won! 🎉`)
                            .setColor("GREEN")
                        ], components: []})
                    }else if(choosen === 'scissor'){
                        b.update({embeds: [new Discord.MessageEmbed()
                            .setDescription(`Both choosed Scissor. Draw!`)
                            .setColor("YELLOW")
                        ], components: []}) 
                    }else if(choosen === 'rock'){
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