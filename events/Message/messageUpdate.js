const { MessageEmbed } = require('discord.js');
const { GuildChannel } = require('../../models');
const { errLog } = require('../../Functions/erroHandling');
module.exports = {
	event: 'messageUpdate',
	once: false,
	disabled: true,
	run: async(oldMessage, newMessage) => {
		
		if(oldMessage.channel.type === 'dm') return;
		if(oldMessage.author.bot) return;

		if(!oldMessage.guild.me.permissions.has("VIEW_AUDIT_LOG", "ADMINISTRATOR")){
			return false;
		}

		if(oldMessage.cleanContent.length >= 1000) return;
		if(newMessage.cleanContent.length >= 1000) return;

		const { guild } = oldMessage;

		const Data = await GuildChannel.findOne({
			guildID: guild.id,
			Active: true,
			"MessageLog.EditEnabled": true
		});

		if(Data) {

			const roleSet = Data.MessageLog.IgnoreRoles;
			const chanSet = Data.MessageLog.IgnoreChannels;
			const messageEx = await guild.members.fetch(oldMessage.author.id);

			if(messageEx){
				if(messageEx.roles.cache.some(r=>roleSet.includes(r.id))){
					return false
				}
			}
			let search = chanSet.find(i => oldMessage.channel.id.includes(i))
			if(search){
				return false
			};

			const dataChannel = Data.MessageLog.MessageEdit;
			const Embed = new MessageEmbed()
				.setAuthor(`${newMessage.author.tag} - Message Edited`, newMessage.author.displayAvatarURL({dynamic: false, type: "png", size: 1024}))
				.setDescription(`User ${newMessage.author} \`${newMessage.author.tag}\` in ${oldMessage.channel} \`${oldMessage.channel.name}\``)
				.addField("Before", `${oldMessage.toString()}`)
				.addField("After", `${newMessage.toString()}`)
				.setTimestamp()
				.setFooter(`User ID: ${oldMessage.author.id}`)
				.setColor("#fcdb35")

				if(dataChannel){
					const LogChannel = oldMessage.guild.channels.cache.find(c => c.id === dataChannel)
					if(LogChannel){
						try {
							if(!oldMessage.guild.me.permissionsIn(LogChannel).has("VIEW_CHANNEL", "SEND_MESSAGES")){
								return
							}
							LogChannel.send({embeds: [Embed]})
						} catch (err) {
							errLog(err.stack.toString(), "text", "MessageUpdate", "Error in sending data");
						}
					}else {
						return;
					}
				}else {
					return;
				};
		}else {
			return;
		}

	}
};