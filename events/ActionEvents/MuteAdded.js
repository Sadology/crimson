const Discord = require('discord.js');
const client = require('../..');
const {DatabaseManager, WebhookManager} = require('../../Functions')

client.eventEmitter.on('MuteAdded', async(data, Member) => {
    const { moderator, actionLength, actionReason, Duration, guildID } = data

    // Update database
    new DatabaseManager(client).SaveLogData(data, true)
    
    // Create mute embed
    let Embed = new Discord.MessageEmbed()
        .setAuthor({name: `Mute • ${Member.user.username}`, iconURL: Member.user.displayAvatarURL({dynamic: true, format: 'png'})})
        .addField("<:user_icon:958016031127904307> User", `${Member.user.tag}`, true)
        .addField("<:staff:956457533957079080><:staff:956457534334566420> Moderator", `${moderator}`, true)
        .addField(`<:duration:958254873906933820> Duration`, `${actionLength}`, true)
        .addField("<:reason:958253321410445363> Reason", `${actionReason}`)
        .setColor("#2f3136")
        .setFooter({text: "ID • "+Member.user.id})
        .setTimestamp()
    
    client.eventEmitter.emit('CmdUsed', moderator, "Mute", guildID);
    new WebhookManager(client, Member.guild).WebHook(Embed, 'actionlog')
});