const Discord = require('discord.js');
const { Guild } = require('../../models');
module.exports = {
    event: 'ready',
    once: false,
    run: async(client) =>{
        // client.guilds.cache.forEach(async g => {
        //     if(!client.GUILDS.has(g.id)){
        //       client.GUILDS.set(g.id, new Discord.Collection())
        //     }

        //     let guildSet = client.GUILDS.get(g.id)

        //     await Guild.findOne({
        //         guildID: g.id
        //     }).then((res) => {
        //         for(const [key, value] of Object.entries(res._doc)){
        //             guildSet.set(key, value)
        //         }
        //     })
        // })
    }
}