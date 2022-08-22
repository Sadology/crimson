const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { LogsDatabase } = require('../../models');

class EditReason{
    constructor(client, guild, interaction){
        this.client = client;
        this.guild = guild;
        this.interaction = interaction;
    }

    async FetchData(ID){
        let data = await LogsDatabase.findOne({
            guildID: this.guild.id,
            [`Action.caseID`]: ID
        })

        if(!data){
            data = await LogsDatabase.findOne({
                guildID: this.guild.id,
                [`Action.LogID`]: ID
            })
        }

        if(data) {
            return data;
        }

        else return false;
    }
    
    async Mainframe(Id, Reason){
        let data = await this.FetchData(Id)
        
        if(!data){
            return this.interaction.reply({embeds: [
                new MessageEmbed()
                    .setDescription(`<:error:1011174128503500800> LogId is invalid`)
                    .setColor("RED")
            ], ephemeral: true})
        }

        let matchLog = data.Action.find(data => data.caseID == Id)
        if(!matchLog){
            matchLog = data.Action.find(data => data.LogID == Id)
        }


        matchLog['actionReason'] = Reason
        this.UpdateLog(Id, matchLog)
    }

    async UpdateLog(ID, Data){
        await LogsDatabase.updateOne({
            guildID: this.guild.id,
            [`Action.caseID`]: ID
        }, {
            $pull: {
                Action: {
                    caseID: ID,
                }
            },
        })
        .catch(err => {return console.log(err.stack)})

        await LogsDatabase.updateOne({
            guildID: this.guild.id,
            [`Action.LogID`]: ID
        }, {
            $pull: {
                Action: {
                    LogID: ID
                }
            },
        })
        .catch(err => {return console.log(err.stack)})
            
        await LogsDatabase.updateOne({
            guildID: this.guild.id,
            userID: Data.userID
        }, {
            $push: {
                Action: Data
            },
        })
        .then(() =>{
            this.interaction.reply({embeds: [
                new MessageEmbed()
                    .setDescription(`<:check:1011170584996106300> Reason has been updated for LogId - **__${ID}__**`)
                    .setColor("#2f3136")
            ]})
        })
        .catch(err => {return console.log(err.stack)})
    }

}

module.exports.run = {
    run: async(client, interaction, args,prefix) =>{

        const {options} = interaction;
        let id = options.getString('log-id')
        let reason = options.getString('reason')

        let data = new EditReason(client, interaction.guild, interaction).Mainframe(id, reason)
    
    }
}

module.exports.slash = {
    data: new SlashCommandBuilder()
        .setName("edit-reason")
        .setDescription("Edit reason of a moderation log")
        .addStringOption(option => 
            option.setName('log-id')
            .setDescription("Log-id of the log you want to edit")
            .setRequired(true)
        )
        .addStringOption(option => 
            option.setName('reason')
            .setDescription("New reason to replace the old reason")
            .setRequired(true)
        ),
    category: "Administration",
    Permissions: ["MANAGE_GUILD"],
}