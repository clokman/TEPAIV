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


//// MODULES BEING TESTED ////
const classUtils = require("../classUtils")






//// UNIT TESTS /////////////////////////////////////////////////////////////////////////////////////////////////////////////


//// CHECK CLASS OF INSTANCE ////
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