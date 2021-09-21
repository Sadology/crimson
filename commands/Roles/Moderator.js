const Discord = require('discord.js');
const { GuildRole } = require('../../models');
module.exports = {
    name: 'moderator',
    aliases: ["mod-role", "moderator-role"],
    description: "Set a moderator role in the server",
    permissions: ["ADMINISTRATOR"],
    usage: "moderator [ option ] [ roles ]",
    category: "Administrator",

    run: async(client, message, args, prefix) =>{

        if(!message.member.permissions.has("ADMINISTRATOR")){
            return message.author.send('None of your role proccess to use this command')
        }

        const Data = await GuildRole.findOne({
            guildID: message.guild.id,
            Active: true
        })

        modRoleArr = new Array()
        if(Data){
            for (const role of Data.Moderator){
                let fetchedRoles = message.guild.roles.cache.find(r=>r.id == role)
                
                modRoleArr.push(fetchedRoles.toString());
            }
        }

        if(!args.length){
            const expectedArgs = new Discord.MessageEmbed()
                .setAuthor(`${client.user.username} - Mod Roles`)
                .setDescription(`Moderator roles - ${modRoleArr ? modRoleArr : 'NONE'}
                    **Usage:** \`${prefix}moderator [ enable | disable ] [ Roles ]\``)
                .setColor("#fffafa")
                
            await message.channel.send({embeds: [expectedArgs]})
            return false;
        }

        const { content, guild } = message;
        const option = args[0]


        switch(option.toLowerCase()){
            case "enable":

                const theValue = args[1];
                if(!theValue){
                    message.channel.send({embeds: [new Discord.MessageEmbed()
                        .setDescription("Please mention roles. Each roles will be separated with (,)")
                        .addField(`Usage`, `${prefix}moderator [ enable | disable ] [ Roles ] \n${prefix}moderator enable @Admin, @Moderator, @Helper \n${prefix}moderator disable`)
                        .setColor("#fffafa")
                    ]
                    }).then(m=>setTimeout(() => m.delete(), 1000 * 10));
                }

                const RoleDivider = content.split(" ").slice(2).join(" ");
                const roles = RoleDivider.split(/,\s+/);
                const roleSet = new Set(roles);
        
                const errArr = new Array();
                const arrStr = new Array();

                // DATABASE FUNCTION
                function Database (){
                    roleSet.forEach(async (roleID) => {
                        ModRoles = guild.roles.cache.find(c => c.id == roleID.replace( '<@&' , '' ).replace( '>' , '' )) || 
                        guild.roles.cache.find(r => r.name.toLowerCase() == roleID.toLowerCase()) || 
                        guild.roles.cache.find(c => c.id == roleID);
            
                        if(ModRoles){
                            arrStr.push(ModRoles.toString());
                            
                            await GuildRole.findOneAndUpdate({
                                guildID: message.guild.id,
                                Active: true
                            },{
                                guildName: message.guild.name,
                                $addToSet: {
                                    Moderator: ModRoles.id
                                },
                                ModOptions: {
                                    Enabled: true
                                }
                            },{
                                upsert: true,
                            })

                        }else if(typeof ModRoles === "undefined"){
                            async function add( value) {
                                if (errArr.indexOf(value) === -1) {
                                    await errArr.push(value);
                                }
                            }
                            add(roleID)
                        }
                    })
                }
                Database()

                if(typeof ModRoles === "undefined"){
                    const ErrEmbed = new Discord.MessageEmbed()
                        .setDescription(`Couldn't find role ${errArr}`)
                        .addField("Usage", `${prefix}moderator [ enable ] [ Roles ]`)
                        .addField("Usage", `${prefix}moderator enable @Moderaor, @Admin, @Manager`)
                        .setColor("#fffafa")
                        .setTimestamp()

                    return message.channel.send({embeds: [ErrEmbed]})
                }else {
                    await message.channel.send({embeds: [new Discord.MessageEmbed()
                        .setAuthor('Moderator Roles Updated')
                        .setDescription(`${arrStr}`)
                        .setColor("#fffafa")
                        .setTimestamp()
                    ]
                    })
                }
            break;

            case "disable":
                await GuildRole.findOneAndUpdate({
                    guildID: message.guild.id,
                    Active: true
                },{
                    guildName: message.guild.name,
                    Moderator: [],
                    ModOptions: {
                        Enabled: false
                    }
                },{
                    upsert: true,
                })

            const disabledEmbed = new Discord.MessageEmbed()
                .setAuthor(`${client.user.username} - Moderator`)
                .setDescription(`Moderators roles has been disabled`)
                .setColor("#fffafa")
                .setTimestamp()
            await message.channel.send({embeds: [disabledEmbed]})
        }
    }
}