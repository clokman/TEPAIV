//// IMPORTS ///////////////////////////////////////////////////////////////////////////////////////////////////////////

// Navigator class of CPC //
const navigator = require( '../../navigator' )




//// UNIT TESTS ////////////////////////////////////////////////////////////////////////////////////////////////////////


//// Nested Panel Initialization ///////////////////////////////////////////////////////////////

describe( 'Nested Panel Instantiation', () => {

    test( 'Instantiate panel as a child of specified parent element', () => {

        // Clear JEST's DOM to prevent leftovers from previous tests
        document.body.innerHTML = ''


        // Create SVG
        const mySvg = new container.Svg()
        mySvg.select()
            .attr( 'id', 'top-svg' )


        // Create a panel container
        const parentContainerSelection = mySvg.select()  // this first select is NOT D3 code but s container.Svg method (which returns a D3 Selection)
            .append( 'g' )
            .attr( 'id', 'parent-container' )  // id must be given directly with d3; Group.id().update() does not work
                                               // with JEST


        // Create panel as a child of the parent container
        const myPanel = new navigator.NestedPanel( parentContainerSelection )
        myPanel.id( 'child-panel' ).update()


        // Verify that the panel is indeed a child of the parent container
        const parentElement = document.getElementById( 'parent-container' )
        expect( parentElement.children.length ).toBe( 1 )

        const childPanelElement = parentElement.getElementsByClassName( 'panel' )[ 0 ]
        const childPanelId = childPanelElement.getAttribute( 'id' )
        expect( childPanelId ).toBe( 'child-panel' )

        const inferredParentId = childPanelElement.parentElement.getAttribute( 'id' )
        expect( inferredParentId ).toBe( 'parent-container' )

        const inferredGrandParentId = childPanelElement.parentElement.parentElement.getAttribute( 'id' )
        expect( inferredGrandParentId ).toBe( 'top-svg' )

    } )


    test( 'Instantiate panel with a spawn location', () => {

        // Clear JEST's DOM to prevent leftovers from previous tests
        document.body.innerHTML = ''


        // Create SVG
        const mySvg = new container.Svg()
        mySvg.select()
            .attr( 'id', 'top-svg' )

        // Create parent panel
        const parentPanel = new navigator.NestedPanel( mySvg )
        parentPanel
            .id( 'parent-panel' )
            .build()

        // Create a child panel that spawns from a category in parent panel
        const objectToSpawnFrom = parentPanel.objects( 'gender' ).objects( 'male' )
        const childPanel = new navigator.NestedPanel( parentPanel, objectToSpawnFrom )
        childPanel
            .id( 'child-panel' )
            .build()

        // Child panel should refer to a category as its spawn source
        const classOfObjectToSpawnFrom = childPanel.objectToSpawnFrom.constructor.name
        expect( classOfObjectToSpawnFrom ).toBe( 'Category' )

        // There must be two panels after creating a child panel
        const numberOfPanels = document.querySelectorAll( '.panel' ).length
        expect( numberOfPanels ).toBe( 2 )

        // A bridge object should be created
        const bridgeElements = document.querySelectorAll( '.bridge' )
        expect( bridgeElements.length ).toBe( 1 )


        // Bridge should be at the correct end position
        const bridgeRectangleElement = document.querySelector( '.bridge' )
        const categoryObjectBeingSpawnedFrom = childPanel.objectToSpawnFrom
            , categoryRectangleElementBeingSpawnedFrom = categoryObjectBeingSpawnedFrom.objects( 'rectangle' ).select()

        const yCoordinateOfBridgeRectangleElement = bridgeRectangleElement.getAttribute( 'y' )
        const yCoordinateOfCategoryRectangleBeingSpawnedFrom = categoryRectangleElementBeingSpawnedFrom.node().getAttribute( 'y' )

        expect( yCoordinateOfBridgeRectangleElement === yCoordinateOfCategoryRectangleBeingSpawnedFrom ).toBeTruthy()

    } )


    test( 'Throw error if no spawn source is specified', () => {

        // Clear JEST's DOM to prevent leftovers from previous tests
        document.body.innerHTML = ''

        // Create SVG
        const mySvg = new container.Svg()
        mySvg.select()
            .attr( 'id', 'top-svg' )

        // Create parent panel
        const parentPanel = new navigator.NestedPanel( mySvg )  // no need to specify a spawn source if no parent is
                                                                // specified
        parentPanel
            .id( 'parent-panel' )
            .build()

        // Create a child panel that spawns from a category in parent panel
        const objectToSpawnFrom = parentPanel.objects( 'gender' ).objects( 'male' )
        const childPanelWithBridgeSpecified = new navigator.NestedPanel( parentPanel, objectToSpawnFrom )  // spawn
                                                                                                           // source
                                                                                                           // must be
                                                                                                           // specified
                                                                                                           // if a
                                                                                                           // parent
                                                                                                           // panel is
                                                                                                           // specified
        expectConsoleHistory( '' )

        childPanelWithBridgeSpecified
            .id( 'child-panel' )
            .build()


        // Try to create a child panel without specifying a spawn source (expect error)
        const parentPanel2 = new navigator.NestedPanel( mySvg ) // no need to specify a spawn source if no parent is
                                                                // specified
        parentPanel2.build()   // no errors returned

        const bridgelessChildPanel = new navigator.NestedPanel( parentPanel2 )


        expect( () => {
            bridgelessChildPanel.build()
        } ).toThrow( 'The panel is specified to be a child of another panel, but no object is specified as spawn source (missing argument).' )


    } )

} )



//// Panel IDs ///////////////////////////////////////////////////////////////

describe( 'Panel IDs: Panel IDs must be generated correctly', () => {


    test( 'ID of panel zero should be generated correctly', () => {

        const panelZero = new navigator.NestedPanel()

        const panelId = panelZero._generatePanelId()
        expect( panelId ).toBe( 'panel-0' )


    } )


    test( 'Init: First panel id', () => {

        initializeDomWithSvg()

        const myPanel = new navigator.NestedPanel()
            .bgFill( '#deebf7' )
            .x( 200 )
            .y( 25 )
            // .yAxisLabels(true)
            .build()


        expect( myPanel.id() ).toBe( 'panel-0' )

    } )


    test( 'Depth 1 Siblings: Check ids of panels that spawned directly from panel 0', () => {

        initializeDomWithSvg()

        // Create panel 0
        const panelZero = new navigator.NestedPanel()
            .bgFill( '#deebf7' )
            .x( 200 ).y( 25 )
            .yAxisLabels( true )
            .build()


        // SIBLING #0-0 //
        // Create the first sibling (i.e., the first child of panelZero)
        const spawnObjectForSiblingPanel1 = panelZero.objects( 'gender' ).objects( 'female' )

        const siblingPanel1 = new navigator.NestedPanel( panelZero, spawnObjectForSiblingPanel1 )
        siblingPanel1.build()

        // Check the newly created sibling panel's ID
        expect( siblingPanel1.id() ).toBe( 'panel-0-0' )


        // SIBLING #0-1 //
        // Create the second sibling
        const spawnObjectForSiblingPanel2 = panelZero.objects( 'gender' ).objects( 'male' )

        const siblingPanel2 = new navigator.NestedPanel( panelZero, spawnObjectForSiblingPanel2, 'sibling' )
        siblingPanel2.build()

        // Check the newly created sibling panel's ID
        expect( siblingPanel2.id() ).toBe( 'panel-0-1' )


        // SIBLING #0-2 //
        // Create the third sibling
        const spawnObjectForSiblingPanel3 = panelZero.objects( 'status' ).objects( 'died' )

        const siblingPanel3 = new navigator.NestedPanel( panelZero, spawnObjectForSiblingPanel3, 'sibling' )
        siblingPanel3.build()

        // Check the newly created sibling panel's ID
        expect( siblingPanel3.id() ).toBe( 'panel-0-2' )


    } )


    test( 'Depth 2 Siblings: Check ids of panels that spawned from panel 1 (i.e., siblings spawned from a child of panel 0)', () => {

        initializeDomWithSvg()

        jest.useFakeTimers()

        // Create panel 0
        const panelZero = new navigator.NestedPanel()
            .bgFill( '#deebf7' )
            .x( 200 ).y( 25 )
            .yAxisLabels( true )
            .build()

        panelZero.bgText( panelZero.id() )   // for visually seeing the panel ID, in case wrdom function is used

        // SIBLING #0-0 (Child) //
        // Create single panel
        const spawnObjectForChildPanel = panelZero.objects( 'gender' ).objects( 'female' )

        const childPanel = new navigator.NestedPanel( panelZero, spawnObjectForChildPanel )
        childPanel.build()
        childPanel.bgText( childPanel.id() )
        jest.runOnlyPendingTimers()

        // Check the newly created child panel's ID
        expect( childPanel.id() ).toBe( 'panel-0-0' )



        // SIBLING #0-0-0 (Grandchild) //
        // Create sibling panel
        const spawnObjectForFirstGrandchild = childPanel.objects( 'gender' ).objects( 'female' )

        const firstGrandchild = new navigator.NestedPanel( childPanel, spawnObjectForFirstGrandchild )
        firstGrandchild.build()
        firstGrandchild.bgText( firstGrandchild.id() )
        jest.runOnlyPendingTimers()

        // Check the newly created sibling panel's ID
        expect( firstGrandchild.id() ).toBe( 'panel-0-0-0' )



        // SIBLING #0-0-1 (Second Grandchild) //
        // Create sibling panel
        const spawnObjectForSecondGrandchild = childPanel.objects( 'gender' ).objects( 'male' )

        const secondGrandchild = new navigator.NestedPanel( childPanel, spawnObjectForSecondGrandchild, 'sibling' )
        secondGrandchild.build()
        secondGrandchild.bgText( secondGrandchild.id() )
        jest.runOnlyPendingTimers()

        // Check the newly created sibling panel's ID
        expect( secondGrandchild.id() ).toBe( 'panel-0-0-1' )



        // SIBLING #0-0-2 //
        // Create sibling panel
        const spawnObjectForThirdGrandchild = childPanel.objects( 'status' ).objects( 'died' )

        const thirdGrandchild = new navigator.NestedPanel( childPanel, spawnObjectForThirdGrandchild, 'sibling' )
        thirdGrandchild.build()
        jest.runOnlyPendingTimers()
        thirdGrandchild.bgText( thirdGrandchild.id() ).update( 0 )
        jest.runOnlyPendingTimers()

        // Check the newly created sibling panel's ID
        expect( thirdGrandchild.id() ).toBe( 'panel-0-0-2' )


    } )


    test( 'Replace Singleton Panel: A panel that replaces another panel should have the right ID', () => {

        initializeDomWithSvg()

        jest.useFakeTimers()


        // PANEL #0 //
        const panelZero = new navigator.NestedPanel()
            .bgFill( '#deebf7' )
            .x( 200 ).y( 25 )
            .yAxisLabels( true )
            .build( 0 )



        // PANEL #0-0 //
        // Create child panel
        let childPanel
        setTimeout( () => {

            const spawnObjectForChild = panelZero.objects( 'gender' ).objects( 'female' )

            childPanel = new navigator.NestedPanel( panelZero, spawnObjectForChild )
            childPanel.build()

        }, 1000 )

        jest.runOnlyPendingTimers()


        // Check the newly created child panel's ID
        expect( childPanel.id() ).toBe( 'panel-0-0' )



        // REPLACEMENT CHILD PANEL #0-0  //
        // Replace existing panel at level 1

        let replacementChildPanel
        setTimeout( () => {
            const spawnObjectForReplacementChild = panelZero.objects( 'gender' ).objects( 'male' )

            replacementChildPanel = new navigator.NestedPanel( panelZero, spawnObjectForReplacementChild )
            replacementChildPanel.build()

        }, 2000 )

        jest.runOnlyPendingTimers()

        // Check the newly created replacement panel's ID
        expect( replacementChildPanel.id() ).toBe( 'panel-0-0' )


    } )


    test( 'Replace Comparison Panel: A panel that replaces two sibling panels should have the right ID', () => {

        initializeDomWithSvg()

        jest.useFakeTimers()


        // PANEL #0 //
        const panelZero = new navigator.NestedPanel()
            .bgFill( '#deebf7' )
            .x( 200 ).y( 25 )
            .yAxisLabels( true )
            .build()



        // PANEL #0-0 //
        // Create child panel
        let childPanel
        setTimeout( () => {

            const spawnObjectForChild = panelZero.objects( 'gender' ).objects( 'female' )

            childPanel = new navigator.NestedPanel( panelZero, spawnObjectForChild )
            childPanel.build()

        }, 1000 )

        jest.runOnlyPendingTimers()


        // Check the newly created child panel's ID
        expect( childPanel.id() ).toBe( 'panel-0-0' )



        // PANEL #0-1 //
        // Create sibling panel
        let secondChild
        setTimeout( () => {

            const spawnObjectForSecondChild = panelZero.objects( 'gender' ).objects( 'male' )

            secondChild = new navigator.NestedPanel( panelZero, spawnObjectForSecondChild, 'sibling' )
            secondChild.build()

        }, 2000 )

        jest.runOnlyPendingTimers()


        // Check the newly created sibling panel's ID
        expect( secondChild.id() ).toBe( 'panel-0-1' )




        // REPLACEMENT PANEL #0-1  //
        // Replace both of the comparison panels

        let replacerPanel
        setTimeout( () => {
            const spawnObjectForReplacerPanel = panelZero.objects( 'gender' ).objects( 'male' )

            replacerPanel = new navigator.NestedPanel( panelZero, spawnObjectForReplacerPanel )
            replacerPanel.build()

        }, 2000 )

        jest.runOnlyPendingTimers()

        // Check the newly created replacement panel's ID
        expect( replacerPanel.id() ).toBe( 'panel-0-0' )

    } )


    test( 'Refresh: The name of a panel should NOT change if the panel is recreated in-place.', () => {
        // Explanation: Clicking on a panel's spawn root refreshes that panel.
        // During this refresh operation, the panel is recreated.
        // During the old panel should not be detected as an already existing panel (at least for the purpose of
        // incrementing panel names).

        initializeDomWithSvg()

        // Create panel zero
        const panelZero = new navigator.NestedPanel()
            .bgFill( '#deebf7' )
            .x( 200 ).y( 25 )
            .yAxisLabels( true )
            .build( 0 )


        // Create panel 1
        // Create a child panel
        const spawnObjectForChildPanel = panelZero.objects( 'gender' ).objects( 'female' )

        const childPanel = new navigator.NestedPanel( panelZero, spawnObjectForChildPanel )
        childPanel.build()

        // Check the newly created child panel's ID
        expect( childPanel.id() ).toBe( 'panel-0-0' )



        // Re-Create (refresh) panel 1
        const childPanel2 = new navigator.NestedPanel( panelZero, spawnObjectForChildPanel )
        childPanel2.build()

        // Check the newly created child panel's ID
        expect( childPanel2.id() ).toBe( 'panel-0-0' )


    } )

} )



//// Inferences ///////////////////////////////////////////////////////////////

