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
global.dataset = require("../../dataset")
global.container = require("../../container")
global.shape = require("../../shape")


//// MODULE BEING TESTED IN CURRENT FILE ////
const navigator = require("../../navigator")






//// UNIT TESTS /////////////////////////////////////////////////////////////////////////////////////////////////////////////


test ('Instantiate Navigator class (no parent object specified)', async () => {

    // Clear JEST's DOM to prevent leftovers from previous tests
    document.body.innerHTML = ''

    const mySvg = new container.Svg()
    mySvg.select()
        .attr('id', 'topmost-svg')

    // Create Navigator object
    const aNavigator = new navigator.Navigator()
    aNavigator.select()
        .attr('class', 'a-navigator')
        .attr('id', 'the-navigator')


    expect(aNavigator).toBeDefined()

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

    myNavigator.select()
        .attr('id', 'child-navigator')


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
    parentGroup.select()
        .attr('id', 'parent-group')  // id must be given directly with d3; Group.id().update() does not work with JEST


    // Create Navigator object
    const myNavigator = new navigator.Navigator(parentGroup)

    myNavigator.select()
        .attr('id', 'child-navigator')


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




test ('Load a csv dataset to Navigator and verify related calculations are made', async () => {

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




test ('Update DOM after new data is loaded', async () => {

    // Clear JEST's DOM to prevent leftovers from previous tests
    document.body.innerHTML = ''

    // Create svg container
    const svg = new container.Svg()
    svg.select()
        .attr('id', 'topmost-svg')


    // Create Navigator object and tag it for later selectability
    const myNavigator = new navigator.Navigator()
    myNavigator.select()
        .attr('id', 'my-navigator')

    // Check initial state of dataset-related flags
    expect(myNavigator._awaitingDomUpdateAfterDataChange).toBe(false)


    // Load a dataset
    await myNavigator.loadDataset(
        'http://localhost:3000/libraries/cpc/tests/dataset/titanic.csv',
        ['Name']
    )

    // Verify that the data-related flags are switched after loading data
    expect(myNavigator._awaitingDomUpdateAfterDataChange).toBe(true)


    // Verify that DOM only has a Navigator element in it
    const elementsInSvg = document.getElementById('topmost-svg').children
    expect(elementsInSvg.length).toBe(1)
    expect(elementsInSvg[0].id).toBe('my-navigator')

    // Verify that navigator element has no Panels in it
    let numberOfPanelElementsInNavigator
    numberOfPanelElementsInNavigator = document
        .getElementById('my-navigator')
        .getElementsByClassName('panel')
        .length
    expect(numberOfPanelElementsInNavigator).toBe(0)


    // Update DOM
    myNavigator.update()

    // // Verify that a Panel is created in DOM
    // numberOfPanelElementsInNavigator = document
    //     .getElementById('my-navigator')
    //     .getElementsByClassName('panel')
    //     // .length
    // expect(numberOfPanelElementsInNavigator).toBe(1)


    // Verify that the data-related flags are switched
    expect(myNavigator._awaitingDomUpdateAfterDataChange).toBe(false)


    // // Verify that `this` is returned after updating DOM



})

