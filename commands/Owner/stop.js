const Discord = require('discord.js');
const { GuildChannel } = require('../../models')
module.exports = {
    name: 'force-stop-client',

    run: async(client, message, args,prefix) =>{
        
        if(message.author.id !== "571964900646191104"){
            return
        }

        await message.channel.send("Good bye master");
        client.destroy();
    }
}