describe( 'Inferences', () => {


    //// Ancestry Inferences ///////////////////////////////////////////////////////////////

    describe( 'Ancestry Inferences: Parent child relationships should be inferred correctly', () => {

        test( 'Panel-0: A single-standing panel-0 should have correct relationships inferred', () => {

            initializeDomWithSvg()

            jest.useFakeTimers()

            // Create panel 0
            const panel0 = new navigator.NestedPanel()
                .bgFill( '#deebf7' )
                .x( 200 ).y( 25 )
                .yAxisLabels( true )
                .build()
            jest.runOnlyPendingTimers()

            // Check inferred relationships for panel-0
            expect( panel0.has.beenAddedAsSibling ).toBe( false )
            expect( panel0.has.numberOfSiblings ).toBe( 0 )
            expect( panel0.has.parentWithNumberOfChildren ).toBe( 0 )
            expect( panel0.has.parentPanel ).toBe( false )
            expect( panel0.has.grandParentPanel ).toBe( false )
            expect( panel0.has.parentWithAnyChild ).toBe( false )
            expect( panel0.has.parentWithIdenticalChild ).toBe( false )
            expect( panel0.has.parentWithAnotherChild ).toBe( false )
            expect( panel0.has.parentWithAnyGrandChild ).toBe( false )
            expect( panel0.has.parentWithAnyChildButNoGrandchildren ).toBe( false )

            expect( panel0.has.parentWithRightmostChildPanelObject ).toBe( null )

            expect( panel0.has.leftSiblingObject ).toBe( null )
            expect( panel0._leftSiblingObject ).toBe( null )

            expect( panel0.has.siblingObjectsOnRightSide ).toBe( null )


            // Create panel 1
            // Create child panel
            const spawnObjectForChildPanel = panel0.objects( 'gender' ).objects( 'female' )
            const childPanel = new navigator.NestedPanel( panel0, spawnObjectForChildPanel )
            childPanel.build()
            childPanel.updateAllPanels()
            jest.runOnlyPendingTimers()


            // Check the newly created child panel's ID
            expect( childPanel.id() ).toBe( 'panel-0-0' )

        } )


        test( 'Panel-1-0: A single child panel should have correct relationships inferred', () => {

            initializeDomWithSvg()

            jest.useFakeTimers()


            // Create panel 0
            const panel0 = new navigator.NestedPanel()
                .bgFill( '#deebf7' )
                .x( 200 ).y( 25 )
                .yAxisLabels( true )
                .build( 0 )
            jest.runOnlyPendingTimers()


            // Create panel-1
            let spawnObjectForPanel1 = panel0.objects( 'gender' ).objects( 'female' )
            const panel1 = new navigator.NestedPanel( panel0, spawnObjectForPanel1 )
            panel1.build()
            panel1.updateAllPanels()
            jest.runOnlyPendingTimers()

            // Check inferred relationships for panel-1
            expect( panel1.has.beenAddedAsSibling ).toBe( false )
            expect( panel1.has.numberOfSiblings ).toBe( 0 )
            expect( panel1.has.parentWithNumberOfChildren ).toBe( 1 )
            expect( panel1.has.parentPanel ).toBe( true )
            expect( panel1.has.grandParentPanel ).toBe( false )
            expect( panel1.has.parentWithAnyChild ).toBe( true )
            expect( panel1.has.parentWithIdenticalChild ).toBe( true )
            expect( panel1.has.parentWithAnotherChild ).toBe( false )
            expect( panel1.has.parentWithAnyGrandChild ).toBe( false )
            expect( panel1.has.parentWithAnyChildButNoGrandchildren ).toBe( true )

            expect( panel1.has.parentWithRightmostChildPanelObject.hasType() ).toBe( 'NestedPanel' )
            expect( panel1.has.parentWithRightmostChildPanelObject.id() ).toBe( 'panel-0-0' )

            expect( panel1.has.leftSiblingObject ).toBe( null )
            expect( panel1._leftSiblingObject ).toBe( null )

            expect( panel1.has.siblingObjectsOnRightSide ).toBe( null )
        } )


        test( 'Panel-2-0: A single grandchild panel should have correct relationships inferred', () => {

            initializeDomWithSvg()

            jest.useFakeTimers()


            // Create panel 0
            const panel0 = new navigator.NestedPanel()
                .bgFill( '#deebf7' )
                .x( 200 ).y( 25 )
                .yAxisLabels( true )
                .build()
            jest.runOnlyPendingTimers()


            // Create panel-1
            const spawnObjectForPanel1 = panel0.objects( 'gender' ).objects( 'female' )
            const panel1 = new navigator.NestedPanel( panel0, spawnObjectForPanel1 )
            panel1.build()
            panel1.updateAllPanels()
            jest.runOnlyPendingTimers()


            // Create panel-2
            const spawnObjectForPanel2 = panel0.objects( 'gender' ).objects( 'female' )
            const panel2 = new navigator.NestedPanel( panel1, spawnObjectForPanel2 )
            panel2.build()
            panel2.updateAllPanels()
            jest.runOnlyPendingTimers()


            // Check inferred relationships for panel-2
            expect( panel2.has.beenAddedAsSibling ).toBe( false )
            expect( panel2.has.numberOfSiblings ).toBe( 0 )
            expect( panel2.has.parentWithNumberOfChildren ).toBe( 1 )
            expect( panel2.has.parentPanel ).toBe( true )
            expect( panel2.has.grandParentPanel ).toBe( true )
            expect( panel2.has.parentWithAnyChild ).toBe( true )
            expect( panel2.has.parentWithIdenticalChild ).toBe( true )
            expect( panel2.has.parentWithAnotherChild ).toBe( false )
            expect( panel2.has.parentWithAnyGrandChild ).toBe( false )
            expect( panel2.has.parentWithAnyChildButNoGrandchildren ).toBe( true )

            expect( panel2.has.parentWithRightmostChildPanelObject.hasType() ).toBe( 'NestedPanel' )
            expect( panel2.has.parentWithRightmostChildPanelObject.id() ).toBe( 'panel-0-0-0' )

            expect( panel2.has.leftSiblingObject ).toBe( null )
            expect( panel2._leftSiblingObject ).toBe( null )

            expect( panel2.has.siblingObjectsOnRightSide ).toBe( null )


        } )


        test( 'Panel-1-1: A child panel with sibling should have correct relationships', () => {

            initializeDomWithSvg()

            jest.useFakeTimers()


            // Create panel 0
            const panel0 = new navigator.NestedPanel()
                .bgFill( '#deebf7' )
                .x( 200 ).y( 25 )
                .yAxisLabels( true )
                .build()
            jest.runOnlyPendingTimers()


            // Create panel-1-0 (first sibling)
            const spawnObjectForPanel1_0 = panel0.objects( 'gender' ).objects( 'female' )
            const panel1_0 = new navigator.NestedPanel( panel0, spawnObjectForPanel1_0 )
            panel1_0.build()
            panel1_0.updateAllPanels()
            jest.runOnlyPendingTimers()


            // Check inferred relationships for panel-1-0 (before it is given a sibling)
            expect( panel1_0.has.beenAddedAsSibling ).toBe( false )
            expect( panel1_0.has.numberOfSiblings ).toBe( 0 )
            expect( panel1_0.has.parentWithNumberOfChildren ).toBe( 1 )
            expect( panel1_0.has.sibling ).toBe( false )
            expect( panel1_0.has.parentPanel ).toBe( true )
            expect( panel1_0.has.grandParentPanel ).toBe( false )
            expect( panel1_0.has.parentWithAnyChild ).toBe( true )
            expect( panel1_0.has.parentWithIdenticalChild ).toBe( true )
            expect( panel1_0.has.parentWithAnotherChild ).toBe( false )
            expect( panel1_0.has.parentWithAnyGrandChild ).toBe( false )
            expect( panel1_0.has.parentWithAnyChildButNoGrandchildren ).toBe( true )

            expect( panel1_0.has.parentWithRightmostChildPanelObject.hasType() ).toBe( 'NestedPanel' )
            expect( panel1_0.has.parentWithRightmostChildPanelObject.id() ).toBe( 'panel-0-0' )

            expect( panel1_0.has.leftSiblingObject ).toBe( null )
            expect( panel1_0._leftSiblingObject ).toBe( null )

            expect( panel1_0.has.siblingObjectsOnRightSide ).toBe( null )


            // Create panel-1-1 (second sibling)
            const spawnObjectForPanel1_1 = panel0.objects( 'gender' ).objects( 'male' )
            const panel1_1 = new navigator.NestedPanel( panel0, spawnObjectForPanel1_1, 'sibling' )
            panel1_1.build()
            panel1_1.updateAllPanels()
            jest.runOnlyPendingTimers()


            // Check inferred relationships for panel-1-0 (after it is given a sibling)
            expect( panel1_0.has.beenAddedAsSibling ).toBe( false )
            expect( panel1_0.has.sibling ).toBe( true )
            expect( panel1_0.has.numberOfSiblings ).toBe( 1 )
            expect( panel1_0.has.parentWithNumberOfChildren ).toBe( 2 )
            expect( panel1_0.has.parentPanel ).toBe( true )
            expect( panel1_0.has.grandParentPanel ).toBe( false )
            expect( panel1_0.has.parentWithAnyChild ).toBe( true )
            expect( panel1_0.has.parentWithIdenticalChild ).toBe( true )
            expect( panel1_0.has.parentWithAnotherChild ).toBe( true )
            expect( panel1_0.has.parentWithAnyGrandChild ).toBe( false )
            expect( panel1_0.has.parentWithAnyChildButNoGrandchildren ).toBe( true )

            expect( panel1_0.has.parentWithRightmostChildPanelObject.hasType() ).toBe( 'NestedPanel' )
            expect( panel1_0.has.parentWithRightmostChildPanelObject.id() ).toBe( 'panel-0-1' )


            const rightwardSiblingsOfPanel1_0 = panel1_0.has.siblingObjectsOnRightSide.keys()
            const rightwardSiblingsOfPanel1_0_printable = String( Array.from( rightwardSiblingsOfPanel1_0 ) )
            expect( rightwardSiblingsOfPanel1_0_printable ).toBe( 'panel-0-1' )


            // Check inferred relationships for panel-1-1
            expect( panel1_1.has.beenAddedAsSibling ).toBe( true )
            expect( panel1_1.has.parentPanel ).toBe( true )
            expect( panel1_1.has.numberOfSiblings ).toBe( 1 )
            expect( panel1_1.has.parentWithNumberOfChildren ).toBe( 2 )
            expect( panel1_1.has.grandParentPanel ).toBe( false )
            expect( panel1_1.has.parentWithAnyChild ).toBe( true )
            expect( panel1_1.has.parentWithIdenticalChild ).toBe( true )
            expect( panel1_1.has.parentWithAnotherChild ).toBe( true )
            expect( panel1_1.has.parentWithAnyGrandChild ).toBe( false )
            expect( panel1_1.has.parentWithAnyChildButNoGrandchildren ).toBe( true )

            expect( panel1_1.has.parentWithRightmostChildPanelObject.hasType() ).toBe( 'NestedPanel' )
            expect( panel1_1.has.parentWithRightmostChildPanelObject.id() ).toBe( 'panel-0-1' )

            expect( panel1_1.has.leftSiblingObject.hasType() ).toBe( 'NestedPanel' )
            expect( panel1_1.has.leftSiblingObject.id() ).toBe( 'panel-0-0' )
            expect( panel1_1._leftSiblingObject.hasType() ).toBe( 'NestedPanel' )
            expect( panel1_1._leftSiblingObject.id() ).toBe( 'panel-0-0' )




            expect( panel1_1.has.siblingObjectsOnRightSide ).toBe( null )

        } )


        test( 'Panel-2-2: A grandchild panel with two siblings should have correct relationships inferred', () => {

            initializeDomWithSvg()

            jest.useFakeTimers()

            // Create panel 0
            const panel0 = new navigator.NestedPanel()
                .bgFill( '#deebf7' )
                .x( 200 ).y( 25 )
                .yAxisLabels( true )
                .build()
            jest.runOnlyPendingTimers()


            // Create panel-1-0
            const spawnObjectForPanel1_0 = panel0.objects( 'gender' ).objects( 'female' )
            const panel1_0 = new navigator.NestedPanel( panel0, spawnObjectForPanel1_0 )
            panel1_0.build()
            jest.runOnlyPendingTimers()


            // ADD PANEL 2-0 //

            // Create panel-2-0 (first child of parent)
            let panel2_0  // declaration must be outside the setTimer function
            setTimeout( () => {
                const spawnObjectForPanel2_0 = panel1_0.objects( 'class' ).objects( 'first-class' )
                panel2_0 = new navigator.NestedPanel( panel1_0, spawnObjectForPanel2_0 )
                panel2_0.build()
            }, 1000 )
            jest.runOnlyPendingTimers()

            // Check inferred relationships for panel-2-0 (before it is given a sibling)
            expect( panel2_0.has.beenAddedAsSibling ).toBe( false )
            expect( panel2_0.has.sibling ).toBe( false )
            expect( panel2_0.has.numberOfSiblings ).toBe( 0 )
            expect( panel2_0.has.parentWithNumberOfChildren ).toBe( 1 )
            expect( panel2_0.has.parentPanel ).toBe( true )
            expect( panel2_0.has.grandParentPanel ).toBe( true )
            expect( panel2_0.has.parentWithAnyChild ).toBe( true )
            expect( panel2_0.has.parentWithIdenticalChild ).toBe( true )
            expect( panel2_0.has.parentWithAnotherChild ).toBe( false )
            expect( panel2_0.has.parentWithAnyGrandChild ).toBe( false )
            expect( panel2_0.has.parentWithAnyChildButNoGrandchildren ).toBe( true )

            expect( panel2_0.has.parentWithRightmostChildPanelObject.hasType() ).toBe( 'NestedPanel' )
            expect( panel2_0.has.parentWithRightmostChildPanelObject.id() ).toBe( 'panel-0-0-0' )

            expect( panel2_0.has.leftSiblingObject ).toBe( null )
            expect( panel2_0._leftSiblingObject ).toBe( null )


            expect( panel2_0.has.siblingObjectsOnRightSide ).toBe( null )


            // ADD PANEL 2-1 //

            // Create panel-2-1 (first sibling)
            let panel2_1
            setTimeout( () => {
                const spawnObjectForPanel2_1 = panel1_0.objects( 'class' ).objects( 'second-class' )
                panel2_1 = new navigator.NestedPanel( panel1_0, spawnObjectForPanel2_1, 'sibling' )
                panel2_1.build()

            }, 2000 )
            jest.runOnlyPendingTimers()

            // Check inferred relationships for panel-2-1 (first sibling)
            expect( panel2_1.has.beenAddedAsSibling ).toBe( true )
            expect( panel2_1.has.sibling ).toBe( true )
            expect( panel2_1.has.numberOfSiblings ).toBe( 1 )
            expect( panel2_1.has.parentWithNumberOfChildren ).toBe( 2 )
            expect( panel2_1.has.parentPanel ).toBe( true )
            expect( panel2_1.has.grandParentPanel ).toBe( true )
            expect( panel2_1.has.parentWithAnyChild ).toBe( true )
            expect( panel2_1.has.parentWithIdenticalChild ).toBe( true )
            expect( panel2_1.has.parentWithAnotherChild ).toBe( true )
            expect( panel2_1.has.parentWithAnyGrandChild ).toBe( false )
            expect( panel2_1.has.parentWithAnyChildButNoGrandchildren ).toBe( true )

            expect( panel2_1.has.parentWithRightmostChildPanelObject.hasType() ).toBe( 'NestedPanel' )
            expect( panel2_1.has.parentWithRightmostChildPanelObject.id() ).toBe( 'panel-0-0-1' )

            expect( panel2_1.has.leftSiblingObject.hasType() ).toBe( 'NestedPanel' )
            expect( panel2_1.has.leftSiblingObject.id() ).toBe( 'panel-0-0-0' )
            expect( panel2_1._leftSiblingObject.hasType() ).toBe( 'NestedPanel' )
            expect( panel2_1._leftSiblingObject.id() ).toBe( 'panel-0-0-0' )


            expect( panel2_1.has.siblingObjectsOnRightSide ).toBe( null )

            // ADD PANEL 2-2 //

            // Create panel-2-2 (second sibling)
            let panel2_2
            setTimeout( () => {
                const spawnObjectForPanel2_2 = panel1_0.objects( 'class' ).objects( 'third-class' )
                panel2_2 = new navigator.NestedPanel( panel1_0, spawnObjectForPanel2_2, 'sibling' )
                panel2_2.build()
            }, 3000 )
            jest.runOnlyPendingTimers()
            panel2_2.updateAllPanels()


            // Check inferred relationships for panel-2-2 (second sibling)
            expect( panel2_2.has.beenAddedAsSibling ).toBe( true )
            expect( panel2_2.has.sibling ).toBe( true )
            expect( panel2_2.has.numberOfSiblings ).toBe( 2 )
            expect( panel2_2.has.parentWithNumberOfChildren ).toBe( 3 )
            expect( panel2_2.has.parentPanel ).toBe( true )
            expect( panel2_2.has.grandParentPanel ).toBe( true )
            expect( panel2_2.has.parentWithAnyChild ).toBe( true )
            expect( panel2_2.has.parentWithIdenticalChild ).toBe( true )
            expect( panel2_2.has.parentWithAnotherChild ).toBe( true )
            expect( panel2_2.has.parentWithAnyGrandChild ).toBe( false )
            expect( panel2_2.has.parentWithAnyChildButNoGrandchildren ).toBe( true )

            expect( panel2_2.has.parentWithRightmostChildPanelObject.hasType() ).toBe( 'NestedPanel' )
            expect( panel2_2.has.parentWithRightmostChildPanelObject.id() ).toBe( 'panel-0-0-2' )

            expect( panel2_2.has.leftSiblingObject.hasType() ).toBe( 'NestedPanel' )
            expect( panel2_2.has.leftSiblingObject.id() ).toBe( 'panel-0-0-1' )
            expect( panel2_2._leftSiblingObject.hasType() ).toBe( 'NestedPanel' )
            expect( panel2_2._leftSiblingObject.id() ).toBe( 'panel-0-0-1' )


            expect( panel2_2.has.siblingObjectsOnRightSide ).toBe( null )

            // CHECK FINAL STATE //

            jest.runOnlyPendingTimers()


            // Check inferred relationships for panel-2-0 (after it is given a sibling)
            expect( panel2_0.has.beenAddedAsSibling ).toBe( false )
            expect( panel2_0.has.sibling ).toBe( true )
            expect( panel2_0.has.numberOfSiblings ).toBe( 2 )
            expect( panel2_0.has.parentWithNumberOfChildren ).toBe( 3 )
            expect( panel2_0.has.parentPanel ).toBe( true )
            expect( panel2_0.has.grandParentPanel ).toBe( true )
            expect( panel2_0.has.parentWithAnyChild ).toBe( true )
            expect( panel2_0.has.parentWithIdenticalChild ).toBe( true )
            expect( panel2_0.has.parentWithAnotherChild ).toBe( true )
            expect( panel2_0.has.parentWithAnyGrandChild ).toBe( false )
            expect( panel2_0.has.parentWithAnyChildButNoGrandchildren ).toBe( true )

            expect( panel2_0.has.leftSiblingObject ).toBe( null )
            expect( panel2_0._leftSiblingObject ).toBe( null )

            const rightwardSiblingsOfPanel2_0 = panel2_0.has.siblingObjectsOnRightSide.keys()
            const rightwardSiblingsOfPanel2_0_printable = String( Array.from( rightwardSiblingsOfPanel2_0 ) )
            expect( rightwardSiblingsOfPanel2_0_printable ).toBe( 'panel-0-0-1,panel-0-0-2' )

            expect( panel2_0.has.parentWithRightmostChildPanelObject.hasType() ).toBe( 'NestedPanel' )
            expect( panel2_0.has.parentWithRightmostChildPanelObject.id() ).toBe( 'panel-0-0-2' )


        } )


        test( 'A deep child panel whose parent has siblings should have correct relationships', () => {

            initializeDomWithSvg()

            jest.useFakeTimers()

            // Create panel 0
            const panel0 = new navigator.NestedPanel()
                .bgFill( '#deebf7' )
                .x( 200 ).y( 25 )
                .yAxisLabels( true )
                .build( 0 )
            jest.runOnlyPendingTimers()


            // Create panel-1-0 (first sibling)
            let panel1_0
            setTimeout( () => {
                const spawnObjectForPanel1_0 = panel0.objects( 'gender' ).objects( 'female' )
                panel1_0 = new navigator.NestedPanel( panel0, spawnObjectForPanel1_0 )
                panel1_0.build()
            }, 1000 )
            jest.runOnlyPendingTimers()



            // Create panel-1-1 (second sibling)
            let panel1_1
            setTimeout( () => {
                const spawnObjectForPanel1_1 = panel0.objects( 'gender' ).objects( 'male' )
                panel1_1 = new navigator.NestedPanel( panel0, spawnObjectForPanel1_1, 'sibling' )
                panel1_1.build()
            }, 2000 )
            jest.runOnlyPendingTimers()


            let panel1_2
            setTimeout( () => {
                // Create panel-1-2 (third sibling)
                const spawnObjectForPanel1_2 = panel0.objects( 'class' ).objects( 'first-class' )
                panel1_2 = new navigator.NestedPanel( panel0, spawnObjectForPanel1_2, 'sibling' )
                panel1_2.build()
                // panel1_2.updateAll()
            }, 4000 )
            jest.runOnlyPendingTimers()


            // Create panel-2-0 of 1_0 (child of first sibling)
            let panel2_0_of_1_0
            setTimeout( () => {
                let spawnObjectForPanel2_0_of_1_0 = panel1_0.objects( 'gender' ).objects( 'male' )
                panel2_0_of_1_0 = new navigator.NestedPanel( panel1_0, spawnObjectForPanel2_0_of_1_0 )
                panel2_0_of_1_0.build()
            }, 3000 )
            jest.runOnlyPendingTimers()

            // Let some time pass, so has.beenFullyInstantiated can be set after all animations are done
            setTimeout( () => {}, panel2_0_of_1_0.animationDuration() )
            jest.runOnlyPendingTimers()


            // Check inferred relationships for panel-2-0 of 1_0
            expect( panel2_0_of_1_0.has.beenAddedAsSibling ).toBe( false )
            expect( panel2_0_of_1_0.has.parentPanel ).toBe( true )
            expect( panel2_0_of_1_0.has.numberOfSiblings ).toBe( 0 )
            expect( panel2_0_of_1_0.has.parentWithNumberOfChildren ).toBe( 1 )
            expect( panel2_0_of_1_0.has.grandParentPanel ).toBe( true )
            expect( panel2_0_of_1_0.has.parentWithAnyChild ).toBe( true )
            expect( panel2_0_of_1_0.has.parentWithIdenticalChild ).toBe( true )
            expect( panel2_0_of_1_0.has.parentWithAnotherChild ).toBe( false )
            expect( panel2_0_of_1_0.has.parentWithAnyGrandChild ).toBe( false )
            expect( panel2_0_of_1_0.has.parentWithAnyChildButNoGrandchildren ).toBe( true )
            expect( panel2_0_of_1_0.has.beenFullyInstantiated ).toBe( true )

            expect( panel2_0_of_1_0.has.parentWithRightmostChildPanelObject.hasType() ).toBe( 'NestedPanel' )
            expect( panel2_0_of_1_0.has.parentWithRightmostChildPanelObject.id() ).toBe( 'panel-0-0-0' )

            expect( panel2_0_of_1_0.has.leftSiblingObject ).toBe( null )
            expect( panel2_0_of_1_0._leftSiblingObject ).toBe( null )
            expect( panel2_0_of_1_0.has.siblingObjectsOnRightSide ).toBe( null )


            // Check siblings on the right side of parent panel (special case needed for
            // `NestedPanel._pushAnySiblingsOfParentRightward` method)
            const allSiblingsOfParent = panel2_0_of_1_0.parentPanel.parentPanel.childrenPanels.keys()
            const allSiblingsOfParent_printable = String( Array.from( allSiblingsOfParent ) )
            expect( allSiblingsOfParent_printable ).toBe( 'panel-0-0,panel-0-1,panel-0-2' )

            const rightwardSiblingsOfTheParentPanelOfPanel2_0_of_1_0 = panel2_0_of_1_0.parentPanel.has.siblingObjectsOnRightSide.keys()
            const rightwardSiblingsOfTheParentPanelOfPanel2_0_of_1_0_printable = String( Array.from( rightwardSiblingsOfTheParentPanelOfPanel2_0_of_1_0 ) )
            expect( rightwardSiblingsOfTheParentPanelOfPanel2_0_of_1_0_printable ).toBe( 'panel-0-1,panel-0-2' )

        } )


        test( 'Get top ancestor (panel 0) via calling a method from deeper panels', () => {

            initializeDomWithSvg()

            // Add panel #0
            const panel0 = new navigator.NestedPanel()
            panel0.id( 'panel-zero' ).build()
            // Add child panel #1
            const spawnObjectForChild1 = panel0.objects( 'gender' ).objects( 'female' )
            const childPanel1 = new navigator.NestedPanel( panel0, spawnObjectForChild1 )
            childPanel1.id( 'child-panel-1' ).build()
            // Add child panel #2
            const spawnObjectForChild2 = childPanel1.objects( 'gender' ).objects( 'male' )
            const childPanel2 = new navigator.NestedPanel( childPanel1, spawnObjectForChild2 )
            childPanel2.id( 'child-panel-2' ).build()


            // Get panel zero
            const panel0SelectedFromChildPanel1 = childPanel1.topmostAncestor()
            const panel0SelectedFromChildPanel2 = childPanel2.topmostAncestor()

            expect( panel0SelectedFromChildPanel1.id() ).toBe( 'panel-zero' )
            expect( panel0SelectedFromChildPanel2.id() ).toBe( 'panel-zero' )
        } )



    } )



    //// Content Inferences ///////////////////////////////////////////////////////////////

    describe( 'Content Inferences', () => {

        describe( 'Equivalent Category Object in Left Panel', () => {

            test( 'Should get the Category object with the same name in PARENT panel', () => {

                const { panelZero, childPanel } = initializeDomWith.panelZero.and.child()

                const survivorsCategoryObjectInParentPanel = panelZero.objects( 'status' ).objects( 'survived' )


                const retrievedSurvivorsCategoryObjectFromThePanelOnTheLeftOfChildPanel = childPanel.getEquivalentCategoryObjectInLeftPanel( 'status', 'survived' )
                expect( retrievedSurvivorsCategoryObjectFromThePanelOnTheLeftOfChildPanel ).toEqual( survivorsCategoryObjectInParentPanel )

            } )


            test( 'Should get the Category object with the same name in SIBLING panel', () => {

                const { panelZero, siblingPanel1, siblingPanel2, siblingPanel3 } = initializeDomWith.panelZero.and.threeSiblingChildren()

                const survivorsCategoryObjectInSibling1 = siblingPanel1.objects( 'status' ).objects( 'survived' )
                    , survivorsCategoryObjectInSibling2 = siblingPanel2.objects( 'status' ).objects( 'survived' )

                const retrievedSurvivorsCategoryObjectFromThePanelOnTheLeftOfSibling3 = siblingPanel3.getEquivalentCategoryObjectInLeftPanel( 'status', 'survived' )
                    ,
                    retrievedSurvivorsCategoryObjectFromThePanelOnTheLeftOfSibling2 = siblingPanel2.getEquivalentCategoryObjectInLeftPanel( 'status', 'survived' )

                expect( retrievedSurvivorsCategoryObjectFromThePanelOnTheLeftOfSibling3 ).toEqual( survivorsCategoryObjectInSibling2 )
                expect( retrievedSurvivorsCategoryObjectFromThePanelOnTheLeftOfSibling2 ).toEqual( survivorsCategoryObjectInSibling1 )

            } )


            test( 'If panelZero is queried for categories on the left side, a `null` value should be returned', () => {

                const panelZero = initializeDomWith.panelZero()

                const retrievedSurvivorsCategoryObjectFromThePanelOnTheLeftOfPanelZero = panelZero.getEquivalentCategoryObjectInLeftPanel( 'status', 'survived' )
                expect( retrievedSurvivorsCategoryObjectFromThePanelOnTheLeftOfPanelZero ).toBeNull()

            } )


            test( 'If the leftmost sibling is queried, the equivalent Category in parent panel should be returned', () => {

                const { panelZero, siblingPanel1, siblingPanel2, siblingPanel3 } = initializeDomWith.panelZero.and.threeSiblingChildren()

                const survivorsCategoryObjectInParentPanel = panelZero.objects( 'status' ).objects( 'survived' )

                const retrievedSurvivorsCategoryObjectFromThePanelOnTheLeftSideOfSibling1 = siblingPanel1.getEquivalentCategoryObjectInLeftPanel( 'status', 'survived' )

                expect( retrievedSurvivorsCategoryObjectFromThePanelOnTheLeftSideOfSibling1 ).toEqual( survivorsCategoryObjectInParentPanel )

            } )


            test( 'If parent panel has different data than the child panel, build should not give an error (it used to)', async () => {

                jest.useFakeTimers()

                initializeDomWithSvg()

                // Add panelZero
                const panelZero = new navigator.NestedPanel()
                    .build()

                // Summarize a dataset in panel0
                await panelZero.summarizeDataset(
                    'http://localhost:3000/TEPAIV/CPC/libraries/cpc/tests/dataset/titanicTiny.csv', 'Name' )
                panelZero.update()

                jest.runOnlyPendingTimers()
                jest.runAllTimers()

                expect( panelZero.stacks().data() ).toTabulateAs( `\
┌───────────────────┬──────────┬──────────────────────────────────────────────┐
│ (iteration index) │   Key    │                    Values                    │
├───────────────────┼──────────┼──────────────────────────────────────────────┤
│         0         │ 'Ticket' │ Stack { _data: [Map], _scaleFunction: null } │
│         1         │ 'Status' │ Stack { _data: [Map], _scaleFunction: null } │
│         2         │ 'Gender' │ Stack { _data: [Map], _scaleFunction: null } │
└───────────────────┴──────────┴──────────────────────────────────────────────┘` )

                // Add child panel that starts with an example dataset, which is different than the panelZero
                const spawnObjectForChildPanel = panelZero.objects( 'Gender' ).objects( 'Female' )
                const childPanel = new navigator.NestedPanel( panelZero, spawnObjectForChildPanel )

                // Build should not fail here
                childPanel.build()
                jest.runOnlyPendingTimers()

                expect( childPanel.stacks().data() ).toTabulateAs( `\
┌───────────────────┬──────────┬──────────────────────────────────────────────┐
│ (iteration index) │   Key    │                    Values                    │
├───────────────────┼──────────┼──────────────────────────────────────────────┤
│         0         │ 'gender' │ Stack { _data: [Map], _scaleFunction: null } │
│         1         │ 'class'  │ Stack { _data: [Map], _scaleFunction: null } │
│         2         │ 'status' │ Stack { _data: [Map], _scaleFunction: null } │
└───────────────────┴──────────┴──────────────────────────────────────────────┘` )

                // When child requests a category that is not in parent, the statement should return null, but NOT
                // throw error
                const noMatchFound = childPanel.getEquivalentCategoryObjectInLeftPanel( 'gender', 'female' )
                expect( noMatchFound ).toBe( null )

            } )


        } )

    } )


    //// Spawn Animation Type ///////////////////////////////////////////////////////////////

    describe( 'Spawn Animation Type', () => {


        test( 'The method should throw an exception if it cannot successfully infer a spawn animation type', () => {

            const panelZero = initializeDomWith.panelZero()

            expect( () => {
                panelZero._inferSpawnAnimationType( true )
            } ).toThrow( 'No spawn animation type could be inferred for panel being created.' )

        } )


    } )

} )



