const { readdirSync } = require("fs");

// Client handle function
module.exports = {
    run: (client) => {
        readdirSync("./Events/").forEach(dir => {
            const events = readdirSync(`./Events/${dir}/`).filter(file =>
                file.endsWith(".js")
            );
            for (let file of events) {
                let data = require(`../Events/${dir}/${file}`);
                const event = data.event;
        
                try{
                    client.eventEmitter.on(event, (...args) => data.run(client, ...args));
                }catch(err) {
                    return console.log(err.stack);
                };
            }
        });
    }

};