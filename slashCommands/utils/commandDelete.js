const { SlashCommandBuilder, roleMention } = require('@discordjs/builders');
const wait = require('util').promisify(setTimeout);
const Discord = require('discord.js');
const { CustomCommand } = require('../../models');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('custom-cmd-delete')
        .setDescription('Delete a custom command.')
        .addStringOption(option =>
            option.setName('command-name')
            .setDescription("Name of your command.")
            .setRequired(true)),
    permission: ["MANAGE_GUILD", "ADMINISTRATOR"],
    run: async(client, interaction) =>{
        const { options, guild } = interaction;

        interaction.deferReply({ephermal: true})
        await new Promise(resolve => setTimeout(resolve, 1000))
        try {
            const cmdName = options.getString('command-name');
            const fetchedData = await CustomCommand.findOne({ 
                guildID: interaction.guild.id,
                [`Data.Name`] : cmdName
            }) 
            if(!fetchedData){
                return interaction.editReply({ content: 'Errawr', components: [] , embeds: [new Discord.MessageEmbed().setDescription(`No command found by this name ${cmdName}`).setColor("RED")], ephemeral: true})
            }
            deleteCmd(...fetchedData.Data)

            function deleteCmd(data) {
                const Data = {
                    Name: data.Name,
                    Content: data.Content,
                    Embed: data.Embed,
                    DeleteCmd: data.DeleteCmd,
                    Mention: data.Mention,
                    Description: data.Description,
                    Author: data.Author,
                    Title: data.Title,
                    Image: data.Image,
                    Color: data.Color,
                    Footer: data.Footer,
                    Permission: data.Permission,
                }

                let messageEmbed = new Discord.MessageEmbed()
                .setDescription(
                    `**Name:** ${Data.Name}
                    \n**Content:** ${Data.Content}
                    \n**Delete-cmd:** ${Data.DeleteCmd}
                    \n**Mention:** ${Data.Mention}
                    \n**Embed:** ${Data.Embed}
                    \n**Description:** ${Data.Description}
                    \n**Author:** ${Data.Author}
                    \n**Title:** ${Data.Title}
                    \n**Image:** [URL](${Data.Image == null ? "https://youtu.be/dQw4w9WgXcQ": Data.Image})
                    \n**Footer:** ${Data.Footer}
                    \n**Color:** ${Data.Color}
                    \n**Permission:** ${Data.Permission}
                    `
                )
                .setColor("RED")

            const row = new Discord.MessageActionRow()
                .addComponents(
                    new Discord.MessageButton()
                        .setCustomId('affirmativeButtonDelete')
                        .setLabel('Confirm')
                        .setStyle('SUCCESS'),
                    )
                .addComponents(
                    new Discord.MessageButton()
                        .setCustomId('negativeButtonDelete')
                        .setLabel('Cancel')
                        .setStyle('DANGER'),
                    );

            interaction.editReply({content: "Do you sure want to delete this command?" ,embeds: [messageEmbed], components: [row]})
            const filter = i => i.user.id === interaction.user.id;
            const collector = interaction.channel.createMessageComponentCollector({ filter, time: 1000 * 60 });

            collector.on('collect', async i => {
                if (i.customId === 'affirmativeButtonDelete') {
                    const cmdsData = await CustomCommand.findOne({ 
                        guildID: interaction.guild.id,
                        [`Data.Name`] : cmdName
                    }) 
                    if(!cmdsData){
                        return await i.update({ content: 'Errawr', components: [] , embeds: [new Discord.MessageEmbed().setDescription(`Something went wrong`).setColor("RED")], ephermal: true})
                    }else {
                        await CustomCommand.findOneAndUpdate({
                            guildID: interaction.guild.id,
                            ['Data.Name']: cmdName
                        }, {
                            $pull: {
                                Data: {
                                    Name: cmdName
                                }
                            }
                        }, {
                            upsert: true
                        })
                    }
                    collector.stop();
                    return await i.update({ content: 'Data deleted', components: [] , embeds: [new Discord.MessageEmbed().setDescription("Custom command successfully deleted").setColor("GREEN")]});
                }else if(i.customId === 'negativeButtonDelete'){
                    collector.stop();
                    return await i.update({ content: 'Canceled', components: [] , embeds: [new Discord.MessageEmbed().setDescription("Canceled").setColor("GREEN")]});
                }
            });
        }
        }catch(err){
            return console.log(err)
        }
    }
}