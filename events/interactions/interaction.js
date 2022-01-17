const Discord = require('discord.js');
const { Guild } = require('../../models');
let cmdMap;
let rolemap;

module.exports = {
    event: 'interactionCreate',
    once: false,
    run: async(interaction, client) =>{
        return
        if(!interaction.isCommand()) return;
        let slashCmd = client.slash.get(interaction.commandName)
        if(!slashCmd) return client.slash.delete(interaction.commandName)

        let settings = await Guild.findOne({
            guildID: interaction.guild.id
        })

        const { Modules, Commands, Roles} = settings;
        cmdMap = Commands.get(slashCmd.data.name.toLowerCase());

        if(Roles){
            rolemap = Roles
        }

        if( ModuleManager(slashCmd, Modules, Commands) == false ) return;
        if( BotManager(slashCmd, interaction, client) == false ) return;
        if( PermissionManager(slashCmd, interaction) == false ) return;
        if( ChannelManager(interaction) == false) return;

        RunCommand()
        function RunCommand(){
            try {
                slashCmd.run(client, interaction)
            }catch(err) {
                interaction.channel.send({embeds: [
                    new Discord.MessageEmbed()
                    .setDescription(err.message)
                    .setColor("RED")
                    ]}).catch(err => {return console.log(err.stack)})
                return console.log(err.stack)
            }
        }
    }
}

function ChannelManager(interaction){
    if(interaction.member.permissions.has(["ADMINISTRATOR"])){
        return true
    }
    else if(cmdMap){
        let allowed = cmdMap.AllowedChannel
        let ignored = cmdMap.NotAllowedChannel

        if(ignored && ignored.length){
            if(ignored.includes(interaction.channel.id)) return false
        }
        if(allowed && allowed.length){
            if(allowed.includes(interaction.channel.id)) return true
            else return false
        }

        else return true
    }else return true
}

function PermissionManager(cmd, interaction){
    if(interaction.member.permissions.has(["ADMINISTRATOR"])){
        return true
    }
    if(!cmdMap){
        if(interaction.member.permissions.has(cmd.permissions, false)){
            return true
        }else if(interaction.channel.permissionsFor(interaction.member).has(cmd.permissions, false)){
            return true
        }else {
            return additionalPerms(cmd, interaction)
        }
    }

    else {
        if(interaction.member.roles.cache.some(r => cmdMap.NotAllowedRole?.includes(r.id))){
            if(interaction.member.roles.cache.some(r => cmdMap.Permissions?.includes(r.id))){
                return true
            }else return false
        }
        else if(interaction.member.roles.cache.some(r => cmdMap.Permissions?.includes(r.id))){
            return true
        }
        else if(interaction.member.permissions.has(cmd.permissions, false)){
            return true
        }
        else if(interaction.channel.permissionsFor(interaction.member).has(cmd.permissions, false)){
            return true
        }
        else {
            return additionalPerms(cmd, interaction)
        }
    }
}

function additionalPerms(cmd, interaction){
    if(rolemap){
        if(rolemap.has('manager')){
            let managerData = rolemap.get('manager')

            if(interaction.member.roles.cache.some(r => managerData?.includes(r.id))){
                return true
            }else {
                if(cmd.category.toLowerCase() == 'moderation'){
                    if(!rolemap.has('moderator')) return false

                    let moderData = rolemap.get('moderator')
                    if(interaction.member.roles.cache.some(r => moderData?.includes(r.id))){
                        return true
                    }else return false
                }else return false
            }
        }else {
            if(cmd.category.toLowerCase() == 'moderation'){
                if(!rolemap.has('moderator')) return false

                let moderData = rolemap.get('moderator')
                if(interaction.member.roles.cache.some(r => moderData?.includes(r.id))){
                    return true
                }else return false
            }
        }
    }else return false
}

function BotManager(cmd, interaction, client){
    if(cmd.botPermission){
        if(!interaction.guild.me.permissions.has(cmd.botPermission)){
            if(interaction.channel.permissionsFor(client.user).has(cmd.botPermission, false)){
                return true
            }
            let missings = interaction.guild.me.permissions.missing(cmd.botPermission)
            interaction.reply({
                embeds: [
                    new Discord.MessageEmbed()
                    .setDescription(`<:error:921057346891939840> Missing Permissions\n\n> ${missings.join(", ").toLowerCase()}`)
                    .setColor("RED")
                ]
            }).catch(err => {
                interaction.reply(err.message).catch(err => {return console.log(err.stack)})
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
        if(commands.has(cmd.data.name.toLowerCase())){
            let cmdData = commands.get(cmd.data.name.toLowerCase())
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