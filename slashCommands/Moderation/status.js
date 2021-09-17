const { SlashCommandBuilder } = require('@discordjs/builders');
const wait = require('util').promisify(setTimeout);
const Discord = require('discord.js');
const { ModStats, GuildRole } = require('../../models')
const moment = require('moment');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('status')
        .setDescription('Set a custom status message that shows on mention')
        .addStringOption(option => option.setName("message").setDescription("Custom message will show when someone pings you")),
    permission: ["MANAGE_MESSAGES"],
    run: async(client, interaction) =>{

        interaction.deferReply({ephermal: true})
        await new Promise(resolve => setTimeout(resolve, 1000))

        const { options } = interaction;
        let Reason = options.getString('message');

        //const Reason = content.split(/\s+/).slice(1).join(" "); // Message taht will show in status
        const Time = new Date() // Following day date
        const Embed = new Discord.MessageEmbed(); // EMBED

        // Database Function
        async function Status (value, msg, date){
            await ModStats.findOneAndUpdate({
                guildID: interaction.guild.id, 
                userID: interaction.user.id
            }, {
                userName: interaction.user.tag,
                Status: {
                    Active: value,
                    MSG: msg,
                    Time: date
                }
            }, {
                upsert: true
            })
        };

        const errorEmbed = new Discord.MessageEmbed()
        .setAuthor(`${interaction.user.tag} - Status`)
        .setDescription("Show a custom message when pinged")
        .addFields(
            {
                name: 'Usage', value: `/status [ Your custom message ]`,
            },
            {
                name: 'Example', value: `/status Busy right now. Ping another mod.`
            }
        )
        .setFooter("Require `Moderator` permission to use")
        .setColor("#fffafa")

        const Database = await ModStats.findOne({
            guildID: interaction.guild.id,
            userID: interaction.user.id,
        });

        if(Reason === null){
            if(Database){
                if(!Database.Status){
                    await ModStats.findOneAndUpdate({
                        guildID: interaction.guild.id, 
                        userID: interaction.user.id
                    }, {
                        userName: interaction.user.tag,
                        Status: {
                            Active: false,
                            MSG: null,
                            Time: Time
                        }
                    }, {
                        upsert: true
                    })
                }
                if(Database.Status.Active === true){
                    Status(false, Reason ? Reason : null, Time)

                    Embed.setAuthor(`${interaction.user.tag}`, interaction.user.displayAvatarURL({
                        dynamic: true , type: 'png'}))
                    Embed.setDescription('> Status has been removed')
                    moment(Embed.setTimestamp()).format("LL")
                    Embed.setColor("#fffafa")

                    await interaction.editReply({embeds: [Embed]})
                }else if(Database.Status.Active === false){
                    await interaction.editReply({embeds: [errorEmbed], ephermal: true})
                }
            }else {
                Status(false, Reason ? Reason : null, Time)

                await interaction.editReply({embeds: [errorEmbed], ephermal: true})
            }
        }else if(Reason !== null){
            if(Database){
                if(!Database.Status){
                    await ModStats.findOneAndUpdate({
                        guildID: interaction.guild.id, 
                        userID: interaction.user.id
                    }, {
                        userName: interaction.user.tag,
                        Status: {
                            Active: false,
                            MSG: null,
                            Time: Time
                        }
                    }, {
                        upsert: true
                    })
                }
                if(Database.Status.Active === true){
                    Status(false, Reason ? Reason : null, Time)

                    Embed.setAuthor(`${interaction.user.tag}`, interaction.user.displayAvatarURL({
                        dynamic: true , type: 'png'}))
                    Embed.setDescription('> Status has been removed')
                    moment(Embed.setTimestamp()).format("LL")
                    Embed.setColor("#fffafa")

                    await interaction.editReply({embeds: [Embed]})
                }else if(Database.Status.Active === false){
                    Status(true, Reason ? Reason : null, Time)

                    Embed.setAuthor(`${interaction.user.tag}`, interaction.user.displayAvatarURL({
                        dynamic: true , type: 'png'}))
                        Embed.setDescription(`> ${Reason}`)
                        moment(Embed.setTimestamp()).format("LL")
                        Embed.setColor("#fffafa")

                    await interaction.editReply({embeds: [Embed]})
                }
            }else {
                Status(true, Reason ? Reason : null, Time)

                Embed.setAuthor(`${interaction.user.tag}`, interaction.user.displayAvatarURL({
                    dynamic: true , type: 'png'}))
                    Embed.setDescription(`> ${Reason}`)
                    moment(Embed.setTimestamp()).format("LL")
                    Embed.setColor("#fffafa")

                await interaction.editReply({embeds: [Embed]})
            }
        }
    }
}