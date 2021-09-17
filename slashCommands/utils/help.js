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
                .addChoice('Utils', 'utilsType')),
    run: async(client, interation) =>{
        
        const {options, guild} = interation;
        const option = options.getString('category')

        let settings = await Guild.findOne({guildID: guild.id})

        const prefix = settings.prefix

        switch(option){
            case"modType":
                const Moderation = new Discord.MessageEmbed()
                .setAuthor(`Help Menu - Moderation`)
                .addFields(
                    {
                        name: "Mute", value: `/mute [ Member ] [ Duration ] [ Reason ]`.toString()
                    },
                    {
                        name: "Unmute", value: `/unmute [ Member ]`.toString()
                    },
                    {
                        name: "Warn", value: `${prefix}warn [ Member ] [ Reason ] *Not available in slash command yet*`.toString()
                    },
                    {
                        name: "Fetch", value: `/fetch [ Member ]`.toString()
                    },
                    {
                        name: "Logs", value: `${prefix}logs [ Member ] *Not available in slash command yet*`.toString()
                    },
                    {
                        name: "Ban", value: `${prefix}ban [ Member ] [ Reason ] *Not available in slash command yet*`.toString()
                    },
                    {
                        name: "Kick", value: `${prefix}kick [ Member ] [ Reason ] *Not available in slash command yet*`.toString()
                    },
                    {
                        name: "Purge", value: `/purge [ Amount ] [ Member ]`.toString()
                    },
                    {
                        name: "Clean", value: `${prefix}clean [ amount ] *Not available in slash command yet*`.toString()
                    },
                    {
                        name: "Lock", value: `${prefix}lock [ channel ] *Not available in slash command yet*`.toString()
                    },
                    {
                        name: "Unock", value: `${prefix}unlock [ channel ] *Not available in slash command yet*`.toString()
                    },
                    {
                        name: "Slowmode", value: `${prefix}sm [ interval ] *Not available in slash command yet*`.toString()
                    },
                )
                .setFooter("Commands with slash(/) no longer avaiable in prefix command")
                .setColor("#fffafa")
                interation.reply({embeds: [Moderation]})
            break;
            case "adminType":
                const Admin = {
                    author: {
                        name: `Help Menu - Administraton`
                    },
                    fields: [
                        {
                            name: "Moderator", value: `${prefix}moderator [ enable | Disable ] [ Role(s) ]`.toString()
                        },
                        {
                            name: "Overseer", value: `${prefix}overseer [ enable | Disable ] [ Role(s) ]`.toString()
                        },
                        {
                            name: "Admin-Log", value: `${prefix}Admin-log [ option ]`.toString()
                        },
                        {
                            name: "Action-Log", value: `${prefix}action-log [ enable | Disable ] [ channel ]`.toString()
                        },
                        {
                            name: "Message-Log", value: `${prefix}message-log [ enable | Disable ] [ edit | delete | default ] [ channel ]`.toString()
                        },
                        {
                            name: "Message-Ignore", value: `${prefix}message-ignore [ add | Dremove ] [ channel | role ] [ Channels | roles ]`.toString()
                        },
                        {
                            name: "Announce", value: `${prefix}announce [ enable | Disable ] [ joined | left ] [ channel ]`.toString()
                        },
                        {
                            name: "Ban-Log", value: `${prefix}ban-log [ enable | Disable ] [ channel ]`.toString()
                        },
                        {
                            name: "Status-Log", value: `${prefix}status-log [ enable | Disable ] [ channel ]`.toString()
                        },
                        {
                            name: "User-Log", value: `${prefix}user-log [ enable | Disable ] [ channel ]`.toString()
                        },
                        {
                            name: "Roles-Log", value: `${prefix}roles-log [ enable | Disable ] [ channel ]`.toString()
                        },
                        {
                            name: "Delete-log", value: `${prefix}delete-log [ Log-ID ]`.toString()
                        },
                        {
                            name: "Reset-Log", value: `${prefix}reset-log [ enable | Disable ] [ channel ]`.toString()
                        },
                    ],
                    color: "#fffafa",
                    footer: {
                        text: "No commands available in slash yet"
                    }
                }

                interation.reply({embeds: [Admin]})
            break;
            case "funType":
                const FunType = new Discord.MessageEmbed()
                .setAuthor(`Help Menu - Fun`)
                .addFields(
                    {
                        name: "8ball", value: `${prefix}8ball [ message ]`.toString()
                    },
                    {
                        name: "Findgf/Findbf", value: `${prefix}findgf`.toString()
                    },
                )
                .setColor("#fffafa")
                interation.reply({embeds: [FunType]})

            break;
            case "utilsType":
                const UtilityType = new Discord.MessageEmbed()
                    .setAuthor(`Help Menu - Administraton`)
                    .addFields(
                        {
                            name: "Ping", value: `/ping`
                        },
                        {
                            name: "Server", value: `${prefix}server [ info | roles ]`.toString()
                        },
                        {
                            name: "Avatar", value: `/avatar [ Member ]`.toString()
                        },
                    )
                    .setColor("#fffafa")
                    interation.reply({embeds: [UtilityType]})
            break;
            default:
                const Menu = new Discord.MessageEmbed()
                .setAuthor(`${client.user.username} - Help Menu `, interation.user.displayAvatarURL({dynamic: false, size: 1024, type: "png"}))
                .addFields(
                    {
                        name: "Moderation", value: "Moderation type command such as mute, kick, ban".toString()
                    },
                    {
                        name: "Administration", value: "Administration type commands".toString()
                    },
                    {
                        name: "Fun", value: "Funny commands to have fun with friend".toString()
                    },
                    {
                        name: "Utils", value: "Utility type commands".toString()
                    }
                )
                .setColor("#fffafa")
            interation.reply({embeds: [Menu]})
        }
    }
}