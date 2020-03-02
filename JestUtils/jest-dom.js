const writeDomToFile = function (path){

    fs = require('fs')
    $ = require('./external/jquery-3.1.1.min')

    const html = $('html').html()
    fs.writeFileSync(path, html)

}

const initializeDomWithSvg = function (){

    jest.useFakeTimers()

    // Clear JEST's DOM to prevent leftovers from previous tests
    document.body.innerHTML = ''

    // Create a svg object as the topmost container
    new container.Svg(1280, 800)

    jest.runAllTimers()

}



exports.writeDomToFile = writeDomToFile
exports.initializeDomWithSvg = initializeDomWithSvg