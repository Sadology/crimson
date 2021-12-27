const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const ms = require('ms');
const { LogsDatabase } = require('../../models');
const { saveData, sendLogData, ModStatus } = require('../../Functions/functions');

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
                .setDescription("Duration of the mute"))
        .addStringOption(option => 
            option.setName("reason")
                .setDescription("Reason for mute")),
    permission: ["MANAGE_MESSAGES"],
    botPermission: ["MANAGE_ROLES", "MANAGE_CHANNELS"],
    category: "Slash",
    run: async(client, interaction) =>{
        const { options, guild, content, channel} = interaction;
        const User = options.getUser('user')
        
        const Data = {
            guildID: interaction.guild.id, 
            guildName: interaction.guild.name,
            userID: null, 
            userName: null,
            actionType: "Mute", 
            actionReason: null,
            Expire: null,
            actionLength: null,
            moderator: interaction.user.tag,
            moderatorID: interaction.user.id,
        }

        let MemberError = new Discord.MessageEmbed()
            .setAuthor(interaction.user.tag, interaction.user.displayAvatarURL({dynamic: false, size: 1024, type: 'png'}))
            .setDescription(`Coudn't find the member. Please mention a valid member.`)
            .setColor("RED")

        function GuildMember(Member){
            if (Member){
                const member = interaction.guild.members.cache.get(Member.id);
                if(member){
                    checkMemberPermission(member);
                }else {
                    return interaction.reply({embeds: [MemberError], ephemeral: true})
                }
            }else {
                return interaction.reply({embeds: [MemberError], ephemeral: true})
            }
        }

        function checkMemberPermission(Member){
            if(Member){
                const userHighestRole = interaction.guild.members.resolve( client.user ).roles.highest.position;
                const mentionHighestRole = Member.roles.highest.position;

                if(Member.id === interaction.user.id){
                    return interaction.reply({embeds: [MemberError]})
                }else if(Member.permissions.has("MANAGE_MESSAGES", "MANAGE_ROLES", "MANAGE_GUILD", "ADMINISTRATOR", { checkAdmin: true, checkOwner: true })){
                    return interaction.reply({embeds: [
                        new Discord.MessageEmbed()
                            .setAuthor(interaction.user.tag, interaction.user.displayAvatarURL({dynamic: false, size: 1024, type: 'png'}))
                            .setDescription("Can't mute an Admin/Moderator.")
                            .setColor("RED")
                    ], ephemeral: true})
                }else if(mentionHighestRole >= userHighestRole) {
                    return interaction.reply({embeds: [
                        new Discord.MessageEmbed()
                            .setAuthor(interaction.user.tag, interaction.user.displayAvatarURL({dynamic: false, size: 1024, type: 'png'}))
                            .setDescription("Can't mute a member higher or equal role as me.")
                            .setColor("RED")
                    ], ephemeral: true})
                }else {
                    Data['userID'] = Member.user.id
                    Data['userName'] = Member.user.tag
                    return PreviousMuteCheck(Member)
                }
            }
        }

        function PreviousMuteCheck(Member){
            FindData(Member).then( value => {
                if(value === true){
                    let NotMuted = new Discord.MessageEmbed()
                    .setAuthor(interaction.user.tag, interaction.user.displayAvatarURL({dynamic: false, size: 1024, type: 'png'}))
                    .setDescription(`<@${Member.user.id}> is already muted`)
                    .setColor("RED")

                    return interaction.reply({embeds: [NotMuted], ephemeral: true})
                }else if(value === false){
                    DurationMaker()
                    findMuteRole(Member)
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

        function DurationMaker(){
            const duration = options.getString('duration')
            if(!duration) return

            const timeex = /[\d*]/g;
            if(!duration.match(timeex)){
                return
            }else if(!duration.match(/^\d/)){
                return
            }else {
                let muteLength = ms( duration );
                const durationFormat = ms(muteLength, { long: true })
                const muteDuration = new Date();
                muteDuration.setMilliseconds(muteDuration.getMilliseconds() + muteLength);

                Data['Expire'] = muteDuration
                Data['actionLength'] = durationFormat
            }
        }

        async function findMuteRole(Member){
            const muteRole = await interaction.guild.roles.cache.find(r => r.name === 'Muted') || await interaction.guild.roles.cache.find(r => r.name === 'muted')
            if( !muteRole ){
                if(guild.me.permissions.has("MANAGE_ROLES", "ADMINISTRATOR")){
                    try {
                        await interaction.guild.roles.create({
                                name: 'Muted',
                                color: '#000000',
                                permissions: [],
                                reason: 'sadBot mute role creation'
                        })
                        let permToChange = await interaction.guild.roles.cache.find(r => r.name === 'Muted')
                        if(guild.me.permissions.has("MANAGE_CHANNELS", "ADMINISTRATOR")){
                            await guild.channels.cache.forEach(channel => {
                                channel.permissionOverwrites.set([
                                    {
                                        id: permToChange.id,
                                        deny : ['SEND_MESSAGES', 'ADD_REACTIONS', 'VIEW_CHANNEL'],
                                    }
                                ], "Muted role overWrites")
                            })
                        }else {
                            let successEmbed = new Discord.MessageEmbed()
                                .setDescription("Missing permission to create ovrride for **Muted** role. | Require **MANAGE CHANNELS** permission to deny **Send Message** permission for Muted roles")
                                .setColor("#ff303e")
                            return interaction.reply({embeds: [successEmbed], ephemeral: true})
                        }
                        MuteMember(Member, permToChange) 
                    }catch(err){
                        errLog(err.stack.toString(), "text", "Mute", "Error in creating Muted role");
                    }
                }else {
                    return interaction.reply({embeds: [new Discord.MessageEmbed()
                        .setDescription("Missing permission to create **Muted** role. | Please provide permission or create a role called **Muted**")
                        .setColor("#ff303e")
                    ]
                    })
                }
            }else {
                let botRole = interaction.guild.members.resolve( client.user ).roles.highest.position;
                if(muteRole.position > botRole){
                    return interaction.reply({embeds: [new Discord.MessageEmbed()
                        .setDescription("Muted role is above my highest role. I can't add a role higher than me")
                        .setColor("RED")
                    ]
                    }).catch(err => {return console.log(err)})
                }
               MuteMember(Member, muteRole) 
            }
        }

        async function MuteMember(Member, muteRole){
            const muteReason = options.getString('reason') || 'No reason provided';

            if(Member.roles.cache.has(muteRole.id)){
                await Member.roles.remove(muteRole.id)
                await Member.roles.add(muteRole.id)

                let successEmbed = new Discord.MessageEmbed()
                    .setDescription(`${Member.user} is now Muted | ${muteReason}`)
                    .setColor("#45f766")
                interaction.reply({embeds: [successEmbed], ephemeral: true})
                Data['actionReason'] = muteReason
            }else {
                Member.roles.add(muteRole.id)
                let successEmbed = new Discord.MessageEmbed()
                    .setDescription(`${Member.user} is now Muted | ${muteReason}`)
                    .setColor("#45f766")
                interaction.reply({embeds: [successEmbed], ephemeral: true})
                Data['actionReason'] = muteReason
            }
            CreateLog(Member)
        }

        async function CreateLog(Member){
            try {
                saveData({
                    ...Data,
                })
                sendLogData({data: Data, client: client, Member: Member, guild: guild})
                ModStatus({type: "Mute", guild: interaction.guild, member: interaction.user, content: `/mute ${Member}`})
            } catch (err) {
                console.log(err)
            }
        }

        if(User){
            GuildMember(User)
        }
    }
}