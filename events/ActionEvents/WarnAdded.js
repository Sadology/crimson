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
        .addField("<:user_icon:958016031127904307> User", `${Member.user.tag}`, true)
        .addField("<:staff:956457533957079080><:staff:956457534334566420> Moderator", `${executor.user.tag}`, true)
        .addField("<:reason:958253321410445363> Reason", `${reason}`)
        .setColor("#2f3136")
        .setFooter({text: "ID • "+Member.user.id})
        .setTimestamp()
    
    client.eventEmitter.emit('CmdUsed', executor, "Warn", executor.guild);
    new WebhookManager(client, Member.guild).WebHook(Embed, 'actionlog')
});