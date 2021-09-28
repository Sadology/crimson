class Member{
    /**
     * @param {string} member
     * @param {string} message
     * @returns 
     */
    constructor (member, message){
        this.member = member
        this.message = message
        this.mentionedMember
        if(this.member.startsWith('<@')){
            this.mentionedMember = this.member.replace('<@', '').replace('>', '')
            .replace('&', '')
            .replace('!', '').trim();
        }else {
            this.mentionedMember = this.member
        }
        const regex = /[\d]/g;

        if(this.mentionedMember.match(regex)){
            return this.mentionedMember
        }
    }
}

module.exports = Member