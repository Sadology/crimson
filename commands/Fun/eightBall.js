const Discord = require('discord.js');
module.exports = {
    name: '8ball',
    aliases: ['eightball'],

    run: async(client, message, args,prefix) =>{

        let eightBallmessage = args.slice(0).join(' ')
        if(!eightBallmessage) return message.channel.send("What you wanst to know from 8ball?")

        let eightballQuote = [
            `As I see it, yes. ${message.author.username}`,
            `Ask again later, ${message.author.username}`,
            `Better not tell you now, ${message.author.username}`,
            `Cannot predict now, ${message.author.username}`,
            `Concentrate and ask again, ${message.author.username}`,
            `Don’t count on it, ${message.author.username}`,
            `It is certain, ${message.author.username}`,
            "It is decidedly so",
            `Most likely senpai, ${message.author.username}`,
            "My reply is no",
            "My sources say no",
            `Outlook not so good ${message.author.username}`,
            `Outlook good, ${message.author.username}`,
            "Reply hazy, try again",
            `Signs point to yes, ${message.author.username}`,
            "Very doubtful",
            `Without a doubt, ${message.author.username}`,
            "Yes senpai",
            `Yes – definitely, ${message.author.username}`,
            `You may rely on it , ${message.author.username}`,
            `certainly, ${message.author.username}`,
        ]

        let chooseQuote = eightballQuote[Math.floor(Math.random() * eightballQuote.length)]

        await message.channel.send({embeds: [new Discord.MessageEmbed()
            .setAuthor(`🎱 | ${chooseQuote}`)
            .setColor("RANDOM")
        ]
        })
    }
}