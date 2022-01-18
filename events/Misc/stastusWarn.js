const Discord = require('discord.js');
const { Profiles, Guild } = require('../../models');
const moment = require("moment");
const session = new Map()
module.exports = {
    event: 'messageCreate',
    once: false,
    run: async(message, client) =>{
    try {
        message.mentions.users.forEach(async (user) => {
            if (message.author.bot) return false;
            if(message.deleted == true) return
            if (
                message.content.includes('@here') ||
                message.content.includes('@everyone')
            ) return false;
            if(user.id === message.author.id) return false;

            if(user.id == client.user.id){
                clientPrefix(message);
            }

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
                        .setAuthor({name: user.tag, iconURL: user.displayAvatarURL({
                            dynamic: true , format: 'png'
                        })})
                        .setDescription(`> ${data.Status.MSG}`)
                        .setColor("#fffafa")
                        .setFooter(Time)
                    message.channel.send({embeds: [EMBED]}).then(m=>setTimeout(() => m.delete(), 1000 * 10));

                    session.set(message.guild.id);
                    setTimeout(() => {
                    session.delete(message.guild.id);
                    }, 1000 * 20);
                }
            }
        });
    }catch(err){
        return console.log(err)
    }
    }
}

async function clientPrefix(message){
    let shorten = message.content.split(/ +/g)
    if(shorten[1]) return
    await Guild.findOne({
        guildID: message.guild.id
    })
    .then(res => {
        if(!res) return;

        if(!res.prefix) return

        message.channel.send({content: `My prefix for ${message.guild.name}: \` ${res.prefix} \` | \` ${res.prefix}help \``})
    })
    .catch(err => {
        return console.log(err.stack)
    })
}