const { MessageEmbed } = require('discord.js');

module.exports = {
    event: "message",
    once: false,
    disabled: true,
    run: async(message)=> {
        const BannedWordArray = [
            "gay",
            "fuck",
            "nigga",
            "g4y",
            "f4ck",
            "n1gga",
            "ni44a",
            "nibba",
            "sex",
            "slut",
            "whore",
            "shit",
            "sh1t"
        ]
        
        if ((/(fuck|shit)/gm).test(message.content)) {
            message.delete().then(() => {
              message.reply('Do not swear!');
            });
        }
    }
}