//// IMPORTS /////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Import polyfill for fetch() method
if (typeof fetch !== 'function') {
    global.fetch =  require('node-fetch-polyfill')
}

// Import polyfill for Object.fromEntries() method
if (typeof Object.fromEntries !== 'function') {
    Object.fromEntries = require('object.fromentries')
}

// NODE-ONLY DEPENDENCIES //
require("../../../../../JestUtils/jest-console")


// UMD DEPENDENCIES //
global.d3 = {
    ...require("../../../external/d3/d3"),
    ...require("../../../external/d3/d3-array")
}
global._ = require("../../../external/lodash")

global.stringUtils = require("../../../utils/stringUtils")
global.arrayUtils = require("../../../utils/arrayUtils")


// THE MODULE BEING TESTED //
const data = require("../../data")






//// UNIT TESTS /////////////////////////////////////////////////////////////////////////////////////////////////////////////


//// INITIATE ////
test ('Should instantiate the class with initial sample data and summary statistics' , () => {

    const myStack = new data.Stack()

    expect(myStack).toBeDefined()

    expect(myStack._data.size).toBe(3)
    expect(myStack.min()).toBe(0)
    expect(myStack.max()).toBe(30)

})



//// GENERATE EXAMPLE DATA ////
test ('Should initiate with example data', () => {

    const myStack = new data.Stack()
    
    
    expectTable(myStack.data().get('category-1'), `\
┌───────────────────┬──────────────┬────────────────┐
│ (iteration index) │     Key      │     Values     │
├───────────────────┼──────────────┼────────────────┤
│         0         │   'label'    │ 'Category One' │
│         1         │   'start'    │       0        │
│         2         │    'end'     │       10       │
│         3         │ 'percentage' │       33       │
└───────────────────┴──────────────┴────────────────┘`)
    expectTable(myStack.data().get('category-2'), `\
┌───────────────────┬──────────────┬────────────────┐
│ (iteration index) │     Key      │     Values     │
├───────────────────┼──────────────┼────────────────┤
│         0         │   'label'    │ 'Category Two' │
│         1         │   'start'    │       10       │
│         2         │    'end'     │       20       │
│         3         │ 'percentage' │       33       │
└───────────────────┴──────────────┴────────────────┘`)
    expectTable(myStack.data().get('category-3'), `\
┌───────────────────┬──────────────┬──────────────────┐
│ (iteration index) │     Key      │      Values      │
├───────────────────┼──────────────┼──────────────────┤
│         0         │   'label'    │ 'Category Three' │
│         1         │   'start'    │        20        │
│         2         │    'end'     │        30        │
│         3         │ 'percentage' │        33        │
└───────────────────┴──────────────┴──────────────────┘`)


    // Check number of categories
    expect(myStack._data.size)
        .toBe(3)


    // Check content of one of the categories
    expect(myStack._data.get('category-1').get('label'))
        .toBe('Category One')

    expect(myStack._data.get('category-1').get('start'))
        .toBe(0)

    expect(myStack._data.get('category-1').get('end'))
        .toBe(10)


    // Check content of another category
    expect(myStack._data.get('category-2').get('end'))
        .toBe(20)


    // Check summary
    expect(myStack.min())
        .toBe(0)

    expect(myStack.max())
        .toBe(30)

})




