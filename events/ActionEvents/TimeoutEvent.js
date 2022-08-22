const Discord = require('discord.js');
const ms = require('ms');
const { LogManagers, DatabaseManager, WebhookManager } = require('../../Functions');
const client = require('../..');

client.on('guildMemberUpdate', async (oldMember, newMember) => {
    const clientPerm = newMember.guild.members.resolve( client.user ).permissions.any("VIEW_AUDIT_LOG");
    if (!clientPerm || clientPerm == false) return;

    const auditLogs = await oldMember.guild.fetchAuditLogs({ limit: 5, type: "MEMBER_UPDATE" });
    const logs = auditLogs.entries
        .filter(e => e.target.id === oldMember.user.id)
        .sort((a, b) => b.createdAt - a.createdAt)
        .first()

    if(!logs) return;

    let date = (newMember.communicationDisabledUntilTimestamp ?? Date.now()) - Date.now()
    const timeoutChange = logs.changes?.find((c) => c.key == 'communication_disabled_until');

    if(!timeoutChange || !timeoutChange.new) return;

    if(newMember.communicationDisabledUntilTimestamp == oldMember.communicationDisabledUntilTimestamp) return;

    let durationFormat = ms(date+1000, {long: true})

    let logData = new LogManagers(client, newMember.guild)
        .setUser(newMember)
        .setActions("Timeout", logs.reason ? logs.reason : "No reason was provided")
        .setExecutor(logs.executor)
        .setLengths(null, durationFormat)

    // Update database
    new DatabaseManager(client).SaveLogData(logData.DataToJson());

    let Embed = new Discord.MessageEmbed()
        .setAuthor({name: `Timeout • ${newMember.user.username}`, iconURL: newMember.user.displayAvatarURL({dynamic: true, format: 'png'})})
        .addField("<:user_icon:1011170605636259921> User", `${newMember.user.tag}`, true)
        .addField("<:staff:1011186336058843266><:staff:1011186338533494814> Moderator", `${logs.executor.tag}`, true)
        .addField(`<:clock:1011170596719173692> Duration`, `${durationFormat}`, true)
        .addField("<:reason:1011187388371968051> Reason", `${logs.reason ? logs.reason : "No reason was provided"}`)
        .setColor("#2f3136")
        .setFooter({text: "ID • "+newMember.user.id})
        .setTimestamp()

    client.eventEmitter.emit('AuditAdd', {
        User: logs.executor,
        Guild: newMember.guild,
        Reason: `Timedout ${newMember.user.tag} for ${durationFormat} with reason: ${logs.reason}`,
        Date: new Date(),
        Command: "Timeout",
        Moderation: true
    });
    new WebhookManager(client, newMember.guild).WebHook(Embed, 'actionlog')
})