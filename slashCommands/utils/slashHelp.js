const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js');
const ms = require('ms');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('All helpful commands of the bot')
        .addStringOption(option =>
            option.setName('category')
                .setDescription('Find commands you want in different category')
                .addChoice('Moderation', 'modType')
                .addChoice('Administration', 'adminType')
                .addChoice('Fun', 'funType')
                .addChoice('Utils', 'utilsType')
                .addChoice('Slash cmd', 'slashType'))
        .addStringOption(option =>
            option.setName('command-name')
                .setDescription('Help of individual commands')),
    permissions: ["USE_APPLICATION_COMMANDS"],
    botPermission: ["SEND_MESSAGES"],
    category: "Slash",
    run: async(client, interaction) =>{
        interaction.deferReply()
        await new Promise(resolve => setTimeout(resolve, 1000))

        const {options, guild} = interaction;
        const option = options.getString('category')
        const cmdName = options.getString('command-name')

        const Menu = new MessageEmbed()
            .setAuthor(`${client.user.username} - Help Menu`, client.user.avatarURL({dynamic: true, size: 1024, type: 'png'}))
            .setDescription(
                "Select a category from the select menu you would like to visit \n\n<:administration:915457421823078460> - Administration\n<:moderation:915457421831462922> - Moderation\n🎮 - Fun\n<:utility:915457793618739331> - Utility\n<:slashCmds:915458597801062461> - slash \n\n[Invite Me](https://discordbotlist.com/bots/sadbot) • [Support Server](https://discord.gg/DfmQmqWJmA) • [Website](https://d2x3xhvgiqkx42.cloudfront.net/12345678-1234-1234-1234-1234567890ab/9432a2ad-f01d-4a3d-ae53-370c37e15e62/2018/01/16/4b638361-3888-4e77-b1ea-af956fa98d7f.png)",
            )
            .setColor("WHITE")
            .setFooter("/help command-name: [ cmd name ] to check individual commands")

        const row = new MessageActionRow()
            .addComponents(
                new MessageSelectMenu()
                .setCustomId('selectHelpData')
                .setPlaceholder('Select a category')
                .addOptions([
                    {
                        label: 'Administration',
                        description: 'Administrative type commands',
                        value: 'adminType',
                        emoji: '<:administration:915457421823078460>'
                    },
                    {
                        label: 'Moderation',
                        description: 'Moderation type commands',
                        value: 'modType',
                        emoji: '<:moderation:915457421831462922>'
                    },
                    {
                        label: 'Fun',
                        description: 'Fun type commands',
                        value: 'funType',
                        emoji: '🎮'
                    },
                    {
                        label: 'Utils',
                        description: 'Utility type commands',
                        value: 'utilsType',
                        emoji: '<:utility:915457793618739331>'
                    },
                    {
                        label: 'Slash',
                        description: 'Slash commands',
                        value: 'slashType',
                        emoji: '<:slashCmds:915458597801062461>'
                    },

                ]),
            )
        if(!option && !cmdName){
            interaction.editReply({embeds: [Menu], components: [row]}).then((i) => {
                const collector = i.createMessageComponentCollector({ componentType: 'SELECT_MENU', time: 1000 * 60 * 10  });
                collector.on('collect',async b => {
                    if(b.user.id !== interaction.user.id) return
                    if(b.customId === "selectHelpData"){
                        //getData(b.values.join(" "), b)
                        sendMessage(b.values.join(" "), b)
                    }
                });
                collector.on("end", (b) =>{
                    row.components[0].setDisabled(true)
                    i.edit({components: [row]})
                })
            })
        }else if(option){
            //getData(option, interaction)
            sendMessage(option, interaction, true)
        }else if(cmdName){
            individualData()
        }

        function getData(type){
            Data = [];
            let HelpMenu = new MessageEmbed()
                .setColor('#fffafa')
                .setFooter("/help command-name: [ cmd name ] to check individual commands")
                .setAuthor(client.user.username+ " - Help Menu", client.user.avatarURL({dynamic: true, size: 1024, type: 'png'}))

            switch(type){
                case 'modType':
                    client.commands.forEach(cmds =>{
                        if(cmds.category && cmds.category == "Moderation"){
                            if(cmds.name){
                               Data.push("\` "+cmds.name+" \`") 
                            }
                        }
                    })
                    HelpMenu.setDescription(`<:moderation:915457421831462922> Moderator \`[ ${Data.length} ]\`\n\n`+Data.toString())
                    
                break;
                case 'adminType':
                    client.commands.forEach(cmds =>{
                        if(cmds.category && cmds.category == "Administrator"){
                            if(cmds.name){
                                Data.push("\` "+cmds.name+" \`") 
                            }
                        }
                    })
                    HelpMenu.setDescription(`<:administration:915457421823078460> Admin \`[ ${Data.length} ]\`\n\n`+Data.toString())
                    
                break;
                case 'funType':
                    client.commands.forEach(cmds =>{
                        if(cmds.category && cmds.category == "Fun"){
                            if(cmds.name){
                                Data.push("\` "+cmds.name+" \`") 
                            }
                        }
                    })
                    HelpMenu.setDescription(`🎮 Fun \`[ ${Data.length} ]\`\n\n`+Data.toString())
                break;
                case 'utilsType':
                    client.commands.forEach(cmds =>{
                        if(cmds.category && cmds.category == "Utils"){
                            if(cmds.name){
                                Data.push("\` "+cmds.name+" \`") 
                            }
                        }
                    })
                    HelpMenu.setDescription(`<:utility:915457793618739331> Utility \`[ ${Data.length} ]\`\n\n`+Data.toString())
                    
                break;
                case 'slashType':
                    client.slash.forEach(s =>{
                        if(s.data.name){
                            Data.push("\` "+s.data.name+" \`") 
                        }
                    })
                    HelpMenu.setDescription(`<:slashCmds:915458597801062461> Slash \`[ ${Data.length} ]\`\n\n`+Data.toString())
                break;
            }
            return new Promise((resolve) => {
                resolve(HelpMenu)
            })
        }

        function sendMessage(type, data, defered){
            getData(type).then((embed) => {
                if(defered){
                    return data.editReply({embeds: [embed], ephemeral: true})
                    .catch(err => {
                        interaction.channel.send({embeds: [
                            new MessageEmbed()
                                .setDescription("Something unexpected happened")
                                .setColor("RED")
                        ]})
                        return console.log(err)
                    })
                }
                else return data.reply({embeds: [embed], ephemeral: true})
                .catch(err => {
                    interaction.channel.send({embeds: [
                        new MessageEmbed()
                            .setDescription("Something unexpected happened")
                            .setColor("RED")
                    ]})
                    return console.log(err)
                })
            })
        }
        return
        
        function individualData(){
            let Data = client.commands.find(cmd => cmd.name == cmdName || cmd.aliases == cmdName)
            if(!Data) Data = client.slash.find(cmd => cmd.data.name == cmdName)
            if(!Data.category || Data.category == "Owner"){
                return interaction.editReply({embeds: [
                    new MessageEmbed()
                        .setDescription("No command exist by this name")
                        .setColor("RED")
                ]})
            }

            if(!Data){
                return interaction.editReply({embeds: [
                    new MessageEmbed()
                        .setDescription("No command exist by this name")
                        .setColor("RED")
                ]})  
            }
            let cmdData = {
                Name: "Not found",
                desc: "No descriptions avaiable :(",
                alias: "None",
                perms: "None",
                usage: "None",
                categ: "None",
                botperms: "None",
                cooldown: "None",
            }

            if(Data.data){
                cmdData.Name = Data.data.name ? Data.data.name : "Not found";
                cmdData.desc = Data.description ?Data.description : "No descriptions avaiable :(";
                cmdData.alias = Data.aliases ? Data.aliases : "None";
                cmdData.perms = Data.permissions ? Data.permissions.join(", ") : "None";
                cmdData.usage = Data.usage ? Data.usage : "None";
                cmdData.categ = Data.category ? Data.category : "None";
                cmdData.botperms = Data.botPermission ? Data.botPermission.join(", ") : "None";
                cmdData.cooldown = Data.cooldown ? ms(Data.cooldown, {long: true}) : "None";
            }
            else {
                cmdData.Name = Data.name ? Data.name : "Not found";
                cmdData.desc = Data.description ?Data.description : "No descriptions avaiable :(";
                cmdData.alias = Data.aliases ? Data.aliases : "None";
                cmdData.perms = Data.permissions ? Data.permissions.join(", ") : "None";
                cmdData.usage = Data.usage ? Data.usage : "None";
                cmdData.categ = Data.category ? Data.category : "None";
                cmdData.botperms = Data.botPermission ? Data.botPermission.join(", ") : "None";
                cmdData.cooldown = Data.cooldown ? ms(Data.cooldown, {long: true}) : "None";
            }

            let commandEmbed = new Discord.MessageEmbed()
                .setAuthor({name: `Command - ${cmdData.Name}`})
                .setDescription(`\`\`\`${cmdData.desc}\`\`\``)
                .addField("Aliases", `\`\`\`${cmdData.alias}\`\`\``.toString(), true)
                .addField("Category", `\`\`\`${cmdData.categ}\`\`\``.toString(), true)
                .addField("Usage", `\`\`\`${cmdData.usage}\`\`\``.toString(), true)
                .addField("Permissions", `\`\`\`${cmdData.perms}\`\`\``.toString(), true)
                .addField("Bot Permission", `\`\`\`${cmdData.botperms}\`\`\``.toString(), true)
                .addField("Cooldown", `\`\`\`${cmdData.cooldown}\`\`\``.toString(), true)
                .setColor('#fffafa')

            return interaction.editReply({embeds: [commandEmbed]})
        }
    }
}