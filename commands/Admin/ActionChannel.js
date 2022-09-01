const { Guild } = require('../../models')
const {MessageActionRow, MessageButton, MessageEmbed, Collection} = require('discord.js')
const { SlashCommandBuilder } = require('@discordjs/builders');
const wait = require('util').promisify(setTimeout);

const row = new MessageActionRow()
.addComponents(
    new MessageButton()
    .setCustomId("actionEdit")
    .setStyle("PRIMARY")
    .setLabel("Edit Mode")
)
.addComponents(
    new MessageButton()
    .setCustomId('help')
    .setLabel("Help")
    .setStyle("SUCCESS")
)
.addComponents(
    new MessageButton()
    .setCustomId('deletemode')
    .setLabel("Delete")
    .setStyle("DANGER")
)

class ActionChannelManager{
    constructor(client, guild){
        this.client = client;
        this.guild = guild;
    }

    // Fetch the database for specific data
    async fetchDatabase(){
        let Data = await Guild.findOne({
            guildID: this.guild.id
        })

        if(Data){
            return Data
        }

        else {
            this.createNew(true);

            return false
        };
    }

    async createNew(guild, logchan){
        if(guild){
            await Guild.create({
            guildID: this.guild.id,
            Logchannels: new Collection()
            }).catch(err => {return console.log(err.stack)})
        }

        if(logchan){
            await Guild.updateOne({
                guildID: this.guild.id,
                Logchannels: {$exists: false}
            }, {
                $set: {
                    Logchannels: new Collection()
                }
            }).catch(err => {return console.log(err.stack)})
        }

    }

    // Base of the class
    async BaseFrame(interaction, editMsg){
        // Request the database for data
        let requestedData = await this.fetchDatabase()
        const {Logchannels} = requestedData

        if(!Logchannels || !requestedData){
            this.createNew(false, true);
            return interaction.reply({embeds: [new MessageEmbed()
                .setDescription(`Something unexpected happened, please try to run the command again`) 
                .setColor("RED")], ephemeral: true
            })
        }

        // Main base frame
        let Embed = new MessageEmbed()
        .setColor("#2f3136")
        .setAuthor({
            name: "Action-logs"
        })
        .setFooter({
            text: "Hit \"Edit mode\" button to get started editing"
        })

        // Replace the compressed version to a user friendly version
        function Types(data){
            return data
            .replace('actionlog', 'Action-log')
            .replace('banlog', 'Ban-log')
            .replace('userlog', 'User-log')
            .replace('messagelog', 'Message-log')
            .replace('memberlog', 'Member-log')
            .replace('kicklog', 'Kick-log')
            .replace('welcome', 'Welcome')
        }

        // Object list of log types
        let typeList = {
            'actionlog': "None",
            'banlog': "None", 
            'messagelog': "None",
            'userlog': "None",
            'memberlog': "None",
            'kicklog': "None",
            'welcome': 'welcome'
        }

        // loop through the database query
        for (let [type, data] of Logchannels){
            // Try to resolve guild channel by ID
            let channel = this.guild.channels.resolve(data)
            
            // If channel is in the guild
            if(channel){
                typeList[type] = channel.toString()
            }
        };

        // Array of user friendly version of data
        let actionChannels = []
        // Loop through Object and push the data to the user friendly array
        for (let [key, val] of Object.entries(typeList)){
            if(val == 'None'){
                actionChannels.push(`<:disabled:1011170589739847700> \`•\` ${Types(key)}: ${val}`) 
            }else {
                actionChannels.push(`<:active:1011170591933464637> \`•\` ${Types(key)}: ${val}`)  
            }
        };

        // Edit the message whith new data passed in
        if(editMsg){
            Embed.setDescription(actionChannels.join("\n"))

            interaction.edit({embeds: [Embed]})
        }

        // Regular data
        else {
            // Customize the button number zero
            let b1 = row.components[0];
            b1.setLabel("Edit mode");
            b1.setCustomId("actionEdit");
            b1.setStyle("PRIMARY");
            b1.setDisabled(false);

            // Customize the button number two
            let b2 = row.components[2];
            b2.setLabel("Del mode is off");
            b2.setCustomId("deletemode");
            b2.setStyle("DANGER");
            b2.setDisabled(false);

            // Set the button 1 enabled
            row.components[1].setDisabled(false)
            // Customize the embed with description
            Embed.setDescription(actionChannels.join("\n"))

            // Send the data to current channel and pass the data to start a loop
            interaction.deferReply();
            await wait(1000);

            interaction.editReply({embeds: [Embed], components:[row]}).then(m => {
                this.collectorHandle(m, interaction)
            })
        }
    }

