const Discord = require('discord.js');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js')
module.exports = {
    name: 'guild-list',
    aliases: ['guildlist'],
    category: "Owner",
    run: async(client, message, args,prefix) =>{
        if(message.author.id !== "571964900646191104"){
            return
        }

        const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setStyle("SUCCESS")
                .setLabel("Next")
                .setCustomId("NextPageGuildList")
        )
        .addComponents(
            new MessageButton()
                .setStyle("DANGER")
                .setLabel("Previous")
                .setCustomId("PreviousPageGuildList")
        )

        let guilds = []
        client.guilds.cache.forEach(g => {
            guilds.push(g)
        })
        
        async function GuildList(Data){
            let currentIndex = 0
            let MakeEmbed = start => {
                const current = Data.slice(start, start + 1)

                const Embed = new Discord.MessageEmbed()
                .setColor("#fffafa")
                    //.setDescription(`${Member.user ? Member.user : '<@'+Member+'>'} Mod-Logs - \`[ ${Data.length} ]\``)
                    //.setFooter(`Logs ${start + 1} - ${start + current.length}/${Data.length}`)
                    
                for (i = 0; i < current.length; i++){
                    Embed.addField(`**${start + i + 1}**• ${current[i].name}`,[
                        `**Name**: ${current[i].name}`,
                        `\n**Owner**: <@${current[i].ownerId}>`,
                        `\n**ID**: ${current[i].id}`,
                        `\n**Members**: ${current[i].memberCount}`,
                        `\n**Outage**: ${current[i].available == true ? "false" : 'true'}`,
                        `\n**Description**: ${current[i].description}`,
                        `\n**Verification**: ${current[i].verificationLevel}`,
                        `\n**Vanity**: ${current[i].vanityURLCode}`,
                        `\n**NSFW**: ${current[i].nsfwLevel}`,
                        `\n**MFA**: ${current[i].mfaLevel}`,
                        `\n**Boost Level**: ${current[i].premiumTier}`,
                        `\n**Boost Count**: ${current[i].premiumSubscriptionCount}`,
                    ].toString())
                }
                
                if(Data.length <= 1){
                    return ({embeds: [Embed]})
                }else if (start + current.length >= Data.length){
                    row.components[0].setDisabled(true)
                    row.components[1].setDisabled(false)
                    return ({embeds: [Embed], components: [row]})
                }else if(currentIndex == 0){
                    row.components[1].setDisabled(true)
                    row.components[0].setDisabled(false)
                    return ({embeds: [Embed], components: [row]})
                }else if(currentIndex !== 0){
                    row.components[1].setDisabled(false)
                    row.components[0].setDisabled(false)
                    return ({embeds: [Embed], components: [row]})
                }else if (currentIndex + 5 <= Data.length){
                    row.components[1].setDisabled(true)
                    row.components[0].setDisabled(false)
                    return ({embeds: [Embed], components: [row]})
                }
            }
            await message.channel.send(MakeEmbed(0)).then(async msg => {
                const collector = msg.createMessageComponentCollector({ componentType: 'BUTTON', time: 1000 * 60 * 5 });

                collector.on('collect',async b => {
                    if(b.user.id !== message.author.id) return
                    if(b.customId === 'NextPageGuildList'){
                        currentIndex += 1
                        await b.update(MakeEmbed(currentIndex))
                    }
                    if(b.customId === "PreviousPageGuildList"){
                        currentIndex -= 1
                        await b.update(MakeEmbed(currentIndex))
                    }
                });
                collector.on("end", async() =>{
                    // When the collector ends
                    if(currentIndex !== 0){
                        row.components[0].setDisabled(true)
                        row.components[1].setDisabled(true)
                        await msg.edit({components: [row]})
                    }
                })
            })
        }
        GuildList(guilds)
    }
}