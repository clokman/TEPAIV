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

global.str = require("../str")
const datasets = require("../../../data/datasets")
const data = require("../data")


//// STACK /////////////////////////////////////////////////////////////////////////////////////////////////////////////


test ('Should instantiate the class with initial sample data and summary statistics' , () => {

    myStack = new data.Stack()

    expect(myStack).toBeDefined()

    expect(myStack._data.size).toBe(3)
    expect(myStack.min()).toBe(0)
    expect(myStack.max()).toBe(30)

})


test ('Should generate a test data and summary', () => {


    myStack = new data.Stack()

    myStack.generateSample()

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



test ('Should return the data in stack' , () => {

    myStack = new data.Stack()


    expect(myStack.data().size).toBe(3)

})



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
