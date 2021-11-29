const Discord = require('discord.js');
const { GuildChannel } = require('../../models')
const { LogChannel } = require('../../Functions/logChannelFunctions')
const { Messages } = require('../../localDb');
module.exports = {
    event: "guildMemberAdd",
    once: false,
    run: async(member, client)=> {
        const { guild } = member;

        let GreetMessage;
        let Data = [];
        function getRandomMessage() {
            Messages.forEach(item => {
                if(item.TYPE == 'JOINED'){
                    GreetMessage = item.MESSAGES[Math.floor(Math.random() * item.MESSAGES.length)];
                }
            })
        }

        function convertValue(Array) {
            return Array
            .replace(/{member}/g, `${member.user}`)
            .replace(/{member.id}/g, `${member.user.id}`)
            .replace(/{member.tag}/g, `${member.user.tag}`)
            .replace(/{member.name}/g, `${member.user.username}`)
            .replace(/{server}/g, `${guild.name}`)
            .replace(/{server.id}/g, `${guild.id}`)
        }

        async function fetchData() {
            await GuildChannel.findOne({
                guildID: guild.id,
                Active: true
            })
            .then((res) => {
                if(res && res.customMessage && res.customMessage.JoinedMsg.length){
                    let ArrData = res.customMessage.JoinedMsg
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
                .setAuthor(`${member.user.tag} - ${guild.memberCount.toLocaleString()}` , `${member.user.displayAvatarURL({
                    dynamic: true, 
                    format: 'png'
                })}`)
                .setThumbnail(`${member.user.displayAvatarURL({
                    dynamic: true , type: 'png', size: 1024
                })}`)
                .setFooter(member.user.id)
                .setTimestamp()
                .setColor(guild.me.displayColor)
            
            LogChannel("joinedLog", guild).then(async (c) => {
                if(!c || c == null) return

                const hooks = await c.fetchWebhooks();
                const webHook = hooks.find(i => i.owner.id == client.user.id && i.name == 'sadbot')

                if(!webHook){
                    c.createWebhook("sadbot", {
                        avatar: "https://i.ibb.co/86GB8LZ/images.jpg"
                    })
                    setTimeout(() => {

                    }, 1000)
                }

                switch(opt){
                    case 'db':
                        Embed.setDescription(`${convertValue(GreetMessage)}`)
                        webHook.send({embeds: [Embed]})
                    break;
                    case 'local':
                        Embed.setDescription(`\`\`\`${convertValue(GreetMessage)}\`\`\``)
                        webHook.send({embeds: [Embed]})
                    break;
                }
            })
        }
        fetchData()
    }
}