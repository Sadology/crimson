const { SlashCommandBuilder, roleMention } = require('@discordjs/builders');
const wait = require('util').promisify(setTimeout);
const Discord = require('discord.js');
const { GuildRole } = require('../../models');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('set-roles')
        .setDescription('setup different roles.')
        .addStringOption(option =>
            option.setName("options")
            .setDescription("Options you would like to change.")
            .setRequired(true)
            .addChoice('moderator','moderator')
            .addChoice('manager','manager'))
        .addStringOption(option =>
            option.setName("value")
            .setDescription("Enable/disable roles.")
            .setRequired(true)
            .addChoice('enable', 'enableRoles',)
            .addChoice('disable', 'disableRoles')
            .addChoice('remove', 'removeRoles')
            .addChoice('info', 'information'))
        .addStringOption(option =>
            option.setName("roles")
            .setDescription('Mention all the roles you want to set.')),
    permission: ["ADMINISTRATOR", "MANAGE_GUILD"],
    botPermission: ["SEND_MESSAGES"],
    category: "Slash",
    run: async(client, interaction) =>{
        const { options, guild } = interaction;
        const logOption = options.getString('options');
        const value = options.getString('value');
        const roles = options.getString('roles');
        const RolesData = []
        const RolesName = []

        async function fetchData() {
            await GuildRole.findOne({
                guildID: interaction.guild.id,
                Active: true
            }).then(res => {
                if(res){
                    optionConfig();
                }else {
                    return;
                };
            })
        }
        fetchData()

        function optionConfig() {
            if(!value) return interaction.reply({
                embeds: [
                    new Discord.MessageEmbed()
                    .setDescription("Please select a log option")
                    .setColor("RED")
                ], ephemeral: true
            })
            switch(value){
                case 'enableRoles':
                    checkRoles(roles, 'enable')
                break;
                case 'disableRoles':
                    disableData(logOption)
                break;
                case "removeRoles":
                    checkRoles(roles, 'remove')
                break;
                case "information":
                    info()
                break;
            }
        }

        let errorEmbed = new Discord.MessageEmbed()
        let rolesName = []
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
                return interaction.reply({embeds: [errorEmbed]})
            }
            sortRoles(opt)
        }

        async function sortRoles(opt) {
            let items = {
                Roles: [...RolesData],
                Name: logOption,
                Enabled: true
            }

            await GuildRole.findOne({
                guildID: interaction.guild.id,
                Active: true,
                ['Roles.Name']: logOption 
            })
            .then(res => {
                if(res){
                    let data = res.Roles.find(i => i.Name == logOption)
                    let b = [...data.Roles, ...items.Roles]

                    deleteExisting().then(() => {
                        switch(opt){
                            case 'enable':
                                let uniq = b.reduce(function(a,b){
                                    if (a.indexOf(b) < 0 ) a.push(b);
                                    return a;
                                },[]);

                                items.Roles = uniq
                                saveRoleData(items)
                            break;
                            case 'remove':
                                let sortedRoles = b.filter(function(val) {
                                    return RolesData.indexOf(val) == -1;
                                });

                                let removeDupe = sortedRoles.reduce(function(a,b){
                                    if (a.indexOf(b) < 0 ) a.push(b);
                                    return a;
                                },[]);
                                items.Roles = removeDupe

                                removeData(items)
                            break;
                        }
                    })
                }else {
                    let b = [...items.Roles]
                    let uniq = b.reduce(function(a,b){
                        if (a.indexOf(b) < 0 ) a.push(b);
                        return a;
                    },[]);

                    items.Roles = uniq

                    saveRoleData(items)
                }
            })
        }

        async function deleteExisting() {
            await GuildRole.findOneAndUpdate({
                guildID: interaction.guild.id,
                Active: true,
                [`Roles.Name`]: logOption
            },{
                $pull: {
                    Roles: {
                       Name: logOption
                    }
                }
            })
            .then(() => {
                return true
            })
            .catch(err => {
                return console.log(err)
            })
        }

        async function saveRoleData(data) {
            await GuildRole.findOneAndUpdate({
                guildID: interaction.guild.id,
                Active: true,
            }, {
                $push: {
                    ["Roles"]: {
                        ...data
                    }
                }
            }, {
                upsert: true
            })
            .then(() =>{
                return interaction.reply({
                    embeds: [new Discord.MessageEmbed()
                        .setDescription(`__${logOption}__ has been bound to the following roles: \n\n${RolesName}`)
                        .setColor("GREEN")    
                    ]
                })
            })
            .catch(err => {
                return console.log(err)
            })
        }

        async function disableData(DataType) {
            await GuildRole.findOneAndUpdate({
                guildID: interaction.guild.id,
                Active: true,
                [`Roles.Name`]: DataType
            }, {
                ['Roles.$.Enabled']: false
            }).then(() =>{
                return interaction.reply({
                    embeds: [new Discord.MessageEmbed()
                        .setDescription(`__${logOption}__ has been disabled`)
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
                return console.log(err)
            })
        }

        async function removeData(data) {
            await GuildRole.findOneAndUpdate({
                guildID: interaction.guild.id,
                Active: true,
            }, {
                $push: {
                    ["Roles"]: {
                        ...data
                    }
                }
            }, {
                upsert: true
            })
            .then(() =>{
                return interaction.reply({
                    embeds: [new Discord.MessageEmbed()
                        .setDescription(`__${logOption}__ has been removed from the following roles: \n\n${RolesName}`)
                        .setColor("GREEN")    
                    ]
                })
            })
            .catch(err => {
                return console.log(err)
            })
        }

        async function info() {
            await GuildRole.findOne({
                guildID: interaction.guild.id,
                Active: true,
                ['Roles.Name']: logOption
            })
            .then((res) => {
                if(res){
                    let data = res.Roles.find(i => i.Name == logOption)
                    data.Roles.forEach(item => {
                        RolesName.push("<@&"+item+">")
                    })
                    return interaction.reply({
                        embeds: [new Discord.MessageEmbed()
                            .setAuthor("LogChannels", interaction.user.displayAvatarURL({dynamic: true, size: 1024, type: 'png'}))
                            .setDescription(`**Name:** ${data.Name} \n**Enabled:** ${data.Enabled} \n**Roles:** ${RolesName}`)
                            .setColor("WHITE")
                        ]
                    })
                }else {
                    return interaction.reply({embeds: [
                        new Discord.MessageEmbed()
                            .setDescription(`__${logOption}__ role hasn't setup yet not exist. Set up now by \`/set-role\``)
                            .setColor("RED")
                    ], ephemeral: true})
                }
            })
            .catch(err => {
                return console.log(err)
            })
        }
    }
}