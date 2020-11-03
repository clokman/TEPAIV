//// UNIT TESTS //////////////////////////////////////////////////////////////////////////////////////////////////////


//// Ensemble ///////////////////////////////////////////////////////////////

describe( 'Ensemble', () => {


    //// Validation ///////////////////////////////////////////////////////////////

    describe( 'Validation', () => {


        test( 'Do not allow self-to-self connections', () => {

            // Reset ID counter
            shape.LinkableRectangle.uniqueIdCounter( 0 )

            // Initialize a rectangle
            const myRectangle = new shape.LinkableRectangle()
                .build()

            // Link rectangles
            expect( () => {
                myRectangle.linkRight( myRectangle ).update()
            } ).toThrow( `An ensemble member cannot be linked to itself. The attempt was made to link the object with the id 'linkable-rectangle-0' with type 'LinkableRectangle' to itself.` )


            expect( () => {
                myRectangle.linkLeft( myRectangle ).update()
            } ).toThrow( `An ensemble member cannot be linked to itself. The attempt was made to link the object with the id 'linkable-rectangle-0' with type 'LinkableRectangle' to itself.` )

        } )


        test( 'Do not allow an object to be linked to both right and left', () => {

            // Reset ID generator
            shape.LinkableRectangle.uniqueIdCounter( 0 )

            // Initialize a rectangle
            const rectangle0 = new shape.LinkableRectangle()
                .build()

            // Initialize another rectangle
            const rectangle1 = new shape.LinkableRectangle()
                .build()

            // Link rectangle to one side
            rectangle0.linkRight( rectangle1 ).update()

            // Link the same rectangle to the other side
            expect( () => {
                rectangle0.linkLeft( rectangle1 ).update()
            } ).toThrow( `It was attempted to add the same object more than once to the 'linkedObjects' registry of the ensemble member with the id (if available) 'linkable-rectangle-0'. This may indicate the use of the same object in more than one link slot or a recurrent link between two ensemble members. The type of the object that was attempted to be added to the registry is 'LinkableRectangle' and its id is (if available) 'linkable-rectangle-1'.` )

        } )


        test( 'Do not allow recurrent connections in ensemble', () => {

            shape.LinkableRectangle.uniqueIdCounter( 0 )

            // Initialize a rectangle
            const rectangle0 = new shape.LinkableRectangle()
                .build()

            // Initialize another rectangle
            const rectangle1 = new shape.LinkableRectangle()
                .build()

            // Link rectangles
            rectangle0.linkRight( rectangle1 ).update()

            // It should not be possible to have a recurrent connection between two objects in the ensemble (e.g, a
            // <-linkRight()-> b)
            expect( () => {
                rectangle1.linkRight( rectangle0 ).update()
            } ).toThrow( `It was attempted to add the same object more than once to the 'linkedObjects' registry of the ensemble member with the id (if available) 'linkable-rectangle-1'. This may indicate the use of the same object in more than one link slot or a recurrent link between two ensemble members. The type of the object that was attempted to be added to the registry is 'LinkableRectangle' and its id is (if available) 'linkable-rectangle-0'.` )

        } )


        test( 'Do not allow two ensemble members to have the same html ID', () => {

            const rectangle0 = new shape.LinkableRectangle()
                .id( 'same-id' )
                .build()

            // Initialize another rectangle
            const rectangle1 = new shape.LinkableRectangle()
                .id( 'same-id' )
                .build()


            // Link rectangles
            expect( () => {
                rectangle0.linkRight( rectangle1 ).update()
            } ).toThrow( 'IDs of objects being linked cannot be both \'same-id\'.' )



        } )


    } )



    //// Registration of and to the Ensemble ///////////////////////////////////////////////////////////////

    describe( 'Registration of/to the Ensemble', () => {


        test( 'When a link between two LinkableRectangle objects is made, both objects should be registered to the same Ensemble', () => {

            // Initialize a rectangle
            const leftRectangle = new shape.LinkableRectangle()
                .id( 'left-rectangle' )
                .build()

            // Initialize another rectangle
            const rightRectangle = new shape.LinkableRectangle()
                .id( 'right-rectangle' )
                .build()

            // Link rectangles (using LINKRIGHT)
            leftRectangle.linkRight( rightRectangle ).update()

            expect( leftRectangle.ensembleObject.hasType() ).toBe( 'Ensemble' )
            expect( rightRectangle.ensembleObject.hasType() ).toBe( 'Ensemble' )


            // Both linked objects should have the same Ensemble registered in them
            expect( leftRectangle.ensembleObject ).toEqual( rightRectangle.ensembleObject )



            // And the ensemble object should have both objects registered in it
            expect( Array.from( leftRectangle.ensembleObject.members().keys() ) ).toEqual(
                [ 'left-rectangle', 'right-rectangle' ]
            )



            // Register a third object //
            // Initialize a rectangle
            const additionalRectangle = new shape.LinkableRectangle()
                .id( 'additional-rectangle' )
                .build()

            // Link new rectangle to the others (using LINKLEFT)
            additionalRectangle.linkLeft( rightRectangle ).update()


            // Additional rectangle should have the same Ensemble registered in it
            expect( additionalRectangle.ensembleObject ).toEqual( rightRectangle.ensembleObject )
            expect( additionalRectangle.ensembleObject ).toEqual( leftRectangle.ensembleObject )


            // And the ensemble obj§ect should have both the additional rectangle registered in it
            expect( Array.from( leftRectangle.ensembleObject.members().keys() ) ).toEqual(
                [ 'left-rectangle', 'right-rectangle', 'additional-rectangle' ]
            )

        } )

    } )



    //// Flood Control ///////////////////////////////////////////////////////////////

    describe( 'Flood Control', () => {



        beforeEach( () => {

            // Add spy
            jest.clearAllMocks()
            jest.spyOn(
                shape.LinkableRectangle.prototype,
                'update'
            )

        } )

        test( 'There shouldn\'t be too many calls to the update method when an ensemble is being formed', () => {

            // Initialize a rectangle
            const leftRectangle = new shape.LinkableRectangle()
                .id( 'left-rectangle' )
                .build()
            expect( shape.LinkableRectangle.prototype.update ).toHaveBeenCalledTimes( 1 )

            // Initialize another rectangle
            const middleLeftRectangle = new shape.LinkableRectangle()
                .id( 'middle-left-rectangle' )
                .build()
            expect( shape.LinkableRectangle.prototype.update ).toHaveBeenCalledTimes( 2 )

            const middleRightRectangle = new shape.LinkableRectangle()
                .id( 'middle-right-rectangle' )
                .build()
            expect( shape.LinkableRectangle.prototype.update ).toHaveBeenCalledTimes( 3 )

            // Initialize another rectangle
            const rightRectangle = new shape.LinkableRectangle()
                .id( 'right-rectangle' )
                .build()
            expect( shape.LinkableRectangle.prototype.update ).toHaveBeenCalledTimes( 4 )


            // Link new rectangle to the other
            leftRectangle.linkRight( middleLeftRectangle ).update()
            expect( shape.LinkableRectangle.prototype.update ).toHaveBeenCalledTimes( 5 )
            leftRectangle.linkRight( middleLeftRectangle ).updateAll()
            expect( shape.LinkableRectangle.prototype.update ).toHaveBeenCalledTimes( 8 )


            middleLeftRectangle.linkRight( middleRightRectangle ).update()
            expect( shape.LinkableRectangle.prototype.update ).toHaveBeenCalledTimes( 9 )
            leftRectangle.linkRight( middleLeftRectangle ).updateAll()
            expect( shape.LinkableRectangle.prototype.update ).toHaveBeenCalledTimes( 13 )


            middleRightRectangle.linkRight( rightRectangle ).update()
            expect( shape.LinkableRectangle.prototype.update ).toHaveBeenCalledTimes( 14 )
            leftRectangle.linkRight( middleLeftRectangle ).updateAll()
            expect( shape.LinkableRectangle.prototype.update ).toHaveBeenCalledTimes( 19 )

        } )

    } )




} )




//// Instantiation ////////////////////////////////////////////////////////////


describe( 'Instantiation', () => {

    test( 'Instantiate a LinkableRectangle class object with default options', () => {

        initializeDomWithSvg()
        const myRectangle = new shape.LinkableRectangle()
            .build()

        // // Verify that the object exists
        expect( myRectangle ).toBeDefined()

        // Verify that the DOM counterpart of the object exists
        expect( document.getElementsByTagName( 'rect' ).length )
            .toBe( 1 )

        // Verify that the DOM counterpart of the object exists
        expect( document.getElementsByClassName( 'linkable-rectangle' ).length )
            .toBe( 1 )

    } )


    //// ID generation ///////////////////////////////////////////////////////////////

    describe( 'ID generation', () => {


        test( 'It should be possible to reset LinkableRectangle counter', () => {

            // Unique ID counter should be reset to 0 (may not be so due to previous tests)
            shape.LinkableRectangle.uniqueIdCounter( 0 )
            expect( shape.LinkableRectangle.uniqueIdCounter() ).toBe( 0 )


            // First Object //

            // Id postfix should be 0 for the first LinkableRectangle
            initializeDomWithSvg()
            const myLinkableRectangle0 = new shape.LinkableRectangle()
                .build()

            // Current id number and id should be 0
            expect( myLinkableRectangle0.id() ).toBe( 'linkable-rectangle-0' )

            // Unique ID counter should be incremented for the next object
            expect( shape.LinkableRectangle.uniqueIdCounter() ).toBe( 1 )


            // Second Object //

            // Id postfix should be incremented by now
            initializeDomWithSvg()
            const myLinkableRectangle1 = new shape.LinkableRectangle()
                .build()

            // Current ID
            expect( myLinkableRectangle1.id() ).toBe( 'linkable-rectangle-1' )



            // Reset ID Counter //
            shape.LinkableRectangle.uniqueIdCounter( 0 )



            // Third Object //

            initializeDomWithSvg()
            const myLinkableRectangle2 = new shape.LinkableRectangle()
                .build()

            // Current ID
            expect( myLinkableRectangle2.id() ).toBe( 'linkable-rectangle-0' )


        } )


        test( 'idNumber() should return the unique id `Number`, but if it is used to set a value, it should return an error', () => {

            // Reset unique id counter
            shape.LinkableRectangle.uniqueIdCounter( 0 )


            // First Object //

            // Id postfix should be 0 for the first LinkableRectangle
            initializeDomWithSvg()
            const myLinkableRectangle0 = new shape.LinkableRectangle()
                .build()

            // Current id number and id should be 0
            expect( myLinkableRectangle0.idNumber() ).toBe( 0 )
            expect( myLinkableRectangle0.id() ).toBe( 'linkable-rectangle-0' )

            // Unique ID counter should be incremented for the next object
            expect( shape.LinkableRectangle.uniqueIdCounter() ).toBe( 1 )



            // Second Object //

            // Id postfix should be incremented by now
            initializeDomWithSvg()
            const myLinkableRectangle1 = new shape.LinkableRectangle()
                .build()

            // Current id number and id
            expect( myLinkableRectangle1.idNumber() ).toBe( 1 )
            expect( myLinkableRectangle1.id() ).toBe( 'linkable-rectangle-1' )


        } )


    } )

} )




