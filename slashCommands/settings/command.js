const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js');
const { Guild } = require('../../models');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('command')
        .setDescription('Configure commands')
        .addStringOption(option =>
            option.setName('name')
            .setRequired(true)
            .setDescription("Command name"))
        .addStringOption(option =>
            option.setName('options')
            .setRequired(true)
            .setDescription("Add/Remove settings or get command info")
            .addChoice('add', "addcmd")
            .addChoice('remove', 'removecmd')
            .addChoice("info", 'cmdinfo')
            .addChoice("reset", 'cmdreset'))
        .addStringOption(option =>
            option.setName('settings')
            .setDescription("Type of the setting")
            .addChoice('allowed-roles', 'allowedrole')
            .addChoice("ignored-roles", 'ignoredrole')
            .addChoice("allowed-channels", 'allowedchannel')
            .addChoice("ignored-channels", 'ignoredchannel'))
        .addStringOption(option =>
            option.setName('roles')
            .setDescription("Role(s) for allowed-roles and ignored-roles"))
        .addStringOption(option =>
            option.setName('channels')
            .setDescription("Channel(s) for allowed-channels and ignored-channels")),
    permissions: ["ADMINISTRATOR", "MANAGE_GUILD"],
    botPermission: ["SEND_MESSAGES"],
    category: "Slash",
    run: async(client, interaction) =>{
        interaction.deferReply()
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const { options } = interaction
        const cmdname = options.getString('name');
        const cmdOpt = options.getString('options');
        const cmdType = options.getString('settings');
        const roles = options.getString('roles');
        const channels = options.getString('channels');
        let settings = null
        let Type = null;
        let typeName = null;

        let cmd = client.commands.get(cmdname.toLowerCase())
        if(!cmd) cmd = client.commands.get(client.aliases.get(cmdname.toLowerCase()))
        if(!cmd) cmd = client.slash.get(cmdname.toLowerCase())
        if(!cmd){
            return interaction.editReply({embeds: [
                    new Discord.MessageEmbed()
                    .setDescription("<:error:1011174128503500800> Couldn't find any command | Please make sure the command exist")
                    .setColor("RED")
                ], ephemeral: true
            }).catch(err => {return console.log(err.stack)});
        };

        if(cmd.name) cmd = cmd.name.toLowerCase();
        else if(!cmd.name) cmd = cmd.data.name.toLowerCase();

        optionFilter();

        function optionFilter(){
            switch(cmdOpt){
                case 'addcmd':
                    settings = 'add';
                    commandType()
                break;
                case 'removecmd':
                    settings = 'remove';
                    commandType()
                break;
                case 'cmdinfo':
                    cmdInfo();
                break;
                case 'cmdreset':
                    settings = 'reset';
                    switch(cmdType){
                        case 'allowedrole':
                            Type = 'Permissions'
                            typeName = 'Allowed-Roles'
                        break;
                        case 'ignoredrole':
                            Type = "NotAllowedRole"
                            typeName = 'Ignored-Roles'
                        break;
                        case 'allowedchannel':
                            Type = "AllowedChannel"
                            typeName = 'Allowed-Channels'
                        break;
                        case 'ignoredchannel':
                            Type = "NotAllowedChannel"
                            typeName = 'Ignored-Channels'
                        break;
                        default:
                            return interaction.editReply({embeds: [new Discord.MessageEmbed()
                                .setDescription(`Please select a **settings** to reset it`)
                                .setColor("RED")
                            ]})
                    }
                    saveData()
                break;
            }
        };

        function commandType(){
            let embed = new Discord.MessageEmbed()
            .setDescription(`Please select a type to change its setting`)
            .setAuthor({name: interaction.user.tag, iconURL: interaction.user.displayAvatarURL({format: 'png'})})
            .setColor("RED")
            if(!cmdType){
                return interaction.editReply({embeds: [embed], ephemeral: true})
            };
            
            switch(cmdType){
                case 'allowedrole':
                    roleFilter()
                    Type = 'Permissions'
                    typeName = 'Allowed-Roles'
                break;
                case 'ignoredrole':
                    roleFilter()
                    Type = "NotAllowedRole"
                    typeName = 'Ignored-Roles'
                break;
                case 'allowedchannel':
                    channelFilter()
                    Type = "AllowedChannel"
                    typeName = 'Allowed-Channels'
                break;
                case 'ignoredchannel':
                    channelFilter()
                    Type = "NotAllowedChannel"
                    typeName = 'Ignored-Channels'
                break;
            };
        };

        function roleFilter(){
            if(!roles){
                return interaction.editReply({
                    embeds: [
                        new Discord.MessageEmbed()
                        .setDescription(`Please mention role(s) for this command settings\nseperated by \` ,\` if multiple`)
                        .setColor("RED")
                    ]
                }).catch(err => {return console.log(err.stack)})
            }

            let Arr = [];
            let Names = []
            let splitData = roles.split(/,\s+/g)
            let trimData = splitData.map(function (el) {
                return el.trim();
            });

            let errRoles = [];
            for(let i=0; i < trimData.length; i++){
                let roleData = interaction.guild.roles.cache.find(r => r.id == trimData[i].replace('<@&','').replace('>','')) || 
                interaction.guild.roles.cache.find(r => r.name.split(' ').join('').toLowerCase() == trimData[i].toLowerCase()) || 
                interaction.guild.roles.cache.find(r => r.id == trimData[i]);

                if(roleData){
                    Arr.push(roleData.id)
                    Names.push(roleData.toString())
                }else if(typeof roleData === "undefined"){
                    function add(value) {
                        if (errRoles.indexOf(value) === -1) {
                            errRoles.push(value);
                        }
                    }
                    add(trimData[i])
                }
            }

            if(errRoles.length){
                return interaction.editReply({
                    embeds: [new Discord.MessageEmbed()
                        .setDescription(`Couldn't find the following roles: \n${errRoles.join(', ')}`)
                        .setColor("RED")
                    ]
                }).catch(err => {return console.log(err.stack)})
            }
            saveData(Arr, Names)
        }

        function channelFilter(){
            if(!channels){
                return interaction.editReply({
                    embeds: [
                        new Discord.MessageEmbed()
                        .setDescription(`Please mention channel(s) for this command settings\nseperated by \` ,\` if multiple`)
                        .setColor("RED")
                    ]
                }).catch(err => {return console.log(err.stack)})
            }

            let Arr = [];
            let Name = [];
            let splitData = channels.split(/,\s+/g)
            let trimData = splitData.map(function (el) {
                return el.trim();
            });
            let errChan = [];
            for(let i=0; i < trimData.length; i++){
                let channelData = interaction.guild.channels.cache.find(r => r.id == trimData[i].replace('<#','').replace('>','')) || 
                interaction.guild.channels.cache.find(r => r.name.toLowerCase() == trimData[i].toLowerCase()) || 
                interaction.guild.channels.cache.find(r => r.id == trimData[i]);

                if(channelData){
                    Arr.push(channelData.id)
                    Name.push(channelData.toString())
                }else if(typeof channelData === "undefined"){
                    function add(value) {
                        if (errChan.indexOf(value) === -1) {
                            errChan.push(value);
                        }
                    }
                    add(trimData[i])
                }
            }

            if(errChan.length){
                return interaction.editReply({
                    embeds: [new Discord.MessageEmbed()
                        .setDescription(`Couldn't find the following channels: \n${errChan.join(', ')}`)
                        .setColor("RED")
                    ]
                }).catch(err => {return console.log(err.stack)})
            } 
            saveData(Arr, Name)   
        }

        function saveData(data, dataname){
            switch(settings){
                case 'add':
                    addCmdSave(data, dataname);
                break;
                case 'remove':
                    rmCmdSave(data, dataname)
                break;
                case 'reset':
                    resetCmd()
                break;
            }
        }

        async function addCmdSave(newData, dataname){
            await Guild.findOne({
                guildID: interaction.guild.id
            })
            .then(async res => {
                if(!res) return
                let oldData = Object
                if(res.Commands.has(cmd)){
                    oldData = res.Commands.get(cmd)
                }
                if(!oldData) oldData[`${Type}`] = []
                let data = newData.concat(oldData[`${Type}`])

                let filter = data.reduce(function(a,b){
                    if (a.indexOf(b) < 0 ) a.push(b);
                    return a;
                },[]);

                await Guild.updateOne({
                    guildID: interaction.guild.id
                }, {
                    $set: {
                        [`Commands.${cmd}.${Type}`]: filter
                    }
                }).then(() => {
                    return interaction.editReply({
                        embeds: [new Discord.MessageEmbed()
                            .setDescription(`<:online:926939036562628658> __${typeName}__ added for **${cmd}**\n\n${dataname.join(', ')}`)
                            .setColor("GREEN")
                        ]
                    }).catch(err => {return console.log(err.stack)})
                })
                .catch(err => {return console.log(err.stack)})
            }).catch(err => {return console.log(err.stack)})
        }

        async function rmCmdSave(newData, dataname){
            await Guild.findOne({
                guildID: interaction.guild.id
            })
            .then(async res => {
                if(!res) return
                if(!res.Commands.has(cmd)){
                    return interaction.editReply({
                        embeds: [new Discord.MessageEmbed()
                            .setDescription(`There's nothing to remove lol`)
                            .setColor("RED")
                        ]
                    })
                }

                let oldData = res.Commands.get(cmd)
                if(!oldData){
                    return interaction.editReply({
                        embeds: [new Discord.MessageEmbed()
                            .setDescription(`There's nothing to remove lol`)
                            .setColor("RED")
                        ]
                    })
                }
                if(!oldData[`${Type}`] || oldData[`${Type}`] == 0){
                    return interaction.editReply({
                        embeds: [new Discord.MessageEmbed()
                            .setDescription(`There's nothing to remove lol`)
                            .setColor("RED")
                        ]
                    })
                }

                let data = [...newData, ...oldData[`${Type}`]]
                let arr = newData
                let sortedRoles = data.filter(function(val) {
                    return arr.indexOf(val) == -1;
                });

                let filter = sortedRoles.reduce(function(a,b){
                    if (a.indexOf(b) < 0 ) a.push(b);
                    return a;
                },[]);
                await Guild.updateOne({
                    guildID: interaction.guild.id
                }, {
                    $set: {
                        [`Commands.${cmd}.${Type}`]: filter
                    }
                }).then(() => {
                    return interaction.editReply({
                        embeds: [new Discord.MessageEmbed()
                            .setDescription(`<:dnd:926939036281610300> __${typeName}__ removed for **${cmd}**\n\n${dataname.join(', ')}`)
                            .setColor("GREEN")
                        ]
                    }).catch(err => {return console.log(err.stack)})
                })
                .catch(err => {return console.log(err.stack)})
            }).catch(err => {return console.log(err.stack)})
        }

        async function cmdInfo(){
            await Guild.findOne({
                guildID: interaction.guild.id
            })
            .then(res => {
                if(!res) return

                if(!res.Commands.has(cmd)){
                    return interaction.editReply({embeds: [
                            new Discord.MessageEmbed()
                            .setAuthor({
                                name: `Command Settings`,
                                iconURL: client.user.displayAvatarURL({format: 'png'})
                            })
                            .setDescription(`
                            <:reply:1011174493252755537> \` ${cmd} \`\n
                            **Enabled** \` ⥋ \` True
                            **Allowed-Roles** \` ⥋ \` None
                            **Ignored-Roles** \` ⥋ \` None
                            **Allowed-channels** \` ⥋ \` None
                            **Ignored-Channels** \` ⥋ \` None
                            `)
                            .setColor("WHITE")
                        ]
                    }).catch(err => {return console.log(err.stack)})
                }

                let allowedroles = [], ignoredroles = [], allowedchannels = [], ignoredchannels = []
                let data = res.Commands.get(cmd)

                if(data.Permissions && data.Permissions.length){
                    data.Permissions.forEach(el => {
                        let r1 = interaction.guild.roles.resolve(el)
                        if(r1){
                            allowedroles.push(r1.toString())
                        }
                    })
                }

                if(data.NotAllowedRole && data.NotAllowedRole.length){
                    data.NotAllowedRole.forEach(el => {
                        let r2 = interaction.guild.roles.resolve(el)
                        if(r2){
                            ignoredroles.push(r2.toString())
                        }
                    })
                }

                if(data.NotAllowedChannel && data.NotAllowedChannel.length){
                    data.NotAllowedChannel.forEach(el => {
                        let c1 = interaction.guild.channels.resolve(el)
                        if(c1){
                            ignoredchannels.push(c1.toString())
                        }
                    })
                }

                if(data.AllowedChannel && data.AllowedChannel.length){
                    data.AllowedChannel.forEach(el => {
                        let c2 = interaction.guild.channels.resolve(el)
                        if(c2){
                            allowedchannels.push(c2.toString())
                        }
                    })
                }

                return interaction.editReply({embeds: [
                    new Discord.MessageEmbed()
                        .setAuthor({
                            name: `Command Settings`,
                            iconURL: client.user.displayAvatarURL({format: 'png'})
                        })
                        .setDescription(`
                        <:reply:1011174493252755537> \` ${cmd} \`\n
                        **Enabled** \` ⥋ \` ${data.Enabled ? data.Enabled : "true"}
                        **Allowed-Roles** \` ⥋ \` ${allowedroles}
                        **Ignored-Roles** \` ⥋ \` ${ignoredroles}
                        **Allowed-channels** \` ⥋ \` ${allowedchannels}
                        **Ignored-Channels** \` ⥋ \` ${ignoredchannels}
                        `)
                        .setColor("WHITE")
                    ]
                }).catch(err => {return console.log(err.stack)})
            }).catch(err => {return console.log(err.stack)})
        }

        async function resetCmd(){
            if(!Type) return
            await Guild.findOne({
                guildID: interaction.guild.id
            })
            .then(async res => {
                if(!res) return

                if(!res.Commands.has(cmd)){
                    return interaction.editReply({embeds: [
                        new Discord.MessageEmbed()
                        .setDescription(`__${typeName}__ has been reset to default settings for ${cmd}`)
                        .setColor("GREEN")
                    ]}).catch(err => {return console.log(err.stack)})
                }

                let dataSettings = res.Commands.get(cmd)
                let data = dataSettings[`${Type}`]

                if(!data){
                    return interaction.editReply({embeds: [
                        new Discord.MessageEmbed()
                        .setDescription(`__${typeName}__ has been reset to default settings for ${cmd}`)
                        .setColor("GREEN")
                    ]}).catch(err => {return console.log(err.stack)})
                }
                else {
                    await Guild.updateOne({
                        guildID: interaction.guild.id
                    }, {
                        $unset: {
                            [`Commands.${cmd}.${Type}`]: ''
                        }
                    })
                    .then(() => {
                        return interaction.editReply({embeds: [
                        new Discord.MessageEmbed()
                        .setDescription(`__${typeName}__ has been reset to default settings for ${cmd}`)
                        .setColor("GREEN")
                    ]}).catch(err => {return console.log(err.stack)})
                    })
                    .catch(err => {return console.log(err.stack)})
                }
            }).catch(err => {return console.log(err.stack)})
        }
    }
}