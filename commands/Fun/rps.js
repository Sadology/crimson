const { SlashCommandBuilder } = require('@discordjs/builders');
const {MessageEmbed, MessageActionRow, MessageButton} = require('discord.js');
const wait = require('util').promisify(setTimeout);

const row = new MessageActionRow()
    .addComponents(
        new MessageButton()
        .setCustomId('Rock')
        .setLabel("Rock")
        .setStyle("PRIMARY")
    )
    .addComponents(
        new MessageButton()
        .setCustomId('Paper')
        .setLabel("Paper")
        .setStyle("PRIMARY")
    )
    .addComponents(
        new MessageButton()
        .setCustomId('Scissor')
        .setLabel("Scissor")
        .setStyle("PRIMARY")
    )

class RockPaperScissor{
    constructor(client, guild, interaction){
        this.client = client;
        this.guild = guild;
        this.interaction = interaction;

        this.p1 = {
            id: Number,
            choice: String,
            collected: false
        }

        this.p2 = {
            id: Number,
            choice: String,
            collected: false
        }
    }

    async BotGame(){
        this.BotAnswer();

        this.p1.id = this.interaction.member.user.id;
        const filer = u => u.user.id == this.p1.id;

        let Embed = new MessageEmbed()
            .setDescription("Make a choice within 30 second")
            .setColor("#2f3136")
            
        this.interaction.deferReply();
        await wait(1000);

        row.components[0].setDisabled(false);
        row.components[1].setDisabled(false);
        row.components[2].setDisabled(false);

        this.interaction.editReply({content: `${this.interaction.member.user} Vs ${this.client.user}`,embeds: [Embed], components: [row]}).then(m => {
            let collector = m.createMessageComponentCollector({filer, componentType: "BUTTON", time: 1000 * 30});

            collector.on('collect', (b) => {
                if(b.user.id == this.interaction.member.user.id){
                    if(this.p1.collected){
                        return b.reply({embeds: [
                            new MessageEmbed()
                                .setDescription("You're already locked in")
                                .setColor("RED")
                        ], ephemeral: true})
                    }

                    this.p1.choice = b.customId;
                    this.p1.collected = true;

                    b.reply({embeds: [
                        new MessageEmbed()
                            .setDescription(`${b.customId} locked in`)
                            .setColor("GREEN")
                    ], ephemeral: true})

                }

                if(this.p1.collected && this.p2.collected){
                    this.result(this.client, m);
                    collector.stop();
                }
            })

            collector.on('end', ()=> {
                row.components[0].setDisabled(true);
                row.components[1].setDisabled(true);
                row.components[2].setDisabled(true);

                m.edit({components: [row]});
            })
        })
    }

    BotAnswer(){
        let gameGesture = ['Rock', 'Paper', 'Scissor']
        let choice = gameGesture[Math.floor(Math.random() * gameGesture.length)]

        this.p2.id = this.client.user.id;
        this.p2.choice = choice;
        this.p2.collected = true;

    }

    PlayerFind(user){
        let member = this.guild.members.cache.get(user);

        let embed = new MessageEmbed()

        if(!member) {
            embed.setDescription("<:error:921057346891939840> Mentioned member is invalid")
            embed.setColor("RED")
            return this.errorHandle(embed);
        }

        if(member.user.id == this.client.user.id || member.user.id == this.interaction.member.user.id){
            embed.setDescription("<:error:921057346891939840> You can't play with this member")
            embed.setColor("RED")

            return this.errorHandle(embed);
        }

        this.p1.id = this.interaction.member.user.id;
        this.p2.id = member.user.id;

        this.MainFrame(member);
    }

