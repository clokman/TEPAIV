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
global.str = require("../../str")
global.data = require("../../../cpc/data")


//// MODULES BEING TESTED ////
const datasets = require("../../../../data/datasets")
const navigator = require("../../navigator")






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
    expect(myCategory._textObject.text()).toBe('10%')

    expect(myCategory.percentage(20).percentage()).toBe(20)
    expect(myCategory._textObject.text()).toBe('20%')


    // Chain syntax
    expect(myCategory.x(111).percentage(30).percentage()).toBe(30)
    expect(myCategory._textObject.text()).toBe('30%')


    expect(myCategory.percentage(40).y(222).percentage()).toBe(40)
    expect(myCategory._textObject.text()).toBe('40%')


})



//// PERCENTAGE TEXT COLOR ///

test ('Should get and set percentage text fill color using single and chain syntax', () => {

    const myCategory = new navigator.Category()

    // Single method
    expect(myCategory.textFill('green').textFill()).toBe('green')
    expect(myCategory.textFill('red').textFill()).toBe('red')

    // Chain syntax
    expect(myCategory.x(111).textFill('red').textFill()).toBe('red')
    expect(myCategory.textFill('blue').y(222).textFill()).toBe('blue')

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
