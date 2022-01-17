const Discord = require('discord.js');
const fs = require('fs');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

module.exports = {
    name: 'role-info',
    aliases: ['roleinfo'],
    description: "Server role info",
    permissions: ["ADMINISTRATOR", "MANAGE_CHANNELS"],
    botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
    usage: "role-info [ role ]",
    category: "Moderation",
    cooldown: 3000,
    run: async(client, message, args,prefix) =>{
        if(!args.length){
            return message.channel.send({embeds: [
                new Discord.MessageEmbed()
                    .setDescription(`Please mention a valid role \n\n**Usage:** \`${prefix}role-info [ role name ]\``)
                    .setColor("RED")
                ]
            })
        }else {
            fetchRole()
        }

        function fetchRole(){
            let roleArgs = message.content.split(" ").slice(1)
            let roleItem = roleArgs.join(' ')
            let role = message.mentions.roles.first() || 
            message.guild.roles.cache.find(r => r.name.toLowerCase() == roleItem.toLowerCase()) || 
            message.guild.roles.cache.find(r => r.id == args[0]);
            if(!role){
                return message.channel.send({embeds: [
                    new Discord.MessageEmbed()
                        .setDescription(`Coudldn't find any role. Please mention a valid role \n\n**Usage:** \`${prefix}membersinit [ role name ]\``)
                        .setColor("RED")
                    ]
                })
            }

            constructData(role)
        }

        async function constructData(Role){
            let rolesPermsArr = Role.permissions.toArray()

            const permFlag = [
                "ADMINISTRATOR", 
                "MANAGE_GUILD", 
                "KICK_MEMBERS", 
                "BAN_MEMBERS", 
                "MANAGE_CHANNELS", 
                "MANAGE_MESSAGES",
                "MANAGE_NICKNAMES",
                "MANAGE_ROLES",
                "MANAGE_WEBHOOKS",
                "MANAGE_EMOJIS",
                "VIEW_AUDIT_LOG",
                "MENTION_EVERYONE",
                "MODERATE_MEMBERS",
                "MANAGE_WEBHOOKS"
            ]
            const perms = rolesPermsArr.filter( i => permFlag.includes(i))
            const permArr = perms.join(", ")
            const permData = permArr.split("_").join(" ")
            

            let Embed = new Discord.MessageEmbed()
                .addField("Name", `\`\`\`${Role.name}\`\`\``, true)
                .addField("Position", `\`\`\`${Role.rawPosition}\`\`\``, true)
                .addField("Hoisted", `\`\`\`${Role.hoist == true ? "Yes" : "No"}\`\`\``, true)
                .addField("Mentionable", `\`\`\`${Role.mentionable}\`\`\``, true)
                .addField("Mention", `\`\`\`<@&${Role.id}>\`\`\``, true)
                .addField("Permissions", `\`\`\`${permData.length ? permData.toLowerCase() : "None"}\`\`\``)
                .setFooter({text: `Role ID: ${Role.id}`})
                .setTimestamp()
                .setColor(Role.color ? Role.color : "WHITE")

            message.channel.send({embeds: [Embed]})
            .catch(err => {return console.log(err.stack)})
        }
    }
}