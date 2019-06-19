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


//// REQUIREMENTS ////

global.d3 = {
    ...require("../../../external/d3/d3"),
    ...require("../../../external/d3/d3-array")
}

global.classUtils = require("../../../utils/classUtils")
global.container = require("../../container")
global.shape = require("../../shape")
global.stringUtils = require("../../../utils/stringUtils")
global.data = require("../../../cpc/data")

//// MODULES BEING TESTED ////
const datasets = require("../../../../data/datasets")
const navigator = require("../../navigator")






//// UNIT TESTS /////////////////////////////////////////////////////////////////////////////////////////////////////////////

test ('Should instantiate a Text class object', () => {

    // Clear JEST's DOM to prevent leftovers from previous tests
    document.body.innerHTML = ''

    const mySvg = new container.Svg()
    const myText = new shape.Text()

    // Verify that the object exists
    expect(myText).toBeDefined()

    // Verify that the DOM counterpart of the object exists
    expect(document.getElementsByTagName('text').length)
        .toBe(1)


})



test ('Should instantiate text as a child object of another element', () => {

    // Clear JEST's DOM to prevent leftovers from previous tests
    document.body.innerHTML = ''


    // Create a svg object as the topmost container
    const mySvg = new container.Svg(640, 480)
        , svgSelection = mySvg.select()

    // Create a parent container for text
    const myGroup = new container.Group(svgSelection)
        , groupSelection = myGroup.select()

    // Create the text object
    const myText = new shape.Text(groupSelection)


    // Verify that DOM counterpart of the text object is created
    const noOfTextElements = document
        .getElementsByTagName('text')
        .length
    expect(noOfTextElements).toBe(1)


    // Verify that text element has a parent group
    const parentElementType = document
        .getElementsByTagName('text')[0]
        .parentElement
        .tagName
    expect(parentElementType).toBe('g')

})


//// SELECT ///

test ("Should return a Selection to the text's corresponding DOM element" , () => {

    // Clear JEST's DOM to prevent leftovers from previous tests
    document.body.innerHTML = ''


    // Create an svg object that that the text can exist in
    const mySvg = new container.Svg(640, 480)

    // Initiate text instance
    const myText = new shape.Text()  // implicitly attaches to svg

    // Set a property on DOM using select method
    myText.select().attr('id', 'my-text')


    // Verify that the element is created in DOM and has the correct attribute
    expect(document.getElementById('my-text').getAttribute('id'))
        .toBe('my-text')

    // Get a property from DOM using select method
    expect(myText.select().attr('id')).toBe('my-text')


})


/// REMOVE ///

test ("Should remove text's corresponding element in DOM", () => {

    // Clear JEST's DOM to prevent leftovers from previous tests
    document.body.innerHTML = ''


    // Create a svg object that that the text can exist in
    const mySvg = new container.Svg()

    // Initiate text instance
    const myText = new shape.Text()  // implicitly attaches to svg
    myText.id('my-text').update()

    // Verify that a corresponding element is created in DOM
    expect(document.getElementById('my-text')).toBeDefined()


    // Remove element from DOM
    myText.remove()

    // Verify that the element is longer in DOM
    expect(document.getElementById('my-text')).toBe(null)

})


//// UPDATE ////
// TODO: TEST WRITTEN FOR UPDATE METHOD


//// TEXT ////

test ('Should get and set text', () => {

    const myText = new shape.Text()

    // SINGLE METHOD //
    expect(myText.text()).toBe('Text')
    expect(myText.text('my text').text()).toBe('my text')
})



//// COORDINATES ////

test ('Should get and set coordinates', () => {

    const myText = new shape.Text()

    // SINGLE METHOD //

    // x()
    expect(myText.x(11).x()).toBe(11)
    // y()
    expect(myText.y(22).y()).toBe(22)

    // x().y()
    myText.x(33).y(44)
    expect(myText.x()).toBe(33)
    expect(myText.y()).toBe(44)

    // y().x()
    myText.y(55).x(66)
    expect(myText.y()).toBe(55)
    expect(myText.x()).toBe(66)

})


//// FILL ///

test ('Should get and set fill color using single and chain syntax', () => {

    const myText = new shape.Text()

    // Single method
    expect(myText.fill('green').fill()).toBe('green')
    expect(myText.fill('red').fill()).toBe('red')

    // Chain syntax
    expect(myText.x(111).fill('red').fill()).toBe('red')
    expect(myText.fill('blue').y(222).fill()).toBe('blue')


})


//// TEXT ANCHOR ///

test ('Should get and set anchor using single and chain syntax', () => {

    const myText = new shape.Text()

    // Single method
    expect(myText.textAnchor('middle').textAnchor()).toBe('middle')
    expect(myText.textAnchor('start').textAnchor()).toBe('start')

    // Chain syntax
    expect(myText.x(111).textAnchor('end').textAnchor()).toBe('end')
    expect(myText.textAnchor('middle').y(222).textAnchor()).toBe('middle')


})


//// FONT SIZE ///

test ('Should get and set fill color using single and chain syntax', () => {

    const myText = new shape.Text()

    // Single method
    expect(myText.textAnchor('green').textAnchor()).toBe('green')
    expect(myText.textAnchor('red').textAnchor()).toBe('red')

    // Chain syntax
    expect(myText.x(111).textAnchor('red').textAnchor()).toBe('red')
    expect(myText.textAnchor('blue').y(222).textAnchor()).toBe('blue')

})


//// CLASS AND ID ///

test ('Should set Text class and ID with single and chain syntax', () => {

    const myText = new shape.Text()


    // SINGLE METHOD //

    // Class
    expect(myText.class()).toBe(null)
    expect(myText.class('class-1').class()).toBe('class-1')

    // ID
    expect(myText.id()).toBe(null)
    expect(myText.id('id-1').id()).toBe('id-1')



    // CHAIN SYNTAX //

    // ID and Class
    myText.class('M').id('Earth')
    expect(myText.class()).toBe('M')
    expect(myText.id()).toBe('Earth')


    // CHAIN SYNTAX //

    // ID and Class with other methods
    myText.x(8888).class('M').id('Vulcan').y(9999)
    expect(myText.class()).toBe('M')
    expect(myText.id()).toBe('Vulcan')
    expect(myText.x()).toBe(8888)
    expect(myText.y()).toBe(9999)


})