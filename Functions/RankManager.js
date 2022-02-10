// const { RankData } = require("../models");
// const Discord = require('discord.js');
// const newRank = new Discord.Collection();

// class RankManager{
//     constructor (guild, client){
//         this.guild = guild;
//         this.client = client;
//     }

//     async GuildRank(){
//         await RankData.findOne({
//             guildID: this.guild.id
//         })
//         .then(async res => {
//             if(!res){
//                 await RankData.findOneAndUpdate({
//                     guildID: this.guild.id
//                 }, {
//                     $set: {
//                         Settings: new Discord.Collection()
//                     }
//                 }, {upsert: true})
//                 .then(res => {
//                     return res
//                 })
//                 .catch(err => {return console.log(err.stack)})
//             }
//             return res
//         })
//     }

//     async CreateRank(member){
//         newRank.set(member.user.id, new Discord.Collection())
//         let dataCreation = newRank.get(member.user.id)
//             dataCreation.set("level", 0)
//             dataCreation.set("exp", 0)
//             dataCreation.set("nextlvl", 1)
//             dataCreation.set("nextlvlexp", 0)
//             dataCreation.set("totalexp", 0)
//             dataCreation.set("totalmessage", 0)

//         await RankData.findOneAndUpdate({
//             guildID: this.guild.id
//         }, {
//             $set: {
//                 [`Members.${member.user.id}`]: dataCreation
//             }
//         }, {upsert: true})
//         .catch(err => {return console.log(err.stack)})
//     }

//     async UpdateRank(member, message){
//         let db = await RankData.findOne({
//             guildID: this.guild.id
//         })

//         let data = db.Members?.get(member.user.id)
//         if(!data){
//             this.CreateRank(member)
//             return false
//         }

//         let expAmt = Math.floor(Math.random() * (100/*max*/ - 50/*min*/)) + 50 //Boost

//         data.exp += expAmt;
//         data.totalmessage += 1;
//         data.totalexp += expAmt
        
//         const ExpInc = (lvl) => lvl * lvl * 200
//         let required = ExpInc(data.level);

//         if(data.exp >= required){
//             ++data.level;
//             data.exp = 0;

//             let nextLvl = ExpInc(data.level);
//             data.nextlvlexp = nextLvl;
//             data.nextlvl += 1;

//             message.channel.send("GG you're level "+ data.level);
//         }

//         await RankData.updateOne({
//             guildID: this.guild.id,
//         }, {
//             [`Members.${member.user.id}`]: data
//         }, {upsert: true})

//         console.log(data);
//     }

//     async getData(member, message){
//         let db = await RankData.findOne({
//             guildID: this.guild.id
//         })

//         if(!db){
//             this.GuildRank()
//             return false
//         }

//         if(!db.Members?.has(member.user.id)){
//             this.CreateRank(member)
//             return false
//         }

//         let data = db.Members?.get(member.user.id)
//         if(!data){
//             this.CreateRank(member)
//             return false
//         }
        
//         return data
//     }
// }

// module.exports = RankManager