//// Data ///////////////////////////////////////////////////////////////

describe( 'Data', () => {


    test( 'Initialize with custom dataset', async () => {

        // Initialize without specifying a dataset
        const panelZeroWithoutSpecifiedData = new navigator.NestedPanel()
        panelZeroWithoutSpecifiedData.build()

        // Check initialization values for data
        expect( panelZeroWithoutSpecifiedData._stacks.data() ).toTabulateAs( `\
┌───────────────────┬──────────┬──────────────────────────────────────────────┐
│ (iteration index) │   Key    │                    Values                    │
├───────────────────┼──────────┼──────────────────────────────────────────────┤
│         0         │ 'gender' │ Stack { _data: [Map], _scaleFunction: null } │
│         1         │ 'class'  │ Stack { _data: [Map], _scaleFunction: null } │
│         2         │ 'status' │ Stack { _data: [Map], _scaleFunction: null } │
└───────────────────┴──────────┴──────────────────────────────────────────────┘` )

        // Initialize with specified dataset
        const panelZeroWithSpecifiedData = new navigator.NestedPanel()
        await panelZeroWithSpecifiedData.summarizeDataset(
            'http://localhost:3000/TEPAIV/CPC/libraries/cpc/tests/dataset/titanicTiny.csv'
        )
        panelZeroWithSpecifiedData.build()

        // Check initialization data
        expect( panelZeroWithSpecifiedData._stacks.data() ).toTabulateAs( `\
┌───────────────────┬──────────┬──────────────────────────────────────────────┐
│ (iteration index) │   Key    │                    Values                    │
├───────────────────┼──────────┼──────────────────────────────────────────────┤
│         0         │ 'Ticket' │ Stack { _data: [Map], _scaleFunction: null } │
│         1         │ 'Status' │ Stack { _data: [Map], _scaleFunction: null } │
│         2         │ 'Gender' │ Stack { _data: [Map], _scaleFunction: null } │
│         3         │  'Name'  │ Stack { _data: [Map], _scaleFunction: null } │
└───────────────────┴──────────┴──────────────────────────────────────────────┘` )

        // Initialize with specified dataset
        const panelZeroWithSpecifiedDataAndOmittedColumns = new navigator.NestedPanel()
        await panelZeroWithSpecifiedDataAndOmittedColumns.summarizeDataset(
            'http://localhost:3000/TEPAIV/CPC/libraries/cpc/tests/dataset/titanicTiny.csv',
            [ 'Ticket' ]
        )
        panelZeroWithSpecifiedDataAndOmittedColumns.build()

        expect( panelZeroWithSpecifiedDataAndOmittedColumns._stacks.data() ).toTabulateAs( `\
┌───────────────────┬──────────┬──────────────────────────────────────────────┐
│ (iteration index) │   Key    │                    Values                    │
├───────────────────┼──────────┼──────────────────────────────────────────────┤
│         0         │ 'Status' │ Stack { _data: [Map], _scaleFunction: null } │
│         1         │ 'Gender' │ Stack { _data: [Map], _scaleFunction: null } │
│         2         │  'Name'  │ Stack { _data: [Map], _scaleFunction: null } │
└───────────────────┴──────────┴──────────────────────────────────────────────┘` )
    } )


} )



//// Width ///////////////////////////////////////////////////////////////

