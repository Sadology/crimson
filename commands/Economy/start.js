// const discord = require('discord.js');
// const { Guild, Profiles } = require('../../models');
// const { MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js')
// module.exports = {
//     name: 'start',
//     run: async(client, message, args, prefix) =>{
//         let mainEmbed = new discord.MessageEmbed()
//             .setAuthor(message.author.tag, message.author.displayAvatarURL({dunamic: true, type: 'png'}))
//             .setDescription(`Hey welcome to sad economy. So if you wanna start this **sad** economy system, smash that start button.`)
//             .setColor("WHITE")

//         let startButton = new MessageActionRow()
//             .addComponents(
//                 new MessageButton()
//                     .setCustomId("economyStart")
//                     .setLabel("START")
//                     .setStyle("PRIMARY")   
//                 )
//         let Jobs = new MessageActionRow()
//             .addComponents(
//                 new MessageSelectMenu()
//                     .setCustomId("JobSelector")
//                     .setPlaceholder("Select your job")
//                     .addOptions(
//                         {
//                             label: 'Workshop worker',
//                             description: 'Minimum wage - 10',
//                             value: 'jobTagOn',
//                         },
//                         {
//                             label: 'Bookshop worker',
//                             description: 'Minimum wage - 10',
//                             value: 'jobTagTw',
//                         },
//                         {
//                             label: 'Discord bot dev',
//                             description: 'Minimum wage - 20',
//                             value: 'jobTagThr',
//                         },
//                     )
//                 )
//         message.channel.send({embeds: [mainEmbed], components: [startButton]}).then((msg) => {
//             let collector = msg.createMessageComponentCollector({ time: 1000 * 60 * 10 });
//             collector.on('collect', (b) => {
//                 if(b.user.id !== message.author.id) return

//                 if(b.customId === 'economyStart'){
//                     collector.stop()

//                     b.update({embeds: [
//                         new discord.MessageEmbed()
//                             .setDescription("Good jobe. Now select your job\n\nWorkshop worker - minimum wage: 10\nBookshop worker - minimum wage: 12\nDiscord bot dev - minimum wage: 20")
//                             .setColor("WHITE")
//                     ], components: []})
//                     .then(() => {
//                         jobCollector(msg)
//                     })
//                 }
//             })
//         })

//         function jobCollector(msg){
//             msg.edit({components: [Jobs]})
//         }
//     }
// }