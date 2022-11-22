const Discord = require('discord.js');
const moment = require('moment');
const { SlashCommandBuilder } = require('@discordjs/builders');
class CommandBuilder{
    constructor(){
        this.slashCmd = new SlashCommandBuilder()
            .setName("user-info")
            .setDescription("Your server informations")
            .addUserOption(option =>
                option
                .setName("user")
                .setDescription("Information of another user"))
        this.category = "Utility"
    }
};

class Main{
    constructor(client, interaction){
        this.client = client;
        this.interaction = interaction;
        this.guild = this.interaction.guild;
    };

    async Mainframe(){
        const {options} = this.interaction;
        let user = options.getUser('user');

        let Member;
        if(!user){
            Member = this.interaction.member;
        }
        else {
            Member = this.guild.members.cache.get(user.id);
        }
        if(!Member) {
            Member = this.interaction.member;
        }

        this.FetchData(Member)
    };

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
                    name: `<:hi:1011182837866700840> Join Date`,
                    value: `${moment(Member.joinedAt).format('MMMM Do YYYY, h:mm:ss a')} - ${moment(Member.joinedAt, "YYYYMMDD").fromNow()}`,
                    inline: true
                },
                {
                    name: `<:verified:1011183456744636486> Creation Date`,
                    value: `${moment(Member.user.createdAt).format('MMMM Do YYYY, h:mm:ss a')} - ${moment(Member.user.createdAt, "YYYYMMDD").fromNow()}`,
                    inline: true
                },
                {
                    name: `<:roles:1011184351737819226> Roles [${Member.roles.cache.size - 1}]`,
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
        this.interaction.reply({embeds: [embed]}).catch(err => {return console.log(err.stack)})
    }
};

module.exports.test = {Main, CommandBuilder};