    // Handler for Button and Message collector
    collectorHandle(Button, interaction){
        // Filter collected messages
        const filter = (button) => {
            if(!button.member) return;
            return button.member.user.id == interaction.member.id;
        }
        // Start Component and Message collecot
        const collector = Button.createMessageComponentCollector({ filter, componentType: 'BUTTON', time: 1000 * 60 * 5 });
        let msgCollector = Button.channel.createMessageCollector({ filter, time: 1000 * 60 * 5 });
        
        // If this data is set to true, bot will delete its messages and users messages
        this.delete = false;

        // Message button collector
        collector.on('collect', async (interact) => {
            interact.deferReply();
            
            // If the button is Edit mode button
            if(interact.customId == "actionEdit"){
                msgCollector = Button.channel.createMessageCollector({ filter, time: 1000 * 60 * 5 });

                // Customize the button number zero
                let b1 = row.components[0];
                b1.setLabel("Edit mode off");
                b1.setCustomId("cancel");
                b1.setStyle("DANGER");

                // Edit the Base Embed to new data & wait 1 secon
                Button.edit({components:[row]});
                await wait(1000);

                // Follow up the base embed and send the help data
                interact.followUp({embeds: [
                    new MessageEmbed()
                    .setAuthor({name: "Edit-mode: Online"})
                    .setDescription("<:help:1011170600754085930> **Log Type <channel>**\n<:example:897083777703084035>Action-log #mod-logs \n**Type \`Log-type <Disable>\` to disable a log channel** \n\n<:search:1011170587302953041> **Available Log Types:**\n\`-\` Action-log, Ban-log, Message-log, User-log, Member-log, kick-log, welcome")
                    .setFooter({text: "Hit the \"Help\" button for more help"})
                    .setColor("#2f3136")
                ]});

                // Start collecting messages
                msgCollector.on('collect', (msg) => {
                    // Pass data in other functions and wait for respose
                    let type = this.formatType(msg.content);
                    let channel = this.formatChannel(msg.content);

                    // Deletes user messages when set to true
                    if(this.delete){
                        msg.delete().catch(err => {return console.log(err.stack)});
                    }

                    // New Error embed
                    let embed = new MessageEmbed()
                    if(!type){
                        embed.setDescription("<:error:1011174128503500800> Action log type is incorrect")
                        .setColor("RED")
                        return this.errorMessage(Button, embed);
                    }

                    if(!channel){
                        embed.setDescription("<:error:1011174128503500800> The channel is incorrect")
                        .setColor("RED")
                        return this.errorMessage(Button, embed);
                    }

                    // Pass the data to Data handler function
                    this.DataManage(type, channel, Button);
                });
            }

            if(interact.customId == "cancel"){
                interact.deleteReply();

                let b1 = row.components[0];
                b1.setLabel("Edit mode");
                b1.setCustomId("actionEdit");
                b1.setStyle("PRIMARY");
                b1.setDisabled(false);

                msgCollector.stop()
                await wait(1000);
                Button.edit({components:[row]});
            }
            // If the button is delete mode button
            if(interact.customId == "deletemode"){
                interact.deleteReply();
                this.delete = true;

                let b2 = row.components[2];
                b2.setLabel("Del mode is on");
                b2.setCustomId("deletemode");
                b2.setStyle("SUCCESS");

                await wait(1000);
                interact.followUp({embeds: [
                    new MessageEmbed()
                    .setAuthor({name: "Delete Mode: Online"})
                    .setDescription("⚠ Your messages will instantly get deleted while on edit mode. Bot messages will take 3 seconds to delete")
                    .setFooter({text: "Press the Button again to turn off"})
                    .setColor("RED")
                ]}).then((m) =>setTimeout(() => m.delete(), 1000 * 10));
                
                Button.edit({components:[row]});
            }

            // When the mesage collector ends
            msgCollector.on('end', () => {
                
            })

            // If the help button is pressed
            if(interact.customId == 'help'){
                row.components[1].setDisabled(true);
                Button.edit({components:[row]});
                await wait(1000);
                
                interact.followUp({embeds: [
                    new MessageEmbed()
                    .setAuthor({name: "Help Menu"})
                    .setDescription("**How to setup action log**❔\n<:reply:1011174493252755537> While in edit mode bot will listen to your messages. Every message you send bot look for log type and channel for 5 minutes 👀. So to setup a log channel follow the instructions. \n\n<:help:1011170600754085930> **Log type** \`<channel>\` \n <:reply:1011174493252755537>**Action-log** \`#mod-logs\` \n\n🗒️ **Note**\n\n\`-\` Log types are available in edit mode, so you can just copy n paste\n\`-\` You can use lower case character for *log type* and you can ignore the (-)\n\`-\` You can use channel Name or channel Id instead of channel mention\n\`-\` If you get a error then read the error message and try again :D\n\`-\` To disable a log channel just type **disable** in the channel section E.g: **message-log** \`disable\`\n\`-\` Hit the **cancel** button to stop edit mode")
                    .setColor("#2f3136")
                    .setImage("https://cdn.discordapp.com/attachments/959188995898740756/959189004870352946/unknown.png")
                ]});
            }
        })

        // When the button collector ends
        collector.on('end', () => {
            // Disable all the buttons
            row.components[0].setDisabled(true);
            row.components[1].setDisabled(true);
            row.components[2].setDisabled(true);

            Button.edit({components:[row]})
        })
    }

