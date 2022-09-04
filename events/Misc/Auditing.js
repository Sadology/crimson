const Discord = require('discord.js');
const client = require('../..');
const {Stats} = require('../../models')


class AudittingManager{
    constructor(client, guild, data) {
        this.client = client;
        this.guild = guild;
        this.data = data;
    }

    async Mainframe(user){
        if(this.data.Moderation == true){
            let stats = await Stats.findOne({
                guildID: this.guild,
                userID: user,
                Stats: {$exists: true}
            }).catch(err => {return console.log(err.stack)})

            if(!stats){
                this.newData('stats', user)
            }

            else {
                this.UpdateData(user)
            }
        }

        this.updateAudit();
    }

    async UpdateData(user){
        await Stats.findOneAndUpdate({
            guildID: this.guild,
            userID: user,
        },{
            $inc: {
                [`Stats.$.${this.data.Command}`]: 1
            }
        }, {
            upsert: true,
        }).catch(err => {return console.log(err.stack)})
    }

    async updateAudit(){
        await Stats.updateOne({
            guildID: this.guild,
            AuditLog: true,
        }, {
            $push: {
                [`Audits`]: {
                    ...this.data
                }
            }
        }, {upsert: true}).catch(err => {return console.log(err.stack)})
    }

    async newData(type, user){
        switch(type){
            case 'stats':
                await Stats.updateOne({
                    guildID: this.guild,
                    userID: user,
                    Stats: {$exists: false}
                }, {
                    "Stats": {
                        Mute: 0,
                        Warn: 0,
                        Ban: 0,
                        Timeout: 0,
                        Kick: 0,
                        Unmute: 0,
                        Unban: 0
                    },
                }, {upsert: true})
                .then(() => {this.UpdateData(user)})
                .catch(err => {return console.log(err)})
            break;

            case 'audit':

            break;
        }
    }
}
client.eventEmitter.on('AuditAdd', async(data) => {
    if(data.User.user){
        if(data.User.user.bot == true) return;
    }

    else if (data.User.bot == true) return;

    let memId = data.User.user ? data.User.user.id : data.User.id ? data.User.id : data.User;

    //let audit = new AudittingManager(client, data.Guild.id ? data.Guild.id : data.Guild, data).Mainframe(memId)
    // let stats = await Stats.findOne({
    //     guildID: data.Guild.id ? data.Guild.id : data.Guild,
    //     userID: memId,
    //     Stats: {$exists: true}
    // }).catch(err => {return console.log(err.stack)})

    // async function statisticsManager(){
    //     await Stats.findOne({
    //         guildID: data.Guild.id ? data.Guild.id : data.Guild,
    //         userID: memId,
    //         Stats: {$exists: true}
    //     }).then( async res => {
    //         if(!res){
    //             await Stats.create({
    //                 guildID: data.Guild.id ? data.Guild.id : data.Guild,
    //                 userID: memId,
    //                 "Stats": {
    //                     Mute: 0,
    //                     Warn: 0,
    //                     Ban: 0,
    //                     Timeout: 0,
    //                     Kick: 0,
    //                     Unmute: 0,
    //                     Unban: 0
    //                 },
    //             })
    //             .then(() => {
    //                 AuditManager()
    //             })
    //             .catch(err => {return console.log(err.stack)})
    //         }

    //         await Stats.updateOne({
    //             guildID: data.Guild.id ? data.Guild.id : data.Guild,
    //             userID: memId
    //         }, {
    //             $inc: {
    //                 [`Stats.${data.Command}`]: 1
    //             }
    //         }, {upsert: true})
    //         .then(() => {
    //             AuditManager()
    //         })
    //         .catch(err => {return console.log(err.stack)})
    //     })

    // }

    // if(data.Moderation){
    //     statisticsManager();
    // }
    // else {
    //     AuditManager()
    // }

    // async function AuditManager(){
    //     delete data['Moderation']

    //     data['User'] = data.User.user ? data.User.user.tag : data.User.tag ? data.User.tag : data.User

    //     await Stats.findOne({
    //         guildID: data.Guild.id ? data.Guild.id : data.Guild,
    //         AuditLog: true,
    //     })
    //     .then( async res => {
    //         if(!res){
    //             await Stats.create({
    //                 guildID: data.Guild.id ? data.Guild.id : data.Guild,
    //                 AuditLog: true,
    //                 $push: {
    //                     ['Audits']: data
    //                 }
    //             }).catch(err => {return console.log(err.stack)})
    //         }

    //         await Stats.updateOne({
    //             guildID: data.Guild.id ? data.Guild.id : data.Guild,
    //             AuditLog: true,
    //         }, {
    //             $push: {
    //                 [`Audits`]: {
    //                     ...data
    //                 }
    //             }
    //         }, {upsert: true}).catch(err => {return console.log(err.stack)})
    //     })
    //     .catch(err => {return console.log(err.stack)})

    // }
    
});