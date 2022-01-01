const Discord = require('discord.js');
const { Guild, GuildRole } = require('../../models');
let TimeOut = new Map();
let cmdMap

module.exports = {
    event: 'messageCreate',
    once: false,
    run: async(message, client) =>{
    try {
        startTime = performance.now()
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

        const { Modules, Commands } = settings;
        if (command){
            cmdMap = Commands.get(command.name.toLowerCase());
            const hasPermissionInChannel = message.channel
                .permissionsFor(client.user)
                .has('SEND_MESSAGES', false);
            if (!hasPermissionInChannel) {
                return message.member.send("Hey im missing permissions to execute any commands")
                .catch(err => {return console.log(err.stack)})
            }

            ModuleManager(command, Modules, Commands, message)
            .catch(err => {return console.log(err.stack)})
        }

        function RunCommand(){
            try{
                cooldownManager(command, message).then(data => {
                    if(data == false) return
                    command.run(client, message, args, prefix, cmd).catch(err => {
                        message.channel.send({embeds: [
                            new Discord.MessageEmbed()
                                .setDescription(err.message)
                                .setColor("RED")
                        ]}).catch(err => {return console.log(err.stack)})
                        return console.log(err.stack)
                    })
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

        async function ChannelManager(message){
            let allowed = cmdMap.AllowedChannel
            let ignored = cmdMap.NotAllowedChannel
            let data = true
        
            if(ignored.length){
                let c1 = ignored.find(c => c == message.channel.id)
                if(c1){
                    data = false
                }
            }
        
            if(allowed.length){
                let c2 = allowed.find(c => c == message.channel.id)
                if(!c2){
                    data = false
                }
            }
        
            return data
        }
        
        async function PermissionManager(cmd, message){
            if(message.member.permissions.has(["ADMINISTRATOR"])){
                RunCommand()
            }
            else if(!message.member.roles.cache.some(r => cmdMap.NotAllowedRole.includes(r.id))){
                ChannelManager(message).then(async data => {
                    if(data == false) return
        
                    if(message.member.roles.cache.some(r => cmdMap.Permissions.includes(r.id))){
                        return RunCommand()
                    }else {
                        await GuildRole.findOne({
                            guildID: message.guild.id,
                        })
                        .then(res =>{
                            if(res){
                                function managerType(){
                                    let data = res.Roles.find(i => i.Name.toLowerCase() == "manager");
                                    if(!data){
                                        ModType()
                                    }else {
                                        let rolesData = data.Roles; 
                                        if(message.member.roles.cache.some(r=> rolesData.includes(r.id))){
                                            return RunCommand()
                                        }else {
                                            checkRolePerm()
                                        }
                                    }
                                }

                                function ModType(){
                                    if(cmd.category){
                                        if(cmd.category.toLowerCase() == 'moderation'){
                                            let data = res.Roles.find(i => i.Name.toLowerCase() == "moderator");
                                            if(data){
                                                RunCommand()
                                            }
                                        }else {
                                            checkRolePerm()
                                        }
                                    }
                                }
                                managerType()
                            }else {
                                checkRolePerm()
                            }
                        })
                        .catch(err => {return console.log(err.stack)})

                        function checkRolePerm(){
                            if(cmd.permissions){
                                if(message.member.permissions.any(cmd.permissions)){
                                    return RunCommand()
                                }
                            }
                        }
                    }
                }).catch(err => {return console.log(err.stack)})
            }
        }
        
        async function BotManager(cmd, message){
            if(message.guild.me.roles.cache.size == 1 && message.guild.me.roles.cache.find(r => r.name == '@everyone')){
                message.channel.send({
                    embeds: [
                        new Discord.MessageEmbed()
                        .setDescription(`Missing my discord assigned \`sadbot\` role to execute any commands 😔`)
                        .setColor("RED")
                    ]
                }).catch(err => {
                    return console.log(err.stack
                )})
                message.member.send({
                    embeds: [
                        new Discord.MessageEmbed()
                        .setDescription(`Missing my discord assigned \`sadbot\` role to execute any commands 😔`)
                        .setColor("RED")
                    ]
                }).catch(err => {
                    return console.log(err.stack
                )})

                return
            }
            if(cmd.botPermission){
                if(!message.guild.me.permissions.has(cmd.botPermission)){
                    message.channel.send({
                        embeds: [
                            new Discord.MessageEmbed()
                            .setDescription(`Bot Require following permissions to execute this command \n\n${cmd.botPermission.join(", ").toLowerCase()}`)
                            .setColor("RED")
                        ]
                    }).catch(err => {
                        message.channel.send(err.message).catch(err => {return console.log(err.stack)})
                        return console.log(err.stack)})
                }else {
                    return PermissionManager(cmd, message)
                }
            }
        }
        
        async function ModuleManager(cmd, modules, commands, message){
            if(cmd.category){
                if(cmd.category.toLowerCase() == 'owner'){
                    return RunCommand()
                }
                let moduleData = modules.get(cmd.category.toLowerCase())
                if(moduleData){
                    if(moduleData.Enabled == true){  
                        let cmdData = commands.get(cmd.name.toLowerCase())
                        if(cmdData) {
                            if( cmdData.Enabled == true){
                                BotManager(cmd, message)
                            }
                        }
                    }
                }
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

async function cooldownManager(cmd, message){
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
            message.reply({content: "Calm down buddy."}).then((m) => {
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