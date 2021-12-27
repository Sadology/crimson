const Discord = require('discord.js');
const { Member } = require('../../Functions');
const Canvas = require('canvas');
const canvacord = require("canvacord");
const { Guild, Profiles } = require('../../models');

module.exports = {
    name: 'rank',
    aliases: ['ranks', 'level'],
    description: "check your rank in the server",
    permissions: ["SEND_MESSAGE"],
    botPermission: ["SEND_MESSAGES", "ATTACH_FILES"],
    usage: "rank [ user (optional)]",
    category: "Ranks",
    cooldown: 3000,
    run: async(client, message, args,prefix) =>{
        return message.channel.send("Comming soon...")
        // let img
        // await Guild.findOne({
        //     guildID: message.guild.id,
        // }).then((res) => {
        //     if(res){
        //         img = res.RankSettings.GuildCard
        //     }
        // })

        // await Profiles.findOne({
        //     guildID: message.guild.id,
        //     userID: message.author.id
        // }).then((res) => {
        //     const rank = new canvacord.Rank()
        //         .setAvatar(message.author.displayAvatarURL({dynamic: false, format: 'png'}))
        //         .setBackground("IMAGE",img)
        //         .setOverlay('','',false)
        //         .setCurrentXP(res.Rank.Experience ? res.Rank.Experience : 0)
        //         .setRequiredXP(res.Rank.NextLvlExp ? res.Rank.NextLvlExp : 0)
        //         .setLevel(res.Rank.Level ? res.Rank.Level : 0)
        //         .setProgressBar("#9382ff", "COLOR")
        //         .setUsername(message.author.username, "#220abf")
        //         .setLevelColor("#82ffec", "#8288ff")
        //         .setProgressBarTrack("#f382ff")
        //         .setDiscriminator(message.author.discriminator);
        
        //     rank.build()
        //         .then(data => {
        //             const attachment = new Discord.MessageAttachment(data, "RankCard.png");
        //             message.channel.send({files: [attachment]}).catch(err => {return console.log(err.stack)})
        //         });
        // })
    }
}