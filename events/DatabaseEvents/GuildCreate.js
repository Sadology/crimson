const {LogsDatabase} = require('../../models');
const {UserRoleManager, GuildManager} = require('../../Functions');
const client = require('../../index');

client.on('guildCreate', async (guild) => {
    let GuildData = await new GuildManager(client).FetchGuild(guild)

    if(!GuildData) {
        new GuildManager(client).CreateGuildData(guild)
    }
})