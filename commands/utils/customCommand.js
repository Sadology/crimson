// const Discord = require('discord.js');
// const { CustomCommand } = require("../../models");
// const { MessageButton } = require('discord-buttons');
// const { errLog } = require('../../Functions/erroHandling');
// module.exports = {
//     name: 'customcommand',
//     aliases: ["cc", "custom-command"],
//     description: 'ping pong',
//     category: 'utils',
//     run: async(client, message, args, prefix)=> {

//         if(!message.member.permissions.has("ADMINISTRATOR")){
//             return message.author.send('None of your role proccess to use this command')
//         }

//         const cmd = args[0]
//         switch(cmd){
//             case "create":
//                 const tutorial = new Discord.MessageEmbed()
//             .setAuthor("Command - Custom-Command", message.author.displayAvatarURL({dynamic: false, size: 1024, type: "png"}))

//         if(!args.length){
//                 tutorial.setTitle("Variable reference can be found here")
//                 tutorial.setURL("https://sourceb.in/Uf6d7gmavC")
//                 tutorial.setDescription(`Create a custom command and have fun with it
//                 \n**Usage**: ${prefix}cc --command [ value ] --delete [ true | false ] --mention [ true | false ] --content [ "value" ] --embed [ true | false ] --author [ "value" ] --title [ "value" ] --url [ link ] --description [ "value" ] --color [ hex value ] --image [ link ] --roles [ mention roles ]
//                 \n**Example**: ${prefix}cc --command hello --delete true --mention false --content "Hello there" --embed true --author "Hello command" --title "Hey there" --url https://media.tenor.com/images/acc4116372dcc4b342cb1a00ae657151/tenor.gif --description "Hello fellow member" --color #fffffa --image https://media.tenor.com/images/acc4116372dcc4b342cb1a00ae657151/tenor.gif --roles @Epic @Legend @Elite`)
//                 tutorial.setTimestamp()
//                 tutorial.setColor("#fffffa")
//             return message.channel.send(tutorial)
//         }
//         let obj = {
//             command: "",
//             delete: "",
//             mention: "",
//             content: "",
//             embed: "",
//             desc: "",
//             author: "",
//             title: "",
//             url: "",
//             image: "",
//             color: "",
//             roles: "",
//         }

//         function cmdID() {
//             var text = "";
//             var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
          
//             for (var i = 0; i < 10; i++)
//               text += possible.charAt(Math.floor(Math.random() * possible.length));
          
//             return text;
//         }
//         let cmdIDNo = "";
//         cmdIDNo = cmdID();

//         if(message.content.includes("--command")){
//             try{
//                 const keyValue = message.content.split(/\s+/g)
//                 const data =  keyValue[keyValue.findIndex(el=>el==="--command")+1];
//                 obj["command"] = data ? data.trim() : null
//             } catch(err){
//                 errLog(err.stack.toString(), "text", "CustomCommand", "Error in --command");
//             }
//         }
//         if(message.content.includes("--content")){
//             try{
//                 const contentValue = message.content.split('--content')[1].replace('"', "")
//                 const contentArr = contentValue.split(/"\s+/)[0]
//                 const cmdConvert = contentArr.toLowerCase(); 
//                 obj["content"] = contentArr ?  cmdConvert.trim() : null
//             }catch(err){
//                 errLog(err.stack.toString(), "text", "Role-Added", "Error in --content");
//             }
//         }

//         if(message.content.includes("--delete")){
//             try{
//                 const deleteOption = message.content.split(/\s+/g)
//                 const deleteData =  deleteOption[deleteOption.findIndex(el=>el==="--delete")+1];

//                 if(deleteData === "true"){
//                     obj["delete"] = true
//                 }else if(deleteData === "false"){
//                     obj["delete"] = false
//                 }else {
//                     obj["delete"] = false
//                 }
//             }catch(err){
//                 errLog(err.stack.toString(), "text", "Role-Added", "Error in --delete");
//             }
//         }

