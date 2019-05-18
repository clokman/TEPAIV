//// IMPORTS /////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Import fetch
if (typeof fetch !== 'function') {
    global.fetch =  require('../node_modules/node-fetch-polyfill/')
}

if (typeof Object.fromEntries !== 'function') {
    Object.fromEntries = require('object.fromentries')
}


// global.d3 = require('d3')

global.d3 = {
    ...require("../libraries/external/d3/d3"),
    ...require("../libraries/external/d3/d3-array")
}

const datasets = require("../data/datasets")
let CPC = require("../libraries/Cpc")
CPC = CPC.CPC


//// BASIC TESTS /////////////////////////////////////////////////////////////////////////////////////////////////////////////


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

test('Titanic dataset should import and d3.parse should work.', () => {

    expect(datasets.titanic[0])
    .toEqual({"Gender": "Female", "Name": "Allen, Miss. Elisabeth Walton", "Status": "Survived", "Ticket": "First class"})

    expect(datasets.titanic).toHaveLength(1114)
})


const dataset = datasets.titanic
    , ignoredColumns = ['Name']
    , svgContainerWidth = 600
    , svgContainerHeight = 450
    , padding = 8
    , panelBackgroundPadding = 8
    , barHeight = 110
    , preferences = ['drawContextAsBackground']
// ['absoluteRectangleWidths','drawContextAsBackground', drawContextAsForeground]
// NOTE: The order in this parameter array does not matter, as this array is
// scanned with array.includes() method)


test('CPC should initialize with properties', () => {

        const cpc = new CPC(
            dataset,
            ignoredColumns,
            svgContainerWidth,
            svgContainerHeight,
            padding,
            panelBackgroundPadding,
            barHeight,
            ['drawContextAsBackground']
        )

        expect(cpc).toBeDefined()
        expect(cpc).toBeInstanceOf(CPC)
        expect(cpc).toHaveProperty('_dataset')
        expect(cpc).toHaveProperty('_frontColorScales')
        expect(cpc).toHaveProperty('_rectangleColorRegistry')
        expect(cpc).toHaveProperty('_svg')
        expect(cpc).toHaveProperty('_svgContainerWidth')
        expect(cpc).toHaveProperty('_svgContainerHeight')

})