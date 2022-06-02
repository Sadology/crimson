const Discord = require('discord.js');
const client = require('../..');
const { LogManagers, DatabaseManager, WebhookManager } = require('../../Functions');

client.eventEmitter.on('MuteRemoved', async(Member, executor, guild) => {

    let logData = new LogManagers(client, guild)
        .setUser(Member)
        .setActions("Unmute", `Unmuted by ${executor.user.tag}`)
        .setExecutor(executor)
        .setLengths()

    // Update database
    new DatabaseManager(client).SaveLogData(logData.DataToJson());

    // Create mute embed
    let Embed = new Discord.MessageEmbed()
        .addField("<:user_icon:958016031127904307> User", `${Member.user ? Member.user.tag : Member+"(Member left)"}`, true)
        .addField("<:staff:956457533957079080><:staff:956457534334566420> Moderator", `${executor.user.tag}`, true)
        .setColor("#2f3136")
        .setFooter({text: "ID • "+Member.user ? Member.user.id : Member})
        .setTimestamp()

    if(Member.user){
        Embed.setAuthor({name: `Unmute • ${Member.user.username}`, iconURL: Member.user.displayAvatarURL({dynamic: true, format: 'png'})})
    }else {
        Embed.setAuthor({name: `Unmute • Member Left`})
    }

    new WebhookManager(client, Member.guild).WebHook(Embed, 'actionlog')
});