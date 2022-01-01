const Discord = require('discord.js');
const { Guild } = require('../../models');
module.exports = {
    name: 'status',
    aliases: ['cmd-status'],
    description: "Check all Commands/Modules status",
    permissions: ["MANAGE_GUILD", "ADMINISTRATOR"],
    botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
    usage: "status [ Module/Command ]",
    category: "Administrator",
    cooldown: 3000,
    run: async(client, message, args,prefix) =>{
        if(!args.length || !args[0]){
            return message.channel.send({
                embeds: [new Discord.MessageEmbed()
                        .setAuthor("Command - Status", client.user.displayAvatarURL({format: 'png'}))
                        .setDescription(`Module or Command, which option you'd like to check?.\n\n**Usage:** \`${prefix}status [ Module/command ]\`\n**Example:** \`${prefix}status command\``)
                        .addField("Options", ([
                            `Command`,
                            `Module`,
                        ].toString().split(',').join(", ")))
                        .setColor("WHITE")
                    ]
            }).catch(err => {return console.log(err.stack)})
        }

        let data = await Guild.findOne({
            guildID: message.guild.id
        }).catch(err => {return console.log(err.stack)})

        switch(args[0]){
            case 'commands':
            case 'command':
                let cmdarr = []
                let cmdEmbed = new Discord.MessageEmbed()
                .setAuthor("Command Status", client.user.displayAvatarURL({format: 'png'}))
                for(let [key, val] of data.Commands){
                    if(val.Enabled == true){
                        cmdarr.push(`<:online:926939036562628658>${key}: Enabled`)
                    }else if(val.Enabled == false){
                        cmdarr.push(`<:dnd:926939036281610300>${key}: Disabled`)
                    }
                }
                cmdEmbed.setDescription(cmdarr.join('\n '))
                .setColor("WHITE")
                message.channel.send({embeds: [cmdEmbed]}).catch(err => {return console.log(err.stack)})
            break;
            case 'modules':
            case 'module':
                let modarr = []
                let modEmbed = new Discord.MessageEmbed()
                .setAuthor("Module Status", client.user.displayAvatarURL({format: 'png'}))
                for(let [key, val] of data.Modules){
                    if(val.Enabled == true){
                        modarr.push(`<:online:926939036562628658>${key}: Enabled`)
                    }else if(val.Enabled == false){
                        modarr.push(`<:dnd:926939036281610300>${key}: Disabled`)
                    }
                }
                modEmbed.setDescription(modarr.join('\n '))
                .setColor("WHITE")
                message.channel.send({embeds: [modEmbed]}).catch(err => {return console.log(err.stack)})
            break;
        }
    }
}