test ('Should generate various example data', () => {

    myStack = new data.Stack()

    // DEFAULT VARIANT //

    // Generate the default variant of example data
    myStack.populateWithExampleData()   // parameter defaults to 'generic'
    const exampleData1 = myStack.data()

    // Probe the generated data
    expect(exampleData1).toBeInstanceOf(Map)
    expect(exampleData1.size).toBe(3)

    // Probe one category
    expect(exampleData1.get('category-1').get('label'))
        .toBe('Category One')

    expect(exampleData1.get('category-1').get('start'))
        .toBe(0)

    expect(exampleData1.get('category-1').get('end'))
        .toBe(10)

    // Probe another category
    expect(exampleData1.get('category-2').get('end'))
        .toBe(20)

    expectTable(myStack.data().get('category-1'), `\
┌───────────────────┬──────────────┬────────────────┐
│ (iteration index) │     Key      │     Values     │
├───────────────────┼──────────────┼────────────────┤
│         0         │   'label'    │ 'Category One' │
│         1         │   'start'    │       0        │
│         2         │    'end'     │       10       │
│         3         │ 'percentage' │       33       │
└───────────────────┴──────────────┴────────────────┘`)
    expectTable(myStack.data().get('category-2'), `\
┌───────────────────┬──────────────┬────────────────┐
│ (iteration index) │     Key      │     Values     │
├───────────────────┼──────────────┼────────────────┤
│         0         │   'label'    │ 'Category Two' │
│         1         │   'start'    │       10       │
│         2         │    'end'     │       20       │
│         3         │ 'percentage' │       33       │
└───────────────────┴──────────────┴────────────────┘`)



    // VARIANT: GENDER

    myStack.populateWithExampleData('gender')
    const exampleData2 = myStack.data()


    expectTable(exampleData2.get('male'), `\
┌───────────────────┬──────────────┬────────┐
│ (iteration index) │     Key      │ Values │
├───────────────────┼──────────────┼────────┤
│         0         │   'label'    │ 'Male' │
│         1         │   'start'    │   0    │
│         2         │    'end'     │   64   │
│         3         │ 'percentage' │   64   │
└───────────────────┴──────────────┴────────┘`)
    expectTable(exampleData2.get('female'), `\
┌───────────────────┬──────────────┬──────────┐
│ (iteration index) │     Key      │  Values  │
├───────────────────┼──────────────┼──────────┤
│         0         │   'label'    │ 'Female' │
│         1         │   'start'    │    64    │
│         2         │    'end'     │   100    │
│         3         │ 'percentage' │    36    │
└───────────────────┴──────────────┴──────────┘`)

    // Probe the generated data
    expect(exampleData2).toBeInstanceOf(Map)
    expect(exampleData2.size).toBe(2)


    // Probe one category
    expect(exampleData2.get('male').get('label'))
        .toBe('Male')

    expect(exampleData2.get('male').get('start'))
        .toBe(0)

    expect(exampleData2.get('male').get('end'))
        .toBe(64)


    // Probe another category
    expect(exampleData2.get('female').get('end'))
        .toBe(100)

    expect(exampleData2.get('female').get('percentage'))
        .toBe(36)



    // VARIANT: CLASS

    myStack.populateWithExampleData('class')
    const exampleDataClass = myStack.data()


    expectTable(exampleDataClass.get('first-class'), `\
┌───────────────────┬──────────────┬───────────────┐
│ (iteration index) │     Key      │    Values     │
├───────────────────┼──────────────┼───────────────┤
│         0         │   'label'    │ 'First Class' │
│         1         │   'start'    │       0       │
│         2         │    'end'     │      25       │
│         3         │ 'percentage' │      25       │
└───────────────────┴──────────────┴───────────────┘`)
    expectTable(exampleDataClass.get('second-class'), `\
┌───────────────────┬──────────────┬────────────────┐
│ (iteration index) │     Key      │     Values     │
├───────────────────┼──────────────┼────────────────┤
│         0         │   'label'    │ 'Second Class' │
│         1         │   'start'    │       25       │
│         2         │    'end'     │       46       │
│         3         │ 'percentage' │       21       │
└───────────────────┴──────────────┴────────────────┘`)
    expectTable(exampleDataClass.get('third-class'), `\
┌───────────────────┬──────────────┬───────────────┐
│ (iteration index) │     Key      │    Values     │
├───────────────────┼──────────────┼───────────────┤
│         0         │   'label'    │ 'Third Class' │
│         1         │   'start'    │      46       │
│         2         │    'end'     │      100      │
│         3         │ 'percentage' │      54       │
└───────────────────┴──────────────┴───────────────┘`)


    // Probe the generated data
    expect(exampleDataClass).toBeInstanceOf(Map)
    expect(exampleDataClass.size).toBe(3)


    // Probe one category
    expect(exampleDataClass.get('first-class').get('label'))
        .toBe('First Class')

    expect(exampleDataClass.get('first-class').get('start'))
        .toBe(0)

    expect(exampleDataClass.get('first-class').get('end'))
        .toBe(25)


    // Probe another category
    expect(exampleDataClass.get('third-class').get('end'))
        .toBe(100)

    expect(exampleDataClass.get('third-class').get('percentage'))
        .toBe(54)



    // VARIANT: STATUS

    myStack.populateWithExampleData('status')
    const exampleDataStatus = myStack.data()

    expectTable(exampleDataStatus.get('survived'), `\
┌───────────────────┬──────────────┬────────────┐
│ (iteration index) │     Key      │   Values   │
├───────────────────┼──────────────┼────────────┤
│         0         │   'label'    │ 'Survived' │
│         1         │   'start'    │     0      │
│         2         │    'end'     │     38     │
│         3         │ 'percentage' │     38     │
└───────────────────┴──────────────┴────────────┘`)
    expectTable(exampleDataStatus.get('died'), `\
┌───────────────────┬──────────────┬────────┐
│ (iteration index) │     Key      │ Values │
├───────────────────┼──────────────┼────────┤
│         0         │   'label'    │ 'Died' │
│         1         │   'start'    │   38   │
│         2         │    'end'     │  100   │
│         3         │ 'percentage' │   62   │
└───────────────────┴──────────────┴────────┘`)


    // Probe the generated data
    expect(exampleDataStatus).toBeInstanceOf(Map)
    expect(exampleDataStatus.size).toBe(2)


    // Probe one category
    expect(exampleDataStatus.get('survived').get('label'))
        .toBe('Survived')

    expect(exampleDataStatus.get('survived').get('start'))
        .toBe(0)

    expect(exampleDataStatus.get('survived').get('end'))
        .toBe(38)


    // Probe another category
    expect(exampleDataStatus.get('died').get('end'))
        .toBe(100)

    expect(exampleDataStatus.get('died').get('percentage'))
        .toBe(62)

})



