const client = require('../..');
const { MessageEmbed } = require('discord.js');
const moment = require('moment');
const { WebhookManager } = require('../../Functions');
const { Messages } = require('../../localDb');

client.on("guildMemberAdd", async(member) => {
    let Embed = new MessageEmbed()
        .setAuthor({name: "Member Joined", iconURL: member.user.displayAvatarURL({dynamic: true, format: 'png'})})
        .setThumbnail(member.user.displayAvatarURL({dynamic: true, format: 'png'}))
        .setDescription(`<:user_icon:958016031127904307> ${member.user} • ${member.user.tag}`)
        .addField("<:time:958254873906933820> Account age", `${moment(member.user.createdAt).format('MMMM Do YYYY, h:mm:ss a')} - ${moment(member.user.createdAt, "YYYYMMDD").fromNow()}`, true)
        .setColor("GREEN")
        .setFooter({text: `ID • ${member.user.id}`})
        .setTimestamp()

    new WebhookManager(client, member.guild).WebHook(Embed, 'memberlog');
})

client.on("guildMemberAdd", async(member) => {
    const { guild } = member;

    let GreetMessage;
    function getRandomMessage() {
        Messages.forEach(item => {
            if(item.TYPE == 'JOINED'){
                GreetMessage = item.MESSAGES[Math.floor(Math.random() * item.MESSAGES.length)];
            }
        })
    }

    function convertValue(Array) {
        return Array
        .replace(/{member}/g, `${member.user}`)
        .replace(/{member.id}/g, `${member.user.id}`)
        .replace(/{member.tag}/g, `${member.user.tag}`)
        .replace(/{member.name}/g, `${member.user.username}`)
        .replace(/{server}/g, `${guild.name}`)
        .replace(/{server.id}/g, `${guild.id}`)
    }
    getRandomMessage()

    let Embed = new MessageEmbed()
        .setAuthor({name: `${member.user.tag} - ${guild.memberCount.toLocaleString()}` , iconURL: `${member.user.displayAvatarURL({
            dynamic: true, 
            format: 'png'
        })}`})
        .setThumbnail(`${member.user.displayAvatarURL({
            dynamic: true , type: 'png', size: 1024
        })}`)
        .setFooter({text: "ID • "+member.user.id})
        .setTimestamp()
        .setColor("#2f3136")

    Embed.setDescription(`${convertValue(GreetMessage)}`)
    new WebhookManager(client, member.guild).WebHook(Embed, 'welcome');
    
})