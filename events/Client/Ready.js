const client = require('../../index');
const ms = require('ms')
client.on('ready', () => {
    if(client.user.id == "874975916592332820"){
        client.user.setPresence({ status: 'dnd', activities: [{ type: 'COMPETING', name: "Among us" }] });
    }

    else if(client.user.id == "811921753344311296"){
        client.user.setPresence({ status: 'online', activities: [{ type: 'LISTENING', name: "The beginning after the end" }] });
    }
    function calcTime(city, offset) {
        // create Date object for current location
        var d = new Date();
    
        // convert to msec
        // subtract local time zone offset
        // get UTC time in msec
        var utc = d.getTime() + (d.getTimezoneOffset() * 60000);
    
        // create new Date object for different city
        // using supplied offset
        var nd = new Date(utc + (3600000*offset));
    
        // return time as a string
        return "The local time for city"+ city +" is "+ nd.toLocaleString();
    }
    
    console.log(calcTime('Dhaka', '+6'));
    console.log("💚 AT YOUR SERVICE MASTER");
});

client.on('error', (err) => {
    console.log(err)
})