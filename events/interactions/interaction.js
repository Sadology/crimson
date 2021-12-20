const Discord = require('discord.js');
const { errLog } = require('../../Functions/erroHandling');
const { CustomCommand, Guild, GuildRole } = require('../../models');
let config = require('../../config.json');

module.exports = {
    event: 'interactionCreate',
    once: false,
    run: async(interaction, client) =>{
        if(!interaction.isCommand()) return;
        slashCmd = client.slash.get(interaction.commandName)
        
        if(!slashCmd) return client.slash.delete(interaction.commandName)
        checkPermission(slashCmd, interaction).then(i =>{
            if(i == false) return
        
            checkBotPerms(slashCmd, interaction).then(i => {
                if(i == false) return

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
            })
        })
    }
}

async function checkPermission(command, interaction){
    if(slashCmd.permission){
        let AccessGranted = true;

        const memberPerms = interaction.channel.permissionsFor(interaction.member)
        if(!memberPerms || !memberPerms.any(slashCmd.permission)){
            await GuildRole.findOne({
                guildID: interaction.guild.id,
                Active: true,
            })
            .then(async (res) => {
                if(res){
                    let data = res.Roles.find(i => i.Name == "manager")
                    let rolesData = data.Roles;

                    if(!interaction.member.roles.cache.some(r=> rolesData.includes(r.id))){
                        dataToSend().then(i => {
                            return AccessGranted = i
                        })
                    }
                }
            })
            .catch(err => {
                return console.log(err.stack)
            })

            async function dataToSend(){
                let item = interaction.member.permissions.serialize()
                let missing = []
                let data = command.permission
                data.forEach(el => {
                    if(item[el] == false){
                        missing.push(" "+el.split('_').join(" ").toLowerCase())
                    }
                });
    
                const errorEmbed = new Discord.MessageEmbed()
                .setDescription(`You don't have "${missing}" permission to execute this command`)
                .setColor("RED")
                interaction.reply({embeds: [errorEmbed], ephemeral: true})

                return false
            }
            return AccessGranted;
        }else {
            return AccessGranted
        }
    }
}
async function checkBotPerms(command, interaction){
    if(command.botPermission){
        if(interaction.guild.me.roles.cache.size == 1 && interaction.guild.me.roles.cache.find(r => r.name == '@everyone')){
            interaction.user.send({
                embeds: [
                    new Discord.MessageEmbed()
                    .setDescription(`Hey i don't have any roles to execute any commands`)
                    .setColor("RED")
                ]
            }).catch(err => {return console.log(err.stack)})
            return false
        }
        if(!interaction.guild.me.permissions.has(command.botPermission)){
            interaction.reply({
                embeds: [
                    new Discord.MessageEmbed()
                    .setDescription(`Bot Requires following permissions to execute this command \n\n\`\`\`${command.botPermission.join(", ").toLowerCase()}\`\`\``)
                    .setColor("RED")
                ], ephemerl: true
            }).catch(err => {return console.log(err.stack)})
            return false;
        }
    }
}