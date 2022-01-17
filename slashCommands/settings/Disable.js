const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const { Guild } = require('../../models');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('disable')
        .setDescription('Disable a command/module in the server.')
        .addStringOption(option =>
            option.setName("name")
            .setRequired(true)
            .setDescription("Module/Command name")),
    permissions: ["ADMINISTRATOR", "MANAGE_GUILD"],
    botPermission: ["SEND_MESSAGES"],
    category: "Slash",
    run: async(client, interaction) =>{
        interaction.deferReply()
        await new Promise(resolve => setTimeout(resolve, 1000))

        const { options } = interaction;

        let option = options.getString('name');
        option.split(/s+/g).slice().join('')
        option.toLowerCase()

        let data;
        let slash;
        let cmddata;

        client.commands.forEach(c => {
            if(!c.category) return 
            if(c.category.toLowerCase() == option){
                data = c.category
            }
        })
        if(data) {
            if(data.toLowerCase() == 'settings') return interaction.editReply({
                embeds: [new Discord.MessageEmbed()
                    .setDescription("Settings type Module/Commands cannot be enabled or disabled")
                    .setColor("RED")
                ], ephemeral: true
            }).catch(err => {return console.log(err.stack)})
            dataManager('category', data)
        }

        else cmddata = client.commands.get(option) || client.commands.get(client.aliases.get(option))

        if(cmddata){ 
            if(cmddata.name.toLowerCase() == 'enable' || cmddata.name.toLowerCase() == 'disable'){
                return interaction.editReply({
                    embeds: [new Discord.MessageEmbed()
                        .setDescription("Settings Module/Commands cannot be enabled or disabled")
                        .setColor("RED")
                    ], ephemeral: true
                }).catch(err => {return console.log(err.stack)})
            }
            dataManager('command', cmddata.name)
        }
        else {
            client.slash.forEach(c => {
                if(!c.data) return 
                if(c.data.name.toLowerCase() == option.toLowerCase()){
                    slash = c.data.name
                }
            })
        }
        if(slash) {
            if(slash.toLowerCase() == 'enable' || slash.toLowerCase() == 'disable'){
                return interaction.editReply({
                    embeds: [new Discord.MessageEmbed()
                        .setDescription("Settings type Module/Commands cannot be enabled or disabled")
                        .setColor("RED")
                    ], ephemeral: true
                }).catch(err => {return console.log(err.stack)})
            }
            dataManager('command', slash)
        }

        else if(option.toLowerCase() == 'slash') {
            data = 'slash'
            dataManager('category', data)
        }

        if(!data && !slash && !cmddata ) return interaction.editReply({
            embeds: [new Discord.MessageEmbed()
                .setDescription("Couldn't find any Command/Modules")
                .setColor("RED")
        ], ephemeral: true}).catch(err => {return console.log(err.stack)})

        async function dataManager(type, data){
            switch (type){
                case 'category':
                    Guild.updateOne({
                        guildID: interaction.guild.id
                    }, {
                        [`Modules.${data.toLowerCase()}.Enabled`]: false
                    }).then((res) => {
                        return interaction.editReply({
                            embeds: [new Discord.MessageEmbed()
                                .setDescription(`<:dnd:926939036281610300> Module **${data}** has been __Disabled__`)
                                .setColor("GREEN")   
                            ]
                        }).catch(err => {return console.log(err.stack)})
                    })
                    .catch(err => {return console.log(err.stack)})
                break;
                case 'command':
                    Guild.updateOne({
                        guildID: interaction.guild.id
                    }, {
                        [`Commands.${data.toLowerCase()}.Enabled`]: false
                    }).then((res) => {
                        return interaction.editReply({
                            embeds: [new Discord.MessageEmbed()
                                .setDescription(`<:dnd:926939036281610300> Command **${data}** has been __Disabled__`)
                                .setColor("GREEN")   
                            ]
                        }).catch(err => {return console.log(err.stack)})
                    })
                    .catch(err => {return console.log(err.stack)})
                break;
            }
        }
    }
}