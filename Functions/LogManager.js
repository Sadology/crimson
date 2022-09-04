const {LogsDatabase} = require('../models');
class LogTemplate{
    constructor(client, guild, data = {}){
        this.client = client;
        this.guild = guild;

        this.Data(data);
    }

    Data(data){
        this.guildID = this.guild.id;
        this.guildName = this.guild.name;
        this.userID = data.userID;
        this.userName = data.userName;
        this.actionType = data.actionType;
        this.actionReason = data.actionReason;
        this.Expire = data.Expire;
        this.actionLength = data.actionLength;
        this.moderator = data.moderator;
        this.moderatorID = data.moderatorID;
        this.actionDate = data.actionDate;
        this.logID = data.logID
    }

    setUser(User){
        this.userID = User.user ? User.user.id : User.id ? User.id : User;
        this.userName = User.user ? User.user.tag : User.tag ? User.tag : User;

        return this;
    }

    setActions(type, actionReason){
        this.actionType = type;
        this.actionReason = actionReason ? actionReason : "No reason was provided";

        return this;
    }

    setLengths(expire = null, duration = null){
        this.Expire = expire;
        this.actionLength = duration;
        return this;
    }

    setExecutor(mod){
        this.moderator = mod.user ? mod.user.tag : mod.tag ? mod.tag : mod;
        this.moderatorID = mod.user ? mod.user.id : mod.id ? mod.id : mod;

        return this;
    }

    DataToJson(){
        return {
            guildID: this.guildID, 
            guildName: this.guildName,
            userID: this.userID, 
            userName: this.userName,
            actionType: this.actionType, 
            actionReason: this.actionReason,
            Expire: this.Expire,
            actionLength: this.actionLength,
            moderator: this.moderator,
            moderatorID: this.moderatorID,
            actionDate: this.actionDate,
        }
    }
}

class LogManager extends LogTemplate{
    constructor(client, guild){
        super(client, guild)
    }

    CreateLogID(range){
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var i = 0; i <= range; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));
        return text;
    }

    async LogCreate(isMute = false){
        this.logID = this.CreateLogID(16);
        this.actionDate = new Date();

        // Save the data to database
        await LogsDatabase.updateOne({
            guildID: this.guildID,
            userID: this.userID
        }, {
            guildName: this.guildName,
            Muted: isMute,
            Expire: this.Expire,
            $push: {
                [`Action`]: {
                    ...this.DataToJson()
                }
            }
        },{
            upsert: true,
        }).catch(err => {
            return console.log(err.stack);
        });
    }
}

module.exports = {LogManager};