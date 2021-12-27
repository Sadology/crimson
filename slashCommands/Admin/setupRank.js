const { SlashCommandBuilder, roleMention } = require('@discordjs/builders');
const wait = require('util').promisify(setTimeout);
const Discord = require('discord.js');
const { GuildChannel, Guild } = require('../../models');
const { errLog } = require('../../Functions/erroHandling');
const ms = require('ms');
const e = require('express');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('setup-rank')
        .setDescription('Setup ranks on your server.'),
    permission: ["ADMINISTRATOR", "MANAGE_GUILD"],
    botPermission: ["SEND_MESSAGES"],
    category: "Slash",
    run: async(client, interaction) =>{
        const { options } = interaction;

        interaction.deferReply()
        await new Promise(resolve => setTimeout(resolve, 1000))

        class RankManager{
            constructor(interaction){
                this.interaction = interaction;
            }

            async saveData(option, data){
                await Guild.findOneAndUpdate({
                    guildID: this.interaction.guild.id
                }, {
                    [`Modules.ranks.Enabled`]: true,
                    [`RankSettings.${option}`]: data
                }).then(() => {
                    return true
                })
                .catch(err => {return console.log(err.stack)})
            }

            async setChannel(data){
                let dataFilter = data.split(/s+/g)[0]
                let chanData = dataFilter.replace('<#', '').replace('>', '')
                let channel = this.interaction.guild.channels.resolve(chanData)

                if(channel){
                    this.saveData("Channel",channel.id)
                    return true
                }else {
                    this.interaction.followUp({embeds: [
                        new Discord.MessageEmbed()
                            .setDescription("Please mention a valid channel")
                            .setColor("RED")
                    ], ephemeral: true}).catch(err => {return console.log(err.stack)})
                }
            }

            async setMinExp(data){
                let dataFilter = data.split(/s+/g)[0]
                if(!parseInt(dataFilter)){
                    this.interaction.followUp({embeds: [
                        new Discord.MessageEmbed()
                            .setDescription("Min-Exp must be a number | 1 - 50")
                            .setFooter("Must be smaller than 50 and greater than 1")
                            .setColor("RED")
                    ], ephemeral: true})
                    .catch(err => {return console.log(err.stack)})
                }else {
                    let number = parseInt(dataFilter)
                    if(number >= 51){
                        this.interaction.followUp({embeds: [
                            new Discord.MessageEmbed()
                                .setDescription("Max-Exp must be smaller than or equal to 50 | 1 - 50")
                                .setColor("RED")
                        ], ephemeral: true}).catch(err => {return console.log(err.stack)})
                    }else if(number < 1){
                        this.interaction.followUp({embeds: [
                            new Discord.MessageEmbed()
                                .setDescription("Min-Exp must be greater than or equal to 1 | 1 - 50")
                                .setColor("RED")
                        ], ephemeral: true}).catch(err => {return console.log(err.stack)})
                    }else {
                        this.saveData("MinExp",number)
                        return true
                    }
                }
            }

            async setMaxExp(data){
                let dataFilter = data.split(/s+/g)[0]
                if(!parseInt(dataFilter)){
                    this.interaction.followUp({embeds: [
                        new Discord.MessageEmbed()
                            .setDescription("Max-Exp must be a number | 50-200")
                            .setFooter("Must be smaller than 200 and greater than 50")
                            .setColor("RED")
                    ], ephemeral: true}).catch(err => {return console.log(err.stack)})
                }else {
                    let number = parseInt(dataFilter)
                    if(number >= 201){
                        this.interaction.followUp({embeds: [
                            new Discord.MessageEmbed()
                                .setDescription("Max-Exp must be smaller than or equal to 200 | 50-200")
                                .setColor("RED")
                        ], ephemeral: true}).catch(err => {return console.log(err.stack)})
                    }else if(number < 50){
                        this.interaction.followUp({embeds: [
                            new Discord.MessageEmbed()
                                .setDescription("Max-Exp must be greater than or equal to 50 | 50-200")
                                .setColor("RED")
                        ], ephemeral: true}).catch(err => {return console.log(err.stack)})
                    }else {
                        this.saveData("MaxExp",number)
                        return true
                    }
                }
            }
            async setCooldown(data){
                let dataFilter = data.split(/s+/g)[0]
                let time = ms(dataFilter)
                if(!time){
                    this.interaction.followUp({embeds: [
                        new Discord.MessageEmbed()
                            .setDescription("Set a exp cooldown e.g: 10s, 20s, 5m")
                            .setFooter("Min cd - 10 seconds & Max cd - 5 minutes")
                            .setColor("RED")
                    ], ephemeral: true}).catch(err => {return console.log(err.stack)})
                }
                if(time < 10){
                    this.interaction.followUp({embeds: [
                        new Discord.MessageEmbed()
                            .setDescription("Min cooldown must be greater than or equal to 10 seconds")
                            .setColor("RED")
                    ], ephemeral: true}).catch(err => {return console.log(err.stack)})
                }else if(time > 300000){
                    this.interaction.followUp({embeds: [
                        new Discord.MessageEmbed()
                            .setDescription("Max cooldown must be smaller than or equal to 5 minutes")
                            .setColor("RED")
                    ], ephemeral: true}).catch(err => {return console.log(err.stack)})
                }else {
                    this.saveData("ExpCD",time)
                    return true
                }
            }
            async setMulti(data){
                let dataFilter = data.split(/s+/g)[0]
                dataFilter.replace('x', '')
                if(!parseInt(dataFilter)){
                    this.interaction.followUp({embeds: [
                        new Discord.MessageEmbed()
                            .setDescription("Multiplier must be a number")
                            .setFooter("Multiplier can't go above 5x")
                            .setColor("RED")
                    ], ephemeral: true}).catch(err => {return console.log(err.stack)})
                }else {
                    let number = parseInt(dataFilter)
                    if(number > 5){
                        this.interaction.followUp({embeds: [
                            new Discord.MessageEmbed()
                                .setDescription("Multiplier must be smaller than 5x or it will break everything")
                                .setColor("RED")
                        ], ephemeral: true}).catch(err => {return console.log(err.stack)})
                    }else if(number < 0.1){
                        this.interaction.followUp({embeds: [
                            new Discord.MessageEmbed()
                                .setDescription("Multiplier must be greater than 0.1x or it will be slow")
                                .setColor("RED")
                        ], ephemeral: true}).catch(err => {return console.log(err.stack)})
                    }else {
                        this.saveData("ExpMulti",number)
                        return true
                    }
                }
            }

            async setNoExpRole(data){
                let dataFilter = data.split(/s+/g)
                let rData = dataFilter.replace('<@&', '').replace('>', '')
                let role = this.interaction.guild.roles.resolve(rData)

                if(role){
                    this.saveData("NoExpRole",role.id)
                    return true
                }else {
                    this.interaction.followUp({embeds: [
                        new Discord.MessageEmbed()
                            .setDescription("Please mention a valid role")
                            .setColor("RED")
                    ], ephemeral: true}).catch(err => {return console.log(err.stack)})
                }
            }

            async setRankCard(data){
                let attach
                data.attachments.forEach(attachment => {
                    attach = attachment.url;
                });
                if(!attach){
                    return this.interaction.followUp({embeds: [
                        new Discord.MessageEmbed()
                            .setDescription("Please provide a rank image link")
                            .setColor("RED")
                    ], ephemeral: true})
                    .catch(err => {return console.log(err.stack)})
                }else {
                    this.saveData("GuildCard",attach)
                    return true
                }
            }

            async setLvlUp(data){
                let dataFilter = data.split(/s+/g)
                if(dataFilter > 200){
                    this.interaction.followUp({embeds: [
                        new Discord.MessageEmbed()
                            .setDescription("You can't go above 200 words")
                            .setColor("RED")
                    ], ephemeral: true}).catch(err => {return console.log(err.stack)})
                }else {
                    this.saveData("LvlupMsg",dataFilter.join(' '))
                    return true
                }
            }
        }

        const RankData = new RankManager(interaction)
        const conti = new Discord.MessageActionRow()
            .addComponents(
                new Discord.MessageButton()
                    .setCustomId("ContButton")
                    .setLabel("Continue")
                    .setStyle("PRIMARY")
            )
            .addComponents(
                new Discord.MessageButton()
                    .setCustomId("rankCancelButton")
                    .setLabel("Cancel")
                    .setStyle("DANGER")
            )

        const filter = m => m.author.id == interaction.user.id;

        let Embed = new Discord.MessageEmbed()
            .setAuthor(interaction.user.tag, interaction.user.displayAvatarURL({dynamic: false, format: 'png'}))
            .setDescription("Welcome to sadbot rank system setup. Press `continue` button if you want to setup\nRank system is fully customizeable but there's some limit so you can't exploit ;)")
            .setColor("WHITE")
            .setFooter("type \"cancel\" to quit")
        interaction.editReply({content: "Press `cancel` to cancel the command",
            embeds: [Embed], components: [conti]
        }).then(inter => {
            let collector = inter.createMessageComponentCollector({ componentType: 'BUTTON', time: 1000 * 60 * 10 });
            collector.on('collect', (b) => {
                if(b.user.id !== interaction.user.id) return
                if(b.customId == "rankCancelButton"){
                    collector.stop()
                    conti.components[0].setDisabled(true)
                    conti.components[1].setDisabled(true)
                    b.update({components: [conti]})
                    interaction.followUp({content: "<:error:921057346891939840> Cancel the command ", ephemeral: true})
                    .catch(err => {return console.log(err) && collector.stop("Something went wrong")})
                }
                if(b.customId == "ContButton"){
                    Embed.setDescription("Rank Setup - type `skip` if you don't want to change")
                    b.update({content: "1 - Where you would like to send level up message? | ping a channel",
                        embeds: [Embed], components: []
                    }).catch(err => {return console.log(err) && collector.stop("Something went wrong")})
                    collector.stop()
                    
                    announceChan(b)
                }
            })
        })

        function announceChan(inter){
            let collector = inter.channel.createMessageCollector({ filter, time: 1000 * 60 * 10 });
            collector.on('collect', (m) => {
                if(m.content.toLowerCase() == 'cancel'){
                    collector.stop()
                    interaction.followUp({content: "<:error:921057346891939840> Cancel the command ", ephemeral: true})
                    .catch(err => {return console.log(err) && collector.stop("Something went wrong")})
                }else if(m.content.toLowerCase() == 'skip'){
                    collector.stop()
                    inter.editReply({content: "2 - Minimum exp per cooldown | 1-50"})
                    .catch(err => {return console.log(err) && collector.stop("Something went wrong")})
                    
                    minExp(inter)
                }else {
                    RankData.setChannel(m.content).then((item) => {
                        if(item == true){
                            collector.stop()
                            Embed.addField("Announce", `${m.content.split(/s+/g)[0]}`, true)
                            inter.editReply({content: "2 - Minimum exp per cooldown | 1-50",embeds: [Embed]})
                            .catch(err => {return console.log(err) && collector.stop("Something went wrong")})
                            
                            minExp(inter)
                        }
                    })
                }
            })
        }

        function minExp(inter){
            let collector = inter.channel.createMessageCollector({ filter, time: 1000 * 60 * 10 });
            collector.on('collect', (m) => {
                if(m.content.toLowerCase() == 'cancel'){
                    collector.stop()
                    interaction.followUp({content: "<:error:921057346891939840> Cancel the command ", ephemeral: true})
                    .catch(err => {return console.log(err) && collector.stop("Something went wrong")})
                }else if(m.content.toLowerCase() == 'skip'){
                    collector.stop()
                    inter.editReply({content: "3 - Max exp per cooldown | 50-200"})
                    .catch(err => {return console.log(err) && collector.stop("Something went wrong")})
                    
                    maxExp(inter)
                }else {
                    RankData.setMinExp(m.content).then((item) => {
                        if(item == true){
                            collector.stop()
                            Embed.addField("Min Exp", `${m.content.split(/s+/g)[0]}`, true)
                            inter.editReply({content: "3 - M<ax exp per cooldown | 50-200",embeds: [Embed]})
                            .catch(err => {return console.log(err) && collector.stop("Something went wrong")})
                            
                            maxExp(inter)
                        }
                    })
                }
            })
        }

        function maxExp(inter){
            let collector = inter.channel.createMessageCollector({ filter, time: 1000 * 60 * 10 });
            collector.on('collect', (m) => {
                if(m.content.toLowerCase() == 'cancel'){
                    collector.stop()
                    interaction.followUp({content: "<:error:921057346891939840> Cancel the command ", ephemeral: true})
                    .catch(err => {return console.log(err) && collector.stop("Something went wrong")})
                }else if(m.content.toLowerCase() == 'skip'){
                    collector.stop()
                    inter.editReply({content: "4 - Interval between giving exp | 10sec-5min"})
                    .catch(err => {return console.log(err) && collector.stop("Something went wrong")})
                    
                    expCD(inter)
                }else {
                    RankData.setMaxExp(m.content).then((item) => {
                        if(item == true){
                            collector.stop()
                            Embed.addField("Max Exp", `${m.content.split(/s+/g)[0]}`, true)
                            inter.editReply({content: "4 - Interval between giving exp | 10sec-5min",embeds: [Embed]})
                            .catch(err => {return console.log(err) && collector.stop("Something went wrong")})
                            
                            expCD(inter)
                        }
                    })
                }
            })
        }

        function expCD(inter){
            let collector = inter.channel.createMessageCollector({ filter, time: 1000 * 60 * 10 });
            collector.on('collect', (m) => {
                if(m.content.toLowerCase() == 'cancel'){
                    collector.stop()
                    interaction.followUp({content: "<:error:921057346891939840> Cancel the command ", ephemeral: true})
                    .catch(err => {return console.log(err) && collector.stop("Something went wrong")})
                }else if(m.content.toLowerCase() == 'skip'){
                    collector.stop()
                    inter.editReply({content: "4 - Multiply the exp | 0.1x-5x"})
                    .catch(err => {return console.log(err) && collector.stop("Something went wrong")})
                    
                    expMulti(inter)
                }else {
                    RankData.setCooldown(m.content).then((item) => {
                        if(item == true){
                            collector.stop()
                            Embed.addField("Cooldown", `${m.content.split(/s+/g)[0]}`, true)
                            inter.editReply({content: "4 - Multiply the exp | 0.1x-5x",embeds: [Embed]})
                            .catch(err => {return console.log(err) && collector.stop("Something went wrong")})
                            
                            expMulti(inter)
                        }
                    })
                }
            })
        }

        function expMulti(inter){
            let collector = inter.channel.createMessageCollector({ filter, time: 1000 * 60 * 10 });
            collector.on('collect', (m) => {
                if(m.content.toLowerCase() == 'cancel'){
                    collector.stop()

                    interaction.followUp({content: "<:error:921057346891939840> Cancel the command ", ephemeral: true})
                    .catch(err => {return console.log(err) && collector.stop("Something went wrong")})
                }else if(m.content.toLowerCase() == 'skip'){
                    collector.stop()
                    inter.editReply({content: "5 - Level up message | type `tags` to check tags"})
                    .catch(err => {return console.log(err) && collector.stop("Something went wrong")})
                    
                    lvlupMsg(inter)
                }else {
                    RankData.setMulti(m.content).then((item) => {
                        if(item == true){
                            collector.stop()
                            Embed.addField("Multiplier", `${m.content.split(/s+/g)[0]}`, true)
                            inter.editReply({content: "5 - Level up message | type `tags` to check tags",embeds: [Embed]})
                            .catch(err => {return console.log(err) && collector.stop("Something went wrong")})
                            
                            lvlupMsg(inter)
                        }
                    })
                }
            })
        }

        function lvlupMsg(inter){
            let collector = inter.channel.createMessageCollector({ filter, time: 1000 * 60 * 10 });
            collector.on('collect', (m) => {
                if(m.content.toLowerCase() == 'cancel'){
                    collector.stop()
                    interaction.followUp({content: "<:error:921057346891939840> Cancel the command ", ephemeral: true})
                    .catch(err => {return console.log(err) && collector.stop("Something went wrong")})
                }else if(m.content.toLowerCase() == 'skip'){
                    collector.stop()
                    inter.editReply({content: "6 - Server default rank card"})
                    .catch(err => {return console.log(err) && collector.stop("Something went wrong")})
                    
                    rankCard(inter)
                }else if(m.content.toLowerCase() == 'tags') {
                    interaction.followUp({
                        embeds: [
                            new Discord.MessageEmbed()
                                .setDescription(`
                                {member} - ${variables("GG {member} you have reached level {level}")}
                                {member.id} - ${variables("GG {member.id} you have reached level {level}")}
                                {member.name} - ${variables("GG {member.name} you have reached level {level}")}
                                {member.tag} - ${variables("GG {member.tag} you have reached level {level}")}
                                {server} - ${variables("Server name is {server}")}
                                {server.id} - ${variables("server ID is: {server.id}")}
                                {level} - ${variables("GG you have reached level {level}")}
                                `)
                                .setColor("RED")
                        ]
                    })
                }else {
                    RankData.setLvlUp(m.content).then((item) => {
                        if(item == true){
                            collector.stop()

                            Embed.addField("Lvlup Msg", `${variables(m.content)}`, true)
                            inter.editReply({content: "6 - Server default rank card",embeds: [Embed]})
                            .catch(err => {return console.log(err) && collector.stop("Something went wrong")})
                            
                            rankCard(inter)
                        }
                    })
                }
            })
        }

        function variables(arr){
            return arr
            .replace(/{member}/g, `${interaction.user}`)
            .replace(/{member.name}/g, `${interaction.user.username}`)
            .replace(/{member.tag}/g, `${interaction.user.tag}`)
            .replace(/{server}/g, `${interaction.guild.name}`)
            .replace(/{member.id}/g, `${interaction.user.id}`)
            .replace(/{server.id}/g, `${interaction.guild.id}`)
            .replace(/{level}/g, `69 *nice*`)
            .replace(/{user}/g, `${interaction.user}`)
            .replace(/{user.name}/g, `${interaction.user.username}`)
            .replace(/{user.tag}/g, `${interaction.user.tag}`)
            .replace(/{user.id}/g, `${interaction.user.id}`)
        }

        function rankCard(inter){
            let collector = inter.channel.createMessageCollector({ filter, time: 1000 * 60 * 10 });
            collector.on('collect', (m) => {
                if(m.content.toLowerCase() == 'cancel'){
                    collector.stop()
                    interaction.followUp({content: "<:error:921057346891939840> Cancel the command ", ephemeral: true})
                    .catch(err => {return console.log(err) && collector.stop("Something went wrong")})
                }else if(m.content.toLowerCase() == 'skip'){
                    collector.stop()
                    inter.editReply({content: "7 - No exp role | This role won't receive any exp",embeds: [Embed]})
                    .catch(err => {return console.log(err) && collector.stop("Something went wrong")})
                    
                    noExp(inter)
                }else {
                    RankData.setRankCard(m).then((item) => {
                        if(item == true){
                            collector.stop()

                            let attach
                            m.attachments.forEach(attachment => {
                                attach = attachment.url;
                            });

                            Embed.addField("Rank Card", `[rank card](${attach})`, true)
                            inter.editReply({content: "7 - No exp role | This role won't receive any exp",embeds: [Embed]})
                            .catch(err => {return console.log(err) && collector.stop("Something went wrong")})
                            
                            noExp(inter)
                        }
                    })
                }
            })
        }

        function noExp(inter){
            let collector = inter.channel.createMessageCollector({ filter, time: 1000 * 60 * 10 });
            collector.on('collect', (m) => {
                if(m.content.toLowerCase() == 'cancel'){
                    collector.stop()
                    interaction.followUp({content: "<:error:921057346891939840> Cancel the command ", ephemeral: true})
                    .catch(err => {return console.log(err) && collector.stop("Something went wrong")})
                }else if(m.content.toLowerCase() == 'skip'){
                    collector.stop()
                    inter.editReply({content: "Setup complete :)",embeds: [Embed]})
                    .catch(err => {return console.log(err) && collector.stop("Something went wrong")})
                }else {
                    RankData.setNoExpRole(m.content).then((item) => {
                        if(item == true){
                            collector.stop()
                            Embed.addField("No Exp", `[card](${m.content(/s+/g)[0]})`, true)
                            inter.editReply({content: "Setup complete :)",embeds: [Embed]})
                            .catch(err => {return console.log(err) && collector.stop("Something went wrong")})
                        }
                    })
                }
            })
        }

    }
}