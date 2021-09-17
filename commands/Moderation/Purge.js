// const Discord = require('discord.js');
// const { GuildRole, GuildChannel } = require('../../models')
// const { commandUsed } = require('../../Functions/CommandUsage')
// module.exports = {
//     name: 'purge',
//     aliases: ['purne'],

//     run: async(client, message, args,prefix) =>{
//         await message.delete();

//         const permData = await GuildRole.findOne({
//             guildID: message.guild.id,
//             Active: true
//         });

//         const { author, content, guild, channel } = message;

//         const missingPerm = new Discord.MessageEmbed()
//             .setAuthor(author.tag, author.displayAvatarURL({ dynamic: false, format: "png", size: 1024 }))
//             .setDescription( "Missing permission to execute this command" )
//             .setTimestamp()
//             .setColor( '#ff303e' )

//         const roleSet = permData.Moderator;
//         if (message.guild.ownerID !== message.author.id){
//             if(!message.member.permissions.has(["ADMINISTRATOR"])){
//                 if(permData.ModOptions.Enabled === true){
//                     if(!message.member.roles.cache.some(r=>roleSet.includes(r.id))){
//                         if(!message.member.permissions.has(["MANAGE_GUILD", "ADMINISTRATOR", "BAN_MEMBERS"])){
//                             return await message.channel.send({embeds: [missingPerm]}).then(m=>setTimeout(() => m.delete(), 1000 * 10));
//                         }
//                     }
//                 }else if(permData.ModOptions.Enabled === false){
//                     if(!message.member.permissions.has(["BAN_MEMBERS", "MANAGE_GUILD", "ADMINISTRATOR"])){
//                         return await message.channel.send({embeds: [missingPerm]}).then(m=>setTimeout(() => m.delete(), 1000 * 10));
//                     }
//                 }
//             }
//         }

//         const Embed = new Discord.MessageEmbed()
//             .setAuthor( "Command - Purge", client.user.displayAvatarURL({ dynamic: true, type: "png", size: 1024 }) )

//         const TutEmbed = new Discord.MessageEmbed()
//             .setAuthor( "Command - Purge", client.user.displayAvatarURL({ dynamic: true, type: "png", size: 1024 }) )
//             .setDescription( `Deletes a specific number of message ( Limit 100 ) \nUsage: \`${prefix}purge\ [ Amount of message ] [ Member ]\`` )
//             .addField('More Options', [
//                 `${prefix}purge human - Only deletes message send by humans.`,
//                 `${prefix}purge bot = Only deletes message send by bot.`,
//                 `${prefix}purge match - Deletes matched words.`,
//                 `${prefix}purge pinned - Deletes channel pinned messages.`,
//                 `${prefix}purge mismatch - Deletes message that doesn't match the word`,
//                 `${prefix}purge starts - Deletes message that starts with a specific letter`,
//                 `${prefix}purge ends - Deletes message that ends with a specific letter`,
//             ])
//             .addField('Example and Usage', [
//                 `${prefix}purge [ amount ] [ Member ] - ${prefix}purge 27 @shadow~.`,
//                 `${prefix}purge [ amount ] human - ${prefix}purge 40 human.`,
//                 `${prefix}purge [ amount ] bot - ${prefix}purge 85 bot.`,
//                 `${prefix}purge [ amount ] pinned - ${prefix}purge 5 pinned.`,
//                 `${prefix}purge [ amount ] match [ word ] - ${prefix}purge 69 match F.`,
//                 `${prefix}purge [ amount ] mismatch [ word ] - ${prefix}purge 53 mismatch hello.`,
//                 `${prefix}purge [ amount ] starts [ word ] - ${prefix}purge 15 starts S.`,
//                 `${prefix}purge [ amount ] ends [ word ] - ${prefix}purge 23 ends T.`,
//             ])
//             .setColor( "#fffafa" )
//             .setTimestamp()

//         if( !args.length ) {
//             return channel.send({embeds: [TutEmbed]}).then(m=>setTimeout(() => m.delete(), 1000 * 10));
//         }

//         const Amount = parseInt( args[0] );// if args 1 is a numberic value.
//         if( !Amount ){
//             Embed.setDescription("Please provide a number to purge")
//             Embed.setColor("#ff303e")
//             return message.channel.send({embeds: [Embed]}).then(m=>setTimeout(() => m.delete(), 1000 * 10));
//         }
//         if(Amount >= 101){
//             Embed.setDescription("Bot can't delete more than 100 message at the same time")
//             Embed.setColor("#ff303e")
//             return message.channel.send({embeds: [Embed]}).then(m=>setTimeout(() => m.delete(), 1000 * 10));
//         }// If amount is greater than 100, then throw an error.

