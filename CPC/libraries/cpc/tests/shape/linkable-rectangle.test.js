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
global.jsUtils = require("../../../utils/jsUtils")
global.errorUtils = require("../../../utils/errorUtils")
global.container = require("../../container")
global.shape = require("../../shape")
global.stringUtils = require("../../../utils/stringUtils")
global.data = require("../../../cpc/data")
global._ = require("../../../external/lodash")

const {initializeDomWithSvg} = require("../../../../../JestUtils/jest-dom")
const {hasType} = require("../../../utils/jsUtils")
const {writeDomToFile} = require("../../../../../JestUtils/jest-dom")

//// MODULES BEING TESTED ////





//// UNIT TESTS /////////////////////////////////////////////////////////////////////////////////////////////////////////////


//// Ensemble ///////////////////////////////////////////////////////////////

describe ('Ensemble', () => {


    //// Validation ///////////////////////////////////////////////////////////////

    describe ('Validation', () => {


        test ('Do not allow self-to-self connections', () => {

            // Reset ID counter
            shape.LinkableRectangle.uniqueIdCounter(0)

            // Initialize a rectangle
            const myRectangle = new shape.LinkableRectangle()
                .build()

            // Link rectangles
            expect( () => {
                myRectangle.linkRight(myRectangle).update()
            }).toThrow(`An ensemble member cannot be linked to itself. The attempt was made to link the object with the id 'linkable-rectangle-0' with type 'LinkableRectangle' to itself.`)


            expect( () => {
                myRectangle.linkLeft(myRectangle).update()
            }).toThrow( `An ensemble member cannot be linked to itself. The attempt was made to link the object with the id 'linkable-rectangle-0' with type 'LinkableRectangle' to itself.` )

        })


        test ('Do not allow an object to be linked to both right and left', () => {

            // Reset ID generator
            shape.LinkableRectangle.uniqueIdCounter( 0 )

            // Initialize a rectangle
            const rectangle0 = new shape.LinkableRectangle()
                .build()

            // Initialize another rectangle
            const rectangle1 = new shape.LinkableRectangle()
                .build()

            // Link rectangle to one side
            rectangle0.linkRight(rectangle1).update()

            // Link the same rectangle to the other side
            expect( () => {
                rectangle0.linkLeft(rectangle1).update()
            }).toThrow(`It was attempted to add the same object more than once to the 'linkedObjects' registry of the ensemble member with the id (if available) 'linkable-rectangle-0'. This may indicate the use of the same object in more than one link slot or a recurrent link between two ensemble members. The type of the object that was attempted to be added to the registry is 'LinkableRectangle' and its id is (if available) 'linkable-rectangle-1'.`)

        })


        test ('Do not allow recurrent connections in ensemble', () => {

            shape.LinkableRectangle.uniqueIdCounter(0)

            // Initialize a rectangle
            const rectangle0 = new shape.LinkableRectangle()
                .build()

            // Initialize another rectangle
            const rectangle1 = new shape.LinkableRectangle()
                .build()

            // Link rectangles
            rectangle0.linkRight(rectangle1).update()

            // It should not be possible to have a recurrent connection between two objects in the ensemble (e.g, a <-linkRight()-> b)
            expect( () => {
                rectangle1.linkRight(rectangle0).update()
            }).toThrow(`It was attempted to add the same object more than once to the 'linkedObjects' registry of the ensemble member with the id (if available) 'linkable-rectangle-1'. This may indicate the use of the same object in more than one link slot or a recurrent link between two ensemble members. The type of the object that was attempted to be added to the registry is 'LinkableRectangle' and its id is (if available) 'linkable-rectangle-0'.`)

        })


    })


    //// Synchronizing Fields Across Ensemble Members ///////////////////////////////////////////////////////////////

    describe ('Synchronizing Fields Across Ensemble Members', () => {


        test ('Collect shared fields in ensemble', () => {

            initializeDomWithSvg()

            // Create a container to be a custom parent element for connectors
            const customContainerElementForLinkableRectangle = new container.Group()
                .id('custom-parent-element')
                .update()


            // Initialize a rectangle with a CUSTOM parent for connectors
            const customizedRectangle = new shape.LinkableRectangle()
                .customParentContainerSelectionForConnectors( customContainerElementForLinkableRectangle.select() )
                .id('customized-rectangle')
                .build()

            // Initialize a rectangle with NO CUSTOM parent for connectors
            const defaultRectangle = new shape.LinkableRectangle()
                .id('default-rectangle')
                .build()

            // Link rectangles
            customizedRectangle.linkRight(defaultRectangle).update()


            // Collect shared properties in ensemble
            const ensemble = [defaultRectangle, defaultRectangle.linkLeft(), defaultRectangle.linkRight()]
            const sharedFields = ['_customParentContainerSelectionForConnectors']
            const sharedPropertiesInEnsemble = defaultRectangle.collectSharedUserSpecifiedPropertiesInEnsemble(ensemble, sharedFields)
            const sharedPropertyNamesInEnsemble = Array.from(sharedPropertiesInEnsemble.keys())
            expect( sharedPropertyNamesInEnsemble )
                .toEqual( ["_customParentContainerSelectionForConnectors"] )


            // Inspect '_customParentContainerSelectionForConnectors' property
            const connectorContainersInEnsemble = sharedPropertiesInEnsemble.get('_customParentContainerSelectionForConnectors')
            expect( Array.from(connectorContainersInEnsemble.keys()) ).toEqual(
                ["default-rectangle", "customized-rectangle"]  // `default-rectangle` is here because its default
                // value `null` is automatically replaced with a
                // user-defined one when `defaultRectangle` was
                // linked with `customizedRectangle`.
                // (collectSharedUserSpecifiedPropertiesInEnsemble()
                // returns only non-default, user specified values)
            )

            const connectorContainerIds = connectorContainersInEnsemble.get("customized-rectangle").attr('id')
            expect( connectorContainerIds ).toBe('custom-parent-element')

        })


        test ('Validation: If two different values are specified for a shared field in at least two objects in ensemble, an exception should be thrown,  ', () => {

            initializeDomWithSvg()

            // Create a container to be a custom parent element for connectors
            const customContainerElementA = new container.Group()
                .id('custom-parent-element-a')
                .update()

            // Create a container to be a custom parent element for connectors
            const customContainerElementB = new container.Group()
                .id('custom-parent-element-b')
                .update()


            // Initialize a rectangle WITH A AS PARENT for connectors
            const customizedRectangleA = new shape.LinkableRectangle()
                .customParentContainerSelectionForConnectors( customContainerElementA.select() )
                .id('customized-rectangle-a')
                .build()

            // Initialize a rectangle WITH B AS PARENT for connectors
            const customizedRectangleB = new shape.LinkableRectangle()
                .customParentContainerSelectionForConnectors( customContainerElementB.select() )
                .id('customized-rectangle-b')
                .build()

            // Initialize a rectangle with NO CUSTOM parent for connectors
            const defaultRectangle = new shape.LinkableRectangle()
                .id('default-rectangle')
                .build()


            // Link rectangles
            defaultRectangle.linkLeft(customizedRectangleA)  // .update() If `update` is used here,  shared fields would also be validated here, which is not desirable for this test.
            defaultRectangle.linkRight(customizedRectangleB)  // .update()



            // Detect conflicts
            const ensemble =[defaultRectangle, defaultRectangle.linkLeft(), defaultRectangle.linkRight()]
            const sharedFields = ['_customParentContainerSelectionForConnectors']
            expect( () => {
                defaultRectangle.validateSharedPropertiesInEnsemble(
                    ensemble, sharedFields)
            }).toThrow(`Property "_customParentContainerSelectionForConnectors" is given conflicting values in the ensemble. The conflicts occur in objects with IDs "customized-rectangle-a" and "customized-rectangle-b".`)


        })


        test ('Equalize shared fields in ensemble', () => {

            initializeDomWithSvg()

            // Create a container to be a custom parent element for connectors
            const customContainerElementForLinkableRectangle = new container.Group()
                .id('custom-parent-element')
                .update()

            // Initialize a rectangle with a CUSTOM parent for connectors
            const customizedRectangle = new shape.LinkableRectangle()
                .customParentContainerSelectionForConnectors( customContainerElementForLinkableRectangle.select() )
                .id('customized-rectangle')
                .build()

            // Initialize a rectangle with NO CUSTOM parent for connectors
            const defaultRectangle = new shape.LinkableRectangle()
                .id('default-rectangle')
                .build()

            // Link rectangles
            customizedRectangle.linkRight(defaultRectangle).update()


            // Equalize shared properties in ensemble
            const ensemble = [defaultRectangle, defaultRectangle.linkLeft(), defaultRectangle.linkRight()]
            const sharedFields = ['_customParentContainerSelectionForConnectors']

            defaultRectangle.equalizeSharedPropertiesInEnsemble(ensemble, sharedFields)

            const sharedPropertiesInEnsemble = defaultRectangle.collectSharedUserSpecifiedPropertiesInEnsemble(ensemble, sharedFields)
            const sharedPropertyNamesInEnsemble = Array.from(sharedPropertiesInEnsemble.keys())
            expect( sharedPropertyNamesInEnsemble )
                .toEqual( ["_customParentContainerSelectionForConnectors"] )


            // Inspect '_customParentContainerSelectionForConnectors' property
            const connectorContainersInEnsemble = sharedPropertiesInEnsemble.get('_customParentContainerSelectionForConnectors')
            expect( Array.from(connectorContainersInEnsemble.keys()) ).toEqual(
                ["default-rectangle", "customized-rectangle"]  // default-rectangle is not here because default values (null) are ignored
            )

            // Check the inferred shared value
            const connectorContainerIds = connectorContainersInEnsemble.get("customized-rectangle").attr('id')
            expect( connectorContainerIds ).toBe('custom-parent-element')

            // Confirm that this value is now shared in all of the ensemble
            expect( defaultRectangle.customParentContainerSelectionForConnectors().attr('id') ).toBe( 'custom-parent-element' )
            expect( customizedRectangle.customParentContainerSelectionForConnectors().attr('id') ).toBe( 'custom-parent-element' )


        })


    })


})


