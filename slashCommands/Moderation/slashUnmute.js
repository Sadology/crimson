const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const { LogsDatabase, GuildChannel} = require('../../models');
const { LogManager } = require('../../Functions');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription('Unmute a muted member')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The user you wants to unmute')
                .setRequired(true)),
    permission: ["MANAGE_MESSAGES"],
    botPermission: ["MANAGE_ROLES"],
    run: async(client, interaction) =>{
        const { options, guild, content, channel} = interaction;
        const User = options.getUser('user')
        
        let MemberError = new Discord.MessageEmbed()
            .setAuthor(interaction.user.tag, interaction.user.displayAvatarURL({dynamic: false, size: 1024, type: 'png'}))
            .setDescription(`Coudn't find the member. Please mention a valid member.`)
            .setColor("RED")

        function GuildMember(Member){
            if (Member){
                const member = interaction.guild.members.cache.get(Member.id);
                if(member){
                    PreviousMuteCheck(member);
                }else {
                    return interaction.reply({embeds: [MemberError], ephemeral: true})
                }
            }else {
                return interaction.reply({embeds: [MemberError], ephemeral: true})
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
                guildID: interaction.guild.id,
                Muted: true
            })

            if(previosMute){
                return true
            }else {
                return false
            }
        }

        async function removeMuteRole(Member, value){
            let muteRole = await interaction.guild.roles.cache.find(r => r.name === 'Muted') || await interaction.guild.roles.cache.find(r => r.name === 'muted')
            if(value === true){
                if(muteRole){
                    if(Member.roles.cache.has(muteRole.id)){
                        let botRole = interaction.guild.members.resolve( client.user ).roles.highest.position;
                        if(muteRole.position > botRole){
                            return interaction.reply({embeds: [new Discord.MessageEmbed()
                                .setDescription("Muted role is above my highest role. I can't add a role higher than me")
                                .setColor("RED")
                            ]
                            }).catch(err => {return console.log(err)})
                        }
                        await Member.roles.remove(muteRole.id)
    
                        interaction.reply({embeds: [
                            new Discord.MessageEmbed()
                                .setDescription(`${Member.user} is now Unmuted.`)
                                .setColor("GREEN")
                        ], ephemeral: true})
                        updateData(Member)
                        sendLog(Member)
                    }else {
                        updateData(Member)
                        return interaction.reply({embeds: [
                            new Discord.MessageEmbed()
                                .setDescription(`${Member.user} is now Unmuted`)
                                .setColor("GREEN")
                        ], ephemeral: true})
                        
                    }
                }else {
                    updateData(Member)
                    return interaction.reply({embeds: [
                        new Discord.MessageEmbed()
                            .setDescription(`Coudn't find " Muted " role`)
                            .setColor("RED")
                    ], ephemeral: true})
                }
            }else if(value === false){
                if(muteRole){
                    if(Member.roles.cache.has(muteRole.id)){
                        await Member.roles.remove(muteRole.id)

                        interaction.reply({embeds: [
                            new Discord.MessageEmbed()
                                .setDescription(`${Member.user} is now Unmuted.`)
                                .setColor("GREEN")
                        ], ephemeral: true})
                        sendLog(Member)
                    }else {
                        return interaction.reply({embeds: [
                            new Discord.MessageEmbed()
                                .setDescription(`${Member.user} is not Muted.`)
                                .setColor("RED")
                        ], ephemeral: true})
                    }
                }else {
                    return interaction.reply({embeds: [
                        new Discord.MessageEmbed()
                            .setDescription(`Coudn't find " Muted " role`)
                            .setColor("RED")
                    ], ephemeral: true})
                }
            }
        }

        async function updateData(Member){
            await LogsDatabase.findOneAndUpdate({
                userID: Member.user.id,
                guildID: interaction.guild.id,
                Muted: true
            }, {
                Muted: false
            })
        }

        async function sendLog(Member){
            const informations = {
                color: "#65ff54",
                author: {
                    name: `Unmuted`,
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
                        value: `\`\`\`${interaction.user.tag}\`\`\``,
                        inline: true
                    },
                ],
                timestamp: new Date(),
                footer: {
                    text: `User ID: ${Member.user.id}`
                }

            }
            new LogManager(interaction.guild).sendData({type: 'actionlog', data: informations, client})
        }

        if(User){
            GuildMember(User)
        }
    }
}