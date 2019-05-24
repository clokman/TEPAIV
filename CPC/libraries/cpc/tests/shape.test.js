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





//// RECTANGLE /////////////////////////////////////////////////////////////////////////////////////////////////////////////


//// INSTANTIATE ///

test ('Should instantiate a Rectangle class object', () => {

    const myRectangle = new shape.Rectangle()

    expect(myRectangle).toBeDefined()

})




//// X and Y COORDINATES ///
test ('Should set rectangle x and y coordinates', () => {

    const myRectangle = new shape.Rectangle()

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

    const myRectangle = new shape.Rectangle()

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

    const myRectangle = new shape.Rectangle()

    // Single method
    expect(myRectangle.fill('green').fill()).toBe('green')
    expect(myRectangle.fill('red').fill()).toBe('red')

    // Chain syntax
    expect(myRectangle.width(111).fill('red').fill()).toBe('red')
    expect(myRectangle.fill('blue').height(222).fill()).toBe('blue')

})




//// CLASS AND ID ///

test ('Should set rectangle class and ID with single and chain syntax', () => {

    const myRectangle = new shape.Rectangle()


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






//// TEXT /////////////////////////////////////////////////////////////////////////////////////////////////////////////

test ('Should instantiate a Text class object', () => {

    const myText = new shape.Text()

    expect(myText).toBeDefined()

})


// TODO: DOM testing incorporated to tests
// test ('Should update attributes of a text object on DOM', () => {
//
//     d3.select('body').selectAll('svg').remove()
//     const mySvg = new container.Svg(500, 500)
//     const myText = new shape.Text()
//
//     myText.x(200).fill('blue').id('Earth').y(10).class('M').text('You are here').update(0)
//
//     expect(d3.select('body').select('svg').select('#Earth')).toBe('10')
//     // expect(d3.select('body').select('svg').select('#Earth').attr('y')).toBe('10')
//
//
// })


test ('Should get and set text', () => {

    const myText = new shape.Text()

    //// SINGLE METHOD ///
    expect(myText.text()).toBe('Text')
    expect(myText.text('my text').text()).toBe('my text')
})


test ('Should get and set coordinates', () => {

    const myText = new shape.Text()

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

    const myText = new shape.Text()

    // Single method
    expect(myText.fill('green').fill()).toBe('green')
    expect(myText.fill('red').fill()).toBe('red')

    // Chain syntax
    expect(myText.x(111).fill('red').fill()).toBe('red')
    expect(myText.fill('blue').y(222).fill()).toBe('blue')


})


// TEXT ANCHOR ///

test ('Should get and set anchor using single and chain syntax', () => {

    const myText = new shape.Text()

    // Single method
    expect(myText.textAnchor('middle').textAnchor()).toBe('middle')
    expect(myText.textAnchor('start').textAnchor()).toBe('start')

    // Chain syntax
    expect(myText.x(111).textAnchor('end').textAnchor()).toBe('end')
    expect(myText.textAnchor('middle').y(222).textAnchor()).toBe('middle')


})


//// FONT SIZE ///

test ('Should get and set fill color using single and chain syntax', () => {

    const myText = new shape.Text()

    // Single method
    expect(myText.textAnchor('green').textAnchor()).toBe('green')
    expect(myText.textAnchor('red').textAnchor()).toBe('red')

    // Chain syntax
    expect(myText.x(111).textAnchor('red').textAnchor()).toBe('red')
    expect(myText.textAnchor('blue').y(222).textAnchor()).toBe('blue')

})


//// CLASS AND ID ///

test ('Should set Text class and ID with single and chain syntax', () => {

    const myText = new shape.Text()


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
