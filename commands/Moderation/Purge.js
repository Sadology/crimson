const Discord = require('discord.js');
const { GuildRole, GuildChannel } = require('../../models')
const { commandUsed } = require('../../Functions/CommandUsage')
const {Member} = require('../../Functions/MemberFunction');
module.exports = {
    name: 'purge',
    aliases: ['purne'],
    description: "Purge amount of message in the channel with options",
    permissions: ['MANAGE_MESSAGES'],
    usage: "purge [ amount ] [ options *optional* ]",
    category: "Moderation",
    
    run: async(client, message, args,prefix) =>{
        if(message.guild.me.permissions.has(["MANAGE_MESSAGES"])){
            await message.delete();
        }

        if(!message.member.permissions.has("MANAGE_MESSAGES")){
            return message.author.send('None of your role proccess to use this command')
        }

        const { author, content, guild, channel } = message;

        const Embed = new Discord.MessageEmbed()
            .setAuthor( "Command - Purge", client.user.displayAvatarURL({ dynamic: true, type: "png", size: 1024 }) )

        const TutEmbed = new Discord.MessageEmbed()
            .setAuthor( "Command - Purge", client.user.displayAvatarURL({ dynamic: true, type: "png", size: 1024 }) )
            .setDescription( `Deletes a specific number of message ( Limit 100 ) \nUsage: \`${prefix}purge\ [ Amount of message ] [ Member ]\`` )
            .addField('More Options', [
                `\n${prefix}purge human - Only deletes message send by humans.`,
                `\n${prefix}purge bot = Only deletes message send by bot.`,
                `\n${prefix}purge match - Deletes matched words.`,
                `\n${prefix}purge pinned - Deletes channel pinned messages.`,
                `\n${prefix}purge mismatch - Deletes message that doesn't match the word`,
                `\n${prefix}purge starts - Deletes message that starts with a specific letter`,
                `\n${prefix}purge ends - Deletes message that ends with a specific letter`,
            ].toString())
            .addField('Example and Usage', [
                `${prefix}purge [ amount ] [ Member ] - ${prefix}purge 27 @shadow~.`,
                `\n${prefix}purge [ amount ] human - ${prefix}purge 40 human.`,
                `\n${prefix}purge [ amount ] bot - ${prefix}purge 85 bot.`,
                `\n${prefix}purge [ amount ] pinned - ${prefix}purge 5 pinned.`,
                `\n${prefix}purge [ amount ] match [ word ] - ${prefix}purge 69 match F.`,
                `\n${prefix}purge [ amount ] mismatch [ word ] - ${prefix}purge 53 mismatch hello.`,
                `\n${prefix}purge [ amount ] starts [ word ] - ${prefix}purge 15 starts S.`,
                `\n${prefix}purge [ amount ] ends [ word ] - ${prefix}purge 23 ends T.`,
            ].toString())
            .setColor( "#fffafa" )
            .setTimestamp()

        if( !args.length ) {
            return channel.send({embeds: [TutEmbed]}).then(m=>setTimeout(() => m.delete(), 1000 * 30));
        }

        let errorEmbed = new Discord.MessageEmbed()
            .setDescription(`Please provide a number to purge \n\n**Usage:** ${prefix}purge [ amount ] [ option ]`)
            .setColor("#ff303e")
        const Amount = parseInt( args[0] );
        if( !Amount ){
            return message.channel.send({embeds: [errorEmbed]}).then(m=>setTimeout(() => m.delete(), 1000 * 10));
        }else if (isNaN(args[0])){
            return message.channel.send({embeds: [errorEmbed]}).then(m=>setTimeout(() => m.delete(), 1000 * 10));
        }
        if(Amount >= 101){
            Embed.setDescription("Bot can't delete more than 100 message at the same time")
            Embed.setColor("#ff303e")
            return message.channel.send({embeds: [Embed]}).then(m=>setTimeout(() => m.delete(), 1000 * 10));
        }

        const options = args[1];
        const word = args[2];
        const regex = /[\d]/g;

        switch( options ){

            case "bot":
                channel.messages.fetch({
                    limit: 100,
                }).then(async messages => {
                    let Arr = []
                    messages.forEach(messages =>{
                        Arr.push(...[messages].filter(m => m.author.bot && !m.pinned))
                    })
                    let Message = Arr.slice(0, Amount)

                    await channel.bulkDelete( Message, true ).then(async ( messages ) =>{
                        commandUsed( guild.id, guild.name, message.author.id, message.author.tag, "Purge", messages.size, content );
                    })
                }).catch(( err ) => console.log( err ));
            break;

            case "human":
                channel.messages.fetch({
                    limit: 100,
                }).then(async messages => {
                    let Arr = []
                    messages.forEach(messages =>{
                        Arr.push(...[messages].filter(m => !m.author.bot && !m.pinned))
                    })
                    let Message = Arr.slice(0, Amount)

                    await channel.bulkDelete( Message, true ).then(async ( messages ) =>{
                        commandUsed( guild.id, guild.name, message.author.id, message.author.tag, "Purge", messages.size, content );
                    })
                }).catch(( err ) => console.log( err ));
            break;

            case "pinned":
                channel.messages.fetch({
                    limit: 100,
                }).then(async messages => {
                    let Arr = []
                    messages.forEach(messages =>{
                        Arr.push(...[messages].filter(m => m.pinned))
                    })
                    let Message = Arr.slice(0, Amount)

                    await channel.bulkDelete( Message, true ).then(async ( messages ) =>{
                        commandUsed( guild.id, guild.name, message.author.id, message.author.tag, "Purge", messages.size, content );
                    })
                }).catch((err) => console.log(err));
            break;

            case 'starts':
                if( !word ){
                    Embed.setDescription( "Please provide a `Word` to delete" )
                    Embed.setColor( "#ff303e" )
                    message.channel.send( {embeds: [Embed]} ).then(m=>setTimeout(() => m.delete(), 1000 * 10))
                }
                await message.channel.messages.fetch({
                    limit: 100
                }).then(async messages =>{
                    let Arr = []
                    messages.forEach(messages =>{
                        Arr.push(...[messages].filter(m => m.content.startsWith( word ) && !m.pinned))
                    })
                    let Message = Arr.slice(0, Amount)

                    await channel.bulkDelete(Message, true).then(async (messages) =>{
                        commandUsed( guild.id, guild.name, message.author.id, message.author.tag, "Purge", messages.size, content );
                    })
                }).catch(( err ) => console.log( err ));
            break;

            case 'ends':
                if(!word){
                    Embed.setDescription( "Please provide a `Word` to delete" )
                    Embed.setColor( "#ff303e" )
                    message.channel.send( {embeds: [Embed]} ).then(m=>setTimeout(() => m.delete(), 1000 * 10))
                }
                await message.channel.messages.fetch({
                    limit: 100
                }).then(async messages =>{
                    let Arr = []
                    messages.forEach(messages =>{
                        Arr.push(...[messages].filter(m => m.content.endsWith( word ) && !m.pinned))
                    })
                    let Message = Arr.slice(0, Amount)

                    await channel.bulkDelete(Message, true).then(async ( messages ) =>{
                        commandUsed( guild.id, guild.name, message.author.id, message.author.tag, "Purge", messages.size, content );
                    })
                }).catch((err) => console.log(err));
            break;

            case 'match':
                if(!word){
                    Embed.setDescription( "Please provide a `Word` to delete" )
                    Embed.setColor( "#ff303e" )
                    message.channel.send({embeds: [Embed]}).then(m=>setTimeout(() => m.delete(), 1000 * 10))
                }
                await channel.messages.fetch({
                    limit: 100
                }).then(async messages =>{
                    let Arr = []
                    messages.forEach(messages =>{
                        Arr.push(...[messages].filter(m => m.content.includes(word) && !m.pinned))
                    })
                    let Message = Arr.slice(0, Amount)

                    await channel.bulkDelete(Message, true).then(async ( messages ) =>{
                        commandUsed( guild.id, guild.name, message.author.id, message.author.tag, "Purge", messages.size, content );
                    })
                }).catch(( err ) => console.log( err ))
                break;

            case 'mismatch':
                if(!word){
                    Embed.setDescription( "Please provide a `Word` to delete" )
                    Embed.setColor( "#ff303e" )
                    message.channel.send( {embeds: [Embed]} ).then(m=>setTimeout(() => m.delete(), 1000 * 10))
                }
                await channel.messages.fetch({
                    limit: 100
                }).then(async messages =>{
                    let Arr = []
                    messages.forEach(messages =>{
                        Arr.push(...[messages].filter(m => !m.content.includes(word) && !m.pinned))
                    })
                    let Message = Arr.slice(0, Amount)

                    await channel.bulkDelete(Message, true).then(async (messages) =>{
                        commandUsed( guild.id, guild.name, message.author.id, message.author.tag, "Purge", messages.size, content );
                    })
                }).catch((err) => console.log(err))
                break;
            default:
                if( args[1] ){
                    if( args[1].match(regex) ){
                        const FindMembers = new Member(args[1], message);
                        await message.guild.members.fetch();
                        const member = message.guild.members.cache.get(FindMembers.mentionedMember)

                        if( member ){
                            channel.messages.fetch({
                                limit: 100,
                            }).then(async messages => {
                                    let Arr = []
                                    messages.forEach(messages =>{
                                        Arr.push(...[messages].filter(m => m.user.id === member.id && !m.pinned))
                                    })
                                    let Message = Arr.slice(0, Amount)

                                    await channel.bulkDelete( Message, true )
                                        .then(async ( messages ) =>{
                                            commandUsed( guild.id, guild.name, message.author.id, message.author.tag, "Purge", messages.size, content );
                                        })
                            }).catch( error => console.log( error ));
                        }else {
                            channel.messages.fetch({
                                limit: 100,
                            }).then(async messages => {
                                    let Arr = []
                                    messages.forEach(messages =>{
                                        Arr.push(...[messages].filter(m => m.author.id === FindMembers.mentionedMember && !m.pinned))
                                    })
                                    let Message = Arr.slice(0, Amount)

                                    await channel.bulkDelete( Message, true )
                                        .then(async ( messages ) =>{
                                            commandUsed( guild.id, guild.name, message.author.id, message.author.tag, "Purge", messages.size, content );
                                        })
                            }).catch( error => console.log( error ));
                        }
                    }else {
                        Embed.setDescription( `Please mention a Member \n**Usage**: \`${prefix}purge [ Amount ] [ User ]\` \n**Example**: \`${prefix}purge 18 @shadow~\`` )
                        Embed.setColor( "#ff303e" )
                        channel.send( {embeds: [Embed]} )
                    }

                }else if( !args[1] ){
                    channel.messages.fetch({
                        limit: 100,
                    }).then(async messages => {
                        let Arr = []
                        messages.forEach(messages =>{
                            Arr.push(...[messages].filter(m => !m.pinned))
                        })
                        let Message = Arr.slice(0, Amount)
                        await channel.bulkDelete( Message, true ).then(async ( messages ) =>{
                            commandUsed( guild.id, guild.name, message.author.id, message.author.tag, "Purge", messages.size, content );
                        })
                    }).catch(( err ) => console.log( err ))
                }
            break;
        }
    }
};