describe( 'Width', () => {


    test( 'Get width', () => {

        const { panelZero, childPanel, grandChildPanel } = initializeDomWith.panelZero.and.childAndGrandchild()

        // Get default widths
        expect( panelZero.width() ).toBe( 100 )
        expect( childPanel.width() ).toBe( 100 )
        expect( grandChildPanel.width() ).toBe( 100 )

    } )


    test( 'Children panel should shift rightward ', () => {

        const { panelZero, childPanel, grandChildPanel } = initializeDomWith.panelZero.and.childAndGrandchild()

        // Save default width
        const defaultWidth = panelZero.width()

        // Choose a new value for width
        const newWidth = 225
        expect( newWidth ).not.toBe( defaultWidth )

        expect( _doChartsInPanelsOverlap( panelZero, childPanel ) ).toBe( false )

        // Modify width
        panelZero.width( newWidth )

        // Modification should have worked on the panel
        expect( panelZero.width() ).toBe( newWidth )

        // Other panels should not have changed with
        expect( childPanel.width() ).toBe( defaultWidth )
        expect( grandChildPanel.width() ).toBe( defaultWidth )

        // Other panels should have shifted rightwards to accommodate
        // ...the new width of the modified panel

        expect( _doChartsInPanelsOverlap( panelZero, childPanel ) ).toBe( false )
        expect( _doChartsInPanelsOverlap( childPanel, grandChildPanel ) ).toBe( false )

    } )


    test( 'Parent backgrounds should expand to accommodate new width', () => {

        const { panelZero, childPanel, grandChildPanel } = initializeDomWith.panelZero.and.childAndGrandchild()

        const panel0EncapsulatesPanel1 = () => panelZero.rightEdge() > childPanel.rightEdge()
        const panel1EncapsulatesPanel2 = () => childPanel.rightEdge() > grandChildPanel.rightEdge()

        // Initial state should have the right panel encapsulations
        expect( panel0EncapsulatesPanel1() ).toBe( true )
        expect( panel1EncapsulatesPanel2() ).toBe( true )


        // Increase the width of a child panel
        expect( grandChildPanel.width() ).not.toBe( 200 )
        grandChildPanel.width( 200 ).update( 0 )


        // Post-modification state should also have the right panel encapsulations
        expect( panel0EncapsulatesPanel1() ).toBe( true )
        expect( panel1EncapsulatesPanel2() ).toBe( true )


    } )


    test( 'Siblings of parents should accommodate new width', () => {

        jest.useFakeTimers()

        const {
            panelZero,
            siblingPanel1, siblingPanel2, siblingPanel3,
            childPanelOfSibling1, childPanelOfSibling2, childPanelOfSibling3
        } = initializeDomWith.panelZero.and.threeSiblingChildren.and.childrenOfEachSibling()


        // Modify deep child's width
        expect( childPanelOfSibling1.width() ).not.toBe( 200 )
        childPanelOfSibling1
            .width( 200 )
            .updateAllPanels()
        jest.runOnlyPendingTimers()


        // Sibling panels should not overlap
        expect( siblingPanel1.rightEdge() < siblingPanel2.leftEdge() ).toBe( true )
        expect( siblingPanel2.rightEdge() < siblingPanel3.leftEdge() ).toBe( true )

        jest.runAllTimers()

    } )


    test( 'New children should initiate by taking the new width of parent into account', () => {

        jest.useFakeTimers()

        const panelZero = initializeDomWith.panelZero()


        // Modify the width
        expect( panelZero.width() ).not.toBe( 200 )
        panelZero
            .width( 200 )
            .update( 0 )
        jest.runOnlyPendingTimers()

        // Add new panel
        // Create child panel
        const spawnObjectForChildPanel = panelZero.objects( 'gender' ).objects( 'female' )
        const childPanel = new navigator.NestedPanel( panelZero, spawnObjectForChildPanel )
        childPanel
            .bgText( 'childPanel' )
            .build()
        jest.runOnlyPendingTimers()

        jest.runAllTimers()

        // There should be no overlaps
        expect( panelZero.rightEdgeOfCharts() < childPanel.leftEdge() ).toBe( true )

    } )


    test( 'While they are initiating, new children of resized panels should push siblings of parents', () => {


        const panelZero = initializeDomWith.panelZero()

        // Resize panel zero
        expect( panelZero.width() ).not.toBe( 200 )
        panelZero
            .width( 200 )
            .build()

        // Create the first sibling
        let siblingPanel1
        setTimeout( () => {
            const spawnObjectForSiblingPanel1 = panelZero.objects( 'class' ).objects( 'first-class' )
            siblingPanel1 = new navigator.NestedPanel( panelZero, spawnObjectForSiblingPanel1 )
            siblingPanel1
                .bgText( 'siblingPanel1' )
                .build()

        }, 1000 )
        jest.runOnlyPendingTimers()


        // Create the second sibling
        let siblingPanel2
        setTimeout( () => {
            const spawnObjectForSiblingPanel2 = panelZero.objects( 'class' ).objects( 'second-class' )
            siblingPanel2 = new navigator.NestedPanel( panelZero, spawnObjectForSiblingPanel2, 'sibling' )
            siblingPanel2
                .bgText( 'siblingPanel2' )
                .build()
        }, 2000 )
        jest.runOnlyPendingTimers()

        // Create a child of first sibling
        let childPanelOfSibling1
        setTimeout( () => {
            let spawnObjectForChildPanelOfSibling1 = siblingPanel1.objects( 'gender' ).objects( 'male' )
            childPanelOfSibling1 = new navigator.NestedPanel( siblingPanel1, spawnObjectForChildPanelOfSibling1 )
            childPanelOfSibling1
                .bgText( 'childPanelOfSibling1' )
                .build()
        }, 4000 )
        jest.runOnlyPendingTimers()

        expect( siblingPanel1.rightEdge() < siblingPanel2.leftEdge() ).toBe( true )
        expect( childPanelOfSibling1.rightEdge() < siblingPanel2.leftEdge() ).toBe( true )




    } )


    test( 'When the new width of a parent propagates to siblings, sibling panels should move while resizing, so that they stay within the parent panel', () => {

        jest.useFakeTimers()

        const { panelZero, siblingPanel1, siblingPanel2, siblingPanel3 } =
            initializeDomWith.panelZero.and.threeSiblingChildren()

        // Change width of parent panel (it should propagate to its children)
        expect( panelZero.width() ).not.toBe( 50 )
        panelZero.width( 50 ).update()

        jest.runOnlyPendingTimers()

        const sibling1IsWithinPanelZero = siblingPanel1.rightEdge() < panelZero.rightEdge()
        const sibling2IsWithinPanelZero = siblingPanel2.rightEdge() < panelZero.rightEdge()
        const sibling3IsWithinPanelZero = siblingPanel3.rightEdge() < panelZero.rightEdge()

        expect( sibling1IsWithinPanelZero ).toBe( true )
        expect( sibling2IsWithinPanelZero ).toBe( true )
        expect( sibling3IsWithinPanelZero ).toBe( true )

    } )


    test( 'When width of a panel is changed, its sibling panels should move to accommodate this change', () => {

        jest.useFakeTimers()

        const { panelZero, siblingPanel1, siblingPanel2, siblingPanel3 } =
            initializeDomWith.panelZero.and.threeSiblingChildren()

        // Check initial locations and establish that the formula for checking correct location works
        expect( twoSiblingsAreRightNextToEachOther( siblingPanel1, siblingPanel2 ) ).toBeTruthy()
        expect( twoSiblingsAreRightNextToEachOther( siblingPanel2, siblingPanel3 ) ).toBeTruthy()


        // Change width of parent panel
        expect( siblingPanel1.width() ).not.toBe( 50 )
        panelZero.width( 50 ).update()

        jest.runOnlyPendingTimers()
        jest.runAllTimers()

        // Check final locations
        expect( twoSiblingsAreRightNextToEachOther( siblingPanel1, siblingPanel2 ) ).toBeTruthy()
        expect( twoSiblingsAreRightNextToEachOther( siblingPanel2, siblingPanel3 ) ).toBeTruthy()

    } )


    test( 'When the width of a deeply nested panel that has siblings change, backgrounds of parent panels should update correctly', () => {

        jest.useFakeTimers()

        const { panelZero, childPanel, grandChildPanel1, grandChildPanel2 } =
            initializeDomWith.panelZero.and.childThatHasTwoSiblingChildren()


        // Formulas
        const panelZeroBackgroundEndsAtCorrectLocation = () => panelZero.rightEdge() === grandChildPanel2.rightEdge() + childPanel._innerPadding.right + panelZero._innerPadding.right
        const childPanelBackgroundEndsAtCorrectLocation = () => childPanel.rightEdge() === grandChildPanel2.rightEdge() + childPanel._innerPadding.right

        // Check initial locations and establish that the formula for checking correct location works
        expect( panelZeroBackgroundEndsAtCorrectLocation() ).toBeTruthy()
        expect( childPanelBackgroundEndsAtCorrectLocation() ).toBeTruthy()

        // Change width of LEFT grandchild sibling
        expect( grandChildPanel1.width() ).not.toBe( 50 )
        grandChildPanel1.width( 50 ).update()

        jest.runOnlyPendingTimers()
        jest.runAllTimers()

        expect( panelZeroBackgroundEndsAtCorrectLocation() ).toBeTruthy()
        expect( childPanelBackgroundEndsAtCorrectLocation() ).toBeTruthy()


        // Change width of RIGHT grandchild sibling
        expect( grandChildPanel1.width() ).not.toBe( 150 )
        grandChildPanel1.width( 150 ).update()  // TODO [FEB]: This statement actually does not do anything! (see wrdom
                                                // output.) The .width() only seem to change panel-0-0 (and propagate
                                                // correctly to children) But .width() does not change any panels
                                                // deeper than panel-0-0

        jest.runOnlyPendingTimers()
        jest.runAllTimers()

        expect( panelZeroBackgroundEndsAtCorrectLocation() ).toBeTruthy()
        expect( childPanelBackgroundEndsAtCorrectLocation() ).toBeTruthy()

    } )


    test( 'When the width of the deeply nested grandchildren of two sibling panels change, inter-panel distances should be correct ', () => {

        initializeDomWith.panelZero.and.threeSiblingChildren.and.childrenOfEachSibling()

        //TODO [FEB]: This scenario leads to panels not being updated correctly.
        // Therefore, this test MUST be written
        // UPDATE: It now works, but test MUST be written anyway

    } )



    // HELPER FUNCTION(S) //

    // Formulas
    const twoSiblingsAreRightNextToEachOther = ( leftSibling, rightSibling ) => rightSibling.leftEdge() === leftSibling.rightEdge() + leftSibling._paddingBetweenSiblingPanels

    // Methods
    function _doChartsInPanelsOverlap( panelA, panelB ) {

        const endPointOfChartsInPanelA = panelA.rightEdgeOfCharts()
        const startingPointOfChartsInPanelB = panelB.leftEdgeOfCharts()

        const panelAChartsEndBeforePanelBChartsStart = endPointOfChartsInPanelA < startingPointOfChartsInPanelB

        const judgement = !panelAChartsEndBeforePanelBChartsStart
        return judgement

    }


} )



//// Spatial Inferences ///////////////////////////////////////////////////////////////

describe( 'Spatial Inferences', () => {

    test( 'Right edge', () => {

        jest.useFakeTimers()

        const { panelZero, childPanel, grandChildPanel } = initializeDomWith.panelZero.and.childAndGrandchild()

        jest.runAllTimers()
        jest.runOnlyPendingTimers()

        // Get right edges
        expect( panelZero.rightEdge() ).toBe( 530 )
        expect( childPanel.rightEdge() ).toBe( 515 )
        expect( grandChildPanel.rightEdge() ).toBe( 500 )

        // Get the actual right edges from DOM
        const panelZeroXCoordinateOnDom = document.querySelector( '#panel-0 .background rect' ).getAttribute( 'x' )
        const panelZeroWidthOnDom = document.querySelector( '#panel-0 .background rect' ).getAttribute( 'width' )

        const panelOneXCoordinateOnDom = document.querySelector( '#panel-0-0 .background rect' ).getAttribute( 'x' )
        const panelOneWidthOnDom = document.querySelector( '#panel-0-0 .background rect' ).getAttribute( 'width' )

        const panelTwoXCoordinateOnDom = document.querySelector( '#panel-0-0-0 .background rect' ).getAttribute( 'x' )
        const panelTwoWidthOnDom = document.querySelector( '#panel-0-0-0 .background rect' ).getAttribute( 'width' )

        const panelZeroRightEdgeOnDom = Number( panelZeroXCoordinateOnDom ) + Number( panelZeroWidthOnDom )
        const panelOneRightEdgeOnDom = Number( panelOneXCoordinateOnDom ) + Number( panelOneWidthOnDom )
        const panelTwoRightEdgeOnDom = Number( panelTwoXCoordinateOnDom ) + Number( panelTwoWidthOnDom )


        expect( panelZero.rightEdge() ).toBe( panelZeroRightEdgeOnDom )
        expect( childPanel.rightEdge() ).toBe( panelOneRightEdgeOnDom )
        expect( grandChildPanel.rightEdge() ).toBe( panelTwoRightEdgeOnDom )

    } )


    test( 'Left edge', () => {

        const { panelZero, childPanel, grandChildPanel } = initializeDomWith.panelZero.and.childAndGrandchild()

        expect( panelZero.leftEdge() ).toBe( 97 )
        expect( childPanel.leftEdge() ).toBe( 300 )
        expect( grandChildPanel.leftEdge() ).toBe( 400 )



        // Get the actual left edges from DOM
        const panelZeroXCoordinateOnDom = document.querySelector( '#panel-0 .background rect' ).getAttribute( 'x' )
        const panelOneXCoordinateOnDom = document.querySelector( '#panel-0-0 .background rect' ).getAttribute( 'x' )
        const panelTwoXCoordinateOnDom = document.querySelector( '#panel-0-0-0 .background rect' ).getAttribute( 'x' )

        const panelZeroLeftEdgeOnDom = Number( panelZeroXCoordinateOnDom )
        const panelOneLeftEdgeOnDom = Number( panelOneXCoordinateOnDom )
        const panelTwoLeftEdgeOnDom = Number( panelTwoXCoordinateOnDom )

        expect( panelZero.leftEdge() ).toBe( panelZeroLeftEdgeOnDom )
        expect( childPanel.leftEdge() ).toBe( panelOneLeftEdgeOnDom )
        expect( grandChildPanel.leftEdge() ).toBe( panelTwoLeftEdgeOnDom )

    } )


    test( 'Get right edge of charts', () => {

        const { panelZero, childPanel, grandChildPanel } = initializeDomWith.panelZero.and.childAndGrandchild()

        expect( panelZero.rightEdgeOfCharts() ).toBe( 285 )
        expect( childPanel.rightEdgeOfCharts() ).toBe( 385 )
        expect( grandChildPanel.rightEdgeOfCharts() ).toBe( 485 )


        const xCoordinateOfOneChartInPanel0_fromDom = document.querySelector( '#panel-0 .chart rect' ).getAttribute( 'x' )
        const widthOfOneChartInPanel0_fromDom = document.querySelector( '#panel-0 .chart rect' ).getAttribute( 'width' )

        const xCoordinateOfOneChartInPanel1_fromDom = document.querySelector( '#panel-0-0 .chart rect' ).getAttribute( 'x' )
        const widthOfOneChartInPanel1_fromDom = document.querySelector( '#panel-0-0 .chart rect' ).getAttribute( 'width' )

        const xCoordinateOfOneChartInPanel2_fromDom = document.querySelector( '#panel-0-0-0 .chart rect' ).getAttribute( 'x' )
        const widthOfOneChartInPanel2_fromDom = document.querySelector( '#panel-0-0-0 .chart rect' ).getAttribute( 'width' )


        const rightEdgeOfOneChartInPanel0_fromDom = Number( xCoordinateOfOneChartInPanel0_fromDom ) + Number( widthOfOneChartInPanel0_fromDom )
        const rightEdgeOfOneChartInPanel1_fromDom = Number( xCoordinateOfOneChartInPanel1_fromDom ) + Number( widthOfOneChartInPanel1_fromDom )
        const rightEdgeOfOneChartInPanel2_fromDom = Number( xCoordinateOfOneChartInPanel2_fromDom ) + Number( widthOfOneChartInPanel2_fromDom )

        // Compare values calculated from the instance and from DOM
        expect( panelZero.rightEdgeOfCharts() ).toBe( rightEdgeOfOneChartInPanel0_fromDom )
        expect( childPanel.rightEdgeOfCharts() ).toBe( rightEdgeOfOneChartInPanel1_fromDom )
        expect( grandChildPanel.rightEdgeOfCharts() ).toBe( rightEdgeOfOneChartInPanel2_fromDom )

    } )


    test( 'Get left edge of charts', () => {

        const { panelZero, childPanel, grandChildPanel } = initializeDomWith.panelZero.and.childAndGrandchild()

        expect( panelZero.leftEdgeOfCharts() ).toBe( 210 )
        expect( childPanel.leftEdgeOfCharts() ).toBe( 310 )
        expect( grandChildPanel.leftEdgeOfCharts() ).toBe( 410 )


        const xCoordinateOfOneChartInPanel0_fromDom = document.querySelector( '#panel-0 .chart rect' ).getAttribute( 'x' )
        const xCoordinateOfOneChartInPanel1_fromDom = document.querySelector( '#panel-0-0 .chart rect' ).getAttribute( 'x' )
        const xCoordinateOfOneChartInPanel2_fromDom = document.querySelector( '#panel-0-0-0 .chart rect' ).getAttribute( 'x' )

        const leftEdgeOfOneChartInPanel0_fromDom = Number( xCoordinateOfOneChartInPanel0_fromDom )
        const leftEdgeOfOneChartInPanel1_fromDom = Number( xCoordinateOfOneChartInPanel1_fromDom )
        const leftEdgeOfOneChartInPanel2_fromDom = Number( xCoordinateOfOneChartInPanel2_fromDom )

        // Compare values calculated from the instance and from DOM
        expect( panelZero.leftEdgeOfCharts() ).toBe( leftEdgeOfOneChartInPanel0_fromDom )
        expect( childPanel.leftEdgeOfCharts() ).toBe( leftEdgeOfOneChartInPanel1_fromDom )
        expect( grandChildPanel.leftEdgeOfCharts() ).toBe( leftEdgeOfOneChartInPanel2_fromDom )

    } )

} )



