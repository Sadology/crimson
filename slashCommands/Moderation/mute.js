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
                .setDescription("Duration of the mute"))
        .addStringOption(option => 
            option.setName("reason")
                .setDescription("Reason for mute")),
    permission: ["MANAGE_MESSAGES",],
    run: async(client, interaction) =>{
        const { options, guild, content, channel} = interaction;
        const User = options.getUser('user')

        if(!interaction.member.permissions.has("MANAGE_MESSAGES")){
            return interaction.reply('None of your role proccess to use this command')
        }

        if(!interaction.guild.me.permissions.has(["MANAGE_ROLES", "ADMINISTRATOR"])){
            return interaction.reply({embeds: [
                new Discord.MessageEmbed()
                    .setDescription("I don't have \"Manage_Roles\" permission to add Muted role.")
                    .setColor("RED")
            ]})
        }
        
        function caseID() {
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            
            for (var i = 0; i < 10; i++)
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            
            return text;
        }
        let caseId;
        caseId = caseID();

        const Data = {
            CaseID: caseId,
            guildID: interaction.guild.id,
            guildName: interaction.guild.name,
            userID: null,
            userName: null,
            ActionType: "Mute",
            Reason: "",
            Moderator: interaction.user.tag,
            ModeratorID: interaction.user.id,
            Duration: null,
            ActionDate: new Date(),
        }

        let Expire;
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
                    return interaction.reply({embeds: [MemberError]}).then(m=>setTimeout(() => m.delete(), 1000 * 10));
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

                Expire = muteDuration
                Data['Duration'] = durationFormat
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
                Data['Reason'] = muteReason
            }else {
                Member.roles.add(muteRole.id)
                let successEmbed = new Discord.MessageEmbed()
                    .setDescription(`${Member.user} is now Muted | ${muteReason}`)
                    .setColor("#45f766")
                interaction.reply({embeds: [successEmbed], ephemeral: true})
                Data['Reason'] = muteReason
            }
            CreateLog(Member)
            sendLog(Member)
            commandUsed( guild.id, guild.name, interaction.user.id, interaction.user.tag, "Mute", 1, content );
        }

        async function CreateLog(Member){
            try {
                await LogsDatabase.findOneAndUpdate({
                    guildID: interaction.guild.id,
                    userID: Member.user.id
                },{
                    guildName: interaction.guild.name,
                    Muted: true,
                    Expire: Expire,
                    $push: {
                        [`Action`]: {
                            Data
                        }
                    }
                },{
                    upsert: true,
                })
            } catch (err) {
                console.log(err)
            }
        }

        async function sendLog(Member){
            let count = await LogsDatabase.findOne({
                guildID: interaction.guild.id, 
                userID: Member.user.id
            })

            LogChannel('actionLog', guild).then(c => {
                if(!c) return;
                if(c === null) return;

                else {
                    const informations = {
                        color: "#ff303e",
                        author: {
                            name: `Mute Detection - ${caseId}`,
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
                                value: `\`\`\`${Data['Duration'] === null ? "∞" : Data['Duration']}\`\`\``,
                                inline: true
                            },
                            {
                                name: "Reason",
                                value: `\`\`\`${Data['Reason']}\`\`\``,
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

                    if(count.Action){
                        if(count.Action.length >= 5){
                        if (hasPermInChannel) {
                            c.send({embeds: [new Discord.MessageEmbed()
                                .setAuthor(`${Member.user.tag}`, Member.user.displayAvatarURL({dynamic: false, type: "png", size: 1024}))
                                .setDescription(`${Member.user} reached ${count.Action.length} logs`)
                                .addField("User", `\`\`\`${Member.user.tag}\`\`\``.toString(), true)
                                .addField("Total logs", `\`\`\`${count.Action.length}\`\`\``.toString(), true)
                                .setColor("RED")
                            ]}).then(m =>{
                                m.react("✅")
                            })
                        }
                    }
                    }

                }
            }).catch(err => console.log(err));
        }

        if(User){
            GuildMember(User)
        }
    }
}