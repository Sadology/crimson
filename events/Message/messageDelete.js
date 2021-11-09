const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');
const { GuildChannel } = require('../../models');
const { errLog } = require('../../Functions/erroHandling');
const { LogChannel } = require('../../Functions/logChannelFunctions');
module.exports = {
    event: "messageDelete",
    once: false,
    run: async(deletedMessage, client)=> {
	try{
        if(deletedMessage.channel.type === 'dm') return;
		if(deletedMessage.author.bot) return;

		if(!deletedMessage.guild.me.permissions.has("VIEW_AUDIT_LOG", "ADMINISTRATOR")){
			return false;
		}

		if(deletedMessage.cleanContent.length >= 1000) return
		await Discord.Util.delayFor(900);

        LogChannel("messageLog", deletedMessage.guild).then(async c => {
            if(!c) return;
            if(c === null) return;

			const hooks = await c.fetchWebhooks();
            const webHook = hooks.find(i => i.owner.id == client.user.id && i.name == 'sadbot')

            if(!webHook){
                c.createWebhook("sadbot", {
                    avatar: "https://i.ibb.co/86GB8LZ/images.jpg"
                })
            }
			const fetchedLogs = await deletedMessage.guild.fetchAuditLogs({
				limit: 1,
				type: 'MESSAGE_DELETE'
				}).catch(() => ({
				entries: []
				}));
			
			const deleteLog = fetchedLogs.entries.first()
			const { executor } = deleteLog

			const Embed = new MessageEmbed()
				.setAuthor(`${deletedMessage.author.tag} - Message Deleted`, deletedMessage.author.displayAvatarURL({dynamic: false, type: "png", size: 1024}))
				.setDescription(`**User** - ${deletedMessage.author} \`${deletedMessage.author.tag}\` \n**Channel** - ${deletedMessage.channel} \`${deletedMessage.channel.name}\` \n${deletedMessage}`)
				.setTimestamp()
				.setFooter(`User ID: ${deletedMessage.author.id}`)
				.setColor("#fa5757")
			webHook.send({embeds: [Embed]})
		})
	}catch(err){
		return console.log(err)
	}
    }
}