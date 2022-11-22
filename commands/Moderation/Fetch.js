const { MessageEmbed, MessageButton, MessageActionRow, User } = require('discord.js')
const { LogsDatabase } = require('../../models')
const moment = require('moment');
const file = require('./modLogs');
const LogResolver = file.run.LogResolver;
const { SlashCommandBuilder } = require('@discordjs/builders');
const wait = require('util').promisify(setTimeout);

const row = new MessageActionRow()
    .addComponents(
        new MessageButton()
        .setStyle("PRIMARY")
        .setCustomId("info")
        .setLabel("Expand")
        .setEmoji("<:down:1011170598505947228>")
    )
    .addComponents(
        new MessageButton()
        .setStyle("PRIMARY")
        .setLabel("Logs")
        .setCustomId("seekLogs")
        .setEmoji("<:logs:1011182282599575563>")
    )

class CommandBuilder{
    constructor(){
        this.slashCmd = new SlashCommandBuilder()
            .setName("fetch")
            .setDescription("Fetch a member to view thie informations")
            .addUserOption(option =>
                option
                .setName("user")
                .setRequired(true)
                .setDescription("The user you want to fetch. Also works for banned members")
            )
        this.Permissions = ["MODERATE_MEMBERS"];
        this.ClientPermissions = ["VIEW_AUDIT_LOG", "BAN_MEMBERS"];
        this.category = "Moderation";
    }
};

class Main{
    constructor(client, interaction){
        this.client = client;
        this.interaction = interaction;
        this.guild = interaction.guild;
    };

    async FetchDatabase(User){
        const FetchData = await LogsDatabase.findOne({
            guildID: this.guild.id,
            userID: User.user ? User.user.id : User.id ? User.id : User
        });

        let counter;
        if(FetchData){
            counter = FetchData.Action.length;
        }else {
            counter = 0
        }

        return counter;
    };

    async FetchBanAudit(user){
        user = user.user ? user.user.id : user.id ? user.id : user
        await this.guild.bans.fetch().then(data => {
            let bannedUser = data.find(User => User.user.id == user);

            if(!bannedUser){
                let embed = new MessageEmbed()
                    .setDescription(`<:error:1011174128503500800> Mentioned member is invalid`)
                    .setColor("RED")
                return this.Errors(embed);
            };

            this.EmbedResolve(bannedUser, true);
        });
    };

    async EmbedResolve(member, isBanned){
        const UserEmbed = new MessageEmbed()
        .setAuthor({
            name: member.user.username,
            iconURL: member.user.displayAvatarURL({
                dynamic: true,
                format: 'png',
            })
        })
        .setThumbnail(member.user.displayAvatarURL({
            dynamic: true,
            format: 'png',
            size: 1024
        }))
        .setDescription(`${member.user}`)
        .addFields([
            {
                name: "<:user_icon:1011170605636259921> User",
                value: `${member.user.tag}`,
                inline: true
            },
            {
                name: "<:ID:1011170603228741642> User ID",
                value: `${member.user.id}`,
                inline: true 
            },
            {
                name: "<:logs:1011182282599575563> Log Amount",
                value: `${this.logamt}`,
                inline: true 
            },
            {
                name: "<:hi:1011182837866700840> Created At",
                value: `${moment(member.user.createdAt).format('MMMM Do YYYY, h:mm:ss a')} - ${moment(member.user.createdAt, "YYYYMMDD").fromNow()}`,
                inline: true 
            },
        ])
        .setColor("#2f3136")
        .setFooter({text: `User-ID: ${member.user.id}`})
        .setTimestamp()

        if(isBanned){
            row.components[0].setDisabled(true);
            row.components[1].setDisabled(false);

            UserEmbed.addFields([
                {
                    name: "<:verified:1011183456744636486> Joined At",
                    value: `Not Available`,
                    inline: true
                },
                {
                    name: "<:banhammer:1011180749396901979> Ban Reason",
                    value: `${member.reason}`,
                    inline: false
                }
            ])
        }else {
            row.components[0].setDisabled(false);
            row.components[1].setDisabled(false);

            UserEmbed.addFields([{
                name: "<:verified:1011183456744636486> Joined At", 
                value: `${moment(member.joinedAt).format('MMMM Do YYYY, h:mm:ss a')} - ${moment(member.joinedAt, "YYYYMMDD").fromNow()}`, 
                inline: true
            }])
        }
        
        if(this.interaction.type == "APPLICATION_COMMAND"){
            this.interaction.deferReply();
            await wait(1000)

            return this.interaction.editReply({embeds: [UserEmbed], allowedMentions: [{repliedUser: false}], components: [row]}).then(msg => {
                this.MoreInfo(member, msg, UserEmbed);
            });
        }

        this.interaction.reply({embeds: [UserEmbed], allowedMentions: [{repliedUser: false}], components: [row]}).then(msg => {
            this.MoreInfo(member, msg, UserEmbed);
        });

    };

