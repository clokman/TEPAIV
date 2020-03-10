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
const jestConsole = require('../../../../../JestUtils/jest-console')
const expectTable = jestConsole.expectTable
const expectConsoleHistory = jestConsole.expectConsoleHistory
const destroyWarnings = jestConsole.destroyWarnings


const jestDom = require('../../../../../JestUtils/jest-dom')
    , writeDomToFile = jestDom.writeDomToFile

//// UMD DEPENDENCIES ////
global.$ = require('../../../external/jquery-3.1.1.min')

global.d3 = {
    ...require("../../../external/d3/d3"),
    ...require("../../../external/d3/d3-array")
}
// Disable d3 transitions
d3.selection.prototype.duration = jest.fn( function(){return this} )
d3.selection.prototype.transition = jest.fn( function(){return this} )

global._ = require("../../../external/lodash")

global.classUtils = require("../../../utils/classUtils")
global.arrayUtils = require("../../../utils/arrayUtils")
global.stringUtils = require("../../../utils/stringUtils")
global.domUtils = require("../../../utils/domUtils")
require('../../../utils/errorUtils')
require('../../../utils/jsUtils')  // does not need to be required into a variable
require('../../../utils/mapUtils')  // does not need to be required into a variable

global.data = require("../../data")
global.dataset = require("../../dataset")
global.container = require("../../container")
global.shape = require("../../shape")


//// MODULE BEING TESTED IN CURRENT FILE ////
const navigator = require("../../navigator")





//// UNIT TESTS /////////////////////////////////////////////////////////////////////////////////////////////////////////////


//// Instantiation ///////////////////////////////////////////////////////////////

