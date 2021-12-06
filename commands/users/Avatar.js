const Discord = require('discord.js');
const { Member } = require('../../Functions/MemberFunction');

module.exports = {
    name: 'avatar',
    aliases: ["av"],
    description: "check a members avatar",
    permissions: ["SEND_MESSAGES"],
    botPermission: ["SEND_MESSAGES"],
    category: "Utils",
    usage: "avatar [ user ]",
    cooldown: 3000,
    run: async(client, message, args,prefix) =>{
        const FindMembers = new Member(args[0], message);
        message.guild.members.fetch(); 

        async function fetchMember(member) {
            if(!member){
                return fetchAvatar(message.member)
            }

            let Member = message.guild.members.cache.get(member) || await message.channel.guild.members.fetch({cache : false}).then(members=>members.find(member=>member.user.tag === args[0]))
            if(Member){
                fetchAvatar(Member)
            }else {
                fetchAvatar(message.member)
            }
        }

        function fetchAvatar(Member){
            let Embed = new Discord.MessageEmbed()
                .setAuthor(Member.user.tag,  Member.user.displayAvatarURL({dynamic: true, size: 1024, type: "png"}))
                .setTitle( "Avatar")
                .setImage(Member.user.avatarURL({dynamic: true, size: 4096, type: "png"}) ? Member.user.displayAvatarURL({dynamic: true, size: 4096, type: "png"}) : Member.user.displayAvatarURL({dynamic: true, size: 4096, type: "png"}))
                .setColor("#fffafa")
            message.channel.send({embeds: [Embed]})
        }

        if(args[0]){
            fetchMember(FindMembers.mentionedMember)
        }else {
            fetchMember()
        }
    }
};