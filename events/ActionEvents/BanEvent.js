const { LogManager, WebhookManager } = require('../../Functions');
const wait = require('util').promisify(setTimeout);
const client = require('../..');

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

    let logData = new LogManager(client, User.guild)
        .setUser(User)
        .setActions("Ban", reason)
        .setExecutor(executor)
        .setLengths()
        .LogCreate()

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
                name: `<:user_icon:1011170605636259921> User`,
                value: `${target.tag}`,
                inline: true
            },
            {
                name: `<:staff:1011186336058843266><:staff:1011186338533494814> Moderator`,
                value: `${executor.tag}`,
                inline: true
            },
            {
                name: `<:reason:1011187388371968051> Ban Reason`,
                value: `${reason ? reason : 'No reason was provided'}`,
                inline: false
            }
        ],
        timestamp: new Date(),
        footer: {
            text: `User-ID • ${target.id}`
        }
    }

    new WebhookManager(client, User.guild).WebHook(Embed, 'banlog');
    client.eventEmitter.emit('AuditAdd', {
        User: executor,
        Guild: User.guild,
        Reason: `Banned ${target.tag} with reason: ${reason}`,
        Date: new Date(),
        Command: "Ban",
        Moderation: true
    });
    
});