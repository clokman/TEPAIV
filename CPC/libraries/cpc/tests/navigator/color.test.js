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


//// NODE-ONLY DEPENDENCIES ////
require("../../../../../JestUtils/jest-console")
require("../../../../../JestUtils/jest-dom")


//// UMD DEPENDENCIES ////

// D3 //
global.d3 = {
    ...require("../../../external/d3/d3"),
    ...require("../../../external/d3/d3-array")
}
// Disable d3 transitions
d3.selection.prototype.transition = jest.fn( function(){return this} )
d3.selection.prototype.duration = jest.fn( function(){return this} )

// Lodash //
global._ = require("../../../external/lodash")

// JQuery //
global.$ = require("../../../external/jquery-3.1.1.min")


// EXTENSIONS //
require("../../../utils/errorUtils"),
require("../../../utils/jsUtils"),
require("../../../utils/mapUtils")

// FUNCTIONAL UTILS //
global.__ = {
    ...require("../../../utils/arrayUtils"),
    ...require("../../../utils/classUtils"),
    ...require("../../../utils/domUtils"),
    ...require("../../../utils/stringUtils")
}

// TODO: Three imports below are obsolete and should be removed. Utils is now imported with __.
global.classUtils = require("../../../utils/classUtils")
global.arrayUtils = require("../../../utils/arrayUtils")
global.stringUtils = require("../../../utils/stringUtils")

global.container = require("../../container")
global.shape = require("../../shape")
global.data = require("../../../cpc/data")
global.dataset = require("../../../cpc/dataset")


//// MODULE(S) BEING TESTED ////
const navigator = require("../../navigator")





//// TESTS /////////////////////////////////////////////////////////////////////////////////////////////////////////////

//// INIITALIZATION ////

test ('LIST: List scheme sets and the schemes they contain', () => {

    expect( navigator.color ).toBeDefined()
    expect( navigator.color.schemeSets ).toTabulateAs(`\
┌─────────┬──────────────┬────────────────────────────────────────────────────┐
│ (index) │      0       │                         1                          │
├─────────┼──────────────┼────────────────────────────────────────────────────┤
│    0    │ 'Single-Hue' │ [ 'Purples', 'Blues', 'Greens', ... 3 more items ] │
│    1    │ 'Multi-Hue'  │    [ 'RdPu', 'BuPu', 'PuBu', ... 9 more items ]    │
│    2    │   'Blues'    │                    [ 'Blues' ]                     │
│    3    │   'Greens'   │                    [ 'Greens' ]                    │
│    4    │   'Greys'    │                    [ 'Greys' ]                     │
│    5    │  'Oranges'   │                   [ 'Oranges' ]                    │
│    6    │  'Purples'   │                   [ 'Purples' ]                    │
│    7    │    'Reds'    │                     [ 'Reds' ]                     │
│    8    │    'BuGn'    │                     [ 'BuGn' ]                     │
│    9    │    'BuPu'    │                     [ 'BuPu' ]                     │
└─────────┴──────────────┴────────────────────────────────────────────────────┘
˅˅˅ NaN more rows`, 0, 10)

})





//// CIRCULAR INDEXING ////

