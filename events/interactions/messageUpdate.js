const { MessageEmbed } = require('discord.js');
const { WebhookManager } = require('../../Functions');
const client = require('../../index');

client.on('messageUpdate', async (oldMessage, newMessage) => {
	if(oldMessage.channel.type === 'dm') return;
	if(oldMessage.author.bot) return;

	if(!oldMessage.guild.members.resolve(client.user).permissions.any("VIEW_AUDIT_LOG", "ADMINISTRATOR")){
		return false;
	};

	if(oldMessage.cleanContent.length >= 1000) return;
	if(newMessage.cleanContent.length >= 1000) return;

	const Embed = new MessageEmbed()
		.setAuthor({name: `${newMessage.author.tag} - Message Edited`, iconURL: newMessage.author.displayAvatarURL({dynamic: false, type: "png", size: 1024})})
		.setDescription(`User ${newMessage.author} \`${newMessage.author.tag}\` in ${oldMessage.channel} \`${oldMessage.channel.name}\`\n<:reply:897083777703084035> [Jump](https://discord.com/channels/${oldMessage.guild.id}/${oldMessage.channel.id}/${oldMessage.id})`)
		.addField("Before", `${oldMessage}`.toString())
		.addField("After", `${newMessage}`.toString())
		.setTimestamp()
		.setFooter({text: `User ID: ${oldMessage.author.id}`})
		.setColor('YELLOW')
	
	new WebhookManager(client, oldMessage.guild).WebHook(Embed, 'messagelog')
});