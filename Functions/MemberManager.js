const Discord = require("discord.js");
let errEmoji = '<:error:921057346891939840>'
class Member{
    /**
     * @param {string} message
     * @param {string} client
     * @returns 
     */
    constructor (message, client){
        this.Message = message
        this.Client = client
    }

    getMember({member, clientMember}){
        this.Member = member
        let Embed = new Discord.MessageEmbed()
            .setDescription(`${errEmoji} Please mention a valid member`)
            .setColor("RED")

        if(!this.Member){
            this.Message.channel.send({
                embeds: [Embed]
            }).catch(err => {return console.log(err)})
            return false
        }

        this.Member = this.Member.replace(/<@!/g, '').replace(/>/g, '')
        let guildMember = this.Message.guild.members.resolve(this.Member)

        if(guildMember){
            return guildMember
        }else {
            if(clientMember){
               let clientMember = this.Client.users.resolve(this.Member)
               if(!clientMember){
                    this.Message.channel.send({
                        embeds: [Embed]
                    }).catch(err => {return console.log(err)});
                    return false
                }else {
                    return clientMember
                }
            }else {
                this.Message.channel.send({
                    embeds: [Embed]
                }).catch(err => {return console.log(err)});
                return false
            }
        }
    }

    getUser(member){
        this.Member = member
        let Embed = new Discord.MessageEmbed()
            .setDescription(`${errEmoji} Please mention a valid member`)
            .setColor("RED")

        if(!this.Member){
            this.Message.channel.send({
                embeds: [Embed]
            }).catch(err => {return console.log(err)})
            return false
        }

        this.Member = this.Member.replace(/<@!/g, '').replace(/>/g, '')
        let clientMember = this.Client.users.resolve(this.Member)

        if(clientMember){
            return clientMember
        }else {
            this.Message.channel.send({
                embeds: [Embed]
            }).catch(err => {return console.log(err)});
            return false
        }
    }
    getMemberWithoutErrHandle({member, clientMember}){
        if(!member) return false
        this.Member = member
        this.Member = this.Member.replace(/<@!/g, '').replace(/>/g, '')
        let guildMember = this.Message.guild.members.resolve(this.Member)

        if(guildMember){
            return guildMember
        }else {
            if(clientMember){
                let clientMembers = this.Client.users.resolve(this.Member)
                if(clientMembers){
                    return clientMembers
                }else {
                    return false
                }
            }else {
                return false
            }
        }
    }
}

module.exports = Member