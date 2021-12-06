const Discord = require('discord.js');

module.exports = {
    name: 'ping',
    description: "Ping! Pong!. Check bots ping",
    permissions: ["SEND_MESSAGES"],
    botPermission: ["SEND_MESSAGES"],
    usage: "ping",
    category: "Utils",
    cooldown: 3000,
    run: async(client, message, args)=> {
        let choices = ["Checking pings...","Pinging...", "What's my ping?...", "Now checking..."]
        let response = choices[Math.floor(Math.random() * choices.length)]

        const resEmbed = new Discord.MessageEmbed()
            .setDescription(response)
            .setColor("#fafcff")

        await message.channel.send({embeds: [resEmbed]
        }).then((m) =>{
            let Ping = m.createdTimestamp - message.createdTimestamp
            let botping = Math.round(client.ws.ping)
    
            setTimeout(async() =>{
                const embed = new Discord.MessageEmbed()
                    .addField("Client Latency", Ping.toString(), true)
                    .addField("Api Latency", botping.toString(), true)
                    .setColor("#fafcff")
    
                await m.edit({embeds: [embed]})
            }, 2000)
        })
    }
}