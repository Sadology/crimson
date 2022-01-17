const { MessageEmbed } = require('discord.js')
const moment = require('moment')
const ms = require('ms')
module.exports = {
    name: 'bot-info',
    aliases: ['botinfo'],
    description: "checks bot informations",
    permissions: ["SEND_MESSAGES"],
    botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
    usage: "bot-info",
    category: "Utils",
    cooldown: 3000,
    run: async(client, message, args,prefix) =>{
        const guilds = client.guilds.cache.size
        let totalmember = 0;

        client.guilds.cache.forEach(g => {
            totalmember += parseInt(g.memberCount);
        })

        let uptime = ms(client.uptime, {long: true})
        const Embeds = {
            author: {
                name: "Sadbot",
                icon_url: client.user.avatarURL({dynamic: false, size: 1024, type: 'png'})
            },
            fields: [
                {
                    name: "Version",
                    value: 'Beta v1.4.2',
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
                    name: "Uptime",
                    value: `${uptime}`,
                    inline: true
                },
                {
                    name: "Total users",
                    value: `${totalmember}`,
                    inline: true
                },
                {
                    name: "Creation Date",
                    value: `${moment(client.user.createdAt).format('MMMM Do YYYY')} - ${moment(client.user.createdAt, "YYYYMMDD").fromNow()}`.toString(),
                    inline: true
                },
                {
                    name: "Devs",
                    value: `shadow~#8363`,
                    inline: true
                },
            ],
            color: "WHITE",
            footer: {
                text: "Special thanks to Hyper bot dev Fluxpuck for the design idea"
            }
        }

        return message.channel.send({embeds: [Embeds]}).catch(err => {return console.log(err.stack)})
    }
}