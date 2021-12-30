const Discord = require('discord.js');
const { Guild, GuildRole } = require('../../models');
const { Permissions } = require('discord.js');
const ms = require('ms');
let TimeOut = new Map();

module.exports = {
    event: 'messageCreate',
    once: false,
    run: async(message, client) =>{
        if(message.channel.type == "DM"){
            if(message.author.id == client.user.id) return
            const guild = client.guilds.cache.get("874975341347762206")

            const channel = guild.channels.cache.get("920002339274891336")
    
            let attach

            if(message.attachments){
                attach = message.attachments.find(i => i.attachment)
            }
            if(channel){
                if(attach){
                    return channel.send({content: `${message.author} - ${message.author.tag} \n${message.content}`, files: [attach.attachment]} )
                    .catch(err => {return console.log(err.stack)}) 
                }
                channel.send({content: `${message.author} - ${message.author.tag} \n${message.content}`})
                .catch(err => {return console.log(err.stack)})
            }
        }else {
            return
        }
    }
}