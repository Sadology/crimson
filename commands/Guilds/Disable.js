const Discord = require('discord.js');
const { Guild } = require('../../models');
module.exports = {
    name: 'disable',
    description: "Disable a Module/Command",
    permissions: ["MANAGE_GUILD", "ADMINISTRATOR"],
    botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
    usage: "disable [ Module/Command ]",
    category: "Administrator",
    cooldown: 3000,
    run: async(client, message, args,prefix) =>{
        if(!args.length || !args[0]){
            return message.channel.send({
                embeds: [new Discord.MessageEmbed()
                        .setAuthor("Command - Disable", client.user.displayAvatarURL({format: 'png'}))
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

        await Guild.findOne({
            guildID: message.guild.id
        }).then(res => {
            if(res){
                let categ = res.Modules.get(option.toLowerCase())
                if(categ){
                    saveData("category", categ)
                }else{
                    let names = res.Commands.get(option.toLowerCase())
                    if(names){
                        saveData('cmd', names)
                    }else {
                        return message.channel.send({
                            embeds: [new Discord.MessageEmbed()
                                .setDescription("Couldn't find any Command/Modules")
                                .setColor("RED")
                        ]}).catch(err => {return console.log(err.stack)})
                    }
                }
            }
        }).catch(err => {return console.log(err.stack)})

        async function saveData(type, data){
            switch(type){
                case "category":
                    await Guild.findOneAndUpdate({
                        guildID: message.guild.id,
                    }, {
                        [`Modules.${option}.Enabled`]: false
                    }).then((res) => {
                        return message.channel.send({
                            embeds: [new Discord.MessageEmbed()
                                .setDescription(`Module **${option}** has been __disabled__`)
                                .setColor("GREEN")   
                            ]
                        }).catch(err => {return console.log(err.stack)})
                    }).catch(err => {return console.log(err.stack)})
                break;

                case 'cmd':
                    await Guild.findOneAndUpdate({
                        guildID: message.guild.id,
                    }, {
                        [`Commands.${option}.Enabled`]: false
                    }).then((res) => {
                        return message.channel.send({
                            embeds: [new Discord.MessageEmbed()
                                .setDescription(`Command **${option}** has been __disabled__`)
                                .setColor("GREEN")   
                            ]
                        }).catch(err => {return console.log(err.stack)})
                    }).catch(err => {return console.log(err.stack)})
                break;
            }
        }
    }
}