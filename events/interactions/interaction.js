const Discord = require('discord.js');
const client = require('../../index');

class interactionManager{
    constructor(interaction){
        this.interaction = interaction;
    }

    Main(){
        if(!this.interaction.isCommand()) return;
        this.slashCommand = client.SlashCmd.get(this.interaction.commandName);
        if(!this.slashCommand) return client.SlashCmd.delete(this.interaction.commandName);
        this.builder = new this.slashCommand.CommandBuilder();

        let clientPerm = this.PermissionManager();
        let userPerm = this.ClientPermissionManager();

        if(!clientPerm || !userPerm){
            return;
        }

        this.ExecuteCommand();
    }

    ExecuteCommand(){
        try {
            let cmd = new this.slashCommand.Main(client, this.interaction).Mainframe();
        } catch(err) {
            this.interaction.channel.send({embeds: [
                new Discord.MessageEmbed()
                .setDescription(err.message)
                .setColor("RED")
                ]}).catch(err => {return console.log(err.stack)})
            return console.log(err.stack)
        }
    }

    PermissionManager(){
        return true
    }

    ClientPermissionManager(){
        if(!this.builder.ClientPermissions){
            return true;
        };
    
        if(this.interaction.guild.me.permissions.has(["ADMINISTRATOR"], true)){
            return true;
        };
    
        let missing = this.interaction.guild.me.permissions.missing(this.builder.ClientPermissions);
        missing = missing.join(', ');
        missing = missing.replace(/_/g, '-');
    
        if(this.interaction.guild.me.permissions.has(this.builder.ClientPermissions)){
            return true;
        }
        else {
            this.interaction.reply({
                embeds: [new Discord.MessageEmbed()
                    .setAuthor({name: `Missing permissions`, iconURL: this.interaction.guild.me.displayAvatarURL({dynamic: true, format: 'png'})})
                    .setDescription(`**Bot require**\n<:reply:1011174493252755537>${missing.toLowerCase()}`)
                    .setColor("#2f3136")
                ],
                ephemeral: true
            }).catch(err => {
                console.log(err.stack)
            });
    
            return false;
        };
    }
}
client.on('interactionCreate', async(interaction) => {
    let intCreate = new interactionManager(interaction).Main();
})

function UserPerms(cmd, interaction){
    if(!cmd.Permissions){
        return true;
    }

    if(interaction.member.permissions.has(["ADMINISTRATOR"], true)){
        return true;
    };

    let missing = interaction.member.permissions.missing(cmd.Permissions);
    missing = missing.join(', ');
    missing = missing.replace(/_/g, '-');

    if(interaction.member.permissions.any(cmd.Permissions)){
        return true;
    }else {
        interaction.reply({
            embeds: [new Discord.MessageEmbed()
                .setAuthor({name: `Missing permissions`, iconURL: interaction.member.user.displayAvatarURL({dynamic: true, format: 'png'})})
                .setDescription(`**Require any of the following permissions**\n<:reply:1011174493252755537>${missing.toLowerCase()}`)
                .setColor("#2f3136")
            ],
            ephemeral: true
        }).catch(err => {
            console.log(err.stack)
        });

        return false;
    };
}