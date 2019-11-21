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
require('../../JestUtils/jest-console')
require('../../JestUtils/jest-dom')


// //// UMD DEPENDENCIES ////
// global.$ = require('../../../external/jquery-3.1.1.min')
//
// global.d3 = {
//     ...require("../../external/d3/d3"),
//     ...require("../../external/d3/d3-array")
// }
// // Disable d3 transitions
// d3.selection.prototype.transition = jest.fn( function(){return this} )
// d3.selection.prototype.duration = jest.fn( function(){return this} )
//
// global._ = require("../../external/lodash")
//
//
// //// EXTENSIONS ////
// require("../../../utils/errorUtils")
// require("../../../utils/jsUtils")
// require("../../../utils/mapUtils")
//
// global.classUtils = require("../../../utils/classUtils")
// global.arrayUtils = require("../../../utils/arrayUtils")
// global.domUtils = require("../../../utils/domUtils")
// global.stringUtils = require("../../../utils/stringUtils")
//
// //// MODULE BEING TESTED IN CURRENT FILE ////
// const navigator = require("../navigator")






//// TESTS /////////////////////////////////////////////////////////////////////////////////////////////////////////////


//// TIMERS ///////////////////////////////////////////////////////////////

describe ('TIMERS: Mocking and advancing time in JEST', () => {


    test ('Time should be mocked and advanced', () => {

        // Replace JS timers with Jest timers
        jest.useFakeTimers()

        let a = '0k'
        expect ( a ).toBe( '0k' )

        // Set some timeouts with JS setTimeout function
        setTimeout( () => {a = '1k'}, 1000 )
        setTimeout( () => {a = '2k'}, 2000 )
        setTimeout( () => {a = '3k'}, 3000 )

        // Advance time by 1000 milliseconds, and then continue execution
        jest.advanceTimersByTime(1000)
        expect ( a ).toBe( '1k' )

        // Run all timers that are before this line, and then continue execution
        jest.runOnlyPendingTimers()
        expect ( a ).toBe( '3k' )


        setTimeout( () => {a = '4k'}, 4000 )
        setTimeout( () => {a = '5k'}, 5000 )

        // Run all timers that are before this line, and then continue execution
        jest.runAllTimers()
        expect ( a ).toBe( '5k' )


        setTimeout( () => {a = '6k'}, 6000 )


        jest.runAllTimers()
        expect ( a ).toBe( '6k' )

    })

})
