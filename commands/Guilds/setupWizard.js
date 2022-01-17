const Discord = require('discord.js');
const { Guild, GuildChannel, GuildRole } = require('../../models');
const { MessageEmbed, MessageActionRow, MessageSelectMenu, MessageButton } = require('discord.js');
let session = false;
let logSession = false;
let roleSession = false;
module.exports = {
    name: 'setup',
    description: "setup sadbot on your server",
    usage: "setup",
    category: "Administrator",
    permissions: ["MANAGE_GUILD", "ADMINISTRATOR"],
    botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
    cooldown: 3000,
    run: async(client, message, args,prefix) =>{
        class setupWizard{
            constructor(){
            }
            async setPrefix(data){
                await Guild.findOneAndUpdate({
                    guildID: message.guild.id,
                }, {
                    prefix: data
                }).catch(err => {return console.log(err)})
            }

            async setLog(data, logType){
                await Guild.updateOne({
                    guildID: message.guild.id
                }, {
                    $set: {
                        [`Logchannels.${logType}`]: data.id
                    }
                })
                .catch(err => {
                    return console.log(err)
                })
            }

            async setRoles(data, type){
                await Guild.updateOne({
                    guildID: message.guild.id
                }, {
                    $set: {
                        [`Roles.${type}`]: data
                    }
                })
                .catch(err => {
                    return console.log(err)
                })
            }
        }
        const saveToData = new setupWizard()

        const row = new MessageActionRow()
        .addComponents(
            new MessageSelectMenu()
            .setCustomId('mainSettingOpt')
            .setPlaceholder('Select a category')
            .addOptions([
                {
                    label: 'Prefix',
                    description: 'Change default prefix',
                    value: 'prefixOpt',
                    emoji: '<:reply:897083777703084035>'
                },
                {
                    label: 'Log Channels',
                    description: 'Server log channels',
                    value: 'logOpt',
                    emoji: '<:logs:921093310368596008>'
                },
                {
                    label: 'Roles',
                    description: 'Mod/bot manager roles',
                    value: 'roleOpt',
                    emoji: '<:roles:921093178046693377>'
                },
            ]),
        )

        const LogRow = new MessageActionRow()
        .addComponents(
            new MessageSelectMenu()
            .setCustomId('LogSettingOpt')
            .setPlaceholder('Select a category')
            .addOptions([
                {
                    label: 'Action Log',
                    description: 'Mute/unmute/warn log channel',
                    value: 'actionlog',
                    emoji: '🔇'
                },
                {
                    label: 'Message Log',
                    description: 'Message delete/edit log',
                    value: 'messagelog',
                    emoji: '📃'
                },
                {
                    label: 'Ban Log',
                    description: 'Ban/unban log',
                    value: 'banlog',
                    emoji: '<:banHammer:921094864073011221>'
                },
                {
                    label: 'User Log',
                    description: 'User name/avatar update log',
                    value: 'userlog',
                    emoji: '<:user:921095589997977632>'
                },
                {
                    label: "Limit-log",
                    description: "Log limit reached alert log channel",
                    value: 'alertlog',
                    emoji: '⚠'
                },
                {
                    label: "Welcome",
                    description: "New member greeting log channel",
                    value: 'welcomelog',
                    emoji: '👋'
                },
                {
                    label: "Goodbye",
                    description: "Farewell for the member who left log channel",
                    value: 'byelog',
                    emoji: '🙋‍♀️🙋‍♂️'
                },
                {
                    label: "Story-log",
                    description: "Story command message log channel",
                    value: 'storylog',
                    emoji: '📕'
                },
            ]),
        )

        const rolesRow = new MessageActionRow()
        .addComponents(
            new MessageSelectMenu()
            .setCustomId('roleSettingOpt')
            .setPlaceholder('Select a category')
            .addOptions([
                {
                    label: 'Moderator',
                    description: 'Server moderator',
                    value: 'moderator',
                    emoji: '<:moderation:915457421831462922>'
                },
                {
                    label: 'Manager',
                    description: 'Bot manager',
                    value: 'manager',
                    emoji: '<:administration:915457421823078460>'
                },
            ]),
        )
        const logDoneButton = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setStyle("PRIMARY")
                    .setCustomId("setupLogFinished")
                    .setLabel("Back")
            )

        const cancelButton = new MessageActionRow()
            .addComponents(
            new MessageButton()
                .setStyle("DANGER")
                .setCustomId("setupCancel")
                .setLabel("CANCEL")
            )

        let mainEmbed = new MessageEmbed()
            .setAuthor(message.author.tag, message.author.displayAvatarURL({dynamic: false, type: 'png'}))
            .setDescription("Select a category of your choice \n\n<:reply:897083777703084035> Prefix ` - ` The key that allows you to use the bot commands\n<:logs:921093310368596008> Log channels ` - ` Server log channels\n<:roles:921093178046693377> Roles ` - ` Mod/Bot-manager roles\n\n*More options will be available in the future*")
            .setColor("WHITE")
            .setFooter("Note: Press \"Cancel\" if you want to cancel setup")

        let mainMsg = await message.channel.send({content: "Select an option you would like to change", embeds: [mainEmbed], components: [cancelButton, row]}).catch(err => {return console.log(err)})
        const collector = mainMsg.createMessageComponentCollector({time: 1000 * 60 * 10  });
        collector.on('collect',async b => {
            if(b.user.id !== message.author.id) return
            if(b.customId == "setupCancel"){
                collector.stop()
                row.components[0].setDisabled(true)
                cancelButton.components[0].setDisabled(true)
                await b.update({content: "Canceled the command", components: [cancelButton, row]}).catch(err => {return console.log(err.stack)})
                
            }else if(b.customId === "mainSettingOpt"){
                if(session == true){
                    return b.reply({
                        embeds: [
                            new MessageEmbed()
                            .setAuthor({name: message.author.tag, iconURL: message.author.displayAvatarURL({dynamic: false, type: 'png'})})
                            .setDescription("You're already changing a data | Please finish it to change other options")
                            .setColor("RED")
                        ]
                    }).catch(err => {return console.log(err.stack)})
                }else {
                    getData(b.values.join(" "), b)
                    session = true
                }
            }
        });

        const filter = m => m.author.id === message.author.id && !m.author.bot
        function getData(type, msg){
            switch(type){
                case 'prefixOpt':
                    prefixSetupFunction(msg)
                break;
                case 'logOpt':
                    logSetupFunction(msg)
                break;
                case 'roleOpt':
                    roleSetupFunction(msg)
                break;
            }
        }

        async function prefixSetupFunction(msg) {
            msg.reply({embeds: [new MessageEmbed()
                .setAuthor(message.author.tag, message.author.displayAvatarURL({dynamic: false, type: "png"}))
                .setDescription("Please type a new prefix for the bot")
                .setFooter({text: "Note: Prefix must be less than 5 characters long"})
                .setColor("WHITE")
            ], components: [logDoneButton]}).then(() => {
                session = true
                let backButtonCollector = msg.channel.createMessageComponentCollector({ time: 1000 * 60 * 10  });
                let prefixCollector = msg.channel.createMessageCollector({filter, time: 1000 * 60 * 10})
                prefixCollector.on('collect', async(m) => {
                    if(m.content.length >= 6){
                        return m.reply({embeds: [
                            new MessageEmbed()
                            .setDescription("Prefix length can't be longer than 5 characters.")
                            .setColor("RED")
                        ]})
                        .then((m) =>setTimeout(() => m.delete(), 1000 * 3))
                        .catch(err => {return console.log(err)});
                    }else {
                        saveToData.setPrefix(m.content.substring(0, 5));
                        prefixCollector.stop();
                        backButtonCollector.stop();

                        logDoneButton.components[0].setDisabled(true)
                        await msg.editReply({embeds: [
                            new MessageEmbed()
                            .setAuthor({name: message.author.tag, iconURL: message.author.displayAvatarURL({dynamic: false, type: "png"})})
                            .setDescription("Prefix updated")
                            .addField("Prefix", `${m.content.substring(0, 5)}`)
                            .setColor("GREEN")
                        ], components: [logDoneButton]})
                        .then(() =>setTimeout(() => msg.deleteReply(), 1000 * 5))
                        .catch(err => {return console.log(err)})
                        session = false
                    }
                })
                backButtonCollector.on('collect', (b) => {
                    if(b.user.id !== message.author.id) return
                    if(b.customId === 'setupLogFinished'){
                        backButtonCollector.stop()
                        prefixCollector.stop()
                        msg.deleteReply().catch(err => {return console.log(err)})
                        session = false
                    }
                })
            })
            .catch(err => {return console.log(err)})
        }

        async function logSetupFunction(messages){
            await messages.channel.send({embeds: [
                new MessageEmbed()
                    .setAuthor({name: message.author.tag, iconURL: message.author.displayAvatarURL({dynamic: false, type: "png"})})
                    .setDescription("Please select a log category\n\n🔇 Action log ` - ` Mute/Unmute/Warn logs\n<:banHammer:921094864073011221> Ban log ` - ` Ban/Unban logs\n<:user:921095589997977632> User log ` - ` User updates logs\n📃 Message log ` - ` Message Update/Delete logs")
                    .setFooter("Note: Press \"Back\" to go back")
                    .setColor("WHITE")
                ], components: [logDoneButton, LogRow]}).then((msg) => {
                const LogOptCollector = msg.createMessageComponentCollector({ time: 1000 * 60 * 10  });
                LogOptCollector.on('collect',async b => {
                    if(b.user.id !== message.author.id) return
                    if(b.customId === 'setupLogFinished'){
                        LogOptCollector.stop()
                        msg.delete().catch(err => {return console.log(err)})
                        session = false
                    }else if(b.customId === "LogSettingOpt"){
                        if(logSession === true){
                            return b.reply({
                                embeds: [
                                    new MessageEmbed()
                                    .setAuthor({name: message.author.tag, iconURL: message.author.displayAvatarURL({dynamic: false, type: 'png'})})
                                    .setDescription("You're already changing a data | Please finish it to change other options")
                                    .setColor("RED")
                                ]
                            })
                            .then(() =>setTimeout(() => b.deleteReply(), 1000 * 3))
                            .catch(err => {return console.log(err)})
                        }else {
                            let name = LogName(b.values.join(" "))
                            logDataSetupFunction(b, name, b.values.join(" "))
                            logSession = true
                        }
                    }
                });
            })
            .catch(err => {return console.log(err)})
        }

        function logDataSetupFunction(msg, type, typename) {
            msg.reply({embeds: [
                new MessageEmbed()
                    .setAuthor({name: message.author.tag, iconURL: message.author.displayAvatarURL({dynamic: false, type: "png"})})
                    .setDescription("Please mention a valid channel to set as "+" __"+type+"__")
                    .setColor("GREEN")
            ], components: [logDoneButton]}).then(() => {
                let LogCollector = msg.channel.createMessageCollector({filter, time: 1000 * 60 * 10})
                let backButtonCollector = msg.channel.createMessageComponentCollector({ time: 1000 * 60 * 10  });
                LogCollector.on('collect', async(m) => {
                    verifyChannel(m.content, m).then(async d => {
                        if(d !== false){
                            LogCollector.stop();
                            saveToData.setLog(d, typename);
                            backButtonCollector.stop();
                            logDoneButton.components[0].setDisabled(true);

                            await msg.editReply({embeds: [
                                new MessageEmbed()
                                .setDescription(`__${type}__ updatated ${d}`)
                                .setColor("GREEN")
                            ], components: [logDoneButton]})
                            .then(() =>setTimeout(() => msg.deleteReply(), 1000 * 5))
                            .catch(err => {return console.log(err)})
                            logSession = false
                        }
                    })
                })
                backButtonCollector.on('collect', (b) => {
                    if(b.user.id !== message.author.id) return
                    if(b.customId === 'setupLogFinished'){
                        LogCollector.stop()
                        backButtonCollector.stop()
                        msg.deleteReply().catch(err => {return console.log(err)})
                        logSession = false
                    }
                })
            })
            .catch(err => {return console.log(err)})
        }

        async function verifyChannel(data, msg) {
            let divide = data.split(" ")[0]

            let guildChannel = message.guild.channels.cache.find(c => c.id == divide.replace( '<#' , '').replace( '>' , '' )) || 
            message.guild.channels.cache.find(c => c.name.toLowerCase() == divide.toLowerCase()) || 
            message.guild.channels.cache.find(c => c.id == divide);

            if(!guildChannel){
                msg.reply({
                    embeds: [new MessageEmbed()
                        .setDescription("Couldn't find the channel | Please mention a valid channel")
                        .setColor("RED")
                    ]
                })
                .then((m) =>setTimeout(() => m.delete(), 1000 * 3))
                .catch(err => {return console.log(err)})
                return false
            }else {
                return guildChannel
            }
        }

        async function roleSetupFunction(messages){
            await messages.channel.send({embeds: [
                new MessageEmbed()
                    .setAuthor({name: message.author.tag, iconURL: message.author.displayAvatarURL({dynamic: false, type: "png"})})
                    .setDescription("Please select a role category\n\n<:moderation:915457421831462922> Moderator ` - ` Can use any moderation type commands.\n<:administration:915457421823078460> Manager ` - ` This role users can use any commands.")
                    .setFooter({text: "Note: Press \"Back\" to go back"})
                    .setColor("WHITE")
                ], components: [logDoneButton, rolesRow]}).then((msg) => {
                const roleCollector = msg.createMessageComponentCollector({ time: 1000 * 60 * 10  });
                roleCollector.on('collect',async b => {
                    if(b.user.id !== message.author.id) return
                    if(b.customId === 'setupLogFinished'){
                        roleCollector.stop()
                        msg.delete().catch(err => {return console.log(err)})
                        session = false
                    }else if(b.customId === "roleSettingOpt"){
                        if(roleSession === true){
                            return b.reply({
                                embeds: [
                                    new MessageEmbed()
                                    .setAuthor({name: message.author.tag, iconURL: message.author.displayAvatarURL({dynamic: false, type: 'png'})})
                                    .setDescription("You're already changing a data | Please finish it to change other options")
                                    .setColor("RED")
                                ]
                            })
                            .then(() =>setTimeout(() => b.deleteReply(), 1000 * 3))
                            .catch(err => {return console.log(err)})
                        }else {
                            let name = RoleName(b.values.join(" "))
                            roleDataSetupFunction(b, name, b.values.join(" "))
                            roleSession = true
                        }
                    }
                });
            })
            .catch(err => {return console.log(err)})
        }

        async function roleDataSetupFunction(msg, type, typename){
            msg.reply({embeds: [
                new MessageEmbed()
                    .setAuthor({name: message.author.tag, iconURL: message.author.displayAvatarURL({dynamic: false, type: "png"})})
                    .setDescription(`Please mention the role(s) you'd like to set as __${type}__`)
                    .setFooter({text: "Note: Use \",\" to separate each roles."})
                    .setColor("GREEN")
            ], components: [logDoneButton]}).then(() => {
                let rolesDataCollector = msg.channel.createMessageCollector({filter, time: 1000 * 60 * 10})
                let backButtonCollector = msg.channel.createMessageComponentCollector({ time: 1000 * 60 * 10  });
                rolesDataCollector.on('collect', async(m) => {
                    verifyRoles(m.content, m).then(async (val) => {
                        if(val !== false){
                            rolesDataCollector.stop()
                            backButtonCollector.stop()

                            logDoneButton.components[0].setDisabled(true)
                            saveToData.setRoles(val.ID, typename)
                            await msg.editReply({embeds: [
                                new MessageEmbed()
                                .setDescription(`__${type}__ updatated ${val.Name}`)
                                .setColor("GREEN")
                            ], components: [logDoneButton]})
                            .then(() =>setTimeout(() => msg.deleteReply(), 1000 * 5))
                            .catch(err => {return console.log(err)})
                            roleSession = false
                        }
                    })
                })
                backButtonCollector.on('collect', (b) => {
                    if(b.user.id !== message.author.id) return
                    if(b.customId === 'setupLogFinished'){
                        rolesDataCollector.stop()
                        backButtonCollector.stop()
                        msg.deleteReply().catch(err => {return console.log(err)})
                        roleSession = false
                    }
                })
            })
            .catch(err => {return console.log(err)})
        }

        async function verifyRoles(data, msg){
            let divide = data.split(/,\s+/)
            let elements = divide.map(function (el) {
                return el.trim()});
            let undefinedRole = []
            let RolesData = []
            let RolesName = []
    
            elements.forEach(items => {
                let guildRoles = message.guild.roles.cache.find(r => r.id == items.replace( '<@&' , '' ).replace( '>' , '' )) || 
                message.guild.roles.cache.find(r => r.name.toLowerCase() == items.toLowerCase()) || 
                message.guild.roles.cache.find(r => r.id == items);

                if(guildRoles){
                    RolesData.push(guildRoles.id)
                    RolesName.push(guildRoles.toString())
                }else if(typeof guildRoles === "undefined"){
                    function add(value) {
                        if (undefinedRole.indexOf(value) === -1) {
                            undefinedRole.push(value);
                        }
                    }
                    add(items)
                }
            })

            if(undefinedRole.length){
                let errorEmbed = new MessageEmbed()
                    .setAuthor({name: message.author.tag, iconURL: message.author.displayAvatarURL({dynamic: false, type: "png"})})
                    .setDescription(`Couldn't find the following roles: \n${undefinedRole}`)
                    .setColor("RED")
                msg.reply({embeds: [errorEmbed]})
                .then((m) =>setTimeout(() => m.delete(), 1000 * 5))
                .catch(err => {return console.log(err)})
                return false
            }else {
                return {ID: RolesData, Name: RolesName}
            }
        }

        function LogName(data){
            return data
                .replace("actionlog", "Action-log")
                .replace("banlog", "Ban-log")
                .replace("messagelog", "Message-log")
                .replace("userlog", "User-log")
                .replace("alertlog", "Log-limit-log")
                .replace("storylog", "Story-log")
                .replace("welcomelog", "Welcome-channel")
                .replace("byelog", "Goodbye-channel")
        }
        function RoleName(data){
            return data
            .replace("moderator", "Moderator")
            .replace("manager", "Bot-Manager")
        }
    }
}