//// GET/SET/QUERY ////

test ('Should return the data in Stack' , () => {

    const myStack = new data.Stack()


    expect(myStack.data().size).toBe(3)

})

test ('Should set new data for Stack', () => {

    const myMap = new Map()

    myMap.set('male', new Map())
        .get('male')
        .set('label', 'Male')
        .set('start', 100)
        .set('end', 200)
    myMap.set('female', new Map())
        .get('female')
        .set('label', 'Female')
        .set('start', 200)
        .set('end', 300)

    const myStack = new data.Stack()

    myStack.data(myMap)

    expect(myStack.data().size).toBe(2)

})

test ('Should query the data in Stack', () => {

    const myStack = new data.Stack()

    expect(myStack.data('category-1').get('label'))
        .toBe('Category One')


})

test ('Should get correct summaries (e.g., min and max) values after updating data', () => {

    const myStack = new data.Stack()

    // Generate new data
    myStack.populateWithExampleData('gender')

    // Check summary methods
    expect(myStack.min())
        .toBe(0)

    expect(myStack.max())
        .toBe(100)

})


//// COPY ////

test ('Should make a copy the stack instance', () => {

    const originalStack = new data.Stack()

    const copiedStack = originalStack.copy()

    // Check if copied stack has same values with  the original
    expect(copiedStack.data().size).toBe(3)
    expect(copiedStack.data('category-3').get('label'))
        .toBe('Category Three')


    // Check if original stack is still the same
    expect(originalStack.data().size).toBe(3)
    expect(originalStack.data('category-3').get('label'))
        .toBe('Category Three')


    // Ensure that changes to the copied stack do NOT affect the original stack
    const myScaleFunction = d3.scaleLinear()
        .domain([copiedStack.min(), copiedStack.max()])
        .rangeRound([500, 1000])

    copiedStack.scale(myScaleFunction)

    const copiedEnd = copiedStack.data('category-1').get('start')
        , originalEnd = originalStack.data('category-1').get('start')

    expect(originalEnd).toBe(0)
    expect(copiedEnd).toBe(500)

})




