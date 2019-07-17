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


//// PURE NODE DEPENDENCIES ////
require('../../../../JestUtils/jest-console')


//// UMD DEPENDENCIES ////

global.d3 = {
    ...require("../../external/d3/d3"),
    ...require("../../external/d3/d3-array")
}

global._ = require("../../external/lodash")


//// MODULE BEING TESTED IN CURRENT FILE ////
const domUtils = require("../domUtils")






//// UNIT TESTS /////////////////////////////////////////////////////////////////////////////////////////////////////////////


//// simulateClick() /////////////////////////////////////////////////////////////////////////////////////////////////////////////

test ('Detect clicks on a DOM elements', () => {

    // PREPARATION //

    // Clear DOM and create elements in it
    document.body.innerHTML = `<a>my link text<\a>`

    const myGroup = d3.select('body')
        .append('svg')
        .append('g')
          .attr('class', 'my-group')
          .attr('id', 'group-1')

    myGroup.append('rect')
      .attr('class', 'my-rectangle')
      .attr('id', 'rectangle-1')

    myGroup.append('rect')
       .attr('class', 'my-rectangle')
       .attr('id', 'rectangle-2')


    // Listen for clicks and record the type of the element clicked on
    let clickedElementTagName
    let clickedElementClassName
    let clickedElementId
    document.addEventListener('click', (event) => {
        clickedElementTagName = event.target.tagName
        clickedElementClassName = event.target.className.baseVal
        clickedElementId = event.target.id
    })



    // CLICK BY TAG NAME //

    // Simulate click on link
    domUtils.simulateClick(document.querySelector('a'))
    expect(clickedElementTagName).toBe('A')

    // Simulate click on SVG
    domUtils.simulateClick(document.querySelector('svg'))
    expect(clickedElementTagName).toBe('svg')

    // Simulate click on the first rectangle found in DOM
    domUtils.simulateClick(document.querySelector('rect'))
    expect(clickedElementTagName).toBe('rect')




    // CLICK BY CLASS //

    // Simulate click on the first '.my-rectangle' class element found in DOM
    domUtils.simulateClick(document.querySelector('.my-rectangle'))
    expect(clickedElementClassName).toBe('my-rectangle')




    // CLICK BY ID //

    domUtils.simulateClick(document.querySelector('#rectangle-1'))
    expect(clickedElementId).toBe('rectangle-1')

    domUtils.simulateClick(document.querySelector('#rectangle-2'))
    expect(clickedElementId).toBe('rectangle-2')




    // CLICK USING COMBINED SELECTORS //

    domUtils.simulateClick(document.querySelector('.my-group rect'))
    expect(clickedElementId).toBe('rectangle-1')




    // CLICKING ON NESTED OBJECTS
    // Click on a group, then click on a group element; both should produce the same effect

    // Prepare a listener specific to group
    myGroup.on('click', () => {
        console.log('Clicked on a group')
    })

    // Clear console history
    clearConsoleHistory()
    expectConsoleHistory(``)

    // Click on group
    domUtils.simulateClick(document.querySelector('#group-1'))
    expect(clickedElementId).toBe('group-1')
    expectConsoleHistory(`\
Clicked on a group\
`)

    // Click on a group element
    domUtils.simulateClick(document.querySelector('#rectangle-1'))
    expect(clickedElementId).toBe('rectangle-1')
    expectConsoleHistory(`\
Clicked on a group\
Clicked on a group\
`)

    // Click on another group element
    domUtils.simulateClick(document.querySelector('#rectangle-2'))
    expect(clickedElementId).toBe('rectangle-2')
    expectConsoleHistory(`\
Clicked on a group\
Clicked on a group\
Clicked on a group\
`)

    // Click on a group element using a different selector (tag name)
    domUtils.simulateClick(document.querySelector('rect'))
    expect(clickedElementTagName).toBe('rect')
    expectConsoleHistory(`\
Clicked on a group\
Clicked on a group\
Clicked on a group\
Clicked on a group\
`)

    // Click on a an element outside the group
    domUtils.simulateClick(document.querySelector('svg'))
    expect(clickedElementTagName).toBe('svg')
    expectConsoleHistory(`\
Clicked on a group\
Clicked on a group\
Clicked on a group\
Clicked on a group\
`)  // no change in console should happen

})




test ('Catch error if a bad selector is given', () => {

    // PREPARATION //

    // Clear DOM and create elements in it
    document.body.innerHTML = `<a>my link text<\a>`

    // Listen for clicks and record the type of the element clicked on
    let clickedElementTagName
    let clickedElementClassName
    let clickedElementId
    document.addEventListener('click', (event) => {
        clickedElementTagName = event.target.tagName
        clickedElementClassName = event.target.className.baseVal
        clickedElementId = event.target.id
    })



    // TEST SUCCESSFUL CLICKING //
    domUtils.simulateClick(document.querySelector('a'))
    expect(clickedElementTagName).toBe('A')


    // UNSUCCESSFUL CLICK DUE TO BAD ELEMENT PARAMETER => ERROR //
    expect( () => {
        domUtils.simulateClick(document.querySelector('b'))
    }).toThrow(`An invalid element is likely provided for the 'element' parameter. The provided 'element' is "null".`)

})





