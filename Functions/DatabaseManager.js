const {LogsDatabase} = require('../models')
class DatabaseManager{
    constructor(client){
        this.client = client;
    }

    async SaveLogData(data, isMute){
        // Generate a string of random letter & numbers
        function randomID(range){
            var text = "";
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
            for (var i = 0; i < range; i++)
                text += possible.charAt(Math.floor(Math.random() * possible.length));
            return text;
        };

        // Generate a 16 digit id for logs
        data["LogID"] = randomID(16);
        data["actionDate"] = new Date()

        // Save the data to database
        await LogsDatabase.updateOne({
            guildID: data.guildID,
            userID: data.userID
        }, {
            guildName: data.guildName,
            Muted: isMute,
            Expire: data.Expire,
            $push: {
                [`Action`]: {
                    ...data
                }
            }
        },{
            upsert: true,
        }).catch(err => {
            return console.log(err.stack);
        })
    }
}

module.exports = {DatabaseManager}