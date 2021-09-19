const { SlashCommandBuilder, roleMention } = require('@discordjs/builders');
const wait = require('util').promisify(setTimeout);
const Discord = require('discord.js');
const { CustomCommand } = require('../../models');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('command-edit')
        .setDescription('Edit a custom command.')
        .addStringOption(option =>
            option.setName('command-name')
            .setDescription("Name of your command.")
            .setRequired(true))
        .addStringOption(option =>
            option.setName('name')
            .setDescription("Name of your command."))
        .addBooleanOption(option =>
            option.setName("embed")
            .setDescription("Send the command in embed"))
        .addStringOption(option => 
            option.setName('permissions')
            .setDescription('Role permission to use the command. separate each roles with [,]'))
        .addStringOption(option =>
            option.setName('content')
            .setDescription("Content message of the command."))
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

        const cmdName = options.getString('command-name');
        const fetchedData = await CustomCommand.findOne({ 
            guildID: interaction.guild.id,
            [`Data.name`] : cmdName
        }) 
        if(!fetchedData){
            return await interaction.reply({ content: 'Something went wrong', components: [] , embeds: [new Discord.MessageEmbed().setDescription(`No command found by this name ${cmdName}`).setColor("RED")], ephermal: true})
        }

        const Name = options.getString('name');
        const Embed = options.getBoolean('embed');
        const Perms = options.getString('permissions');
        const Content = options.getString('content');
        const deleteCmds = options.getBoolean('delete');
        const mention = options.getBoolean('mention');

        const newData = {
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
        if(Name){
            newData['name'] = Name.replace(/\s+/g, '')
        }
        if(Content){
           let wordLimit = Content.split(" ")
            if(wordLimit.length >= 500){
                return interaction.reply({embeds: [new Discord.MessageEmbed()
                    .setDescription(`Content can't exceed more than 500 words`)
                    .setColor("RED")
                ], ephermal: true})
            }
            newData['content'] = Content
        }
        if(Embed){
            newData['embed'] = Embed
        }
        if(Embed === true){
            const author = options.getString('author');
            const description = options.getString('description');
            const title = options.getString('title');
            const color = options.getString('color');
            const image = options.getString('image');
            const footer = options.getString('footer');

            if(description){
                let descLimit = description.split(" ")

                if(descLimit.length >= 1000){
                    return interaction.reply({embeds: [new Discord.MessageEmbed()
                        .setDescription(`Description can't exceed more than 1000 words`)
                        .setColor("RED")
                    ], ephermal: true})
                }
                newData["description"] = description;
            }
            if(author){
                let authorLimit = author.split(" ")

                if(authorLimit.length >= 50){
                    return interaction.reply({embeds: [new Discord.MessageEmbed()
                        .setDescription(`Author can't exceed more than 20 words`)
                        .setColor("RED")
                    ], ephermal: true})
                }
                newData["author"] = author;
            }
            if(title){
                let titleLimit = title.split(" ")

                if(titleLimit.length >= 50){
                    return interaction.reply({embeds: [new Discord.MessageEmbed()
                        .setDescription(`Title can't exceed more than 50 words`)
                        .setColor("RED")
                    ], ephermal: true})
                }
                newData["title"] = title;
            }
            if(footer){
                let footerLimit = footer.split(" ")

                if(footerLimit.length >= 50){
                    return interaction.reply({embeds: [new Discord.MessageEmbed()
                        .setDescription(`Footer can't exceed more than 50 words`)
                        .setColor("RED")
                    ], ephermal: true})
                }
                newData["footer"] = footer;
            }

            if(color){
                newData["color"] = color;
            }
            if(image){
                newData["image"] = image;
            }
        }

        rolesString = []
        if(Perms){
            const errArr = [];
            let element = Perms.split(/,\s+/)
            items = element.map(function (el) {
                return el.trim();
            });

            items.forEach(async role => {
                searchRoles = guild.roles.cache.find(r => r.id == role.replace( '<@&' , '' ).replace( '>' , '' )) || 
                guild.roles.cache.find(r => r.name.toLowerCase() == role.toLowerCase()) || 
                guild.roles.cache.find(r => r.id == role);

                if(searchRoles){
                    newData["permission"].push(searchRoles.id);
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
        }

        if(deleteCmds){
            newData['deleteC'] = deleteCmds
        }

        if(mention){
            newData['mention'] = mention
        }

        let messageEmbed = new Discord.MessageEmbed()
            .setAuthor("Custom-command: Create")
            .setDescription(`**Name:** ${newData.name ? newData.name : "None"}
            **Content:** ${newData.content ? newData.content : "None"}
            **Delete:** ${newData.deleteC ? newData.deleteC : "None"}
            **Mention:** ${newData.mention ? newData.name : "None"}
            **Embed:** ${newData.embed ? newData.embed : "None"}`)
            .setColor("WHITE")
            
            if(Embed === true){
                messageEmbed.addField("Embed Properties", [
                    `**Author:** ${newData.author ? newData.author : "None"}`,
                    `\n**Description:** ${newData.description ? newData.description : "None"}`,
                    `\n**Title:** ${newData.title ? newData.title : "None"}`,
                    `\n**Color:** ${newData.color ? newData.color : "None"}`,
                    `\n**Image:** [Image URL](${newData.image ? newData.image : "https://youtu.be/dQw4w9WgXcQ"})`,
                    `\n**Footer:** ${newData.footer ? newData.image : "None"}`,
                ].toString())
            }

        const row = new Discord.MessageActionRow()
        .addComponents(
            new Discord.MessageButton()
                .setCustomId('affirmativeButtonEdit')
                .setLabel('Confirm')
                .setStyle('SUCCESS'),
            )
        .addComponents(
            new Discord.MessageButton()
                .setCustomId('negativeButtonEdit')
                .setLabel('Cancel')
                .setStyle('DANGER'),
            );

        interaction.reply({content: "Do you wish to save this new edited command?",embeds: [messageEmbed], components: [row]})

        const filter = i => i.user.id === interaction.user.id;
        const collector = interaction.channel.createMessageComponentCollector({ filter, time: 1000 * 60 });

        collector.on('collect', async i => {
            if (i.customId === 'affirmativeButtonEdit') {
                const cmdsData = await CustomCommand.findOne({ 
                    guildID: interaction.guild.id,
                    [`Data.name`] : cmdName
                }) 
                if(!cmdsData){
                    return await i.update({ content: 'Something went wrong', components: [] , embeds: [new Discord.MessageEmbed().setDescription(`Couldn't find any command by name ${cmdName}`).setColor("RED")], ephermal: true})
                }else {
                    await CustomCommand.findOneAndUpdate({
                        guildID: interaction.guild.id,
                        ['Data.name']: cmdName
                    }, {
                        guildName: interaction.guild.name,
                        Data: newData
                    })
                }
                return await i.update({ content: 'All good', components: [] , embeds: [new Discord.MessageEmbed().setDescription("Updated the command").setColor("GREEN")]});
            }else if(i.customId === 'negativeButtonEdit'){
                return await i.update({ content: 'Done', components: [] , embeds: [new Discord.MessageEmbed().setDescription("Canceled command edit").setColor("GREEN")]});
            }
        });
        
        collector.on('end', collected => {});
    }
}