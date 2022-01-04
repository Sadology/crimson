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
                for (i = 0; i < current.length; i++){
                    let owner = current[i].members.resolve(current[i].ownerId)
                    let bot = current[i].members.resolve(client.user)
                    let perm
                    if(bot.permissions.has("ADMINISTRATOR")) {perm = "Admin"} else if(bot.permissions.has("MANAGE_GUILD")) {perm = "Manager"} else if(bot.permissions.has("MANAGE_MESSAGES")) {perm = "Moderator"} else perm = "Normal member"
                    Embed.addField(`**${start + i + 1}**• ${current[i].name}`,[
                        `**Name**: ${current[i].name}`,
                        `**Owner**: ${owner.user.tag}`,
                        `**ID**: ${current[i].id}`,
                        `**Members**: ${current[i].memberCount}`,
                        `**Outage**: ${current[i].available == true ? "false" : 'true'}`,
                        `**Description**: ${current[i].description}`,
                        `**Verification**: ${current[i].verificationLevel}`,
                        `**Vanity**: ${current[i].vanityURLCode}`,
                        `**NSFW**: ${current[i].nsfwLevel}`,
                        `**MFA**: ${current[i].mfaLevel}`,
                        `**Boost Level**: ${current[i].premiumTier}`,
                        `**Boost Count**: ${current[i].premiumSubscriptionCount}`,
                        `**Perms**: ${perm}`,
                    ].toString().split(",").join(' \n'))
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