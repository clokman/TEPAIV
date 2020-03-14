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
global.container = require("../../container")
global.shape = require("../../shape")
global.stringUtils = require("../../../utils/stringUtils")
global.data = require("../../../cpc/data")

const jestDom = require("../../../../../JestUtils/jest-dom")
const initializeDomWithSvg = jestDom.initializeDomWithSvg

//// MODULES BEING TESTED ////
const datasets = require("../../../../data/datasets")
const navigator = require("../../navigator")





//// UNIT TESTS /////////////////////////////////////////////////////////////////////////////////////////////////////////////



//// Instantiate ////////////////////////////////////////////////////////////

describe ('Instantiate', () => {

    test ('Instantiate a Rectangle class object with default options', () => {

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

    test ('As a child of another element', () => {

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

})



//// Update ///////////////////////////////////////////////////////////////

describe ('update()', () => {

// TODO: TEST WRITTEN FOR UPDATE METHOD

})



//// Select ///////////////////////////////////////////////////////////////

describe ('select()', () => {

    test ("Should return a Selection to the rectangle's corresponding DOM element" , () => {

       initializeDomWithSvg()

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


})



//// Remove ///////////////////////////////////////////////////////////////

describe ('remove()', () => {


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


})



//// X and Y ///////////////////////////////////////////////////////////////

describe ('x() and y() ', () => {

    test ('Should set rectangle x and y coordinates', () => {

        initializeDomWithSvg()

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

})




//// Location Inferences ///////////////////////////////////////////////////////////////

describe ('Location Inferences', () => {

        test ('Rectangle should report the coordinates of its four corners', () => {
            
            initializeDomWithSvg()
            const myRectangle = new shape.Rectangle()
            
            expect( myRectangle.topLeftCorner() ).toEqual(  [0, 0] )
            expect( myRectangle.topRightCorner() ).toEqual( [50, 0] )

            expect( myRectangle.bottomLeftCorner() ).toEqual( [0, 50] )
            expect( myRectangle.bottomRightCorner() ).toEqual( [50, 50] )


        })

})

//// Width and Height ///////////////////////////////////////////////////////////////

describe ('width() and height(): ', () => {

    test ('Should get and set rectangle width and height correctly in single and chain syntax', () => {

        initializeDomWithSvg()

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


})



//// Fill /////////////////////////////////////////////////////////////////////////

describe ('fill()', () => {

    test ('.get() and .set()', () => {

        initializeDomWithSvg()

        const myRectangle = new shape.Rectangle()

        // Single method
        expect(myRectangle.fill('green').fill()).toBe('green')
        expect(myRectangle.fill('red').fill()).toBe('red')

        // Chain syntax
        expect(myRectangle.width(111).fill('red').fill()).toBe('red')
        expect(myRectangle.fill('blue').height(222).fill()).toBe('blue')

    })
    
})



//// Stroke Color ///////////////////////////////////////////////////////////////

describe ('stroke() ', () => {

    test('Get: Get stroke color', () => {

        initializeDomWithSvg()

        const myRectangle = new shape.Rectangle()

        expect( myRectangle.stroke() ).toBe( 'rgba(0, 0, 0, 0.0)' )

    })

    test('Set: Set stroke color', () => {

        initializeDomWithSvg()

        // Create a new rectangle
        const myRectangle = new shape.Rectangle()

        // Ensure that the default color is different than this example value
        expect( myRectangle.stroke() ).not.toBe( 'rgba(0, 175, 255, .8)' )

        // Change stroke color
        myRectangle.stroke('rgba(0, 175, 255, .8)')

        // Confirm change in object
        expect( myRectangle.stroke() ).toBe( 'rgba(0, 175, 255, .8)' )

        // Confirm change on DOM
        myRectangle.id('my-rectangle').update()
        const strokeColorOnDom = document.querySelector( '#my-rectangle' ).getAttribute('stroke');
        expect( strokeColorOnDom ).toBe( 'rgba(0, 175, 255, .8)' )

    })
    
})



//// Stroke Width ///////////////////////////////////////////////////////////////

describe ('strokeWidth() ', () => {

    test('Get: Get stroke width', () => {

        initializeDomWithSvg()

        const myRectangle = new shape.Rectangle()

        expect( myRectangle.strokeWidth() ).toBe( '1px' )

    })

    test('Set: Set stroke width', () => {

        initializeDomWithSvg()

        // Create a new rectangle
        const myRectangle = new shape.Rectangle()

        // Ensure that the default color is different than this example value
        expect( myRectangle.strokeWidth() ).not.toBe( '24px' )

        // Change stroke color
        myRectangle.strokeWidth('24px')

        // Confirm change in object
        expect( myRectangle.strokeWidth() ).toBe( '24px' )


        // Confirm change on DOM //
        myRectangle.id('my-rectangle').update()
        const strokeWidthOnDom = document.querySelector( '#my-rectangle' ).getAttribute('stroke-width')
        expect( strokeWidthOnDom ).toBe( '24px' )

    })

})



//// Class and ID ///////////////////////////////////////////////////////////////

describe ('class() and id()', () => {

    test ('Should set rectangle class and ID with single and chain syntax', () => {

        initializeDomWithSvg()

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

})
