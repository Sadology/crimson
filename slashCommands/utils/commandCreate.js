const { SlashCommandBuilder, roleMention } = require('@discordjs/builders');
const wait = require('util').promisify(setTimeout);
const Discord = require('discord.js');
const { CustomCommand } = require('../../models');
const { commandCreate } = require('../../Functions');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('custom-cmd-create')
        .setDescription('Create a custom command for your server.')
        .addStringOption(option =>
            option.setName('name')
            .setRequired(true)
            .setDescription("Name of your command."))
        .addStringOption(option =>
            option.setName('content')
            .setDescription("Content message of the command."))
        .addBooleanOption(option =>
            option.setName("embed")
            .setDescription("Send the command in embed"))
        .addStringOption(option => 
            option.setName('permissions')
            .setDescription('Role permission to use the command. separate each roles with [,]'))
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
    permissions: ["MANAGE_GUILD", "ADMINISTRATOR"],
    botPermission: ["SEND_MESSAGES"],
    category: "Slash",
    run: async(client, interaction) =>{

        interaction.deferReply()
        await new Promise(resolve => setTimeout(resolve, 1000))

        try{
            const { options, guild } = interaction;

            const variable = options.getString('options')
            const Name = options.getString('name');
            const Embed = options.getBoolean('embed');
            const Perms = options.getString('permissions');
            const Content = options.getString('content');
            const deleteCmds = options.getBoolean('delete');
            const Mention = options.getBoolean('mention');
            const Author = options.getString('author');
            const Description = options.getString('description');
            const Title = options.getString('title');
            const Color = options.getString('color');
            const Image = options.getString('image');
            const Footer = options.getString('footer');
            const Data = new commandCreate()
            const errorEmbed = new Discord.MessageEmbed()
                .setColor("RED")
            let somethingWrong;
            let permsStringArr = []

            name(Name)
            content(Content)
            embed(Embed)
            mention(Mention)
            del(deleteCmds)
            permission(Perms)
            description(Description)
            author(Author)
            title(Title)
            color(Color)
            image(Image)
            footer(Footer)

            if(Data.Description !== null || 
                Data.Author !== null || 
                Data.Title !== null ||
                Data.Footer !== null && Data.Embed == false){
                    Data.Embed = true
            }
    
            if(somethingWrong == true) return
            let DataEmbed = new Discord.MessageEmbed()
            .setAuthor(interaction.user.tag, interaction.user.avatarURL({dynamic: true, size: 1024, type: 'png'}))
                .setDescription(
                    `**Name:** ${Data.Name}
                    **Content:** ${Data.Content}
                    **Delete-cmd:** ${Data.DeleteCmd}
                    **Mention:** ${Data.Mention}
                    **Embed:** ${Data.Embed}
                    **Description:** ${Data.Description}
                    **Author:** ${Data.Author}
                    **Title:** ${Data.Title}
                    **Images:** ${Data.Image == null ? "[URL](https://youtu.be/dQw4w9WgXcQ)": Data.Image}
                    **Footer:** ${Data.Footer}
                    **Color:** ${Data.Color}
                    **Permission:** ${permsStringArr.join(", ")}
                    `
                )
            .setColor("#f5fff8")
    
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
    
            let IfExistData = await CustomCommand.findOne({ 
                guildID: interaction.guild.id,
                [`Data.Name`] : Data.Name
            })
            .catch(err => {
                return console.log(err.stack)
            })
            if(IfExistData){
                let existedData = IfExistData.Data.find(i => i.Name == Data.Name)
                if(existedData){
                    return interaction.editReply({
                        embeds: [new Discord.MessageEmbed()
                            .setDescription("A custom command already exist by this name.")
                            .setColor("RED")    
                        ]
                    })
                }
            }else interaction.editReply({content: "Do you wish to save this command? (confirm/cancel)",embeds: [DataEmbed], components: [row]}).then((inter) => {
                const collector = inter.createMessageComponentCollector({ componentType: 'BUTTON', time: 1000 * 60 * 5 });
                collector.on('collect', async i => {
                    if(i.user.id !== interaction.user.id) return
                    if (i.customId === 'YesButtonCreate') {
                        await CustomCommand.findOneAndUpdate({
                            guildID: interaction.guild.id,
                        }, {
                            $push: {
                                Data: {
                                    ...Data
                                }
                            }
                        }, {upsert: true})
                        .then(async() => {
                            row.components[0].setDisabled(true)
                            row.components[1].setDisabled(true)
                            await i.update({ content: 'Saved to database', components: [row] }).catch(err => {return console.log(err)})
                            return collector.stop();
                        })
                        .catch(err => console.log(err))
                    }else if(i.customId === 'NoButtonCreate'){
                        row.components[0].setDisabled(true)
                        row.components[1].setDisabled(true)
                        await i.update({ content: 'Canceled the command', components: [row]}).catch(err => {return console.log(err)})
                        return collector.stop();
                    }
                });
                
                collector.on('end', async collected => {
                    row.components[0].setDisabled(true)
                    row.components[1].setDisabled(true)
                    await interaction.editReply({components: [row]});
                });
            })
            
            function name(name) {
                if(name){
                    let filterName = name.replace(/\s+/g, '')
                    let finalize = filterName.slice(0, 10)
                    Data.setName(finalize.toLowerCase())
                }else {
                    errorEmbed.setDescription("Please specify a name for the command. You can't use the command without name.")
                    interaction.editReply({embeds: [errorEmbed], ephermal: true})
                    return somethingWrong = true
                    
                }
            }
            function content(content) {
                if(content){
                    let wordLimit = content.split(" ")        
                    if(wordLimit.length >= 500){
                        errorEmbed.setDescription(`Content can't exceed more than 500 words`)
                        interaction.editReply({embeds: [errorEmbed], ephermal: true})
                        return somethingWrong = true
                    }

                    Data.setContent(content)
                }
            }
            function embed(embed) {
                if(embed){
                    if(embed == true){
                        Data.setEmbed(true)
                    }else if(embed == false){
                        Data.setEmbed(false)
                    }
                }else {
                    Data.setEmbed(false)
                }
            }

            function mention(mention) {
                if(mention){
                    if(mention == true){
                        Data.setMention(true)
                    }else if(mention == false){
                        Data.setMention(false)
                    }
                }else {
                    Data.setMention(false)
                }
            }
            function del(del) {
                if(del){
                    if(del == true){
                        Data.setDelete(true)
                    }else if(del == false){
                        Data.setDelete(false)
                    }
                }else {
                    Data.setDelete(false)
                }
            }

            function permission(params) {
                if(params){
                    let divide = params.split(/,\s+/)
                    let elements = divide.map(function (el) {
                        return el.trim();
                    });
                    let RolesArr = []
                    let undefinesRole = []
                    elements.forEach(items => {
                        let guildRoles = guild.roles.cache.find(r => r.id == items.replace( '<@&' , '' ).replace( '>' , '' )) || 
                        guild.roles.cache.find(r => r.name.toLowerCase() == items.toLowerCase()) || 
                        guild.roles.cache.find(r => r.id == items);

                        if(guildRoles){
                            RolesArr.push(guildRoles.id)
                            permsStringArr.push(guildRoles.toString())
                        }else if(typeof guildRoles === "undefined"){
                            function add(value) {
                                if (undefinesRole.indexOf(value) === -1) {
                                    undefinesRole.push(value);
                                }
                            }
                            add(items)
                        }
                    })

                    if(undefinesRole.length){
                        errorEmbed.setDescription(`Can't find this following roles: \n${undefinesRole}`)
                        interaction.editReply({embeds: [errorEmbed]})
                        return somethingWrong = true
                    }else {
                        Data.setPerms(RolesArr)
                    }
                }
            }
            function description(desc) {
                if(desc){
                    let wordLimit = desc.split(" ")        
                    if(wordLimit.length >= 200){
                        errorEmbed.setDescription(`Description can't exceed more than 200 words`)
                        interaction.editReply({embeds: [errorEmbed], ephermal: true})
                        return somethingWrong = true
                    }

                    Data.setDescription(desc)
                }
            }
            function author(author) {
                if(author){
                    let wordLimit = author.split(" ")        
                    if(wordLimit.length >= 50){
                        errorEmbed.setDescription(`Author can't exceed more than 50 words`)
                        interaction.editReply({embeds: [errorEmbed], ephermal: true})
                        return somethingWrong = true
                    }

                    Data.setAuthor(author)
                }
            }
            function title(title) {
                if(title){
                    let wordLimit = title.split(" ")        
                    if(wordLimit.length >= 50){
                        errorEmbed.setDescription(`Title can't exceed more than 50 words`)
                        interaction.editReply({embeds: [errorEmbed], ephermal: true})
                        return somethingWrong = true
                    }

                    Data.setTitle(title)
                }
            }
            function image(link) {
                if(link){
                    if(!link.includes('https://')){
                        errorEmbed.setDescription(`Please pass a valid link for the image. \nMake sure to use Gif addess instead of Gif link`)
                        interaction.editReply({embeds: [errorEmbed], ephermal: true})
                        return somethingWrong = true
                    }else {
                        let LinksArr = [];
                        let multiLinks = link.split(/,\s+/);
                        multiLinks.forEach(l => {
                            LinksArr.push(l)
                        })

                        Data.setImage(LinksArr)
                    }
                }
            }
            function color(color) {
                if(color){
                    if(!color.startsWith('#')){
                        errorEmbed.setDescription(`This is not a valid color. \n\`Tip: Google search "color picker"\``)
                        interaction.editReply({embeds: [errorEmbed], ephermal: true}) 
                        return somethingWrong = true
                    }else {
                        Data.setColor(color)
                    }
                }
            }
            function footer(footer) {
                if(footer){
                    let wordLimit = footer.split(" ")        
                    if(wordLimit.length >= 20){
                        errorEmbed.setDescription(`Author can't exceed more than 20 words`)
                        interaction.editReply({embeds: [errorEmbed], ephermal: true})
                        return somethingWrong = true
                    }

                    Data.setFooter(footer)
                }
            }
        }catch(err){
             console.log(err)
        }
    }
}