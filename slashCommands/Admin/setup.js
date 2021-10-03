const { SlashCommandBuilder, roleMention } = require('@discordjs/builders');
const wait = require('util').promisify(setTimeout);
const Discord = require('discord.js');
const { GuildChannel } = require('../../models');
const { errLog } = require('../../Functions/erroHandling');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set-logchannels')
        .setDescription('Setup any log channels/mod roles.')
        .addStringOption(option =>
            option.setName("options")
            .setDescription("Options you would like to change.")
            .setRequired(true)
            .addChoice('action-log','actionLog')
            .addChoice('ban-log','banLog')
            .addChoice('message-log','messageLog')
            .addChoice('roles-log','rolesLog')
            .addChoice('status-log','statusLog')
            .addChoice('user-log','userLog'))
        .addStringOption(option =>
            option.setName("value")
            .setDescription("Enable/disable or reset a log channel.")
            .setRequired(true)
            .addChoice('enable', 'enableLog')
            .addChoice('disable', 'disableLog')
            .addChoice('info', 'information'))
        .addChannelOption(option =>
            option.setName("log-channel")
            .setDescription('Selected log option will log into the selected channel')),
    permission: ["ADMINISTRATOR"],
    run: async(client, interaction) =>{
        const { options } = interaction;

        const logOption = options.getString('options');
        const value = options.getString('value');
        const channels = options.getChannel('log-channel');

        const db = await GuildChannel.findOne({
            guildID: interaction.guild.id,
            Active: true,
        })

        if(db){
            async function saveToDatabase(option, channel, boolean){
                try {
                    await GuildChannel.findOneAndUpdate({
                        guildID: interaction.guild.id,
                        Active: true
                    },{
                        guildName: interaction.guild.name,
                        $push: {
                            [`Data`]: {
                                name: option,
                                channel: channel,
                                enabled: boolean 
                            }
                        }
                    },{
                        upsert: true,
                    })
                } catch (err) {
                    console.log(err)
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
                                }).catch(err => console.log(err))
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
                                }).catch(err => console.log(err))
                            }else {
                                interaction.reply({embeds: [
                                    new Discord.MessageEmbed()
                                        .setDescription("This log channel does not exist. Set up now by `/set-logchannel`")
                                        .setColor("RED")
                                ], ephemeral: true})
                            }
                        break;

                        case 'information':
                            let ifLogChannel = await GuildChannel.findOne({
                                guildID: interaction.guild.id,
                                Active: true,
                                [`Data.name`]: logOption
                            })

                            if(ifLogChannel){
                                let data = ifLogChannel.Data.find(i => i.name == logOption) 
                                interaction.reply({
                                    embeds: [new Discord.MessageEmbed()
                                        .setAuthor("LogChannels", interaction.user.displayAvatarURL({dynamic: true, size: 1024, type: 'png'}))
                                        .setDescription(`${data.name}: <#${data.channel}>\nEnabled: ${data.enabled}`)
                                        .setColor("WHITE")
                                    ]
                                })
                            }else {
                                interaction.reply({embeds: [
                                    new Discord.MessageEmbed()
                                        .setDescription("This log channel does not exist. Set up now by `/set-logchannel`")
                                        .setColor("RED")
                                ], ephemeral: true})
                            }
                    }
                }
            }
        }
    }
}