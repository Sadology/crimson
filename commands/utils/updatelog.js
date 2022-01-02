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
            Sadbot update v1.4.2
            New Year Update
            What's New:
            1 - Added command \`status\` you can now check enabled/disabled commands/modules status.
            2 - Enable/disable support are now available in commands. \`enable\`/\`disable\`
            3 - From now bot will now require \`Embed_Links\` permission to run any commands. 
            4 - Non mod/admin type slash commands will require \`use application command\` permission to use.
            5 - New Command added \`color\`. **Use HEX color code to search any color**
            6 - New Command added \`edit-reason\`. Made a mistake while typing reason? Don't worry we gotchu back. You can now edit the reason.
            7 - New Command added \`edit-log\`. You can now check new update logs whitout being in support server how cool is that lol.
            8 - And the update you all have been waiting for. Yes \`custom-command\` has been re enabled. You can check your custom command list, individual command or dunno how to make command? We gotchu back, you can make custom command with brand new help manu \`/custom-command\` to find out more
            `)
            .setColor("WHITE")

        message.channel.send({embeds: [Embed]}).catch(err => {return console.log(err.stack)})
    }
}