describe ('Instantiation', () => {

    test ('Instantiate Navigator class (no parent object specified)', async () => {

    // Clear JEST's DOM to prevent leftovers from previous tests
    document.body.innerHTML = ''

    const mySvg = new container.Svg()
    mySvg.select()
        .attr('id', 'topmost-svg')

    // Create Navigator object
    const myNavigator = new navigator.Navigator()
    await myNavigator.build()


    // Use different tags for testing
    myNavigator
        .class('a-navigator')
        .id('the-navigator')
        .update()


    expect(myNavigator).toBeDefined()

    // Verify that a panel now exists in DOM
    const numberOfPanelsInDomAfterCreatingPanel = document
        .getElementsByClassName('a-navigator')
        .length
    expect(numberOfPanelsInDomAfterCreatingPanel).toBe(1)


    // Verify that the parent is Svg
    const parentId = document.getElementById('the-navigator')
        .parentElement
        .id
    expect(parentId).toBe('topmost-svg')

    })


    test ('Instantiate Navigator class as a child of a Svg class object',  async () => {

    // Clear JEST's DOM to prevent leftovers from previous tests
    document.body.innerHTML = ''

    // Create parent svg object
    const mySvg = new container.Svg()
    mySvg.select()
        .attr('id', 'topmost-svg')

    // Create Navigator object
    const myNavigator = new navigator.Navigator(mySvg)
    await myNavigator.build()

    myNavigator.id('child-navigator').update()


    const parentId = document.getElementById('child-navigator')
        .parentElement
          .id
    expect(parentId).toBe('topmost-svg')


    })


    test ('Instantiate Navigator class as a child of a Group class object',  async () => {

    // Clear JEST's DOM to prevent leftovers from previous tests
    document.body.innerHTML = ''

    // Create grandparent svg object
    const mySvg = new container.Svg()
    mySvg.select()
        .attr('id', 'topmost-svg')


    // Create a parent Group object
    const parentGroup = new container.Group(mySvg)
    parentGroup.id('parent-group').update()


    // Create Navigator object
    const myNavigator = new navigator.Navigator(parentGroup)
    await myNavigator.build()

    myNavigator.id('child-navigator').update()


    // Verify that the parent is a group element
    const parentId = document.getElementById('child-navigator')
        .parentElement
            .id
    expect(parentId).toBe('parent-group')

    // Verify that the grandparent is an svg element
    const grandParentId = document.getElementById('child-navigator')
        .parentElement
        .parentElement
        .id
    expect(grandParentId).toBe('topmost-svg')

    })


    test ('Load a csv dataset to Navigator and verify that related calculations are made', async () => {

    // Clear JEST's DOM to prevent leftovers from previous tests
    document.body.innerHTML = ''

    // Create svg container
    const svg = new container.Svg()


    // Create Navigator object
    const myNavigator = new navigator.Navigator()
    await myNavigator.build()

    // Check data-related flags before loading data
    expect(myNavigator._awaitingDomUpdateAfterDataChange)
        .toBe(false)


    // Load a dataset
    await myNavigator.loadDataset(
        'http://localhost:3000/libraries/cpc/tests/dataset/titanicTiny.csv',
        ['Name'],
        myNavigator.initParams.quantilesForContinuousColumns,  // `this` refers to myNavigator
        false
    ) // `update` argument is set to false, so that `_awaitingDomUpdateAfterDataChange` property can be tested below

    // Verify  that the data is imported correctly
    expect(myNavigator.datasetObject.data).toHaveLength(100)
    expectTable(myNavigator.datasetObject.data, `\
┌─────────┬─────────────┬────────────┬──────────┐
│ (index) │   Ticket    │   Status   │  Gender  │
├─────────┼─────────────┼────────────┼──────────┤
│    0    │ '1st class' │ 'Survived' │ 'Female' │
│    1    │ '1st class' │ 'Survived' │  'Male'  │
│    2    │ '1st class' │   'Died'   │ 'Female' │
│    3    │ '1st class' │   'Died'   │  'Male'  │
│    4    │ '1st class' │   'Died'   │ 'Female' │
│    5    │ '1st class' │ 'Survived' │  'Male'  │
│    6    │ '1st class' │ 'Survived' │ 'Female' │
│    7    │ '1st class' │   'Died'   │  'Male'  │
│    8    │ '1st class' │ 'Survived' │ 'Female' │
│    9    │ '1st class' │   'Died'   │  'Male'  │
└─────────┴─────────────┴────────────┴──────────┘
˅˅˅ 90 more rows`, 0, 10)


    // Verify that the related flags are updated after loading data
    expect(myNavigator._awaitingDomUpdateAfterDataChange)
        .toBe(true)


    // Verify that `this` is returned after loading data
    const returnedObject = await myNavigator.loadDataset(
        'http://localhost:3000/libraries/cpc/tests/dataset/titanicTiny.csv',
        ['Name']
    )
    returnedObjectType = returnedObject.constructor.name
    expect(returnedObjectType).toBe('Navigator')

    })

})



//// LOADING DATA ////////////////////////////////////////////////////////////////////////


//// Loading Data ///////////////////////////////////////////////////////////////

