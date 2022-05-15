const Discord = require('discord.js');
const { MessageMentions: { USERS_PATTERN } } = require('discord.js');

class Member{
    /**
    * @param {Object} client - client fucntion
    */
    constructor(client){
        this.Client = client;
    }

    FormatMention(mention){
        mention = mention.trim();
        //mention = mention.split(/ +/g)
        if(mention.match(/(<@![1-9])\d+>/g) || mention.match(/([1-9])\d+/g)){
            mention = mention.replace(/\D+/g, '')

            return mention
        }
        else return false
    }
}

// Find in the Guild
class GuildMember extends Member{
    /**
     * 
     * @param {Object} client - client fuinction
     * @param {Object} guild - interaction guild
     * @param {Object} interaction - interaction
     */
    constructor(client, guild){
        super(client);

        this.client = client;
        this.guild = guild;
    }

    async Member(rawID, interaction){
        let ID = super.FormatMention(rawID)

        let errorEmbed = new Discord.MessageEmbed()
            .setDescription("<:error:921057346891939840> Mentioned user is invalid")
            .setColor("RED")

        if(!ID){
            if(interaction){
                return this.ErrManager(errorEmbed, interaction);
            }
        };

        ID = ID.trim();
        
        await this.guild.members.fetch();
        let member = this.guild.members.resolve(ID);

        if(!member){
            if(interaction){
                return this.ErrManager(errorEmbed, interaction);
            }
        }

        return member;
    }

    async MemberNonHandled(rawID){
        let ID = super.FormatMention(rawID)

        if(!ID){
            return false;
        };

        ID = ID.trim();
        
        await this.guild.members.fetch();
        let member = this.guild.members.resolve(ID);
        if(!member){
            return {exist: false, ID};
        }

        return member;
    }

    ErrManager(embed, interaction){
        switch (interaction.type){
            // If its slash command, reply with embed
            case 'APPLICATION_COMMAND':
                interaction.reply({embeds: [embed]})
            break;

            // If its default command, send the message
            case 'DEFAULT':
                interaction.channel.send({embeds: [embed]})
            break;
        };
    }
}

// Find mamber globally
class ClientMember extends Member{
    constructor(client, mention, interaction,){
        super(client, mention, interaction,);
    }

    Member(){
        let ID = super.FormatMention()

        let errorEmbed = new Discord.MessageEmbed()
            .setTitle("<:error:921057346891939840> Please mention a valid member")
            .setColor("RED")

        if(!ID){
            return this.interaction.reply({embeds: [errorEmbed]});
        };

        let member = this.Client.members.resolve(ID);
        if(!member){
            return this.interaction.reply({embeds: [errorEmbed]}); 
        }

        return member;
    }
}

class FindMember{
    constructor(){

    }
}

module.exports = {Member, GuildMember, ClientMember, FindMember}