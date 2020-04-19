


// Polyfills and Other Patches //

require('jest-canvas-mock')

// Import polyfill for fetch() method
if (typeof fetch !== 'function') {
    global.fetch =  require('node-fetch-polyfill')
}

// Import polyfill for Object.fromEntries() method
if (typeof Object.fromEntries !== 'function') {
    Object.fromEntries = require('object.fromentries')
}



// External //

global.$ = require('./libraries/external/jquery-3.1.1.min') // Also an UMD dependency
global._ = require("./libraries/external/lodash")

global.d3 = {
    ...require("./libraries/external/d3/d3"),
    ...require("./libraries/external/d3/d3-array")
}
// Disable d3 transitions
d3.selection.prototype.duration = jest.fn( function(){return this} )
d3.selection.prototype.transition = jest.fn( function(){return this} )





// JestUtils //

// These operate only in Node.js
const jestConsole = require('../JestUtils/jest-console')
global.expectTable = jestConsole.expectTable
global.expectConsoleHistory =  jestConsole.expectConsoleHistory

const jestDom = require('../JestUtils/jest-dom')
global.initializeDomWithSvg = jestDom.initializeDomWithSvg
global.writeDomToFile = jestDom.writeDomToFile



// Utils //

global.classUtils = require("./libraries/utils/classUtils")
global.arrayUtils = require("./libraries/utils/arrayUtils")
global.stringUtils = require("./libraries/utils/stringUtils")
global.domUtils = require("./libraries/utils/domUtils")
require('./libraries/utils/errorUtils')
require('./libraries/utils/jsUtils')  // does not need to be required into a variable
require('./libraries/utils/mapUtils')  // does not need to be required into a variable


// CPC //

global.data = require("./libraries/cpc/data")
global.dataset = require("./libraries/cpc/dataset")
global.container = require("./libraries/cpc/container")
global.shape = require("./libraries/cpc/shape")


