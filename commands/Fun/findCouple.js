const Discord = require('discord.js');
const axios = require('axios');
module.exports = {
    name: 'findgf',
    aliases: ['findbf'],
    description: "Lonely? not anymore, bot will find the best match couple for you.",
    permissions: ["SEND_MESSAGES"],
    botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
    usage: "findgf",
    category: "Fun",
    cooldown: 3000,
    run: async(client, message, args,prefix, cmd) =>{
        await message.channel.send("Looking for match...").then((m) =>{
            const chance = Math.random() < 0.5
            if(chance){
                const randomMem = m.guild.members.cache.random().user;

                if (randomMem){
                    try{
                        setTimeout(() =>{
                            axios.get("https://api.namefake.com/").then(function(res){
                            let Embed = new Discord.MessageEmbed()
                                .setDescription(`${"<@"+message.author+">" + " 💗 " + "<@"+randomMem+">"}`)
                                .setAuthor("Found a prefect match for you 😊")
                                .addFields(
                                    {
                                        name: "Address",
                                        value: `${res.data.address}`.toString(),
                                        inline: true
                                    },
                                    {
                                        name: "Phone",
                                        value: `${res.data.phone_h}`.toString(),
                                        inline: true
                                    },
                                    {
                                        name: "Email",
                                        value: `${res.data.email_u+"@gmail.com"}`.toString(),
                                        inline: true
                                    },
                                    {
                                        name: "Works At",
                                        value: `${res.data.company}`.toString(),
                                        inline: true
                                    },
                                    {
                                        name: "Hair color",
                                        value: `${res.data.hair}`.toString(),
                                        inline: true
                                    },
                                    {
                                        name: "Height",
                                        value: `${res.data.height+"cm"}`.toString(),
                                        inline: true
                                    },
                                    {
                                        name: "Weight",
                                        value: `${res.data.weight+"kg"}`.toString(),
                                        inline: true
                                    },
                                )
                                .setColor("RANDOM")
                                .setFooter("All infos are randomly generated.")
                                m.edit({content: "Success", embeds: [Embed]});
                            })
                        }, 1000 * 2)
                    } catch(err){
                        console.log(err);
                    }
                }
            }else {
                let embed = new Discord.MessageEmbed()
                embed.setAuthor("Couple Generator", message.author.displayAvatarURL({dynamic: false, size: 1024, type: "png"}))
                embed.setDescription(`Sorry **${message.author}**, found no match for you 😔`)
                embed.setColor("RANDOM")

                m.edit({content: "Failed", embeds: [embed]})
            }
        })
    }
}