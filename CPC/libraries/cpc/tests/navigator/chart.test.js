//// DEPENDENCIES /////////////////////////////////////////////////////////////////////////////////////////////////////////////

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
require('../../../../../JestUtils/jest-dom')


// D3 //
global.d3 = {
    ...require("../../../external/d3/d3"),
    ...require("../../../external/d3/d3-array")
}
d3.selection.prototype.duration = jest.fn( function(){return this} )
d3.selection.prototype.transition = jest.fn( function(){return this} )



// Lodash //
global._ = require("../../../external/lodash")


// Internal //
global.classUtils = require("../../../utils/classUtils")
require("../../../utils/jsUtils")
require("../../../utils/errorUtils")
global.container = require("../../container")
global.shape = require("../../shape")
global.stringUtils = require("../../../utils/stringUtils")
global.data = require("../../../cpc/data")


//// MODULES BEING TESTED ////
const datasets = require("../../../../data/datasets")
const navigator = require("../../navigator")






//// UNIT TESTS /////////////////////////////////////////////////////////////////////////////////////////////////////////////


//// INSTANTIATE ///

test ('Should instantiate object', () => {

    const myChart = new navigator.Chart()

    expect(myChart).toBeDefined()

})


//// COORDINATES ///

test ('Should get and set coordinates', () => {

    const myChart = new navigator.Chart()

    //// SINGLE METHOD ///

    // x()
    expect(myChart.x(11).x()).toBe(11)
    // y()
    expect(myChart.y(22).y()).toBe(22)

    // x().y()
    myChart.x(33).y(44)
    expect(myChart.x()).toBe(33)
    expect(myChart.y()).toBe(44)

    // y().x()
    myChart.y(55).x(66)
    expect(myChart.y()).toBe(55)
    expect(myChart.x()).toBe(66)

    // INTERACTION WITH OTHER HEIGHT-MODIFYING METHODS //

    // Besides this._y, y() should also update related instance variables,
    // such as this._rangeStart, and this._rangeEnd,
    // as well as this._scaleFunction and this._rangeStack

    myChart.range([300, 200])
    const originalHeight = myChart.height()    // When y is updated, height should stay the same

    myChart.y(0)
    expect(myChart.y()).toBe(0)
    expect(myChart.height()).toBe(originalHeight)   // When y is updated, height should stay the same
    expect(myChart.range()).toEqual([100, 0])   // When y is updated, height should stay the same


    // If y() is first, it should be overridden by a following function that also modifies height
    myChart.y(300).range([100, 50])
    expect(myChart.y()).toEqual(50)
    expect(myChart.range()).toEqual([100, 50])


    // y() should work with complex chains
    myChart.y(200).height(100).range([900, 700]).width(150)
    expect(myChart.height()).toBe(200)
    expect(myChart.y()).toBe(700)
    expect(myChart.range()).toEqual([900, 700])
    expect(myChart.width()).toBe(150)

    myChart.range([10, 0]).y(50)
    expect(myChart.range()).toEqual([60, 50])
    expect(myChart.height()).toBe(10)
    expect(myChart.y()).toBe(50)

    myChart.height(100).y(0)
    expect(myChart.range()).toEqual([100,0])
    expect(myChart.height()).toBe(100)
    expect(myChart.y()).toBe(0)

})


//// WIDTH AND HEIGHT ///

test ('Should get and set width and height correctly in single and chain syntax', () => {

    const myChart = new navigator.Chart()

    // SINGLE METHOD //

    // Get
    expect(myChart.width()).toBe(100)
    expect(myChart._width).toBe(100)

    expect(myChart.height()).toBe(300)
    expect(myChart._height).toBe(300)


    // Set (and then get to see what is set)
    expect(myChart.width(100).width()).toBe(100)
    expect(myChart._width).toBe(100)

    expect(myChart.height(100).height()).toBe(100)
    expect(myChart._height).toBe(100)



    // CHAIN SYNTAX//

    // width().height()
    myChart.width(999).height(111)
    expect(myChart.width()).toBe(999)
    expect(myChart.height()).toBe(111)

    // height().width()
    myChart.height(555).width(444)
    expect(myChart.width()).toBe(444)
    expect(myChart.height()).toBe(555)


    // INTERACTION WITH OTHER HEIGHT-MODIFYING METHODS //

    // Besides this._height, height() should also update related instance variables, such as this._rangeEnd
    myChart.range([400, 0]).height(100)
    expect(myChart.range()).toEqual([100, 0])

    // If height() is first, it should be overridden by a following function that also modifies height
    myChart.height(200).range([500, 0])
    expect(myChart.height()).toBe(500)
    expect(myChart.range()).toEqual([500, 0])

})


