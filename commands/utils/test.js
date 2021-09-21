const Discord = require('discord.js');
const sourcebin = require('sourcebin')
const { errLog } = require('../../Functions/erroHandling');
const { GuildRole } = require('../../models');
const { Permissions } = require('discord.js');
module.exports = {
    name: 'test',
    description: 'ping pong',
    category: 'Utils',
    disabled: true,
    run: async(client, message, args)=> {
        const { author } = message;

        const missingPerm = new Discord.MessageEmbed()
            .setAuthor(author.tag, author.displayAvatarURL({dynamic: false, format: "png", size: 1024}))
            .setDescription("Missing permission to execute this command")
            .setTimestamp()
            .setColor('#ff303e')

        if(!message.member.permissions.has([Permissions.FLAGS.BAN_MEMBERS, Permissions.FLAGS.MANAGE_GUILD, Permissions.FLAGS.ADMINISTRATOR])){
            return await message.channel.send({embeds: [missingPerm]}).then(m=>setTimeout(() => m.delete(), 1000 * 10));
        }
    }
}