//// Instantiation ////////////////////////////////////////////////////////////


describe ('Instantiation', () => {

    test ('Instantiate a LinkableRectangle class object with default options', () => {

        initializeDomWithSvg()
        const myRectangle = new shape.LinkableRectangle()
            .build()

        // // Verify that the object exists
        expect(myRectangle).toBeDefined()

        // Verify that the DOM counterpart of the object exists
        expect(document.getElementsByTagName('rect').length)
            .toBe(1)

        // Verify that the DOM counterpart of the object exists
        expect(document.getElementsByClassName('linkable-rectangle').length)
            .toBe(1)

    })


    //// ID generation ///////////////////////////////////////////////////////////////

    describe ('ID generation', () => {


        test ('It should be possible to reset LinkableRectangle counter', () => {

            // Unique ID counter should be reset to 0 (may not be so due to previous tests)
            shape.LinkableRectangle.uniqueIdCounter(0)
            expect( shape.LinkableRectangle.uniqueIdCounter() ).toBe( 0 )


            // First Object //

            // Id postfix should be 0 for the first LinkableRectangle
            initializeDomWithSvg()
            const myLinkableRectangle0 = new shape.LinkableRectangle()
                .build()

            // Current id number and id should be 0
            expect( myLinkableRectangle0.id() ).toBe( 'linkable-rectangle-0' )

            // Unique ID counter should be incremented for the next object
            expect( shape.LinkableRectangle.uniqueIdCounter() ) .toBe( 1 )


            // Second Object //

            // Id postfix should be incremented by now
            initializeDomWithSvg()
            const myLinkableRectangle1 = new shape.LinkableRectangle()
                .build()

            // Current ID
            expect( myLinkableRectangle1.id() ).toBe( 'linkable-rectangle-1' )



            // Reset ID Counter //
            shape.LinkableRectangle.uniqueIdCounter(0)



            // Third Object //

            initializeDomWithSvg()
            const myLinkableRectangle2 = new shape.LinkableRectangle()
                .build()

            // Current ID
            expect( myLinkableRectangle2.id() ).toBe( 'linkable-rectangle-0' )


        })


        test ('idNumber() should return the unique id `Number`, but if it is used to set a value, it should return an error', () => {

            // Reset unique id counter
            shape.LinkableRectangle.uniqueIdCounter(0)


            // First Object //

            // Id postfix should be 0 for the first LinkableRectangle
            initializeDomWithSvg()
            const myLinkableRectangle0 = new shape.LinkableRectangle()
                .build()

            // Current id number and id should be 0
            expect( myLinkableRectangle0.idNumber() ).toBe( 0 )
            expect( myLinkableRectangle0.id() ).toBe( 'linkable-rectangle-0' )

            // Unique ID counter should be incremented for the next object
            expect( shape.LinkableRectangle.uniqueIdCounter() ) .toBe( 1 )



            // Second Object //

            // Id postfix should be incremented by now
            initializeDomWithSvg()
            const myLinkableRectangle1 = new shape.LinkableRectangle()
                .build()

            // Current id number and id
            expect( myLinkableRectangle1.idNumber() ).toBe( 1 )
            expect( myLinkableRectangle1.id() ).toBe( 'linkable-rectangle-1' )


        })


    })

})




