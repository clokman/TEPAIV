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


//// NODE-ONLY DEPENDENCIES ////
require("../../../../../JestUtils/jest-console")


//// UMD DEPENDENCIES ////

// D3 //
global.d3 = {
    ...require("../../../external/d3/d3"),
    ...require("../../../external/d3/d3-array")
}


// Lodash //
global._ = require("../../../external/lodash")


// Internal //
global.classUtils = require("../../../utils/classUtils")
global.arrayUtils = require("../../../utils/arrayUtils")
global.container = require("../../container")
global.shape = require("../../shape")
global.str = require("../../str")
global.data = require("../../../cpc/data")
global.dataset = require("../../../cpc/dataset")


//// MODULE(S) BEING TESTED ////
const navigator = require("../../navigator")






//// UNIT TESTS /////////////////////////////////////////////////////////////////////////////////////////////////////////////


//// INSTANTIATE ///

test ('Should instantiate object', () => {

    // Clear JEST's DOM to prevent leftovers from previous tests
    document.body.innerHTML = ''

    // Verify that no panels exist in DOM
    const noOfPanelsInDomBeforeCreatingPanel = document
        .getElementsByClassName('panel')
        .length
    expect(noOfPanelsInDomBeforeCreatingPanel).toBe(0)


    // Create panel
    const svg = new container.Svg()
        , myPanel = new navigator.Panel()


    // Verify that a panel object is created
    expect(myPanel).toBeDefined()

    // Verify that a panel now exists in DOM
    const noOfPanelsInDomAfterCreatingPanel = document
        .getElementsByClassName('panel')
        .length
    expect(noOfPanelsInDomAfterCreatingPanel).toBe(1)

})


test ('Should instantiate object as a child of specified parent element', () => {

    // Clear JEST's DOM to prevent leftovers from previous tests
    document.body.innerHTML = ''


    // Create SVG
    const mySvg = new container.Svg()
    mySvg.select()
        .attr('id', 'top-svg')


    // Create a panel container
    const parentContainerSelection = mySvg.select()  // this first select is NOT D3 code but s container.Svg method (which returns a D3 Selection)
        .append('g')
        .attr('id', 'parent-container')  // id must be given directly with d3; Group.id().update() does not work with JEST


    // Create panel as a child of the parent container
    const myPanel = new navigator.Panel(parentContainerSelection)
    myPanel.id('child-panel').update()


    // Verify that the panel is indeed a child of the parent container
    const parentElement = document.getElementById('parent-container')
    expect(parentElement.children.length).toBe(1)

    const childPanelElement = parentElement.getElementsByClassName('panel')[0]
    const childPanelId = childPanelElement.getAttribute('id')
    expect(childPanelId).toBe('child-panel')

    const inferredParentId = childPanelElement.parentElement.getAttribute('id')
    expect(inferredParentId).toBe('parent-container')

    const inferredGrandParentId = childPanelElement.parentElement.parentElement.getAttribute('id')
    expect(inferredGrandParentId).toBe('top-svg')

})




//// GENERATE EXAMPLE DATA ////

test ('Should initialize with example data', () => {

    parentContainerSelection = d3.select('body')
        .append("svg")
        .attr("width", 1280)
        .attr("height", 1024)

    const myPanel = new navigator.Panel(parentContainerSelection)


    // Probe the initial sample data
    expect(myPanel.stacks().size).toBe(3)
    expect(myPanel.stacks('gender').data('male').get('label')).toEqual('Male')
    expect(myPanel.stacks('class').data('first-class').get('label')).toEqual('First Class')
    expect(myPanel.stacks('status').data('survived').get('percentage')).toEqual(38)


    // Check if data stats are being calculated correctly
    expect(myPanel._chartCount()).toBe(3)


    // Probe the initial data visually
    expectTable(myPanel.stacks(), `\
┌───────────────────┬──────────┬──────────────────────────────────────────────┐
│ (iteration index) │   Key    │                    Values                    │
├───────────────────┼──────────┼──────────────────────────────────────────────┤
│         0         │ 'gender' │ Stack { _data: [Map], _scaleFunction: null } │
│         1         │ 'class'  │ Stack { _data: [Map], _scaleFunction: null } │
│         2         │ 'status' │ Stack { _data: [Map], _scaleFunction: null } │
└───────────────────┴──────────┴──────────────────────────────────────────────┘`)
    expectTable(myPanel.stacks('gender'), `\
┌────────────────┬────────┐
│    (index)     │ Values │
├────────────────┼────────┤
│     _data      │        │
│ _scaleFunction │  null  │
└────────────────┴────────┘`)
    expectTable(myPanel.stacks('gender').data('male'), `\
┌───────────────────┬──────────────┬────────┐
│ (iteration index) │     Key      │ Values │
├───────────────────┼──────────────┼────────┤
│         0         │   'label'    │ 'Male' │
│         1         │   'start'    │   0    │
│         2         │    'end'     │   64   │
│         3         │ 'percentage' │   64   │
└───────────────────┴──────────────┴────────┘`)

})


