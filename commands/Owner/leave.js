const Discord = require('discord.js');
const { GuildChannel } = require('../../models')
module.exports = {
    name: 'leave-guild',

    run: async(client, message, args,prefix) =>{
        
        if(message.author.id !== "571964900646191104"){
            return
        }

        const guildid = args[0]
        if(!guildid){
            return message.channel.send("Please specify a guild id")
        }

        client.guilds.cache.get(guildid).leave()
        .catch(err => {
            console.log(`there was an error leaving the guild: \n ${err.message}`);
        })
    }
}