//// DOMAIN AND RANGE ///

test ('Should get and set domain correctly in single and chain syntax', () => {

    const myChart = new navigator.Chart()

    // SINGLE METHOD //

    // Get range
    expect(myChart.range()).toEqual([325, 25])

    expect(myChart._rangeStack.data().get('category-1').get('start'))
        .toEqual(325)

    // Set Range
    myChart.range([100, 0])
    expect(myChart.range()).toEqual([100, 0])
    expect(myChart._rangeStart).toBe(100)
    expect(myChart._rangeEnd).toBe(0)



    // REVERSED COORDINATES AS INPUT //

    // Coordinates in correct order
    myChart.range([100, 50])
    expect(myChart.range()).toEqual([100, 50])

    // Coordinates in reversed order; this input should still lead to same result
    myChart.range([50, 100])
    expect(myChart.range()).toEqual([100, 50])



    // INTERACTION WITH OTHER RANGE-MODIFYING METHODS //

    // Besides this._rangeStart and this._rangeEnd, range() should also update related instance variables, such as this._height
    myChart.range([400, 0])
    expect(myChart.height()).toBe(400)
    expect(myChart.y()).toBe(0)

    myChart.range([300, 100])
    expect(myChart.height()).toBe(200)
    expect(myChart.y()).toBe(100)


    // If range() is first, it should be overridden by a following function that also modifies height
    myChart.range([400, 0]).height(100)
    expect(myChart.range()).toEqual([100, 0])


})


//// DATA ////


test ('Should get stack data', () => {

    const myChart = new navigator.Chart()

    expect(myChart.stack().size).toBe(3)

})


test ('Should query the stack data', () => {

    const myChart = new navigator.Chart()

    // Get first, query later manually
    expect(myChart.stack().get('category-1').get('label'))
        .toBe('Category One')

    // Directly query by giving a parameter to to method
    expect(myChart.stack('category-1').get('label'))
        .toBe('Category One')


})


//// UPDATE STACK DATA  ///////////////////////////////////////////////////////////////

test ('Should update stack data and also the related instance variables', () => {

    const myChart = new navigator.Chart()

    // Check original data
    expect(myChart._domainStack.data('category-1').get('label'))
        .toBe('Category One')
    expect(myChart._rangeStack.data('category-1').get('label'))
        .toBe('Category One')


    // Update data in stack
    const myStack = new data.Stack()
    myStack.populateWithExampleData('gender')

    myChart.stack(myStack)

    // Probe to see if data is correctly updated
    expect(myChart.stack().size).toBe(2)

    expect(myChart.stack().get('female').get('label'))
        .toBe('Female')
    expect(myChart.stack('female').get('start'))
        .toBe(64)
    expect(myChart.stack('female').get('end'))
        .toBe(100)

    expect(myChart.stack('male').get('label'))
        .toBe('Male')
    expect(myChart.stack('male').get('start'))
        .toBe(0)
    expect(myChart.stack('male').get('end'))
        .toBe(64)


    // Do a manual check on the updated private stack variable in the instance
    expect(myChart._domainStack.data().size).toBe(2)
    expect(myChart._domainStack.data().get('female').get('label'))
        .toBe('Female')

    // Check if domain min and domain max are updated
    expect(myChart._domainMax).toBe(100)
    expect(myChart._domainMin).toBe(0)

    // Check if scale function is updated
    expect(myChart._scaleFunction.domain()).toEqual([0,100])

    // Check if range stack is updated
    expect(myChart._rangeStack.data('female').get('label')).toBe('Female')


})

