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
    ...require("../../external/d3/d3"),
    ...require("../../external/d3/d3-array")
}

global.shape = require("../shape")

//// MODULES BEING TESTED ////
const container = require("../container")






//// GROUP /////////////////////////////////////////////////////////////////////////////////////////////////////////////


//// INITIALIZATION ////

test ('Should instantiate object', () => {

    // Create a svg object that that the container can exist in
    const mySvg = new container.Svg(111, 222)
        , parentSelection = d3.select('body').select('svg')

    const myGroup = new container.Group(parentSelection)
    expect(myGroup).toBeDefined()

})


//// CLASS AND ID ///

test ('Should get and set class and ID with single and chain syntax', () => {

    // Create a svg object that that the container can exist in
    const mySvg = new container.Svg(111, 222)
        , parentSelection = d3.select('body').select('svg')

    const myGroup = new container.Group(parentSelection)


    //// SINGLE METHOD ///

    // Class
    expect(myGroup.class()).toBe(null)
    expect(myGroup.class('class-1').class()).toBe('class-1')

    // ID
    expect(myGroup.id()).toBe(null)
    expect(myGroup.id('id-1').id()).toBe('id-1')



    //// CHAIN SYNTAX ////

    // ID and Class
    myGroup.class('M').id('Earth')
    expect(myGroup.class()).toBe('M')
    expect(myGroup.id()).toBe('Earth')

})


//// UPDATE CONTAINER REGISTRY ////

test ('Should update and query registry', () => {

    // Create a svg object that that the container can exist in
    const mySvg = new container.Svg(111, 222)
        , parentSelection = d3.select('body').select('svg')

    const myGroup = new container.Group(parentSelection)

    // Get initial value of registry
    expect(myGroup.objects()).toBeInstanceOf(Map)
    expect(myGroup.objects().size).toBe(0)


    const myRectangle = new shape.Rectangle()

    // Add item to registry (use two parameters)
    myGroup.objects('id-1', myRectangle)
    expect(myGroup.objects().size).toBe(1)
    expect(myGroup.objects().get('id-1').height()).toBe(50)
    expect(myGroup.objects().get('id-1').x()).toBe(0)


    // Get item from registry (use one parameter)
    expect(myGroup.objects('id-1').width()).toBe(50)
    expect(myGroup.objects('id-1').y()).toBe(0)

})





//// SVG /////////////////////////////////////////////////////////////////////////////////////////////////////////////


//// INSTANTIATE ///

test ('Should instantiate object', () => {

    const mySvg = new container.Svg()

    expect(mySvg).toBeDefined()

})


test ('Should get and set Svg width and height correctly in single and chain syntax', () => {

    const mySvg = new container.Svg()

    mySvg.width(111)
        .height(222)

    //// SINGLE METHOD ////

    // Get
    expect(mySvg.width()).toBe(111)
    expect(mySvg.height()).toBe(222)

    // Set (and then get to see what is set)
    expect(mySvg.width(11).width()).toBe(11)
    expect(mySvg.height(22).height()).toBe(22)


    //// CHAIN SYNTAX////

    // width().height()
    mySvg.width(33).height(44)
    expect(mySvg.width()).toBe(33)
    expect(mySvg.height()).toBe(44)

    // height().width()
    mySvg.height(888).width(999)
    expect(mySvg.width()).toBe(999)
    expect(mySvg.height()).toBe(888)


})
