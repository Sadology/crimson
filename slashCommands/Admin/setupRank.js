// const { SlashCommandBuilder, roleMention } = require('@discordjs/builders');
// const wait = require('util').promisify(setTimeout);
// const Discord = require('discord.js');
// const { Guild, RankData } = require('../../models');
// const { MessageActionRow, MessageButton, MessageEmbed, MessageSelectMenu } = require('discord.js')
// const ms = require('ms');

// const row = new MessageActionRow()
// .addComponents(
//     new MessageSelectMenu()
//     .setCustomId("ranksetting")
//     .setPlaceholder('Select an option to change the setting')
//     .addOptions([
//         {
//             label: "Minimum exp",
//             description: "Minimum amout of exp members will receive per message",
//             value: 'minexp'
//         },
//         {
//             label: "Maximum exp",
//             description: "Maximum amout of exp members will receive per message",
//             value: 'maxexp'
//         },
//         {
//             label: "Levelup channel",
//             description: "Where the level up message will be sent",
//             value: 'channel'
//         },
//         {
//             label: "Levelup message",
//             description: "Bot will ping member with a message when they level up",
//             value: 'lvlupmsg'
//         },
//         {
//             label: "Cooldown",
//             description: "Cooldown between each message to receive exp",
//             value: 'cooldown'
//         },
//         {
//             label: "Exp multiply",
//             description: "Multiply the exp amount member will receive",
//             value: 'multiply'
//         },
//         {
//             label: "No-exp role",
//             description: "Role that will not receive any exp",
//             value: 'noexprole'
//         },
//         {
//             label: "No-exp channel",
//             description: "Channel(s) where members won't receive any exp",
//             value: 'noexpchannel'
//         },
//         {
//             label: "Rank card",
//             description: "Server default rank card",
//             value: 'rankcard'
//         },
//         {
//             label: "Stack rewards",
//             description: "When member level up bot will keep or remove the previous rewards.",
//             value: 'stack'
//         }
//     ])
// )

// const cancelRow = new MessageActionRow()
// .setComponents(
//     new MessageButton()
//     .setCustomId('cancelbutton')
//     .setStyle("DANGER")
//     .setLabel("Cancel")
// )
// const stackRow = new MessageActionRow()
// .setComponents(
//     new MessageButton()
//     .setCustomId('stackyes')
//     .setStyle("SUCCESS")
//     .setLabel("Yes")
// )
// .setComponents(
//     new MessageButton()
//     .setCustomId('stackno')
//     .setStyle("DANGER")
//     .setLabel("No")
// )

// class RankCreate{
//     constructor(Interaction, Client){
//         this.interaction = Interaction;
//         this.client = Client;
//     }

//     // DEFAULT DATA
//     defaultData(){
//         this.minexp = 10
//         this.maxexp = 30
//         this.channel = null
//         this.cooldown = 60000
//         this.multiply = 1
//         this.noexprole = null
//         this.noexpchannel = null
//         this.rankcard = null
//         this.lvlupmsg = "Congrats {member} for making on to level {level}"
//         this.stack = true
//     }

//     // FETCH FROM DATABASE 
//     async FetchData(){
//         await RankData.findOne({
//             guildID: this.interaction.guild.id
//         })
//         .then(res => {
//             if(res){
//                 if(res.Settings){
//                     for(let [key, values] of res.Settings){
//                         this[key] = values
//                     }; 
//                 }
//                 this.Menu()
//             }else {
//                 this.Menu()
//             }
//         })
//         .catch(err => {
//             return console.log(err.stack)
//         })
        
//     }

//     // UPDATE DATA
//     async updateData(type, data){
//         await RankData.updateOne({
//             guildID: this.interaction.guild.id
//         } , {
//             [`Settings.${type}`]: data
//         })
//         .catch(err => {return console.log(err.stack)})
        
//         this.Menu()
//     }

//     // DATA LAKE
//     setDataLake(type, button){
//         switch(type){
//             case 'minexp':
//                 this.setMinExp(button)
//             break;
//             case 'maxexp':
//                 this.setMaxExp(button)
//             break;
//             case 'channel':
//                 this.setChannel(button)
//             break;
//             case 'lvlupmsg':
//                 this.setLvlupMsg(button)
//             break;
//             case 'cooldown':
//                 this.setCooldown(button)
//             break;
//             case 'multiply':
//                 this.setMultiply(button)
//             break;
//             case 'noexprole':
//                 this.setNoExpRole(button)
//             break;
//             case 'noexpchannel':
//                 this.setNoExpChannels(button)
//             break;
//             case 'stack':
//                 this.setStackRewards(button)
//             break;
//         }
//     }

//     // MIN EXP
//     async setMinExp(button){
//         button.deferReply();
//         await wait(1000);

//         let Embed = new MessageEmbed()
//             .setColor("RED")
//         let interfaces = new MessageEmbed()
//             .setAuthor({name: "Minimum amount"})
//             .setDescription(`
//             <:reply:897083777703084035> Default: \` 15 \`
//             Minimum amount of exp member will receive per message
//             **Must be between 1-100**`)
//             .setColor("WHITE")
//         button.followUp({embeds: [interfaces], components: [cancelRow]}).then(i => {
//             this.cancelButton(i)
//             let filter = u => u.author.id == this.interaction.user.id
//             let collector = i.channel.createMessageCollector({filter, time: 1000 * 60 * 10 });

