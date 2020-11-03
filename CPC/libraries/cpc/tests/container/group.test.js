//// UNIT TESTS ////////////////////////////////////////////////////////////////////////////////////////////////////////

//// Initialization /////////////////////////////////////////////////////////////////////////////

describe( 'Initialization', () => {

    test( 'Should instantiate object', () => {

        // Create a svg object that that the container can exist in
        const mySvg = new container.Svg( 111, 222 )
            , parentSelection = d3.select( 'body' ).select( 'svg' )

        const myGroup = new container.Group( parentSelection )
        expect( myGroup ).toBeDefined()

    } )

} )


//// Class and ID ///////////////////////////////////////////////////////////////////////////////

describe( 'Class and ID', () => {

    test( 'Should get and set class and ID with single and chain syntax', () => {

        // Create a svg object that that the container can exist in
        const mySvg = new container.Svg( 111, 222 )
            , parentSelection = d3.select( 'body' ).select( 'svg' )

        const myGroup = new container.Group( parentSelection )


        // SINGLE METHOD //

        // Class
        expect( myGroup.class() ).toBe( null )
        expect( myGroup.class( 'class-1' ).class() ).toBe( 'class-1' )

        // ID
        expect( myGroup.id() ).toBe( null )
        expect( myGroup.id( 'id-1' ).id() ).toBe( 'id-1' )



        // CHAIN SYNTAX //

        // ID and Class
        myGroup.class( 'M' ).id( 'Earth' )
        expect( myGroup.class() ).toBe( 'M' )
        expect( myGroup.id() ).toBe( 'Earth' )

    } )

} )


//// Updating Container Registry ///////////////////////////////////////////////////////////////

describe( 'Updating Container Registry', () => {

    test( 'Should update and query group registry', () => {

        // Create a svg object that that the container can exist in
        const mySvg = new container.Svg( 111, 222 )
            , parentSelection = d3.select( 'body' ).select( 'svg' )

        const myGroup = new container.Group( parentSelection )

        // Get initial value of registry
        expect( myGroup.objects() ).toBeInstanceOf( Map )
        expect( myGroup.objects().size ).toBe( 0 )


        const myRectangle = new shape.Rectangle()

        // Add item to registry (use two parameters)
        myGroup.objects( 'id-1', myRectangle )
        expect( myGroup.objects().size ).toBe( 1 )
        expect( myGroup.objects().get( 'id-1' ).height() ).toBe( 50 )
        expect( myGroup.objects().get( 'id-1' ).x() ).toBe( 0 )


        // Get item from registry (use one parameter)
        expect( myGroup.objects( 'id-1' ).width() ).toBe( 50 )
        expect( myGroup.objects( 'id-1' ).y() ).toBe( 0 )

    } )

} )


//// Select ////////////////////////////////////////////////////////////////////////////////////

describe( 'Select', () => {

    test( 'Should return a selection to the container\'s corresponding DOM element', () => {

        // Clear JEST's DOM to prevent leftovers from previous tests
        document.body.innerHTML = ''


        // Create an svg object that that the group can exist in
        const mySvg = new container.Svg( 111, 222 )
            , parentSelection = d3.select( 'body' ).select( 'svg' )

        // Initiate group instance
        const myGroup = new container.Group( parentSelection )
        myGroup.id( 'my-group' ).update()

        // Check if DOM counterpart of the group is created
        expect( document.getElementsByTagName( 'g' ).length )
            .toBe( 1 )
        expect( document.getElementsByTagName( 'g' )[ 0 ]
            .getAttribute( ( 'id' ) ) )
            .toBe( 'my-group' )

        // Select the group's corresponding DOM element
        const groupSelection = myGroup.select()

        // Check if selection is correct and working
        expect( groupSelection.attr( 'id' ) ).toBe( 'my-group' )


    } )

} )


//// Remove ///////////////////////////////////////////////////////////////////////////////////