//// ABSOLUTE VALUES ///////////////////////////////////////////////////////////////

describe ('ABSOLUTE VALUES: Toggle absolute values', () => {

    // PREP //
    // Clear JEST's DOM to prevent leftovers from previous tests
    document.body.innerHTML = ''
    // Create svg
    const mySvg = new container.Svg()
    // Create chart
    const myChart = new navigator.Chart()


    test('GET/SET', () => {

        // Get
        expect( myChart.showAbsoluteValues()).toBe( false )

        // Set (On)
        myChart.showAbsoluteValues(true).update()
        expect( myChart.showAbsoluteValues() ).toBe( true )

        // Set (Off)
        myChart.showAbsoluteValues(false).update()
        expect( myChart.showAbsoluteValues() ).toBe( false )

    })


    test('VALIDATE: If absolute values are on, only numbers should be present in category text', () => {

        myChart.showAbsoluteValues(true).update()

        const allCategoryTexts = getAllValueTextsAtTheCenterOfCategories()
        const numberizedCategoryTexts = allCategoryTexts.map(Number)

        // Digits in a string does not return NaN; if NaN, there must be a non-digit character in text
        expect( numberizedCategoryTexts.includes(NaN) ).toBe( false )

        // Double check that the text is made of digits only
        expect( numberizedCategoryTexts[0].hasType('Number') ).toBe(true)
        expect( numberizedCategoryTexts[1].hasType('Number') ).toBe(true)
        expect( numberizedCategoryTexts[2].hasType('Number') ).toBe(true)

    })

    
    test ('TOGGLE OFF: Toggling off absolute values should toggle on percentages', () => {
            
            myChart.showAbsoluteValues(false).update()

            const allCategoryTexts = getAllValueTextsAtTheCenterOfCategories()
            expect( String(allCategoryTexts).includes('%') ).toBe( true )

    })


    test ('N/A VALUES: If there is no absolute value data for a category, it should display as N/A', () => {

        // Hack the data: Delete counts from data (counts are used to display absolute values)
        myChart.stack('category-1').delete('count')
        myChart.stack('category-2').delete('count')
        myChart.stack('category-3').delete('count')
        myChart._updateData()

        // Turn on absolute values
        myChart.showAbsoluteValues(true).update()

        // Because the data that absolute values require is not available in some...
        // or all categories, these categories should display 'N/A' as their text
        const allCategoryTexts = getAllValueTextsAtTheCenterOfCategories()
        expect( String(allCategoryTexts).includes('N/A') ).toBe( true )

    })


    // HELPER FUNCTIONS FOR TESTS //
    function getAllValueTextsAtTheCenterOfCategories() {
        let texts = []
        myChart.objects().forEach( (categoryObject, categoryName) => {
            texts.push(categoryObject._text)
        })
        return texts
    }




})


//// CATEGORY LABELS ///////////////////////////////////////////////////////////////

