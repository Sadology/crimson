const client = require('../..');
const { LogManagers, DatabaseManager, WebhookManager} = require('../../Functions');
const wait = require('util').promisify(setTimeout);

client.on("guildMemberRemove", async(member) => {
    if(client.user.id == member.user.id) return;
    
    const clientPerm = member.guild.members.resolve( client.user ).permissions.any("VIEW_AUDIT_LOG");
    if (!clientPerm || clientPerm == false) return;

    await wait(2000)
    const fetchedLogs = await member.guild.fetchAuditLogs({
        limit: 5,
        type: 'MEMBER_KICK'
    })

    const KickLog = fetchedLogs.entries
        .filter(e => e.target.id == member.user.id)
        .first()

    if(!KickLog){
        return
    }

    const {executor, target, reason} = KickLog;

    let logData = new LogManagers(client, member.guild)
        .setUser(target)
        .setActions("Kick", reason)
        .setExecutor(executor)
        .setLengths()

    new DatabaseManager(client).SaveLogData(logData.DataToJson());

    const Embed = {
        color: "#2f3136",
        author: {
            name: `Kick • ${target.username}`,
            icon_url: target.displayAvatarURL({
                dynamic: true , 
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
                name: "<:reason:1011187388371968051> Reason",
                value: `${reason ? reason : "No reason was provided"}`
            }
        ],
        timestamp: new Date(),
        footer: {
            text: `User-ID • ${target.id}`
        }
    }

    new WebhookManager(client, member.guild).WebHook(Embed, 'kicklog');
    client.eventEmitter.emit('AuditAdd', {
        User: executor,
        Guild: member.guild,
        Reason: `Kicked ${target.tag} with reason: ${reason}`,
        Date: new Date(),
        Command: "Kick",
        Moderation: true
    });
})