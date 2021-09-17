const { SlashCommandBuilder } = require('@discordjs/builders');
const wait = require('util').promisify(setTimeout);
const Discord = require('discord.js');
const { GuildRole } = require('../../models')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('purge')
        .setDescription('Purge messages')
        .addStringOption(option => option.setName("amount").setDescription("Amount of message to delete").setRequired(true))
        .addUserOption(option => option.setName('user').setDescription('Purge messages of a user')),
    permission: ["MANAGE_MESSAGES",],
    run: async(client, interaction) =>{

        const { options } = interaction;
        let amt = options.getString('amount');
        const Amount = parseInt(amt)

        if(Amount >= 100){
            return interaction.reply({embeds: [new Discord.MessageEmbed()
                .setDescription("Can't delete more than 100 messages at once. Limit: 100")
                .setColor("RED")
            ], ephemeral: true})
        }
        const MemberID = options.getUser('user');
        if(MemberID){
            const Member = interaction.guild.members.cache.get(MemberID.id);
            if(Member){
                try{
                    interaction.channel.messages.fetch({
                        limit: Amount ? Amount + 1 : 100,
                    }).then(async messages => {
                        if ( Member ) {
                                messages = messages.filter(m => m.author.id === Member.id && !m.pinned)
                                await interaction.channel.bulkDelete( messages, true )
                                .then(async ( messages ) =>{

                                    interaction.reply({ embeds: [new Discord.MessageEmbed()
                                        .setDescription(`Purged ${messages.size} messages of ${Member.user}`)
                                        .setColor("GREEN")
                                    ], ephemeral: true })

                                    //logMessage("Bulk", messages.size, Member.user.id, Member.user.tag);
                                    //commandUsed( guild.id, guild.name, message.author.id, message.author.tag, "Purge", messages.size, content );
                                })
                        }else {
                            console.log('failed')
                        }
                    }).catch( error => console.log( error ));
                }catch(err){
                    console.error(err)
                }
            }
        }else {
            try{
                interaction.channel.messages.fetch({
                    limit: Amount ? Amount + 1 : 100,
                }).then(async messages => {
                    messages = messages.filter(m => !m.pinned)
                    await interaction.channel.bulkDelete( messages, true )
                    .then(async ( messages ) =>{

                        interaction.reply({ embeds: [new Discord.MessageEmbed()
                            .setDescription(`Purged ${messages.size} messages`)
                            .setColor("GREEN")
                        ], ephemeral: true })

                        //logMessage( "Bulk", messages.size, message.author.id );
                        //commandUsed( guild.id, guild.name, message.author.id, message.author.tag, "Purge", messages.size, content );
                    })
                }).catch(( err ) => console.log( err ))
            }catch(err){
                console.error(err)
            }
        }
    }
}