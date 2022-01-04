const { GuildChannel, LogsDatabase, Guild  } = require('../models')
const Discord = require('discord.js')
class LogManager{
    constructor(guild, client){
        this.Guild = guild
        this.client = client
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
            const channel = await this.Guild.channels.resolve(i.channel)

            if(!channel) return

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
        return this
    }

    resolveData(type){
        if(!type) return
        this.findData(type).then(async i => {
            if(!i || i == null) return;
            else return i;
        })
        return this
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
        return this
    }

    async logCreate({data, user}){
        function caseID() {
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            for (var i = 0; i < 10; i++)
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            return text;
        }

        let LogID = ''
        LogID = caseID()

        let actionData = {
            userID: data.userID ? data.userID : "", 
            userName: data.userName ? data.userName : "",
            caseID: LogID, 
            actionType: data.actionType ? data.actionType : "Unknown", 
            actionReason: data.actionReason ? data.actionReason : "No reason provided",
            actionLength: data.actionLength ? data.actionLength : "",
            moderator: data.moderator ? data.moderator : "",
            moderatorID: data.moderatorID ? data.moderatorID : "",
            actionDate: new Date()
        }

        if(data.actionType == "Mute"){
            await LogsDatabase.updateOne({
                guildID: this.Guild.id,
                userID: user.user ? user.user.id : user.id
            }, {
                guildName: this.Guild.name,
                Muted: true,
                Expire: data.Expire,
                $push: {
                    [`Action`]: {
                        ...actionData
                    }
                }
            },{
                upsert: true,
            }).catch(err => {
                return console.log(err.stack)
            })
        }else {
            await LogsDatabase.updateOne({
                guildID: this.Guild.id,
                userID: user.user ? user.user.id : user.id
            }, {
                guildName: this.Guild.name,
                $push: {
                    [`Action`]: {
                        ...actionData
                    }
                }
            },{
                upsert: true,
            }).catch(err => {
                return console.log(err.stack)
            })
        }
        this.LogLimit(user)
        return this
    }

    async LogLimit(Member){
        const FetchData = await LogsDatabase.findOne({
            guildID: this.Guild.id,
            userID: Member.user.id
        });

        let count;
        if(FetchData){
            count = FetchData.Action.length
        }else {
            count = 0
        }

        await Guild.findOne({
            guildID: this.Guild.id,
            Settings: {$exists : true},
        })
        .then(async res => {
            if(!res){
                return
            }

            if(!res.Settings.has('loglimit')) return

            let data = res.Settings.get('loglimit')
            console.log(Number(count), Number(data))
            if(count >= data){
                console.log("YES")
                this.findData("alertLog").then(async i => {
                    if(!i || i == null) return;
                    
                    const channel = await this.Guild.channels.resolve(i.channel)
                    if(!channel) return
        
                    if(!this.Guild.me.permissions.any("MANAGE_WEBHOOKS")){
                        return channel.send("Hey i don't have permission to send webhook logs here. Please provide me \`Manage Webhooks\` permission")
                        .catch(err => {return console.log(err.stack)})
                    }
        
                    const hooks = await channel.fetchWebhooks();
                    const webHook = hooks.find(i => i.owner.id == this.client.user.id && i.name == 'sadbot')
        
                    let alterEmbed = new Discord.MessageEmbed()
                        .setAuthor({
                            name: "Log Limit",
                            iconURL: Member?.displayAvatarURL({dynamic: false, format: "png"})
                        })
                        .setDescription(`${Member} has reached log limit with ${count} logs`)
                        .addField("User", `\`\`\` ${Member.user.tag} \`\`\` `, true)
                        .addField("Logs", `\`\`\` ${count} \`\`\` `, true)
                        .addField("Server limit", `\`\`\` ${data} \`\`\` `, true)
                        .setColor("RED")
                    if(!webHook){
                        channel.createWebhook("sadbot", {
                            avatar: "https://i.ibb.co/86GB8LZ/images.jpg"
                        }).then((i) => {
                            return i.send({embeds: [alterEmbed]}).catch(err => {return console.log(err.stack)}) 
                        })
                    }else {
                        webHook.send({embeds: [alterEmbed]}).catch(err => {return console.log(err.stack)})
                    }
                })
            }
        })
    }
}
module.exports = LogManager