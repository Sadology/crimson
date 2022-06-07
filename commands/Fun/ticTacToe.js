const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const wait = require('util').promisify(setTimeout);

const row1= new MessageActionRow()
.addComponents(
    new MessageButton()
        .setCustomId('c0')
        .setStyle('PRIMARY')
        .setEmoji('➖')
)
.addComponents(
    new MessageButton()
        .setCustomId('c1')
        .setStyle('PRIMARY')
        .setEmoji('➖')
)
.addComponents(
    new MessageButton()
        .setCustomId('c2')
        .setStyle('PRIMARY')
        .setEmoji('➖')
)

const row2= new MessageActionRow()
.addComponents(
    new MessageButton()
        .setCustomId('c3')
        .setStyle('PRIMARY')
        .setEmoji('➖')
)
.addComponents(
    new MessageButton()
        .setCustomId('c4')
        .setStyle('PRIMARY')
        .setEmoji('➖')
)
.addComponents(
    new MessageButton()
        .setCustomId('c5')
        .setStyle('PRIMARY')
        .setEmoji('➖')
)

const row3 = new MessageActionRow()
.addComponents(
    new MessageButton()
        .setCustomId('c6')
        .setStyle('PRIMARY')
        .setEmoji('➖')
)
.addComponents(
    new MessageButton()
        .setCustomId('c7')
        .setStyle('PRIMARY')
        .setEmoji('➖')
)
.addComponents(
    new MessageButton()
        .setCustomId('c8')
        .setStyle('PRIMARY')
        .setEmoji('➖')
)

class TicTacToe{
    constructor(client, guild, interaction){
        this.client = client;
        this.guild = guild;
        this.interaction = interaction;
    }

    async Mainframe(user){
        if(!user.id || user.id == this.interaction.user.id || user.bot){
            return this.interaction.reply({embeds: [
                new MessageEmbed()
                    .setDescription(`Can't play with this user`)
                    .setColor("RED")
            ]})
        }

        let guildmember = this.guild.members.cache.get(user.id)
        if(!guildmember){
            return this.interaction.reply({embeds: [
                new MessageEmbed()
                    .setDescription(`Please mention a valid member`)
                    .setColor("RED")
            ]})
        }

        this.frame = {
            c0: "",
            c1: "",
            c2: "",
            c3: "",
            c4: "",
            c5: "",
            c6: "",
            c7: "",
            c8: "",
        }

        this.game = {
            turn: String,
            p1: this.interaction.member.user.id,
            p2: user.id,
            ended: false,
            cellfull: false,
        }

        this.interaction.deferReply();
        await wait(1000);
        
        this.game.turn = this.interaction.member.user.id;

        for (let i=0;i<=2;i++){
            row1.components[i].setEmoji('➖')
            row1.components[i].setDisabled(false)

            row2.components[i].setEmoji('➖')
            row2.components[i].setDisabled(false)

            row3.components[i].setEmoji('➖')
            row3.components[i].setDisabled(false)
        }

        let mainEmbed = new MessageEmbed()
            .setTitle("TicTacToe")
            .setDescription(`<@${this.game.p1}> Vs <@${this.game.p2}> \n\n**${this.interaction.member.user.username} • ** ⭕\n**${user.username} • ** ❌`)
            .setColor("#2f3136")

        const filter = u => u.user.id == this.game.turn;

        this.interaction.editReply({content: `<@${this.game.p1}>'s Turn`, embeds: [mainEmbed], components: [row1, row2, row3]}).then(msg => {
            let collector = msg.createMessageComponentCollector({filter, componentType: 'BUTTON', time: 1000 * 60 * 5})

            collector.on('collect', async (button) => {

                this.frame[button.customId] = button.user.id;
                this.possibility();
                this.handleButton(button.customId, msg);

                if(this.game.cellfull == true){
                    mainEmbed.addField("Result", `Draw`)
                    .setColor("YELLOW")

                    collector.stop();
                    
                    return button.update({content: 'Draw', embeds: [mainEmbed], components: [row1, row2, row3]});
                }
                
                if(this.game.ended == true){
                    mainEmbed.addField("Result", `<@${this.game.turn}> Won 🎉`)
                    .setColor("GREEN")

                    collector.stop();

                    return button.update({content: `Congratulation`, embeds: [mainEmbed], components: [row1, row2, row3]});
                }

                if(this.game.turn == this.game.p1 && button.user.id == this.game.turn){
                    this.game.turn = this.game.p2
                }

                else if(this.game.turn == this.game.p2 && button.user.id == this.game.turn){
                    this.game.turn = this.game.p1
                };

                await button.update({content: `<@${this.game.turn}>'s Turn`, embeds: [mainEmbed], components: [row1, row2, row3]})
            })

            collector.on('end', () => {
                for (let i=0;i<=2;i++){
                    row1.components[i].setDisabled(true)
                    row2.components[i].setDisabled(true)
                    row3.components[i].setDisabled(true)
                }

                msg.edit({content: `Game Ended`, embeds: [mainEmbed], components: [row1, row2, row3]})
            })

            
        })
    }

