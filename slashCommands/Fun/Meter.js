const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
var axios = require("axios")
module.exports = {
    data: new SlashCommandBuilder()
        .setName('meter')
        .setDescription('Check you and your babys love meter 😊')
        .addSubcommand(subcommand =>
            subcommand
                .setName('love')
                .setDescription('Couple love meter')
                .addUserOption(option => 
                    option.setName('user')
                    .setDescription("Your love")
                    .setRequired(true)))
        .addSubcommand(subcommand =>
            subcommand
                .setName('sus')
                .setDescription('How sus you\'re')
                .addUserOption(option => 
                    option.setName('user')
                    .setDescription("How sus your friend is"))),
    permissions: ["USE_APPLICATION_COMMANDS"],
    botPermission: ["SEND_MESSAGES"],
    category: "Slash",
    run: async(client, interaction) =>{
        const { options } = interaction;

        let type = options.getSubcommand();

        const userInter = options.getUser('user');
        const Member = interaction.guild.members.resolve(userInter);

        switch(type){
            case 'love':
                loveMeter()
            break;
            case 'sus':
                susMeter();
            break;
        }

        function loveMeter(){
            var option = {
                method: 'GET',
                url: 'https://love-calculator.p.rapidapi.com/getPercentage',
                params: {sname: interaction.user.username, fname: Member.user.username},
                headers: {
                  'x-rapidapi-host': 'love-calculator.p.rapidapi.com',
                  'x-rapidapi-key': process.env.RAPIDAPI
                }
            };

            axios.request(option).then(function (res) {
                let items = res.data
                interaction.reply({
                    embeds: [new Discord.MessageEmbed()
                        .setAuthor({name: "💑 Love Meter"})
                        .setDescription(`**${items.sname}** ❤️ **${items.fname}**\n\nResult: **${items.percentage}**`)
                        .setFooter({text: `${items.result}`})
                        .setColor("#ff263c")
                    ]
                }).catch(err => {return console.log(err.stack)});
            }).catch(function (error) {
                interaction.reply({
                    embeds: [new Discord.MessageEmbed()
                        .setDescription(`Something unexpected happened`)
                        .setColor("WHITE")
                    ]
                })
                return console.log(error.stack)
            });
        }

        function susMeter() {
            let num = Math.floor(Math.random() * 100)
            let result;
            if(num < 50){
                result = "Not that sus";
            }else if(num >= 50 && num < 80){
                result = "You're a bit sus"
            }else if(num >= 80 && num < 100){
                result = "You're very sussy"
            }else if(num == 100){
                result = "You're the imposter <:susBot:942376661498880060>"
            }

            interaction.reply({
                embeds: [new Discord.MessageEmbed()
                    .setTitle('<:susBot:942376661498880060> Sus Meter')
                    .setDescription(`User: ${Member ? Member.user.username : interaction.user.username}\nResult: **${num}**`)
                    .setFooter({text: `${result}`})
                    .setColor("#ff0f27")
                ]
            }).catch(err => {return console.log(err.stack)});
        }
    }
}