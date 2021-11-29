const { MessageEmbed } = require('discord.js')

module.exports = {
    name: 'help',

    run: async(client, message, args,prefix) =>{
        message.channel.send("Moved to /help. /help [ category ] to access")
    }
}