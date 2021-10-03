const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');
const { GuildChannel } = require('../../models');
const { errLog } = require('../../Functions/erroHandling');
module.exports = {
    event: "MESSAGE_DELETE",
    once: false,
	disabled: true,
    run: async(message)=> {
        if(message.channel.type === 'dm') return;
		if(message.author.bot) return;

		if(!message.guild.me.permissions.has("VIEW_AUDIT_LOG", "ADMINISTRATOR")){
			return false;
		}

		if(message.cleanContent.length >= 1000) return

		await Discord.Util.delayFor(900);

        LogChannel("banLog", guild).then(async c => {
            if(!c) return;
            if(c === null) return;

            else {
				const fetchedLogs = await message.guild.fetchAuditLogs({
					limit: 1,
					type: 'MESSAGE_DELETE'
				  }).catch(() => ({
					entries: []
				  }));
				
				const deleteLog = fetchedLogs.entries.first()
				const { executor } = deleteLog
	
				const roleSet = Data.MessageLog.IgnoreRoles;
				const chanSet = Data.MessageLog.IgnoreChannels;
				const messageEx = await message.guild.members.fetch(executor.id);
	
				if(messageEx){
					if(messageEx.roles.cache.some(r=>roleSet.includes(r.id))){
						return false
					}
				}
				let search = chanSet.find(i => message.channel.id.includes(i))
				if(search){
					return false
				}
				const Embed = new MessageEmbed()
					.setAuthor(`${message.author.tag} - Message Deleted`, message.author.displayAvatarURL({dynamic: false, type: "png", size: 1024}))
					.setDescription(`**User** - ${message.author} \`${message.author.tag}\` \n**Channel** - ${message.channel} \`${message.channel.name}\` \n${message}`)
					.setTimestamp()
					.setFooter(`User ID: ${message.author.id}`)
					.setColor("#fa5757")
			}
		})
    }
}