
//// UNIT TESTS /////////////////////////////////////////////////////////////////////////////////////////////////////////////


//// INSTANTIATE ///

test ('new: Should instantiate object with default parameters', () => {

    const mySvg = new container.Svg()

    expect(mySvg).toBeDefined()

})

// TODO: Below test Works on HTML, but not in JEST.
// test ('new with custom parent: Should instantiate object with a custom parent', () => {
//
//     // Clear JEST's DOM to prevent leftovers from previous tests
//     document.body.innerHTML = ''
//
//     jest.useFakeTimers()
//
//
//     const myDiv = document.createElement('div')
//     const myDivD3Selection = d3.select('div')
//
//     const mySvg = new container.Svg(500,500, myDivD3Selection)
//
//    jest.runAllTimers()
//
//     expect(mySvg).toBeDefined()
//     expect( document.querySelector( 'svg' ).parentElement.tagName ).toBe()
//
// })

//// SELECT ///

test ("select(): Should return the D3 Selection to the svg object's corresponding DOM element" , () => {

    // Clear JEST's DOM to prevent leftovers from previous tests
    document.body.innerHTML = ''


    // Create an svg object
    const mySvg = new container.Svg(640, 480)
        , parentSelection = d3.select('body').select('svg')

    // Set a property on DOM using the selection
    mySvg.select().attr('id', 'my-svg')

    // Verify that the element is created in DOM and has the correct attribute
    expect(document.getElementById('my-svg').getAttribute('id'))
        .toBe('my-svg')

    // Get a property from DOM using the selection
    expect(mySvg.select().attr('id')).toBe('my-svg')


})


//// CLEAR ////


test ("clear(): Should remove all DOM objects in SVG" , () => {

    // Clear JEST's DOM to prevent leftovers from previous tests
    document.body.innerHTML = ''


    // Create an svg object
    const mySvg = new container.Svg()

    // Create child objects in svg
    const svgElement = document
        .getElementsByTagName('svg')[0]

    const myRect = document.createElement('rect')
    const myParagraph = document.createElement('p')
    svgElement.appendChild(myRect)
    svgElement.appendChild(myParagraph)

    // Verify that the element is created in DOM and has the correct attribute
    const numberOfElementsInSvgBeforeUsingClearMethod = svgElement
        .children.length
    expect(numberOfElementsInSvgBeforeUsingClearMethod).toBe(2)


    mySvg.clear()

    const numberOfElementsInSvgAfterUsingClearMethod = svgElement
        .children.length
    expect(numberOfElementsInSvgAfterUsingClearMethod).toBe(0)



})


//// HEIGHT AND WIDTH ////
test ('width()/height():Should get and set Svg width and height correctly in single and chain syntax', () => {

    // Clear JEST's DOM to prevent leftovers from previous tests
    document.body.innerHTML = ''


    const mySvg = new container.Svg()

    mySvg.width(111)
         .height(222)

    // SINGLE METHOD //

    // Get
    expect(mySvg.width()).toBe(111)
    expect(mySvg.height()).toBe(222)

    // Set (and then get to see what is set)
    expect(mySvg.width(11).width()).toBe(11)
    expect(mySvg.height(22).height()).toBe(22)


    // CHAIN SYNTAX //

    // width().height()
    mySvg.width(33).height(44)
    expect(mySvg.width()).toBe(33)
    expect(mySvg.height()).toBe(44)

    // height().width()
    mySvg.height(888).width(999)
    expect(mySvg.width()).toBe(999)
    expect(mySvg.height()).toBe(888)


})


//// UPDATE ////
test ('update(): Should update the corresponding DOM element of the Svg object', () => {

    // Clear JEST's DOM to prevent leftovers from previous tests
    document.body.innerHTML = ''


    // Instantiate a Svg object and set its attributes
    const mySvg = new container.Svg()

    mySvg.width(640)
        .height(480)
        .update()

    // Get height from the DOM counterpart of the Svg object and check if it is correct
    const height = document
        .getElementsByTagName('svg')[0]
        .getAttribute('height')
    expect(height).toBe("480")

    // Get width from the DOM counterpart of the Svg object and check if it is correct
    const width = document
        .getElementsByTagName('svg')[0]
        .getAttribute('width')
    expect(width).toBe("640")

})