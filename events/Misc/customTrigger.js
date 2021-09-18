const Discord = require('discord.js');
const { errLog } = require('../../Functions/erroHandling');
const { CustomCommand, Guild } = require('../../models');

module.exports = {
    event: 'message',
    once: false,
    run: async(message, client) =>{

        let settings = await Guild.findOne({guildID: message.guild.id})
        const prefix = settings ? settings.prefix : client.config.default_prefix

        let contentValue = message.content.split(" ")[0]
        let cmds = contentValue.slice(prefix.length)

        const Data = await CustomCommand.findOne({
            guildID: message.guild.id,
            [`Data.name`]: cmds
        })

        if(!message.content.startsWith(prefix)){
            return
        }

        const Member = message.mentions.users.first();

        function variable(Array) {
            Array.replace(/{author}/g, `${message.author}`)
            Array.replace(/{author.id}/g, `${message.author.id}`)
            Array.replace(/{author.tag}/g, `${message.author.tag}`)
            Array.replace(/{author.name}/g, `${message.author.username}`)
            Array.replace(/{channel}/g, `${message.channel}`)
            Array.replace(/{channel.name}/g, `${message.channel.name}`)
            Array.replace(/{channel.id}/g, `${message.channel.id}`)
            Array.replace(/{guild}/g, `${message.guild.name}`)
            Array.replace(/{guild.id}/g, `${message.guild.id}`)
            return Array
        }

        if(Data){
            let obj = {
                delete: Data.Data.deleteC ? Data.Data.deleteC : false,
                mention: Data.Data.mention ? Data.Data.mention : false,
                content: Data.Data.content ? Data.Data.content : "",
                embed: Data.Data.embed ? Data.Data.embed : false,
                desc: Data.Data.description ? Data.Data.description : "",
                author: Data.Data.author ? Data.Data.author : "",
                title: Data.Data.title ? Data.Data.title : "",
                image: Data.Data.image ? Data.Data.image : "",
                color: Data.Data.color ? Data.Data.color : "",
                roles: Data.Data.permission ? Data.Data.permission : [],
            }

            try{
                if(message.member.roles.cache.some(r=>obj["roles"].includes(r.id))){

                    let image = obj["image"];
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
                    }
        
                    if(obj["mention"] === false){
                        if(obj["embed"] === false){
                            message.channel.send({content: variable(obj["content"])})
                            if(obj["delete"] === true){
                                message.delete()
                            }
                        }else {
                            message.channel.send({content: variable(obj["content"]),embeds: [userEmbed]})
                            if(obj["delete"] === true){
                                message.delete()
                            }
                        }
                    }else if(Data.Data.mention === true){
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

                            let image = obj["image"];
                            if(!obj["image"].startsWith('https') || !obj["image"].startsWith('http')){
                                image = null
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
                            }
    
                            if(obj["embed"] === false){
                                message.channel.send(memberVariable(obj["content"]))
                                if(obj["delete"] === true){
                                    message.delete()
                                }
                            }else {
                                if(obj['content'].match(/{empty}/g)){
                                    message.channel.send({embeds: [mentionEmbed]})
                                    if(obj["delete"] === true){
                                        message.delete()
                                    }
                                }else {
                                    message.channel.send({content: variable(obj["content"]), embeds: [mentionEmbed]})
                                    if(obj["delete"] === true){
                                        message.delete()
                                    }
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