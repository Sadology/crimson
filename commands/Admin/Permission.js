// const Discord = require('discord.js');
// const { ModStats } = require('../../models');
// const { readdirSync } = require("fs");
// const { cmdArr } = require('../../handlers/command')
// module.exports = {
//     name: 'command',
//     run: async(client, message, args,prefix) =>{
//         if(!message.member.permissions.has("ADMINISTRATOR")){
//             return message.author.send('None of your role proccess to use this command')
//         }

//         console.log(cmdArr)

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

//         let val = args[0].replace("-", '');
//         let lowCaps = val.toLowerCase();
//         const convert = lowCaps.split(" ");
//         const perms = convert.filter( i => PermsArr.includes(i));

//         console.log(convert, val, perms, );

//         switch(args[0]){
//             case 'perms':
//             case 'permission':
//                 switch(args[1]){
//                     case perms:
//                     switch(args[1]){
//                         case "list":
                            
//                         break;

//                         case "add":

//                         break;

//                         case "remove":

//                         break;

//                         case "delete":

//                         break;
//                     }
//                 break;
//                 }
//             default:
//                 console.log("try again")
//         }


//     }
// }