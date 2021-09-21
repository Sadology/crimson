const { SlashCommandBuilder } = require('@discordjs/builders');
const wait = require('util').promisify(setTimeout);
const Discord = require('discord.js');
const { errLog } = require('../../Functions/erroHandling');
const { Guild } = require('../../models')
const moment = require('moment');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('All helpful commands of the bot')
        .addStringOption(option =>
            option.setName('category')
                .setDescription('Find commands you want in different category')
                .addChoice('Moderation', 'modType')
                .addChoice('Administration', 'adminType')
                .addChoice('Fun', 'funType')
                .addChoice('Utils', 'utilsType'))
        .addStringOption(option =>
            option.setName('command-name')
                .setDescription('Help of individual commands')),
    run: async(client, interaction) =>{
        const {options, guild} = interaction;
        const option = options.getString('category')
        const cmdName = options.getString('command-name')
        let settings = await Guild.findOne({guildID: guild.id})

        const prefix = settings.prefix

        if(option){
            switch(option){
                case"modType":
                    let modEmbed = new Discord.MessageEmbed()
                        .setDescription(`**${client.user.username}'s Help Menu** - Moderation`)
                        .setColor('#fffafa')
                        client.commands.forEach(cmds =>{
                            if(cmds.category && cmds.category == "Moderation"){
                                if(cmds.name){
                                    modEmbed.addField(`${cmds.name}`, `**Alias:** \`${cmds.aliases ? cmds.aliases : "No Aliases"}\`\n**Usage:** \`${prefix}${cmds.usage ? cmds.usage : "No data found"}\``.toString())
                                }
                            }
                        })
                    return interaction.reply({
                        embeds: [modEmbed]
                    })
                break;
    
                case "adminType":
                    let adminEmbed = new Discord.MessageEmbed()
                        .setDescription(`**${client.user.username}'s Help Menu** - Administration`)
                        .setColor('#fffafa')
                        client.commands.forEach(cmds =>{
                            if(cmds.category && cmds.category == "Administrator"){
                                if(cmds.name){
                                    adminEmbed.addField(`${cmds.name}`, `**Alias:** \`${cmds.aliases ? cmds.aliases : "No Aliases"}\`\n**Usage:** \`${prefix}${cmds.usage ? cmds.usage : "No data found"}\``.toString())
                                }
                            }
                        })
                    return interaction.reply({
                        embeds: [adminEmbed]
                    })
                break;
    
                case "funType":
                    let funEmbed = new Discord.MessageEmbed()
                        .setDescription(`**${client.user.username}'s Help Menu** - Fun`)
                        .setColor('#fffafa')
                        client.commands.forEach(cmds =>{
                            if(cmds.category && cmds.category == "Fun"){
                                if(cmds.name){
                                    funEmbed.addField(`${cmds.name}`, `**Alias:** \`${cmds.aliases ? cmds.aliases : "No Aliases"}\`\n**Usage:** \`${prefix}${cmds.usage ? cmds.usage : "No data found"}\``.toString())
                                }
                            }
                        })
                    return interaction.reply({
                        embeds: [funEmbed]
                    })
    
                break;
    
                case "utilsType":
                    let utilsEmbed = new Discord.MessageEmbed()
                        .setDescription(`**${client.user.username}'s Help Menu** - Utils`)
                        .setColor('#fffafa')
                        client.commands.forEach(cmds =>{
                            if(cmds.category && cmds.category == "Utils"){
                                if(cmds.name){
                                    utilsEmbed.addField(`${cmds.name}`, `**Alias:** \`${cmds.aliases ? cmds.aliases : "No Aliases"}\`\n**Usage:** \`${prefix}${cmds.usage ? cmds.usage : "No data found"}\``.toString())
                                }
                            }
                        })
                    return interaction.reply({
                        embeds: [utilsEmbed]
                    })
                break;
    
                default:
                    const Menu = new Discord.MessageEmbed()
                    .setAuthor(`${client.user.username} - Help Menu `, interaction.user.displayAvatarURL({dynamic: false, size: 1024, type: "png"}))
                    .addFields(
                        {
                            name: "Moderation", value: "Moderation type commands.".toString()
                        },
                        {
                            name: "Administration", value: "Administration type commands".toString()
                        },
                        {
                            name: "Fun", value: "Funny commands to have fun with friends.".toString()
                        },
                        {
                            name: "Utils", value: "Utility type commands.".toString()
                        }
                    )
                    .setColor("#fffafa")
                    interaction.reply({embeds: [Menu]})
                break;
            }
        }else if(cmdName){
            client.commands.forEach(commands =>{
                if(cmdName == commands.name){
                    let name = commands.name ? commands.name : "Not found";
                    let desc = commands.description ?commands.description : "No descriptions avaiable :(";
                    let alias = commands.aliases ? client.commands.aliease : "None";
                    let perms = commands.permissions ? commands.permissions : "None";
                    let usage = commands.usage ? commands.usage : "None";
                    let categ = commands.category ? commands.category : "None";

                    let commandEmbed = new Discord.MessageEmbed()
                    .setAuthor(`Command - ${name}`)
                    .setDescription(`\`\`\`${desc}\`\`\``)
                    .addField("Aliases", `\`\`\`${alias}\`\`\``.toString(), true)
                    .addField("Category", `\`\`\`${categ}\`\`\``.toString(), true)
                    .addField("Usage", `\`\`\`${prefix}${usage}\`\`\``.toString(), true)
                    .addField("Permissions", `\`\`\`${perms}\`\`\``.toString(), true)
                    .setColor('#fffafa')
                    interaction.reply({embeds: [commandEmbed]})
                }else {
                    return
                }
            })
        }else {
            interaction.reply("Try again")
        }
    }
}