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
    permission: ["ADMINISTRATOR"],
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
                .setDescription(
                    `**Name:** ${Data.Name}
                    \n**Content:** ${Data.Content}
                    \n**Delete-cmd:** ${Data.DeleteCmd}
                    \n**Mention:** ${Data.Mention}
                    \n**Embed:** ${Data.Embed}
                    \n**Description:** ${Data.Description}
                    \n**Author:** ${Data.Author}
                    \n**Title:** ${Data.Title}
                    \n**Image:** [URL](${Data.Image == null ? "https://youtu.be/dQw4w9WgXcQ": Data.Image})
                    \n**Footer:** ${Data.Footer}
                    \n**Color:** ${Data.Color}
                    \n**Permission:** ${Data.Permission}
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
    
            interaction.editReply({content: "Do you wish to save this command? (confirm/cancel)",embeds: [DataEmbed], components: [row]})
            const collector = interaction.channel.createMessageComponentCollector({ time: 1000 * 60 });
            collector.on('collect', async i => {
                if(i.user.id !== interaction.user.id) return
                if (i.customId === 'YesButtonCreate') {
                    const cmdsData = await CustomCommand.findOne({ 
                        guildID: interaction.guild.id,
                        [`Data.Name`] : Data.Name
                    }) 
                    if(cmdsData){
                        return i.update({ content: 'Something went wrong', components: [] , embeds: [new Discord.MessageEmbed().setDescription("Error | Command already exist by this name").setColor("RED")], ephermal: true})
                    }else {
                        await CustomCommand.findOneAndUpdate({
                            guildID: interaction.guild.id,
                        }, {
                            $push: {
                                Data: {
                                    ...Data
                                }
                            }
                        }, {upsert: true}).catch(err => console.log(err))
                    }
                    await i.update({ content: 'Saved to database', components: [] });
                    return collector.stop();
                }else if(i.customId === 'NoButtonCreate'){
                    await i.update({ content: 'Canceled the command', components: []});
                    return collector.stop();
                }
            });
            
            collector.on('end', collected => {});

            function name(name) {
                if(name){
                    let filterName = name.replace(/\s+/g, '')

                    Data.setName(filterName.toLowerCase())
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