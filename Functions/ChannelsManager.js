class ChannelManager{
    constructor(client, guild){
        this.client = client;
        this.guild = guild;
    }

    fetchChannel(channelName, type){
        let channel;
        let foundChannel = [];
        let notFoundChannel = [];

        if(Array.isArray(channelName)){
            channelName.forEach(channel => {
                let channelFind = this.guild.roles.cache.find(c => c.name.toLowerCase() == channel.toLowerCase()) || 
                this.guild.roles.cache.find(c => c.id == channel);

                if(channelFind){
                    switch (type){
                        case "string":
                            foundChannel.push(channelFind.toString());
                        break;
                        case 'id':
                            foundChannel.push(channelFind.id);
                        break;
                        case 'name':
                            foundChannel.push(channelFind.name);
                        break;
                    }
                }

                else {
                    notFoundChannel.push(channel)
                }
            })
        }

        else {
            channel = this.guild.roles.cache.find(c => c.name.toLowerCase() == channelName.toLowerCase()) || 
            this.guild.roles.cache.find(c => c.id == channelName);
        }
        
        return channel ? channel : {found: foundChannel, notfound: notFoundChannel};
    };

    createChannel(){

    };

    editChannel(){

    }

    overrideCreate(channel){

    };

    overrideEdit(role, channel, perms){
        if(channel){
            let overChan = this.fetchChannel(channel);
            if(!overChan) return false;
            if(!overChan.permissionsFor(this.client.user).has(["MANAGE_CHANNELS"])){
                return false
            }
            channel.permissionOverwrites.edit(role.id, 
            {   
                ...perms
            }, "Role Over-Writes").catch(err => {return console.log(err.stack)})
            return true;
        }

        else {
            this.guild.channels.cache.forEach(channel => {
                channel.permissionOverwrites.edit(role.id, 
                {   
                    ...perms
                }, "Role Over-Writes").catch(err => {return console.log(err.stack)})
            });
        }
    }

    overrideRemove(){

    }

}