//// Inheritance of Attributes During Init ///////////////////////////////////////////////////////////////

describe( 'Inheritance of Field Values During Init', () => {


    test( 'New members should adopt the shared field values of the existing ones (in this test, shared fields are' +
        ' set manually )', () => {

        // Initialize a rectangle
        const customizedRectangle = new shape.LinkableRectangle()
            .id( 'customized-rectangle' )

        // Customize a field
        expect( customizedRectangle.fill() ).not.toBe( 'salmon' )
        customizedRectangle
            .fill( 'salmon' )
            .build()

        // Specify which field is shared
        customizedRectangle.sharedSettersAndValues(
            customizedRectangle.fill.name, customizedRectangle.fill()
        )



        // Initialize another rectangle with DEFAULT settings
        const defaultRectangle = new shape.LinkableRectangle()
            .id( 'default-rectangle' )
            .build()
        expect( defaultRectangle.fill() ).toBe( 'gray' )


        // Link rectangles (using LINKRIGHT)
        customizedRectangle.linkRight( defaultRectangle ).update()


        // After linking, both rectangles should have the same field value
        expect( defaultRectangle.fill() ).toBe( 'salmon' )
        expect( customizedRectangle.fill() ).toBe( 'salmon' )


    } )


    test( 'New members should adopt the shared field values of existing ones (in this test, use shared fields already' +
        ' defined in class)', () => {

        // Create the middle rectangle with CUSTOM values
        const customMiddleRectangle = new shape.LinkableRectangle()
            .id( 'custom-middle-rectangle' )

        expect( customMiddleRectangle.fill() ).not.toBe( 'salmon' )
        expect( customMiddleRectangle.stroke() ).not.toBe( 'dodgerblue' )
        expect( customMiddleRectangle.strokeWidth() ).not.toBe( '10px' )

        customMiddleRectangle
            .fill( 'salmon' )
            .stroke( 'dodgerblue' )
            .strokeWidth( '10px' )
            .build()

        customMiddleRectangle.sharedSettersAndValues(
            customMiddleRectangle.fill.name, customMiddleRectangle.fill()
        )

        // Create the right rectangle with DEFAULT values
        const defaultLeftRectangle = new shape.LinkableRectangle()
            .id( 'default-left-rectangle' )

            .build()
        expect( defaultLeftRectangle.fill() ).not.toBe( 'salmon' )
        expect( defaultLeftRectangle.stroke() ).not.toBe( 'dodgerblue' )
        expect( defaultLeftRectangle.strokeWidth() ).not.toBe( '10px' )


        // Create the left rectangle with DEFAULT values
        const defaultRightRectangle = new shape.LinkableRectangle()
            .id( 'default-right-rectangle' )
            .build()

        expect( defaultRightRectangle.fill() ).not.toBe( 'salmon' )
        expect( defaultRightRectangle.stroke() ).not.toBe( 'dodgerblue' )
        expect( defaultRightRectangle.strokeWidth() ).not.toBe( '10px' )



        // LINK RIGHT //
        customMiddleRectangle.linkRight( defaultRightRectangle ).update()

        // After it is linked to the customMiddleRectangle, defaultRightRectangle should have 'inherited' the values
        // from the first rectangle
        expect( defaultRightRectangle.fill() ).toBe( 'salmon' )
        expect( defaultRightRectangle.stroke() ).toBe( 'dodgerblue' )
        expect( defaultRightRectangle.strokeWidth() ).toBe( '10px' )


        // LINK LEFT //
        // Inheritance should work exactly the same way for linkLeft()

        customMiddleRectangle.linkLeft( defaultLeftRectangle ).update()

        // After it is linked to the customMiddleRectangle, defaultRightRectangle should have 'inherited' the values
        // from the first rectangle
        expect( defaultLeftRectangle.fill() ).toBe( 'salmon' )
        expect( defaultLeftRectangle.stroke() ).toBe( 'dodgerblue' )
        expect( defaultLeftRectangle.strokeWidth() ).toBe( '10px' )

    } )



    //// Solving conflicts ///////////////////////////////////////////////////////////////

    describe( 'Solving conflicts', () => {


        test( 'Field values of the object at the left side of linking expression should take precedence over the' +
            ' values of the object on the right side (`linkRight()` variant of the test)', () => {


            // Create a rectangle with CUSTOM values
            const customMiddleRectangle = new shape.LinkableRectangle()
                .id( 'custom-middle-rectangle' )

            expect( customMiddleRectangle.fill() ).not.toBe( 'salmon' )
            expect( customMiddleRectangle.stroke() ).not.toBe( 'dodgerblue' )
            expect( customMiddleRectangle.strokeWidth() ).not.toBe( '10px' )

            customMiddleRectangle
                .fill( 'salmon' )
                .stroke( 'dodgerblue' )
                .strokeWidth( '10px' )
                .build()


            // Create a rectangle with DEFAULT values
            const defaultRightRectangle = new shape.LinkableRectangle()
                .id( 'default-right-rectangle' )

            // Create another rectangle with DEFAULT values
            const defaultLeftRectangle = new shape.LinkableRectangle()
                .id( 'default-right-rectangle' )

                .build()
            expect( defaultRightRectangle.fill() ).not.toBe( 'salmon' )
            expect( defaultRightRectangle.stroke() ).not.toBe( 'dodgerblue' )
            expect( defaultRightRectangle.strokeWidth() ).not.toBe( '10px' )



            // `customMiddleRectangle` should be dominant when setting values of ensemble during linking
            customMiddleRectangle.linkRight( defaultRightRectangle ).updateAll()

            expect( customMiddleRectangle.fill() ).toBe( 'salmon' )
            expect( defaultRightRectangle.fill() ).toBe( 'salmon' )

            expect( customMiddleRectangle.strokeWidth() ).toBe( '10px' )
            expect( defaultRightRectangle.strokeWidth() ).toBe( '10px' )

            expect( defaultRightRectangle.stroke() ).toBe( 'dodgerblue' )
            expect( customMiddleRectangle.stroke() ).toBe( 'dodgerblue' )



            // `defaultLeftRectangle` should be dominant when setting values of ensemble during linking
            defaultLeftRectangle.linkRight( customMiddleRectangle ).updateAll()

            expect( defaultLeftRectangle.fill() ).toBe( 'gray' )
            expect( customMiddleRectangle.fill() ).toBe( 'gray' )
            expect( defaultRightRectangle.fill() ).toBe( 'gray' )

            expect( defaultLeftRectangle.stroke() ).toBe( 'rgba(0, 0, 0, 0.0)' )
            expect( customMiddleRectangle.stroke() ).toBe( 'rgba(0, 0, 0, 0.0)' )
            expect( defaultRightRectangle.stroke() ).toBe( 'rgba(0, 0, 0, 0.0)' )

            expect( defaultLeftRectangle.strokeWidth() ).toBe( '1px' )
            expect( customMiddleRectangle.strokeWidth() ).toBe( '1px' )
            expect( defaultRightRectangle.strokeWidth() ).toBe( '1px' )


        } )


        test( 'Field values of the object at the left side of linking expression should take precedence over the' +
            ' values of the object on the right side (`linkLeft()` variant of the test)', () => {


            // Create a rectangle with CUSTOM values
            const customMiddleRectangle = new shape.LinkableRectangle()
                .id( 'custom-middle-rectangle' )

            expect( customMiddleRectangle.fill() ).not.toBe( 'salmon' )
            expect( customMiddleRectangle.stroke() ).not.toBe( 'dodgerblue' )
            expect( customMiddleRectangle.strokeWidth() ).not.toBe( '10px' )

            customMiddleRectangle
                .fill( 'salmon' )
                .stroke( 'dodgerblue' )
                .strokeWidth( '10px' )
                .build()


            // Create a rectangle with DEFAULT values
            const defaultRightRectangle = new shape.LinkableRectangle()
                .id( 'default-right-rectangle' )

            // Create another rectangle with DEFAULT values
            const defaultLeftRectangle = new shape.LinkableRectangle()
                .id( 'default-right-rectangle' )

                .build()
            expect( defaultRightRectangle.fill() ).not.toBe( 'salmon' )
            expect( defaultRightRectangle.stroke() ).not.toBe( 'dodgerblue' )
            expect( defaultRightRectangle.strokeWidth() ).not.toBe( '10px' )



            // `customMiddleRectangle` should be dominant when setting values of ensemble during linking
            customMiddleRectangle.linkLeft( defaultLeftRectangle ).update()

            expect( customMiddleRectangle.fill() ).toBe( 'salmon' )
            expect( defaultLeftRectangle.fill() ).toBe( 'salmon' )

            expect( customMiddleRectangle.strokeWidth() ).toBe( '10px' )
            expect( defaultLeftRectangle.strokeWidth() ).toBe( '10px' )

            expect( defaultLeftRectangle.stroke() ).toBe( 'dodgerblue' )
            expect( customMiddleRectangle.stroke() ).toBe( 'dodgerblue' )



            // `defaultRightRectangle` should be dominant when setting values of ensemble during linking
            defaultRightRectangle.linkLeft( customMiddleRectangle ).update()




            // FIELDS OF OBJECTS ON THE LEFT HAVE PRECEDENCE OVER THE ONES ON THE RIGHT: Any rectangles on the left
            //  have precedence over the ones on the right. That is, the linking object (e.g.,
            //  `linkingObj.linkLeft(objectBeingLinked)`) have precedence over the object that is being linked. This is
            //  an unwanted pattern that is currently solved with a workaround during use:

            // A workaround to synchronize field values
            customMiddleRectangle.fill( defaultRightRectangle.fill() )
            defaultLeftRectangle.fill( defaultRightRectangle.fill() )

            customMiddleRectangle.stroke( defaultRightRectangle.stroke() )
            defaultLeftRectangle.stroke( defaultRightRectangle.stroke() )

            customMiddleRectangle.strokeWidth( defaultRightRectangle.strokeWidth() )
            defaultLeftRectangle.strokeWidth( defaultRightRectangle.strokeWidth() )


            expect( defaultRightRectangle.fill() ).toBe( 'gray' )
            expect( customMiddleRectangle.fill() ).toBe( 'gray' )
            expect( defaultLeftRectangle.fill() ).toBe( 'gray' )

            expect( defaultRightRectangle.stroke() ).toBe( 'rgba(0, 0, 0, 0.0)' )
            expect( customMiddleRectangle.stroke() ).toBe( 'rgba(0, 0, 0, 0.0)' )
            expect( defaultLeftRectangle.stroke() ).toBe( 'rgba(0, 0, 0, 0.0)' )

            expect( defaultRightRectangle.strokeWidth() ).toBe( '1px' )
            expect( customMiddleRectangle.strokeWidth() ).toBe( '1px' )
            expect( defaultLeftRectangle.strokeWidth() ).toBe( '1px' )



        } )


    } )


} )



