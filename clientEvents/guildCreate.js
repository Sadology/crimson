const { Guild, GuildRole, GuildChannel } = require('../models')
const { default_prefix } = require('../config.json')
module.exports = async client =>{
    class GuildManager{
        constructor(){
        }
        async GuildData(guild){
            await Guild.findOneAndUpdate({
                guildID: guild.id.Active,
            }, {
                guildName: guild.name,
                Active: true,
                prefix: ">",
                ownerID: guild.ownerId,
            }, {upsert: true})
            .catch(err => {return console.log(err)})
        }

        async GuildChannels(guild){
            await GuildChannel.findOneAndUpdate({
                guildID: guild.id
            }, {
                guildName: guild.name,
                Active: true
            }, {upsert: true})
            .catch(err => {return console.log(err)})
        }

        async GuildRoles(guild){
            await GuildRole.findOneAndUpdate({
                guildID: guild.id
            }, {
                guildName: guild.name,
                Active: true
            }, {upsert: true})
            .catch(err => {return console.log(err.stack)})
        }
    }

    const GuildCreate = new GuildManager()

    client.on('guildCreate', async guild => {
        await Guild.findOne({guildID: guild.id})
        .then((res) =>{
            if(!res){
                GuildCreate.GuildData(guild)
            }
        })
        .catch(err => {return console.log(err.stack)});

        await GuildChannel.findOne({guildID: guild.id})
        .then((res) =>{
            if(!res){
                GuildCreate.GuildChannels(guild)
            }
        })
        .catch(err => {return console.log(err.stack)});

        await GuildRole.findOne({guildID: guild.id})
        .then((res) =>{
            if(!res){
                GuildCreate.GuildRoles(guild)
            }
        })
        .catch(err => {return console.log(err.stack)});
    });

    client.guilds.cache.forEach(async (guild) =>{
        const GuildDataCheck = async () =>{
            await Guild.findOne({guildID: guild.id})
            .then(async(res) =>{
                if(!res){
                    GuildCreate.GuildData(guild) 
                }
            })
            .catch(err => {return console.log(err.stack)});
    
            await GuildChannel.findOne({guildID: guild.id})
            .then((res) =>{
                if(!res){
                    GuildCreate.GuildChannels(guild)
                }
            })
            .catch(err => {return console.log(err.stack)});
    
            await GuildRole.findOne({guildID: guild.id})
            .then((res) =>{
                if(!res){
                    GuildCreate.GuildRoles(guild)
                }
            })
            .catch(err => {return console.log(err.stack)});
        
            setTimeout(GuildDataCheck, 1000 * 60 * 30 )
        }
        GuildDataCheck()
    })
    
    
}