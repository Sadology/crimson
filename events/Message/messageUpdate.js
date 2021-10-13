const { MessageEmbed } = require('discord.js');
const { GuildChannel } = require('../../models');
const { errLog } = require('../../Functions/erroHandling');
const { LogChannel } = require('../../Functions/logChannelFunctions');
module.exports = {
	event: 'messageUpdate',
	once: false,
	run: async(oldMessage, newMessage) => {
	try{
		if(oldMessage.channel.type === 'dm') return;
		if(oldMessage.author.bot) return;

		if(!oldMessage.guild.me.permissions.has("VIEW_AUDIT_LOG", "ADMINISTRATOR")){
			return false;
		}

		if(oldMessage.cleanContent.length >= 1000) return;
		if(newMessage.cleanContent.length >= 1000) return;

		const { guild } = oldMessage;

		LogChannel("messageLog", oldMessage.guild).then(async c => {
            if(!c) return;
            if(c === null) return;

            else {
				const fetchedLogs = await oldMessage.guild.fetchAuditLogs({
					limit: 1,
					type: 'MESSAGE_UPDATE'
				  }).catch(() => ({
					entries: []
				  }));
				
				const deleteLog = fetchedLogs.entries.first()
				const { executor } = deleteLog
	
				const Embed = new MessageEmbed()
				.setAuthor(`${newMessage.author.tag} - Message Edited`, newMessage.author.displayAvatarURL({dynamic: false, type: "png", size: 1024}))
				.setDescription(`User ${newMessage.author} \`${newMessage.author.tag}\` in ${oldMessage.channel} \`${oldMessage.channel.name}\``)
				.addField("Before", `${oldMessage}`.toString())
				.addField("After", `${newMessage}`.toString())
				.setTimestamp()
				.setFooter(`User ID: ${oldMessage.author.id}`)
				.setColor("#fcdb35")

				c.send({embeds: [Embed]})
			}
		})
	}catch(err){
		return console.log(err)
	}

	}
};