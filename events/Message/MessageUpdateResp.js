const Discord = require('discord.js');
const { Guild, GuildRole } = require('../../models');
let config = require('../../config.json');
const { Permissions } = require('discord.js');
const ms = require('ms');
let TimeOut = new Map()

module.exports = {
    event: 'messageUpdate',
    once: false,
    run: async(oldMessage, message, client) =>{
    try {
        if(message.author.bot) return;
        if(message.channel.type === 'dm') return;

        let settings = await Guild.findOne({guildID: message.guild.id})

        const prefix = settings ? settings.prefix : config.default_prefix
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
        
        if (command){
            const hasPermissionInChannel = message.channel
                .permissionsFor(client.user)
                .has('SEND_MESSAGES', false);
            if (!hasPermissionInChannel) {
                return
            }
            cooldownSet(command, message).then(timer => { //Set Cooldown
                if(timer == false){
                    return
                }else {
                    checkPermission(command, message).then(data => { // Checking User Permissions
                        if(data == false){
                            return;
                        }else {
                            checkBotPerms(command, message).then(i => { // Checking Bots Permissions
                                if(i == false){
                                    return;
                                }else {
                                    try{
                                        command.run(client, message, args, prefix, cmd)
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
                                    deleteAfterRun(command, message)
                                }
                            })
                        }
                    })
                }
            })
        }
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
}
    
async function checkPermission(command, message){
    if(command.permissions){
        let AccessGranted = true;
        if(!message.member.permissions.any(command.permissions)){
            await GuildRole.findOne({
                guildID: message.guild.id,
                Active: true,
            })
            .then(async (res) => {
                if(res){
                    let data = res.Roles.find(i => i.Name == "manager")
                    let rolesData = data.Roles;

                    if(!message.member.roles.cache.some(r=> rolesData.includes(r.id))){
                        if(command.category == 'Moderation'){
                            let data = res.Roles.find(i => i.Name == "moderator")
                            let rolesData = data.Roles;
                            if(!message.member.roles.cache.some(r=> rolesData.includes(r.id))){
                                dataToSend().then(i => {
                                    return AccessGranted = i
                                })
                            }
                        }else {
                            dataToSend().then(i => {
                                return AccessGranted = i
                            })
                        }
                    }
                }
            })
            .catch(err => {
                return console.log(err.stack)
            })

            async function dataToSend(){
                let item = message.member.permissions.serialize()
                let missing = []
                let data = command.permissions
                data.forEach(el => {
                    if(item[el] == false){
                        missing.push(" "+el.split('_').join(" ").toLowerCase())
                    }
                });
    
                message.channel.send({
                    embeds: [
                        new Discord.MessageEmbed()
                        .setDescription(`**Missing Permissions to use this command** \n\nRequire any of the following permission to use this command\n\`\`\`${missing}\`\`\``)
                        .setColor("RED")
                    ]
                })
                return false
            }
            return AccessGranted;
        }else {
            return AccessGranted
        }
    }
}
async function checkBotPerms(command, message){
    if(command.botPermission){
        if(!message.guild.me.permissions.has(command.botPermission)){
            message.channel.send({
                embeds: [
                    new Discord.MessageEmbed()
                    .setDescription(`Bot Require following permissions to execute this command \n\n\`\`\`${command.botPermission.join(", ").toLowerCase()}\`\`\``)
                    .setColor("RED")
                ]
            })
            return false;
        }
    }
    
}
function deleteAfterRun(command, message){
    if(command.delete == true){
        if(message.guild.me.permissions.has('MANAGE_MESSAGES')){
            message.delete()
            .catch(err => {
                console.log(err.message)
                })
        }
    }
}

async function cooldownSet(command, message){
    if(!command.cooldown) return true

    if(!TimeOut.has(command.name)){
        TimeOut.set(command.name, new Discord.Collection())
    }

    let currentTime = Date.now();
    let TimeStamp = TimeOut.get(command.name);
    let coolDownAmount = command.cooldown;

    if(TimeStamp.has(message.author.id)){
        let expirationTime = TimeStamp.get(message.author.id) + coolDownAmount;

        if(currentTime < expirationTime){
            let TimeLeft = (expirationTime - currentTime)

            message.channel.send({embeds: [
                new Discord.MessageEmbed()
                    .setAuthor(message.author.tag, message.author.avatarURL({dynamic: true, type: 'png', size: 1024}))
                    .setDescription(`You can use the command again in \`${ms(TimeLeft, {long: true})}\``)
                    .setColor("RED")
            ]}).then((m) => {
                setTimeout(() => {
                    if (!m.deleted) {
                        m.delete()
                        .catch(err => {
                            console.log(err.message)
                        })
                    }
                }, 1000 * 3)
            })
            return false
        }
    }

    TimeStamp.set(message.author.id, currentTime)
    setTimeout(() => TimeOut.delete(message.author.id), coolDownAmount)
}