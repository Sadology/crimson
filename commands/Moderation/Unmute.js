const Discord = require('discord.js');
const { LogsDatabase } = require('../../models');
const { Member, UserRoleManager, LogManagers, GuildMember, LogManager} = require('../../Functions');
const { SlashCommandBuilder } = require('@discordjs/builders');

class UnmuteManager{
    constructor (client, guild, interaction){
        this.client = client;
        this.guild = guild;
        this.interaction = interaction;
    }

    async fetchData(user){
        let data = await LogsDatabase.findOne({
            guildID: this.guild.id,
            userID: user.user.id,
            Muted: true
        }).catch(err => {return console.log(err.stack)})

        if(!data) return false;
        return data;
    }

    async Mainframe(user, executor){
        let Member = this.guild.members.cache.get(user);
        if(!Member){
            return this.interaction.reply({
                embeds: [new Discord.MessageEmbed()
                    .setDescription("<:error:921057346891939840> Mentioned user is invalid")
                    .setColor("RED")
                ]
            })
        }

        let data = await this.fetchData(Member);
        if(data){
            this.updatedData(Member);
        }

        let Embed = new Discord.MessageEmbed()

        let muteRole = await this.guild.roles.cache.find(r => r.name.toLowerCase() === 'muted')
        if(!muteRole){
            Embed.setDescription("<:error:921057346891939840> Couldn't find the muted role")
            Embed.setColor("RED")
            return this.errorHandle(Embed);
        }

        const clientTopRole = this.guild.members.resolve( this.client.user ).roles.highest.position;

        if(muteRole.position >= clientTopRole){
            Embed.setDescription("Muted role position is higher than my highest role")
            Embed.setColor("RED")
            return this.errorHandle(Embed);
        }

        if(!Member.roles.cache.has(muteRole.id)){
            Embed.setDescription(`<:error:921057346891939840> ${Member.user} is currently not muted`)
            Embed.setColor("RED")
            return this.errorHandle(Embed);
        }

        await Member.roles.remove(muteRole.id)
        .then(() => {
            this.interaction.reply({embeds: [new Discord.MessageEmbed()
                .setDescription(`<:check:959154334388584509> ${Member.user} was unmuted`)
                .setColor("#2f3136")
            ], allowedMentions: [{repliedUser: false}]})
        })
        .catch(err => {return console.log(err)});

        this.client.eventEmitter.emit('MuteRemoved', Member, executor);
    }

    errorHandle(embed){
        this.interaction.reply({embeds: [embed], ephemeral: true});
    }

    async updatedData(user){
        await LogsDatabase.updateOne({
            guildID: this.guild.id,
            userID: user.user.id
        }, {
            $set: {
                Muted: false
            }
        }).catch(err => {return console.log(err.stack)})
    }
}

module.exports.run = {
    run: async(client, interaction, args, prefix) =>{
        
        const { options } = interaction;
        let user = options.getUser('user')

        let data = new UnmuteManager(client, interaction.guild, interaction).Mainframe(user ? user.id : user, interaction.member)
    
    }
}

module.exports.slash = {
    data: new SlashCommandBuilder()
        .setName("unmute")
        .setDescription("Unmute someone from mute state")
        .addUserOption(option => 
            option.setName("user")
            .setDescription("The use you want to unmute")
            .setRequired(true)    
        ),
    Permissions: ["MODERATE_MEMBERS"],
    ClientPermissions: ["MANAGE_ROLES"],
    category: "Moderation",
}