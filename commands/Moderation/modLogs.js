const Discord = require('discord.js');
const { LogsDatabase } = require('../../models');
const moment = require('moment');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js')
const { GuildMember } = require('../../Functions');
const { SlashCommandBuilder } = require('@discordjs/builders');
const wait = require('util').promisify(setTimeout);

const row = new MessageActionRow()
.addComponents(
    new MessageButton()
        .setStyle("PRIMARY")
        .setCustomId("NextPageModLog")
        .setEmoji("<:next:1011181156336672829>")
)
.addComponents(
    new MessageButton()
        .setStyle("PRIMARY")
        .setCustomId("PreviousPageModLog")
        .setEmoji("<:previous:1011181158807113760>")
)

class LogResolver{
    constructor(Client, Guild, interaction){
        this.client = Client;
        this.guild = Guild;
        this.interaction = interaction;
        this.DelMode = false;
    };

    // First find the member in guild
    async FindMember(ID){
        // Error embed class
        let ErrorEmbed = new Discord.MessageEmbed()
        .setColor("RED")

        // Call the guild member class to find find the member
        let Member = await new GuildMember(this.client, this.interaction.guild, this.interaction).MemberNonHandled(ID)

        if(!Member){
            ErrorEmbed.setDescription("<:error:1011174128503500800> Mentioned user is invalid")
            return this.sendErrorData(ErrorEmbed)
        }
        if(Member.ID){
            this.User = Member.ID;
            this.fetchData(Member.ID);
        }else {
            this.User = Member;
            this.fetchData(Member);
        }
    };

    // Fetch data from database
    async fetchData(){
        // Error embed class
        let errEmbed = new Discord.MessageEmbed();
        // Hit database for one specific data
        await LogsDatabase.findOne({
            guildID: this.guild.id,
            userID: this.User.user ? this.User.user.id : this.User
        })
        .then(res => {
            if(!res){
                errEmbed.setDescription("<:error:1011174128503500800> User doesn't have any logs")
                return this.sendErrorData(errEmbed);
            };

            this.logCreate(res);
        })
        .catch(err => {
            return console.log(err.stack);
        })
    };

    // Push log data to an array
    logCreate(Data){
        let errEmbed = new Discord.MessageEmbed()
        .setColor("RED")

        if(Data.Action.length == 0){
            errEmbed.setDescription("<:error:1011174128503500800> User doesn't have any logs")
            return 
        };

        let dataLake = [];
        Data.Action.forEach(data => {
            dataLake.push(data)
        });

        this.LogManager(dataLake);
    };

