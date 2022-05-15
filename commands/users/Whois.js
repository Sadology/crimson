const Discord = require('discord.js');
const moment = require('moment');
const { GuildMember } = require('../../Functions');
const { SlashCommandBuilder } = require('@discordjs/builders');

class UserInfoManager{
    constructor(client, guild, interaction){
        this.client = client;
        this.guild = guild;
        this.interaction = interaction;
    }

    async MainFrame(User){
        let Member;

        if(!User){
            Member = this.interaction.member;
        }

        else {
            Member = await new GuildMember(this.client, this.guild).MemberNonHandled(User, this.interaction);
        }

        if(!Member || Member.ID) {
            Member = this.interaction.member;
        }

        console.log(Member)
        this.FetchData(Member)
    }

    FetchData(Member){
        let roles = Member.roles.cache
        .sort((a,b) => b.position - a.position)
        .map(role => role.toString())
        .slice(0, -1)
        .join(', ') || "None"

        let Embed = new Discord.MessageEmbed()
            .setAuthor({name: `${Member.user.username}`, iconURL: Member.user.displayAvatarURL({dynamic: true, format: 'png'})})
            .addFields([
                {
                    name: `<a:join:962717227705069629> Join Date`,
                    value: `${moment(Member.joinedAt).format('MMMM Do YYYY, h:mm:ss a')} - ${moment(Member.joinedAt, "YYYYMMDD").fromNow()}`,
                    inline: true
                },
                {
                    name: `<:time:958254873906933820> Creation Date`,
                    value: `${moment(Member.user.createdAt).format('MMMM Do YYYY, h:mm:ss a')} - ${moment(Member.user.createdAt, "YYYYMMDD").fromNow()}`,
                    inline: true
                },
                {
                    name: `<:roles:921093178046693377> Roles [${Member.roles.cache.size - 1}]`,
                    value: `${roles}`,
                },
            ])
            .setThumbnail(Member.user.avatarURL({dynamic: true, size: 1024, format: 'png'}) ? Member.user.avatarURL({dynamic: true, size: 1024, type: 'png'}) : Member.user.displayAvatarURL({dynamic: true, size: 1024, type: 'png'}))
            .setFooter({text: "User-id • "+Member.user.id})
            .setColor("#2f3136")
            .setTimestamp()

        this.sendData(Embed)
    }

    sendData(embed){
        switch (this.interaction.type){
            // If its slash command, reply with embed and create a collector
            case 'APPLICATION_COMMAND':
                this.interaction.reply({embeds: [embed]}).catch(err => {return console.log(err.stack)})
            break;

            // If its default command, send the message & create a collector
            case 'DEFAULT':
                this.interaction.channel.send({embeds: [embed]}).catch(err => {return console.log(err.stack)})
            break;
        };
    }
}


module.exports.run = {
    run: async(client, interaction, args,prefix) =>{
            
        const {options} = interaction;
        let user = options.getUser('user');

        // Calling the log resolver class for slash command
        let Data = new UserInfoManager(client, interaction.guild, interaction).MainFrame(user ? user.id : interaction.member.user.id);

    }
};

// Slash command export
module.exports.slash = {
    data: new SlashCommandBuilder()
        .setName("user-info")
        .setDescription("Your server informations")
        .addUserOption(option =>
            option
            .setName("user")
            .setDescription("Information of another user")),
    category: "Utility",
}