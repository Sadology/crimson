const wait = require('util').promisify(setTimeout);
const client = require('../..');
const { LogManagers, DatabaseManager, WebhookManager } = require('../../Functions');

client.on('guildBanRemove', async(User) => {
    const clientPerm = User.guild.members.resolve( client.user ).permissions.any("VIEW_AUDIT_LOG");
    if (!clientPerm || clientPerm == false) return;

    await wait(2000);
    const fetchedLogs = await User.guild.fetchAuditLogs({
        limit: 5,
        type: 'MEMBER_BAN_REMOVE',
    });

    const unBanLog = fetchedLogs.entries
        .filter(e => e.target.id == User.user.id)
        .first()

    if(!unBanLog){
        return
    };

    const { executor, target } = unBanLog;

    let logData = new LogManagers(client, User.guild)
        .setUser(User)
        .setActions("Unban", "/edit-reason to edit this log reason")
        .setExecutor(executor)
        .setLengths()

    // Update database
    new DatabaseManager(client).SaveLogData(logData.DataToJson());

    const Embed = {
        color: "#2f3136",
        author: {
            name: `Unban • ${target.username}`,
            icon_url: target.displayAvatarURL({
                dynamic: true , 
                format: 'png'
            })
        },
        fields: [
            {
                name: `<:user_icon:958016031127904307> User`,
                value: `${target.tag}`,
                inline: true
            },
            {
                name: `<:staff:956457533957079080><:staff:956457534334566420> Moderator`,
                value: `${executor.tag}`,
                inline: true
            },
        ],
        timestamp: new Date(),
        footer: {
            text: `User-ID • ${target.id}`
        }
    }

    new WebhookManager(client, User.guild).WebHook(Embed, 'banlog')
});