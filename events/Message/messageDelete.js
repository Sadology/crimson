const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');
const { LogManager } = require('../../Functions');
module.exports = {
    event: "messageDelete",
    once: false,
    run: async(deletedMessage, client)=> {
		if(deletedMessage.guild.me.roles.cache.size == 1 && deletedMessage.guild.me.roles.cache.find(r => r.name == '@everyone')){
            return
        }
		if(!deletedMessage.guild.me.permissions.has("VIEW_AUDIT_LOG")){
            return
        }
		try{
			if(deletedMessage.channel.type === 'dm') return;
			if(deletedMessage.author.bot) return;

			if(!deletedMessage.guild.me.permissions.has("VIEW_AUDIT_LOG", "ADMINISTRATOR")){
				return false;
			}

			if(deletedMessage.cleanContent.length >= 1000) return
			await Discord.Util.delayFor(900);

			const Embed = new MessageEmbed()
				.setAuthor(`${deletedMessage.author.tag} - Message Deleted`, deletedMessage.author.displayAvatarURL({dynamic: false, type: "png", size: 1024}))
				.setDescription(`**User** - ${deletedMessage.author} \`${deletedMessage.author.tag}\` \n**Channel** - ${deletedMessage.channel} \`${deletedMessage.channel.name}\` \n${deletedMessage}`)
				.setTimestamp()
				.setFooter(`User ID: ${deletedMessage.author.id}`)
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