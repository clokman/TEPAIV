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
const statsUtils = require("../statsUtils")



//// UNIT TESTS /////////////////////////////////////////////////////////////////////////////////////////////////////////////


//// ARRAY STATS ///////////////////////////////////////////////////////////////

describe ('Array stats', () => {
   
        test ('Misc stats methods for arrays', () => {

            let array1 = [0,1,2,3,4,5,6,7,8,9,10]
            let array2 = [40,30,20,10,50,60,70,90,80,100,0]

            // Sort
            expect ( array1.sortAscending() ).toEqual([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
            expect ( array2.sortAscending() ).toEqual([0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100])
            expect ( array1.sortDescending() ).toEqual([10, 9, 8, 7, 6, 5, 4, 3, 2, 1, 0])
            expect ( array2.sortDescending() ).toEqual([100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 0])

            // Statistics
            expect( array1.sum() ).toBe( 55 )
            expect( array1.median() ).toBe( 5 )
            expect( array1.mean() ).toBe( 5 )
            expect( array1.standardDeviation() ).toBe( 3.3166247903554 )

            expect( array2.sum() ).toBe( 550 )
            expect( array2.median() ).toBe( 50 )
            expect( array2.mean() ).toBe( 50 )
            expect( array2.standardDeviation() ).toBe( 33.166247903554 )

            // Quartiles
            expect( array1.quantile(0) ).toBe( 0 )
            expect( array1.quantile(.25) ).toBe( 2.5 )
            expect( array1.quantile(.50) ).toBe( 5 )
            expect( array1.quantile(.75) ).toBe( 7.5 )
            expect( array1.quantile(1) ).toBe( 10 )

            expect( array2.quantile(0) ).toBe( 0 )
            expect( array2.quantile(.25) ).toBe( 25 )
            expect( array2.quantile(.50) ).toBe( 50 )
            expect( array2.quantile(.75) ).toBe( 75 )
            expect( array2.quantile(1) ).toBe( 100 )

            // Quartile shortcuts
            expect( array1.quantile0() ).toBe( 0 )
            expect( array1.quantile25() ).toBe( 2.5 )
            expect( array1.quantile50() ).toBe( 5 )
            expect( array1.quantile75() ).toBe( 7.5 )
            expect( array1.quantile1() ).toBe( 10 )

            expect( array2.quantile0() ).toBe( 0 )
            expect( array2.quantile25() ).toBe( 25 )
            expect( array2.quantile50() ).toBe( 50 )
            expect( array2.quantile75() ).toBe( 75 )
            expect( array2.quantile1() ).toBe( 100 )

            // Quartiles shortcut
            expect ( array1.quartiles() ).toEqual( [0, 2.5, 5, 7.5, 10] )


            // Other quantiles
            expect( array1.quantile(.10 ) ).toBe(1)
            expect( array1.quantile(.30 ) ).toBe(3)
            expect( array1.quantile(.60 ) ).toBe(6)
            expect( array1.quantile(.90 ) ).toBe(9)

            expect( array2.quantile(.10 ) ).toBe(10)
            expect( array2.quantile(.30 ) ).toBe(30)
            expect( array2.quantile(.60 ) ).toBe(60)
            expect( array2.quantile(.90 ) ).toBe(90)


        })

})
