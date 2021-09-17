const sourcebin = require('sourcebin');
const fsLibrary  = require('fs')
const fs = require('fs')
async function errLog(Content, Lang , Title, Desc) {
    const bin = await sourcebin.create(
        [
            {
                content: Content,
                language: Lang,
            },
        ],
        {
            title: Title,
            description: Desc,
        },
    );


    var stream = fs.createWriteStream("errors.log", {'flags': 'a'});
    stream.once('open', function(fd) {
      stream.write(bin.url+"\r\n");
    });
}

module.exports = { errLog };