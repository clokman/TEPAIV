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

// Disable d3 transitions
d3.selection.prototype.transition = jest.fn( function(){return this} )
d3.selection.prototype.duration = jest.fn( function(){return this} )


global.classUtils = require("../../../utils/classUtils")
global.errorUtils = require("../../../utils/errorUtils")
global.container = require("../../container")
global.shape = require("../../shape")
global.stringUtils = require("../../../utils/stringUtils")
global.data = require("../../../cpc/data")

const jestDom = require("../../../../../JestUtils/jest-dom")
const jestConsole = require("../../../../../JestUtils/jest-console")
    , expectConsoleHistory = jestConsole.expectConsoleHistory
    , clearConsoleHistory = jestConsole.clearConsoleHistory
    , destroyWarnings = jestConsole.destroyWarnings

const initializeDomWithSvg = jestDom.initializeDomWithSvg

//// MODULES BEING TESTED ////
const datasets = require("../../../../data/datasets")
const navigator = require("../../navigator")





//// UNIT TESTS /////////////////////////////////////////////////////////////////////////////////////////////////////////////



//// Instantiate ///////////////////////////////////////////////////////////////

describe ('Instantiate', () => {

    test ('Instantiate a Polygon with default options', () => {

        // Clear JEST's DOM to prevent leftovers from previous tests
        document.body.innerHTML = ''

        const mySvg = new container.Svg()
        const myPolygon = new shape.Polygon()
        myPolygon.build()

        // Verify that the object exists
        expect( myPolygon ).toBeDefined()

        // Verify that the DOM counterpart of the object exists
        expect(document.getElementsByTagName('polygon').length)
            .toBe(1)

    })

    test ('Instantiate a Polygon as a child of another element', () => {

        // Clear JEST's DOM to prevent leftovers from previous tests
        document.body.innerHTML = ''


        // Create a svg object as the topmost container
        const mySvg = new container.Svg(640, 480)
            , svgSelection = mySvg.select()

        // Create a parent container for rectangle
        const myGroup = new container.Group(svgSelection)
            , groupSelection = myGroup.select()

        // Create the rectangle
        const myPolygon = new shape.Polygon(groupSelection)
        myPolygon.build()


        // Verify that DOM counterpart of the rectangle is created
        const noOfPolygons = document
            .getElementsByTagName('polygon')
            .length
        expect(noOfPolygons).toBe(1)


        // Verify that rectangle has a parent group
        const parentElementType = document
            .getElementsByTagName('polygon')[0]
            .parentElement
            .tagName
        expect(parentElementType).toBe('g')

    })

})


//// Points ///////////////////////////////////////////////////////////////

describe ('Points', () => {

        test ('Get/set points', () => {


            // Clear JEST's DOM to prevent leftovers from previous tests
            document.body.innerHTML = ''

            const mySvg = new container.Svg()
            const myPolygon = new shape.Polygon()

            // Get points
            expect( myPolygon.points() ).toBe( "0,100 200,0 200,200 0,200" )

            // Set points
            myPolygon.points("0,10 20,0")
            expect( myPolygon.points() ).toBe( "0,10 20,0" )




            // Chain methods should be possible
            expect( myPolygon.strokeColor() ).not.toBe('salmon')

            const objectReturned = myPolygon.points("0,10 20,0")
            expect( objectReturned.constructor.name ).toBe( "Polygon" )
            myPolygon
                .points("0,10 20,0")
                .strokeColor('salmon')
            expect( myPolygon.strokeColor() ).toBe( 'salmon' )
            



        })

})


//// Fill ///////////////////////////////////////////////////////////////

describe ('fill()', () => {

    test ('.get() and .set()', () => {

        initializeDomWithSvg()

        const myPolygon = new shape.Polygon()

        expect( myPolygon.fill() ).toBe('gray')
        expect( myPolygon.fill('red').fill() ).toBe('red')

    })

})


//// Stroke Color ///////////////////////////////////////////////////////////////

describe ('strokeColor() ', () => {

    test('Get: Get stroke color', () => {

        initializeDomWithSvg()

        const myPolygon = new shape.Polygon()
        myPolygon.build()

        expect( myPolygon.strokeColor() ).toBe( 'rgba(0, 0, 0, 0.0)' )

    })

    test('Set: Set stroke color', () => {

        initializeDomWithSvg()

        // Create a new rectangle
        const myPolygon = new shape.Polygon()
        myPolygon.build()

        // Ensure that the default color is different than this example value
        expect( myPolygon.strokeColor() ).not.toBe( 'rgba(0, 175, 255, .8)' )

        // Change stroke color
        myPolygon.strokeColor('rgba(0, 175, 255, .8)')

        // Confirm change in object
        expect( myPolygon.strokeColor() ).toBe( 'rgba(0, 175, 255, .8)' )

        // Confirm change on DOM
        myPolygon.id('my-polygon').update()
        const strokeColorOnDom = document.querySelector( '#my-polygon' ).getAttribute('stroke');
        expect( strokeColorOnDom ).toBe( 'rgba(0, 175, 255, .8)' )

    })

})


//// Stroke Width ///////////////////////////////////////////////////////////////

describe ('strokeWidth() ', () => {

    test('Get: Get stroke width', () => {

        initializeDomWithSvg()

        const myPolygon = new shape.Polygon()
        myPolygon.build()

        expect( myPolygon.strokeWidth() ).toBe( '1px' )

    })

    test('Set: Set stroke width', () => {

        initializeDomWithSvg()

        // Create a new rectangle
        const myPolygon = new shape.Polygon()
        myPolygon.build()

        // Ensure that the default color is different than this example value
        expect( myPolygon.strokeWidth() ).not.toBe( '24px' )

        // Change stroke color
        myPolygon.strokeWidth('24px')

        // Confirm change in object
        expect( myPolygon.strokeWidth() ).toBe( '24px' )


        // Confirm change on DOM //
        myPolygon.id('my-rectangle').update()
        const strokeWidthOnDom = document.querySelector( '#my-rectangle' ).getAttribute('stroke-width')
        expect( strokeWidthOnDom ).toBe( '24px' )

    })

})


//// Obsolete Inheritances ///////////////////////////////////////////////////////////////

describe ('Obsolete methods inherited from the parent class', () => {

    test ("x() and y() should do nothing and print warnings to console", () => {

        initializeDomWithSvg()

        const myPolygon = new shape.Polygon()

        // X
        myPolygon.x()
        expectConsoleHistory("`Polygon.x()` method was called but this method has no effect on polygons. `Polygon.points()` method should be used instead.")
        clearConsoleHistory()
        myPolygon.x(50)
        expectConsoleHistory("`Polygon.x()` method was called but this method has no effect on polygons. `Polygon.points()` method should be used instead.")
        clearConsoleHistory()

        // Y
        myPolygon.y()
        expectConsoleHistory("`Polygon.y()` method was called but this method has no effect on polygons. `Polygon.points()` method should be used instead.")
        clearConsoleHistory()
        myPolygon.y(50)
        expectConsoleHistory("`Polygon.y()` method was called but this method has no effect on polygons. `Polygon.points()` method should be used instead.")

        destroyWarnings()

    })

})
