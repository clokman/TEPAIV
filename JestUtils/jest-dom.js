writeDomToFile = function (path){

    fs = require('fs')
    $ = require('./external/jquery-3.1.1.min')

    const html = $('html').html()
    fs.writeFileSync(path, html)

}

exports.writeDomToFile = writeDomToFile