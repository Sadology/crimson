const { MessageEmbed, MessageActionRow, MessageSelectMenu, MessageButton } = require('discord.js')
const wait = require('util').promisify(setTimeout);
const { SlashCommandBuilder } = require('@discordjs/builders');
const ms = require('ms');

class HelpManuManager{
    constructor(client, guild, interaction){
        this.client = client;
        this.guild = guild;
        this.interaction = interaction;
    }

    Mainpage(){
        const MainMenu = new MessageEmbed()
        .setAuthor({name: `${this.client.user.username} • Help Menu`, iconURL: this.client.user.avatarURL({dynamic: true, size: 1024, format: 'png'})})
        .setDescription(`<:help:1011170600754085930> • Categories you can check \n\n<:admin:1011184540498284544> • **Admininstration** _Manage server more efficiently with admin cmds_ \n<:staff:1011186336058843266><:staff:1011186338533494814> • **Moderation** _Fast & efficient cmds to help the moderators_\n<:settings:1011184939657605162> • **Configuration** _Configure ${this.client.user.username} in your server_\n<a:funny:966983540187213867> • **Fun** _Funny commands to make your day better\n<:utility:915457793618739331>_ • **Utils** _Useful commands for daily basis_ \n\n[support server](https://discord.gg/vA8cVu8cR2) • Invite me`)
        .setColor("#2f3136")

        this.interaction.reply({embeds: [MainMenu]})
    }

    async Mainframe(type, name){
        if(type){
            return this.CategoryHandle(type)
        }
        else {
            return this.Mainpage()
        }
    } 
    
    // Administration category format
    CategoryHandle(type){
        let CommandData = [];
        this.client.SlashCmd.forEach(data => {
            console.log(data)
            if(data.category && data.category == type){
                CommandData.push(`\` ${data.data.name} \``)
            }
        })

        let Embed = new MessageEmbed()
            .setAuthor({name: `${this.client.user.username} • ${type}`, iconURL: this.client.user.displayAvatarURL({dynamic: true, format: 'png'})})
            .setColor("#2f3136")
            .setDescription(`**Commands** [${CommandData.length}] \n${CommandData.length == 0 ? "None" : CommandData.join(' • ')}`)

        this.interaction.reply({embeds: [Embed]})
    }
}

module.exports.run = {
    run: async(client, interaction, args, prefix) =>{
        const {options} = interaction;
        let cat = options.getString('category');

        let Data = new HelpManuManager(client, interaction.guild, interaction).Mainframe(cat);
    }
}

module.exports.slash = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription("Don't know how bot works? we got your back")
    .addStringOption(option =>
        option.setName('category')
        .setDescription("Select a category to start exploring")
        .addChoices(
            {
                name: 'Administration',
                value: 'Administration'
            },
            {
                name: 'Moderation',
                value: 'Moderation'
            },
            {
                name: 'Configuration',
                value: 'Configuration'
            },
            {
                name: 'Fun',
                value: 'Fun'
            },
            {
                name: 'Utility',
                value: 'Utility'
            },
        )
        ),
    category: "Utility",
}