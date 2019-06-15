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


//// MODULES BEING TESTED ////
//...





//// UNIT TESTS /////////////////////////////////////////////////////////////////////////////////////////////////////////////


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


    // SINGLE METHOD //

    // Class
    expect(myGroup.class()).toBe(null)
    expect(myGroup.class('class-1').class()).toBe('class-1')

    // ID
    expect(myGroup.id()).toBe(null)
    expect(myGroup.id('id-1').id()).toBe('id-1')



    // CHAIN SYNTAX //

    // ID and Class
    myGroup.class('M').id('Earth')
    expect(myGroup.class()).toBe('M')
    expect(myGroup.id()).toBe('Earth')

})


//// UPDATE CONTAINER REGISTRY ////

test ('Should update and query group registry', () => {

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


//// SELECT ///

test ("Should return a selection to the container's corresponding DOM element" , () => {

    // Clear JEST's DOM to prevent leftovers from previous tests
    document.body.innerHTML = ''


    // Create an svg object that that the group can exist in
    const mySvg = new container.Svg(111, 222)
        , parentSelection = d3.select('body').select('svg')

    // Initiate group instance
    const myGroup = new container.Group(parentSelection)
    myGroup.id('my-group').update()

    // Check if DOM counterpart of the group is created
    expect(document.getElementsByTagName('g').length)
        .toBe(1)
    expect(document.getElementsByTagName('g')[0]
        .getAttribute(('id')))
        .toBe('my-group')

    // Select the group's corresponding DOM element
    const groupSelection = myGroup.select()

    // Check if selection is correct and working
    expect(groupSelection.attr('id')).toBe('my-group')


})


/// REMOVE ///

test ("Should remove group's corresponding element in DOM", () => {

    // Clear JEST's DOM to prevent leftovers from previous tests
    document.body.innerHTML = ''

    // Create a svg object that that the container can exist in
    const mySvg = new container.Svg(111, 222)
        , parentSelection = d3.select('body').select('svg')

    // Initiate group instance
    const myGroup = new container.Group(parentSelection)
    myGroup.id('my-group').update()

    // Verify that a corresponding element exists in DOM
    expect(document.getElementById('my-group')).toBeDefined()

    // Remove element from DOM
    myGroup.remove()

    // Verify that the element is no more in DOM
    expect(document.getElementById('my-group')).toBe(null)

})


//// REMOVE CHILD OBJECTS/ELEMENTS ////

test ('Should remove the last item, and then all items from group registry and from DOM', () => {

    // Clear JEST's DOM to prevent leftovers from previous tests
    document.body.innerHTML = ''


    // Create an svg object that that the group can exist in
    const mySvg = new container.Svg(111, 222)
        , parentSelection = d3.select('body').select('svg')

    // Initiate group instance
    const myGroup = new container.Group(parentSelection)
    groupSelection = myGroup.select()


    // Make some objects
    const rectangle1 = new shape.Rectangle(groupSelection)
    const rectangle2 = new shape.Rectangle(groupSelection)
    const rectangle3 = new shape.Rectangle(groupSelection)
    const rectangle4 = new shape.Rectangle(groupSelection)
    const rectangle5 = new shape.Rectangle(groupSelection)
    const rectangle6 = new shape.Rectangle(groupSelection)

    // Add items to group registry
    myGroup.objects('rectangle-1', rectangle1)
    myGroup.objects('rectangle-2', rectangle2)
    myGroup.objects('rectangle-3', rectangle3)
    myGroup.objects('rectangle-4', rectangle4)
    myGroup.objects('rectangle-5', rectangle5)
    myGroup.objects('rectangle-6', rectangle6)

    // Check if objects exist
    expect(myGroup.objects().size).toBe(6)
    expect(myGroup.objects().get('rectangle-1')).toBeDefined()
    expect(myGroup.objects().get('rectangle-6')).toBeDefined()

    // Check if DOM counterparts of objects exist
    expect(document.getElementsByTagName('rect').length)
        .toBe(6)

    // REMOVE LAST N //

    // Remove one object
    myGroup.removeLast()

    // Verify removal of object
    expect(myGroup.objects().size).toBe(5)
    expect(myGroup.objects().get('rectangle-1')).toBeDefined()
    expect(myGroup.objects().get('rectangle-5')).toBeDefined()
    expect(myGroup.objects().get('rectangle-6')).not.toBeDefined()

    // Verify removal of corresponding DOM element
    expect(document.getElementsByTagName('rect').length)
        .toBe(5)


    // Remove multiple objects
    myGroup.removeLast(2)

    // Verify removal of objects
    expect(myGroup.objects().size).toBe(3)
    expect(myGroup.objects().get('rectangle-1')).toBeDefined()
    expect(myGroup.objects().get('rectangle-3')).toBeDefined()
    expect(myGroup.objects().get('rectangle-4')).not.toBeDefined()

    // Verify removal of corresponding DOM elements
    expect(document.getElementsByTagName('rect').length)
        .toBe(3)



    // REMOVE ALL //

    // Remove all objects
    myGroup.removeAll()

    // Verify removal of objects
    expect(myGroup.objects().size).toBe(0)
    expect(myGroup.objects().get('rectangle-1')).not.toBeDefined()

    // Verify removal of corresponding DOM elements
    expect(document.getElementsByTagName('rect').length)
        .toBe(0)

})

//// GET PARENT SELECTION FROM OBJECTS ////

test ('Should return a D3 Selection form various inputs ', () => {

    const svg = d3.select('body').append('svg')


    // If the parameter is already a D3 Selection, return it as it is
    const selectionFromSelection = container.Group.getD3SelectionFromVariousParameterTypes(svg)
    expect(classUtils.isInstanceOf(selectionFromSelection, 'Selection'))
        .toBe(true)



    const myGroup = new container.Group()

    // If an object with selection method is given as parameter, return the D3 Selection from this object
    const selectionFromSelectableObject = container.Group.getD3SelectionFromVariousParameterTypes(myGroup)
    expect(classUtils.isInstanceOf(selectionFromSelectableObject, 'Selection'))
        .toBe(true)

})