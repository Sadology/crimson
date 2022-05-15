const { LogManagers, DatabaseManager, WebhookManager, Member } = require('../../Functions');
const wait = require('util').promisify(setTimeout);
const client = require('../../index');

client.on('guildBanAdd', async(User) => {
    if(client.user.id == User.user.id) return;

    const clientPerm = User.guild.members.resolve( client.user ).permissions.any("VIEW_AUDIT_LOG");
    if (!clientPerm || clientPerm == false) return;

    await wait(2000)
    const fetchedLogs = await User.guild.fetchAuditLogs({
        limit: 5,
        type: 'MEMBER_BAN_ADD'
    })

    const BanLog = fetchedLogs.entries
    .filter(e => e.target.id == User.user.id)
    .first()

    if(!BanLog){
        return
    }

    const { executor, target, reason } = BanLog;

    let logData = new LogManagers(client, User.guild)
        .setUser(User)
        .setActions("Ban", reason)
        .setExecutor(executor)
        .setLengths()

    new DatabaseManager(client).SaveLogData(logData.DataToJson());

    const Embed = {
        color: "#2f3136",
        author: {
            name: `Ban • ${target.username}`,
            icon_url: target.displayAvatarURL({
                dynamic: true, 
                format: 'png'
            })
        },
        fields: [
            {
                name: `<:user:958016031127904307> User`,
                value: `${target.tag}`,
                inline: true
            },
            {
                name: `<:staff:956457533957079080><:staff:956457534334566420> Moderator`,
                value: `${executor.tag}`,
                inline: true
            },
            {
                name: `<:scroll:958253321410445363> Ban Reason`,
                value: `${reason ? reason : 'No reason was provided'}`,
                inline: false
            }
        ],
        timestamp: new Date(),
        footer: {
            text: `User-ID • ${target.id}`
        }
    }
    client.eventEmitter.emit('CmdUsed', executor, "Ban");
    new WebhookManager(client, User.guild).WebHook(Embed, 'banlog')
});