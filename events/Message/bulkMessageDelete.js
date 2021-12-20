const Discord = require('discord.js');
const sourcebin = require('sourcebin')
const { MessageEmbed } = require('discord.js');
const { LogManager } = require('../../Functions');
module.exports = {
    event: "messageDeleteBulk",
    once: false,
    run: async(deletedMessage, client)=> {
        if(!deletedMessage.guild.me.permissions.has("VIEW_AUDIT_LOG")){
            return
        }
	    try{
            await Discord.Util.delayFor(900);
            let ID = deletedMessage.first().guildId;
            let guild = client.guilds.cache.get(ID)

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
                .setAuthor(guild.name, guild.iconURL({
                    dynamic: true , format: 'png' , size:1024
                }))
                .setDescription(`**Bulk message deleted in** ${channel} \n**Amount:** \`${length}\`\n**Messages:** ${bin.url}`)
                .setTimestamp()
                .setColor("#fa5757")
            new LogManager(guild).sendData({type: 'messagelog', data: Embed, client})
        }catch(err){
            return console.log(err.stack)
        }
    }
}