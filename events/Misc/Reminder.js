const client = require('../..');

// Its a reminder for shadow. You have nothing to see here.
client.on('presenceUpdate', async(oldPresence, newPresence) => {
    if(newPresence.member.id !== "571964900646191104") return;
    if(!oldPresence) return;
    
    if(oldPresence.status == "offline" || oldPresence.status == "invisible"){
        if(newPresence.status == "online" || newPresence.status == "idle" ||newPresence.status == "dnd") {
            let guild = client.guilds.cache.get("1011160710123896913")
            if(!guild) return;

            let channel = guild.channels.cache.get("1011160713584189463")
            if(!channel) return;

            channel.send({content: "<@571964900646191104> Porte jaw 😡"})
            .catch(err => {
                return console.log(err.stack)
            });
        }
    }
});