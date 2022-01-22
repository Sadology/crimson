const Discord = require('discord.js');
const moment = require('moment');
const { Member } = require('../../Functions');
module.exports = {
    name: 'whois',
    aliases: ['userinfo', 'user-info',],
    description: "Check a members information",
    permissions: ["SEND_MESSAGES"],
    botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
    category: "Utils",
    usage: "whois [ user ]",
    cooldown: 3000,
    run: async(client, message, args,prefix) =>{
        let member
        if(!args.length){
            member = message.member
        }
        member = new Member(message, client).getMemberWithoutErrHandle({member: args[0]})
        if(member == false) member = await message.channel.guild.members.fetch({cache : true}).then(members=>members.find(member=>member.user.tag.split(" ").join('').toLowerCase() == message.content.split(" ").slice(1).join('').toLowerCase()))
        
        if(!member) member = message.member

        getInfo(member)

        function getInfo(Member) {
            let isOwner;
            let device = "None";
            if(message.guild.ownerId === Member.user.id){
                isOwner = "Yes"
            }else {
                isOwner = "No"
            }

            if(Member.presence){
                device = Object.keys(Member.presence.clientStatus)
            }

            let roles = Member.roles.cache
                .sort((a,b) => b.position - a.position)
                .map(role => role.toString())
                .slice(0, -1)
                .join(', ') || "None"

            let Embed = new Discord.MessageEmbed()
                .setAuthor({name: Member.user.tag, iconURL: Member.user.displayAvatarURL({dynamic: true, size: 1024, type: 'png'})})
                .setThumbnail(Member.user.avatarURL({dynamic: true, size: 1024, type: 'png'}) ? Member.user.avatarURL({dynamic: true, size: 1024, type: 'png'}) : Member.user.displayAvatarURL({dynamic: true, size: 1024, type: 'png'}))
                .addField("Join Data", `${moment(Member.joinedAt).format('MMMM Do YYYY, h:mm:ss a')} - ${moment(Member.joinedAt, "YYYYMMDD").fromNow()}`, true)
                .addField("Creation Data", `${moment(Member.user.createdAt).format('MMMM Do YYYY, h:mm:ss a')} - ${moment(Member.user.createdAt, "YYYYMMDD").fromNow()}`, true)
                .addField("Server Booster", `${Member.premiumSince ? moment(Member.premiumSince).format('MMMM Do YYYY, h:mm:ss a') : "Not a booster"}`, true)
                .addField("Server Owner", `${isOwner}`, true)
                .addField("Avatar URL", `[URL](${Member.user.displayAvatarURL()})`, true)
                .addField("Presence", `${Member.presence ? Member.presence.status : "offline"}`, true)
                .addField("Current Device", `${device.toString()}`, true)
                .addField(`Roles [${Member.roles.cache.size - 1}]`, `${roles}`)
                .setFooter({text: "User ID: "+Member.user.id})
                .setTimestamp()
                .setColor(Member.displayColor ? Member.displayColor : "WHITE")

            message.channel.send({embeds: [ Embed ]}).catch(err =>{
                return console.log(err.stack)
            })
        }
    }
};