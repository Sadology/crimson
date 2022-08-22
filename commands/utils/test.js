const { SlashCommandBuilder, userMention, memberNicknameMention } = require('@discordjs/builders');
const Discord = require('discord.js')
const axios = require('axios');
const {WebhookManager} = require('../../Functions')

module.exports.run = {
    run: async(client, interaction, args, prefix)=> {
        client.eventEmitter.emit('AuditAdd', {
            User: interaction.member,
            Guild: interaction.member.guild,
            Reason: `Warned sneee with reason: HI :)`,
            Date: new Date(),
            Command: "warn",
            Moderation: true
        });

        interaction.reply("done")
    }

}

module.exports.slash = {
    data: new SlashCommandBuilder()
        .setName('test')
        .setDescription("Test bot")
        .setDefaultPermission(false),
    privet: true,
    
}