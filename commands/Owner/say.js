const Discord = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

class SayManager{
    constructor(client, guild, interaction){
        this.client = client;
        this.guild = guild;
        this.interaction = interaction;
    }

    Mainframe(content, channel){
        if(channel){
            return this.ChannelResolve(channel, content);
        }

        let embed = new Discord.MessageEmbed()
            .setDescription(`Your message was sent`)
            .setColor("#2f3136")

        this.interaction.channel.send({content: content}).catch(err => {return console.log(err.stack)})

        return this.errorhandle(embed);
    }

    ChannelResolve(channel, content){
        let embed = new Discord.MessageEmbed()
        if(channel.type !== "GUILD_TEXT"){

            embed.setDescription("You can only send messages in Text-channles")
            embed.setColor("RED")

            return this.errorhandle(embed);
        }

        const hasPermissionInChannel = channel
            .permissionsFor(this.interaction.member)
            .has(['SEND_MESSAGES', 'VIEW_CHANNEL'], false);

        const BotHasPermissionInChannel = channel
            .permissionsFor(this.client.user)
            .has(['SEND_MESSAGES', 'VIEW_CHANNEL'], false);

        console.log(hasPermissionInChannel)
        if(!hasPermissionInChannel){

            embed.setDescription("You don't have permission to send message in "+channel.toString())
            embed.setColor("RED")

            return this.errorhandle(embed);
        }

        if(!BotHasPermissionInChannel){

            embed.setDescription("I don't have permission to send meassage")
            embed.setColor("RED")

            return this.errorhandle(embed);
        }
        
        channel.send({content: content}).catch(err => {return console.log(err.stack)});

        embed.setDescription(`Your message was sent in ${channel.toString()}`);
        embed.setColor("#2f3136")

        return this.errorhandle(embed);
    }

    errorhandle(embed){
        this.interaction.reply({embeds: [embed], ephemeral: true});
    }
}

module.exports.run = {
    run: (client, interaction) => {
        const {options} = interaction;
        let content = options.getString('message');
        let channel = options.getChannel('channel');

        let data = new SayManager(client, interaction.guild, interaction).Mainframe(content, channel)
    }
}
module.exports.slash = {
    data: new SlashCommandBuilder()
        .setName('say')
        .setDescription("Type a message and bot will send the message")
        .addStringOption(Option => 
            Option.setName('message')
            .setDescription("The message you want bot to say")
            .setRequired(true)
        )
        .addChannelOption(option =>
            option.setName('channel')
            .setDescription("Send message in another channel")),

    category: "Administration",
    Permissions: ["ADMINISTRATOR"],
    ClientPermissions: ["SEND_MESSAGES"],
}