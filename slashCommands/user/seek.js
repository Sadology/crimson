const { SlashCommandBuilder } = require('@discordjs/builders');
const wait = require('util').promisify(setTimeout);
const Discord = require('discord.js');
const moment = require('moment');
const { errLog } = require('../../Functions/erroHandling');
const { LogsDatabase, GuildRole} = require('../../models')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fetch')
        .setDescription('Moderator Imformations')
        .addUserOption(option => option.setName('user').setDescription('Moderator informations of a user')),
    permission: ["MANAGE_MESSAGES",],
    run: async(client, interation) =>{

        const { options } = interation;
        const MemberID = options.getUser('user')

        const count = await LogsDatabase.countDocuments({
            guildID: interation.guild.id, 
            userID: MemberID ? MemberID : interation.user.id
        })

        if(MemberID){
            let Member = interation.guild.members.cache.get(MemberID.id)
            if(Member){
                try{
                    let Embed = new Discord.MessageEmbed()
                        .setAuthor(`${Member.user.tag}`, Member.user.displayAvatarURL({
                            dynamic: true, 
                            type: 'png', 
                            size: 1024
                        }))
                        .setThumbnail(Member.user.displayAvatarURL({
                            dynamic: true,
                            type: 'png',
                            size: 1024
                        }))
                        .addField('User', `\`\`\`${Member.user.tag}\`\`\``, true)
                        .addField('User ID', `\`\`\`${Member.user.id}\`\`\``, true)
                        .addField("Logs", count ? `\`\`\`${count}\`\`\`` : "\`\`\`0\`\`\`", true)
                        .addField('Created At', `\`\`\`${moment(Member.user.createdAt).format('MMMM Do YYYY, h:mm:ss a')} - ${moment(Member.user.createdAt, "YYYYMMDD").fromNow()}\`\`\``,true)
                        .addField('Joined at', `\`\`\`${moment(Member.joinedAt).format('MMMM Do YYYY, h:mm:ss a')} - ${moment(Member.joinedAt, "YYYYMMDD").fromNow()}\`\`\``,true)
                        .setColor(Member.displayColor)

                    await interation.reply({content:`${Member.user}`,embeds: [ Embed ]})
                }catch(err){
                    console.error(err)
                }
            }
        }else {
            try{
                let Embed = new Discord.MessageEmbed()
                .setAuthor(`${interation.user.tag}`, interation.user.displayAvatarURL({
                    dynamic: true, 
                    type: 'png', 
                    size: 1024
                }))
                .setThumbnail(interation.user.displayAvatarURL({
                    dynamic: true,
                    type: 'png',
                    size: 1024
                }))
                .addField('User', `\`\`\`${interation.user.tag}\`\`\``, true)
                .addField('User ID', `\`\`\`${interation.user.id}\`\`\``, true)
                .addField("Logs", count ? `\`\`\`${count}\`\`\`` : "\`\`\`0\`\`\`", true)
                .addField('Created At', `\`\`\`${moment(interation.user.createdAt).format('MMMM Do YYYY, h:mm:ss a')} - ${moment(interation.user.createdAt, "YYYYMMDD").fromNow()}\`\`\``,true)
                .addField('Joined at', `\`\`\`${moment(interation.user.joinedAt).format('MMMM Do YYYY, h:mm:ss a')} - ${moment(interation.user.joinedAt, "YYYYMMDD").fromNow()}\`\`\``,true)
                .setColor(interation.user.displayColor)

            await interation.reply({embeds: [ Embed ]})
            }catch(err){
                console.error(err)
            }
        }
    }
}