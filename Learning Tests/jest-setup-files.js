// Polyfills and Other Patches /////////////////////////////////////////////////////////////////////////////

require('jest-canvas-mock')

// Import polyfill for fetch() method
if (typeof fetch !== 'function') {
    global.fetch =  require('node-fetch-polyfill')
}

// Import polyfill for Object.fromEntries() method
if (typeof Object.fromEntries !== 'function') {
    Object.fromEntries = require('object.fromentries')
}




// External ////////////////////////////////////////////////////////////////////////////////////////////////

global.$ = require('./libraries/jquery-3.1.1.min') // Also an UMD dependency
global._ = require("./libraries/lodash")

global.d3 = {
    ...require("./libraries/d3/d3"),
    ...require("./libraries/d3/d3-array")
}
// Disable d3 transitions
d3.selection.prototype.duration = jest.fn( function(){return this} )
d3.selection.prototype.transition = jest.fn( function(){return this} )




// JestUtils //////////////////////////////////////////////////////////////////////////////////////////////

// These operate only in Node.js
const jestConsole = require('../JestUtils/jest-console')
global.expectTable = jestConsole.expectTable
global.expectConsoleHistory =  jestConsole.expectConsoleHistory
global.clearConsoleHistory =  jestConsole.clearConsoleHistory

const jestDom = require('../JestUtils/jest-dom')
global.initializeDomWithSvg = jestDom.initializeDomWithSvg
global.writeDomToFile = jestDom.writeDomToFile




// Utils //////////////////////////////////////////////////////////////////////////////////////////////////

global.classUtils = require("../CPC/libraries/utils/classUtils")
global.functionUtils = require("../CPC/libraries/utils/functionUtils")
global.arrayUtils = require("../CPC/libraries/utils/arrayUtils")
global.stringUtils = require("../CPC/libraries/utils/stringUtils")
global.domUtils = require("../CPC/libraries/utils/domUtils")
require('../CPC/libraries/utils/statsUtils')
require('../CPC/libraries/utils/errorUtils')
require('../CPC/libraries/utils/jsUtils')  // does not need to be required into a variable
require('../CPC/libraries/utils/mapUtils')  // does not need to be required into a variable

// A possible improvement:
// global.__ = {
//     ...require("../../utils/arrayUtils"),
//     ...require("../../utils/classUtils"),
//     ...require("../../utils/domUtils"),
//     ...require("../../utils/errorUtils"),
//     ...require("../../utils/jsUtils"),
//     ...require("../../utils/mapUtils"),
//     ...require("../../utils/stringUtils"),
// }




// CPC ////////////////////////////////////////////////////////////////////////////////////////////////////

global.data = require("../CPC/libraries/cpc/data")
global.dataset = require("../CPC/libraries/cpc/dataset")
global.container = require("../CPC/libraries/cpc/container")
global.shape = require("../CPC/libraries/cpc/shape")