describe ('Loading Data', () => {

    test ('Update DOM after new data is loaded', async () => {

        // Clear JEST's DOM to prevent leftovers from previous tests
        document.body.innerHTML = ''

        // Create svg container
        const svg = new container.Svg()
        svg.select()
            .attr('id', 'topmost-svg')   // setting id with d3, because Svg does not have an id method at the time of writing this test




        //// CREATE A NAVIGATOR OBJECT AND VERIFY IT EXISTS ON DOM ////

        // Create Navigator object and tag it for later selectability
        const myNavigator = new navigator.Navigator()
        myNavigator
            .id('my-navigator')
            .build()


        // Verify that DOM only has a Navigator element in it
        const elementsInSvg = document.getElementById('topmost-svg').children
        expect(elementsInSvg.length).toBe(1)
        expect(elementsInSvg[0].id).toBe('my-navigator')




        //// LOAD A DATASET INTO NAVIGATOR ////

        // Check initial state of dataset-related flags
        expect(myNavigator._awaitingDomUpdateAfterDataChange).toBe(false)

        // Load a dataset
        await myNavigator.loadDataset(
            'http://localhost:3000/libraries/cpc/tests/dataset/titanicTiny.csv',
            ['Name'],
            this.quantilesForContinuousColumns,  // `this` refers to myNavigator
            false
        )  // `update` argument is set to false, so that `_awaitingDomUpdateAfterDataChange` property can be tested below

        // Verify that the data-related flags are switched after loading data
        expect(myNavigator._awaitingDomUpdateAfterDataChange).toBe(true)




        //// CONFIRM THE CREATION OF PANEL ON DOM AS A CHILD OF NAVIGATOR ELEMENT //

        // Verify that navigator element has no Panels in it prior to calling .update()
        let numberOfPanelElementsInNavigator
        numberOfPanelElementsInNavigator = document
            .getElementById('my-navigator')
            .getElementsByClassName('panel')
            .length
        expect(numberOfPanelElementsInNavigator).toBe(0)


        // Update DOM
        myNavigator.update()


        // Verify that a Panel is created in DOM as Navigator's child after update() is called
        numberOfPanelElementsInNavigator = document
            .getElementById('my-navigator')
            .getElementsByClassName('panel')
            .length
        expect(numberOfPanelElementsInNavigator).toBe(1)


        // Verify that the created panel has the right id and class
        const panelElement = document
            .getElementById('my-navigator')
            .getElementsByClassName('panel')[0]
        const panelElementId = panelElement.getAttribute('id')
        const panelElementClass = panelElement.getAttribute('class')
        const panelElementDepth = panelElement.getAttribute('depth')

        expect(panelElementId).toBe('panel-0-0')
        expect(panelElementClass).toBe('panel')


        // Verify that the data-related flags are switched after update()
        expect(myNavigator._awaitingDomUpdateAfterDataChange).toBe(false)





        //// CONFIRM THAT NAVIGATOR OBJECT NOW CONTAINS THE PANEL OBJECT IN THE BACK END ////

        const objectsInNavigator = myNavigator.objects()

        expectTable(objectsInNavigator, `\
┌───────────────────┬─────────────┬───────────────┐
│ (iteration index) │     Key     │    Values     │
├───────────────────┼─────────────┼───────────────┤
│         0         │ 'panel-0-0' │ [NestedPanel] │
└───────────────────┴─────────────┴───────────────┘`)



        //// VERIFY THE FIRST PANEL IN NAVIGATOR CONTAINS A SUMMARY OF THE LOADED DATASET ////
        const panelObjectOfPanelZero = myNavigator.objects('panel-0-0')
        const stacksInFirstPanel = panelObjectOfPanelZero.stacks()

        expectTable(stacksInFirstPanel.data(), `\
┌───────────────────┬──────────┬──────────────────────────────────────────────┐
│ (iteration index) │   Key    │                    Values                    │
├───────────────────┼──────────┼──────────────────────────────────────────────┤
│         0         │ 'Ticket' │ Stack { _data: [Map], _scaleFunction: null } │
│         1         │ 'Status' │ Stack { _data: [Map], _scaleFunction: null } │
│         2         │ 'Gender' │ Stack { _data: [Map], _scaleFunction: null } │
└───────────────────┴──────────┴──────────────────────────────────────────────┘`)





        /// VERIFY CHAIN SYNTAX COMPATIBILITY ////

        // Verify that `this` is returned after updating DOM
        const returnedObject = myNavigator.update()
            , typeOfReturnedObject = returnedObject.constructor.name

        expect(typeOfReturnedObject).toBe('Navigator')

    })

})



//// Interactivity ////////////////////////////////////////////////////////////////////////

