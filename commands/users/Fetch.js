const Discord = require('discord.js');
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js')
const { LogsDatabase, GuildRole} = require('../../models')
const moment = require('moment');
const { errLog } = require('../../Functions/erroHandling');
const {Member} = require('../../Functions/MemberFunction');

module.exports = {
    name: 'seek',
    aliases: ["fetch",],
    description: "Find a member and check their informations",
    category: "Moderation",
    usage: "fetch [ user ]",
    run: async(client, message, args,prefix) =>{
        if(!args.length){
            return message.reply({embeds: [new MessageEmbed()
                .setAuthor(message.author.tag, message.author.displayAvatarURL({dynamic: false, type: 'png'}))
                .setDescription(`Please mention a member \n\n**Usage:** \`${prefix}seek [ member ]\``)
                .setColor("WHITE")
            ]
            }).then(m => setTimeout(() =>m.delete()), 1000 * 10)
        }

        const FindMembers = new Member(args[0], message);
        message.guild.members.fetch()
        const member = message.guild.members.cache.get(FindMembers.mentionedMember)

        const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setStyle("SUCCESS")
            .setLabel("More")
            .setCustomId("Info")
            .setEmoji("❔")
        )

        if(member){
            try {
                let count = await LogsDatabase.countDocuments({
                    guildID: message.guild.id, 
                    userID: member.user.id
                })

                const roles = member.roles.cache
                .sort((a,b) => b.position - a.position)
                .map(role => role.toString())
                .slice(0, -1)
                .join(', ') || "None"

                let array = member.permissions.toArray()

                const permFlag = [
                    "ADMINISTRATOR", 
                    "MANAGE_GUILD", 
                    "KICK_MEMBERS", 
                    "BAN_MEMBERS", 
                    "MANAGE_CHANNELS", 
                    "MANAGE_MESSAGES",
                    "MUTE_MEMBERS",
                    "DEAFEN_MEMBERS",
                    "MOVE_MEMBERS",
                    "MANAGE_NICKNAMES",
                    "MANAGE_ROLES",
                    "MANAGE_WEBHOOKS",
                    "MANAGE_EMOJIS",
                    "ADD_REACTIONS",
                    "VIEW_AUDIT_LOG"
                ]
                const perms = array.filter( i => permFlag.includes(i))
                const permArr = perms.join(", ")
                const permData = permArr.split("_").join(" ")

                const Embed = new MessageEmbed()
                    .setAuthor(`${member.user.tag}`, member.user.displayAvatarURL({
                        dynamic: true, 
                        type: 'png', 
                        size: 1024
                    }))
                    .setThumbnail(member.user.displayAvatarURL({
                        dynamic: true,
                        type: 'png',
                        size: 1024
                    }))
                    .addField('User', `\`\`\`${member.user.tag}\`\`\``, true)
                    .addField('User ID', `\`\`\`${member.user.id}\`\`\``, true)
                    .addField("Logs", count ? `\`\`\`${count}\`\`\`` : "\`\`\`0\`\`\`", true)
                    .addField('Created At', `\`\`\`${moment(member.user.createdAt).format('MMMM Do YYYY, h:mm:ss a')} - ${moment(member.user.createdAt, "YYYYMMDD").fromNow()}\`\`\``,true)
                    .addField('Joined at', `\`\`\`${moment(member.joinedAt).format('MMMM Do YYYY, h:mm:ss a')} - ${moment(member.joinedAt, "YYYYMMDD").fromNow()}\`\`\``,true)
                    .setColor(member.displayColor)

                const MSG = await message.channel.send({content:`${member.user}`,embeds: [ Embed ], components: [row]})
                const collector = MSG.createMessageComponentCollector({ componentType: 'BUTTON', time: 1000 * 60 });

                collector.on('collect',async b => {
                    if(b.user.id !== message.author.id) return
                    if(b.customId === "Info"){
                        const EditedEmbed = new MessageEmbed()
                            .setAuthor(`${member.user.tag}`, member.user.displayAvatarURL({dynamic: true, type: 'png', size: 1024}))
                            .addField('User', `\`\`\`${member.user.tag}\`\`\``, true)
                            .addField('User ID', `\`\`\`${member.user.id}\`\`\``, true)
                            .setThumbnail(member.user.displayAvatarURL({
                                dynamic: true, 
                                type: 'png', 
                                size: 1024
                            }))
                            .addField("Logs", count ? `\`\`\`${count}\`\`\`` : "\`\`\`0\`\`\`", true)
                            .addField('Created At', `\`\`\`${moment(member.user.createdAt).format('MMMM Do YYYY, h:mm:ss a')} - ${moment(member.user.createdAt, "YYYYMMDD").fromNow()}\`\`\``,true)
                            .addField('Joined at', `\`\`\`${moment(member.joinedAt).format('MMMM Do YYYY, h:mm:ss a')} - ${moment(member.joinedAt, "YYYYMMDD").fromNow()}\`\`\``,true)
                            .addField(`Roles [${member.roles.cache.size -1 }]`, roles)
                            .addField('Key perms', `\`\`\`${permData ? permData.toLowerCase() : "NONE"}\`\`\``)
                            .setColor(member.displayColor)

                        return b.update({content: `${member.user}`,embeds: [EditedEmbed], components: []})
                    }
                });
            collector.on("end", () =>{
            })
            }catch(err){
                errLog(err.stack.toString(), "text", "Seek/Fetch", "Error in Finding Member");
            }
        return
        }else {
            try {
                const banList = await message.guild.bans.fetch().catch(console.log)
                const bannedMember = banList.find(u => u.user.id === FindMembers.mentionedMember)

                if(bannedMember){                
                    let count = await LogsDatabase.countDocuments({
                        guildID: message.guild.id, 
                        userID: bannedMember.user.id
                    })
                    const bannedEmbed = new MessageEmbed()
                        .setAuthor(`${bannedMember.user.username} | BANNED`)
                        .addField('User', `\`\`\`${bannedMember.user.tag}\`\`\``, true)
                        .addField('User ID', `\`\`\`${bannedMember.user.id}\`\`\``, true)
                        .addField("Logs", count ? `\`\`\`${count}\`\`\`` : "\`\`\`0\`\`\`", true)
                        .setThumbnail(bannedMember.user.displayAvatarURL({
                            dynamic: true, 
                            type: 'png', 
                            size: 1024
                        }))
                        .addField("Ban Reason", `\`\`\`${bannedMember.reason ? bannedMember.reason : "No reason provided"}\`\`\``)
                        .addField('Created At', `\`\`\`${moment(bannedMember.user.createdAt).format('MMMM Do YYYY, h:mm:ss a')} - ${moment(bannedMember.user.createdAt, "YYYYMMDD").fromNow()}\`\`\``,true)
                        .setColor("#f22944")
                    message.channel.send({content: `${bannedMember.user}`, embeds: [bannedEmbed]})
                }else {
                    return message.reply({embeds: [new Discord.MessageEmbed()
                        .setDescription("The member doesn't exist. Please mention a valid member")
                        .setColor("RED")
                    ]
                    }).then((m) => setTimeout(() =>{m.delete()}, 1000 * 10))
                }
            }catch (err) {
                errLog(err.stack.toString(), "text", "Seek/Fetch", "Error in Finding Data");
            }
        }
    }
};