//// SCALE ////

test ('Should scale the data in stack' , () => {

    const myStack = new data.Stack()

    expectTable(myStack.data().get('category-1'), `\
┌───────────────────┬──────────────┬────────────────┐
│ (iteration index) │     Key      │     Values     │
├───────────────────┼──────────────┼────────────────┤
│         0         │   'label'    │ 'Category One' │
│         1         │   'start'    │       0        │
│         2         │    'end'     │       10       │
│         3         │ 'percentage' │       33       │
└───────────────────┴──────────────┴────────────────┘`)


    const scaleFunction = d3.scaleLinear()
        .domain([myStack.min(), myStack.max()])
        .rangeRound([0, 1000])


    myStack.scale(scaleFunction)

    expectTable(myStack.data().get('category-1'), `\
┌───────────────────┬──────────────┬────────────────┐
│ (iteration index) │     Key      │     Values     │
├───────────────────┼──────────────┼────────────────┤
│         0         │   'label'    │ 'Category One' │
│         1         │   'start'    │       0        │
│         2         │    'end'     │      333       │
│         3         │ 'percentage' │       33       │
└───────────────────┴──────────────┴────────────────┘`)

    expect(myStack._data.size).toBe(3)
    expect(myStack._data.get('category-2').get('start')).toBe(333)
    expect(myStack._data.get('category-2').get('end')).toBe(667)
    expect(myStack.min()).toBe(0)
    expect(myStack.max()).toBe(1000)

})


test ('Should find maximum and minimum values in stack data', () => {

    const myStack = new data.Stack()

    expect(myStack.min())
        .toBe(0)

    expect(myStack.max())
        .toBe(30)

})




//// IMPORT MAP ////

test ('Convert a map object to a Stack', () => {


    const myMap = new Map([
        ['1st class', 323],
        ['2nd class', 277],
        ['3rd class', 709]
    ])


    expectTable(myMap, `\
┌───────────────────┬─────────────┬────────┐
│ (iteration index) │     Key     │ Values │
├───────────────────┼─────────────┼────────┤
│         0         │ '1st class' │  323   │
│         1         │ '2nd class' │  277   │
│         2         │ '3rd class' │  709   │
└───────────────────┴─────────────┴────────┘`)

    const myStack = new data.Stack()
    myStack.fromShallowMap(myMap)

    expectTable(myStack.data().get('1st class'), `\
┌───────────────────┬──────────────┬─────────────┐
│ (iteration index) │     Key      │   Values    │
├───────────────────┼──────────────┼─────────────┤
│         0         │   'label'    │ '1st class' │
│         1         │   'count'    │     323     │
│         2         │ 'percentage' │    24.7     │
│         3         │   'start'    │      0      │
│         4         │    'end'     │     323     │
└───────────────────┴──────────────┴─────────────┘`)
    expectTable(myStack.data().get('2nd class'), `\
┌───────────────────┬──────────────┬─────────────┐
│ (iteration index) │     Key      │   Values    │
├───────────────────┼──────────────┼─────────────┤
│         0         │   'label'    │ '2nd class' │
│         1         │   'count'    │     277     │
│         2         │ 'percentage' │    21.2     │
│         3         │   'start'    │     323     │
│         4         │    'end'     │     600     │
└───────────────────┴──────────────┴─────────────┘`)
    expectTable(myStack.data().get('3rd class'), `\
┌───────────────────┬──────────────┬─────────────┐
│ (iteration index) │     Key      │   Values    │
├───────────────────┼──────────────┼─────────────┤
│         0         │   'label'    │ '3rd class' │
│         1         │   'count'    │     709     │
│         2         │ 'percentage' │    54.2     │
│         3         │   'start'    │     600     │
│         4         │    'end'     │    1309     │
└───────────────────┴──────────────┴─────────────┘`)


})

