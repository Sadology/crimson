const Discord = require('discord.js');
const { LogsDatabase } = require('../../models');
const { LogManager, Member } = require('../../Functions');

module.exports = {
    name: 'unmute',
    description: "Unmute a muted member.",
    permissions: ["MANAGE_MESSAGES"],
    botPermission: ["MANAGE_ROLES", "SEND_MESSAGES", "EMBED_LINKS"],
    usage: "unmute [ member ]",
    category: "Moderation",
    delete: true,
    cooldown: 1000,
    run: async(client, message, args, prefix) =>{
        const { author, guild,  } = message;
        
        if(!args.length){
            return message.channel.send( {embeds: [
                new Discord.MessageEmbed()
                    .setAuthor(message.author.tag, message.author.displayAvatarURL({type: 'png', dynamic: false}))
                    .setDescription( `<:error:921057346891939840> Please mention a member \n\n**Usage**: \`${prefix}unmute [ Member ]\`` )
                    .setColor( "#fffafa" )
            ]}).then(m=>setTimeout(() => m.delete(), 1000 * 30))
            .catch(err => {return console.log(err)})
        }
        
        const member = new Member(message, client).getMember({member: args[0]})
        if(member == false ) return
        PreviousMuteCheck(member);

        async function PreviousMuteCheck(Member){
            await LogsDatabase.findOne({
                userID: Member.user.id,
                guildID: message.guild.id,
                Muted: true
            }).then(res => {
                if(res){
                    return removeMuteRole(Member, true)
                }else {
                    return removeMuteRole(Member, false)
                }
            }).catch(err => {return console.log(err.stack)})
        }

        async function removeMuteRole(Member, value){
            let muteRole = await message.guild.roles.cache.find(r => r.name === 'Muted') || await message.guild.roles.cache.find(r => r.name === 'muted')
            if(value === true){
                if(muteRole){
                    if(Member.roles.cache.has(muteRole.id)){
                        await Member.roles.remove(muteRole.id).catch(err => {return console.log(err.stack)})
    
                        message.channel.send({embeds: [
                            new Discord.MessageEmbed()
                                .setDescription(`${Member.user} is now Unmuted.`)
                                .setColor("GREEN")
                        ]}).then(m=>setTimeout(() => m.delete(), 1000 * 30))
                        .catch(err => {return console.log(err.stack)})

                        updateData(Member)
                        sendLog(Member)
                    }else {
                        updateData(Member)
                        return message.channel.send({embeds: [
                            new Discord.MessageEmbed()
                                .setDescription(`${Member.user} is now Unmuted`)
                                .setColor("GREEN")
                        ]}).catch(err => {return console.log(err.stack)})
                    }
                }else {
                    updateData(Member)
                    return
                }
            }else if(value === false){
                if(muteRole){
                    if(Member.roles.cache.has(muteRole.id)){
                        let botRole = message.guild.members.resolve( client.user ).roles.highest.position;
                        if(muteRole.position > botRole){
                            return message.channel.send({embeds: [new Discord.MessageEmbed()
                                .setDescription("Muted role is above my highest role. I can't remove a role higher than me")
                                .setColor("RED")
                            ]
                            }).catch(err => {return console.log(err)})
                        }
                        await Member.roles.remove(muteRole.id)

                        message.channel.send({embeds: [
                            new Discord.MessageEmbed()
                                .setDescription(`${Member.user} is now Unmuted.`)
                                .setColor("GREEN")
                        ]}).then(m=>setTimeout(() => m.delete(), 1000 * 30))
                        .catch(err => {return console.log(err.stack)})

                        sendLog(Member)
                    }else {
                        return message.channel.send({embeds: [
                            new Discord.MessageEmbed()
                                .setDescription(`${Member.user} is not Muted.`)
                                .setColor("RED")
                        ]}).then(m=>setTimeout(() => m.delete(), 1000 * 30))
                        .catch(err => {return console.log(err.stack)})
                    }
                }else {
                    return
                }
            }
        }

        async function updateData(Member){
            await LogsDatabase.findOneAndUpdate({
                userID: Member.user.id,
                guildID: message.guild.id,
                Muted: true
            }, {
                Muted: false
            })
        }

        async function sendLog(Member){
            const informations = {
                color: "#65ff54",
                author: {
                    name: `Unmute`,
                    icon_url: Member.user.displayAvatarURL({dynamic: false, type: "png", size: 1024})
                },
                fields: [
                    {
                        name: "User",
                        value: `\`\`\`${Member.user.tag}\`\`\``,
                        inline: true
                    },
                    {
                        name: "Moderator",
                        value: `\`\`\`${message.author.tag}\`\`\``,
                        inline: true
                    },
                ],
                timestamp: new Date(),
                footer: {
                    text: `User ID: ${Member.user.id}`
                }

            }
            new LogManager(message.guild).sendData({type: 'actionlog', data: informations, client})
        }
    }
}