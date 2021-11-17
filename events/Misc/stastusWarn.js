const Discord = require('discord.js');
const { Profiles } = require('../../models');
const moment = require("moment");
const session = new Map()
module.exports = {
    event: 'messageCreate',
    once: false,
    run: async(message, client) =>{
        message.mentions.users.forEach(async (user) => {
            if (message.author.bot) return false;
            if (
                message.content.includes('@here') ||
                message.content.includes('@everyone')
            ) return false;
            if(user.id === message.author.id) return false;

            fetchData()
            async function fetchData() {
                await Profiles.findOne({
                    guildID: message.guild.id,
                    userID: user.id,
                    'Status.Active': true
                }).then((res) => {
                    if(!res) return

                    else showData(res)
                })
            }

            function showData(data) {
                if (session.has(message.guild.id)) {
                    return
                } else {
                    let Time = moment(data.Status.Time).format("lll") + ' - ' +moment(data.Status.Time, "YYYYMMDD").fromNow()
                    const EMBED = new Discord.MessageEmbed()
                        .setAuthor(user.tag, user.displayAvatarURL({
                            dynamic: true , type: 'png'
                        }))
                        .setDescription(`> ${data.Status.MSG}`)
                        .setColor("#fffafa")
                        .setFooter(Time)
                    message.reply({embeds: [EMBED]}).then(m=>setTimeout(() => m.delete(), 1000 * 10));

                    session.set(message.guild.id);
                    setTimeout(() => {
                    session.delete(message.guild.id);
                    }, 1000 * 15);
                }
            }
        });
    }
}