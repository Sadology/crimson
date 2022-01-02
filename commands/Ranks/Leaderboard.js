const Discord = require('discord.js');
const { Guild, Profiles } = require('../../models');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');
const { default: axios } = require('axios');
module.exports = {
    name: 'rank-leaderboard',
    aliases: ['ranklb', 'rlb', 'rank-lb'],
    description: "check server rank board",
    permissions: ["SEND_MESSAGES"],
    botPermission: ["SEND_MESSAGES", "ATTACH_FILES", "EMBED_LINKS"],
    usage: "rank [ user (optional)]",
    category: "Ranks",
    cooldown: 3000,
    run: async(client, message, args,prefix) =>{
        return message.channel.send("Coming soon...")
        const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setStyle("SUCCESS")
                .setLabel("Next")
                .setCustomId("nextRankPage")
        )
        .addComponents(
            new MessageButton()
                .setStyle("DANGER")
                .setLabel("Previous")
                .setCustomId("previousRankPage")
        )

        async function fetchData(){
            await Profiles.find({
                guildID: message.guild.id,
            }).sort([
                ['Rank','descending']
            ]).exec((err, res) => {
                if(err) return console.log(err.stack);
                if(res.length === 0 ){
                    return message.channel.send({embeds: [
                        new Discord.MessageEmbed()
                            .setDescription(`This server has no leaderboard.`)
                            .setColor("RED")
                    ]}).then(m => setTimeout(() => m.delete(), 1000 * 20))
                    
                }else {
                    return createData(res)
                }
            })
        }

        async function createData(Data){
            let arr = []
            for (i=0; i < Data.length; i++){
                let data = {
                    name: Data[i].userName,
                    Rank: Data[i].Rank
                }
                arr.push(data)
            }
            logFunction(arr, Data)
        }

        async function logFunction(Data, userdata){
            let currentIndex = 0
            let MakeEmbed = start => {
                const current = Data.slice(start, start + 10)
                const Embed = new Discord.MessageEmbed()
                    .setAuthor("Member   -   Level    -    Exp")
                    .setFooter(`Page ${start + 1} - ${start + current.length}/${Data.length}`)
                    .setColor("#fffafa")

                let arr = []
                for (i = 0; i < current.length; i++){
                    arr.push(`${start + i + 1}: ${current[i].name} **${current[i].Rank.Level}** \`${current[i].Rank.Experience}\``)
                }
                Embed.setDescription(arr.join(' \n'))

                if(Data.length <= 10){
                    return ({embeds: [Embed]})
                }else if (start + current.length >= Data.length){
                    row.components[0].setDisabled(true)
                    row.components[1].setDisabled(false)
                    return ({embeds: [Embed], components: [row]})
                }else if(current.length == 0){
                    row.components[0].setDisabled(true)
                    row.components[1].setDisabled(false)
                    return ({embeds: [Embed], components: [row]})
                }else if(currentIndex !== 0){
                    row.components[1].setDisabled(false)
                    row.components[0].setDisabled(false)
                    return ({embeds: [Embed], components: [row]})
                }else if (currentIndex + 10 <= Data.length){
                    row.components[1].setDisabled(true)
                    row.components[0].setDisabled(false)
                    return ({embeds: [Embed], components: [row]})
                }
            }
            await message.channel.send(MakeEmbed(0)).then(async msg => {
                const collector = msg.createMessageComponentCollector({ componentType: 'BUTTON', time: 1000 * 60 * 5});

                collector.on('collect',async b => {
                    if(b.user.id !== message.author.id) return
                    if(b.customId === 'nextRankPage'){
                        currentIndex += 10
                        await b.update(MakeEmbed(currentIndex)).catch(err => {return console.log(err.stack)})
                    }
                    if(b.customId === "previousRankPage"){
                        currentIndex -= 10
                        await b.update(MakeEmbed(currentIndex)).catch(err => {return console.log(err.stack)})
                    }
                });
                collector.on("end", async() =>{
                    row.components[0].setDisabled(true)
                    row.components[1].setDisabled(true)
                    await msg.edit({components: [row]}).catch(err => {return console.log(err.stack)})
                })
            }).catch(err => {return console.log(err.stack)})
        }
        fetchData()
    }
}