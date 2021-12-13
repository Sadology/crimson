const Discord = require('discord.js');
const { errLog } = require('../../Functions/erroHandling');
const { CustomCommand, Guild } = require('../../models');
const timeOut = new Map()

module.exports = {
    event: 'messageCreate',
    once: false,
    run: async(message, client) =>{
    try {
        if(message.author.bot) return;
        if(message.channel.type === 'DM') return;

        let Permission;
        let Mention;
        let Delete;
        let Embed;
        let Image;

        async function checkPrefix(message){
            let settings = await Guild.findOne({
                guildID: message.guild.id
            }).catch(err => {return console.log(err)})

            const prefix = settings ? settings.prefix : ">"

            if(!message.content.startsWith(prefix)){
                return
            }
            checkContent(prefix, message)
        }

        function checkContent(prefix, message) {
            let contentValue = message.content.split(" ")[0]
            let cmds = contentValue.slice(prefix.length)

            checkData(cmds, message)
        }

        async function checkData(data, message) {
            const Data = await CustomCommand.findOne({
                guildID: message.guild.id,
                [`Data.Name`]: data
            })
            if(Data){
                let datas = Data.Data.find(i => i.Name == data) 
                objectCreate(datas)
            }
        }

        function objectCreate(Data) {
            let structure = {
                Delete: Data.DeleteCmd,
                Mention: Data.Mention,
                Content: Data.Content,
                Embed: Data.Embed,
                Description: Data.Description,
                Author: Data.Author,
                Title: Data.Title,
                Image: Data.Image,
                Color: Data.Color,
                Perm: Data.Permission,
                Footer: Data.Footer,
            }
            validPerms(structure.Perm)
            Mention = structure.Mention;
            Delete = structure.Delete;
            Embed = structure.Embed

            if(structure.Image){
                if(structure.Image.length){
                    imageDeconstruct(structure.Image)
                }
            }

            if(Embed == true){
                EmbededMessage(structure)
            }else {
                flatMessage(structure)
            }
        }

        function validPerms(data) {
            if(!data) return Permission = true
            if(!message.member.roles.cache.some(r=> data.includes(r.id))){
                return Permission = false
            }else {
                return Permission = true
            }
        }

        function EmbededMessage(Data) {
            if(Permission == false) return
            let Member = message.mentions.users.first();
            if(Delete == true) message.delete();

            if(Mention == true && !Member) return

            let Embed = {
                author: {
                    name: Variable(Data.Author, Member)
                },
                description: Variable(Data.Description, Member),
                color: Data.Color ? Data.Color : message.guild.me.displayColor,
                title: Variable(Data.Title, Member),
                image: {
                    url: Image
                },
                footer: {
                    text: Variable(Data.Footer, Member)
                }
            }

            if(Data.Content == null || Data.Content == `{empty}`){
                return message.channel.send({embeds: [Embed]})
            }else {
                return message.channel.send({content: Variable(Data.Content, Member),embeds: [Embed]})
            }

        }

        function flatMessage(Data) {
            if(Permission == false) return
            let Member = message.mentions.users.first();
            if(Delete == true) message.delete();

            if(Mention == true && !Member) return

            if(Image){
                if(Data.Content == null || Data.Content == `{empty}`){
                    return
                }else {
                    return message.channel.send({content: Variable(Data.Content, Member)+`\n${Image}`})
                }
            }else {
                return message.channel.send({content: Variable(Data.Content, Member)})
            }
        }

        function imageDeconstruct(Data){
            Image = Data[Math.floor(Math.random() * Data.length)]
        }

        function Variable(Array, Member) {
            if(Member){
                if(Array == null) return
                return Array
                .replace(/{member}/g, `${Member}`)
                .replace(/{member.id}/g, `${Member.id}`)
                .replace(/{member.tag}/g, `${Member.tag}`)
                .replace(/{member.name}/g, `${Member.username}`)
                .replace(/{author}/g, `${message.author}`)
                .replace(/{author.id}/g, `${message.author.id}`)
                .replace(/{author.tag}/g, `${message.author.tag}`)
                .replace(/{author.name}/g, `${message.author.username}`)
                .replace(/{channel}/g, `${message.channel}`)
                .replace(/{channel.name}/g, `${message.channel.name}`)
                .replace(/{channel.id}/g, `${message.channel.id}`)
                .replace(/{server}/g, `${message.guild.name}`)
                .replace(/{server.id}/g, `${message.guild.id}`)
                .replace(/{empty}/g, '')
            }else {
                if(Array == null) return
                return Array
                .replace(/{author}/g, `${message.author}`)
                .replace(/{author.id}/g, `${message.author.id}`)
                .replace(/{author.tag}/g, `${message.author.tag}`)
                .replace(/{author.name}/g, `${message.author.username}`)
                .replace(/{channel}/g, `${message.channel}`)
                .replace(/{channel.name}/g, `${message.channel.name}`)
                .replace(/{channel.id}/g, `${message.channel.id}`)
                .replace(/{server}/g, `${message.guild.name}`)
                .replace(/{server.id}/g, `${message.guild.id}`)
                .replace(/{empty}/g, '')
            }
        }

        checkPrefix(message)
        return
    }catch(err) {
        return console.log(err)
    }
    }
}