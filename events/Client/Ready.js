const client = require('../../index');

client.on('ready', () => {
    if(client.user.id == "874975916592332820"){
        client.user.setPresence({ status: 'dnd', activities: [{ type: 'COMPETING', name: "Among us" }] });
    }

    else if(client.user.id == "811921753344311296"){
        client.user.setPresence({ status: 'online', activities: [{ type: 'LISTENING', name: "The sound of abyss" }] });
    }
    
    console.log("💚 AT YOUR SERVICE MASTER");
});

client.on('error', (err) => {
    console.log(err)
})