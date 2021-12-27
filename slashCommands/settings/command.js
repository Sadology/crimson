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
            option.setName("options")
            .setRequired(true)
            .setDescription("Command config options")
            .addChoice("permission", 'cmdPerm')
            .addChoice("ignored-role", 'igRole')
            .addChoice("allowed-channel", 'allChan')
            .addChoice("ignored-channel", 'igChan'))
        .addStringOption(option =>
            option.setName("settings")
            .setRequired(true)
            .setDescription("Command settings")
            .addChoice("add", 'addCmd')
            .addChoice("remove", 'rmCmd')
            .addChoice("info", 'cmdInfo'))
        .addStringOption(option =>
            option.setName('roles')
            .setDescription("Allowed/Ignored roles [separated by ,]"))
        .addStringOption(options =>
            options.setName('channels')
            .setDescription("Allowed/Ignored channels [separated by ,]")), 
    permission: ["ADMINISTRATOR", "MANAGE_GUILD"],
    botPermission: ["SEND_MESSAGES"],
    category: "Slash",
    run: async(client, interaction) =>{
        interaction.deferReply()
        await new Promise(resolve => setTimeout(resolve, 1000))
        let cmd;
        const { options } = interaction;

        let cmdname = options.getString('name');
        const cmdOpt = options.getString('options');
        const cmdSett = options.getString('settings');
        let perms = options.getString('roles');
        let channels = options.getString('channels');

        class cmdConfigManager{
            constructor(Interaction){
                this.interaction = Interaction;
                this.Cmd = '';
                this.Type = '';
                this.settings = '';
                this.Arr = [];
                this.Names = [];
            }

            getSettings(data){
                switch(data){
                    case 'addCmd':
                        this.settings = 'added'
                    break;
                    case 'rmCmd':
                        this.settings = 'removed'
                    break;
                }
            }

            async getCmd(name){
                await Guild.findOne({
                    guildID: interaction.guild.id
                }).then((res) => {
                    if(!res.Commands.has(name.toLowerCase())){
                        return interaction.editReply({
                            embeds: [new Discord.MessageEmbed()
                                .setDescription(`This command doesn't exist. Make sure to type a valid command.`)
                                .setColor("RED")
                            ]
                        }).catch(err => {return console.log(err.stack)})
                    }else {
                        let data = res.Commands.get(name.toLowerCase())
                        if(!data) return
                        this.Cmd = data
                        this.pipeLine()
                    }
                })
            }

            pipeLine(){
                if(this.settings == 'added'){
                    this.saveData()
                }else if(this.settings == 'removed'){
                    this.deleteData()
                }
            }

            async saveData(){
                await Guild.findOne({
                    guildID: this.interaction.guild.id
                })
                .then(async res => {
                    if(!res) return
                    let data = [...this.Arr, ...this.Cmd[`${this.Type}`]]

                    let filter = data.reduce(function(a,b){
                        if (a.indexOf(b) < 0 ) a.push(b);
                        return a;
                    },[]);

                    await Guild.updateOne({
                        guildID: this.interaction.guild.id
                    }, {
                        $set: {
                            [`Commands.${cmdname}.${this.Type}`]: filter
                        }
                    }).then(() => {
                        return interaction.editReply({
                            embeds: [new Discord.MessageEmbed()
                                .setDescription(`${this.Type} updated for ${cmdname}\n\n${this.Names.join(', ')}`)
                                .setColor("GREEN")
                            ]
                        }).catch(err => {return console.log(err.stack)})
                    })
                    .catch(err => {return console.log(err.stack)})
                }).catch(err => {return console.log(err.stack)})
            }

            async deleteData(){
                await Guild.findOne({
                    guildID: this.interaction.guild.id
                })
                .then(async res => {
                    if(!res) return
                    if(this.Cmd[`${this.Type}`].length === 0){
                        return interaction.editReply({
                            embeds: [new Discord.MessageEmbed()
                                .setDescription(`There's nothing to remove lol`)
                                .setColor("RED")
                            ]
                        })
                    }
                    let data = [...this.Arr, ...this.Cmd[`${this.Type}`]]
                    let arr = this.Arr
                    let sortedRoles = data.filter(function(val) {
                        return arr.indexOf(val) == -1;
                    });

                    let filter = sortedRoles.reduce(function(a,b){
                        if (a.indexOf(b) < 0 ) a.push(b);
                        return a;
                    },[]);
                    await Guild.updateOne({
                        guildID: this.interaction.guild.id
                    }, {
                        $set: {
                            [`Commands.${cmdname}.${this.Type}`]: filter
                        }
                    }).then(() => {
                        return interaction.editReply({
                            embeds: [new Discord.MessageEmbed()
                                .setDescription(`${this.Type} updated for ${cmdname}\n\n${this.Names.join(', ')}`)
                                .setColor("GREEN")
                            ]
                        }).catch(err => {return console.log(err.stack)})
                    })
                    .catch(err => {return console.log(err.stack)})
                }).catch(err => {return console.log(err.stack)})
            }

            verifyRoles(data){
                let splitData = data.split(/,\s+/g)
                let trimData = splitData.map(function (el) {
                    return el.trim();
                });
                let errRoles = [];
                for(let i=0; i < trimData.length; i++){
                    let roleData = this.interaction.guild.roles.cache.find(r => r.id == trimData[i].replace('<@&','').replace('>','')) || 
                    this.interaction.guild.roles.cache.find(r => r.name.split(' ').join('').toLowerCase() == trimData[i].toLowerCase()) || 
                    this.interaction.guild.roles.cache.find(r => r.id == trimData[i]);

                    if(roleData){
                        this.Arr.push(roleData.id)
                        this.Names.push(roleData.toString())
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
                    return this.interaction.editReply({
                        embeds: [new Discord.MessageEmbed()
                            .setDescription(`Couldn't find the following roles: \n${errRoles.join(', ')}`)
                            .setColor("RED")
                        ]
                    }).catch(err => {return console.log(err.stack)})
                }
            }

            verifyChannels(data){
                let splitData = data.split(/,\s+/g)
                let trimData = splitData.map(function (el) {
                    return el.trim();
                });
                let errChan = [];
                for(let i=0; i < trimData.length; i++){
                    let channelData = this.interaction.guild.channels.cache.find(r => r.id == trimData[i].replace('<#','').replace('>','')) || 
                    this.interaction.guild.channels.cache.find(r => r.name.toLowerCase() == trimData[i].toLowerCase()) || 
                    this.interaction.guild.channels.cache.find(r => r.id == trimData[i]);

                    if(channelData){
                        this.Arr.push(channelData.id)
                        this.Names.push(channelData.toString())
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
                    return this.interaction.editReply({
                        embeds: [new Discord.MessageEmbed()
                            .setDescription(`Couldn't find the following channels: \n${errChan.join(', ')}`)
                            .setColor("RED")
                        ]
                    }).catch(err => {return console.log(err.stack)})
                }
            }

            getOption(opt){
                switch(opt){
                    case 'cmdPerm':
                        if(!perms){
                            return interaction.editReply({
                                embeds: [
                                    new Discord.MessageEmbed()
                                    .setDescription(`Please mention the roles for this command`)
                                    .setColor("RED")
                                ]
                            }).catch(err => {return console.log(err.stack)})
                        }
                        this.verifyRoles(perms)
                        this.getSettings(cmdSett)
                        this.Type = 'Permissions'
                    break;
                    case 'igRole':
                        if(!perms){
                            return interaction.editReply({
                                embeds: [
                                    new Discord.MessageEmbed()
                                    .setDescription(`Please mention the roles for this command`)
                                    .setColor("RED")
                                ]
                            }).catch(err => {return console.log(err.stack)})
                        }
                        this.verifyRoles(perms)
                        this.getSettings(cmdSett)
                        this.Type = 'NotAllowedRole'
                    break;
                    case 'allChan':
                        if(!channels){
                            return interaction.editReply({
                                embeds: [
                                    new Discord.MessageEmbed()
                                    .setDescription(`Please mention the channels for this command`)
                                    .setColor("RED")
                                ]
                            }).catch(err => {return console.log(err.stack)})
                        }
                        this.verifyChannels(channels)
                        this.getSettings(cmdSett)
                        this.Type = 'AllowedChannel'
                    break;
                    case 'igChan':
                        if(!channels){
                            return interaction.editReply({
                                embeds: [
                                    new Discord.MessageEmbed()
                                    .setDescription(`Please mention the channels for this command`)
                                    .setColor("RED")
                                ]
                            }).catch(err => {return console.log(err.stack)})
                        }
                        this.verifyChannels(channels)
                        this.getSettings(cmdSett)
                        this.Type = 'NotAllowedChannel'
                    break;
                }
            }
        }

        const DataManager = new cmdConfigManager(interaction)
        DataManager.getCmd(cmdname)
        DataManager.getOption(cmdOpt)
    }
}