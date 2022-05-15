const client = require('../../index');

client.on('ready', () => {
    client.user.setPresence({ status: 'dnd', activities: [{ type: 'COMPETING', name: "Among us" }] });
    console.log("I'm the imposter");
});