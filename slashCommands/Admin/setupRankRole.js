const { SlashCommandBuilder } = require('@discordjs/builders');
const wait = require('util').promisify(setTimeout);
const Discord = require('discord.js');
const { Guild } = require('../../models');
const rankMap = new Map();
module.exports = {
    data: new SlashCommandBuilder()
        .setName('rank-reward')
        .setDescription('Prefix of the bot in the server')
        .addStringOption(option => 
            option.setName('option')
            .setRequired(true)
            .setDescription('set/remove or check the list of role rewards')
            .addChoice("set", "setLvl")
            .addChoice("remove", "rmLvl")
            .addChoice("list", "lvlList"))
        .addIntegerOption(option =>
            option.setName('level')
            .setDescription('Level you want to give role')
        )
        .addRoleOption(option =>
            option.setName('role')
            .setDescription('The role you want to give at specific role')),
    permissions: ["ADMINISTRATOR", "MANAGE_GUILD"],
    botPermission: ["SEND_MESSAGES"],
    category: "Slash",
    run: async(client, interaction) =>{
        const { options } = interaction
        const val = options.getString('option')
        const level = options.getInteger('level')
        const role = options.getRole('role')

        switch(val){
            case 'setLvl':
                setData(level, role)
            break;
            case 'rmLvl':
                rmData(level)
            break;
            case 'lvlList':
                list()
            break;
        }
        
        function setData(level, role){
            if(!level){
                return interaction.reply({
                    embeds: [new Discord.MessageEmbed()
                        .setDescription("You can't add a role without level")
                        .setColor("RED")
                ]}).catch(err => {return console.log(err.stack)})
            }
            if(level < 0){
                return interaction.reply({
                    embeds: [new Discord.MessageEmbed()
                        .setDescription("You can't set role rewards below level 0")
                        .setColor("RED")
                ]}).catch(err => {return console.log(err.stack)})
            }else if(level > 100){
                return interaction.reply({
                    embeds: [new Discord.MessageEmbed()
                        .setDescription("You can't set role rewards above level 100 (for now)")
                        .setColor("RED")
                ]}).catch(err => {return console.log(err.stack)})
            }
            if(!role){
                return interaction.reply({
                    embeds: [new Discord.MessageEmbed()
                        .setDescription("Mention the role you want to give as rank reward")
                        .setColor("RED")
                ]}).catch(err => {return console.log(err.stack)})
            }

            fetchData(level, role)
        }
        async function fetchData(level, role){
            await Guild.findOne({
                guildID: interaction.guild.id
            })
            .then(async res => {
                if(res){
                    let data = res.Roles
                    if(!data){
                        rankMap.set(level.toString(), role.id)

                        return saveData(rankMap)
                    }
                    let exist = data.get(level.toString())

                    if(!exist){
                        data.set(level.toString(), role.id)

                        return saveData(data)
                    }else if(exist){
                        data.delete(level.toString())
                        data.set(level.toString(), role.id)

                        return saveData(data)
                    }

                    async function saveData(data){
                        await Guild.updateOne({
                            guildID: interaction.guild.id
                        }, {
                            $set: {
                                'Roles': data
                            }
                            
                        }).then(res => {
                            return interaction.reply({
                                embeds: [new Discord.MessageEmbed()
                                    .setDescription(`Level ${level} set to ${role}`)
                                    .setColor("GREEN")
                                ]
                            })
                        })
                        .catch(err => {return console.log(err.stack)})
                    }
                }
            }).catch(err => {return console.log(err.stack)})
        }

        async function rmData(level){
            await Guild.findOne({
                guildID: interaction.guild.id
            })
            .then(async res => {
                if(res){
                    let data = res.Roles
                    if(!data){
                        return interaction.reply({
                            embeds: [new Discord.MessageEmbed()
                                .setDescription(`Level ${level} haven't setup yet`)
                                .setColor("GREEN")
                            ]
                        })
                    }

                    let exist = data.get(level.toString())
                    if(!exist){
                        return interaction.reply({
                            embeds: [new Discord.MessageEmbed()
                                .setDescription(`Level ${level} haven't setup yet`)
                                .setColor("GREEN")
                            ]
                        })
                    }else if(exist){
                        data.delete(level.toString())
                        deleteData(data)
                    }
                    
                    async function deleteData(data){
                        await Guild.updateOne({
                            guildID: interaction.guild.id
                        }, {
                            $set: {
                                'Roles': data
                            }
                            
                        }).then(res => {
                            return interaction.reply({
                                embeds: [new Discord.MessageEmbed()
                                    .setDescription(`Level ${level} set to`)
                                    .setColor("GREEN")
                                ]
                            })
                        })
                        .catch(err => {return console.log(err.stack)})
                    }
                }
            }).catch(err => {return console.log(err.stack)})
        }

        async function list(){
            Guild.findOne({
                guildID: interaction.guild.id,
            }).then(res => {
                if(!res.Roles){
                    return interaction.channel.send({
                        embeds: [new Discord.MessageEmbed()
                            .setDescription("No rank rewards setup found.")
                            .setColor("RED")
                        ]
                    })
                }
                let arr = []
                for(let [key, value] of res.Roles.entries()){
                    arr.push(`Level ${key} \` ⇀ \` <@&${value}>`)
                }

                interaction.reply({embeds: [
                    new Discord.MessageEmbed()
                        .setAuthor(interaction.guild.name + " Rank Rewards", interaction.guild.iconURL())
                        .setDescription(arr.join(' \n'))
                        .setColor("WHITE")
                ]}).catch(err => {return console.log(err.stack)})
            }).catch(err => {return console.log(err.stack)})
        }
    }
}