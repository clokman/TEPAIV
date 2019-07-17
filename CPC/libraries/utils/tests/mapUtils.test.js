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


//// PURE NODE DEPENDENCIES ////
require('../../../../JestUtils/jest-console')


//// UMD DEPENDENCIES ////
global.d3 = {
    ...require("../../external/d3/d3"),
    ...require("../../external/d3/d3-array")
}


//// MODULE BEING TESTED IN CURRENT FILE ////
require("../mapUtils")




//// TESTS /////////////////////////////////////////////////////////////////////////////////////////////////////////////



test ('Sort keys of one map to match the order of keys in another map (map size: 2)', () => {

    templateMap = new Map([ ['Male', '0'],['Female', '1' ] ])

    unsortedTargetMap =  new Map([ ['Female', '1'],['Male', '0'] ])
    expectTable(unsortedTargetMap, `\
┌───────────────────┬──────────┬────────┐
│ (iteration index) │   Key    │ Values │
├───────────────────┼──────────┼────────┤
│         0         │ 'Female' │  '1'   │
│         1         │  'Male'  │  '0'   │
└───────────────────┴──────────┴────────┘`)

    const sortedTargetMap = unsortedTargetMap.sortAccordingTo(templateMap)
    expectTable(sortedTargetMap, `\
┌───────────────────┬──────────┬────────┐
│ (iteration index) │   Key    │ Values │
├───────────────────┼──────────┼────────┤
│         0         │  'Male'  │  '0'   │
│         1         │ 'Female' │  '1'   │
└───────────────────┴──────────┴────────┘`)

})


test ('Sort keys of one map to match the order of keys in another map (map size: 3)', () => {

    templateMap = new Map([ ['1st class', '0'], ['2nd class', '0' ], ['3rd class', '0'] , ['4th class', '0'] ])

    unsortedTargetMap =  new Map([ ['3rd class', '3'], ['1st class', '1' ], ['2nd class', '2'], ['4th class', '4'] ])
    expectTable(unsortedTargetMap, `\
┌───────────────────┬─────────────┬────────┐
│ (iteration index) │     Key     │ Values │
├───────────────────┼─────────────┼────────┤
│         0         │ '3rd class' │  '3'   │
│         1         │ '1st class' │  '1'   │
│         2         │ '2nd class' │  '2'   │
│         3         │ '4th class' │  '4'   │
└───────────────────┴─────────────┴────────┘`)

    const sortedTargetMap = unsortedTargetMap.sortAccordingTo(templateMap)
    expectTable(sortedTargetMap, `\
┌───────────────────┬─────────────┬────────┐
│ (iteration index) │     Key     │ Values │
├───────────────────┼─────────────┼────────┤
│         0         │ '1st class' │  '1'   │
│         1         │ '2nd class' │  '2'   │
│         2         │ '3rd class' │  '3'   │
│         3         │ '4th class' │  '4'   │
└───────────────────┴─────────────┴────────┘`)

})


test ('Sort keys in presence of missing data: Half of map is not present in the target', () => {


    templateMap = new Map([ ['1st class', '0'], ['2nd class', '0' ], ['3rd class', '0'] , ['4th class', '0'] ])

    unsortedTargetMap =  new Map([ ['2nd class', '2'], ['1st class', '1'] ])
    expectTable(unsortedTargetMap, `\
┌───────────────────┬─────────────┬────────┐
│ (iteration index) │     Key     │ Values │
├───────────────────┼─────────────┼────────┤
│         0         │ '2nd class' │  '2'   │
│         1         │ '1st class' │  '1'   │
└───────────────────┴─────────────┴────────┘`)

    const sortedTargetMap = unsortedTargetMap.sortAccordingTo(templateMap)
    expectTable(sortedTargetMap, `\
┌───────────────────┬─────────────┬────────┐
│ (iteration index) │     Key     │ Values │
├───────────────────┼─────────────┼────────┤
│         0         │ '1st class' │  '1'   │
│         1         │ '2nd class' │  '2'   │
└───────────────────┴─────────────┴────────┘`)



})




test ('Sort keys in presence of missing data: Only one element is present in the target', () => {


    templateMap = new Map([ ['1st class', '0'], ['2nd class', '0' ], ['3rd class', '0'] , ['4th class', '0'] ])

    unsortedTargetMap =  new Map([ ['2nd class', '2'] ])
    expectTable(unsortedTargetMap, `\
┌───────────────────┬─────────────┬────────┐
│ (iteration index) │     Key     │ Values │
├───────────────────┼─────────────┼────────┤
│         0         │ '2nd class' │  '2'   │
└───────────────────┴─────────────┴────────┘`)

    const sortedTargetMap = unsortedTargetMap.sortAccordingTo(templateMap)
    expectTable(sortedTargetMap, `\
┌───────────────────┬─────────────┬────────┐
│ (iteration index) │     Key     │ Values │
├───────────────────┼─────────────┼────────┤
│         0         │ '2nd class' │  '2'   │
└───────────────────┴─────────────┴────────┘`)



})