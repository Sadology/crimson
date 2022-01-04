const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const ms = require('ms');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('timeout')
        .setDescription('Timeout a user')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The user you wanna timeout')
                .setRequired(true))
        .addStringOption(option => 
            option.setName("duration")
                .setRequired(true)
                .setDescription("Timeout duration"))
        .addStringOption(option => 
            option.setName("reason")
                .setDescription("Reason for timeout")),
    permissions: ["MANAGE_MESSAGES"],
    botPermission: ["MODERATE_MEMBERS"],
    category: "Slash",
    run: async(client, interaction) =>{
        const { options, guild, content, channel} = interaction;
        const User = options.getUser('user')
        const duration = options.getString('duration')

        const Data = {
            guildID: interaction.guild.id, 
            guildName: interaction.guild.name,
            userID: null, 
            userName: null,
            actionformat: "Timeout", 
            actionReason: null,
            Expire: null,
            actionLength: null,
            moderator: interaction.user.tag,
            moderatorID: interaction.user.id,
        }

        function GuildMember(Member){
            if (!Member){
                return interaction.reply({embeds: [
                    new Discord.MessageEmbed()
                    .setuser({
                        name: message.user.tag,
                        iconURL: message.user.displayAvatarURL({format: 'png', dynamic: false})
                    })
                    .setDescription( `<:error:921057346891939840> Please mention a valid member` )
                    .setColor( "#fffafa" )
                ], ephemeral: true})
                .catch(err => {return console.log(err.stack)})
            }

            const member = interaction.guild.members.resolve(Member.id);
            if(member){
                checkMemberPermission(member);
            }else {
                return interaction.reply({embeds: [
                    new Discord.MessageEmbed()
                        .setAuthor({
                            name: interaction.user.tag,
                            iconURL: interaction.user.displayAvatarURL({format: 'png', dynamic: false})
                        })
                        .setDescription( `<:error:921057346891939840> Please mention a valid member` )
                        .setColor( "#fffafa" )
                    ], ephemeral: true})
                    .catch(err => {return console.log(err)})
            }
        }

        function checkMemberPermission(Member){
            if(Member){
                const authorHighestRole = interaction.guild.members.resolve( client.user ).roles.highest.position;
                const mentionHighestRole = Member.roles.highest.position;

                let embed = new Discord.MessageEmbed()
                    .setAuthor({name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({dynamic: false, size: 1024, format: 'png'})})
                    .setColor("RED")

                if(Member.id === interaction.user.id){
                    embed.setDescription("You can't timeout yourself.")
                    return interaction.reply({embeds: [embed], ephemeral: true})
                    .catch(err => {return console.log(err.stack)})
                    
                }else if(Member.permissions.any(["MANAGE_MESSAGES", "MANAGE_ROLES", "MANAGE_GUILD", "ADMINISTRATOR", "MODERATE_MEMBERS"], { checkAdmin: true, checkOwner: true })){
                    embed.setDescription("Can't timeout an Admin/Moderator.")
                    return interaction.reply({embeds: [embed], ephemeral: true})
                    .catch(err => {return console.log(err.stack)})

                }else if(mentionHighestRole >= authorHighestRole) {
                    embed.setDescription("Can't timeout a member higher or equal role as me.")
                    return interaction.reply({embeds: [embed], ephemeral: true})
                    .catch(err => {return console.log(err.stack)})

                }else {
                    Data['userID'] = Member.user.id
                    Data['userName'] = Member.user.tag
                    DurationMaker(Member)
                }
            }
        }

        function DurationMaker(Member){
            const timeex = /[\d*]/g;

            if(!duration.match(timeex)){
                return interaction.reply({embeds: [
                    new Discord.MessageEmbed()
                        .setAuthor({name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({dynamic: false, size: 1024, format: 'png'})})
                        .setDescription("Please provide a valid time. E.g: 100s, 10m, 1h, 1d, 1w")
                        .setColor("RED")
                ], ephemeral: true})
                .catch(err => {return console.log(err.stack)}) 
            }else if(!duration.match(/^\d/)){
                return interaction.reply({embeds: [
                    new Discord.MessageEmbed()
                        .setAuthor({name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({dynamic: false, size: 1024, format: 'png'})})
                        .setDescription("Please provide a valid time. E.g: 100s, 10m, 1h, 1d, 1w")
                        .setColor("RED")
                ], ephemeral: true})
                .catch(err => {return console.log(err.stack)}) 
            }else {
                let muteLength = ms( duration );
                const durationFormat = ms(muteLength, { long: true })

                Data['Expire'] = muteLength
                Data['actionLength'] = durationFormat

                MuteMember(Member)
            }
        }

        async function MuteMember(Member){
            let timeOutReason = options.getString('reason') || "No reason provided"
            Member.timeout(Data.Expire, timeOutReason)
            .then((m) => {
                if(Data.Expire == 0){
                    interaction.reply({embeds: [
                        new Discord.MessageEmbed()
                            .setDescription(`${m.user} timeout was removed`)
                            .setColor("GREEN")
                    ], ephemeral: true})
                    .catch(err => {return console.log(err.stack)})
                }else {
                    interaction.reply({embeds: [
                        new Discord.MessageEmbed()
                            .setDescription(`Timed out ${m.user} | ${timeOutReason}`)
                            .setColor("GREEN")
                    ], ephemeral: true})
                    .catch(err => {return console.log(err.stack)})
                }
            })
            .catch(err => {
                return console.log(err.stack)
            })
        }

        GuildMember(User)
    }
}