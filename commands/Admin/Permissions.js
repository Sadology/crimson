// const { SlashCommandBuilder } = require('@discordjs/builders');
// const { MessageEmbed, Role } = require('discord.js');
// const { Guild } = require('../../models');

// class PermissionManager{
//     constructor(client, guild, interaction){
//         this.client = client;
//         this.guild = guild;
//         this.interaction = interaction;
//     }
//     /**
//      * @param {String} name Name of the command
//      * @param {String} settings Type of the settings
//      * @param {String} type Type of the role or channel
//      */
//     MainFrame(name, type, settings, roletype, channeltype){
//         let cmdName = this.cmdModule(name)

//         if(!cmdName) {
//             return this.interaction.reply({embeds: [new MessageEmbed()
//                 .setDescription("<:error:921057346891939840> This command doesn't exist")
//                 .setColor("RED")
//             ]})
//         }

//         if(channeltype && channeltype.type !== 'GUILD_TEXT'){
//             return this.interaction.reply({embeds: [new MessageEmbed()
//                 .setDescription("<:error:921057346891939840> channel must be a text channel")
//                 .setColor("RED")
//             ]})
//         }

//         return this.SaveData(name, type, settings, roletype ? roletype : channeltype)
//     }

//     cmdModule(name){
//         let Name;
//         name = name.toLowerCase();

//         if(this.client.Commands.has(name)){
//             Name = this.client.Commands.get(name);
//         }

//         else if(this.client.SlashCmd.has(name)){
//             Name = this.client.SlashCmd.get(name);
//         }

//         else {
            
//             this.interaction.reply({
//                 embeds: [new MessageEmbed()
//                 .setDescription("<:error:921057346891939840> Command name is invalid")
//                 .setColor("RED")]
//             })
//             return false
//         }

//         return Name;
//     }

//     async FetchData(){
//         let Data = await Guild.findOne({
//             guildID: this.guild.id
//         })

//         if(Data) return Data
//         else return false;
//     }

//     async SaveData(name, option, type, data){
//         let DataLake = []

//         function uniq(a) {
//             var seen = {};
//             return a.filter(function(item) {
//                 return seen.hasOwnProperty(item) ? false : (seen[item] = true);
//             });
//         }

//         let db = await this.FetchData()
//         if(db){
//             if(db.Commands && db.Commands.has(name)){
//                 let cmd = db.Commands.get(name);
//                 if(cmd[type]){
//                     DataLake = cmd[type]
//                 }
//             }
//         };

//         switch(option){
//             case 'add':
//                 DataLake.push(data.id);

//                 await Guild.updateOne({
//                     guildID: this.guild.id
//                 }, {
//                     $set: {
//                         [`Commands.${name}.${type}`]: uniq(DataLake)
//                     }
//                 }, {upsert: true})
//                 .then(() => {
//                     this.interaction.reply({
//                         embeds: [new MessageEmbed()
//                             .setDescription(`<:check:959154334388584509> ${data.toString()} ${type == 'allow' ? "__allowed__" : "__denied__"} for command **${name}**`)
//                             .setColor("#2f3136")
//                         ]
//                     });
//                 })
//                 .catch(err => {return console.log(err.stack)});
//             break;
//             case 'remove':
//                 const index = DataLake.indexOf(data.id);
//                 if (index > -1) {
//                     DataLake.splice(index, 1);
//                 }

//                 await Guild.updateOne({
//                     guildID: this.guild.id
//                 }, {
//                     $set: {
//                         [`Commands.${name}.${type}`]: uniq(DataLake)
//                     }
//                 }, {upsert: true})
//                 .then(() => {
//                     this.interaction.reply({
//                         embeds: [new MessageEmbed()
//                             .setDescription(`<:check:959154334388584509> ${data.toString()} ${type == 'allow' ? "__allowed__" : "__denied__"} for command **${name}**`)
//                             .setColor("#2f3136")
//                         ]
//                     });
//                 })
//                 .catch(err => {return console.log(err.stack)});

//             break;
//         }
//     }
// }

// module.exports.run ={
//     run: async (client, interaction, args) => {
//         // Switch the interaction type
//         switch (interaction.type){
//             // Slash command
//             case 'APPLICATION_COMMAND':
//                 interactionFunc();
//             break;

//             // Default command
//             case 'DEFAULT':
//                 messageFunc();
//             break;
//         };

