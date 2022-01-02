const Discord = require('discord.js');
const { Member } = require('../../Functions');
const Canvas = require('canvas');
const canvacord = require("canvacord");
const { Guild, Profiles } = require('../../models');
const axios = require('axios')
const Readable = require('stream').Readable
module.exports = {
    name: 'rank',
    aliases: ['ranks', 'level'],
    description: "check your rank in the server",
    permissions: ["SEND_MESSAGES"],
    botPermission: ["SEND_MESSAGES", "ATTACH_FILES", "EMBED_LINKS"],
    usage: "rank [ user (optional)]",
    category: "Ranks",
    cooldown: 3000,
    run: async(client, message, args,prefix) =>{
        return message.channel.send("Coming soon...")
        let img
        await Guild.findOne({
            guildID: message.guild.id,
        }).then((res) => {
            if(res){
                img = res.RankSettings.GuildCard
            }
        })
        let ranks = 0
        await Profiles.find({
            guildID: message.guild.id,
        }).sort([
            ['Rank','descending']
        ]).exec((err, res) => {
            if(err) return console.log(err.stack);
            if(res.length === 0 ){
                return message.channel.send({embeds: [
                    new Discord.MessageEmbed()
                        .setDescription(`No ranks yet :/.`)
                        .setColor("RED")
                ]}).then(m => setTimeout(() => m.delete(), 1000 * 20))
            }else {
                let arr = []
                for (i=0; i < res.length; i++){
                    arr.push(res[i].userID)
                }

                console.log(arr)
                ranks = arr.indexOf(`${message.author.id}`) + 1
            }
        })

        await Profiles.findOne({
            guildID: message.guild.id,
            userID: message.author.id
        }).then((res) => {
            const rank = new canvacord.Rank()
                .setAvatar(message.author.displayAvatarURL({dynamic: false, format: 'png'}))
                .setBackground("IMAGE",img)
                .setOverlay('','',false)
                .setRank(ranks)
                .setCurrentXP(res.Rank.Experience ? res.Rank.Experience : 0)
                .setRequiredXP(res.Rank.NextLvlExp ? res.Rank.NextLvlExp : 0)
                .setLevel(res.Rank.Level ? res.Rank.Level : 0)
                .setProgressBar("#363636", "COLOR")
                .setUsername(message.author.username, "#ffffff")
                .setLevelColor("#ffffff", "#ffffff")
                .setProgressBarTrack("#ffffff")
                .setDiscriminator(message.author.discriminator);
        
            rank.build()
                .then(data => {
                    const attachment = new Discord.MessageAttachment(data, `${message.author}/RankCard.png`);
                    message.channel.send({files: [attachment]}).catch(err => {return console.log(err.stack)})
                });
        })
    }
}