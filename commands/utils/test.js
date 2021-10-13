const Discord = require('discord.js');
const sourcebin = require('sourcebin')
const { errLog } = require('../../Functions/erroHandling');
const { Member } = require('../../Functions/MemberFunction');
const { GuildRole } = require('../../models');
const { Permissions } = require('discord.js');
const { GuildChannel } = require('../../models');
const { LogChannel } = require('../../Functions/logChannelFunctions');
const fetch = require('node-fetch');
const e = require('express');
const  app = require('express')();
module.exports = {
    name: 'test',
    description: 'ping pong',
    category: 'Utils',
    disabled: true,
    run: async(client, message, args)=> {

        const publicIp = require('public-ip');

        (async () => {
            let address1 = await publicIp.v4()
            if(address1){
              console.log(await publicIp.v4());

              let list = await fetch(`http://api.ipstack.com/${address1}?access_key=42e593799a9bdaac7abddbccb9174715`)
              .then(response => response.text())
              .then(text => console.log(text))
            }else {
                return console.log("none")
            }
            // if(address2){
            //     console.log(await publicIp.v6());

            //     let list = await fetch(`http://api.ipstack.com/${address2}?access_key=42e593799a9bdaac7abddbccb9174715`)
            //     .then(response => response.text())
            //     .then(text => console.log(text))
            // }else {
            //     return
            // }

        })();

    }
}