describe( 'Remove', () => {

    test( 'Should remove group\'s corresponding element in DOM', () => {

        // Clear JEST's DOM to prevent leftovers from previous tests
        document.body.innerHTML = ''

        // Create a svg object that that the container can exist in
        const mySvg = new container.Svg( 111, 222 )
            , parentSelection = d3.select( 'body' ).select( 'svg' )

        // Initiate group instance
        const myGroup = new container.Group( parentSelection )
        myGroup.id( 'my-group' ).update()

        // Verify that a corresponding element exists in DOM
        expect( document.getElementById( 'my-group' ) ).toBeDefined()

        // Remove element from DOM
        myGroup.remove()

        // Verify that the element is no more in DOM
        expect( document.getElementById( 'my-group' ) ).toBe( null )

    } )

} )


//// Remove Child Objects and Elements ///////////////////////////////////////////////////////

describe( 'Remove Child Objects and Elements', () => {

    test( 'Should remove the n last items, and then all items from group registry and from DOM', () => {

        // Clear JEST's DOM to prevent leftovers from previous tests
        document.body.innerHTML = ''


        // Create an svg object that that the group can exist in
        const mySvg = new container.Svg( 111, 222 )
            , parentSelection = d3.select( 'body' ).select( 'svg' )

        // Initiate group instance
        const myGroup = new container.Group( parentSelection )
        groupSelection = myGroup.select()


        // Make some objects
        const rectangle1 = new shape.Rectangle( groupSelection )
        const rectangle2 = new shape.Rectangle( groupSelection )
        const rectangle3 = new shape.Rectangle( groupSelection )
        const rectangle4 = new shape.Rectangle( groupSelection )
        const rectangle5 = new shape.Rectangle( groupSelection )
        const rectangle6 = new shape.Rectangle( groupSelection )

        // Add items to group registry
        myGroup.objects( 'rectangle-1', rectangle1 )
        myGroup.objects( 'rectangle-2', rectangle2 )
        myGroup.objects( 'rectangle-3', rectangle3 )
        myGroup.objects( 'rectangle-4', rectangle4 )
        myGroup.objects( 'rectangle-5', rectangle5 )
        myGroup.objects( 'rectangle-6', rectangle6 )

        // Check if objects exist
        expect( myGroup.objects().size ).toBe( 6 )
        expect( myGroup.objects().get( 'rectangle-1' ) ).toBeDefined()
        expect( myGroup.objects().get( 'rectangle-6' ) ).toBeDefined()

        // Check if DOM counterparts of objects exist
        expect( document.getElementsByTagName( 'rect' ).length )
            .toBe( 6 )

        // REMOVE LAST N //

        // Remove one object
        myGroup.removeLast()

        // Verify removal of object
        expect( myGroup.objects().size ).toBe( 5 )
        expect( myGroup.objects().get( 'rectangle-1' ) ).toBeDefined()
        expect( myGroup.objects().get( 'rectangle-5' ) ).toBeDefined()
        expect( myGroup.objects().get( 'rectangle-6' ) ).not.toBeDefined()

        // Verify removal of corresponding DOM element
        expect( document.getElementsByTagName( 'rect' ).length )
            .toBe( 5 )


        // Remove multiple objects
        myGroup.removeLast( 2 )

        // Verify removal of objects
        expect( myGroup.objects().size ).toBe( 3 )
        expect( myGroup.objects().get( 'rectangle-1' ) ).toBeDefined()
        expect( myGroup.objects().get( 'rectangle-3' ) ).toBeDefined()
        expect( myGroup.objects().get( 'rectangle-4' ) ).not.toBeDefined()

        // Verify removal of corresponding DOM elements
        expect( document.getElementsByTagName( 'rect' ).length )
            .toBe( 3 )



        // REMOVE ALL //

        // Remove all objects
        myGroup.removeAll()

        // Verify removal of objects
        expect( myGroup.objects().size ).toBe( 0 )
        expect( myGroup.objects().get( 'rectangle-1' ) ).not.toBeDefined()

        // Verify removal of corresponding DOM elements
        expect( document.getElementsByTagName( 'rect' ).length )
            .toBe( 0 )

    } )

} )



//// Get Parent Selection /////////////////////////////////////////////////////////////////////

