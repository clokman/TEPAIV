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

global.classUtils = require("../classUtils")

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


// hasName() ///////////////////////////////////////////////////////////////

describe ('hasFunctionName()', () => {


    test ('Return hoisted function name as string', () => {

        function myFunction(){return 'a'}

        expect( myFunction.hasFunctionName() ).toBe( 'myFunction' )

    })

    test ('If the name of a function assigned to a variable is requested, return empty string', () => {

        const myFunction = function(){return 'a'}

        expect( myFunction.hasFunctionName() ).toBe( '' )

    })


    test ('Return method name as string in various scenarios', () => {

        // Declare class and instantiate instance
        class MyClass{
            constructor(){
                this.listOfSelectedMethods = [this.myMethod]
                this.myAliasedMethod = this.myMethod
            }
            myMethod(){return 'a'}
        }
        const myInstance = new MyClass()

        //
        expect( myInstance.myMethod.hasFunctionName() ).toBe( 'myMethod' )
        expect( myInstance.myAliasedMethod.hasFunctionName() ).toBe( 'myMethod' )
        expect( myInstance.listOfSelectedMethods[0].hasFunctionName() ).toBe( 'myMethod' )

    })

})


test ('HAS TYPE: Return the type of an object', () => {

    const myNumber = 5

    expect( ['a', 'b', 'c'].hasType() ).toBe('Array')
    expect( new Map().hasType() ).toBe('Map')
    expect('a'.hasType()).toBe('String')
    expect( myNumber.hasType() ).toBe('Number')
    expect( false.hasType()).toBe('Boolean')
    expect( new container.Svg().hasType() ).toBe('Svg')

})


test ('HAS TYPE: Compare the type of an object', () => {

    const myNumber = 5

    expect( ['a', 'b', 'c'].hasType('Array') ).toBe(true)
    expect( new Map().hasType() ).toBe('Map')
    expect('a'.hasType()).toBe('String')
    expect( myNumber.hasType() ).toBe('Number')
    expect( false.hasType()).toBe('Boolean')
    expect( new container.Svg().hasType() ).toBe('Svg')

})

