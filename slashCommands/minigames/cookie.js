const { SlashCommandBuilder } = require('@discordjs/builders');
const wait = require('util').promisify(setTimeout);
const Discord = require('discord.js');
const { Profiles } = require('../../models');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('cookie')
        .setDescription('Give your friends some sweet cookies 🍪')
        .addUserOption(option => 
            option.setName('member')
            .setRequired(true)
            .setDescription('your friend you want to give cookies')),
    permission: ["SEND_MESSAGES"],
    run: async(client, interaction) =>{
        const { options } = interaction;

        const member = options.getUser('member');
        if(!member) return

        async function saveToDataBase() {
            if(member.id == interaction.user.id) {
                return interaction.reply({embeds: [
                    new Discord.MessageEmbed()
                        .setDescription(`You can't give yourself cookies. Maybe ping your friends next time`)
                        .setColor('WHITE')
                ], ephemeral: true})
            }
            let Member = interaction.guild.members.cache.get(member.id)
            await Profiles.findOneAndUpdate({
                userID: member.id
            }, {
                guildID: interaction.guild.id,
                $inc: {
                    Cookies: 1
                }
            }, { upsert: true }).then(() => {
                return interaction.reply({embeds: [
                    new Discord.MessageEmbed()
                        .setDescription(`You gave ${Member.user ? Member.user : member.id} a cookie 🍪`)
                        .setColor('WHITE')
                ]})
            }).catch(err => {
                return console.log(err)
            })
        }

        saveToDataBase()
    }
}