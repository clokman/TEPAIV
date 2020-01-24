writeDomToFile = function (path){

    fs = require('fs')
    $ = require('./external/jquery-3.1.1.min')

    const html = $('html').html()
    fs.writeFileSync(path, html)

}

initializeDomWithSvg = function (){

    // Clear JEST's DOM to prevent leftovers from previous tests
    document.body.innerHTML = ''

    // Create a svg object as the topmost container
    new container.Svg(1280, 800)

}

exports.writeDomToFile = writeDomToFile
exports.initializeDomWithSvg = initializeDomWithSvg