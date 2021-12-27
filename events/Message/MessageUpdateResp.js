const Discord = require('discord.js');
const { Guild, GuildRole } = require('../../models');
let TimeOut = new Map();
let cmdMap
const { performance } = require('perf_hooks')
let Errors = false

module.exports = {
    event: 'messageCreate',
    once: false,
    run: async(oldMessage, message, client) =>{
//     try {
//         startTime = performance.now()
//         if(message.author.bot) return;
//         if(message.channel.type === 'DM') return;

//         let settings = await Guild.findOne({
//             guildID: message.guild.id
//         })

//         const prefix = settings ? settings.prefix : ">"

//         if(!message.content.startsWith(prefix)) return
//         if(!prefix) return
//         if (!message.member){
//             message.member = await message.guild.fetchMember(message);
//         }

//         let args = message.content
//             .slice(prefix.length)
//             .trim()
//             .split(/ +/g);
        
//         const cmd = args.shift().toLowerCase();
//         if (cmd.length === 0) return;
//         let command = client.commands.get(cmd);
//         if (!command) command = client.commands.get(client.aliases.get(cmd));

//         const { Modules, Commands } = settings;
//         if (command){
//             cmdMap = Commands.get(command.name.toLowerCase());
//             const hasPermissionInChannel = message.channel
//                 .permissionsFor(client.user)
//                 .has('SEND_MESSAGES', false);
//             if (!hasPermissionInChannel) {
//                 return
//             }

//             ModuleManager(command, Modules, Commands, message)
//             BotManager(command, message)
//             PermissionManager(command, message)
//             coolDownManager(command, message)

//             console.log(Errors)
//             if(Errors == true){
//                 return Errors = false
//             }
//             if(Errors == false){
//                 try{
//                     command.run(client, message, args, prefix, cmd)
//                 }catch(err){
//                     message.channel.send({
//                         embeds: [
//                             new Discord.MessageEmbed()
//                             .setDescription(err.message)
//                             .setColor("RED")
//                         ]
//                     })
//                     return console.log(err.stack)
//                 }
//             }

//         }
//     }catch(err){
//         message.channel.send({
//             embeds: [
//                 new Discord.MessageEmbed()
//                 .setDescription(err.message)
//                 .setColor("RED")
//             ]
//             }).catch(err => {return console.log(err)})
//         return console.log(err.stack)
//     }
//     }
// }

// function deleteAfterRun(command, message){
//     if(command.delete == true){
//         if(message.guild.me.permissions.has('MANAGE_MESSAGES')){
//             message.delete()
//             .catch(err => {
//                 return console.log(err.stack)
//             })
//         }
//     }
// }

// function ChannelManager(data, message){
//     let allowed = data.AllowedChannel
//     let ignored = data.NotAllowedChannel

//     let c1 = ignored.find(c => c == message.channel.id)
//     let c2 = allowed.find(c => c == message.channel.id)
//     if(c1){
//         console.log("this is c1")
//         return Errors = true
//     }
//     if(!c2){
//         console.log("this is c2")
//         return Errors = true
//     }
// }
// async function PermissionManager(cmd, message){
//     if(message.guild.ownerId !== message.member.id || !message.member.permissions.has("ADMINISTRATOR")){
//         if(cmd.permissions){
//             ChannelManager(cmdMap, message)
//             IGRole()
//             function IGRole(){
//                 if(message.member.roles.cache.some(r => cmdMap.NotAllowedRole.includes(r.id))){
//                     console.log("this is not allowed")
//                     return Errors = true
//                 }else {
//                     rolePerms()
//                 }
//             }
//             async function rolePerms(){
//                 if(message.member.roles.cache.some(r => cmdMap.NotAllowedRole.includes(r.id))){
//                     console.log("this is not allowed")
//                     return Errors = true
//                 }else {
//                     if(!message.member.roles.cache.some(r => cmdMap.Permissions.includes(r.id))){
//                         if(!message.member.permissions.any(cmd.permissions)){
//                             await GuildRole.findOne({
//                                 guildID: message.guild.id,
//                             })
//                             .then(res =>{
//                                 if(res){
//                                     let data = res.Roles.find(i => i.Name.toLowerCase() == "manager");

//                                     if(data){
//                                         let rolesData = data.Roles; 
//                                         if(!message.member.roles.cache.some(r=> rolesData.includes(r.id))){
//                                             ModPerm(res)
//                                         }
//                                     }else {
//                                         return Errors = true 
//                                     }
//                                 }else {
//                                     return
//                                 }
//                             })
//                             .catch(err => {return console.log(err.stack)})
//                         }
//                     }
//                 }
//             }

//             function ModPerm(roledata){
//                 if(cmd.category.toLowerCase() == 'moderation'){
//                     let data = roledata.Roles.find(i => i.Name.toLowerCase() == "moderator")
//                     if(data){
//                         let rolesData = data.Roles;
//                         if(!message.member.roles.cache.some(r=> rolesData.includes(r.id))){
//                             console.log("this is mod")
//                             return Errors = true
//                         }
//                     }else {
//                         return Errors = true
//                     }
//                 }else {
//                     console.log("this is manager")
//                     return Errors = true
//                 }
//             }
//         }
//         var endTime = performance.now()
//         //console.log(`Call to doSomething took ${endTime - startTime} milliseconds`)
//     }
// }

// function BotManager(cmd, message){
//     if(cmd.botPermission){
//         if(message.guild.me.roles.cache.size == 1 && message.guild.me.roles.cache.find(r => r.name == '@everyone')){
//             message.reply({
//                 embeds: [
//                     new Discord.MessageEmbed()
//                     .setDescription(`Missing my discord assigned \`sadbot\` role to execute any commands 😔`)
//                     .setColor("RED")
//                 ]
//             }).catch(err => {return console.log(err.stack)})
//             console.log("this is bot no role")
//             return Errors = true
//         }
//         if(!message.guild.me.permissions.has(cmd.botPermission)){
//             message.channel.send({
//                 embeds: [
//                     new Discord.MessageEmbed()
//                     .setDescription(`Bot Require following permissions to execute this command \n\n${cmd.botPermission.join(", ").toLowerCase()}`)
//                     .setColor("RED")
//                 ]
//             }).catch(err => {return console.log(err.stack)})
//             console.log("this is bot missing perm")
//             return Errors = true
//         }
    }
}

