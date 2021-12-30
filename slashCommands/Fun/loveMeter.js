const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
var axios = require("axios")
module.exports = {
    data: new SlashCommandBuilder()
        .setName('lovemeter')
        .setDescription('Check you and your babys love meter 😊')
        .addUserOption(option => 
            option.setName('love')
            .setRequired(true)
            .setDescription('Your lover')),
    permissions: ["SEND_MESSAGES"],
    botPermission: ["SEND_MESSAGES"],
    category: "Slash",
    run: async(client, interaction) =>{
        const { options } = interaction;

        const member = options.getUser('love');
        if(!member) return
        let Member = interaction.guild.members.cache.get(member.id)

        if(!Member){
            return interaction.reply({embeds: [
                new Discord.MessageEmbed()
                    .setDescription("Please mention a valid member")
                    .setColor("RED")
            ]})
        }

        var option = {
            method: 'GET',
            url: 'https://love-calculator.p.rapidapi.com/getPercentage',
            params: {sname: interaction.user.tag, fname: Member.user.tag},
            headers: {
              'x-rapidapi-host': 'love-calculator.p.rapidapi.com',
              'x-rapidapi-key': process.env.RAPIDAPI
            }
        };
          
        axios.request(option).then(function (res) {
            let items = res.data
            interaction.reply({
                embeds: [new Discord.MessageEmbed()
                    .setAuthor("Love Meter")
                    .setDescription(`**${items.sname}** ❤️ **${items.fname}**\n\nResult: **${items.percentage}**`)
                    .setFooter(`${items.result}`)
                    .setColor("WHITE")
                ]
            })
        }).catch(function (error) {
            interaction.reply({
                embeds: [new Discord.MessageEmbed()
                    .setDescription(`Something went wrong`)
                    .setColor("WHITE")
                ]
            })
            return console.log(error.stack)
        });

    }
}