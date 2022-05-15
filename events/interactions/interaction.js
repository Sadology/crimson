const Discord = require('discord.js');
const client = require('../../index');

client.on('interactionCreate', async(interaction) => {
    try {
        if(!interaction.isCommand()) return;
        let slashCmd = client.SlashCmd.get(interaction.commandName)
        if(!slashCmd) return client.SlashCmd.delete(interaction.commandName)

        let clientPerm = ClientPerms(slashCmd, interaction);
        let userPerm = UserPerms(slashCmd, interaction);

        if(!clientPerm || !userPerm){
            return;
        }

        RunCommand()
        function RunCommand(){
            try {
                slashCmd.run(client, interaction)
            } catch(err) {
                interaction.channel.send({embeds: [
                    new Discord.MessageEmbed()
                    .setDescription(err.message)
                    .setColor("RED")
                    ]}).catch(err => {return console.log(err.stack)})
                return console.log(err.stack)
            }
        }
    }catch(err){
        interaction.reply({embeds: [new Discord.MessageEmbed()
            .setDescription(err.message)
            .setColor("RED")
        ]})
        return console.log(err.stack)
    };
})

function ClientPerms(cmd, interaction){
    if(!cmd.ClientPermissions){
        return true;
    };

    if(interaction.guild.me.permissions.has(["ADMINISTRATOR"], true)){
        return true;
    };

    let missing = interaction.guild.me.permissions.missing(cmd.ClientPermissions);
    missing = missing.join(', ');
    missing = missing.replace(/_/g, '-');

    if(interaction.guild.me.permissions.has(cmd.ClientPermissions)){
        return true;
    }else {
        interaction.reply({
            embeds: [new Discord.MessageEmbed()
                .setAuthor({name: `Missing permissions`, iconURL: interaction.guild.me.displayAvatarURL({dynamic: true, format: 'png'})})
                .setDescription(`**Bot require**\n<:reply:897083777703084035>${missing.toLowerCase()}`)
                .setColor("#2f3136")
            ],
            ephemeral: true
        }).catch(err => {
            console.log(err.stack)
        });

        return false;
    };
};

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
                .setDescription(`**Require any of the following permissions**\n<:reply:897083777703084035>${missing.toLowerCase()}`)
                .setColor("#2f3136")
            ],
            ephemeral: true
        }).catch(err => {
            console.log(err.stack)
        });

        return false;
    };
}