describe ('Interactivity', () => {


    test ('Clicking on a category must make a query and visualize query results with a new panel', async () => {


        //// PREPARE DOM AND PARENT ELEMENT ////

        // Clear JEST's DOM to prevent leftovers from previous tests
        document.body.innerHTML = ''

        // Create svg container
        const svg = new container.Svg()
        svg.select()
            .attr('id', 'topmost-svg')   // setting id with d3, because Svg does not have an id method at the time of writing this test



        //// CREATE A NAVIGATOR OBJECT ////

        // Create Navigator object and tag it for later selectability
        const myNavigator = new navigator.Navigator()
        myNavigator
            .id('my-navigator')
            .build()



        //// LOAD A DATASET INTO NAVIGATOR ////

        // Check initial state of dataset-related flags
        expect(myNavigator._awaitingDomUpdateAfterDataChange).toBe(false)

        // Load a dataset
        await myNavigator.loadDataset(
            'http://localhost:3000/libraries/cpc/tests/dataset/titanicTiny.csv',
            ['Name']
        )
        myNavigator.update()


        //// LISTEN FOR CLICKS ////

        let clickDetected = false   // variable for diagnostics
        document.addEventListener('click', function(event){

            let clickedOnRectangle = event.target.matches('rect')
                , clickedOnText = event.target.matches('text')
                , clickedOnCategory = event.target.parentNode.matches('.category')

            if (clickedOnCategory && (clickedOnRectangle || clickedOnText) ){
                clickDetected = true
            }

        })



        //// TEST CLICKS ////

        const numberOfPanelsBeforeClicking = document.querySelectorAll('.panel').length
        expect(numberOfPanelsBeforeClicking).toBe(1)
        const numberOfCategoriesBeforeClicking = document.querySelectorAll('.category').length
        expect(numberOfCategoriesBeforeClicking).toBe(5)


        // Go forward: Click a category in panel 0
        domUtils.simulateClickOn('#panel-0-0 #Male')
        const numberOfPanelsAfterFirstClick = document.querySelectorAll('.panel').length
        expect(numberOfPanelsAfterFirstClick).toBe(2)
        const numberOfCategoriesAfterFirstClick = document.querySelectorAll('.category').length
        expect(numberOfCategoriesAfterFirstClick).toBe(8)


        // Go forward: Click a category in panel 1
        domUtils.simulateClickOn('#panel-1-0 #Survived')
        const numberOfPanelsAfterSecondClick = document.querySelectorAll('.panel').length
        expect(numberOfPanelsAfterSecondClick).toBe(3)
        const numberOfCategoriesAfterSecondClick = document.querySelectorAll('.category').length
        expect(numberOfCategoriesAfterSecondClick).toBe(9)

        // Go backward: Click a category in panel 0 (should replace panel 2 and remove panel 3)
        domUtils.simulateClickOn('#panel-0-0 #Female')
        const numberOfPanelsAfterThirdClick = document.querySelectorAll('.panel').length
        expect(numberOfPanelsAfterThirdClick).toBe(2)
        const numberOfCategoriesAfterThirdClick = document.querySelectorAll('.category').length
        expect(numberOfCategoriesAfterThirdClick).toBe(8)


    })

})



//// Absolute Values ///////////////////////////////////////////////////////////////

