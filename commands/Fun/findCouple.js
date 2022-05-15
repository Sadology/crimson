const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');
const wait = require('util').promisify(setTimeout);

module.exports.run = {
    run: async(client, interaction, args, prefix) =>{
        function GetMember(){
            const randomMem = interaction.guild.members.cache.random().user;

            if(randomMem.bot == true){
                GetMember();
            }
            else if(randomMem.id == interaction.member.user.id){
                GetMember();
            }
            else {
                return Mainframe(randomMem)
            }
        }
        
        async function Mainframe(pair){
            interaction.deferReply();
            await wait(1000);

            interaction.editReply({content: 'Looking for a pair for you...'}).then(async m => {
                //m.deferReply();
                await wait(1000);
                let chance = Math.random() < 0.5;

                if(chance){
                    m.edit({content: "Found a match!", embeds: [new Discord.MessageEmbed()
                        .setAuthor({name: "A perfect match"})
                        .setDescription(`${interaction.member.user} ♥ ${pair} (ﾉ≧ ∀ ≦)ﾉ`)
                        .setColor("#2f3136")
                    ]
                    })
                }

                else {
                    m.edit({content: "Failed",embeds: [new Discord.MessageEmbed()
                        .setAuthor({name: "A failed run"})
                        .setDescription(`I guess you will be lonely forever (˚ ˃̣̣̥⌓˂̣̣̥ )`)
                        .setColor("#2f3136")
                    ]
                    }) 
                }
            })
        }

        GetMember();
    }
}

module.exports.slash = {
    data: new SlashCommandBuilder()
        .setName('find-pair')
        .setDescription("I will find a pair for you :3"),
    category: "Fun"
}