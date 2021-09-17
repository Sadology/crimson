const Discord = require('discord.js');
const { GuildRole, GuildChannel } = require('../../models')
const { commandUsed } = require('../../Functions/CommandUsage')
module.exports = {
    name: 'clean',
    aliases: ['clear'],

    run: async(client, message, args,prefix) =>{
        await message.delete();

        const permData = await GuildRole.findOne({
            guildID: message.guild.id,
            Active: true
        });

        const { author, content, guild, channel } = message;

        const missingPerm = new Discord.MessageEmbed()
            .setAuthor(author.tag, author.displayAvatarURL({dynamic: false, format: "png", size: 1024}))
            .setDescription("Missing permission to execute this command")
            .setTimestamp()
            .setColor('#ff303e')

        const roleSet = permData.Moderator;
            if (message.guild.ownerID !== message.author.id){
                if(!message.member.permissions.has(["ADMINISTRATOR"])){
                    if(permData.ModOptions.Enabled === true){
                        if(!message.member.roles.cache.some(r=>roleSet.includes(r.id))){
                            if(!message.member.permissions.has(["MANAGE_GUILD", "ADMINISTRATOR", "BAN_MEMBERS"])){
                                return await message.channel.send({embeds: [missingPerm]}).then(m=>setTimeout(() => m.delete(), 1000 * 10));
                            }
                        }
                    }else if(permData.ModOptions.Enabled === false){
                        if(!message.member.permissions.has(["BAN_MEMBERS", "MANAGE_GUILD", "ADMINISTRATOR"])){
                            return await message.channel.send({embeds: [missingPerm]}).then(m=>setTimeout(() => m.delete(), 1000 * 10));
                        }
                    }
                }
            }

        const Embed = new Discord.MessageEmbed()
            .setAuthor( "Command - Clean", client.user.displayAvatarURL({dynamic: true, type: "png", size: 1024}) )

        const TutEmbed = new Discord.MessageEmbed()
            .setAuthor( "Command - Purge", client.user.displayAvatarURL({dynamic: true, type: "png", size: 1024}) )
            .setDescription( `Deletes a everyones message in a channel (Max 1000) \nUsage: \`${prefix}clean\ [ Amount of message ]\`` )
            .setColor( "#fffafa" )
            .setTimestamp()

        if( !args.length ) {
            return channel.send({embeds: [TutEmbed]}).then(m=>setTimeout(() => m.delete(), 1000 * 10))
        }

        const Amount = parseInt(args[0]);// if args 1 is a numberic value.
        if(!Amount){
            Embed.setDescription("Please provide an amount of message to Clean")
            Embed.setColor("#ff303e")
            return message.channel.send({embeds: [Embed]}).then(m=>setTimeout(() => m.delete(), 1000 * 10))
        }
        if(Amount >= 1001){
            Embed.setDescription("Bot can't clean more than 1000 message at the same time")
            Embed.setColor("#ff303e")
            return message.channel.send({embeds: [Embed]}).then(m=>setTimeout(() => m.delete(), 1000 * 10))
        }// If amount is greater than 1000, then throw an error.

        async function logMessage(amount, ID) {
            const LogData = await GuildChannel.findOne({
                guildID: guild.id,
                Active: true,
                "MessageLog.DeleteEnabled": true
            })
            if(LogData){
                const logChannel = guild.channels.cache.get(LogData.MessageLog.MessageDelete)

                if(logChannel){
                    const logEmbed = new Discord.MessageEmbed()
                        .setAuthor(`Message Cleaned`, message.author.displayAvatarURL({dynamic: true , format: 'png', size: 1024}))
                        .addField('Moderator', `\`\`\`${message.author.tag}\`\`\``, true)
                        .addField('Amount', `\`\`\`${amount ? amount : "100"}\`\`\``, true)
                        .addField('Channel', `${message.channel}`, true)
                        .setTimestamp()
                        .setColor("#fffafa")
                        logEmbed.setFooter(`${ID}`)

                    logChannel.send({embeds: [logEmbed]})
                }
            }
        }
        try{
            channel.messages.fetch().then(async messages => {
                messages = messages.filter(m => !m.pinned).array().slice(0, Amount ? Amount : 1000);
                await channel.bulkDelete(messages, true).then(async (messages) =>{
                    logMessage(messages.size, message.author.id)
                    commandUsed( guild.id, guild.name, message.author.id, message.author.tag, "Clean", messages.size, content );
                })

                
            }).catch((err) => console.log(err))
        }catch(err){
            console.log(err);
        }
    }
};