const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const ms = require('ms');
const { LogsDatabase, GuildChannel} = require('../../models');
const { commandUsed } = require('../../Functions/CommandUsage');
const { errLog } = require('../../Functions/erroHandling');
const { LogChannel } = require('../../Functions/logChannelFunctions');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription('Unmute a muted member')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The user you wants to unmute')
                .setRequired(true)),
    permission: ["MANAGE_MESSAGES",],
    run: async(client, interaction) =>{
        const { options, guild } = interaction;
        
        let TutEmbed = new Discord.MessageEmbed()
        const User = options.getUser('user')
        if(User){
            const Member = interaction.guild.members.cache.get(User.id);
            if(Member){
                try{
                    const previosMute = await LogsDatabase.find({
                        userID: Member.id,
                    });
            
                    const currentlyMuted = previosMute.filter(mute => {
                        return mute.Muted === true
                    });
    
                    const muteRole = await guild.roles.cache.find(r => r.name === 'Muted');
                    if( !muteRole ){
                        
                        TutEmbed.setDescription( `The \`Muted\` role does not exist` )
                        TutEmbed.setColor( "#fffafa" )
                        return interaction.reply( {embeds: [TutEmbed], ephermal: true} )
                    };
    
                    const authorHighestRole = guild.members.resolve( client.user ).roles.highest.position;
                    const mentionHighestRole = Member.roles.highest.position;
    
                    if(mentionHighestRole >= authorHighestRole) {
                        TutEmbed.setDescription( `Can't Unmute a Member with higher role than me` )
                        TutEmbed.setColor( 'RED' )
            
                        return await interaction.reply({embeds: [TutEmbed], ephermal: true})
                    }
                    
                    if ( currentlyMuted.length ){
    
                        await LogsDatabase.findOneAndUpdate({
                            guildID: guild.id,
                            Muted: true
                        },{
                            Muted: false
                        })

                        await Member.roles.remove(muteRole.id);
                        
                        interaction.reply({embeds: [new Discord.MessageEmbed()
                            .setDescription(`${Member.user.tag} has been UnMuted `)
                            .setColor("#45f766")
                        ], ephermal: true
                        })
                    }else if(Member.roles.cache.has(muteRole.id)){
                        await Member.roles.remove(muteRole.id);

                        interaction.reply({embeds: [new Discord.MessageEmbed()
                            .setDescription(`${Member.user.tag} has been UnMuted `)
                            .setColor("#45f766")
                        ], ephermal: true
                        })
                    }else {
                        return interaction.reply({embeds: [new Discord.MessageEmbed()
                            .setDescription(`${Member.user.tag} is not Muted `)
                            .setColor("RED")
                        ], ephermal: true
                        })
                    }
    
                    const logChannelData = await GuildChannel.findOne({
                        guildID: guild.id,
                        Active: true,
                        "ActionLog.UnMuteEnanled": true
                    })

                    LogChannel('actionLog', guild).then(c =>{
                        if(!c) return
                        if(c === null) return

                        else {
                            const informations = {
                                color: "#45f766",
                                author: {
                                    name: `Unmute Detection`,
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
                            c.send({embeds: [informations]})
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