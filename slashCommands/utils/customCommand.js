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
        .addStringOption(option =>
            option.setName('content')
            .setDescription("Content message of the command.")
            .setRequired(true))
        .addBooleanOption(option =>
            option.setName("embed")
            .setDescription("Send the command in embed")
            .setRequired(true))
        .addStringOption(option => 
            option.setName('permissions')
            .setDescription('Role permission to use the command. separate each roles with [,]')
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
        try{
            const { options, guild } = interaction;

            const Name = options.getString('name');
            const Embed = options.getBoolean('embed');
            const Perms = options.getString('permissions');
            const Content = options.getString('content');
            const deleteCmds = options.getBoolean('delete');
            const mention = options.getBoolean('mention');

            const commandConstructor = {
                name: null,
                content: null,
                deleteC: false,
                mention: false,
                embed: false,
                permission: [],
                author: null,
                description: null,
                title: null,
                image: null,
                footer: null,
                color: null
            }

            if(Name){
                let name = Name.replace(/\s+/g, '')

                commandConstructor['name'] = name.toLowerCase()
            }
            if(Embed){
                commandConstructor['embed'] = Embed
            }
            if(Content){
                let wordLimit = Content.split(" ")        
                if(wordLimit.length >= 500){
                    return interaction.reply({embeds: [new Discord.MessageEmbed()
                        .setDescription(`Content can't exceed more than 500 words`)
                        .setColor("RED")
                    ], ephermal: true})
                }
                commandConstructor['content'] = Embed
            }

            rolesString = []
            if(Perms){
                try {
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
                }catch(err){
                    console.log(err)
                }
            }

            if(Embed === true){
                const author = options.getString('author');
                const description = options.getString('description');
                const title = options.getString('title');
                const color = options.getString('color');
                const image = options.getString('image');
                const footer = options.getString('footer');
                if(author){
                    let authorLimit = author.split(" ")

                    if(authorLimit.length >= 50){
                        return interaction.reply({embeds: [new Discord.MessageEmbed()
                            .setDescription(`Author can't exceed more than 20 words`)
                            .setColor("RED")
                        ], ephermal: true})
                    }
                    commandConstructor["author"] = author;
                }
                if(description){
                    let descLimit = description.split(" ")

                    if(descLimit.length >= 1000){
                        return interaction.reply({embeds: [new Discord.MessageEmbed()
                            .setDescription(`Description can't exceed more than 1000 words`)
                            .setColor("RED")
                        ], ephermal: true})
                    }
                    commandConstructor["description"] = description;
                }

                if(title){
                    let titleLimit = title.split(" ")
                    if(titleLimit.length >= 50){
                    return interaction.reply({embeds: [new Discord.MessageEmbed()
                        .setDescription(`Title can't exceed more than 50 words`)
                        .setColor("RED")
                    ], ephermal: true})
                    }
                    commandConstructor["title"] = title;
                }

                if(footer){
                    let footerLimit = footer.split(" ")
                    if(footerLimit.length >= 50){
                    return interaction.reply({embeds: [new Discord.MessageEmbed()
                        .setDescription(`Title can't exceed more than 50 words`)
                        .setColor("RED")
                    ], ephermal: true})
                    }
                    commandConstructor["footer"] = footer;
                }

                if(color){
                    commandConstructor["color"] = color;
                }
                if(image){
                    commandConstructor["image"] = image;
                }
                
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
                        `\n**Color:** ${commandConstructor.color == null ? "None": commandConstructor.color}`,
                        `\n**Image:** [Image URL](${commandConstructor.image == null ? "https://youtu.be/dQw4w9WgXcQ" : commandConstructor.image})`,
                        `\n**Footer:** ${commandConstructor.footer == null ? "None" : commandConstructor.footer}`,
                    ].toString())
                }

            const row = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                    .setCustomId('YesButtonCreate')
                    .setLabel('Confirm')
                    .setStyle('SUCCESS'),
                )
            .addComponents(
                new Discord.MessageButton()
                    .setCustomId('NoButtonCreate')
                    .setLabel('Cancel')
                    .setStyle('DANGER'),
                );

            interaction.reply({content: "Do you wish to save this command?",embeds: [messageEmbed], components: [row]})

            const filter = i => i.user.id === interaction.user.id;
            const collector = interaction.channel.createMessageComponentCollector({ filter, time: 1000 * 60 });

            collector.on('collect', async i => {
                if (i.customId === 'YesButtonCreate') {

                    const cmdsData = await CustomCommand.findOne({ 
                        guildID: interaction.guild.id,
                        [`Data.name`] : Name
                    }) 
                    if(cmdsData){
                        return await i.update({ content: 'Something went wrong', components: [] , embeds: [new Discord.MessageEmbed().setDescription("Error | Command already exist by this name").setColor("RED")], ephermal: true})
                    }else {
                        await new CustomCommand({
                            guildID: interaction.guild.id,
                            guildName: interaction.guild.name,
                            Data: commandConstructor
                        }).save().catch(err => console.log(err))
                    }
                    await i.update({ content: 'Saved', components: [] , embeds: [new Discord.MessageEmbed().setDescription("Saved to database. You can now use it").setColor("GREEN")]});
                }else if(i.customId === 'NoButtonCreate'){
                    await i.update({ content: 'Done', components: [] , embeds: [new Discord.MessageEmbed().setDescription("Deleted the command").setColor("GREEN")]});
                }
            });
            
            collector.on('end', collected => {});
        }catch(err){
            console.log(err)
        }
    }
}