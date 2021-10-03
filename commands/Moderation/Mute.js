const Discord = require('discord.js');
const { Permissions } = require('discord.js')
const ms = require('ms');
const { LogsDatabase, GuildChannel, GuildRole } = require('../../models');
const { commandUsed } = require('../../Functions/CommandUsage');
const { errLog } = require('../../Functions/erroHandling');
const {Member} = require('../../Functions/MemberFunction');
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

        if(!args[0]){
            return message.channel.send({
                embeds: [new Discord.MessageEmbed()
                    .setDescription(`Please mention a member \n\n**Usage:** ${prefix}mute [ member ] [ duration ] [ reason ]`)
                    .setColor("RED")
                ]
            }).then(m=>setTimeout(() => m.delete(), 1000 * 10));
        }
        
        const FindMembers = new Member(args[0], message);
        await message.guild.members.fetch()
        const member = message.guild.members.cache.get(FindMembers.mentionedMember)

        if(!member){
            TutEmbed.setDescription( `Invalid user | Couldn't find the user` )
    
            TutEmbed.setColor( "#ff303e" )
            return message.channel.send( {embeds: [TutEmbed]} ).then(m=>setTimeout(() => m.delete(), 1000 * 10))
        }

        try {
            if(member.user.id == message.author.id){
                return message.channel.send({embeds: [new Discord.MessageEmbed()
                    .setAuthor(message.author.tag, message.author.displayAvatarURL())
                    .setDescription("You can't mute yourself.")
                    .setColor('RED')
                ]
                }).then(m=>setTimeout(() => m.delete(), 1000 * 10));
            }
            if(member.permissions.has([ "MANAGE_MESSAGES", "MANAGE_ROLES", "MANAGE_GUILD", "ADMINISTRATOR" ])){
                    TutEmbed.setDescription( `Can't mute a Mod/Admin`)
                    TutEmbed.setColor( '#ff303e' )
        
                    return await message.channel.send({embeds: [TutEmbed]}).then(m=>setTimeout(() => m.delete(), 1000 * 10))
                }
                const previosMute = await LogsDatabase.find({
                    userID: member.user.id,
                })
        
                const currentlyMuted = previosMute.filter(mute => {
                    return mute.Muted === true
                })
        
                if ( currentlyMuted.length ){
                    let error = new Discord.MessageEmbed()
                        .setDescription( `${member.user.username} is already Muted`)
                        .setColor( '#ff303e' )
                    return message.channel.send({embeds: [error]
                    }).then(m=>setTimeout(() => m.delete(), 1000 * 10));
                }
        
                const duration = content.split(/\s+/)[2];
                
                if( !duration ){
                    TutEmbed.setDescription( `Mutes someone to pause them from chatting or speaking \n**Usage**: ${prefix}mute [ member ] [ duration ] [ reason ] \n**Example:** \n${prefix}mute @shadow~ 20m for Spamming \n${prefix}mute @shadow~ 3h Deserve it!` )
                    TutEmbed.setColor( "#fffafa" )
                    return message.channel.send( {embeds: [TutEmbed] }).then(m=>setTimeout(() => m.delete(), 1000 * 10));
                }

                const timeex = /[\d*]/g;

                if(!duration.match(timeex)){
                    TutEmbed.setDescription( `Please define duration for the mute 
                    \n**Usage**: \`${prefix}mute [ user ] [ duration ] [ reason ]\`` )
                    TutEmbed.setColor( "#fffafa" )
                    return message.channel.send( {embeds: [TutEmbed]} ).then(m=>setTimeout(() => m.delete(), 1000 * 10));
                }

                let muteLength = ms( duration ) ;
                const durationFormat = ms(muteLength, { long: true })
                const muteDuration = new Date();
                muteDuration.setMilliseconds(muteDuration.getMilliseconds() + muteLength);
        
                const muteReason = content.split(/\s+/).slice(3).join(" ") || 'No reason provided'
                if(message.cleanContent.length >= 500) {
                    let failed = new Discord.MessageEmbed()
                    .setDescription("Please provide a reason less than 500 words")
                    .setColor('#ff303e')
                    return message.channel.send({embeds: [failed]
                    })
                }
        
                const muteRole = await message.guild.roles.cache.find(r => r.name === 'Muted')
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
                }
        
                const authorHighestRole = message.guild.members.resolve( client.user ).roles.highest.position;
                const mentionHighestRole = member.roles.highest.position;

                if(mentionHighestRole >= authorHighestRole) {
                    TutEmbed.setDescription( `Can't mute a member with higher role than me` )
                    TutEmbed.setColor( '#ff303e' )
        
                    await message.channel.send({ embeds: [TutEmbed] }).then(m => setTimeout(() => m.delete(), 1000 * 20))
                    return
                }
        
                if(member.roles.cache.has(muteRole.id)){
                    try{
                        if(!message.guild.me.permissions.has(["MANAGE_ROLES"])){
                            return message.channel.send({embeds: [new Discord.MessageEmbed()
                                .setDescription("I don't have permission to \"Add Roles\" to member")
                                .setColor('#ff303e')
                            ]
                            });
                        }

                        await member.roles.remove(muteRole.id)
                        await member.roles.add(muteRole.id)
                        let successEmbed = new Discord.MessageEmbed()
                            .setDescription(`${member.user.tag} is now Muted | ${muteReason}`)
                            .setColor("#45f766")
                        channel.send({embeds: [successEmbed]}).then(m =>setTimeout(() => m.delete(), 1000 * 20))
                    }catch(err){
                        errLog(err.stack.toString(), "text", "Mute", "Error in Addning Muted role");
                    }
                } else{
                    try{
                        if(!message.guild.me.permissions.has(["MANAGE_ROLES"])){
                            let failed = new Discord.MessageEmbed()
                                .setDescription("I don't have permission to \"Add Roles\" to member")
                                .setColor('#ff303e')
                            return message.channel.send({embeds: [failed]});
                        }

                        member.roles.add(muteRole.id)
                        let successEmbed = new Discord.MessageEmbed()
                            .setDescription(`${member.user.tag} is now Muted | ${muteReason}`)
                            .setColor("#45f766")
                        channel.send({embeds: [successEmbed]}).then(m =>setTimeout(() => m.delete(), 1000 * 20))
                    }catch(err){
                        errLog(err.stack.toString(), "text", "Mute", "Error in Addning Muted role");
                    }
                }
                commandUsed( guild.id, guild.name, message.author.id, message.author.tag, "Mute", 1, content );
        
                function caseID() {
                    var text = "";
                    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
                    
                    for (var i = 0; i < 10; i++)
                        text += possible.charAt(Math.floor(Math.random() * possible.length));
                    
                    return text;
                }
                let caseIDNo = "";
                caseIDNo = caseID();
        
                try {
                    await new LogsDatabase({
                        CaseID: caseIDNo,
                        guildID: guild.id,
                        guildName: guild.name,
                        userID: member.user.id,
                        userName: member.user.tag,
                        ActionType: "Mute",
                        Reason: muteReason,
                        Moderator: author.tag,
                        ModeratorID: author.id,
                        Muted: true,
                        Duration: durationFormat,
                        Expire: muteDuration,
                        ActionDate: new Date(),
                    }).save().catch(err => errLog(err.stack.toString(), "text", "Mute", "Error in Ctreating Data"));
                }catch(err){
                    errLog(err.stack.toString(), "text", "Mute", "Error in Creating Mute Data");
                }

                let count = await LogsDatabase.countDocuments({
                    guildID: message.guild.id, 
                    userID: member.user.id
                })

                LogChannel('actionLog', guild).then(c => {
                    if(!c) return;
                    if(c === null) return;

                    else {
                        const informations = {
                            color: "#ff303e",
                            author: {
                                name: `Mute Detection - ${caseIDNo}`,
                                icon_url: member.user.displayAvatarURL({dynamic: false, type: "png", size: 1024})
                            },
                            fields: [
                                {
                                    name: "User",
                                    value: `\`\`\`${member.user.tag}\`\`\``,
                                    inline: true
                                },
                                {
                                    name: "Moderator",
                                    value: `\`\`\`${message.author.tag}\`\`\``,
                                    inline: true
                                },
                                {
                                    name: "Duration",
                                    value: `\`\`\`${durationFormat}\`\`\``,
                                    inline: true
                                },
                                {
                                    name: "Reason",
                                    value: `\`\`\`${muteReason}\`\`\``,
                                },
                            ],
                            timestamp: new Date(),
                            footer: {
                                text: `User ID: ${member.user.id}`
                            }
    
                        }
                        const hasPermInChannel = c
                            .permissionsFor(client.user)
                            .has('SEND_MESSAGES', false);
                        if (hasPermInChannel) {
                            c.send({embeds: [informations]})
                        }
    
                        if(count >= 5){
                            if (hasPermInChannel) {
                                c.send({embeds: [new Discord.MessageEmbed()
                                    .setAuthor(`${member.user.tag}`, member.user.displayAvatarURL({dynamic: false, type: "png", size: 1024}))
                                    .setDescription(`${member.user} reached ${count} logs`)
                                    .addField("User", `\`\`\`${member.user.tag}\`\`\``.toString(), true)
                                    .addField("Total logs", `\`\`\`${count.toString()}\`\`\``, true)
                                    .setColor("RED")
                                ]}).then(m =>{
                                    m.react("✅")
                                })
                            }
                        }
                    }
                }).catch(err => console.log(err));
            }catch(err){
                errLog(err.stack.toString(), "text", "Mute", "Error in Sending log message");
            }
    }
}