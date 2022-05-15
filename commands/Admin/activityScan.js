const {MessageEmbed} = require('discord.js')
class ActivityScanner{
    constructor(client, guild, interaction){
        this.client = client;
        this.guild = guild;
        this.interaction = interaction;
    }

    async MainFrame(){
        let type;
        type = this.interaction.content.split(/ +/g).slice(1).join(' ')
        type = type.toLowerCase();
        
        let MemberList = [];

            this.guild.members.cache.forEach(m => {
                if(!m.presence || m.presence == null) return;

                let status = m.presence.activities[0]; 
                if(!status || status == null) return;
                
                if(!type){
                    if(status.state){
                        return MemberList.push(`**${m.user.username}** •  ${status.details ? status.details + ' - ' : ''} ${status.state}`)
                    }
                    return MemberList.push(`**${m.user.username}** • ${status.details == null ? status.name : status.details }`)
                }

                let statusName;
                statusName = status.name.toLowerCase();
                let regex = new RegExp(type, "g");

                if(status.type.toLowerCase() == type){
                    MemberList.push(`**${m.user.username}** • ${status.details == null ? status.name : status.details }`)
                }

                else if(statusName.match(regex)){
                    MemberList.push(`**${m.user.username}** • ${status.details == null ? status.name : status.details}`)
                }

            })

        this.interaction.channel.send({embeds: [
            new MessageEmbed()
            .setAuthor({name: "Activity Type • "+type})
            .setColor("#2f3136")
            .setDescription(MemberList.length == 0 ? "None" : MemberList.join('\n'))
        ]})
    }
}

module.exports.run = {
    run: async(client, interaction, args,prefix) =>{
        // Switch the interaction type
        switch (interaction.type){
            // Slash command
            case 'APPLICATION_COMMAND':
                interactionFunc();
            break;

            // Default command
            case 'DEFAULT':
                messageFunc();
            break;
        };

        // Calling the log resolver class for slash command
        function interactionFunc(){
            let data = new ActionChannelManager(client, interaction.guild).BaseFrame(interaction)
        };

        // Calling the log resolver class for default command
        function messageFunc(){
            let data = new ActivityScanner(client, interaction.guild, interaction).MainFrame()
        };
    }
}

// module.exports.cmd = {
//     name: 'scan-status',
//     aliases: ['status-scan', 'scanstatus'],
//     description: "Action log of every moderation action taken by moderators",
//     permissions: ["MANAGE_MESSAGES"],
//     botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
//     usage: "logs [ member ]",
//     category: "Administration",
//     cooldown: 1000,
// }

// module.exports.slash = {
//     data: new SlashCommandBuilder()
//         .setName('action-log')
//         .setDescription('Setup action log channels for guild')
// }