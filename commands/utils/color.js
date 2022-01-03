const { saveData } = require('../../Functions/functions');
const Discord = require('discord.js');
const Canvas = require('canvas');
const axios = require('axios')
module.exports = {
    name: 'color',
    description: "check a color with hex code",
    permissions: ["SEND_MESSAGES"],
    botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
    usage: "color [ color code ]",
    category: "Utils",
    cooldown: 3000,

    run: async(client, message, args, prefix)=> {
        if(!args.length || !args[0] || !args[0].startsWith("#")){
            return message.channel.send({
                embeds: [new Discord.MessageEmbed()
                    .setDescription(`Find a color with Hex codes \n\nUsage: \`${prefix}color [ hex code ]\`\nExample: \`${prefix}color #ffffaf\``)
                    .setColor("WHITE")
                ]
            }).catch(err => {return console.log(err.stack)})
        }
        
        let hexColor = args[0].split("#").slice().join('')
        axios.get(`https://www.thecolorapi.com/id?hex=${hexColor}`).then(async res => {
            let col = res.data.hex.value
            let rgba = res.data.rgb.value
            let name = res.data.name.value

            const canvas = Canvas.createCanvas(250, 200);
            const context = canvas.getContext('2d');
    
            const background = await Canvas.loadImage('https://media.discordapp.net/attachments/874975341347762209/922920408792059974/compressedBotT.png?width=407&height=444');
            const sadFace = await Canvas.loadImage('https://media.discordapp.net/attachments/874975341347762209/922914036088184852/compressedBot_1.png?width=407&height=444');
    
            context.beginPath();
            context.arc(130, 100, 100, 0, 5 * Math.PI);
            context.fillStyle = col;
            context.fill();
    
            context.drawImage(sadFace, 28, 5, 200, 200);
            context.drawImage(background, 0, 0, canvas.width, canvas.height);

            const attachment = new Discord.MessageAttachment(canvas.toBuffer(), 'sadbotcolor.png');
            let Embed = new Discord.MessageEmbed()
                .setAuthor(name ? name : "Unknown")
                .setColor(col ? col : "#faffff")
                .addField("Hex Code", col ? col : "Unknown")
                .addField("Rgb", rgba ? rgba : "Unknown")
                .setThumbnail('attachment://sadbotcolor.png');
            message.channel.send({ embeds: [Embed], files: [attachment] }).catch(err => {return console.log(err.stack)})
        })
    }
}