//             collector.on('collect', (msg) => {
//                 let dataFilter = msg.content.split(/ +/g)[0]
//                 let numb = parseInt(dataFilter)
//                 if(!parseInt(dataFilter)){
//                     return i.reply({embeds: [
//                         Embed.setDescription("Minimum exp must be a number")
//                     ]}).then(m => setTimeout(() => m.delete(), 3000))
//                     .catch(err => {return console.log(err.stack)})
//                 }
                
//                 if(numb < 1 || numb > 100){
//                     return i.reply({embeds: [
//                         Embed.setDescription("Minimum exp must be between 1-100")
//                     ]}).then(m => setTimeout(() => m.delete(), 3000))
//                     .catch(err => {return console.log(err.stack)})
//                 }

//                 this.minexp = numb
//                 collector.stop()

//                 this.updateData('minexp', this.minexp)
                
//             })
//             collector.on('end', () => {
//                 i.delete().catch(err => {return console.log(err)});
//             })
//         })
//     }

//     // MAX EXP
//     async setMaxExp(button){
//         button.deferReply();
//         await wait(1000);

//         let Embed = new MessageEmbed()
//             .setColor("RED")
//         let interfaces = new MessageEmbed()
//             .setAuthor({name: "Maximum amount"})
//             .setDescription(`
//             <:reply:897083777703084035> Default: Congrats ${this.interaction.user} for making on to level 10
//             Send a custom message when a member level up
//             *Must be Less than 200 words*`)
//             .setColor("WHITE")
//         button.followUp({embeds: [interfaces], components: [cancelRow]}).then(i => {
//             this.cancelButton(i)
//             let filter = u => u.author.id == this.interaction.user.id
//             let collector = i.channel.createMessageCollector({filter, time: 1000 * 60 * 10 });
//             collector.on('collect', (msg) => {
//                 let dataFilter = msg.content.split(/ +/g)[0]
//                 let numb = parseInt(dataFilter)
//                 if(!parseInt(dataFilter)){
//                     return i.reply({embeds: [
//                         Embed.setDescription("Maximum exp must be a number")
//                     ]}).then(m => setTimeout(() => m.delete(), 3000))
//                     .catch(err => {return console.log(err.stack)})
//                 }
                
//                 if(numb < 1 || numb > 500){
//                     return i.reply({embeds: [
//                         Embed.setDescription("Maximum exp must be between 1-500")
//                     ]}).then(m => setTimeout(() => m.delete(), 3000))
//                     .catch(err => {return console.log(err.stack)})
//                 }

//                 this.maxexp = numb
//                 collector.stop()

//                 this.updateData('maxexp', this.maxexp)
                
//             })
//             collector.on('end', () => {
//                 i.delete().catch(err => {return console.log(err)});
//             })
//         })
//     }

//     // LEVEL UP CHANNEL
//     async setChannel(button){
//         button.deferReply();
//         await wait(1000);

//         let Embed = new MessageEmbed()
//             .setColor("RED")
//         let interfaces = new MessageEmbed()
//             .setAuthor({name: "Levelup announce channel"})
//             .setDescription(`
//             <:reply:897083777703084035> Default: \` current channel \`
//             Member will receive level up message on the announcement channel
//             **Please mention a channel**
//             `)
//             .setColor("WHITE")
//         button.followUp({embeds: [interfaces], components: [cancelRow]}).then(i => {
//             this.cancelButton(i)
//             let filter = u => u.author.id == this.interaction.user.id
//             let collector = i.channel.createMessageCollector({filter, time: 1000 * 60 * 10 });
//             collector.on('collect', (msg) => {
//                 let dataFilter = msg.content.split(/ +/g)[0]
//                 let chanData = dataFilter.replace('<#', '').replace('>', '')
//                 let channel = this.interaction.guild.channels.resolve(chanData)

//                 if(!channel){
//                     return i.reply({embeds: [
//                         Embed.setDescription("Please mention a valid channel")
//                     ]}).then(m => setTimeout(() => m.delete(), 3000))
//                     .catch(err => {return console.log(err.stack)})
//                 }
//                 this.channel = channel.id
//                 collector.stop()

//                 this.updateData('channel', this.channel)
                
//             })
//             collector.on('end', () => {
//                 i.delete().catch(err => {return console.log(err)});
//             })
//         })
//     }

//     // LEVELUP MESSAGE
//     async setLvlupMsg(button){
//         button.deferReply();
//         await wait(1000);

//         let Embed = new MessageEmbed()
//             .setColor("RED")
//         let interfaces = new MessageEmbed()
//             .setAuthor({name: "Levelup message"})
//             .setDescription(`
//             <:reply:897083777703084035> Default: Congrats ${this.interaction.user} for making on to level 10
//             Send a custom message when a member level up
//             *Must be Less than 200 words*`)
//             .setColor("WHITE")
//         button.followUp({embeds: [interfaces], components: [cancelRow]}).then(i => {
//             this.cancelButton(i)
//             let filter = u => u.author.id == this.interaction.user.id
//             let collector = i.channel.createMessageCollector({filter, time: 1000 * 60 * 10 });
//             collector.on('collect', (msg) => {
//                 let dataFilter = msg.content.split(/ +/g)
//                 if(dataFilter > 200){
//                     return i.reply({embeds: [
//                         Embed.setDescription("Level up message can't exceed 200 words")
//                     ]}).then(m => setTimeout(() => m.delete(), 3000))
//                     .catch(err => {return console.log(err.stack)})
//                 }

//                 this.lvlupmsg = dataFilter
//                 collector.stop()

//                 this.updateData('lvlupmsg', this.lvlupmsg)
//             })
//             collector.on('end', () => {
//                 i.delete().catch(err => {return console.log(err)});
//             })
//         })
//     }