//         // Calling the log resolver class for slash command
//         function interactionFunc(){
//             const { options } = interaction;
//             let add = options.getSubcommand('add');
//             let remove = options.getSubcommand('remove');
//             let name = options.getString('name');
//             let role = options.getRole('role');
//             let channel = options.getChannel('channel');
//             let option = options.getString('option');

//             let data = new PermissionManager(client, interaction.guild, interaction).MainFrame(name, add ? add : remove, option, role, channel)
//         };

//         // Calling the log resolver class for default command
//         function messageFunc(){
//             let data = new ActionChannelManager(client, interaction.guild).BaseFrame(interaction)
//         };
//     }
// }

// module.exports.cmd = {
//     name: 'permission',
//     aliases: ['perms'],
//     description: "Action log of every moderation action taken by moderators",
//     permissions: ["MANAGE_MESSAGES"],
//     botPermission: ["SEND_MESSAGES", "EMBED_LINKS"],
//     usage: "logs [ member ]",
//     category: "Moderation",
//     cooldown: 1000,
// }

// module.exports.slash = {
//     data: new SlashCommandBuilder()
//         .setName('perms-config')
//         .setDescription("set command permission")
//         .addSubcommandGroup(subcmdg =>
//             subcmdg
//             .setName("roles")
//             .setDescription('Change role permission for the command')
//         .addSubcommand(cmd => 
//             cmd
//             .setName('add')
//             .setDescription('Add permission for the command')
//             .addStringOption(option => 
//                 option
//                 .setName('name')
//                 .setDescription("Command name")
//                 .setRequired(true)
//             )
//             .addStringOption(option => 
//                 option
//                 .setName('option')
//                 .setDescription("Allow or ignore the role for the command")
//                 .setRequired(true)
//                 .addChoice('allow', 'allow')
//                 .addChoice('ignore', 'deny')
//             )
//             .addRoleOption(option =>
//                 option
//                 .setName('role')
//                 .setDescription('The role permission to change')
//                 .setRequired(true)
//             )
//             )
//             .addSubcommand(cmd => 
//                 cmd
//                 .setName('remove')
//                 .setDescription('Remove permission for the command')
//                 .addStringOption(option => 
//                     option
//                     .setName('name')
//                     .setDescription("Command name")
//                     .setRequired(true)
//                 )
//                 .addStringOption(option => 
//                     option
//                     .setName('option')
//                     .setDescription("Allow or ignore the role for the command")
//                     .setRequired(true)
//                     .addChoice('allow', 'allow')
//                     .addChoice('ignore', 'deny')
//                 )
//                 .addRoleOption(option =>
//                     option
//                     .setName('role')
//                     .setDescription('The role permission to change')
//                     .setRequired(true)
//                 )
//             )
//         )
//         // Channel
//         .addSubcommandGroup(subcmdg =>
//             subcmdg
//             .setName("channels")
//             .setDescription('Change channel permission for the command')
//         .addSubcommand(cmd => 
//             cmd
//             .setName('add')
//             .setDescription('Add permission for the command')
//             .addStringOption(option => 
//                 option
//                 .setName('name')
//                 .setDescription("Command name")
//                 .setRequired(true)
//             )
//             .addStringOption(option => 
//                 option
//                 .setName('option')
//                 .setDescription("Allow or ignore the channel for the command")
//                 .setRequired(true)
//                 .addChoice('allow', 'allow')
//                 .addChoice('ignore', 'deny')
//             )
//             .addChannelOption(option =>
//                 option
//                 .setName('channel')
//                 .setDescription('The role permission to change')
//                 .setRequired(true)
//             )
//             )
//             .addSubcommand(cmd => 
//                 cmd
//                 .setName('remove')
//                 .setDescription('Remove permission for the command')
//                 .addStringOption(option => 
//                     option
//                     .setName('name')
//                     .setDescription("Command name")
//                     .setRequired(true)
//                 )
//                 .addStringOption(option => 
//                     option
//                     .setName('option')
//                     .setDescription("Allow or ignore the role for the command")
//                     .setRequired(true)
//                     .addChoice('allow', 'allow')
//                     .addChoice('ignore', 'deny')
//                 )
//                 .addChannelOption(option =>
//                     option
//                     .setName('channel')
//                     .setDescription('The channel permission to change')
//                     .setRequired(true)
//                 )
//             )
//         ),
//     category: "Configuration"
// }