//// Connector Polygons ///////////////////////////////////////////////////////////////

describe ('Connector Polygons', () => {


//// Registering Connections ///////////////////////////////////////////////////////////////

    describe ('Registering connections to self and in the connected object', () => {


        test ('L --linkRight()--> R: Linked objects should recognize each other', () => {

            // Reset unique id counter for LinkableRectangle
            shape.LinkableRectangle.uniqueIdCounter(0)

            initializeDomWithSvg()
            const leftLinkableRectangle = new shape.LinkableRectangle()
                .build()
            const rightLinkableRectangle = new shape.LinkableRectangle()
                .build()

            leftLinkableRectangle
                .linkRight(rightLinkableRectangle)
                .update()

            // L should now be connected to R
            expect( leftLinkableRectangle.linkRight().id() ).toBe( 'linkable-rectangle-1' )
            // R should also know that it is now connected to L
            expect( rightLinkableRectangle.linkLeft().id() ).toBe( 'linkable-rectangle-0' )

        })

        test ('R --linkLeft()-- > L: Linked objects should recognize each other', () => {

            // Reset unique id counter for LinkableRectangle
            shape.LinkableRectangle.uniqueIdCounter(0)

            initializeDomWithSvg()
            const leftLinkableRectangle = new shape.LinkableRectangle()
                .build()
            const rightLinkableRectangle = new shape.LinkableRectangle()
                .build()

            // Link objects R->L
            rightLinkableRectangle
                .linkLeft(leftLinkableRectangle)
                .update()

            // L should now be connected to R
            expect( rightLinkableRectangle.linkLeft().id() ).toBe( 'linkable-rectangle-0' )
            // R should also know that it is now connected to L
            expect( leftLinkableRectangle.linkRight().id() ).toBe( 'linkable-rectangle-1' )

        })

        test( 'L --> M --> R: Three connected objects should recognize each other', () => {

            // Reset unique id counter for LinkableRectangle
            shape.LinkableRectangle.uniqueIdCounter(0)

            initializeDomWithSvg()
            const leftLinkableRectangle = new shape.LinkableRectangle()
                .build()
            const middleLinkableRectangle = new shape.LinkableRectangle()
                .build()
            const rightLinkableRectangle = new shape.LinkableRectangle()
                .build()

            // Link: Left-Middle-Right
            leftLinkableRectangle.linkRight(middleLinkableRectangle).update()
            middleLinkableRectangle.linkRight(rightLinkableRectangle).update()

            // L should now be connected to M
            expect( leftLinkableRectangle.linkRight().id() ).toBe( 'linkable-rectangle-1' )
            // M should also know that it is now connected to L
            expect( middleLinkableRectangle.linkLeft().id() ).toBe( 'linkable-rectangle-0' )

            // M should be connected to R
            expect( middleLinkableRectangle.linkRight().id() ).toBe( 'linkable-rectangle-2' )
            // R should also know that it is now connected to M
            expect( rightLinkableRectangle.linkLeft().id() ).toBe( 'linkable-rectangle-1' )

        })

    })


    test ('There should be Polygon objects between connected objects', () => {

        shape.LinkableRectangle.uniqueIdCounter(0)

        initializeDomWithSvg()
        const leftRectangle = new shape.LinkableRectangle()
            .build()
        const middleRectangle = new shape.LinkableRectangle()
            .build()
        const rightRectangle = new shape.LinkableRectangle()
            .build()

        // L --> M //

        leftRectangle
            .linkRight(middleRectangle)
            .update()

        // There should be a polygon between L and M, and both objects have the same polygon registered in them
        expect( leftRectangle.connectorObjects('right').id() ).toBe( 'connector-linkable-rectangles-0-1' )
        expect( middleRectangle.connectorObjects('left').id() ).toBe( 'connector-linkable-rectangles-0-1' )


        // R --> M //

        rightRectangle
            .linkLeft(middleRectangle)
            .update()

        // There should be a polygon between R and M, and both objects have the same polygon registered in them
        expect( rightRectangle.connectorObjects('left').id() ).toBe( 'connector-linkable-rectangles-2-1' )
        expect( middleRectangle.connectorObjects('left').id() ).toBe( 'connector-linkable-rectangles-0-1' )


    })


    test ('There should be the the right number of Polygon objects between connected objects', () => {

        shape.LinkableRectangle.uniqueIdCounter(0)

        initializeDomWithSvg()
        const leftLinkableRectangle = new shape.LinkableRectangle()
            .build()
        const rightLinkableRectangle = new shape.LinkableRectangle()
            .build()

        // L --> R //

        leftLinkableRectangle
            .linkRight(rightLinkableRectangle)
            .update()

        // There should be a polygon between L and R, and both objects have the same polygon registered in them
        expect( leftLinkableRectangle.connectorObjects('right').id() ).toBe( 'connector-linkable-rectangles-0-1' )
        expect( rightLinkableRectangle.connectorObjects('left').id() ).toBe( 'connector-linkable-rectangles-0-1' )

        // There should be only one polygon on DOM
        expect( document.querySelectorAll('polygon').length ).toBe( 1 )

    })


    //// Setting a Different Container Element for Connectors ///////////////////////////////////////////////////////////////

    describe ('Setting a different container element for connectors', () => {

        
        test ('LinkableRectangle and Polygon object should have the same parent in HTML (i.e., `g`)', () => {

            shape.LinkableRectangle.uniqueIdCounter(0)

            initializeDomWithSvg()
            const leftLinkableRectangle = new shape.LinkableRectangle()
                .build()
            const rightLinkableRectangle = new shape.LinkableRectangle()
                .build()

            // Link rectangles
            leftLinkableRectangle.linkRight(rightLinkableRectangle).update()

            // Get Ids of rectangles and connector
            expect( leftLinkableRectangle.id() ).toBe( "linkable-rectangle-0" )
            expect( rightLinkableRectangle.id() ).toBe( "linkable-rectangle-1" )
            expect( leftLinkableRectangle.connectorObjects('right')
                .id() ).toBe( 'connector-linkable-rectangles-0-1' )

            // Get elements on DOM
            const leftLinkableRectangleElementOnDom = document.querySelector( '#linkable-rectangle-0' )
            const rightLinkableRectangleElementOnDom = document.querySelector( '#linkable-rectangle-1' )
            const connectorElementOnDom = document.querySelector( '#connector-linkable-rectangles-0-1' )

            // Check parents of elements on DOM
            expect( leftLinkableRectangleElementOnDom.parentNode.nodeName ).toBe( 'svg' )
            expect( rightLinkableRectangleElementOnDom.parentNode.nodeName ).toBe( 'svg' )
            expect( connectorElementOnDom.parentNode.nodeName ).toBe( 'svg' )

        })



        test ('If a custom parent element for connectors is specified in one of the linked objects, the other objects must not conflict with this', () => {

            initializeDomWithSvg()

            // Create a container to be used as a custom parent element for connectors
            const customContainerElementForLinkableRectangle = new container.Group()
                .id('custom-parent-element')
                .update()

            // Initialize a rectangle with a custom parent for connectors
            const customizedLinkableRectangle = new shape.LinkableRectangle()
                .customParentContainerSelectionForConnectors( customContainerElementForLinkableRectangle.select() )
                .build()

            // Initialize a rectangle with NO custom parent for connectors
            const defaultLinkableRectangle = new shape.LinkableRectangle()
                .build()

            // Link rectangles
            customizedLinkableRectangle.linkRight(defaultLinkableRectangle).update()


            expect( defaultLinkableRectangle.customParentContainerSelectionForConnectors().attr('id') )
                .toBe( "custom-parent-element" )


            // // Both rectangles should have the same custom parent element selection for connectors
            expect( customizedLinkableRectangle.customParentContainerSelectionForConnectors().attr('id') )
                .toBe( "custom-parent-element" )
            expect( defaultLinkableRectangle.customParentContainerSelectionForConnectors().attr('id') )
                .toBe("custom-parent-element" )


        })


        test ('Should give error if two objects do not agree on the same custom connector parent selection', () => {


            initializeDomWithSvg()
            const defaultLinkableRectangle = new shape.LinkableRectangle()
                .build()
            expect( defaultLinkableRectangle.customParentContainerSelectionForConnectors() )
                .toBe(null )


            const customContainerElementForLinkableRectangle = new container.Group()

            const customizedLinkableRectangle = new shape.LinkableRectangle()
                .customParentContainerSelectionForConnectors( customContainerElementForLinkableRectangle.select() )
                .build()

            // Link rectangles
            defaultLinkableRectangle.linkRight(customizedLinkableRectangle).update()


        })


        test ('It should be possible to initialize Polygon object in another parent HTML group (i.e., `g`) element, regardless of the group of rectangle', () => {

            shape.LinkableRectangle.uniqueIdCounter(0)

            initializeDomWithSvg()
            const defaultLinkableRectangle = new shape.LinkableRectangle()
                .build()
            expect( defaultLinkableRectangle.customParentContainerSelectionForConnectors() )
                .toBe(null )


            const customContainerElementForLinkableRectangle = new container.Group()

            const customizedLinkableRectangle = new shape.LinkableRectangle()
                .customParentContainerSelectionForConnectors( customContainerElementForLinkableRectangle.select() )
                .build()

            // Link rectangles
            defaultLinkableRectangle.linkRight(customizedLinkableRectangle).update()

            // Get Ids of rectangles and connector
            expect( defaultLinkableRectangle.id() ).toBe( "linkable-rectangle-0" )
            expect( customizedLinkableRectangle.id() ).toBe( "linkable-rectangle-1" )
            expect( defaultLinkableRectangle.connectorObjects('right')
                .id() ).toBe( 'connector-linkable-rectangles-0-1' )

            // Get elements on DOM
            const defaultLinkableRectangleElementOnDom = document.querySelector( '#linkable-rectangle-0' )
            const customizedLinkableRectangleElementOnDom = document.querySelector( '#linkable-rectangle-1' )
            const connectorElementOnDom = document.querySelector( '#connector-linkable-rectangles-0-1' )

            // Check parents of elements on DOM
            expect( defaultLinkableRectangleElementOnDom.parentNode.nodeName ).toBe( 'svg' )
            expect( customizedLinkableRectangleElementOnDom.parentNode.nodeName ).toBe( 'svg' )

            // Connector element's parent should be different
            expect( connectorElementOnDom.parentNode.nodeName ).toBe( 'g' )


        })


    })


    //// Coordinates ///////////////////////////////////////////////////////////////

    describe ('Coordinates', () => {

        test ('When two LinkableRectangles are linked, the coordinates of connector object must be correct', () => {

            shape.LinkableRectangle.uniqueIdCounter(0)
            initializeDomWithSvg()

            // Initialize a rectangle
            const rectangle0 = new shape.LinkableRectangle()
                .build()

            // Initialize another rectangle
            const rectangle1 = new shape.LinkableRectangle()
                .x(100)
                .y(100)
                .build()

            // Link rectangles
            rectangle0.linkRight(rectangle1).update()

            const pointsOfConnector = rectangle0.connectorObjects('right').pointsAsNumbers()
            expect( pointsOfConnector ).toEqual( [[50, 0], [100, 100], [100, 150], [50, 50]] )
            const leftEdgeOfConnector = [pointsOfConnector[0], pointsOfConnector[3]]
            const rightEdgeOfConnector = [pointsOfConnector[1], pointsOfConnector[2]]

            const linkedEdgeOfRectangle0 = [rectangle0.topRightCorner(), rectangle0.bottomRightCorner()]
            const linkedEdgeOfRectangle1 = [rectangle1.topLeftCorner(), rectangle1.bottomLeftCorner()]


            expect( linkedEdgeOfRectangle0 ).toEqual( [[50, 0], [50, 50]] )
            expect( leftEdgeOfConnector ).toEqual( [[50, 0], [50, 50]] )
            expect( linkedEdgeOfRectangle0 ).toEqual( leftEdgeOfConnector )

        })


        test ('When the position and height of rectangles change, connector polygons should adapt', () => {

            jest.useFakeTimers()

            shape.LinkableRectangle.uniqueIdCounter(0)
            initializeDomWithSvg()

            // Initialize a rectangle
            const leftRectangle = new shape.LinkableRectangle()
                .id('left-rectangle')
                .x(10)
                .y(10)
                .build()

            // Initialize another rectangle
            const rightRectangle = new shape.LinkableRectangle()
                .id('right-rectangle')
                .x(100)
                .y(100)
                .build()



            // Link rectangles
            leftRectangle.linkRight(rightRectangle).update()

            const pointsOfConnector = leftRectangle.connectorObjects('right').pointsAsNumbers()
            expect( pointsOfConnector ).toEqual( [[60, 10], [100, 100], [100, 150], [60, 60]] )

            const {
                rightEdgeOfLeftRectangle, leftEdgeOfConnector,
                leftEdgeOfRightRectangle, rightEdgeOfConnector
            } = getRelevantPointsForLRConnection(leftRectangle, rightRectangle)


            expect( rightEdgeOfLeftRectangle ).toEqual( leftEdgeOfConnector )
            expect( leftEdgeOfRightRectangle ).toEqual( rightEdgeOfConnector )


            // Change one rectangle
            rightRectangle
                .x(200)
                .y(200)
                .height(200)
                .update()

            jest.runOnlyPendingTimers()
            jest.runAllTimers()

            const{
                rightEdgeOfLeftRectangle:rightEdgeOfLeftRectangleAfterMove, leftEdgeOfConnector:leftEdgeOfConnectorAfterMove,
                leftEdgeOfRightRectangle:leftEdgeOfRightRectangleAfterMove, rightEdgeOfConnector:rightEdgeOfConnectorAfterMove
            } = getRelevantPointsForLRConnection(leftRectangle, rightRectangle)

            expect( rightEdgeOfLeftRectangleAfterMove ).toEqual( leftEdgeOfConnectorAfterMove )
            expect( leftEdgeOfRightRectangleAfterMove ).toEqual( rightEdgeOfConnectorAfterMove )

        })


        // Helper function(s)

        function getRelevantPointsForLRConnection(leftRectangle, rightRectangle){

            const pointsOfConnector = leftRectangle.connectorObjects('right').pointsAsNumbers()

            const rightEdgeOfLeftRectangle = [leftRectangle.topRightCorner(), leftRectangle.bottomRightCorner()]
            const leftEdgeOfConnector = [pointsOfConnector[0], pointsOfConnector[3]]

            const leftEdgeOfRightRectangle = [rightRectangle.topLeftCorner(), rightRectangle.bottomLeftCorner()]
            const rightEdgeOfConnector = [pointsOfConnector[1], pointsOfConnector[2]]

            return {rightEdgeOfLeftRectangle, leftEdgeOfConnector, leftEdgeOfRightRectangle, rightEdgeOfConnector}
        }


    })



    test ('Get/set connector objects', () => {


        initializeDomWithSvg()
        const myLinkableRectangle = new shape.LinkableRectangle()
            .build()

        // Set
        myLinkableRectangle.connectorObjects('left', new shape.Polygon() )
        myLinkableRectangle.connectorObjects('right', new shape.Polygon() )
        myLinkableRectangle.connectorObjects('anyOtherDirection', new shape.Polygon() )

        // Get
        expect( myLinkableRectangle.connectorObjects('left').hasType() ).toBe( 'Polygon' )
        expect( myLinkableRectangle.connectorObjects('right').hasType() ).toBe( 'Polygon' )
        expect( myLinkableRectangle.connectorObjects('anyOtherDirection').hasType() ).toBe( 'Polygon' )


        // Return undefined if a non-existent key is requested
        expect( myLinkableRectangle.connectorObjects('previouslyUnsetKey') ).toBeUndefined()


        // Return undefined if a key was requested while there is nothing in registry
        myLinkableRectangle._connectorObjects = null
        expect( myLinkableRectangle.connectorObjects('someKey') ).toBeUndefined()


    })

})