//// Absolute values ///////////////////////////////////////////////////////////////

describe( 'Absolute values', () => {

    test( 'DOM and Propagation to Child Panels: Both parent and child panels should update on DOM properly after each toggle', () => {

        // PREP //
        // NOTE: DO NOT DELETE THIS BLOCK. DOM must be re-prepped for this test with this block. Otherwise, jest
        // becomes flaky in some environments. Clear JEST's DOM to prevent leftovers from previous tests
        initializeDomWithSvg()

        // Create panel
        const myPanel = new navigator.NestedPanel().build()


        // Crete a child panel
        const spawnSourceObjectForChild1 = myPanel.objects( 'gender' ).objects( 'female' )
        spawnSourceObjectForChild1.fill( 'salmon' )
        const childPanel = new navigator.NestedPanel( myPanel, spawnSourceObjectForChild1, 0 ).build()


        // Check initial captions of parent and child panel on DOM
        let captionTexts = getCaptionTextsOfCategoriesFromDom()
        expect( captionTexts ).toTabulateAs( `\
┌─────────┬────────┐
│ (index) │ Values │
├─────────┼────────┤
│    0    │ '64%'  │
│    1    │ '36%'  │
│    2    │ '25%'  │
│    3    │ '21%'  │
│    4    │ '54%'  │
│    5    │ '38%'  │
│    6    │ '62%'  │
│    7    │ '64%'  │
│    8    │ '36%'  │
│    9    │ '25%'  │
│   10    │ '21%'  │
│   11    │ '54%'  │
│   12    │ '38%'  │
│   13    │ '62%'  │
└─────────┴────────┘` )  // combined table of captions in parent and child panel


        // Toggle absolute values on
        myPanel.showAbsoluteValues( true ).update()

        // Check the new captions of parent and child panel on DOM
        const captionTexts2 = getCaptionTextsOfCategoriesFromDom()
        expect( captionTexts2 ).toTabulateAs( `\
┌─────────┬────────┐
│ (index) │ Values │
├─────────┼────────┤
│    0    │ '843'  │
│    1    │ '466'  │
│    2    │ '323'  │
│    3    │ '277'  │
│    4    │ '709'  │
│    5    │ '500'  │
│    6    │ '809'  │
│    7    │ '843'  │
│    8    │ '466'  │
│    9    │ '323'  │
│   10    │ '277'  │
│   11    │ '709'  │
│   12    │ '500'  │
│   13    │ '809'  │
└─────────┴────────┘` )  // combined table of captions in parent and child panel


        // Toggle absolute values off
        myPanel.showAbsoluteValues( false ).update()

        // Check the captions of parent and child panel on DOM
        captionTexts = getCaptionTextsOfCategoriesFromDom()
        expect( captionTexts ).toTabulateAs( `\
┌─────────┬────────┐
│ (index) │ Values │
├─────────┼────────┤
│    0    │ '64%'  │
│    1    │ '36%'  │
│    2    │ '25%'  │
│    3    │ '21%'  │
│    4    │ '54%'  │
│    5    │ '38%'  │
│    6    │ '62%'  │
│    7    │ '64%'  │
│    8    │ '36%'  │
│    9    │ '25%'  │
│   10    │ '21%'  │
│   11    │ '54%'  │
│   12    │ '38%'  │
│   13    │ '62%'  │
└─────────┴────────┘` )  // combined table of captions in parent and child panel




        // HELPER FUNCTION(S) FOR THIS TEST //

        /**
         * @return {[]}  - An array of string
         */
        function getCaptionTextsOfCategoriesFromDom() {
            const allCaptions = document.querySelectorAll( '.category .rectangle-caption' )

            const captionTexts = []
            allCaptions.forEach( caption => {
                captionTexts.push( caption.textContent )
            } )
            return captionTexts
        }


    } )


} )



//// Absolute Chart Widths ///////////////////////////////////////////////////////////////


describe( 'Absolute Chart Widths', () => {


    describe( 'Init with absolute widths', () => {

        // TODO [FEB]
        test( 'When absolute chart widths are enabled, newly created panels should initialize correctly', async () => {

            jest.useFakeTimers()

            initializeDomWithSvg()

            // Add panelZero
            const panelZero = new navigator.NestedPanel()  // do not `build()` yet

            // Summarize a dataset in panel0
            await panelZero.summarizeDataset(
                'http://localhost:3000/TEPAIV/CPC/libraries/cpc/tests/dataset/titanicTiny.csv', 'Name' )
            panelZero.update()

            // Turn on absolute chart widths
            panelZero.showAbsoluteChartWidths( true )

            panelZero.build()

            jest.runOnlyPendingTimers()


            // Add child panel
            const spawnObjectForSiblingPanel1 = panelZero.objects( 'Gender' ).objects( 'Female' )
            const childPanel = new navigator.NestedPanel( panelZero, spawnObjectForSiblingPanel1 )  // do not build yet

            // Summarize a dataset in child panel
            await childPanel.summarizeDataset(
                'http://localhost:3000/TEPAIV/CPC/libraries/cpc/tests/dataset/titanicTiny-malesOnly.csv', 'Name' )

            childPanel.build()
            jest.runOnlyPendingTimers()


            // Formulas
            const childPanelEndsAtCorrectLocation = () => childPanel.rightEdge() === panelZero.leftEdge() + panelZero.width() + childPanel.width()
            const panelZeroBackgroundEndsAtCorrectLocation = () => panelZero.rightEdge() === childPanel.rightEdge() + panelZero._innerPadding.right

            expect( childPanelEndsAtCorrectLocation() ).toBeTruthy()
            expect( panelZeroBackgroundEndsAtCorrectLocation() ).toBeTruthy()



        } )

        test( 'Enabling absolute chart widths but not providing any data during init should give a warning during build', async () => {

            jest.useFakeTimers()

            const panelZero = initializeDomWith.panelZero()

            jest.runOnlyPendingTimers()

            // Get the default state of absolute chart widths
            expect( panelZero.showAbsoluteChartWidths() ).toBe( false )

            // Enable absolute chart widths
            await panelZero
                .showAbsoluteChartWidths( true )
                .build()

            // Create child panel
            const spawnObjectForChildPanel = panelZero.objects( 'gender' ).objects( 'female' )
            const childPanel = new navigator.NestedPanel( panelZero, spawnObjectForChildPanel )
            childPanel.showAbsoluteChartWidths( true )

            jest.runOnlyPendingTimers()
            jest.runAllTimers()

            expectConsoleHistory( '' )

            childPanel.build()

            expectConsoleHistory( `\
[Build warning]: "showAbsoluteChartWidths()" is set to "true" but no data is provided during NestedPanel instance initialization. 
                    In this scenario, the NestedPanel is initiated with example data and it may not really visualize absolute values. 
                    Importantly, build parameters are calculated from this example data. If some other data is provided to the 
                    NestedPanel after the build operation with example data, animation glitches may occur. To display absolute values 
                    correctly, a "Stacks" object should be provided as data before building the NestedPanel.` )

            destroyWarnings()

        } )

    } )


    describe( 'Setting absolute widths post-build', () => {


        test( 'Set/get absolute chart widths', () => {

            const panelZero = initializeDomWith.panelZero()


            // Default value should be false
            expect( panelZero.showAbsoluteChartWidths() ).toBe( false )

            // Change value
            panelZero.showAbsoluteChartWidths( true )
            expect( panelZero.showAbsoluteChartWidths() ).toBe( true )


        } )


        test( 'When absolute chart widths are on, charts should have the right width relative to the chart widths in parents', async () => {

            jest.useFakeTimers()

            initializeDomWithSvg()

            // Add panelZero
            const panelZero = new navigator.NestedPanel().build()

            // Summarize a dataset in panel0
            await panelZero.summarizeDataset(
                'http://localhost:3000/TEPAIV/CPC/libraries/cpc/tests/dataset/titanicTiny.csv', 'Name' )
            panelZero.update()

            // Add child panel
            const spawnObjectForChildPanel = panelZero.objects( 'Gender' ).objects( 'Female' )
            const childPanel = new navigator.NestedPanel( panelZero, spawnObjectForChildPanel )
            childPanel.build()

            // Summarize a dataset in child panel
            await childPanel.summarizeDataset(
                'http://localhost:3000/TEPAIV/CPC/libraries/cpc/tests/dataset/titanicTiny-malesOnly.csv', 'Name' )
            childPanel.update( 0 )
            jest.runOnlyPendingTimers()



            // Turn on absolute chart widths
            panelZero
                .showAbsoluteChartWidths( true )
                .update( 0 )
            jest.runOnlyPendingTimers()

            // No overlaps should have occurred
            expect( panelZero.largestTotalCount() > childPanel.largestTotalCount() ).toBe( true )
            expect( panelZero.width() > childPanel.width() ).toBe( true )

        } )


        test( 'Toggling absolute chart widths when there are two sibling panels should not cause overlapping panels', async () => {

            jest.useFakeTimers()

            initializeDomWithSvg()

            // Add panelZero
            const panelZero = new navigator.NestedPanel().build()

            // Summarize a dataset in panel0
            await panelZero.summarizeDataset(
                'http://localhost:3000/TEPAIV/CPC/libraries/cpc/tests/dataset/titanicTiny.csv', 'Name' )
            panelZero.update()

            // Add the first sibling panel
            const spawnObjectForSiblingPanel1 = panelZero.objects( 'Gender' ).objects( 'Female' )
            const siblingPanel1 = new navigator.NestedPanel( panelZero, spawnObjectForSiblingPanel1 ).build()

            // Summarize a dataset in child panel
            await siblingPanel1.summarizeDataset(
                'http://localhost:3000/TEPAIV/CPC/libraries/cpc/tests/dataset/titanicTiny-malesOnly.csv', 'Name' )
            siblingPanel1.update( 0 )
            jest.runOnlyPendingTimers()


            // Add the second sibling panel
            const spawnObjectForSiblingPanel2 = panelZero.objects( 'Gender' ).objects( 'Male' )
            const siblingPanel2 = new navigator.NestedPanel( panelZero, spawnObjectForSiblingPanel2, 'sibling' ).build()

            // Summarize a dataset in child panel
            await siblingPanel2.summarizeDataset(
                'http://localhost:3000/TEPAIV/CPC/libraries/cpc/tests/dataset/titanicTiny-malesOnly.csv', 'Name' )
            siblingPanel2.update( 0 )
            jest.runOnlyPendingTimers()


            // Turn on absolute chart widths
            panelZero
                .showAbsoluteChartWidths( true )
                .update( 0 )
            jest.runOnlyPendingTimers()


            // No overlaps should have occurred
            const panelZeroContainsSibling1 = panelZero.rightEdge() > siblingPanel1.rightEdge()
            const panelZeroContainsSibling2 = panelZero.rightEdge() > siblingPanel2.rightEdge()

            expect( panelZeroContainsSibling1 ).toBe( true )
            expect( panelZeroContainsSibling2 ).toBe( true )

        } )


    } )


} )



//// Depth Index ///////////////////////////////////////////////////////////////

describe( 'Depth index', () => {


    test( 'Depth index: Get and set', () => {

        initializeDomWithSvg()

        // Create panel
        const myPanel = new navigator.NestedPanel().build()


        //// GET DEPTH INDEX ////

        // GET default depth index value
        expect( myPanel.depthIndex() ).toBe( 0 )

        // Check things from DOM perspective
        let depthIndexOfPanel = document.querySelector( '.panel' ).getAttribute( 'depthIndex' )
        expect( depthIndexOfPanel ).toBe( '0' )



        //// SET DEPTH INDEX ////

        // Set a new depthIndex value
        myPanel.depthIndex( 1 ).update()
        expect( myPanel.depthIndex() ).toBe( 1 )

        // Check things from DOM perspective
        depthIndexOfPanel = document.querySelector( '.panel' ).getAttribute( 'depthIndex' )
        expect( depthIndexOfPanel ).toBe( '1' )




    } )


    test( 'Depth Index: Check automatic incrementation upon adding new panels', () => {

        initializeDomWithSvg()

        // Create panel
        const parentPanel = new navigator.NestedPanel()
        parentPanel.id( 'parent-panel' ).build()



        //// AUTO DEPTH INDEX: NO CHILD PANELS ////

        // Check the depth index in a one-panel setup
        expect( parentPanel.depthIndex() ).toBe( 0 )

        // Check things from DOM perspective
        expect( document.querySelectorAll( '.panel' ) ).toHaveLength( 1 )
        const depthIndexOfParentPanel = document.querySelector( '#parent-panel' ).getAttribute( 'depthIndex' )
        expect( depthIndexOfParentPanel ).toBe( '0' )



        //// AUTO DEPTH INDEX: ONE CHILD PANEL ////

        // Create a child panel
        let objectToSpawnFrom = parentPanel.objects( 'gender' ).objects( 'male' )
        const childPanel = new navigator.NestedPanel( parentPanel, objectToSpawnFrom )  // spawn source must be
                                                                                        // specified if a parent panel
                                                                                        // is specified
        childPanel.id( 'child-panel' ).build()

        // Check the depth indexes
        expect( parentPanel.depthIndex() ).toBe( 0 )
        expect( childPanel.depthIndex() ).toBe( 1 )

        // Check things from DOM perspective
        expect( document.querySelectorAll( '.panel' ) ).toHaveLength( 2 )
        const depthIndexOfChildPanel = document.querySelector( '#child-panel' ).getAttribute( 'depthIndex' )
        expect( depthIndexOfChildPanel ).toBe( '1' )



        //// AUTO DEPTH INDEX: TWO CHILD PANELS ////

        // Create a grandchild panel
        objectToSpawnFrom = childPanel.objects( 'status' ).objects( 'survived' )
        const grandChildPanel = new navigator.NestedPanel( childPanel, objectToSpawnFrom )  // spawn source must be
                                                                                            // specified if a parent
                                                                                            // panel is specified
        grandChildPanel.id( 'grandchild-panel' ).build()

        // Check the depth indexes
        expect( parentPanel.depthIndex() ).toBe( 0 )
        expect( childPanel.depthIndex() ).toBe( 1 )
        expect( grandChildPanel.depthIndex() ).toBe( 2 )

        // Check things from DOM perspective
        expect( document.querySelectorAll( '.panel' ) ).toHaveLength( 3 )
        const depthIndexOfGrandChildPanel = document.querySelector( '#grandchild-panel' ).getAttribute( 'depthIndex' )
        expect( depthIndexOfGrandChildPanel ).toBe( '2' )



        //// AUTO DEPTH INDEX: AFTER REMOVING AND RE-ADDING CHILD PANELS  ////

        // Remove child and grandchild panels
        childPanel.remove()
        grandChildPanel.remove()

        // The variables are not deleted, so its ok for these to still exist
        expect( parentPanel.depthIndex() ).toBe( 0 )
        expect( childPanel.depthIndex() ).toBe( 1 )
        expect( grandChildPanel.depthIndex() ).toBe( 2 )

        // But on DOM, there should NOT be any child or grandchild panels or their depthIndexes.
        expect( document.querySelectorAll( '.panel' ) ).toHaveLength( 1 )

        // Add a child panel
        objectToSpawnFrom = parentPanel.objects( 'gender' ).objects( 'female' )
        const childPanel2 = new navigator.NestedPanel( parentPanel, objectToSpawnFrom )  // spawn source must be
                                                                                         // specified if a parent panel
                                                                                         // is specified
        childPanel2.id( 'child-panel2' ).build()

        // Check depth indexes
        expect( parentPanel.depthIndex() ).toBe( 0 )
        expect( childPanel2.depthIndex() ).toBe( 1 )

        // Check things from DOM perspective
        expect( document.querySelectorAll( '.panel' ) ).toHaveLength( 2 )
        const depthIndexOfChildPanel2 = document.querySelector( '#child-panel2' ).getAttribute( 'depthIndex' )
        expect( depthIndexOfChildPanel2 ).toBe( '1' )


    } )


} )



//// ADD CHILD PANELS ///////////////////////////////////////////////////////////////

