const { SlashCommandBuilder } = require('@discordjs/builders');
const wait = require('util').promisify(setTimeout);
const Discord = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('avatar')
        .setDescription('Check avatar in 4k')
        .addUserOption(option => 
            option.setName('user')
            .setDescription('Check your friends avatar in 4k')),
    permissions: ["USE_APPLICATION_COMMANDS"],
    botPermission: ["SEND_MESSAGES"],
    category: "Slash",
    run: async(client, interation) =>{
        const { options } = interation;
        const MemberID = options.getUser('user')
        if(MemberID){
            const Member  = interation.guild.members.cache.get(MemberID.id)
            if(Member){
                try{
                    let Embed = new Discord.MessageEmbed()
                    .setAuthor(Member.user.tag,  Member.user.displayAvatarURL({dynamic: true, size: 1024, type: "png"}))
                    .setTitle( "Avatar")
                    .setImage(Member.user.avatarURL({dynamic: true, size: 4096, type: "png"}) ? Member.user.displayAvatarURL({dynamic: true, size: 4096, type: "png"}) : Member.user.displayAvatarURL({dynamic: true, size: 4096, type: "png"}))
                    .setColor("#fffafa")
                    await interation.reply({embeds: [Embed]})
                }catch(err){
                    console.error(err)
                }
            }
        }else {
            try{
                let Embed = new Discord.MessageEmbed()
                .setAuthor(interation.user.tag, interation.user.displayAvatarURL({dynamic: true, size: 1024, type: "png"}))
                .setTitle( "Avatar")
                .setImage(interation.user.displayAvatarURL({dynamic: true, size: 4096, type: "png"}) ? interation.user.displayAvatarURL({dynamic: true, size: 4096, type: "png"}) : interation.user.displayAvatarURL({dynamic: true, size: 4096, type: "png"}))
                .setColor("#fffafa")
                await interation.reply({embeds: [Embed]})
            }catch(err){
                console.error(err)
            }
        }
    }
}