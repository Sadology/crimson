const { GuildManager } = require('../Functions');
const Discord = require('discord.js');

module.exports = async client =>{
    client.on('guildCreate', async guild => {
        const guildCreate = new GuildManager(client, guild)
        guildCreate.guildCreate();
        guildCreate.setGuildChannels();
        guildCreate.setGuildRoles();
        guildCreate.CommandUpdate();
        guildCreate.ModuleUpdate();
        guildCreate.slashUpdate();
        guildCreate.setupRanks();
    });

    client.guilds.cache.forEach(async (guild) =>{
        const GuildDataCheck = async () =>{
            let data = new GuildManager(client, guild)
            data.guildCreate();
            data.setGuildChannels();
            data.setGuildRoles();
            data.CommandUpdate();
            data.ModuleUpdate();
            data.slashUpdate();
            data.setupRanks();
            data.deleteJunk()

            setTimeout(GuildDataCheck, 1000 * 60 * 30) 
        }
        GuildDataCheck()
    })
}

