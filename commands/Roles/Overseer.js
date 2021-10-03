// const Discord = require('discord.js');
// const { GuildRole } = require('../../models');
// module.exports = {
//     name: 'overseer',
//     aliases: ["overseer-role"],
//     description: "Set a moderator role in the server",
//     permissions: ["ADMINISTRATOR"],
//     usage: "overseer [ option ] [ roles ]",
//     category: "Administrator",
    
//     run: async(client, message, args, prefix) =>{

//         if(!message.member.permissions.has("ADMINISTRATOR")){
//             return message.author.send('None of your role proccess to use this command')
//         }
        
//         const Data = await GuildRole.findOne({
//             guildID: message.guild.id,
//             Active: true
//         })

//         overseerArr = new Array()
//         if(Data){
//             for (const role of Data.Overseer){
//                 let fetchedRoles = message.guild.roles.cache.find(r=>r.id == role)
                
//                 overseerArr.push(fetchedRoles.toString());
//             }
//         }

//         if(!args.length){
//             const expectedArgs = new Discord.MessageEmbed()
//                 .setAuthor(`${client.user.username} - Overseer Roles`)
//                 .setDescription(`Overseer roles - ${overseerArr.length ? overseerArr : 'NONE'}
//                     **Usage:** \`${prefix}overseer [ enable | disable ] [ Roles ]\``)
//                 .setColor("#fffafa")
//                 .setFooter("Roles with this permission can use any command")
                
//             await message.channel.send({embeds: [expectedArgs]})
//             return false;
//         }

//         const { content, guild } = message;
//         const option = args[0]


//         switch(option.toLowerCase()){
//             case "enable":

//                 const theValue = args[1];
//                 if(!theValue){
//                     message.channel.send({embeds: [new Discord.MessageEmbed()
//                         .setDescription("Please mention roles. Each roles will be separated with (,)")
//                         .addField(`Usage`, `${prefix}overseer [ enable | disable ] [ Roles ] \n${prefix}overseer enable @Overseer, @Moderator, @Helper, @Admin \n${prefix}overseer disable`)
//                         .setColor("#fffafa")
//                         .setFooter("Roles with this permission can use any command")
//                     ]
//                     }).then(m=>setTimeout(() => m.delete(), 1000 * 10));
//                 }

//                 const RoleDivider = content.split(/\s+/).slice(2).join(" ");
//                 const roles = RoleDivider.split(/,\s+/);
//                 const roleSet = new Set(roles);
        
//                 const errArr = new Array();
//                 const arrStr = new Array();

//                 // DATABASE FUNCTION
//                 function Database (){
//                     roleSet.forEach(async (roleID) => {
//                         overseerRoles = guild.roles.cache.find(c => c.id == roleID.replace( '<@&' , '' ).replace( '>' , '' )) || 
//                         guild.roles.cache.find(r => r.name.toLowerCase() == roleID.toLowerCase()) || 
//                         guild.roles.cache.find(c => c.id == roleID);
            
//                         if(overseerRoles){
//                             arrStr.push(overseerRoles.toString());
                            
//                             await GuildRole.findOneAndUpdate({
//                                 guildID: message.guild.id,
//                                 Active: true
//                             },{
//                                 guildName: message.guild.name,
//                                 $addToSet: {
//                                     Overseer: overseerRoles.id
//                                 },
//                                 OverseerOptions: {
//                                     Enabled: true
//                                 }
//                             },{
//                                 upsert: true,
//                             })

//                         }else if(typeof overseerRoles === "undefined"){
//                             async function add( value) {
//                                 if (errArr.indexOf(value) === -1) {
//                                     await errArr.push(value);
//                                 }
//                             }
//                             add(roleID)
//                         }
//                     })
//                 }
//                 Database()

//                 if(typeof overseerRoles === "undefined"){
//                     const ErrEmbed = new Discord.MessageEmbed()
//                         .setDescription(`Couldn't find role ${errArr}`)
//                         .addField("Usage", `${prefix}overseer [ enable ] [ Roles ]`)
//                         .addField("Usage", `${prefix}overseer enable @Overseer, @Admin`)
//                         .setColor("#fffafa")
//                         .setTimestamp()

//                     return message.channel.send({embeds: [ErrEmbed]})
//                 }else {
//                     await message.channel.send({embeds: [new Discord.MessageEmbed()
//                         .setAuthor('Overseer Roles Updated')
//                         .setDescription(`${arrStr}`)
//                         .setColor("#fffafa")
//                         .setTimestamp()
//                     ]
//                     })
//                 }
//             break;

//             case "disable":
//                 await GuildRole.findOneAndUpdate({
//                     guildID: message.guild.id,
//                     Active: true
//                 },{
//                     guildName: message.guild.name,
//                     ADmin: [],
//                     OverseerOptions: {
//                         Enabled: false
//                     }
//                 },{
//                     upsert: true,
//                 })

//             const disabledEmbed = new Discord.MessageEmbed()
//                 .setAuthor(`${client.user.username} - Overseer Roles`)
//                 .setDescription(`Overseer roles has been disabled`)
//                 .setColor("#fffafa")
//                 .setTimestamp()
//             await message.channel.send({embeds: [disabledEmbed]})
//         }
//     }
// }