const { MessageEmbed } = require('discord.js');
const { GuildChannel } = require('../../models');
const { errLog } = require('../../Functions/erroHandling');
const { LogManager } = require('../../Functions');
module.exports = {
	event: 'messageUpdate',
	once: false,
	run: async(oldMessage, newMessage, client) => {
		try{
			if(oldMessage.channel.type === 'dm') return;
			if(oldMessage.author.bot) return;
			
			const clientPerm = newMessage.guild.members.resolve( client.user ).permissions.any("VIEW_AUDIT_LOG");
			if (!clientPerm || clientPerm == false) return


			if(!oldMessage.guild.me.permissions.any("VIEW_AUDIT_LOG", "ADMINISTRATOR")){
				return false;
			}

			if(oldMessage.cleanContent.length >= 1000) return;
			if(newMessage.cleanContent.length >= 1000) return;

			const { guild } = oldMessage;

			const Embed = new MessageEmbed()
				.setAuthor({name: `${newMessage.author.tag} - Message Edited`, iconURL: newMessage.author.displayAvatarURL({dynamic: false, type: "png", size: 1024})})
				.setDescription(`User ${newMessage.author} \`${newMessage.author.tag}\` in ${oldMessage.channel} \`${oldMessage.channel.name}\`
				<:reply:897083777703084035> [Jump](https://discord.com/channels/${oldMessage.guild.id}/${oldMessage.channel.id}/${oldMessage.id})`)
				.addField("Before", `${oldMessage}`.toString())
				.addField("After", `${newMessage}`.toString())
				.setTimestamp()
				.setFooter({text: `User ID: ${oldMessage.author.id}`})
				.setColor('YELLOW')
			new LogManager(guild).sendData({type: 'messagelog', data: Embed, client})
		}catch(err){
			return console.log(err.stack)
		}
	}
};