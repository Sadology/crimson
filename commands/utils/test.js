const Discord = require('discord.js');
const sourcebin = require('sourcebin')
const { errLog } = require('../../Functions/erroHandling');
const { Member } = require('../../Functions/MemberFunction');
const { GuildRole } = require('../../models');
const { Permissions } = require('discord.js');
module.exports = {
    name: 'test',
    description: 'ping pong',
    category: 'Utils',
    disabled: true,
    run: async(client, message, args)=> {
        const member = args[0]
        const memberInfo = new Member(member, message)

        const GuildMember = message.guild.members.cache.get(memberInfo.id)
        if(GuildMember){
            return console.log("yes")
        }else {
            return console.log("nop")
        }
    }
}