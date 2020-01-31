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


//// UMD DEPENDENCIES ////
global.$ = require('../../CPC/libraries/external/jquery-3.1.1.min')

global.d3 = {
    ...require("../../CPC/libraries/external/d3/d3"),
    ...require("../../CPC/libraries/external/d3/d3-array")
}
// Disable d3 transitions
d3.selection.prototype.transition = jest.fn( function(){return this} )
d3.selection.prototype.duration = jest.fn( function(){return this} )

global._ = require("../../CPC/libraries/external/lodash")


//// EXTENSIONS ////
require("../../CPC/libraries/utils/errorUtils")
require("../../CPC/libraries/utils/jsUtils")
require("../../CPC/libraries/utils/mapUtils")

global.classUtils = require("../../CPC/libraries/utils/classUtils")
global.arrayUtils = require("../../CPC/libraries/utils/arrayUtils")
global.domUtils = require("../../CPC/libraries/utils/domUtils")
global.stringUtils = require("../../CPC/libraries/utils/stringUtils")
global.stringUtils = require("../../CPC/libraries/utils/statsUtils")

//// MODULE BEING TESTED IN CURRENT FILE ////







//// TESTS /////////////////////////////////////////////////////////////////////////////////////////////////////////////


//// READ CONTINUOUS DATA ///////////////////////////////////////////////////////////////

