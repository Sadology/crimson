const Discord = require('discord.js');

module.exports = {
    name: 'ping',
    description: "Ping! Pong!. Check bots ping",
    permissions: ["SEND_MESSAGES"],
    botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
    usage: "ping",
    category: "Utils",
    cooldown: 3000,
    run: async(client, message, args)=> {
        await message.channel.send({content: "Pinging..."
        }).then(async (m) =>{
            let Ping = m.createdTimestamp - message.createdTimestamp
            await m.edit({content: `Pong \`${Ping}\``})
        })
    }
}