    async MainFrame(member){
        const filer = u => u.user.id == this.p1.id || u.user.id == this.p2.id;

        let Embed = new MessageEmbed()
            .setDescription("Make a choice within 30 second")
            .setColor("#2f3136")
            
        this.interaction.deferReply();
        await wait(1000);

        row.components[0].setDisabled(false);
        row.components[1].setDisabled(false);
        row.components[2].setDisabled(false);

        this.interaction.editReply({content: `${this.interaction.member.user} Vs ${member.user}`,embeds: [Embed], components: [row]}).then(m => {
            let collector = m.createMessageComponentCollector({filer, componentType: "BUTTON", time: 1000 * 30});

            collector.on('collect', (b) => {
                if(b.user.id == this.interaction.member.user.id){
                    if(this.p1.collected){
                        return b.reply({embeds: [
                            new MessageEmbed()
                                .setDescription("You're already locked in")
                                .setColor("RED")
                        ], ephemeral: true})
                    }

                    this.p1.choice = b.customId;
                    this.p1.collected = true;

                    b.reply({embeds: [
                        new MessageEmbed()
                            .setDescription(`${b.customId} locked in`)
                            .setColor("GREEN")
                    ], ephemeral: true})

                }

                if(b.user.id == member.user.id){
                    if(this.p2.collected){
                        return b.reply({embeds: [
                            new MessageEmbed()
                                .setDescription("You're already locked in")
                                .setColor("RED")
                        ], ephemeral: true})
                    }

                    this.p2.choice = b.customId;
                    this.p2.collected = true;

                    b.reply({embeds: [
                        new MessageEmbed()
                            .setDescription(`${b.customId} locked in`)
                            .setColor("GREEN")
                    ], ephemeral: true})
                }

                if(this.p1.collected && this.p2.collected){
                    this.result(member, m)

                    collector.stop();
                }
            })

            collector.on('end', ()=> {
                row.components[0].setDisabled(true);
                row.components[1].setDisabled(true);
                row.components[2].setDisabled(true);

                m.edit({components: [row]});
            })
        })
    }

    result (member, msg){
        let winner;
        let pick1 = this.p1.choice.toLowerCase();
        let pick2 = this.p2.choice.toLowerCase();
        let embed = new MessageEmbed()

        if(this.p1.choice == this.p2.choice){
            embed.setAuthor({name: "Rock! Paper! Scissor!"})
            embed.setDescription(`${this.interaction.member} • ${this.p1.choice}\n${member.user} • ${this.p2.choice} \n\nThe game was draw`)
            embed.setColor("YELLOW")

            return msg.edit({content: `No one made it 😔`,embeds: [embed]});
        }

        switch(pick1){
            case 'rock':
                if(pick2 == 'paper'){
                    winner = 'paper'
                }
                else {
                    winner = 'rock'
                }
            break;
            case 'paper':
                if(pick2 == 'rock'){
                    winner = 'paper'
                }
                else {
                    winner = 'scissor'
                }
            break;
            case 'scissor':
                if(pick2 == 'rock'){
                    winner = 'rock'
                }
                else {
                    winner = 'scissor'
                }
            break;
        }

        if(this.p1.choice.toLowerCase() == winner){
            embed.setAuthor({name: "Rock! Paper! Scissor!"})
            embed.setDescription(`${this.interaction.member} • ${this.p1.choice}\n${member.user} • ${this.p2.choice} \n\n${this.interaction.member} won 🎉`)
            embed.setColor("GREEN")

            return msg.edit({content: `${this.interaction.member.user} Won`, embeds: [embed]});

        }
        else if(this.p2.choice.toLowerCase() == winner){
            embed.setAuthor({name: "Rock! Paper! Scissor!"})
            embed.setDescription(`${this.interaction.member} • ${this.p1.choice}\n${member.user} • ${this.p2.choice} \n\n${member.user} won 🎊`)
            embed.setColor("GREEN")

            return msg.edit({content: `${member.user} Won`, embeds: [embed]});
        }

    }

    errorHandle(embed){
        this.interaction.reply({embeds: [embed], ephemeral: true })
        .catch(err => {return console.log(err.stack)});
    }
}

module.exports.run = {
    run: async(client, interaction ) =>{
        const {options} = interaction;
        
        let user = options.getUser('member');

        if(user){
            let data = new RockPaperScissor(client, interaction.guild, interaction).PlayerFind(user ? user.id : user)
        }
        else {
            let data = new RockPaperScissor(client, interaction.guild, interaction).BotGame()
        }
    }
}

module.exports.slash = {
    data: new SlashCommandBuilder()
        .setName('rps')
        .setDescription("The classic rock! paper! scissor! game")
        .addUserOption(option => 
            option
            .setName('member')
            .setDescription('Play with another member')
        )
}