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
        const webHook = hooks.find(i => i.owner.id == this.client.user.id);

        // Create a webhook and send the embed
        if(!webHook){
            channel.createWebhook(this.client.user.username, {
                avatar: "https://media.discordapp.net/attachments/880768542482509874/979000216051146762/realm.jpg.png?width=404&height=438"
            }).then((i) => {
                return i.send({embeds: [Embed]}).catch(err => {return console.log(err.stack)});
            });
        }else {
            if(webHook.avatar !== this.client.user.avatar){
                webHook.edit({avatar: "https://media.discordapp.net/attachments/880768542482509874/979000216051146762/realm.jpg.png?width=404&height=438"})
            };
            if(webHook.name !== this.client.user.username){
                webHook.edit({name: this.client.user.username})
            };

            await webHook.send({embeds: [Embed]}).catch(err => {return console.log(err.stack)});
        };
    }
}

module.exports = {WebhookManager};