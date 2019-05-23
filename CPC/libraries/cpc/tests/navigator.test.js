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

global.svg = require("../svg")
global.str = require("../str")
global.data = require("../../cpc/data")

const datasets = require("../../../data/datasets")
const navigator = require("../navigator")



//// CONTAINER /////////////////////////////////////////////////////////////////////////////////////////////////////////////



//// INITIALIZATION ////

test ('Should instantiate object', () => {

    // Create a svg object that that the container can exist in
    const mySvg = new svg.Svg(111, 222)
        , parentSelection = d3.select('body').select('svg')

    const myContainer = new svg.Container(parentSelection)
    expect(myContainer).toBeDefined()

})


//// CLASS AND ID ///

test ('Should get and set class and ID with single and chain syntax', () => {

    // Create a svg object that that the container can exist in
    const mySvg = new svg.Svg(111, 222)
        , parentSelection = d3.select('body').select('svg')

    const myContainer = new svg.Container(parentSelection)


    //// SINGLE METHOD ///

    // Class
    expect(myContainer.class()).toBe(null)
    expect(myContainer.class('class-1').class()).toBe('class-1')

    // ID
    expect(myContainer.id()).toBe(null)
    expect(myContainer.id('id-1').id()).toBe('id-1')



    //// CHAIN SYNTAX ////

    // ID and Class
    myContainer.class('M').id('Earth')
    expect(myContainer.class()).toBe('M')
    expect(myContainer.id()).toBe('Earth')

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

})


//// WIDTH AND HEIGHT ///

