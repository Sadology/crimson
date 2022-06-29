const client = require('../../index');
const ms = require('ms')
client.on('ready', () => {
    if(client.user.id == "874975916592332820"){
        client.user.setPresence({ status: 'dnd', activities: [{ type: 'COMPETING', name: "Among us" }] });
    }

    else if(client.user.id == "811921753344311296"){
        client.user.setPresence({ status: 'online', activities: [{ type: 'LISTENING', name: "The beginning after the end" }] });
    }

    console.log("💚 AT YOUR SERVICE MASTER");
});

client.on('error', (err) => {
    console.log(err)
})