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


//// SIMULATE CLICK ///////////////////////////////////////////////////////////////

describe ('SIMULATE CLICK', () => {



    test ('TAG NAME: Click by tag name: ', () => {

        // PREPARATION //
        clearDomAndCreateSampleContainerWithTwoRectangles()
        const lastClickProperties = listenForClicksAndRecordPropertiesOfLastClickToVariable()


        // Simulate click on link
        domUtils.simulateClick(document.querySelector('a'))
        expect(lastClickProperties.clickedElementTagName).toBe('A')

        // Simulate click on SVG
        domUtils.simulateClick(document.querySelector('svg'))
        expect(lastClickProperties.clickedElementTagName).toBe('svg')

        // Simulate click on the first rectangle found in DOM
        domUtils.simulateClick(document.querySelector('rect'))
        expect(lastClickProperties.clickedElementTagName).toBe('rect')

    })


    test ('CLASS: Click by class name', () => {

        // PREPARATION //
        clearDomAndCreateSampleContainerWithTwoRectangles()
        const lastClickProperties = listenForClicksAndRecordPropertiesOfLastClickToVariable()


        // Simulate click on the first '.my-rectangle' class element found in DOM
        domUtils.simulateClick(document.querySelector('.my-rectangle'))
        expect(lastClickProperties.clickedElementClassName).toBe('my-rectangle')

    })




    test ('ID: Click by element id', () => {

        // PREPARATION //
        clearDomAndCreateSampleContainerWithTwoRectangles()
        const lastClickProperties = listenForClicksAndRecordPropertiesOfLastClickToVariable()


        domUtils.simulateClick(document.querySelector('#rectangle-1'))
        expect(lastClickProperties.clickedElementId).toBe('rectangle-1')

        domUtils.simulateClick(document.querySelector('#rectangle-2'))
        expect(lastClickProperties.clickedElementId).toBe('rectangle-2')


    })


    test ('COMBINED SELECTORS: Click using complex selectors', () => {

        // PREPARATION //
        clearDomAndCreateSampleContainerWithTwoRectangles()
        const lastClickProperties = listenForClicksAndRecordPropertiesOfLastClickToVariable()


        domUtils.simulateClick(document.querySelector('.my-group rect'))
        expect(lastClickProperties.clickedElementId).toBe('rectangle-1')


    })


    test ('NESTED OBJECTS AND CONTAINERS: Click on nested objects', () => {

        // PREPARATION //
        const myGroup = clearDomAndCreateSampleContainerWithTwoRectangles()
        const lastClickProperties = listenForClicksAndRecordPropertiesOfLastClickToVariable()


        // Prepare a listener specific to group
        myGroup.on('click', () => {
            console.log('Clicked on a group')
        })

        // Clear console history
        clearConsoleHistory()
        expectConsoleHistory(``)

        // Click on group
        domUtils.simulateClick(document.querySelector('#group-1'))
        expect(lastClickProperties.clickedElementId).toBe('group-1')
        expectConsoleHistory(`\
Clicked on a group\
`)

        // Click on a group element
        domUtils.simulateClick(document.querySelector('#rectangle-1'))
        expect(lastClickProperties.clickedElementId).toBe('rectangle-1')
        expectConsoleHistory(`\
Clicked on a group\
Clicked on a group\
`)

        // Click on another group element
        domUtils.simulateClick(document.querySelector('#rectangle-2'))
        expect(lastClickProperties.clickedElementId).toBe('rectangle-2')
        expectConsoleHistory(`\
Clicked on a group\
Clicked on a group\
Clicked on a group\
`)

        // Click on a group element using a different selector (tag name)
        domUtils.simulateClick(document.querySelector('rect'))
        expect(lastClickProperties.clickedElementTagName).toBe('rect')
        expectConsoleHistory(`\
Clicked on a group\
Clicked on a group\
Clicked on a group\
Clicked on a group\
`)

        // Click on a an element outside the group
        domUtils.simulateClick(document.querySelector('svg'))
        expect(lastClickProperties.clickedElementTagName).toBe('svg')
        expectConsoleHistory(`\
Clicked on a group\
Clicked on a group\
Clicked on a group\
Clicked on a group\
`)  // no change in console should happen

    })



    test ('MODIFIER KEYS: Simulate clicks with modifier keys', () => {

        // PREP //
        clearDomAndCreateSampleContainerWithTwoRectangles()
        let lastClickProperties = listenForClicksAndRecordPropertiesOfLastClickToVariable()


        // CLICK WITH MODIFIER KEYS

        // Normal click
        domUtils.simulateClick(document.querySelector('rect'))
        expect(lastClickProperties.pressedShiftKey).toBe(false)

        // SHIFT + click
        domUtils.simulateClick(document.querySelector('rect'), 'shift')
        expect(lastClickProperties.pressedShiftKey).toBe(true)
        expect(lastClickProperties.pressedCtrlKey).toBe(false)
        expect(lastClickProperties.pressedAltKey).toBe(false)
        expect(lastClickProperties.pressedMetaKey).toBe(false)


        // CTRL + click
        domUtils.simulateClick(document.querySelector('rect'), 'ctrl')
        expect(lastClickProperties.pressedCtrlKey).toBe(true)
        expect(lastClickProperties.pressedShiftKey).toBe(false)
        expect(lastClickProperties.pressedAltKey).toBe(false)
        expect(lastClickProperties.pressedMetaKey).toBe(false)


        // ALT + click
        domUtils.simulateClick(document.querySelector('rect'), 'alt')
        expect(lastClickProperties.pressedAltKey).toBe(true)
        expect(lastClickProperties.pressedCtrlKey).toBe(false)
        expect(lastClickProperties.pressedShiftKey).toBe(false)
        expect(lastClickProperties.pressedMetaKey).toBe(false)


        // META + click
        domUtils.simulateClick(document.querySelector('rect'), 'meta')
        expect(lastClickProperties.pressedMetaKey).toBe(true)
        expect(lastClickProperties.pressedCtrlKey).toBe(false)
        expect(lastClickProperties.pressedShiftKey).toBe(false)
        expect(lastClickProperties.pressedAltKey).toBe(false)



    })


    test ('BAD SELECTOR: Catch error if a bad selector is given', () => {

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





})


//// SIMULATE CLICK ON ///////////////////////////////////////////////////////////////

describe ('SIMULATE CLICK ON', () => {

    test ('TAG: Simulate click by tag name', () => {

        // PREPARATION //
        clearDomAndCreateSampleContainerWithTwoRectangles()
        const lastClickProperties = listenForClicksAndRecordPropertiesOfLastClickToVariable()

        // Simulate click on link
        domUtils.simulateClickOn('a')
        expect(lastClickProperties.clickedElementTagName).toBe('A')

        // Simulate click on SVG
        domUtils.simulateClickOn('svg')
        expect(lastClickProperties.clickedElementTagName).toBe('svg')

        // Simulate click on the first rectangle found in DOM
        domUtils.simulateClickOn('rect')
        expect(lastClickProperties.clickedElementTagName).toBe('rect')

    })

    test ('CLASS: Simulate click by class name', () => {

        // PREPARATION //
        clearDomAndCreateSampleContainerWithTwoRectangles()
        const lastClickProperties = listenForClicksAndRecordPropertiesOfLastClickToVariable()

        // Simulate click on the first '.my-rectangle' class element found in DOM
        domUtils.simulateClickOn('.my-rectangle')
        expect(lastClickProperties.clickedElementClassName).toBe('my-rectangle')
    })

    test ('ID: Simulate click by ID', () => {

        // PREPARATION //
        clearDomAndCreateSampleContainerWithTwoRectangles()
        const lastClickProperties = listenForClicksAndRecordPropertiesOfLastClickToVariable()

        domUtils.simulateClickOn('#rectangle-1')
        expect(lastClickProperties.clickedElementId).toBe('rectangle-1')

        domUtils.simulateClickOn('#rectangle-2')
        expect(lastClickProperties.clickedElementId).toBe('rectangle-2')

    })

    test ('COMBINED SELECTORS: Simulate click for complex selectors', () => {

        // PREPARATION //
        clearDomAndCreateSampleContainerWithTwoRectangles()
        const lastClickProperties = listenForClicksAndRecordPropertiesOfLastClickToVariable()

        domUtils.simulateClickOn('.my-group rect')
        expect(lastClickProperties.clickedElementId).toBe('rectangle-1')

    })


    test ('NESTED ELEMENTS AND CONTAINERS: Click on a group, then click on a group element; both should produce the same effect', () => {

        // PREPARATION //
        myGroup = clearDomAndCreateSampleContainerWithTwoRectangles()
        const lastClickProperties = listenForClicksAndRecordPropertiesOfLastClickToVariable()

        // Prepare a listener specific to group
        myGroup.on('click', () => {
            console.log('Clicked on a group')
        })

        // Clear console history
        clearConsoleHistory()
        expectConsoleHistory(``)

        // Click on group
        domUtils.simulateClickOn('#group-1')
        expect(lastClickProperties.clickedElementId).toBe('group-1')
        expectConsoleHistory(`\
Clicked on a group\
`)

        // Click on a group element
        domUtils.simulateClickOn('#rectangle-1')
        expect(lastClickProperties.clickedElementId).toBe('rectangle-1')
        expectConsoleHistory(`\
Clicked on a group\
Clicked on a group\
`)

        // Click on another group element
        domUtils.simulateClickOn('#rectangle-2')
        expect(lastClickProperties.clickedElementId).toBe('rectangle-2')
        expectConsoleHistory(`\
Clicked on a group\
Clicked on a group\
Clicked on a group\
`)

        // Click on a group element using a different selector (tag name)
        domUtils.simulateClickOn('rect')
        expect(lastClickProperties.clickedElementTagName).toBe('rect')
        expectConsoleHistory(`\
Clicked on a group\
Clicked on a group\
Clicked on a group\
Clicked on a group\
`)

        // Click on a an element outside the group
        domUtils.simulateClickOn('svg')
        expect(lastClickProperties.clickedElementTagName).toBe('svg')
        expectConsoleHistory(`\
Clicked on a group\
Clicked on a group\
Clicked on a group\
Clicked on a group\
`)  // no change in console should happen

    })



    test ('MODIFIER KEYS: Simulate clicks with modifier keys', () => {

        // PREP //
        clearDomAndCreateSampleContainerWithTwoRectangles()
        let lastClickProperties = listenForClicksAndRecordPropertiesOfLastClickToVariable()


        // CLICK WITH MODIFIER KEYS

        // Normal click
        domUtils.simulateClickOn('rect')
        expect(lastClickProperties.pressedShiftKey).toBe(false)


        // SHIFT + click
        domUtils.simulateClickOn('rect', 'shift')
        expect(lastClickProperties.pressedShiftKey).toBe(true)
        expect(lastClickProperties.pressedCtrlKey).toBe(false)
        expect(lastClickProperties.pressedAltKey).toBe(false)
        expect(lastClickProperties.pressedMetaKey).toBe(false)


        // CTRL + click
        domUtils.simulateClickOn('rect', 'ctrl')
        expect(lastClickProperties.pressedCtrlKey).toBe(true)
        expect(lastClickProperties.pressedShiftKey).toBe(false)
        expect(lastClickProperties.pressedAltKey).toBe(false)
        expect(lastClickProperties.pressedMetaKey).toBe(false)


        // ALT + click
        domUtils.simulateClickOn('rect', 'alt')
        expect(lastClickProperties.pressedAltKey).toBe(true)
        expect(lastClickProperties.pressedCtrlKey).toBe(false)
        expect(lastClickProperties.pressedShiftKey).toBe(false)
        expect(lastClickProperties.pressedMetaKey).toBe(false)


        // META + click
        domUtils.simulateClickOn('rect', 'meta')
        expect(lastClickProperties.pressedMetaKey).toBe(true)
        expect(lastClickProperties.pressedCtrlKey).toBe(false)
        expect(lastClickProperties.pressedShiftKey).toBe(false)
        expect(lastClickProperties.pressedAltKey).toBe(false)



    })



    test ('BAD SELECTOR: Catch error if a bad selector is given', () => {

        // PREPARATION //
        // Clear DOM and create elements in it
        document.body.innerHTML = `<a>my link text<\a>`
        const lastClickProperties = listenForClicksAndRecordPropertiesOfLastClickToVariable()


        // TEST SUCCESSFUL CLICKING //
        domUtils.simulateClickOn('a')
        expect(lastClickProperties.clickedElementTagName).toBe('A')


        // UNSUCCESSFUL CLICK DUE TO BAD ELEMENT PARAMETER => ERROR //
        expect( () => {
            domUtils.simulateClickOn('b')
        }).toThrow(`An invalid selectors string is likely provided for the 'selectors' parameter. The provided selector(s) was "b".`)

    })



})



// HELPER FUNCTIONS FOR TESTS

function clearDomAndCreateSampleContainerWithTwoRectangles() {

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

    return myGroup
}


function listenForClicksAndRecordPropertiesOfLastClickToVariable() {
    // Listen for clicks and record the type of the element clicked on
    let lastClickProperties = {}
    document.addEventListener('click', (event) => {
        lastClickProperties.clickedElementTagName = event.target.tagName
        lastClickProperties.clickedElementClassName = event.target.className.baseVal
        lastClickProperties.clickedElementId = event.target.id
        lastClickProperties.pressedShiftKey = event.shiftKey
        lastClickProperties.pressedCtrlKey = event.ctrlKey
        lastClickProperties.pressedAltKey = event.altKey
        lastClickProperties.pressedMetaKey = event.metaKey

    })
    return lastClickProperties
}
