const Discord = require('discord.js');
module.exports = {
    name: 'findgf',
    aliases: ['findbf'],
    description: "Lonely? not anymore, bot will find the best match couple for you.",
    permissions: ["EVERYONE"],
    usage: "findgf",
    category: "Fun",

    run: async(client, message, args,prefix, cmd) =>{

        await message.channel.send("Looking for match...").then((m) =>{
            const chance = Math.random() < 0.5
            if(chance){
                const randomMem = m.guild.members.cache.random().user;

                if (randomMem){
                    try{
                        setTimeout(() =>{
                            let embed = new Discord.MessageEmbed()
                                embed.setAuthor("Couple Generator", message.author.displayAvatarURL({dynamic: false, size: 1024, type: "png"}))
                                embed.setDescription(`Hey **${message.author}** found a match, you and **${randomMem}** gonna be a sweet couple 😘😍`)
                                embed.setColor("RANDOM")
                            m.edit({content: "Success", embeds: [embed]});
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