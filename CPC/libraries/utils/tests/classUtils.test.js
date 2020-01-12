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
    ...require("../../external/d3/d3"),
    ...require("../../external/d3/d3-array")
}

global.container = require("../../cpc/container")
global.classUtils = require("../classUtils")


//// MODULES BEING TESTED ////






//// UNIT TESTS /////////////////////////////////////////////////////////////////////////////////////////////////////////////


//// CHECK INSTANCE CLASS ////
test ('Should return class name of instances', () => {


    mySvg = new container.Svg() // a random class


    // Second parameter is a class constructor

    expect(classUtils.isInstanceOf('my string', String))
        .toBe(true)
    expect(classUtils.isInstanceOf('my string', Number))
        .toBe(false)

    expect(classUtils.isInstanceOf(Number(1), Number))
        .toBe(true)
    expect(classUtils.isInstanceOf(Number(1), String))
        .toBe(false)

    expect(classUtils.isInstanceOf(mySvg, container.Svg))
        .toBe(true)
    expect(classUtils.isInstanceOf(mySvg, String))
        .toBe(false)


    // Second parameter is a string

    expect(classUtils.isInstanceOf('my string', 'String'))
        .toBe(true)
    expect(classUtils.isInstanceOf('my string', 'Number'))
        .toBe(false)

    expect(classUtils.isInstanceOf(Number(1), 'Number'))
        .toBe(true)
    expect(classUtils.isInstanceOf(Number(1), 'String'))
        .toBe(false)

    expect(classUtils.isInstanceOf(mySvg, 'Svg'))
        .toBe(true)
    expect(classUtils.isInstanceOf(mySvg, 'String'))
        .toBe(false)

})



//// CHECK EXISTENCE INSTANCE PROPERTIES////

test ('Should pass (return error) if an instance property does (not) exist', () => {

    class MyClass {
        constructor(){

            this.property1 = 0
            this.property2 = 1
            this.property3 = 'a'
            this.property4 = true
            this.property5 = false
            this.property6 = null
            // this.property7  // would throw error if uncommented

        }
    }

    const myInstance = new MyClass()

    // Should return error if a property is missing
    expect(() =>
        classUtils.requireProperties(myInstance, ['property1', 'a'])
    ).toThrow("Properties \"a\" do not exist in the provided MyClass instance.")


    // Should return no error if all properties exist
    expect(classUtils.requireProperties(myInstance,
        ['property1', 'property2', 'property3', 'property4', 'property5', 'property6']
    )).toBe()

})