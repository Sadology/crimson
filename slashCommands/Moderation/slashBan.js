const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ban')
        .setDescription('Ban a member from the server.')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The user you wants to Ban')
                .setRequired(true))
        .addStringOption(option => 
            option.setName("reason")
                .setDescription("Reason for Ban")),
    permissions: ["BAN_MEMBERS"],
    botPermission: ["BAN_MEMBERS"],
    category: "Slash",
    run: async(client, interaction) =>{
        const { options, guild, content, channel} = interaction;
        const User = options.getUser('user')

        interaction.deferReply({ephemeral: true})
        await new Promise(resolve => setTimeout(resolve, 1000))

        const banReason = options.getString('reason') || "No reason Provided"
        function findMember(Member){
            try {
                if(Member){
                    const member = interaction.guild.members.cache.get(Member.id);

                    if(member){
                        MemberPermissionCheck(member);
                    } else {
                        HackBan(Member);
                    }
                }else {
                    return interaction.editReply({embeds: [new Discord.MessageEmbed()
                        .setDescription(`Please mention a valid member.`)
                        .setColor("RED")
                    ]})
                }
            }catch(err){
                interaction.editReply({embeds: [new Discord.MessageEmbed()
                    .setDescription(err.message)
                    .setColor("RED")
                ]})
                return console.log(err);
            }

        }

        async function HackBan(Member){
            let banList = await interaction.guild.bans.fetch();
            let bannedMember = banList.find(u => u.user.id === Member);

            if(bannedMember){
                return interaction.editReply({embeds: [
                    new Discord.MessageEmbed()
                        .setDescription(`<@${Member}> is already banned.`)
                        .setColor("RED")
                ]})
            }else {
                try {
                    await interaction.guild.members.ban(Member, {reason: banReason + ' | ' + `${Member.id}` + ' | ' + `${interaction.user.tag}`});
                    return interaction.editReply({embeds: [new Discord.MessageEmbed()
                        .setDescription(`${Member} is Banned from the server | ${banReason}`)
                        .setColor( "#45f766" )
                    ]
                    })
                } catch(err){
                    interaction.editReply({embeds: [new Discord.MessageEmbed()
                        .setDescription(err.message)
                        .setColor("RED")
                    ]})

                    return console.log(err)
                }
            }
        }

        function MemberPermissionCheck(Member){
            try {
                const authorHighestRole1 = interaction.member.roles.highest.position;
                const mentionHighestRole1 = Member.roles.highest.position;
                const clientHighestRole = interaction.guild.members.resolve( client.user ).roles.highest.position;

                const ErrorEmbed = new Discord.MessageEmbed()
                    .setAuthor(interaction.user.tag, interaction.user.displayAvatarURL({dynamic: false, size: 1024, type: 'png'}))
                    .setColor("RED")

                if(Member.user.id === interaction.user.id){
                    ErrorEmbed.setDescription(`Unfortunately you can't ban yourself.`)
                    return interaction.editReply( {embeds: [ErrorEmbed]} )

                }else if(Member.user.id === client.user.id){
                    ErrorEmbed.setDescription(`Please don't ban me 😔🙏`)
                    return interaction.editReply( {embeds: [ErrorEmbed]} )

                }else if (Member.bannable === false){  
                    ErrorEmbed.setDescription(`Can't ban a Mod/Admin.`)
                    return interaction.editReply( {embeds: [ErrorEmbed]} );

                }else if (Member.permissions.has("BAN_MEMBERS", "KICK_MEMBERS", "MANAGE_CHANNELS", "MANAGE_ROLES", "MANAGE_MESSAGES", "MANAGE_GUILD", "ADMINISTRATOR", { checkAdmin: true, checkOwner: true })){
                    ErrorEmbed.setDescription(`Can't ban a Mod/Admin.`)
                    return interaction.editReply( {embeds: [ErrorEmbed]} )

                }else if (mentionHighestRole1 >= authorHighestRole1) {
                    ErrorEmbed.setDescription(`Can't ban member with higher or equal role as you.`)
                    return interaction.editReply( {embeds: [ErrorEmbed]} )

                }else if (mentionHighestRole1 >= clientHighestRole){
                    ErrorEmbed.setDescription(`Can't ban a member higher or equal role as me.`)
                    return interaction.editReply( {embeds: [ErrorEmbed]} );

                }else {
                    BanMember(Member)
                }
            } catch(err){
                interaction.editReply({embeds: [new Discord.MessageEmbed()
                    .setDescription(err.message)
                    .setColor("RED")
                ]})
                return console.log(err) 
            }
        }

        async function BanMember(Member){
            try {
                await interaction.guild.members.ban(Member.id, {reason: banReason + ' | ' + `${Member.user.id}` + ' | ' + `${interaction.user.tag}`});
                return interaction.editReply({embeds: [new Discord.MessageEmbed()
                    .setDescription(`${Member.user} is Banned from the server | ${banReason}`)
                    .setColor( "#45f766" )
                ]
                })
                
            }catch(err){
                interaction.editReply({embeds: [new Discord.MessageEmbed()
                    .setDescription(err.message)
                    .setColor("RED")
                ]})
                return console.log(err)
            }
        }

        if(User){
            findMember(User)  
        }
    }
}