const { SlashCommandBuilder, roleMention } = require('@discordjs/builders');
const wait = require('util').promisify(setTimeout);
const Discord = require('discord.js');
const { GuildChannel } = require('../../models');
const { errLog } = require('../../Functions/erroHandling');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('announce')
        .setDescription('Announce if a member Joined/Left server')
        .addStringOption(option =>
            option.setName("options")
            .setDescription("Options you would like to change.")
            .setRequired(true)
            .addChoice('join','joinedLog')
            .addChoice('leave','leftLog'))
        .addStringOption(option =>
            option.setName("value")
            .setDescription("Enable/Disable or set a custom message.")
            .setRequired(true)
            .addChoice('enable', 'enableLog')
            .addChoice('disable', 'disableLog')
            .addChoice('custom-message', 'customMessage'))
        .addChannelOption(option =>
            option.setName("channel")
            .setDescription('Announcement channel.'))
        .addStringOption(option =>
            option.setName("message")
            .setDescription('A custom message to greet/farewell members. separated by [ , ]')),
    permission: ["ADMINISTRATOR"],
    run: async(client, interaction) =>{
        const { options } = interaction;

        const logOption = options.getString('options');
        const value = options.getString('value');
        const channels = options.getChannel('channel');
        const customMessage = options.getString('message');

        const db = await GuildChannel.findOne({
            guildID: interaction.guild.id,
            Active: true,
        })

        if(db){
            async function saveToDatabase(option, channel, boolean){
                try {
                    let previousData = await GuildChannel.findOne({
                        guildID: interaction.guild.id,
                        Active: true,
                        [`Data.name`]: option
                    })

                    if(previousData){
                        await GuildChannel.findOneAndUpdate({
                            guildID: interaction.guild.id,
                            Active: true,
                            [`Data.name`]: option
                        },{
                            $pull: {
                               Data: {
                                   name: option
                               }
                            },
                        }, {upsert: true})
                    }
                    await GuildChannel.findOneAndUpdate({
                        guildID: interaction.guild.id,
                        Active: true,
                    },{
                        guildName: interaction.guild.name,
                        $push: {
                            [`Data`]: {
                                name: option,
                                channel: channel,
                                enabled: boolean,
                            }
                        }
                    },{
                        upsert: true,
                    })
                } catch (err) {
                    interaction.channel.send({embeds: [new Discord.MessageEmbed()
                        .setDescription(err.message)
                        .setColor("RED")
                    ]})
                    return console.log(err)
                }
            }

            if(logOption){
                if(value){
                    switch(value){
                        case 'enableLog':
                            if(channels){
                                saveToDatabase(logOption, channels, true).then(() =>{
                                    interaction.reply({embeds: [new Discord.MessageEmbed()
                                        .setDescription(`${logOption} set to ${channels}`)
                                        .setColor("GREEN")
                                    ]})
                                }).catch(err => {return console.log(err)})
                            }else {
                                interaction.reply({
                                    embeds: [new Discord.MessageEmbed()
                                        .setDescription("Please mention a channel")
                                        .setColor("RED")
                                    ], ephemeral: true
                                })
                            }
                        break;

                        case 'disableLog':
                            let ifExist = await GuildChannel.findOne({
                                guildID: interaction.guild.id,
                                Active: true,
                                [`Data.name`]: logOption
                            })

                            if(ifExist){
                                await GuildChannel.findOneAndUpdate({
                                    guildID: interaction.guild.id,
                                    Active: true,
                                    [`Data.name`]: logOption
                                }, {
                                    $pull: {
                                       Data: {
                                           name: logOption
                                       }
                                    }
                                    
                                }).then(() =>{
                                    interaction.reply({embeds: [
                                        new Discord.MessageEmbed()
                                            .setDescription(`${logOption} has been disabled.`)
                                            .setColor('GREEN')
                                    ]})
                                }).catch(err => {return console.log(err)})
                            }else {
                                interaction.reply({embeds: [
                                    new Discord.MessageEmbed()
                                        .setDescription("This log channel does not exist. Set up now by `/set-logchannel`")
                                        .setColor("RED")
                                ], ephemeral: true})
                            }
                        break;

                        case 'customMessage':
                            async function addCustomMsgToDB(option, Message){
                                await GuildChannel.findOneAndUpdate({
                                    guildID: interaction.guild.id,
                                    Active: true,
                                },{
                                    guildName: interaction.guild.name,
                                    $push: {
                                        [`customMessage.${option}`]: Message
                                    }
                                },{
                                    upsert: true,
                                })
                            }
                            if(customMessage){
                                try {
                                    let element = customMessage.split(/,\s+/)
                                    items = element.map(function (el) {
                                        return el.trim();
                                    });
                                    Arr = []
                                    items.forEach(async i => {
                                        Arr.push(i)
                                    });
                                }catch(err){
                                    interaction.reply({embeds: [
                                        new Discord.MessageEmbed()
                                            .setDescription(err.message)
                                            .setColor("RED")
                                    ]})
                                    return console.log(err)
                                }
                            }else {
                                interaction.reply({embeds: [
                                    new Discord.MessageEmbed()
                                        .setDescription('Please type the custom message properly. \nIf you want to add multiple custom message then separate each of them with [ , ]')
                                        .setColor("RED")
                                ]})
                            }
                            if(logOption == "joinedLog"){
                                addCustomMsgToDB("JoinedMsg", Arr).then(() => {
                                    interaction.reply({embeds: [
                                        new Discord.MessageEmbed()
                                            .setAuthor("Joined Message Added")
                                            .setDescription(Arr.toString())
                                            .setColor("GREEN")
                                    ]})
                                })
                            }else if(logOption == "leftLog"){
                                addCustomMsgToDB("LeftMsg", Arr).then(() => {
                                    interaction.reply({embeds: [
                                        new Discord.MessageEmbed()
                                            .setAuthor("Leave Message Added")
                                            .setDescription(Arr.toString())
                                            .setColor("GREEN")
                                    ]})
                                })
                            }
                        break;
                    }
                }
            }
        }
    }
}