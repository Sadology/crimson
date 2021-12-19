const { GuildChannel  } = require('../models')

class LogManager{
    constructor(guild){
        this.Guild = guild
    }

    async findData(type){
        let items = null
        await GuildChannel.findOne({
            guildID: this.Guild.id,
        }).then((res) => {
            if(res){
                let data = res.Data.find(i => i.name.toLowerCase() == type.toLowerCase())
                if(!data) return
                else items = data
            }
        })
        return items
    }

    sendData({type, data, client}){
        if(!type || !data) return
        this.findData(type).then(async i => {
            if(!i || i == null) return;
            
            if(i.enabled == false) return
            const channel = await this.Guild.channels.cache.get(i.channel)

            if(!this.Guild.me.permissions.any("MANAGE_WEBHOOKS")){
                return channel.send("Hey i don't have permission to send webhook logs here. Please provide me \`Manage Webhooks\` permission")
                .catch(err => {return console.log(err.stack)})
            }

            const hooks = await channel.fetchWebhooks();
            const webHook = hooks.find(i => i.owner.id == client.user.id && i.name == 'sadbot')

            if(!webHook){
                channel.createWebhook("sadbot", {
                    avatar: "https://i.ibb.co/86GB8LZ/images.jpg"
                }).then((i) => {
                    return i.send({embeds: [data]}).catch(err => {return console.log(err.stack)}) 
                })
            }else {
                webHook.send({embeds: [data]}).catch(err => {return console.log(err.stack)})
            }
        })
    }

    GiveData(type){
        if(!type) return
        this.findData(type).then(async i => {
            if(!i || i == null) return;
            else return i;
        })
    }

    LogChannel(type){
        if(!type) return
        this.findData(type).then(async i => {
            if(!i || i == null) return;
            
            if(i.enabled == false) return
            const channel = await this.Guild.channels.cache.get(i.channel)

            if(channel){
                return channel;
            }
        })
    }
}
module.exports = LogManager