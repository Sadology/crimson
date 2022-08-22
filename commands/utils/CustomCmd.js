const { SlashCommandBuilder } = require('@discordjs/builders');
const {MessageActionRow, MessageSelectMenu, MessageButton} = require('discord.js');
const wait = require('util').promisify(setTimeout);
const { Modal, TextInputComponent, SelectMenuComponent } = require('discord-modals');

class CommandBuilder{
    constructor(client, guild, interaction) {
        this.client = client;
        this.guild = guild;
        this.interaction = interaction;
    }

    async Mainframe(){
        const modal = new Modal()
            .setCustomId('customcommand')
            .setTitle('Custom-Command')
            .addComponents(
                new TextInputComponent()
                .setCustomId('name')
                .setLabel('Command')
                .setStyle('SHORT')
                .setMaxLength(10)
                .setRequired(true),

                new TextInputComponent()
                .setCustomId('desc')
                .setLabel('Description')
                .setMaxLength(200)
                .setStyle('PARAGRAPH'),

                new SelectMenuComponent()
                .setCustomId('type')
                .setPlaceholder('Response Type')
                .addOptions(
                    {
                        label: "Default",
                        description: "Send response in message",
                        value: "default",
                    },
                    {
                        label: "Embed",
                        description: "Send response in embed",
                        value: "embed",
                    }
                )
            );

            await this.interaction.showModal(modal)
    }
}
// const row = new MessageActionRow()
//     .setComponents(
//         new MessageSelectMenu()
//             .setCustomId('customcmd')
//             .setMinValues(1)
//             .setPlaceholder("Select")
//             .addOptions([
//                 {
//                     label: "yes",
//                     description: "yes",
//                     value: "yes"
//                 },
//                 {
//                     label: "no",
//                     description: "no",
//                     value: "no"
//                 },
//             ])
//     )
// class CustomCommand{
//     constructor(client, guild, interaction){
//         this.client = client;
//         this.guild = guild;
//         this.interaction = interaction;
//     }
    
//     async MainFrame(){
//         this.interaction.deferReply();
//         await wait(1000);

//         const filter = (button) => {
//             return button.member.user.id == this.interaction.member.id;
//         }

//         this.interaction.editReply({
//             content: "yes", components: [row]
//         }).then((m) => {
//             let collector = m.createMessageComponentCollector({filter, time: 1000 * 60})

//             collector.on('collect', (b) => {
//                 console.log(b)
//             })
//         }) 
//     }
// }
module.exports.run = {
    run: async(client, interaction, args,prefix) =>{
        let data = new CommandBuilder(client, interaction.guild, interaction).Mainframe()
    }
}

module.exports.slash = {
    data: new SlashCommandBuilder()
        .setName('custom-cmd')
        .setDescription("Create custom cmd"),
    category: "Utility",
}