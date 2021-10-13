const Discord = require('discord.js');
const { commandUsed } = require('../../Functions/CommandUsage');
const { permission } = require('../../Functions/CommandPerms');
const { GuildRole } = require('../../models');
const {Member} = require('../../Functions/MemberFunction');
module.exports = {
    name: 'unban',
    description: "Unbans a banned member",
    permissions: ["BAN_MEMBERS"],
    usage: "unban [ member ]",
    category: "Moderation",

    run: async(client, message, args,prefix) =>{
        if(message.guild.me.permissions.has(["MANAGE_MESSAGES"])){
            await message.delete();
        }

        if(!message.member.permissions.has("BAN_MEMBERS")){
            return message.author.send('None of your role proccess to use this command')
        }

        const { guild, content, channel, author } = message;
        const ErrorEmbed = {
            color: "#fffafa",
            author: {
                name: `Command - UnBan`,
                icon_url: client.user.displayAvatarURL({dynamic: false, format: "png", size: 1024})
            },
            description: `Unban a banned member from the server. 
            \n**Usage:** \`${prefix}unban [ Member ]\` \n**Example:** \`${prefix}unban @shadow~\``,
            footer: {
                text: "Bot require \"Ban_Members\" permission"
            },
            timestamp: new Date()
        }

        if( !args.length ){
            return message.channel.send({embeds: [ErrorEmbed]}).then(m=>setTimeout(() => m.delete(), 1000 * 60))
        };

        if(!args[0]){
            return message.channel.send({embeds: [
                new Discord.MessageEmbed()
                    .setDescription(`Please mention a member. \n\n**Usage:** ${prefix}unban [ user ]`)
            ]}).then(m=>setTimeout(() => m.delete(), 1000 * 20))
        }

        const getMembers = new Member(args[0], message);
        await message.guild.members.fetch();

        function findMember(Member){
            try {
                if(Member){
                    const member = message.guild.members.cache.get(Member);

                    if(member){
                        return message.channel.send({embeds: [
                            new Discord.MessageEmbed()
                                .setDescription(`${member} is not banned`)
                                .setColor("RED")
                        ]}).then(m=>setTimeout(() => m.delete(), 1000 * 30))
                    } else {
                        UnBan(Member);
                    }
                }else {
                    message.channel.send({embeds: [new Discord.MessageEmbed()
                        .setDescription(`Please mention a valid member.`)
                        .setColor("RED")
                    ]}).then(m=>setTimeout(() => m.delete(), 1000 * 30))
                }
            }catch(err){
                message.channel.send({embeds: [new Discord.MessageEmbed()
                    .setDescription(err.message)
                    .setColor("RED")
                ]})
                return console.log(err);
            }

        }

        async function UnBan(Member){
            try {
                await message.guild.bans.fetch().then(bans=> {
                    if(bans.size == 0) return
                    let bUser = bans.find(b => b.user.id == Member)
                    if(!bUser) {
                        return message.channel.send({embeds: [new Discord.MessageEmbed()
                            .setDescription(`${Member} is not Banned`)
                            .setColor("RED")
                        ]}).then(m=>setTimeout(() => m.delete(), 1000 * 30))
                    }else {
                        message.guild.members.unban(Member)
                    }
                });

                return message.channel.send({embeds: [new Discord.MessageEmbed()
                    .setDescription(`<@${Member}> is UnBanned from the server`)
                    .setColor( "#45f766" )
                ]
                }).then(m=>setTimeout(() => m.delete(), 1000 * 30))
                
            }catch(err){
                message.channel.send({embeds: [new Discord.MessageEmbed()
                    .setDescription(err.message)
                    .setColor("RED")
                ]})
                return console.log(err)
            }
        }

        findMember(getMembers.mentionedMember)
    }
}