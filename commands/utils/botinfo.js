const { MessageEmbed } = require('discord.js')
const moment = require('moment')
module.exports = {
    name: 'bot-info',
    aliases: ['botinfo'],
    description: "checks bot informations",
    permissions: ["SEND_MESSAGES"],
    botPermission: ["SEND_MESSAGES"],
    usage: "bot-info",
    category: "Utils",
    cooldown: 3000,
    run: async(client, message, args,prefix) =>{
        const guilds = client.guilds.cache.size

        const Embeds = {
            author: {
                name: "Sadbot",
                icon_url: client.user.avatarURL({dynamic: false, size: 1024, type: 'png'})
            },
            fields: [
                {
                    name: "Version",
                    value: 'Beta v1.3.2',
                    inline: true
                },
                {
                    name: "Discord Version",
                    value: 'v13',
                    inline: true
                },
                {
                    name: "Node Version",
                    value: 'v17',
                    inline: true
                },
                {
                    name: "Total Guild",
                    value: `${guilds}`.toString(),
                    inline: true
                },
                {
                    name: "Creation Date",
                    value: `${moment(client.user.createdAt).format('MMMM Do YYYY')} - ${moment(client.user.createdAt, "YYYYMMDD").fromNow()}`.toString(),
                    inline: true
                },
                {
                    name: "Devs",
                    value: `<@571964900646191104>`,
                    inline: true
                },
            ],
            color: "WHITE",
            footer: {
                text: "Special thanks to Hyper bot dev Fluxpuck for the design idea"
            }
        }

        return message.channel.send({embeds: [Embeds]})
    }
}