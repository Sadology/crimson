const Discord = require('discord.js');
const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js')
const { LogsDatabase } = require('../../models')
const moment = require('moment');
const { Member } = require('../../Functions');

module.exports = {
    name: 'seek',
    aliases: ["fetch",],
    description: "Find a member and check their informations",
    permissions: ["MANAGE_MESSAGES"],
    botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
    category: "Moderation",
    usage: "fetch [ user ]",
    cooldown: 3000,
    run: async(client, message, args,prefix) =>{
        if(!args.length){
            return message.reply({embeds: [new MessageEmbed()
                .setAuthor(message.author.tag, message.author.displayAvatarURL({dynamic: false, type: 'png'}))
                .setDescription(`Please mention a member \n\n**Usage:** \`${prefix}seek [ member ]\``)
                .setColor("WHITE")
            ]
            }).then(m => setTimeout(() =>m.delete(), 1000 * 10))
        }

        let member = new Member(message, client).getMemberWithoutErrHandle({member: args[0]})
        if(member == false){
            fetchBanList(args[0].replace(/<@!/g, '').replace(/>/g, ''))
        }else {
            fetchMemberData(member)
        }

        const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setStyle("SUCCESS")
            .setLabel("More Info")
            .setCustomId("Info")
            .setEmoji("❔")
        )

        async function fetchBanList(Member){
            await message.guild.bans.fetch().then((res) => {
                if(res){
                    let data = res.find(u => u.user.id == Member)
                    if(data){
                        fetchMemberData(data, data.reason, true)
                    }else {
                        return message.channel.send({embeds: [new Discord.MessageEmbed()
                            .setDescription(`<:error:921057346891939840> Please mention a valid member`)
                            .setColor("RED")
                        ]}).then(m=>setTimeout(() => m.delete(), 1000 * 30))
                        .catch(err => {return console.log(err.stack)}) 
                    }
                }else {
                    return message.channel.send({embeds: [new Discord.MessageEmbed()
                        .setDescription(`<:error:921057346891939840> Please mention a valid member`)
                        .setColor("RED")
                    ]}).then(m=>setTimeout(() => m.delete(), 1000 * 30))
                    .catch(err => {return console.log(err.stack)}) 
                }
            })
        }

        async function fetchMemberData(Member, reason, isBanned){
            const FetchData = await LogsDatabase.findOne({
                guildID: message.guild.id,
                userID: Member.user.id
            });

            let count;
            if(FetchData){
                count = FetchData.Action.length
            }else {
                count = 0
            }
            const Embed = new MessageEmbed()
                .setAuthor(`${Member.user.tag}`, Member.user.displayAvatarURL({
                    dynamic: true, 
                    type: 'png', 
                    size: 1024
                }))
                .setThumbnail(Member.user.displayAvatarURL({
                    dynamic: true,
                    type: 'png',
                    size: 1024
                }))
                .addField('User', `\`\`\`${Member.user.tag}\`\`\``, true)
                .addField('User ID', `\`\`\`${Member.user.id}\`\`\``, true)
                .addField("Logs", count ? `\`\`\`${count}\`\`\``.toString() : "\`\`\`0\`\`\`", true)
                .addField('Created At', `\`\`\`${moment(Member.user.createdAt).format('MMMM Do YYYY, h:mm:ss a')} - ${moment(Member.user.createdAt, "YYYYMMDD").fromNow()}\`\`\``.toString(),true)
            if(isBanned == true){
                Embed.addField('Joined at', `\`\`\`No Data Found\`\`\``.toString(),true)
                Embed.setColor("RED")
                Embed.addField("Ban reason", `\`\`\`${reason}\`\`\``.toString())
            }else {
                Embed.setColor(Member.displayColor)
                Embed.addField('Joined at', `\`\`\`${moment(Member.joinedAt).format('MMMM Do YYYY, h:mm:ss a')} - ${moment(Member.joinedAt, "YYYYMMDD").fromNow()}\`\`\``.toString(),true)
            }
            if(isBanned == true) {
                return message.channel.send({content: `${Member.user}`, embeds: [Embed]}).catch(err => {return console.log(err.stack)})
            }else {
                message.channel.send({content: `${Member.user}`, embeds: [Embed], components: [row]}).then(msg => {
                    let newEmbed;
                    MoreInformations(Member, count).then(data => {
                        newEmbed = data
                    })
                    const collector = msg.createMessageComponentCollector({ componentType: 'BUTTON', time: 1000 * 60 * 10 });
                    collector.on('collect',async b => {
                        if(b.user.id !== message.author.id) return
                        if(b.customId === "Info"){
                            row.components[0].setDisabled(true)
                            collector.stop()
                            return b.update({content: `${Member.user}`,embeds: [newEmbed], components: [row]})
                            .catch(err => {return console.log(err.stack)})
                        }
                    });
                    collector.on("end", (b) =>{
                        row.components[0].setDisabled(true)
                        msg.edit({components: [row]}).catch(err => {return console.log(err.stack)})
                    })
                }).catch(err => {return console.log(err.stack)})
            }
        }

        function MoreInformations(Member, count){
            const roles = Member.roles.cache
            .sort((a,b) => b.position - a.position)
            .map(role => role.toString())
            .slice(0, -1)
            .join(', ') || "None"

            let array = Member.permissions.toArray()

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

            const EditedEmbed = new MessageEmbed()
            .setAuthor(`${Member.user.tag}`, Member.user.displayAvatarURL({dynamic: true, type: 'png', size: 1024}))
            .addField('User', `\`\`\`${Member.user.tag}\`\`\``, true)
            .addField('User ID', `\`\`\`${Member.user.id}\`\`\``, true)
            .setThumbnail(Member.user.displayAvatarURL({
                dynamic: true, 
                type: 'png', 
                size: 1024
            }))
            .addField("Logs", count ? `\`\`\`${count}\`\`\`` : "\`\`\`0\`\`\`", true)
            .addField('Created At', `\`\`\`${moment(Member.user.createdAt).format('MMMM Do YYYY, h:mm:ss a')} - ${moment(Member.user.createdAt, "YYYYMMDD").fromNow()}\`\`\``,true)
            .addField('Joined at', `\`\`\`${moment(Member.joinedAt).format('MMMM Do YYYY, h:mm:ss a')} - ${moment(Member.joinedAt, "YYYYMMDD").fromNow()}\`\`\``,true)
            .addField(`Roles [${Member.roles.cache.size -1 }]`, roles)
            .addField('Key perms', `\`\`\`${permData ? permData.toLowerCase() : "NONE"}\`\`\``)
            .setColor(Member.displayColor)

            return new Promise( (resolve) => {
                resolve(EditedEmbed)
            })
        }
    }
};