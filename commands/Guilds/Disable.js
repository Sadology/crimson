const Discord = require('discord.js');
const { Guild } = require('../../models');
module.exports = {
    name: 'disable',
    description: "Disable a Module/Command",
    permissions: ["MANAGE_GUILD", "ADMINISTRATOR"],
    botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
    usage: "disable [ Module/Command ]",
    category: "Settings",
    cooldown: 3000,
    run: async(client, message, args,prefix) =>{
        if(!args.length || !args[0]){
            return message.channel.send({
                embeds: [new Discord.MessageEmbed()
                        .setAuthor({name: "Command - Disable", iconURL: client.user.displayAvatarURL({format: 'png'})})
                        .setDescription(`Provide a Module/Command name.\n\n**Usage:** \`${prefix}disable [ Module/command ]\`\n**Example:** \`${prefix}disable help\``)
                        .addField("Modules", ([
                            `Administrator`,
                            `Moderation`,
                            `Fun`,
                            `Utils`,
                            `Ranks`,
                            `Slash`,
                        ].toString().split(',').join(", ")))
                        .setColor("WHITE")
                    ]
            }).catch(err => {return console.log(err.stack)})
        }

        let option = args[0]

        let data;
        let slash;
        let cmddata;

        client.commands.forEach(c => {
            if(!c.category) return 
            if(c.category.toLowerCase() == option.toLowerCase()){
                data = c.category
            }
        })

        if(data) {
            if(data.toLowerCase() == 'settings') return message.channel.send({
                embeds: [new Discord.MessageEmbed()
                    .setDescription("Settings type Module/Commands cannot be enabled or disabled")
                    .setColor("RED")
                ]
            }).catch(err => {return console.log(err.stack)})
            dataManager('category', data)
        }
        else cmddata = client.commands.get(option) || client.commands.get(client.aliases.get(option))
        if(cmddata){ 
            if(cmddata.name.toLowerCase() == 'enable' || cmddata.name.toLowerCase() == 'disable'){
                return message.channel.send({
                    embeds: [new Discord.MessageEmbed()
                        .setDescription("Settings Module/Commands cannot be enabled or disabled")
                        .setColor("RED")
                    ]
                }).catch(err => {return console.log(err.stack)})
            }
            dataManager('command', cmddata.name)
        }
        else {
            client.slash.forEach(c => {
                if(!c.data) return 
                if(c.data.name.toLowerCase() == option.toLowerCase()){
                    slash = c.data.name
                    name = c.data
                }
            })
        }

        if(slash) {
            if(slash.toLowerCase() == 'enable' || slash.toLowerCase() == 'disable'){
                return message.channel.send({
                    embeds
                    : [new Discord.MessageEmbed()
                        .setDescription("Settings type Module/Commands cannot be enabled or disabled")
                        .setColor("RED")
                    ]
                }).catch(err => {return console.log(err.stack)})
            }
            dataManager('command', slash)
        }
        else if(option.toLowerCase() == 'slash') {
            data = 'slash'
            dataManager('category', data)
        }

        if(!data && !slash && !cmddata ) return message.channel.send({
            embeds: [new Discord.MessageEmbed()
                .setDescription("Couldn't find any Command/Modules")
                .setColor("RED")
        ]}).catch(err => {return console.log(err.stack)})

        async function dataManager(type, data){
            switch (type){
                case 'category':
                    Guild.updateOne({
                        guildID: message.guild.id
                    }, {
                        [`Modules.${data.toLowerCase()}.Enabled`]: false
                    }).then((res) => {
                        return message.channel.send({
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
                        guildID: message.guild.id
                    }, {
                        [`Commands.${data.toLowerCase()}.Enabled`]: false
                    }).then((res) => {
                        return message.channel.send({
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