test ('Get/TurnOn/TurnOff category labels', () => {

    // Clear JEST's DOM to prevent leftovers from previous tests
    document.body.innerHTML = ''
    // Create svg
    const mySvg = new container.Svg()
    // Create chart
    const myChart = new navigator.Chart()

    // Check that there are no label objects and elements already
    expect(document.querySelectorAll('.category-label')).toHaveLength(0)


    // Get initial category labels
    expect( myChart.categoryLabels() ).toTabulateAs(`\
┌─────────┬────────┐
│ (index) │ Values │
├─────────┼────────┤
│    0    │  null  │
│    1    │  null  │
│    2    │  null  │
└─────────┴────────┘`)


    //// TOGGLE LABELS ON ////

    // Toggle category labels on
    myChart.categoryLabels(true).update()

    // Get now-created category labels
    expect(myChart.categoryLabels()).toTabulateAs(`\
┌─────────┬──────────────┐
│ (index) │    Values    │
├─────────┼──────────────┤
│    0    │ 'category-1' │
│    1    │ 'category-2' │
│    2    │ 'category-3' │
└─────────┴──────────────┘`)

    // New label elements should be created
    const categoryLabelElements = document.querySelectorAll('.category-label')
    expect(categoryLabelElements).toHaveLength(3)

    // Label object properties and texts of label elements should match each other
    categoryLabelElements.forEach((categoryLabelElement) => {
        const categoryObject = myChart.objects(categoryLabelElement.textContent)
        expect(categoryObject.label()).toBe(categoryLabelElement.textContent)
    })


    //// HOT-SWAP LABELS (SWAP DATASET WHILE LABELS ARE TOGGLED ON) ////
    //// ALSO: TEST LABELS WITH DATA THAT HAS SPACES ////

    // Using data with spaces in category names should not lead to problems //
    // Replace data with one that has spaces in category names
    const stackWithSpacedNames = new data.Stack()
        .populateWithExampleData('generic with spaces in category names')


    myChart.stack(stackWithSpacedNames).update()
    expect( myChart.categoryLabels() ).toTabulateAs(`\
┌─────────┬──────────────┐
│ (index) │    Values    │
├─────────┼──────────────┤
│    0    │ 'category 1' │
│    1    │ 'category 2' │
│    2    │ 'category 3' │
└─────────┴──────────────┘`)

    myChart.categoryLabels(true)  // loading new data resets the labels, so they should be toggled on again
    expect( myChart.categoryLabels() ).toTabulateAs(`\
┌─────────┬──────────────┐
│ (index) │    Values    │
├─────────┼──────────────┤
│    0    │ 'category 1' │
│    1    │ 'category 2' │
│    2    │ 'category 3' │
└─────────┴──────────────┘`)

    // Select the newly created labels
    const newCategoryLabelElements = document.querySelectorAll('.category-label')

    // Label object properties and texts of label elements should match each other
    newCategoryLabelElements.forEach((categoryLabelElement) => {
        const categoryObject = myChart.objects(categoryLabelElement.textContent)
        expect(categoryObject.label()).toBe(categoryLabelElement.textContent)
    })



    //// TOGGLE LABELS OFF ////
    myChart.categoryLabels(false).update()

    let categoryLabelElementsAfterToggleOff = document.querySelectorAll('.category-label')

    expect(categoryLabelElementsAfterToggleOff).toHaveLength(0)
    expect(myChart.categoryLabels()).toTabulateAs(`\
┌─────────┬────────┐
│ (index) │ Values │
├─────────┼────────┤
│    0    │  null  │
│    1    │  null  │
│    2    │  null  │
└─────────┴────────┘`)


    //// TOGGLE LABELS ON 2 TIMES, OFF 1 TIME ////
    myChart.categoryLabels(true).update()
    myChart.categoryLabels(true).update()

    let categoryLabelElementsAfterToggleOn = document.querySelectorAll('.category-label')
    expect(categoryLabelElementsAfterToggleOn).toHaveLength(3)



//     myChart.categoryLabels(false).update()
//
//     categoryLabelElementsAfterToggleOff = document.querySelectorAll('.category-label')
//
//     expect(categoryLabelElementsAfterToggleOff).toHaveLength(0)
//     expect(myChart.categoryLabels()).toTabulateAs(`\
// ┌─────────┬────────┐
// │ (index) │ Values │
// ├─────────┼────────┤
// │    0    │  null  │
// │    1    │  null  │
// │    2    │  null  │
// └─────────┴────────┘`)

})




//// CHART LABEL ////

