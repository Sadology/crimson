const Discord = require('discord.js');
const { GuildChannel } = require('../../models')
const { LogManager } = require('../../Functions')
const { Messages } = require('../../localDb')
module.exports = {
    event: "guildMemberRemove",
    once: false,
    run: async(member, client)=> {
        try{
            if(member.user.id == client.user.id) return
            const clientPerm = member.guild.members.resolve( client.user ).permissions.any("VIEW_AUDIT_LOG");
            if (!clientPerm || clientPerm == false) return
    
            const { guild } = member;
            let GreetMessage;
            let Data = [];
            function getRandomMessage() {
                Messages.forEach(item => {
                    if(item.TYPE == 'LEFT'){
                        GreetMessage = item.MESSAGES[Math.floor(Math.random() * item.MESSAGES.length)];
                    }
                })
            }
    
            function convertValue(Array, type) {
                switch(type){
                    case 'db':
                        return Array
                        .replace(/{member}/g, `${member.user}`)
                        .replace(/{member.id}/g, `${member.user.id}`)
                        .replace(/{member.tag}/g, `${member.user.tag}`)
                        .replace(/{member.name}/g, `${member.user.username}`)
                        .replace(/{server}/g, `${guild.name}`)
                        .replace(/{server.id}/g, `${guild.id}`)
                    break;
    
                    case 'local':
                        return Array
                        .replace(/{member}/g, `${member.user.username}`)
                        .replace(/{member.id}/g, `${member.user.id}`)
                        .replace(/{member.tag}/g, `${member.user.tag}`)
                        .replace(/{member.name}/g, `${member.user.username}`)
                        .replace(/{server}/g, `${guild.name}`)
                        .replace(/{server.id}/g, `${guild.id}`)
                    break;
                }
            }
    
            async function fetchData() {
                await GuildChannel.findOne({
                    guildID: guild.id,
                    Active: true
                })
                .then((res) => {
                    if(res && res.customMessage && res.customMessage.LeftMsg.length){
                        let ArrData = res.customMessage.LeftMsg
                        ArrData.forEach(data => {
                            Data.push(data)
                        })
                        GreetMessage = Data[Math.floor(Math.random() * Data.length)];
                        sendData('db')
                    }else {
                        getRandomMessage()
                        sendData('local')
                    }
                })
                .catch(err => {
                    return console.log(err)
                })
            }
    
            function sendData(opt) {
                let Embed = new Discord.MessageEmbed()
                    .setAuthor({name: `${member.user.tag} - ${guild.memberCount.toLocaleString()}` , iconURL: `${member.user.displayAvatarURL({
                        dynamic: true, 
                        format: 'png'
                    })}`})
                    .setThumbnail(`${member.user.displayAvatarURL({
                        dynamic: true , type: 'png', size: 1024
                    })}`)
                    .setFooter({text: member.user.id})
                    .setTimestamp()
                    .setColor(guild.me.displayColor)
    
                switch(opt){
                    case 'db':
                        Embed.setDescription(`${convertValue(GreetMessage, 'db')}`)
                        new LogManager(guild).sendData({type: 'byelog', data: Embed, client})
                    break;
                    case 'local':
                        Embed.setDescription(`\`\`\`${convertValue(GreetMessage, 'local')}\`\`\``)
                        new LogManager(guild).sendData({type: 'byelog', data: Embed, client})
                    break;
                }
            }
            fetchData()
        }catch(err){
            return console.log(err.stack)
        }
    }
}