//     // EXP COOLDOWN
//     async setCooldown(button){
//         button.deferReply();
//         await wait(1000);

//         let Embed = new MessageEmbed()
//             .setColor("RED")
//         let interfaces = new MessageEmbed()
//             .setAuthor({name: "Exp cooldown"})
//             .setDescription(`
//             <:reply:897083777703084035> Default: \` 1 minute \`
//             Cooldown between each exp rewards
//             **Must be Less than 30 minutes**`)
//             .setColor("WHITE")
//         button.followUp({embeds: [interfaces], components: [cancelRow]}).then(i => {
//             this.cancelButton(i)
//             let filter = u => u.author.id == this.interaction.user.id
//             let collector = i.channel.createMessageCollector({filter, time: 1000 * 60 * 10 });
//             collector.on('collect', (msg) => {
//                 let dataFilter = msg.content.split(/ +/g)[0]
//                 let time = ms(dataFilter)
//                 if(!time){
//                     return i.reply({embeds: [
//                         Embed.setDescription("Set a exp cooldown e.g: 10s, 20s, 5m")
//                         .setFooter({text: "Min cd - 10 seconds & Max cd - 30 minutes"})
//                     ], ephemeral: true}).then(m => setTimeout(() => m.delete(), 3000))
//                     .catch(err => {return console.log(err.stack)})
//                 }
//                 if(time < 10){
//                     return i.reply({embeds: [
//                         Embed.setDescription("Min cooldown must be greater than or equal to 10 seconds")
//                     ], ephemeral: true}).then(m => setTimeout(() => m.delete(), 3000))
//                     .catch(err => {return console.log(err.stack)})
//                 }else if(time > 1800000){
//                     return i.reply({embeds: [
//                         Embed.setDescription("Max cooldown must be smaller than or equal to 30 minutes")
//                     ], ephemeral: true}).then(m => setTimeout(() => m.delete(), 3000))
//                     .catch(err => {return console.log(err.stack)})
//                 }

//                 this.cooldown = time
//                 collector.stop()

//                 this.updateData('cooldown', this.cooldown)
//             })
//             collector.on('end', () => {
//                 i.delete().catch(err => {return console.log(err)});
//             })
//         })
//     }

//     // EXP MULTIPLIER
//     async setMultiply(button){
//         button.deferReply();
//         await wait(1000);

//         let Embed = new MessageEmbed()
//             .setColor("RED")
//         let interfaces = new MessageEmbed()
//             .setAuthor({name: "Exp Miltiplier"})
//             .setDescription(`
//             <:reply:897083777703084035> Default: \` 1x \`
//             Multiply the exp by 1x 2x or 5x
//             **Max is 5x. Can't go above**`)
//             .setColor("WHITE")
//         button.followUp({embeds: [interfaces], components: [cancelRow]}).then(i => {
//             this.cancelButton(i)
//             let filter = u => u.author.id == this.interaction.user.id
//             let collector = i.channel.createMessageCollector({filter, time: 1000 * 60 * 10 });
//             collector.on('collect', (msg) => {
//                 let dataFilter = msg.content.split(/ +/g)[0]
//                 let multi = parseInt(dataFilter)
//                 if(multi < 1){
//                     return i.reply({embeds: [
//                         Embed.setDescription("Multiplier can't go below 1x")
//                     ], ephemeral: true}).then(m => setTimeout(() => m.delete(), 3000))
//                     .catch(err => {return console.log(err.stack)}) 
//                 }
//                 if(multi > 5){
//                     return i.reply({embeds: [
//                         Embed.setDescription("Multiplier can't go above 5x")
//                     ], ephemeral: true}).then(m => setTimeout(() => m.delete(), 3000))
//                     .catch(err => {return console.log(err.stack)}) 
//                 }

//                 this.multiply = multi
//                 collector.stop()

//                 this.updateData('cooldown', this.multiply)
//             })
//             collector.on('end', () => {
//                 i.delete().catch(err => {return console.log(err)});
//             })
//         })
//     }

//     // No EXP ROLE
//     async setNoExpRole(button){
//         button.deferReply();
//         await wait(1000);

//         let Embed = new MessageEmbed()
//             .setColor("RED")
//         let interfaces = new MessageEmbed()
//             .setAuthor({name: "Exp Miltiplier"})
//             .setDescription(`
//             <:reply:897083777703084035> Default: \` noexp \`
//             Member with this role won't receive any exp
//             *Max only one role*`)
//             .setColor("WHITE")
//         button.followUp({embeds: [interfaces], components: [cancelRow]}).then(i => {
//             this.cancelButton(i)
//             let filter = u => u.author.id == this.interaction.user.id
//             let collector = i.channel.createMessageCollector({filter, time: 1000 * 60 * 10 });
//             collector.on('collect', (msg) => {
//                 let dataFilter = msg.content.split(/ +/g)[0]
//                 let roleData = dataFilter.replace('<@&', '').replace('>', '')
//                 let role = this.interaction.guild.roles.resolve(roleData)

//                 if(!role){
//                     return i.reply({embeds: [
//                         Embed.setDescription("Please mention a valid role")
//                     ]}).then(m => setTimeout(() => m.delete(), 3000))
//                     .catch(err => {return console.log(err.stack)})
//                 }
//                 this.noexprole = role.id
//                 collector.stop()

//                 this.updateData('noexprole', this.noexprole)
//             })
//             collector.on('end', () => {
//                 i.delete().catch(err => {return console.log(err)});
//             })
//         })
//     }

//     // NO EXP CHANNELS
//     async setNoExpChannels(button){
//         button.deferReply();
//         await wait(1000);

