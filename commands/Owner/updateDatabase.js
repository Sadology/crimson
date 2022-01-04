const { GuildManager } = require('../../Functions')
module.exports = {
    name: 'update-db-logs',
    category: "Owner",
    run: async(client, message, args,prefix) =>{
        if(message.author.id !== "571964900646191104"){
            return
        }

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
}