describe ('Absolute Values: Toggle absolute values in category captions', () => {


    test('Get/set', async () => {

        const myNavigator = await initializeDomWithTitanicTinyNavigator()

        // GET //
        expect( myNavigator.showAbsoluteValues() ).toBe( false )

        // SET (on) //
        myNavigator.showAbsoluteValues( true ).update()
        expect( myNavigator.showAbsoluteValues() ).toBe( true )

        // SET (off) //
        myNavigator.showAbsoluteValues( false ).update()
        expect( myNavigator.showAbsoluteValues() ).toBe( false )

    })


    test ('Dom: Absolute values should toggle for all category captions on DOM', async () => {

        const myNavigator = await initializeDomWithTitanicTinyNavigator()

        // Expand one panel
        domUtils.simulateClickOn( '#Female' )
        // Confirm the existence of two panels
        expect( myNavigator.objects() ).toTabulateAs(`\
┌───────────────────┬─────────────┬───────────────┐
│ (iteration index) │     Key     │    Values     │
├───────────────────┼─────────────┼───────────────┤
│         0         │ 'panel-0-0' │ [NestedPanel] │
│         1         │ 'panel-1-0' │ [NestedPanel] │
└───────────────────┴─────────────┴───────────────┘`)
            

        // Get initial caption texts on DOM
        let captionTexts = getCaptionTextsOfCategoriesFromDom()
        expect(captionTexts).toTabulateAs(`\
┌─────────┬────────┐
│ (index) │ Values │
├─────────┼────────┤
│    0    │ '100%' │
│    1    │ '67%'  │
│    2    │ '33%'  │
│    3    │ '49%'  │
│    4    │ '51%'  │
│    5    │ '100%' │
│    6    │ '96%'  │
│    7    │  '4%'  │
└─────────┴────────┘`)  // combined list of category captions from two panels



        // TOGGLE ABSOLUTE VALUES ON
        myNavigator.showAbsoluteValues(true).update()

        // Get new caption texts on DOM
        captionTexts = getCaptionTextsOfCategoriesFromDom()
        expect(captionTexts).toTabulateAs(`\
┌─────────┬────────┐
│ (index) │ Values │
├─────────┼────────┤
│    0    │ '100'  │
│    1    │  '67'  │
│    2    │  '33'  │
│    3    │  '49'  │
│    4    │  '51'  │
│    5    │  '49'  │
│    6    │  '47'  │
│    7    │  '2'   │
└─────────┴────────┘`)  // combined list of category captions from two panels



        // TOGGLE ABSOLUTE VALUES OFF
        myNavigator.showAbsoluteValues(false).update()

        // Get caption texts on DOM
        captionTexts = getCaptionTextsOfCategoriesFromDom()
        expect(captionTexts).toTabulateAs(`\
┌─────────┬────────┐
│ (index) │ Values │
├─────────┼────────┤
│    0    │ '100%' │
│    1    │ '67%'  │
│    2    │ '33%'  │
│    3    │ '49%'  │
│    4    │ '51%'  │
│    5    │ '100%' │
│    6    │ '96%'  │
│    7    │  '4%'  │
└─────────┴────────┘`)  // combined list of category captions from two panels



            
        // HELPER FUNCTION(S) FOR THIS TEST //
        /**
         * @return {[]}  - An array of string
         */
        function getCaptionTextsOfCategoriesFromDom() {
            const allCaptions = document.querySelectorAll('.category .rectangle-caption')

            const captionTexts = []
            allCaptions.forEach(caption => {
                captionTexts.push(caption.textContent)
            })
            return captionTexts
        }


    })

    
})



//// Absolute Panel Sizes ///////////////////////////////////////////////////////////////

