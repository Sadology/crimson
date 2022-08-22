const Discord = require('discord.js');
const client = require('../..');
const { LogManagers, DatabaseManager, WebhookManager } = require('../../Functions');

client.eventEmitter.on('WarnAdded', async(Member, reason, executor) => {
    let logData = new LogManagers(client, Member.guild)
        .setUser(Member)
        .setActions("Warn", reason)
        .setExecutor(executor)
        .setLengths()

    // Update database
    new DatabaseManager(client).SaveLogData(logData.DataToJson());
    
    // Create mute embed
    let Embed = new Discord.MessageEmbed()
        .setAuthor({name: `Warn • ${Member.user.username}`, iconURL: Member.user.displayAvatarURL({dynamic: true, format: 'png'})})
        .addField("<:user_icon:1011170605636259921> User", `${Member.user.tag}`, true)
        .addField("<:staff:1011186336058843266><:staff:1011186338533494814> Moderator", `${executor.user.tag}`, true)
        .addField("<:reason:1011187388371968051> Reason", `${reason}`)
        .setColor("#2f3136")
        .setFooter({text: "ID • "+Member.user.id})
        .setTimestamp()
    
    client.eventEmitter.emit('AuditAdd', {
        User: executor,
        Guild: Member.guild,
        Reason: `Warned ${Member.user.tag} with reason: ${reason}`,
        Date: new Date(),
        Command: "Warn",
        Moderation: true
    });
    new WebhookManager(client, Member.guild).WebHook(Embed, 'actionlog')
});