describe( 'Get Parent Selection', () => {

    test( 'Should return a D3 Selection form various inputs ', () => {

        const svg = d3.select( 'body' ).append( 'svg' )


        // If the parameter is already a D3 Selection, return it as it is
        const selectionFromSelection = container.Group.getD3SelectionFromVariousParameterTypes( svg )
        expect( classUtils.isInstanceOf( selectionFromSelection, 'Selection' ) )
            .toBe( true )



        const myGroup = new container.Group()

        // If an object with selection method is given as parameter, return the D3 Selection from this object
        const selectionFromSelectableObject = container.Group.getD3SelectionFromVariousParameterTypes( myGroup )
        expect( classUtils.isInstanceOf( selectionFromSelectableObject, 'Selection' ) )
            .toBe( true )

    } )

} )



//// getAnyObject Method /////////////////////////////////////////////////////////////////

describe( 'getAnyObject Method', () => {


    test( 'Method should return object', () => {

        const myObject = new container.Group()
        myObject
            .id( 'my-object' )
            .update()

        const result = container.Group.getAnyObject( myObject )
        expect( result ).toBeDefined()
        expect( result.id() ).toBe( 'my-object' )

    } )


    test( 'Method should return undefined if parameter is not an object', () => {

        const myObject = new container.Group()
        const mySelection = myObject.select()

        const result = container.Group.getAnyObject( mySelection )
        expect( result ).toBeUndefined()

    } )


} )



//// Retrieving Ancestry Information ///////////////////////////////////////////////////////////////

describe( 'Retrieving Ancestry Information', () => {

    let grandParent
        , parent
        , child

    beforeEach( () => {

        initializeDomWithSvg()

        // Create grandparent object
        grandParent = new container.Group()
        grandParent.id( 'grandparent' ).update()

        // Create parent object
        parent = new container.Group( grandParent )
        parent.id( 'parent' ).update()

        // Create child object
        child = new container.Group( parent )
        child.id( 'child' ).update()

    } )


    //// parentObject property /////////////////////////////////////

    describe( 'parentObject Property', () => {


        test( 'If the parent is specified as an object, this should be registered in the Group object\'s registry',
            () => {

                // State at initialization:
                // grandParent <-- parent <-- child

                //  Object should be correctly registered as the parent object
                expect( child.parentObject ).toBeDefined()
                expect( child.parentObject.id() ).toBe( 'parent' )

                // D3 `Selection` of parent should also be correctly inferred and registered
                expect( child.parentContainerSelection ).toBeDefined()
                expect( child.parentContainerSelection.attr( 'id' ) ).toBe( 'parent' )

            } )


        test( 'If the parent is specified as a D3 `Selection`, this should be registered as `undefined` in the Group' +
            ' object\'s registry', () => {

            // State at initialization:
            // grandParent <-- parent <-- child

            // Create a child object that has only a D3 Selection as parent (instead of an object)
            const childWithSelectionParent = new container.Group( parent.select() )

            expect( childWithSelectionParent.parentObject ).toBeUndefined()

            // D3 `Selection` of parent should also be correctly inferred and registered
            expect( childWithSelectionParent.parentContainerSelection ).toBeDefined()
            expect( childWithSelectionParent.parentContainerSelection.attr( 'id' ) ).toBe( 'parent' )

        } )


    } )



    //// getLineage() Method ///////////////////////////////////////////////////////////////

    describe( 'getLineage() Method', () => {


        test( 'An object should be able to retrieve its ancestry information on demand', () => {

            // State at initialization:
            // grandParent <-- parent <-- child

            // Grandparent should have no ancestor objects
            expect( grandParent._getLineage().size ).toBe( 0 )

            // Parent should have only one ancestor: the grandparent
            expect( parent._getLineage() ).toBeDefined()
            expect( parent._getLineage().size ).toBe( 1 )
            expect( parent._getLineage() ).toTabulateAs( `\
┌───────────────────┬───────────────┬─────────┐
│ (iteration index) │      Key      │ Values  │
├───────────────────┼───────────────┼─────────┤
│         0         │ 'grandparent' │ [Group] │
└───────────────────┴───────────────┴─────────┘` )

            // Child should have two ancestors: parent and grandparent
            expect( child._getLineage().size ).toBe( 2 )
            expect( child._getLineage() ).toTabulateAs( `\
┌───────────────────┬───────────────┬─────────┐
│ (iteration index) │      Key      │ Values  │
├───────────────────┼───────────────┼─────────┤
│         0         │   'parent'    │ [Group] │
│         1         │ 'grandparent' │ [Group] │
└───────────────────┴───────────────┴─────────┘` )

        } )



    } )


    //// parentObjects() Method ///////////////////////////////////////////////////////////////

    describe( 'parentObjects() Method', () => {


        test( 'parentObjects() method should return complete ancestry information if called without parameters',
            () => {

                // State at initialization:
                // grandParent <-- parent <-- child

                // Grandparent should have no ancestry information
                expect( grandParent.parentObjects().size ).toBe( 0 )


                // Parent should have one ancestor: grandparent
                expect( parent.parentObjects() ).toTabulateAs( `\
┌───────────────────┬───────────────┬─────────┐
│ (iteration index) │      Key      │ Values  │
├───────────────────┼───────────────┼─────────┤
│         0         │ 'grandparent' │ [Group] │
└───────────────────┴───────────────┴─────────┘` )

                // Child should have two ancestors: parent and grandparent
                expect( child.parentObjects() ).toTabulateAs( `\
┌───────────────────┬───────────────┬─────────┐
│ (iteration index) │      Key      │ Values  │
├───────────────────┼───────────────┼─────────┤
│         0         │   'parent'    │ [Group] │
│         1         │ 'grandparent' │ [Group] │
└───────────────────┴───────────────┴─────────┘` )

            } )


        test( 'parentObjects( "someID" ) should return specified ancestor object',
            () => {

                // State at initialization:
                // grandParent <-- parent <-- child

                // For parent:
                // Request 'grandparent' by name
                expect( parent.parentObjects( 'grandparent' ) ).toBeDefined()
                expect( parent.parentObjects( 'grandparent' ).id() ).toBe( 'grandparent' )


                // For child:
                // Request 'parent' by name
                expect( child.parentObjects( 'parent' ) ).toBeDefined()
                expect( child.parentObjects( 'parent' ).id() ).toBe( 'parent' )
                // Request 'grandparent' by name
                expect( child.parentObjects( 'grandparent' ) ).toBeDefined()
                expect( child.parentObjects( 'grandparent' ).id() ).toBe( 'grandparent' )

            } )


        test( 'parentObjects( "indvalidID" ) should return undefined',
            () => {

                // State at initialization:
                // grandParent <-- parent <-- child

                // Request invalid parent objects by name
                expect( grandParent.parentObjects( 'someParent' ) ).toBeUndefined()
                expect( parent.parentObjects( 'someParent' ) ).toBeUndefined()
                expect( child.parentObjects( 'someParent' ) ).toBeUndefined()


            } )


    } )


} )


