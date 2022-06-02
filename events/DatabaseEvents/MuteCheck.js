const {LogsDatabase} = require('../../models')
const {UserRoleManager} = require('../../Functions');
const client = require('../../index');

client.eventEmitter.on('MuteCheck', async() => {
    const curreantTime = new Date()

    const conditional = {
        Expire: {
            $lt: curreantTime
        }, 
        Muted: true
    }

    const searchedItems = await LogsDatabase.find(conditional).catch(err => {return console.log(err.stack)});

    if(searchedItems){
        for(const items of searchedItems){
            const {guildID, userID} = items;

            const guild = client.guilds.resolve(guildID);
            if(!guild) return;

            await guild.members.fetch();
            const User = guild.members.resolve(userID)

            if(User){
                let pendingMute = await new UserRoleManager(client, guild).RemoveRole(User, {name: 'muted'});
                if(!pendingMute) return;
    
                client.eventEmitter.emit('MuteRemoved', User, client);
            }
            else {
                client.eventEmitter.emit('MuteRemoved', userID, client);
            }

        }
    }

    await LogsDatabase.updateMany(conditional,{
        Muted: false,
        Expire: null
    })
    .catch(err => {return console.log(err.stack)})
})