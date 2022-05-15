// const { SlashCommandBuilder } = require('@discordjs/builders');
// const Discord = require('discord.js');
// const wait = require('util').promisify(setTimeout);
// let PlayerMap = new Map();

// module.exports = {
//     data: new SlashCommandBuilder()
//         .setName('battleship')
//         .setDescription('Popular battleship game')
//         .addUserOption(option => 
//             option
//             .setName('user')
//             .setDescription("Your opponent")
//             .setRequired(true)),
//     permissions: ["USE_APPLICATION_COMMANDS"],
//     botPermission: ["SEND_MESSAGES"],
//     category: "Slash",
//     run: async(client, interaction) =>{
//         const { options } = interaction;
//         let mid = options.getUser('user');
//         let member = interaction.guild.members.resolve(mid.id);
//         if(member.user.bot){
//             return interaction.reply("You can't play with bots. Please mention a valid member.")
//         }
//         if(member.user.id == interaction.user.id){
//             return interaction.reply("You can't play with yourself. Please mention a valid member.")
//         }

//         if(!PlayerMap.has(interaction.guild.id)){
//             PlayerMap.set(interaction.guild.id, new Discord.Collection())

//             sessionCreate();
//         }else {
//             sessionCreate();
//         }

//         function sessionCreate(){
//             let guildmap = PlayerMap.get(interaction.guild.id)
//             if(guildmap.has(interaction.user.id)){
//                 return interaction.reply({embeds: [new Discord.MessageEmbed()
//                     .setDescription(`You're already in a game. Please finish it first to join another`)
//                     .setColor("RED")
//                 ]});
//             }
//             let sessionData = {
//                 score: 0,
//                 tileleft: 10,
//                 cancel: false
//             }
//             guildmap.set(interaction.user.id, sessionData);

//             if(guildmap.has(member.user.id)){
//                 return interaction.reply({embeds: [new Discord.MessageEmbed()
//                     .setDescription(`Your opponent is already in a match. Please be patient until they finish their match`)
//                     .setColor("RED")
//                 ]});
//             };
//             guildmap.set(member.id, sessionData);
//         }

//         interaction.deferReply()
//         await wait(1000)

//         interaction.editReply({content: `${member.user} you've been invited to play a battleship match by ${interaction.user.tag}`, embeds: [new Discord.MessageEmbed()
//             .setAuthor({name: "Battle ship arena"})
//             .setDescription(`🚢 ${interaction.user} Vs ${member.user} \n\n**HOW TO PLAY**\nEach player receives 10 ship & 10 bombs. Your objective is to sink your opponents ship. Each player gets upto 10 bomb press to find ship and sink the ship. Player with most hit wins the game.\n`)
//             .setFooter({text: "Each game last for 5 minutes"})
//             .setColor("WHITE")
//         ]}).then( i => {
//             tableMaking(interaction)
//             tableMaking(member)
//         })

//         async function tableMaking(int){
//             let haveIt = [];

//             function generateUniqueRandom(maxNr) {
//                 let random = (Math.random() * maxNr).toFixed();
//                 random = Number(random);
            
//                 if(!haveIt.includes(random)) {
//                     haveIt.push(random);
//                     return random;
//                 } else {
//                     if(haveIt.length < maxNr) {
//                         return generateUniqueRandom(maxNr);
//                     } else {
//                         return false;
//                     }
//                 }
//             }
            
//             for (let i=0; i<10;i++){
//                 generateUniqueRandom(25)
//             }

//             // SHIP ROW 1
//             const row1 = new Discord.MessageActionRow()
//             .addComponents(
//                 new Discord.MessageButton()
//                     .setCustomId('ship1')
//                     .setLabel("X")
//                     .setStyle('PRIMARY')
//             )
//             .addComponents(
//                 new Discord.MessageButton()
//                     .setCustomId('ship2')
//                     .setLabel("X")
//                     .setStyle('PRIMARY')
//             )
//             .addComponents(
//                 new Discord.MessageButton()
//                     .setCustomId('ship3')
//                     .setLabel("X")
//                     .setStyle('PRIMARY')
//             )
//             .addComponents(
//                 new Discord.MessageButton()
//                     .setCustomId('ship4')
//                     .setLabel("X")
//                     .setStyle('PRIMARY')
//             )
//             .addComponents(
//                 new Discord.MessageButton()
//                     .setCustomId('ship5')
//                     .setLabel("X")
//                     .setStyle('PRIMARY')
//             )
//             // SHIP ROW 2
//             const row2 = new Discord.MessageActionRow()
//             .addComponents(
//                 new Discord.MessageButton()
//                     .setCustomId('ship6')
//                     .setLabel("X")
//                     .setStyle('PRIMARY')
//             )
//             .addComponents(
//                 new Discord.MessageButton()
//                     .setCustomId('ship7')
//                     .setLabel("X")
//                     .setStyle('PRIMARY')
//             )
//             .addComponents(
//                 new Discord.MessageButton()
//                     .setCustomId('ship8')
//                     .setLabel("X")
//                     .setStyle('PRIMARY')
//             )
//             .addComponents(
//                 new Discord.MessageButton()
//                     .setCustomId('ship9')
//                     .setLabel("X")
//                     .setStyle('PRIMARY')
//             )
//             .addComponents(
//                 new Discord.MessageButton()
//                     .setCustomId('ship10')
//                     .setLabel("X")
//                     .setStyle('PRIMARY')
//             )
//             // SHIP ROW 3
//             const row3 = new Discord.MessageActionRow()
//             .addComponents(
//                 new Discord.MessageButton()
//                     .setCustomId('ship11')
//                     .setLabel("X")
//                     .setStyle('PRIMARY')
//             )
//             .addComponents(
//                 new Discord.MessageButton()
//                     .setCustomId('ship12')
//                     .setLabel("X")
//                     .setStyle('PRIMARY')
//             )
//             .addComponents(
//                 new Discord.MessageButton()
//                     .setCustomId('ship13')
//                     .setLabel("X")
//                     .setStyle('PRIMARY')
//             )
//             .addComponents(
//                 new Discord.MessageButton()
//                     .setCustomId('ship14')
//                     .setLabel("X")
//                     .setStyle('PRIMARY')
//             )
//             .addComponents(
//                 new Discord.MessageButton()
//                     .setCustomId('ship15')
//                     .setLabel("X")
//                     .setStyle('PRIMARY')
//             )

