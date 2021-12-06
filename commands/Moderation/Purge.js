const Discord = require('discord.js');
const { ModStatus } = require('../../Functions/functions')
module.exports = {
    name: 'purge',
    aliases: ['purne'],
    description: "Purge amount of message in the channel with options",
    permissions: ['MANAGE_MESSAGES'],
    botPermission: ["MANAGE_MESSAGES",],
    usage: "purge [ amount ] [ options *optional* ]",
    category: "Moderation",
    delete: true,
    cooldown: 1000,
    run: async(client, message, args,prefix) =>{
        const { channel } = message;
        
        const TutEmbed = new Discord.MessageEmbed()
            .setAuthor( "Command - Purge", client.user.displayAvatarURL({ dynamic: true, type: "png", size: 1024 }) )
            .setDescription( `Deletes a specific amount of messages ( Limit 100 ) \nUsage: \`${prefix}purge\ [ Amount of message ] [ Member ]\`` )
            .addField('More Options', [
                `\n${prefix}purge humans - Only deletes message send by humans`,
                `\n${prefix}purge bots - Only deletes message send by bot`,
                `\n${prefix}purge match - Deletes message that matches the words`,
                `\n${prefix}purge not - Deletes messages that doesn't matches the word`,
                `\n${prefix}purge links - Deletes message that contains links`,
                `\n${prefix}purge starts - Deletes message that starts with a specific letter`,
                `\n${prefix}purge ends - Deletes message that ends with a specific letter`,
                `\n${prefix}purge mentions - Deletes message that contanins mentions`,
            ].toString())
            .addField('Usage', [
                `${prefix}purge [ amount ] [ Member ]`,
                `\n${prefix}purge [ amount ] human`,
                `\n${prefix}purge [ amount ] bot`,
                `\n${prefix}purge [ amount ] links`,
                `\n${prefix}purge [ amount ] match`,
                `\n${prefix}purge [ amount ] not`,
                `\n${prefix}purge [ amount ] starts`,
                `\n${prefix}purge [ amount ] ends`,
                `\n${prefix}purge [ amount ] mentions`,
            ].toString())
            .addField('Example', [
                `${prefix}purge 27 @shadow~`,
                `\n${prefix}purge 40 human`,
                `\n${prefix}purge 85 bot`,
                `\n${prefix}purge 5 links`,
                `\n${prefix}purge 69 match F`,
                `\n${prefix}purge 53 not hello`,
                `\n${prefix}purge 15 starts S`,
                `\n${prefix}purge 23 ends T`,
                `\n${prefix}purge 23 mentions`,
            ].toString())
            .setColor( "#fffafa" )
            .setTimestamp()

        const words = message.content.split(" ").slice(3).join(" ")
        async function checkValue(value, word){
            let Arr = [];
            switch(value){
                case "bots":
                case "bot":
                    await channel.messages.fetch({
                        limit: 100
                    }).then(async msg => {
                        msg.forEach(items => {
                            Arr.push(...[items].filter((m)=> m.author.bot && !m.pinned))
                        })
                    }) 
                break;
                
                case "humans":
                case "human":
                    await channel.messages.fetch({
                        limit: 100
                    }).then(async msg => {
                        msg.forEach(items => {
                            Arr.push(...[items].filter((m)=> !m.author.bot && !m.pinned))
                        })
                    })
                break;

                case "starts":
                    await channel.messages.fetch({
                        limit: 100
                    }).then(async msg =>{
                        msg.forEach(items =>{
                            Arr.push(...[items].filter(m => m.content.startsWith( word ) && !m.pinned))
                        })
                    })
                break;

                case "ends":
                    await channel.messages.fetch({
                        limit: 100
                    }).then(async msg =>{
                        msg.forEach(items =>{
                            Arr.push(...[items].filter(m => m.content.endsWith( word ) && !m.pinned))
                        })
                    })
                break;

                case "match":
                    await channel.messages.fetch({
                        limit: 100
                    }).then(async msg =>{
                        msg.forEach(items =>{
                            Arr.push(...[items].filter(m => m.content.includes(word) && !m.pinned))
                        })
                    })
                break;

                case "mismatch":
                case 'not':
                    await channel.messages.fetch({
                        limit: 100
                    }).then(async msg =>{
                        msg.forEach(items =>{
                            Arr.push(...[items].filter(m => !m.content.includes(word) && !m.pinned))
                        })
                    })
                break;

                case "mentions":
                case "mention":
                    await channel.messages.fetch({
                        limit: 100
                    }).then(async msg =>{
                        msg.forEach(items =>{
                            Arr.push(...[items].filter(m => m.content.includes('<@!') && m.content.includes('>') && !m.pinned))
                        })
                    })
                break;

                case "links":
                    await channel.messages.fetch({
                        limit: 100
                    }).then(async msg =>{
                        msg.forEach(items =>{
                            Arr.push(...[items].filter(m => m.content.includes('https://') || m.content.includes('http://') && !m.pinned))
                        })
                    })
                break;

                default:
                    message.channel.send({embeds: [TutEmbed]})
            }
            return Arr
        }

        async function User(member) {
            let Arr = new Array()
            let ID = member.replace('<@!', '').replace('>', '')
            await message.channel.messages.fetch({
                limit: 100,
            }).then(async msg => {
                msg.forEach(items =>{
                    Arr.push(...[items].filter(m => m.author.id == ID && !m.pinned))
                })
            })

            return new Promise((resolve) => {
                resolve(Arr)
            })
        }

        async function convert(amt){
            if(amt.match(/\d+/)){
                let rawAmt = amt.replace(/[^0-9]/g, '')
                let convertAmt = parseInt(rawAmt)
                
                return new Promise((resolve) => {
                    resolve(convertAmt)
                })
            }else {
                return message.channel.send({embeds: [TutEmbed]})
            }
        }

        async function RawDelete(){
            let Arr = new Array()
            await message.channel.messages.fetch({
                limit: 100,
            }).then(async msg => {
                msg.forEach(items =>{
                    Arr.push(...[items].filter(m => !m.pinned))
                })
            })

            return new Promise((resolve) => {
                resolve(Arr)
            })
        }

        async function deleteMessage(){
            let Amount;

            if(args[0]){
                convert(args[0]).then(data => {
                    Amount = data
                })
            }else {
                return message.channel.send({embeds: [TutEmbed]})
            }

            if(!args[1]){
                RawDelete().then(async data => {
                    let Messages = data.slice(0, Amount)
                    return await channel.bulkDelete(Messages, true).catch(err => {return console.log(err)})
                })
            }else if(args[1].startsWith('<@') && 
            args[1].endsWith(">") || 
            args[1].match(/\d+/)){
                User(args[1]).then(async data => {
                    let Messages = data.slice(0, Amount)
                    return await channel.bulkDelete(Messages, true).catch(err => {return console.log(err)})
                })
            }else {
                checkValue(args[1], words).then(async data => {
                    let Messages = data.slice(0, Amount)
                    return await channel.bulkDelete(Messages, true).catch(err => {return console.log(err)})
                })
            }
        }

        deleteMessage()
        ModStatus({type: "Purge", guild: message.guild, member: message.author, content: message.content})
    }
};