function coolDownManager(cmd, message){
    if(cmd.cooldown){
        if(!TimeOut.has(cmd.name)){
            TimeOut.set(cmd.name, new Discord.Collection())
        }

        let currentTime = Date.now();
        let TimeStamp = TimeOut.get(cmd.name);
        let coolDownAmount = cmd.cooldown;

        if(TimeStamp.has(message.author.id)){
            let expirationTime = TimeStamp.get(message.author.id) + coolDownAmount;
            if(currentTime < expirationTime){
                message.reply({content: "Calm down for a bit"}).then((m) => {
                    setTimeout(() => {
                        m.delete().catch(err => {return console.log(err.stack)})
                    }, 1000 * 3)
                })
                .catch(err => {return console.log(err.stack)})
                console.log("this is cd")
                return Errors = true
            }
        }

        TimeStamp.set(message.author.id, currentTime)
        setTimeout(() => TimeOut.delete(message.author.id), coolDownAmount)
    }
}

function ModuleManager(cmd, modules, commands, message){
    if(cmd.category){
        let moduleData = modules.get(cmd.category.toLowerCase())
        if(moduleData){
            if(moduleData.Enabled == false){
                console.log("this is module")
                return Errors = true
            }
        }
    }
    let cmdData = commands.get(cmd.name.toLowerCase())
    if(cmdData) {
        if( cmdData.Enabled == false){
            console.log("this is cmd")
            return Errors = true
        }
    }
}