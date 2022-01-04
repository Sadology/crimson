const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');
const { LogManager } = require('../../Functions');
const wait = require('util').promisify(setTimeout);
module.exports = {
    event: "messageDelete",
    once: false,
    run: async(deletedMessage, client)=> {
		try{
			if(deletedMessage.channel.type === 'dm') return;
			if(deletedMessage.author.bot) return;
			
			const clientPerm = deletedMessage.guild.members.resolve( client.user ).permissions.any("VIEW_AUDIT_LOG");
			if (!clientPerm || clientPerm == false) return

			if(!deletedMessage.guild.me.permissions.has("VIEW_AUDIT_LOG", "ADMINISTRATOR")){
				return false;
			}

			if(deletedMessage.cleanContent.length >= 1000) return
			wait(1000);

			const Embed = new MessageEmbed()
				.setAuthor(`${deletedMessage.author.tag} - Message Deleted`, deletedMessage.author.displayAvatarURL({dynamic: false, type: "png", size: 1024}))
				.setDescription(`**User** - ${deletedMessage.author} \`${deletedMessage.author.tag}\` \n**Channel** - ${deletedMessage.channel} \`${deletedMessage.channel.name}\` \n${deletedMessage}`)
				.setTimestamp()
				.setFooter({
					text: `User ID: ${deletedMessage.author.id}`
				})
				.setColor("#fa5757")

			if(deletedMessage.attachments){
				deletedMessage.attachments.find(i => {
					Embed.setImage(i.url)
				})
			}
			new LogManager(deletedMessage.guild).sendData({type: 'messagelog', data: Embed, client})
		}catch(err){
			return console.log(err.stack)
		}
    }
}