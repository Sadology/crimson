const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('purge')
        .setDescription('Purge messages')
        .addStringOption(option => 
            option.setName("amount")
            .setDescription("Amount of message to delete")
            .setRequired(true))
        .addUserOption(option => 
            option.setName('user')
            .setDescription('Purge messages of a user')),
    permission: ["MANAGE_MESSAGES"],
    botPermission: ["MANAGE_MESSAGES"],
    run: async(client, interaction) =>{

        const { options } = interaction;
        let amt = options.getString('amount');
        const Amount = parseInt(amt)

        if(!Amount){
            return interaction.reply({embeds: [new Discord.MessageEmbed()
                .setDescription("Please provide a message amount to delete. Limit: 100")
                .setColor("RED")
            ], ephemeral: true})   
        }
        if(Amount >= 101){
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
                        limit: 100,
                    }).then(async messages => {
                        if ( Member ) {
                            interaction.channel.messages.fetch({
                                limit: 100,
                            }).then(async messages => {
                                let Arr = []
                                messages.forEach(messages =>{
                                    Arr.push(...[messages].filter(m => m.author.id === Member.id && !m.pinned))
                                })
                                let message = Arr.slice(0, Amount)
                
                                await interaction.channel.bulkDelete( message, true )
                                .then(async ( messages ) =>{
                
                                    interaction.reply({ embeds: [new Discord.MessageEmbed()
                                        .setDescription(`Purged ${messages.size} messages`)
                                        .setColor("GREEN")
                                    ], ephemeral: true })
                
                                    //logMessage( "Bulk", messages.size, message.author.id );
                                    //commandUsed( guild.id, guild.name, message.author.id, message.author.tag, "Purge", messages.size, content );
                                })
                            }).catch(( err ) => console.log( err ))
                        }else {
                            return interaction.reply({embeds: new Discord.MessageEmbed()
                                .setDescription("Please mention a valid member")
                                .setColor('RED')
                            })
                        }
                    })
                }catch(err){
                    console.log(err)
                }
            }
        }else {
            try{
                interaction.channel.messages.fetch({
                    limit: 100,
                }).then(async messages => {
                    let Arr = []
                    messages.forEach(messages =>{
                        Arr.push(...[messages].filter((m) => !m.pinned))
                    })
                    let message = Arr.slice(0, Amount)
    
                    await interaction.channel.bulkDelete( message, true )
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
                console.log(err)
            }
        }
    }
}