//         if(message.content.includes("--mention")){
//             try{
//                 const mentionOption = message.content.split(/\s+/g)
//                 const mentionData =  mentionOption[mentionOption.findIndex(el=>el==="--mention")+1];

//                 if(mentionData === "true"){
//                     obj["mention"] = true
//                 }else if(mentionData === "false"){
//                     obj["mention"] = false
//                 }else {
//                     obj["mention"] = false
//                 }
//             }catch(err){
//                 errLog(err.stack.toString(), "text", "Role-Added", "Error in --mention");
//             }
//         }

//         if(message.content.includes("--embed")){
//             try{
//                 const embedOption = message.content.split(/\s+/g)
//                 const embedData =  embedOption[embedOption.findIndex(el=>el==="--embed")+1];

//                 if(embedData === "true"){
//                     obj["embed"] = true
//                 }else if(embedData === "false"){
//                     obj["embed"] = false
//                 }else {
//                     obj["embed"] = false
//                 }
//             }catch(err){
//                 errLog(err.stack.toString(), "text", "Role-Added", "Error in --embed");
//             }
//         }

//         if(message.content.includes("--description")){
//             try{
//                 const descValue = message.content.split('--description')[1].replace('"', "")
//                 const descContent = descValue.split(/"\s+/)[0]
//                 obj["desc"] = descContent ? descContent.trim() : null
//             }catch(err){
//                 errLog(err.stack.toString(), "text", "Role-Added", "Error in --desc");
//             }
//         }

//         if(message.content.includes("--author")){
//             try{
//                 const authorValue = message.content.split('--author')[1].replace('"', "")
//                 const authorContent = authorValue.split(/"\s+/)[0]
//                 obj["author"] = authorContent ? authorContent.trim() : null
//             }catch(err){
//                 errLog(err.stack.toString(), "text", "Role-Added", "Error in --author");
//             }
//         }

//         if(message.content.includes("--title")){
//             try{
//                 const titleValue = message.content.split('--title')[1].replace('"', "")
//                 const titleContent = titleValue.split(/"\s+/)[0]
//                 database("title", titleContent ? titleContent.trim() : null)
//                 obj["title"] = titleContent ? titleContent.trim() : null
//             }catch(err){
//                 errLog(err.stack.toString(), "text", "Role-Added", "Error in --title");
//             }
//         }

//         if(message.content.includes("--url")){
//             try{
//                 const urlValue = message.content.split(/\s+/g)
//                 const urlContent = urlValue[urlValue.findIndex(el=>el==="--url")+1];

//                 obj["url"] = urlContent ? urlContent : null
//             }catch(err){
//                 errLog(err.stack.toString(), "text", "Role-Added", "Error in --Url");
//             }
//         }
        
//         if(message.content.includes("--image")){
//             try{
//                 const imageOption = message.content.split(/\s+/g)
//                 const imageData =  imageOption[imageOption.findIndex(el=>el==="--image")+1];

//                 obj["image"] = imageData ? imageData.trim() : null
//             }catch(err){
//                 errLog(err.stack.toString(), "text", "Role-Added", "Error in --image");
//             }
//         }

//         if(message.content.includes("--color")){
//             try{
//                 const colorOption = message.content.split(/\s+/g)
//                 const colorData =  colorOption[colorOption.findIndex(el=>el==="--color")+1];

//                 obj["color"] = colorData ? colorData.trim() : null
//             }catch(err){
//                 errLog(err.stack.toString(), "text", "Role-Added", "Error in --color");
//             }
//         }

//         const rolesArr = []
//         if(message.content.includes("--roles")){
//             try{
//                 const roleValue = message.mentions.roles.map(i => i.id)
//                 //database("roles", roleValue ? roleValue : [])

//                 obj["roles"] = roleValue ? roleValue : []

//                 rolesArr.push(message.mentions.roles.map(i => i.toString()))
//             }catch(err){
//                 errLog(err.stack.toString(), "text", "Role-Added", "Error in --roles");
//             }
//         }

