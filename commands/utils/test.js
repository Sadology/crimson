const { saveData } = require('../../Functions/functions');
const Discord = require('discord.js');
module.exports = {
    name: 'test',
    description: 'ping pong',
    category: 'Utils',
    disabled: true,
    run: async(client, message, args)=> {
        let c = message.guild.channels.cache.get("874975341347762209")

        c.createWebhook("sadbot", {
            avatar: "https://i.ibb.co/86GB8LZ/images.jpg"
        })

        message.channel.send('ye')
    }
}