//// Setting Shared Field Values ///////////////////////////////////////////////////////////////

describe( 'Setting Shared Field Values', () => {


    test( 'When a shared field value is changed in one rectangle, all recangles should change accordingly' +
        ' (`linkLeft()` variant)', () => {

        initializeDomWithSvg()
        const leftRectangle = new shape.LinkableRectangle()
            .id( 'left-rectangle' )
            .build()

        const rightRectangle = new shape.LinkableRectangle()
            .id( 'right-rectangle' )
            .build()

        expect( leftRectangle.fill() ).not.toBe( 'salmon' )
        expect( leftRectangle.stroke() ).not.toBe( 'dodgerblue' )
        expect( leftRectangle.strokeWidth() ).not.toBe( '5px' )

        expect( rightRectangle.fill() ).not.toBe( 'salmon' )
        expect( rightRectangle.stroke() ).not.toBe( 'dodgerblue' )
        expect( rightRectangle.strokeWidth() ).not.toBe( '5px' )



        // L -> R Propagation //

        // Link rectangles ( using LINKLEFT() )
        rightRectangle.linkLeft( leftRectangle ).update()



        // Change shared field values in LEFT rectangle
        leftRectangle
            .fill( 'salmon' )
            .stroke( 'dodgerblue' )
            .strokeWidth( '5px' )
            .update()

        // Values in the other rectangle should match to the newly set values
        expect( rightRectangle.fill() ).toBe( 'salmon' )
        expect( rightRectangle.stroke() ).toBe( 'dodgerblue' )
        expect( rightRectangle.strokeWidth() ).toBe( '5px' )



        // R -> L Propagation //

        // Change shared field values in RIGHT rectangle
        rightRectangle
            .fill( 'navy' )
            .stroke( 'darkred' )
            .strokeWidth( '10px' )
            .update()

        expect( leftRectangle.fill() ).toBe( 'navy' )
        expect( leftRectangle.stroke() ).toBe( 'darkred' )
        expect( leftRectangle.strokeWidth() ).toBe( '10px' )

    } )


    test( 'When a shared field value is changed in one rectangle, all recangles should change accordingly' +
        ' (`linkRight()` variant)', () => {

        initializeDomWithSvg()
        const leftRectangle = new shape.LinkableRectangle()
            .id( 'left-rectangle' )
            .build()

        const rightRectangle = new shape.LinkableRectangle()
            .id( 'right-rectangle' )
            .build()

        expect( leftRectangle.fill() ).not.toBe( 'salmon' )
        expect( leftRectangle.stroke() ).not.toBe( 'dodgerblue' )
        expect( leftRectangle.strokeWidth() ).not.toBe( '5px' )

        expect( rightRectangle.fill() ).not.toBe( 'salmon' )
        expect( rightRectangle.stroke() ).not.toBe( 'dodgerblue' )
        expect( rightRectangle.strokeWidth() ).not.toBe( '5px' )



        // L -> R Propagation //

        // Link rectangles ( using LINKRIGHT() )
        leftRectangle.linkRight( rightRectangle ).update()



        // Change shared field values in LEFT rectangle
        leftRectangle
            .fill( 'salmon' )
            .stroke( 'dodgerblue' )
            .strokeWidth( '5px' )
            .update()

        // Values in the other rectangle should match to the newly set values
        expect( rightRectangle.fill() ).toBe( 'salmon' )
        expect( rightRectangle.stroke() ).toBe( 'dodgerblue' )
        expect( rightRectangle.strokeWidth() ).toBe( '5px' )



        // R -> L Propagation //

        // Change shared field values in RIGHT rectangle
        rightRectangle
            .fill( 'navy' )
            .stroke( 'darkred' )
            .strokeWidth( '10px' )
            .update()

        expect( leftRectangle.fill() ).toBe( 'navy' )
        expect( leftRectangle.stroke() ).toBe( 'darkred' )
        expect( leftRectangle.strokeWidth() ).toBe( '10px' )

    } )




    test( 'Set a field for more than one time in an ensemble', () => {

        const leftRectangle = new shape.LinkableRectangle()
            .id( 'left-rectangle' )
            .build()

        const rightRectangle = new shape.LinkableRectangle()
            .id( 'right-rectangle' )
            .x( 100 )  // position settings given in case this is viewed on DOM for debugging
            .y( 100 )
            .build()


        // Link rectangles
        leftRectangle.linkRight( rightRectangle ).update()


        // See which fields are shared
        expect( Array.from( leftRectangle.sharedSettersAndValues().keys() ) ).toEqual( [
            'customParentContainerSelectionForConnectors',
            'fill',
            'stroke',
            'strokeWidth'
        ] )


        // Modify a shared field
        expect( leftRectangle.fill() ).not.toBe( 'dodgerblue' )
        expect( rightRectangle.fill() ).not.toBe( 'dodgerblue' )

        leftRectangle.fill( 'dodgerblue' ).update()

        expect( leftRectangle.fill() ).toBe( 'dodgerblue' )
        expect( rightRectangle.fill() ).toBe( 'dodgerblue' )



        // Modify the same shared field again (Propagation: L => R)
        expect( leftRectangle.fill() ).not.toBe( 'salmon' )

        leftRectangle.fill( 'salmon' ).update()

        expect( leftRectangle.fill() ).toBe( 'salmon' )
        expect( rightRectangle.fill() ).toBe( 'salmon' )



        // Do the same thing for with the opposite direction (Propagation: R => L)
        expect( leftRectangle.fill() ).not.toBe( 'brick' )

        rightRectangle.fill( 'brick' ).update()

        expect( leftRectangle.fill() ).toBe( 'brick' )
        expect( rightRectangle.fill() ).toBe( 'brick' )



    } )




    test( 'It should be possible to revert to a default field value in the ensemble', () => {

        const leftRectangle = new shape.LinkableRectangle()
            .id( 'left-rectangle' )
            .build()

        const rightRectangle = new shape.LinkableRectangle()
            .id( 'right-rectangle' )
            .build()

        leftRectangleDefaults = new Map( [
            [ 'fill', leftRectangle.fill() ],
            [ 'stroke', leftRectangle.stroke() ],
            [ 'strokeWidth', leftRectangle.strokeWidth() ]
        ] )

        expect( leftRectangle.fill() ).not.toBe( 'salmon' )
        expect( leftRectangle.stroke() ).not.toBe( 'dodgerblue' )
        expect( leftRectangle.strokeWidth() ).not.toBe( '5px' )

        expect( rightRectangle.fill() ).not.toBe( 'salmon' )
        expect( rightRectangle.stroke() ).not.toBe( 'dodgerblue' )
        expect( rightRectangle.strokeWidth() ).not.toBe( '5px' )



        // L -> R Propagation //

        // Link rectangles ( using LINKRIGHT() )
        leftRectangle.linkRight( rightRectangle ).update()



        // Change shared field values in LEFT rectangle
        leftRectangle
            .fill( 'salmon' )
            .stroke( 'dodgerblue' )
            .strokeWidth( '5px' )
            .update()

        // Values in the other rectangle should match to the newly set values
        expect( rightRectangle.fill() ).toBe( 'salmon' )
        expect( rightRectangle.stroke() ).toBe( 'dodgerblue' )
        expect( rightRectangle.strokeWidth() ).toBe( '5px' )



        // Revert to the default values
        // Change shared field values in LEFT rectangle
        leftRectangle
            .fill( leftRectangleDefaults.get( 'fill' ) )
            .stroke( leftRectangleDefaults.get( 'stroke' ) )
            .strokeWidth( leftRectangleDefaults.get( 'strokeWidth' ) )
            .update()

        // Values in the other rectangle should match to the newly set values
        expect( rightRectangle.fill() ).toBe( leftRectangleDefaults.get( 'fill' ) )
        expect( rightRectangle.stroke() ).toBe( leftRectangleDefaults.get( 'stroke' ) )
        expect( rightRectangle.strokeWidth() ).toBe( leftRectangleDefaults.get( 'strokeWidth' ) )


    } )

} )




//// Removal ///////////////////////////////////////////////////////////////

