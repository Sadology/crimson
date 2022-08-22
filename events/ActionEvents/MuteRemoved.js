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
        .addField("<:user_icon:1011170605636259921> User", `${Member.user ? Member.user.tag : Member+"(Member left)"}`, true)
        .addField("<:staff:1011186336058843266><:staff:1011186338533494814> Moderator", `${executor.user.tag}`, true)
        .setColor("#2f3136")
        .setFooter({text: "ID • "+Member.user ? Member.user.id : Member})
        .setTimestamp()

    if(Member.user){
        Embed.setAuthor({name: `Unmute • ${Member.user.username}`, iconURL: Member.user.displayAvatarURL({dynamic: true, format: 'png'})})
    }else {
        Embed.setAuthor({name: `Unmute • Member Left`})
    }
    client.eventEmitter.emit('AuditAdd', {
        User: logs.executor,
        Guild: newMember.guild,
        Reason: `Timedout ${newMember.user.tag} for ${durationFormat} with reason: ${logs.reason}`,
        Date: new Date(),
        Command: "Unmute",
        Moderation: true
    });
    new WebhookManager(client, Member.guild).WebHook(Embed, 'actionlog')
});