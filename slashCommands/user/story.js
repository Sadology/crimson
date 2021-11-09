const { SlashCommandBuilder } = require('@discordjs/builders');
const wait = require('util').promisify(setTimeout);
const Discord = require('discord.js');
const { GuildChannel } = require('../../models/');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('my-story')
        .setDescription('create your own story')
        .addStringOption(option => 
            option.setName('options')
            .addChoice('create', 'createStory')
            .addChoice('delete', 'deleteStory')
            .setDescription('create or delete an exisiting story.')
            .setRequired(true))
        .addStringOption(option => 
            option.setName('message')
            .setDescription('Post sweet messages :)'))
        .addStringOption(option => 
            option.setName('image-link')
            .setDescription('You can add a image on your story.')),
    run: async(client, interaction) =>{
        const { options } = interaction;
        
        const message = options.getString('message');
        const image = options.getString('image-link');

        findLogChannel()
        async function findLogChannel() {
            let ifLogChannel = await GuildChannel.findOne({
                guildID: interaction.guild.id,
                Active: true,
                [`Data.name`]: "myStoryLog"
            })

            if(!ifLogChannel){
                return interaction.reply("This server doesn't have My Story plugin enabled")
            }

            let data = ifLogChannel.Data.find(i => i.name == "myStoryLog")
            let c = interaction.guild.channels.cache.get(data.channel);

            const hooks = await c.fetchWebhooks();
            const webHook = hooks.find(i => i.owner.id == client.user.id && i.name == 'sadbot')

            if(!webHook){
                c.createWebhook("sadbot", {
                    avatar: "https://i.ibb.co/86GB8LZ/images.jpg"
                })
            }

            webHook.send({
                username: interaction.user.username,
                avatarURL: interaction.user.avatarURL({dynamic: false, size: 1024, type: 'png'}),
                content: message
            })

            interaction.reply("Done")
        }
    }
}