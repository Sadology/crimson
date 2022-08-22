const client = require('../..');
const {MessageEmbed} = require('discord.js');
const moment = require('moment');
const { WebhookManager } = require('../../Functions');
const ms = require('ms');

client.on("guildMemberRemove", async(member) => {
    if(client.user.id == member.user.id) return;
    const roles = member.roles.cache
        .sort((a, b) => b.position - a.position)
        .map(role => role.toString())
        .slice(0, -1); 

    let Embed = new MessageEmbed()
        .setAuthor({name: "Member Left", iconURL: member.user.displayAvatarURL({dynamic: true, format: 'png'})})
        .setThumbnail(member.user.displayAvatarURL({dynamic: true, format: 'png'}))
        .setDescription(`<:user_icon:1011170605636259921> ${member.user} • ${member.user.tag}`)
        .addField("<:clock:1011170596719173692> Joined At", `${moment(member.joinedAt).format('MMMM Do YYYY, h:mm:ss a')} - ${moment(member.joinedAt, "YYYYMMDD").fromNow()}`, true)
        .addField("<:roles:1011184351737819226> Roles", `${roles.length ? roles.join(', ') : "None"}`)
        .setColor('RED')
        .setFooter({text: `ID • ${member.user.id}`})
        .setTimestamp()

    new WebhookManager(client, member.guild).WebHook(Embed, 'memberlog');
})