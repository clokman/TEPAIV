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
    ...require("../../../external/d3/d3"),
    ...require("../../../external/d3/d3-array")
}

global.container = require("../../container")
global.shape = require("../../shape")
global.str = require("../../str")
global.data = require("../../../cpc/data")

//// MODULES BEING TESTED ////
const datasets = require("../../../../data/datasets")
const navigator = require("../../navigator")





//// UNIT TESTS /////////////////////////////////////////////////////////////////////////////////////////////////////////////


//// INSTANTIATE ///

test ('Should instantiate a Rectangle class object with default options', () => {

    // Clear JEST's DOM to prevent leftovers from previous tests
    document.body.innerHTML = ''

    const mySvg = new container.Svg()
    const myRectangle = new shape.Rectangle()

    // Verify that the object exists
    expect(myRectangle).toBeDefined()

    // Verify that the DOM counterpart of the object exists
    expect(document.getElementsByTagName('rect').length)
        .toBe(1)

})

//// INSTANTIATE AS CHILD ////

test ('Should instantiate a rectangle as a child object of another element', () => {

    // Clear JEST's DOM to prevent leftovers from previous tests
    document.body.innerHTML = ''


    // Create a svg object as the topmost container
    const mySvg = new container.Svg(640, 480)
        , svgSelection = mySvg.select()

    // Create a parent container for rectangle
    const myGroup = new container.Group(svgSelection)
        , groupSelection = myGroup.select()

    // Create the rectangle
    const myRectangle = new shape.Rectangle(groupSelection)


    // Verify that DOM counterpart of the rectangle is created
    const noOfRectangles = document
        .getElementsByTagName('rect')
        .length
    expect(noOfRectangles).toBe(1)


    // Verify that rectangle has a parent group
    const parentElementType = document
        .getElementsByTagName('rect')[0]
        .parentElement
        .tagName
    expect(parentElementType).toBe('g')

})


//// SELECT ///

test ("Should return a Selection to the rectangle's corresponding DOM element" , () => {

    // Clear JEST's DOM to prevent leftovers from previous tests
    document.body.innerHTML = ''


    // Create an svg object that that the rectangle can exist in
    const mySvg = new container.Svg(640, 480)

    // Initiate rectangle instance
    const myRectangle = new shape.Rectangle()  // implicitly attaches to svg

    // Set a property on DOM using select method
    myRectangle.select().attr('id', 'my-rect')


    // Verify that the element is created in DOM and has the correct attribute
    expect(document.getElementById('my-rect').getAttribute('id'))
        .toBe('my-rect')

    // Get a property from DOM using select method
    expect(myRectangle.select().attr('id')).toBe('my-rect')


})


/// REMOVE ///

test ("Should remove rectangle's corresponding element in DOM", () => {

    // Clear JEST's DOM to prevent leftovers from previous tests
    document.body.innerHTML = ''


    // Create a svg object that that the container can exist in
    const mySvg = new container.Svg(111, 222)
        , parentSelection = mySvg.select()

    // Initiate group instance
    const myRectangle = new shape.Rectangle(parentSelection)
    myRectangle.id('my-rect').update()

    // Verify that a corresponding element is created in DOM
    expect(document.getElementById('my-rect')).toBeDefined()


    // Remove element from DOM
    myRectangle.remove()

    // Verify that the element is longer in DOM
    expect(document.getElementById('my-rect')).toBe(null)

})


//// UPDATE ////
// TODO: TEST WRITTEN FOR UPDATE METHOD


//// X and Y COORDINATES ///
test ('Should set rectangle x and y coordinates', () => {

    const myRectangle = new shape.Rectangle()

    // SINGLE METHOD //

    // X
    expect(myRectangle.x()).toBe(0)
    expect(myRectangle.x(111).x()).toBe(111)


    // Y
    expect(myRectangle.y()).toBe(0)
    expect(myRectangle.y(222).y()).toBe(222)


    // CHAIN SYNTAX //

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

    // SINGLE METHOD //

    // Get
    expect(myRectangle.width()).toBe(50)
    expect(myRectangle.height()).toBe(50)

    // Set (and then get to see what is set)
    expect(myRectangle.width(100).width()).toBe(100)
    expect(myRectangle.height(100).height()).toBe(100)


    // CHAIN SYNTAX //

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


    // SINGLE METHOD //

    // Class
    expect(myRectangle.class()).toBe('rectangle')
    expect(myRectangle.class('class-1').class()).toBe('class-1')

    // ID
    expect(myRectangle.id()).toBeDefined()  // it will be (e.g.) 'rectangle-4' by default
    expect(myRectangle.id('id-1').id()).toBe('id-1')



    // CHAIN SYNTAX //

    // ID and Class
    myRectangle.class('M').id('Earth')
    expect(myRectangle.class()).toBe('M')
    expect(myRectangle.id()).toBe('Earth')

    // ID and Class with other methods
    myRectangle.class('M').id('Vulcan').width(8888).height(9999)
    expect(myRectangle.class()).toBe('M')
    expect(myRectangle.id()).toBe('Vulcan')


})