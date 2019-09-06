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
require('../../../../../JestUtils/jest-console')
require('../../../../../JestUtils/jest-dom')


//// UMD DEPENDENCIES ////

global.d3 = {
    ...require("../../../external/d3/d3"),
    ...require("../../../external/d3/d3-array")
}
// Disable d3 transitions
d3.selection.prototype.transition = jest.fn( function(){return this} )
d3.selection.prototype.duration = jest.fn( function(){return this} )


global.classUtils = require("../../../utils/classUtils")
global.container = require("../../container")
global.shape = require("../../shape")
global.stringUtils = require("../../../utils/stringUtils")
global.data = require("../../../cpc/data")


//// MODULE BEING TESTED IN CURRENT FILE ////
const datasets = require("../../../../data/datasets")
const navigator = require("../../navigator")






//// TESTS /////////////////////////////////////////////////////////////////////////////////////////////////////////////




//// INSTANTIATE CAPTIONED RECTANGLE ///

test ('Instantiate CaptionedRectangle with default options', () => {

    // Clear JEST's DOM to prevent leftovers from previous tests
    document.body.innerHTML = ''


    const mySvg = new container.Svg()
    const myCaptionedRectangle = new shape.CaptionedRectangle()

    // Verify that the object exists
    expect(myCaptionedRectangle).toBeDefined()


    // Verify that the DOM counterpart of the object exists
    expect(document.getElementsByTagName('rect').length)
        .toBe(1)
    expect(document.getElementsByTagName('text').length)
        .toBe(1)

})




//// INSTANTIATE CAPTIONED RECTANGLE AS CHILD ////

test ('Instantiate CaptionedRectangle as a child object/element', () => {

    // Clear JEST's DOM to prevent leftovers from previous tests
    document.body.innerHTML = ''


    // Create a svg object as the topmost container
    const mySvg = new container.Svg(640, 480)
        , svgSelection = mySvg.select()

    // Create a parent container for captioned rectangle
    const myContainer = new container.Group(svgSelection)
        , containerSelection = myContainer.select()

    // Create the captioned rectangle
    const myCaptionedRectangle = new shape.CaptionedRectangle(containerSelection)


    // A DOM counterpart of captioned rectangle should exist
    const noOfRectangleElements = document
        .getElementsByTagName('rect')
        .length
    expect(noOfRectangleElements).toBe(1)

    const noOfTextElements = document
        .getElementsByTagName('text')
        .length
    expect(noOfTextElements).toBe(1)


    // Captioned rectangle should have a parent group
    const parentElementType = document
        .getElementsByTagName('rect')[0]
        .parentElement
        .tagName
    expect(parentElementType).toBe('g')

})



//// GETTERS AND SETTERS ////

