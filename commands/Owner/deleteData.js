const Discord = require('discord.js');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const { Guild } = require('../../models');
module.exports = {
    name: 'rest-data-db',
    show: true,
    run: async(client, message, args,prefix) =>{
        if(message.author.id !== "571964900646191104"){
            return
        }

        client.guilds.cache.forEach(async g => {
            await Guild.findOneAndUpdate({
                guildID: g.id
            }, {
                $unset:{
                    Commands: "",
                    Modules: ""
                }
            })
        })
        
    }
}