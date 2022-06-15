const { SlashCommandBuilder } = require('@discordjs/builders');
const wait = require('util').promisify(setTimeout);
const {MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu} = require('discord.js');

const row = new MessageActionRow()
    .addComponents(
        new MessageSelectMenu()
            .addOptions([
                {
                    label: "Name",
                    value: "name",
                    description: "Name of the item",
                }, 
                {
                    label: "Description",
                    value: "description",
                    description: "Description of the item",
                }
            ])
            .setCustomId('createitem')
            .setPlaceholder("Select all the option you will need")
            .setMinValues(1)
    )
class ItemCreate{
    constructor(client, guild, interaction){
        this.client = client;
        this.guild = guild;
        this.interaction = interaction;
    }

    async Mainframe(){
        this.interaction.deferReply()
        await wait(1000);

        this.interaction.editReply({
            embeds: [new MessageEmbed()
                .setDescription("Select")
            ],
            components: [row]
        })
        .then(m => {
            const filter = (button) => button.member.user.id == this.interaction.member.id;
            let collector = m.createMessageComponentCollector({filter, time: 1000 * 60 * 5})

            collector.on('collect', (button) => {
                console.log(button)
            })
        })
    }
}
module.exports.run = {
    run: async(client, interaction, args,prefix) =>{
        let data = new ItemCreate(client, interaction.guild, interaction).Mainframe() 
    }
}
module.exports.slash = {
    data: new SlashCommandBuilder()
        .setName('item')
        .setDescription("Create/edit/delete an item from shop")
        .addSubcommand(cmd =>
            cmd.setName('create')
            .setDescription("Create an item for shop")
        )
        
}