    handleButton(cell, msg){
        switch (cell) {
            case 'c0':
            case 'c1':
            case 'c2':
                cell = cell.slice(1);
                cell = parseInt(cell);

                if(this.game.turn == this.game.p1){
                    row1.components[cell].setEmoji('⭕')
                    row1.components[cell].setDisabled(true)
                }

                else if(this.game.turn == this.game.p2){
                    row1.components[cell].setEmoji('❌')
                    row1.components[cell].setDisabled(true)
                }

                msg.edit({components: [row1, row2, row3]})
            break;

            case 'c3':
            case 'c4':
            case 'c5':
                cell = cell.slice(1);
                cell = parseInt(cell);
                cell = cell - 3

                if(this.game.turn == this.game.p1){
                    row2.components[cell].setEmoji('⭕')
                    row2.components[cell].setDisabled(true)
                }

                else if(this.game.turn == this.game.p2){
                    row2.components[cell].setEmoji('❌')
                    row2.components[cell].setDisabled(true)
                }

                msg.edit({components: [row1, row2, row3]})
            break;

            case 'c6':
            case 'c7':
            case 'c8':
                cell = cell.slice(1);
                cell = parseInt(cell);
                cell = cell - 6

                if(this.game.turn == this.game.p1){
                    row3.components[cell].setEmoji('⭕')
                    row3.components[cell].setDisabled(true)
                }

                else if(this.game.turn == this.game.p2){
                    row3.components[cell].setEmoji('❌')
                    row3.components[cell].setDisabled(true)
                }

                msg.edit({components: [row1, row2, row3]})
            break;
        }  
    }

    possibility(){
        if(this.frame.c1){
            if(this.frame.c1 === this.frame.c0 && this.frame.c1 === this.frame.c2){
                this.game.ended = true
            }
        }

        if(this.frame.c4){
            if(this.frame.c4 === this.frame.c2 && this.frame.c4 === this.frame.c6){
                this.game.ended = true
            }
            if(this.frame.c4 === this.frame.c0 && this.frame.c4 === this.frame.c8){
                this.game.ended = true
            }
            if(this.frame.c4 === this.frame.c1 && this.frame.c4 === this.frame.c7){
                this.game.ended = true
            }
            if(this.frame.c4 === this.frame.c3 && this.frame.c4 === this.frame.c5){
                this.game.ended = true
            }
        }

        if(this.frame.c7){
            if(this.frame.c7 === this.frame.c6 && this.frame.c7 === this.frame.c8){
                this.game.ended = true
            }
        }

        if(this.frame.c3){
            if(this.frame.c3 === this.frame.c0 && this.frame.c3 === this.frame.c6){
                this.game.ended = true
            }
        }

        if(this.frame.c5){
            if(this.frame.c5 === this.frame.c2 && this.frame.c5 === this.frame.c8){
                this.game.ended = true
            }
        }

        const areTruthy = Object.values(this.frame).every(value => value);
        if(areTruthy){
           this.game.cellfull = true 
        }
    }
}

module.exports.run = {
    run: async(client, interaction) =>{
        const user = interaction.options.getUser("user");

        let data = new TicTacToe(client, interaction.guild, interaction).Mainframe(user);

    }
}

module.exports.slash = {
    data: new SlashCommandBuilder()
        .setName('tictactoe')
        .setDescription("The classic tic tac toe game")
        .addUserOption(option => 
            option
            .setName('user')
            .setDescription('Play with a friend')
            .setRequired(true)),
    category: "Fun",
    ClientPermissions: ["SEND_MESSAGES", "EMBED_LINKS"]
}