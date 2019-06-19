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

// D3 //
global.d3 = {
    ...require("../../../external/d3/d3"),
    ...require("../../../external/d3/d3-array")
}


// Lodash //
global._ = require("../../../external/lodash")


// Internal //
global.classUtils = require("../../../utils/classUtils")
global.container = require("../../container")
global.shape = require("../../shape")
global.stringUtils = require("../../../utils/stringUtils")
global.data = require("../../../cpc/data")


//// MODULES BEING TESTED ////
const datasets = require("../../../../data/datasets")
const navigator = require("../../navigator")






//// UNIT TESTS /////////////////////////////////////////////////////////////////////////////////////////////////////////////


//// INSTANTIATE ///

test ('Should instantiate object', () => {

    const myChart = new navigator.Chart()

    expect(myChart).toBeDefined()

})


//// COORDINATES ///

test ('Should get and set coordinates', () => {

    const myChart = new navigator.Chart()

    //// SINGLE METHOD ///

    // x()
    expect(myChart.x(11).x()).toBe(11)
    // y()
    expect(myChart.y(22).y()).toBe(22)

    // x().y()
    myChart.x(33).y(44)
    expect(myChart.x()).toBe(33)
    expect(myChart.y()).toBe(44)

    // y().x()
    myChart.y(55).x(66)
    expect(myChart.y()).toBe(55)
    expect(myChart.x()).toBe(66)

    // INTERACTION WITH OTHER HEIGHT-MODIFYING METHODS //

    // Besides this._y, y() should also update related instance variables,
    // such as this._rangeStart, and this._rangeEnd,
    // as well as this._scaleFunction and this._rangeStack

    myChart.range([300, 200])
    const originalHeight = myChart.height()    // When y is updated, height should stay the same

    myChart.y(0)
    expect(myChart.y()).toBe(0)
    expect(myChart.height()).toBe(originalHeight)   // When y is updated, height should stay the same
    expect(myChart.range()).toEqual([100, 0])   // When y is updated, height should stay the same


    // If y() is first, it should be overridden by a following function that also modifies height
    myChart.y(300).range([100, 50])
    expect(myChart.y()).toEqual(50)
    expect(myChart.range()).toEqual([100, 50])


    // y() should work with complex chains
    myChart.y(200).height(100).range([900, 700]).width(150)
    expect(myChart.height()).toBe(200)
    expect(myChart.y()).toBe(700)
    expect(myChart.range()).toEqual([900, 700])
    expect(myChart.width()).toBe(150)

    myChart.range([10, 0]).y(50)
    expect(myChart.range()).toEqual([60, 50])
    expect(myChart.height()).toBe(10)
    expect(myChart.y()).toBe(50)

    myChart.height(100).y(0)
    expect(myChart.range()).toEqual([100,0])
    expect(myChart.height()).toBe(100)
    expect(myChart.y()).toBe(0)

})


//// WIDTH AND HEIGHT ///

test ('Should get and set width and height correctly in single and chain syntax', () => {

    const myChart = new navigator.Chart()

    // SINGLE METHOD //

    // Get
    expect(myChart.width()).toBe(100)
    expect(myChart._width).toBe(100)

    expect(myChart.height()).toBe(300)
    expect(myChart._height).toBe(300)


    // Set (and then get to see what is set)
    expect(myChart.width(100).width()).toBe(100)
    expect(myChart._width).toBe(100)

    expect(myChart.height(100).height()).toBe(100)
    expect(myChart._height).toBe(100)



    // CHAIN SYNTAX//

    // width().height()
    myChart.width(999).height(111)
    expect(myChart.width()).toBe(999)
    expect(myChart.height()).toBe(111)

    // height().width()
    myChart.height(555).width(444)
    expect(myChart.width()).toBe(444)
    expect(myChart.height()).toBe(555)


    // INTERACTION WITH OTHER HEIGHT-MODIFYING METHODS //

    // Besides this._height, height() should also update related instance variables, such as this._rangeEnd
    myChart.range([400, 0]).height(100)
    expect(myChart.range()).toEqual([100, 0])

    // If height() is first, it should be overridden by a following function that also modifies height
    myChart.height(200).range([500, 0])
    expect(myChart.height()).toBe(500)
    expect(myChart.range()).toEqual([500, 0])

})


