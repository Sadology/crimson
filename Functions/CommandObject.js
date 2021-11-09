class commandCreate{
    constructor(data = {}){
        this.setup(data)
    }

    setup(data){
        this.Name = data.Name ? data.Name : null
        this.Content = data.Content ? data.Content : null
        this.Embed = data.Embed ? data.Embed : false
        this.DeleteCmd = data.Delete ? data.Delete : false
        this.Mention = data.MentionA ? data.MentionA : false
        this.Description = data.Description ? data.Description : null
        this.Author = data.Author ? data.Author : null
        this.Title = data.Title ? data.Title : null
        this.Image = data.Image ? data.Image : null
        this.Color = data.Color ? data.Color : null
        this.Footer = data.Footer ? data.Footer : null
        this.Permission = data.Perms ? data.Perms : null
    }

    setName(name){
        this.Name = name
        return this;
    }
    setContent(content){
        this.Content = content
        return this;
    }
    setEmbed(embed){
        this.Embed = embed
        return this;
    }
    setDelete(del){
        this.DeleteCmd = del
        return this;
    }
    setMention(mention){
        this.Mention = mention
        return this;
    }
    setDescription(desc){
        this.Description = desc
        return this;
    }
    setAuthor(author){
        this.Author = author
        return this;
    }
    setTitle(title){
        this.Title = title
        return this;
    }
    setImage(image){
        this.Image = image
        return this;
    }
    setColor(color){
        this.Color = color
        return this;
    }
    setFooter(footer){
        this.Footer = footer
        return this;
    }
    setPerms(perms){
        this.Permission = perms
        return this;
    }
}

module.exports = commandCreate