test ('Get/Set/Toggle chart label', () => {

    // Clear JEST's DOM to prevent leftovers from previous tests
    document.body.innerHTML = ''
    // Create svg
    const mySvg = new container.Svg()
    // Create chart
    const myChart = new navigator.Chart()



    // Check that there are no chart label objects and elements already
    expect(document.querySelectorAll('.chart-label')).toHaveLength(0)

    // Get chart label
    expect( myChart.chartLabel() ).toBe( myChart._chartLabel.text )

    // Turn on chart label (with default, placeholder value)
    myChart.chartLabel(true).update()
    expect( document.querySelectorAll('.chart-label') ).toHaveLength(1)
    expect( document.querySelector('.chart-label').textContent ).toBe('Chart label')

    // Set chart label (while its already toggled on)
    myChart.chartLabel('My label').update()

    // Check that the chart label is correctly created on DOM
    expect( document.querySelectorAll('.chart-label') ).toHaveLength(1)
    expect( document.querySelector('.chart-label').textContent ).toBe('My label')

    // Check that chart label position is OK
    myChart.categoryLabels(true).update()
    const xCoordinate_leftEdgeOfCategoryLabelsArea = myChart._categoryLabelsArea.leftEdgeXCoordinate

    const chartLabelPosition = myChart._chartLabelObject.x()
    const xCoordinate_chartLabelObject = myChart._chartLabelObject.x()
    const xCoordinate_chartLabelElement = Number(
            document
                .querySelector('.chart-label')
                .getAttribute('x')
    )

    // Chart label object and element positions should match
    expect(xCoordinate_chartLabelObject).toBe(xCoordinate_chartLabelElement)
    // Chart
    expect( xCoordinate_chartLabelElement )
        .toBeLessThanOrEqual( xCoordinate_leftEdgeOfCategoryLabelsArea )



    // Turn off chart label
    expect( document.querySelectorAll('.chart-label') ).toHaveLength(1)

    myChart.chartLabel(false).update()

    expect( document.querySelectorAll('.chart-label') ).toHaveLength(0)
    expect( myChart._chartLabelObject ).toBe( null )
    expect ( myChart._chartLabel.text ).toBe( 'My label')

    // Toggle chart label off multiple times
    myChart.chartLabel(false).update()
    expect( document.querySelectorAll('.chart-label') ).toHaveLength(0)
    expect( myChart._chartLabelObject ).toBe( null )

    myChart.chartLabel(false).update()
    expect( document.querySelectorAll('.chart-label') ).toHaveLength(0)
    expect( myChart._chartLabelObject ).toBe( null )


    // Set the chart label multiple times (when the chart label is toggled on)
    myChart.chartLabel(true).update()
    myChart.chartLabel('Label 1').update()
    expect( document.querySelectorAll('.chart-label') ).toHaveLength(1)
    expect( document.querySelector('.chart-label').textContent ).toBe('Label 1')

    myChart.chartLabel('Label 2').update()
    expect( document.querySelectorAll('.chart-label') ).toHaveLength(1)
    expect( document.querySelector('.chart-label').textContent ).toBe('Label 2')

    // Set the chart label multiple times (when the chart label is toggled off)
    myChart.chartLabel(false).update()
    myChart.chartLabel('Label 3').update()
    expect ( myChart.chartLabel() ).toBe('Label 3')
    expect( document.querySelectorAll('.chart-label') ).toHaveLength(0)

    myChart.chartLabel('Label 4').update()
    expect ( myChart.chartLabel() ).toBe('Label 4')
    expect( document.querySelectorAll('.chart-label') ).toHaveLength(0)

})



//// COLOR SCHEME ////

test ('COLOR SCHEME: Get/Set', () => {

    // Clear JEST's DOM to prevent leftovers from previous tests
    document.body.innerHTML = ''
    // Create svg
    const mySvg = new container.Svg()
    // Create chart
    const myChart = new navigator.Chart()


    // Get color scheme
    expect( myChart.colorScheme() ).toBe('Greys')  // the default color scheme
    expect( myChart.actualColors() ).toTabulateAs(`\
┌─────────┬────────┐
│ (index) │ Values │
├─────────┼────────┤
│    0    │ 'gray' │
│    1    │ 'gray' │
│    2    │ 'gray' │
└─────────┴────────┘`)


    // Set color scheme
    myChart.colorScheme('Blues').update()
    expect( myChart.colorScheme() ).toBe('Blues')
    expect( myChart.actualColors() ).toTabulateAs(`\
┌─────────┬──────────────────────┐
│ (index) │        Values        │
├─────────┼──────────────────────┤
│    0    │ 'rgb(24, 100, 170)'  │
│    1    │ 'rgb(75, 151, 201)'  │
│    2    │ 'rgb(147, 195, 223)' │
└─────────┴──────────────────────┘`)


    // Set color scheme
    myChart.colorScheme('Reds').update()
    expect( myChart.colorScheme() ).toBe('Reds')
    expect( myChart.actualColors() ).toTabulateAs(`\
┌─────────┬──────────────────────┐
│ (index) │        Values        │
├─────────┼──────────────────────┤
│    0    │  'rgb(187, 21, 26)'  │
│    1    │  'rgb(239, 69, 51)'  │
│    2    │ 'rgb(252, 138, 107)' │
└─────────┴──────────────────────┘`)

})



