//// IMPORTS SPECIFIC TO THIS TEST FILE ////////////////////////////////////////////////////////////////////////////////

const jestDom = require('../jest-dom')
const writeDomToFile = jestDom.writeDomToFile


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