//         let interfaces = new MessageEmbed()
//             .setAuthor({name: "No-exp channel"})
//             .setDescription(`Please set this by \`/set-channel\` slash command`)
//             .setColor("WHITE")
//         button.followUp({embeds: [interfaces]})
//     }

//     // SET STACK REWARDS
//     async setStackRewards(button){
//         button.deferReply();
//         await wait(1000);

//         let interfaces = new MessageEmbed()
//             .setAuthor({name: "Stack rewards"})
//             .setDescription(`Do you want to stack previos rewards on level up or remove the previous rewards? (yes/no)`)
//             .setColor("WHITE")
//         button.followUp({embeds: [interfaces], components: [stackRow]}).then(i => {
//             let collector = i.createMessageComponentCollector({time: 1000 * 60 * 10 });
//             collector.on('collect', (b) => {
//                 if(b.customId == 'stackyes'){
//                     if(b.user.id !== this.interaction.user.id) return
//                     this.stack = true

//                     this.updateData('stack', this.stack)
//                     collector.stop()
//                 }

//                 else if(b.customId == 'stackno'){
//                     if(b.user.id !== this.interaction.user.id) return
//                     this.stack = false

//                     this.updateData('stack', this.stack)
//                     collector.stop()
//                 }
//             })
//             collector.on('end', () => {
//                 i.delete().catch(err => {return console.log(err)})
//             })
//         })
//     }

//     cancelButton(button){
//         let collector = button.createMessageComponentCollector({time: 1000 * 60 * 10 });
//         collector.on('collect', (b) => {
//             if(b.customId == 'cancelbutton'){
//                 if(b.user.id !== this.interaction.user.id) return
//                 collector.stop()
//             }
//             if(!button){
//                 collector.stop()
//             }
//         })
//         collector.on('end', () => {
//             if(!button) return
//             button.delete().catch(err => {return console.log(err)})
//         })
//     }

//     updateRankData(){
//         if(this.noexpchannel !== null){
//             let arr = []
//             this.noexpchannel.forEach(d => {
//                 let chans = this.interaction.guild.channels.cache.resolve(d)
//                 if(chans){
//                     arr.push(chans.toString()) 
//                 }
//             })
//             this.noexpchannel = arr
//         }

//         if(this.channel !== null){
//             let chans = this.interaction.guild.channels.resolve(this.channel)
//             if(chans){
//                 this.channel = chans.toString()
//             }
//         }

//         if(this.noexprole !== null){
//             let roles = this.interaction.guild.channels.cache.resolve(this.noexprole)
//             if(roles){
//                 this.noexprole = roles.toString()
//             }
//         }
//     }

//     async Menu(){
//         this.updateRankData()
//         let MenuEmbed = new MessageEmbed()
//             .setDescription("Server rank settings")
//             .addField("Min-exp", `${this.minexp}`, true)
//             .addField("Max-exp", `${this.maxexp}`, true)
//             .addField("Cooldown", `${ms(this.cooldown, {long: true})}`, true)
//             .addField("Lvlup-channel", `${this.channel == null ? "current channe" : this.channel}`, true)
//             .addField("Muliplier", `${this.multiply}`, true)
//             .addField("No-exp role", `${this.noexprole == null ? "noexp" : this.noexprole}`, true)
//             .addField("Rank-card", `${this.rankcard == null ? "Sadbot default": `[URL](${this.rankcard})`}`, true)
//             .addField("No-exp channels", `${this.noexpchannel == null ? "None" : this.noexprole}`, true)
//             .setColor("WHITE")

//         if(!this.interaction.deferred){
//             this.interaction.deferReply()
//             await wait(1000)
//         }

//         this.interaction.editReply({embeds: [MenuEmbed], components: [row]}).then(i => {
//             let collector = i.createMessageComponentCollector({time: 1000 * 10});
//             collector.on('collect', (b) => {
//                 if(b.customId == 'ranksetting'){
//                     this.setDataLake(b.values.join(" "), b)
//                 }
//             })
//         })
//     }
// }
// module.exports = {
//     data: new SlashCommandBuilder()
//         .setName('setup-rank')
//         .setDescription('Setup ranks on your server.'),
//     permissions: ["ADMINISTRATOR", "MANAGE_GUILD"],
//     botPermission: ["SEND_MESSAGES"],
//     category: "Slash",
//     run: async(client, interaction) =>{
//         const { options } = interaction;

//         let rankSettings = new RankCreate(interaction, client)
//         rankSettings.defaultData()
//         rankSettings.FetchData()
//         return























//         // interaction.deferReply()
//         // await new Promise(resolve => setTimeout(resolve, 1000))

//         // class RankManager{
//         //     constructor(interaction){
//         //         this.interaction = interaction;
//         //     }

//         //     async saveData(option, data){
//         //         await Guild.findOneAndUpdate({
//         //             guildID: this.interaction.guild.id
//         //         }, {
//         //             [`Modules.ranks.Enabled`]: true,
//         //             [`RankSettings.${option}`]: data
//         //         }).then(() => {
//         //             return true
//         //         })
//         //         .catch(err => {return console.log(err.stack)})
//         //     }

//         //     async setChannel(data){
//         //         let dataFilter = data.split(/s+/g)[0]
//         //         let chanData = dataFilter.replace('<#', '').replace('>', '')
//         //         let channel = this.interaction.guild.channels.resolve(chanData)

