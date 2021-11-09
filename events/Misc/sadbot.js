const Discord = require('discord.js');
const Data = require('../../localDb/questions.json');
const member = require('../../commands/Fun/generator');
const axios = require('axios');
const { guessAge, generateAdvice } = require('../../Functions/sadbotFunctions')
const session = new Map()
module.exports = {
    event: 'messageCreate',
    once: false,
    run: async(message, client) =>{
        // if(message.content.startsWith('hey' + ' ' + 'sadbot')){
        //     if(session.has(message.author.id)){
        //         return
        //     }else {
        //         session.set(message.author.id)
        //     }
        //     message.channel.send("Hello, how can i help you?").then(msg =>{
        //         const filter = m => m.author.id === message.author.id
        //         const collector = msg.channel.createMessageCollector({ filter, idle: 1000 * 10 });

        //         collector.on('collect', m => {
        //             let msg = m.content.split(/[.\-_`~&!@*()+/$#?,]/).slice().join('')

        //             Data.forEach(data => {
        //                 let value = data.Q.find(i => i == msg)
        //                 if(value){
        //                     let answers = data.A
        //                     let randomPicker = answers[Math.floor(Math.random() * answers.length)]
        //                     switch(value){
        //                         case 'guess my age':
        //                             guessAge(m.author.username).then(age => {
        //                                 if(age == null){
        //                                     m.channel.send(`I think you're way too old, i can't even guess.`)
        //                                 }else m.channel.send(`I think you're ${age} years old`)
        //                             })
        //                         case 'give me advice':
        //                             generateAdvice().then(ad => {
        //                                 m.channel.send(ad)
        //                             })
        //                         default:
        //                             m.channel.send(randomPicker)
        //                     }
        //                 }
        //             })
        //         });

        //         collector.on('end', collected => {
        //             session.delete(message.author.id)
        //         });
        //     })
        // }else {
        //     return
        // }
    }
}