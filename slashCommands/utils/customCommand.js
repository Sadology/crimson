const { SlashCommandBuilder, roleMention } = require('@discordjs/builders');
const wait = require('util').promisify(setTimeout);
const Discord = require('discord.js');
const { CustomCommand } = require('../../models');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('command-create')
        .setDescription('Create a custom command for your server.')
        .addStringOption(option =>
            option.setName('name')
            .setDescription("Name of your command.")
            .setRequired(true))
        .addBooleanOption(option =>
            option.setName("embed")
            .setDescription("Send the command in embed")
            .setRequired(true))
        .addStringOption(option => 
            option.setName('permissions')
            .setDescription('Role permission to use the command. separate each roles with [,]')
            .setRequired(true))
        .addStringOption(option =>
            option.setName('content')
            .setDescription("Content message of the command.")
            .setRequired(true))
        .addBooleanOption(option =>
            option.setName("delete")
            .setDescription("Delete the command when executed."))
        .addBooleanOption(option =>
            option.setName("mention")
            .setDescription("Required to mention a user to use the command."))
        .addStringOption(option =>
            option.setName("author")
            .setDescription("Set an author for embed"))
        .addStringOption(option =>
            option.setName("description")
            .setDescription("Set a description for embed"))
        .addStringOption(option =>
            option.setName("title")
            .setDescription("Set a title for embed"))
        .addStringOption(option =>
            option.setName("image")
            .setDescription("Set an image for embed"))
        .addStringOption(option =>
            option.setName("color")
            .setDescription("Set a color for embed"))        
        .addStringOption(option =>
            option.setName("footer")
            .setDescription("Set a footer for embed")),
    permission: ["ADMINISTRATOR"],
    run: async(client, interaction) =>{
        const { options, guild } = interaction;

        const Name = options.getString('name');
        const Embed = options.getBoolean('embed');
        const Perms = options.getString('permissions');
        const Content = options.getString('content');
        const deleteCmds = options.getBoolean('delete');
        const mention = options.getBoolean('mention');

        const commandConstructor = {
            name: Name.replace(/\s+/, ''),
            content: Content ? Content : null,
            deleteC: deleteCmds ? deleteCmds : false,
            mention: mention ? deleteCmds : false,
            embed: Embed,
            permission: [],
            author: null,
            description: null,
            title: null,
            image: null,
            footer: null,
            color: null
        }

        let wordLimit = Content.split(" ")
        let descLimit = Content.split(" ")
        let authorLimit = Content.split(" ")
        let titleLimit = Content.split(" ")
        if(wordLimit.length >= 500){
            return interaction.reply({embeds: [new Discord.MessageEmbed()
                .setDescription(`Content can't exceed more than 500 words`)
                .setColor("RED")
            ], ephermal: true})
        }
        if(descLimit.length >= 1000){
            return interaction.reply({embeds: [new Discord.MessageEmbed()
                .setDescription(`Description can't exceed more than 1000 words`)
                .setColor("RED")
            ], ephermal: true})
        }
        if(authorLimit.length >= 50){
            return interaction.reply({embeds: [new Discord.MessageEmbed()
                .setDescription(`Author can't exceed more than 20 words`)
                .setColor("RED")
            ], ephermal: true})
        }
        if(titleLimit.length >= 50){
            return interaction.reply({embeds: [new Discord.MessageEmbed()
                .setDescription(`Title can't exceed more than 50 words`)
                .setColor("RED")
            ], ephermal: true})
        }

        const errArr = [];
        let element = Perms.split(/,\s+/)
        items = element.map(function (el) {
            return el.trim();
        });

        let rolesString = []

        items.forEach(async role => {
            searchRoles = guild.roles.cache.find(r => r.id == role.replace( '<@&' , '' ).replace( '>' , '' )) || 
            guild.roles.cache.find(r => r.name.toLowerCase() == role.toLowerCase()) || 
            guild.roles.cache.find(r => r.id == role);

            if(searchRoles){
                commandConstructor.permission.push(searchRoles.id);
                rolesString.push(searchRoles.toString())

            }else if(typeof searchRoles === "undefined"){
                async function add(value) {
                    if (errArr.indexOf(value) === -1) {
                        errArr.push(value);
                    }
                }
                add(role)
            }
        });
        if(errArr.length){
            return interaction.reply({embeds: [new Discord.MessageEmbed()
                .setDescription(`Couldnt find following roles: \n${errArr}`)
                .setColor("RED")
            ], ephermal: true})
        }

        if(Embed === true){
            const author = options.getString('author');
            const description = options.getString('description');
            const title = options.getString('title');
            const color = options.getString('color');
            const image = options.getString('image');
            const footer = options.getString('footer');

            commandConstructor.author = author;
            commandConstructor.description = description;
            commandConstructor.title = title;
            commandConstructor.color = color;
            commandConstructor.image = image;
            commandConstructor.footer = footer;
        }

        let messageEmbed = new Discord.MessageEmbed()
            .setAuthor("Custom-command: Create")
            .setDescription(`**Name:** ${commandConstructor.name}
            **Content:** ${commandConstructor.content}
            **Delete:** ${commandConstructor.deleteC}
            **Mention:** ${commandConstructor.name}
            **Embed:** ${commandConstructor.name}`)
            .setColor("WHITE")
            .addField(`Roles permission`, rolesString ? rolesString.toString() : "Error finding he roles")
            if(Embed === true){
                messageEmbed.addField("Embed Properties", [
                    `**Author:** ${commandConstructor.author == null ? "None" : commandConstructor.author}`,
                    `\n**Description:** ${commandConstructor.description == null ? "None" : commandConstructor.description}`,
                    `\n**Title:** ${commandConstructor.title == null ? "None" : commandConstructor.title}`,
                    `\n**Color:** ${commandConstructor.color == null ? "None": commandConstructor.color === null}`,
                    `\n**Image:** [Image URL](${commandConstructor.image == null ? "https://youtu.be/dQw4w9WgXcQ" : commandConstructor.image})`,
                    `\n**Footer:** ${commandConstructor.footer == null ? "None" : commandConstructor.footer}`,
                ].toString())
            }

        const row = new Discord.MessageActionRow()
        .addComponents(
            new Discord.MessageButton()
                .setCustomId('YesButt')
                .setLabel('Confirm')
                .setStyle('SUCCESS'),
            )
        .addComponents(
            new Discord.MessageButton()
                .setCustomId('NoButt')
                .setLabel('Cancel')
                .setStyle('DANGER'),
            );

        interaction.reply({content: "Do you wish to save this command?",embeds: [messageEmbed], components: [row]})

        const filter = i => i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 1000 * 60 });

        collector.on('collect', async i => {
            if (i.customId === 'YesButt') {

                const cmdsData = await CustomCommand.findOne({ 
                    guildID: interaction.guild.id,
                    [`Data.name`] : Name
                }) 
                if(cmdsData){
                    return await i.update({ content: 'Something went wrong', components: [] , embeds: [new Discord.MessageEmbed().setDescription("Error | Command already exist by his name").setColor("RED")], ephermal: true})
                }else {
                    await new CustomCommand({
                        guildID: interaction.guild.id,
                        guildName: interaction.guild.name,
                        Data: commandConstructor
                    }).save().catch(err => console.log(err))
                }
                await i.update({ content: 'Saved', components: [] , embeds: [new Discord.MessageEmbed().setDescription("Saved to database. You can now use it").setColor("GREEN")]});
            }else if(i.customId === 'NoButt'){
                await i.update({ content: 'Done', components: [] , embeds: [new Discord.MessageEmbed().setDescription("Deleted the command").setColor("GREEN")]});
            }
        });
        
        collector.on('end', collected => {});
    }
}