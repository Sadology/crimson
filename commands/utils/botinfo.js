const { MessageEmbed } = require('discord.js')
const moment = require('moment')
module.exports = {
    name: 'bot-info',
    aliases: ['botinfo'],
    description: "checks bot informations",
    permissions: ["SEND_MESSAGES"],
    usage: "bot-info",
    category: "Utils",
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
                    value: 'Beta v1',
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
                    name: "Made By",
                    value: 'Vhera Inc',
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
            ],
            color: "WHITE"
        }

        return message.channel.send({embeds: [Embeds]})
    }
}