const { MessageEmbed } = require('discord.js');
const { WebhookManager } = require('../../Functions');
const wait = require('util').promisify(setTimeout);
const client = require('../../index');

client.on('messageDelete', async(deletedMessage) => {
	if(deletedMessage.channel.type === 'dm') return;
	if(deletedMessage.author.bot) return;

	if(!deletedMessage.guild.members.resolve(client.user).permissions.any(["VIEW_AUDIT_LOG", "ADMINISTRATOR"])){
		return false;
	};

	if(deletedMessage.cleanContent.length >= 1000) return;
	wait(1000);

	const Embed = new MessageEmbed()
		.setAuthor({name: `${deletedMessage.author.tag} • Message Deleted`, iconURL: deletedMessage.author.displayAvatarURL({dynamic: false, format: "png", size: 1024})})
		.setDescription(`**User** - ${deletedMessage.author} \`${deletedMessage.author.tag}\` \n**Channel** - ${deletedMessage.channel} \`${deletedMessage.channel.name}\` \n${deletedMessage}`)
		.setTimestamp()
		.setFooter({
			text: `User-ID • ${deletedMessage.author.id}`
		})
		.setColor("#fa5757")

	if(deletedMessage.attachments){
		deletedMessage.attachments.find(i => {
			Embed.setImage(i.url)
		})
	}

	new WebhookManager(client, deletedMessage.guild).WebHook(Embed, 'messagelog')
});