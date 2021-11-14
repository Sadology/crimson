const Discord = require('discord.js');
const { ModStats } = require('../../models');
const moment = require("moment");
const ms = require('ms')
module.exports = {
    event: 'messageCreate',
    once: false,
    run: async(message, client) =>{
        message.mentions.users.forEach(async (user) => {
            const DB = await ModStats.findOne({
                    guildID: message.guild.id,
                    userID: user.id,
                    'Status.Active': true
                })

            if (message.author.bot) return false;
          
            if (
                message.content.includes('@here') ||
                message.content.includes('@everyone')
            )
            return false;

            if(user.id === message.author.id) return false;

            if(!DB) return false

            if(DB.Status.Active === true ) {
                let Time = moment(DB.Status.Time).format("lll") + ' - ' +moment(DB.Status.Time, "YYYYMMDD").fromNow()
                const EMBED = new Discord.MessageEmbed()
                    .setAuthor(user.tag, user.displayAvatarURL({
                        dynamic: true , type: 'png'
                    }))
                    .setDescription(`> ${DB.Status.MSG}`)
                    .setColor("#fffafa")
                    .setFooter(Time)
                message.channel.send({embeds: [EMBED]}).then(m=>setTimeout(() => m.delete(), 1000 * 10));
            }
        });
    }
}