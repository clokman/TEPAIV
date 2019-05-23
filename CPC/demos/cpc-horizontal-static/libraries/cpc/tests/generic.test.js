//// IMPORTS /////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Import polyfill for fetch() method
if (typeof fetch !== 'function') {
    global.fetch =  require('node-fetch-polyfill')
}

// Import polyfill for Object.fromEntries() method
if (typeof Object.fromEntries !== 'function') {
    Object.fromEntries = require('object.fromentries')
}

global.d3 = {
    ...require("../../external/d3/d3"),
    ...require("../../external/d3/d3-array")
}

const datasets = require("../../../data/datasets")





//// IMPORTING D3 /////////////////////////////////////////////////////////////////////////////////////////////////////////////


test('Different D3 modules should import OK', () => {

    // A method from d3.js
    const rangeTen = d3.range(10)
    expect(rangeTen).toHaveLength(10)

    // A method from d3-array.js
    const minimum = d3.max([10,20])
    expect(minimum).toBe(20)

    // Another method from d3-array.js
    const rollupResult = d3.rollup(datasets.titanic, v=>v.length)
    expect(rollupResult).toBe(1114)

})