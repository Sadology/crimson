const Discord = require('discord.js');
const { Client ,Intents } = require('discord.js');
const client = new Discord.Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
    Intents.FLAGS.GUILD_BANS,
    Intents.FLAGS.DIRECT_MESSAGES,
    Intents.FLAGS.GUILD_VOICE_STATES,
    Intents.FLAGS.GUILD_PRESENCES,
  ]
});
require('dotenv').config();
const fs = require('fs');
const { readdirSync } = require("fs");
const { Guild } = require('./models');

client.queue = new Map();
client.mongoose = require('./Functions/mongo');
client.commands = new Discord.Collection();
client.aliases = new Discord.Collection();
client.slash = new Discord.Collection();

let config = require('./config.json');

fs.readdir("./handlers/", (err, files) => {
  if (err) return console.error(err);
  files.forEach(file => {
    require(`./handlers/${file}`)(client)
  });
});

readdirSync("./events/").forEach(dir => {

  const Events = readdirSync(`./events/${dir}/`).filter(file =>
    file.endsWith(".js")
  );
  for (let file of Events) {
    const eventFunction = require(`./events/${dir}/${file}`);
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

client.on('interactionCreate', async(interation) =>{
  if(!interation.isCommand()) return;

  slashCmd = client.slash.get(interation.commandName)
  
  if(!slashCmd) return client.slash.delete(interation.commandName)
  try {
    if(slashCmd.permission){
      const memberPerms = interation.channel.permissionsFor(interation.member)

      if(!memberPerms || !memberPerms.has(slashCmd.permission)){
        const errorEmbed = new Discord.MessageEmbed()
          .setDescription(`You don't have "${slashCmd.permission}" permission to execute this command`)
          .setColor("RED")
        return interation.reply({embeds: [errorEmbed], ephemeral: true})
      }
    }
    try {
      slashCmd.run(client, interation)
    }catch(err) {
      return console.log(err)
    }
  }catch(err){
    console.error(err)
  }

})

client.on('messageCreate', async message =>{
  if(message.author.bot) return;
  if(message.channel.type === 'dm') return;
  
  let settings = await Guild.findOne({guildID: message.guild.id})

  const prefix = settings ? settings.prefix : config.default_prefix
  if(!message.content.startsWith(prefix)) return
  if(!prefix) return
    if (!message.member)
      message.member = await message.guild.fetchMember(message);
    let args = message.content
      .slice(prefix.length)
      .trim()
      .split(/ +/g);
    const cmd = args.shift().toLowerCase();

    if (cmd.length === 0) return;
    let command = client.commands.get(cmd);
    if (!command) command = client.commands.get(client.aliases.get(cmd));
    if (command){
      const hasPermissionInChannel = message.channel
        .permissionsFor(client.user)
        .has('SEND_MESSAGES', false);
      if (!hasPermissionInChannel) {
        return
      }
      try {
        command.run(client, message, args, prefix, cmd);
      }catch(err) {
        console.log(err)
      }
    }
})

client.mongoose.init();
client.login(process.env.TOKEN)