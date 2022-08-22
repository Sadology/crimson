const Discord = require('discord.js');
const { Guild } = require('../../models');
const cache = require('global-cache');

module.exports = {
    event: 'messageCreate',
    run: async(client, message) =>{
        try{
            // Don't response if its a bot or DM channel
            if(message.author.bot) return;
                if(message.channel.type === 'DM') return;

            // Get settings from database cache
            let GuildData = cache.get(message.guild.id);
            // Guild prefix & defaults
                const prefix = GuildData ? GuildData.prefix : ">";

            // Don't response if message doesn't start with prefix;
            if(!message.content.startsWith(prefix)) return;

            if (!message.member){
                message.member = await message.guild.fetchMember(message);
            };

            // Argument construction
            let args = message.content
                .slice(prefix.length)
                .trim()
                .split(/ +/g);

            // Construct cmd from cached command map
            const cmd = args.shift().toLowerCase();
                if (cmd.length === 0) return;
                let command = client.Commands.get(cmd);
                    if (!command) command = client.Commands.get(client.Aliases.get(cmd));

            if(!command) return;

            let CmdManage = new CommandHandle(client, message.guild)

            let bot = CmdManage.BotPermhandle(command, message.channel)
            let channel = CmdManage.ChannelPermission(message.member, command, message.channel)
            let perms = CmdManage.PermissionHandle(message.member, command, message.channel)

            if(!bot || !channel || !perms){
                return console.log(bot, channel, perms);
            }

            command.run(client, message, args, prefix).catch(err => {
                message.channel.send({embeds: [
                    new Discord.MessageEmbed()
                        .setDescription(err.message)
                        .setColor("RED")
                ]}).catch(err => {return console.log(err.stack)});
                return console.log(err.stack);
            })

        } catch(err){
            message.channel.send({
                embeds: [
                    new Discord.MessageEmbed()
                    .setDescription(err.message)
                    .setColor("RED")
                ]
            }).catch(err => {return console.log(err.stack)});

            return console.log(err.stack);
        };
    }
}

let CDMap = new Map();
class CommandHandle{
    constructor(client, guild){
        this.client = client;
        this.guild = guild;

        this.cacheUpdate();
    }

    async cacheUpdate(){
        let data = await Guild.findOne({
            guildID: this.guild.id
        })

        if(data){
            cache.set(this.guild.id, data)
        }
    }

    BotPermhandle(cmd, channel){
        if(this.guild.me.permissions.has(["ADMINISTRATOR"], true)){
            return true;
        };

        let missing = this.guild.me.permissions.missing(cmd.botPermission);
        missing = missing.join(', ');
        missing = missing.replace(/_/g, '-');

        if(this.guild.me.permissions.has(cmd.botPermission)){
            return true;
        }else {
            channel.send({
                embeds: [new Discord.MessageEmbed()
                    .setAuthor({name: `Missing permissions`})
                    .setDescription(`**Bot require**\n<:reply:1011174493252755537>${missing.toLowerCase()}`)
                    .setColor("#2f3136")
                ]
            }).catch(err => {
                channel.send(`Missing permissions for bot: ${missing.toLowerCase()}`).catch(err => {return console.log(err.stack)})
            });

            return false;
        };
    }

    ChannelPermission(user, cmd, channel){
        if(user.permissions.has(["ADMINISTRATOR"], {checkOwner: true})){
            return true;
        };

        let data = cache.get(this.guild.id)
        if(data.Commands && data.Commands.has(cmd.name)){
            let cmdData = data.Commands.get(cmd.name);

            if(cmdData.deny && cmdData.deny.length){
                if(cmdData.deny.includes(channel.id)){
                    return false;
                }
            };

            if(cmdData.allow && cmdData.allow.length){
                let newChan = []
                cmdData.allow.forEach(data => {
                    let chan = this.guild.channels.resolve(data)
                    if(chan){
                        newChan.push(chan.id)
                    }
                });

                if(newChan.length){
                    if(newChan.includes(channel.id)){
                        return true;
                    }else {
                        return false
                    }
                };
            }

            return true;
        }

        else {
            return true;
        };
    }

    PermissionHandle(user, cmd, channel){
        if(user.permissions.has(["ADMINISTRATOR"], {checkOwner: true})){
            return true;
        }

        let data = cache.get(this.guild.id)
        if(data.Commands && data.Commands.has(cmd.name)){
            let cmdData = data.Commands.get(cmd.name);

            if(user.roles.cache.some(role => cmdData.deny.includes(role.id))){
                return false;
            }

            else if(user.roles.cache.some(role => cmdData.allow.includes(role.id))){
                return true;
            }
        }

        if(user.permissions.any(cmd.permissions, false)){
            return true;
        }

        else if(channel.permissionsFor(user).any(cmd.permissions, false)){
            return true;
        }

        else {
            let missing = user.permissions.missing(cmd.permissions);
            missing = missing.join(', ');
            missing = missing.replace(/_/g, '-');

            channel.send({
                embeds: [
                    new Discord.MessageEmbed()
                        .setAuthor({name: "Missing permission", iconURL: user.displayAvatarURL({dynamic: true})})
                        .setDescription(`<:logs:1011182282599575563> **Require**\n<:reply:1011174493252755537> ${missing.toLowerCase()}`)
                        .setColor("#2f3136")
                    ]
            }).catch(err => {
                channel.send(`${user} You're missing permissions: ${missing.toLowerCase()}`);
            });

            return false;
        }
    }

    CmdHandle(cmd){
        let data = cache.get(this.guild.id);
        if(data.Commands[cmd.name]){
            if(data.Commands[cmd.name].Disabled == true){
                return false
            }
            else {
                return true
            }
        }
        else {
            return true
        }
    }

    ModuleHandle(cmd){
        let data = cache.get(this.guild.id);
        if(data.Modules[cmd.category]){
            if(data.Modules[cmd.category].Disabled == true){
                return false
            }
            else {
                return true
            }
        }
        else {
            return true
        }
    }
}