//// DOMAIN AND RANGE ///

test ('Should get and set domain correctly in single and chain syntax', () => {

    const myChart = new navigator.Chart()

    // SINGLE METHOD //

    // Get range
    expect(myChart.range()).toEqual([325, 25])

    expect(myChart._rangeStack.data().get('category-1').get('start'))
        .toEqual(325)

    // Set Range
    myChart.range([100, 0])
    expect(myChart.range()).toEqual([100, 0])
    expect(myChart._rangeStart).toBe(100)
    expect(myChart._rangeEnd).toBe(0)



    // REVERSED COORDINATES AS INPUT //

    // Coordinates in correct order
    myChart.range([100, 50])
    expect(myChart.range()).toEqual([100, 50])

    // Coordinates in reversed order; this input should still lead to same result
    myChart.range([50, 100])
    expect(myChart.range()).toEqual([100, 50])



    // INTERACTION WITH OTHER RANGE-MODIFYING METHODS //

    // Besides this._rangeStart and this._rangeEnd, range() should also update related instance variables, such as this._height
    myChart.range([400, 0])
    expect(myChart.height()).toBe(400)
    expect(myChart.y()).toBe(0)

    myChart.range([300, 100])
    expect(myChart.height()).toBe(200)
    expect(myChart.y()).toBe(100)


    // If range() is first, it should be overridden by a following function that also modifies height
    myChart.range([400, 0]).height(100)
    expect(myChart.range()).toEqual([100, 0])


})


//// DATA ////


test ('Should get stack data', () => {

    const myChart = new navigator.Chart()

    expect(myChart.stack().size).toBe(3)

})


test ('Should query the stack data', () => {

    const myChart = new navigator.Chart()

    // Get first, query later manually
    expect(myChart.stack().get('category-1').get('label'))
        .toBe('Category One')

    // Directly query by giving a parameter to to method
    expect(myChart.stack('category-1').get('label'))
        .toBe('Category One')


})


test ('Should update stack data and also the related instance variables', () => {

    const myChart = new navigator.Chart()

    // Check original data
    expect(myChart._domainStack.data('category-1').get('label'))
        .toBe('Category One')
    expect(myChart._rangeStack.data('category-1').get('label'))
        .toBe('Category One')


    // Update data in stack
    const myStack = new data.Stack()
    myStack.populateWithExampleData('gender')

    myChart.stack(myStack)

    // Probe to see if data is correctly updated
    expect(myChart.stack().size).toBe(2)

    expect(myChart.stack().get('female').get('label'))
        .toBe('Female')
    expect(myChart.stack('female').get('start'))
        .toBe(64)
    expect(myChart.stack('female').get('end'))
        .toBe(100)

    expect(myChart.stack('male').get('label'))
        .toBe('Male')
    expect(myChart.stack('male').get('start'))
        .toBe(0)
    expect(myChart.stack('male').get('end'))
        .toBe(64)


    // Do a manual check on the updated private stack variable in the instance
    expect(myChart._domainStack.data().size).toBe(2)
    expect(myChart._domainStack.data().get('female').get('label'))
        .toBe('Female')

    // Check if domain min and domain max are updated
    expect(myChart._domainMax).toBe(100)
    expect(myChart._domainMin).toBe(0)

    // Check if scale function is updated
    expect(myChart._scaleFunction.domain()).toEqual([0,100])

    // Check if range stack is updated
    expect(myChart._rangeStack.data('female').get('label')).toBe('Female')


})