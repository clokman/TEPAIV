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
    ...require("../../external/d3/d3"),
    ...require("../../external/d3/d3-array")
}


// Lodash //
global._ = require("../../external/lodash")


// Internal //
global.shape = require("../shape")
global.str = require("../str")
global.data = require("../../cpc/data")
global.container = require("../container")


//// MODULES BEING TESTED ////
const datasets = require("../../../data/datasets")
const navigator = require("../navigator")






//// PANEL /////////////////////////////////////////////////////////////////////////////////////////////////////////////

//// INSTANTIATE ///

test ('Should instantiate object', () => {

    const svg = new container.Svg()
    const myPanel = new navigator.Panel()

    expect(myPanel).toBeDefined()

})


//// SAMPLE DATA ////

test ('Should initialize with sample data', () => {

    parentContainerSelection = d3.select('body')
        .append("svg")
        .attr("width", 1280)
        .attr("height", 1024)

    const myPanel = new navigator.Panel(parentContainerSelection)

    // Probe the initial sample data
    expect(myPanel._data.size).toBe(3)
    expect(myPanel._data.get('gender').data().get('male').get('label')).toEqual('Male')
    expect(myPanel._data.get('status').data().get('category-3').get('label')).toEqual('Category Three')
    expect(myPanel._data.get('class').data().get('category-2').get('percentage')).toEqual(33)


    // Check if data stats are being calculated correctly
    expect(myPanel._noOfCharts).toBe(3)
})






//// CHART /////////////////////////////////////////////////////////////////////////////////////////////////////////////


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
    expect(myChart.width()).toBe(75)
    expect(myChart._width).toBe(75)

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
    expect(myChart.range()).toEqual([320, 20])

    expect(myChart._rangeStack.data().get('category-1').get('start'))
        .toEqual(320)

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
        .toBe(33)
    expect(myChart.stack('female').get('end'))
        .toBe(100)

    expect(myChart.stack('male').get('label'))
        .toBe('Male')
    expect(myChart.stack('male').get('start'))
        .toBe(0)
    expect(myChart.stack('male').get('end'))
        .toBe(33)


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



//// CATEGORY /////////////////////////////////////////////////////////////////////////////////////////////////////////////


//// INSTANTIATE ///

test ('Should instantiate a Category class object', () => {

    const myCategory = new navigator.Category()

    expect(myCategory).toBeDefined()

})


//// COORDINATES ///

test ('Should get and set coordinates', () => {

    const myCategory = new navigator.Category()

    // SINGLE METHOD //

    // x()
    expect(myCategory.x(11).x()).toBe(11)
    // y()
    expect(myCategory.y(22).y()).toBe(22)

    // x().y()
    myCategory.x(33).y(44)
    expect(myCategory.x()).toBe(33)
    expect(myCategory.y()).toBe(44)

    // y().x()
    myCategory.y(55).x(66)
    expect(myCategory.y()).toBe(55)
    expect(myCategory.x()).toBe(66)

})



//// FILL ///

test ('Should get and set fill color using single and chain syntax', () => {

    const myCategory = new navigator.Category()

    // Single method
    expect(myCategory.fill('green').fill()).toBe('green')
    expect(myCategory.fill('red').fill()).toBe('red')

    // Chain syntax
    expect(myCategory.x(111).fill('red').fill()).toBe('red')
    expect(myCategory.fill('blue').y(222).fill()).toBe('blue')


})


//// PERCENTAGE VALUE & PERCENTAGE TEXT ///

test ('Should get and set percentage using single and chain syntax', () => {

    const myCategory = new navigator.Category()

    // Single method
    expect(myCategory.percentage(10).percentage()).toBe(10)
    expect(myCategory._percentageTextObject.text()).toBe('10%')

    expect(myCategory.percentage(20).percentage()).toBe(20)
    expect(myCategory._percentageTextObject.text()).toBe('20%')


    // Chain syntax
    expect(myCategory.x(111).percentage(30).percentage()).toBe(30)
    expect(myCategory._percentageTextObject.text()).toBe('30%')


    expect(myCategory.percentage(40).y(222).percentage()).toBe(40)
    expect(myCategory._percentageTextObject.text()).toBe('40%')


})



//// PERCENTAGE TEXT COLOR ///

test ('Should get and set percentage text fill color using single and chain syntax', () => {

    const myCategory = new navigator.Category()

    // Single method
    expect(myCategory.percentageTextFill('green').percentageTextFill()).toBe('green')
    expect(myCategory.percentageTextFill('red').percentageTextFill()).toBe('red')

    // Chain syntax
    expect(myCategory.x(111).percentageTextFill('red').percentageTextFill()).toBe('red')
    expect(myCategory.percentageTextFill('blue').y(222).percentageTextFill()).toBe('blue')


})


//// CLASS ///

test ('Should get and set parent group class of the category using single and chain syntax', () => {

    const myCategory = new navigator.Category()


    // SINGLE METHOD //

    // Class
    expect(myCategory.class()).toBe(null)
    // expect(myCategory.class('class-1').class()).toBe('class-1')

    // ID
    expect(myCategory.id()).toBe(null)
    expect(myCategory.id('id-1').id()).toBe('id-1')



    // CHAIN SYNTAX //

    // ID and Class
    myCategory.class('M').id('Earth')
    expect(myCategory.class()).toBe('M')
    expect(myCategory.id()).toBe('Earth')


    // ID and Class with other methods
    myCategory.x(8888).class('M').id('Vulcan').y(9999)
    expect(myCategory.class()).toBe('M')
    expect(myCategory.id()).toBe('Vulcan')
    expect(myCategory.x()).toBe(8888)
    expect(myCategory.y()).toBe(9999)

})

