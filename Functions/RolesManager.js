const { MessageEmbed, Role } = require('discord.js');

class RoleManager{
    constructor(client, guild, interaction){
        this.client = client;
        this.guild = guild;
        this.interaction = interaction;
    }

    FetchRole( data ){
        let Roles;
        let RolesArray = [];

        if(Array.isArray(data.name)){
            data.name.forEach(role => {
                let roleFind = this.guild.roles.cache.find(r => r.name.toLowerCase() == role.toLowerCase()) || 
                this.guild.roles.cache.find(r => r.id == role);

                if(roleFind){
                    RolesArray.push(roleFind.id);
                };
            })
        }
        else {
            Roles = this.guild.roles.cache.find(r => r.name.toLowerCase() == data.name.toLowerCase()) || 
            this.guild.roles.cache.find(r => r.id == data.name);
        }
        
        return Roles ? Roles : RolesArray;
    }

    async OverrideCreate(role){
        if(!this.guild.me.permissions.any(["MANAGE_CHANNELS", "ADMINISTRATOR"])){
            return;
        }

        if(role.name !== 'muted') return;

        await this.guild.channels.cache.forEach(channel => {
            let perms = {

            }
            if(channel.permissionsFor(this.guild.me).has("MANAGE_CHANNELS")){
                if(channel.permissionsFor(this.guild.me).has(["VIEW_CHANNEL" ? 'VIEW_CHANNEL' : 'CONNECT'])){
                    perms[['VIEW_CHANNEL' ? 'VIEW_CHANNEL' : 'CONNECT']] = false
                }
                if(channel.permissionsFor(this.guild.me).has('ADD_REACTIONS')){
                    perms['ADD_REACTIONS'] = false
                }
                if(channel.permissionsFor(this.guild.me).has('SEND_MESSAGES')){
                    perms['SEND_MESSAGES'] = false
                }
                if(channel.permissionsFor(this.guild.me).has('CREATE_PUBLIC_THREADS')){
                    perms['CREATE_PUBLIC_THREADS'] = false
                }
                if(channel.permissionsFor(this.guild.me).has('SEND_MESSAGES_IN_THREADS')){
                    perms['SEND_MESSAGES_IN_THREADS'] = false
                }
                if(channel.permissionsFor(this.guild.me).has('CREATE_PRIVATE_THREADS')){
                    perms['CREATE_PRIVATE_THREADS'] = false
                }
            }
            channel.permissionOverwrites.edit(role.id, 
            {   
                ...perms
            }, "Muted role Over-Writes").catch(err => {return console.log(err.stack)})
        });
    }

    async createRole(data, interaction){
        if(!data) throw new Error('Required data object');
        let success = false;

        // Check if client has the right permission
        if(!this.guild.me.permissions.any(["ADMINISTRATOR", "MANAGE_ROLES"])){
            let missing = this.guild.me.permissions.missing(["MANAGE_ROLES"])
            missing = missing.join(', ');
            missing = missing.replace(/_/g, '-');

            let Embed = new MessageEmbed()
                .setDescription(`Missing permission\n• ${missing}`)
                .setColor("RED")

            return this.ErroData(Embed, interaction ? interaction : false);
        }

        // Create a new role
        try {
            await this.guild.roles.create({
                    name: data.name,
                    color: data.color ? data.color : "#000000",
                    permissions: data.permissions ? data.permissions : [],
                    reason: `${this.client.user.username} role creation`
            }).then((role) => {
                success = true
                this.OverrideCreate(role)
            }).catch(err => {return console.log(err)});
            
        }catch(err){
            return console.log(err);
        };

        return success
    }

    ErroData(embed, inter){
        if(inter){
            inter.reply({embeds: [embed], allowedMentions: [{repliedUser: false}]});
        }

        else if(this.interaction){
            this.interaction.reply({embeds: [embed], allowedMentions: [{repliedUser: false}]});
        };
    }
}

class UserRoleManager extends RoleManager{
    constructor(client, guild, interaction){
        super(client, guild, interaction)

        this.client = client;
        this.guild = guild;
        this.interaction = interaction;
    }

    async AddRole(user, data){
        let success = false;
        let Role = super.FetchRole(data);

        if(!Role || Role.length == 0) {
            if(data.newCreate == true){
                let newRole = await super.createRole(data);
                if(newRole){
                    return this.AddRole(user, data);
                }
                else {
                    return;
                }
            }
            else return;
        };

        let rolepos = this.RolePosition(user, Role)
        if(!rolepos) return;
        
        await user.roles.add(Role.id)
        .then(() => success = true)
        .catch(err => {return console.log(err)});

        return success;
    }

    async RemoveRole(user, data){
        let Role;
        let success = false;
        Role = super.FetchRole(data);

        let rolepos = this.RolePosition(user, Role)
        if(!rolepos) return;

        await user.roles.remove(Role.id)
        .then(() => success = true)
        .catch(err => {return console.log(err)});

        return success;
    }

    RolePosition(user, role){
        let Embed = new MessageEmbed()
            .setColor("RED")

        const clientTopRole = this.guild.members.resolve( this.client.user ).roles.highest.position;

        if(user.permissions.any(["MANAGE_MESSAGES", "MANAGE_ROLES", "MANAGE_GUILD", "ADMINISTRATOR", "KICK_MEMBERS", "BAN_MEMBERS", "MANAGE_CHANNELS", "MODERATE_MEMBERS"], { checkAdmin: true, checkOwner: true })){
            Embed.setDescription("<:error:921057346891939840> Can't mute a Mod/Admin")
            return super.ErroData(Embed)

        }else if(role.position >= clientTopRole){
            Embed.setDescription("<:error:921057346891939840> "+role.toString()+" role position is Higher or equal as my highest role")
            return super.ErroData(Embed)
        }

        else return true
    }
}

module.exports = {RoleManager, UserRoleManager};