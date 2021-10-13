const Discord = require('discord.js');
const { LogsDatabase, GuildChannel, GuildRole } = require('../../models');
const { commandUsed } = require('../../Functions/CommandUsage');
const { errLog } = require('../../Functions/erroHandling');
const {Member} = require('../../Functions/memberFunction');
const { LogChannel } = require('../../Functions/logChannelFunctions');

module.exports = {
    name: 'unmute',
    description: "Unmute a muted member.",
    permissions: ["MANAGE_MESSAGES"],
    usage: "unmute [ member ]",
    category: "Moderation",

    run: async(client, message, args, prefix) =>{
        if(message.guild.me.permissions.has(["MANAGE_MESSAGES"])){
            await message.delete();
        }

        if(!message.guild.me.permissions.has(["MANAGE_ROLES", "ADMINISTRATOR"])){
            return message.channel.send({embeds: [
                new Discord.MessageEmbed()
                    .setDescription("I don't have \"Manage_Roles\" permission to remove Muted role.")
                    .setColor("RED")
            ]})
        }

        if(!message.member.permissions.has("MANAGE_MESSAGES")){
            return message.author.send('None of your role proccess to use this command')
        }
        const { author, content, guild, channel } = message;
        
        const TutEmbed = new Discord.MessageEmbed().setAuthor( "Command - UNMUTE", author.displayAvatarURL({dynamic: false, format: "png", size: 1024}) )

        if( !args.length ){
            TutEmbed.setDescription( `Mutes someone to pause them from chatting or speaking \n**Usage**: ${prefix}mute [ Member ] [ duration ] [ reason ] \n**Example:** \n${prefix}mute @shadow~ 20m for Spamming \n${prefix}mute @shadow~ 3h Deserve it!` )
            TutEmbed.setFooter( "Bot require \"MANAGE_ROLES\" permission to add \"Muted\" role" )
            TutEmbed.setColor( "#fffafa" )
            return message.channel.send( {embeds: [TutEmbed]} ).then(m=>setTimeout(() => m.delete(), 1000 * 30));
        }
        
        const FindMembers = new Member(args[0], message);
        await message.guild.members.fetch()

        let MemberError = new Discord.MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL({dynamic: false, size: 1024, type: 'png'}))
            .setDescription(`Coudn't find the member. Please mention a valid member.`)
            .setColor("RED")

        function GuildMember(Member){
            if (Member){
                const member = message.guild.members.cache.get(Member);
                if(member){
                    return PreviousMuteCheck(member)
                }else {
                    return message.channel.send({embeds: [MemberError]}).then(m=>setTimeout(() => m.delete(), 1000 * 20)); 
                }
            }else {
                return message.channel.send({embeds: [MemberError]}).then(m=>setTimeout(() => m.delete(), 1000 * 20));
            }
        }

        function PreviousMuteCheck(Member){
            FindData(Member).then( value => {
                if(value === true){
                    removeMuteRole(Member, true)
                }else if(value === false){
                    removeMuteRole(Member, false)
                }
            })
        }

        async function FindData(Member){
            const previosMute = await LogsDatabase.findOne({
                userID: Member.user.id,
                guildID: message.guild.id,
                Muted: true
            })

            if(previosMute){
                return true
            }else {
                return false
            }
        }

        async function removeMuteRole(Member, value){
            let muteRole = await message.guild.roles.cache.find(r => r.name === 'Muted') || await message.guild.roles.cache.find(r => r.name === 'muted')
            if(value === true){
                if(muteRole){
                    if(Member.roles.cache.has(muteRole.id)){
                        await Member.roles.remove(muteRole.id)
    
                        message.channel.send({embeds: [
                            new Discord.MessageEmbed()
                                .setDescription(`${Member.user} is now Unmuted.`)
                                .setColor("GREEN")
                        ]}).then(m=>setTimeout(() => m.delete(), 1000 * 30));
                        updateData(Member)
                        sendLog(Member)
                    }else {
                        updateData(Member)
                        return message.channel.send({embeds: [
                            new Discord.MessageEmbed()
                                .setDescription(`${Member.user} is now Unmuted`)
                                .setColor("GREEN")
                        ]})
                    }
                }else {
                    updateData(Member)
                    return
                }
            }else if(value === false){
                if(muteRole){
                    if(Member.roles.cache.has(muteRole.id)){
                        await Member.roles.remove(muteRole.id)

                        message.channel.send({embeds: [
                            new Discord.MessageEmbed()
                                .setDescription(`${Member.user} is now Unmuted.`)
                                .setColor("GREEN")
                        ]}).then(m=>setTimeout(() => m.delete(), 1000 * 30));
                        sendLog(Member)
                    }else {
                        return message.channel.send({embeds: [
                            new Discord.MessageEmbed()
                                .setDescription(`${Member.user} is not Muted.`)
                                .setColor("RED")
                        ]}).then(m=>setTimeout(() => m.delete(), 1000 * 30));
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
            let count = await LogsDatabase.findOne({
                guildID: message.guild.id, 
                userID: Member.user.id
            })

            LogChannel('actionLog', guild).then(c => {
                if(!c) return;
                if(c === null) return;

                else {
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
                    const hasPermInChannel = c
                        .permissionsFor(client.user)
                        .has('SEND_MESSAGES', false);
                    if (hasPermInChannel) {
                        c.send({embeds: [informations]})
                    }
                }
            }).catch(err => console.log(err));
        }

        GuildMember(FindMembers.mentionedMember)
    }
}