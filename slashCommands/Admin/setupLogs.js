const { SlashCommandBuilder, roleMention } = require('@discordjs/builders');
const wait = require('util').promisify(setTimeout);
const Discord = require('discord.js');
const { GuildChannel } = require('../../models');
const { errLog } = require('../../Functions/erroHandling');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set-log-channel')
        .setDescription('Setup any log channels/mod roles.')
        .addStringOption(option =>
            option.setName("options")
            .setDescription("Options you would like to change.")
            .setRequired(true)
            .addChoice('action-log','actionLog')
            .addChoice('ban-log','banLog')
            .addChoice('message-log','messageLog')
            .addChoice('user-log','userLog')
            .addChoice('log-limit-alert','alertLog')
            .addChoice('story-log','myStoryLog'))
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
    permissions: ["ADMINISTRATOR", "MANAGE_GUILD"],
    botPermission: ["SEND_MESSAGES"],
    category: "Slash",
    run: async(client, interaction) =>{
        const { options } = interaction;

        const logOption = options.getString('options');
        const value = options.getString('value');
        const channels = options.getChannel('log-channel');

        async function fetchData() {
            const data = await GuildChannel.findOne({
                guildID: interaction.guild.id,
                Active: true
            })

            if(data){
                optionConfig()
            }else {
                return
            }
        }
        fetchData()

        function optionConfig() {
            if(!value) return interaction.reply({
                embeds: [
                    new Discord.MessageEmbed()
                    .setDescription("Please select a log option")
                    .setColor("RED")
                ], ephemeral: true
            })
            switch(value){
                case 'enableLog':
                    verifyChannel()
                    saveLog({DataType: logOption, Data: channels})
                break;
                case 'disableLog':
                    deleteData(logOption)
                break;
                case "information":
                    info()
                break;
            }
        }

        function verifyChannel() {
            if(!channels) return interaction.reply({
                embeds: [
                    new Discord.MessageEmbed()
                    .setDescription("please mention a channel")
                    .setColor("RED")
                ], ephemeral: true
            })
        }

        async function saveLog({DataType, Data}) {
            const items = {
                name: DataType,
                channel: Data,
            }

            let oldData = await GuildChannel.findOne({
                guildID: interaction.guild.id,
                Active: true,
                [`Data.name`]: DataType
            }).catch(err => {
                return console.log(err)
            })

            if(oldData){
                await GuildChannel.findOneAndUpdate({
                    guildID: interaction.guild.id,
                    Active: true,
                    [`Data.name`]: DataType
                },{
                    $pull: {
                       Data: {
                           name: DataType
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
                        ...items
                    }
                }
            },{
                upsert: true,
            })
            .then(() => {
                return interaction.reply({embeds: [
                    new Discord.MessageEmbed()
                        .setDescription(`**${DataType}** set to ${Data}`)
                        .setColor("GREEN")
                ]})
            })
            .catch(err => {
                return console.log (err)
            })
        }

        async function deleteData(DataType) {
            let fetchData = await GuildChannel.findOne({
                guildID: interaction.guild.id,
                Active: true,
                [`Data.name`]: DataType
            }).catch(err => {
                return console.log(err)
            })

            if(!fetchData){
                return interaction.reply({embeds: [
                    new Discord.MessageEmbed()
                        .setDescription("This log channel does not exist. Set up now by `/set-logchannel`")
                        .setColor("RED")
                ], ephemeral: true})
            }

            await GuildChannel.findOneAndUpdate({
                guildID: interaction.guild.id,
                Active: true,
                [`Data.name`]: DataType
            },{
                $pull: {
                   Data: {
                       name: DataType
                   }
                },
            })
            .then(() => {
                return interaction.reply({embeds: [
                    new Discord.MessageEmbed()
                        .setDescription(`${DataType} has been disabled.`)
                        .setColor('GREEN')
                ]})
            })
            .catch(err => {
                return console.log(err)
            })
        }

        async function info() {
            let ifLogChannel = await GuildChannel.findOne({
                guildID: interaction.guild.id,
                Active: true,
                [`Data.name`]: logOption
            })

            if(ifLogChannel){
                let data = ifLogChannel.Data.find(i => i.name == logOption) 
                return interaction.reply({
                    embeds: [new Discord.MessageEmbed()
                        .setAuthor("LogChannels", interaction.user.displayAvatarURL({dynamic: true, size: 1024, type: 'png'}))
                        .setDescription(`**${data.name}:** <#${data.channel}>`)
                        .setColor("WHITE")
                    ]
                })
            }else {
                return interaction.reply({embeds: [
                    new Discord.MessageEmbed()
                        .setDescription("This log channel does not exist. Set up now by `/set-logchannel`")
                        .setColor("RED")
                ], ephemeral: true})
            }
        }
    }
}