const Discord = require('discord.js');
const sourcebin = require('sourcebin')
const { errLog } = require('../../Functions/erroHandling');
const { Member } = require('../../Functions/MemberFunction');
const { GuildRole } = require('../../models');
const { Permissions } = require('discord.js');
const { GuildChannel } = require('../../models');
const { LogChannel } = require('../../Functions/logChannelFunctions');
module.exports = {
    name: 'test',
    description: 'ping pong',
    category: 'Utils',
    disabled: true,
    run: async(client, message, args)=> {
        LogChannel('banLog', message.guild.id, message).then(c => {
            if(c == null) return;
            if(!c) return;
            else c.send("hi")
        })
        return
    }
}