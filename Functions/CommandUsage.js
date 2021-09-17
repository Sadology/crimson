const { ModStats } = require('../models')
async function commandUsed(guild, guildName, user, userName, Cmd, amount, recent) {
    const Data = await ModStats.findOneAndUpdate({
        guildID: guild,
        userID: user
    }, {
        guildName: guildName,
        userName: userName,
        Recent: recent,
        user: user,
            $inc:{
                [Cmd]: amount,
                Command: 1
            }
    }, {
        upsert: true,
    })
}
module.exports = { commandUsed };