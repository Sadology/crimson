const Discord = require('discord.js');
const { Intents } = require('discord.js');
const client = new Discord.Client({
  intents: [
    Intents.FLAGS.GUILDS,
    Intents.FLAGS.GUILD_MEMBERS,
    Intents.FLAGS.GUILD_MESSAGES,
  ]
});

require('dotenv').config();

const fs = require('fs');
const { readdirSync } = require("fs");
const { Guild } = require('./models');

client.queue = new Map();
require('./Functions/functions')(client);
client.config = require('./config.json');
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
        console.error(error.stack);
    }
  }
});

const { config } = require('process');

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
    slashCmd.run(client, interation)
  }catch(err){
    console.error(err)
  }

})

client.on('messageCreate', async message =>{
  if(message.author.bot) return;
  if(message.channel.type === 'dm') return;
  
  let settings = await Guild.findOne({guildID: message.guild.id})

  const prefix = settings ? settings.prefix : client.config.default_prefix
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
      command.run(client, message, args, prefix, cmd);
    }
})

client.mongoose.init();
client.login(process.env.TOKEN)