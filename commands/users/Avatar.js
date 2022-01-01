const Discord = require('discord.js');
const { Member } = require('../../Functions');

module.exports = {
    name: 'avatar',
    aliases: ["av"],
    description: "check a members avatar",
    permissions: ["SEND_MESSAGES"],
    botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
    category: "Utils",
    usage: "avatar [ user ]",
    cooldown: 3000,
    run: async(client, message, args,prefix) =>{
        let member = new Member(message, client).getMemberWithoutErrHandle({member: args[0], clientMember: true})

        if(member.type == false){
            member = await message.channel.guild.members.fetch({cache : true}).then(members=>members.find(member=>member.user.tag.split(" ").join('').toLowerCase() == message.content.split(" ").slice(1).join('').toLowerCase()));
        }
        if(member){
            fetchAvatar(member, "user")
        }else {
            fetchAvatar()
        }

        function fetchAvatar(Member, type){
            switch(type){
                case 'user':
                    let Embed = new Discord.MessageEmbed()
                        .setAuthor(Member.user ? Member.user.tag : Member.tag, Member.user ? Member.user.displayAvatarURL({dynamic: true, type: "png"}): Member.displayAvatarURL({dynamic: true, type: "png"}))
                        .setTitle( "Avatar")
                        .setImage(Member.user ? Member.user.displayAvatarURL({dynamic: true, size: 4096, type: "png"}) : Member.displayAvatarURL({dynamic: true, size: 4096, type: "png"}))
                        .setColor("WHITE")
                    message.channel.send({embeds: [Embed]}).catch(err => {return console.log(err)})
                break;
                default:
                    let Embed2 = new Discord.MessageEmbed()
                        .setAuthor(message.author.tag, message.author.displayAvatarURL({dynamic: true, type: "png"}))
                        .setTitle( "Avatar")
                        .setImage(message.author.displayAvatarURL({dynamic: true, size: 4096, type: "png"}))
                        .setColor("WHITE")
                    message.channel.send({embeds: [Embed2]}).catch(err => {return console.log(err)})
            }
        }
    }
};