    // Create Pagination Embed
    async LogManager(Data){
        let currentIndex = 0;

        // Data per embed function
        let MakeEmbed = start => {
            const SplitData = Data.slice(start, start + 2)
            const Embed = new Discord.MessageEmbed()
                .setDescription(`${this.User.user ? this.User.user : "<@"+this.User+">"} Mod-Logs - \`[ ${Data.length} ]\``)
                .setFooter({text: `User-ID: ${this.User.user ? this.User.user.id : this.User} ∙ Showing: ${start + 1} - ${start + SplitData.length}`})
                .setColor("#2f3136")

            for (let i = 0; i < SplitData.length; i++){
                Embed.addField(`**${start + i + 1}**• [ ${SplitData[i].actionType} ]`,[
                    `\`\`\`arm\nUser     ∙ ${SplitData[i].userName}`,
                    `Reason   ∙ ${SplitData[i].actionReason}`,
                    `Mod      ∙ ${SplitData[i].moderator}`,
                    `Duration ∙ ${SplitData[i].actionLength ? SplitData[i].actionLength : "∞"}`,
                    `Date     ∙ ${moment(SplitData[i].actionDate).format('llll')}`,
                    `LogID    ∙ ${SplitData[i].caseID ? SplitData[i].caseID : SplitData[i].LogID}\`\`\``
                ].join(" \n").toString(), true)
            }
            
            row.components[0].setDisabled(false)
            row.components[1].setDisabled(false)
            /* Enable or Disable buttons depending on data value
            If data is smaller or equal as 5, don't add the button */
            if(Data.length <= 2){
                return ({embeds: [Embed], allowedMentions: [{repliedUser: false}]});
            }
            // if data is greater than log data amount enable next button and disable previous button
            else if (start + SplitData.length >= Data.length){
                row.components[0].setDisabled(true)
                row.components[1].setDisabled(false)
                return ({embeds: [Embed], allowedMentions: [{repliedUser: false}], components: [row]});
            }
            // If data amount is equal to 0, enable previous button and disable next button
            else if(SplitData.length == 0){
                row.components[0].setDisabled(true)
                row.components[1].setDisabled(false)
                return ({embeds: [Embed], allowedMentions: [{repliedUser: false}], components: [row]});
            }
            // If current page value isn't equal to 0, enable both buttons
            else if(currentIndex !== 0){
                row.components[1].setDisabled(false)
                row.components[0].setDisabled(false)
                return ({embeds: [Embed], allowedMentions: [{repliedUser: false}], components: [row]});
            }
            // If current page value plus 5 is smaller than data length, enable next button & disable previous button
            else if (currentIndex + 2 <= Data.length){
                row.components[1].setDisabled(true)
                row.components[0].setDisabled(false)
                return ({embeds: [Embed], allowedMentions: [{repliedUser: false}], components: [row]});
            }
        }
        // Filter the button collector
        const filter = (button) => button.member.user.id == this.interaction.member.id;
        // Send the data to channel and create a collector
        switch (this.interaction.type){
            // If its slash command, reply with embed and create a collector
            case 'APPLICATION_COMMAND':
                if(this.interaction.deferred == true){
                    this.interaction.followUp(MakeEmbed(0))
                    .then(async msg => {
                        CollectorHandler(msg);
                    })
                    .catch(err => {return console.log(err.stack)})
                }

                else {
                    this.interaction.deferReply();
                    await wait(1000)
                    this.interaction.editReply(MakeEmbed(0)).then(async msg => {
                        CollectorHandler(msg);
                    });
                }
            break;

            // If its default command, send the message & create a collector
            case 'DEFAULT':
                this.interaction.reply(MakeEmbed(0)).then(async msg => {
                    CollectorHandler(msg);
                });
            break;
        };

        // Collector handler function
        function CollectorHandler(msg){
            const collector = msg.createMessageComponentCollector({ filter, componentType: 'BUTTON', time: 1000 * 60 * 5 });
            let msgCollector = msg.channel.createMessageCollector({filter, time: 1000 * 60 * 5});

            collector.on('collect',async b => {
                if(b.customId === 'NextPageModLog'){
                    // Increase the value by 5
                    currentIndex += 2
                    await b.update(MakeEmbed(currentIndex)).catch(err => {return console.log(err.stack)})
                }

                if(b.customId === "PreviousPageModLog"){
                    // Decrease the value by 5
                    currentIndex -= 2
                    await b.update(MakeEmbed(currentIndex)).catch(err => {return console.log(err.stack)})
                }
            });

            // When collector ends, disable the buttons
            collector.on("end", async() =>{
                // When the collector ends
                row.components[0].setDisabled(true);
                row.components[1].setDisabled(true);
                await msg.edit({components: [row]}).catch(err => {return console.log(err.stack)});
            });
        }
    }

    // Handle the errors
    sendErrorData(embed){
        if(this.interaction.deferred == true){
            this.interaction.followUp({embeds: [embed], ephemeral: true, allowedMentions: [{repliedUser: false}]})
            .catch(err => {return console.log(err.stack)})
        }else {
            this.interaction.reply({embeds: [embed], ephemeral: true, allowedMentions: [{repliedUser: false}]})
            .catch(err => {return console.log(err.stack)})
        }
    }
}

module.exports.run = {
    LogResolver,
    run: async(client, interaction, args,prefix) =>{
        const {options} = interaction;
        let user = options.getUser('user');

        // Calling the log resolver class for slash command
        new LogResolver(client, interaction.guild, interaction).FindMember(user.id);
    }
}

module.exports.slash = {
    data: new SlashCommandBuilder()
        .setName('logs')
        .setDescription('Check moderation logs of a user')
        .addUserOption(option => 
            option.setName('user')
                .setDescription('The user you want to check logs')
                .setRequired(true)
            ),
    Permissions: ["MODERATE_MEMBERS"],
    category: "Moderation",
}