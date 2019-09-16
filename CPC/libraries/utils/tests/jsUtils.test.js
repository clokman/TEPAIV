//// DEPENDENCIES /////////////////////////////////////////////////////////////////////////////////////////////////////////////

//// POLYFILLS ////

// Import polyfill for fetch() method
if (typeof fetch !== 'function') {
    global.fetch =  require('node-fetch-polyfill')
}

// Import polyfill for Object.fromEntries() method
if (typeof Object.fromEntries !== 'function') {
    Object.fromEntries = require('object.fromentries')
}


//// PURE NODE DEPENDENCIES ////
require('../../../../JestUtils/jest-console')
require('../../../../JestUtils/jest-dom')


//// UMD DEPENDENCIES ////
global.$ = require('../../external/jquery-3.1.1.min')

global.d3 = {
    ...require("../../external/d3/d3"),
    ...require("../../external/d3/d3-array")
}
// Disable d3 transitions
d3.selection.prototype.transition = jest.fn( function(){return this} )
d3.selection.prototype.duration = jest.fn( function(){return this} )

global._ = require("../../external/lodash")

global.container = require("../../cpc/container")

//// MODULE BEING TESTED IN CURRENT FILE ////
global.__ = {
    ...require("../../utils/arrayUtils"),
    ...require("../../utils/classUtils"),
    ...require("../../utils/domUtils"),
    ...require("../../utils/errorUtils"),
    ...require("../../utils/jsUtils"),
    ...require("../../utils/mapUtils"),
    ...require("../../utils/stringUtils"),
}




//// TESTS /////////////////////////////////////////////////////////////////////////////////////////////////////////////

test ('Return the type of an object', () => {

    const myNumber = 5

    expect( ['a', 'b', 'c'].hasType() ).toBe('Array')
    expect( new Map().hasType() ).toBe('Map')
    expect('a'.hasType()).toBe('String')
    expect( myNumber.hasType() ).toBe('Number')
    expect( false.hasType()).toBe('Boolean')
    expect( new container.Svg().hasType() ).toBe('Svg')

})
