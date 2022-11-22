const { readdirSync } = require("fs");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const wait = require('util').promisify(setTimeout);
let cmds = [];
let privetCmds = [];

// Slash handle function
module.exports = {
    run: async(client) => {
        readdirSync("./commands/").forEach(dir => {
            const commands = readdirSync(`./commands/${dir}/`)
            .filter(file =>
                file.endsWith(".js")
            );

            for (let file of commands) {
                let data = require(`../commands/${dir}/${file}`);
                if (data.test) {

                    let cmdClass = new data.test.CommandBuilder();
                    if(cmdClass.category == 'Privet'){
                        privetCmds.push(cmdClass.slashCmd.toJSON());
                        client.SlashCmd.set(cmdClass.slashCmd.name, data.test);
                        return;
                    }

                    client.SlashCmd.set(cmdClass.slashCmd.name, data.test);
                    cmds.push(cmdClass.slashCmd.toJSON())
                }else {
                    continue;
                }
            }
        });

        client.on("ready", async () => {
            client.guilds.cache.forEach(guild => {
                if(guild.id == "1011160710123896913"){
                    let seperate = [];
                    let newarr = seperate.concat(cmds, privetCmds);
                    guild.commands.set(newarr, guild.id).catch(console.error);
                }

                else {
                    guild.commands.set(cmds, guild.id).catch(console.error);
                }
            });
        });

        client.on("guildCreate", async (guild) => {

            guild.commands.set(cmds, guild.id).catch(console.error);
        })



        //let clientID = "874975916592332820";
        //let guildID = "874975341347762206";

        //const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
            
        // (async () => {
        //     try {
        //         console.log('Started refreshing application (/) commands.');

        //         await rest.put(
        //             Routes.applicationGuildCommands(clientID, guildID),
        //             { body: cmds },
        //         );
        
        //         console.log('Successfully reloaded application (/) commands.');
        //     } catch (error) {
        //         console.error(error);
        //     }
        // })();
        
    }
};