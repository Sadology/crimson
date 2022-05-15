const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports.run = {
    run: async(client, interaction, args,prefix) =>{
        const {options } = interaction;
        let ques = options.getString('question')

        let eightballQuote = [
            `As I see it, yes ${interaction.member.user.username} (˵╹⌣╹˵)`,
            `Ask again later ${interaction.member.user.username} ( ◞‸◟\`)`,
            `Better not tell you now ${interaction.member.user.username} |ω・）`,
            `Cannot predict now ${interaction.member.user.username} ( \_　\_|||)`,
            `Concentrate and ask again ${interaction.member.user.username} (。・-・)`,
            `Don’t count on it ${interaction.member.user.username} ( ˃̣̣̥⌓˂̣̣̥)`,
            `It is certain ${interaction.member.user.username}`,
            "It is decidedly so... ¬‿¬",
            `Most likely senpai, ${interaction.member.user.username}`,
            "My reply is No (´；ω；`)",
            "My sources say No (￢з￢)",
            `Outlook not so good ${interaction.member.user.username} （ >﹏ <）`,
            `Outlook good ${interaction.member.user.username} (•‿‿•)`,
            "Reply hazy, try again (ー_ーゞ",
            `Signs point to yes ${interaction.member.user.username} (ᵔᴥᵔ)`,
            "Very doubtful ( ˃̣̣̥᷄︵˂̣̣̥᷅ )",
            `Without a doubt senpai ${interaction.member.user.username} ( >ω<)♡`,
            "Yes senpai ＼（＾▽＾）／",
            `Yes – definitely senpai （＞ｗ＜ ）`,
            `You may rely on it senpai :3`,
            `certainly, ${interaction.member.user.username} （＾3＾）～♡`,
        ]

        let chooseQuote = eightballQuote[Math.floor(Math.random() * eightballQuote.length)]

        await interaction.reply({embeds: [new Discord.MessageEmbed()
            .setAuthor({name: interaction.member.user.username, iconURL: interaction.member.user.displayAvatarURL({dynamic: true, size: 1024, format: 'png'})})
            .setDescription(`🎱 • **${ques}**\n<:reply:897083777703084035> ${chooseQuote}`)
            .setColor("#2f3136")
        ], allowedMentions: [{repliedUser: false}]
        })
    }
}

module.exports.slash = {
    data: new SlashCommandBuilder()
        .setName('8ball')
        .setDescription("8ball will answer all of your question & clear your confusion")
        .addStringOption(option => 
            option.setName('question')
            .setDescription("The question you want an answer")
            .setRequired(true)),
    category: "Fun"
}