//         const options = args[1];
//         const word = args[2];

//         const regex = /[\d]/g; // If mention type is ID
//         const findMember = args[1]; // If mention type is <@>
//         const member = findMember ? findMember.replace(/^<@!([^>]+)>$/gim, '$1') : null; // Removing <@> from mention

//         async function logMessage( element, amount, ID, user )  {
//             const LogData = await GuildChannel.findOne({
//                 guildID: guild.id,
//                 Active: true,
//                 "MessageLog.DeleteEnabled": true
//             })
//             if( LogData ){
//                 const logChannel = guild.channels.cache.get( LogData.MessageLog.MessageDelete )

//                 if( logChannel ){
//                     const logEmbed = new Discord.MessageEmbed()
//                         .setAuthor(`${ element } Message Deleted `, message.author.displayAvatarURL({dynamic: true , format: 'png', size: 1024}))
//                         .addField('Moderator', `\`\`\`${message.author.tag}\`\`\``, true)
//                         .addField('Amount', `\`\`\`${ amount ? amount : "100" }\`\`\``, true)
//                         .addField('Channel', `${ message.channel }`, true)
//                         .setTimestamp()
//                         .setColor("#fffafa")
//                         logEmbed.setFooter(`${ ID }`)
//                         if( user ){
//                             logEmbed.addField("Member", `\`\`\`${ user }\`\`\``, true)
//                         }

//                     logChannel.send({embeds: [logEmbed]});
//                 }
//             }
//         }

//         switch( options ){

//             case "bot":
//                 channel.messages.fetch({
//                     limit: 100,
//                 }).then(async messages => {
//                     messages = messages.filter(m => m.author.bot && !m.pinned).array().slice(0, Amount ? Amount : 100);
//                     await channel.bulkDelete( messages, true ).then(async ( messages ) =>{
//                         logMessage( "Bots", messages.size, message.author.id );
//                         commandUsed( guild.id, guild.name, message.author.id, message.author.tag, "Purge", messages.size, content );
//                     })
//                 }).catch(( err ) => console.log( err ));
//             break;

//             case "human":
//                 channel.messages.fetch({
//                     limit: 100,
//                 }).then(async messages => {
//                     messages = messages.filter(m => !m.author.bot && !m.pinned).array().slice(0, Amount ? Amount : 100);
//                     await channel.bulkDelete( messages, true ).then(async ( messages ) =>{
//                         logMessage( "Humans", messages.size, message.author.id );
//                         commandUsed( guild.id, guild.name, message.author.id, message.author.tag, "Purge", messages.size, content );
//                     })
//                 }).catch(( err ) => console.log( err ));
//             break;

//             case "pinned":
//                 channel.messages.fetch({
//                     limit: 100,
//                 }).then(async messages => {
//                     messages = messages.filter(m => m.pinned).array().slice(0, Amount ? Amount : 100);
//                     await channel.bulkDelete( messages, true ).then(async ( messages ) =>{
//                         logMessage( "Pinned", messages.size, message.author.id );
//                         commandUsed( guild.id, guild.name, message.author.id, message.author.tag, "Purge", messages.size, content );
//                     })
//                 }).catch((err) => console.log(err));
//             break;

//             case 'starts':
//                 if( !word ){
//                     Embed.setDescription( "Please provide a `Word` to delete" )
//                     Embed.setColor( "#ff303e" )
//                     message.channel.send( {embeds: [Embed]} ).then(m=>setTimeout(() => m.delete(), 1000 * 10))
//                 }
//                 await message.channel.messages.fetch({
//                     limit: 100
//                 }).then(async messages =>{
//                     messages = messages.filter(m => !m.pinned && m.content.startsWith( word )).array().slice(0, Amount ? Amount : 100)
//                     await channel.bulkDelete(messages, true).then(async (messages) =>{
//                         logMessage( "Starts-With", messages.size, message.author.id );
//                         commandUsed( guild.id, guild.name, message.author.id, message.author.tag, "Purge", messages.size, content );
//                     })
//                 }).catch(( err ) => console.log( err ));
//             break;

