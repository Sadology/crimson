const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const ms = require('ms');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unban')
        .setDescription('Unbans a Banned user.')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The user you wants to Unban')
                .setRequired(true))
        .addStringOption(option => 
            option.setName("reason")
                .setDescription("Reason for Unban")),
    permission: ["BAN_MEMBERS"],
    botPermission: ["BAN_MEMBERS"],
    run: async(client, interaction) =>{
        const { options, guild, content, channel} = interaction;
        const User = options.getUser('user')

        interaction.deferReply({ephemeral: true})
        await new Promise(resolve => setTimeout(resolve, 1000))

        function findMember(Member){
            try {
                if(Member){
                    const member = interaction.guild.members.cache.get(Member.id);

                    if(member){
                        return interaction.editReply({embeds: [
                            new Discord.MessageEmbed()
                                .setDescription(`${member} is not banned`)
                                .setColor("RED")
                        ]});
                    } else {
                        UnBan(Member);
                    }
                }else {
                    interaction.editReply({embeds: [new Discord.MessageEmbed()
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

        async function UnBan(Member){
            try {
                await interaction.guild.bans.fetch().then(bans=> {
                    if(bans.size == 0) return
                    let bUser = bans.find(b => b.user.id == Member.id)
                    if(!bUser) {
                        return interaction.editReply({embeds: [new Discord.MessageEmbed()
                            .setDescription(`${Member} is not Banned`)
                            .setColor("RED")
                        ]})
                    }else {
                        interaction.guild.members.unban(Member)
                    }
                });

                return interaction.editReply({embeds: [new Discord.MessageEmbed()
                    .setDescription(`${Member} is UnBanned from the server`)
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