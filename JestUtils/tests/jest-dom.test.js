//// IMPORTS /////////////////////////////////////////////////////////////////////////////////////////////////////////////

//// POLYFILLS ////

// Import polyfill for fetch() method
if (typeof fetch !== 'function') {
    global.fetch =  require('node-fetch-polyfill')
}

// Import polyfill for Object.fromEntries() method
if (typeof Object.fromEntries !== 'function') {
    Object.fromEntries = require('object.fromentries')
}

//// REQUIREMENTS ////
global.d3 = {
    ...require("../external/d3/d3"),
    ...require("../external/d3/d3-array")
}
global._ = require("../external/lodash")
global.$ = require("../external/jquery-3.1.1.min")

//// MODULES BEING TESTED ////
require('../jest-dom')





//// TESTS /////////////////////////////////////////////////////////////////////////////////////////////////////////////

test ('Should write DOM contents to file', () => {

    const fs = require('fs')

    // Add something to HTML and write it to a file
    document.body.innerHTML = '<a>my link<\a>'
    writeDomToFile('./tests/dom-contents.html')

    // Read the contents of the new file and check if they are correct
    const fileContents = fs.readFileSync('./tests/dom-contents.html', 'utf8')
    expect(fileContents).toBe(`<head></head><body><a>my link</a><a></a></body>`)

    // Delete the generated file after the test
    fs.unlinkSync('./tests/dom-contents.html')

})
