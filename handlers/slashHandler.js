const { readdirSync } = require("fs");
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const cmds = []
module.exports = client => {
  readdirSync("./slashCommands/").forEach(dir => {

    const commands = readdirSync(`./slashCommands/${dir}/`).filter(file =>
      file.endsWith(".js")
    );
    for (let file of commands) {
      let pull = require(`../slashCommands/${dir}/${file}`);

      if (pull.data) {
        client.slash.set(pull.data.name, pull);
        cmds.push(pull.data.toJSON())
      } else {
          console.log('Missing name')
        continue;
      }
    }
  });

const clientId = '618434479601745950';
const guildId = '874975341347762206';
//applicationCommands
//applicationGuildCommands
// 618434479601745950

const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

(async () => {
	try {
		console.log('Started refreshing application (/) commands.');

		await rest.put(
			Routes.applicationCommands(clientId),
			{ body: cmds },
		);

		console.log('Successfully reloaded application (/) commands.');
	} catch (error) {
		console.error(error);
	}
})();
};