describe ('Absolute Chart Widths', () => {
   
        test ('Get/set', async() => {

            jest.useFakeTimers()

            const myNavigator = await initializeDomWithTitanicTinyNavigator()

            // Get default state in navigator
            expect( myNavigator.showAbsoluteChartWidths() ).toBe( false )
            // Get default state in first panel of navigator
            expect( myNavigator.objects('panel-0-0').showAbsoluteChartWidths() )
                .toBe( false )


            // Set value
            myNavigator
                .showAbsoluteChartWidths( true )
                .update()

            // Check new value in navigator
            expect( myNavigator.showAbsoluteChartWidths() ).toBe( true )
            // Check new value in first panel
            expect( myNavigator.objects('panel-0-0').showAbsoluteChartWidths() )
                .toBe( true )

        })


        test ('Children panels should initiate at correct locations and with correct width in absolute mode ', async () => {

            jest.useFakeTimers()

            const myNavigator = await initializeDomWithTitanicTinyNavigator()

            jest.runOnlyPendingTimers()

            // Get default state in navigator
            expect( myNavigator.showAbsoluteChartWidths() ).toBe( false )

            // Set value
            myNavigator
                .showAbsoluteChartWidths( true )
                .update()

            jest.runOnlyPendingTimers()
            jest.runAllTimers()

            domUtils.simulateClickOn('#panel-0-0 #Male')
            jest.runOnlyPendingTimers()



            const panelZero = myNavigator.objects('panel-0-0')
            const childPanel = myNavigator.objects('panel-1-0')

            jest.runAllTimers()

            // Formulas
            const childPanelEndsAtCorrectLocation = () => childPanel.rightEdge() === panelZero.leftEdge() + panelZero.bgExtensionLeft() + panelZero.width() + childPanel.width()
            const panelZeroBackgroundEndsAtCorrectLocation = () => panelZero.rightEdge() === childPanel.rightEdge() + panelZero._innerPadding.right


            expect( childPanelEndsAtCorrectLocation() ).toBeTruthy()
            expect( panelZeroBackgroundEndsAtCorrectLocation() ).toBeTruthy()

        })

})




//// Continuous Data ///////////////////////////////////////////////////////////////

describe ('Continuous Data', () => {

        test ('When specified in initParams, quartile names should be shown instead of quartile percentage ranges', async () => {

            jest.useFakeTimers()

            const myNavigator = await initializeDomWithTitanicTinyNavigator(false)
            myNavigator.initParams.quantilesForContinuousColumns = [ 'Q1', 'Q2', 'Q3', 'Q4' ]
            await myNavigator.build()

            myNavigator

        })

})


//// Color Sets ///////////////////////////////////////////////////////////////

describe ('Color Sets', () => {

    test ('Color scheme set: Set and get', async () => {

        const myNavigator = await initializeDomWithTitanicTinyNavigator()

        //// GET COLOR SET ////

        // Get initial color-related values
        expect( myNavigator.colorSet() ).toBe('Single-Hue')
        const actualInitialColorsOnCanvasForGenderCategory = myNavigator.objects('panel-0-0')
            .objects('Gender').actualColors()
        expect( actualInitialColorsOnCanvasForGenderCategory ).toEqual([
            "rgb(34, 139, 69)", "rgb(115, 195, 120)"
        ])


        //// CHANGE COLOR SET ////
        myNavigator.colorSet( 'Greys' ).update()

        // Check if the new color set is set in one of the chart objects within the navigator
        expect( myNavigator.colorSet() ).toBe('Greys')
        expect ( myNavigator.objects('panel-0-0').objects('Gender').colorScheme() )
            .toBe( 'Greys')
        // Check the color of a category on DOM
        const actualColorsOnCanvasForGenderCategory =
            myNavigator.objects('panel-0-0').objects('Gender').actualColors()
        expect ( actualColorsOnCanvasForGenderCategory )
            .toEqual(["rgb(80, 80, 80)", "rgb(151, 151, 151)"])




        //// ENSURE THAT CATEGORIES IN CHILD PANELS HAVE THE SAME COLORS WITH THEIR COUNTERPARTS IN PARENT PANELS ////

        // Check the number of panels before click
        const numberOfPanelsBeforeClick = document.querySelectorAll('.panel').length
        expect(numberOfPanelsBeforeClick).toBe(1)

        // Go deeper in Navigator: Click a category in panel 0
        domUtils.simulateClickOn('#panel-0-0 #Male')

        // Check the number of panels before click
        const numberOfPanelsAfterFirstClick = document.querySelectorAll('.panel').length
        expect(numberOfPanelsAfterFirstClick).toBe(2)


        // After the click: Check the color of an arbitrary category of PANEL-0 on DOM
        const actualColorsOnDomForGenderCategoryInPanelZeroAfterClick = myNavigator.objects('panel-0-0').objects('Gender').actualColors()
        expect ( actualColorsOnDomForGenderCategoryInPanelZeroAfterClick )
            .toEqual(["rgb(80, 80, 80)", "rgb(151, 151, 151)"])


        // After the click: Check the color of an arbitrary category of PANEL-1 on DOM
        const actualColorsOnDomForGenderCategoryInPanelOneAfterClick = myNavigator.objects('panel-0-0').objects('Gender').actualColors()
        expect ( actualColorsOnDomForGenderCategoryInPanelZeroAfterClick )
            .toEqual(["rgb(80, 80, 80)", "rgb(151, 151, 151)"])




        //// CHANGE COLOR SET WHILE A CHILD PANEL EXIST ////

        // Confirm that a child panel is open
        const numberOfOpenPanels = myNavigator.objects().size
        expect( numberOfOpenPanels ).toBe( 2 )

        // Change color set
        myNavigator.colorSet('Reds').update()

        // After the click: Confirm that the child panel's background and bridge colors matches the color of the category this child panel is spawned from
        const bgColorOfChildPanelAfterColorSetChange = myNavigator.objects('panel-1-0')._backgroundObject.fill()
        const bgColorOfBridgeAfterColorSetChange = myNavigator.objects('panel-1-0')._bridgeObject.fill()
        const colorOfCategoryThatChildPanelSpawnedFrom = myNavigator.objects('panel-1-0').objectToSpawnFrom.fill()

        expect( bgColorOfChildPanelAfterColorSetChange )
            .toBe( colorOfCategoryThatChildPanelSpawnedFrom )

        expect( bgColorOfBridgeAfterColorSetChange )
            .toBe( colorOfCategoryThatChildPanelSpawnedFrom )
    })


})



