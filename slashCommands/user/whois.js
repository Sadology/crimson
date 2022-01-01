const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const moment = require('moment');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('user-info')
        .setDescription('User Inofrmations')
        .addUserOption(option => 
            option.setName('user')
            .setDescription('Informations of another user')),
    permissions: ["USE_APPLICATION_COMMANDS"],
    botPermission: ["SEND_MESSAGES"],
    category: "Slash",
    run: async(client, interaction) =>{
        const { options } = interaction;
        const MemberID = options.getUser('user')

        function fetchMember(member) {
            if(!member){
                getInfo(interaction.member)
            }else {
                let Member = interaction.guild.members.resolve(member.id)
                if(Member){
                    getInfo(Member)
                }else {
                    getInfo(interaction.member)
                }
            }
        }

        function getInfo(Member) {
            let isOwner;
            let device = "None";
            if(interaction.guild.ownerId === Member.user.id){
                isOwner = true
            }else {
                isOwner = false
            }

            if(Member.presence){
                device = Object.keys(Member.presence.clientStatus)
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
                        name:"Presence",
                        value: `${Member.presence ? Member.presence.status : "offline"}`,
                        inline: true
                    },
                    {
                        name:"Current device",
                        value: `${device}`,
                        inline: true
                    },
                    {
                        name: `Roles[${Member.roles.cache.size - 1}]`,
                        value: `${roles}`
                    }
                    )
                .setColor(Member.displayColor)

            interaction.reply({embeds: [ Embed ]})
        }
        fetchMember(MemberID)
    }
}