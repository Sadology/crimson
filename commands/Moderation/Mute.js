const Discord = require('discord.js');
const { Permissions } = require('discord.js')
const ms = require('ms');
const { LogsDatabase, GuildChannel, GuildRole } = require('../../models');
const { commandUsed } = require('../../Functions/CommandUsage');
const { errLog } = require('../../Functions/erroHandling');
const {Member} = require('../../Functions/memberFunction');
const { LogChannel } = require('../../Functions/logChannelFunctions');

module.exports = {
    name: 'mute',
    description: "Mute a member to prevent them from texting/speaking",
    permissions: ["MANAGE_MESSAGES"],
    usage: "mute [ member ] [ duraion ] [ reason ]",
    category: "Moderation",

    run: async(client, message, args, prefix) =>{
        if(message.guild.me.permissions.has(["MANAGE_MESSAGES"])){
            await message.delete();
        }

        if(!message.guild.me.permissions.has(["MANAGE_ROLES", "ADMINISTRATOR"])){
            return message.channel.send({embeds: [
                new Discord.MessageEmbed()
                    .setDescription("I don't have \"Manage_Roles\" permission to add Muted role.")
                    .setColor("RED")
            ]})
        }

        if(!message.member.permissions.has("MANAGE_MESSAGES")){
            return message.author.send('None of your role proccess to use this command')
        }
        const { author, content, guild, channel } = message;
        
        const TutEmbed = new Discord.MessageEmbed().setAuthor( "Command - MUTE", author.displayAvatarURL({dynamic: false, format: "png", size: 1024}) )

        if( !args.length ){
            TutEmbed.setDescription( `Mutes someone to pause them from chatting or speaking \n**Usage**: ${prefix}mute [ Member ] [ duration ] [ reason ] \n**Example:** \n${prefix}mute @shadow~ 20m for Spamming \n${prefix}mute @shadow~ 3h Deserve it!` )
            TutEmbed.setFooter( "Bot require \"MANAGE_ROLES\" permission to add \"Muted\" role" )
            TutEmbed.setColor( "#fffafa" )
            return message.channel.send( {embeds: [TutEmbed]} ).then(m=>setTimeout(() => m.delete(), 1000 * 30));
        }
        
        const FindMembers = new Member(args[0], message);
        await message.guild.members.fetch()
        
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
            guildID: message.guild.id,
            guildName: message.guild.name,
            userID: null,
            userName: null,
            ActionType: "Mute",
            Reason: "",
            Moderator: author.tag,
            ModeratorID: author.id,
            Duration: null,
            ActionDate: new Date(),
        }

        let Expire;
        let MemberError = new Discord.MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL({dynamic: false, size: 1024, type: 'png'}))
            .setDescription(`Coudn't find the member. Please mention a valid member.`)
            .setColor("RED")

        function GuildMember(Member){
            if (Member){
                const member = message.guild.members.cache.get(Member);
                if(member){
                    checkMemberPermission(member);
                }else {
                    return message.channel.send({embeds: [MemberError]}).then(m=>setTimeout(() => m.delete(), 1000 * 20)); 
                }
            }else {
                return message.channel.send({embeds: [MemberError]}).then(m=>setTimeout(() => m.delete(), 1000 * 20));
            }
        }

        function checkMemberPermission(Member){
            if(Member){
                const authorHighestRole = message.guild.members.resolve( client.user ).roles.highest.position;
                const mentionHighestRole = Member.roles.highest.position;

                if(Member.id === message.author.id){
                    return message.channel.send({embeds: [MemberError]}).then(m=>setTimeout(() => m.delete(), 1000 * 10));
                }else if(Member.permissions.has("MANAGE_MESSAGES", "MANAGE_ROLES", "MANAGE_GUILD", "ADMINISTRATOR", { checkAdmin: true, checkOwner: true })){
                    return message.channel.send({embeds: [
                        new Discord.MessageEmbed()
                            .setAuthor(message.author.tag, message.author.displayAvatarURL({dynamic: false, size: 1024, type: 'png'}))
                            .setDescription("Can't mute an Admin/Moderator.")
                            .setColor("RED")
                    ]}).then(m=>setTimeout(() => m.delete(), 1000 * 20));
                }else if(mentionHighestRole >= authorHighestRole) {
                    return message.channel.send({embeds: [
                        new Discord.MessageEmbed()
                            .setAuthor(message.author.tag, message.author.displayAvatarURL({dynamic: false, size: 1024, type: 'png'}))
                            .setDescription("Can't mute a member higher or equal role as me.")
                            .setColor("RED")
                    ]}).then(m=> setTimeout(() => m.delete(), 1000 * 20));
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
                    .setAuthor(message.author.tag, message.author.displayAvatarURL({dynamic: false, size: 1024, type: 'png'}))
                    .setDescription(`<@${Member.user.id}> is already muted`)
                    .setColor("RED")

                    return message.channel.send({embeds: [NotMuted]})
                }else if(value === false){
                    DurationMaker()
                    findMuteRole(Member)
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

        function DurationMaker(){
            if(!args[1]){
                return
            }
            const duration = args[1]
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
            const muteRole = await message.guild.roles.cache.find(r => r.name === 'Muted') || await message.guild.roles.cache.find(r => r.name === 'muted')
            if( !muteRole ){
                if(guild.me.permissions.has("MANAGE_ROLES", "ADMINISTRATOR")){
                    try {
                        await message.guild.roles.create({
                                name: 'Muted',
                                color: '#000000',
                                permissions: [],
                                reason: 'sadBot mute role creation'
                        })
                        let permToChange = await message.guild.roles.cache.find(r => r.name === 'Muted')
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
                            return channel.send({embeds: [successEmbed]
                            })
                        }
                        MuteMember(Member, permToChange) 
                    }catch(err){
                        errLog(err.stack.toString(), "text", "Mute", "Error in creating Muted role");
                    }
                }else {
                    return channel.send({embeds: [new Discord.MessageEmbed()
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
            const muteReason = content.split(/\s+/).slice(3).join(" ") || 'No reason provided'
            if(message.cleanContent.length >= 200) {
                let failed = new Discord.MessageEmbed()
                .setDescription("Please provide a reason less than 200 words")
                .setColor('#ff303e')
                return message.channel.send({embeds: [failed]})
            }

            if(Member.roles.cache.has(muteRole.id)){
                await Member.roles.remove(muteRole.id)
                await Member.roles.add(muteRole.id)

                let successEmbed = new Discord.MessageEmbed()
                    .setDescription(`${Member.user} is now Muted | ${muteReason}`)
                    .setColor("#45f766")
                channel.send({embeds: [successEmbed]}).then(m =>setTimeout(() => m.delete(), 1000 * 30))
                Data['Reason'] = muteReason
            }else {
                Member.roles.add(muteRole.id)
                let successEmbed = new Discord.MessageEmbed()
                    .setDescription(`${Member.user} is now Muted | ${muteReason}`)
                    .setColor("#45f766")
                channel.send({embeds: [successEmbed]}).then(m =>setTimeout(() => m.delete(), 1000 * 30))
                Data['Reason'] = muteReason
            }
            CreateLog(Member)
            sendLog(Member)
            commandUsed( guild.id, guild.name, message.author.id, message.author.tag, "Mute", 1, content );
        }

        async function CreateLog(Member){
            try {
                await LogsDatabase.findOneAndUpdate({
                    guildID: message.guild.id,
                    userID: Member.user.id
                },{
                    guildName: message.guild.name,
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
                guildID: message.guild.id, 
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
                                value: `\`\`\`${message.author.tag}\`\`\``,
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

        GuildMember(FindMembers.mentionedMember)
    }
}