const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const ms = require('ms');
const { LogsDatabase, GuildChannel} = require('../../models');
const { commandUsed } = require('../../Functions/CommandUsage');
const { errLog } = require('../../Functions/erroHandling');
const { LogChannel } = require('../../Functions/logChannelFunctions');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('mute')
        .setDescription('mute a user for specific amount of time')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The user you wants to mute')
                .setRequired(true))
        .addStringOption(option => 
            option.setName("duration")
                .setDescription("Duration of the mute")
                .setRequired(true))
        .addStringOption(option => 
            option.setName("reason")
                .setDescription("Reason for mute")),
    permission: ["MANAGE_MESSAGES",],
    run: async(client, interaction) =>{
        const { options, guild } = interaction;

        let TutEmbed = new Discord.MessageEmbed()
        const User = options.getUser('user')
        if(User){
            const Member = interaction.guild.members.cache.get(User.id);
            if(Member){
                try {
                    const duration = options.getString('duration')
                    const timeex = /[\d*]/g;
                    if(!duration.match(timeex)){
                        return interaction.reply({embeds: [new Discord.MessageEmbed()
                            .setDescription("Please provide a duration for mute \n**Usage**: `/mute [ member ] [ duration ]`")
                            .setColor("RED")
                        ], ephermal: true
                        })
                    }

                    let muteLength = ms( duration );
                    const durationFormat = ms(muteLength, { long: true })
                    const muteDuration = new Date();
                    muteDuration.setMilliseconds(muteDuration.getMilliseconds() + muteLength);

                    const muteRole = await interaction.guild.roles.cache.find(r => r.name === 'Muted')
                    if( !muteRole ){
                        if(guild.me.permissions.has("MANAGE_ROLES", "ADMINISTRATOR")){
                                await interaction.guild.roles.create({
                                        name: 'Muted',
                                        color: '#000000',
                                        permissions: [],
                                        reason: 'sadBot mute role creation'
                                })
                                if(guild.me.permissions.has("MANAGE_CHANNELS", "ADMINISTRATOR")){
                                    await guild.channels.cache.forEach(channel => {
                                        channel.permissionOverwrites.set([
                                            {
                                                id: muteRole.id,
                                                deny : ['SEND_MESSAGES', 'ADD_REACTIONS', 'VIEW_CHANNEL'],
                                            }
                                        ], "Muted role overWrites")
                                    })
                                }else {
                                    let successEmbed = new Discord.MessageEmbed()
                                        .setDescription("Missing permission to create ovrride for **Muted** role. | Require **MANAGE CHANNELS** permission to block sending interactions for Muted roles")
                                        .setColor("RED")
                                    return interaction.reply({embeds: [successEmbed], ephermal: true
                                    })
                                }
                        }else {
                            return interaction.reply({embeds: [new Discord.MessageEmbed()
                                .setDescription("Missing permission to create **Muted** role. | Please provide permission or create a role called **Muted**")
                                .setColor("RED")
                            ], ephermal: true
                            })
                        }
                    }

                    const authorHighestRole = guild.members.resolve( client.user ).roles.highest.position;
                    const mentionHighestRole = Member.roles.highest.position;

                    if(mentionHighestRole >= authorHighestRole) {
                        TutEmbed.setDescription( `Can't mute a Member with higher role than me` )
                        TutEmbed.setColor( 'RED' )
            
                        return await interaction.reply({ embeds: [TutEmbed], ephermal: true })
                    }
                    const Reason = options.getString('reason') || 'No reason provided'

                    if(Member.roles.cache.has(muteRole.id)){
                        if(!guild.me.permissions.has(["MANAGE_ROLES"])){
                            return interaction.reply({embeds: [new Discord.MessageEmbed()
                                .setDescription("I don't have permission to \"Add Roles\" to member")
                                .setColor('RED')
                            ], ephermal: true
                            });
                        }

                        await Member.roles.remove(muteRole.id)
                        await Member.roles.add(muteRole.id)
                        let successEmbed = new Discord.MessageEmbed()
                            .setDescription(`${Member.user.tag} is now Muted | ${Reason}`)
                            .setColor("GREEN")
                        interaction.reply({embeds: [successEmbed], ephermal: true})
                    } else{
                        if(!guild.me.permissions.has(["MANAGE_ROLES"])){
                            let failed = new Discord.MessageEmbed()
                                .setDescription("I don't have permission to \"Add Roles\" to member")
                                .setColor('RED')
                            return interaction.reply({embeds: [failed]});
                        }

                        Member.roles.add(muteRole.id)
                        let successEmbed = new Discord.MessageEmbed()
                            .setDescription(`${Member.user.tag} is now Muted | ${Reason}`)
                            .setColor("GREEN")
                        interaction.reply({embeds: [successEmbed], ephermal: true})
                    }

                    function caseID() {
                        var text = "";
                        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                      
                        for (var i = 0; i < 10; i++)
                          text += possible.charAt(Math.floor(Math.random() * possible.length));
                      
                        return text;
                    }
                    commandUsed( guild.id, guild.name, interaction.user.id, interaction.user.tag, "Mute", 1, `/mute ${Member} ${duration} ${Reason}` );

                    let caseIDNo = "";
                    caseIDNo = caseID();
            
                    await new LogsDatabase({
                        CaseID: caseIDNo,
                        guildID: guild.id,
                        guildName: guild.name,
                        userID: Member.user.id,
                        userName: Member.user.tag,
                        ActionType: "Mute",
                        Reason: Reason,
                        Moderator: interaction.user.tag,
                        ModeratorID: interaction.user.id,
                        Muted: true,
                        Duration: durationFormat,
                        Expire: muteDuration,
                        ActionDate: new Date(),
                    }).save().catch(err => errLog(err.stack.toString(), "text", "Mute", "Error in Ctreating Data"));

                    LogChannel("actionLog", guild).then(c => {
                        if(!c) return
                        if(c === null) return

                        else {
                            const informations = {
                                color: "#ff303e",
                                author: {
                                    name: `Mute Detection - ${caseIDNo}`,
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
                                    {
                                        name: "Duration",
                                        value: `\`\`\`${durationFormat}\`\`\``,
                                        inline: true
                                    },
                                    {
                                        name: "Reason",
                                        value: `\`\`\`${Reason}\`\`\``,
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
                    }).catch(err => console.log(err))
                }catch(err){
                    console.log(err)
                }
            }else {
                interaction.reply({embeds: [
                    new Discord.MessageEmbed()
                        .setDescription("Coudn't find any member. Please mention a valid member")
                        .setColor("RED")
                ], ephermal: true})
            }
        }
    }
}