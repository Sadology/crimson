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
            .setDescription("Command name for info option")),
    permissions: ["MANAGE_MESSAGES"],
    botPermission: ["SEND_MESSAGES"],
    category: "Slash",
    run: async(client, interaction) =>{
        const { options, guild } = interaction;
        const optionName = options.getString('options');

        interaction.deferReply()
        await new Promise(resolve => setTimeout(resolve, 1000))
        const row = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                    .setCustomId("variables")
                    .setLabel("Variables")
                    .setStyle("PRIMARY")
            )
        switch(optionName){
            case 'cmd_info':
                let cmdName = options.getString('name')
                if(!cmdName){
                    return interaction.editReply({content: "Please provide the custom command name", ephemeral: true})
                }

                await CustomCommand.findOne({
                    guildID: interaction.guild.id,
                    Data: {$exists: true}
                })
                .then(res => {
                    if(!res){
                        return interaction.editReply({content: "Custom-Commands doesn't exist for this server. Setup now by `/custom-cmd-create`", ephemeral: true}).catch(err => {return console.log(err.stack)})
                    }
                    let items = res.Data.find(i => i.Name.toLowerCase() == cmdName.toLowerCase())
                    if(!items){
                        return interaction.editReply({content: "Couldn't find any custom command. Make sure the name is correct.", ephemeral: true}).catch(err => {return console.log(err.stack)})
                    }

                    let Data = {
                        Name: items.Name ? items.Name : "<:error:921057346891939840>",
                        Content: items.Content ? items.Content : "<:error:921057346891939840>",
                        Embed: items.Embed ? items.Embed : "False",
                        DeleteCmd: items.DeleteCmd ? items.DeleteCmd : "False",
                        Mention: items.Mention ? items.Mention : "False",
                        Description: items.Description ? items.Description : "<:error:921057346891939840>",
                        Author: items.Author ? items.Author : "<:error:921057346891939840>",
                        Title: items.Title ? items.Title : "<:error:921057346891939840>",
                        Image: items.Image ? items.Image : "<:error:921057346891939840>",
                        Color: items.Color ? items.Color : "Sadbot Role Color",
                        Footer: items.Footer ? items.Footer : "<:error:921057346891939840>",
                        Permission: items.Permission ? items.Permission : null,
                    }

                    let roleArr = ["<:error:921057346891939840>"]
                    if(Data.Permission){
                        roleArr.pop()
                        Data.Permission.forEach(perms => {
                            let guildrole = interaction.guild.roles.resolve(perms)
                            if(guildrole){
                                roleArr.push(guildrole.toString())
                            }
                        })
                    }

                    let infoEmbed = new Discord.MessageEmbed()
                    .setAuthor("Custom Command - "+Data.Name)
                        .setDescription(`
                        **Name:** ${Data.Name}
                        **Content:** ${Data.Content}
                        **Embed:** ${Data.Embed}
                        **Delete cmd:** ${Data.DeleteCmd}
                        **Require mention:** ${Data.Mention}
                        __Embed Side__
                        **Author:** ${Data.Author}
                        **Title:** ${Data.Title}
                        **Description:** ${Data.Description}
                        **Footer:** ${Data.Footer}
                        **Color:** ${Data.Color}
                        **Images:** ${Data.Image.join(", ")}
                        __Permissions__
                        ${roleArr.join(', ')}
                    `)
                    .setColor("WHITE")

                    interaction.editReply({embeds: [infoEmbed]}).catch(err => {return console.log(err.stack)})
                }).catch(err => {return console.log(err.stack)})
            break;

            case 'cmd_list':
                await CustomCommand.findOne({
                    guildID: interaction.guild.id,
                    Data: {$exists: true}
                })
                .then(res => {
                    if(!res){
                        return interaction.editReply({content: "Custom-Commands doesn't exist for this server. Setup now by `/custom-cmd-create`", ephemeral: true}).catch(err => {return console.log(err.stack)})
                    }

                    let cmds = []
                    res.Data.forEach(data => {
                        cmds.push(`\` - \` **Cmd Name:** ${data.Name ? data.Name : "<:error:921057346891939840>"}`)
                    })

                    let listEmbed = new Discord.MessageEmbed()
                        .setDescription(`<:reply:897083777703084035>__Custom Commands__\n${cmds.join(" \n")}`)
                        .setColor("WHITE")

                    interaction.editReply({embeds: [listEmbed]}).catch(err => {return console.log(err.stack)})
                })
            break;

            case 'cmd_help':
                let helpEmbed = new Discord.MessageEmbed()
                    .setAuthor(interaction.user.tag, interaction.user.displayAvatarURL({format: 'png'}))
                    .setDescription("Custom Command Help")
                    .addField("Name", `Name of the custom command. Name will trigger and respond with the command. Example: \`>hello\`. Hello is now a command and everytime a person type *hello* with prefix, bot will respond back to them. **Note:** Command name can't be longer than 5 characters.`)
                    .addField("Content", "Content of the message. Bot will send the message in text channel (normal message, not embed). **Note:** Content can't exceed 200 words.")
                    .addField("Embed", "If Embed is set to true, Bot will send message in Embed. Else bot will respond with just normal message.")
                    .addField("Delete", "If Delete is set to true then Bot will delete the command after it respond. Else it won't delete the command if set to false.")
                    .addField("Mention", "If Mention set to true, member will require to mention someone to trigger the command. Bot won't respond unless they mention someone on the command. If set to false then it won't require to mention someone.")
                    .addField("Author", "Author of the embed. **Note:** Author can't exceed 50 words.")
                    .addField("Title", "Title of the embed. **Note:** Title can't exceed 50 words.")
                    .addField("Description", "Description of the embed. **Note:** Description can't exceed 200 words.")
                    .addField("Images", "You can send image in both embed and normal message. You can add multiple images and bot will send random images **(separate each links with ` , `)**. **Note:** Use image/gif address cause discord embed doesn't support links")
                    .addField("Color", "Color off the embed. Bot will use its highest role color if color isn't specified. **Note:** Must use HEX color code (google *color picker*)")
                    .addField("Footer", "Footer of the embed. **Note:** Footer can't exceed 50 words.")
                    .addField("Permissions", "Member with the role will be able to use the command. If the member don't have any of the roles. bot won't response to the command. **Note:** Separate each role with ` , `")
                    .setColor("WHITE")

                interaction.editReply({embeds: [helpEmbed], components: [row]})
                .then((int) => {
                    let collector = int.createMessageComponentCollector({time: 1000 * 60 * 5})
                    collector.on('collect', (b)=>{
                        if(b.customId == 'variables'){
                            let varEmbed = new Discord.MessageEmbed()
                                .setDescription(`Exapmle: {author} said hello to {server}\nExapmle: ${interaction.user} said hello to ${interaction.guild.name}`)
                                .addField("Variables", [
                                    `{member} - It will mention the member if Mention is set to true`,
                                    `{member.id} - Mentioned member ID`,
                                    `{member.tag} - Mentioned member tag aka discriminator`,
                                    `{member.name} - Mentioned member discord user name`,
                                    `{author} - It will mentioned the user who just used the command`,
                                    `{author.id} - Command users ID`,
                                    `{author.tag} - Command users tag aka discriminator`,
                                    `{author.name} - Command users discord user name`,
                                    `{channel} - Current channel`,
                                    `{channel.id} - Current channel ID`,
                                    `{server} - Server name`,
                                    `{server.id} - Server ID`,
                                    `{empty} - If you want to remove any field or keep it clean`,
                                ].toString().split(",").join(' \n'))
                                .setColor("WHITE")
                            b.reply({embeds: [varEmbed], ephemeral: true}).catch(err => {return console.log(err.stack)})
                        }
                    })
                    collector.on('end', () => {
                        row.components[0].setDisabled(true)
                        interaction.editReply({components: [row]}).catch(err => {return console.log(err.stack)})
                    })

                })
                .catch(err => {return console.log(err.stack)})
            break;

        }
    }
}