const Discord = require('discord.js');
const sourcebin = require('sourcebin')
const { MessageEmbed } = require('discord.js');
const { LogManager } = require('../../Functions');
const wait = require('util').promisify(setTimeout);
module.exports = {
    event: "messageDeleteBulk",
    once: false,
    run: async(deletedMessage, client)=> {
	    try{
            wait(1000);
            let ID = deletedMessage.first().guildId;
            let guild = client.guilds.cache.get(ID)

            const clientPerm = guild.members.resolve( client.user ).permissions.any("VIEW_AUDIT_LOG");
            if (!clientPerm || clientPerm == false) return

            let length = [...deletedMessage.values()].length;
            let channel = deletedMessage.first().channel;
            let contents = deletedMessage.map(message => `${message.author.tag}: ${message.content}`).join(' \n')

            const bin = await sourcebin.create(
                [
                    {
                        content: contents.toString(),
                        language: 'text',
                    },
                ],
                {
                    title: "Bulk Message Delete",
                    description: `${guild.name} bulk message delete, Amount: ${length}`,
                },
            );

            const Embed = new MessageEmbed()
                .setAuthor({name: guild.name, icon: guild.iconURL({
                    dynamic: true , format: 'png' , size:1024
                })})
                .setDescription(`**Bulk message deleted in** ${channel} \n**Amount:** \`${length}\`\n**Messages:** ${bin.url}`)
                .setTimestamp()
                .setColor("#fa5757")
            new LogManager(guild).sendData({type: 'messagelog', data: Embed, client})
        }catch(err){
            return console.log(err.stack)
        }
    }
}