describe( 'Add Child Panels: Should add child panels correctly', () => {

    test( 'Add Child: Two children should exist', () => {

        initializeDomWithSvg()

        // Add panel #0
        const myNestedPanel = new navigator.NestedPanel().build()
        // Add child panel #1
        const spawnObjectForChild1 = myNestedPanel.objects( 'gender' ).objects( 'female' )
        const myChildPanel1 = new navigator.NestedPanel( myNestedPanel, spawnObjectForChild1 ).build()
        // Add child panel #2
        const spawnObjectForChild2 = myChildPanel1.objects( 'gender' ).objects( 'male' )
        const myChildPanel2 = new navigator.NestedPanel( myChildPanel1, spawnObjectForChild2 ).build()


        // Check the number of panels on DOM
        const allPanelObjects = document.querySelectorAll( '.panel' )
        expect( ( allPanelObjects ) ).toHaveLength( 3 )

    } )


    test( 'Reset Vertical Inner Padding: Restore top and bottom inner padding', () => {

        initializeDomWithSvg()

        // Add panel #0
        const myPanel = new navigator.Panel()

        // Change padding values
        myPanel
            .innerPaddingTop( myPanel.innerPaddingTop() + 50 )
            .innerPaddingBottom( myPanel.innerPaddingBottom() + 25 )

        // Confirm the change in relation to default values
        expect( myPanel.innerPaddingTop() )
            .toBe( cpcDefaults.panel.innerPaddingTop + 50 )
        expect( myPanel.innerPaddingBottom() )
            .toBe( cpcDefaults.panel.innerPaddingBottom + 25 )


        // Reset padding values
        myPanel._resetVerticalInnerPadding()

        // Padding values should be reset to their defaults
        expect( myPanel.innerPaddingTop() )
            .toBe( cpcDefaults.panel.innerPaddingTop )
        expect( myPanel.innerPaddingBottom() )
            .toBe( cpcDefaults.panel.innerPaddingBottom )


    } )

    // ↓↓↓ IT WAS NOT POSSIBLE TO TEST ALIGNMENT BECAUSE OF ANIMATIONS.
    // ↓↓↓ All charts look aligned at the test time, even if they may not be on DOM
    // after the creation animations are finished.
    // test('Charts in all panels should be horizontally aligned', () => {
    // })

} )



//// REMOVE CHILD PANELS ///////////////////////////////////////////////////////////////

describe( 'Remove: Remove child panels and panel zero', () => {


    test( 'Remove children panels one by one', () => {

        initializeDomWithSvg()

        // Add panel #0
        const panelZero = new navigator.NestedPanel().build()
        // Add child panel #1
        const spawnObjectForChild1 = panelZero.objects( 'gender' ).objects( 'female' )
        const childPanel1 = new navigator.NestedPanel( panelZero, spawnObjectForChild1 ).build()
        // Add child panel #2
        const spawnObjectForChild2 = childPanel1.objects( 'gender' ).objects( 'male' )
        const childPanel2 = new navigator.NestedPanel( childPanel1, spawnObjectForChild2 ).build()


        // Get initial number of panels
        let allPanelElements = document.querySelectorAll( '.panel' )
        expect( allPanelElements ).toHaveLength( 3 )



        // Remove child 2
        childPanel2.remove()

        // Parent object should no more have child
        expect( childPanel1.childrenPanels.size ).not.toBe()

        // Confirm removal on DOM
        allPanelElements = document.querySelectorAll( '.panel' )
        expect( allPanelElements ).toHaveLength( 2 )



        // Remove child 1
        childPanel1.remove()

        // Parent object should no more have a child
        expect( panelZero.childrenPanels.size ).not.toBe()

        // Confirm removal on DOM
        allPanelElements = document.querySelectorAll( '.panel' )
        expect( allPanelElements ).toHaveLength( 1 )

    } )


    test( 'Remove panel zero', () => {

        initializeDomWithSvg()


        // Add panel #0
        const panelZero = new navigator.NestedPanel().build()
        // Add child panel #1
        const spawnObjectForChild1 = panelZero.objects( 'gender' ).objects( 'female' )
        const childPanel1 = new navigator.NestedPanel( panelZero, spawnObjectForChild1 ).build()
        // Add child panel #2
        const spawnObjectForChild2 = childPanel1.objects( 'gender' ).objects( 'male' )
        const childPanel2 = new navigator.NestedPanel( childPanel1, spawnObjectForChild2 ).build()


        // Get initial number of panels
        let allPanelElements = document.querySelectorAll( '.panel' )
        expect( allPanelElements ).toHaveLength( 3 )

        // Remove panel zero
        panelZero.remove()

        // Confirm removal on DOM
        allPanelElements = document.querySelectorAll( '.panel' )
        expect( allPanelElements ).toHaveLength( 0 )

    } )




    test( 'After a grandparent panel is removed, there should be no leftover child elements in JS environment' +
        ' (previously a bug)', () => {

        const { panelZero, childPanel, grandChildPanel } = initializeDomWith.panelZero.and.childAndGrandchild()
        panelZero.remove()

        // There should not be any registered children or grandchildren
        expect( panelZero.childrenPanels.size ).toBe( 0 )
        expect( childPanel.childrenPanels.size ).toBe( 0 )
        expect( grandChildPanel.childrenPanels.size ).toBe( 0 )

    } )


    test( 'Removing a high-level panel in a display with a deep query should leave behind no connector polygons from' +
        'deep children (previously a bug)', () => {

        const { panelZero, childPanel, grandChildPanel } = initializeDomWith.panelZero.and.childAndGrandchild()
        panelZero.remove()

        expect( document.querySelectorAll( 'polygon' ).length ).toBe( 0 )

    } )


} )



//// ADD SIBLING PANELS ///////////////////////////////////////////////////////////////

describe( 'Add Sibling Panels', () => {


    test( 'It should be possible to add a sibling to panel that has a child', () => {

        // Initialize
        const { panelZero, childPanel, grandChildPanel } = initializeDomWith.panelZero.and.childAndGrandchild()
        panelZero.showConnectorPolygons( false ).update()  // for ease of visual testing with writeDomToFile()

        // Add sibling panel
        const spawnObjectForSibling = panelZero.objects( 'gender' ).objects( 'male' )
        const siblingPanel = new navigator.NestedPanel( panelZero, spawnObjectForSibling, 'sibling' ).build()
        jest.runAllTimers()

        // The new sibling should be on the right side of the old existing child panel
        expect( childPanel.rightEdge() < siblingPanel.leftEdge() ).toBeTruthy()

    } )


} )




//// QUICK SWITCH ANIMATION ///////////////////////////////////////////////////////////////

describe( 'Animations: Switch to a panel on the same depth level using the quick switch animation', () => {


    test( 'Extend animation: Add panel ', () => {

        initializeDomWithSvg()
        // Create panel
        const parentPanel = new navigator.NestedPanel()
        parentPanel.id( 'parent-panel' ).build()


        // Create a child panel
        let objectToSpawnFrom = parentPanel.objects( 'gender' ).objects( 'male' )
        const childPanel = new navigator.NestedPanel( parentPanel, objectToSpawnFrom )  // spawn source must be
                                                                                        // specified if a parent panel
                                                                                        // is specified
        childPanel.id( 'child-panel' ).build()

        // Count the number of panels on DOM after the animation
        const allPanels = document.querySelectorAll( '.panel' )
        const numberOfPanels = allPanels.length
        expect( ( numberOfPanels ) ).toBe( 2 )

    } )


    test( 'Switch Animation: Add panel ', () => {

        initializeDomWithSvg()
        // Create panel
        const parentPanel = new navigator.NestedPanel()
        parentPanel.id( 'parent-panel' ).build()


        // Create a child panel
        let objectToSpawnFrom = parentPanel.objects( 'gender' ).objects( 'female' )
        const childPanel = new navigator.NestedPanel( parentPanel, objectToSpawnFrom )  // spawn source must be
                                                                                        // specified if a parent panel
                                                                                        // is specified
        childPanel.id( 'child-panel' ).build()

        // Count the number of panels on DOM after the animation
        const allPanels = document.querySelectorAll( '.panel' )
        const numberOfPanels = allPanels.length
        expect( ( numberOfPanels ) ).toBe( 2 )

    } )


//     test('APPEND animation: Add sibling panel to existing one ', () => {
//
//         // PREP //
//         // Clear JEST's DOM to prevent leftovers from previous tests
//         document.body.innerHTML = ''
//         // Create SVG
//         const mySvg = new container.Svg()
//         // Create panel
//         const parentPanel = new navigator.NestedPanel()
//         parentPanel.id('parent-panel').update()
//
//
//         let objectToSpawnFrom
//
//         // Create a child panel
//         objectToSpawnFrom = parentPanel.objects('gender').objects('female')
//         const childPanel = new navigator.NestedPanel( parentPanel, objectToSpawnFrom )  // spawn source must be
// specified if a parent panel is specified childPanel.id('child-panel').update()  // Create a sibling panel next to
// the existing child panel objectToSpawnFrom = parentPanel.objects('gender').objects('male') const siblingPanel = new
// navigator.NestedPanel( parentPanel, objectToSpawnFrom, 'sibling' )  // spawn source must be specified if a parent
// panel is specified siblingPanel.id('sibling-panel').update()  // Count the number of panels on DOM after the
// animation // const allPanels = document.querySelectorAll( '.panel' ) // const numberOfPanels = allPanels.length //
// expect( (numberOfPanels) ).toBe( 2 )  })
} )



//// ANIMATION TIMES ///////////////////////////////////////////////////////////////

describe( 'animationDuration', () => {


    test( 'Init: Animation times must be correctly set on initialization', () => {

        initializeDomWithSvg()

        jest.useFakeTimers()

        // Create panel 0
        const panel0 = new navigator.NestedPanel()
            .bgFill( '#deebf7' )
            .x( 200 ).y( 25 )
            .yAxisLabels( true )
            .update( 0 )
        jest.runOnlyPendingTimers()


        // Check initially calculated animation durations
        expect( panel0._animation.duration ).toTabulateAs( `\
┌──────────────────────┬────────┐
│       (index)        │ Values │
├──────────────────────┼────────┤
│        total         │  600   │
│     extendBridge     │  300   │
│    appendSibling     │  300   │
│   retractAndExtend   │  300   │
│       retract        │  300   │
│    lateralSwitch     │  200   │
│  maximizePanelCover  │  300   │
│ backgroundAdjustment │  300   │
│  collapseBackground  │  300   │
└──────────────────────┴────────┘` )

    } )


    test( 'Get/Set: Animation times must be correctly get/set ', () => {

        initializeDomWithSvg()

        jest.useFakeTimers()

        // Create panel 0
        const panel0 = new navigator.NestedPanel()
            .bgFill( '#deebf7' )
            .x( 200 ).y( 25 )
            .yAxisLabels( true )
            .update( 0 )
        jest.runOnlyPendingTimers()



        // Modify total animation duration and recalculate individual durations
        panel0._animation.duration.total = 299  // to test rounding
        panel0._inferAnimationDurations()

        expect( panel0._animation.duration ).toTabulateAs( `\
┌──────────────────────┬────────┐
│       (index)        │ Values │
├──────────────────────┼────────┤
│        total         │  299   │
│     extendBridge     │  150   │
│    appendSibling     │  150   │
│   retractAndExtend   │  150   │
│       retract        │  150   │
│    lateralSwitch     │  100   │
│  maximizePanelCover  │  150   │
│ backgroundAdjustment │  150   │
│  collapseBackground  │  150   │
└──────────────────────┴────────┘` )

        // Use `_adjustAll` after modifying, instead of `_adjustAnimationDurations`
        panel0._animation.duration.total = 1000  // to test rounding
        panel0._adjustAllPanels()

        expect( panel0._animation.duration ).toTabulateAs( `\
┌──────────────────────┬────────┐
│       (index)        │ Values │
├──────────────────────┼────────┤
│        total         │  1000  │
│     extendBridge     │  500   │
│    appendSibling     │  500   │
│   retractAndExtend   │  500   │
│       retract        │  500   │
│    lateralSwitch     │  333   │
│  maximizePanelCover  │  500   │
│ backgroundAdjustment │  500   │
│  collapseBackground  │  500   │
└──────────────────────┴────────┘` )

    } )


    test( 'Propagate: When an animation duration is set, it should be propagated to all children and parents', () => {

        initializeDomWithSvg()

        jest.useFakeTimers()

        // Create panel 0
        const panel0 = new navigator.NestedPanel()
            .bgFill( '#deebf7' )
            .x( 200 ).y( 25 )
            .yAxisLabels( true )
            .build( 0 )
        jest.runOnlyPendingTimers()

        // Create panel-1-0 (child)
        const spawnObjectForPanel1_0 = panel0.objects( 'gender' ).objects( 'female' )
        const panel1_0 = new navigator.NestedPanel( panel0, spawnObjectForPanel1_0 )
        panel1_0.build()
        jest.runOnlyPendingTimers()


        // Create panel-2-0 (grandchild)
        let panel2_0  // declaration must be outside the setTimer function
        setTimeout( () => {
            const spawnObjectForPanel2_0 = panel1_0.objects( 'class' ).objects( 'first-class' )
            panel2_0 = new navigator.NestedPanel( panel1_0, spawnObjectForPanel2_0 )
            panel2_0.build()
        }, 1000 )
        jest.runOnlyPendingTimers()

        // Create panel-2-1 (sibling of grandchild)
        let panel2_1
        setTimeout( () => {
            const spawnObjectForPanel2_1 = panel1_0.objects( 'class' ).objects( 'second-class' )
            panel2_1 = new navigator.NestedPanel( panel1_0, spawnObjectForPanel2_1, 'sibling' )
            panel2_1.build()

        }, 2000 )
        jest.runOnlyPendingTimers()




        // Set animation duration for panel-1-0 (child)
        expect( panel1_0.animationDuration() ).not.toBe( 1000 )
        panel1_0.animationDuration( 1000 )
        panel1_0.update()

        expect( panel1_0._animation.duration ).toTabulateAs( `\
┌──────────────────────┬────────┐
│       (index)        │ Values │
├──────────────────────┼────────┤
│        total         │  1000  │
│     extendBridge     │  500   │
│    appendSibling     │  500   │
│   retractAndExtend   │  500   │
│       retract        │  500   │
│    lateralSwitch     │  333   │
│  maximizePanelCover  │  500   │
│ backgroundAdjustment │  500   │
│  collapseBackground  │  500   │
└──────────────────────┴────────┘` )

        expect( panel0._animation.duration ).toTabulateAs( `\
┌──────────────────────┬────────┐
│       (index)        │ Values │
├──────────────────────┼────────┤
│        total         │  1000  │
│     extendBridge     │  500   │
│    appendSibling     │  500   │
│   retractAndExtend   │  500   │
│       retract        │  500   │
│    lateralSwitch     │  333   │
│  maximizePanelCover  │  500   │
│ backgroundAdjustment │  500   │
│  collapseBackground  │  500   │
└──────────────────────┴────────┘` )

        expect( panel2_0._animation.duration ).toTabulateAs( `\
┌──────────────────────┬────────┐
│       (index)        │ Values │
├──────────────────────┼────────┤
│        total         │  1000  │
│     extendBridge     │  500   │
│    appendSibling     │  500   │
│   retractAndExtend   │  500   │
│       retract        │  500   │
│    lateralSwitch     │  333   │
│  maximizePanelCover  │  500   │
│ backgroundAdjustment │  500   │
│  collapseBackground  │  500   │
└──────────────────────┴────────┘` )

        expect( panel2_1._animation.duration ).toTabulateAs( `\
┌──────────────────────┬────────┐
│       (index)        │ Values │
├──────────────────────┼────────┤
│        total         │  1000  │
│     extendBridge     │  500   │
│    appendSibling     │  500   │
│   retractAndExtend   │  500   │
│       retract        │  500   │
│    lateralSwitch     │  333   │
│  maximizePanelCover  │  500   │
│ backgroundAdjustment │  500   │
│  collapseBackground  │  500   │
└──────────────────────┴────────┘` )




    } )

} )


