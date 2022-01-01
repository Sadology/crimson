const Discord = require('discord.js');
const axios = require('axios');
module.exports = {
    name: 'makeme',
    aliases: ['generateme', 'makeme'],
    description: "Experimental command",
    permissions: ["SEND_MESSAGES"],
    botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
    usage: "makeme",
    cooldown: 3000,
    run: async(client, message, args,prefix) =>{
        axios.get("https://api.namefake.com/").then(function(res){
            let Embed = new Discord.MessageEmbed()
                .setDescription(`Hey its me **${message.author.username + " " + res.data.name}**`)
                .setAuthor("Your alternate life")
                .addFields(
                    {
                        name: "Address",
                        value: res.data.address,
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
                        name: "Work At",
                        value: res.data.company,
                        inline: true
                    },
                    {
                        name: "Hair color",
                        value: `${res.data.hair}`,
                        inline: true
                    },
                    {
                        name: "Height",
                        value: `${res.data.height}cm`.toString(),
                        inline: true
                    },
                    {
                        name: "Weight",
                        value: `${res.data.weight}kg`.toString(),
                        inline: true
                    },
                )
                .setColor("RANDOM")
                .setFooter("All infos are randomly generated.")

                message.reply({embeds: [Embed]})
        })
        .catch(err=>console.log(err))
    }
}