//         const Embed = new Discord.MessageEmbed()
//             .setAuthor("Custom Cmmand - Template")
//             .setDescription("Create/edit your own custom command with lot of options")
//             .addField("Options", [
//                 `Command - ${obj.command ? obj.command : "None"}`,
//                 `Delete-Command - ${obj.delete? obj.delete : "False"}`,
//                 `Mention - ${obj.mention ? obj.mention : "False"}`,
//                 `Content - ${obj.content ? obj.content : "None"}`,
//                 `Embed - ${obj.embed ? obj.embed : "False"}`,
//                 `Image - ${obj.image ? obj.image : "None"}`,
//                 `Permissiom - ${rolesArr ? rolesArr : "None"}`,
//             ])
//             .setColor("#fffafa")
//         if(obj.embed === true){
//             Embed.addField("Embeds", [
//                 `Description - ${obj.desc ? obj.desc : "None"}`,
//                 `Author - ${obj.author ? obj.author : "None"}`,
//                 `Title - ${obj.title ? obj.title: "None"}`,
//                 `URl - ${obj.url ? obj.url : "None"}`,
//                 `Color - ${obj.color ? obj.color : "None"}`
//             ])
//         }

//         if(!obj["command"]){
//             return message.channel.send({embed: {
//                 color: "#ff473d",
//                 author:{
//                     name: "Command - Custom-command",
//                     icon_url: message.author.displayAvatarURL({dynamic: false, size: 1024, type: "png"}),
//                 },
//                 description: "You forgot to put Command. Please restart the proccess :P"
//             }})
//         }else if(!obj['roles']){
//             return message.channel.send({embed: {
//                 color: "#ff473d",
//                 author:{
//                     name: "Command - Custom-command",
//                     icon_url: message.author.displayAvatarURL({dynamic: false, size: 1024, type: "png"}),
//                 },
//                 description: "You forgot to put Roles Permission. Please restart the proccess xD"
//             }})
//         }
//         const confirm = new MessageButton()
//             .setStyle("green")
//             .setLabel("Yes")
//             .setID("confirm")

//         const Cancel = new MessageButton()
//             .setStyle("red")
//             .setLabel("No")
//             .setID("cancel")

//         let msg = await message.channel.send("Do you want to save the custom-command | You can use the command after saving.",{embed: Embed, button: [confirm, Cancel]})

//         const filter = (button) => button.clicker.user.id === message.author.id;
//         const collector = msg.createButtonCollector(filter, { time: 1000 * 60, max: 1 });

//         collector.on('collect',async b => {
//             b.defer()
//             if(b.id === 'confirm'){

//                 try{
//                     new CustomCommand({
//                         guildID: message.guild.id,
//                         guildName: message.guild.name,
//                         Active: false,
//                         Command: obj.command,
//                         CmdProperty: {
//                             Delete: obj.delete,
//                             CmdID: cmdIDNo,
//                         },
//                         Content: obj.content,
//                         Mention: obj.mention,
//                         Embed: obj.embed,
//                         EmbedProperty: {
//                             Desc: obj.desc,
//                             Author: obj.author,
//                             Title: obj.title,
//                             URL: obj.url,
//                             Color: obj.color 
//                         },
//                         Perms: obj.roles,
//                         Image: obj.image,
                    
//                     }).save()

//                     message.channel.send({embed: new Discord.MessageEmbed()
//                         .setDescription("✅ | The custom-command has been saved.")
//                         .setColor("#66ff6b")
//                     }).then(m=>m.delete({timeout: 1000 * 10}))
//                     return
//                 }catch(err){
//                     errLog(err.stack.toString(), "text", "Role-Added", "Error in Saving Data");
//                 }
//             }
//             if(b.id === "cancel"){
//                 try{
//                     msg.edit({embed: new Discord.MessageEmbed()
//                         .setAuthor(`Custom Command`)
//                         .setDescription(`Custom command has been deleted`)
//                         .setColor("#66ff6b")
//                     }).then(m=>m.delete({timeout: 1000 * 10}))
//                     return
//                 }catch(err){
//                     errLog(err.stack.toString(), "text", "Role-Added", "Error in editing message");
//                 }
//             }
//         })
//         collector.on("end", () => {
//         })
//         break;