//// Visibility ///////////////////////////////////////////////////////////////////////////////

describe( 'Visibility', () => {

    test( 'Get/Set', () => {

        initializeDomWithSvg()
        const myGroup = new container.Group()

        // Set to visible
        myGroup.visibility( 'visible' )
        expect( myGroup.visibility() ).toBe( 'visible' )

        // Set to hidden
        myGroup.visibility( 'hidden' )
        expect( myGroup.visibility() ).toBe( 'hidden' )

    } )

    test( 'HTML element should reflect changes to visibility', () => {

        initializeDomWithSvg()
        const myGroup = new container.Group()

        // Set to visible
        myGroup.visibility( 'visible' ).update()
        expect( myGroup.select().attr( 'visibility' ) ).toBe( 'visible' )

        // Set to hidden
        myGroup.visibility( 'hidden' ).update()
        expect( myGroup.select().attr( 'visibility' ) ).toBe( 'hidden' )

    } )

    test( 'Visibility should be applied to objects within group', () => {

        initializeDomWithSvg()
        const parentGroup = new container.Group()
        const childGroup = new container.Group( parentGroup.select() )
        parentGroup.objects().set( 'childGroup', childGroup )

        // Toggle visibility on
        parentGroup.visibility( 'visible' ).update()
        expect( childGroup.visibility() ).toBe( 'visible' )

        // Toggle visibility off
        parentGroup.visibility( 'hidden' ).update()
        expect( childGroup.visibility() ).toBe( 'hidden' )

    } )

} )

