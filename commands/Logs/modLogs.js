const Discord = require('discord.js');
const { LogsDatabase, GuildRole} = require('../../models');
const moment = require('moment');
const { MessageActionRow, MessageButton, MessageEmbed } = require('discord.js')
const { Member } = require('../../Functions');
const row = new MessageActionRow()
.addComponents(
    new MessageButton()
        .setStyle("SUCCESS")
        .setLabel("Next")
        .setCustomId("NextPageModLog")
)
.addComponents(
    new MessageButton()
        .setStyle("DANGER")
        .setLabel("Previous")
        .setCustomId("PreviousPageModLog")
)
class LogCreate{
    constructor(Client, Message, Guild, User){
        this.client = Client;
        this.message = Message;
        this.guild = Guild;
        this.member = User;
        this.fetchData()
    }

    async fetchData(){
        let member;
        if(this.member.user) member = this.member.user.id
        else if(!member) member = this.member.id || this.member

        await LogsDatabase.findOne({
            guildID: this.guild.id,
            userID: member
        })
        .then(res => {
            if(!res){
                return this.message.channel.send({embeds: [
                    new Discord.MessageEmbed()
                        .setDescription(`<:dnd:926939036281610300> ${this.member.user ? this.member.user : '<@'+this.member+'>'} has No logs`)
                        .setColor("RED")
                ]}).then(m => setTimeout(() => m.delete(), 1000 * 20))
                .catch(err => {return console.log(err.stack)})
            }

            this.logCreate(res)
        })
        .catch(err => {
            console.log(err.stack)
            return this.message.channel.send({embeds: [
                new Discord.MessageEmbed()
                    .setDescription(`<:error:921057346891939840> No logs data found`)
                    .setColor("RED")
            ]}).then(m => setTimeout(() => m.delete(), 1000 * 20))
            .catch(err => {return console.log(err.stack)})
        })
    }
    logCreate(Data){
        if(Data.Action.length == 0){
            return this.message.channel.send({embeds: [
                new Discord.MessageEmbed()
                    .setDescription(`<:dnd:926939036281610300> ${this.member.user ? this.member.user : "<@"+this.member+">"} has no logs`)
                    .setColor("RED")
            ]}).then(m => setTimeout(() => m.delete(), 1000 * 20))
            .catch(err => {return console.log(err.stack)})
        }

        let arr = []
        Data.Action.forEach(data => {
            arr.push(data)
        })

        this.LogManager(arr)
    }

    async LogManager(Data){
        let currentIndex = 0
        let MakeEmbed = start => {
            const current = Data.slice(start, start + 5)
            const Embed = new Discord.MessageEmbed()
                .setDescription(`${this.member.user ? this.member.user : "<@"+this.member+">"} Mod-Logs - \`[ ${Data.length} ]\``)
                .setFooter({text: `Logs ${start + 1} - ${start + current.length}/${Data.length}`})
                .setColor("#fffafa")

            for (let i = 0; i < current.length; i++){
                Embed.addField(`**${start + i + 1}**• [ ${current[i].actionType} ]`,[
                    `\`\`\`py\nUser     - ${current[i].userName}`,
                    `Reason   - ${current[i].actionReason}`,
                    `Mod      - ${current[i].moderator}`,
                    `Duration - ${current[i].actionLength ? current[i].actionLength : "∞"}`,
                    `Date     - ${moment(current[i].actionDate).format('llll')}`,
                    `LogID    - ${current[i].caseID}\`\`\``
                ].join(" \n").toString())
            }
            
            if(Data.length <= 5){
                return ({embeds: [Embed]})
            }else if (start + current.length >= Data.length){
                row.components[0].setDisabled(true)
                row.components[1].setDisabled(false)
                return ({embeds: [Embed], components: [row]})
            }else if(current.length == 0){
                row.components[0].setDisabled(true)
                row.components[1].setDisabled(false)
                return ({embeds: [Embed], components: [row]})
            }else if(currentIndex !== 0){
                row.components[1].setDisabled(false)
                row.components[0].setDisabled(false)
                return ({embeds: [Embed], components: [row]})
            }else if (currentIndex + 5 <= Data.length){
                row.components[1].setDisabled(true)
                row.components[0].setDisabled(false)
                return ({embeds: [Embed], components: [row]})
            }
        }

        await this.message.channel.send(MakeEmbed(0)).then(async msg => {
            const filter = (button) => button.user.id == this.message.author.id;
            const collector = msg.createMessageComponentCollector({ filter, componentType: 'BUTTON', time: 1000 * 60 * 5 });
            collector.on('collect',async b => {
                if(b.user.id !== this.message.author.id) return
                if(b.customId === 'NextPageModLog'){
                    currentIndex += 5
                    await b.update(MakeEmbed(currentIndex)).catch(err => {return console.log(err.stack)})
                }
                if(b.customId === "PreviousPageModLog"){
                    currentIndex -= 5
                    await b.update(MakeEmbed(currentIndex)).catch(err => {return console.log(err.stack)})
                }
            });
            collector.on("end", async() =>{
                // When the collector ends
                if(currentIndex !== 0){
                    row.components[0].setDisabled(true)
                    row.components[1].setDisabled(true)
                    await msg.edit({components: [row]}).catch(err => {return console.log(err.stack)})
                }
            })
        }).catch(err => {return console.log(err.stack)})
    }
}

module.exports = {
    name: 'logs',
    aliases: ['modlogs', 'modlog', 'log'],
    description: "Check moderation logs of a member.",
    permissions: ["MANAGE_MESSAGES"],
    botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
    usage: "logs [ member ]",
    category: "Moderation",
    cooldown: 1000,
    LogCreate,
    run: async(client, message, args,prefix) =>{
        if(!args.length){
            return message.channel.send({
                embeds: [new Discord.MessageEmbed()
                    .setAuthor({name: message.author.tag, iconURL: message.author.displayAvatarURL({format: 'png', dynamic: false})})
                    .setDescription(`<:error:921057346891939840> Mention a member \n\nUsage: \`${prefix}logs [ member ]\``)
                    .setColor("WHITE")
                ]
            })
        }
        
        let member = new Member(message, client).getMemberWithoutErrHandle({member: args[0], clientMember: true})
        if(member == false ) {
            member = args[0].replace(/<@!/g, '').replace(/>/g, '')
        }
        new LogCreate(client, message, message.guild, member)
    }
}