//         case "edit":

//         break;

//         case "delete": //Delete Command
//             const cmdName = args[1];
//             if(cmdName){
//                 let foundData = await CustomCommand.findOne({
//                     guildID: message.guild.id,
//                     Active: false,
//                     Command: cmdName
//                 })

//                 const yems = new MessageButton()
//                 .setStyle("green")
//                 .setLabel("Yes")
//                 .setID("confirm1")
    
//                 const nomp = new MessageButton()
//                     .setStyle("red")
//                     .setLabel("No")
//                     .setID("cancel1")

//                 if(foundData){
//                     const deleteEmbed = new Discord.MessageEmbed()
//                     .setAuthor(`${foundData.CmdProperty.CmdID} - Command: ${foundData.Command}`)
//                     .setDescription(`\`\`\`Delete:      ${foundData.CmdProperty.Delete}\nMention:     ${foundData.Mention}\nContent:     ${foundData.Content}\nEmbed:       ${foundData.Embed}\nAuthor:    ${foundData.EmbedProperty.Author}\nDescription: ${foundData.EmbedProperty.Desc}\nTitle:       ${foundData.EmbedProperty.Title}\nColor:       ${foundData.EmbedProperty.Color}\nURL:         ${foundData.EmbedProperty.URL}\nImage:    ${foundData.Image}\`\`\``)
//                     .setColor("#f25044")
//                     .setFooter('"Confirm" button to continue, "Cancel" to cancel')
//                     let msg = await message.channel.send("Do you wish to delete this Command?", {embed: deleteEmbed, button: [yems, nomp]})  

//                     const filter = (button) => button.clicker.user.id === message.author.id;
//                     const collector = msg.createButtonCollector(filter, { time: 1000 * 60 });

//                     collector.on('collect',async b => {
//                         b.defer()
//                         if(b.id === 'confirm1'){
//                             await CustomCommand.findOneAndDelete({
//                                 guildID: message.guild.id, 
//                                 Active: false,
//                                 Command: cmdName
//                             }, 
//                             function(err, doc){
//                                 if(err) console.log(err)
//                             })
            
//                             msg.edit({embed: new Discord.MessageEmbed()
//                                 .setAuthor(`Command - Custom-Command Delete`)
//                                 .setDescription(`Command **${cmdName}** has been deleted from database`)
//                                 .setColor("#66ff6b")
//                                 .setFooter("Once a data has been delete, there's no way to retrieve it")
//                                 .setThumbnail("https://icons.iconarchive.com/icons/paomedia/small-n-flat/1024/sign-check-icon.png")
//                             })
//                         }
//                         if(b.id === "cancel1"){
//                             msg.edit({embed: new Discord.MessageEmbed()
//                                 .setAuthor(`Command - Custom-Command Delete`)
//                                 .setDescription(`Command Canceled`)
//                                 .setColor("#66ff6b")
//                             })
//                             return
//                         }
//                     });
//                 }else {
//                     message.channel.send({embed: {
//                         color: "#f25044",
//                         author: {
//                             name: "Command - Custom-command Delete"
//                         },
//                         description: `No custom command found by \`${cmdName}\``
//                     }}).then(m=>m.delete({timeout: 1000 * 10}))
//                 }
//             }else {
//                 message.channel.send({embed: {
//                     color: "#f25044",
//                     author: {
//                         name: "Command - Custom-command Delete"
//                     },
//                     description: `Please mention which command you would like to delete`
//                 }}).then(m=>m.delete({timeout: 1000 * 10}))
//             }
//         break;