describe( 'Removal', () => {

    let middleRectangle,
        rightRectangle,
        leftRectangle,
        ensembleObject

    // Setup
    beforeEach( () => {

        // Create rectangles
        middleRectangle = new shape.LinkableRectangle()
            .id( 'middle-rectangle' )
            .build()
        rightRectangle = new shape.LinkableRectangle()
            .id( 'right-rectangle' )
            .build()
        leftRectangle = new shape.LinkableRectangle()
            .id( 'left-rectangle' )
            .build()

        // Link rectangles
        // [L]️ <-- [M] --> [R]

        middleRectangle.linkRight( rightRectangle ).update()
        middleRectangle.linkLeft( leftRectangle ).update()


        ensembleObject = middleRectangle.ensembleObject  /* could be taken from any of the objects, as
                                                         linked objects all share the same Ensemble
                                                         object */

    } )


    test( 'Removing an ensemble member should deregister it from the Ensemble object', () => {

        // Initial state of rectangles
        // [L]️ <-- [M] --> [R]

        // Check Ensemble registry
        expect( Array.from( ensembleObject.members().keys() ) ).toEqual( [
            'middle-rectangle',
            'right-rectangle',
            'left-rectangle'
        ] )

        // Remove the left object from the ensemble and the DOM
        leftRectangle.remove()


        // The removed object should no longer be registered in the Ensemble object
        expect( Array.from( ensembleObject.members().keys() ) ).toEqual( [
            'middle-rectangle',
            'right-rectangle'
        ] )

    } )


    test( 'A removed ensemble member should no longer have an Ensemble object associated with it', () => {

        // Initial state of rectangles
        // [L]️ <-- [M] --> [R]

        // Initial state of the Ensemble object asociated with left rectangle
        expect( leftRectangle.ensembleObject ).toBeDefined()


        // Remove the left object from the ensemble and the DOM
        leftRectangle.remove()


        // And the removed object should no longer have an Ensemble object associated with it
        expect( leftRectangle.ensembleObject ).toBeUndefined()


    } )


    test( 'Removing an ensemble member should deregister it from any linked objects', () => {

        // Initial state of rectangles
        // [L]️ <-- [M] --> [R]

        // Check existing connections in registries of rectangles
        expect( leftRectangle.linkRight().id() ).toBe( 'middle-rectangle' )
        expect( rightRectangle.linkLeft().id() ).toBe( 'middle-rectangle' )


        // Remove the middle rectangle
        middleRectangle.remove()

        // Registries of other rectangles should no more contain the removed one
        expect( leftRectangle.linkRight() ).toBeUndefined()
        expect( rightRectangle.linkLeft() ).toBeUndefined()

    } )



    //// Singled out rectangles ///////////////////////////////////////////////////////////////

    describe( 'Singled out rectangles', () => {


        let firstRectangle,
            secondRectangle,
            ensembleObject

        // Setup
        beforeEach( () => {

            // Create rectangles
            firstRectangle = new shape.LinkableRectangle()
                .id( 'first-rectangle' )
                .build()
            secondRectangle = new shape.LinkableRectangle()
                .id( 'second-rectangle' )
                .build()


            // When not yet linked, no object should be coupled to an Ensemble object
            expect( firstRectangle.ensembleObject ).toBeUndefined()
            expect( secondRectangle.ensembleObject ).toBeUndefined()


            // Link rectangles
            firstRectangle.linkRight( secondRectangle ).update()

            // Save the ensemble object for later
            ensembleObject = firstRectangle.ensembleObject /* does not matter if its from the first or second
                                                            rectangle; they both have the same Ensemble object */
        } )


        test( 'A singled rectangle should not be stay registered in the Ensemble', () => {


            // When linked, objects should be associated with an Ensemble object
            expect( firstRectangle.ensembleObject ).toBeDefined()
            expect( secondRectangle.ensembleObject ).toBeDefined()


            // Remove one rectangle
            firstRectangle.remove()


            // After removal, both objects should not be in the Ensemble object's registry
            // The removed object should no longer be registered in the Ensemble object
            expect( ensembleObject.members() ).toBeUndefined()


        } )


        test( 'A singled rectangle should not have any Ensemble objects associated with it', () => {


            // When linked, objects should be associated with an Ensemble object
            expect( firstRectangle.ensembleObject ).toBeDefined()
            expect( secondRectangle.ensembleObject ).toBeDefined()


            // Remove one rectangle
            firstRectangle.remove()


            // After removal, both objects should no longer have an Ensemble object
            expect( firstRectangle.ensembleObject ).toBeUndefined()
            expect( secondRectangle.ensembleObject ).toBeUndefined()


        } )


    } )

} )




//// Unlinking ///////////////////////////////////////////////////////////////

describe( 'Unlinking', () => {


    let leftRectangle,
        middleRectangle,
        rightRectangle,
        ensembleObject

    // Setup
    beforeEach( () => {

        // Create rectangles
        leftRectangle = new shape.LinkableRectangle()
            .id( 'left-rectangle' )
            .build()
        middleRectangle = new shape.LinkableRectangle()
            .id( 'middle-rectangle' )
            .build()
        rightRectangle = new shape.LinkableRectangle()
            .id( 'right-rectangle' )
            .build()

        // Link rectangles
        // [L]️ <-- [M] --> [R]

        middleRectangle.linkRight( rightRectangle ).update()
        middleRectangle.linkLeft( leftRectangle ).update()


        ensembleObject = middleRectangle.ensembleObject  /* could be taken from any of the objects, as
                                                         linked objects all share the same Ensemble
                                                         object */

    } )


    test( 'Unlink left rectangle', () => {

        // Initial state of rectangles
        // [L]️ <-- [M] --> [R]

        // Check initial state of member registry
        expect( leftRectangle.linkRight().id() ).toBe( 'middle-rectangle' )
        // Check initial state of ensemble

        // Ensemble registry should no more contain an unlinked rectangle
        expect( Array.from( ensembleObject.members().keys() ) ).toEqual( [
            'middle-rectangle',
            'right-rectangle',
            'left-rectangle'
        ] )


        // Unlink the left rectangle from the ensemble
        leftRectangle.unlinkRight()

        // New state of rectangles
        // [L]️     [M] --> [R]

        // There should be no more objects registered in the linking slot that was unlinked
        expect( leftRectangle.linkRight() ).toBeUndefined()
        expect( middleRectangle.linkLeft() ).toBeUndefined()
        // Ensemble registry should no more contain an unlinked rectangle
        // Check initial state of ensemble
        expect( Array.from( ensembleObject.members().keys() ) ).toEqual( [
            'middle-rectangle',
            'right-rectangle'
        ] )

    } )


    test( 'Unlink middle rectangle: Deregistrations should be handled correctly, and any singled objects should not' +
        ' remain in an ensemble nor be coupled with an Ensemble object', () => {

        // Initial state of rectangles
        // [L]️ <-- [M] --> [R]

        // Check initial state of member registry
        expect( middleRectangle.linkRight().id() ).toBe( 'right-rectangle' )
        expect( middleRectangle.linkLeft().id() ).toBe( 'left-rectangle' )


        // Check initial state of ensemble
        expect( Array.from( ensembleObject.members().keys() ) ).toEqual( [
            'middle-rectangle',
            'right-rectangle',
            'left-rectangle'
        ] )


        // Unlink the left rectangle from the ensemble
        middleRectangle.unlinkRight()
        middleRectangle.unlinkLeft()

        // New state of rectangles
        // [L]️     [M]    [R]

        // There should be no more objects registered in the linking slot that was unlinked
        expect( middleRectangle.linkLeft() ).toBeUndefined()
        expect( leftRectangle.linkRight() ).toBeUndefined()
        expect( rightRectangle.linkLeft() ).toBeUndefined()

        // Ensemble registry should no more contain the now-single rectangles
        expect( ensembleObject.members() ).toBeUndefined()

        expect( middleRectangle.ensembleObject ).toBeUndefined()
        expect( leftRectangle.ensembleObject ).toBeUndefined()
        expect( rightRectangle.ensembleObject ).toBeUndefined()


        expect( ensembleObject.members() ).toBeUndefined()

    } )


    test( 'Unlink (all): middle rectangle', () => {


        // Initial state of rectangles
        // [L]️ <-- [M] --> [R]

        middleRectangle.unlink()

        // There should be no more objects registered in the linking slots that were unlinked
        expect( middleRectangle.linkLeft() ).toBeUndefined()
        expect( leftRectangle.linkRight() ).toBeUndefined()
        expect( rightRectangle.linkLeft() ).toBeUndefined()

        // Ensemble registry should no more contain an unlinked rectangle
        expect( ensembleObject.members() ).toBeUndefined()

        expect( middleRectangle.ensembleObject ).toBeUndefined()
        expect( leftRectangle.ensembleObject ).toBeUndefined()
        expect( rightRectangle.ensembleObject ).toBeUndefined()


        expect( ensembleObject.members() ).toBeUndefined()


    } )


    test( 'Unlink (all): right rectangle', () => {

        // Initial state of rectangles
        // [L]️ <-- [M] --> [R]

        rightRectangle.unlink()

        // There should be no more objects registered in the linking slots that were unlinked
        expect( leftRectangle.linkRight().id() ).toBe( 'middle-rectangle' )
        expect( middleRectangle.linkLeft().id() ).toBe( 'left-rectangle' )
        expect( middleRectangle.linkRight() ).toBeUndefined()
        expect( rightRectangle.linkLeft() ).toBeUndefined()

        // Ensemble registry should no more contain an unlinked rectangle
        expect( Array.from( ensembleObject.members().keys() ) ).toEqual( [
            'middle-rectangle',
            'left-rectangle'
        ] )

        expect( middleRectangle.ensembleObject ).toBeDefined()
        expect( leftRectangle.ensembleObject ).toBeDefined()
        expect( rightRectangle.ensembleObject ).toBeUndefined()


    } )


} )




//// Connector Polygons ///////////////////////////////////////////////////////////////