//         //         if(channel){
//         //             this.saveData("Channel",channel.id)
//         //             return true
//         //         }else {
//         //             this.interaction.followUp({embeds: [
//         //                 new Discord.MessageEmbed()
//         //                     .setDescription("Please mention a valid channel")
//         //                     .setColor("RED")
//         //             ], ephemeral: true}).catch(err => {return console.log(err.stack)})
//         //         }
//         //     }

//         //     async setMinExp(data){
//         //         let dataFilter = data.split(/s+/g)[0]
//         //         if(!parseInt(dataFilter)){
//         //             this.interaction.followUp({embeds: [
//         //                 new Discord.MessageEmbed()
//         //                     .setDescription("Min-Exp must be a number | 1 - 50")
//         //                     .setFooter("Must be smaller than 50 and greater than 1")
//         //                     .setColor("RED")
//         //             ], ephemeral: true})
//         //             .catch(err => {return console.log(err.stack)})
//         //         }else {
//         //             let number = parseInt(dataFilter)
//         //             if(number >= 51){
//         //                 this.interaction.followUp({embeds: [
//         //                     new Discord.MessageEmbed()
//         //                         .setDescription("Max-Exp must be smaller than or equal to 50 | 1 - 50")
//         //                         .setColor("RED")
//         //                 ], ephemeral: true}).catch(err => {return console.log(err.stack)})
//         //             }else if(number < 1){
//         //                 this.interaction.followUp({embeds: [
//         //                     new Discord.MessageEmbed()
//         //                         .setDescription("Min-Exp must be greater than or equal to 1 | 1 - 50")
//         //                         .setColor("RED")
//         //                 ], ephemeral: true}).catch(err => {return console.log(err.stack)})
//         //             }else {
//         //                 this.saveData("MinExp",number)
//         //                 return true
//         //             }
//         //         }
//         //     }

//         //     async setMaxExp(data){
//         //         let dataFilter = data.split(/s+/g)[0]
//         //         if(!parseInt(dataFilter)){
//         //             this.interaction.followUp({embeds: [
//         //                 new Discord.MessageEmbed()
//         //                     .setDescription("Max-Exp must be a number | 50-200")
//         //                     .setFooter("Must be smaller than 200 and greater than 50")
//         //                     .setColor("RED")
//         //             ], ephemeral: true}).catch(err => {return console.log(err.stack)})
//         //         }else {
//         //             let number = parseInt(dataFilter)
//         //             if(number >= 201){
//         //                 this.interaction.followUp({embeds: [
//         //                     new Discord.MessageEmbed()
//         //                         .setDescription("Max-Exp must be smaller than or equal to 200 | 50-200")
//         //                         .setColor("RED")
//         //                 ], ephemeral: true}).catch(err => {return console.log(err.stack)})
//         //             }else if(number < 50){
//         //                 this.interaction.followUp({embeds: [
//         //                     new Discord.MessageEmbed()
//         //                         .setDescription("Max-Exp must be greater than or equal to 50 | 50-200")
//         //                         .setColor("RED")
//         //                 ], ephemeral: true}).catch(err => {return console.log(err.stack)})
//         //             }else {
//         //                 this.saveData("MaxExp",number)
//         //                 return true
//         //             }
//         //         }
//         //     }
//         //     async setCooldown(data){
//         //         let dataFilter = data.split(/s+/g)[0]
//         //         let time = ms(dataFilter)
//         //         if(!time){
//         //             this.interaction.followUp({embeds: [
//         //                 new Discord.MessageEmbed()
//         //                     .setDescription("Set a exp cooldown e.g: 10s, 20s, 5m")
//         //                     .setFooter("Min cd - 10 seconds & Max cd - 5 minutes")
//         //                     .setColor("RED")
//         //             ], ephemeral: true}).catch(err => {return console.log(err.stack)})
//         //         }
//         //         if(time < 10){
//         //             this.interaction.followUp({embeds: [
//         //                 new Discord.MessageEmbed()
//         //                     .setDescription("Min cooldown must be greater than or equal to 10 seconds")
//         //                     .setColor("RED")
//         //             ], ephemeral: true}).catch(err => {return console.log(err.stack)})
//         //         }else if(time > 300000){
//         //             this.interaction.followUp({embeds: [
//         //                 new Discord.MessageEmbed()
//         //                     .setDescription("Max cooldown must be smaller than or equal to 5 minutes")
//         //                     .setColor("RED")
//         //             ], ephemeral: true}).catch(err => {return console.log(err.stack)})
//         //         }else {
//         //             this.saveData("ExpCD",time)
//         //             return true
//         //         }
//         //     }
//         //     async setMulti(data){
//         //         let dataFilter = data.split(/s+/g)[0]
//         //         dataFilter.replace('x', '')
//         //         if(!parseInt(dataFilter)){
//         //             this.interaction.followUp({embeds: [
//         //                 new Discord.MessageEmbed()
//         //                     .setDescription("Multiplier must be a number")
//         //                     .setFooter("Multiplier can't go above 5x")
//         //                     .setColor("RED")
//         //             ], ephemeral: true}).catch(err => {return console.log(err.stack)})
//         //         }else {
//         //             let number = parseInt(dataFilter)
//         //             if(number > 5){
//         //                 this.interaction.followUp({embeds: [
//         //                     new Discord.MessageEmbed()
//         //                         .setDescription("Multiplier must be smaller than 5x or it will break everything")
//         //                         .setColor("RED")
//         //                 ], ephemeral: true}).catch(err => {return console.log(err.stack)})
//         //             }else if(number < 0.1){
//         //                 this.interaction.followUp({embeds: [
//         //                     new Discord.MessageEmbed()
//         //                         .setDescription("Multiplier must be greater than 0.1x or it will be slow")
//         //                         .setColor("RED")
//         //                 ], ephemeral: true}).catch(err => {return console.log(err.stack)})
//         //             }else {
//         //                 this.saveData("ExpMulti",number)
//         //                 return true
//         //             }
//         //         }
//         //     }

