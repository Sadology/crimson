const Discord = require('discord.js');
const { readdirSync } = require("fs");

module.exports = client => {
    readdirSync("./events/").forEach(dir => {
        const Events = readdirSync(`./events/${dir}/`).filter(file =>
          file.endsWith(".js")
        );
        for (let file of Events) {
          const eventFunction = require(`../events/${dir}/${file}`);
          if (eventFunction.disabled) return;
      
          const event = eventFunction.event || file.split('.')[0]; 
          const emitter = (typeof eventFunction.emitter === 'string' ? client[eventFunction.emitter] : eventFunction.emitter) || client; 
          const once = eventFunction.once;
      
          try {
            emitter[once ? 'once' : 'on'](event, (...args) => eventFunction.run(...args, client));
          } catch (error) {
            return console.error(error.stack);
          }
        }
      });
};