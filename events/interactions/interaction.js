const Discord = require('discord.js');
const { errLog } = require('../../Functions/erroHandling');
const { CustomCommand, Guild, GuildRole } = require('../../models');
let Errors = false;
let cmdMap
module.exports = {
    event: 'interactionCreate',
    once: false,
    run: async(interaction, client) =>{
        if(!interaction.isCommand()) return;
        let slashCmd = client.slash.get(interaction.commandName)
        
        if(!slashCmd) return client.slash.delete(interaction.commandName)

        let settings = await Guild.findOne({
            guildID: interaction.guild.id
        })

        const { Modules, Commands } = settings;
        cmdMap = Commands.get(slashCmd.data.name.toLowerCase());
        ModuleManager(slashCmd, Modules, Commands, interaction)
        PermissionManager(slashCmd, interaction)
        BotManager(slashCmd, interaction)

        if(Errors == true){
            return Errors = false
        }else if(Errors == false){
            try {
                slashCmd.run(client, interaction)
            }catch(err) {
                interaction.channel.send({
                    embeds: [
                    new Discord.MessageEmbed()
                    .setDescription(err.message)
                    .setColor("RED")
                    ]
                }).catch(err => {return console.log(err.stack)})
                return console.log(err.stack)
            }
        }
    }
}

function ChannelManager(data, message){
    let allowed = data.AllowedChannel
    let ignored = data.NotAllowedChannel

    if(allowed.lenght){
        let c1 = ignored.find(c => c == message.channel.id)
        if(c1){
            console.log("this is c1")
            return Errors = true
        }
    }

    if(allowed.lenght){
        let c2 = allowed.find(c => c == message.channel.id)

        if(!c2){
            console.log("this is c2")
            return Errors = true
        }
    }
}

async function PermissionManager(cmd, message){
    if(message.guild.ownerId !== message.member.id || !message.member.permissions.has("ADMINISTRATOR")){
        if(cmd.permission){
            ChannelManager(cmdMap, message)
            IGRole()
            function IGRole(){
                if(message.member.roles.cache.some(r => cmdMap.NotAllowedRole.includes(r.id))){
                    console.log("this is not allowed")
                    return Errors = true
                }else {
                    rolePerms()
                }
            }
            async function rolePerms(){
                if(message.member.roles.cache.some(r => cmdMap.NotAllowedRole.includes(r.id))){
                    console.log("this is not allowed")
                    return Errors = true
                }else {
                    if(!message.member.roles.cache.some(r => cmdMap.Permissions.includes(r.id))){
                        if(!message.member.permissions.any(cmd.permission)){
                            await GuildRole.findOne({
                                guildID: message.guild.id,
                            })
                            .then(res =>{
                                if(res){
                                    let data = res.Roles.find(i => i.Name.toLowerCase() == "manager");

                                    if(data){
                                        let rolesData = data.Roles; 
                                        if(!message.member.roles.cache.some(r=> rolesData.includes(r.id))){
                                            ModPerm(res)
                                        }
                                    }else {
                                        return Errors = true 
                                    }
                                }else {
                                    return
                                }
                            })
                            .catch(err => {return console.log(err.stack)})
                        }
                    }
                }
            }

            function ModPerm(roledata){
                if(cmd.category.toLowerCase() == 'moderation'){
                    let data = roledata.Roles.find(i => i.Name.toLowerCase() == "moderator")
                    if(data){
                        let rolesData = data.Roles;
                        if(!message.member.roles.cache.some(r=> rolesData.includes(r.id))){
                            console.log("this is mod")
                            return Errors = true
                        }
                    }else {
                        return Errors = true
                    }
                }else {
                    console.log("this is manager")
                    return Errors = true
                }
            }
        }
        var endTime = performance.now()
        //console.log(`Call to doSomething took ${endTime - startTime} milliseconds`)
    }
}

function BotManager(cmd, message){
    if(cmd.botPermission){
        if(message.guild.me.roles.cache.size == 1 && message.guild.me.roles.cache.find(r => r.name == '@everyone')){
            message.reply({
                embeds: [
                    new Discord.MessageEmbed()
                    .setDescription(`Missing my discord assigned \`sadbot\` role to execute any commands 😔`)
                    .setColor("RED")
                ]
            }).catch(err => {return console.log(err.stack)})
            console.log("this is bot no role")
            return Errors = true
        }
        if(!message.guild.me.permissions.has(cmd.botPermission)){
            message.channel.send({
                embeds: [
                    new Discord.MessageEmbed()
                    .setDescription(`Bot Require following permissions to execute this command \n\n${cmd.botPermission.join(", ").toLowerCase()}`)
                    .setColor("RED")
                ]
            }).catch(err => {return console.log(err.stack)})
            console.log("this is bot missing perm")
            return Errors = true
        }
    }
}

function ModuleManager(cmd, modules, commands){
    if(cmd.category){
        let moduleData = modules.get(cmd.category.toLowerCase())
        if(moduleData){
            if(moduleData.Enabled == false){
                console.log("this is module")
                return Errors = true
            }
        }
    }
    let cmdData = commands.get(cmd.data.name.toLowerCase())
    if(cmdData) {
        if( cmdData.Enabled == false){
            console.log("this is cmd")
            return Errors = true
        }
    }
}