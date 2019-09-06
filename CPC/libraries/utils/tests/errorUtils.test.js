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



test ('VALIDATION: Value must be an element in an array', () => {

    // VALIDATE AGAINST AN ARRAY
    const acceptableParameters_array = ['a', 'b', 'c']

    // Valid value
    expect( () => {
        'a'.mustBeAnElementIn(acceptableParameters_array)
    }).not.toThrow()

    // Invalid value
    expect( () => {
        'x'.mustBeAnElementIn(acceptableParameters_array)
    }).toThrow("'x' is not a valid value. Possible values are: 'a, b, c'.")

})



test ('VALIDATION: Value must be an key in a map', () => {

    // VALIDATE AGAINST A MAP (KEYS)
    const acceptableParameters_map = new Map()
        .set('cold',['blue', 'green', 'teal'])
        .set('warm',['orange', 'red', 'yellow'])

    // Valid value
    expect( () => {
        'cold'.mustBeAKeyIn(acceptableParameters_map)
    }).not.toThrow()

    // Invalid value
    expect( () => {
        'hot'.mustBeAKeyIn(acceptableParameters_map)
    }).toThrow("'hot' is not as valid value. Possible values are: 'cold, warm'.")

})



test ('FORCE TYPE: Force a value to be of specified type', () => {

    // Acceptable type parameters are entered as both strings and instances (examples) of the expected class
    expect( () => {

        'a'.mustBeOfType( 'String')
        'a'.mustBeOfType(String)

        // Dot notation following numbers is not possible
        // (e.g., `1.mustBeOfType` is not possible). Instead,
        // a number must first be assigned to a variable:
        const myNumber = 1
        myNumber.mustBeOfType('Number')
        myNumber.mustBeOfType(Number)

        // Alternative way to use dot notation for a number:
        Number(1).mustBeOfType('Number')
        Number(1).mustBeOfType(Number)


        const myFloatingNumber = 1.2  // in JS, there is no float type; all floats are numbers
        myFloatingNumber.mustBeOfType('Number')
        myFloatingNumber.mustBeOfType(Number)

        false.mustBeOfType('Boolean')
        false.mustBeOfType(Boolean)

        // Custom class
        new container.Svg().mustBeOfType(container.Svg)
        new container.Svg().mustBeOfType('Svg')

    }).not.toThrow()


    // Mismatches using primitives
    const aNumber = 1
    expect( () => { aNumber.mustBeOfType('String') }).toThrow(`Type error: Expected the type 'String' but the value '1' has the type 'Number'.`)
    expect( () => { aNumber.mustBeOfType(String) }).toThrow(`Type error: Expected the type 'String' but the value '1' has the type 'Number'.`)

    expect( () => { false.mustBeOfType('String') }).toThrow(`Type error: Expected the type 'String' but the value 'false' has the type 'Boolean'.`)
    expect( () => { false.mustBeOfType('Number') }).toThrow(`Type error: Expected the type 'Number' but the value 'false' has the type 'Boolean'.`)

    expect( () => { 'a'.mustBeOfType('Number') }).toThrow(`Type error: Expected the type 'Number' but the value 'a' has the type 'String'.`)
    expect( () => { 'a'.mustBeOfType(Number) }).toThrow(`Type error: Expected the type 'Number' but the value 'a' has the type 'String'.`)

    // Mismatches using a custom class
    expect( () => { new container.Svg().mustBeOfType('String') }).toThrow(`Type error: Expected the type 'String' but the value '[object Object]' has the type 'Svg'.`)
    expect( () => { 'a'.mustBeOfType(container.Svg) }).toThrow("Type error: Expected the type 'Svg' but the value 'a' has the type 'String'.")

})

