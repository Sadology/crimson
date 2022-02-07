const { SlashCommandBuilder } = require('@discordjs/builders');
const wait = require('util').promisify(setTimeout);
const Discord = require('discord.js');
const moment = require('moment');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js')
const { errLog } = require('../../Functions/erroHandling');
const { LogsDatabase } = require('../../models')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fetch')
        .setDescription('Moderator Imformations')
        .addUserOption(option => option.setName('user').setDescription('Moderator informations of a user')),
    permissions: ["MANAGE_MESSAGES"],
    botPermission: ["BAN_MEMBERS", "SEND_MESSAGES"],
    category: "Slash",
    run: async(client, interaction) =>{

        const { options } = interaction;
        const MemberID = options.getUser('user')

        const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
            .setStyle("SUCCESS")
            .setLabel("More")
            .setCustomId("InfoInteraction")
            .setEmoji("❔")
        )

        interaction.deferReply()
        await new Promise(resolve => setTimeout(resolve, 1000))

        function lookupMember(Member){
            if(Member){
                const member = interaction.guild.members.cache.get(Member.id)
                if(member){
                    fetchMemberData(member)
                }else {
                    fetchBanList(Member)
                }
            }else {
                interaction.editReply({embeds: [
                    new MessageEmbed()
                        .setDescription("No member found. Please mention a valid member")
                        .setColor("RED")
                ]})
            }
        }

        async function fetchBanList(Member){
            let banList = await interaction.guild.bans.fetch();
            let bannedMember = banList.find(u => u.user.id === Member.id);

            if(bannedMember){
                fetchMemberData(bannedMember, bannedMember.reason, true)
            }else {
                return interaction.editReply({embeds: [new MessageEmbed()
                    .setDescription(`No member found. Please mention a valid member`)
                    .setColor("RED")
                ], ephemeral: true})
            }
        }

        async function fetchMemberData(Member, reason, isBanned){
            const FetchData = await LogsDatabase.findOne({
                guildID: interaction.guild.id,
                userID: Member.user.id
            });

            let count;
            if(FetchData){
                count = FetchData.Action.length
            }else {
                count = 0
            }
            const Embed = new MessageEmbed()
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
            .addField("Logs", count ? `\`\`\`${count}\`\`\``.toString() : "\`\`\`0\`\`\`", true)
            .addField('Created At', `\`\`\`${moment(Member.user.createdAt).format('MMMM Do YYYY, h:mm:ss a')} - ${moment(Member.user.createdAt, "YYYYMMDD").fromNow()}\`\`\``.toString(),true)
            if(isBanned == true){
                Embed.addField('Joined at', `\`\`\`No Data Found\`\`\``.toString(),true)
                Embed.setColor("RED")
                Embed.addField("Ban reason", `\`\`\`${reason}\`\`\``.toString())
            }else {
                Embed.setColor(Member.displayColor)
                Embed.addField('Joined at', `\`\`\`${moment(Member.joinedAt).format('MMMM Do YYYY, h:mm:ss a')} - ${moment(Member.joinedAt, "YYYYMMDD").fromNow()}\`\`\``.toString(),true)
            }

            if(isBanned == true) {
                return interaction.editReply({content: `${Member.user}`, embeds: [Embed]})
            }else {
                interaction.editReply({content: `${Member.user}`, embeds: [Embed], components: [row]}).then(msg => {
                    let newEmbed;
                    MoreInformations(Member, count).then(data => {
                        newEmbed = data
                    })
                    const collector = interaction.channel.createMessageComponentCollector({ componentType: 'BUTTON', time: 1000 * 10 });
                    collector.on('collect',async b => {
                        if(b.user.id !== interaction.user.id) return
                        if(b.customId === "InfoInteraction"){
                            return b.update({content: `${Member.user}`,embeds: [newEmbed], components: []})
                        }
                    });
                    collector.on("end", (b) =>{
                    })
                })
            }

        }

        function MoreInformations(Member, count){
            const roles = Member.roles.cache
            .sort((a,b) => b.position - a.position)
            .map(role => role.toString())
            .slice(0, -1)
            .join(', ') || "None"

            let array = Member.permissions.toArray()

            const permFlag = [
                "ADMINISTRATOR", 
                "MANAGE_GUILD", 
                "KICK_MEMBERS", 
                "BAN_MEMBERS", 
                "MANAGE_CHANNELS", 
                "MANAGE_interactionS",
                "MUTE_MEMBERS",
                "DEAFEN_MEMBERS",
                "MOVE_MEMBERS",
                "MANAGE_NICKNAMES",
                "MANAGE_ROLES",
                "MANAGE_WEBHOOKS",
                "MANAGE_EMOJIS",
                "ADD_REACTIONS",
                "VIEW_AUDIT_LOG"
            ]
            const perms = array.filter( i => permFlag.includes(i))
            const permArr = perms.join(", ")
            const permData = permArr.split("_").join(" ")

            const EditedEmbed = new MessageEmbed()
            .setAuthor(`${Member.user.tag}`, Member.user.displayAvatarURL({dynamic: true, type: 'png', size: 1024}))
            .addField('User', `\`\`\`${Member.user.tag}\`\`\``, true)
            .addField('User ID', `\`\`\`${Member.user.id}\`\`\``, true)
            .setThumbnail(Member.user.displayAvatarURL({
                dynamic: true, 
                type: 'png', 
                size: 1024
            }))
            .addField("Logs", count ? `\`\`\`${count}\`\`\`` : "\`\`\`0\`\`\`", true)
            .addField('Created At', `\`\`\`${moment(Member.user.createdAt).format('MMMM Do YYYY, h:mm:ss a')} - ${moment(Member.user.createdAt, "YYYYMMDD").fromNow()}\`\`\``,true)
            .addField('Joined at', `\`\`\`${moment(Member.joinedAt).format('MMMM Do YYYY, h:mm:ss a')} - ${moment(Member.joinedAt, "YYYYMMDD").fromNow()}\`\`\``,true)
            .addField(`Roles [${Member.roles.cache.size -1 }]`, roles)
            .addField('Key perms', `\`\`\`${permData ? permData.toLowerCase() : "NONE"}\`\`\``)
            .setColor(Member.displayColor)

            return new Promise( (resolve) => {
                resolve(EditedEmbed)
            })
        }

        lookupMember(MemberID)
    }
}