test ('CIRCULAR INDEXING: Circular scheme indexing and iteration', () => {

    // View color scheme sets
    expect( navigator.color.schemeSets ).toTabulateAs(`\
┌───────────────────┬────────────────────┬────────────────────────────────────────────────────┐
│ (iteration index) │        Key         │                       Values                       │
├───────────────────┼────────────────────┼────────────────────────────────────────────────────┤
│         0         │    'Single-Hue'    │ [ 'Purples', 'Blues', 'Greens', ... 3 more items ] │
│         1         │    'Multi-Hue'     │    [ 'RdPu', 'BuPu', 'PuBu', ... 9 more items ]    │
│         2         │      'Blues'       │                    [ 'Blues' ]                     │
│         3         │      'Greens'      │                    [ 'Greens' ]                    │
│         4         │      'Greys'       │                    [ 'Greys' ]                     │
│         5         │     'Oranges'      │                   [ 'Oranges' ]                    │
│         6         │     'Purples'      │                   [ 'Purples' ]                    │
│         7         │       'Reds'       │                     [ 'Reds' ]                     │
│         8         │       'BuGn'       │                     [ 'BuGn' ]                     │
│         9         │       'BuPu'       │                     [ 'BuPu' ]                     │
│        10         │       'GnBu'       │                     [ 'GnBu' ]                     │
│        11         │       'OrRd'       │                     [ 'OrRd' ]                     │
│        12         │      'PuBuGn'      │                    [ 'PuBuGn' ]                    │
│        13         │       'PuBu'       │                     [ 'PuBu' ]                     │
│        14         │       'PuRd'       │                     [ 'PuRd' ]                     │
│        15         │       'RdPu'       │                     [ 'RdPu' ]                     │
│        16         │      'YlGnBu'      │                    [ 'YlGnBu' ]                    │
│        17         │       'YlGn'       │                     [ 'YlGn' ]                     │
│        18         │      'YlOrBr'      │                    [ 'YlOrBr' ]                    │
│        19         │      'YlOrRd'      │                    [ 'YlOrRd' ]                    │
│        20         │     'Viridis'      │                   [ 'Viridis' ]                    │
│        21         │     'Inferno'      │                   [ 'Inferno' ]                    │
│        22         │      'Magma'       │                    [ 'Magma' ]                     │
│        23         │       'Warm'       │                     [ 'Warm' ]                     │
│        24         │       'Cool'       │                     [ 'Cool' ]                     │
│        25         │ 'CubehelixDefault' │               [ 'CubehelixDefault' ]               │
│        26         │      'Plasma'      │                    [ 'Plasma' ]                    │
└───────────────────┴────────────────────┴────────────────────────────────────────────────────┘`)

    // Retrieve some color scheme names by index
    const firstSchemeOfSingleHueTheme = navigator.color.getChartSchemeBySchemeSetNameAndCircularIndex('Single-Hue', 0)
    expect(firstSchemeOfSingleHueTheme).toBe('Purples')

    const thirdSchemeOfSingleHueTheme = navigator.color.getChartSchemeBySchemeSetNameAndCircularIndex('Single-Hue', 2)
    expect(thirdSchemeOfSingleHueTheme).toBe('Greens')


    // Iterate through the schemes in a scheme set
    const schemeNamesInSingleHueSet = []

    const noOfSchemesInSingleHueSchemeSet = navigator.color.schemeSets.get('Single-Hue').length
    const limit = noOfSchemesInSingleHueSchemeSet + 5  // addition is to test circular indexing (index should be out of range)
    d3.range(limit).forEach(i => {
        const schemeName = navigator.color.getChartSchemeBySchemeSetNameAndCircularIndex('Single-Hue', i)
        schemeNamesInSingleHueSet.push(schemeName)

    })

    expect(schemeNamesInSingleHueSet).toTabulateAs(`\
┌─────────┬───────────┐
│ (index) │  Values   │
├─────────┼───────────┤
│    0    │ 'Purples' │
│    1    │  'Blues'  │
│    2    │ 'Greens'  │
│    3    │ 'Oranges' │
│    4    │  'Greys'  │
│    5    │  'Reds'   │
│    6    │ 'Purples' │
│    7    │  'Blues'  │
│    8    │ 'Greens'  │
│    9    │ 'Oranges' │
│   10    │  'Greys'  │
└─────────┴───────────┘`)  // repetition is not an error; it shows that circular indexing works

})




//// SCHEME NAME ==> D3 INTERPOLATOR ARGUMENT STRING ////

test ('MAKE D3 ARGUMENT: Convert scheme name to D3 interpolator argument string', () => {

    // Iterate through the schemes in a scheme set
    const schemeNamesInSingleHueSet = []

    const noOfSchemesInSingleHueSchemeSet = navigator.color.schemeSets.get('Single-Hue').length
    const limit = noOfSchemesInSingleHueSchemeSet + 5  // addition is to test circular indexing (index should be out of range)
    d3.range(limit).forEach(i => {
        const schemeName = navigator.color.getChartSchemeBySchemeSetNameAndCircularIndex('Single-Hue', i)
        schemeNamesInSingleHueSet.push(schemeName)

    })

    expect(schemeNamesInSingleHueSet).toTabulateAs(`\
┌─────────┬───────────┐
│ (index) │  Values   │
├─────────┼───────────┤
│    0    │ 'Purples' │
│    1    │  'Blues'  │
│    2    │ 'Greens'  │
│    3    │ 'Oranges' │
│    4    │  'Greys'  │
│    5    │  'Reds'   │
│    6    │ 'Purples' │
│    7    │  'Blues'  │
│    8    │ 'Greens'  │
│    9    │ 'Oranges' │
│   10    │  'Greys'  │
└─────────┴───────────┘`)  // repetition is not an error; it shows that circular indexing works


    // Convert scheme names to D3 interpolator arguments
    const interpolatorArgumentsForSingleHueSchemes = []
    schemeNamesInSingleHueSet.forEach( schemeName => {
        interpolatorArgument = navigator.color.convertColorSchemeNameToD3InterpolatorArgument(schemeName)
        interpolatorArgumentsForSingleHueSchemes.push(interpolatorArgument)
    })

    expect(interpolatorArgumentsForSingleHueSchemes).toTabulateAs(`\
┌─────────┬─────────────────────────┐
│ (index) │         Values          │
├─────────┼─────────────────────────┤
│    0    │ 'd3.interpolatePurples' │
│    1    │  'd3.interpolateBlues'  │
│    2    │ 'd3.interpolateGreens'  │
│    3    │ 'd3.interpolateOranges' │
│    4    │  'd3.interpolateGreys'  │
│    5    │  'd3.interpolateReds'   │
│    6    │ 'd3.interpolatePurples' │
│    7    │  'd3.interpolateBlues'  │
│    8    │ 'd3.interpolateGreens'  │
│    9    │ 'd3.interpolateOranges' │
│   10    │  'd3.interpolateGreys'  │
└─────────┴─────────────────────────┘`)  // repetition is not an error; it is a result of circular indexing

    const exampleColorScale = d3.scaleSequential()
        .domain([1, 10])  // palette size
        .interpolator(eval(interpolatorArgumentsForSingleHueSchemes[0]))  // palette

    // Values inside the domain are hue values that can be referred to in this way:
    expect(exampleColorScale(1)).toBe('rgb(252, 251, 253)') // full white
    expect(exampleColorScale(7)).toBe('rgb(121, 110, 178)') // hue step

})




