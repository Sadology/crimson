const Discord = require('discord.js');
const { Client ,Intents } = require('discord.js');
const client = new Discord.Client({
  partials: ["CHANNEL"],
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_BANS,
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_PRESENCES,
    Intents.FLAGS.DIRECT_MESSAGE_TYPING
  ]
});
//const keepAlive = require("./server")
require('dotenv').config();
const fs = require('fs');
const { readdirSync } = require("fs");
client.mongoose = require('./Functions/mongo');
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.slash = new Discord.Collection();

fs.readdir("./handlers/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    require(`./handlers/${file}`)(client)
  });
});

// CLIENT FUNCTION
client.on('ready', async() => {
  client.user.setPresence({ activities: [{ name: '>help | Crying in shadows~ basement' }], status: 'online'});
  console.log("ONLINE MY MASTER")

  fs.readdir("./clientEvents/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
      require(`./clientEvents/${file}`)(client)
    });
  });
})

//keepAlive()
client.mongoose.init();
client.login(process.env.TOKEN)