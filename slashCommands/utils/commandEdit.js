const { SlashCommandBuilder, roleMention } = require('@discordjs/builders');
const wait = require('util').promisify(setTimeout);
const Discord = require('discord.js');
const { CustomCommand } = require('../../models');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('custom-cmd-edit')
        .setDescription('Edit a custom command.')
        .addStringOption(option =>
            option.setName('command-name')
            .setDescription("Name of your command.")
            .setRequired(true))
        .addStringOption(option =>
            option.setName('name')
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
    permission: ["MANAGE_GUILD", "ADMINISTRATOR"],
    run: async(client, interaction) =>{
        interaction.deferReply()
        await new Promise(resolve => setTimeout(resolve, 1000))

        try{
            const { options, guild } = interaction;
            const cmdName = options.getString('command-name')
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

            await CustomCommand.findOne({
                guildID: interaction.guild.id,
                [`Data.Name`]: cmdName
            }).then(res => {
                if(res){
                    let data = res.Data.find(item => item.Name == cmdName)
                    if(!data){
                        return interaction.editReply({embeds: [
                            new Discord.MessageEmbed()
                                .setDescription("No command exist by this name")
                                .setColor("RED")
                            ]
                        })  
                    }else {
                        editCmd(data)
                    }
                }else {
                    return interaction.editReply({embeds: [
                        new Discord.MessageEmbed()
                            .setDescription("No command exist by this name")
                            .setColor("RED")
                        ]
                    })
                }
            })

            function editCmd(data) {
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
                const errorEmbed = new Discord.MessageEmbed()
                    .setColor("RED")
                let somethingWrong;

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

                let permsStringArr = []
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
                        **Image:** ${Data.Image == null ? `[URL](https://youtu.be/dQw4w9WgXcQ)`: Data.Image.join(", ")})
                        **Footer:** ${Data.Footer}
                        **Color:** ${Data.Color}
                        **Permission:** ${permsStringArr.join(", ")}
                        `
                    )
                    .setColor("#f5fff8")

                const row = new Discord.MessageActionRow()
                .addComponents(
                    new Discord.MessageButton()
                        .setCustomId('YesButtonEdit')
                        .setLabel('Confirm')
                        .setStyle('SUCCESS'),
                    )
                .addComponents(
                    new Discord.MessageButton()
                        .setCustomId('NoButtonEdit')
                        .setLabel('Cancel')
                        .setStyle('DANGER'),
                    );

                interaction.editReply({content: "Do you wish to save this command? (confirm/cancel)",embeds: [DataEmbed], components: [row]}).then(inter => {
                    const collector = inter.createMessageComponentCollector({ componentType: 'BUTTON', time: 1000 * 60 * 5 });
                    collector.on('collect', async i => {
                        if(i.user.id !== interaction.user.id) return
                        if (i.customId === 'YesButtonEdit') {
                            await CustomCommand.findOneAndUpdate({
                                guildID: interaction.guild.id,
                                [`Data.Name`]: cmdName
                            }, {
                                $pull: {
                                    Data: {
                                        Name: cmdName
                                    }
                                }
                            }).catch(err =>{ return console.log(err)})
    
                            await CustomCommand.findOneAndUpdate({
                                guildID: interaction.guild.id,
                            }, {
                                $push: {
                                    Data: {
                                        ...Data
                                    }
                                }
                            }, {upsert: true}).catch(err =>{ return console.log(err)})
                            row.components[0].setDisabled(true)
                            row.components[1].setDisabled(true)
                            await i.update({ content: 'Saved to database', components: [row] }).catch(err =>{ return console.log(err)})
                            return collector.stop();
                        }else if(i.customId === 'NoButtonEdit'){
                            row.components[0].setDisabled(true)
                            row.components[1].setDisabled(true)
                            await i.update({ content: 'Canceled the command', components: [row]}).catch(err =>{ return console.log(err)})
                            return collector.stop();
                        }
                    });
                    
                    collector.on('end', async collected => {
                        row.components[0].setDisabled(true)
                        row.components[1].setDisabled(true)
                        await interaction.editReply({ content: 'Canceled the command', components: [row]});
                    });
                })

                function name(name) {
                    if(name){
                        let filterName = name.replace(/\s+/g, '')
                        let finalize = filterName.slice(0, 5)

                        Data.Name = finalize.toLowerCase()
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

                        Data.Content = content
                    }
                }
                function embed(embed) {
                    if(embed == false){
                        Data.Embed = false
                    }else if(embed == true){
                        Data.Embed = true
                    }else {
                        return
                    }
                }

                function mention(mention) {
                    if(mention == false){
                        Data.Mention = false
                    }else if(mention == true){
                        Data.Mention = true
                    }else {
                        return
                    }
                }
                function del(del) {
                    if(del == false){
                        Data.DeleteCmd = false
                    }else if(del == true){
                        Data.DeleteCmd = true
                    }else {
                        return
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
                            Data.Permission = RolesArr
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

                        Data.Description = desc
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

                        Data.Author = author
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

                        Data.Title = title
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

                            Data.Image = LinksArr
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
                            Data.Color = color
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

                        Data.Footer = footer
                    }
                }
        }
        }catch(err){
             console.log(err)
        }
    }
}