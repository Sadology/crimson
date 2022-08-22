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
        .addField("<:user_icon:1011170605636259921> User", `${Member.user.tag}`, true)
        .addField("<:staff:1011186336058843266><:staff:1011186338533494814> Moderator", `${moderator}`, true)
        .addField(`<:clock:1011170596719173692> Duration`, `${actionLength}`, true)
        .addField("<:reason:1011187388371968051> Reason", `${actionReason}`)
        .setColor("#2f3136")
        .setFooter({text: "ID • "+Member.user.id})
        .setTimestamp()
    
    client.eventEmitter.emit('AuditAdd', {
        User: moderator,
        Guild: Member.guild,
        Reason: `Muted ${Member.user.tag} for ${actionLength} with reason: ${actionReason}`,
        Date: new Date(),
        Command: "Mute",
        Moderation: true
    });
    new WebhookManager(client, Member.guild).WebHook(Embed, 'actionlog')
});