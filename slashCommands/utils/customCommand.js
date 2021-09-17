const { SlashCommandBuilder, roleMention } = require('@discordjs/builders');
const wait = require('util').promisify(setTimeout);
const Discord = require('discord.js');

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
    run: async(client, interation) =>{
        const { options, guild } = interation;

        const Name = options.getString('name');
        const Embed = options.getBoolean('embed');
        const Perms = options.getString('permissions');
        const Content = options.getString('content');
        const deleteCmds = options.getBoolean('delete');
        const mention = options.getBoolean('mention');

        const mapCommand = new Map()
        const commandConstructor = {
            name: Name,
            content: Content ? Content : null,
            delete: deleteCmds ? deleteCmds : false,
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

        mapCommand.set(Name, commandConstructor)

        let messageEmbed = new Discord.MessageEmbed()
            .setAuthor("Custom-command: Create")
            .setDescription(`**Name:** ${commandConstructor.name}
            **Content:** ${commandConstructor.content}
            **Delete:** ${commandConstructor.delete}
            **Mention:** ${commandConstructor.name}
            **Embed:** ${commandConstructor.name}`)
            .addField(`Roles permission`, rolesString ? rolesString.toString() : "Error finding he roles")
            if(Embed === true){
                messageEmbed.addField("Embed Properties", [
                    `**Author:** ${commandConstructor.author}\n`
                    `**Description:** ${commandConstructor.description}\n`
                    `**Title:** ${commandConstructor.title}\n`
                    `**Color:** ${commandConstructor.color}\n`
                    `**Image:** [Image URL](${commandConstructor.image})\n`
                    `**Footer:** ${commandConstructor.footer}`
                ].toString())
            }

        interation.reply({embeds: [messageEmbed]})
    }
}