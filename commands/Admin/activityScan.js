const {MessageEmbed} = require('discord.js');
const { SlashCommandBuilder } = require('@discordjs/builders');

class ActivityScanner{
    constructor(client, guild, interaction){
        this.client = client;
        this.guild = guild;
        this.interaction = interaction;
    }

    async MainFrame(type){
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

        this.interaction.reply({embeds: [
            new MessageEmbed()
            .setAuthor({name: "Filter • "+type})
            .setColor("#2f3136")
            .setDescription(MemberList.length == 0 ? "None" : MemberList.join('\n'))
        ]})
    }
}

module.exports.run = {
    run: async(client, interaction, args,prefix) =>{
        let type = interaction.options.getString('type');

        let data = new ActivityScanner(client, interaction.guild, interaction).MainFrame(type)

    }
}

module.exports.slash = {
    data: new SlashCommandBuilder()
        .setName('scan-activity')
        .setDescription('Scan members activity of the server')
        .addStringOption(option =>
            option
            .setName('type')
            .setDescription("Type of presence")
            .setRequired(true)),
    category: "Administration",
    Permissions: ["ADMINISTRATOR"],
}