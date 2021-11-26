// const { SlashCommandBuilder } = require('@discordjs/builders');
// const { Monsters } = require('../../localDb/index');

// module.exports = {
//     data: new SlashCommandBuilder()
//         .setName('adventure')
//         .setDescription('spawns monster'),
//     run: async(client, interaction) =>{
//         let wl = 2
//         class mobCreate{
//             constructor(data = {}){
//                 this.pickMob(data)
//             };

//             pickMob(data){
//                 this.Name = data.name
//                 let monsters = Monsters
//                 monsters.forEach(i => {
//                     (Object.keys(i).forEach(e => {
//                         if( e <= wl ){
//                             let itemArr = i[wl]
//                             let mob = itemArr[Math.floor(Math.random() * itemArr.length)]
//                             this.Mod = mob
//                         }
//                     }))
//                 })
//             }

//             sameMob(){
//                 console.log(this.Mod)
//             }
//         }

//         let i = new mobCreate()
//         //console.log(i)
//     }
// }