///////////////////////////////////////////////////////////////////////////////////////////
//// WHITE BOX TESTS //////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////

test ('CATEGORY LABELS: Get widest category label width: Get the width of the widest category label in the chart', () => {

    // Clear JEST's DOM to prevent leftovers from previous tests
    document.body.innerHTML = ''
    // Create svg
    const mySvg = new container.Svg()
    // Create chart
    const myChart = new navigator.Chart()


    // Toggle labels on for the first time and measure
    myChart.categoryLabels(true).update()
    expect( myChart._getWidestCategoryLabelWidth() ).toBe(10)  // mocked value as length of the string


    // Can't measure widths if category labels are not toggled on
    myChart.categoryLabels(false).update()
    expect( () => {
        myChart._getWidestCategoryLabelWidth()
    }).toThrow(
        'Cannot measure the widths of the category labels because the category labels are NOT toggled on.'
    )

    // Toggle labels back on from off state and measure again
    myChart.categoryLabels(true).update()
    expect( myChart._getWidestCategoryLabelWidth() ).toBe(10)  // mocked value


    // Toggle labels back on from the already on state and measure again
    myChart.categoryLabels(true).update()
    expect( myChart._getWidestCategoryLabelWidth() ).toBe(10)  // mocked value



})




test ('CHART LABEL: Calculate chart label position', () => {

    // Clear JEST's DOM to prevent leftovers from previous tests
    document.body.innerHTML = ''
    // Create svg
    const mySvg = new container.Svg()
    // Create chart
    const myChart = new navigator.Chart()


    // Calculate chart label position (chart label is the only label)
    let {x, y} = myChart._calculateChartLabelPosition()
    expect(x).toBe(-10)
    expect(y).toBe(175)


})


test ('CHART LABEL: Set right padding', () => {

    // Clear JEST's DOM to prevent leftovers from previous tests
    document.body.innerHTML = ''
    // Create svg
    const mySvg = new container.Svg()
    // Create chart
    const myChart = new navigator.Chart()
    // Turn on chart label
    myChart.chartLabel(true).update()


    // Calculate default chart label position (chart label is the only label)
    let {x, y} = myChart._calculateChartLabelPosition()
    expect(x).toBe(-10)
    expect(y).toBe(175)

    // Get initial values for later comparisons
    const initialRightPaddingForChartLabel = myChart._chartLabel.paddingRight
    const initialXCoordinateForChartLabel = myChart._chartLabelObject.x()
    const initialXCoordinateOfChartLabelOnDom = Number( document.querySelector('.chart-label').getAttribute('x') )

    // Get current chart label right padding
    expect ( myChart.chartLabelPaddingRight() )
        .toBe( initialRightPaddingForChartLabel )

    // Set chart label right padding
    const paddingIncrement = 100
    let newRightPadding = myChart.chartLabelPaddingRight() + paddingIncrement
    myChart
        .chartLabelPaddingRight( newRightPadding )
        .update()

    // Check if the update is done correctly in JS environment
    expect ( myChart.chartLabelPaddingRight() )
        .toBe( newRightPadding )

    expect ( myChart._chartLabelObject.x() )
        .toBe( initialXCoordinateForChartLabel - paddingIncrement )

    // Check if the update is done correctly on DOM environment
    const newXCoordinateOfChartLabelOnDom = Number( document.querySelector('.chart-label').getAttribute('x') )
    expect( newXCoordinateOfChartLabelOnDom )
        .toBe( initialXCoordinateOfChartLabelOnDom - paddingIncrement )


    // Error checking: Method should accept only numbers
    expect(() => {
        myChart.chartLabelPaddingRight('-10')
    }).toThrow()
    expect(() => {
        myChart.chartLabelPaddingRight(true)
    }).toThrow()


})