//         //     async setNoExpRole(data){
//         //         let dataFilter = data.split(/s+/g)
//         //         let rData = dataFilter.replace('<@&', '').replace('>', '')
//         //         let role = this.interaction.guild.roles.resolve(rData)

//         //         if(role){
//         //             this.saveData("NoExpRole",role.id)
//         //             return true
//         //         }else {
//         //             this.interaction.followUp({embeds: [
//         //                 new Discord.MessageEmbed()
//         //                     .setDescription("Please mention a valid role")
//         //                     .setColor("RED")
//         //             ], ephemeral: true}).catch(err => {return console.log(err.stack)})
//         //         }
//         //     }

//         //     async setRankCard(data){
//         //         let attach
//         //         data.attachments.forEach(attachment => {
//         //             attach = attachment.url;
//         //         });
//         //         if(!attach){
//         //             return this.interaction.followUp({embeds: [
//         //                 new Discord.MessageEmbed()
//         //                     .setDescription("Please provide a rank image link")
//         //                     .setColor("RED")
//         //             ], ephemeral: true})
//         //             .catch(err => {return console.log(err.stack)})
//         //         }else {
//         //             this.saveData("GuildCard",attach)
//         //             return true
//         //         }
//         //     }

//         //     async setLvlUp(data){
//         //         let dataFilter = data.split(/s+/g)
//         //         if(dataFilter > 200){
//         //             this.interaction.followUp({embeds: [
//         //                 new Discord.MessageEmbed()
//         //                     .setDescription("You can't go above 200 words")
//         //                     .setColor("RED")
//         //             ], ephemeral: true}).catch(err => {return console.log(err.stack)})
//         //         }else {
//         //             this.saveData("LvlupMsg",dataFilter.join(' '))
//         //             return true
//         //         }
//         //     }
//         // }

//         // const RankData = new RankManager(interaction)
//         // const conti = new Discord.MessageActionRow()
//         //     .addComponents(
//         //         new Discord.MessageButton()
//         //             .setCustomId("ContButton")
//         //             .setLabel("Continue")
//         //             .setStyle("PRIMARY")
//         //     )
//         //     .addComponents(
//         //         new Discord.MessageButton()
//         //             .setCustomId("rankCancelButton")
//         //             .setLabel("Cancel")
//         //             .setStyle("DANGER")
//         //     )

//         // const filter = m => m.author.id == interaction.user.id;

//         // let Embed = new Discord.MessageEmbed()
//         //     .setAuthor(interaction.user.tag, interaction.user.displayAvatarURL({dynamic: false, format: 'png'}))
//         //     .setDescription("Welcome to sadbot rank system setup. Press `continue` button if you want to setup\nRank system is fully customizeable but there's some limit so you can't exploit ;)")
//         //     .setColor("WHITE")
//         //     .setFooter("type \"cancel\" to quit")
//         // interaction.editReply({content: "Press `cancel` to cancel the command",
//         //     embeds: [Embed], components: [conti]
//         // }).then(inter => {
//         //     let collector = inter.createMessageComponentCollector({ componentType: 'BUTTON', time: 1000 * 60 * 10 });
//         //     collector.on('collect', (b) => {
//         //         if(b.user.id !== interaction.user.id) return
//         //         if(b.customId == "rankCancelButton"){
//         //             collector.stop()
//         //             conti.components[0].setDisabled(true)
//         //             conti.components[1].setDisabled(true)
//         //             b.update({components: [conti]})
//         //             interaction.followUp({content: "<:error:921057346891939840> Cancel the command ", ephemeral: true})
//         //             .catch(err => {return console.log(err) && collector.stop("Something went wrong")})
//         //         }
//         //         if(b.customId == "ContButton"){
//         //             Embed.setDescription("Rank Setup - type `skip` if you don't want to change")
//         //             b.update({content: "1 - Where you would like to send level up message? | ping a channel",
//         //                 embeds: [Embed], components: []
//         //             }).catch(err => {return console.log(err) && collector.stop("Something went wrong")})
//         //             collector.stop()
                    
//         //             announceChan(b)
//         //         }
//         //     })
//         // })

//         // function announceChan(inter){
//         //     let collector = inter.channel.createMessageCollector({ filter, time: 1000 * 60 * 10 });
//         //     collector.on('collect', (m) => {
//         //         if(m.content.toLowerCase() == 'cancel'){
//         //             collector.stop()
//         //             interaction.followUp({content: "<:error:921057346891939840> Cancel the command ", ephemeral: true})
//         //             .catch(err => {return console.log(err) && collector.stop("Something went wrong")})
//         //         }else if(m.content.toLowerCase() == 'skip'){
//         //             collector.stop()
//         //             inter.editReply({content: "2 - Minimum exp per cooldown | 1-50"})
//         //             .catch(err => {return console.log(err) && collector.stop("Something went wrong")})
                    
//         //             minExp(inter)
//         //         }else {
//         //             RankData.setChannel(m.content).then((item) => {
//         //                 if(item == true){
//         //                     collector.stop()
//         //                     Embed.addField("Announce", `${m.content.split(/s+/g)[0]}`, true)
//         //                     inter.editReply({content: "2 - Minimum exp per cooldown | 1-50",embeds: [Embed]})
//         //                     .catch(err => {return console.log(err) && collector.stop("Something went wrong")})
                            
