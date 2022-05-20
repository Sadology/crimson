// const { SlashCommandBuilder, userMention, memberNicknameMention } = require('@discordjs/builders');
// const Discord = require('discord.js')
// const axios = require('axios');

// module.exports.run = {
//     run: async(client, interaction, args, prefix)=> {
//         const options = {
//             method: 'GET',
//             url: 'https://unbelievaboat.com/api/v1/guilds/617358352468541440/users/571964900646191104',
//             headers: {
//               Accept: 'application/json',
//               Authorization: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcHBfaWQiOiI5MTY5MzIzNDcwOTI0MDQ2MDMiLCJpYXQiOjE2Mzg2ODQxMDd9.4qoysTeWSI5af2antpTPsoj7kGEUpaKZ6J5fyJ1pzAk'
//             }
//           };
          
//           axios.request(options).then(function (response) {
//             console.log(response.data);
//           }).catch(function (error) {
//             console.error(error);
//           });

//         interaction.reply("done")
//     }

// }

// module.exports.slash = {
//     data: new SlashCommandBuilder()
//         .setName('test')
//         .setDescription("Test bot")
// }