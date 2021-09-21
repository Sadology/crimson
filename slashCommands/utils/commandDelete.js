const { SlashCommandBuilder, roleMention } = require('@discordjs/builders');
const wait = require('util').promisify(setTimeout);
const Discord = require('discord.js');
const { CustomCommand } = require('../../models');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('command-delete')
        .setDescription('Delete a custom command.')
        .addStringOption(option =>
            option.setName('command-name')
            .setDescription("Name of your command.")
            .setRequired(true)),
    permission: ["ADMINISTRATOR"],
    run: async(client, interaction) =>{
        const { options, guild } = interaction;

        const cmdName = options.getString('command-name');
        const fetchedData = await CustomCommand.findOne({ 
            guildID: interaction.guild.id,
            [`Data.name`] : cmdName
        }) 
        if(!fetchedData){
            return await interaction.update({ content: 'Failed', components: [] , embeds: [new Discord.MessageEmbed().setDescription(`No command matched by this name ${cmdName}`).setColor("RED")], ephermal: true})
        }else if(fetchedData){
            const DataToDelete = {
                name: fetchedData.Data.name,
                content: fetchedData.Data.content,
                deleteC: fetchedData.Data.deleteC,
                mention: fetchedData.Data.mention,
                embed: fetchedData.Data.embed,
                permission: fetchedData.Data.permission,
                author: fetchedData.Data.author,
                description: fetchedData.Data.description,
                title: fetchedData.Data.title,
                image: fetchedData.Data.image,
                footer: fetchedData.Data.footer,
                color: fetchedData.Data.color
            }

            let messageEmbed = new Discord.MessageEmbed()
                .setAuthor("Custom-command: Delete")
                .setDescription(`**Name:** ${DataToDelete.name}
                **Content:** ${DataToDelete.content}
                **Delete:** ${DataToDelete.deleteC}
                **Mention:** ${DataToDelete.mention}
                **Embed:** ${DataToDelete.embed}`)
                .setColor("WHITE")
                .addField(`Roles access`, DataToDelete.permission ? DataToDelete.permission.toString() : "Error finding he roles")
                .addField("Embed Properties", [
                    `**Author:** ${DataToDelete.author == null ? "None" : DataToDelete.author}`,
                    `\n**Description:** ${DataToDelete.description == null ? "None" : DataToDelete.description}`,
                    `\n**Title:** ${DataToDelete.title == null ? "None" : DataToDelete.title}`,
                    `\n**Color:** ${DataToDelete.color == null ? "None": DataToDelete.color}`,
                    `\n**Image:** [Image URL](${DataToDelete.image == null ? "https://youtu.be/dQw4w9WgXcQ" : DataToDelete.image})`,
                    `\n**Footer:** ${DataToDelete.footer == null ? "None" : DataToDelete.footer}`,
                ].toString())

            interaction.deferReply({ephermal: true})
            await new Promise(resolve => setTimeout(resolve, 1000))

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

            interaction.editReply({content: "Do you want to delete this command?" ,embeds: [messageEmbed], components: [row]})
            const filter = i => i.user.id === interaction.user.id;
            const collector = interaction.channel.createMessageComponentCollector({ filter, time: 1000 * 60 });
    
            collector.on('collect', async i => {
                if (i.customId === 'affirmativeButtonDelete') {
                    const cmdsData = await CustomCommand.findOne({ 
                        guildID: interaction.guild.id,
                        [`Data.name`] : cmdName
                    }) 
                    if(!cmdsData){
                        return await i.update({ content: 'Error', components: [] , embeds: [new Discord.MessageEmbed().setDescription(`Couldn't find any command by name ${cmdName}`).setColor("RED")], ephermal: true})
                    }else {
                        await CustomCommand.findOneAndDelete({
                            guildID: interaction.guild.id,
                            ['Data.name']: cmdName
                        })
                    }
                    return await i.update({ content: 'Data deleted', components: [] , embeds: [new Discord.MessageEmbed().setDescription("Custom command successfully deleted").setColor("GREEN")]});
                }else if(i.customId === 'negativeButtonDelete'){
                    return await i.update({ content: 'Canceled', components: [] , embeds: [new Discord.MessageEmbed().setDescription("Canceled").setColor("GREEN")]});
                }
            });
        }
    }
}