//         //                     minExp(inter)
//         //                 }
//         //             })
//         //         }
//         //     })
//         // }

//         // function minExp(inter){
//         //     let collector = inter.channel.createMessageCollector({ filter, time: 1000 * 60 * 10 });
//         //     collector.on('collect', (m) => {
//         //         if(m.content.toLowerCase() == 'cancel'){
//         //             collector.stop()
//         //             interaction.followUp({content: "<:error:921057346891939840> Cancel the command ", ephemeral: true})
//         //             .catch(err => {return console.log(err) && collector.stop("Something went wrong")})
//         //         }else if(m.content.toLowerCase() == 'skip'){
//         //             collector.stop()
//         //             inter.editReply({content: "3 - Max exp per cooldown | 50-200"})
//         //             .catch(err => {return console.log(err) && collector.stop("Something went wrong")})
                    
//         //             maxExp(inter)
//         //         }else {
//         //             RankData.setMinExp(m.content).then((item) => {
//         //                 if(item == true){
//         //                     collector.stop()
//         //                     Embed.addField("Min Exp", `${m.content.split(/s+/g)[0]}`, true)
//         //                     inter.editReply({content: "3 - M<ax exp per cooldown | 50-200",embeds: [Embed]})
//         //                     .catch(err => {return console.log(err) && collector.stop("Something went wrong")})
                            
//         //                     maxExp(inter)
//         //                 }
//         //             })
//         //         }
//         //     })
//         // }

//         // function maxExp(inter){
//         //     let collector = inter.channel.createMessageCollector({ filter, time: 1000 * 60 * 10 });
//         //     collector.on('collect', (m) => {
//         //         if(m.content.toLowerCase() == 'cancel'){
//         //             collector.stop()
//         //             interaction.followUp({content: "<:error:921057346891939840> Cancel the command ", ephemeral: true})
//         //             .catch(err => {return console.log(err) && collector.stop("Something went wrong")})
//         //         }else if(m.content.toLowerCase() == 'skip'){
//         //             collector.stop()
//         //             inter.editReply({content: "4 - Interval between giving exp | 10sec-5min"})
//         //             .catch(err => {return console.log(err) && collector.stop("Something went wrong")})
                    
//         //             expCD(inter)
//         //         }else {
//         //             RankData.setMaxExp(m.content).then((item) => {
//         //                 if(item == true){
//         //                     collector.stop()
//         //                     Embed.addField("Max Exp", `${m.content.split(/s+/g)[0]}`, true)
//         //                     inter.editReply({content: "4 - Interval between giving exp | 10sec-5min",embeds: [Embed]})
//         //                     .catch(err => {return console.log(err) && collector.stop("Something went wrong")})
                            
//         //                     expCD(inter)
//         //                 }
//         //             })
//         //         }
//         //     })
//         // }

//         // function expCD(inter){
//         //     let collector = inter.channel.createMessageCollector({ filter, time: 1000 * 60 * 10 });
//         //     collector.on('collect', (m) => {
//         //         if(m.content.toLowerCase() == 'cancel'){
//         //             collector.stop()
//         //             interaction.followUp({content: "<:error:921057346891939840> Cancel the command ", ephemeral: true})
//         //             .catch(err => {return console.log(err) && collector.stop("Something went wrong")})
//         //         }else if(m.content.toLowerCase() == 'skip'){
//         //             collector.stop()
//         //             inter.editReply({content: "4 - Multiply the exp | 0.1x-5x"})
//         //             .catch(err => {return console.log(err) && collector.stop("Something went wrong")})
                    
//         //             expMulti(inter)
//         //         }else {
//         //             RankData.setCooldown(m.content).then((item) => {
//         //                 if(item == true){
//         //                     collector.stop()
//         //                     Embed.addField("Cooldown", `${m.content.split(/s+/g)[0]}`, true)
//         //                     inter.editReply({content: "4 - Multiply the exp | 0.1x-5x",embeds: [Embed]})
//         //                     .catch(err => {return console.log(err) && collector.stop("Something went wrong")})
                            
//         //                     expMulti(inter)
//         //                 }
//         //             })
//         //         }
//         //     })
//         // }

//         // function expMulti(inter){
//         //     let collector = inter.channel.createMessageCollector({ filter, time: 1000 * 60 * 10 });
//         //     collector.on('collect', (m) => {
//         //         if(m.content.toLowerCase() == 'cancel'){
//         //             collector.stop()

//         //             interaction.followUp({content: "<:error:921057346891939840> Cancel the command ", ephemeral: true})
//         //             .catch(err => {return console.log(err) && collector.stop("Something went wrong")})
//         //         }else if(m.content.toLowerCase() == 'skip'){
//         //             collector.stop()
//         //             inter.editReply({content: "5 - Level up message | type `tags` to check tags"})
//         //             .catch(err => {return console.log(err) && collector.stop("Something went wrong")})
                    
//         //             lvlupMsg(inter)
//         //         }else {
//         //             RankData.setMulti(m.content).then((item) => {
//         //                 if(item == true){
//         //                     collector.stop()
//         //                     Embed.addField("Multiplier", `${m.content.split(/s+/g)[0]}`, true)
//         //                     inter.editReply({content: "5 - Level up message | type `tags` to check tags",embeds: [Embed]})
//         //                     .catch(err => {return console.log(err) && collector.stop("Something went wrong")})
                            
//         //                     lvlupMsg(inter)
//         //                 }
//         //             })
//         //         }
//         //     })
//         // }

