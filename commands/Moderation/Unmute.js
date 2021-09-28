const Discord = require('discord.js');
const ms = require('ms')
const { LogsDatabase, GuildChannel, GuildRole } = require('../../models')
const Member = require('../../Functions/MemberFunction');

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

        if(!message.member.permissions.has("MANAGE_MESSAGES")){
            return message.author.send('None of your role proccess to use this command')
        }

        const TutEmbed = new Discord.MessageEmbed()
        .setAuthor( "Command - UnMUTE" )

        if( !args.length ){
            TutEmbed.setDescription( `Unmutes a muted member to let them chat and speak again \n**Usage**: ${prefix}unmute [ Member ] \n**Example:** \n${prefix}unmute @shadow~` )
            TutEmbed.setFooter( "Bot require \"MANAGE_ROLES\" permission to remove \"Muted\" role" )
            TutEmbed.setColor( "#fffafa" )
            return message.channel.send( {embeds: [TutEmbed]} ).then(m=>setTimeout(() => m.delete(), 1000 * 10));
        }

        const FindMembers = new Member(args[0], message);
        message.guild.members.fetch()
        const member = message.guild.members.cache.get(FindMembers.mentionedMember)

        if(member){
            const previosMute = await LogsDatabase.find({
                userID: member.id,
            });
    
            const currentlyMuted = previosMute.filter(mute => {
                return mute.Muted === true
            });

            const muteRole = await message.guild.roles.cache.find(r => r.name === 'Muted');
            if( !muteRole ){
                TutEmbed.setDescription( `The \`Muted\` role does not exist` )
                TutEmbed.setColor( "#fffafa" )
                return message.channel.send( {embeds: [TutEmbed]} ).then(m=>setTimeout(() => m.delete(), 1000 * 10));
            };

            const authorHighestRole = message.guild.members.resolve( client.user ).roles.highest.position;
            const  mentionHighestRole = member.roles.highest.position;

            if(mentionHighestRole >= authorHighestRole) {
                TutEmbed.setDescription( `Can't Unmute a member with higher role than me` )
                TutEmbed.setColor( '#ff303e' )
    
                return await message.channel.send({embeds: [TutEmbed]}).then(m=>setTimeout(() => m.delete(), 1000 * 10))
            }
            
            if ( currentlyMuted.length ){
                await LogsDatabase.findOneAndUpdate({
                    guildID: guild.id,
                    Muted: true
                },{
                    Muted: false
                })

                try{
                    await member.roles.remove(muteRole.id);
                    
                    channel.send({embeds: [new Discord.MessageEmbed()
                        .setDescription(`${member.user.tag} has been UnMuted `)
                        .setColor("#45f766")
                    ]
                    }).then(m=>setTimeout(() => m.delete(), 1000 * 10))
                }catch(err){
                    console.log(err)
                };
            }else if(member.roles.cache.has(muteRole.id)){
                try{
                    await member.roles.remove(muteRole.id);

                    channel.send({embeds: [new Discord.MessageEmbed()
                        .setDescription(`${member.user.tag} has been UnMuted `)
                        .setColor("#45f766")
                    ]
                    }).then(m=>setTimeout(() => m.delete(), 1000 * 10))
                }catch(err){
                    console.log(err)
                };
            }else {
                return channel.send({embeds: [new Discord.MessageEmbed()
                    .setDescription(`${member.user.tag} is not Muted `)
                    .setColor("#ff303e")
                ]
                }).then(m=>setTimeout(() => m.delete(), 1000 * 10))
            }

            const logChannelData = await GuildChannel.findOne({
                guildID: message.guild.id,
                Active: true,
                "ActionLog.UnMuteEnanled": true
            })
            if(logChannelData){
                try{
                    const logChannel = message.guild.channels.cache.get(logChannelData.ActionLog.UnMuteChannel)

                    if(logChannel){

                        const informations = {
                            color: "#45f766",
                            author: {
                                name: `Unmute`,
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
                            ],
                            timestamp: new Date(),
                            footer: {
                                text: `User ID: ${member.user.id}`
                            }

                        }
                        logChannel.send({embeds: [informations]})
                    }
                }catch (err){
                    console.log(err)
                }
            }
        }else {
            TutEmbed.setDescription( `Invalid member | Couldn't find the member` )
    
            TutEmbed.setColor( "#ff303e" )
            return message.channel.send( {embeds: [TutEmbed]} ).then(m=>setTimeout(() => m.delete(), 1000 * 10))
        }
    }
}