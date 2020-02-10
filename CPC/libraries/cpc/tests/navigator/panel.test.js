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
require("../../../../../JestUtils/jest-dom")


//// UMD DEPENDENCIES ////

// D3 //
global.d3 = {
    ...require("../../../external/d3/d3"),
    ...require("../../../external/d3/d3-array")
}
// Disable d3 transitions
d3.selection.prototype.transition = jest.fn( function(){return this} )
d3.selection.prototype.duration = jest.fn( function(){return this} )

// Lodash //
global._ = require("../../../external/lodash")

// JQuery //
global.$ = require("../../../external/jquery-3.1.1.min")


// JS EXTENSIONS //
require("../../../utils/errorUtils")
require("../../../utils/jsUtils")
global.arrayUtils = require("../../../utils/arrayUtils")
global.classUtils = require("../../../utils/classUtils")
global.stringUtils = require("../../../utils/stringUtils")

// JEST EXTENSIONS //
require("../../../../../JestUtils/jest-dom")

// CPC CLASSES
global.container = require("../../container")
global.shape = require("../../shape")
global.data = require("../../../cpc/data")
global.dataset = require("../../../cpc/dataset")


//// MODULE(S) BEING TESTED ////
const navigator = require("../../navigator")






//// UNIT TESTS /////////////////////////////////////////////////////////////////////////////////////////////////////////////


//// Instantiation ///////////////////////////////////////////////////////////////

