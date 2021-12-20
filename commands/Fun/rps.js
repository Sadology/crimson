const Discord = require('discord.js');
const { MessageActionRow, MessageButton } = require('discord.js');
const { Member } = require('../../Functions')
let players = new Map()
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

        if(args[0]){
            playerSearch()
        }else {
            singlePlayer()
        }
        function playerSearch(){
            if(players.has(message.author.id)){
                return message.channel.send("You're already in a game")
            }else {
                let member = new Member(message, client).getMemberWithoutErrHandle({member: args[0]})
                if(member == false) return
    
                let obj = {
                    playerOne: message.author.id,
                    playerTwo: member.user.id,
                    playerOneCollected: false,
                    playerTwoCollected: false,
                    playerOneChoice: null,
                    playerTwoChoice: null,
                }
                players.set(message.author.id, obj)
    
                gameLobby(member, obj)
            }
        }
        function gameLobby(member, data){
            let items = players.get(message.author.id)
            const filter = m => m.user.id == items.playerOne || m.user.id == items.playerTwo
            message.channel.send({content: `${message.author} Vs ${member}`,embeds: [new Discord.MessageEmbed()
                .setAuthor("Rock! Paper! Scissor!")
                .setDescription("Both make a choice within 30 seconds")
                .setColor("WHITE")
            ], components: [row]}).then(msg =>{
                const collector = msg.createMessageComponentCollector({filter, componentType: "BUTTON", time: 1000 * 30 });
                collector.on('collect', async(b) => {
                    // PLAYER ONE
                    if(b.user.id == message.author.id){
                        if(items.playerOneCollected === true) return b.reply({embeds: [new Discord.MessageEmbed()
                            .setDescription("You can't change your choice")
                            .setColor("RED")], ephemeral: true
                        })
                        data.playerOneCollected = true
                        data.playerOneChoice = b.customId.toLowerCase()
                        players.set(message.guild.id, data)

                        b.reply({embeds: [new Discord.MessageEmbed()
                            .setDescription("Nice choice, now wait for result")
                            .setColor("GREEN")], ephemeral: true
                        })
                    }

                    //PLAYER TWO
                    if(b.user.id == member.user.id){
                        if(items.playerTwoCollected === true) return b.reply({embeds: [new Discord.MessageEmbed()
                            .setDescription("You can't change your choice")
                            .setColor("RED")], ephemeral: true
                        })
                        data.playerTwoCollected = true
                        data.playerTwoChoice = b.customId.toLowerCase()
                        players.set(message.guild.id, data)
                        b.reply({embeds: [new Discord.MessageEmbed()
                            .setDescription("Nice choice, now wait for result")
                            .setColor("GREEN")], ephemeral: true
                        })
                    }
                    if(items.playerOneCollected == true && items.playerTwoCollected == true){
                        row.components[0].setDisabled(true)
                        row.components[1].setDisabled(true)
                        row.components[2].setDisabled(true)
                        result(member,msg)
                        collector.stop()
                    }
                })

                collector.on('end', async() => {
                    row.components[0].setDisabled(true)
                    row.components[1].setDisabled(true)
                    row.components[2].setDisabled(true)
                    await msg.edit({components: [row]})
                    players.delete(message.author.id)
                })
            })
        }

        async function result(member, msg){
            let items = players.get(message.author.id)
            row.components[0].setDisabled(true)
            row.components[1].setDisabled(true)
            row.components[2].setDisabled(true)

            let Embed = new Discord.MessageEmbed()
                .setAuthor("Rock! Paper! Scissor!")
                .setDescription(`Both choice were ${items.playerOneChoice}, so its a draw`)
                .setColor("YELLOW")

            let playerOneWon = new Discord.MessageEmbed()
                .setAuthor("Rock! Paper! Scissor!")
                .setDescription(`${message.author}: ${items.playerOneChoice}\n${member}: ${items.playerTwoChoice}\n\n ${message.author} Won 🎉`)
                .setColor("GREEN")

            let playerTwoWon = new Discord.MessageEmbed()
                .setAuthor("Rock! Paper! Scissor!")
                .setDescription(`${message.author}: ${items.playerOneChoice}\n${member}: ${items.playerTwoChoice}\n\n ${member} Won 🎊`)
                .setColor("RED")

            if(items.playerOneChoice == items.playerTwoChoice){
                await msg.edit({embeds: [Embed]})
            }else if(items.playerOneChoice == 'rock'){
                switch(items.playerTwoChoice){
                    case 'paper':
                        await msg.edit({content: `${member} GG`,embeds: [playerTwoWon], components: [row]}).catch(err => {return console.log(err.stack) && players.delete(message.author.id)})
                    break;
                    case 'scissor':
                        await msg.edit({content: `${message.author} GG`, embeds: [playerOneWon], components: [row]}).catch(err => {return console.log(err.stack) && players.delete(message.author.id)})
                    break;
                }
            }else if(items.playerOneChoice == 'paper'){
                switch(items.playerTwoChoice){
                    case 'scissor':
                        await msg.edit({content: `${member} GG`, embeds: [playerTwoWon], components: [row]}).catch(err => {return console.log(err.stack) && players.delete(message.author.id)})
                    break;
                    case 'rock':
                        await msg.edit({content: `${message.author} GG`, embeds: [playerOneWon], components: [row]}).catch(err => {return console.log(err.stack) && players.delete(message.author.id)})
                    break;
                }
            }else if(items.playerOneChoice == 'scissor'){
                switch(items.playerTwoChoice){
                    case 'rock':
                        await msg.edit({content: `${member} GG`, embeds: [playerTwoWon], components: [row]}).catch(err => {return console.log(err.stack) && players.delete(message.author.id)})
                    break;
                    case 'paper':
                        await msg.edit({content: `${message.author} GG`, embeds: [playerOneWon], components: [row]}).catch(err => {return console.log(err.stack) && players.delete(message.author.id)})
                    break;
                }
            }
            players.delete(message.author.id)
        }

        function singlePlayer(){
            const choice = [ 'rock', 'paper', 'scissor' ]
            const chosen = choice[Math.floor(Math.random() * choice.length)]

            message.channel.send({embeds: [new Discord.MessageEmbed()
                .setAuthor(message.author.tag, message.author.displayAvatarURL({dynamic: false, type: 'png'}))
                .setDescription("Make a choice within within 10 seconds")
                .setColor("WHITE")
            ], components: [row]}).then(msg =>{
                const filter = (button) => button.clicker.user.id === message.author.id

                const collector = msg.createMessageComponentCollector(filter, { time: 1000 * 10, errors: ['time'] });

                collector.on('collect', (b) =>{
                    //ROCK
                    if(b.customId === 'Rock'){
                        if(chosen === 'rock'){
                            b.update({embeds: [new Discord.MessageEmbed()
                                .setDescription(`Both choice were Rock. Draw!`)
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
                                .setDescription(`Both choice were Paper. Draw!`)
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
                                .setDescription(`Both choice were Scissor. Draw!`)
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

                collector.on('end', async() =>{
                    row.components[0].setDisabled(true)
                    row.components[1].setDisabled(true)
                    row.components[2].setDisabled(true)
                    await msg.edit({components: [row]})
                })
            })
        }
    }
}