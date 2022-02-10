const { GuildManager } = require('../Functions');
const Discord = require('discord.js');

module.exports = async client =>{
    client.on('guildCreate', async guild => {
        const guildCreate = new GuildManager(client)
        guildCreate.guildCreate(guild);
    });

    const GuildDataCheck = async () =>{
        let data = new GuildManager(client)
        data.guildUpdate();
        data.setGuildChannels();
        data.setGuildRoles();
        data.deleteJunk()

        setTimeout(GuildDataCheck, 1000 * 60 * 60)
    }
    GuildDataCheck()
}

