const { Guild, GuildRole, GuildChannel } = require('../models');
const Discord = require('discord.js');

class GuildManager{
    constructor(client){
        this.client = client;
    }

    /**
    * @param {String} guild pass guild id or guild object
    */
    async CreateGuildData(guild){
        await Guild.create({
            guildID: guild.id,
            prefix: '>',
            Logchannels: new Discord.Collection(),
            Modules: new Discord.Collection(),
            Commands: new Discord.Collection(),
        }).catch(err => {return console.log(err.stack)});
    }

    /**
    * @param {String} guild pass guild id or guild object
    */
    async FetchGuild(guild){
        let Data = await Guild.findOne({
            guildID: guild.id
        }).catch(err => {return console.log(err.stack)});

        if(!Data){
            return false;
        }

        return Data;
    }

    /**
    * @param {String} guild pass guild id or guild object
    * @param {Object} data data to update in database
    */
    async UpdateGuildData(guild, data){
        await Guild.updateOne({
            guildID: guild.id
        }, {
            data
        }, {upsert: true})
        .catch(err => {return console.log(err.stack)});
    }


}

module.exports = {GuildManager}