describe( 'Stroke', () => {

    test( 'Get/set stroke width and color', () => {

        const panel0 = initializeDomWith.panelZero()

        // GET //

        expect( panel0.strokeWidth() ).toBe( '0.5px' )
        expect( panel0.stroke() ).toBe( 'rgba(255, 255, 255, 1.0)' )

        const { strokeWidths: defaultStrokeWidths, strokeColors: defaultStrokeColors } = getStrokeWidthsAndColors( panel0 )

        expect( defaultStrokeWidths ).toTabulateAs( `\
┌───────────────────┬──────────┬─────────────┐
│ (iteration index) │   Key    │   Values    │
├───────────────────┼──────────┼─────────────┤
│         0         │ 'gender' │ [ '0.5px' ] │
│         1         │ 'class'  │ [ '0.5px' ] │
│         2         │ 'status' │ [ '0.5px' ] │
└───────────────────┴──────────┴─────────────┘` )

        expect( defaultStrokeColors ).toTabulateAs( `\
┌───────────────────┬──────────┬────────────────────────────────┐
│ (iteration index) │   Key    │             Values             │
├───────────────────┼──────────┼────────────────────────────────┤
│         0         │ 'gender' │ [ 'rgba(255, 255, 255, 1.0)' ] │
│         1         │ 'class'  │ [ 'rgba(255, 255, 255, 1.0)' ] │
│         2         │ 'status' │ [ 'rgba(255, 255, 255, 1.0)' ] │
└───────────────────┴──────────┴────────────────────────────────┘` )



        // SET //

        panel0.strokeWidth( '4px' )
        panel0.stroke( 'black' )
        expect( panel0.strokeWidth() ).toBe( '4px' )
        expect( panel0.stroke() ).toBe( 'black' )


        panel0.update()

        // Check if changes are passed on to charts in panel
        const { strokeWidths: newStrokeWidths, strokeColors: newStrokeColors } = getStrokeWidthsAndColors( panel0 )

        expect( newStrokeWidths ).toTabulateAs( `\
┌───────────────────┬──────────┬───────────┐
│ (iteration index) │   Key    │  Values   │
├───────────────────┼──────────┼───────────┤
│         0         │ 'gender' │ [ '4px' ] │
│         1         │ 'class'  │ [ '4px' ] │
│         2         │ 'status' │ [ '4px' ] │
└───────────────────┴──────────┴───────────┘` )

        expect( newStrokeColors ).toTabulateAs( `\
┌───────────────────┬──────────┬─────────────┐
│ (iteration index) │   Key    │   Values    │
├───────────────────┼──────────┼─────────────┤
│         0         │ 'gender' │ [ 'black' ] │
│         1         │ 'class'  │ [ 'black' ] │
│         2         │ 'status' │ [ 'black' ] │
└───────────────────┴──────────┴─────────────┘` )

    } )


    test( 'Child panels should inherit parent\'s stroke width and color', () => {

        const panel0_0 = initializeDomWith.panelZero()

        // Check default values
        expect( panel0_0.strokeWidth() ).toBe( '0.5px' )
        expect( panel0_0.stroke() ).toBe( 'rgba(255, 255, 255, 1.0)' )


        // Change values
        panel0_0.strokeWidth( '4px' )
        panel0_0.stroke( 'red' )

        // Verify the change
        expect( panel0_0.strokeWidth() ).toBe( '4px' )
        expect( panel0_0.stroke() ).toBe( 'red' )


        // Add child panel
        const spawnObjectForChild1 = panel0_0.objects( 'gender' ).objects( 'female' )
        const panel1_0 = new navigator.NestedPanel( panel0_0, spawnObjectForChild1 )
        panel1_0.build()

        // Confirm that child's values are the same with parent
        expect( panel1_0.strokeWidth() ).toBe( '4px' )
        expect( panel1_0.stroke() ).toBe( 'red' )


    } )


    test( 'Backgrounds: Panel backgrounds should have the right stroke width and color', () => {

        const { panelZero, childPanel, grandChildPanel } = initializeDomWith.panelZero.and.childAndGrandchild()
        const panels = [ panelZero, childPanel, grandChildPanel ]

        // Check initial values
        const { bgStrokeWidths: defaultBgRectStrokeWidths, bgStokeColors: defaultBgRectStrokeColors } = getPropertiesOfBgObjects( panels )
        expect( defaultBgRectStrokeWidths ).toEqual( [ '0.5px', '0.5px', '0.5px' ] )
        expect( defaultBgRectStrokeColors ).toEqual( [ 'rgba(255, 255, 255, 1.0)', 'rgba(255, 255, 255, 1.0)', 'rgba(255, 255, 255, 1.0)' ] )


        // Change values
        panelZero
            .strokeWidth( '4px' )
            .stroke( 'red' )
            .update( 0 )

        // Confirm changes
        const { bgStrokeWidths: newBgStrokeWidths, bgStokeColors: newBgStrokeColors } = getPropertiesOfBgObjects( panels )

        expect( newBgStrokeWidths ).toEqual( [ '4px', '4px', '4px' ] )
        expect( newBgStrokeColors ).toEqual( [ 'red', 'red', 'red' ] )

    } )


    // Helper Functions //

    function getPropertiesOfBgObjects( arrayOfPanelObjects ) {

        const bgStrokeWidths = []
        const bgStokeColors = []
        arrayOfPanelObjects.forEach( ( panelObject ) => {

            const backgroundStokeWidth = panelObject._backgroundObject.strokeWidth()
            const backgroundStokeColor = panelObject._backgroundObject.stroke()

            bgStrokeWidths.push( backgroundStokeWidth )
            bgStokeColors.push( backgroundStokeColor )

        } )
        return { bgStrokeWidths, bgStokeColors }
    }

} )



//// Color Themes ///////////////////////////////////////////////////////////////

describe( 'Color Themes', () => {

    test( 'Auto-set color set in child panels based on parent', () => {

        // Clear JEST's DOM to prevent leftovers from previous tests
        document.body.innerHTML = ''
        // Create SVG
        const mySvg = new container.Svg()
        // Create parent panel
        const panelZero = new navigator.NestedPanel( mySvg )  // no need to specify a spawn source if no parent is
                                                              // specified
        panelZero
            .colorSet( 'Viridis' )
            .build()

        // Make a child panel
        const spawnObjectForChild1 = panelZero.objects( 'gender' ).objects( 'female' )
        const childPanel1 = new navigator.NestedPanel( panelZero, spawnObjectForChild1 )
        childPanel1.build()

        // Child should not have its own color scheme, but one based on parent
        let panelZeroColorSet = panelZero.colorSet()
        let childOneColorSet = childPanel1.colorSet()
        expect( childOneColorSet ).toEqual( panelZeroColorSet )



        // LIVE COLOR UPDATE //

        // Color of child should change if parent's color is updated
        panelZero.colorSet( 'Magma' ).update()

        // Child panel color theme should match to that of parent's
        panelZeroColorSet = panelZero.colorSet()
        childOneColorSet = childPanel1.colorSet()
        expect( panelZeroColorSet ).toEqual( childOneColorSet )


        // Background and bridge color of child should match the color of spawn source
        let bridgeColor = childPanel1._bridgeObject.fill()
        let childBgColor = childPanel1._backgroundObject.fill()
        let spawnSourceCategoryColor = childPanel1.objectToSpawnFrom.fill()

        expect( bridgeColor ).toBe( spawnSourceCategoryColor )
        expect( childBgColor ).toBe( spawnSourceCategoryColor )

    } )


} )




//// Connector Polygons ///////////////////////////////////////////////////////////////

describe( 'Connector Polygons', () => {


    let panelZero
        , childPanel

    // Setup
    beforeEach( () => {

        initializeDomWithSvg()  /* Do not delete this line. Otherwise, when many tests are ran in tandem,
                                    `childPanel.has.numberOfVisibleCategories()` returns double the amount of
                                     expected elements. This is likely due to leftovers from a previous test, (even
                                     though the DOM is cleared during `initializeDomWith.panelZero.and.child()`. */

        // Initialize panels (temporary names so that the deconstruction can work)
        const { panelZero: panel0, childPanel: panel1 } = initializeDomWith.panelZero.and.child()
        panelZero = panel0
        childPanel = panel1

    } )


    // Helper Function(s) //

    function visibilityAttributesOfAllConnectorPolygonsOnDom() {

        const visibilityOfConnectorPolygonElements = []
        const allConnectorPolygonElements = document.querySelectorAll( '.connector-polygon' )
        allConnectorPolygonElements.forEach( connectorPolygonElement => {

            const visibilityStatus = connectorPolygonElement.getAttribute( 'visibility' )
            visibilityOfConnectorPolygonElements.push( visibilityStatus )

        } )
        return visibilityOfConnectorPolygonElements
    }


    function opacityLevelsOfAllConnectorPolygonsOnDom() {

        const opacityLevelsOfConnectorPolygonElements = []
        const allConnectorPolygonElements = document.querySelectorAll( '.connector-polygon' )
        allConnectorPolygonElements.forEach( connectorPolygonElement => {

            const opacityLevel = connectorPolygonElement.getAttribute( 'opacity' )
            opacityLevelsOfConnectorPolygonElements.push( opacityLevel )

        } )
        return opacityLevelsOfConnectorPolygonElements
    }



    test( 'The right number of connector polygons should exist between categories by default', () => {

        // Count the number of categories and compare them with the number of connectors //

        expect( panelZero.has.numberOfVisibleCategories() ).toBe( 7 )
        expect( childPanel.has.numberOfVisibleCategories() ).toBe( 7 )

        const allPolygonElementsOnDom = document.querySelectorAll( '.connector-polygon' )
        expect( allPolygonElementsOnDom.length ).toBe( 7 )



        // Check an individual connection's existence //

        const panelZeroMaleRectangle = panelZero.objects( 'gender' ).objects( 'male' ).objects( 'rectangle' )
        const childPanelMaleRectangle = childPanel.objects( 'gender' ).objects( 'male' ).objects( 'rectangle' )

        expect( panelZeroMaleRectangle.connectorRight() ).toBeDefined()
        expect( childPanelMaleRectangle.connectorLeft() ).toBeDefined()



    } )



    test( 'Visibility: It should be possible to toggle visibility of all connector polygons in NestedPanel', () => {


        // Sample LinkableRectangles from DOM
        const panelZeroMaleRectangle = panelZero.objects( 'gender' ).objects( 'male' ).objects( 'rectangle' )
        const childPanelMaleRectangle = childPanel.objects( 'gender' ).objects( 'male' ).objects( 'rectangle' )

        // Sampled LinkableRectangles should be visible (initial state)
        expect( panelZeroMaleRectangle.connectorRight().visibility() ).toBe( 'visible' )
        expect( childPanelMaleRectangle.connectorLeft().visibility() ).toBe( 'visible' )

        expect( childPanelMaleRectangle.visibilityOfAllConnectorsInEnsemble() ).toBe( 'visible' )
        expect( panelZeroMaleRectangle.visibilityOfAllConnectorsInEnsemble() ).toBe( 'visible' )

        // All connector elements on DOM should be initially visible
        const visibilityOfConnectorPolygonElementsBeforeToggle = visibilityAttributesOfAllConnectorPolygonsOnDom()
        expect( visibilityOfConnectorPolygonElementsBeforeToggle ).toEqual(
            [ 'visible', 'visible', 'visible', 'visible', 'visible', 'visible', 'visible' ]
        )



        // HIDE connector polygons via NestedPanel interface (and not LinkableRectangle interface)
        panelZero.showConnectorPolygons( false ).update()



        // Sampled LinkableRectangles should now be hidden (toggled state)
        expect( panelZeroMaleRectangle.connectorRight().visibility() ).toBe( 'hidden' )
        expect( childPanelMaleRectangle.connectorLeft().visibility() ).toBe( 'hidden' )

        expect( childPanelMaleRectangle.visibilityOfAllConnectorsInEnsemble() ).toBe( 'hidden' )
        expect( panelZeroMaleRectangle.visibilityOfAllConnectorsInEnsemble() ).toBe( 'hidden' )

        // All connector elements on DOM should now be visible
        const visibilityOfConnectorPolygonElementsAfterToggle1 = visibilityAttributesOfAllConnectorPolygonsOnDom()
        expect( visibilityOfConnectorPolygonElementsAfterToggle1 ).toEqual(
            [ 'hidden', 'hidden', 'hidden', 'hidden', 'hidden', 'hidden', 'hidden' ]
        )



        // SHOW connector polygons again via NestedPanel interface (and not LinkableRectangle interface)
        panelZero.showConnectorPolygons( true ).update()



        // Sampled LinkableRectangles should now be visible again (toggled state)
        expect( panelZeroMaleRectangle.connectorRight().visibility() ).toBe( 'visible' )
        expect( childPanelMaleRectangle.connectorLeft().visibility() ).toBe( 'visible' )

        expect( childPanelMaleRectangle.visibilityOfAllConnectorsInEnsemble() ).toBe( 'visible' )
        expect( panelZeroMaleRectangle.visibilityOfAllConnectorsInEnsemble() ).toBe( 'visible' )

        // All connector elements on DOM should now be visible
        const visibilityOfConnectorPolygonElementsAfterToggle2 = visibilityAttributesOfAllConnectorPolygonsOnDom()
        expect( visibilityOfConnectorPolygonElementsAfterToggle2 ).toEqual(
            [ 'visible', 'visible', 'visible', 'visible', 'visible', 'visible', 'visible' ]
        )

    } )



    test( 'Opacity: It should be possible to change opacity of all connector polygons in NestedPanel', () => {

        jest.useFakeTimers()

        // Sample LinkableRectangles from DOM
        const panelZeroMaleRectangle = panelZero.objects( 'gender' ).objects( 'male' ).objects( 'rectangle' )
        const childPanelMaleRectangle = childPanel.objects( 'gender' ).objects( 'male' ).objects( 'rectangle' )

        // Sampled LinkableRectangles should be visible (initial state)
        expect( panelZeroMaleRectangle.connectorRight().opacity() ).toBe( 1 )
        expect( childPanelMaleRectangle.connectorLeft().opacity() ).toBe( 1 )

        expect( childPanelMaleRectangle.opacityOfAllConnectorsInEnsemble() ).toBe( 1 )
        expect( panelZeroMaleRectangle.opacityOfAllConnectorsInEnsemble() ).toBe( 1 )


        jest.runAllTimers()


        // All connector elements on DOM should be initially visible
        expect( opacityLevelsOfAllConnectorPolygonsOnDom() ).toEqual(
            [ '1', '1', '1', '1', '1', '1', '1' ]
        )



        // HIDE connector polygons via NestedPanel interface (and not LinkableRectangle interface)
        panelZero.opacityOfConnectorPolygons( 0.5 ).update()



        // Sampled LinkableRectangles should now be hidden (toggled state)
        expect( panelZeroMaleRectangle.connectorRight().opacity() ).toBe( 0.5 )
        expect( childPanelMaleRectangle.connectorLeft().opacity() ).toBe( 0.5 )

        expect( childPanelMaleRectangle.opacityOfAllConnectorsInEnsemble() ).toBe( 0.5 )
        expect( panelZeroMaleRectangle.opacityOfAllConnectorsInEnsemble() ).toBe( 0.5 )

        // All connector elements on DOM should now be visible
        const opacityOfConnectorPolygonElementsAfterToggle1 = opacityLevelsOfAllConnectorPolygonsOnDom()
        expect( opacityOfConnectorPolygonElementsAfterToggle1 ).toEqual(
            [ '0.5', '0.5', '0.5', '0.5', '0.5', '0.5', '0.5' ]
        )



        // SHOW connector polygons again via NestedPanel interface (and not LinkableRectangle interface)
        panelZero.opacityOfConnectorPolygons( 1 ).update()



        // Sampled LinkableRectangles should now be visible again (toggled state)
        expect( panelZeroMaleRectangle.connectorRight().opacity() ).toBe( 1 )
        expect( childPanelMaleRectangle.connectorLeft().opacity() ).toBe( 1 )

        expect( childPanelMaleRectangle.opacityOfAllConnectorsInEnsemble() ).toBe( 1 )
        expect( panelZeroMaleRectangle.opacityOfAllConnectorsInEnsemble() ).toBe( 1 )

        // All connector elements on DOM should now be visible
        const opacityOfConnectorPolygonElementsAfterToggle2 = opacityLevelsOfAllConnectorPolygonsOnDom()
        expect( opacityOfConnectorPolygonElementsAfterToggle2 ).toEqual(
            [ '1', '1', '1', '1', '1', '1', '1' ]
        )

    } )



} )




//// Inner Padding Synchronization ///////////////////////////////////////////////////////////////

