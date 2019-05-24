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

global.d3 = {
    ...require("../../external/d3/d3"),
    ...require("../../external/d3/d3-array")
}

global.shape = require("../shape")
global.str = require("../str")
global.data = require("../../cpc/data")
global.container = require("../container")


//// MODULES BEING TESTED ////
const datasets = require("../../../data/datasets")
const navigator = require("../navigator")






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

})


//// WIDTH AND HEIGHT ///

test ('Should get and set width and height correctly in single and chain syntax', () => {

    const myChart = new navigator.Chart()

    //// SINGLE METHOD ////

    // Get
    expect(myChart.width()).toBe(75)
    expect(myChart.height()).toBe(300)

    // Set (and then get to see what is set)
    expect(myChart.width(100).width()).toBe(100)
    expect(myChart.height(100).height()).toBe(100)


    //// CHAIN SYNTAX////

    // width().height()
    myChart.width(999).height(111)
    expect(myChart.width()).toBe(999)
    expect(myChart.height()).toBe(111)

    // height().width()
    myChart.height(555).width(444)
    expect(myChart.width()).toBe(444)
    expect(myChart.height()).toBe(555)
})



//// DOMAIN AND RANGE ///

test ('Should get and set domain correctly in single and chain syntax', () => {

    const myChart = new navigator.Chart()

    //// SINGLE METHOD ////

    // Get range
    expect(myChart.range()).toEqual([320, 20])
    expect(myChart._scaledStack.data().get('category-1').get('start')).toEqual(320)

    //// Set Range
    expect(myChart.range([100, 0]).range()).toEqual([100, 0])


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

    //// SINGLE METHOD ///

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
    expect(myCategory._percentageText.text()).toBe('10%')

    expect(myCategory.percentage(20).percentage()).toBe(20)
    expect(myCategory._percentageText.text()).toBe('20%')


    // Chain syntax
    expect(myCategory.x(111).percentage(30).percentage()).toBe(30)
    expect(myCategory._percentageText.text()).toBe('30%')


    expect(myCategory.percentage(40).y(222).percentage()).toBe(40)
    expect(myCategory._percentageText.text()).toBe('40%')


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