//         // function lvlupMsg(inter){
//         //     let collector = inter.channel.createMessageCollector({ filter, time: 1000 * 60 * 10 });
//         //     collector.on('collect', (m) => {
//         //         if(m.content.toLowerCase() == 'cancel'){
//         //             collector.stop()
//         //             interaction.followUp({content: "<:error:921057346891939840> Cancel the command ", ephemeral: true})
//         //             .catch(err => {return console.log(err) && collector.stop("Something went wrong")})
//         //         }else if(m.content.toLowerCase() == 'skip'){
//         //             collector.stop()
//         //             inter.editReply({content: "6 - Server default rank card"})
//         //             .catch(err => {return console.log(err) && collector.stop("Something went wrong")})
                    
//         //             rankCard(inter)
//         //         }else if(m.content.toLowerCase() == 'tags') {
//         //             interaction.followUp({
//         //                 embeds: [
//         //                     new Discord.MessageEmbed()
//         //                         .setDescription(`
//         //                         {member} - ${variables("GG {member} you have reached level {level}")}
//         //                         {member.id} - ${variables("GG {member.id} you have reached level {level}")}
//         //                         {member.name} - ${variables("GG {member.name} you have reached level {level}")}
//         //                         {member.tag} - ${variables("GG {member.tag} you have reached level {level}")}
//         //                         {server} - ${variables("Server name is {server}")}
//         //                         {server.id} - ${variables("server ID is: {server.id}")}
//         //                         {level} - ${variables("GG you have reached level {level}")}
//         //                         `)
//         //                         .setColor("RED")
//         //                 ]
//         //             })
//         //         }else {
//         //             RankData.setLvlUp(m.content).then((item) => {
//         //                 if(item == true){
//         //                     collector.stop()

//         //                     Embed.addField("Lvlup Msg", `${variables(m.content)}`, true)
//         //                     inter.editReply({content: "6 - Server default rank card",embeds: [Embed]})
//         //                     .catch(err => {return console.log(err) && collector.stop("Something went wrong")})
                            
//         //                     rankCard(inter)
//         //                 }
//         //             })
//         //         }
//         //     })
//         // }

//         // function variables(arr){
//         //     return arr
//         //     .replace(/{member}/g, `${interaction.user}`)
//         //     .replace(/{member.name}/g, `${interaction.user.username}`)
//         //     .replace(/{member.tag}/g, `${interaction.user.tag}`)
//         //     .replace(/{server}/g, `${interaction.guild.name}`)
//         //     .replace(/{member.id}/g, `${interaction.user.id}`)
//         //     .replace(/{server.id}/g, `${interaction.guild.id}`)
//         //     .replace(/{level}/g, `69 *nice*`)
//         //     .replace(/{user}/g, `${interaction.user}`)
//         //     .replace(/{user.name}/g, `${interaction.user.username}`)
//         //     .replace(/{user.tag}/g, `${interaction.user.tag}`)
//         //     .replace(/{user.id}/g, `${interaction.user.id}`)
//         // }

//         // function rankCard(inter){
//         //     let collector = inter.channel.createMessageCollector({ filter, time: 1000 * 60 * 10 });
//         //     collector.on('collect', (m) => {
//         //         if(m.content.toLowerCase() == 'cancel'){
//         //             collector.stop()
//         //             interaction.followUp({content: "<:error:921057346891939840> Cancel the command ", ephemeral: true})
//         //             .catch(err => {return console.log(err) && collector.stop("Something went wrong")})
//         //         }else if(m.content.toLowerCase() == 'skip'){
//         //             collector.stop()
//         //             inter.editReply({content: "7 - No exp role | This role won't receive any exp",embeds: [Embed]})
//         //             .catch(err => {return console.log(err) && collector.stop("Something went wrong")})
                    
//         //             noExp(inter)
//         //         }else {
//         //             RankData.setRankCard(m).then((item) => {
//         //                 if(item == true){
//         //                     collector.stop()

//         //                     let attach
//         //                     m.attachments.forEach(attachment => {
//         //                         attach = attachment.url;
//         //                     });

//         //                     Embed.addField("Rank Card", `[rank card](${attach})`, true)
//         //                     inter.editReply({content: "7 - No exp role | This role won't receive any exp",embeds: [Embed]})
//         //                     .catch(err => {return console.log(err) && collector.stop("Something went wrong")})
                            
//         //                     noExp(inter)
//         //                 }
//         //             })
//         //         }
//         //     })
//         // }

//         // function noExp(inter){
//         //     let collector = inter.channel.createMessageCollector({ filter, time: 1000 * 60 * 10 });
//         //     collector.on('collect', (m) => {
//         //         if(m.content.toLowerCase() == 'cancel'){
//         //             collector.stop()
//         //             interaction.followUp({content: "<:error:921057346891939840> Cancel the command ", ephemeral: true})
//         //             .catch(err => {return console.log(err) && collector.stop("Something went wrong")})
//         //         }else if(m.content.toLowerCase() == 'skip'){
//         //             collector.stop()
//         //             inter.editReply({content: "Setup complete :)",embeds: [Embed]})
//         //             .catch(err => {return console.log(err) && collector.stop("Something went wrong")})
//         //         }else {
//         //             RankData.setNoExpRole(m.content).then((item) => {
//         //                 if(item == true){
//         //                     collector.stop()
//         //                     Embed.addField("No Exp", `[card](${m.content(/s+/g)[0]})`, true)
//         //                     inter.editReply({content: "Setup complete :)",embeds: [Embed]})
//         //                     .catch(err => {return console.log(err) && collector.stop("Something went wrong")})
//         //                 }
//         //             })
//         //         }
//         //     })
//         // }

//     }
// }