const Discord = require('discord.js');
const ms = require('ms');
const { LogManager, WebhookManager } = require('../../Functions');
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

    let logData = new LogManager(client, newMember.guild)
        .setUser(newMember)
        .setActions("Timeout", logs.reason ? logs.reason : "No reason was provided")
        .setExecutor(logs.executor)
        .setLengths(null, durationFormat)
        .LogCreate(true)

    let Embed = new Discord.MessageEmbed()
        .setAuthor({name: `Timeout • ${newMember.user.username}`, iconURL: newMember.user.displayAvatarURL({dynamic: true, format: 'png'})})
        .addFields([
            {
                name: "<:user_icon:1011170605636259921> User",
                value: `${newMember.user.tag}`,
                inline: true
            },
            {
                name: "<:staff:1011186336058843266><:staff:1011186338533494814> Moderator",
                value: `${logs.executor.tag}`,
                inline: true
            },
            {
                name: `<:clock:1011170596719173692> Duration`,
                value: `${durationFormat}`,
                inline: true
            },
            {
                name: "<:reason:1011187388371968051> Reason",
                value: `${logs.reason ? logs.reason : "No reason was provided"}`,
                inline: true
            }
        ])
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