//             case 'ends':
//                 if(!word){
//                     Embed.setDescription( "Please provide a `Word` to delete" )
//                     Embed.setColor( "#ff303e" )
//                     message.channel.send( {embeds: [Embed]} ).then(m=>setTimeout(() => m.delete(), 1000 * 10))
//                 }
//                 await message.channel.messages.fetch({
//                     limit: 100
//                 }).then(async messages =>{
//                     messages = messages.filter(m => !m.pinned && m.content.startsWith( word )).array().slice(0, Amount ? Amount : 100)
//                     await channel.bulkDelete(messages, true).then(async ( messages ) =>{
//                         logMessage( "Ends-With", messages.size, message.author.id );
//                         commandUsed( guild.id, guild.name, message.author.id, message.author.tag, "Purge", messages.size, content );
//                     })
//                 }).catch((err) => console.log(err));
//             break;

//             case 'match':
//                 if(!word){
//                     Embed.setDescription( "Please provide a `Word` to delete" )
//                     Embed.setColor( "#ff303e" )
//                     message.channel.send({embeds: [Embed]}).then(m=>setTimeout(() => m.delete(), 1000 * 10))
//                 }
//                 await channel.messages.fetch({
//                     limit: 100
//                 }).then(async messages =>{
//                     messages = messages.filter(m => !m.pinned && m.content.includes(word)).array().slice(0, Amount ? Amount : 100)
//                     channel.bulkDelete(messages, true).then(async ( messages ) =>{
//                         logMessage("Matched", messages.size, message.author.id);
//                         commandUsed( guild.id, guild.name, message.author.id, message.author.tag, "Purge", messages.size, content );
//                     })
//                 }).catch(( err ) => console.log( err ))
//                 break;

//             case 'mismatch':
//                 if(!word){
//                     Embed.setDescription( "Please provide a `Word` to delete" )
//                     Embed.setColor( "#ff303e" )
//                     message.channel.send( {embeds: [Embed]} ).then(m=>setTimeout(() => m.delete(), 1000 * 10))
//                 }
//                 await channel.messages.fetch({
//                     limit: 100
//                 }).then(async messages =>{
//                     messages = messages.filter(m => !m.pinned && !m.content.includes(word)).array().slice(0, Amount ? Amount : 100)
//                     channel.bulkDelete(messages, true).then(async (messages) =>{
//                         logMessage( "MisMatched", messages.size, message.author.id );
//                         commandUsed( guild.id, guild.name, message.author.id, message.author.tag, "Purge", messages.size, content );
//                     })
//                 }).catch((err) => console.log(err))
//                 break;
//             default:
//                 if( args[1] ){
//                     if( args[1].match(regex) ){
//                         const Member = await message.guild.members.fetch(member);

//                         if( Member ){
//                             channel.messages.fetch({
//                                 limit: 100,
//                             }).then(async messages => {
//                                 if ( Member ) {
//                                         messages = messages.filter(m => m.author.id === Member.id && !m.pinned).array().slice(0, Amount ? Amount: 100);
//                                         await channel.bulkDelete( messages, true )
//                                         .then(async ( messages ) =>{
//                                             logMessage("Bulk", messages.size, Member.user.id, Member.user.tag);
//                                             commandUsed( guild.id, guild.name, message.author.id, message.author.tag, "Purge", messages.size, content );
//                                         })
//                                 }else {
//                                     Embed.setDescription(`Please mention a Member \n**Usage**: \`${prefix}purge [ Amount ] [ User ]\` \n**Example**: \`${prefix}purge 18 @shadow~\``)
//                                     Embed.setColor("#ff303e")
//                                     channel.send({embeds: [Embed]})
//                                 }
//                             }).catch( error => console.log( error ));
//                         }
//                     }else {
//                         Embed.setDescription( `Please mention a Member \n**Usage**: \`${prefix}purge [ Amount ] [ User ]\` \n**Example**: \`${prefix}purge 18 @shadow~\`` )
//                         Embed.setColor( "#ff303e" )
//                         channel.send( {embeds: [Embed]} )
//                     }

//                 }else if( !args[1] ){
//                     channel.messages.fetch({
//                         limit: 100,
//                     }).then(async messages => {
//                         messages = messages.filter(m => !m.pinned).array().slice(0, Amount);
//                         await channel.bulkDelete( messages, true ).then(async ( messages ) =>{
//                             logMessage( "Bulk", messages.size, message.author.id );
//                             commandUsed( guild.id, guild.name, message.author.id, message.author.tag, "Purge", messages.size, content );
//                         })
//                     }).catch(( err ) => console.log( err ))
//                 }
//             break;
//         }
//     }
// };