describe ('Instantiation', () => {



    test ('Instantiate panel', () => {

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


    test ('Instantiate panel as a child of specified parent element', () => {

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
        const myPanel = new navigator.NestedPanel( parentContainerSelection )
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

    test ('Initialize with example data', () => {

        parentContainerSelection = d3.select('body')
            .append("svg")
            .attr("width", 1280)
            .attr("height", 1024)

        const myPanel = new navigator.Panel(parentContainerSelection)


        // Probe the initial sample data
        expect(myPanel.stacks().data().size).toBe(3)
        expect(myPanel.stacks('gender').data('male').get('label')).toEqual('Male')
        expect(myPanel.stacks('class').data('first-class').get('label')).toEqual('First Class')
        expect(myPanel.stacks('status').data('survived').get('percentage')).toEqual(38)


        // Check if data stats are being calculated correctly
        expect(myPanel._chartCount()).toBe(3)


        // Probe the initial data visually
        expectTable(myPanel.stacks().data(), `\
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
│         4         │   'count'    │  843   │
└───────────────────┴──────────────┴────────┘`)

    })



    //// CALCULATE DATA STATS ////

    // CHART COUNT //
    test ('Calculate the number of charts in panel', () => {

        // Clear JEST's DOM to prevent leftovers from previous tests
        document.body.innerHTML = ''


        const svg = new container.Svg()
            , parentContainerSelection = svg.select()

        const myPanel = new navigator.Panel(parentContainerSelection)

        // Check if data stats are being calculated correctly
        expect(myPanel._chartCount()).toBe(3)

    })



    //// INITIATE BY VISUALIZING A DATASET ////

    test ('Visualize a dataset manually by changing Stacks in Panel', async () => {

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
        expectTable(myPanel.stacks().data(), `\
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
│         2         │ 'percentage' │    36    │
│         3         │   'start'    │    0     │
│         4         │    'end'     │   466    │
└───────────────────┴──────────────┴──────────┘`)
        expectTable(myPanel.stacks('Gender').data('Male'), `\
┌───────────────────┬──────────────┬────────┐
│ (iteration index) │     Key      │ Values │
├───────────────────┼──────────────┼────────┤
│         0         │   'label'    │ 'Male' │
│         1         │   'count'    │  843   │
│         2         │ 'percentage' │   64   │
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
┌─────────┬────────┐
│ (index) │ Values │
├─────────┼────────┤
│    y    │   56   │
│ height  │   94   │
│  text   │ '64%'  │
└─────────┴────────┘`)

        femaleObjectProperties = {
            'y': femaleCategoryObject.y(),
            'height': femaleCategoryObject.height(),
            'text': femaleTextObject.text()
        }
        expectTable(femaleObjectProperties,`\
┌─────────┬────────┐
│ (index) │ Values │
├─────────┼────────┤
│    y    │  150   │
│ height  │   52   │
│  text   │ '36%'  │
└─────────┴────────┘`)


    })







    //// INITIALIZATION: DOM STRUCTURE AND ATTRIBUTES OF PANEL ////

    test ('Create charts in the panel, and make sure that they are children and have the right attributes', () => {

        initializeDomWithSvg()

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
    test ('Initialize panel with a background rectangle', () => {

        initializeDomWithSvg()

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

        initializeDomWithSvg()

        // Create panel
        const myPanel = new navigator.Panel()
            .id('my-panel')
            .update()

        expect(myPanel._chartCount()).toBe(3)

        expect(myPanel._yScale(0)).toBe(366)
        expect(myPanel._yScale(1)).toBe(211)
        expect(myPanel._yScale(2)).toBe(56)

    })

})


//// Inferences and Adjustments ///////////////////////////////////////////////////////////////

describe ('Value Inferences and Adjustments', () => {

    test ('YScale should return correct values automatically if any variable involved in its calculation is updated', () => {


        // Clear JEST's DOM to prevent leftovers from previous tests
        document.body.innerHTML = ''

        // Create svg
        const svg = new container.Svg()
            .height(1280)

        // Create panel
        const myPanel = new navigator.Panel()
            .id('my-panel')
            .update()

        // Select elements of Panel in DOM
        const chartElementsInPanel = document.querySelectorAll('#my-panel .chart')
        const backgroundElementInPanel = document.querySelectorAll('#my-panel .background')


        // Check number of charts in panel //
        // Object:
        expect(myPanel._chartCount()).toBe(3)
        // DOM:
        expect(chartElementsInPanel).toHaveLength(3)
        expect(backgroundElementInPanel).toHaveLength(1)


        // Get initial yScale calculations three panel locations
        // Object:
        expect(myPanel._yScale(0)).toBe(366)
        expect(myPanel._yScale(1)).toBe(211)
        expect(myPanel._yScale(2)).toBe(56)
        // DOM:
        const topRectangleOfCategory0 = chartElementsInPanel[0].querySelectorAll('rect')[1]
        const topRectangleOfCategory1 = chartElementsInPanel[1].querySelectorAll('rect')[2]
        const topRectangleOfCategory2 = chartElementsInPanel[2].querySelectorAll('rect')[1]
        expect(topRectangleOfCategory0.getAttribute('y')).toBe('366')
        expect(topRectangleOfCategory1.getAttribute('y')).toBe('211')
        expect(topRectangleOfCategory2.getAttribute('y')).toBe('56')


        // Update y coordinate of panel
        myPanel.y(100).update()

        // Verify that yScale is updated
        expect(myPanel._yScale(0)).toBe(441)
        expect(myPanel._yScale(1)).toBe(286)
        expect(myPanel._yScale(2)).toBe(131)

        // Verify that y coordinates on DOM are updated
        expect(topRectangleOfCategory0.getAttribute('y')).toBe('441')
        expect(topRectangleOfCategory1.getAttribute('y')).toBe('286')
        expect(topRectangleOfCategory2.getAttribute('y')).toBe('131')


        // Update height of panel
        myPanel.height(100).update()

        // Verify that yScale is updated according to new height
        expect(myPanel._yScale(0)).toBe(171)
        expect(myPanel._yScale(1)).toBe(151)
        expect(myPanel._yScale(2)).toBe(131)

        // Verify that y coordinated in DOM are updated when panel height is updated
        expect(topRectangleOfCategory0.getAttribute('y')).toBe('171')
        expect(topRectangleOfCategory1.getAttribute('y')).toBe('151')
        expect(topRectangleOfCategory2.getAttribute('y')).toBe('131')


    })

    test ('Right edge', () => {

        const {panelZero, childPanel, grandChildPanel} = initializeDomWith.panelZero.and.childAndGrandchild()

        // Get right edges
        expect( panelZero.rightEdge() ).toBe( 520 )
        expect( childPanel.rightEdge() ).toBe( 510 )
        expect( grandChildPanel.rightEdge() ).toBe( 500 )

        // Get the actual right edges from DOM
        const panelZeroXCoordinateOnDom = document.querySelector( '#panel-0-0 .background rect' ).getAttribute('x')
        const panelZeroWidthOnDom = document.querySelector( '#panel-0-0 .background rect' ).getAttribute('width')

        const panelOneXCoordinateOnDom = document.querySelector( '#panel-1-0 .background rect' ).getAttribute('x')
        const panelOneWidthOnDom = document.querySelector( '#panel-1-0 .background rect' ).getAttribute('width')

        const panelTwoXCoordinateOnDom = document.querySelector( '#panel-2-0 .background rect' ).getAttribute('x')
        const panelTwoWidthOnDom = document.querySelector( '#panel-2-0 .background rect' ).getAttribute('width')

        const panelZeroRightEdgeOnDom = Number(panelZeroXCoordinateOnDom) + Number(panelZeroWidthOnDom)
        const panelOneRightEdgeOnDom = Number(panelOneXCoordinateOnDom) + Number(panelOneWidthOnDom)
        const panelTwoRightEdgeOnDom = Number(panelTwoXCoordinateOnDom) + Number(panelTwoWidthOnDom)


        expect( panelZero.rightEdge() ).toBe( panelZeroRightEdgeOnDom )
        expect( childPanel.rightEdge() ).toBe( panelOneRightEdgeOnDom )
        expect( grandChildPanel.rightEdge() ).toBe( panelTwoRightEdgeOnDom )

    })


    test ('Left edge', () => {

        const {panelZero, childPanel, grandChildPanel} = initializeDomWith.panelZero.and.childAndGrandchild()

        expect( panelZero.leftEdge() ).toBe( 97 )
        expect( childPanel.leftEdge() ).toBe( 300 )
        expect( grandChildPanel.leftEdge() ).toBe( 400 )



        // Get the actual left edges from DOM
        const panelZeroXCoordinateOnDom = document.querySelector( '#panel-0-0 .background rect' ).getAttribute('x')
        const panelOneXCoordinateOnDom = document.querySelector( '#panel-1-0 .background rect' ).getAttribute('x')
        const panelTwoXCoordinateOnDom = document.querySelector( '#panel-2-0 .background rect' ).getAttribute('x')

        const panelZeroLeftEdgeOnDom = Number(panelZeroXCoordinateOnDom)
        const panelOneLeftEdgeOnDom = Number(panelOneXCoordinateOnDom)
        const panelTwoLeftEdgeOnDom = Number(panelTwoXCoordinateOnDom)

        expect( panelZero.leftEdge() ).toBe( panelZeroLeftEdgeOnDom )
        expect( childPanel.leftEdge() ).toBe( panelOneLeftEdgeOnDom )
        expect( grandChildPanel.leftEdge() ).toBe( panelTwoLeftEdgeOnDom )

    })
    
    test ('Get right edge of charts', () => {

        const {panelZero, childPanel, grandChildPanel} = initializeDomWith.panelZero.and.childAndGrandchild()

        expect( panelZero.rightEdgeOfCharts() ).toBe( 290 )
        expect( childPanel.rightEdgeOfCharts() ).toBe( 390 )
        expect( grandChildPanel.rightEdgeOfCharts() ).toBe( 490 )


        const xCoordinateOfOneChartInPanel0_fromDom = document.querySelector( '#panel-0-0 .chart rect' ).getAttribute('x')
        const widthOfOneChartInPanel0_fromDom = document.querySelector( '#panel-0-0 .chart rect' ).getAttribute('width')

        const xCoordinateOfOneChartInPanel1_fromDom = document.querySelector( '#panel-1-0 .chart rect' ).getAttribute('x')
        const widthOfOneChartInPanel1_fromDom = document.querySelector( '#panel-1-0 .chart rect' ).getAttribute('width')

        const xCoordinateOfOneChartInPanel2_fromDom = document.querySelector( '#panel-2-0 .chart rect' ).getAttribute('x')
        const widthOfOneChartInPanel2_fromDom = document.querySelector( '#panel-2-0 .chart rect' ).getAttribute('width')


        const rightEdgeOfOneChartInPanel0_fromDom = Number( xCoordinateOfOneChartInPanel0_fromDom )  + Number( widthOfOneChartInPanel0_fromDom )
        const rightEdgeOfOneChartInPanel1_fromDom = Number( xCoordinateOfOneChartInPanel1_fromDom )  + Number( widthOfOneChartInPanel1_fromDom )
        const rightEdgeOfOneChartInPanel2_fromDom = Number( xCoordinateOfOneChartInPanel2_fromDom )  + Number( widthOfOneChartInPanel2_fromDom )

        // Compare values calculated from the instance and from DOM
        expect( panelZero.rightEdgeOfCharts() ).toBe( rightEdgeOfOneChartInPanel0_fromDom )
        expect( childPanel.rightEdgeOfCharts() ).toBe( rightEdgeOfOneChartInPanel1_fromDom )
        expect( grandChildPanel.rightEdgeOfCharts() ).toBe( rightEdgeOfOneChartInPanel2_fromDom )

    })


    test ('Get left edge of charts', () => {

        const {panelZero, childPanel, grandChildPanel} = initializeDomWith.panelZero.and.childAndGrandchild()

        expect( panelZero.leftEdgeOfCharts() ).toBe( 210 )
        expect( childPanel.leftEdgeOfCharts() ).toBe( 310 )
        expect( grandChildPanel.leftEdgeOfCharts() ).toBe( 410 )


        const xCoordinateOfOneChartInPanel0_fromDom = document.querySelector( '#panel-0-0 .chart rect' ).getAttribute('x')
        const xCoordinateOfOneChartInPanel1_fromDom = document.querySelector( '#panel-1-0 .chart rect' ).getAttribute('x')
        const xCoordinateOfOneChartInPanel2_fromDom = document.querySelector( '#panel-2-0 .chart rect' ).getAttribute('x')

        const leftEdgeOfOneChartInPanel0_fromDom = Number( xCoordinateOfOneChartInPanel0_fromDom )
        const leftEdgeOfOneChartInPanel1_fromDom = Number( xCoordinateOfOneChartInPanel1_fromDom )
        const leftEdgeOfOneChartInPanel2_fromDom = Number( xCoordinateOfOneChartInPanel2_fromDom )

        // Compare values calculated from the instance and from DOM
        expect( panelZero.leftEdgeOfCharts() ).toBe( leftEdgeOfOneChartInPanel0_fromDom )
        expect( childPanel.leftEdgeOfCharts() ).toBe( leftEdgeOfOneChartInPanel1_fromDom )
        expect( grandChildPanel.leftEdgeOfCharts() ).toBe( leftEdgeOfOneChartInPanel2_fromDom )

    })

})



//// Getters and Setters ///////////////////////////////////////////////////////////////

describe ('Getters and Setters', () => {

    //// BASIC GETTER AND SETTER METHODS ////
    test ('Get and set X and Y coordinates of the panel correctly', () => {

            // Clear JEST's DOM to prevent leftovers from previous tests
            document.body.innerHTML = ''

            // Create svg
            const svg = new container.Svg()
                .width(1000)
                .height(1500)

            // Create panel
            const myPanel = new navigator.Panel()
                .id('my-panel')
                .update(0)

            // Select panel and its elements on DOM
            const panelElement = document.querySelector('#my-panel')
            const chartElementsInPanel = document.querySelectorAll('#my-panel .chart')
            const backgroundRectangleElementInPanel = document.querySelector('#my-panel .background rect')
            const topRectangleOfCategory0 = chartElementsInPanel[0].querySelectorAll('rect')[1]
            const topRectangleOfCategory1 = chartElementsInPanel[1].querySelectorAll('rect')[2]
            const topRectangleOfCategory2 = chartElementsInPanel[2].querySelectorAll('rect')[1]
            const maleRectangleElement = document.querySelector('.chart#gender .category#male rect')
            const femaleRectangleElement= document.querySelector('.chart#gender .category#female rect')

            // Check initial x and y values
            expect(myPanel.x()).toBe(25)
            expect(myPanel.y()).toBe(25)
            expect(backgroundRectangleElementInPanel.getAttribute('x')).toBe('25')
            expect(backgroundRectangleElementInPanel.getAttribute('y')).toBe('25')

            // Change variable coordinates
            myPanel
                .x(100)
                .width(200)
                .y(100)
                .height(200)
                .update()

            expect(myPanel.x()).toBe(100)
            expect(myPanel.y()).toBe(100)
            expect(myPanel.width()).toBe(200)
            expect(myPanel.height()).toBe(200)
            expect(myPanel._chartHeights()).toBe(51)

            expect(
                myPanel.objects('gender')
                    .objects('male')
                    .objects('rectangle')
                    .y()
            ).toBe(256)
            expect(maleRectangleElement.getAttribute('y')).toBe('256')

            expect(
                myPanel.objects('gender')
                    .objects('female')
                    .objects('rectangle')
                    .y()
            ).toBe(238)
            expect(femaleRectangleElement.getAttribute('y')).toBe('238')

        })


})


//// Width ///////////////////////////////////////////////////////////////

describe ('Width', () => {

    test ('Get width', () => {

        const {panelZero, childPanel, grandChildPanel} = initializeDomWith.panelZero.and.childAndGrandchild()

        // Get default widths
        expect( panelZero.width() ).toBe(100)
        expect( childPanel.width() ).toBe(100)
        expect( grandChildPanel.width() ).toBe(100)

    })



    test ('Children panel should shift rightward ', () => {

        const {panelZero, childPanel, grandChildPanel} = initializeDomWith.panelZero.and.childAndGrandchild()

        // Save default width
        const defaultWidth = panelZero.width()

        // Choose a new value for width
        const newWidth = 225
        expect( newWidth ).not.toBe( defaultWidth )

        expect( _doChartsInPanelsOverlap(panelZero, childPanel) ).toBe( false )

        // Modify width
        panelZero.width( newWidth )

        // Modification should have worked on the panel
        expect( panelZero.width() ).toBe( newWidth )

        // Other panels should not have changed with
        expect( childPanel.width() ).toBe( defaultWidth )
        expect( grandChildPanel.width() ).toBe( defaultWidth )

        // Other panels should have shifted rightwards to accommodate
        // ...the new width of the modified panel

        expect( _doChartsInPanelsOverlap(panelZero, childPanel) ).toBe( false )
        expect( _doChartsInPanelsOverlap(childPanel, grandChildPanel) ).toBe( false )

    })


    test ('Parent backgrounds should expand to accommodate new width', () => {

        const {panelZero, childPanel, grandChildPanel} = initializeDomWith.panelZero.and.childAndGrandchild()

        const panel0EncapsulatesPanel1 = () => panelZero.rightEdge() > childPanel.rightEdge()
        const panel1EncapsulatesPanel2 = () => childPanel.rightEdge() > grandChildPanel.rightEdge()

        // Initial state should have the right panel encapsulations
        expect( panel0EncapsulatesPanel1() ).toBe(true)
        expect( panel1EncapsulatesPanel2() ).toBe(true)


        // Increase the width of a child panel
        expect( grandChildPanel.width() ).not.toBe( 200 )
        grandChildPanel.width(200).update(0)


        // Post-modification state should also have the right panel encapsulations
        expect( panel0EncapsulatesPanel1() ).toBe(true)
        expect( panel1EncapsulatesPanel2() ).toBe(true)


    })


    test ('Siblings of parents should accommodate new width', () => {

        jest.useFakeTimers()

        const {
            panelZero,
            siblingPanel1, siblingPanel2, siblingPanel3,
            childPanelOfSibling1, childPanelOfSibling2, childPanelOfSibling3
        } = initializeDomWith.panelZero.and.twoSiblingChilrenThatEachHasOneChild()


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

    })

    test ('New children should initiate by taking the new width of parent into account', () => {

        jest.useFakeTimers()

        const panelZero = initializeDomWith.panelZero()

        // Modify the width
        expect( panelZero.width() ).not.toBe( 200 )
        panelZero
            .width(200)
            .update(0)
        jest.runOnlyPendingTimers()

        // Add new panel
        // Create child panel
        const spawnObjectForChildPanel = panelZero.objects('gender').objects('female')
        const childPanel = new navigator.NestedPanel(panelZero, spawnObjectForChildPanel)
        childPanel
            .bgText('childPanel')
            .update(0)
        jest.runOnlyPendingTimers()

        jest.runAllTimers()

        // There should be no overlaps
        expect( panelZero.rightEdgeOfCharts() < childPanel.leftEdge() ).toBe( true )

    })
    
    
    test ('While they are initiating, new children of resized panels should push siblings of parents', () => {


        const panelZero = initializeDomWith.panelZero()

        // Resize panel zero
        expect( panelZero.width() ).not.toBe( 200 )
        panelZero
            .width( 200 )
            .update()

        // Create the first sibling
        let siblingPanel1
        setTimeout( () => {
            const spawnObjectForSiblingPanel1 = panelZero.objects('class').objects('first-class')
            siblingPanel1 = new navigator.NestedPanel(panelZero, spawnObjectForSiblingPanel1)
            siblingPanel1
                .bgText('siblingPanel1')
                .update(0)

        }, 1000)
        jest.runOnlyPendingTimers()


        // Create the second sibling
        let siblingPanel2
        setTimeout( () => {
            const spawnObjectForSiblingPanel2 = panelZero.objects('class').objects('second-class')
            siblingPanel2 = new navigator.NestedPanel(panelZero, spawnObjectForSiblingPanel2, 'sibling')
            siblingPanel2
                .bgText('siblingPanel2')
                .update(0)
        }, 2000)
        jest.runOnlyPendingTimers()

        // Create a child of first sibling
        let childPanelOfSibling1
        setTimeout( () => {
            let spawnObjectForChildPanelOfSibling1 = siblingPanel1.objects('gender').objects('male')
            childPanelOfSibling1 = new navigator.NestedPanel(siblingPanel1, spawnObjectForChildPanelOfSibling1)
            childPanelOfSibling1
                .bgText('childPanelOfSibling1')
                .update(0)
        }, 4000)
        jest.runOnlyPendingTimers()

        writeDomToFile('/Users/jlokman/Projects/Code/TEPAIV/CPC/libraries/cpc/tests/dom-out/1.html')
        expect( siblingPanel1.rightEdge() < siblingPanel2.leftEdge() ).toBe( true )
        expect( childPanelOfSibling1.rightEdge() < siblingPanel2.leftEdge() ).toBe( true )




    })
    

    function _doChartsInPanelsOverlap(panelA, panelB) {

        const endPointOfChartsInPanelA = panelA.rightEdgeOfCharts()
        const startingPointOfChartsInPanelB = panelB.leftEdgeOfCharts()

        const panelAChartsEndBeforePanelBChartsStart = endPointOfChartsInPanelA < startingPointOfChartsInPanelB

        const judgement = !panelAChartsEndBeforePanelBChartsStart
        return judgement

    }


})




//// Absolute Chart Widths ///////////////////////////////////////////////////////////////

describe ('Absolute Chart Widths', () => {
   
        test ('Set/get absolute chart widths', () => {
        
            const panelZero = initializeDomWith.panelZero()


            // Default value should be false
            expect( panelZero.absoluteChartWidths() ).toBe( false )

            // Change value
            panelZero.absoluteChartWidths(true)
            expect( panelZero.absoluteChartWidths() ).toBe( true )


        })


        test ('When absolute chart widths are on, charts should have the right proportions on DOM', () => {

            const {panelZero, childPanel} = initializeDomWith.panelZero.and.child()

            // Turn on absolute chart widths
            panelZero.absoluteChartWidths(true)

            expect( panelZero.innerWidth() > childPanel.innerWidth() ).toBe( true )
            // expect( panelZero.data )

        })



})


//// Data Operations ///////////////////////////////////////////////////////////////

describe ('Data Operations', () => {


    test ('Get the stacks in Panel', () => {

        const myPanel = new navigator.Panel()

        // Verify individual stack sizes
        expect(myPanel.stacks().data().get('gender').data().size).toBe(2)
        expect(myPanel.stacks().data().get('status').data().size).toBe(2)
        expect(myPanel.stacks().data().get('class').data().size).toBe(3)

        // // Probe individual stack data
        expect(myPanel.stacks().data().get('gender').data('male').get('label')).toBe('Male')
        expect(myPanel.stacks().data().get('status').data('died').get('start')).toBe(38)
        expect(myPanel.stacks().data().get('class').data('second-class').get('percentage')).toBe(21)

    })


    test ('Bring the specified stack from the stacks', () => {

        const myPanel = new navigator.Panel()

        // Get first, query later manually
        expect(myPanel.stacks().data().get('gender').data().get('male').get('label'))
            .toBe('Male')

        // Directly query by giving a parameter to to method
        expect(myPanel.stacks('gender').data('male').get('label'))
            .toBe('Male')

    })


    test ('Update panel stacks, and also the related instance variables', () => {

        const myPanel = new navigator.Panel()

        // View initial example data
        expectTable(myPanel.stacks().data(), `\
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

        expectTable(myPanel.stacks().data(), `\
┌───────────────────┬─────────────┬──────────────────────────────────────────────┐
│ (iteration index) │     Key     │                    Values                    │
├───────────────────┼─────────────┼──────────────────────────────────────────────┤
│         0         │ 'generic-1' │ Stack { _data: [Map], _scaleFunction: null } │
│         1         │ 'generic-2' │ Stack { _data: [Map], _scaleFunction: null } │
└───────────────────┴─────────────┴──────────────────────────────────────────────┘`)

        // Probe further to see if data is correctly updated
        expect(myPanel.stacks().data().size).toBe(2)

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
        expect(myPanel.stacks().data().size).toBe(2)
        expect(myPanel.stacks().data().get('generic-2').data('category-2').get('label'))
            .toBe('Category Two')

        // Check if other stacks-related variables are currectly updated after change of stacks
        // TODO: When more stacks-related variables are added to the class, they MUST be tested here.

    })


    test ('Summarize a dataset with panel', async () => {

        // Create panel zero
        const panelZero = new navigator.Panel()
            .bgText('panelZero')
            .update(0)

        // Save a definitive property of exaple dataset for later comparison
        const largestTotalCountOfExampleData =  panelZero.stacks().largestTotalCount()

        // Summarize a dataset with panel
        await panelZero
            .summarizeDataset('http://localhost:3000/libraries/cpc/tests/dataset/titanicTiny.csv', 'Name')
        panelZero.update()

        // Data should have been summarized correctly
        expect( panelZero.stacks().data() ).toTabulateAs(`\
┌───────────────────┬──────────┬──────────────────────────────────────────────┐
│ (iteration index) │   Key    │                    Values                    │
├───────────────────┼──────────┼──────────────────────────────────────────────┤
│         0         │ 'Ticket' │ Stack { _data: [Map], _scaleFunction: null } │
│         1         │ 'Status' │ Stack { _data: [Map], _scaleFunction: null } │
│         2         │ 'Gender' │ Stack { _data: [Map], _scaleFunction: null } │
└───────────────────┴──────────┴──────────────────────────────────────────────┘`)

        // Check an example summary element
        expect ( panelZero.stacks('Gender').data() ).toTabulateAs(`\
┌───────────────────┬──────────┬───────────────────────────────────────────────────────────────────────────────────────────┐
│ (iteration index) │   Key    │                                          Values                                           │
├───────────────────┼──────────┼───────────────────────────────────────────────────────────────────────────────────────────┤
│         0         │ 'Female' │ Map { 'label' => 'Female', 'count' => 49, 'percentage' => 49, 'start' => 0, 'end' => 49 } │
│         1         │  'Male'  │ Map { 'label' => 'Male', 'count' => 51, 'percentage' => 51, 'start' => 49, 'end' => 100 } │
└───────────────────┴──────────┴───────────────────────────────────────────────────────────────────────────────────────────┘`)

        // The data should not be of the example dataset loaded to panel on initialization.
        // Check this by comparing a definitive feature of the two datasets
        expect ( largestTotalCountOfExampleData ).not.toBe( 100 )
        expect ( panelZero.largestTotalCount() ).toBe( 100 )


        // New dataset should be visualized on DOM
        expect( panelZero.objects() ).toTabulateAs(`\
┌───────────────────┬──────────┬─────────┐
│ (iteration index) │   Key    │ Values  │
├───────────────────┼──────────┼─────────┤
│         0         │ 'Ticket' │ [Chart] │
│         1         │ 'Status' │ [Chart] │
│         2         │ 'Gender' │ [Chart] │
└───────────────────┴──────────┴─────────┘`)

    })


    test ('Summarize a few datasets in the same panel in succession', async () => {

        // Create panel zero
        const panelZero = new navigator.Panel()
            .bgText('panelZero')
            .update(0)

        // Summarize a dataset with panel
        await panelZero.summarizeDataset('http://localhost:3000/libraries/cpc/tests/dataset/titanicTiny.csv', 'Name')
        panelZero.update()

        // Data should have been summarized correctly
        expect( panelZero.stacks().data() ).toTabulateAs(`\
┌───────────────────┬──────────┬──────────────────────────────────────────────┐
│ (iteration index) │   Key    │                    Values                    │
├───────────────────┼──────────┼──────────────────────────────────────────────┤
│         0         │ 'Ticket' │ Stack { _data: [Map], _scaleFunction: null } │
│         1         │ 'Status' │ Stack { _data: [Map], _scaleFunction: null } │
│         2         │ 'Gender' │ Stack { _data: [Map], _scaleFunction: null } │
└───────────────────┴──────────┴──────────────────────────────────────────────┘`)

        // Check an example summary element
        expect ( panelZero.stacks('Gender').data() ).toTabulateAs(`\
┌───────────────────┬──────────┬───────────────────────────────────────────────────────────────────────────────────────────┐
│ (iteration index) │   Key    │                                          Values                                           │
├───────────────────┼──────────┼───────────────────────────────────────────────────────────────────────────────────────────┤
│         0         │ 'Female' │ Map { 'label' => 'Female', 'count' => 49, 'percentage' => 49, 'start' => 0, 'end' => 49 } │
│         1         │  'Male'  │ Map { 'label' => 'Male', 'count' => 51, 'percentage' => 51, 'start' => 49, 'end' => 100 } │
└───────────────────┴──────────┴───────────────────────────────────────────────────────────────────────────────────────────┘`)


        // New dataset should be visualized on DOM
        expect( panelZero.objects() ).toTabulateAs(`\
┌───────────────────┬──────────┬─────────┐
│ (iteration index) │   Key    │ Values  │
├───────────────────┼──────────┼─────────┤
│         0         │ 'Ticket' │ [Chart] │
│         1         │ 'Status' │ [Chart] │
│         2         │ 'Gender' │ [Chart] │
└───────────────────┴──────────┴─────────┘`)


        // Summarize another dataset
        await panelZero.summarizeDataset('http://localhost:3000/libraries/cpc/tests/dataset/BigFivePersonalityTraits-Small.csv', 'Name')
        panelZero.update()

        // Data should have been summarized correctly
        expect( panelZero.stacks().data() ).toTabulateAs(`\
┌───────────────────┬─────────────────────┬──────────────────────────────────────────────┐
│ (iteration index) │         Key         │                    Values                    │
├───────────────────┼─────────────────────┼──────────────────────────────────────────────┤
│         0         │    'Neuroticism'    │ Stack { _data: [Map], _scaleFunction: null } │
│         1         │   'Extraversion'    │ Stack { _data: [Map], _scaleFunction: null } │
│         2         │     'Openness'      │ Stack { _data: [Map], _scaleFunction: null } │
│         3         │   'Agreeableness'   │ Stack { _data: [Map], _scaleFunction: null } │
│         4         │ 'Conscientiousness' │ Stack { _data: [Map], _scaleFunction: null } │
└───────────────────┴─────────────────────┴──────────────────────────────────────────────┘`)

        // New dataset should be visualized on DOM
        expect( panelZero.objects() ).toTabulateAs(`\
┌───────────────────┬─────────────────────┬─────────┐
│ (iteration index) │         Key         │ Values  │
├───────────────────┼─────────────────────┼─────────┤
│         0         │    'Neuroticism'    │ [Chart] │
│         1         │   'Extraversion'    │ [Chart] │
│         2         │     'Openness'      │ [Chart] │
│         3         │   'Agreeableness'   │ [Chart] │
│         4         │ 'Conscientiousness' │ [Chart] │
└───────────────────┴─────────────────────┴─────────┘`)

        // Summarize the first dataset again
        await panelZero.summarizeDataset('http://localhost:3000/libraries/cpc/tests/dataset/titanicTiny.csv', 'Name')
        panelZero.update()

        // Data should have been loaded correctly
        expect( panelZero.stacks().data() ).toTabulateAs(`\
┌───────────────────┬──────────┬──────────────────────────────────────────────┐
│ (iteration index) │   Key    │                    Values                    │
├───────────────────┼──────────┼──────────────────────────────────────────────┤
│         0         │ 'Ticket' │ Stack { _data: [Map], _scaleFunction: null } │
│         1         │ 'Status' │ Stack { _data: [Map], _scaleFunction: null } │
│         2         │ 'Gender' │ Stack { _data: [Map], _scaleFunction: null } │
└───────────────────┴──────────┴──────────────────────────────────────────────┘`)

        // New dataset should be visualized on DOM
        expect( panelZero.objects() ).toTabulateAs(`\
┌───────────────────┬──────────┬─────────┐
│ (iteration index) │   Key    │ Values  │
├───────────────────┼──────────┼─────────┤
│         0         │ 'Ticket' │ [Chart] │
│         1         │ 'Status' │ [Chart] │
│         2         │ 'Gender' │ [Chart] │
└───────────────────┴──────────┴─────────┘`)

    })


})



//// Statistics ///////////////////////////////////////////////////////////////

describe ('Statistics', () => {

        test ('Largest count in panel', () => {

            const myPanel = new navigator.Panel()

            expect( myPanel.largestTotalCount() ).toBe( 1309 )

        })

})

//// Nested Panel Initialization ///////////////////////////////////////////////////////////////

describe ('Nested Panel Instantiation', () => {

    test ('Instantiate panel with a spawn location', () => {

        // Clear JEST's DOM to prevent leftovers from previous tests
        document.body.innerHTML = ''


        // Create SVG
        const mySvg = new container.Svg()
        mySvg.select()
            .attr('id', 'top-svg')

        // Create parent panel
        const parentPanel = new navigator.NestedPanel(mySvg)
        parentPanel.id('parent-panel').update()

        // Create a child panel that spawns from a category in parent panel
        const objectToSpawnFrom = parentPanel.objects('gender').objects('male')
        const childPanel = new navigator.NestedPanel(parentPanel, objectToSpawnFrom)
        childPanel.id('child-panel').update()

        // Child panel should refer to a category as its spawn source
        const classOfObjectToSpawnFrom = childPanel.objectToSpawnFrom.constructor.name
        expect(classOfObjectToSpawnFrom).toBe('Category')

        // There must be two panels after creating a child panel
        const numberOfPanels = document.querySelectorAll('.panel').length
        expect(numberOfPanels).toBe(2)

        // A bridge object should be created
        const bridgeElements = document.querySelectorAll('.bridge')
        expect(bridgeElements.length).toBe(1)


        // Bridge should be at the correct end position
        const bridgeRectangleElement = document.querySelector('.bridge')
        const categoryObjectBeingSpawnedFrom = childPanel.objectToSpawnFrom
            , categoryRectangleElementBeingSpawnedFrom = categoryObjectBeingSpawnedFrom.objects('rectangle').select()

        yCoordinateOfBridgeRectangleElement = bridgeRectangleElement.getAttribute('y')
        yCoordinateOfCategoryRectangleBeingSpawnedFrom = categoryRectangleElementBeingSpawnedFrom.node().getAttribute('y')

        expect(yCoordinateOfBridgeRectangleElement === yCoordinateOfCategoryRectangleBeingSpawnedFrom).toBeTruthy()

    })


    test ('Throw error if no spawn source is specified', () => {


        // Clear JEST's DOM to prevent leftovers from previous tests
        document.body.innerHTML = ''

        // Create SVG
        const mySvg = new container.Svg()
        mySvg.select()
            .attr('id', 'top-svg')

        // Create parent panel
        const parentPanel = new navigator.NestedPanel(mySvg)  // no need to specify a spawn source if no parent is specified
        parentPanel.id('parent-panel').update()

        // Create a child panel that spawns from a category in parent panel
        objectToSpawnFrom = parentPanel.objects('gender').objects('male')
        const legitimateChildPanel = new navigator.NestedPanel(parentPanel, objectToSpawnFrom)  // spawn source must be specified if a parent panel is specified
        legitimateChildPanel.id('child-panel').update()


        // Try to create a child panel without specifying a spawn source (expect error)
        expect( () => {
            const parentPanel2 = new navigator.NestedPanel(mySvg)  // no need to specify a spawn source if no parent is specified
            const illegitimateChildPanel = new navigator.NestedPanel(parentPanel2)   // cannot specify a parent panel without spawn source
        } ).toThrow("The panel is specified to be a child of another panel, but no object is specified as spawn source (missing argument).")


    })

})



//// BG Extension ///////////////////////////////////////////////////////////////

describe ('BG Extension', () => {

    test ('BG Extension: Extend panel background leftward', () => {

        initializeDomWithSvg()

        // Create panel
        const myPanel = new navigator.Panel()
            .x(300)
            .update()


        // Get left background extension value
        expect( myPanel.bgExtensionLeft() )
            .toBe( myPanel._bgExtension.left )


        // Record initial background related variables
        const initialBgExtensionLeft = myPanel.bgExtensionLeft()
        const initialBgX = myPanel._backgroundObject.x()
        const initialBgWidth = myPanel._backgroundObject.width()



        //// EXTEND ////

        // Extend panel background leftward
        const extensionValue = 100
        myPanel.bgExtensionLeft(extensionValue).update()

        // Record new background related variables
        const newBgExtensionLeft = myPanel.bgExtensionLeft()
        const newBgX = myPanel._backgroundObject.x()
        const newBgWidth = myPanel._backgroundObject.width()

        // Check new background-related values that should be updated
        expect ( newBgExtensionLeft ).toBe( extensionValue )
        expect ( newBgX ).toBe( initialBgX - extensionValue )
        expect ( newBgWidth ).toBe( initialBgWidth + extensionValue )


        // Check if final values are reflected to DOM
        const newBgXOnDom = Number( document.querySelector('.background .rectangle').getAttribute('x') )
        const newBgWidthOnDom = Number( document.querySelector('.background .rectangle').getAttribute('width') )
        expect( newBgXOnDom ).toBe( newBgX )
        expect( newBgWidthOnDom ).toBe( newBgWidth )




        //// RETRACT ////

        // Retract the background extension
        const newExtensionValue = 50
        myPanel.bgExtensionLeft( newExtensionValue ).update()

        // Record new background related variables
        const retractedBgExtensionLeft = myPanel.bgExtensionLeft()
        const retractedBgX = myPanel._backgroundObject.x()
        const retractedBgWidth = myPanel._backgroundObject.width()

        // Check new background-related values that should be updated
        expect ( retractedBgExtensionLeft ).toBe( newExtensionValue )
        expect ( retractedBgX ).toBe( initialBgX - newExtensionValue )
        expect ( retractedBgWidth ).toBe( initialBgWidth + newExtensionValue )


    })


    test ('BG Extension: Left and right extension together', () => {

        //// INITIALIZE ////
        initializeDomWithSvg()

        // Create panel
        const myPanel = new navigator.Panel()
            .x(300)
            .update()


        myPanel.width(100).update()

        backgroundObject = myPanel._backgroundObject
        leftExtensionValue = 100
        rightExtensionValue = 100

        myPanel.bgExtensionLeft( leftExtensionValue ).update()
        myPanel.bgExtensionRight( rightExtensionValue ).update()

        expect( backgroundObject.width() )
            .toBe( leftExtensionValue + myPanel.width() + rightExtensionValue)


    })

})


//// Y Axis Labels ///////////////////////////////////////////////////////////////

describe ('Y Axis Labels', () => {

    test ('Toggle labels on y axis on/off', () => {

        initializeDomWithSvg()

        // Create panel
        const myPanel = new navigator.Panel()
            .x(150)
            .update()


        //// INITIAL STATE CHECK ////

        // Initially, there should be no labels on y axis
        let labelsOnYAxis = document.querySelectorAll('.category-label')
        expect(labelsOnYAxis).toHaveLength(0)


        //// TOGGLE LABELS ON ////

        // Add labels
        myPanel.yAxisLabels(true).update()


        // Labels should be created on DOM
        labelsOnYAxis = document.querySelectorAll('.category-label')
        expect(labelsOnYAxis).toHaveLength(7)

        const maleLabelElement = document.querySelector('.category#male .category-label')
        expect(maleLabelElement.textContent).toBe('male')
        expect(maleLabelElement.getAttribute('x')).toBe("140")
        expect(maleLabelElement.getAttribute('y')).toBe("468.5")


        //// TOGGLE LABELS OFF ////
        myPanel.yAxisLabels(false).update()

        // No label elements should be on DOM after toggle off
        labelsOnYAxisAfterToggleOff = document.querySelectorAll('.category-label')
        expect(labelsOnYAxisAfterToggleOff).toHaveLength(0)

    })


// TODO: Test MUST be completed
    test ('Update label positions when panel position or height is changed', () => {

        // Clear JEST's DOM to prevent leftovers from previous tests
        document.body.innerHTML = ''

        // Create SVG
        const mySvg = new container.Svg()
        mySvg.select()
            .attr('id', 'top-svg')

        // Create panel
        const myPanel = new navigator.Panel()

    })



    test ('Ensure that chart labels on y axis are vertically aligned with each other', () => {

        // Clear JEST's DOM to prevent leftovers from previous tests
        document.body.innerHTML = ''
        // Create SVG
        const mySvg = new container.Svg()
        mySvg.select()
            .attr('id', 'top-svg')
        // Create panel
        const myPanel = new navigator.Panel()
        // Turn y axis labels on
        myPanel.yAxisLabels(true).update()

        const xCoordinateOfChart1Label = myPanel.objects('status')._chartLabelObject.x()
        const xCoordinateOfChart2Label = myPanel.objects('class')._chartLabelObject.x()
        const xCoordinateOfChart3Label = myPanel.objects('gender')._chartLabelObject.x()

        expect( xCoordinateOfChart1Label === xCoordinateOfChart2Label )
            .toBeTruthy()
        expect( xCoordinateOfChart1Label === xCoordinateOfChart3Label )
            .toBeTruthy()

    })


    test ('Get the position of the farthest category label', () => {

        // Clear JEST's DOM to prevent leftovers from previous tests
        document.body.innerHTML = ''
        // Create SVG
        const mySvg = new container.Svg()
        mySvg.select()
            .attr('id', 'top-svg')
        // Create panel
        const myPanel = new navigator.Panel()
        // Turn y axis labels on
        myPanel.yAxisLabels(true).update()

        // Get the x coordinate of the farthest chart label
        const automaticallyRetrievedInitialXCoordinate = myPanel._getXCoordinateOfFarthestChartLabel()
        const manuallyRetrievedInitialXCoordinate = myPanel.objects('class')._chartLabelObject.x()
        expect( automaticallyRetrievedInitialXCoordinate )
            .toBe( manuallyRetrievedInitialXCoordinate )

        // COMMENTED OUT TEST BLOCK IS NO MORE MEANINGFUL, AS ALL LABELS ARE AUTOMATICALLY ALIGNED UPON INITIATION (they share the same x coordinate)
        // Ensure that the method only returns the farthest coordinate, which ...
        // should be less (because it is leftmost) than other chart labels' x coordinates
        // expect( automaticallyRetrievedInitialXCoordinate )
        //     .toBeLessThan( myPanel.objects('gender')._chartLabelObject.x() )
        // expect( automaticallyRetrievedInitialXCoordinate )
        //     .toBeLessThan( myPanel.objects('status')._chartLabelObject.x() )


        // Move the chart, and see if the position of the chart label is updated
        const increment = 600
        myPanel.x( myPanel.x()  + increment ).update()
        const automaticallyRetrievedNewXCoordinate  = myPanel._getXCoordinateOfFarthestChartLabel()
        expect( automaticallyRetrievedNewXCoordinate )
            .toBe( manuallyRetrievedInitialXCoordinate + increment )

    })


})




//// ABSOLUTE VALUES ///////////////////////////////////////////////////////////////

describe ('Absolute Values: Toggling absolute values should show counts instead of percentages', () => {

    initializeDomWithSvg()

    // Create panel
    const myPanel = new navigator.Panel()


    test('Get/Set', () => {

        // GET //
        expect( myPanel.showAbsoluteValues() ).toBe( false )

        // SET (on) //
        myPanel.showAbsoluteValues( true ).update()
        expect( myPanel.showAbsoluteValues() ).toBe( true )


        // SET (off) //
        myPanel.showAbsoluteValues( false ).update()
        expect( myPanel.showAbsoluteValues() ).toBe( false )
    })


    test('Propagation to Charts: Absolute value-related properties of category objects in panel should be set correctly after toggling absolute values', () => {

        // Record & check the defaults for panel
        expect( myPanel.showAbsoluteValues() ).toBe( false )
        // Record defaults for the charts contained within the panel
        let absoluteValuesStatusesInCharts = getStatusOfAbsoluteValuesInChartObjectsInPanel()
        expect( absoluteValuesStatusesInCharts )
            .toEqual( [false, false, false] )



        // Toggle absolute values on //
        myPanel.showAbsoluteValues( true ).update()

        // Check if related properties are updated...
        // ...in panel
        expect( myPanel.showAbsoluteValues() ).toBe( true )
        // ...in charts in panel
        absoluteValuesStatusesInCharts = getStatusOfAbsoluteValuesInChartObjectsInPanel()
        expect( absoluteValuesStatusesInCharts )
            .toEqual( [true, true, true] )



        // Toggle absolute values off //
        myPanel.showAbsoluteValues( false ).update()

        // Check if related properties are updated...
        // ...in panel
        expect( myPanel.showAbsoluteValues() ).toBe( false )
        // ...in charts in panel
        absoluteValuesStatusesInCharts = getStatusOfAbsoluteValuesInChartObjectsInPanel()
        expect( absoluteValuesStatusesInCharts )
            .toEqual( [false, false, false] )




        // HELPER FUNCTION(S) FOR THIS TEST //

        /**
         * @return {[]|Array}s
         */
        function getStatusOfAbsoluteValuesInChartObjectsInPanel () {
            values = []
            myPanel.objects().forEach((categoryObject, categoryName) => {
                const value = categoryObject.showAbsoluteValues()
                values.push(value)
            })
            return values
        }



    })






    test ('DOM and Propagation to Child Panels: Both parent and child panels should update on DOM properly after each toggle', () => {

        // PREP //
        // NOTE: DO NOT DELETE THIS BLOCK. DOM must be re-prepped for this test with this block. Otherwise, jest becomes flaky in some environments.
        // Clear JEST's DOM to prevent leftovers from previous tests
        initializeDomWithSvg()

        // Create panel
        const myPanel = new navigator.NestedPanel()


        // Crete a child panel
        const spawnSourceObjectForChild1 = myPanel.objects('gender').objects('female')
        spawnSourceObjectForChild1.fill('salmon')
        const childPanel = new navigator.NestedPanel(myPanel, spawnSourceObjectForChild1, 0)



        // Check initial captions of parent and child panel on DOM
            let captionTexts = getCaptionTextsOfCategoriesFromDom()
            expect( captionTexts ).toTabulateAs(`\
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
└─────────┴────────┘`)  // combined table of captions in parent and child panel


            // Toggle absolute values on
            myPanel.showAbsoluteValues(true).update()

            // Check the new captions of parent and child panel on DOM
            const captionTexts2 = getCaptionTextsOfCategoriesFromDom()
            expect( captionTexts2 ).toTabulateAs(`\
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
└─────────┴────────┘`)  // combined table of captions in parent and child panel


        // Toggle absolute values off
        myPanel.showAbsoluteValues(false).update()

        // Check the captions of parent and child panel on DOM
        captionTexts = getCaptionTextsOfCategoriesFromDom()
        expect( captionTexts ).toTabulateAs(`\
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
└─────────┴────────┘`)  // combined table of captions in parent and child panel




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



    //// ADD CHILD PANELS ///////////////////////////////////////////////////////////////
    
    describe ('Add Child Panels: Should add child panels correctly', () => {

        test('Add Child: Two children should exist', () => {

            initializeDomWithSvg()

            // Add panel #0
            myNestedPanel = new navigator.NestedPanel()
            // Add child panel #1
            spawnObjectForChild1 = myNestedPanel.objects('gender').objects('female')
            myChildPanel1 = new navigator.NestedPanel(myNestedPanel, spawnObjectForChild1)
            // Add child panel #2
            spawnObjectForChild2 = myChildPanel1.objects('gender').objects('male')
            myChildPanel2 = new navigator.NestedPanel(myChildPanel1, spawnObjectForChild2)


            // Check the number of panels on DOM
            const allPanelObjects = document.querySelectorAll( '.panel' )
            expect( (allPanelObjects) ).toHaveLength( 3 )

        })


        test ('Reset Vertical Inner Padding: Restore top and bottom inner padding', () => {

            initializeDomWithSvg()

            // Add panel #0
            myPanel = new navigator.Panel()

            // Change padding values
            myPanel
                .innerPaddingTop( myPanel.innerPaddingTop() + 50 )
                .innerPaddingBottom( myPanel.innerPaddingBottom() + 25 )

            // Confirm the change in relation to default values
            expect(  myPanel.innerPaddingTop() )
                .toBe( myPanel._defaults.innerPadding.top + 50 )
            expect(  myPanel.innerPaddingBottom() )
                .toBe( myPanel._defaults.innerPadding.bottom + 25 )


            // Reset padding values
            myPanel._resetVerticalInnerPadding()

            // Padding values should be reset to their defaults
            expect(  myPanel.innerPaddingTop() )
                .toBe( myPanel._defaults.innerPadding.top )
            expect(  myPanel.innerPaddingBottom() )
                .toBe( myPanel._defaults.innerPadding.bottom )

                

        })

        // ↓↓↓ IT WAS NOT POSSIBLE TO TEST ALIGNMENT BECAUSE OF ANIMATIONS.
        // ↓↓↓ All charts look aligned at the test time, even if they may not be on DOM
        // after the creation animations are finished.
        // test('Charts in all panels should be horizontally aligned', () => {
        // })

    })





    //// REMOVE ///////////////////////////////////////////////////////////////
    
    describe ('Remove: Remove child panels and panel zero', () => {

        test ('Remove children panels one by one', () => {

            initializeDomWithSvg()

            // Add panel #0
            panelZero = new navigator.NestedPanel()
            // Add child panel #1
            spawnObjectForChild1 = panelZero.objects('gender').objects('female')
            childPanel1 = new navigator.NestedPanel(panelZero, spawnObjectForChild1)
            // Add child panel #2
            spawnObjectForChild2 = childPanel1.objects('gender').objects('male')
            childPanel2 = new navigator.NestedPanel(childPanel1, spawnObjectForChild2)


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

        })



        test ('Remove panel zero', () => {

            initializeDomWithSvg()


            // Add panel #0
            const panelZero = new navigator.NestedPanel()
            // Add child panel #1
            const spawnObjectForChild1 = panelZero.objects('gender').objects('female')
            const childPanel1 = new navigator.NestedPanel(panelZero, spawnObjectForChild1)
            // Add child panel #2
            const spawnObjectForChild2 = childPanel1.objects('gender').objects('male')
            const childPanel2 = new navigator.NestedPanel(childPanel1, spawnObjectForChild2)


            // Get initial number of panels
            let allPanelElements = document.querySelectorAll( '.panel' )
            expect( allPanelElements ).toHaveLength( 3 )

            // Remove panel zero
            panelZero.remove()

            // Confirm removal on DOM
            allPanelElements = document.querySelectorAll( '.panel' )
            expect( allPanelElements ).toHaveLength( 0 )

        })

        
        
        
        
    })



//// COLOR ///////////////////////////////////////////////////////////////

describe ('Color: Manage color themes', () => {

    test ('Assign color themes to charts in panel', () => {

        initializeDomWithSvg()

        // Create panel
        const myPanel = new navigator.Panel()

        // View the charts in panel
        expect( myPanel.objects() ).toTabulateAs(`\
┌───────────────────┬──────────┬─────────┐
│ (iteration index) │   Key    │ Values  │
├───────────────────┼──────────┼─────────┤
│         0         │ 'gender' │ [Chart] │
│         1         │ 'class'  │ [Chart] │
│         2         │ 'status' │ [Chart] │
└───────────────────┴──────────┴─────────┘`)


        // View the rectangle colors in the 1st chart
        expect( myPanel.objects('gender').actualColors() ).toTabulateAs(`\
┌─────────┬──────────────────────┐
│ (index) │        Values        │
├─────────┼──────────────────────┤
│    0    │ 'rgb(106, 81, 164)'  │
│    1    │ 'rgb(158, 155, 201)' │
└─────────┴──────────────────────┘`)

        // myPanel.objects('class').colorScheme('Blues').update()


        // View the rectangle colors in the 2nd chart
        expect( myPanel.objects('class').actualColors() ).toTabulateAs(`\
┌─────────┬──────────────────────┐
│ (index) │        Values        │
├─────────┼──────────────────────┤
│    0    │ 'rgb(24, 100, 170)'  │
│    1    │ 'rgb(75, 151, 201)'  │
│    2    │ 'rgb(147, 195, 223)' │
└─────────┴──────────────────────┘`)

        // View the rectangle colors in the 3rd chart
        expect( myPanel.objects('class').actualColors() ).toTabulateAs(`\
┌─────────┬──────────────────────┐
│ (index) │        Values        │
├─────────┼──────────────────────┤
│    0    │ 'rgb(24, 100, 170)'  │
│    1    │ 'rgb(75, 151, 201)'  │
│    2    │ 'rgb(147, 195, 223)' │
└─────────┴──────────────────────┘`)

    })



    test ('Get and Set color theme', () => {


        // Clear JEST's DOM to prevent leftovers from previous tests
        document.body.innerHTML = ''
        // Create SVG
        const mySvg = new container.Svg()
        // Create parent panel
        const myPanel = new navigator.Panel(mySvg)  // no need to specify a spawn source if no parent is specified


        // Check initial colors

        expect(myPanel.objects('gender').actualColors()).toTabulateAs(`\
┌─────────┬──────────────────────┐
│ (index) │        Values        │
├─────────┼──────────────────────┤
│    0    │ 'rgb(106, 81, 164)'  │
│    1    │ 'rgb(158, 155, 201)' │
└─────────┴──────────────────────┘`)  // Gender: Purples

        expect(myPanel.objects('class').actualColors()).toTabulateAs(`\
┌─────────┬──────────────────────┐
│ (index) │        Values        │
├─────────┼──────────────────────┤
│    0    │ 'rgb(24, 100, 170)'  │
│    1    │ 'rgb(75, 151, 201)'  │
│    2    │ 'rgb(147, 195, 223)' │
└─────────┴──────────────────────┘`)  // Class: Blues

        expect(myPanel.objects('status').actualColors()).toTabulateAs(`\
┌─────────┬──────────────────────┐
│ (index) │        Values        │
├─────────┼──────────────────────┤
│    0    │  'rgb(34, 139, 69)'  │
│    1    │ 'rgb(115, 195, 120)' │
└─────────┴──────────────────────┘`)  // Status: Greens



        // Get the current color theme
        expect( myPanel.colorSet() ).toBe('Single-Hue')

        // Change color theme
        myPanel.colorSet('Greys').update()


        // Check the changed colors
        expect(myPanel.objects('gender').actualColors()).toTabulateAs(`\
┌─────────┬──────────────────────┐
│ (index) │        Values        │
├─────────┼──────────────────────┤
│    0    │  'rgb(80, 80, 80)'   │
│    1    │ 'rgb(151, 151, 151)' │
└─────────┴──────────────────────┘`)  // Gender: Grays

        expect(myPanel.objects('class').actualColors()).toTabulateAs(`\
┌─────────┬──────────────────────┐
│ (index) │        Values        │
├─────────┼──────────────────────┤
│    0    │  'rgb(64, 64, 64)'   │
│    1    │ 'rgb(122, 122, 122)' │
│    2    │ 'rgb(180, 180, 180)' │
└─────────┴──────────────────────┘`)  // Class: Blues

        expect(myPanel.objects('status').actualColors()).toTabulateAs(`\
┌─────────┬──────────────────────┐
│ (index) │        Values        │
├─────────┼──────────────────────┤
│    0    │  'rgb(80, 80, 80)'   │
│    1    │ 'rgb(151, 151, 151)' │
└─────────┴──────────────────────┘`)  // Status: Greens

    })


    test ('Auto-set color set in child panels based on parent', () => {

        // Clear JEST's DOM to prevent leftovers from previous tests
        document.body.innerHTML = ''
        // Create SVG
        const mySvg = new container.Svg()
        // Create parent panel
        const panelZero = new navigator.NestedPanel(mySvg)  // no need to specify a spawn source if no parent is specified
        panelZero.colorSet('Viridis').update()

        // Make a child panel
        const spawnObjectForChild1 = panelZero.objects('gender').objects('female')
        const childPanel1 = new navigator.NestedPanel(panelZero, spawnObjectForChild1)

        // Child should not have its own color scheme, but one based on parent
        let panelZeroColorSet = panelZero.colorSet()
        let childOneColorSet = childPanel1.colorSet()
        expect( childOneColorSet ).toEqual( panelZeroColorSet )



        // LIVE COLOR UPDATE //

        // Color of child should change if parent's color is updated
        panelZero.colorSet('Magma').update()

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

    })

})

test ('Depth index: Get and set', () => {

    initializeDomWithSvg()

    // Create panel
    const myPanel = new navigator.NestedPanel()



    //// GET DEPTH INDEX ////

    // GET default depth index value
    expect( myPanel.depthIndex() ).toBe( 0 )

    // Check things from DOM perspective
    let depthIndexOfPanel = document.querySelector('.panel').getAttribute('depthIndex')
    expect (depthIndexOfPanel ).toBe( '0' )



    //// SET DEPTH INDEX ////

    // Set a new depthIndex value
    myPanel.depthIndex(1).update()
    expect( myPanel.depthIndex() ).toBe( 1 )

    // Check things from DOM perspective
    depthIndexOfPanel = document.querySelector('.panel').getAttribute('depthIndex')
    expect (depthIndexOfPanel ).toBe( '1' )




})

test ('Depth Index: Check automatic incrementation upon adding new panels', () => {

    initializeDomWithSvg()

    // Create panel
    const parentPanel = new navigator.NestedPanel()
    parentPanel.id('parent-panel').update()



    //// AUTO DEPTH INDEX: NO CHILD PANELS ////

    // Check the depth index in a one-panel setup
    expect( parentPanel.depthIndex() ).toBe( 0 )

    // Check things from DOM perspective
    expect( document.querySelectorAll('.panel') ).toHaveLength(1)
    const depthIndexOfParentPanel = document.querySelector('#parent-panel').getAttribute('depthIndex')
    expect (depthIndexOfParentPanel ).toBe( '0' )



    //// AUTO DEPTH INDEX: ONE CHILD PANEL ////

    // Create a child panel
    let objectToSpawnFrom = parentPanel.objects('gender').objects('male')
    const childPanel = new navigator.NestedPanel(parentPanel, objectToSpawnFrom)  // spawn source must be specified if a parent panel is specified
    childPanel.id('child-panel').update()

    // Check the depth indexes
    expect( parentPanel.depthIndex() ).toBe( 0 )
    expect( childPanel.depthIndex() ).toBe( 1 )

    // Check things from DOM perspective
    expect( document.querySelectorAll('.panel') ).toHaveLength(2)
    const depthIndexOfChildPanel = document.querySelector('#child-panel').getAttribute('depthIndex')
    expect (depthIndexOfChildPanel ).toBe( '1' )



    //// AUTO DEPTH INDEX: TWO CHILD PANELS ////

    // Create a grandchild panel
    objectToSpawnFrom = childPanel.objects('status').objects('survived')
    const grandChildPanel = new navigator.NestedPanel(childPanel, objectToSpawnFrom)  // spawn source must be specified if a parent panel is specified
    grandChildPanel.id('grandchild-panel').update()

    // Check the depth indexes
    expect( parentPanel.depthIndex() ).toBe( 0 )
    expect( childPanel.depthIndex() ).toBe( 1 )
    expect( grandChildPanel.depthIndex() ).toBe( 2 )

    // Check things from DOM perspective
    expect( document.querySelectorAll('.panel') ).toHaveLength(3)
    const depthIndexOfGrandChildPanel = document.querySelector('#grandchild-panel').getAttribute('depthIndex')
    expect (depthIndexOfGrandChildPanel ).toBe( '2' )



    //// AUTO DEPTH INDEX: AFTER REMOVING AND RE-ADDING CHILD PANELS  ////

    // Remove child and grandchild panels
    childPanel.remove()
    grandChildPanel.remove()

    // The variables are not deleted, so its ok for these to still exist
    expect( parentPanel.depthIndex() ).toBe( 0 )
    expect( childPanel.depthIndex() ).toBe( 1 )
    expect( grandChildPanel.depthIndex() ).toBe( 2 )

    // But on DOM, there should NOT be any child or grandchild panels or their depthIndexes.
    expect( document.querySelectorAll('.panel') ).toHaveLength(1)

    // Add a child panel
    objectToSpawnFrom = parentPanel.objects('gender').objects('female')
    const childPanel2 = new navigator.NestedPanel(parentPanel, objectToSpawnFrom)  // spawn source must be specified if a parent panel is specified
    childPanel2.id('child-panel2').update()

    // Check depth indexes
    expect( parentPanel.depthIndex() ).toBe( 0 )
    expect( childPanel2.depthIndex() ).toBe( 1 )

    // Check things from DOM perspective
    expect( document.querySelectorAll('.panel') ).toHaveLength(2)
    const depthIndexOfChildPanel2 = document.querySelector('#child-panel2').getAttribute('depthIndex')
    expect (depthIndexOfChildPanel2 ).toBe( '1' )


})



//// QUICK SWITCH ANIMATION ///////////////////////////////////////////////////////////////

describe ('Animations: Switch to a panel on the same depth level using the quick switch animation', () => {
   
    initializeDomWithSvg()

    // Create panel
    const parentPanel = new navigator.NestedPanel()
    parentPanel.id('parent-panel').update()



    test('Extend animation: Add panel ', () => {

        // Create a child panel
        let objectToSpawnFrom = parentPanel.objects('gender').objects('male')
        const childPanel = new navigator.NestedPanel( parentPanel, objectToSpawnFrom )  // spawn source must be specified if a parent panel is specified
        childPanel.id('child-panel').update()

        // Count the number of panels on DOM after the animation
        const allPanels = document.querySelectorAll( '.panel' )
        const numberOfPanels = allPanels.length
        expect( (numberOfPanels) ).toBe( 2 )

    })



    test('Switch Animation: Add panel ', () => {

        initializeDomWithSvg()

        // Create panel
        const parentPanel = new navigator.NestedPanel()
        parentPanel.id('parent-panel').update()



        // Create a child panel
        let objectToSpawnFrom = parentPanel.objects('gender').objects('female')
        const childPanel = new navigator.NestedPanel( parentPanel, objectToSpawnFrom )  // spawn source must be specified if a parent panel is specified
        childPanel.id('child-panel').update()

        // Count the number of panels on DOM after the animation
        const allPanels = document.querySelectorAll( '.panel' )
        const numberOfPanels = allPanels.length
        expect( (numberOfPanels) ).toBe( 2 )

    })


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
//         const childPanel = new navigator.NestedPanel( parentPanel, objectToSpawnFrom )  // spawn source must be specified if a parent panel is specified
//         childPanel.id('child-panel').update()
//
//         // Create a sibling panel next to the existing child panel
//         objectToSpawnFrom = parentPanel.objects('gender').objects('male')
//         const siblingPanel = new navigator.NestedPanel( parentPanel, objectToSpawnFrom, 'sibling' )  // spawn source must be specified if a parent panel is specified
//         siblingPanel.id('sibling-panel').update()
//
//         // Count the number of panels on DOM after the animation
//         // const allPanels = document.querySelectorAll( '.panel' )
//         // const numberOfPanels = allPanels.length
//         // expect( (numberOfPanels) ).toBe( 2 )
//
//     })
//
})


//// PANEL IDs ///////////////////////////////////////////////////////////////

describe ('Panel IDs: Panel IDs must be generated correctly', () => {
   
    
    test ('Init: First panel id', () => {

        initializeDomWithSvg()

        const myPanel = new navigator.NestedPanel()
            .bgFill('#deebf7')
            .x(200)
            .y(25)
            // .yAxisLabels(true)
            .update(0)


        expect( myPanel.id() ).toBe( 'panel-0-0' )

    })


    test ('Depth 1 Siblings: Check ids of panels that spawned directly from panel 0', () => {

        initializeDomWithSvg()

        // Create panel 0
        const parentPanel = new navigator.NestedPanel()
            .bgFill('#deebf7')
            .x(200).y(25)
            .yAxisLabels(true)
            .update(0)


        // SIBLING #1.1 //
        // Create sibling panel
        const spawnObjectForSiblingPanel1 = parentPanel.objects('gender').objects('female')

        const siblingPanel1 = new navigator.NestedPanel(parentPanel, spawnObjectForSiblingPanel1)
        siblingPanel1.update()

        // Check the newly created sibling panel's ID
        expect( siblingPanel1.id() ).toBe( 'panel-1-0' )


        // SIBLING #1.2 //
        // Create sibling panel
        const spawnObjectForSiblingPanel2 = parentPanel.objects('gender').objects('male')

        const siblingPanel2 = new navigator.NestedPanel(parentPanel, spawnObjectForSiblingPanel2, 'sibling')
        siblingPanel2.update()

        // Check the newly created sibling panel's ID
        expect( siblingPanel2.id() ).toBe( 'panel-1-1' )


        // SIBLING #1.3 //
        // Create sibling panel
        const spawnObjectForSiblingPanel3 = parentPanel.objects('status').objects('died')

        const siblingPanel3 = new navigator.NestedPanel(parentPanel, spawnObjectForSiblingPanel3, 'sibling')
        siblingPanel3.update()

        // Check the newly created sibling panel's ID
        expect( siblingPanel3.id() ).toBe( 'panel-1-2' )


    })


    test ('Depth 2 Siblings: Check ids of panels that spawned from panel 1 (i.e., siblings spawned from a child of panel 0)', () => {

        initializeDomWithSvg()

        // Create panel 0
        const parentPanel = new navigator.NestedPanel()
            .bgFill('#deebf7')
            .x(200).y(25)
            .yAxisLabels(true)
            .update(0)


        // Create panel 1
        // Create child panel
        const spawnObjectForChildPanel = parentPanel.objects('gender').objects('female')

        const childPanel = new navigator.NestedPanel(parentPanel, spawnObjectForChildPanel)
        childPanel.update()

        // Check the newly created child panel's ID
        expect( childPanel.id() ).toBe( 'panel-1-0' )


        // SIBLING #2.1 //
        // Create sibling panel
        const spawnObjectForSiblingPanel1 = childPanel.objects('gender').objects('female')

        const siblingPanel1 = new navigator.NestedPanel(childPanel, spawnObjectForSiblingPanel1)
        siblingPanel1.update()

        // Check the newly created sibling panel's ID
        expect( siblingPanel1.id() ).toBe( 'panel-2-0' )


        // SIBLING #2.2 //
        // Create sibling panel
        const spawnObjectForSiblingPanel2 = childPanel.objects('gender').objects('male')

        const siblingPanel2 = new navigator.NestedPanel(childPanel, spawnObjectForSiblingPanel2, 'sibling')
        siblingPanel2.update()

        // Check the newly created sibling panel's ID
        expect( siblingPanel2.id() ).toBe( 'panel-2-1' )


        // SIBLING #2.3 //
        // Create sibling panel
        const spawnObjectForSiblingPanel3 = childPanel.objects('status').objects('died')

        const siblingPanel3 = new navigator.NestedPanel(childPanel, spawnObjectForSiblingPanel3, 'sibling')
        siblingPanel3.update()

        // Check the newly created sibling panel's ID
        expect( siblingPanel3.id() ).toBe( 'panel-2-2' )


    })


    test ('Replace Singleton Panel: A panels that replaces another panel should have the right IDs', () => {

        initializeDomWithSvg()

        jest.useFakeTimers()


        // PANEL #0.0 //
        const panel0_0 = new navigator.NestedPanel()
            .bgFill('#deebf7')
            .x(200).y(25)
            .yAxisLabels(true)
            .update(0)



        // PANEL #1.0 //
        // Create child panel
        let panel1_0
        setTimeout( () => {

            const spawnObjectForPanel1_0 = panel0_0.objects('gender').objects('female')
    
            panel1_0 = new navigator.NestedPanel(panel0_0, spawnObjectForPanel1_0)
            panel1_0.update()
            
        }, 1000)

        jest.runOnlyPendingTimers()


        // Check the newly created child panel's ID
        expect( panel1_0.id() ).toBe( 'panel-1-0' )



        // REPLACEMENT PANEL #1.0  //
        // Replace existing panel at level 1

        let replacementPanel1_0
        setTimeout( () => {
            const spawnObjectForSecondPanel1_0 = panel0_0.objects('gender').objects('male')

            replacementPanel1_0 = new navigator.NestedPanel(panel0_0, spawnObjectForSecondPanel1_0)
            replacementPanel1_0.update()

        }, 2000 )

        jest.runOnlyPendingTimers()

        // Check the newly created replacement panel's ID
        expect( replacementPanel1_0.id() ).toBe( 'panel-1-0' )


    })


    test ('Replace Comparison Panel: A panel that replaces two sibling panels should have the right ID', () => {

        initializeDomWithSvg()

        jest.useFakeTimers()


        // PANEL #0.0 //
        const panel0_0 = new navigator.NestedPanel()
            .bgFill('#deebf7')
            .x(200).y(25)
            .yAxisLabels(true)
            .update(0)



        // PANEL #1.0 //
        // Create child panel
        let panel1_0
        setTimeout( () => {

            const spawnObjectForPanel1_0 = panel0_0.objects('gender').objects('female')

            panel1_0 = new navigator.NestedPanel(panel0_0, spawnObjectForPanel1_0)
            panel1_0.update()

        }, 1000)

        jest.runOnlyPendingTimers()


        // Check the newly created child panel's ID
        expect( panel1_0.id() ).toBe( 'panel-1-0' )



        // PANEL #1.1 //
        // Create sibling panel
        let panel1_1
        setTimeout( () => {

            const spawnObjectForSiblingPanel1_1 = panel0_0.objects('gender').objects('male')

            panel1_1 = new navigator.NestedPanel(panel0_0, spawnObjectForSiblingPanel1_1, 'sibling')
            panel1_1.update()

        }, 2000)

        jest.runOnlyPendingTimers()


        // Check the newly created sibling panel's ID
        expect( panel1_1.id() ).toBe( 'panel-1-1' )




        // REPLACEMENT PANEL #1.0  //
        // Replace comparison panels

        let replacementPanel1_0
        setTimeout( () => {
            const spawnObjectForSecondPanel1_0 = panel0_0.objects('gender').objects('male')

            replacementPanel1_0 = new navigator.NestedPanel(panel0_0, spawnObjectForSecondPanel1_0)
            replacementPanel1_0.update()

        }, 2000 )

        jest.runOnlyPendingTimers()

        // Check the newly created replacement panel's ID
        expect( replacementPanel1_0.id() ).toBe( 'panel-1-0' )


    })


    test ('Refresh: The name of a panel should NOT change if the panel is recreated in-place.', () => {
    // Explanation: Clicking on a panel's spawn root refreshes that panel.
    // During this refresh operation, the panel is recreated.
    // During the old panel should not be detected as an already existing panel (at least for the purpose of incrementing panel names).

        initializeDomWithSvg()

        // Create panel 0
        const parentPanel = new navigator.NestedPanel()
            .bgFill('#deebf7')
            .x(200).y(25)
            .yAxisLabels(true)
            .update(0)


        // Create panel 1
        // Create a child panel
        const spawnObjectForChildPanel = parentPanel.objects('gender').objects('female')

        const childPanel = new navigator.NestedPanel(parentPanel, spawnObjectForChildPanel)
        childPanel.update()

        // Check the newly created child panel's ID
        expect( childPanel.id() ).toBe( 'panel-1-0' )



        // Re-Create (refresh) panel 1

        const childPanel2 = new navigator.NestedPanel(parentPanel, spawnObjectForChildPanel)
        childPanel2.update()

        // Check the newly created child panel's ID
        expect( childPanel2.id() ).toBe( 'panel-1-0' )


    })

})



//// Ancesty Inferences ///////////////////////////////////////////////////////////////

describe ('Ancestry Inferences: Parent child relationships should be inferred correctly', () => {

    test ('Panel-0: A single-standing panel-0 should have correct relationships inferred', () => {

        initializeDomWithSvg()

        jest.useFakeTimers()

        // Create panel 0
        const panel0 = new navigator.NestedPanel()
            .bgFill('#deebf7')
            .x(200).y(25)
            .yAxisLabels(true)
            .update(0)
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

        expect( panel0.has.parentWithRightmostChildPanelObject ).toBe(null)

        expect( panel0._leftSiblingObject ).toBe( null)

        expect( panel0.has.siblingObjectsOnRightSide ).toBe( null )


        // Create panel 1
        // Create child panel
        spawnObjectForChildPanel = panel0.objects('gender').objects('female')
        childPanel = new navigator.NestedPanel(panel0, spawnObjectForChildPanel)
        childPanel.updateAllPanels()
        jest.runOnlyPendingTimers()


        // Check the newly created child panel's ID
        expect( childPanel.id() ).toBe( 'panel-1-0' )

    })


    test ('Panel-1-0: A single child panel should have correct relationships inferred', () => {

        initializeDomWithSvg()

        jest.useFakeTimers()


        // Create panel 0
        const panel0 = new navigator.NestedPanel()
            .bgFill('#deebf7')
            .x(200).y(25)
            .yAxisLabels(true)
            .update(0)
        jest.runOnlyPendingTimers()


        // Create panel-1
        let spawnObjectForPanel1 = panel0.objects('gender').objects('female')
        const panel1 = new navigator.NestedPanel(panel0, spawnObjectForPanel1)
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

        expect( panel1.has.parentWithRightmostChildPanelObject.hasType() ).toBe('NestedPanel')
        expect( panel1.has.parentWithRightmostChildPanelObject.id() ).toBe('panel-1-0')

        expect( panel1._leftSiblingObject ).toBe( null)

        expect( panel1.has.siblingObjectsOnRightSide ).toBe( null )
    })


    test ('Panel-2-0: A single grandchild panel should have correct relationships inferred', () => {

        initializeDomWithSvg()

        jest.useFakeTimers()


        // Create panel 0
        const panel0 = new navigator.NestedPanel()
            .bgFill('#deebf7')
            .x(200).y(25)
            .yAxisLabels(true)
            .update(0)
        jest.runOnlyPendingTimers()


        // Create panel-1
        const spawnObjectForPanel1 = panel0.objects('gender').objects('female')
        const panel1 = new navigator.NestedPanel(panel0, spawnObjectForPanel1)
        panel1.updateAllPanels()
        jest.runOnlyPendingTimers()


        // Create panel-2
        const spawnObjectForPanel2 = panel0.objects('gender').objects('female')
        const panel2 = new navigator.NestedPanel(panel1, spawnObjectForPanel2)
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
        expect( panel2.has.parentWithRightmostChildPanelObject.id() ).toBe( 'panel-2-0' )

        expect( panel2._leftSiblingObject ).toBe( null )

        expect( panel2.has.siblingObjectsOnRightSide ).toBe( null )


    })

    test ('Panel-1-1: A child panel with sibling should have correct relationships', () => {

        initializeDomWithSvg()

        jest.useFakeTimers()


        // Create panel 0
        const panel0 = new navigator.NestedPanel()
            .bgFill('#deebf7')
            .x(200).y(25)
            .yAxisLabels(true)
            .update(0)
        jest.runOnlyPendingTimers()


        // Create panel-1-0 (first sibling)
        const spawnObjectForPanel1_0 = panel0.objects('gender').objects('female')
        const panel1_0 = new navigator.NestedPanel(panel0, spawnObjectForPanel1_0)
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
        expect( panel1_0.has.parentWithRightmostChildPanelObject.id() ).toBe( 'panel-1-0' )

        expect( panel1_0._leftSiblingObject ).toBe( null )

        expect( panel1_0.has.siblingObjectsOnRightSide ).toBe( null)


        // Create panel-1-1 (second sibling)
        const spawnObjectForPanel1_1 = panel0.objects('gender').objects('male')
        const panel1_1 = new navigator.NestedPanel(panel0, spawnObjectForPanel1_1, 'sibling')
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
        expect( panel1_0.has.parentWithRightmostChildPanelObject.id() ).toBe( 'panel-1-1' )


        const rightwardSiblingsOfPanel1_0 = panel1_0.has.siblingObjectsOnRightSide.keys()
        const rightwardSiblingsOfPanel1_0_printable = String( Array.from( rightwardSiblingsOfPanel1_0 ) )
        expect( rightwardSiblingsOfPanel1_0_printable ).toBe( "panel-1-1" )


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
        expect( panel1_1.has.parentWithRightmostChildPanelObject.id() ).toBe( 'panel-1-1' )

        expect( panel1_1._leftSiblingObject.hasType() ).toBe( 'NestedPanel' )
        expect( panel1_1._leftSiblingObject.id() ).toBe( 'panel-1-0' )

        expect( panel1_1.has.siblingObjectsOnRightSide ).toBe( null )

    })


    test ('Panel-2-2: A grandchild panel with two siblings should have correct relationships inferred', () => {

        initializeDomWithSvg()

        jest.useFakeTimers()

        // Create panel 0
        const panel0 = new navigator.NestedPanel()
            .bgFill('#deebf7')
            .x(200).y(25)
            .yAxisLabels(true)
            .update(0)
        jest.runOnlyPendingTimers()


        // Create panel-1-0
        const spawnObjectForPanel1_0 = panel0.objects('gender').objects('female')
        const panel1_0 = new navigator.NestedPanel(panel0, spawnObjectForPanel1_0)
        panel1_0.update()
        jest.runOnlyPendingTimers()


        // ADD PANEL 2-0 //

        // Create panel-2-0 (first child of parent)
        let panel2_0  // declaration must be outside the setTimer function
        setTimeout( () => {
            const spawnObjectForPanel2_0 = panel1_0.objects('class').objects('first-class')
            panel2_0 = new navigator.NestedPanel(panel1_0, spawnObjectForPanel2_0)
            panel2_0.update()
        }, 1000)
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
        expect( panel2_0.has.parentWithRightmostChildPanelObject.id() ).toBe( 'panel-2-0' )

        expect( panel2_0._leftSiblingObject ).toBe( null )

        expect( panel2_0.has.siblingObjectsOnRightSide ).toBe( null )


        // ADD PANEL 2-1 //

        // Create panel-2-1 (first sibling)
        let panel2_1
        setTimeout( () => {
            const spawnObjectForPanel2_1 = panel1_0.objects('class').objects('second-class')
            panel2_1 = new navigator.NestedPanel(panel1_0, spawnObjectForPanel2_1, 'sibling')
            panel2_1.update()

        }, 2000)
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
        expect( panel2_1.has.parentWithRightmostChildPanelObject.id() ).toBe( 'panel-2-1' )

        expect( panel2_1._leftSiblingObject.hasType() ).toBe( 'NestedPanel' )
        expect( panel2_1._leftSiblingObject.id() ).toBe( 'panel-2-0' )

        expect( panel2_1.has.siblingObjectsOnRightSide ).toBe( null )

        // ADD PANEL 2-2 //

        // Create panel-2-2 (second sibling)
        let panel2_2
        setTimeout( () => {
            const spawnObjectForPanel2_2 = panel1_0.objects('class').objects('third-class')
            panel2_2 = new navigator.NestedPanel(panel1_0, spawnObjectForPanel2_2, 'sibling')
            panel2_2.update()
        }, 3000)
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
        expect( panel2_2.has.parentWithRightmostChildPanelObject.id() ).toBe( 'panel-2-2' )

        expect( panel2_2._leftSiblingObject.hasType() ).toBe( 'NestedPanel' )
        expect( panel2_2._leftSiblingObject.id() ).toBe( 'panel-2-1' )

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

        expect( panel2_0._leftSiblingObject ).toBe( null )

        const rightwardSiblingsOfPanel2_0 = panel2_0.has.siblingObjectsOnRightSide.keys()
        const rightwardSiblingsOfPanel2_0_printable = String( Array.from( rightwardSiblingsOfPanel2_0 ) )
        expect( rightwardSiblingsOfPanel2_0_printable ).toBe( "panel-2-1,panel-2-2" )

        expect( panel2_0.has.parentWithRightmostChildPanelObject.hasType() ).toBe( 'NestedPanel' )
        expect( panel2_0.has.parentWithRightmostChildPanelObject.id() ).toBe( 'panel-2-2' )


    })




    test ('A deep child panel whose parent has siblings should have correct relationships', () => {

        initializeDomWithSvg()

        jest.useFakeTimers()

        // Create panel 0
        const panel0 = new navigator.NestedPanel()
            .bgFill('#deebf7')
            .x(200).y(25)
            .yAxisLabels(true)
            .update(0)
        jest.runOnlyPendingTimers()


        // Create panel-1-0 (first sibling)
        let panel1_0
        setTimeout( () => {
            const spawnObjectForPanel1_0 = panel0.objects('gender').objects('female')
            panel1_0 = new navigator.NestedPanel(panel0, spawnObjectForPanel1_0)
        }, 1000)
        jest.runOnlyPendingTimers()



        // Create panel-1-1 (second sibling)
        let panel1_1
        setTimeout( () => {
            const spawnObjectForPanel1_1 = panel0.objects('gender').objects('male')
            panel1_1 = new navigator.NestedPanel(panel0, spawnObjectForPanel1_1, 'sibling')
        }, 2000)
        jest.runOnlyPendingTimers()


        let panel1_2
        setTimeout( () => {
            // Create panel-1-2 (third sibling)
            const spawnObjectForPanel1_2 = panel0.objects('class').objects('first-class')
            panel1_2 = new navigator.NestedPanel(panel0, spawnObjectForPanel1_2, 'sibling')
            // panel1_2.updateAll()
        }, 4000)
        jest.runOnlyPendingTimers()


        // Create panel-2-0 of 1_0 (child of first sibling)
        let panel2_0_of_1_0
        setTimeout( () => {
            let spawnObjectForPanel2_0_of_1_0 = panel1_0.objects('gender').objects('male')
            panel2_0_of_1_0 = new navigator.NestedPanel(panel1_0, spawnObjectForPanel2_0_of_1_0)
        }, 3000)
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
        expect( panel2_0_of_1_0.has.parentWithRightmostChildPanelObject.id() ).toBe( 'panel-2-0' )

        expect( panel2_0_of_1_0._leftSiblingObject ).toBe( null )
        expect( panel2_0_of_1_0.has.siblingObjectsOnRightSide ).toBe( null )


        // Check siblings on the right side of parent panel (special case needed for `NestedPanel._pushAnySiblingsOfParentRightward` method)
        const allSiblingsOfParent = panel2_0_of_1_0.parentPanel.parentPanel.childrenPanels.keys()
        const allSiblingsOfParent_printable = String( Array.from( allSiblingsOfParent ) )
        expect ( allSiblingsOfParent_printable ).toBe( "panel-1-0,panel-1-1,panel-1-2" )

        const rightwardSiblingsOfTheParentPanelOfPanel2_0_of_1_0 = panel2_0_of_1_0.parentPanel.has.siblingObjectsOnRightSide.keys()
        const rightwardSiblingsOfTheParentPanelOfPanel2_0_of_1_0_printable = String( Array.from( rightwardSiblingsOfTheParentPanelOfPanel2_0_of_1_0 ) )
        expect ( rightwardSiblingsOfTheParentPanelOfPanel2_0_of_1_0_printable ).toBe( "panel-1-1,panel-1-2" )

    })

    test('Get top ancestor (panel 0) via calling a method from deeper panels', () => {

        initializeDomWithSvg()

        // Add panel #0
        const panel0 = new navigator.NestedPanel()
        panel0.id('panel-zero').update()
        // Add child panel #1
        const spawnObjectForChild1 = panel0.objects('gender').objects('female')
        const childPanel1 = new navigator.NestedPanel(panel0, spawnObjectForChild1)
        childPanel1.id('child-panel-1').update()
        // Add child panel #2
        const spawnObjectForChild2 = childPanel1.objects('gender').objects('male')
        const childPanel2 = new navigator.NestedPanel(childPanel1, spawnObjectForChild2)
        childPanel2.id('child-panel-2').update()


        // Get panel zero
        const panel0SelectedFromChildPanel1 = childPanel1.topmostAncestor()
        const panel0SelectedFromChildPanel2 = childPanel2.topmostAncestor()

        expect( panel0SelectedFromChildPanel1.id() ).toBe( 'panel-zero' )
        expect( panel0SelectedFromChildPanel2.id() ).toBe( 'panel-zero' )
    })


})



//// ANIMATION TIMES ///////////////////////////////////////////////////////////////

describe ('animationDuration', () => {

    test ('Init: Animation times must be correctly set on initialization', ()  => {

        initializeDomWithSvg()

        jest.useFakeTimers()

        // Create panel 0
        const panel0 = new navigator.NestedPanel()
            .bgFill('#deebf7')
            .x(200).y(25)
            .yAxisLabels(true)
            .update(0)
        jest.runOnlyPendingTimers()


        // Check initially calculated animation durations
        expect( panel0._animation.duration ).toTabulateAs(`\
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
└──────────────────────┴────────┘`)

    })




    test ('Get/Set: Animation times must be correctly get/set ', ()  => {

        initializeDomWithSvg()

        jest.useFakeTimers()

        // Create panel 0
        const panel0 = new navigator.NestedPanel()
            .bgFill('#deebf7')
            .x(200).y(25)
            .yAxisLabels(true)
            .update(0)
        jest.runOnlyPendingTimers()



        // Modify total animation duration and recalculate individual durations
        panel0._animation.duration.total = 299  // to test rounding
        panel0._inferAnimationDurations()

        expect( panel0._animation.duration ).toTabulateAs(`\
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
└──────────────────────┴────────┘`)

        // Use `_adjustAll` after modifying, instead of `_adjustAnimationDurations`
        panel0._animation.duration.total = 1000  // to test rounding
        panel0._adjustAllPanels()

        expect( panel0._animation.duration ).toTabulateAs(`\
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
└──────────────────────┴────────┘`)

    })


    test ('Propagate: When an animation duration is set, it should be propagated to all children and parents', () => {

        initializeDomWithSvg()

        jest.useFakeTimers()

        // Create panel 0
        const panel0 = new navigator.NestedPanel()
            .bgFill('#deebf7')
            .x(200).y(25)
            .yAxisLabels(true)
            .update(0)
        jest.runOnlyPendingTimers()

        // Create panel-1-0 (child)
        const spawnObjectForPanel1_0 = panel0.objects('gender').objects('female')
        const panel1_0 = new navigator.NestedPanel(panel0, spawnObjectForPanel1_0)
        panel1_0.update()
        jest.runOnlyPendingTimers()


        // Create panel-2-0 (grandchild)
        let panel2_0  // declaration must be outside the setTimer function
        setTimeout( () => {
            const spawnObjectForPanel2_0 = panel1_0.objects('class').objects('first-class')
            panel2_0 = new navigator.NestedPanel(panel1_0, spawnObjectForPanel2_0)
            panel2_0.update()
        }, 1000)
        jest.runOnlyPendingTimers()

        // Create panel-2-1 (sibling of grandchild)
        let panel2_1
        setTimeout( () => {
            const spawnObjectForPanel2_1 = panel1_0.objects('class').objects('second-class')
            panel2_1 = new navigator.NestedPanel(panel1_0, spawnObjectForPanel2_1, 'sibling')
            panel2_1.update()

        }, 2000)
        jest.runOnlyPendingTimers()




        // Set animation duration for panel-1-0 (child)
        expect ( panel1_0.animationDuration() ).not.toBe( 1000 )
        panel1_0.animationDuration(1000 )
        panel1_0.update()

        expect( panel1_0._animation.duration ).toTabulateAs(`\
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
└──────────────────────┴────────┘`)

        expect( panel0._animation.duration ).toTabulateAs(`\
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
└──────────────────────┴────────┘`)

        expect( panel2_0._animation.duration ).toTabulateAs(`\
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
└──────────────────────┴────────┘`)

        expect( panel2_1._animation.duration ).toTabulateAs(`\
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
└──────────────────────┴────────┘`)





    })
    
    
    
})


//// Stroke Properties ///////////////////////////////////////////////////////////////


describe ('Stroke', () => {

        test ('Get/set stroke width and color', () => {

            const panel0 = initializeDomWith.panelZero()

            // GET //

            expect( panel0.strokeWidth() ).toBe( '0.5px' )
            expect( panel0.strokeColor() ).toBe( 'rgba(255, 255, 255, 1.0)' )

            const {strokeWidths:defaultStrokeWidths, strokeColors:defaultStrokeColors} = getStrokeWidthsAndColors(panel0)

            expect( defaultStrokeWidths ).toTabulateAs(`\
┌───────────────────┬──────────┬─────────────┐
│ (iteration index) │   Key    │   Values    │
├───────────────────┼──────────┼─────────────┤
│         0         │ 'gender' │ [ '0.5px' ] │
│         1         │ 'class'  │ [ '0.5px' ] │
│         2         │ 'status' │ [ '0.5px' ] │
└───────────────────┴──────────┴─────────────┘`)

            expect( defaultStrokeColors ).toTabulateAs(`\
┌───────────────────┬──────────┬────────────────────────────────┐
│ (iteration index) │   Key    │             Values             │
├───────────────────┼──────────┼────────────────────────────────┤
│         0         │ 'gender' │ [ 'rgba(255, 255, 255, 1.0)' ] │
│         1         │ 'class'  │ [ 'rgba(255, 255, 255, 1.0)' ] │
│         2         │ 'status' │ [ 'rgba(255, 255, 255, 1.0)' ] │
└───────────────────┴──────────┴────────────────────────────────┘`)



            // SET //

            panel0.strokeWidth('4px')
            panel0.strokeColor('black')
            expect( panel0.strokeWidth() ).toBe( '4px' )
            expect( panel0.strokeColor() ).toBe( 'black' )


            panel0.update()

            // Check if changes are passed on to charts in panel
            const {strokeWidths:newStrokeWidths, strokeColors:newStrokeColors} = getStrokeWidthsAndColors(panel0)

            expect( newStrokeWidths ).toTabulateAs(`\
┌───────────────────┬──────────┬───────────┐
│ (iteration index) │   Key    │  Values   │
├───────────────────┼──────────┼───────────┤
│         0         │ 'gender' │ [ '4px' ] │
│         1         │ 'class'  │ [ '4px' ] │
│         2         │ 'status' │ [ '4px' ] │
└───────────────────┴──────────┴───────────┘`)
            
            expect( newStrokeColors ).toTabulateAs(`\
┌───────────────────┬──────────┬─────────────┐
│ (iteration index) │   Key    │   Values    │
├───────────────────┼──────────┼─────────────┤
│         0         │ 'gender' │ [ 'black' ] │
│         1         │ 'class'  │ [ 'black' ] │
│         2         │ 'status' │ [ 'black' ] │
└───────────────────┴──────────┴─────────────┘`)

        })

    
        test ('Child panels should inherit parent\'s stroke width and color', () => {
        
            const panel0_0 = initializeDomWith.panelZero()

            // Check default values
            expect( panel0_0.strokeWidth() ).toBe( '0.5px' )
            expect( panel0_0.strokeColor() ).toBe( 'rgba(255, 255, 255, 1.0)' )


            // Change values
            panel0_0.strokeWidth( '4px' )
            panel0_0.strokeColor( 'red' )

            // Verify the change
            expect( panel0_0.strokeWidth() ).toBe( '4px' )
            expect( panel0_0.strokeColor() ).toBe( 'red' )


            // Add child panel
            const spawnObjectForChild1 = panel0_0.objects('gender').objects('female')
            const panel1_0 = new navigator.NestedPanel(panel0_0, spawnObjectForChild1)

            // Confirm that child's values are the same with parent
            expect( panel1_0.strokeWidth() ).toBe( '4px' )
            expect( panel1_0.strokeColor() ).toBe( 'red' )


        })


        test ('Backgrounds: Panel backgrounds should have the right stroke width and color', () => {

            const {panelZero, childPanel, grandChildPanel} = initializeDomWith.panelZero.and.childAndGrandchild()
            const panels = [panelZero, childPanel, grandChildPanel]

            // Check initial values
            const {bgStrokeWidths:defaultBgRectStrokeWidths, bgStokeColors:defaultBgRectStrokeColors} = getPropertiesOfBgObjects(panels)
            expect( defaultBgRectStrokeWidths ).toEqual( ["0.5px", "0.5px", "0.5px"] )
            expect( defaultBgRectStrokeColors ).toEqual( ["rgba(255, 255, 255, 1.0)", "rgba(255, 255, 255, 1.0)", "rgba(255, 255, 255, 1.0)"] )


            // Change values
            panelZero
                .strokeWidth('4px')
                .strokeColor('red')
                .update(0)

            // Confirm changes
            const {bgStrokeWidths:newBgStrokeWidths, bgStokeColors:newBgStrokeColors} = getPropertiesOfBgObjects(panels)

            expect( newBgStrokeWidths ).toEqual( ["4px", "4px", "4px"] )
            expect( newBgStrokeColors ).toEqual( ["red", "red", "red"] )



        })


        function getPropertiesOfBgObjects(arrayOfPanelObjects) {

            const bgStrokeWidths = []
            const bgStokeColors = []
            arrayOfPanelObjects.forEach( (panelObject) => {

                const backgroundStokeWidth = panelObject._backgroundObject.strokeWidth()
                const backgroundStokeColor = panelObject._backgroundObject.strokeColor()

                bgStrokeWidths.push(backgroundStokeWidth)
                bgStokeColors.push(backgroundStokeColor)

            })
            return {bgStrokeWidths, bgStokeColors}
        }



})


function getStrokeWidthsAndColors(panel0) {

    const strokeWidths = new Map()
    const strokeColors = new Map()

    panel0.objects().forEach((chartObject, chartName) => {

        strokeWidths.set(chartName, [])
            .get(chartName)
            .push(chartObject.strokeWidth())

        strokeColors.set(chartName, [])
            .get(chartName)
            .push(chartObject.strokeColor())
    })
    return {strokeWidths, strokeColors}
}




let initializeDomWith = {

    panelZero: function() {

        jest.useFakeTimers()

        initializeDomWithSvg()


        // Create panel 0
        const panelZero = new navigator.NestedPanel()
            .bgFill('#deebf7')
            .x(200).y(25)
            .yAxisLabels(true)
            .bgText('panelZero')
            .update(0)

        jest.runAllTimers()

        return panelZero
    }

}


initializeDomWith.panelZero.and = {

    child : function(){

        jest.useFakeTimers()

        const panelZero = initializeDomWith.panelZero()

        // Create child panel
        const spawnObjectForChildPanel = panelZero.objects('gender').objects('female')
        const childPanel = new navigator.NestedPanel(panelZero, spawnObjectForChildPanel)
        childPanel
            .bgText('childPanel')
            .update(0)

        jest.runOnlyPendingTimers()

        return {panelZero, childPanel}

    },


    childAndGrandchild: function() {

        jest.useFakeTimers()

        const {panelZero, childPanel} = initializeDomWith.panelZero.and.child()

        jest.runOnlyPendingTimers()


        // Create grandchild panel
        let grandChildPanel  // declaration must be outside the setTimer function
        setTimeout(() => {
            const spawnObjectForGrandChildPanel = childPanel.objects('class').objects('first-class')
            grandChildPanel = new navigator.NestedPanel(childPanel, spawnObjectForGrandChildPanel)
            grandChildPanel
                .bgText('grandChildPanel')
                .update(0)

        }, 1000)
        jest.runOnlyPendingTimers()

        jest.runAllTimers()

        return {panelZero, childPanel, grandChildPanel}

    },


    threeSiblingChildren: function(){

        jest.useFakeTimers()

        const panelZero = initializeDomWith.panelZero()

        // Create the first sibling
        let siblingPanel1
        setTimeout( () => {
            const spawnObjectForSiblingPanel1 = panelZero.objects('class').objects('first-class')
            siblingPanel1 = new navigator.NestedPanel(panelZero, spawnObjectForSiblingPanel1)
            siblingPanel1
                .bgText('siblingPanel1')
                .update(0)

        }, 1000)
        jest.runOnlyPendingTimers()


        // Create the second sibling
        let siblingPanel2
        setTimeout( () => {
            const spawnObjectForSiblingPanel2 = panelZero.objects('class').objects('second-class')
            siblingPanel2 = new navigator.NestedPanel(panelZero, spawnObjectForSiblingPanel2, 'sibling')
            siblingPanel2
                .bgText('siblingPanel2')
                .update(0)
        }, 2000)
        jest.runOnlyPendingTimers()


        // Create the third sibling
        let siblingPanel3
        setTimeout( () => {
            const spawnObjectForSiblingPanel3 = panelZero.objects('class').objects('third-class')
            siblingPanel3 = new navigator.NestedPanel(panelZero, spawnObjectForSiblingPanel3, 'sibling')
            siblingPanel3
                .bgText('siblingPanel3')
                .update(0)
        }, 3000)
        jest.runOnlyPendingTimers()


        jest.runAllTimers()

        return {panelZero, siblingPanel1, siblingPanel2, siblingPanel3}
    },


    twoSiblingChilrenThatEachHasOneChild: function(){

        jest.useFakeTimers()

        const {panelZero, siblingPanel1, siblingPanel2, siblingPanel3} = initializeDomWith.panelZero.and.threeSiblingChildren()


        // Create the child of first sibling
        let childPanelOfSibling1
        setTimeout( () => {
            let spawnObjectForChildPanelOfSibling1 = siblingPanel1.objects('gender').objects('male')
            childPanelOfSibling1 = new navigator.NestedPanel(siblingPanel1, spawnObjectForChildPanelOfSibling1)
            childPanelOfSibling1
                .bgText('childPanelOfSibling1')
                .update(0)
        }, 4000)
        jest.runOnlyPendingTimers()


        // Create the child of second sibling)
        let childPanelOfSibling2
        setTimeout( () => {
            let spawnObjectForChildPanelOfSibling2 = siblingPanel2.objects('gender').objects('male')
            childPanelOfSibling2 = new navigator.NestedPanel(siblingPanel2, spawnObjectForChildPanelOfSibling2)
            childPanelOfSibling2
                .bgText('childPanelOfSibling2')
                .update(0)
        }, 5000)
        jest.runOnlyPendingTimers()


        // Create the child of third sibling)
        let childPanelOfSibling3
        setTimeout( () => {
            let spawnObjectForChildPanelOfSibling3 = siblingPanel3.objects('gender').objects('male')
            childPanelOfSibling3 = new navigator.NestedPanel(siblingPanel3, spawnObjectForChildPanelOfSibling3)
            childPanelOfSibling3
                .bgText('childPanelOfSibling3')
                .update(0)
        }, 6000)
        jest.runOnlyPendingTimers()


        jest.runAllTimers()

        return  {panelZero, siblingPanel1, siblingPanel2, siblingPanel3, childPanelOfSibling1, childPanelOfSibling2, childPanelOfSibling3}

    }

}



//// initializeDomWith... ///////////////////////////////////////////////////////////////

describe ('initializeDomWith...', () => {


    test ('initializeDomWith.panelZero.and.child', () => {
        // Uncomment to write html output to file
        // initializeDomWith.panelZero.and.child()
        // writeDomToFile('/Users/jlokman/Projects/Code/TEPAIV/CPC/libraries/cpc/tests/dom-out/initializeDomWith.panelZero.and.child.html')
    })

    test ('initializeDomWith.panelZero.and.childAndGrandchild', () => {
        // Uncomment to write html output to file
        // initializeDomWith.panelZero.and.childAndGrandchild()
        // writeDomToFile('/Users/jlokman/Projects/Code/TEPAIV/CPC/libraries/cpc/tests/dom-out/initializeDomWith.panelZero.and.childAndGrandchild.html')
    })

    test ('initializeDomWith.panelZero.and.threeSiblingChildren', () => {
        // Uncomment to write html output to file
        // initializeDomWith.panelZero.and.threeSiblingChildren()
        // writeDomToFile('/Users/jlokman/Projects/Code/TEPAIV/CPC/libraries/cpc/tests/dom-out/initializeDomWith.panelZero.and.threeSiblingChildren.html')
    })


    test ('initializeDomWith.panelZero.and.twoSiblingChilrenThatEachHasOneChild', () => {
        // Uncomment to write html output to file
        // initializeDomWith.panelZero.and.twoSiblingChilrenThatEachHasOneChild()
        // writeDomToFile('/Users/jlokman/Projects/Code/TEPAIV/CPC/libraries/cpc/tests/dom-out/initializeDomWith.panelZero.and.twoSiblingChilrenThatEachHasOneChild.html')
    })


})


