const mongoose = require('mongoose');

const profilesSchema = mongoose.Schema({
    guildID: String,
    guildName: String,
    userID: String,
    userName: String,
    Stories: Date,
    Cookies: Number,
    ModerationStats: {
        Recent: String,
        Mute: Number,
        Purge: Number,
        Ban: Number,
        kick: Number,
        Total: Number
    },
    Status: {
        Active: Boolean,
        MSG: String,
        Time: Date
    },
    OnlineTime: {
        LastOnline: Date,
        OnlineSince: Date,
        TotalHours: Number,
    },
    Economy: {
        Balance: Number,
        Job: String,
    },
    Rank: {
        Experience: Number,
        NextLvlExp: Number,
        Level: Number,
        RankCard: {
            url: String,
            overlay: String,
            barColor: String,
            fontColor: String
        },
        CoolDown: Number,
        TotalMsg: Number,
        TotalExp: Number,
    }
})

module.exports = mongoose.model('Profiles', profilesSchema);