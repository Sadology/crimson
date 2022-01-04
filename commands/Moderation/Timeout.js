const Discord = require('discord.js');
const ms = require('ms');
const { LogsDatabase } = require('../../models');
const { Member } = require('../../Functions');
const { saveData, sendLogData, ModStatus } = require('../../Functions/functions');

module.exports = {
    name: 'timeout',
    aliases: ['to'],
    description: "Timeout a member to prevent them from accessing tect channels and voice channels",
    permissions: ["MANAGE_MESSAGES"],
    botPermission: ["MODERATE_MEMBERS", "SEND_MESSAGES", "EMBED_LINKS"],
    usage: "timeout [ member ] [ duraion ] [ reason ]",
    category: "Moderation",
    delete: true,
    cooldown: 1000,
    run: async(client, message, args, prefix) =>{
        const { author, content, guild, channel } = message;

        if(!args.length){
            return message.channel.send( {embeds: [
                new Discord.MessageEmbed()
                    .setAuthor(message.author.tag, message.author.displayAvatarURL({type: 'png', dynamic: false}))
                    .setDescription( `<:error:921057346891939840> Please mention a member \n\n**Usage**: \`${prefix}timeout [ Member ] [ duration ] [ reason ]\`` )
                    .setColor( "#fffafa" )
            ]}).then(m=>setTimeout(() => m.delete(), 1000 * 30))
            .catch(err => {return console.log(err)})
        }
        
        const Data = {
            guildID: message.guild.id, 
            guildName: message.guild.name,
            userID: null, 
            userName: null,
            actionType: "Timeout", 
            actionReason: null,
            Expire: null,
            actionLength: null,
            moderator: message.author.tag,
            moderatorID: message.author.id,
        }

        const member = new Member(message, client).getMember({member: args[0]})
        if(member == false ) return
        checkMemberPermission(member);

        function checkMemberPermission(Member){
            if(Member){
                const authorHighestRole = message.guild.members.resolve( client.user ).roles.highest.position;
                const mentionHighestRole = Member.roles.highest.position;

                if(Member.id === message.author.id){
                    return message.channel.send({embeds: [
                        new Discord.MessageEmbed()
                            .setAuthor(message.author.tag, message.author.displayAvatarURL({dynamic: false, size: 1024, type: 'png'}))
                            .setDescription("You can't timeout yourself.")
                            .setColor("RED")
                    ]}).then(m=>setTimeout(() => m.delete(), 1000 * 20))
                    .catch(err => {return console.log(err.stack)})
                    
                }else if(Member.permissions.any(["MANAGE_MESSAGES", "MANAGE_ROLES", "MANAGE_GUILD", "ADMINISTRATOR", "MODERATE_MEMBERS"], { checkAdmin: true, checkOwner: true })){
                    return message.channel.send({embeds: [
                        new Discord.MessageEmbed()
                            .setAuthor(message.author.tag, message.author.displayAvatarURL({dynamic: false, size: 1024, type: 'png'}))
                            .setDescription("Can't timeout an Admin/Moderator.")
                            .setColor("RED")
                    ]}).then(m=>setTimeout(() => m.delete(), 1000 * 20))
                    .catch(err => {return console.log(err.stack)})

                }else if(mentionHighestRole >= authorHighestRole) {
                    return message.channel.send({embeds: [
                        new Discord.MessageEmbed()
                            .setAuthor(message.author.tag, message.author.displayAvatarURL({dynamic: false, size: 1024, type: 'png'}))
                            .setDescription("Can't timeout a member higher or equal role as me.")
                            .setColor("RED")
                    ]}).then(m=> setTimeout(() => m.delete(), 1000 * 20))
                    .catch(err => {return console.log(err.stack)})

                }else {
                    Data['userID'] = Member.user.id
                    Data['userName'] = Member.user.tag
                    DurationMaker(Member)
                }
            }
        }

        function DurationMaker(Member){
            if(!args[1]){
                return message.channel.send({embeds: [
                    new Discord.MessageEmbed()
                        .setAuthor(message.author.tag, message.author.displayAvatarURL({dynamic: false, size: 1024, type: 'png'}))
                        .setDescription("Please provide a valid time. E.g: 100s, 10m, 1h, 1d, 1w")
                        .setColor("RED")
                ]}).then(m=> setTimeout(() => m.delete(), 1000 * 20))
                .catch(err => {return console.log(err.stack)})
            }
            const duration = args[1]
            const timeex = /[\d*]/g;

            if(!duration.match(timeex)){
                return message.channel.send({embeds: [
                    new Discord.MessageEmbed()
                        .setAuthor(message.author.tag, message.author.displayAvatarURL({dynamic: false, size: 1024, type: 'png'}))
                        .setDescription("Please provide a valid time. E.g: 100s, 10m, 1h, 1d, 1w")
                        .setColor("RED")
                ]}).then(m=> setTimeout(() => m.delete(), 1000 * 20))
                .catch(err => {return console.log(err.stack)}) 
            }else if(!duration.match(/^\d/)){
                return message.channel.send({embeds: [
                    new Discord.MessageEmbed()
                        .setAuthor(message.author.tag, message.author.displayAvatarURL({dynamic: false, size: 1024, type: 'png'}))
                        .setDescription("Please provide a valid time. E.g: 100s, 10m, 1h, 1d, 1w")
                        .setColor("RED")
                ]}).then(m=> setTimeout(() => m.delete(), 1000 * 20))
                .catch(err => {return console.log(err.stack)}) 
            }else {
                let muteLength = ms( duration );
                const durationFormat = ms(muteLength, { long: true })

                Data['Expire'] = muteLength
                Data['actionLength'] = durationFormat

                MuteMember(Member)
            }
        }

        async function MuteMember(Member){
            let timeOutReason = message.content.split(/\s+/g).slice(3).join(' ') || "No reason provided"
            Member.timeout(Data.Expire, timeOutReason)
            .then((m) => {
                if(Data.Expire == 0){
                    message.channel.send({embeds: [
                        new Discord.MessageEmbed()
                            .setDescription(`${m.user} timeout was removed`)
                            .setColor("GREEN")
                    ]}).then(m=> setTimeout(() => m.delete(), 1000 * 30))
                    .catch(err => {return console.log(err.stack)})
                }else {
                    message.channel.send({embeds: [
                        new Discord.MessageEmbed()
                            .setDescription(`Timed out ${m.user} | ${timeOutReason}`)
                            .setColor("GREEN")
                    ]}).then(m=> setTimeout(() => m.delete(), 1000 * 30))
                    .catch(err => {return console.log(err.stack)})
                }
            })
            .catch(err => {
                return console.log(err.stack)
            })
        }
    }
}