//// simulateClickOn() /////////////////////////////////////////////////////////////////////////////////////////////////////////////


test ('Detect clicks on a DOM elements', () => {

    // PREPARATION //

    // Clear DOM and create elements in it
    document.body.innerHTML = `<a>my link text<\a>`

    const myGroup = d3.select('body')
        .append('svg')
        .append('g')
        .attr('class', 'my-group')
        .attr('id', 'group-1')

    myGroup.append('rect')
        .attr('class', 'my-rectangle')
        .attr('id', 'rectangle-1')

    myGroup.append('rect')
        .attr('class', 'my-rectangle')
        .attr('id', 'rectangle-2')


    // Listen for clicks and record the type of the element clicked on
    let clickedElementTagName
    let clickedElementClassName
    let clickedElementId
    document.addEventListener('click', (event) => {
        clickedElementTagName = event.target.tagName
        clickedElementClassName = event.target.className.baseVal
        clickedElementId = event.target.id
    })



    // CLICK BY TAG NAME //

    // Simulate click on link
    domUtils.simulateClickOn('a')
    expect(clickedElementTagName).toBe('A')

    // Simulate click on SVG
    domUtils.simulateClickOn('svg')
    expect(clickedElementTagName).toBe('svg')

    // Simulate click on the first rectangle found in DOM
    domUtils.simulateClickOn('rect')
    expect(clickedElementTagName).toBe('rect')




    // CLICK BY CLASS //

    // Simulate click on the first '.my-rectangle' class element found in DOM
    domUtils.simulateClickOn('.my-rectangle')
    expect(clickedElementClassName).toBe('my-rectangle')




    // CLICK BY ID //

    domUtils.simulateClickOn('#rectangle-1')
    expect(clickedElementId).toBe('rectangle-1')

    domUtils.simulateClickOn('#rectangle-2')
    expect(clickedElementId).toBe('rectangle-2')




    // CLICK USING COMBINED SELECTORS //

    domUtils.simulateClickOn('.my-group rect')
    expect(clickedElementId).toBe('rectangle-1')




    // CLICKING ON NESTED OBJECTS
    // Click on a group, then click on a group element; both should produce the same effect

    // Prepare a listener specific to group
    myGroup.on('click', () => {
        console.log('Clicked on a group')
    })

    // Clear console history
    clearConsoleHistory()
    expectConsoleHistory(``)

    // Click on group
    domUtils.simulateClickOn('#group-1')
    expect(clickedElementId).toBe('group-1')
    expectConsoleHistory(`\
Clicked on a group\
`)

    // Click on a group element
    domUtils.simulateClickOn('#rectangle-1')
    expect(clickedElementId).toBe('rectangle-1')
    expectConsoleHistory(`\
Clicked on a group\
Clicked on a group\
`)

    // Click on another group element
    domUtils.simulateClickOn('#rectangle-2')
    expect(clickedElementId).toBe('rectangle-2')
    expectConsoleHistory(`\
Clicked on a group\
Clicked on a group\
Clicked on a group\
`)

    // Click on a group element using a different selector (tag name)
    domUtils.simulateClickOn('rect')
    expect(clickedElementTagName).toBe('rect')
    expectConsoleHistory(`\
Clicked on a group\
Clicked on a group\
Clicked on a group\
Clicked on a group\
`)

    // Click on a an element outside the group
    domUtils.simulateClickOn('svg')
    expect(clickedElementTagName).toBe('svg')
    expectConsoleHistory(`\
Clicked on a group\
Clicked on a group\
Clicked on a group\
Clicked on a group\
`)  // no change in console should happen

})




test ('Catch error if a bad selector is given', () => {

    // PREPARATION //

    // Clear DOM and create elements in it
    document.body.innerHTML = `<a>my link text<\a>`

    // Listen for clicks and record the type of the element clicked on
    let clickedElementTagName
    let clickedElementClassName
    let clickedElementId
    document.addEventListener('click', (event) => {
        clickedElementTagName = event.target.tagName
        clickedElementClassName = event.target.className.baseVal
        clickedElementId = event.target.id
    })



    // TEST SUCCESSFUL CLICKING //
    domUtils.simulateClickOn('a')
    expect(clickedElementTagName).toBe('A')


    // UNSUCCESSFUL CLICK DUE TO BAD ELEMENT PARAMETER => ERROR //
    expect( () => {
        domUtils.simulateClickOn('b')
    }).toThrow(`An invalid selectors string is likely provided for the 'selectors' parameter. The provided selector(s) was "b".`)

})

