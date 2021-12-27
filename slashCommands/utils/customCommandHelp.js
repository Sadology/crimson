const { SlashCommandBuilder, roleMention } = require('@discordjs/builders');
const wait = require('util').promisify(setTimeout);
const Discord = require('discord.js');
const { CustomCommand } = require('../../models');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('custom-cmd')
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
    permission: ["MANAGE_MESSAGES"],
    botPermission: ["SEND_MESSAGES"],
    category: "Slash",
    run: async(client, interaction) =>{
        interaction.reply('temporary disabled')
        // const { options, guild } = interaction;
        // const optionName = options.getString('options');

        // interaction.deferReply({ephermal: true})
        // await new Promise(resolve => setTimeout(resolve, 1000))

        // switch(optionName){
        //     case "cmd_info":
        //         const cmdName = options.getString('name');
        //         if(!cmdName){
        //             interaction.editReply({embeds: [new Discord.MessageEmbed()
        //                 .setDescription("You forgot to provide command name")
        //                 .setColor("RED")
        //             ]})
        //         }
        //         const fetchedData = await CustomCommand.findOne({ 
        //             guildID: interaction.guild.id,
        //             [`Data.name`] : cmdName
        //         }) 
        //         if(!fetchedData){
        //             return await interaction.editReply({ content: 'Failed', components: [] , embeds: [new Discord.MessageEmbed().setDescription(`The command ${cmdName} doesn't exist.`).setColor("RED")], ephermal: true})
        //         }else if(fetchedData){
        //             const DataFromDB = {
        //                 name: fetchedData.Data.Name,
        //                 content: fetchedData.Data.Content,
        //                 deleteC: fetchedData.Data.deleteC,
        //                 mention: fetchedData.Data.mention,
        //                 embed: fetchedData.Data.embed,
        //                 permission: fetchedData.Data.permission,
        //                 author: fetchedData.Data.author,
        //                 description: fetchedData.Data.description,
        //                 title: fetchedData.Data.title,
        //                 image: fetchedData.Data.image,
        //                 footer: fetchedData.Data.footer,
        //                 color: fetchedData.Data.color
        //             }

        //             let rolesArr = []
        //             DataFromDB.permission.forEach(role =>{
        //                 let findTheRoles = interaction.guild.roles.cache.find(r => r.id == role)
            
        //                 if(findTheRoles){
        //                     rolesArr.push(findTheRoles.toString())
        //                 }
        //             })
        
        //             let messageEmbed = new Discord.MessageEmbed()
        //                 .setAuthor("Custom-command: Info")
        //                 .setDescription(`**Name:** ${DataFromDB.name}
        //                 **Content:** ${DataFromDB.content}
        //                 **Delete:** ${DataFromDB.deleteC}
        //                 **Mention:** ${DataFromDB.mention}
        //                 **Embed:** ${DataFromDB.embed}`)
        //                 .setColor("WHITE")
        //                 .addField(`Roles access`, DataFromDB.permission ? rolesArr.toString() : "Error finding the roles")
        //                 if(DataFromDB.embed === true){
        //                     messageEmbed.addField("Embed Properties", [
        //                         `**Author:** ${DataFromDB.author == null ? "None" : DataFromDB.author}`,
        //                         `\n**Description:** ${DataFromDB.description == null ? "None" : DataFromDB.description}`,
        //                         `\n**Title:** ${DataFromDB.title == null ? "None" : DataFromDB.title}`,
        //                         `\n**Color:** ${DataFromDB.color == null ? "None": DataFromDB.color}`,
        //                         `\n**Image:** [Image URL](${DataFromDB.image == null ? "https://youtu.be/dQw4w9WgXcQ" : DataFromDB.image})`,
        //                         `\n**Footer:** ${DataFromDB.footer == null ? "None" : DataFromDB.footer}`,
        //                     ].toString())
        //                 }

        //             interaction.editReply({embeds: [messageEmbed]})
        //         }
        //     break;

        //     case "cmd_list":
        //         try {
        //             await CustomCommand.find({
        //                 guildID: interaction.guild.id,
        //             }).sort([
        //                 ['Data.Name','ascending']
        //             ]).exec(async(err, res) => {
        //                 if(err){
        //                     console.log(err)
        //                 }
    
        //                 if(res.length == 0) {
        //                     return interaction.editReply({embeds: [new Discord.MessageEmbed()
        //                         .setAuthor("Custom-command: List")
        //                         .setDescription(`No commands found. Create now by /command-create`)
        //                         .setColor("#fc5947")
        //                     ], ephermal: true
        //                     })
        //                 }
                        
        //                 const embed = new Discord.MessageEmbed()
        //                     .setDescription(`Custom-command: List`)
        //                     .setColor("#fffafa")
        //                     .setFooter("/custom-command [ info ] [ command-name ] to learn more")
    
        //                 for (i = 0; i < res.length; i++){
        //                     embed.addField(`**${i + 1}**• [ ${res[i] && res[i].Data.Name} ]`,[
        //                         `\`\`\`Content - ${res[i] && res[i].Data.Content}\`\`\``
        //                     ].toString())
        //                 } 
        //                 await interaction.editReply({embeds: [embed]})
        //             })
        //         } catch (err){
        //             console.log(err);
        //         }
        //     break;
        //     case "cmd_help":
        //         interaction.editReply({content: "Coming soon", ephermal: true})
        //     break;
        // }
    }
}