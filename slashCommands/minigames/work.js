// const { SlashCommandBuilder } = require('@discordjs/builders');
// const { Jobs } = require('../../localDb/index');
// const { MessageEmbed } = require('discord.js')

// module.exports = {
//     data: new SlashCommandBuilder()
//         .setName('work')
//         .setDescription('work to earn money'),
//     run: async(client, interaction) =>{
//         let j = Jobs.find(j => j.job == 'raddit moderator')

//         console.log(Math.random())
//         const chance = Math.random() < 0.5
//         if(chance){
//             return interaction.reply({
//                 embeds: [
//                     new MessageEmbed()
//                         .setAuthor("Job: "+j.job)
//                         .setDescription(`You earned ${j.wages} from admin you fat piece of shi... :pogChamp:`)
//                         .setColor("GREEN")
//                 ]
//             })
//         }else {
//             return interaction.reply({
//                 embeds: [
//                     new MessageEmbed()
//                         .setAuthor("Job: "+j.job)
//                         .setDescription("Your admin didn't paid you this month 😔")
//                         .setColor("RED")
//                 ]
//             })
//         }
//     }
// }