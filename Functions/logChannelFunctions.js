const { GuildChannel  } = require('../models')

async function LogChannel(logOption, guild){
    const Data = await GuildChannel.findOne({
        guildID: guild.id,
        Active: true
    })

    if(Data){
        try{
            let logData = Data.Data

            let item = logData.find(i => i.name == logOption);
            if(item){
                if(item.enabled === false) return null
                const channel = await guild.channels.cache.get(item.channel)

                if(channel){
                    return channel
                }else {
                    return null
                }
            }else {
                return null
            }
        }catch(err){
            console.log(err)
        }
    }
}
module.exports = { LogChannel }