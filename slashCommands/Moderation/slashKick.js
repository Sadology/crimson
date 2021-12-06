const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const { ModStatus } = require('../../Functions/functions');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('kick')
        .setDescription('kick a member from the server.')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The user you wants to kick out')
                .setRequired(true))
        .addStringOption(option => 
            option.setName("reason")
                .setDescription("Reason for kicking")),
    permission: ["KICK_MEMBERS"],
    run: async(client, interaction) =>{
        const { options, guild, content, channel} = interaction;
        const User = options.getUser('user')

        interaction.deferReply({ephemeral: true})
        await new Promise(resolve => setTimeout(resolve, 1000))

        if(!interaction.guild.me.permissions.has(["KICK_MEMBERS", "ADMINISTRATOR"])){
            return interaction.reply({embeds: [
                new Discord.MessageEmbed()
                    .setDescription("I don't have \"KICK_MEMBERS\" permission to kick the member.")
                    .setColor("RED")
            ]})
        }
        const kickReason = options.getString('reason') || "No reason Provided"
        function findMember(Member){
            try {
                if(Member){
                    const member = interaction.guild.members.cache.get(Member.id);

                    if(member){
                        MemberPermissionCheck(member);
                    } else {
                        return interaction.editReply({embeds: [new Discord.MessageEmbed()
                            .setDescription(`Please mention a valid member.`)
                            .setColor("RED")
                        ]})
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

        function MemberPermissionCheck(Member){
            try {
                const authorHighestRole1 = interaction.member.roles.highest.position;
                const mentionHighestRole1 = Member.roles.highest.position;
                const clientHighestRole = interaction.guild.members.resolve( client.user ).roles.highest.position;

                const ErrorEmbed = new Discord.MessageEmbed()
                    .setAuthor(interaction.user.tag, interaction.user.displayAvatarURL({dynamic: false, size: 1024, type: 'png'}))
                    .setColor("RED")

                if(Member.user.id === interaction.user.id){
                    ErrorEmbed.setDescription(`Unfortunately you can't kick yourself.`)
                    return interaction.editReply( {embeds: [ErrorEmbed]} )

                }else if(Member.user.id === client.user.id){
                    ErrorEmbed.setDescription(`Why you want to kick me ;-;`)
                    return interaction.editReply( {embeds: [ErrorEmbed]} )

                }else if (Member.kickable === false){  
                    ErrorEmbed.setDescription(`Can't kick a Mod/Admin.`)
                    return interaction.editReply( {embeds: [ErrorEmbed]} );

                }else if (Member.permissions.has("BAN_MEMBERS", "KICK_MEMBERS", "MANAGE_CHANNELS", "MANAGE_ROLES", "MANAGE_MESSAGES", "MANAGE_GUILD", "ADMINISTRATOR", { checkAdmin: true, checkOwner: true })){
                    ErrorEmbed.setDescription(`Can't kick a Mod/Admin.`)
                    return interaction.editReply( {embeds: [ErrorEmbed]} )

                }else if (mentionHighestRole1 >= authorHighestRole1) {
                    ErrorEmbed.setDescription(`Can't kick member with higher or equal role as you ${interaction.user}.`)
                    return interaction.editReply( {embeds: [ErrorEmbed]} )

                }else if (mentionHighestRole1 >= clientHighestRole){
                    ErrorEmbed.setDescription(`Can't kick a member higher or equal role as me.`)
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
                await interaction.guild.members.kick(Member.id, kickReason + ' | ' + `${Member.user.id}` + ' | ' + `${interaction.user.tag}`);
                interaction.editReply({embeds: [new Discord.MessageEmbed()
                    .setDescription(`${Member.user} was kicked from the server | ${kickReason}`)
                    .setColor( "#45f766" )
                ]
                })
                ModStatus({type: "Kick", guild: interaction.guild, member: interaction.user, content: content})
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