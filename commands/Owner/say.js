const Discord = require('discord.js');
module.exports = {
    name: 'say',
    aliases: ['copycat', 'repeat'],
    description:'returns the arguement',
    category: "Owner",
    
    run: async(client, message, args,prefix) =>{
        if(message.author.id !== "571964900646191104"){
            return
        }
        message.delete()
        
        if(!message.guild.me.permissions.has("SEND_MESSAGES", "MANAGE_MESSAGES")){
            return
        }

        // let item = message.content.split(/--/g).join(' ')
        // let item2 = item.split(/\s+/g).slice()
        // let chan = item2.indexOf("channel")+1

        // let chann = item2[chan]
        // const channels = message.guild.channels.cache.find(c => c.id == chann.replace('<#','').replace('>',''))

        // channels.send(item2[chan+1])

        if(!args.length){
            return message.channel.send({embeds: [new Discord.MessageEmbed()
                .setAuthor("Command: Say", client.user.displayAvatarURL({
                    dynamic: true , format: 'png'
                }))
                .setDescription('Bot returns the Arguments')
                .setTitle('Aliases: copycat, repeat')
                .addField('Commands :', [
                    '• say',
                    '• <@channel/ID>',
                    '• embed'
                ])
                .addField('Usage: ', [
                    `${prefix}say <your message>`,
                    `${prefix}say <@channel/ID>`,
                    `${prefix}say embed <your message>`
                ])
                .addField('Example: ', [
                    `${prefix}say Hi!`,
                    `${prefix}say #announcement Huge Announcement!`,
                    `${prefix}say embed Hello everyone!`
                ])
                .setColor('#9000ff')
            ]
            })
        }
        async function sayMessage(value, Msg, mentionChannel){
            switch(value){
                case 'normal':
                    await message.channel.send(Msg)
                    break;
                
                case 'channel':
                    await mentionChannel.send(Msg)
                    break;

                case 'embed':
                    const Embed = new Discord.MessageEmbed()
                    .setDescription(Msg)
                    .setColor(message.guild.me.displayColor)
                    await message.channel.send({embeds: [Embed]})
            }
        }

        const valueMessage = args.slice(1).join(' ');
        const regularMsg = args.slice(0).join(' ');
       
        const cmd = message.content.split(" ")[1]
        const channel = message.guild.channels.cache.find(c => c.id == cmd.replace('<#','').replace('>',''))

        switch(cmd){
            case 'embed':
                sayMessage('embed', valueMessage)
                break;
            
            case `${channel}`:
                sayMessage('channel', valueMessage, channel)
                break;
            
            default:
                sayMessage('normal', regularMsg)
        }
    }
}