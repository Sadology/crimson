const { MessageEmbed, MessageActionRow, MessageSelectMenu } = require('discord.js')

module.exports = {
    name: 'help',
    permissions: ["SEND_MESSAGES"],
    botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
    category: 'Utils',
    cooldown: 3000,
    run: async(client, message, args,prefix) =>{
        const Menu = new MessageEmbed()
            .setAuthor(`${client.user.username} - Help Menu`, client.user.avatarURL({dynamic: true, size: 1024, type: 'png'}))
            .setDescription(
                "Select a category from the select menu you would like to visit \n\n<:administration:915457421823078460> - Administration\n<:moderation:915457421831462922> - Moderation\n🎮 - Fun\n<:utility:915457793618739331> - Utility\n<:slashCmds:915458597801062461> - slash commands \n\n[Invite Me](https://discordbotlist.com/bots/sadbot) • [Support Server](https://discord.gg/DfmQmqWJmA) • [Website](https://d2x3xhvgiqkx42.cloudfront.net/12345678-1234-1234-1234-1234567890ab/9432a2ad-f01d-4a3d-ae53-370c37e15e62/2018/01/16/4b638361-3888-4e77-b1ea-af956fa98d7f.png)",
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
                        value: 'adminOption',
                        emoji: '<:administration:915457421823078460>'
                    },
                    {
                        label: 'Moderation',
                        description: 'Moderation type commands',
                        value: 'modOption',
                        emoji: '<:moderation:915457421831462922>'
                    },
                    {
                        label: 'Fun',
                        description: 'Fun type commands',
                        value: 'funOption',
                        emoji: '🎮'
                    },
                    {
                        label: 'Utils',
                        description: 'Utility type commands',
                        value: 'utilOption',
                        emoji: '<:utility:915457793618739331>'
                    },
                    {
                        label: 'Slash',
                        description: 'Slash commands',
                        value: 'slashOption',
                        emoji: '<:slashCmds:915458597801062461>'
                    },

                ]),
            )

        message.channel.send({embeds: [Menu], components: [row]}).then((m) => {
            const collector = m.createMessageComponentCollector({ componentType: 'SELECT_MENU', time: 1000 * 60 * 10  });
            collector.on('collect',async b => {
                if(b.user.id !== message.author.id) return
                if(b.customId === "selectHelpData"){
                    getData(b.values.join(" "), b)
                }
            });
            collector.on("end", (b) =>{
                row.components[0].setDisabled(true)
                m.edit({components: [row]})
            })
        })

        function getData(type, data) {
            let Data = []
            let HelpMenu = new MessageEmbed()
                .setColor('#fffafa')
                .setFooter("/help command-name: [ cmd name ] to check individual commands")
                .setAuthor(client.user.username+ " - Help Menu", client.user.avatarURL({dynamic: true, size: 1024, type: 'png'}))
            switch(type){
                case 'modOption':
                    client.commands.forEach(cmds =>{
                        if(cmds.category && cmds.category == "Moderation"){
                            if(cmds.name){
                               Data.push("\` "+cmds.name+" \`") 
                            }
                        }
                    })
                    HelpMenu.setDescription(`<:moderation:915457421831462922> Moderator \`[ ${Data.length} ]\`\n\n`+Data.toString())
                    sendMessage(HelpMenu, data)
                break;
                case 'adminOption':
                    client.commands.forEach(cmds =>{
                        if(cmds.category && cmds.category == "Administrator"){
                            if(cmds.name){
                                Data.push("\` "+cmds.name+" \`") 
                            }
                        }
                    })
                    HelpMenu.setDescription(`<:administration:915457421823078460> Admin \`[ ${Data.length} ]\`\n\n`+Data.toString())
                    sendMessage(HelpMenu, data)
                break;
                case 'funOption':
                    client.commands.forEach(cmds =>{
                        if(cmds.category && cmds.category == "Fun"){
                            if(cmds.name){
                                Data.push("\` "+cmds.name+" \`") 
                            }
                        }
                    })
                    HelpMenu.setDescription(`🎮 Fun \`[ ${Data.length} ]\`\n\n`+Data.toString())
                    sendMessage(HelpMenu, data)
                break;
                case 'utilOption':
                    client.commands.forEach(cmds =>{
                        if(cmds.category && cmds.category == "Utils"){
                            if(cmds.name){
                                Data.push("\` "+cmds.name+" \`") 
                            }
                        }
                    })
                    HelpMenu.setDescription(`<:utility:915457793618739331> Utility \`[ ${Data.length} ]\`\n\n`+Data.toString())
                    sendMessage(HelpMenu, data)
                break;
                case 'slashOption':
                    client.slash.forEach(s =>{
                        if(s.data.name){
                            Data.push("\` "+s.data.name+" \`") 
                        }
                    })
                    HelpMenu.setDescription(`<:slashCmds:915458597801062461> Slash \`[ ${Data.length} ]\`\n\n`+Data.toString())
                    sendMessage(HelpMenu, data)
                break;
            }
        }

        async function sendMessage(data, select) {
            select.reply({embeds: [data], ephemeral: true})
            .catch(err => {
                message.channel.send({embeds: [
                    new MessageEmbed()
                        .setDescription("Something unexpected happened")
                        .setColor("RED")
                ]})
                return console.log(err)
            })
        }
    }
}