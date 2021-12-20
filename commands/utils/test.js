const { saveData } = require('../../Functions/functions');
const Discord = require('discord.js');
module.exports = {
    name: 'test',

    run: async(client, message, args, prefix)=> {
        const clientPerm = message.guild.members.resolve( client.user ).permissions.any("VIEW_AUDIT_LOG");
        console.log(clientPerm)
    }
}