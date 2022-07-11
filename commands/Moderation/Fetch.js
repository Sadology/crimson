const { MessageEmbed, MessageButton, MessageActionRow } = require('discord.js')
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
    .setEmoji("<:down:975461613471682560>")
)
.addComponents(
    new MessageButton()
    .setStyle("PRIMARY")
    .setLabel("Logs")
    .setCustomId("seekLogs")
    .setEmoji("<:logs:921093310368596008>")   
)

class MemberResolver {
    /**
     * 
     * @param {Object} client - Client function
     * @param {Object} guild - Guild function
     * @param {Object} interaction - Interaction function
     */
    constructor(client, guild, interaction){
        this.client = client;
        this.guild = guild;
        this.interaction = interaction;
    };

    async FetchMember(user){
        let Member = this.guild.members.cache.get(user)
        if(!Member){
            this.logamt = await this.FetchDatabase(user);
            return this.FetchBanAudit(user);
        }

        this.logamt = await this.FetchDatabase(Member);
        this.EmbedResolve(Member);
    };

    async FetchDatabase(User){
        const FetchData = await LogsDatabase.findOne({
            guildID: this.guild.id,
            userID: User.user ? User.user.id : User.id ? User.id : User
        });

        let counter;
        if(FetchData){
            counter = FetchData.Action.length
        }else {
            counter = 0
        }

        return counter;
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
        .addField("<:user_icon:958016031127904307> User", `${member.user.tag}`, true)
        .addField("<:ID:975459612386025592> User ID", `${member.user.id}`, true)
        .addField("<:search:959185395424321576> Log Amount", `${this.logamt}`, true)
        .addField("<a:create:962717227705069629> Created At", `${moment(member.user.createdAt).format('MMMM Do YYYY, h:mm:ss a')} - ${moment(member.user.createdAt, "YYYYMMDD").fromNow()}`, true)
        .setColor("#2f3136")
        .setFooter({text: `User-ID: ${member.user.id}`})
        .setTimestamp()
        if(isBanned){
            row.components[0].setDisabled(true);
            row.components[1].setDisabled(false);

            UserEmbed.addField("<a:join:962717227705069629> Joined At", `Not Available`, true)
            UserEmbed.addField("Ban Reason", `${member.reason}`)
        }else {
            row.components[0].setDisabled(false);
            row.components[1].setDisabled(false);

            UserEmbed.addField("<a:join:962717227705069629> Joined At", `${moment(member.joinedAt).format('MMMM Do YYYY, h:mm:ss a')} - ${moment(member.joinedAt, "YYYYMMDD").fromNow()}`, true)
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
        
                Embed.addField("<:roles:921093178046693377> Roles", `${roles}`)
                Embed.addField("<:administration:915457421823078460> Permissions", `${permData.toLowerCase()}`)

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



    async FetchBanAudit(user){
        user = user.user ? user.user.id : user.id ? user.id : user
        await this.guild.bans.fetch().then(data => {
            let bannedUser = data.find(User => User.user.id == user);

            if(!bannedUser){
                let embed = new MessageEmbed()
                    .setDescription(`<:error:921057346891939840> Mentioned member is invalid`)
                    .setColor("RED")
                return this.Errors(embed);
            };

            this.EmbedResolve(bannedUser, true);
        });
    };

    Errors(embed){
        this.interaction.reply({embeds: [embed], ephemeral: true}).catch(err => {return console.log(err.stack)})
    };
}
module.exports.run = {
    run: async(client, interaction, args,prefix) =>{
        const {options} = interaction;
        let user = options.getUser('user');

        // Calling the log resolver class for slash command
        let Data = new MemberResolver(client, interaction.guild, interaction).FetchMember(user ? user.id : user)

    }
};

// Slash command export
module.exports.slash = {
    data: new SlashCommandBuilder()
        .setName("fetch")
        .setDescription("Seek a user out")
        .addUserOption(option =>
            option
            .setName("user")
            .setRequired(true)
            .setDescription("The user you want to seek out. Works for banned member too")
        ),
    Permissions: ["MODERATE_MEMBERS"],
    ClientPermissions: ["VIEW_AUDIT_LOG"],
    category: "Moderation",
}