//             // SHIP ROW 4
//             const row4 = new Discord.MessageActionRow()
//             .addComponents(
//                 new Discord.MessageButton()
//                     .setCustomId('ship16')
//                     .setLabel("X")
//                     .setStyle('PRIMARY')
//             )
//             .addComponents(
//                 new Discord.MessageButton()
//                     .setCustomId('ship17')
//                     .setLabel("X")
//                     .setStyle('PRIMARY')
//             )
//             .addComponents(
//                 new Discord.MessageButton()
//                     .setCustomId('ship18')
//                     .setLabel("X")
//                     .setStyle('PRIMARY')
//             )
//             .addComponents(
//                 new Discord.MessageButton()
//                     .setCustomId('ship19')
//                     .setLabel("X")
//                     .setStyle('PRIMARY')
//             )
//             .addComponents(
//                 new Discord.MessageButton()
//                     .setCustomId('ship20')
//                     .setLabel("X")
//                     .setStyle('PRIMARY')
//             )

//             // SHIP ROW 5
//             const row5 = new Discord.MessageActionRow()
//             .addComponents(
//                 new Discord.MessageButton()
//                     .setCustomId('ship21')
//                     .setLabel("X")
//                     .setStyle('PRIMARY')
//             )
//             .addComponents(
//                 new Discord.MessageButton()
//                     .setCustomId('ship22')
//                     .setLabel("X")
//                     .setStyle('PRIMARY')
//             )
//             .addComponents(
//                 new Discord.MessageButton()
//                     .setCustomId('ship23')
//                     .setLabel("X")
//                     .setStyle('PRIMARY')
//             )
//             .addComponents(
//                 new Discord.MessageButton()
//                     .setCustomId('ship24')
//                     .setLabel("X")
//                     .setStyle('PRIMARY')
//             )
//             .addComponents(
//                 new Discord.MessageButton()
//                     .setCustomId('ship25')
//                     .setLabel("X")
//                     .setStyle('PRIMARY')
//             )

//             let filter = m => m.user.id == int.user.id;

//             interaction.followUp({embeds: [new Discord.MessageEmbed()
//                 .setAuthor({name: "Battleship table", icon: int.user.displayAvatarURL({format: 'png'})})
//                 .setDescription(`${int.user}'s table \n\n25 slots & 10 ships. Your objective is to destroy them all`)
//                 .setColor('WHITE')
//             ],components: [row1, row2, row3, row4, row5]}).then( i => {
//             let collector = i.createMessageComponentCollector({filter, time: 1000 * 60 * 5})
//             collector.on('collect',( b ) => {
//                 let shipNo = b.customId.slice(4)
//                 let shipnum = parseInt(shipNo)

//                 let guildmap = PlayerMap.get(interaction.guild.id)
//                 let playerData = guildmap.get(int.user.id)

//                 let match = haveIt.find(n => n == shipnum)
//                 playerData['tileleft'] -= 1
                
//                 if(match){
//                     playerData['score'] += 1
//                 }

//                 if(playerData['tileleft'] < 1){
//                     b.deleteReply();
//                 }

//                 let newNum;
//                 if(shipnum > 0 && shipnum < 6){
//                     newNum = shipnum - 1

//                     if(match){
//                         row1.components[newNum].setLabel("Hit")
//                         row1.components[newNum].setStyle('SUCCESS')
//                     }else {
//                         row1.components[newNum].setLabel('Miss')
//                         row1.components[newNum].setStyle('DANGER')
//                     }
//                     row1.components[newNum].setDisabled(true)
//                     b.update({embeds: [new Discord.MessageEmbed()
//                         .setAuthor({name: "Battleship table", icon: int.user.displayAvatarURL({format: 'png'})})
//                         .setDescription(`${int.user}'s table \n**SCORE:** ${playerData['score']}\n**Bombs left:** ${playerData['tileleft']}`)
//                         .setColor('WHITE')
//                     ], components: [row1, row2, row3, row4, row5]})
//                 }else if(shipnum > 5 && shipnum < 11){
//                     newNum = shipnum - 5 - 1