test ('Should get and set rectangle width and height correctly in single and chain syntax', () => {

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






//// SVG /////////////////////////////////////////////////////////////////////////////////////////////////////////////


//// INSTANTIATE ///

test ('Should instantiate object', () => {

    const mySvg = new svg.Svg()

    expect(mySvg).toBeDefined()

})


test ('Should get and set Svg width and height correctly in single and chain syntax', () => {

    const mySvg = new svg.Svg()

    mySvg.width(111)
         .height(222)

    //// SINGLE METHOD ////

    // Get
    expect(mySvg.width()).toBe(111)
    expect(mySvg.height()).toBe(222)

    // Set (and then get to see what is set)
    expect(mySvg.width(11).width()).toBe(11)
    expect(mySvg.height(22).height()).toBe(22)


    //// CHAIN SYNTAX////

    // width().height()
    mySvg.width(33).height(44)
    expect(mySvg.width()).toBe(33)
    expect(mySvg.height()).toBe(44)

    // height().width()
    mySvg.height(888).width(999)
    expect(mySvg.width()).toBe(999)
    expect(mySvg.height()).toBe(888)


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






//// TEXT /////////////////////////////////////////////////////////////////////////////////////////////////////////////

test ('Should instantiate a Text class object', () => {

    const myText = new svg.Text()

    expect(myText).toBeDefined()

})


// TODO: DOM testing incorporated to tests
// test ('Should update attributes of a text object on DOM', () => {
//
//     d3.select('body').selectAll('svg').remove()
//     const mySvg = new svg.Svg(500, 500)
//     const myText = new svg.Text()
//
//     myText.x(200).fill('blue').id('Earth').y(10).class('M').text('You are here').update(0)
//
//     expect(d3.select('body').select('svg').select('#Earth')).toBe('10')
//     // expect(d3.select('body').select('svg').select('#Earth').attr('y')).toBe('10')
//
//
// })


test ('Should get and set text', () => {

    const myText = new svg.Text()

    //// SINGLE METHOD ///
    expect(myText.text()).toBe('Text')
    expect(myText.text('my text').text()).toBe('my text')
})


test ('Should get and set coordinates', () => {

    const myText = new svg.Text()

    //// SINGLE METHOD ///

    // x()
    expect(myText.x(11).x()).toBe(11)
    // y()
    expect(myText.y(22).y()).toBe(22)

    // x().y()
    myText.x(33).y(44)
    expect(myText.x()).toBe(33)
    expect(myText.y()).toBe(44)

    // y().x()
    myText.y(55).x(66)
    expect(myText.y()).toBe(55)
    expect(myText.x()).toBe(66)

})


//// FILL ///

test ('Should get and set fill color using single and chain syntax', () => {

    const myText = new svg.Text()

    // Single method
    expect(myText.fill('green').fill()).toBe('green')
    expect(myText.fill('red').fill()).toBe('red')

    // Chain syntax
    expect(myText.x(111).fill('red').fill()).toBe('red')
    expect(myText.fill('blue').y(222).fill()).toBe('blue')


})


// TEXT ANCHOR ///

test ('Should get and set anchor using single and chain syntax', () => {

    const myText = new svg.Text()

    // Single method
    expect(myText.textAnchor('middle').textAnchor()).toBe('middle')
    expect(myText.textAnchor('start').textAnchor()).toBe('start')

    // Chain syntax
    expect(myText.x(111).textAnchor('end').textAnchor()).toBe('end')
    expect(myText.textAnchor('middle').y(222).textAnchor()).toBe('middle')


})


//// FONT SIZE ///

test ('Should get and set fill color using single and chain syntax', () => {

    const myText = new svg.Text()

    // Single method
    expect(myText.textAnchor('green').textAnchor()).toBe('green')
    expect(myText.textAnchor('red').textAnchor()).toBe('red')

    // Chain syntax
    expect(myText.x(111).textAnchor('red').textAnchor()).toBe('red')
    expect(myText.textAnchor('blue').y(222).textAnchor()).toBe('blue')

})


//// CLASS AND ID ///

test ('Should set Text class and ID with single and chain syntax', () => {

    const myText = new svg.Text()


    //// SINGLE METHOD ///

    // Class
    expect(myText.class()).toBe(null)
    expect(myText.class('class-1').class()).toBe('class-1')

    // ID
    expect(myText.id()).toBe(null)
    expect(myText.id('id-1').id()).toBe('id-1')



    //// CHAIN SYNTAX ////

    // ID and Class
    myText.class('M').id('Earth')
    expect(myText.class()).toBe('M')
    expect(myText.id()).toBe('Earth')


    //// CHAIN SYNTAX ////

    // ID and Class with other methods
    myText.x(8888).class('M').id('Vulcan').y(9999)
    expect(myText.class()).toBe('M')
    expect(myText.id()).toBe('Vulcan')
    expect(myText.x()).toBe(8888)
    expect(myText.y()).toBe(9999)


})



//// RECTANGLE /////////////////////////////////////////////////////////////////////////////////////////////////////////////


//// INSTANTIATE ///

test ('Should instantiate a Rectangle class object', () => {

    const myRectangle = new svg.Rectangle()

    expect(myRectangle).toBeDefined()

})




//// X and Y COORDINATES ///
test ('Should set rectangle x and y coordinates', () => {

    const myRectangle = new svg.Rectangle()

    //// SINGLE METHOD ///

    // X
    expect(myRectangle.x()).toBe(0)
    expect(myRectangle.x(111).x()).toBe(111)


    // Y
    expect(myRectangle.y()).toBe(0)
    expect(myRectangle.y(222).y()).toBe(222)


    //// CHAIN SYNTAX ///

    // x().y()
    myRectangle.x(888).y(999)
    expect(myRectangle.x()).toBe(888)
    expect(myRectangle.y()).toBe(999)

    // y().x()
    myRectangle.y(444).x(555)
    expect(myRectangle.y()).toBe(444)
    expect(myRectangle.x()).toBe(555)


    // x().y() and other methods
    myRectangle.class('S').x(8888).y(9999).id('Sun')
    expect(myRectangle.x()).toBe(8888)
    expect(myRectangle.y()).toBe(9999)

})




//// WIDTH AND HEIGHT ///

test ('Should get and set rectangle width and height correctly in single and chain syntax', () => {

    const myRectangle = new svg.Rectangle()

    //// SINGLE METHOD ////

    // Get
    expect(myRectangle.width()).toBe(50)
    expect(myRectangle.height()).toBe(50)

    // Set (and then get to see what is set)
    expect(myRectangle.width(100).width()).toBe(100)
    expect(myRectangle.height(100).height()).toBe(100)


    //// CHAIN SYNTAX////

    // width().height()
    myRectangle.width(999).height(111)
    expect(myRectangle.width()).toBe(999)
    expect(myRectangle.height()).toBe(111)

    // height().width()
    myRectangle.height(555).width(444)
    expect(myRectangle.width()).toBe(444)
    expect(myRectangle.height()).toBe(555)
})




//// FILL ///

test ('Should get and set fill color using single and chain syntax', () => {

    const myRectangle = new svg.Rectangle()

    // Single method
    expect(myRectangle.fill('green').fill()).toBe('green')
    expect(myRectangle.fill('red').fill()).toBe('red')

    // Chain syntax
    expect(myRectangle.width(111).fill('red').fill()).toBe('red')
    expect(myRectangle.fill('blue').height(222).fill()).toBe('blue')

})




//// CLASS AND ID ///

test ('Should set rectangle class and ID with single and chain syntax', () => {

    const myRectangle = new svg.Rectangle()


    //// SINGLE METHOD ///

    // Class
    expect(myRectangle.class()).toBe(null)
    expect(myRectangle.class('class-1').class()).toBe('class-1')

    // ID
    expect(myRectangle.id()).toBe(null)
    expect(myRectangle.id('id-1').id()).toBe('id-1')



    //// CHAIN SYNTAX ////

    // ID and Class
    myRectangle.class('M').id('Earth')
    expect(myRectangle.class()).toBe('M')
    expect(myRectangle.id()).toBe('Earth')


    //// CHAIN SYNTAX ////

    // ID and Class with other methods
    myRectangle.class('M').id('Vulcan').width(8888).height(9999)
    expect(myRectangle.class()).toBe('M')
    expect(myRectangle.id()).toBe('Vulcan')


})
