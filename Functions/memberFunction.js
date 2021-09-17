class Member{
    constructor (member, message){
        this.member = member
        this.message = message
        const regex = /[\d]/g;

        if(this.member.match(regex)){
            const Member = this.message.guild.members.fetch(this.member)

            if(Member){
                return Member
            }else {
                throw new console.error("Member is not valid"); 
            }
        }
    }
}

module.exports = { Member }