const { SlashCommandBuilder } = require('@discordjs/builders');
const wait = require('util').promisify(setTimeout);
const Discord = require('discord.js');
const { GuildChannel, Profiles, Guild } = require('../../models/');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('my-story')
        .setDescription('create your own story')
        .addStringOption(option => 
            option.setName('message')
            .setDescription('Post sweet messages :)'))
        .addStringOption(option => 
            option.setName('image-link')
            .setDescription('You can add a image on your story')),
    permissions: ["USE_APPLICATION_COMMANDS"],
    botPermission: ["SEND_MESSAGES"],
    category: "Slash",
    run: async(client, interaction) =>{
        try {
            const { options } = interaction;
            const message = options.getString('message');
            const image = options.getString('image-link');

            if(!message && !image){
                interaction.reply({
                    embeds: [new Discord.MessageEmbed()
                        .setDescription("Sorry you can't send an empty story.")
                        .setColor("RED")
                    ], ephemeral: true
                })
            }
            findLogChannel()
            async function findLogChannel() {
                await Guild.findOne({
                    guildID: interaction.guild.id,
                })
                .then(res => {
                    if(!res) return;

                    if(!res.Logchannels?.has('storylog')){
                        return interaction.reply({embeds: [
                            new Discord.MessageEmbed()
                                .setDescription(`This server doesn't have story module enabled.`)
                                .setColor("RED")
                            ], ephemeral: true
                        })
                    }

                    let data = res.Logchannels?.get('storylog')
                    if(!data){
                        return interaction.reply({embeds: [
                            new Discord.MessageEmbed()
                                .setDescription(`This server doesn't have story module enabled.`)
                                .setColor("RED")
                            ], ephemeral: true
                        })  
                    }

                    let chan = interaction.guild.channels.resolve(data);
                    if(!chan){
                        return interaction.reply({embeds: [
                            new Discord.MessageEmbed()
                                .setDescription(`Story channel was deleted`)
                                .setColor("RED")
                            ], ephemeral: true
                        })  
                    }

                    checkCooldown(chan)
                })
                .catch(err => {
                    interaction.reply({
                        embeds: [new Discord.MessageEmbed()
                            .setDescription("Something unexpected happened")
                            .setColor("RED")    
                        ]
                    })
                    return console.log(err.stack)
                })
            }

            async function checkCooldown(c) {
                const now = new Date()
                let data = await Profiles.findOne({
                    guildID: interaction.guild.id,
                    userID: interaction.user.id,
                })

                if(!data){
                    sendData(c)
                }else if(!data.Stories){
                    sendData(c)
                }else {
                    let oldData = await Profiles.findOne({
                        guildID: interaction.guild.id,
                        userID: interaction.user.id,
                        Stories: {
                            $lt: now
                        }
                    })
                    if(!oldData){
                        return interaction.reply({
                            embeds: [new Discord.MessageEmbed()
                                .setDescription("Sorry you already posted a story. Try again in an hour")
                                .setColor("RED")
                            ], ephemeral: true
                        })
                    }else {
                        sendData(c)
                    }
                }
            }

            async function sendData(c) {

                if(!interaction.guild.me.permissions.any("MANAGE_WEBHOOKS")){
                    return interaction.reply("Hey i don't have permission to send webhook story. Please provide me \`Manage Webhooks\` permission")
                    .catch(err => {return console.log(err.stack)})
                }

                const hooks = await c.fetchWebhooks();
                const webHook = hooks.find(i => i.owner.id == client.user.id && i.name == 'sadbot')

                let Embed = new Discord.MessageEmbed()
                    .setAuthor({name: `${interaction.user.tag}'s story`, iconURL: interaction.user.displayAvatarURL({dynamic: true, size: 1024, type: "png"})})
                    .setColor(interaction.member.displayColor)
                    if(message){
                        Embed.setDescription(message)
                    }
                    if(image){
                        if(!image.startsWith("https://") && !image.endsWith(".png" || ".jpg" || ".gif")){
                            return interaction.reply({
                                embeds: [new Discord.MessageEmbed()
                                    .setDescription("This is not a correct link, please provide a valid link.")
                                    .setColor("RED")
                                ], ephemeral: true
                            })
                        }else {
                            Embed.setImage(image)
                        }
                    }
                if(!webHook){
                    c.createWebhook("sadbot", {
                        avatar: "https://i.ibb.co/86GB8LZ/images.jpg"
                    }).then((w) => {
                        return w.send({
                            username: interaction.user.username,
                            avatarURL: interaction.user.avatarURL({dynamic: true, size: 1024, type: 'png'}),
                            embeds: [Embed]
                        }).then(m => {
                            m.react("♥")
                        })
                        .catch(err => {return console.log(err)})
                    }).catch(err => {return console.log(err)})
                }

                webHook.send({
                    username: interaction.user.username,
                    avatarURL: interaction.user.avatarURL({dynamic: true, size: 1024, type: 'png'}),
                    embeds: [Embed]
                }).then(m => {
                    m.react("♥")
                }).catch(err => {return console.log(err)})

                interaction.reply({embeds: [
                    new Discord.MessageEmbed()
                        .setDescription(`Your story were posted in ${c}`)
                        .setColor("GREEN")
                    ], ephemeral: true
                })
                setCooldown()
            }

            async function setCooldown() {
                const muteDuration = new Date();
                muteDuration.setMilliseconds(muteDuration.getMilliseconds() + 3600000);

                await Profiles.findOneAndUpdate({
                    guildID: interaction.guild.id,
                    userID: interaction.user.id,
                }, {
                    Stories: muteDuration
                }, {upsert: true})
            }
        }catch(err){
            return console.log(err)
        }
    }
}