const { SlashCommandBuilder, roleMention } = require('@discordjs/builders');
const wait = require('util').promisify(setTimeout);
const Discord = require('discord.js');
const { CustomCommand } = require('../../models');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('custom-command')
        .setDescription('Help, list and info of custom commands')
        .addStringOption(option =>
            option.setName('options')
            .setDescription("Choose the option you want learn")
            .setRequired(true)
            .addChoice('info', 'cmd_info')
			.addChoice('list', 'cmd_list')
			.addChoice('help', 'cmd_help'))
        .addStringOption(option =>
            option.setName("name")
            .setDescription("Command name for command info option")),
    permission: ["ADMINISTRATOR"],
    run: async(client, interaction) =>{
        const { options, guild } = interaction;
        const optionName = options.getString('options');

        interaction.deferReply({ephermal: true})
        await new Promise(resolve => setTimeout(resolve, 1000))

        switch(optionName){
            case "cmd_info":
                const cmdName = options.getString('name');
                if(!cmdName){
                    interaction.editReply({embeds: [new Discord.MessageEmbed()
                        .setDescription("You forgot to provide command name")
                        .setColor("RED")
                    ]})
                }
                const fetchedData = await CustomCommand.findOne({ 
                    guildID: interaction.guild.id,
                    [`Data.name`] : cmdName
                }) 
                if(!fetchedData){
                    return await interaction.editReply({ content: 'Failed', components: [] , embeds: [new Discord.MessageEmbed().setDescription(`The command ${cmdName} doesn't exist.`).setColor("RED")], ephermal: true})
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
                        .setAuthor("Custom-command: Info")
                        .setDescription(`**Name:** ${DataToDelete.name}
                        **Content:** ${DataToDelete.content}
                        **Delete:** ${DataToDelete.deleteC}
                        **Mention:** ${DataToDelete.mention}
                        **Embed:** ${DataToDelete.embed}`)
                        .setColor("WHITE")
                        .addField(`Roles access`, DataToDelete.permission ? DataToDelete.permission.toString() : "Error finding he roles")
                        if(DataToDelete.embed === true){
                            messageEmbed.addField("Embed Properties", [
                                `**Author:** ${DataToDelete.author == null ? "None" : DataToDelete.author}`,
                                `\n**Description:** ${DataToDelete.description == null ? "None" : DataToDelete.description}`,
                                `\n**Title:** ${DataToDelete.title == null ? "None" : DataToDelete.title}`,
                                `\n**Color:** ${DataToDelete.color == null ? "None": DataToDelete.color}`,
                                `\n**Image:** [Image URL](${DataToDelete.image == null ? "https://youtu.be/dQw4w9WgXcQ" : DataToDelete.image})`,
                                `\n**Footer:** ${DataToDelete.footer == null ? "None" : DataToDelete.footer}`,
                            ].toString())
                        }

                    interaction.editReply({embeds: [messageEmbed]})
                }
            break;

            case "cmd_list":
                try {
                    await CustomCommand.find({
                        guildID: interaction.guild.id,
                    }).sort([
                        ['Data.name','ascending']
                    ]).exec(async(err, res) => {
                        if(err){
                            console.log(err)
                        }
    
                        if(res.length == 0) {
                            return interaction.editReply({embeds: [new Discord.MessageEmbed()
                                .setAuthor("Custom-command: List")
                                .setDescription(`No commands found. Create now by /command-create`)
                                .setColor("#fc5947")
                            ], ephermal: true
                            })
                        }

                        const embed = new Discord.MessageEmbed()
                            .setDescription(`Custom-command: List`)
                            .setColor("#fffafa")
    
                        for (i = 0; i < res.length; i++){
                            embed.addField(`**${i + 1}**• [ ${res[i] && res[i].Data.name} ]`,[
                                `\`\`\`Content - ${res[i] && res[i].Data.content}\`\`\``
                            ].toString())
                        } 
                        await interaction.editReply({embeds: [embed]})
                    })
                } catch (err){
                    console.log(err);
                }
            break;
            case "cmd_help":
                interaction.editReply({content: "Coming soon", ephermal: true})
            break;
        }
    }
}