    async MoreInfo(user, msg, Embed){
        const permFlag = [
            "ADMINISTRATOR", 
            "MANAGE_GUILD", 
            "KICK_MEMBERS", 
            "BAN_MEMBERS", 
            "MANAGE_CHANNELS", 
            "MANAGE_MESSAGES",
            "MUTE_MEMBERS",
            "DEAFEN_MEMBERS",
            "MOVE_MEMBERS",
            "MANAGE_NICKNAMES",
            "MANAGE_ROLES",
            "MANAGE_WEBHOOKS",
            "MANAGE_EMOJIS",
            "ADD_REACTIONS",
            "VIEW_AUDIT_LOG",
            "MENTION_EVERYONE",
            "MODERATE_MEMBERS",
            "MANAGE_WEBHOOKS"
        ];

        const filter = (button) => button.user.id == this.interaction.member.id;
        const collector = msg.createMessageComponentCollector({ filter, componentType: 'BUTTON', time: 1000 * 60 * 1 });
        collector.on('collect',async b => {
            if(b.customId === 'info'){
                const roles = user.roles.cache
                .sort((a,b) => b.position - a.position)
                .map(role => role.toString())
                .slice(0, -1)
                .join(', ') || "None"
        
                let array = user.permissions.toArray()
                const perms = array.filter( i => permFlag.includes(i))
                const permArr = perms.join(", ")
                const permData = permArr.split("_").join(" ") || "None"
        
                Embed.addField("<:roles:1011184351737819226> Roles", `${roles}`)
                Embed.addField("<:settings:1011184939657605162> Permissions", `${permData.toLowerCase()}`)

                row.components[0].setDisabled(true);
                await b.update({embeds: [Embed], components: [row]}).catch(err => {return console.log(err.stack)})

                if(this.interaction.type == "APPLICATION_COMMAND"){
                    collector.stop();
                }
            }
            if(b.customId === "seekLogs"){
                new LogResolver(this.client, this.guild, this.interaction).FindMember(user.user.id);
                
                row.components[1].setDisabled(true);
                await b.update({embeds: [Embed], components: [row]}).catch(err => {return console.log(err.stack)})
                
                if(this.interaction.type == "APPLICATION_COMMAND"){
                    collector.stop();
                }
            }
        });

        collector.on('end', async() => {
            row.components[0].setDisabled(true);
            row.components[1].setDisabled(true);
            await msg.edit({embeds: [Embed], components: [row]}).catch(err => {return console.log(err.stack)})
        })
    }

    async Mainframe(){
        const {options} = this.interaction;
        let user = options.getUser('user');

        let Member = this.guild.members.cache.get(user.id);
        if(!Member){
            this.logamt = await this.FetchDatabase(user);
            return this.FetchBanAudit(user);
        }

        this.logamt = await this.FetchDatabase(Member);
        this.EmbedResolve(Member);
    };

    Errors(embed){
        this.interaction.reply({embeds: [embed], ephemeral: true}).catch(err => {return console.log(err.stack)})
    };
};
module.exports.test = {Main, CommandBuilder};