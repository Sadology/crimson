class LogCreate{
    constructor(data = {}){
        this.setup(data)
    };

    setup(data){
        this.GuildID = data.guildID;
        this.GuildName = data.guildName;
        this.UserID = data.userID;
        this.UserName = data.userName;
        this.CaseID = data.caseID;
        this.ActionType = data.actionType;
        this.Muted = true;
        this.ActionLength = data.Expire;
        this.ActionReason = data.actionReason;
        this.Moderator = data.moderator;
        this.ModeratorID = data.moderatorID;
        this.ActionDate = new Date()
        this.Duration = data.Duration
    };

    caseID(id){
        this.CaseID = id;
        return this;
    };

    guildID(id){
        this.GuildID = id;
        return this;
    };

    guildName(name){
        this.GuildName = name;
        return this;
    };

    userID(id){
        this.UserID = id;
        return this;
    };

    userName(name){
        this.UserName = name;
        return this;
    };

    actionType(type){
        this.ActionType = type;
        return this;
    };

    actionReason(reason){
        this.ActionReason = reason;
        return this
    };

    actionLength(expire){
        this.ActionLength = expire;
        return this;
    };

    moderator(mod){
        this.Moderator = mod;
        return this;
    };

    moderatorID(modID){
        this.ModeratorID = modID;
        return this;
    };

    duration(dr){
        this.Duration = dr;
        return this;
    }
}
module.exports = LogCreate