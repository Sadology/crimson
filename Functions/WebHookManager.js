const { Guild } = require("../models");

class WebhookManager{
    constructor(client, guild){
        this.client = client;
        this.guild = guild;
    };

    async FetchDatabase(){
        let Data = await Guild.findOne({
            guildID: this.guild.id ? this.guild.id : this.guild
        })
        .catch(err => {
            return console.log(err.stack);
        });

        if(Data) return Data;
        else return false;
    };

    async WebHook(Embed, Type){
        // Fetch database
        let data = await this.FetchDatabase()
        if(!data) return false;

        // Destructure the database properties
        const { Logchannels } = data;
        if(!Logchannels) return;

        // Lookup for the specific data in database
        let ChannelID;
        if(Logchannels.has(Type)){
            ChannelID = Logchannels.get(Type)
        };

        if(!ChannelID) return;

        // Find the channel for specific data
        let channel = this.guild.channels.resolve(ChannelID);
        if(!channel) return;

        // Check for Webhook permission
        if(!this.guild.members.resolve(this.client.user).permissions.any(["MANAGE_WEBHOOKS"])){
            // Send the data as bot message if no webhook perms
            return channel.send({embeds: [Embed]}).catch(err => {return console.log(err.stack)});
        };

        // Fetch guild webhooks
        const hooks = await channel.fetchWebhooks();
        const webHook = hooks.find(i => i.owner.id == this.client.user.id);

        // Create a webhook and send the embed
        if(!webHook){
            channel.createWebhook(this.client.user.username, {
                avatar: "https://media.discordapp.net/attachments/1011166042493554750/1014462638803124235/d8a321eca9d98f6e2fb4f27b634b6c23.png"
            }).then((i) => {
                return i.send({embeds: [Embed]}).catch(err => {return console.log(err.stack)});
            });
        }else {
            if(webHook.avatar !== this.client.user.avatar){
                webHook.edit({name: this.client.user.username, avatar: "https://media.discordapp.net/attachments/1011166042493554750/1014462638803124235/d8a321eca9d98f6e2fb4f27b634b6c23.png"})
            };

            await webHook.send({embeds: [Embed]}).catch(err => {return console.log(err.stack)});
        };
    }
}

module.exports = {WebhookManager};