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
require('../../../../JestUtils/jest-console')


//// REQUIREMENTS ////
global._ = require("../../../../JestUtils/external/lodash")
global.container = require("../../cpc/container")


//// MODULES BEING TESTED ////
const arrayUtils = require("../arrayUtils")





//// UNIT TESTS /////////////////////////////////////////////////////////////////////////////////////////////////////////////



//// CONVERSIONS ///////////////////////////////////////////////////////////////

describe ('Conversions', () => {

    test ('convertToString(): Convert array to string', () => {

        class myClass{constructor(){}} // for testing a custom class

        const myArray = ['a', 'b', 1, 0.1, true, new Map(), new myClass()]

        expect( myArray.convertToString() )
            .toBe("a, b, 1, 0.1, true, [object Map], [object Object]")

    })


    test ('toPercentages(): Convert array to percentages', () => {

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
        expect(percentages).toEqual([11, 33, 56])

    })




//// TO STACK ////

    test ('toStackData(): Convert array to stack', () => {

        let numbers
        let stack


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


})


//// INFERENCES ///////////////////////////////////////////////////////////////

describe ('Inferences', () => {

    test ('containsMostlyNumbers()', () => {

        // Numbers
        const continuousData = [1,2,3,4,5,6,7,8,9,10]
        expect( continuousData.containsMostlyNumbers() ).toBe( true )

        // Numbers in strings
        const continuousDataAsStrings = ['1','2','3','4','5','6','7','8','9','10']
        expect( continuousDataAsStrings.containsMostlyNumbers() ).toBe( true )

        // Some elements as numbers, some elements as numbers in strings
        const continuousDataAsNumbersAndStrings = [1,2,3,'4','5','6','7','8','9','10']
        expect( continuousDataAsNumbersAndStrings.containsMostlyNumbers() ).toBe( true )

        // Non-number data
        const discreteData = ['a','b','c','d','e','f']
        expect( discreteData.containsMostlyNumbers() ).toBe( false )

        // More tolerance
        const fiftyPercentContinuousData = ['1','2','3','4', '5', 'a', 'b', 'c', 'd', 'e']
        expect( fiftyPercentContinuousData.containsMostlyNumbers() ).toBe( false )
        expect( fiftyPercentContinuousData.containsMostlyNumbers(25, 0.6) ).toBe( false )
        expect( fiftyPercentContinuousData.containsMostlyNumbers(25, 0.5) ).toBe( true )

        // Less tolerance: 95% must be numbers
        const ninetyPercentContinuousData = ['1','2','3','4', '5', '6', '7', '8', '9', 'a']
        expect( ninetyPercentContinuousData.containsMostlyNumbers() ).toBe( true )
        expect( ninetyPercentContinuousData.containsMostlyNumbers(25, 0.95) ).toBe( false )
    })


    test ('containsMostlyNumbers(): Dealing with missing values ', () => {

        const continuousDataWithMissingValues = [1,2,'3','NaN','','6','7','8','9','10']
        expect( continuousDataWithMissingValues.containsMostlyNumbers() ).toBe( false )
        expect( continuousDataWithMissingValues.containsMostlyNumbers(25, 0.8) ).toBe( true )

    })


})


