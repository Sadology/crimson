const Discord = require('discord.js');
const { Guild, GuildRole } = require('../../models');
let TimeOut = new Map();
let cmdMap;
let rolemap;

module.exports = {
    event: 'messageCreate',
    once: false,
    run: async(message, client) =>{
    try {
        if(message.author.bot) return;
        if(message.channel.type === 'DM') return;

        let settings = await Guild.findOne({
            guildID: message.guild.id
        })

        const prefix = settings ? settings.prefix : ">"

        if(!message.content.startsWith(prefix)) return
        if(!prefix) return
        if (!message.member){
            message.member = await message.guild.fetchMember(message);
        }

        let args = message.content
            .slice(prefix.length)
            .trim()
            .split(/ +/g);
        
        const cmd = args.shift().toLowerCase();
        if (cmd.length === 0) return;
        let command = client.commands.get(cmd);
        if (!command) command = client.commands.get(client.aliases.get(cmd));

        const { Modules, Commands, Roles } = settings;
        if (command){
            if(cooldownManager(command, message) == false) return ;
            cmdMap = Commands.get(command.name.toLowerCase());

            if(Roles){
                rolemap = Roles
            }

            const hasPermissionInChannel = message.channel
                .permissionsFor(client.user)
                .has('SEND_MESSAGES', false);
            if (!hasPermissionInChannel) {
                return message.member.send("Hey im missing permissions to execute any commands")
                .catch(err => {return console.log(err.stack)})
            }

            if( ModuleManager(command, Modules, Commands) == false) return;
            if( BotManager(command, message, client) == false) return;
            if( PermissionManager(command, message) == false) return;
            if( ChannelManager(message) == false) return;

            RunCommand()
        }

        function RunCommand(){
            try{
                command.run(client, message, args, prefix, cmd).catch(err => {
                    message.channel.send({embeds: [
                        new Discord.MessageEmbed()
                            .setDescription(err.message)
                            .setColor("RED")
                    ]}).catch(err => {return console.log(err.stack)})
                    return console.log(err.stack)
                })
                
                deleteAfterRun(command, message)
            }catch(err){
                message.channel.send({
                    embeds: [
                        new Discord.MessageEmbed()
                        .setDescription(err.message)
                        .setColor("RED")
                    ]
                })
                return console.log(err.stack)
                
            }
        }

        }catch(err){
            message.channel.send({
                embeds: [
                    new Discord.MessageEmbed()
                    .setDescription(err.message)
                    .setColor("RED")
                ]
                }).catch(err => {return console.log(err)})
            return console.log(err.stack)
        }
    }
}

function deleteAfterRun(command, message){
    if(command.delete == true){
        if(message.guild.me.permissions.has('MANAGE_MESSAGES')){
            message.delete()
            .catch(err => {
                return console.log(err.stack)
            })
        }
    }
}

function cooldownManager(cmd, message){
    if(!cmd.cooldown){
        return true
    }

    if(!TimeOut.has(cmd.name)){
        TimeOut.set(cmd.name, new Discord.Collection())
        return true
    }

    let currentTime = Date.now();
    let TimeStamp = TimeOut.get(cmd.name);
    let coolDownAmount = cmd.cooldown;

    if(TimeStamp.has(message.author.id)){
        let expirationTime = TimeStamp.get(message.author.id) + coolDownAmount;
        if(currentTime < expirationTime){
            message.reply({content: "Calm down buddy"}).then((m) => {
                setTimeout(() => {
                    m.delete().catch(err => {return console.log(err.stack)})
                }, 1000 * 3)
            })
            .catch(err => {return console.log(err.stack)})
            return false
        }
    }

    TimeStamp.set(message.author.id, currentTime)
    setTimeout(() => TimeOut.delete(message.author.id), coolDownAmount)
}

function ChannelManager(message){
    if(message.member.permissions.has(["ADMINISTRATOR"])){
        return true
    }
    else if(cmdMap){
        let allowed = cmdMap.AllowedChannel
        let ignored = cmdMap.NotAllowedChannel

        if(ignored && ignored.length){
            if(ignored.includes(message.channel.id)) return false
        }
        if(allowed && allowed.length){
            if(allowed.includes(message.channel.id)) return true
            else return false
        }
        else return true
    }else return true
}

function PermissionManager(cmd, message){
    if(cmd.category?.toLowerCase() == 'owner'){
        return true
    }
    if(message.member.permissions.has(["ADMINISTRATOR"])){
        return true
    }
    if(!cmdMap){
        if(message.member.permissions.any(cmd.permissions, false)){
            return true
        }else if(message.channel.permissionsFor(message.member).any(cmd.permissions, false)){
            return true
        }else {
            return additionalPerms(cmd, message)
        }
    }

    else {
        if(message.member.roles.cache.some(r => cmdMap.NotAllowedRole?.includes(r.id))){
            if(message.member.roles.cache.some(r => cmdMap.Permissions?.includes(r.id))){
                return true
            }else return false
        }
        else if(message.member.roles.cache.some(r => cmdMap.Permissions?.includes(r.id))){
            return true
        }
        else if(message.member.permissions.any(cmd.permissions, false)){
            return true
        }
        else if(message.channel.permissionsFor(message.member).any(cmd.permissions, false)){
            return true
        }
        else {
            return additionalPerms(cmd, message)
        }
    }
}

function additionalPerms(cmd, message){
    if(rolemap){
        if(rolemap.has('manager')){
            let managerData = rolemap.get('manager')

            if(message.member.roles.cache.some(r => managerData?.includes(r.id))){
                return true
            }else {
                if(cmd.category.toLowerCase() == 'moderation'){
                    if(!rolemap.has('moderator')) return false

                    let moderData = rolemap.get('moderator')
                    if(message.member.roles.cache.some(r => moderData?.includes(r.id))){
                        return true
                    }else return false
                }else return false
            }
        }else {
            if(cmd.category.toLowerCase() == 'moderation'){
                if(!rolemap.has('moderator')) return false

                let moderData = rolemap.get('moderator')
                if(message.member.roles.cache.some(r => moderData?.includes(r.id))){
                    return true
                }else return false
            }
        }
    }else return false
}

function BotManager(cmd, message, client){
    if(cmd.botPermission){
        if(!message.guild.me.permissions.has(cmd.botPermission)){
            if(message.channel.permissionsFor(client.user).has(cmd.botPermission, false)){
                return true
            }
            let missings = message.guild.me.permissions.missing(cmd.botPermission)
            message.channel.send({
                embeds: [
                    new Discord.MessageEmbed()
                    .setDescription(`<:error:921057346891939840> Missing Permissions\n\n> ${missings.join(", ").toLowerCase()}`)
                    .setColor("RED")
                ]
            }).catch(err => {
                message.channel.send(err.message).catch(err => {return console.log(err.stack)})
                return console.log(err.stack)
            })
            return false
        }else return true
    }else return true
}

function ModuleManager(cmd, modules, commands){
    if(cmd.category){
        if(cmd.category.toLowerCase() == 'owner'){
            return true
        }
        if(modules.has(cmd.category.toLowerCase())){
            let moduleData = modules.get(cmd.category.toLowerCase())
            if(moduleData.Enabled == false){
                return false
            }else return true
        }
        if(commands.has(cmd.name.toLowerCase())){
            let cmdData = commands.get(cmd.name.toLowerCase())
            if(cmdData.Enabled == false){
                return false
            }else return true 
        }else {
            return true
        }
    }else {
        return false
    }
}