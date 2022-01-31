const { MessageEmbed } = require('discord.js')
const moment = require('moment')
const Discord = require('discord.js')
module.exports = {
    name: 'update-log',
    aliases: ['updatelog'],
    description: "Bot new updates",
    permissions: ["SEND_MESSAGES"],
    botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
    usage: "update-log",
    category: "Utils",
    cooldown: 3000,
    run: async(client, message, args,prefix) =>{
        let Embed = new Discord.MessageEmbed()
            .setAuthor("Sadbot Recent Update")
            .setDescription(`
            **Sadbot update v1.4.3**
            __New features:__
            \` ﹃ \`Added command \`toggle\`. You can toggle between settings. Only one settings available right now which is \`loglimit\`. Let's talk about it in next row.
            \` ﹃ \` You can add a log limit for your server. When ever a user reach their log limit, bot will notify you in the log channel which you can set by \`/set-log-channel\` \`log-limit-alert\`.
            \` ﹃ \`As you all know discord added timeout. You can now timeout with bot how cool is that :p. Bot will auto detect any timeout even manual and log them in \`action log\` channel, yes where your mute/unmute gets logged.
            Timeout available in both command and slash command.
            \` ﹃ \`Fixed even more bugs.

            **Sadbot update v1.4.4**
            __New features:__
            - Added command \`/command\`. You can manage each command.
            - Added command \`/settings\`. Check your server settings.
            - Changed \`/set-log-channel\` command name to \`/set-channel\` 
            - Added command \`/set-role\` You can add moderation type role.
            - Added command \`role-info\` & \`channel-info\`.
            - Changes on few visual.
            - More bug fixes.
            `)
            .setColor("WHITE")

        message.channel.send({embeds: [Embed]}).catch(err => {return console.log(err.stack)})
    }
}