//// ERRORS ////

test ('WRONG SCHEME SET REQUESTED: Wrong scheme set name during circular indexing should return error', () => {

    // Initialize

    // View color themes
    expect( navigator.color.schemeSets ).toTabulateAs(`\
┌─────────┬──────────────┬────────────────────────────────────────────────────┐
│ (index) │      0       │                         1                          │
├─────────┼──────────────┼────────────────────────────────────────────────────┤
│    0    │ 'Single-Hue' │ [ 'Purples', 'Blues', 'Greens', ... 3 more items ] │
│    1    │ 'Multi-Hue'  │    [ 'RdPu', 'BuPu', 'PuBu', ... 9 more items ]    │
│    2    │   'Blues'    │                    [ 'Blues' ]                     │
│    3    │   'Greens'   │                    [ 'Greens' ]                    │
│    4    │   'Greys'    │                    [ 'Greys' ]                     │
│    5    │  'Oranges'   │                   [ 'Oranges' ]                    │
│    6    │  'Purples'   │                   [ 'Purples' ]                    │
│    7    │    'Reds'    │                     [ 'Reds' ]                     │
└─────────┴──────────────┴────────────────────────────────────────────────────┘
˅˅˅ NaN more rows`, 0, 8)

    // Retrieve some color scheme names by index
    const firstSchemeOfSingleHueTheme = navigator.color.getChartSchemeBySchemeSetNameAndCircularIndex('Single-Hue', 0)
    expect(firstSchemeOfSingleHueTheme).toBe('Purples')

    expect( () => {
        navigator.color.getChartSchemeBySchemeSetNameAndCircularIndex('WRONG-THEME-NAME', 0)
    }).toThrow("'WRONG-THEME-NAME' is not as valid value. Expected values are: 'Single-Hue, Multi-Hue, Blues, Greens, Greys, Oranges, Purples, Reds, BuGn, BuPu, GnBu, OrRd, PuBuGn, PuBu, PuRd, RdPu, YlGnBu, YlGn, YlOrBr, YlOrRd, Viridis, Inferno, Magma, Warm, Cool, CubehelixDefault, Plasma'.")

    expect( () => {
        navigator.color.getChartSchemeBySchemeSetNameAndCircularIndex('Grays', 0)
    }).toThrow("'Grays' is not as valid value. Expected values are: 'Single-Hue, Multi-Hue, Blues, Greens, Greys, Oranges, Purples, Reds, BuGn, BuPu, GnBu, OrRd, PuBuGn, PuBu, PuRd, RdPu, YlGnBu, YlGn, YlOrBr, YlOrRd, Viridis, Inferno, Magma, Warm, Cool, CubehelixDefault, Plasma'.") // Should be 'Greys', not 'Gray'

    expect( () => {
        navigator.color.getChartSchemeBySchemeSetNameAndCircularIndex('greys', 0)
    }).toThrow("'greys' is not as valid value. Expected values are: 'Single-Hue, Multi-Hue, Blues, Greens, Greys, Oranges, Purples, Reds, BuGn, BuPu, GnBu, OrRd, PuBuGn, PuBu, PuRd, RdPu, YlGnBu, YlGn, YlOrBr, YlOrRd, Viridis, Inferno, Magma, Warm, Cool, CubehelixDefault, Plasma'.") // Should be 'Greys', not 'grey'
})


