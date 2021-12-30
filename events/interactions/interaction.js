const Discord = require('discord.js');
const { errLog } = require('../../Functions/erroHandling');
const { CustomCommand, Guild, GuildRole } = require('../../models');
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
        .catch(err => {return console.log(err.stack)})

        function RunCommand(){
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

        async function ChannelManager(Interaction){
            let allowed = cmdMap.AllowedChannel
            let ignored = cmdMap.NotAllowedChannel
            let data = true
        
            if(ignored.length){
                let c1 = ignored.find(c => c == Interaction.channel.id)
                if(c1){
                    data = false
                }
            }
        
            if(allowed.length){
                let c2 = allowed.find(c => c == Interaction.channel.id)
                if(!c2){
                    data = false
                }
            }
        
            return data
        }
        
        async function PermissionManager(cmd, Interaction){
            if(Interaction.member.permissions.has(["ADMINISTRATOR"])){
                RunCommand()
            }
            else if(!Interaction.member.roles.cache.some(r => cmdMap.NotAllowedRole.includes(r.id))){
                ChannelManager(Interaction).then(async data => {
                    if(data == false) return
        
                    if(Interaction.member.roles.cache.some(r => cmdMap.Permissions.includes(r.id))){
                        return RunCommand()
                    }else {
                        await GuildRole.findOne({
                            guildID: Interaction.guild.id,
                        })
                        .then(res =>{
                            if(res){
                                let data = res.Roles.find(i => i.Name.toLowerCase() == "manager");
                                if(!data){
                                    if(cmd.permissions){
                                        if(Interaction.member.permissions.any(cmd.permissions)){
                                            return RunCommand()
                                        }
                                    }
                                }else {
                                    let rolesData = data.Roles; 
                                    if(Interaction.member.roles.cache.some(r=> rolesData.includes(r.id))){
                                        return RunCommand()
                                    }else {
                                        if(cmd.permissions){
                                            if(Interaction.member.permissions.any(cmd.permissions)){
                                                return RunCommand()
                                            }
                                        }
                                    }
                                }
                            }else {
                                if(cmd.permissions){
                                    if(Interaction.member.permissions.any(cmd.permissions)){
                                        return RunCommand()
                                    }
                                }
                            }
                        })
                        .catch(err => {return console.log(err.stack)})
                    }
                }).catch(err => {return console.log(err.stack)})
            }
        }
        
        async function BotManager(cmd, Interaction){
            if(cmd.botPermission){
                if(Interaction.guild.me.roles.cache.size == 1 && Interaction.guild.me.roles.cache.find(r => r.name == '@everyone')){
                    Interaction.reply({
                        embeds: [
                            new Discord.MessageEmbed()
                            .setDescription(`Missing my discord assigned \`sadbot\` role to execute any commands 😔`)
                            .setColor("RED")
                        ]
                    }).catch(err => {return console.log(err.stack)})
                }
                if(!Interaction.guild.me.permissions.has(cmd.botPermission)){
                    Interaction.channel.send({
                        embeds: [
                            new Discord.MessageEmbed()
                            .setDescription(`Bot Require following permissions to execute this command \n\n${cmd.botPermission.join(", ").toLowerCase()}`)
                            .setColor("RED")
                        ]
                    }).catch(err => {return console.log(err.stack)})
                }else {
                    return PermissionManager(cmd, Interaction)
                }
            }
        }
        
        async function ModuleManager(cmd, modules, commands, Interaction){
            if(cmd.category){
                let moduleData = modules.get(cmd.category.toLowerCase())
                if(moduleData){
                    if(moduleData.Enabled == true){    
                        let cmdData = commands.get(cmd.data.name.toLowerCase())
                        if(cmdData) {
                            if( cmdData.Enabled == true){
                                BotManager(cmd, Interaction)
                            }
                        }
                    }
                }
            }
        }
    }
}