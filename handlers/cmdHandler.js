const { readdirSync } = require("fs");

// Command handle function
module.exports = {
    run: (client) => {
        readdirSync("./commands/").forEach(dir => {
            const commands = readdirSync(`./commands/${dir}/`).filter(file =>
                file.endsWith(".js")
            );
            
            for (let file of commands) {
                let data = require(`../commands/${dir}/${file}`);
                if (data.cmd) {
                    let value = {
                        ...data.run,
                        ...data.cmd
                    }
                    client.Commands.set(data.cmd.name, value);
                } else {
                    continue;
                }
        
                if (data.cmd.aliases && Array.isArray(data.cmd.aliases)){
                    data.cmd.aliases.forEach(alias => client.Aliases.set(alias, data.cmd.name));
                }
                
            }
        });
    }
};