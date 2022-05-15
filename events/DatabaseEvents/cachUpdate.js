const {GuildManager} = require('../../Functions');
const { CacheManager } = require('../../Functions/CacheManager');
const { Guild } = require('../../models');

module.exports = {
    event: 'cacheUpdate',
    run: async(client, type, guild, user) => {
        switch(type){
            case 'guild':
                let data = await Guild.findOne({
                    guildID: guild.id
                })

                let cachedData = new CacheManager(client).CreateCache(guild.id, data);
            break;

            case 'user':

            break;
        }
    }
};