describe( 'Synchronizing Inner Padding with Parents and Children', () => {


    test( 'When top or bottom inner padding of a parent panel is changed, children should adapt', async () => {

        jest.clearAllMocks()
        jest.spyOn(
            navigator.NestedPanel.prototype,
            '_recursivelyAlignChartsInAnyChildrenPanelsWithChartsInThisPanel'
        )

        const { panelZero, childPanel, grandChildPanel1, grandChildPanel2 } = initializeDomWith.panelZero.and.childThatHasTwoSiblingChildren()

        // Change bottom and top edge of panelZero chart area
        panelZero
            .innerPaddingTop( 100 )
            .innerPaddingBottom( 75 )
            .update()

        // Align the top and bottom edges of chart areas of children with the panelZero
        panelZero
            ._recursivelyAlignChartsInAnyChildrenPanelsWithChartsInThisPanel()
            .update()


        // Ensure that there are no infinite recursions, etc
        expect( navigator.NestedPanel.prototype._recursivelyAlignChartsInAnyChildrenPanelsWithChartsInThisPanel )
            .toHaveBeenCalledTimes( 2 )

        // Get top and bottom edges of chart areas in all panels
        const topEdgeOfPanelZeroChartsArea = panelZero.objects( 'status' ).objects( 'died' ).objects( 'rectangle' ).topLeftCorner()[ 1 ]
        const bottomEdgeOfPanelZeroChartsArea = panelZero.objects( 'gender' ).objects( 'male' ).objects( 'rectangle' ).bottomLeftCorner()[ 1 ]

        const topEdgeOfChildPanelChartsArea = childPanel.objects( 'status' ).objects( 'died' ).objects( 'rectangle' ).topLeftCorner()[ 1 ]
        const bottomEdgeOfChildPanelChartsArea = childPanel.objects( 'gender' ).objects( 'male' ).objects( 'rectangle' ).bottomLeftCorner()[ 1 ]

        const topEdgeOfGrandchildPanel1ChartsArea = grandChildPanel1.objects( 'status' ).objects( 'died' ).objects( 'rectangle' ).topLeftCorner()[ 1 ]
        const bottomEdgeOfGrandchildPanel1ChartsArea = grandChildPanel1.objects( 'gender' ).objects( 'male' ).objects( 'rectangle' ).bottomLeftCorner()[ 1 ]

        const topEdgeOfGrandchildPanel2ChartsArea = grandChildPanel2.objects( 'status' ).objects( 'died' ).objects( 'rectangle' ).topLeftCorner()[ 1 ]
        const bottomEdgeOfGrandchildPanel2ChartsArea = grandChildPanel2.objects( 'gender' ).objects( 'male' ).objects( 'rectangle' ).bottomLeftCorner()[ 1 ]



        // Top edges of charts should be aligned
        expect( topEdgeOfPanelZeroChartsArea ).toBe( topEdgeOfChildPanelChartsArea )
        expect( topEdgeOfPanelZeroChartsArea ).toBe( topEdgeOfGrandchildPanel1ChartsArea )
        expect( topEdgeOfPanelZeroChartsArea ).toBe( topEdgeOfGrandchildPanel2ChartsArea )

        // Bottom edges of charts should be aligned
        expect( bottomEdgeOfPanelZeroChartsArea ).toBe( bottomEdgeOfChildPanelChartsArea )
        expect( bottomEdgeOfPanelZeroChartsArea ).toBe( bottomEdgeOfGrandchildPanel1ChartsArea )
        expect( bottomEdgeOfPanelZeroChartsArea ).toBe( bottomEdgeOfGrandchildPanel2ChartsArea )



    } )



    test( 'When a new child panel is added, top and bottom inner padding of parent panels AND THEIR SIBLINGS should' +
        ' adapt', async () => {

        jest.clearAllMocks()
        jest.spyOn(
            navigator.NestedPanel.prototype,
            '_recursivelyAlignChartsInAnyChildrenPanelsWithChartsInThisPanel'
        )

        const { panelZero, siblingPanel1, siblingPanel2, siblingPanel3, childPanelOfSibling2 } = initializeDomWith.panelZero.and.threeSiblingChildren.and.childOfOnlyMiddleSibling()


        // Ensure that there are no infinite recursions, etc
        expect( navigator.NestedPanel.prototype._recursivelyAlignChartsInAnyChildrenPanelsWithChartsInThisPanel )
            .toHaveBeenCalledTimes( 2 )


        // Get top and bottom edges of chart areas in all panels
        const topEdgeOfPanelZeroChartsArea = panelZero.objects( 'status' ).objects( 'died' ).objects( 'rectangle' ).topLeftCorner()[ 1 ]
        const bottomEdgeOfPanelZeroChartsArea = panelZero.objects( 'gender' ).objects( 'male' ).objects( 'rectangle' ).bottomLeftCorner()[ 1 ]

        const topEdgeOfSiblingPanel1ChartsArea = siblingPanel1.objects( 'status' ).objects( 'died' ).objects( 'rectangle' ).topLeftCorner()[ 1 ]
        const bottomEdgeOfSiblingPanel1ChartsArea = siblingPanel1.objects( 'gender' ).objects( 'male' ).objects( 'rectangle' ).bottomLeftCorner()[ 1 ]

        const topEdgeOfSiblingPanel2ChartsArea = siblingPanel2.objects( 'status' ).objects( 'died' ).objects( 'rectangle' ).topLeftCorner()[ 1 ]
        const bottomEdgeOfSiblingPanel2ChartsArea = siblingPanel2.objects( 'gender' ).objects( 'male' ).objects( 'rectangle' ).bottomLeftCorner()[ 1 ]

        const topEdgeOfSiblingPanel3ChartsArea = siblingPanel3.objects( 'status' ).objects( 'died' ).objects( 'rectangle' ).topLeftCorner()[ 1 ]
        const bottomEdgeOfSiblingPanel3ChartsArea = siblingPanel3.objects( 'gender' ).objects( 'male' ).objects( 'rectangle' ).bottomLeftCorner()[ 1 ]

        const topEdgeOfChildPanelOfSibling2ChartsArea = childPanelOfSibling2.objects( 'status' ).objects( 'died' ).objects( 'rectangle' ).topLeftCorner()[ 1 ]
        const bottomEdgeOfChildPanelOfSibling2ChartsArea = childPanelOfSibling2.objects( 'gender' ).objects( 'male' ).objects( 'rectangle' ).bottomLeftCorner()[ 1 ]


        // Top edges of charts should be aligned
        expect( topEdgeOfPanelZeroChartsArea ).toBe( topEdgeOfSiblingPanel1ChartsArea )
        expect( topEdgeOfPanelZeroChartsArea ).toBe( topEdgeOfSiblingPanel2ChartsArea )
        expect( topEdgeOfPanelZeroChartsArea ).toBe( topEdgeOfSiblingPanel3ChartsArea )
        expect( topEdgeOfPanelZeroChartsArea ).toBe( topEdgeOfChildPanelOfSibling2ChartsArea )

        // Bottom edges of charts should be aligned
        expect( bottomEdgeOfPanelZeroChartsArea ).toBe( bottomEdgeOfSiblingPanel1ChartsArea )
        expect( bottomEdgeOfPanelZeroChartsArea ).toBe( bottomEdgeOfSiblingPanel2ChartsArea )
        expect( bottomEdgeOfPanelZeroChartsArea ).toBe( bottomEdgeOfSiblingPanel3ChartsArea )
        expect( bottomEdgeOfPanelZeroChartsArea ).toBe( bottomEdgeOfChildPanelOfSibling2ChartsArea )


    } )


} )




//// HELPER FUNCTIONS /////////////////////////////////////////////////////////////

function getStrokeWidthsAndColors( panel0 ) {

    const strokeWidths = new Map()
    const strokeColors = new Map()

    panel0.objects().forEach( ( chartObject, chartName ) => {

        strokeWidths.set( chartName, [] )
            .get( chartName )
            .push( chartObject.strokeWidth() )

        strokeColors.set( chartName, [] )
            .get( chartName )
            .push( chartObject.stroke() )
    } )
    return { strokeWidths, strokeColors }
}

let initializeDomWith = {

    panelZero: function () {

        jest.useFakeTimers()

        initializeDomWithSvg()


        // Create panel 0
        const panelZero = new navigator.NestedPanel()
            .bgFill( '#deebf7' )
            .x( 200 ).y( 25 )
            .yAxisLabels( true )
            .bgText( 'panelZero' )
            .build()

        jest.runAllTimers()

        return panelZero
    }

}


initializeDomWith.panelZero.and = {

    child: function () {

        jest.useFakeTimers()

        const panelZero = initializeDomWith.panelZero()

        // Create child panel
        const spawnObjectForChildPanel = panelZero.objects( 'gender' ).objects( 'female' )
        const childPanel = new navigator.NestedPanel( panelZero, spawnObjectForChildPanel )
        childPanel
            .bgText( 'childPanel' )
            .build()

        jest.runOnlyPendingTimers()

        return { panelZero, childPanel }

    },

    childAndGrandchild: function () {

        jest.useFakeTimers()

        const { panelZero, childPanel } = initializeDomWith.panelZero.and.child()

        jest.runOnlyPendingTimers()


        // Create grandchild panel
        let grandChildPanel  // declaration must be outside the setTimer function
        setTimeout( () => {
            const spawnObjectForGrandChildPanel = childPanel.objects( 'class' ).objects( 'first-class' )
            grandChildPanel = new navigator.NestedPanel( childPanel, spawnObjectForGrandChildPanel )
            grandChildPanel
                .bgText( 'grandChildPanel' )
                .build()

        }, 1000 )
        jest.runOnlyPendingTimers()

        jest.runAllTimers()

        return { panelZero, childPanel, grandChildPanel }

    },


    threeSiblingChildren: function () {

        jest.useFakeTimers()

        const panelZero = initializeDomWith.panelZero()

        // Create the first sibling
        let siblingPanel1
        setTimeout( () => {
            const spawnObjectForSiblingPanel1 = panelZero.objects( 'class' ).objects( 'first-class' )
            siblingPanel1 = new navigator.NestedPanel( panelZero, spawnObjectForSiblingPanel1 )
            siblingPanel1
                .bgText( 'siblingPanel1' )
                .build()

        }, 1000 )
        jest.runOnlyPendingTimers()


        // Create the second sibling
        let siblingPanel2
        setTimeout( () => {
            const spawnObjectForSiblingPanel2 = panelZero.objects( 'class' ).objects( 'second-class' )
            siblingPanel2 = new navigator.NestedPanel( panelZero, spawnObjectForSiblingPanel2, 'sibling' )
            siblingPanel2
                .bgText( 'siblingPanel2' )
                .build()
        }, 2000 )
        jest.runOnlyPendingTimers()


        // Create the third sibling
        let siblingPanel3
        setTimeout( () => {
            const spawnObjectForSiblingPanel3 = panelZero.objects( 'class' ).objects( 'third-class' )
            siblingPanel3 = new navigator.NestedPanel( panelZero, spawnObjectForSiblingPanel3, 'sibling' )
            siblingPanel3
                .bgText( 'siblingPanel3' )
                .build()
        }, 3000 )
        jest.runOnlyPendingTimers()


        jest.runAllTimers()

        return { panelZero, siblingPanel1, siblingPanel2, siblingPanel3 }
    },


    childThatHasTwoSiblingChildren: function () {

        jest.useFakeTimers()

        const { panelZero, childPanel, grandChildPanel: grandChildPanel1 } = initializeDomWith.panelZero.and.childAndGrandchild()

        jest.runOnlyPendingTimers()

        // Change the label of a grandchild to fit to this recipe
        grandChildPanel1
            .bgText( 'grandChildPanel1' )
            .update()

        // Create a second grandchild panel as a sibling to the first one
        let grandChildPanel2  // declaration must be outside the setTimer function
        setTimeout( () => {
            const spawnObjectForGrandChildPanel = childPanel.objects( 'class' ).objects( 'second-class' )
            grandChildPanel2 = new navigator.NestedPanel( childPanel, spawnObjectForGrandChildPanel, 'sibling' )
            grandChildPanel2
                .bgText( 'grandChildPanel2' )
                .build()

        }, 1000 )
        jest.runOnlyPendingTimers()

        jest.runAllTimers()

        return { panelZero, childPanel, grandChildPanel1, grandChildPanel2 }

    }

}


initializeDomWith.panelZero.and.threeSiblingChildren.and = {


    childrenOfEachSibling: function () {

        jest.useFakeTimers()

        const { panelZero, siblingPanel1, siblingPanel2, siblingPanel3 } = initializeDomWith.panelZero.and.threeSiblingChildren()


        // Create the child of first sibling
        let childPanelOfSibling1
        setTimeout( () => {
            let spawnObjectForChildPanelOfSibling1 = siblingPanel1.objects( 'gender' ).objects( 'male' )
            childPanelOfSibling1 = new navigator.NestedPanel( siblingPanel1, spawnObjectForChildPanelOfSibling1 )
            childPanelOfSibling1
                .bgText( 'childPanelOfSibling1' )
                .build()
        }, 4000 )
        jest.runOnlyPendingTimers()


        // Create the child of second sibling)
        let childPanelOfSibling2
        setTimeout( () => {
            let spawnObjectForChildPanelOfSibling2 = siblingPanel2.objects( 'gender' ).objects( 'male' )
            childPanelOfSibling2 = new navigator.NestedPanel( siblingPanel2, spawnObjectForChildPanelOfSibling2 )
            childPanelOfSibling2
                .bgText( 'childPanelOfSibling2' )
                .build()
        }, 5000 )
        jest.runOnlyPendingTimers()


        // Create the child of third sibling)
        let childPanelOfSibling3
        setTimeout( () => {
            let spawnObjectForChildPanelOfSibling3 = siblingPanel3.objects( 'gender' ).objects( 'male' )
            childPanelOfSibling3 = new navigator.NestedPanel( siblingPanel3, spawnObjectForChildPanelOfSibling3 )
            childPanelOfSibling3
                .bgText( 'childPanelOfSibling3' )
                .build()
        }, 6000 )
        jest.runOnlyPendingTimers()


        jest.runAllTimers()

        return {
            panelZero,
            siblingPanel1,
            siblingPanel2,
            siblingPanel3,
            childPanelOfSibling1,
            childPanelOfSibling2,
            childPanelOfSibling3
        }

    },


    childOfOnlyMiddleSibling: function () {

        jest.useFakeTimers()

        const { panelZero, siblingPanel1, siblingPanel2, siblingPanel3 } = initializeDomWith.panelZero.and.threeSiblingChildren()

        // Create the child of second sibling)
        let childPanelOfSibling2
        setTimeout( () => {
            const spawnObjectForChildPanelOfSibling2 = siblingPanel2.objects( 'gender' ).objects( 'male' )
            childPanelOfSibling2 = new navigator.NestedPanel( siblingPanel2, spawnObjectForChildPanelOfSibling2 )
            childPanelOfSibling2
                .bgText( 'childPanelOfSibling2' )
                .build()
        }, 5000 )
        jest.runOnlyPendingTimers()

        jest.runAllTimers()

        return { panelZero, siblingPanel1, siblingPanel2, siblingPanel3, childPanelOfSibling2 }

    }


}

initializeDomWith.panelZero.and.child.without = {

    genderChart: function () {

        jest.useFakeTimers()

        const { panelZero, childPanel } = initializeDomWith.panelZero.and.child()

        childPanel.objects( 'gender' ).remove()

        jest.runOnlyPendingTimers()

        return { panelZero, childPanel }

    }
}




//// initializeDomWith... ///////////////////////////////////////////////////////////////

describe( 'initializeDomWith...', () => {


    test( 'initializeDomWith.panelZero.and.child', () => {
        // Uncomment to write html output to file
        // initializeDomWith.panelZero.and.child()
        // writeDomToFile('/Users/jlokman/Projects/Code/TEPAIV/CPC/libraries/cpc/tests/dom-out/initializeDomWith.panelZero.and.child.html')
    } )

    test( 'initializeDomWith.panelZero.and.childAndGrandchild', () => {
        // Uncomment to write html output to file
        // initializeDomWith.panelZero.and.childAndGrandchild()
        // writeDomToFile('/Users/jlokman/Projects/Code/TEPAIV/CPC/libraries/cpc/tests/dom-out/initializeDomWith.panelZero.and.childAndGrandchild.html')
    } )

    test( 'initializeDomWith.panelZero.and.threeSiblingChildren', () => {
        // Uncomment to write html output to file
        // initializeDomWith.panelZero.and.threeSiblingChildren()
        // writeDomToFile('/Users/jlokman/Projects/Code/TEPAIV/CPC/libraries/cpc/tests/dom-out/initializeDomWith.panelZero.and.threeSiblingChildren.html')
    } )


    test( 'initializeDomWith.panelZero.and.threeSiblingChildren.and.childrenOfEachSibling', () => {
        // Uncomment to write html output to file
        // initializeDomWith.panelZero.and.threeSiblingChildren.and.childrenOfEachSibling()
        // writeDomToFile('/Users/jlokman/Projects/Code/TEPAIV/CPC/libraries/cpc/tests/dom-out/initializeDomWith.panelZero.and.threeSiblingChildren.and.childrenOfEachSibling.html')
    } )


    test( 'initializeDomWith.panelZero.and.threeSiblingChildren.and.childOfOnlyMiddleSibling', () => {
        // Uncomment to write html output to file
        // initializeDomWith.panelZero.and.threeSiblingChildren.and.childOfOnlyMiddleSibling()
        // writeDomToFile('/Users/jlokman/Projects/Code/TEPAIV/CPC/libraries/cpc/tests/dom-out/initializeDomWith.panelZero.and.threeSiblingChildren.and.childOfOnlyMiddleSibling.html')
    } )


    test( 'initializeDomWith.panelZero.and.childThatHasTwoSiblingChildren', () => {
        // Uncomment to write html output to file
        // initializeDomWith.panelZero.and.childThatHasTwoSiblingChildren()
        // writeDomToFile('/Users/jlokman/Projects/Code/TEPAIV/CPC/libraries/cpc/tests/dom-out/initializeDomWith.panelZero.and.childThatHasTwoSiblingChildren.html')
    } )


    test( 'initializeDomWith.panelZero.and.child.without.genderChart()', () => {
        // Uncomment to write html output to file
        // initializeDomWith.panelZero.and.child.without.genderChart()
        // writeDomToFile('/Users/jlokman/Projects/Code/TEPAIV/CPC/libraries/cpc/tests/dom-out/initializeDomWith.panelZero.and.child.without.genderChart().html')
    } )


} )
