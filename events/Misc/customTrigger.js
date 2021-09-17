const Discord = require('discord.js');
const { errLog } = require('../../Functions/erroHandling');
const { CustomCommand, Guild } = require('../../models');

module.exports = {
    event: 'message',
    once: false,
    run: async(message) =>{

        let settings = await Guild.findOne({guildID: message.guild.id})
        const prefix = settings ? settings.prefix : config.default_prefix

        let contentValue = message.content.split(" ")[0]
        let cmds = contentValue.slice(prefix.length)

        const Data = await CustomCommand.findOne({
            guildID: message.guild.id,
            Active: false,
            Command: cmds
        })

        if(!message.content.startsWith(prefix)){
            return
        }

        const Member = message.mentions.users.first();

        function variable(Array) {
            return Array
            .replace("{author}", `${message.author}`)
            .replace("{author.id}", `${message.author.id}`)
            .replace("{author.tag}", `${message.author.tag}`)
            .replace("{author.name}", `${message.author.username}`)
            .replace("{channel}", `${message.channel}`)
            .replace("{channel.name}", `${message.channel.name}`)
            .replace("{channel.id}", `${message.channel.id}`)
            .replace("{guild}", `${message.guild.name}`)
            .replace("{guild.id}", `${message.guild.id}`)
        }

        if(Data){
            let obj = {
                command: Data.Command ? Data.Command : null,
                delete: Data.CmdProperty ? Data.CmdProperty.Delete : false,
                mention: Data.Mention ? Data.Mention : false,
                content: Data.Content ? Data.Content : "",
                embed: Data.Embed ? Data.Embed : false,
                desc: Data.EmbedProperty ? Data.EmbedProperty.Desc : null,
                author: Data.EmbedProperty ? Data.EmbedProperty.Author : null,
                title: Data.EmbedProperty ? Data.EmbedProperty.Title : null,
                url: Data.EmbedProperty ? Data.EmbedProperty.URL : "",
                image: Data.Image ? Data.Image : "",
                color: Data.EmbedProperty ? Data.EmbedProperty.Color : null,
                roles: Data.Perms ? Data.Perms : [],
            }
            try{
                if(message.member.roles.cache.some(r=>obj["roles"].includes(r.id))){

                    let url = obj["url"];
                    let image = obj["image"];
                    if(!obj["url"].startsWith('https') || !obj["url"].startsWith('http')){
                        url = null
                    };
                    if(!obj["image"].startsWith('https') || !obj["image"].startsWith('http')){
                        image = null
                    }
        
                    const userEmbed = {
                        color: obj["color"],
                        author: {
                            name: variable(obj["author"])
                        },
                        description: variable(obj["desc"]),
                        image: {
                            url: image
                        },
                        title: variable(obj["title"]),
                        url: url
                    }
        
                    if(obj["mention"] === false){
                        if(obj["embed"] === false){
                            message.channel.send(variable(obj["content"]))
                            if(obj["delete"] === true){
                                message.delete()
                            }
                        }else {
                            message.channel.send(variable(obj["content"]),{embeds: [userEmbed]})
                            if(obj["delete"] === true){
                                message.delete()
                            }
                        }
                    }else if(Data.Mention === true){
                        if(Member){
        
                            function memberVariable(Array) {
                                return Array
                                .replace("{author}", `${message.author}`)
                                .replace("{author.id}", `${message.author.id}`)
                                .replace("{author.tag}", `${message.author.tag}`)
                                .replace("{author.name}", `${message.author.username}`)
                                .replace("{member}", `${Member}`)
                                .replace("{member.id}", `${Member.id}`)
                                .replace("{member.tag}", `${Member.tag}`)
                                .replace("{member.name}", `${Member.username}`)
                                .replace("{channel}", `${message.channel}`)
                                .replace("{channel.name}", `${message.channel.name}`)
                                .replace("{channel.id}", `${message.channel.id}`)
                                .replace("{guild}", `${message.guild.name}`)
                                .replace("{guild.id}", `${message.guild.id}`)
                            }
    
                            const mentionEmbed = {
                                color: obj["color"],
                                author: {
                                    name: memberVariable(obj["author"])
                                },
                                description: memberVariable(obj["desc"]),
                                image: {
                                    url: image
                                },
                                title: memberVariable(obj["title"]),
                                url: url
                            }
    
                            if(obj["embed"] === false){
                                message.channel.send(memberVariable(obj["content"]))
                                if(obj["delete"] === true){
                                    message.delete()
                                }
                            }else {
                                message.channel.send(memberVariable(obj["content"]),{embeds: [mentionEmbed]})
                                if(obj["delete"] === true){
                                    message.delete()
                                }
                            }
                        }else return false;
                    }
                }else return
            }catch(err){
                errLog(err.stack.toString(), "text", "Role-Added", "Error in custom trigger");
            }
        }
    }
}