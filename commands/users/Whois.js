const Discord = require('discord.js');
const moment = require('moment');
const {Member} = require('../../Functions/MemberFunction');
module.exports = {
    name: 'whois',
    aliases: ['userinfo', 'user-info',],
    description: "Check a members information",
    permissions: ["SEND_MESSAGES"],
    botPermission: ["SEND_MESSAGES"],
    category: "Utils",
    usage: "whois [ user ]",
    cooldown: 3000,
    run: async(client, message, args,prefix) =>{
        const FindMembers = new Member(args[0], message);
        message.guild.members.fetch()

        async function fetchMember(member) {
            if(!member){
                getInfo(message.member)
            }else {
                let Member = message.guild.members.cache.get(member) || await message.channel.guild.members.fetch({cache : false}).then(members=>members.find(member=>member.user.tag === args[0]))
                if(Member){
                    getInfo(Member)
                }else {
                    getInfo(message.member)
                }
            }
        }

        function getInfo(Member) {
            let isOwner;
            let device = "None";
            if(message.guild.ownerId === Member.user.id){
                isOwner = true
            }else {
                isOwner = false
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
                .setAuthor(Member.user.tag, Member.user.displayAvatarURL({dynamic: true, size: 1024, type: 'png'}))
                .setThumbnail(Member.user.avatarURL({dynamic: true, size: 1024, type: 'png'}) ? Member.user.avatarURL({dynamic: true, size: 1024, type: 'png'}) : Member.user.displayAvatarURL({dynamic: true, size: 1024, type: 'png'}))
                .addFields(
                    {
                        name: "Join Date",
                        value: `${moment(Member.joinedAt).format('MMMM Do YYYY, h:mm:ss a')} - ${moment(Member.joinedAt, "YYYYMMDD").fromNow()}`,
                        inline: true
                    },
                    {
                        name: "Creation Date",
                        value: `${moment(Member.user.createdAt).format('MMMM Do YYYY, h:mm:ss a')} - ${moment(Member.user.createdAt, "YYYYMMDD").fromNow()}`,
                        inline: true  
                    },
                    {
                        name: "Nitro booster",
                        value: `${Member.premiumSince ? moment(Member.premiumSince).format('MMMM Do YYYY, h:mm:ss a') : "Not a booster"}`,
                        inline: true
                    },
                    {
                        name:"Owner",
                        value: isOwner.toString(),
                        inline: true
                    },
                    {
                        name:"Avatar URL",
                        value: `[URL](${Member.user.displayAvatarURL()})`,
                        inline: true
                    },
                    {
                        name:"Presence",
                        value: `${Member.presence ? Member.presence.status : "offline"}`,
                        inline: true
                    },
                    {
                        name:"Current device",
                        value: `${device}`,
                        inline: true
                    },
                    {
                        name: `Roles[${Member.roles.cache.size - 1}]`,
                        value: `${roles}`
                    }
                    )
                .setColor(Member.displayColor)

            message.channel.send({embeds: [ Embed ]})
        }
        if(args.length && args[0]){
            fetchMember(FindMembers.mentionedMember)
        }else {
            fetchMember()
        }
    }
};