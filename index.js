const Discord = require('discord.js');
const { Client, Intents, Collection } = require('discord.js');
const fs = require('fs');
require('dotenv').config();
const cron = require('node-cron');
const database = require('./Database/Builder');
const event = require('events');
const discordModals = require('discord-modals');

// Client builder
const client = new Client(
    {
        partials: ["CHANNEL"],
        restTimeOffset: 0,
        intents: [
            Intents.FLAGS.GUILDS,
            Intents.FLAGS.GUILD_MEMBERS,
            Intents.FLAGS.GUILD_MESSAGES,
            Intents.FLAGS.GUILD_BANS,
            Intents.FLAGS.GUILD_PRESENCES,
            Intents.FLAGS.GUILD_VOICE_STATES
        ]
    }
);

// Collection maps
client.Commands = new Collection();
client.SlashCmd = new Collection();
client.Aliases = new Collection();
client.eventEmitter = new event.EventEmitter();
client.GUILDS = new Map();

// Handlers management
fs.readdir("./handlers/", (err, files) => {
    if (err) return console.error(err);

    if (files) {
        files.forEach(file => {
            let handle = require(`./handlers/${file}`);
            handle.run(client);
        });
    } else {
        console.log("A file is missing")
    }
});

// Check for Mute every 10 second
cron.schedule('*/10 * * * * *', () => {
    client.eventEmitter.emit('MuteCheck');
});

// Check for Servers every Hour
cron.schedule('0 0 */1 * * *',() => {
    client.guilds.cache.forEach(g => {
        client.eventEmitter.emit('guildUpdate', g);
    })
});

// Check for Scheduled every 10 second
cron.schedule('0 0 */1 * * *', () => {
    client.eventEmitter.emit('scheduleCheck');
});

// Client & Database login
discordModals(client);
database.init();
client.login(process.env.TOKEN)

module.exports = client;