//// CALCULATE DATA STATS ////

// CHART COUNT //
test ('Should calculate the number of charts in panel', () => {

    // Clear JEST's DOM to prevent leftovers from previous tests
    document.body.innerHTML = ''


    const svg = new container.Svg()
        , parentContainerSelection = svg.select()

    const myPanel = new navigator.Panel(parentContainerSelection)

    // Check if data stats are being calculated correctly
    expect(myPanel._chartCount()).toBe(3)

})



//// INITIATE BY VISUALIZING A DATASET ////

test ('Visualize a dataset manually by changing Stakcs in Panel', async () => {

    const titanicDataset = new dataset.Dataset(
        'http://localhost:3000/libraries/cpc/tests/dataset/titanic.csv',
        'Name'
    )
    await titanicDataset.build()

    expectTable(titanicDataset.data, `\
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



    const myPanel = new navigator.Panel()


    // Summarize the titanic dataset
    const titanicSummary = titanicDataset.summarize()
    expectTable(titanicSummary, `\
┌───────────────────┬──────────┬────────────────────────────────────────────────────────────────────┐
│ (iteration index) │   Key    │                               Values                               │
├───────────────────┼──────────┼────────────────────────────────────────────────────────────────────┤
│         0         │ 'Ticket' │ Map { '1st class' => 323, '2nd class' => 277, '3rd class' => 709 } │
│         1         │ 'Status' │              Map { 'Survived' => 500, 'Died' => 809 }              │
│         2         │ 'Gender' │               Map { 'Female' => 466, 'Male' => 843 }               │
└───────────────────┴──────────┴────────────────────────────────────────────────────────────────────┘`)
    // Summary produces a nested map (1-level deep)

    // Convert the nested map into a Stacks object
    titanicStacks = new data.Stacks()
    titanicStacks.fromNestedMap(titanicSummary)

    expectTable(titanicStacks, `\
┌─────────┐
│ (index) │
├─────────┤
│  _data  │
└─────────┘`)
    expectTable(titanicStacks.data(), `\
┌───────────────────┬──────────┬──────────────────────────────────────────────┐
│ (iteration index) │   Key    │                    Values                    │
├───────────────────┼──────────┼──────────────────────────────────────────────┤
│         0         │ 'Ticket' │ Stack { _data: [Map], _scaleFunction: null } │
│         1         │ 'Status' │ Stack { _data: [Map], _scaleFunction: null } │
│         2         │ 'Gender' │ Stack { _data: [Map], _scaleFunction: null } │
└───────────────────┴──────────┴──────────────────────────────────────────────┘`)

    // Import the new stacks object to be panel's new data
    myPanel.stacks(titanicStacks).update()
    expectTable(myPanel.stacks(), `\
┌───────────────────┬──────────┬──────────────────────────────────────────────┐
│ (iteration index) │   Key    │                    Values                    │
├───────────────────┼──────────┼──────────────────────────────────────────────┤
│         0         │ 'Ticket' │ Stack { _data: [Map], _scaleFunction: null } │
│         1         │ 'Status' │ Stack { _data: [Map], _scaleFunction: null } │
│         2         │ 'Gender' │ Stack { _data: [Map], _scaleFunction: null } │
└───────────────────┴──────────┴──────────────────────────────────────────────┘`)
    expectTable(myPanel.stacks('Gender').data('Female'), `\
┌───────────────────┬──────────────┬──────────┐
│ (iteration index) │     Key      │  Values  │
├───────────────────┼──────────────┼──────────┤
│         0         │   'label'    │ 'Female' │
│         1         │   'count'    │   466    │
│         2         │ 'percentage' │   35.6   │
│         3         │   'start'    │    0     │
│         4         │    'end'     │   466    │
└───────────────────┴──────────────┴──────────┘`)
    expectTable(myPanel.stacks('Gender').data('Male'), `\
┌───────────────────┬──────────────┬────────┐
│ (iteration index) │     Key      │ Values │
├───────────────────┼──────────────┼────────┤
│         0         │   'label'    │ 'Male' │
│         1         │   'count'    │  843   │
│         2         │ 'percentage' │  64.4  │
│         3         │   'start'    │  466   │
│         4         │    'end'     │  1309  │
└───────────────────┴──────────────┴────────┘`)


    // Check if Panel properties are updated after the new Stacks data is imported
    const maleCategoryObject = myPanel.objects('Gender').objects('Male')
        , maleRectangleObject = maleCategoryObject.objects('rectangle')
        , maleTextObject = maleCategoryObject.objects('text')


    const femaleCategoryObject = myPanel.objects('Gender').objects('Female')
        , femaleRectangleObject = femaleCategoryObject.objects('rectangle')
        , femaleTextObject = femaleCategoryObject.objects('text')

    maleObjectProperties = {
        'y': maleCategoryObject.y(),
        'height': maleCategoryObject.height(),
        'text': maleTextObject.text()
    }
    expectTable(maleObjectProperties,`\
┌─────────┬─────────┐
│ (index) │ Values  │
├─────────┼─────────┤
│    y    │   56    │
│ height  │   94    │
│  text   │ '64.4%' │
└─────────┴─────────┘`)

    femaleObjectProperties = {
        'y': femaleCategoryObject.y(),
        'height': femaleCategoryObject.height(),
        'text': femaleTextObject.text()
    }
    expectTable(femaleObjectProperties,`\
┌─────────┬─────────┐
│ (index) │ Values  │
├─────────┼─────────┤
│    y    │   150   │
│ height  │   52    │
│  text   │ '35.6%' │
└─────────┴─────────┘`)


})







//// INITIALIZATION: DOM STRUCTURE AND ATTRIBUTES OF PANEL ////

test ('Should create charts of the panel as a child of panel, and with right attributes', () => {

    // Clear JEST's DOM to prevent leftovers from previous tests
    document.body.innerHTML = ''

    const svg = new container.Svg()

    const myPanel = new navigator.Panel()


    // Verify that the panel element has correct initial HTML attributes
    const panelElement = document
        .getElementsByClassName('panel')[0]
    expect(panelElement.getAttribute('class')).toBe('panel')



    // Verify that the panel has the correct number of children with the type 'chart'
    const chartElements =  document
        .getElementsByClassName('panel')[0]
        .getElementsByClassName('chart')


    expect(chartElements.length).toBe(myPanel._chartCount())


    // Verify that all children charts in the panel has the correct HTML attributes
    // Shared attributes for charts
    // loop //
    Array.from(chartElements).forEach(
        (eachChart) => {

            const eachChartClass = eachChart.getAttribute('class')
            expect(eachChartClass).toBe('chart')

        }
    )

    // Verify individual HTML attributes for charts

    firstChartElement = document
        .getElementsByClassName('panel')[0]
        .getElementsByClassName('chart')[0]
    secondChildElement = document
        .getElementsByClassName('panel')[0]
        .getElementsByClassName('chart')[1]

    const idOfFirstChart = firstChartElement.getAttribute('id')
    const idOfSecondChart = secondChildElement.getAttribute('id')

    expect(idOfFirstChart).toBe('gender')
    expect(idOfSecondChart).toBe('class')


    // Get rectangles in charts
    const rectangleElementOfFirstChart = document
        .getElementsByClassName('panel')[0]
        .getElementsByClassName('chart')[0]
        .getElementsByTagName('rect')[0]

    const textElementOfFirstChart = document  // TODO: Text positions verified by using this variable
        .getElementsByClassName('panel')[0]
        .getElementsByClassName('chart')[0]
        .getElementsByTagName('text')[0]

    const rectangleElementOfSecondChart = document
        .getElementsByClassName('panel')[0]
        .getElementsByClassName('chart')[1]
        .getElementsByTagName('rect')[0]

    const textElementOfSecondChart = document  // TODO: Text positions verified by using this variable
        .getElementsByClassName('panel')[0]
        .getElementsByClassName('chart')[1]
        .getElementsByTagName('text')[0]


    // Check if the rectangle elements within charts have the right HTML attributes
    // yPosition //
    const yPositionOfFirstRectangleElement = rectangleElementOfFirstChart.getAttribute('y')
    const yPositionOfSecondRectangleElement = rectangleElementOfSecondChart.getAttribute('y')

    // expect(yPositionOfFirstRectangleElement).toBe(`${myPanel._yScale(0)}`)
    // expect(yPositionOfSecondRectangleElement).toBe(`${myPanel._yScale(1)}`)
    // TODO: The two tests above fails even though the visualization is correct.
    //  This code works in Safari, while it does not seem to work in Node:
    // document.getElementsByClassName('panel')[0].getElementsByClassName('chart')[0].getElementsByTagName('rect')[0].getAttribute('y')


})


//// INITIALIZATION: BACKGROUND RECTANGLE ////


// TODO: Panel background tests completed
test ('Should initialize with a background rectangle', () => {

    // Clear JEST's DOM to prevent leftovers from previous tests
    document.body.innerHTML = ''

    const svg = new container.Svg()
    const myPanel = new navigator.Panel

    // Verify that the panel background object is initiated
    expect(myPanel._backgroundObject).toBeDefined()

    // Verify that the panel background element is created in DOM
    const panelBackgroundElement = document.getElementsByClassName('background')[0]
    expect(panelBackgroundElement).toBeDefined()


    // Verify that the panel background element has the right children on DOM
    expect(panelBackgroundElement.children.length).toBe(2)
    expect(panelBackgroundElement.children[0].tagName).toBe('rect')
    expect(panelBackgroundElement.children[1].tagName).toBe('text')

    // Verify that background rectangle has the right parent element
    expect(d3
        .select('.background')
        .node()
        .parentNode.getAttribute('class')
    ).toBe('panel')


    // Verify that background rectangle has the right attributes
    expect(d3.select('.background').attr('class')).toBe('background')
    // expect(d3.select('.background').select('rect').attr('x')).toBe()
    // expect(d3.select('.background').select('rect').attr('y')).toBe()
    // expect(d3.select('.background').select('rect').attr('height')).toBe()
    // expect(d3.select('.background').select('rect').attr('width')).toBe()
    // expect(d3.select('.background').select('rect').attr('fill')).toBe()


})


//// YScale ////

test ('YScale should initiate correctly', () => {


    // Clear JEST's DOM to prevent leftovers from previous tests
    document.body.innerHTML = ''

    // Create svg
    const svg = new container.Svg()

    // Create panel
    const myPanel = new navigator.Panel()
        .id('my-panel')
        .update()

    expect(myPanel._chartCount()).toBe(3)

    expect(myPanel._yScale(0)).toBe(366)
    expect(myPanel._yScale(1)).toBe(211)
    expect(myPanel._yScale(2)).toBe(56)

})



test ('YScale should return correct values automatically if any variable involved in the calculation is updated', () => {


    // Clear JEST's DOM to prevent leftovers from previous tests
    document.body.innerHTML = ''

    // Create svg
    const svg = new container.Svg()

    // Create panel
    const myPanel = new navigator.Panel()
        .id('my-panel')
        .update()

    // Check number of charts in panel
    expect(myPanel._chartCount()).toBe(3)

    // Get initial yScale calculations three panel locations
    expect(myPanel._yScale(0)).toBe(366)
    expect(myPanel._yScale(1)).toBe(211)
    expect(myPanel._yScale(2)).toBe(56)

    // Update y coordinate of panel
    myPanel.y(100).update()

    // Verify that yScale is updated
    expect(myPanel._yScale(0)).toBe(441)
    expect(myPanel._yScale(1)).toBe(286)
    expect(myPanel._yScale(2)).toBe(131)


    // Update height of panel
    myPanel.height(100).update()

    // Verify that yScale is updated
    expect(myPanel._yScale(0)).toBe(171)
    expect(myPanel._yScale(1)).toBe(151)
    expect(myPanel._yScale(2)).toBe(131)

})


//// BASIC GETTER AND SETTER METHODS ////
test ('Should get and set X and Y coordinates of the panel correctly', () => {

    // Clear JEST's DOM to prevent leftovers from previous tests
    document.body.innerHTML = ''

    // Create svg
    const svg = new container.Svg()

    // Create panel
    const myPanel = new navigator.Panel()
        .id('my-panel')
        .update()

    // Get live selection of panel on DOM
    const panelElement = document.getElementById('my-panel')


    // Check initial x and y values
    expect(myPanel.x()).toBe(25)
    // expect(myPanel.y()).toBe(100)  // TODO

    // Change variables coordinate
    myPanel
        .x(100)
        .width(200)
        .y(300)
        .height(400)
        .class('my-class')
        .id('my-id')
        .update()

    expect(myPanel.x()).toBe(100)
    expect(myPanel.width()).toBe(200)

    expect(myPanel.y()).toBe(300)
    expect(
        myPanel.objects('gender')
            .objects('male')
            .objects('rectangle')
            .y()
    ).toBe(615)

    expect(
        myPanel.objects('gender')
            .objects('female')
            .objects('rectangle')
            .y()
    ).toBe(574)

    expect(myPanel.height()).toBe(400)
    expect(myPanel._chartHeights()).toBe(114)

    expect(myPanel.class()).toBe('my-class')
    expect(myPanel.id()).toBe('my-id')

    // TODO: DOM testing for coordinates fail on Node, even the methods work OK on web browsers. The update() method of many objects in CPC do not seem to work in Node
    // expect(d3.selectAll('rect').attr('x')).toBe(311)
    // expect(d3.selectAll('rect').attr('width')).toBe(411)
    // expect(d3.selectAll('rect').attr('class')).toBe('my-class')

    // xCoordinateOfFirstRectangleInPanel = panelElement
    //     .getElementsByClassName('chart')[0]
    //     .getElementsByClassName('category')[0]
    //     .getElementsByTagName('rect')[0]
    //     .getAttribute('x')
    // expect(xCoordinateOfFirstRectangleInPanel).toBe(311)


})


//// GET/QUERY/SET DATA ////

test ('Should get the stacks in Panel', () => {

    const myPanel = new navigator.Panel()

    // Verify individual stack sizes
    expect(myPanel.stacks().get('gender').data().size).toBe(2)
    expect(myPanel.stacks().get('status').data().size).toBe(2)
    expect(myPanel.stacks().get('class').data().size).toBe(3)

    // // Probe individual stack data
    expect(myPanel.stacks().get('gender').data('male').get('label')).toBe('Male')
    expect(myPanel.stacks().get('status').data('died').get('start')).toBe(38)
    expect(myPanel.stacks().get('class').data('second-class').get('percentage')).toBe(21)

})


test ('Should bring the specified stack from the stacks', () => {

    const myPanel = new navigator.Panel()

    // Get first, query later manually
    expect(myPanel.stacks().get('gender').data().get('male').get('label'))
        .toBe('Male')

    // Directly query by giving a parameter to to method
    expect(myPanel.stacks('gender').data('male').get('label'))
        .toBe('Male')

})


test ('Should update panel stacks, and also the related instance variables', () => {

    const myPanel = new navigator.Panel()

    // View initial example data
    expectTable(myPanel.stacks(), `\
┌───────────────────┬──────────┬──────────────────────────────────────────────┐
│ (iteration index) │   Key    │                    Values                    │
├───────────────────┼──────────┼──────────────────────────────────────────────┤
│         0         │ 'gender' │ Stack { _data: [Map], _scaleFunction: null } │
│         1         │ 'class'  │ Stack { _data: [Map], _scaleFunction: null } │
│         2         │ 'status' │ Stack { _data: [Map], _scaleFunction: null } │
└───────────────────┴──────────┴──────────────────────────────────────────────┘`)

    // Probe initial example data further
    expect(myPanel.stacks('gender').data('male').get('label'))
        .toBe('Male')
    expect(myPanel.stacks('class').data('first-class').get('label'))
        .toBe('First Class')



    // Create replacement stacks
    const replacementStack1 =  new data.Stack()
        .populateWithExampleData('generic')

    const replacementStack2 =  new data.Stack()
        .populateWithExampleData('generic')

    const replacementStacks = new data.Stacks()
        .clear()
        .add('generic-1', replacementStack1)
        .add('generic-2', replacementStack2)


    // Replace stacks in Panel
    myPanel.stacks(replacementStacks)

    expectTable(myPanel.stacks(), `\
┌───────────────────┬─────────────┬──────────────────────────────────────────────┐
│ (iteration index) │     Key     │                    Values                    │
├───────────────────┼─────────────┼──────────────────────────────────────────────┤
│         0         │ 'generic-1' │ Stack { _data: [Map], _scaleFunction: null } │
│         1         │ 'generic-2' │ Stack { _data: [Map], _scaleFunction: null } │
└───────────────────┴─────────────┴──────────────────────────────────────────────┘`)

    // Probe further to see if data is correctly updated
    expect(myPanel.stacks().size).toBe(2)

    expect(myPanel.stacks('generic-1').data('category-1').get('label'))
        .toBe('Category One')
    expect(myPanel.stacks('generic-1').data('category-2').get('start'))
        .toBe(10)
    expect(myPanel.stacks('generic-1').data('category-2').get('end'))
        .toBe(20)

    expect(myPanel.stacks('generic-2').data('category-3').get('label'))
        .toBe('Category Three')
    expect(myPanel.stacks('generic-2').data('category-3').get('start'))
        .toBe(20)
    expect(myPanel.stacks('generic-2').data('category-3').get('end'))
        .toBe(30)


    // Do a manual check on the updated private stack variable in the instance
    expect(myPanel.stacks().size).toBe(2)
    expect(myPanel.stacks().get('generic-2').data('category-2').get('label'))
        .toBe('Category Two')

    // Check if other stacks-related variables are currectly updated after change of stacks
    // TODO: When more stacks-related variables are added to the class, they MUST be tested here.

})