describe( 'Connector Polygons', () => {


    //// Basics ///////////////////////////////////////////////////////////////

    describe( 'Basics', () => {


        let myRectangle
        let leftRectangle
            , middleRectangle
            , rightRectangle

        // Setup
        beforeEach( () => {

            shape.LinkableRectangle.uniqueIdCounter( 0 )

            initializeDomWithSvg()

            leftRectangle = new shape.LinkableRectangle()
                .build()
            middleRectangle = new shape.LinkableRectangle()
                .build()
            rightRectangle = new shape.LinkableRectangle()
                .build()

            myRectangle = new shape.LinkableRectangle()
                .build()

            // Current state:
            // [L] [M] [R] [my]

        } )


        test( 'Get/set connector objects with `connectorObjects()`', () => {

            // Initial state:
            // [L] [M] [R] [my]

            // Set
            myRectangle.connectorObjects( 'left', new shape.Polygon() )
            myRectangle.connectorObjects( 'right', new shape.Polygon() )
            myRectangle.connectorObjects( 'anyOtherDirection', new shape.Polygon() )

            // Get
            expect( myRectangle.connectorObjects( 'left' ).hasType() ).toBe( 'Polygon' )
            expect( myRectangle.connectorObjects( 'right' ).hasType() ).toBe( 'Polygon' )
            expect( myRectangle.connectorObjects( 'anyOtherDirection' ).hasType() ).toBe( 'Polygon' )


            // Return undefined if a non-existent key is requested
            expect( myRectangle.connectorObjects( 'previouslyUnsetKey' ) ).toBeUndefined()


            // Return undefined if a key was requested while there is nothing in registry
            myRectangle._connectorObjects = null
            expect( myRectangle.connectorObjects( 'someKey' ) ).toBeUndefined()


        } )


        test( 'Get/set connector objects with the shorthand methods `connectorRight() and `connectorLeft()`', () => {


            // Initial state:
            // [L] [M] [R] [my]

            // Set
            myRectangle.connectorLeft( new shape.Polygon().id( 'polygon-at-left' ) )
            myRectangle.connectorRight( new shape.Polygon().id( 'polygon-at-right' ) )

            // Get
            expect( myRectangle.connectorLeft().id() ).toBe( 'polygon-at-left' )
            expect( myRectangle.connectorRight().id() ).toBe( 'polygon-at-right' )


            // If argument type is not correct, there should be an error
            expect( () => {
                myRectangle.connectorLeft( 'some text' )
            } ).toThrow( `Expected the type 'Polygon' but the value 'some text' has the type 'String'.` )

            expect( () => {
                myRectangle.connectorRight( 'some text' )
            } ).toThrow( `Type error: Expected the type 'Polygon' but the value 'some text' has the type 'String'.` )


        } )


        test( 'There should be Polygon objects between connected objects', () => {

            // Initial state:
            // [L] [M] [R] [my]

            // L --> M //

            leftRectangle
                .linkRight( middleRectangle )
                .update()

            // There should be a polygon between L and M, and both objects have the same polygon registered in them
            expect( leftRectangle.connectorObjects( 'right' ).id() ).toBe( 'connector-linkable-rectangles-0-1' )
            expect( middleRectangle.connectorObjects( 'left' ).id() ).toBe( 'connector-linkable-rectangles-0-1' )


            // R --> M //

            rightRectangle
                .linkLeft( middleRectangle )
                .update()

            // There should be a polygon between R and M, and both objects have the same polygon registered in them
            expect( rightRectangle.connectorObjects( 'left' ).id() ).toBe( 'connector-linkable-rectangles-2-1' )
            expect( middleRectangle.connectorObjects( 'left' ).id() ).toBe( 'connector-linkable-rectangles-0-1' )


        } )


        test( 'There should be the right number of Polygon objects between connected objects', () => {

            // Initial state:
            // [L] [M] [R] [my]

            // L --> R //

            leftRectangle
                .linkRight( rightRectangle )
                .update()

            // There should be a polygon between L and R, and both objects have the same polygon registered in them
            expect( leftRectangle.connectorObjects( 'right' ).id() ).toBe( 'connector-linkable-rectangles-0-2' )
            expect( rightRectangle.connectorObjects( 'left' ).id() ).toBe( 'connector-linkable-rectangles-0-2' )

            // There should be only one polygon on DOM
            expect( document.querySelectorAll( 'polygon' ).length ).toBe( 1 )

        } )


        test( 'Polygon objects should have the right class', () => {

            // Initial state:
            // [L] [M] [R] [my]

            middleRectangle
                .linkLeft( leftRectangle )
                .linkRight( rightRectangle )
                .updateAll()

            // middleRectangle.updateAll()

            expect( middleRectangle.connectorLeft().class() ).toBe( 'connector-polygon' )
            expect( middleRectangle.connectorRight().class() ).toBe( 'connector-polygon' )

        } )

        test( 'Linkable rectangle should have the right class', () => {

            // Initial state:
            // [L] [M] [R] [my]

            expect( myRectangle.class() ).toBe( 'linkable-rectangle' )

        } )




    } )



    //// Registering Connections ///////////////////////////////////////////////////////////////

    describe( 'Registering connections to self and in the connected object', () => {


        test( 'L --linkRight()--> R: Linked objects should recognize each other', () => {

            // Reset unique id counter for LinkableRectangle
            shape.LinkableRectangle.uniqueIdCounter( 0 )

            initializeDomWithSvg()
            const leftLinkableRectangle = new shape.LinkableRectangle()
                .build()
            const rightLinkableRectangle = new shape.LinkableRectangle()
                .build()

            leftLinkableRectangle
                .linkRight( rightLinkableRectangle )
                .update()

            // L should now be connected to R
            expect( leftLinkableRectangle.linkRight().id() ).toBe( 'linkable-rectangle-1' )
            // R should also know that it is now connected to L
            expect( rightLinkableRectangle.linkLeft().id() ).toBe( 'linkable-rectangle-0' )

        } )

        test( 'R --linkLeft()-- > L: Linked objects should recognize each other', () => {

            // Reset unique id counter for LinkableRectangle
            shape.LinkableRectangle.uniqueIdCounter( 0 )

            initializeDomWithSvg()
            const leftLinkableRectangle = new shape.LinkableRectangle()
                .build()
            const rightLinkableRectangle = new shape.LinkableRectangle()
                .build()

            // Link objects R->L
            rightLinkableRectangle
                .linkLeft( leftLinkableRectangle )
                .update()

            // L should now be connected to R
            expect( rightLinkableRectangle.linkLeft().id() ).toBe( 'linkable-rectangle-0' )
            // R should also know that it is now connected to L
            expect( leftLinkableRectangle.linkRight().id() ).toBe( 'linkable-rectangle-1' )

        } )

        test( 'L --> M --> R: Three connected objects should recognize each other', () => {

            // Reset unique id counter for LinkableRectangle
            shape.LinkableRectangle.uniqueIdCounter( 0 )

            initializeDomWithSvg()
            const leftLinkableRectangle = new shape.LinkableRectangle()
                .build()
            const middleLinkableRectangle = new shape.LinkableRectangle()
                .build()
            const rightLinkableRectangle = new shape.LinkableRectangle()
                .build()

            // Link: Left-Middle-Right
            leftLinkableRectangle.linkRight( middleLinkableRectangle ).update()
            middleLinkableRectangle.linkRight( rightLinkableRectangle ).update()

            // L should now be connected to M
            expect( leftLinkableRectangle.linkRight().id() ).toBe( 'linkable-rectangle-1' )
            // M should also know that it is now connected to L
            expect( middleLinkableRectangle.linkLeft().id() ).toBe( 'linkable-rectangle-0' )

            // M should be connected to R
            expect( middleLinkableRectangle.linkRight().id() ).toBe( 'linkable-rectangle-2' )
            // R should also know that it is now connected to M
            expect( rightLinkableRectangle.linkLeft().id() ).toBe( 'linkable-rectangle-1' )

        } )

    } )



    //// Coordinates ///////////////////////////////////////////////////////////////

    describe( 'Coordinates', () => {

        test( 'When two LinkableRectangles are linked, the coordinates of connector object must be correct', () => {

            shape.LinkableRectangle.uniqueIdCounter( 0 )
            initializeDomWithSvg()

            // Initialize a rectangle
            const rectangle0 = new shape.LinkableRectangle()
                .build()

            // Initialize another rectangle
            const rectangle1 = new shape.LinkableRectangle()
                .x( 100 )
                .y( 100 )
                .build()

            // Link rectangles
            rectangle0.linkRight( rectangle1 ).update()

            const pointsOfConnector = rectangle0.connectorObjects( 'right' ).pointsAsNumbers()
            expect( pointsOfConnector ).toEqual( [ [ 50, 0 ], [ 100, 100 ], [ 100, 150 ], [ 50, 50 ] ] )
            const leftEdgeOfConnector = [ pointsOfConnector[ 0 ], pointsOfConnector[ 3 ] ]
            const rightEdgeOfConnector = [ pointsOfConnector[ 1 ], pointsOfConnector[ 2 ] ]

            const linkedEdgeOfRectangle0 = [ rectangle0.topRightCorner(), rectangle0.bottomRightCorner() ]
            const linkedEdgeOfRectangle1 = [ rectangle1.topLeftCorner(), rectangle1.bottomLeftCorner() ]


            expect( linkedEdgeOfRectangle0 ).toEqual( [ [ 50, 0 ], [ 50, 50 ] ] )
            expect( leftEdgeOfConnector ).toEqual( [ [ 50, 0 ], [ 50, 50 ] ] )
            expect( linkedEdgeOfRectangle0 ).toEqual( leftEdgeOfConnector )

        } )


        test( 'When the position and height of rectangles change, connector polygons should adapt', () => {

            jest.useFakeTimers()

            shape.LinkableRectangle.uniqueIdCounter( 0 )
            initializeDomWithSvg()

            // Initialize a rectangle
            const leftRectangle = new shape.LinkableRectangle()
                .id( 'left-rectangle' )
                .x( 10 )
                .y( 10 )
                .build()

            // Initialize another rectangle
            const rightRectangle = new shape.LinkableRectangle()
                .id( 'right-rectangle' )
                .x( 100 )
                .y( 100 )
                .build()



            // Link rectangles
            leftRectangle.linkRight( rightRectangle ).update()

            const pointsOfConnector = leftRectangle.connectorObjects( 'right' ).pointsAsNumbers()
            expect( pointsOfConnector ).toEqual( [ [ 60, 10 ], [ 100, 100 ], [ 100, 150 ], [ 60, 60 ] ] )

            const {
                rightEdgeOfLeftRectangle, leftEdgeOfConnector,
                leftEdgeOfRightRectangle, rightEdgeOfConnector
            } = getRelevantPointsForLRConnection( leftRectangle, rightRectangle )


            expect( rightEdgeOfLeftRectangle ).toEqual( leftEdgeOfConnector )
            expect( leftEdgeOfRightRectangle ).toEqual( rightEdgeOfConnector )


            // Change one rectangle
            rightRectangle
                .x( 200 )
                .y( 200 )
                .height( 200 )
                .update()

            jest.runOnlyPendingTimers()
            jest.runAllTimers()

            const {
                rightEdgeOfLeftRectangle: rightEdgeOfLeftRectangleAfterMove, leftEdgeOfConnector: leftEdgeOfConnectorAfterMove,
                leftEdgeOfRightRectangle: leftEdgeOfRightRectangleAfterMove, rightEdgeOfConnector: rightEdgeOfConnectorAfterMove
            } = getRelevantPointsForLRConnection( leftRectangle, rightRectangle )

            expect( rightEdgeOfLeftRectangleAfterMove ).toEqual( leftEdgeOfConnectorAfterMove )
            expect( leftEdgeOfRightRectangleAfterMove ).toEqual( rightEdgeOfConnectorAfterMove )

        } )


        // Helper function(s)

        function getRelevantPointsForLRConnection( leftRectangle, rightRectangle ) {

            const pointsOfConnector = leftRectangle.connectorObjects( 'right' ).pointsAsNumbers()

            const rightEdgeOfLeftRectangle = [ leftRectangle.topRightCorner(), leftRectangle.bottomRightCorner() ]
            const leftEdgeOfConnector = [ pointsOfConnector[ 0 ], pointsOfConnector[ 3 ] ]

            const leftEdgeOfRightRectangle = [ rightRectangle.topLeftCorner(), rightRectangle.bottomLeftCorner() ]
            const rightEdgeOfConnector = [ pointsOfConnector[ 1 ], pointsOfConnector[ 2 ] ]

            return { rightEdgeOfLeftRectangle, leftEdgeOfConnector, leftEdgeOfRightRectangle, rightEdgeOfConnector }
        }


    } )


    //// Removal ///////////////////////////////////////////////////////////////

    describe( 'Automatic Removal of Connectors', () => {


        let leftRectangle,
            middleRectangle,
            rightRectangle

        // Setup
        beforeEach( () => {

            // Create rectangles
            leftRectangle = new shape.LinkableRectangle()
                .id( 'left-rectangle' )
                .build()
            middleRectangle = new shape.LinkableRectangle()
                .id( 'middle-rectangle' )
                .build()
            rightRectangle = new shape.LinkableRectangle()
                .id( 'right-rectangle' )
                .build()

            // Link rectangles
            // [L]️ <-- [M] --> [R]

            middleRectangle.linkRight( rightRectangle ).update()
            middleRectangle.linkLeft( leftRectangle ).update()

        } )



        //// Automatic Polygon Removal After UNLINKING ///////////////////////////////////////////////////////////////

        describe( 'Automatic Polygon Removal After UNLINKING a Rectangle', () => {

            test( 'No polygons should exist between unlinked rectangles (Unlink LEFT rectangle)', () => {

                // Initial state of rectangles
                // [L]️ <-- [M] --> [R]


                // There should be a polygon between each of the rectangles
                // Connector between [L] <-- [M]
                expect( leftRectangle.connectorObjects( 'right' ) ).toBeDefined()
                expect( middleRectangle.connectorObjects( 'left' ) ).toBeDefined()

                // Connector between [M] --> [R]
                expect( middleRectangle.connectorObjects( 'right' ) ).toBeDefined()
                expect( rightRectangle.connectorObjects( 'left' ) ).toBeDefined()


                // Unlink one of the rectangles
                leftRectangle.unlink()

                // Current state of rectangles
                // [L]️ -x- [M] --> [R]


                // There should not be a polygon between the unlinked rectangles
                // Connector between [L] -x- [M]
                expect( leftRectangle.connectorObjects( 'right' ) ).toBeUndefined()
                expect( middleRectangle.connectorObjects( 'left' ) ).toBeUndefined()

                // Connector between [M] --> [R]
                expect( middleRectangle.connectorObjects( 'right' ) ).toBeDefined()
                expect( rightRectangle.connectorObjects( 'left' ) ).toBeDefined()

            } )


            test( 'No polygons should exist between unlinked rectangles (Unlink RIGHT rectangle)', () => {

                // Initial state of rectangles
                // [L]️ <-- [M] --> [R]


                // There should be a polygon between each of the rectangles
                // Connector between [L] <-- [M]
                expect( leftRectangle.connectorObjects( 'right' ) ).toBeDefined()
                expect( middleRectangle.connectorObjects( 'left' ) ).toBeDefined()

                // Connector between [M] --> [R]
                expect( middleRectangle.connectorObjects( 'right' ) ).toBeDefined()
                expect( rightRectangle.connectorObjects( 'left' ) ).toBeDefined()


                // Unlink one of the rectangles
                rightRectangle.unlink()

                // Current state of rectangles
                // [L]️ <-- [M] -x- [R]


                // There should not be a polygon between the unlinked rectangles
                // Connector between [L] <-- [M]
                expect( leftRectangle.connectorObjects( 'right' ) ).toBeDefined()
                expect( middleRectangle.connectorObjects( 'left' ) ).toBeDefined()

                // Connector between [M] -x- [R]
                expect( middleRectangle.connectorObjects( 'right' ) ).toBeUndefined()
                expect( rightRectangle.connectorObjects( 'left' ) ).toBeUndefined()

            } )


            test( 'No polygons should exist between unlinked rectangles (Unlink middle rectangle)', () => {

                // Initial state of rectangles
                // [L]️ <-- [M] --> [R]


                // There should be a polygon between each of the rectangles
                // Connector between [L] <-- [M]
                expect( leftRectangle.connectorObjects( 'right' ) ).toBeDefined()
                expect( middleRectangle.connectorObjects( 'left' ) ).toBeDefined()

                // Connector between [M] --> [R]
                expect( middleRectangle.connectorObjects( 'right' ) ).toBeDefined()
                expect( rightRectangle.connectorObjects( 'left' ) ).toBeDefined()


                // Unlink one of the rectangles
                middleRectangle.unlink()

                // Current state of rectangles
                // [L]️ -x- [M] -x- [R]


                // There should not be a polygon between the unlinked rectangles
                // Connector between [L] <-- [M]
                expect( leftRectangle.connectorObjects( 'right' ) ).toBeUndefined()
                expect( middleRectangle.connectorObjects( 'left' ) ).toBeUndefined()

                // Connector between [M] -x- [R]
                expect( middleRectangle.connectorObjects( 'right' ) ).toBeUndefined()
                expect( rightRectangle.connectorObjects( 'left' ) ).toBeUndefined()

            } )


        } )


        //// Automatic Polygon Removal after REMOVING Rectangle ///////////////////////////////////////////

        describe( 'Automatic Polygon Removal after REMOVING a Rectangle', () => {


            test( 'No polygons should remain after a rectangle is removed (Remove LEFT rectangle)', () => {

                // Initial state of rectangles
                // [L]️ <-- [M] --> [R]


                // There should be a polygon between each of the rectangles
                // Connector between [L] <-- [M]
                expect( leftRectangle.connectorObjects( 'right' ) ).toBeDefined()
                expect( middleRectangle.connectorObjects( 'left' ) ).toBeDefined()

                // Connector between [M] --> [R]
                expect( middleRectangle.connectorObjects( 'right' ) ).toBeDefined()
                expect( rightRectangle.connectorObjects( 'left' ) ).toBeDefined()


                // Unlink one of the rectangles
                leftRectangle.remove()

                // Current state of rectangles
                // [L]️ -x- [M] --> [R]


                // There should not be a polygon between the unlinked rectangles
                // Connector between [L] -x- [M]
                expect( leftRectangle.connectorObjects( 'right' ) ).toBeUndefined()
                expect( middleRectangle.connectorObjects( 'left' ) ).toBeUndefined()

                // Connector between [M] --> [R]
                expect( middleRectangle.connectorObjects( 'right' ) ).toBeDefined()
                expect( rightRectangle.connectorObjects( 'left' ) ).toBeDefined()

            } )


            test( 'No polygons should remain after a rectangle is removed (Remove RIGHT rectangle)', () => {

                // Initial state of rectangles
                // [L]️ <-- [M] --> [R]


                // There should be a polygon between each of the rectangles
                // Connector between [L] <-- [M]
                expect( leftRectangle.connectorObjects( 'right' ) ).toBeDefined()
                expect( middleRectangle.connectorObjects( 'left' ) ).toBeDefined()

                // Connector between [M] --> [R]
                expect( middleRectangle.connectorObjects( 'right' ) ).toBeDefined()
                expect( rightRectangle.connectorObjects( 'left' ) ).toBeDefined()


                // Unlink one of the rectangles
                rightRectangle.remove()

                // Current state of rectangles
                // [L]️ <-- [M] -x- [R]


                // There should not be a polygon between the unlinked rectangles
                // Connector between [L] <-- [M]
                expect( leftRectangle.connectorObjects( 'right' ) ).toBeDefined()
                expect( middleRectangle.connectorObjects( 'left' ) ).toBeDefined()

                // Connector between [M] -x- [R]
                expect( middleRectangle.connectorObjects( 'right' ) ).toBeUndefined()
                expect( rightRectangle.connectorObjects( 'left' ) ).toBeUndefined()

            } )


            test( 'No polygons should remain after a rectangle is removed (Remove middle rectangle)', () => {

                // Initial state of rectangles
                // [L]️ <-- [M] --> [R]


                // There should be a polygon between each of the rectangles
                // Connector between [L] <-- [M]
                expect( leftRectangle.connectorObjects( 'right' ) ).toBeDefined()
                expect( middleRectangle.connectorObjects( 'left' ) ).toBeDefined()

                // Connector between [M] --> [R]
                expect( middleRectangle.connectorObjects( 'right' ) ).toBeDefined()
                expect( rightRectangle.connectorObjects( 'left' ) ).toBeDefined()


                // Unlink one of the rectangles
                middleRectangle.remove()

                // Current state of rectangles
                // [L]️ -x- [M] -x- [R]


                // There should not be a polygon between the unlinked rectangles
                // Connector between [L] <-- [M]
                expect( leftRectangle.connectorObjects( 'right' ) ).toBeUndefined()
                expect( middleRectangle.connectorObjects( 'left' ) ).toBeUndefined()

                // Connector between [M] -x- [R]
                expect( middleRectangle.connectorObjects( 'right' ) ).toBeUndefined()
                expect( rightRectangle.connectorObjects( 'left' ) ).toBeUndefined()

            } )


        } )


    } )


    //// Setting a Different Container Element for Connectors /////////////////////////////////////////////

    describe( 'Setting a different container element for connectors', () => {


        test( 'LinkableRectangle and Polygon object should have the same parent in HTML (i.e., `g`)', () => {

            shape.LinkableRectangle.uniqueIdCounter( 0 )

            initializeDomWithSvg()
            const leftLinkableRectangle = new shape.LinkableRectangle()
                .build()
            const rightLinkableRectangle = new shape.LinkableRectangle()
                .build()

            // Link rectangles
            leftLinkableRectangle.linkRight( rightLinkableRectangle ).update()

            // Get Ids of rectangles and connector
            expect( leftLinkableRectangle.id() ).toBe( 'linkable-rectangle-0' )
            expect( rightLinkableRectangle.id() ).toBe( 'linkable-rectangle-1' )
            expect( leftLinkableRectangle.connectorObjects( 'right' )
                .id() ).toBe( 'connector-linkable-rectangles-0-1' )

            // Get elements on DOM
            const leftLinkableRectangleElementOnDom = document.querySelector( '#linkable-rectangle-0' )
            const rightLinkableRectangleElementOnDom = document.querySelector( '#linkable-rectangle-1' )
            const connectorElementOnDom = document.querySelector( '#connector-linkable-rectangles-0-1' )

            // Check parents of elements on DOM
            expect( leftLinkableRectangleElementOnDom.parentNode.nodeName ).toBe( 'svg' )
            expect( rightLinkableRectangleElementOnDom.parentNode.nodeName ).toBe( 'svg' )
            expect( connectorElementOnDom.parentNode.nodeName ).toBe( 'g' )

        } )


        test( 'If user specifies a custom parent element for connectors for one of the linked objects, the other objects must not conflict with this', () => {

            initializeDomWithSvg()

            // Create a container to be used as a custom parent element for connectors
            const customContainerElementForLinkableRectangle = new container.Group()
                .id( 'custom-parent-element' )
                .update()

            // Initialize a rectangle with a custom parent for connectors
            const customizedLinkableRectangle = new shape.LinkableRectangle()
                .customParentContainerSelectionForConnectors( customContainerElementForLinkableRectangle.select() )
                .build()

            // Initialize a rectangle with NO custom parent for connectors
            const defaultLinkableRectangle = new shape.LinkableRectangle()
                .build()

            // Link rectangles
            customizedLinkableRectangle.linkRight( defaultLinkableRectangle ).update()


            expect( defaultLinkableRectangle.customParentContainerSelectionForConnectors().attr( 'id' ) )
                .toBe( 'custom-parent-element' )


            // Both rectangles should have the same custom parent element selection for connectors
            expect( customizedLinkableRectangle.customParentContainerSelectionForConnectors().attr( 'id' ) )
                .toBe( 'custom-parent-element' )
            expect( defaultLinkableRectangle.customParentContainerSelectionForConnectors().attr( 'id' ) )
                .toBe( 'custom-parent-element' )


        } )


        test( 'It should be possible to initialize Polygon object in another parent HTML group (i.e., `g`) element, regardless of the group of rectangle', () => {

            shape.LinkableRectangle.uniqueIdCounter( 0 )

            initializeDomWithSvg()
            const defaultLinkableRectangle = new shape.LinkableRectangle()
                .build()
            expect( defaultLinkableRectangle.customParentContainerSelectionForConnectors() )
                .toBe( undefined )


            const customContainerElementForLinkableRectangle = new container.Group()

            const customizedLinkableRectangle = new shape.LinkableRectangle()
                .customParentContainerSelectionForConnectors( customContainerElementForLinkableRectangle.select() )
                .build()

            // Link rectangles
            customizedLinkableRectangle.linkLeft( defaultLinkableRectangle ).update()

            // Get Ids of rectangles and connector
            expect( defaultLinkableRectangle.id() ).toBe( 'linkable-rectangle-0' )
            expect( customizedLinkableRectangle.id() ).toBe( 'linkable-rectangle-1' )
            expect( defaultLinkableRectangle.connectorObjects( 'right' )
                .id() ).toBe( 'connector-linkable-rectangles-1-0' )

            // Get elements on DOM
            const defaultLinkableRectangleElementOnDom = document.querySelector( '#linkable-rectangle-0' )
            const customizedLinkableRectangleElementOnDom = document.querySelector( '#linkable-rectangle-1' )
            const connectorElementOnDom = document.querySelector( '#connector-linkable-rectangles-1-0' )

            // Check parents of elements on DOM
            expect( defaultLinkableRectangleElementOnDom.parentNode.nodeName ).toBe( 'svg' )
            expect( customizedLinkableRectangleElementOnDom.parentNode.nodeName ).toBe( 'svg' )

            // Connector element's parent should be different
            expect( connectorElementOnDom.parentNode.nodeName ).toBe( 'g' )


        } )


    } )


    //// Inheritance and Synchronization of Fields for Polygons //////////////////////////////////////

    describe( 'Inheritance and Synchronization of Fields for Polygons ', () => {

        let leftRectangle,
            middleRectangle,
            rightRectangle

        // Setup
        beforeEach( () => {

            // Create rectangles
            leftRectangle = new shape.LinkableRectangle()
                .id( 'left-rectangle' )
                .build()
            middleRectangle = new shape.LinkableRectangle()
                .id( 'middle-rectangle' )
                .build()
            rightRectangle = new shape.LinkableRectangle()
                .id( 'right-rectangle' )
                .build()

        } )


        test( 'Init values: Connector polygon should initialize with the same field values as the objects it' +
            ' connects', () => {

            // Initial state of rectangles
            // [L]️ -x- [M] -x- [R]


            // Modify some values of rectangles
            expect( leftRectangle.fill() ).not.toBe( 'salmon' )
            expect( leftRectangle.stroke() ).not.toBe( 'dodgerblue' )
            expect( leftRectangle.strokeWidth() ).not.toBe( '5px' )
            leftRectangle.fill( 'salmon' )
                .stroke( 'dodgerblue' )
                .strokeWidth( '5px' )
                .update()


            // Link rectangles
            middleRectangle.linkLeft( leftRectangle ).update()
            middleRectangle.linkRight( rightRectangle ).update()

            // New state of rectangles
            // [L]️ <-- [M] --> [R]


            // Initial values of the connector should be the same with the initial values of rectangle
            expect( leftRectangle.connectorRight().fill() )
                .toBe( leftRectangle.fill() )

            expect( leftRectangle.connectorRight().stroke() )
                .toBe( leftRectangle.stroke() )

            expect( leftRectangle.connectorRight().strokeWidth() )
                .toBe( leftRectangle.strokeWidth() )


        } )


        test( 'Syncing values: When there is a change in field values, connector polygon should sync with' +
            'the fields of the objects it connects', () => {

            // Initial state of rectangles
            // [L]️ -x- [M] -x- [R]

            // Link rectangles
            middleRectangle.linkLeft( leftRectangle ).update()
            middleRectangle.linkRight( rightRectangle ).update()

            // New state of rectangles
            // [L]️ <-- [M] --> [R]


            // Modify some values of rectangles
            expect( leftRectangle.fill() ).not.toBe( 'salmon' )
            expect( leftRectangle.stroke() ).not.toBe( 'dodgerblue' )
            expect( leftRectangle.strokeWidth() ).not.toBe( '5px' )
            leftRectangle.fill( 'salmon' )
                .stroke( 'dodgerblue' )
                .strokeWidth( '5px' )
                .update()



            // Values of the connector should be the same with the now-modified values of rectangle
            expect( leftRectangle.connectorRight().fill() )
                .toBe( leftRectangle.fill() )

            expect( leftRectangle.connectorRight().stroke() )
                .toBe( leftRectangle.stroke() )

            expect( leftRectangle.connectorRight().strokeWidth() )
                .toBe( leftRectangle.strokeWidth() )



        } )


    } )



    //// Show/Hide Connectors ///////////////////////////////////////////////////////////////

    describe( 'Show/Hide Connectors', () => {

        // Setup //

        let middleRectangle,
            rightRectangle,
            leftRectangle
        let connector1,
            connector2

        beforeEach( () => {

            // Create rectangles
            rightRectangle = new shape.LinkableRectangle()
                .id( 'right-rectangle' )
            middleRectangle = new shape.LinkableRectangle()
                .id( 'middle-rectangle' )
                .build()
                .build()
            leftRectangle = new shape.LinkableRectangle()
                .id( 'left-rectangle' )
                .build()

            // Link rectangles
            // [L]️ -c1-> [M] -c2-> [R]

            leftRectangle.linkRight( middleRectangle ).update()
            middleRectangle.linkRight( rightRectangle ).update()

            // Get connectors
            connector1 = leftRectangle.connectorRight()
            connector2 = middleRectangle.connectorRight()


        } )


        test( 'It should be possible to toggle visibility of INDIVIDUAL connectors', () => {

            // Status of rectangles at this point
            // [L]️ -c1-> [M] -c2-> [R]

            // Connectors should share the same visibility status with the rectangles they connect
            // Check for connector 1
            expect( leftRectangle.visibilityOfConnectorRight() ).toBe( 'visible' )
            expect( middleRectangle.visibilityOfConnectorLeft() ).toBe( 'visible' )
            expect( connector1.visibility() ).toBe( 'visible' )
            // Check for connector 2
            expect( middleRectangle.visibilityOfConnectorRight() ).toBe( 'visible' )
            expect( rightRectangle.visibilityOfConnectorLeft() ).toBe( 'visible' )
            expect( connector2.visibility() ).toBe( 'visible' )



            // Toggle visibility status of connector 1 via a rectangle it is connected to
            leftRectangle.visibilityOfConnectorRight( 'hidden' ).update()

            // Connector 1 should now be hidden
            expect( leftRectangle.visibilityOfConnectorRight() ).toBe( 'hidden' )
            expect( middleRectangle.visibilityOfConnectorLeft() ).toBe( 'hidden' )
            expect( connector1.visibility() ).toBe( 'hidden' )
            // Connector 2 should still be visible
            expect( middleRectangle.visibilityOfConnectorRight() ).toBe( 'visible' )
            expect( rightRectangle.visibilityOfConnectorLeft() ).toBe( 'visible' )
            expect( connector2.visibility() ).toBe( 'visible' )



            // Toggle visibility status of connector 2 via a rectangle it is connected to
            rightRectangle.visibilityOfConnectorLeft( 'hidden' ).update()

            // Connector 1 should remain be hidden
            expect( leftRectangle.visibilityOfConnectorRight() ).toBe( 'hidden' )
            expect( middleRectangle.visibilityOfConnectorLeft() ).toBe( 'hidden' )
            expect( connector1.visibility() ).toBe( 'hidden' )
            // Connector 2 should now also be hidden
            expect( middleRectangle.visibilityOfConnectorRight() ).toBe( 'hidden' )
            expect( rightRectangle.visibilityOfConnectorLeft() ).toBe( 'hidden' )
            expect( connector2.visibility() ).toBe( 'hidden' )

        } )


        test( 'It should be possible to toggle visibility of ALL connectors', () => {

            // Status of rectangles at this point
            // [L]️ -c1-> [M] -c2-> [R]

            // Connectors should share the same visibility status with the rectangles they connect
            // Check for connector 1
            expect( leftRectangle.visibilityOfConnectorRight() ).toBe( 'visible' )
            expect( middleRectangle.visibilityOfConnectorLeft() ).toBe( 'visible' )
            expect( connector1.visibility() ).toBe( 'visible' )
            // Check for connector 2
            expect( middleRectangle.visibilityOfConnectorRight() ).toBe( 'visible' )
            expect( rightRectangle.visibilityOfConnectorLeft() ).toBe( 'visible' )
            expect( connector2.visibility() ).toBe( 'visible' )



            // Hide all connectors via one of the rectangles in the ensemble
            leftRectangle.visibilityOfAllConnectorsInEnsemble( 'hidden' ).updateAll()

            // Connector 1 should now be hidden
            expect( leftRectangle.visibilityOfConnectorRight() ).toBe( 'hidden' )
            expect( middleRectangle.visibilityOfConnectorLeft() ).toBe( 'hidden' )
            expect( rightRectangle.visibilityOfConnectorLeft() ).toBe( 'hidden' )
            expect( connector1.visibility() ).toBe( 'hidden' )
            // Connector 2 should also be hidden
            expect( middleRectangle.visibilityOfConnectorRight() ).toBe( 'hidden' )
            expect( rightRectangle.visibilityOfConnectorLeft() ).toBe( 'hidden' )
            expect( connector2.visibility() ).toBe( 'hidden' )



            // Show all connectors via one of the rectangles in the ensemble
            rightRectangle.visibilityOfAllConnectorsInEnsemble( 'visible' ).updateAll()

            // Connector 1 should now be visible
            expect( leftRectangle.visibilityOfConnectorRight() ).toBe( 'visible' )
            expect( middleRectangle.visibilityOfConnectorLeft() ).toBe( 'visible' )
            expect( connector1.visibility() ).toBe( 'visible' )
            // Connector 2 should now be visible
            expect( middleRectangle.visibilityOfConnectorRight() ).toBe( 'visible' )
            expect( rightRectangle.visibilityOfConnectorLeft() ).toBe( 'visible' )
            expect( connector2.visibility() ).toBe( 'visible' )

        } )


        test( 'Singleton objects should not throw error when `visibilityOfAllConnectorsInEnsemble()` method is' +
            ' called', () => {

            // Create LinkedRectangle objects
            const singletonRectangle = new shape.LinkableRectangle()
                .id( 'singleton-rectangle' )


            // GETTER of singleton should not throw an exception
            expect( singletonRectangle.visibilityOfAllConnectorsInEnsemble() )
                .toBeDefined()

            // SETTER of singleton should not throw an exception
            expect( singletonRectangle.visibilityOfAllConnectorsInEnsemble( 'visible' ).update() )
                .toBeDefined()
            expect( singletonRectangle.visibilityOfAllConnectorsInEnsemble( 'hidden' ).update() )
                .toBeDefined()


        } )

    } )




    //// Parent Group Membership ///////////////////////////////////////////////////////////////

    describe( 'Parent Group Membership', () => {

        // Setup //

        let middleRectangle,
            rightRectangle,
            leftRectangle
        let connector1,
            connector2

        beforeEach( () => {

            initializeDomWithSvg()

            jest.useFakeTimers()

            // Create rectangles
            rightRectangle = new shape.LinkableRectangle()
                .id( 'right-rectangle' )
                .x( 400 )
            middleRectangle = new shape.LinkableRectangle()
                .id( 'middle-rectangle' )
                .x( 200 )
                .y( 100 )
                .build()
            leftRectangle = new shape.LinkableRectangle()
                .id( 'left-rectangle' )
                .x( 0 )
                .build()

            // Link rectangles
            // [L]️ -c1-> [M] -c2-> [R]

            leftRectangle.linkRight( middleRectangle ).update()
            middleRectangle.linkRight( rightRectangle ).update()

            // Get connectors
            connector1 = leftRectangle.connectorRight()
            connector2 = middleRectangle.connectorRight()

            jest.runOnlyPendingTimers()

        } )


        test( 'Polygons should be created as children of group elements', () => {

            // Select the polygon elements to be tested
            const polygons = document.querySelectorAll( 'polygon' )

            // Select the parents of polygons and the names of their parents
            const parents = []
            const parentNames = []
            Array.from( polygons ).forEach( polygonElement => {

                const parent = polygonElement.parentNode
                const parentName = parent.nodeName

                parents.push( parent )
                parentNames.push( parentName )

            } )

            // Polygons should have the same parent
            expect( parents[ 0 ] ).toEqual( parents[ 1 ] )

            // Parent elements should be of type 'group'
            expect( parentNames ).toEqual( [ 'g', 'g' ] )

        } )
    } )




    //// Connector Opacity ///////////////////////////////////////////////////////////////

    describe( 'Connector Opacity', () => {

        // Setup //

        let middleRectangle,
            rightRectangle,
            leftRectangle
        let connector1,
            connector2

        beforeEach( () => {

            // Create rectangles
            rightRectangle = new shape.LinkableRectangle()
                .id( 'right-rectangle' )
            middleRectangle = new shape.LinkableRectangle()
                .id( 'middle-rectangle' )
                .build()
                .build()
            leftRectangle = new shape.LinkableRectangle()
                .id( 'left-rectangle' )
                .build()

            // Link rectangles
            // [L]️ -c1-> [M] -c2-> [R]

            leftRectangle.linkRight( middleRectangle ).update()
            middleRectangle.linkRight( rightRectangle ).update()

            // Get connectors
            connector1 = leftRectangle.connectorRight()
            connector2 = middleRectangle.connectorRight()


        } )


        test( 'It should be possible to change opacity of INDIVIDUAL connectors', () => {

            // Status of rectangles at this point
            // [L]️ -c1-> [M] -c2-> [R]

            // Connectors should share the same opacity level with the rectangles they connect
            // Check for connector 1
            expect( leftRectangle.opacityOfConnectorRight() ).toBe( 1 )
            expect( middleRectangle.opacityOfConnectorLeft() ).toBe( 1 )
            expect( connector1.opacity() ).toBe( 1 )
            // Check for connector 2
            expect( middleRectangle.opacityOfConnectorRight() ).toBe( 1 )
            expect( rightRectangle.opacityOfConnectorLeft() ).toBe( 1 )
            expect( connector2.opacity() ).toBe( 1 )



            // Toggle opacity level of connector 1 via a rectangle it is connected to
            leftRectangle.opacityOfConnectorRight( 0.5 ).update()

            // Connector 1 should now be hidden
            expect( leftRectangle.opacityOfConnectorRight() ).toBe( 0.5 )
            expect( middleRectangle.opacityOfConnectorLeft() ).toBe( 0.5 )
            expect( connector1.opacity() ).toBe( 0.5 )
            // Connector 2 should still be visible
            expect( middleRectangle.opacityOfConnectorRight() ).toBe( 1 )
            expect( rightRectangle.opacityOfConnectorLeft() ).toBe( 1 )
            expect( connector2.opacity() ).toBe( 1 )



            // Toggle opacity level of connector 2 via a rectangle it is connected to
            rightRectangle.opacityOfConnectorLeft( 0.5 ).update()

            // Connector 1 should remain be hidden
            expect( leftRectangle.opacityOfConnectorRight() ).toBe( 0.5 )
            expect( middleRectangle.opacityOfConnectorLeft() ).toBe( 0.5 )
            expect( connector1.opacity() ).toBe( 0.5 )
            // Connector 2 should now also be hidden
            expect( middleRectangle.opacityOfConnectorRight() ).toBe( 0.5 )
            expect( rightRectangle.opacityOfConnectorLeft() ).toBe( 0.5 )
            expect( connector2.opacity() ).toBe( 0.5 )

        } )


        test( 'It should be possible to change the opacity of ALL connectors', () => {

            // Status of rectangles at this point
            // [L]️ -c1-> [M] -c2-> [R]

            // Connectors should share the same opacity level with the rectangles they connect
            // Check for connector 1
            expect( leftRectangle.opacityOfConnectorRight() ).toBe( 1 )
            expect( middleRectangle.opacityOfConnectorLeft() ).toBe( 1 )
            expect( connector1.opacity() ).toBe( 1 )
            // Check for connector 2
            expect( middleRectangle.opacityOfConnectorRight() ).toBe( 1 )
            expect( rightRectangle.opacityOfConnectorLeft() ).toBe( 1 )
            expect( connector2.opacity() ).toBe( 1 )



            // Change opacity of all connectors via one of the rectangles in the ensemble
            leftRectangle.opacityOfAllConnectorsInEnsemble( 0.5 ).updateAll()

            // Connector 1 should now have 0.5 opacity
            expect( leftRectangle.opacityOfConnectorRight() ).toBe( 0.5 )
            expect( middleRectangle.opacityOfConnectorLeft() ).toBe( 0.5 )
            expect( rightRectangle.opacityOfConnectorLeft() ).toBe( 0.5 )
            expect( connector1.opacity() ).toBe( 0.5 )
            // Connector 2 should now have also 0.5 opactity
            expect( middleRectangle.opacityOfConnectorRight() ).toBe( 0.5 )
            expect( rightRectangle.opacityOfConnectorLeft() ).toBe( 0.5 )
            expect( connector2.opacity() ).toBe( 0.5 )



            // Change the opacity of all connectors via one of the rectangles in the ensemble
            rightRectangle.opacityOfAllConnectorsInEnsemble( 1.0 ).updateAll()

            // Connector 1 should now have an opacity of 1.0
            expect( leftRectangle.opacityOfConnectorRight() ).toBe( 1 )
            expect( middleRectangle.opacityOfConnectorLeft() ).toBe( 1 )
            expect( connector1.opacity() ).toBe( 1 )
            // Connector 2 should now have an opacity of 1.0 as well
            expect( middleRectangle.opacityOfConnectorRight() ).toBe( 1 )
            expect( rightRectangle.opacityOfConnectorLeft() ).toBe( 1 )
            expect( connector2.opacity() ).toBe( 1 )

        } )


        test( 'Singleton objects should not throw error when `opacityOfAllConnectorsInEnsemble()` method is' +
            ' called', () => {

            // Create LinkedRectangle objects
            const singletonRectangle = new shape.LinkableRectangle()
                .id( 'singleton-rectangle' )


            // GETTER of singleton should not throw an exception
            expect( singletonRectangle.opacityOfAllConnectorsInEnsemble() )
                .toBeDefined()

            // SETTER of singleton should not throw an exception
            expect( singletonRectangle.opacityOfAllConnectorsInEnsemble( 0.5 ).update() )
                .toBeDefined()
            expect( singletonRectangle.opacityOfAllConnectorsInEnsemble( 1.0 ).update() )
                .toBeDefined()


        } )

    } )

} )
