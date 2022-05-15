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
                name: `<:user_icon:958016031127904307> User`,
                value: `${target.tag}`,
                inline: true
            },
            {
                name: `<:staff:956457533957079080><:staff:956457534334566420> Moderator`,
                value: `${executor.tag}`,
                inline: true
            },
            {
                name: "<:scroll:958253321410445363> Reason",
                value: `${reason ? reason : "No reason was provided"}`
            }
        ],
        timestamp: new Date(),
        footer: {
            text: `User-ID • ${target.id}`
        }
    }

    client.eventEmitter.emit('CmdUsed', executor, "Kick", member.guild);
    new WebhookManager(client, member.guild).WebHook(Embed, 'kicklog');
})