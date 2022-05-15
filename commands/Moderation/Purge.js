const Discord = require('discord.js');
const { GuildMember } = require('../../Functions');
const { SlashCommandBuilder } = require('@discordjs/builders');

class PurgeManager{
    constructor(client, channel, interaction){
        this.client = client;
        this.ArrayMsg = [];
        this.channel = channel;
        this.interaction = interaction;
    }

    async fetchMessages(Amt, data, word){
        await this.channel.messages.fetch({
            limit: 100
        }).then(async msg => {
            FilterTypes(msg, this.ArrayMsg, data, this.interaction)
        })

        function checkWord(interaction){
            if(!word){
                return interaction.reply({
                    embeds: [new Discord.MessageEmbed()
                        .setDescription("<:error:921057346891939840> You have to supply \"filter-message\" for this action")
                        .setColor("RED")]
                })
            }
        }

        function FilterTypes(messages, filterArray, data, interaction){
            console.log(data)
            if(!data){
                messages.forEach(items => {
                    return filterArray.push(...[items].filter((m)=> !m.pinned))
                })
            }

            else if(data.id || data.match(/([1-9])\d+/g)){
                let user = data.id ? data.id : data
                messages.forEach(items => {
                    return filterArray.push(...[items].filter((m)=> m.author.id == user && !m.pinned ))
                })
            }

            else {
                switch (data) {
                    case "bot":
                        messages.forEach(items => {
                            return filterArray.push(...[items].filter((m)=> m.author.bot && !m.pinned))
                        });
                    break;
                
                    case "human":
                        messages.forEach(items => {
                            return filterArray.push(...[items].filter((m)=> !m.author.bot && !m.pinned))
                        });
                    break;
    
                    case "start":
                        if(!word){
                            return checkWord(interaction);
                        }

                        messages.forEach(items =>{
                            return filterArray.push(...[items].filter(m => m.content.startsWith( word ) && !m.pinned))
                        });
                    break;
    
                    case "end":
                        if(!word){
                            return checkWord(interaction);
                        }

                        messages.forEach(items =>{
                            return filterArray.push(...[items].filter(m => m.content.endsWith( word ) && !m.pinned))
                        });
                    break;
    
                    case "match":
                        if(!word){
                            return checkWord(interaction);
                        }

                        messages.forEach(items =>{
                            return filterArray.push(...[items].filter(m => m.content.includes( word ) && !m.pinned))
                        });
                    break;

                    case 'not':
                        if(!word){
                            return checkWord(interaction);
                        }

                        messages.forEach(items =>{
                            return this.ArrayMsg.push(...[items].filter(m => !m.content.includes( word ) && !m.pinned))
                        });
                    break;
    
                    case "mention":
                        messages.forEach(items =>{
                            filterArray.push(...[items].filter(m => m.content.includes('<@!') && m.content.includes('>') && !m.pinned))
                        })
                    break;
    
                    case "link":
                        messages.forEach(items =>{
                            filterArray.push(...[items].filter(m => m.content.includes('https://') || m.content.includes('http://') && !m.pinned))
                        })
                    break;
    
                    default:
                        console.log("yes")
                };
            }
        }

        let sorted = this.ArrayMsg.slice(0, Amt)
        this.DeleteMessages(sorted)
    }

    async DeleteMessages(sortedMsg){
        return await this.channel.bulkDelete(sortedMsg, true)
        .then((d) => {
            this.interaction.reply({embeds: [new Discord.MessageEmbed()
                .setDescription(`Deleted **${d.size}** message`)
                .setColor("#2f3136")
            ], ephemeral: true})
        })
        .catch(err => {return console.log(err)})
    }

    erroMessage(embed){
        this.interaction.reply({embeds: [embed], ephemeral: true})
        .catch(err => {return console.log(err.stack)});
    }
}
module.exports.run = {
    run: async(client, interaction, args,prefix) =>{
        const {options} = interaction;

        let amt = options.getInteger('amount')
        let user = options.getUser('user')
        let filter = options.getString('filter')
        let word = options.getString('filter-msg')

        let data = new PurgeManager(client, interaction.channel, interaction).fetchMessages(amt, user ? user : filter, word)
    }
};


module.exports.slash = {
    data: new SlashCommandBuilder()
        .setName('purge')
        .setDescription("Purge bulk amount of messages")
        .addIntegerOption(option => 
            option.setName('amount')
            .setDescription("Amount of message to delete")
            .setMinValue(1)
            .setMaxValue(100)
            .setRequired(true))
        .addUserOption(option => 
            option.setName('user')
            .setDescription("Purge messages of a user"))
        .addStringOption(option => 
            option.setName('filter')
            .setDescription("Different filters in purge")
            .addChoices({name: "bot",value: "bot"},
            {name: "humans",value: "human"},
            {name: "starts-with",value: "start"},
            {name: "ends-with",value: "end"},
            {name: "match",value: "match"},
            {name: "mismatch",value: "not"},
            {name: "mentions",value: "mention"},
            {name: "links",value: "link"}))
        .addStringOption(option => 
            option.setName('filter-msg')
            .setDescription("The msg you want to filter (select a filter first)")),
    Permissions: ["MANAGE_MESSAGES"],
    ClientPermissions: ["MANAGE_MESSAGES"],
    Permissions: ["KICK_MEMBERS"],

}