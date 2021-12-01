const Discord = require('discord.js');
const sourcebin = require('sourcebin')
const { MessageEmbed } = require('discord.js');
const { LogChannel } = require('../../Functions');
module.exports = {
    event: "messageDeleteBulk",
    once: false,
    run: async(deletedMessage, client)=> {
	try{
        await Discord.Util.delayFor(900);
        let ID = deletedMessage.first().guildId;
        let guild = client.guilds.cache.get(ID)

        LogChannel("messageLog", guild).then(async c => {
            if(!c) return;
            if(c === null) return;

            const hooks = await c.fetchWebhooks();
            const webHook = hooks.find(i => i.owner.id == client.user.id && i.name == 'sadbot')

            if(!webHook){
                c.createWebhook("sadbot", {
                    avatar: "https://i.ibb.co/86GB8LZ/images.jpg"
                })
            }
            let length = [...deletedMessage.values()].length;
            let channel = deletedMessage.first().channel;
            let contents = deletedMessage.map(message => `${message.author.tag}: ${message.content}\n`)

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
            webHook.send({embeds: [Embed]})
        })
	}catch(err){
		return console.log(err)
	}
    }
}