//// Labels ////////////////////////////////////////////////////////////////////////


// TODO: Navigator panels tested (if necessary)
// test ('Clicking on a category must make a query and visualize query results with a new panel', async () => {
//
//     // Clear JEST's DOM to prevent leftovers from previous tests
//     document.body.innerHTML = ''
//     // Create svg container
//     const svg = new container.Svg()
//
//     //// CREATE A NAVIGATOR OBJECT ////
//     // Create Navigator object and tag it for later selectability
//     const myNavigator = new navigator.Navigator()
//     myNavigator.id('my-navigator').build()
//
//     // Load a dataset into Navigator
//     await myNavigator.loadDataset(
//         'http://localhost:3000/libraries/cpc/tests/dataset/titanicTiny.csv',
//         ['Name']
//     )
//     myNavigator.update()
//
//
// })



//// Comparison View ///////////////////////////////////////////////////////////////

describe ('Comparison View', () => {

    test ('Detect modifier: Detect which modifier key is pressed ', async () => {

        const myNavigator = await initializeDomWithTitanicTinyNavigator()

        // domUtils.simulateClickOn('#Male', 'shift' )
        // expect( myNavigator._modifierKeyPressedWithLastClick ).toBe( 'shift' )


        domUtils.simulateClickOn('#Male', 'alt' )
        expect( myNavigator._modifierKeyPressedWithLastClick ).toBe( 'alt' )


        domUtils.simulateClickOn('#Male', 'meta' )
        expect( myNavigator._modifierKeyPressedWithLastClick ).toBe( 'meta' )

        domUtils.simulateClickOn('#Male', 'ctrl' )
        expect( myNavigator._modifierKeyPressedWithLastClick ).toBe( 'ctrl' )




        // expect( document.lastClick.wasWithShiftKey ).toBe( true )
        // expect( document.lastClick.wasWithAltKey ).toBe( false )
        // expect( document.lastClick.wasWithMetaKey ).toBe( false )
        // expect( document.lastClick.wasWithCtrlKey ).toBe( false )

    })


})



//// Has ///////////////////////////////////////////////////////////////

