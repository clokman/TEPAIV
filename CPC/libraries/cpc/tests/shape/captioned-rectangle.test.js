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
global.errorUtils = require("../../../utils/errorUtils")
global.data = require("../../../cpc/data")

require("../../../../../JestUtils/jest-dom")

//// MODULE BEING TESTED IN CURRENT FILE ////
const datasets = require("../../../../data/datasets")
const navigator = require("../../navigator")






//// TESTS /////////////////////////////////////////////////////////////////////////////////////////////////////////////


//// INSTANTIATE CAPTIONED RECTANGLE  ///////////////////////////////////////////////////////////////

describe ('Instantiate', () => {


    test ('Instantiate with default options', () => {

        initializeDomWithSvg()


        const myCaptionedRectangle = new shape.CaptionedRectangle()

        // Verify that the object exists
        expect(myCaptionedRectangle).toBeDefined()


        // Verify that the DOM counterpart of the object exists
        expect(document.getElementsByTagName('rect').length)
            .toBe(1)
        expect(document.getElementsByTagName('text').length)
            .toBe(1)

    })


    test ('Instantiate as a child object/element', () => {

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


})


//// GETTERS AND SETTERS ///////////////////////////////////////////////////////////////

describe ('Getters and setters ', () => {


    test ('Misc. getters and setters', () => {

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


        // STROKECOLOR () //

        // Verify initial values (get)
        expect(myCaptionedRectangle.strokeColor()).toBe('rgba(0, 0, 0, 0.0)')
        expect(rectangleElementOfCaptionedRectangle.getAttribute('stroke')).toBe('rgba(0, 0, 0, 0.0)')

        // Set new value (set)
        myCaptionedRectangle.strokeColor('salmon').update()

        // Verify new values
        // Object
        expect(myCaptionedRectangle.strokeColor()).toBe('salmon')
        // Elements
        expect(rectangleElementOfCaptionedRectangle.getAttribute('stroke')).toBe('salmon')

        // STROKEWIDTH () //

        // Verify initial values (get)
        expect(myCaptionedRectangle.strokeWidth()).toBe('1px')
        expect(rectangleElementOfCaptionedRectangle.getAttribute('stroke-width')).toBe('1px')

        // Set new value (set)
        myCaptionedRectangle.strokeWidth('24px').update()

        // Verify new values
        // Object
        expect(myCaptionedRectangle.strokeWidth()).toBe('24px')
        // Elements
        expect(rectangleElementOfCaptionedRectangle.getAttribute('stroke-width')).toBe('24px')





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


})



// TEXT ///////////////////////////////////////////////////////////////

describe ('Text', () => {

    test ('Text should disappear when the recangle is too small', () => {

        initializeDomWithSvg()
        // Create category
        const myCaptionedRectangle = new shape.CaptionedRectangle()

        // Text should be initially visible
        expect( myCaptionedRectangle._textObject.visibility() ).toBe( 'visible' )
        const text = document.querySelector( 'text' )
        expect( text ).not.toBe(  )
        expect( text.getAttribute('visibility') ).toBe('visible')
        expect( text.innerHTML ).toBe( 'Text' )


        // Make the rectangle WIDTH too small for text
        myCaptionedRectangle
            .width(10)
            .update()

        // Text should now be hidden
        expect( myCaptionedRectangle._textObject.visibility() ).toBe( 'hidden' )
        expect( text.getAttribute('visibility') ).toBe('hidden')


        // Make the width large enough for text again
        myCaptionedRectangle
            .width(50)
            .update()
        
        // Text should now be visible again
        expect( myCaptionedRectangle._textObject.visibility() ).toBe( 'visible' )
        expect( text.getAttribute('visibility') ).toBe('visible')


        // Make the rectangle HEIGHT too small
        myCaptionedRectangle
            .height(10)
            .update()

        // Text should now be hidden
        expect( myCaptionedRectangle._textObject.visibility() ).toBe( 'hidden' )
        expect( text.getAttribute('visibility') ).toBe('hidden')


        // Make the rectangle height large enough for text again
        myCaptionedRectangle
            .height(50)
            .update()

        // Text should now be visible again
        expect( myCaptionedRectangle._textObject.visibility() ).toBe( 'visible' )
        expect( text.getAttribute('visibility') ).toBe('visible')

    })


})

