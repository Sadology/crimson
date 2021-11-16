const { SlashCommandBuilder } = require('@discordjs/builders');
const wait = require('util').promisify(setTimeout);
const Discord = require('discord.js');
const { Profiles } = require('../../models');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('profile')
        .setDescription('Give your friends some sweet cookies 🍪')
        .addUserOption(option => 
            option.setName('member')
            .setDescription('check another users profile.')),
    run: async(client, interaction) =>{
    try {
        const { options } = interaction;
        const member = options.getUser('member');

        function profileCreate(data, Member) {
            if(!data) return
            let cookiesAmount;
            if(!data.Cookies){
                cookiesAmount = 0
            }else [
                cookiesAmount = data.Cookies
            ]

            const Embed = new Discord.MessageEmbed()
                .setDescription(`**Cookies:** ${cookiesAmount}`)
                .setColor("WHITE")
                .setAuthor(`${Member ? Member.user.tag : interaction.user.tag}`)

            return interaction.reply({embeds: [
                Embed
            ]})
        }
        async function fetchData(member) {
            let Member;
            if(member){
                Member = interaction.guild.members.cache.get(member.id)
            }
            
            if(member && !Member){
                return interaction.reply({embeds: [
                    new Discord.MessageEmbed()
                        .setDescription(`Couldn't find the member`)
                        .setColor("RED")
                ], ephemeral: true})
            }
            await Profiles.findOne({
                userID: Member ? Member.user.id : interaction.user.id
            }).then(async(res) => {
                if(res){
                    return profileCreate(res, Member)
                }else if(!res){
                    if(!Member){
                        await Profiles.findOneAndUpdate({
                            userID: interaction.user.id
                        }, {
                            guildID: interaction.guild.id,
                            Cookies: 0
                        }, {upsert: true}).then((res) => {
                            return profileCreate(res, Member)
                        })
                    }else {
                        return interaction.reply({embeds: [
                            new Discord.MessageEmbed()
                                .setDescription(`They don't have a profile yet :(`)
                                .setColor("RED")
                        ], ephemeral: true})
                    }
                }
            }).catch(err => {
                return console.log(err)
            })
        }
        fetchData(member)
    }catch(err) {
        return console.log(err)
    }
    }
}