//         case "list": //CUSTOM COMMANDS LISTS
//             await CustomCommand.find({
//                 guildID: message.guild.id,
//                 Active: false
//             }).sort([
//                 ['Command','ascending']
//             ]).exec(async (err, res) => {
//                 if(err){
//                     errLog(err.stack.toString(), "text", "ccCommand List", "Error in fetching data");
//                 }

//                 const next = new MessageButton()
//                   .setStyle("green")
//                   .setLabel("Next")
//                   .setID("NextPageCC")

//                 const previous = new MessageButton()
//                   .setStyle("red")
//                   .setLabel("previous")
//                   .setID("PreviousPageCC")

//                 if(res.length == 0) {
//                     return message.channel.send({embed: new Discord.MessageEmbed()
//                         .setDescription("Custom-Command - Command list")
//                         .setDescription(`No custom command ${message.guild.name}`)
//                         .setColor("#fc5947")
//                     }).then(m => m.delete({timeout: 1000 * 10}))
//                 }
                
//                 let currentIndex = 0
//                 const generateEmbed = start => {
//                     const current = res.slice(start, start + 5)

//                     const embed = new Discord.MessageEmbed()
//                         .setColor("#fffafa")
//                         .setFooter(`Commands ${start + 1} - ${start + current.length} out of ${res.length}`)
//                         .setAuthor("Custom-Command - Command-List")
//                     for (i = 0; i < current.length; i++){
//                         embed.addField(`**${i + 1}**• Command : ${current[i] && current[i].Command}`,[
//                             `\`\`\`Delete      - ${current[i] && current[i].CmdProperty.Delete} | Mention   - ${current[i] && current[i].Mention}`,
//                             `Embed       - ${current[i] && current[i].Embed} | Color       - ${current[i] && current[i].EmbedProperty.Color}`,
//                             `Content     - ${current[i] && current[i].Content ? current[i].Content : "None"}`,
//                             `Description - ${current[i] && current[i].EmbedProperty.Desc ? current[i].EmbedProperty.Desc : "None"}`, 
//                             `Author      - ${current[i] && current[i].EmbedProperty.Author ? current[i].EmbedProperty.Author : "None"}`,
//                             `Title       - ${current[i] && current[i].EmbedProperty.Title ? current[i].EmbedProperty.Title : "None"}`,
//                             `Url         - ${current[i] && current[i].EmbedProperty.URL ? current[i].EmbedProperty.URL : "None"}`,
//                             `Image       - ${current[i] && current[i].Image ? current[i].Image : "None"}\`\`\``
//                         ])
//                     }       
                    
//                     if(res.length <= 5){
//                         return ({embed: embed})
//                     }
//                     if(current.length == 0){
//                         return ({embed: embed, button: [previous]})
//                     }
//                     if(currentIndex !== 0){
//                         return ({embed: embed, button: [next, previous]})
//                     }
//                     if (currentIndex + 10 < res.length){
//                         return ({embed: embed, button: [next]})
//                     }

//                 }
//                 await message.channel.send(generateEmbed(0), {button: [next]}).then(async msg => {

//                 const filter = (button) => button.clicker.user.id === message.author.id;
//                 const collector = msg.createButtonCollector(filter, { time: 1000 * 60, errors: ['time'] });

//                 collector.on('collect',async b => {
//                     b.defer()
//                     if(b.id === 'NextPageAdminCC'){
//                         try{
//                             currentIndex += 5
//                             await msg.edit(generateEmbed(currentIndex))
//                         } catch (err){
//                             errLog(err.stack.toString(), "text", "customCmd", "Error in deleting logs");
//                         }
//                     }
//                     if(b.id === "PreviousPageAdminCC"){
//                         try {
//                             currentIndex -= 5
//                             await msg.edit(generateEmbed(currentIndex))
//                         } catch (err) {
//                             errLog(err.stack.toString(), "text", "custcmd", "Error in cancelling command");
//                         }
//                     }
//                 });
//                 collector.on("end", () =>{

//                 })
//                 })
                
//             })
//         break;
//         }
//     }
// }