    // Data handler before saving to database
    DataManage(type, data, interaction){
        // Return the compressed version of data to a user friendly version of data
        function Types(data){
            return data
            .replace('actionlog', 'Action-log')
            .replace('banlog', 'Ban-log')
            .replace('userlog', 'User-log')
            .replace('messagelog', 'Message-log')
            .replace('memberlog', 'Member-log')
            .replace('kicklog', 'Kick-log')
            .replace('welcome', 'Welcome')
        }

        // If the 2nd parameter is disable then disable that specific data
        if(data == 'disable'){
            // Send the data to update to database
            this.UpdateDatabase(type, data, 'unset', interaction)

            // If succeed, send the data
            interaction.channel.send({
                embeds: [new MessageEmbed()
                    .setDescription(`<:success:1011176253161738323> **${Types(type)}** was __Disabled__`)
                    .setColor("#2f3136")
                ]
            }).then((m) =>{
                if(!this.delete) return;
                setTimeout(() =>m.delete(), 1000 * 3)
            })
            .catch(err => {return console.log(err.stack)})
            // Handler every errors
        }

        else {
            // Send the data to update to database
            this.UpdateDatabase(type, data, 'set', interaction)
            // If succeed, send the data
            interaction.channel.send({
                embeds: [new MessageEmbed()
                    .setDescription(`<:success:1011176253161738323> **${Types(type)}** was set to ${data.toString()}`)
                    .setColor("#2f3136")
                ]
            }).then((m) =>{
                if(!this.delete) return;
                setTimeout(() =>m.delete(), 1000 * 3)
            })
            .catch(err => {return console.log(err.stack)})
        }
    }

    formatChannel(data) {
        // The 2nd parameter
        data = data.split(/ +/g)[1];
        if(!data){
            return false;
        };

        // If 2nd parameter matches the disable
        if(data.toLowerCase() == 'disable'){
            return data.toLowerCase();
        };

        // If 2nd parameter matches the Number form
        if(data.match(/(<#[1-9])\d+>/g) || data.match(/([1-9])\d+/g)){
            data = data.replace(/\D+/g, '');
        }
        
        // If 2nd parameter matches the Alphabetic form
        else {
            data = data.replace(/\W+/g, '')
            data = data.toLowerCase()
        };

        // Find the channel in guild
        let channel = this.guild.channels.cache.find(c => c.name == data) || this.guild.channels.cache.find(c => c.id == data)
        if(channel){
            return channel;
        }
        
        else {
            return false
        };
    }

    formatType(data){
        // The first parameter
        data = data.split(/ +/g)[0];
        if(!data){
            return false;
        };

        // Replace every non alphabetic letters
        data = data.replace(/\W+/g, '');
        data = data.toLowerCase();

        // Data array of possible matches
        let possibleMatch = [
        'actionlog', 'actionlogs', 
        'banlog', 'banlogs',
        'messagelog', 'messagelogs',
        'userlog', 'userlogs',
        'memberlog', 'memberlogs',
        'kicklog', 'kicklogs',
        'welcome'
        ];

        // Try to match the parameter to the array for possible match
        let matched = possibleMatch.find((syn) => syn == data);
        // If match was found
        if(matched){
            function Types(data){
                return data
                .replace('actionlogs', 'actionlog')
                .replace('banlogs', 'banlog')
                .replace('userlogs', 'userlog')
                .replace('messagelogs', 'messagelog')
                .replace('memberlogs', 'memberlog')
                .replace('kicklogs', 'kicklog')
                .replace('welcome', 'welcome')
            }
            return Types(data);
        }
        
        else {
            return false;
        }
    }

    // Database update handler
    async UpdateDatabase(type, data, settings, interaction){ 
        // If settings is set then set the data in database
        if(settings == 'set'){
            await Guild.updateOne({
                guildID: this.guild.id
            }, {
                $set: {
                    [`Logchannels.${type}`]: data.id
                }
            }, {upsert: true}).catch(err =>{ return console.log(err.stack)})
        }
        // IF settings is unset then remove the data from database
        if(settings == 'unset'){
            await Guild.updateOne({
                guildID: this.guild.id
            }, {
                $unset: {
                    [`Logchannels.${type}`]: data
                }
            }, {upsert: true}).catch(err =>{ return console.log(err.stack)})
        }

        // Call the base frame again to update the data
        this.BaseFrame(interaction, true)
    }

    // Error messages handler
    errorMessage(interaction, embed){
        interaction.channel.send({embeds: [embed]})
        .then((m) =>{
            if(!this.delete) return;
            setTimeout(() =>m.delete(), 1000 * 3)
        })
        .catch(err => {return console.log(err.stack)})
    }
}

module.exports.run = {
    run: async(client, interaction, args,prefix) =>{
        let data = new ActionChannelManager(client, interaction.guild).BaseFrame(interaction)
    }
}

module.exports.slash = {
    data: new SlashCommandBuilder()
        .setName('action-log')
        .setDescription('Setup action log channels for guild'),
    category: "Configuration",
    Permissions: ["MANAGE_GUILD"],
    ClientPermissions: ["MANAGE_WEBHOOKS"]
}