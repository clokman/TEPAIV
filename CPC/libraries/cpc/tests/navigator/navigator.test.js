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


//// UMD DEPENDENCIES ////

global.d3 = {
    ...require("../../../external/d3/d3"),
    ...require("../../../external/d3/d3-array")
}

global._ = require("../../../external/lodash")

global.classUtils = require("../../../utils/classUtils")
global.arrayUtils = require("../../../utils/arrayUtils")
global.stringUtils = require("../../../utils/stringUtils")
global.data = require("../../data")
global.dataset = require("../../dataset")
global.container = require("../../container")
global.shape = require("../../shape")


//// MODULE BEING TESTED IN CURRENT FILE ////
const navigator = require("../../navigator")





//// UNIT TESTS /////////////////////////////////////////////////////////////////////////////////////////////////////////////


//// INSTANTIATION ////////////////////////////////////////////////////////////////////////


test ('Instantiate Navigator class (no parent object specified)', async () => {

    // Clear JEST's DOM to prevent leftovers from previous tests
    document.body.innerHTML = ''

    const mySvg = new container.Svg()
    mySvg.select()
        .attr('id', 'topmost-svg')

    // Create Navigator object
    const myNavigator = new navigator.Navigator()


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




test ('Instantiate Navigator class as a child of a Svg class object',  () => {

    // Clear JEST's DOM to prevent leftovers from previous tests
    document.body.innerHTML = ''

    // Create parent svg object
    const mySvg = new container.Svg()
    mySvg.select()
        .attr('id', 'topmost-svg')

    // Create Navigator object
    const myNavigator = new navigator.Navigator(mySvg)

    myNavigator.id('child-navigator').update()


    const parentId = document.getElementById('child-navigator')
        .parentElement
          .id
    expect(parentId).toBe('topmost-svg')


})




test ('Instantiate Navigator class as a child of a Group class object',  () => {

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

    // Check data-related flags before loading data
    expect(myNavigator._awaitingDomUpdateAfterDataChange)
        .toBe(false)


    // Load a dataset
    await myNavigator.loadDataset(
        'http://localhost:3000/libraries/cpc/tests/dataset/titanic.csv',
        ['Name']
    )

    // Verfiy  that the data is imported correctly
    expect(myNavigator.datasetObject.data).toHaveLength(1309)
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
˅˅˅ 1299 more rows`, 0, 10)


    // Verify that the related flags are updated after loading data
    expect(myNavigator._awaitingDomUpdateAfterDataChange)
        .toBe(true)


    // Verify that `this` is returned after loading data
    const returnedObject = await myNavigator.loadDataset(
        'http://localhost:3000/libraries/cpc/tests/dataset/titanic.csv',
        ['Name']
    )
    returnedObjectType = returnedObject.constructor.name
    expect(returnedObjectType).toBe('Navigator')

})






//// LOADING DATA ////////////////////////////////////////////////////////////////////////


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
    myNavigator.id('my-navigator').update()


    // Verify that DOM only has a Navigator element in it
    const elementsInSvg = document.getElementById('topmost-svg').children
    expect(elementsInSvg.length).toBe(1)
    expect(elementsInSvg[0].id).toBe('my-navigator')




    //// LOAD A DATASET INTO NAVIGATOR ////

    // Check initial state of dataset-related flags
    expect(myNavigator._awaitingDomUpdateAfterDataChange).toBe(false)

    // Load a dataset
    await myNavigator.loadDataset(
        'http://localhost:3000/libraries/cpc/tests/dataset/titanic.csv',
        ['Name']
    )

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

    expect(panelElementId).toBe('panel-0')
    expect(panelElementClass).toBe('panel')


    // Verify that the data-related flags are switched after update()
    expect(myNavigator._awaitingDomUpdateAfterDataChange).toBe(false)





    //// CONFIRM THAT NAVIGATOR OBJECT NOW CONTAINS THE PANEL OBJECT IN THE BACK END ////

    const objectsInNavigator = myNavigator.objects()

    expectTable(objectsInNavigator, `\
┌───────────────────┬───────────┬─────────┐
│ (iteration index) │    Key    │ Values  │
├───────────────────┼───────────┼─────────┤
│         0         │ 'panel-0' │ [Panel] │
└───────────────────┴───────────┴─────────┘`)



    //// VERIFY THE FIRST PANEL IN NAVIGATOR CONTAINS A SUMMARY OF THE LOADED DATASET ////
    const panelObjectOfPanelZero = myNavigator.objects('panel-0')
    const stacksInFirstPanel = panelObjectOfPanelZero.stacks()
    
    expectTable(stacksInFirstPanel, `\
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






//// INTERACTIVITY ////////////////////////////////////////////////////////////////////////


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
    myNavigator.id('my-navigator').update()




    //// LOAD A DATASET INTO NAVIGATOR ////

    // Check initial state of dataset-related flags
    expect(myNavigator._awaitingDomUpdateAfterDataChange).toBe(false)

    // Load a dataset
    await myNavigator.loadDataset(
        'http://localhost:3000/libraries/cpc/tests/dataset/titanic.csv',
        ['Name']
    )


    //// GET CLICKED CATEGORY NAME ////
    // TODO: CLICKS MUST BE MOCKED AND VISUAL QUERY FUNCTIONALTY MUST BE TESTED


})