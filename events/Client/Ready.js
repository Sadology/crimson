const client = require('../../index');

client.on('ready', () => {
    client.user.setPresence({ status: 'online', activities: [{ type: 'WATCHING', name: "Underwater" }] });
    console.log("FOR YOUR SERVICE MASTER");
});