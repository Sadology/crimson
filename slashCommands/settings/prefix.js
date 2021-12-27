const { SlashCommandBuilder } = require('@discordjs/builders');
const wait = require('util').promisify(setTimeout);
const Discord = require('discord.js');
const { Guild } = require('../../models');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('prefix')
        .setDescription('Prefix of the bot in the server')
        .addStringOption(option => 
            option.setName('value')
            .setDescription('The new prefix value')),
    permission: ["ADMINISTRATOR", "MANAGE_GUILD"],
    botPermission: ["SEND_MESSAGES"],
    category: "Slash",
    run: async(client, interaction) =>{
        const { options } = interaction;
        const newPrefix = options.getString('value');
        
        async function fetchData() {
            await Guild.findOne({
                guildID: interaction.guild.id,
                Active: true
            })
            .then(res => {
                if(!res) return
                interaction.reply({
                    embeds: [new Discord.MessageEmbed()
                        .setDescription(`**Prefix: **` + "\`\`\`"+res.prefix+"\`\`\`")
                        .setColor("WHITE")
                        .setFooter("/prefix [ new prefix ] - to change prefix")
                        .setAuthor(`${interaction.guild.name}`, interaction.user.avatarURL({dynamic: false, size: 1024, type: 'png'}))
                    ]
                })
            })
            .catch(err => {
                return console.log(err)
            }) 
        }
        async function changePrefix(newPrefix) {
            let removeBlanks = newPrefix.trim()

            await Guild.findOneAndUpdate({
                guildID: interaction.guild.id,
                Active: true
            }, {
                prefix: removeBlanks
            }, {upsert: true})
            .then((res) => {
                interaction.reply({
                    embeds: [new Discord.MessageEmbed()
                        .setDescription(`Prefix Updated\n\n**old Prefix: **` + "\`\`\`"+res.prefix+"\`\`\`\n**new Prefix: **" + "\`\`\`"+removeBlanks+"\`\`\`")
                        .setColor("WHITE")
                        .setAuthor(`${interaction.guild.name}`, interaction.user.avatarURL({dynamic: false, size: 1024, type: 'png'}))
                    ]
                })
            })
            .catch(err => {
                return console.log(err)
            })
        }

        if(newPrefix){
            changePrefix(newPrefix)
        }else {
            fetchData()
        }
    }
}