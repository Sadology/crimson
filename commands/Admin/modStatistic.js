const Discord = require('discord.js');
const { ModStats } = require('../../models')
module.exports = {
    name: 'mod-stats',
    aliases: ["modstats"],
    description: "Moderators statistic. Moderation data of all time.",
    permissions: ["ADMINISTRATOR"],
    usage: "mod-stats [ user ]",
    category: "Administrator",
    
    run: async(client, message, args,prefix) =>{
        await message.delete();

        if(!message.member.permissions.has("ADMINISTRATOR")){
            return message.author.send('None of your role proccess to use this command')
        }

        const findMember = message.content.split(/\s+/)[1];
        const member = findMember.replace('<@', '').replace('>', '').replace('!', '').trim();

        const regexx = /[\d+]/g
        if(!args[0].match( regexx )){
            return message.channel.send({embeds: [new Discord.MessageEmbed()
                .setAuthor(`${message.author.tag}`, message.author.displayAvatarURL({dynamic: false, size: 1024, type: "png"}))
                .setColor("#fc5947")
                .setDescription(`Please mention a valid Member.`)
            ]
            }).then(m=>setTimeout(() => m.delete(), 1000 * 10))
        }

        const errorEmbed = {
            author: {name: "Command - Mod Statictic"},
            description: `Mention a moderator to check their stats \n\n**Usage:** \`${prefix}modstats [ user ]\` \n**Example:** \`${prefix}modstats @shadow~\``,
            color: "#fc5947"
        };

        const regex = /[\d]/g;
        if(member.match(regex)){
            const Moderator = message.guild.members.cache.get(member)

            if(Moderator){
                const DB = await ModStats.findOne({
                    guildID: message.guild.id,
                    userID: Moderator.user.id
                })
        
                if(!DB){
                    return message.channel.send({embeds: [
                        errorEmbed
                    ]})
                }else {
                    const Embed = new Discord.MessageEmbed()
                        .setAuthor(`${Moderator.user.tag} - Moderation activities`, Moderator.user.displayAvatarURL({dynamic: true, size: 1024, type: 'png'}))
                        .addField("Recent command used", `\`\`\`${DB.Recent ? DB.Recent : "None"}\`\`\``)
                        .addField("Mute", `\`\`\`${DB.Mute.toString() ? DB.Mute.toString() : "0"}\`\`\``, true)
                        .addField("Warn", `\`\`\`${DB.Warn.toString() ? DB.Warn.toString() : "0"}\`\`\``, true)
                        .addField("Message Purgeed", `\`\`\`${DB.Purge.toString() ? DB.Purge.toString(): "0"}\`\`\``,true)
                        .addField("Message Cleaned", `\`\`\`${DB.Clean.toString() ? DB.Clean.toString() : "0"}\`\`\``,true)
                        .addField("Kick", `\`\`\`${DB.Kick.toString() ? DB.Kick.toString() : "0"}\`\`\``,true)
                        .addField("Ban", `\`\`\`${DB.Ban.toString() ? DB.Ban.toString() : "0"}\`\`\``,true)
                        .addField("Total Command", `\`\`\`${DB.Command.toString() ? DB.Command.toString() : "0"}\`\`\``,true)
                        .addField("Status", `\`\`\`${DB.Status.Active ? DB.Status.Active : "False"}\`\`\``,true)
                        .setColor("#fffafa")
        
                    await message.channel.send({embeds: [Embed]})
                }
            }else {
                message.channel.send({embeds: [errorEmbed]})
            }
        }  
    }
}