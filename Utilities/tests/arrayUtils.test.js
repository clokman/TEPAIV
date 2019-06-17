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


//// TESTING LIBRARIES ////
require('../../Utilities/jest-console')


//// REQUIREMENTS ////
global._ = require("../external/lodash")



//// MODULES BEING TESTED ////
const arrayUtils = require("../arrayUtils")






//// UNIT TESTS /////////////////////////////////////////////////////////////////////////////////////////////////////////////


//// TO PERCENTAGES ////

test ('Convert array to percentages', () => {

    let numbers
      , percentages

    // Array with single element
    numbers = [5]
    percentages = arrayUtils.toPercentages(numbers)
    expect(percentages).toEqual([100])

    // Array with two elements
    numbers = [1, 3]
    percentages = arrayUtils.toPercentages(numbers)
    expect(percentages).toEqual([25, 75])

    // Array with three elements
    numbers = [10, 20, 70]
    percentages = arrayUtils.toPercentages(numbers)
    expect(percentages).toEqual([10, 20, 70])

    // Array with decimals
    numbers = [1, 3, 5]
    percentages = arrayUtils.toPercentages(numbers)
    expect(percentages).toEqual([11.1, 33.3, 55.6])

})




//// TO STACK ////

test ('Convert array to stack', () => {

    let numbers
      , stack


    // Transform to stack - one element
    numbers = [10]
    stack = arrayUtils.toStackData(numbers)
    expect(stack).toEqual([ [0, 10] ])


    // Transform to stack - two elements
    numbers = [10, 20]
    stack = arrayUtils.toStackData(numbers)
    expect(stack).toEqual([ [0, 10], [10, 30] ])


    // Transform to stack - three elements
    numbers = [10, 20, 30]
    stack = arrayUtils.toStackData(numbers)
    expect(stack).toEqual([ [0, 10], [10, 30], [30, 60] ])



    // Transform UNORDERED array to stack - three elements
    numbers = [20, 10, 5]
    stack = arrayUtils.toStackData(numbers)
    expect(stack).toEqual([ [0, 20], [20, 30], [30, 35] ])

})