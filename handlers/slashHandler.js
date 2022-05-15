const { readdirSync } = require("fs");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const wait = require('util').promisify(setTimeout);
let cmds = []

// Slash handle function
module.exports = {
    run: async(client) => {
        readdirSync("./Commands/").forEach(dir => {
            const commands = readdirSync(`./Commands/${dir}/`)
            .filter(file =>
                file.endsWith(".js")
            );

            for (let file of commands) {
                let data = require(`../Commands/${dir}/${file}`);
                if (data.slash) {
                    let value = {
                        ...data.run,
                        ...data.slash,
                    }
                    client.SlashCmd.set(data.slash.data.name, value);
                    cmds.push(data.slash.data.toJSON())
                }else {
                    continue;
                }
            }
        });

        client.on("ready", async () => {
            client.guilds.cache.forEach(guild => {
                guild.commands.set(cmds, guild.id).catch(console.error);
            });
        });



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