describe ('Treat continuous data', () => {

    // PREP //

    test ('Read: Read in continuous data', async () => {

        let neuroticism = []
        let extraversion = []
        let openness = []
        let agreeableness = []
        let conscientiousness = []

        const data = await d3.csv('http://localhost:3000/data/BigFivePersonalityTraits.csv', (d) => {

            neuroticism.push(d.Neuroticism)
            extraversion.push(d.Extraversion)
            openness.push(d.Openness)
            agreeableness.push(d.Agreeableness)
            conscientiousness.push(d.Conscientiousness)

            return d

        }) // when testing this functionality use an async test


        expect( data ).toTabulateAs(`\
┌─────────┬─────────────┬──────────────┬───────────┬───────────────┬───────────────────┐
│ (index) │ Neuroticism │ Extraversion │ Openness  │ Agreeableness │ Conscientiousness │
├─────────┼─────────────┼──────────────┼───────────┼───────────────┼───────────────────┤
│    0    │  '2.47917'  │  '4.20833'   │ '3.9375'  │   '3.95833'   │     '3.45833'     │
│    1    │  '2.60417'  │   '3.1875'   │ '3.95833' │   '3.39583'   │     '3.22917'     │
│    2    │  '2.8125'   │  '2.89583'   │ '3.41667' │    '2.75'     │       '3.5'       │
│    3    │  '2.89583'  │   '3.5625'   │ '3.52083' │   '3.16667'   │     '2.79167'     │
│    4    │  '3.02083'  │  '3.33333'   │ '4.02083' │   '3.20833'   │     '2.85417'     │
│    5    │  '2.52083'  │  '3.29167'   │ '3.4375'  │   '3.70833'   │       '2.5'       │
│    6    │  '2.35417'  │  '4.41667'   │ '4.58333' │   '3.0625'    │     '3.33333'     │
│    7    │  '2.52083'  │    '3.5'     │ '2.89583' │   '3.66667'   │     '3.0625'      │
│    8    │  '3.10417'  │   '3.8125'   │ '4.0625'  │   '3.77083'   │     '2.83333'     │
│    9    │  '2.6875'   │  '3.54708'   │ '3.78667' │   '3.35417'   │     '3.10417'     │
└─────────┴─────────────┴──────────────┴───────────┴───────────────┴───────────────────┘
˅˅˅ 490 more rows`, 0,10)


        expect( openness ).toTabulateAs(`\
┌─────────┬───────────┐
│ (index) │  Values   │
├─────────┼───────────┤
│    0    │ '3.9375'  │
│    1    │ '3.95833' │
│    2    │ '3.41667' │
│    3    │ '3.52083' │
│    4    │ '4.02083' │
│    5    │ '3.4375'  │
│    6    │ '4.58333' │
│    7    │ '2.89583' │
│    8    │ '4.0625'  │
│    9    │ '3.78667' │
└─────────┴───────────┘
˅˅˅ 490 more rows`, 0,10)

        expect( agreeableness ).toTabulateAs(`\
┌─────────┬───────────┐
│ (index) │  Values   │
├─────────┼───────────┤
│    0    │ '3.95833' │
│    1    │ '3.39583' │
│    2    │  '2.75'   │
│    3    │ '3.16667' │
│    4    │ '3.20833' │
│    5    │ '3.70833' │
│    6    │ '3.0625'  │
│    7    │ '3.66667' │
│    8    │ '3.77083' │
│    9    │ '3.35417' │
└─────────┴───────────┘
˅˅˅ 490 more rows`, 0,10)

    })




    test ('Detect: Detect continuous data', async () => {


        let neuroticism = []
        let extraversion = []
        let gender = []
        let monthMeasured = []

        const data = await d3.csv('http://localhost:3000/data/SampleMixedData-WithMissingValues.csv', (d) => {

            neuroticism.push(d.Neuroticism)
            extraversion.push(d.Extraversion)
            gender.push(d.Gender)
            monthMeasured.push(d.MonthMeasured)

            return d

        }) // when testing this functionality use an async test

        expect(data).toTabulateAs(`\
┌─────────┬─────────────┬──────────────┬────────┬───────────────┐
│ (index) │ Neuroticism │ Extraversion │ Gender │ MonthMeasured │
├─────────┼─────────────┼──────────────┼────────┼───────────────┤
│    0    │  '2.47917'  │  '4.20833'   │ 'Male' │   'January'   │
│    1    │  '2.60417'  │   '3.1875'   │ 'Male' │  'February'   │
│    2    │  '2.8125'   │  '2.89583'   │ 'Male' │    'March'    │
│    3    │     ''      │      ''      │   ''   │    'April'    │
│    4    │  '3.02083'  │      ''      │   ''   │     'May'     │
│    5    │  '2.52083'  │  '3.29167'   │ 'Male' │    'June'     │
│    6    │  '2.35417'  │  '4.41667'   │ 'Male' │    'July'     │
│    7    │  '2.52083'  │    '3.5'     │ 'Male' │   'August'    │
│    8    │  '3.10417'  │   '3.8125'   │ 'Male' │  'September'  │
│    9    │  '2.6875'   │  '3.54708'   │ 'Male' │   'October'   │
└─────────┴─────────────┴──────────────┴────────┴───────────────┘
˅˅˅ 89 more rows`, 0, 10)



        expect( isContinuousData( neuroticism ) ).toTabulateAs(`\
┌────────────┬────────┐
│  (index)   │ Values │
├────────────┼────────┤
│ isANumber  │   23   │
│ notANumber │   1    │
└────────────┴────────┘`)

        expect( isContinuousData( extraversion ) ).toTabulateAs(`\
┌────────────┬────────┐
│  (index)   │ Values │
├────────────┼────────┤
│ isANumber  │   22   │
│ notANumber │   2    │
└────────────┴────────┘`)

        expect( isContinuousData( gender ) ).toTabulateAs(`\
┌────────────┬────────┐
│  (index)   │ Values │
├────────────┼────────┤
│ isANumber  │   0    │
│ notANumber │   24   │
└────────────┴────────┘`)

        expect( isContinuousData( monthMeasured ) ).toTabulateAs(`\
┌────────────┬────────┐
│  (index)   │ Values │
├────────────┼────────┤
│ isANumber  │   0    │
│ notANumber │   24   │
└────────────┴────────┘`)


    })




    test ('Bin Simplified (SPLIT) : Bin continuous data using d3', async () => {

        let neuroticism = []
        let extraversion = []
        let openness = []
        let agreeableness = []
        let conscientiousness = []

        const data = await d3.csv('http://localhost:3000/data/BigFivePersonalityTraits.csv', (d) => {

            neuroticism.push(d.Neuroticism)
            extraversion.push(d.Extraversion)
            openness.push(d.Openness)
            agreeableness.push(d.Agreeableness)
            conscientiousness.push(d.Conscientiousness)

            return d

        }) // when testing this functionality use an async test


        const neuroticismQuartiles =
            d3.histogram()
                .thresholds(3)  // <---- '3' yields quartiles. '4' would yield 5 bins, '5' would yield 6 bins.
                                // For other threshold options, see https://github.com/d3/d3-array#histogram_thresholds
                .domain([d3.min(neuroticism), d3.max(neuroticism)])
                (neuroticism)


        expect( neuroticismQuartiles.length ).toBe(4)
        expect( neuroticismQuartiles[0] ).toTabulateAs(`\
┌─────────┬───────────┐
│ (index) │  Values   │
├─────────┼───────────┤
│    0    │ '1.91667' │
│    1    │ '1.64583' │
│    2    │  '1.75'   │
│    3    │ '1.89583' │
│    4    │ '1.89583' │
│    5    │ '1.91667' │
│    6    │ '1.83333' │
│    7    │ '1.72917' │
│    8    │ '1.9375'  │
│    9    │ '1.6875'  │
│   10    │ '1.97917' │
│   11    │ '1.95833' │
│   12    │ '1.9375'  │
│   x0    │ '1.64583' │
│   x1    │     2     │
└─────────┴───────────┘`)

        expect( neuroticismQuartiles[1] ).toTabulateAs(`\
┌─────────┬───────────┐
│ (index) │  Values   │
├─────────┼───────────┤
│    0    │ '2.47917' │
│    1    │ '2.60417' │
│    2    │ '2.8125'  │
│    3    │ '2.89583' │
│    4    │ '2.52083' │
│    5    │ '2.35417' │
│    6    │ '2.52083' │
│    7    │ '2.6875'  │
│    8    │  '2.625'  │
│    9    │  '2.375'  │
└─────────┴───────────┘
˅˅˅ 306 more rows`,0, 10)

        expect( neuroticismQuartiles[2] ).toTabulateAs(`\
┌─────────┬───────────┐
│ (index) │  Values   │
├─────────┼───────────┤
│    0    │ '3.02083' │
│    1    │ '3.10417' │
│    2    │ '3.0625'  │
│    3    │  '3.125'  │
│    4    │ '3.0625'  │
│    5    │ '3.22917' │
│    6    │  '3.125'  │
│    7    │ '3.22917' │
│    8    │ '3.0625'  │
│    9    │  '3.125'  │
└─────────┴───────────┘
˅˅˅ 157 more rows`, 0, 10)

        expect( neuroticismQuartiles[3] ).toTabulateAs(`\
┌─────────┬───────────┐
│ (index) │  Values   │
├─────────┼───────────┤
│    0    │ '4.35417' │
│    1    │ '4.08333' │
│    2    │ '4.10417' │
│    3    │  '4.375'  │
│   x0    │     4     │
│   x1    │  '4.375'  │
└─────────┴───────────┘`)


    })



    test ('Bin (SPLIT): Bin continuous data without assigning columns to variables', async () => {

        const mixedData = await d3.csv('http://localhost:3000/data/SampleMixedData.csv') // when testing this functionality use an async test

        const neuroticismQuartiles =
            d3.histogram()
                .value( d => d.Neuroticism)
                .thresholds(3)
                .domain([ d3.min(mixedData, d => d.Neuroticism), d3.max(mixedData, d => d.Neuroticism) ])
                (mixedData)


        expect( neuroticismQuartiles.length ).toBe(3)

        // Neuroticism Bin 1
        expect( neuroticismQuartiles[0].x0 ).toBe( '1.64583' )
        expect( neuroticismQuartiles[0].x1 ).toBe( 2 )
        expect( neuroticismQuartiles[0] ).toTabulateAs(`\
┌─────────┬─────────────┬──────────────┬──────────┬───────────────┬───────────┐
│ (index) │ Neuroticism │ Extraversion │  Gender  │ MonthMeasured │  Values   │
├─────────┼─────────────┼──────────────┼──────────┼───────────────┼───────────┤
│    0    │  '1.91667'  │  '4.10417'   │  'Male'  │  'November'   │           │
│    1    │  '1.64583'  │  '3.95833'   │ 'Female' │    'June'     │           │
│    2    │   '1.75'    │  '4.22917'   │ 'Female' │  'December'   │           │
│   x0    │             │              │          │               │ '1.64583' │
│   x1    │             │              │          │               │     2     │
└─────────┴─────────────┴──────────────┴──────────┴───────────────┴───────────┘`)

        // Neuroticism Bin 2
        expect( neuroticismQuartiles[1].x0 ).toBe( 2 )
        expect( neuroticismQuartiles[1].x1 ).toBe( 3 )
        expect( neuroticismQuartiles[1] ).toTabulateAs(`\
┌─────────┬─────────────┬──────────────┬────────┬───────────────┐
│ (index) │ Neuroticism │ Extraversion │ Gender │ MonthMeasured │
├─────────┼─────────────┼──────────────┼────────┼───────────────┤
│    0    │  '2.47917'  │  '4.20833'   │ 'Male' │   'January'   │
│    1    │  '2.60417'  │   '3.1875'   │ 'Male' │  'February'   │
│    2    │  '2.52083'  │  '2.89583'   │ 'Male' │    'March'    │
│    3    │  '2.52083'  │  '3.29167'   │ 'Male' │    'June'     │
│    4    │  '2.35417'  │  '4.41667'   │ 'Male' │    'July'     │
│    5    │  '2.52083'  │    '3.5'     │ 'Male' │   'August'    │
│    6    │  '2.6875'   │  '3.54708'   │ 'Male' │   'October'   │
│    7    │   '2.625'   │  '3.45833'   │ 'Male' │  'November'   │
│    8    │   '2.375'   │  '3.77083'   │ 'Male' │  'December'   │
│    9    │  '2.58333'  │  '3.02083'   │ 'Male' │    'March'    │
└─────────┴─────────────┴──────────────┴────────┴───────────────┘
˅˅˅ 44 more rows`,0, 10)

        // Neuroticism Bin 3
        expect( neuroticismQuartiles[2].x0 ).toBe( 3 )
        expect( neuroticismQuartiles[2].x1 ).toBe( "3.875" )
        expect( neuroticismQuartiles[2] ).toTabulateAs(`\
┌─────────┬─────────────┬──────────────┬──────────┬───────────────┐
│ (index) │ Neuroticism │ Extraversion │  Gender  │ MonthMeasured │
├─────────┼─────────────┼──────────────┼──────────┼───────────────┤
│    0    │  '3.29167'  │  '3.29167'   │ 'Female' │    'April'    │
│    1    │  '3.02083'  │  '3.29167'   │ 'Female' │     'May'     │
│    2    │  '3.10417'  │   '3.8125'   │  'Male'  │  'September'  │
│    3    │  '3.0625'   │  '3.41667'   │  'Male'  │   'January'   │
│    4    │   '3.125'   │  '2.52083'   │  'Male'  │  'February'   │
│    5    │  '3.0625'   │    '3.25'    │  'Male'  │   'August'    │
│    6    │  '3.22917'  │  '2.91667'   │  'Male'  │  'September'  │
│    7    │   '3.125'   │   '3.625'    │  'Male'  │    'March'    │
│    8    │  '3.22917'  │  '3.20833'   │  'Male'  │     'May'     │
│    9    │  '3.0625'   │  '3.14583'   │  'Male'  │  'September'  │
└─────────┴─────────────┴──────────────┴──────────┴───────────────┘
˅˅˅ 32 more rows`, 0, 10)


    })


    test ('Bin (SPLIT): Via custom `Bin` function  ', async () => {

        const mixedData = await d3.csv( 'http://localhost:3000/data/SampleMixedData.csv' )

        const mixedDataBinnedByExtraversion = bin( mixedData, 'Extraversion', 3 )


        // Extraversion Bin 1
        expect( mixedDataBinnedByExtraversion[0].x0 ).toBe( '2.52083' )
        expect( mixedDataBinnedByExtraversion[0].x1 ).toBe( 3 )
        expect( mixedDataBinnedByExtraversion[0] ).toTabulateAs(`\
┌─────────┬─────────────┬──────────────┬──────────┬───────────────┬───────────┐
│ (index) │ Neuroticism │ Extraversion │  Gender  │ MonthMeasured │  Values   │
├─────────┼─────────────┼──────────────┼──────────┼───────────────┼───────────┤
│    0    │  '2.52083'  │  '2.89583'   │  'Male'  │    'March'    │           │
│    1    │   '3.125'   │  '2.52083'   │  'Male'  │  'February'   │           │
│    2    │  '3.22917'  │  '2.91667'   │  'Male'  │  'September'  │           │
│    3    │   '3.875'   │  '2.64583'   │ 'Female' │  'December'   │           │
│    4    │  '2.87792'  │  '2.97917'   │ 'Female' │    'March'    │           │
│    5    │  '3.10417'  │    '2.75'    │ 'Female' │    'March'    │           │
│    6    │  '3.58333'  │  '2.58333'   │ 'Female' │  'September'  │           │
│    7    │  '3.6875'   │  '2.95833'   │ 'Female' │  'February'   │           │
│    8    │  '3.70833'  │  '2.77083'   │ 'Female' │    'March'    │           │
│    9    │  '2.60417'  │  '2.97917'   │ 'Female' │    'July'     │           │
│   10    │  '2.85417'  │  '2.83333'   │ 'Female' │  'November'   │           │
│   x0    │             │              │          │               │ '2.52083' │
│   x1    │             │              │          │               │     3     │
└─────────┴─────────────┴──────────────┴──────────┴───────────────┴───────────┘`)

        // Extraversion Bin 2
        expect( mixedDataBinnedByExtraversion[1].x0 ).toBe( 3 )
        expect( mixedDataBinnedByExtraversion[1].x1 ).toBe( 3.5 )
        expect( mixedDataBinnedByExtraversion[1] ).toTabulateAs(`\
┌─────────┬─────────────┬──────────────┬──────────┬───────────────┐
│ (index) │ Neuroticism │ Extraversion │  Gender  │ MonthMeasured │
├─────────┼─────────────┼──────────────┼──────────┼───────────────┤
│    0    │  '2.60417'  │   '3.1875'   │  'Male'  │  'February'   │
│    1    │  '3.29167'  │  '3.29167'   │ 'Female' │    'April'    │
│    2    │  '3.02083'  │  '3.29167'   │ 'Female' │     'May'     │
│    3    │  '2.52083'  │  '3.29167'   │  'Male'  │    'June'     │
│    4    │   '2.625'   │  '3.45833'   │  'Male'  │  'November'   │
│    5    │  '3.0625'   │  '3.41667'   │  'Male'  │   'January'   │
│    6    │  '2.58333'  │  '3.02083'   │  'Male'  │    'March'    │
│    7    │  '2.97917'  │   '3.3125'   │  'Male'  │    'April'    │
│    8    │  '3.0625'   │    '3.25'    │  'Male'  │   'August'    │
│    9    │  '2.41667'  │   '3.4375'   │  'Male'  │   'October'   │
└─────────┴─────────────┴──────────────┴──────────┴───────────────┘
˅˅˅ 32 more rows`,0, 10)

        // Extraversion Bin 3
        expect( mixedDataBinnedByExtraversion[2].x0 ).toBe( 3.5 )
        expect( mixedDataBinnedByExtraversion[2].x1 ).toBe( 4 )
        expect( mixedDataBinnedByExtraversion[2] ).toTabulateAs(`\
┌─────────┬─────────────┬──────────────┬────────┬───────────────┐
│ (index) │ Neuroticism │ Extraversion │ Gender │ MonthMeasured │
├─────────┼─────────────┼──────────────┼────────┼───────────────┤
│    0    │  '2.52083'  │    '3.5'     │ 'Male' │   'August'    │
│    1    │  '3.10417'  │   '3.8125'   │ 'Male' │  'September'  │
│    2    │  '2.6875'   │  '3.54708'   │ 'Male' │   'October'   │
│    3    │   '2.375'   │  '3.77083'   │ 'Male' │  'December'   │
│    4    │  '2.79167'  │  '3.79167'   │ 'Male' │     'May'     │
│    5    │  '2.5625'   │  '3.54167'   │ 'Male' │    'June'     │
│    6    │  '2.4375'   │  '3.72917'   │ 'Male' │    'July'     │
│    7    │  '2.85417'  │  '3.64583'   │ 'Male' │  'November'   │
│    8    │  '2.85417'  │   '3.5625'   │ 'Male' │   'January'   │
│    9    │   '2.875'   │  '3.58333'   │ 'Male' │  'February'   │
└─────────┴─────────────┴──────────────┴────────┴───────────────┘
˅˅˅ 29 more rows`,0,10)


        // Extraversion Bin 4
        expect( mixedDataBinnedByExtraversion[3].x0 ).toBe( 4 )
        expect( mixedDataBinnedByExtraversion[3].x1 ).toBe( '4.41667' )
        expect( mixedDataBinnedByExtraversion[3] ).toTabulateAs(`\
┌─────────┬─────────────┬──────────────┬──────────┬───────────────┬───────────┐
│ (index) │ Neuroticism │ Extraversion │  Gender  │ MonthMeasured │  Values   │
├─────────┼─────────────┼──────────────┼──────────┼───────────────┼───────────┤
│    0    │  '2.47917'  │  '4.20833'   │  'Male'  │   'January'   │           │
│    1    │  '2.35417'  │  '4.41667'   │  'Male'  │    'July'     │           │
│    2    │   '2.875'   │  '4.08333'   │  'Male'  │  'December'   │           │
│    3    │  '1.91667'  │  '4.10417'   │  'Male'  │  'November'   │           │
│    4    │  '2.33333'  │   '4.1875'   │  'Male'  │  'September'  │           │
│    5    │  '2.9375'   │  '4.22917'   │ 'Female' │    'March'    │           │
│    6    │   '1.75'    │  '4.22917'   │ 'Female' │  'December'   │           │
│   x0    │             │              │          │               │     4     │
│   x1    │             │              │          │               │ '4.41667' │
└─────────┴─────────────┴──────────────┴──────────┴───────────────┴───────────┘`)

    })


    test ('Bin and Summarize: Via custom `Bin` function  ', async () => {

        const mixedData = await d3.csv( 'http://localhost:3000/data/SampleMixedData.csv' )

        const mixedDataBinnedByExtraversion = bin( mixedData, 'Extraversion', 3 )

        const manualRollup = new Map()
        mixedDataBinnedByExtraversion.forEach( ( bin ) => {

            const binMin = bin.x0
            const binMax = bin.x1
            const binName = `${binMin}-${binMax}`

            manualRollup.set( binName, bin )

        })

        expect( manualRollup ).toTabulateAs(`\
┌───────────────────┬─────────────┬──────────────────────────────────────────────────────────────────────────┐
│ (iteration index) │     Key     │                                  Values                                  │
├───────────────────┼─────────────┼──────────────────────────────────────────────────────────────────────────┤
│         0         │ '2.52083-3' │ [ [Object], [Object], [Object], ... 8 more items, x0: '2.52083', x1: 3 ] │
│         1         │   '3-3.5'   │   [ [Object], [Object], [Object], ... 39 more items, x0: 3, x1: 3.5 ]    │
│         2         │   '3.5-4'   │   [ [Object], [Object], [Object], ... 36 more items, x0: 3.5, x1: 4 ]    │
│         3         │ '4-4.41667' │ [ [Object], [Object], [Object], ... 4 more items, x0: 4, x1: '4.41667' ] │
└───────────────────┴─────────────┴──────────────────────────────────────────────────────────────────────────┘`)

    })


    test ('Quantile Scale + Rollup: Use quantile scale during rollup to bin in the most efficient way', async () => {

        const mixedData = await d3.csv( 'http://localhost:3000/data/SampleMixedData.csv' )

        expect( mixedData ).toTabulateAs(`\
┌─────────┬─────────────┬──────────────┬──────────┬───────────────┐
│ (index) │ Neuroticism │ Extraversion │  Gender  │ MonthMeasured │
├─────────┼─────────────┼──────────────┼──────────┼───────────────┤
│    0    │  '2.47917'  │  '4.20833'   │  'Male'  │   'January'   │
│    1    │  '2.60417'  │   '3.1875'   │  'Male'  │  'February'   │
│    2    │  '2.52083'  │  '2.89583'   │  'Male'  │    'March'    │
│    3    │  '3.29167'  │  '3.29167'   │ 'Female' │    'April'    │
│    4    │  '3.02083'  │  '3.29167'   │ 'Female' │     'May'     │
└─────────┴─────────────┴──────────────┴──────────┴───────────────┘
˅˅˅ 94 more rows`, 0, 5)

        const outputCategories = d3.range(4)

        const min =d3.min( mixedData, d => d['Extraversion'] )
        const max =d3.max( mixedData, d => d['Extraversion'] )


        const quantizeScale = d3.scaleQuantize()
            .domain( [min, max] )
            .range( outputCategories )

        const continuousRollup = d3.rollup(mixedData,
            v => v.length,
            d => {
                return quantizeScale(d.Extraversion)
            }
        )

        expect( continuousRollup ).toTabulateAs(`\
┌───────────────────┬─────┬────────┐
│ (iteration index) │ Key │ Values │
├───────────────────┼─────┼────────┤
│         0         │  3  │   8    │
│         1         │  1  │   38   │
│         2         │  0  │   11   │
│         3         │  2  │   42   │
└───────────────────┴─────┴────────┘`)


        const continuousGroup = d3.group(mixedData,
            d => {
                return quantizeScale(d.Extraversion)
            }
        )

        expect( continuousGroup ).toTabulateAs(`\
┌───────────────────┬─────┬─────────────────────────────────────────────────────┐
│ (iteration index) │ Key │                       Values                        │
├───────────────────┼─────┼─────────────────────────────────────────────────────┤
│         0         │  3  │ [ [Object], [Object], [Object], ... 5 more items ]  │
│         1         │  1  │ [ [Object], [Object], [Object], ... 35 more items ] │
│         2         │  0  │ [ [Object], [Object], [Object], ... 8 more items ]  │
│         3         │  2  │ [ [Object], [Object], [Object], ... 39 more items ] │
└───────────────────┴─────┴─────────────────────────────────────────────────────┘`)


        // Extraversion group 1
        expect( d3.min( continuousGroup.get(0), d=>d.Extraversion ) ).toBe( '2.52083' )
        expect( d3.max( continuousGroup.get(0), d=>d.Extraversion ) ).toBe( '2.97917' )
        expect( continuousGroup.get(0) ).toTabulateAs(`\
┌─────────┬─────────────┬──────────────┬──────────┬───────────────┐
│ (index) │ Neuroticism │ Extraversion │  Gender  │ MonthMeasured │
├─────────┼─────────────┼──────────────┼──────────┼───────────────┤
│    0    │  '2.52083'  │  '2.89583'   │  'Male'  │    'March'    │
│    1    │   '3.125'   │  '2.52083'   │  'Male'  │  'February'   │
│    2    │  '3.22917'  │  '2.91667'   │  'Male'  │  'September'  │
│    3    │   '3.875'   │  '2.64583'   │ 'Female' │  'December'   │
│    4    │  '2.87792'  │  '2.97917'   │ 'Female' │    'March'    │
│    5    │  '3.10417'  │    '2.75'    │ 'Female' │    'March'    │
│    6    │  '3.58333'  │  '2.58333'   │ 'Female' │  'September'  │
│    7    │  '3.6875'   │  '2.95833'   │ 'Female' │  'February'   │
│    8    │  '3.70833'  │  '2.77083'   │ 'Female' │    'March'    │
│    9    │  '2.60417'  │  '2.97917'   │ 'Female' │    'July'     │
│   10    │  '2.85417'  │  '2.83333'   │ 'Female' │  'November'   │
└─────────┴─────────────┴──────────────┴──────────┴───────────────┘`)

        // Extraversion group 2
        expect( d3.min( continuousGroup.get(1), d=>d.Extraversion ) ).toBe( '3' )
        expect( d3.max( continuousGroup.get(1), d=>d.Extraversion ) ).toBe( '3.45833' )
        expect( continuousGroup.get(1) ).toTabulateAs(`\
┌─────────┬─────────────┬──────────────┬──────────┬───────────────┐
│ (index) │ Neuroticism │ Extraversion │  Gender  │ MonthMeasured │
├─────────┼─────────────┼──────────────┼──────────┼───────────────┤
│    0    │  '2.60417'  │   '3.1875'   │  'Male'  │  'February'   │
│    1    │  '3.29167'  │  '3.29167'   │ 'Female' │    'April'    │
│    2    │  '3.02083'  │  '3.29167'   │ 'Female' │     'May'     │
│    3    │  '2.52083'  │  '3.29167'   │  'Male'  │    'June'     │
│    4    │   '2.625'   │  '3.45833'   │  'Male'  │  'November'   │
│    5    │  '3.0625'   │  '3.41667'   │  'Male'  │   'January'   │
│    6    │  '2.58333'  │  '3.02083'   │  'Male'  │    'March'    │
│    7    │  '2.97917'  │   '3.3125'   │  'Male'  │    'April'    │
│    8    │  '3.0625'   │    '3.25'    │  'Male'  │   'August'    │
│    9    │  '2.41667'  │   '3.4375'   │  'Male'  │   'October'   │
│   10    │  '3.22917'  │  '3.20833'   │  'Male'  │     'May'     │
│   11    │  '2.9375'   │   '3.0625'   │  'Male'  │    'July'     │
│   12    │  '3.0625'   │  '3.14583'   │  'Male'  │  'September'  │
│   13    │  '3.02083'  │  '3.20833'   │  'Male'  │  'February'   │
│   14    │  '2.16667'  │  '3.45833'   │  'Male'  │    'March'    │
│   15    │  '2.8125'   │   '3.375'    │  'Male'  │   'August'    │
│   16    │  '3.04167'  │    '3.25'    │  'Male'  │   'October'   │
│   17    │     '3'     │  '3.35417'   │  'Male'  │  'December'   │
│   18    │  '2.77083'  │  '3.33333'   │ 'Female' │  'February'   │
│   19    │  '2.6875'   │  '3.41667'   │ 'Female' │    'April'    │
│   20    │  '3.4375'   │  '3.02083'   │ 'Female' │     'May'     │
│   21    │  '2.85417'  │  '3.29167'   │ 'Female' │    'July'     │
│   22    │  '3.39583'  │     '3'      │ 'Female' │   'August'    │
│   23    │  '3.39583'  │  '3.35417'   │ 'Female' │   'October'   │
│   24    │  '2.58333'  │  '3.35417'   │ 'Female' │  'November'   │
│   25    │  '2.79167'  │  '3.39583'   │ 'Female' │     'May'     │
│   26    │  '2.77083'  │  '3.41667'   │ 'Female' │    'July'     │
│   27    │  '3.10417'  │   '3.375'    │ 'Female' │   'August'    │
│   28    │  '3.19479'  │  '3.45833'   │ 'Female' │  'September'  │
│   29    │  '2.91667'  │   '3.4375'   │ 'Female' │   'October'   │
│   30    │     '3'     │  '3.41667'   │ 'Female' │   'October'   │
│   31    │  '3.79167'  │  '3.02083'   │ 'Female' │  'November'   │
│   32    │  '3.10417'  │  '3.35417'   │ 'Female' │   'January'   │
│   33    │   '3.25'    │  '3.27083'   │ 'Female' │    'April'    │
│   34    │  '3.29167'  │  '3.16667'   │ 'Female' │  'September'  │
│   35    │  '3.14583'  │  '3.29167'   │ 'Female' │   'October'   │
│   36    │  '2.83333'  │   '3.3125'   │ 'Female' │  'December'   │
│   37    │  '2.52083'  │    '3.25'    │ 'Female' │  'February'   │
└─────────┴─────────────┴──────────────┴──────────┴───────────────┘`)

        // Extraversion group 3
        expect( d3.min( continuousGroup.get(2), d=>d.Extraversion ) ).toBe( '3.47917' )
        expect( d3.max( continuousGroup.get(2), d=>d.Extraversion ) ).toBe( '3.875' )
        expect( continuousGroup.get(2) ).toTabulateAs(`\
┌─────────┬─────────────┬──────────────┬──────────┬───────────────┐
│ (index) │ Neuroticism │ Extraversion │  Gender  │ MonthMeasured │
├─────────┼─────────────┼──────────────┼──────────┼───────────────┤
│    0    │  '2.52083'  │    '3.5'     │  'Male'  │   'August'    │
│    1    │  '3.10417'  │   '3.8125'   │  'Male'  │  'September'  │
│    2    │  '2.6875'   │  '3.54708'   │  'Male'  │   'October'   │
│    3    │   '2.375'   │  '3.77083'   │  'Male'  │  'December'   │
│    4    │  '2.79167'  │  '3.79167'   │  'Male'  │     'May'     │
│    5    │  '2.5625'   │  '3.54167'   │  'Male'  │    'June'     │
│    6    │  '2.4375'   │  '3.72917'   │  'Male'  │    'July'     │
│    7    │  '2.85417'  │  '3.64583'   │  'Male'  │  'November'   │
│    8    │  '2.85417'  │   '3.5625'   │  'Male'  │   'January'   │
│    9    │   '2.875'   │  '3.58333'   │  'Male'  │  'February'   │
│   10    │   '3.125'   │   '3.625'    │  'Male'  │    'March'    │
│   11    │   '2.75'    │  '3.83333'   │  'Male'  │    'April'    │
│   12    │  '2.5625'   │  '3.83333'   │  'Male'  │    'June'     │
│   13    │   '2.75'    │  '3.64583'   │  'Male'  │   'August'    │
│   14    │   '3.125'   │  '3.70833'   │  'Male'  │   'October'   │
│   15    │   '2.75'    │  '3.54167'   │  'Male'  │  'December'   │
│   16    │  '3.10417'  │  '3.47917'   │  'Male'  │   'January'   │
│   17    │  '3.6875'   │    '3.5'     │  'Male'  │    'April'    │
│   18    │  '2.20833'  │  '3.66667'   │  'Male'  │     'May'     │
│   19    │  '2.10417'  │  '3.77083'   │  'Male'  │    'June'     │
│   20    │  '2.58333'  │   '3.6875'   │  'Male'  │    'July'     │
│   21    │  '3.70833'  │  '3.72917'   │  'Male'  │  'November'   │
│   22    │  '2.91667'  │   '3.5625'   │  'Male'  │   'January'   │
│   23    │  '3.02083'  │  '3.64583'   │ 'Female' │    'June'     │
│   24    │  '2.79167'  │  '3.83333'   │ 'Female' │  'September'  │
│   25    │     '3'     │  '3.66667'   │ 'Female' │   'January'   │
│   26    │  '2.60708'  │  '3.54167'   │ 'Female' │  'February'   │
│   27    │  '3.29167'  │    '3.5'     │ 'Female' │    'April'    │
│   28    │  '2.80042'  │   '3.625'    │ 'Female' │    'June'     │
│   29    │  '3.02083'  │  '3.60417'   │ 'Female' │  'November'   │
│   30    │  '2.52083'  │  '3.47917'   │ 'Female' │  'December'   │
│   31    │  '3.0625'   │  '3.72917'   │ 'Female' │   'January'   │
│   32    │  '2.97917'  │  '3.54167'   │ 'Female' │  'February'   │
│   33    │  '3.60417'  │    '3.5'     │ 'Female' │    'April'    │
│   34    │  '2.6875'   │  '3.47917'   │ 'Female' │     'May'     │
│   35    │  '2.52083'  │   '3.6875'   │ 'Female' │    'July'     │
│   36    │    '3.5'    │  '3.47917'   │ 'Female' │   'August'    │
│   37    │  '2.33333'  │  '3.58333'   │ 'Female' │     'May'     │
│   38    │  '2.35417'  │   '3.5625'   │ 'Female' │    'June'     │
│   39    │  '3.14583'  │  '3.77083'   │ 'Female' │   'August'    │
│   40    │  '3.3125'   │  '3.64583'   │ 'Female' │   'January'   │
│   41    │  '2.83333'  │   '3.875'    │ 'Female' │    'March'    │
└─────────┴─────────────┴──────────────┴──────────┴───────────────┘`)

        // Extraversion group 4
        expect( d3.min( continuousGroup.get(3), d=>d.Extraversion ) ).toBe( '3.95833' )
        expect( d3.max( continuousGroup.get(3), d=>d.Extraversion ) ).toBe( '4.41667' )
        expect( continuousGroup.get(3) ).toTabulateAs(`\
┌─────────┬─────────────┬──────────────┬──────────┬───────────────┐
│ (index) │ Neuroticism │ Extraversion │  Gender  │ MonthMeasured │
├─────────┼─────────────┼──────────────┼──────────┼───────────────┤
│    0    │  '2.47917'  │  '4.20833'   │  'Male'  │   'January'   │
│    1    │  '2.35417'  │  '4.41667'   │  'Male'  │    'July'     │
│    2    │   '2.875'   │  '4.08333'   │  'Male'  │  'December'   │
│    3    │  '1.91667'  │  '4.10417'   │  'Male'  │  'November'   │
│    4    │  '2.33333'  │   '4.1875'   │  'Male'  │  'September'  │
│    5    │  '2.9375'   │  '4.22917'   │ 'Female' │    'March'    │
│    6    │  '1.64583'  │  '3.95833'   │ 'Female' │    'June'     │
│    7    │   '1.75'    │  '4.22917'   │ 'Female' │  'December'   │
└─────────┴─────────────┴──────────────┴──────────┴───────────────┘`)


    })



    test ('Quantile vs Quantize scales on simple arrays', () => {

        let array1 = [0,1,2,3,4,5,6,7,8,9,10]
        let array2 = [40,30,20,10,50,60,70,90,80,100,0]


        const quantizeScale4 = d3.scaleQuantize()
            .domain( [0, 10] )
            .range( ['A', 'B', 'C', 'D'] )

        const quantizeScale5 = d3.scaleQuantize()
            .domain( [0, 10] )
            .range( ['A', 'B', 'C', 'D', 'E'] )


        const quantileScale4 = d3.scaleQuantile()
            .domain( [0, 10] )
            .range( ['A', 'B', 'C', 'D'] )

        const quantileScale5 = d3.scaleQuantile()
            .domain( [0, 10] )
            .range( ['A', 'B', 'C', 'D', 'E'] )



        const array1Quantized4 = []
        array1.forEach( (e) => {

            const quantizedE = quantizeScale4(e)
            array1Quantized4.push(quantizedE)

        })

        const array1Quantized5 = []
        array1.forEach( (e) => {

            const quantizedE = quantizeScale5(e)
            array1Quantized5.push(quantizedE)

        })


        const array1Quantiled4 = []
        array1.forEach( (e) => {

            const quantiledE = quantileScale4(e)
            array1Quantiled4.push(quantiledE)

        })

        const array1Quantiled5 = []

        array1.forEach( (e) => {

            const quantiledE = quantileScale5(e)
            array1Quantiled5.push(quantiledE)

        })


        // Calculate quartiles
        expect ( array1.quantile25() ).toBe( 2.5 )
        expect ( array1.quantile50() ).toBe( 5 )
        expect ( array1.quantile75() ).toBe( 7.5 )


        // Use d3.quantize and quantile on data (with 4 bins)
                                           // 0%           25%         50%          75%          100%
                                           // |             |           |            |            |
        expect( array1 ).toEqual(           [  0,   1,   2,   3,   4,   5,   6,   7,   8,   9,  10]  )
        expect( array1Quantized4 ).toEqual( [ 'A', 'A', 'A', 'B', 'B', 'C', 'C', 'C', 'D', 'D', 'D'  ] )
        expect( array1Quantiled4 ).toEqual( [ 'A', 'A', 'A', 'B', 'B', 'C', 'C', 'C', 'D', 'D', 'D' ] )


        // Use d3.quantize and quantile on data (with 5 bins)
                                           // 0%           25%         50%          75%          100%
                                           // |             |           |            |            |
        expect( array1 ).toEqual(           [  0,   1,   2,   3,   4,   5,   6,   7,   8,   9,  10]  )
        expect( array1Quantized5 ).toEqual( [ 'A', 'A', 'B', 'B', 'C', 'C', 'D', 'D', 'E', 'E', 'E'  ] )
        expect( array1Quantiled5 ).toEqual( [ 'A', 'A', 'B', 'B', 'C', 'C', 'D', 'D', 'E', 'E', 'E' ] )


    })


    test ('Quantile vs Quantize scales on dataset', async () => {

        const mixedData = await d3.csv( 'http://localhost:3000/data/SampleMixedData.csv' )

        expect( mixedData ).toTabulateAs(`\
┌─────────┬─────────────┬──────────────┬──────────┬───────────────┐
│ (index) │ Neuroticism │ Extraversion │  Gender  │ MonthMeasured │
├─────────┼─────────────┼──────────────┼──────────┼───────────────┤
│    0    │  '2.47917'  │  '4.20833'   │  'Male'  │   'January'   │
│    1    │  '2.60417'  │   '3.1875'   │  'Male'  │  'February'   │
│    2    │  '2.52083'  │  '2.89583'   │  'Male'  │    'March'    │
│    3    │  '3.29167'  │  '3.29167'   │ 'Female' │    'April'    │
│    4    │  '3.02083'  │  '3.29167'   │ 'Female' │     'May'     │
└─────────┴─────────────┴──────────────┴──────────┴───────────────┘
˅˅˅ 94 more rows`, 0, 5)

        const outputCategories = d3.range(4)

        const min =d3.min( mixedData, d => d['Extraversion'] )
        const max =d3.max( mixedData, d => d['Extraversion'] )


        const quantizeScale = d3.scaleQuantize()
            .domain( [min, max] )
            .range( outputCategories )

        const quantileScale = d3.scaleQuantile()
            .domain( [min, max] )
            .range( outputCategories )


        const quantileSummary = d3.rollup(mixedData,
            v => v.length,
            d => {
                return quantizeScale(d.Extraversion)
            }
        )

        expect( quantileSummary ).toTabulateAs(`\
┌───────────────────┬─────┬────────┐
│ (iteration index) │ Key │ Values │
├───────────────────┼─────┼────────┤
│         0         │  3  │   8    │
│         1         │  1  │   38   │
│         2         │  0  │   11   │
│         3         │  2  │   42   │
└───────────────────┴─────┴────────┘`)

        const quantizeSummary = d3.rollup(mixedData,
            v => v.length,
            d => {
                return quantileScale(d.Extraversion)
            }
        )

        expect( quantizeSummary ).toTabulateAs(`\
┌───────────────────┬─────┬────────┐
│ (iteration index) │ Key │ Values │
├───────────────────┼─────┼────────┤
│         0         │  3  │   8    │
│         1         │  1  │   38   │
│         2         │  0  │   11   │
│         3         │  2  │   42   │
└───────────────────┴─────┴────────┘`)



    })



    test ('Rename group keys: Use custom bin names during d3.group and d3.rollup ', async () => {

        const mixedData = await d3.csv( 'http://localhost:3000/data/SampleMixedData.csv' )

        expect( mixedData ).toTabulateAs(`\
┌─────────┬─────────────┬──────────────┬──────────┬───────────────┐
│ (index) │ Neuroticism │ Extraversion │  Gender  │ MonthMeasured │
├─────────┼─────────────┼──────────────┼──────────┼───────────────┤
│    0    │  '2.47917'  │  '4.20833'   │  'Male'  │   'January'   │
│    1    │  '2.60417'  │   '3.1875'   │  'Male'  │  'February'   │
│    2    │  '2.52083'  │  '2.89583'   │  'Male'  │    'March'    │
│    3    │  '3.29167'  │  '3.29167'   │ 'Female' │    'April'    │
│    4    │  '3.02083'  │  '3.29167'   │ 'Female' │     'May'     │
└─────────┴─────────────┴──────────────┴──────────┴───────────────┘
˅˅˅ 94 more rows`, 0, 5)

        const outputCategories = d3.range(4)

        const min =d3.min( mixedData, d => d['Extraversion'] )
        const max =d3.max( mixedData, d => d['Extraversion'] )


        const quantizeScale = d3.scaleQuantize()
            .domain( [min, max] )
            .range( outputCategories )


        // Group and change group names on the go
        const groupedData = d3.group(mixedData,
                d=>quantizeScale(d['Extraversion'])
        )
        const groupedDataWithRenamedKeys = new Map(
            Array.from(groupedData, ([categoryName, categoryData]) => {

                    const categoryMin = d3.min(categoryData, d=>d['Extraversion'])
                    const categoryMax = d3.max(categoryData, d=>d['Extraversion'])

                    const categoryMinShortened = Number( categoryMin ).toFixed(2)
                    const categoryMaxShortened = Number( categoryMax ).toFixed(2)

                    const newName = `${categoryMinShortened}-${categoryMaxShortened}`
                    return [ newName, categoryData ]

                }
            )
        )


        // Reorder groups
        const sortedGroupedData = new Map( [...groupedDataWithRenamedKeys.entries()].sort().reverse() )


        // Do a manual rollup to preserve new group names(i.e., without using d3.rollup)
        const manuallyRolledUpData = new Map()
        sortedGroupedData.forEach( (categoryData, categoryName) => {
            manuallyRolledUpData.set(categoryName, categoryData.length)
        })

        expect( manuallyRolledUpData ).toTabulateAs(`\
┌───────────────────┬─────────────┬────────┐
│ (iteration index) │     Key     │ Values │
├───────────────────┼─────────────┼────────┤
│         0         │ '3.96-4.42' │   8    │
│         1         │ '3.48-3.88' │   42   │
│         2         │ '3.00-3.46' │   38   │
│         3         │ '2.52-2.98' │   11   │
└───────────────────┴─────────────┴────────┘`)

        expect( groupedDataWithRenamedKeys ).toTabulateAs(`\
┌───────────────────┬─────────────┬─────────────────────────────────────────────────────┐
│ (iteration index) │     Key     │                       Values                        │
├───────────────────┼─────────────┼─────────────────────────────────────────────────────┤
│         0         │ '3.96-4.42' │ [ [Object], [Object], [Object], ... 5 more items ]  │
│         1         │ '3.00-3.46' │ [ [Object], [Object], [Object], ... 35 more items ] │
│         2         │ '2.52-2.98' │ [ [Object], [Object], [Object], ... 8 more items ]  │
│         3         │ '3.48-3.88' │ [ [Object], [Object], [Object], ... 39 more items ] │
└───────────────────┴─────────────┴─────────────────────────────────────────────────────┘`)

        expect( sortedGroupedData ).toTabulateAs(`\
┌───────────────────┬─────────────┬─────────────────────────────────────────────────────┐
│ (iteration index) │     Key     │                       Values                        │
├───────────────────┼─────────────┼─────────────────────────────────────────────────────┤
│         0         │ '3.96-4.42' │ [ [Object], [Object], [Object], ... 5 more items ]  │
│         1         │ '3.48-3.88' │ [ [Object], [Object], [Object], ... 39 more items ] │
│         2         │ '3.00-3.46' │ [ [Object], [Object], [Object], ... 35 more items ] │
│         3         │ '2.52-2.98' │ [ [Object], [Object], [Object], ... 8 more items ]  │
└───────────────────┴─────────────┴─────────────────────────────────────────────────────┘`)



        // Extraversion group 1
        expect( d3.min( sortedGroupedData.get('3.96-4.42'), d=>d.Extraversion ) ).toBe( '3.95833' )
        expect( d3.max( sortedGroupedData.get('3.96-4.42'), d=>d.Extraversion ) ).toBe( '4.41667' )
        expect( sortedGroupedData.get('3.96-4.42') ).toTabulateAs(`\
┌─────────┬─────────────┬──────────────┬──────────┬───────────────┐
│ (index) │ Neuroticism │ Extraversion │  Gender  │ MonthMeasured │
├─────────┼─────────────┼──────────────┼──────────┼───────────────┤
│    0    │  '2.47917'  │  '4.20833'   │  'Male'  │   'January'   │
│    1    │  '2.35417'  │  '4.41667'   │  'Male'  │    'July'     │
│    2    │   '2.875'   │  '4.08333'   │  'Male'  │  'December'   │
│    3    │  '1.91667'  │  '4.10417'   │  'Male'  │  'November'   │
│    4    │  '2.33333'  │   '4.1875'   │  'Male'  │  'September'  │
│    5    │  '2.9375'   │  '4.22917'   │ 'Female' │    'March'    │
│    6    │  '1.64583'  │  '3.95833'   │ 'Female' │    'June'     │
│    7    │   '1.75'    │  '4.22917'   │ 'Female' │  'December'   │
└─────────┴─────────────┴──────────────┴──────────┴───────────────┘`)


        // Extraversion group 2
        expect( d3.min( sortedGroupedData.get('3.48-3.88'), d=>d.Extraversion ) ).toBe( '3.47917' )
        expect( d3.max( sortedGroupedData.get('3.48-3.88'), d=>d.Extraversion ) ).toBe( '3.875' )
        expect( sortedGroupedData.get('3.48-3.88') ).toTabulateAs(`\
┌─────────┬─────────────┬──────────────┬──────────┬───────────────┐
│ (index) │ Neuroticism │ Extraversion │  Gender  │ MonthMeasured │
├─────────┼─────────────┼──────────────┼──────────┼───────────────┤
│    0    │  '2.52083'  │    '3.5'     │  'Male'  │   'August'    │
│    1    │  '3.10417'  │   '3.8125'   │  'Male'  │  'September'  │
│    2    │  '2.6875'   │  '3.54708'   │  'Male'  │   'October'   │
│    3    │   '2.375'   │  '3.77083'   │  'Male'  │  'December'   │
│    4    │  '2.79167'  │  '3.79167'   │  'Male'  │     'May'     │
│    5    │  '2.5625'   │  '3.54167'   │  'Male'  │    'June'     │
│    6    │  '2.4375'   │  '3.72917'   │  'Male'  │    'July'     │
│    7    │  '2.85417'  │  '3.64583'   │  'Male'  │  'November'   │
│    8    │  '2.85417'  │   '3.5625'   │  'Male'  │   'January'   │
│    9    │   '2.875'   │  '3.58333'   │  'Male'  │  'February'   │
│   10    │   '3.125'   │   '3.625'    │  'Male'  │    'March'    │
│   11    │   '2.75'    │  '3.83333'   │  'Male'  │    'April'    │
│   12    │  '2.5625'   │  '3.83333'   │  'Male'  │    'June'     │
│   13    │   '2.75'    │  '3.64583'   │  'Male'  │   'August'    │
│   14    │   '3.125'   │  '3.70833'   │  'Male'  │   'October'   │
│   15    │   '2.75'    │  '3.54167'   │  'Male'  │  'December'   │
│   16    │  '3.10417'  │  '3.47917'   │  'Male'  │   'January'   │
│   17    │  '3.6875'   │    '3.5'     │  'Male'  │    'April'    │
│   18    │  '2.20833'  │  '3.66667'   │  'Male'  │     'May'     │
│   19    │  '2.10417'  │  '3.77083'   │  'Male'  │    'June'     │
│   20    │  '2.58333'  │   '3.6875'   │  'Male'  │    'July'     │
│   21    │  '3.70833'  │  '3.72917'   │  'Male'  │  'November'   │
│   22    │  '2.91667'  │   '3.5625'   │  'Male'  │   'January'   │
│   23    │  '3.02083'  │  '3.64583'   │ 'Female' │    'June'     │
│   24    │  '2.79167'  │  '3.83333'   │ 'Female' │  'September'  │
│   25    │     '3'     │  '3.66667'   │ 'Female' │   'January'   │
│   26    │  '2.60708'  │  '3.54167'   │ 'Female' │  'February'   │
│   27    │  '3.29167'  │    '3.5'     │ 'Female' │    'April'    │
│   28    │  '2.80042'  │   '3.625'    │ 'Female' │    'June'     │
│   29    │  '3.02083'  │  '3.60417'   │ 'Female' │  'November'   │
│   30    │  '2.52083'  │  '3.47917'   │ 'Female' │  'December'   │
│   31    │  '3.0625'   │  '3.72917'   │ 'Female' │   'January'   │
│   32    │  '2.97917'  │  '3.54167'   │ 'Female' │  'February'   │
│   33    │  '3.60417'  │    '3.5'     │ 'Female' │    'April'    │
│   34    │  '2.6875'   │  '3.47917'   │ 'Female' │     'May'     │
│   35    │  '2.52083'  │   '3.6875'   │ 'Female' │    'July'     │
│   36    │    '3.5'    │  '3.47917'   │ 'Female' │   'August'    │
│   37    │  '2.33333'  │  '3.58333'   │ 'Female' │     'May'     │
│   38    │  '2.35417'  │   '3.5625'   │ 'Female' │    'June'     │
│   39    │  '3.14583'  │  '3.77083'   │ 'Female' │   'August'    │
│   40    │  '3.3125'   │  '3.64583'   │ 'Female' │   'January'   │
│   41    │  '2.83333'  │   '3.875'    │ 'Female' │    'March'    │
└─────────┴─────────────┴──────────────┴──────────┴───────────────┘`)



        // Extraversion group 3
        expect( d3.min( sortedGroupedData.get('3.00-3.46'), d=>d.Extraversion ) ).toBe( '3' )
        expect( d3.max( sortedGroupedData.get('3.00-3.46'), d=>d.Extraversion ) ).toBe( '3.45833' )
        expect( sortedGroupedData.get('3.00-3.46') ).toTabulateAs(`\
┌─────────┬─────────────┬──────────────┬──────────┬───────────────┐
│ (index) │ Neuroticism │ Extraversion │  Gender  │ MonthMeasured │
├─────────┼─────────────┼──────────────┼──────────┼───────────────┤
│    0    │  '2.60417'  │   '3.1875'   │  'Male'  │  'February'   │
│    1    │  '3.29167'  │  '3.29167'   │ 'Female' │    'April'    │
│    2    │  '3.02083'  │  '3.29167'   │ 'Female' │     'May'     │
│    3    │  '2.52083'  │  '3.29167'   │  'Male'  │    'June'     │
│    4    │   '2.625'   │  '3.45833'   │  'Male'  │  'November'   │
│    5    │  '3.0625'   │  '3.41667'   │  'Male'  │   'January'   │
│    6    │  '2.58333'  │  '3.02083'   │  'Male'  │    'March'    │
│    7    │  '2.97917'  │   '3.3125'   │  'Male'  │    'April'    │
│    8    │  '3.0625'   │    '3.25'    │  'Male'  │   'August'    │
│    9    │  '2.41667'  │   '3.4375'   │  'Male'  │   'October'   │
│   10    │  '3.22917'  │  '3.20833'   │  'Male'  │     'May'     │
│   11    │  '2.9375'   │   '3.0625'   │  'Male'  │    'July'     │
│   12    │  '3.0625'   │  '3.14583'   │  'Male'  │  'September'  │
│   13    │  '3.02083'  │  '3.20833'   │  'Male'  │  'February'   │
│   14    │  '2.16667'  │  '3.45833'   │  'Male'  │    'March'    │
│   15    │  '2.8125'   │   '3.375'    │  'Male'  │   'August'    │
│   16    │  '3.04167'  │    '3.25'    │  'Male'  │   'October'   │
│   17    │     '3'     │  '3.35417'   │  'Male'  │  'December'   │
│   18    │  '2.77083'  │  '3.33333'   │ 'Female' │  'February'   │
│   19    │  '2.6875'   │  '3.41667'   │ 'Female' │    'April'    │
│   20    │  '3.4375'   │  '3.02083'   │ 'Female' │     'May'     │
│   21    │  '2.85417'  │  '3.29167'   │ 'Female' │    'July'     │
│   22    │  '3.39583'  │     '3'      │ 'Female' │   'August'    │
│   23    │  '3.39583'  │  '3.35417'   │ 'Female' │   'October'   │
│   24    │  '2.58333'  │  '3.35417'   │ 'Female' │  'November'   │
│   25    │  '2.79167'  │  '3.39583'   │ 'Female' │     'May'     │
│   26    │  '2.77083'  │  '3.41667'   │ 'Female' │    'July'     │
│   27    │  '3.10417'  │   '3.375'    │ 'Female' │   'August'    │
│   28    │  '3.19479'  │  '3.45833'   │ 'Female' │  'September'  │
│   29    │  '2.91667'  │   '3.4375'   │ 'Female' │   'October'   │
│   30    │     '3'     │  '3.41667'   │ 'Female' │   'October'   │
│   31    │  '3.79167'  │  '3.02083'   │ 'Female' │  'November'   │
│   32    │  '3.10417'  │  '3.35417'   │ 'Female' │   'January'   │
│   33    │   '3.25'    │  '3.27083'   │ 'Female' │    'April'    │
│   34    │  '3.29167'  │  '3.16667'   │ 'Female' │  'September'  │
│   35    │  '3.14583'  │  '3.29167'   │ 'Female' │   'October'   │
│   36    │  '2.83333'  │   '3.3125'   │ 'Female' │  'December'   │
│   37    │  '2.52083'  │    '3.25'    │ 'Female' │  'February'   │
└─────────┴─────────────┴──────────────┴──────────┴───────────────┘`)

        // Extraversion group 4
        expect( d3.min( sortedGroupedData.get('2.52-2.98'), d=>d.Extraversion ) ).toBe( '2.52083' )
        expect( d3.max( sortedGroupedData.get('2.52-2.98'), d=>d.Extraversion ) ).toBe( '2.97917' )
        expect( sortedGroupedData.get('2.52-2.98') ).toTabulateAs(`\
┌─────────┬─────────────┬──────────────┬──────────┬───────────────┐
│ (index) │ Neuroticism │ Extraversion │  Gender  │ MonthMeasured │
├─────────┼─────────────┼──────────────┼──────────┼───────────────┤
│    0    │  '2.52083'  │  '2.89583'   │  'Male'  │    'March'    │
│    1    │   '3.125'   │  '2.52083'   │  'Male'  │  'February'   │
│    2    │  '3.22917'  │  '2.91667'   │  'Male'  │  'September'  │
│    3    │   '3.875'   │  '2.64583'   │ 'Female' │  'December'   │
│    4    │  '2.87792'  │  '2.97917'   │ 'Female' │    'March'    │
│    5    │  '3.10417'  │    '2.75'    │ 'Female' │    'March'    │
│    6    │  '3.58333'  │  '2.58333'   │ 'Female' │  'September'  │
│    7    │  '3.6875'   │  '2.95833'   │ 'Female' │  'February'   │
│    8    │  '3.70833'  │  '2.77083'   │ 'Female' │    'March'    │
│    9    │  '2.60417'  │  '2.97917'   │ 'Female' │    'July'     │
│   10    │  '2.85417'  │  '2.83333'   │ 'Female' │  'November'   │
└─────────┴─────────────┴──────────────┴──────────┴───────────────┘`)


    })


})


// HELPER FUNCTION(S)

function bin(d3dataset, targetColumnName, numberOfThresholds) {

    const max = d3.max(d3dataset, function(d) { return d[targetColumnName] })
    const min = d3.min(d3dataset, function(d) { return d[targetColumnName] })

    const binnedVariable =
        d3.histogram()
            .value( d => d[targetColumnName]  )
            .thresholds(numberOfThresholds)
            .domain([min, max])
            (d3dataset)

    return binnedVariable

}


function isContinuousData (arrayToBeEvaluated){

    const evaluation = {
        isANumber: 0,
        notANumber: 0
    }

    const dataSample = arrayToBeEvaluated.slice(1,25)

    dataSample.forEach( (sampleValue) => {

        const omittedValues = [true, false]

        const sampleValueIsNotAmongOmittedValues = sampleValue !== omittedValues
        const sampleValueIsConvertibleToANumber = Number(sampleValue)

        if (sampleValueIsNotAmongOmittedValues && sampleValueIsConvertibleToANumber){
            evaluation.isANumber += 1
        }
        else{
            evaluation.notANumber += 1
        }

    })

    return evaluation

}