//// IMPORTS /////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Import polyfill for fetch() method
if (typeof fetch !== 'function') {
    global.fetch =  require('node-fetch-polyfill')
}

// Import polyfill for Object.fromEntries() method
if (typeof Object.fromEntries !== 'function') {
    Object.fromEntries = require('object.fromentries')
}

global.d3 = {
    ...require("../../external/d3/d3"),
    ...require("../../external/d3/d3-array")
}
global._ = require("../../external/lodash")

global.str = require("../str")
const datasets = require("../../../data/datasets")
const data = require("../data")






//// STACK /////////////////////////////////////////////////////////////////////////////////////////////////////////////

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






    // VARIANT 2

    myStack.populateWithExampleData('gender')
    const exampleData2 = myStack.data()


    // Probe the generated data
    expect(exampleData2).toBeInstanceOf(Map)
    expect(exampleData2.size).toBe(2)


    // Probe one category
    expect(exampleData2.get('male').get('label'))
        .toBe('Male')

    expect(exampleData2.get('male').get('start'))
        .toBe(0)

    expect(exampleData2.get('male').get('end'))
        .toBe(33)


    // Probe another category
    expect(exampleData2.get('female').get('end'))
        .toBe(100)

    expect(exampleData2.get('female').get('percentage'))
        .toBe(67)




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

    myStack = new data.Stack()

    const scaleFunction = d3.scaleLinear()
        .domain([myStack.min(), myStack.max()])
        .rangeRound([0, 1000])


    myStack.scale(scaleFunction)

    expect(myStack._data.size).toBe(3)
    expect(myStack._data.get('category-2').get('start')).toBe(333)
    expect(myStack._data.get('category-2').get('end')).toBe(667)
    expect(myStack.min()).toBe(0)
    expect(myStack.max()).toBe(1000)

})


test ('Should find maximum and minimum values in stack data', () => {


    myStack = new data.Stack()

    expect(myStack.min())
        .toBe(0)

    expect(myStack.max())
        .toBe(30)

})