//                     if(match){
//                         row2.components[newNum].setLabel("Hit")
//                         row2.components[newNum].setStyle('SUCCESS')
//                     }else {
//                         row2.components[newNum].setLabel('Miss')
//                         row2.components[newNum].setStyle('DANGER')
//                     }

//                     row2.components[newNum].setDisabled(true)
//                     b.update({embeds: [new Discord.MessageEmbed()
//                         .setAuthor({name: "Battleship table", icon: int.user.displayAvatarURL({format: 'png'})})
//                         .setDescription(`${int.user}'s table \n**SCORE** ${playerData['score']}\n**Bombs left:** ${playerData['tileleft']}`)
//                         .setColor('WHITE')
//                     ], components: [row1, row2, row3, row4, row5]})
//                 }else if(shipnum > 10 && shipnum < 16){
//                     newNum = shipnum - 10 - 1

//                     if(match){
//                         row3.components[newNum].setLabel("Hit")
//                         row3.components[newNum].setStyle('SUCCESS')
//                     }else {
//                         row3.components[newNum].setLabel('Miss')
//                         row3.components[newNum].setStyle('DANGER')
//                     }

//                     row3.components[newNum].setDisabled(true)
//                     b.update({embeds: [new Discord.MessageEmbed()
//                         .setAuthor({name: "Battleship table", icon: int.user.displayAvatarURL({format: 'png'})})
//                         .setDescription(`${int.user}'s table \n**SCORE** ${playerData['score']}\n**Bombs left:** ${playerData['tileleft']}`)
//                         .setColor('WHITE')
//                     ], components: [row1, row2, row3, row4, row5]})
//                 }else if(shipnum > 15 && shipnum < 21){
//                     newNum = shipnum - 15 - 1

//                     if(match){
//                         row4.components[newNum].setLabel("Hit")
//                         row4.components[newNum].setStyle('SUCCESS')
//                     }else {
//                         row4.components[newNum].setLabel('Miss')
//                         row4.components[newNum].setStyle('DANGER')
//                     }

//                     row4.components[newNum].setDisabled(true)
//                     b.update({embeds: [new Discord.MessageEmbed()
//                         .setAuthor({name: "Battleship table", icon: int.user.displayAvatarURL({format: 'png'})})
//                         .setDescription(`${int.user}'s table \n**SCORE** ${playerData['score']}\n**Bombs left:** ${playerData['tileleft']}`)
//                         .setColor('WHITE')
//                     ], components: [row1, row2, row3, row4, row5]})
//                 }else if(shipnum > 20 && shipnum < 26){
//                     newNum = shipnum - 20 - 1

//                     if(match){
//                         row5.components[newNum].setLabel("Hit")
//                         row5.components[newNum].setStyle('SUCCESS')
//                     }else {
//                         row5.components[newNum].setLabel('Miss')
//                         row5.components[newNum].setStyle('DANGER')
//                     }

//                     row5.components[newNum].setDisabled(true)
//                     b.update({embeds: [new Discord.MessageEmbed()
//                         .setAuthor({name: "Battleship table", icon: int.user.displayAvatarURL({format: 'png'})})
//                         .setDescription(`${int.user}'s table \n**SCORE** ${playerData['score']}\n**Bombs left:** ${playerData['tileleft']}`)
//                         .setColor('WHITE')
//                     ], components: [row1, row2, row3, row4, row5]})
//                 }
//             })

//             collector.on('end', (b) =>{
//                 let play1 = PlayerMap.get(interaction.user.id)
//                 let play2 = PlayerMap.get(member.user.id)
                
//                 if(!play1) return
//                 if(!play2) return
//                 if(play1['tileleft'] < 1 && play2['tileleft'] < 1){
//                     let embed = new Discord.MessageEmbed()
//                         .setAuthor({name: "Battleship table", icon: int.user.displayAvatarURL({format: 'png'})})
//                         .setColor('GREEN')
//                     if(play1['score'] > play2['score']){
//                         embed.setDescription(`${interaction.user} won 🎊 \n\n**${interaction.user.username}:** ${play1['score']}\n**${member.user.username}:** ${play2['score']}`)
//                     }else if(play2['score'] > play1['score']){
//                         embed.setDescription(`${member.user} won 🎉\n\n**${member.user.username}:** ${play2['score']}\n**${interaction.user.username}:** ${play1['score']}`)
//                     }else if(play2['score'] == play1['score']){
//                         embed.setDescription(`Its a draw 😐\n**${member.user.username}:** ${play2['score']}\n**${interaction.user.username}:** ${play1['score']}`)
//                         embed.setColor("YELLOW")
//                     }
//                     interaction.editReply({content: "GG",embeds: [embed]});

//                     PlayerMap.delete(member.user.id)
//                     PlayerMap.delete(interaction.user.id)
//                 }
//             })
//         })
//         }
//     }
// }