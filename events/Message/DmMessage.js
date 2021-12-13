const Discord = require('discord.js');
const { Guild, GuildRole } = require('../../models');
let config = require('../../config.json');
const { Permissions } = require('discord.js');
const ms = require('ms');
let TimeOut = new Map();

module.exports = {
    event: 'messageCreate',
    once: false,
    run: async(message, client) =>{
        if(message.channel.type == "DM"){
            const guild = client.guilds.cache.get("874975341347762206")

            const channel = guild.channels.cache.get("920002339274891336")
    
            if(channel){
                channel.send(`${message.author} - ${message.author.tag} \n${message.content}`)
            }
        }else {
            return
        }
    }
}