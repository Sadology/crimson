// const Discord = require('discord.js');
// const { Guild } = require('../../models');
// const { errLog } = require('../../Functions/erroHandling')
// module.exports = {
//     name: 'command',
//     run: async(client, message, args,prefix) =>{
//         if(!message.member.permissions.has("ADMINISTRATOR")){
//             return message.author.send('None of your role proccess to use this command')
//         }

//         if(!args.length){
//             return message.channel.send("Permission, disable, enable")
//         }

//         const PermsArr = [
//             "mute",
//             "unmute",
//             "kick",
//             "ban",
//             "purge",
//             "clean",
//             "lock",
//             "unlock",
//             "status",
//             "seek",
//             "logs",
//             // -- Mod type --
//             "mod-stats",
//             "delete-log",
//             "reset-log",
//             "action-log",
//             "message-log",
//             "announce",
//             "banlog",
//             "message-ignore",
//             "message-log",
//             "status-log",
//             "moderator",
//             // -- Admin type --
//             "avatar",
//             // -- Utils type --
//             "8ball",
//             "findgf",
            
//         ]

//         let lowCaps = args[1].toLowerCase();
//         const convert = lowCaps.split(" ");
//         const perms = convert.filter( i => PermsArr.includes(i));
//         const permPara = perms.join(" ")

//         const { guild, content } = message;

//         switch(args[0]){
//             case "perms":
//             case 'permission':
//                 switch(args[1]){
//                     case permPara:
//                         const RoleDivider = content.split(/\s+/).slice(3).join(" ");
//                         const roles = RoleDivider.split(/,\s+/);
//                         const roleSet = new Set(roles);
                
//                         const errArr = new Array();
//                         const arrStr = new Array();
//                         const RolesArray = []
        
//                         // DATABASE FUNCTION
//                         function roleDatabase (){
//                             roleSet.forEach(async (roleID) => {
//                                 try {
//                                     Roles = guild.roles.cache.find(c => c.id == roleID.replace( '<@&' , '' ).replace( '>' , '' )) || 
//                                         guild.roles.cache.find(r => r.name.toLowerCase() == roleID.toLowerCase()) || 
//                                         guild.roles.cache.find(e => r.id == roleID);
                        
//                                     if(Roles){
//                                         arrStr.push(Roles.toString());
//                                         RolesArray.push(Roles.id)
                                        
//                                         await Guild.findOneAndUpdate({
//                                             guildID: message.guild.id,
//                                             Active: true
//                                         },{
//                                             guildName: message.guild.name,

//                                             $push: {
//                                                 [`Commands.${permPara}`] : {
//                                                     $each: RolesArray
//                                                 }
//                                             }
//                                         },{
//                                             upsert: true,
//                                         })
            
//                                     }else if(typeof Roles === "undefined"){
//                                         async function add( value) {
//                                             if (errArr.indexOf(value) === -1) {
//                                                 await errArr.push(value);
//                                             }
//                                         }
//                                         add(roleID)
//                                     }
//                                 }catch (err){
//                                     errLog(err.stack.toString(), "text", "Message-Ignore", "Error in Role Database Function")
//                                 }
//                             })
//                         }
//                         roleDatabase()
//                     break;
//                 }
//             }
//     }
// }