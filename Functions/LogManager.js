class LogManagers{
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
        }
    }
}

module.exports = {LogManagers}