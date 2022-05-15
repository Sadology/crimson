const { Guild } = require("../models");

class WebhookManager{
    constructor(client, guild){
        this.client = client;
        this.guild = guild;
    };

    async FetchDatabase(){
        let Data = await Guild.findOne({
            guildID: this.guild.id
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
        if(!data) return;

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
        if(!this.guild.members.resolve(this.client.user).permissions.any("MANAGE_WEBHOOKS")){
            // Send the data as bot message if no webhook perms
            return channel.send({embeds: [Embed]}).catch(err => {return console.log(err.stack)});
        };

        // Fetch guild webhooks
        const hooks = await channel.fetchWebhooks();
        const webHook = hooks.find(i => i.owner.id == this.client.user.id && i.name == 'sadbot');

        // Create a webhook and send the embed
        if(!webHook){
            channel.createWebhook("sadbot", {
                avatar: "https://i.ibb.co/86GB8LZ/images.jpg"
            }).then((i) => {
                return i.send({embeds: [Embed]}).catch(err => {return console.log(err.stack)});
            });
        }else {
            webHook.send({embeds: [Embed]}).catch(err => {return console.log(err.stack)});
        };
    }
}

module.exports = {WebhookManager};