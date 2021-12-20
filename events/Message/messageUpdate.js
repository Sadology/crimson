const { MessageEmbed } = require('discord.js');
const { GuildChannel } = require('../../models');
const { errLog } = require('../../Functions/erroHandling');
const { LogManager } = require('../../Functions');
module.exports = {
	event: 'messageUpdate',
	once: false,
	run: async(oldMessage, newMessage, client) => {
		if(!oldMessage.guild.me.permissions.has("VIEW_AUDIT_LOG")){
            return
        }
		try{
			if(oldMessage.channel.type === 'dm') return;
			if(oldMessage.author.bot) return;

			if(!oldMessage.guild.me.permissions.has("VIEW_AUDIT_LOG", "ADMINISTRATOR")){
				return false;
			}

			if(oldMessage.cleanContent.length >= 1000) return;
			if(newMessage.cleanContent.length >= 1000) return;

			const { guild } = oldMessage;

			const Embed = new MessageEmbed()
				.setAuthor(`${newMessage.author.tag} - Message Edited`, newMessage.author.displayAvatarURL({dynamic: false, type: "png", size: 1024}))
				.setDescription(`User ${newMessage.author} \`${newMessage.author.tag}\` in ${oldMessage.channel} \`${oldMessage.channel.name}\``)
				.addField("Before", `${oldMessage}`.toString())
				.addField("After", `${newMessage}`.toString())
				.setTimestamp()
				.setFooter(`User ID: ${oldMessage.author.id}`)
				.setColor('YELLOW')

			new LogManager(guild).sendData({type: 'messagelog', data: Embed, client})
		}catch(err){
			return console.log(err.stack)
		}
	}
};