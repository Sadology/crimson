const { readdirSync } = require("fs");

// Client handle function
module.exports = {
    run: (client) => {
        readdirSync("./events/").forEach(dir => {
            const events = readdirSync(`./events/${dir}/`).filter(file =>
                file.endsWith(".js")
            );
            for (let file of events) {
                let data = require(`../events/${dir}/${file}`);
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