describe ('get(): Inferences should be made correctly', () => {
   
    test ('panelZero: Should select panelZero correctly', async () => {

        const myNavigator = await initializeDomWithTitanicTinyNavigator()

        // Select panelZero
        let panelZero = myNavigator.get('panelZero')
        expect( panelZero ).toBeDefined()
        expect( panelZero.id() ).toBe( "panel-0-0" )


        // ADD A SECOND PANEL //
        domUtils.simulateClickOn('#Male' )
        const numberOfPanels = myNavigator.objects().size
        expect( numberOfPanels ).toBe(2)

        // panelZero should still return
        panelZero = myNavigator.get('panelZero')
        expect( panelZero ).toBeDefined()
        expect( panelZero.id() ).toBe( "panel-0-0" )


    })
    
})



//// Sibling Panel ///////////////////////////////////////////////////////////////

describe ('Sibling Panel via Click', () => {
   
    test ('Add sibling', async () => {

        const myNavigator = await initializeDomWithTitanicTinyNavigator()

        // CLICK ON A CATEGORY
        domUtils.simulateClickOn('#Male' )
        let numberOfPanels = myNavigator.objects().size
        expect( numberOfPanels ).toBe(2)

        // ADD A SIBLING PANEL VIA SHIFT CLICK
        domUtils.simulateClickOn('#Female', 'shift' )
        numberOfPanels = myNavigator.objects().size
        expect( numberOfPanels ).toBe(3)

    })


    test ('Shift-Click as First Click: Shift-Clicking on a category that has no siblings should not cause a bug', async () => {

        const myNavigator = await initializeDomWithTitanicTinyNavigator()

        // SHIFT-CLICK ON A CATEGORY
        domUtils.simulateClickOn('#Male', 'shift' )
        let numberOfPanels = myNavigator.objects().size
        expect( numberOfPanels ).toBe(2)


    })
    
})



//// Stroke Properties  ///////////////////////////////////////////////////////////////

describe ('Stroke Properties ', () => {
   
        test ('Stroke width and color', async () => {

            const myNavigator = await initializeDomWithTitanicTinyNavigator()

            // Get default values
            expect( myNavigator.strokeWidth() ).toBe( '0.5px' )
            expect( myNavigator.strokeColor() ).toBe( 'rgba(255, 255, 255, 1.0)' )

            // Set new values
            myNavigator
                .strokeWidth('4px')
                .strokeColor('red')
                .update()

            // Confirm new values
            expect( myNavigator.strokeWidth() ).toBe( '4px' )
            expect( myNavigator.strokeColor() ).toBe( 'red' )


            const panel0_0 = myNavigator.objects('panel-0-0')
            expect( panel0_0.strokeWidth() ).toBe( '4px' )
            expect( panel0_0.strokeColor() ).toBe( 'red' )


        })

})






//// Helper Functions  ///////////////////////////////////////////////////////////////


/**
 * A simple testing template that creates a Navigator object with a very small dataset.
 * @param build {Boolean} If set to false, would initialize Navigator without calling the `build()` method.
 * @return {Promise<Navigator>}
 */
async function initializeDomWithTitanicTinyNavigator( build=true ) {

    jest.useFakeTimers()

    // Clear JEST's DOM to prevent leftovers from previous tests
    document.body.innerHTML = ''
    // Create svg container
    const svg = new container.Svg(1200, 900)
    // Create Navigator object
    const myNavigator = new navigator.Navigator()
    //// Load a dataset into navigator
    myNavigator.initParams.datasetPath = 'http://localhost:3000/libraries/cpc/tests/dataset/titanicTiny.csv'
    myNavigator.initParams.omitColumns = ['Name']

    myNavigator.x(200)

    if (build){
        await myNavigator.build()
    }


    jest.runOnlyPendingTimers()
    jest.runAllTimers()

    return myNavigator
}