test ('Getters and setters should work', () => {

    // Clear JEST's DOM to prevent leftovers from previous tests
    document.body.innerHTML = ''

    // Create a svg object as the topmost container
    const mySvg = new container.Svg(640, 480)

    // Create the captioned rectangle
    const myCaptionedRectangle = new shape.CaptionedRectangle()


    // Select elements of captioned rectangle on DOM
    const rectangleElementOfCaptionedRectangle = document.querySelector('rect')
    const textElementOfCaptionedRectangle = document.querySelector('text')



    // X() //

    // Verify initial values (get)
    expect(myCaptionedRectangle.x()).toBe(25)
    expect(rectangleElementOfCaptionedRectangle.getAttribute('x')).toBe('25')
    expect(textElementOfCaptionedRectangle.getAttribute('x')).toBe('50')

    // Set new value (set)
    myCaptionedRectangle.x(50).update()

    // Verify new values
    // Object
    expect(myCaptionedRectangle.x()).toBe(50)
    // Elements
    expect(rectangleElementOfCaptionedRectangle.getAttribute('x')).toBe('50')
    expect(textElementOfCaptionedRectangle.getAttribute('x')).toBe('75')



    // Y() //

    // Verify initial values (get)
    expect(myCaptionedRectangle.y()).toBe(25)
    expect(rectangleElementOfCaptionedRectangle.getAttribute('y')).toBe('25')
    expect(textElementOfCaptionedRectangle.getAttribute('y')).toBe('53')

    // Set new value (set)
    myCaptionedRectangle.y(50).update()

    // Verify new values
    // Object
    expect(myCaptionedRectangle.y()).toBe(50)
    // Elements
    expect(rectangleElementOfCaptionedRectangle.getAttribute('y')).toBe('50')
    expect(textElementOfCaptionedRectangle.getAttribute('y')).toBe('78')



    // TEXT() //

    // Verify initial values (get)
    expect(myCaptionedRectangle.text()).toBe('Text')
    expect(textElementOfCaptionedRectangle.textContent).toBe('Text')

    // Set new value (set)
    myCaptionedRectangle.text('New Text').update()

    // Verify new values
    // Object
    expect(myCaptionedRectangle.text()).toBe('New Text')
    // Elements
    expect(textElementOfCaptionedRectangle.textContent).toBe('New Text')



    // WIDTH() //

    // Verify initial values (get)
    expect(myCaptionedRectangle.width()).toBe(50)
    expect(rectangleElementOfCaptionedRectangle.getAttribute('height')).toBe('50')
    expect(textElementOfCaptionedRectangle.getAttribute('x')).toBe('75')

    // Set new value (set)
    myCaptionedRectangle.width(150).update()

    // Verify new values
    // Object
    expect(myCaptionedRectangle.width()).toBe(150)
    // Elements
    expect(rectangleElementOfCaptionedRectangle.getAttribute('width')).toBe('150')
    expect(textElementOfCaptionedRectangle.getAttribute('x')).toBe('125')



    // HEIGHT() //

    // Verify initial values (get)
    expect(myCaptionedRectangle.height()).toBe(50)
    expect(rectangleElementOfCaptionedRectangle.getAttribute('height')).toBe('50')
    expect(textElementOfCaptionedRectangle.getAttribute('y')).toBe('78')

    // Set new value (set)
    myCaptionedRectangle.height(150).update()

    // Verify new values
    // Object
    expect(myCaptionedRectangle.height()).toBe(150)
    // Elements
    expect(rectangleElementOfCaptionedRectangle.getAttribute('height')).toBe('150')
    expect(textElementOfCaptionedRectangle.getAttribute('y')).toBe('128')



    // FILL() //

    // Verify initial values (get)
    expect(myCaptionedRectangle.fill()).toBe('gray')
    expect(rectangleElementOfCaptionedRectangle.getAttribute('fill')).toBe('gray')

    // Set new value (set)
    myCaptionedRectangle.fill('salmon').update()

    // Verify new values
    // Object
    expect(myCaptionedRectangle.fill()).toBe('salmon')
    // Elements
    expect(rectangleElementOfCaptionedRectangle.getAttribute('fill')).toBe('salmon')



    // TEXTFILL() //

    // Verify initial values (get)
    expect(myCaptionedRectangle.textFill()).toBe('white')
    expect(textElementOfCaptionedRectangle.getAttribute('fill')).toBe('white')

    // Set new value (set)
    myCaptionedRectangle.textFill('dodgerblue').update()

    // Verify new values
    // Object
    expect(myCaptionedRectangle.textFill()).toBe('dodgerblue')
    // Elements
    expect(textElementOfCaptionedRectangle.getAttribute('fill')).toBe('dodgerblue')



    // TEXTALIGNMENT() //

    // Verify initial values (get)
    expect(myCaptionedRectangle.textAlignment()).toBe('center')
    expect(textElementOfCaptionedRectangle.getAttribute('text-anchor')).toBe('middle')
    expect(textElementOfCaptionedRectangle.getAttribute('dominant-baseline')).toBe('auto')

    // Set new value (set)
    myCaptionedRectangle.textAlignment('top-left').update()

    // Verify new values
    // Object
    expect(myCaptionedRectangle.textAlignment()).toBe('top-left')
    // Elements
    expect(textElementOfCaptionedRectangle.getAttribute('text-anchor')).toBe('start')
    expect(textElementOfCaptionedRectangle.getAttribute('dominant-baseline')).toBe('hanging')


})