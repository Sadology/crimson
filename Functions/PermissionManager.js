const { Guild } = require("../models");

class Permissions{
    constructor(client, guild){
        this.client = client;
        this.guild = guild;
    }

    AnyPermission(User, DataArr = [], admin = false, owner = false){
        if (!User.permissions.any(DataArr, { checkAdmin: admin, checkOwner: owner })){
            return true;
        }

        return false;
    };

    AllPermission(User, DataArr = [], admin = false, owner = false){
        if (User.permissions.has(DataArr, { checkAdmin: admin, checkOwner: owner })){
            return true;
        }
        
        return false;
    };

    async FetchDatabase(){
        let Data = await Guild.findOne({
            guildID: this.guild.id
        })

        if(!Data) return false

        return Data;
    }

    async RolePermission(User, cmd){
        let Data = await this.FetchDatabase()
        if(!Data) return true;
        
        if(Data.Commands.has(cmd)){
            
        }
    }

    ChannelPermission(){

    }
}

module.exports = {Permissions};