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
    botPermission: ["SEND_MESSAGES"],
    cooldown: 3000,
    run: async(client, message, args,prefix) =>{
        async function replace(type){
            switch(type){
                case 'actionlog':
                    return 'actionLog'
                break;
                case 'userlog':
                    return 'userLog'
                break;
                case 'banlog':
                    return 'banLog'
                break;
                case 'messagelog':
                    return 'messageLog'
                break;
                case 'moderator':
                    return 'moderator'
                break;
                case 'Bot manager':
                    return 'manager'
                break;
            }
        }

        class setupWizard{
            constructor(){
            }
            async setPrefix(data){
                await Guild.findOneAndUpdate({
                    guildID: message.guild.id,
                    Active: true
                }, {
                    prefix: data
                }).catch(err => {return console.log(err)})
            }

            async setLog(data, logType){
                this.type = logType
                this.type = this.type.split(" ").join('')
                this.type = this.type.toLowerCase()
                
                let dataName;
                replace(this.type).then((item) => {
                    dataName = item
                })
                await GuildChannel.findOne({
                    guildID: message.guild.id,
                    Active: true,
                })
                .then(async (res) => {
                    if(res){
                        let oldData = res.Data.find(item => item.name == dataName)
                        if(oldData){
                            await GuildChannel.findOneAndUpdate({
                                guildID: message.guild.id,
                                Active: true,
                                [`Data.name`]: dataName
                            },{
                                $pull: {
                                    Data: {
                                       name: dataName
                                    }
                                },
                            })
                            .catch(err => {return console.log(err)})

                            await GuildChannel.findOneAndUpdate({
                                guildID: message.guild.id,
                                Active: true,
                            },{
                                $push: {
                                    Data: {
                                       name: dataName,
                                       channel: data.id,
                                       enabled: true
                                    }
                                },
                            }).catch(err => {return console.log(err)})
                        }else {
                            await GuildChannel.findOneAndUpdate({
                                guildID: message.guild.id,
                                Active: true,
                            },{
                                $push: {
                                    Data: {
                                       name: dataName,
                                       channel: data.id,
                                       enabled: true
                                    }
                                },
                            }).catch(err => {return console.log(err)})
                        }
                    }
                })
                .catch(err => {
                    return console.log(err)
                })
            }

            async setRoles(data, type){
                this.RoleData = data;
                this.type = type;
                this.type = this.type.split(" ").join('')
                this.type = this.type.toLowerCase()

                let dataName;
                replace(this.type).then((item) => {
                    dataName = item
                })
                await GuildRole.findOne({
                    guildID: message.guild.id,
                    Active: true,
                })
                .then(async (res) => {
                    if(res){
                        let oldData = res.Roles.find(item => item.Name == dataName)
                        let mergeArr = [...oldData.Roles, ...this.RoleData]

                        let uniq = mergeArr.reduce(function(a,b){
                            if (a.indexOf(b) < 0 ) a.push(b);
                            return a;
                        },[]);

                        if(oldData){
                            await GuildRole.findOneAndUpdate({
                                guildID: message.guild.id,
                                Active: true
                            },{
                                $pull: {
                                    Roles: {
                                       Name: dataName
                                    }
                                },
                            })
                            .catch(err => {return console.log(err)})

                            await GuildRole.findOneAndUpdate({
                                guildID: message.guild.id,
                                Active: true,
                            },{
                                $push: {
                                    Roles: {
                                       Name: dataName,
                                       Roles: uniq,
                                       Enabled: true
                                    }
                                },
                            }).catch(err => {return console.log(err)})
                        }else {
                            let roleItem = [...this.RoleData]
                            let uniq = roleItem.reduce(function(a,b){
                                if (a.indexOf(b) < 0 ) a.push(b);
                                return a;
                            },[]);
                            await GuildRole.findOneAndUpdate({
                                guildID: message.guild.id,
                                Active: true,
                            },{
                                $push: {
                                    Roles: {
                                       Name: dataName,
                                       Roles: uniq,
                                       Enabled: true
                                    }
                                },
                            }).catch(err => {return console.log(err)})
                        }
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
                    //emoji: '<:administration:915457421823078460>'
                },
                {
                    label: 'Log Channels',
                    description: 'Server log channels',
                    value: 'logOpt',
                    //emoji: '<:moderation:915457421831462922>'
                },
                {
                    label: 'Roles',
                    description: 'Mod/bot manager roles',
                    value: 'roleOpt',
                    //emoji: '<:moderation:915457421831462922>'
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
                    value: 'actionLogOpt',
                    //emoji: '<:administration:915457421823078460>'
                },
                {
                    label: 'Message Log',
                    description: 'Message delete/edit log',
                    value: 'msgLogOpt',
                    //emoji: '<:moderation:915457421831462922>'
                },
                {
                    label: 'Ban Log',
                    description: 'Ban/unban log',
                    value: 'banLogOpt',
                    //emoji: '<:moderation:915457421831462922>'
                },
                {
                    label: 'User Log',
                    description: 'user update log',
                    value: 'userLogOpt',
                    //emoji: '<:moderation:915457421831462922>'
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
                    value: 'moderatorOpt',
                    //emoji: '<:administration:915457421823078460>'
                },
                {
                    label: 'Manager',
                    description: 'Bot manager',
                    value: 'managerOpt',
                    //emoji: '<:moderation:915457421831462922>'
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
            .setDescription("Select a category of your choice \n\nPrefix - Key to run a command\nLog channels - Server log channels\nRoles - Mod/Bot manager roles\n*More options will be available in future*")
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
                await b.update({content: "Canceled the command", components: [cancelButton, row]})
                
            }else if(b.customId === "mainSettingOpt"){
                if(session == true){
                    return b.reply({
                        embeds: [
                            new MessageEmbed()
                            .setAuthor(message.author.tag, message.author.displayAvatarURL({dynamic: false, type: 'png'}))
                            .setDescription("You're already changing a data | Please finish it to change other options")
                            .setColor("RED")
                        ]
                    })
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
                .setFooter("Note: Prefix must be less than 5 characters long")
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
                        .catch(err => {return console.log(err)})
                    }else {
                        saveToData.setPrefix(m.content.substring(0, 5))
                        prefixCollector.stop()
                        logDoneButton.components[0].setDisabled(true)
                        await msg.editReply({embeds: [
                            new MessageEmbed()
                            .setAuthor(message.author.tag, message.author.displayAvatarURL({dynamic: false, type: "png"}))
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
                    .setAuthor(message.author.tag, message.author.displayAvatarURL({dynamic: false, type: "png"}))
                    .setDescription("Please select a log category\n\nAction log - Mute/Unmute/Warn data will get logged\nBan log - Ban/Unban data will get logged\nUser log = User updates will get logged\nMessage log - Message Update/Delete will get logged")
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
                                    .setAuthor(message.author.tag, message.author.displayAvatarURL({dynamic: false, type: 'png'}))
                                    .setDescription("You're already changing a data | Please finish it to change other options")
                                    .setColor("RED")
                                ]
                            })
                            .then(() =>setTimeout(() => b.deleteReply(), 1000 * 3))
                            .catch(err => {return console.log(err)})
                        }else {
                            logDataTypes(b.values.join(" "), b)
                            logSession = true
                        }
                    }
                });
            })
            .catch(err => {return console.log(err)})
        }

        function logDataTypes(type, message){
            switch (type){
                case 'actionLogOpt':
                    logDataSetupFunction(message, "Action Log")
                break;
                case 'msgLogOpt':
                    logDataSetupFunction(message, "Message Log")
                break;
                case 'banLogOpt':
                    logDataSetupFunction(message, "Ban Log")
                break;
                case 'userLogOpt':
                    logDataSetupFunction(message, "User Log")
                break;
                case 'moderatorOpt':
                    roleDataSetupFunction(message, "Moderator")
                break;
                case 'managerOpt':
                    roleDataSetupFunction(message, "Bot manager")
                break;
            }
        }

        function logDataSetupFunction(msg, type) {
            msg.reply({embeds: [
                new MessageEmbed()
                    .setAuthor(message.author.tag, message.author.displayAvatarURL({dynamic: false, type: "png"}))
                    .setDescription("Please mention a valid channel to set as "+" __"+type+"__")
                    .setColor("GREEN")
            ]}).then(() => {
                let LogCollector = msg.channel.createMessageCollector({filter, time: 1000 * 60 * 10})
                LogCollector.on('collect', async(m) => {
                    verifyChannel(m.content, m).then(async d => {
                        if(d !== false){
                            LogCollector.stop()
                            saveToData.setLog(d, type)

                            await msg.editReply({embeds: [
                                new MessageEmbed()
                                .setDescription(`__${type}__ updatated ${d}`)
                                .setColor("GREEN")
                            ]})
                            .then(() =>setTimeout(() => msg.deleteReply(), 1000 * 5))
                            .catch(err => {return console.log(err)})
                            logSession = false
                        }
                    })
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
                    .setAuthor(message.author.tag, message.author.displayAvatarURL({dynamic: false, type: "png"}))
                    .setDescription("Please select a log category\n\nModerator - Can use any moderation type commands.\nManager - This role users can use any commands.")
                    .setFooter("Note: Press \"Back\" to go back")
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
                                    .setAuthor(message.author.tag, message.author.displayAvatarURL({dynamic: false, type: 'png'}))
                                    .setDescription("You're already changing a data | Please finish it to change other options")
                                    .setColor("RED")
                                ]
                            })
                            .then(() =>setTimeout(() => b.deleteReply(), 1000 * 3))
                            .catch(err => {return console.log(err)})
                        }else {
                            logDataTypes(b.values.join(" "), b)
                            roleSession = true
                        }
                    }
                });
            })
            .catch(err => {return console.log(err)})
        }

        async function roleDataSetupFunction(msg, type){
            msg.reply({embeds: [
                new MessageEmbed()
                    .setAuthor(message.author.tag, message.author.displayAvatarURL({dynamic: false, type: "png"}))
                    .setDescription(`"Please mention the roles you'd like to bind to __${type}__`)
                    .setFooter("Note: Use \",\" to separate each roles.")
                    .setColor("GREEN")
            ]}).then(() => {
                let rolesDataCollector = msg.channel.createMessageCollector({filter, time: 1000 * 60 * 10})
                rolesDataCollector.on('collect', async(m) => {
                    verifyRoles(m.content, m).then(async (val) => {
                        if(val !== false){
                            rolesDataCollector.stop()
                            saveToData.setRoles(val.ID, type)
                            await msg.editReply({embeds: [
                                new MessageEmbed()
                                .setDescription(`__${type}__ updatated ${val.Name}`)
                                .setColor("GREEN")
                            ]})
                            .then(() =>setTimeout(() => msg.deleteReply(), 1000 * 5))
                            .catch(err => {return console.log(err)})
                            roleSession = false
                        }
                    })
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
                    .setAuthor(message.author.tag, message.author.displayAvatarURL({dynamic: false, type: "png"}))
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
    }
}