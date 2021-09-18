const { SlashCommandBuilder } = require('@discordjs/builders');
const wait = require('util').promisify(setTimeout);
const Discord = require('discord.js');
const { errLog } = require('../../Functions/erroHandling');
const { LogsDatabase, GuildRole} = require('../../models')
const moment = require('moment');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('user-info')
        .setDescription('User Inofrmations')
        .addUserOption(option => option.setName('user').setDescription('Informations of another user')),
    run: async(client, interation) =>{

        const { options } = interation;
        const MemberID = options.getUser('user')

        if(MemberID){
            let Member = interation.guild.members.cache.get(MemberID.id)

            if(Member){
                try{            
                    let isOwner
                    if(interation.guild.ownerId === Member.id){
                        isOwner = true
                    }else {
                        isOwner = false
                    }

                    let roles = Member.roles.cache
                        .sort((a,b) => b.position - a.position)
                        .map(role => role.toString())
                        .slice(0, -1)
                        .join(', ') || "None"
                    let Embed = new Discord.MessageEmbed()
                        .setAuthor(Member.user.tag, Member.user.displayAvatarURL({dynamic: true, size: 1024, type: 'png'}))
                        .setThumbnail(Member.user.avatarURL({dynamic: true, size: 1024, type: 'png'}) ? Member.user.avatarURL({dynamic: true, size: 1024, type: 'png'}) : Member.user.displayAvatarURL({dynamic: true, size: 1024, type: 'png'}))
                        .addFields(
                            {
                                name: "Join Date",
                                value: `${moment(Member.joinedAt).format('MMMM Do YYYY, h:mm:ss a')} - ${moment(Member.joinedAt, "YYYYMMDD").fromNow()}`,
                                inline: true
                            },
                            {
                                name: "Creation Date",
                                value: `${moment(Member.user.createdAt).format('MMMM Do YYYY, h:mm:ss a')} - ${moment(Member.user.createdAt, "YYYYMMDD").fromNow()}`,
                                inline: true  
                            },
                            {
                                name: "Nitro booster",
                                value: `${Member.premiumSince ? moment(Member.premiumSince).format('MMMM Do YYYY, h:mm:ss a') : "Not a booster"}`,
                                inline: true
                            },
                            {
                                name:"Owner",
                                value: isOwner.toString(),
                                inline: true
                            },
                            {
                                name:"Avatar URL",
                                value: `[URL](${Member.user.displayAvatarURL()})`,
                                inline: true
                            },
                            {
                                name: `Roles[${Member.roles.cache.size - 1}]`,
                                value: `${roles}`
                            }
                            )
                        .setColor(Member.displayColor)

                    await interation.reply({embeds: [ Embed ]})
                }catch(err){
                    console.log(err)
                }
            }
        }else {
            try{
                let Member = interation.guild.members.cache.get(interation.user.id)
                let Embed = new Discord.MessageEmbed()

                await interation.reply({embeds: [ Embed ]})
            }catch(err){
                console.log(err)
            }
        }
    }
}