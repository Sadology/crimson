const { SlashCommandBuilder, roleMention } = require('@discordjs/builders');
const wait = require('util').promisify(setTimeout);
const Discord = require('discord.js');
const { GuildRole, Guild } = require('../../models');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set-roles')
        .setDescription('setup different roles.')
        .addStringOption(option =>
            option.setName("options")
            .setDescription("Moderation roles")
            .setRequired(true)
            .addChoice('moderator','moderator')
            .addChoice('bot-manager','manager'))
        .addStringOption(option =>
            option.setName("settings")
            .setDescription("Enable/disable roles")
            .setRequired(true)
            .addChoice('enable', 'enableroles',)
            .addChoice('disable', 'disableroles')
            .addChoice('remove', 'removeroles')
            .addChoice('info', 'informations'))
        .addStringOption(option =>
            option.setName("roles")
            .setDescription('Role(s) for the moderation roles')),
    permissions: ["ADMINISTRATOR", "MANAGE_GUILD"],
    botPermission: ["SEND_MESSAGES"],
    category: "Slash",
    run: async(client, interaction) =>{
        const { options, guild } = interaction;
        const logOption = options.getString('options');
        const value = options.getString('settings');
        const roles = options.getString('roles');
        const RolesData = []
        const RolesName = []

        optionConfig()
        function optionConfig() {
            if(!value) return interaction.reply({
                embeds: [
                    new Discord.MessageEmbed()
                    .setDescription("Please select a log option")
                    .setColor("RED")
                ], ephemeral: true
            })
            switch(value){
                case 'enableroles':
                    checkRoles(roles, 'enable')
                break;
                case 'disableroles':
                    disableData(logOption.toLowerCase())
                break;
                case "removeroles":
                    checkRoles(roles, 'remove')
                break;
                case "informations":
                    info()
                break;
            }
        }

        let errorEmbed = new Discord.MessageEmbed()
        function checkRoles(data, opt) {
            if(!data){
                return interaction.reply({
                    embeds: [new Discord.MessageEmbed()
                        .setDescription("Please mention the roles you want to add/remove")
                        .setColor("RED")    
                    ]
                })
            }

            let divide = data.split(/,\s+/)
            let elements = divide.map(function (el) {
                return el.trim()});
            let undefinedRole = []
    
            elements.forEach(items => {
                let guildRoles = guild.roles.cache.find(r => r.id == items.replace( '<@&' , '' ).replace( '>' , '' )) || 
                guild.roles.cache.find(r => r.name.toLowerCase() == items.toLowerCase()) || 
                guild.roles.cache.find(r => r.id == items);

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
                errorEmbed.setDescription(`Can't find this following roles: \n${undefinedRole}`)
                errorEmbed.setColor("RED")
                return interaction.reply({embeds: [errorEmbed], ephemeral: true})
            }
            sortRoles(opt)
        }

        async function sortRoles(opt) {
            let Data;
            await Guild.findOne({
                guildID: interaction.guild.id,
            }).then(res => {
                if(!res) return
                Data = res.Roles
            })

            if(Data && Data.has(logOption.toLowerCase())){
                let oldData = Data.get(logOption.toLowerCase())
                if(oldData.length){
                    newData = RolesData.concat(oldData)
                }else {
                    newData = RolesData
                }
            }else {
                newData = RolesData
            }

            switch(opt){
                case 'enable':
                    let filterRoles = newData.reduce(function(a,b){
                        if (a.indexOf(b) < 0 ) a.push(b);
                        return a;
                    },[]);

                    saveData(filterRoles, "Added")
                break;
                case 'remove':
                    let sortedRoles = newData.filter(function(val) {
                        return RolesData.indexOf(val) == -1;
                    });

                    let dupelicatesFilter = sortedRoles.reduce(function(a,b){
                        if (a.indexOf(b) < 0 ) a.push(b);
                        return a;
                    },[]);

                    saveData(dupelicatesFilter, "Removed")
                break;
            }
        }

        async function saveData(data, type){
            await Guild.updateOne({
                guildID: interaction.guild.id
            }, {
                $set: {
                    [`Roles.${logOption.toLowerCase()}`]: data
                }
            })
            .then(() => {
                return interaction.reply({
                    embeds: [new Discord.MessageEmbed()
                        .setDescription(`<:online:926939036562628658> __${filterName(logOption)}__ has been updated\n<:reply:897083777703084035>\`${type}\`: ${RolesName}`)
                        .setColor("GREEN")    
                    ]
                })
            })
        }
        function filterName(data){
            return data
            .replace("moderator", "Moderator")
            .replace("manager", "Bot-Manager")
        }

        async function disableData() {
            await Guild.updateOne({
                guildID: interaction.guild.id
            }, {
                $unset: {
                    [`Roles.${logOption.toLowerCase()}`]: ''
                }
            })
            .then(() => {
                return interaction.reply({
                    embeds: [new Discord.MessageEmbed()
                        .setDescription(`<:dnd:926939036281610300> __${filterName(logOption)}__ has been disabled`)
                        .setColor("GREEN")    
                    ]
                })
            })
            .catch(err => {
                interaction.reply({embeds: [
                    new Discord.MessageEmbed()
                        .setDescription("This role does not exist. Set up now by `/set-roles`")
                        .setColor("RED")
                ], ephemeral: true})
                return console.log(err.stack)
            })
        }

        async function info() {
            await Guild.findOne({
                guildID: interaction.guild.id,
            })
            .then((res) => {
                if(!res) return

                let Data = {
                    Enabled: false,
                    Roles: []
                }
                if(!res.Roles.has(logOption.toLowerCase())){
                    return interaction.reply({embeds: [
                        new Discord.MessageEmbed()
                            .setAuthor({
                                name: "Role Settings",
                                iconURL: client.user.displayAvatarURL({format: 'png'})
                            })
                            .setDescription(`
                            \` ${filterName(logOption.toLowerCase())} \`
                            **Enabled** \` ⥋ \` ${Data.Enabled}
                            **Roles** \` ⥋ \` ${Data.Roles}
                            `)
                            .setColor("WHITE")
                        ]
                    }).catch(err => {return console.log(err.stack)})
                }else {
                    let fetchData = res.Roles.get(logOption.toLowerCase())

                    if(!fetchData) return
                    if(fetchData.length){
                        fetchData.forEach(d => {
                            let roledata = interaction.guild.roles.resolve(d)
                            if(roledata){
                                Data.Roles.push(roledata)
                            }
                        })
                    }

                    Data.Enabled = true

                    return interaction.reply({embeds: [
                        new Discord.MessageEmbed()
                            .setAuthor({
                                name: "Role Settings",
                                iconURL: client.user.displayAvatarURL({format: 'png'})
                            })
                            .setDescription(`
                            Type - \` ${filterName(logOption)} \`
                            **Enabled** \` ⥋ \` ${Data.Enabled}
                            **Roles** \` ⥋ \` ${Data.Roles}
                            `)
                            .setColor("WHITE")
                        ]
                    }).catch(err => {return console.log(err.stack)})
                }
            })
            .catch(err => {
                return console.log(err.stack)
            })
        }
    }
}