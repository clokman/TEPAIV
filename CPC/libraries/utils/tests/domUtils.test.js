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
require("../../../../JestUtils/jest-dom")
require("../errorUtils")
require("../arrayUtils")





//// UNIT TESTS /////////////////////////////////////////////////////////////////////////////////////////////////////////////


//// SIMULATE CLICK ///////////////////////////////////////////////////////////////

describe ('SIMULATE CLICK', () => {



    test ('TAG NAME: Click by tag name: ', () => {

        // PREPARATION //
        clearDomAndCreateSampleContainerWithTwoRectangles()
        document.listenForClicksAndRecordLastClickProperties()

        // Simulate click on link
        domUtils.simulateClick(document.querySelector('a'))
        expect(document.lastClick.wasOnTag).toBe('A')

        // Simulate click on SVG
        domUtils.simulateClick(document.querySelector('svg'))
        expect(document.lastClick.wasOnTag).toBe('svg')

        // Simulate click on the first rectangle found in DOM
        domUtils.simulateClick(document.querySelector('rect'))
        expect(document.lastClick.wasOnTag).toBe('rect')

    })


    test ('CLASS: Click by class name', () => {

        // PREPARATION //
        clearDomAndCreateSampleContainerWithTwoRectangles()
        document.listenForClicksAndRecordLastClickProperties()


        // Simulate click on the first '.my-rectangle' class element found in DOM
        domUtils.simulateClick(document.querySelector('.my-rectangle'))
        expect(document.lastClick.wasOnClass).toBe('my-rectangle')

    })




    test ('ID: Click by element id', () => {

        // PREPARATION //
        clearDomAndCreateSampleContainerWithTwoRectangles()
        document.listenForClicksAndRecordLastClickProperties()


        domUtils.simulateClick(document.querySelector('#rectangle-1'))
        expect(document.lastClick.wasOnId).toBe('rectangle-1')

        domUtils.simulateClick(document.querySelector('#rectangle-2'))
        expect(document.lastClick.wasOnId).toBe('rectangle-2')


    })


    test ('COMBINED SELECTORS: Click using complex selectors', () => {

        // PREPARATION //
        clearDomAndCreateSampleContainerWithTwoRectangles()
        document.listenForClicksAndRecordLastClickProperties()


        domUtils.simulateClick(document.querySelector('.my-group rect'))
        expect(document.lastClick.wasOnId).toBe('rectangle-1')


    })


    test ('NESTED OBJECTS AND CONTAINERS: Click on nested objects', () => {

        // PREPARATION //
        const myGroup = clearDomAndCreateSampleContainerWithTwoRectangles()
        document.listenForClicksAndRecordLastClickProperties()


        // Prepare a listener specific to group
        myGroup.on('click', () => {
            console.log('Clicked on a group')
        })

        // Clear console history
        clearConsoleHistory()
        expectConsoleHistory(``)

        // Click on group
        domUtils.simulateClick(document.querySelector('#group-1'))
        expect(document.lastClick.wasOnId).toBe('group-1')
        expectConsoleHistory(`\
Clicked on a group\
`)

        // Click on a group element
        domUtils.simulateClick(document.querySelector('#rectangle-1'))
        expect(document.lastClick.wasOnId).toBe('rectangle-1')
        expectConsoleHistory(`\
Clicked on a group\
Clicked on a group\
`)

        // Click on another group element
        domUtils.simulateClick(document.querySelector('#rectangle-2'))
        expect(document.lastClick.wasOnId).toBe('rectangle-2')
        expectConsoleHistory(`\
Clicked on a group\
Clicked on a group\
Clicked on a group\
`)

        // Click on a group element using a different selector (tag name)
        domUtils.simulateClick(document.querySelector('rect'))
        expect(document.lastClick.wasOnTag).toBe('rect')
        expectConsoleHistory(`\
Clicked on a group\
Clicked on a group\
Clicked on a group\
Clicked on a group\
`)

        // Click on a an element outside the group
        domUtils.simulateClick(document.querySelector('svg'))
        expect(document.lastClick.wasOnTag).toBe('svg')
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
        document.listenForClicksAndRecordLastClickProperties()


        // CLICK WITH MODIFIER KEYS

        // Normal click
        domUtils.simulateClick(document.querySelector('rect'))
        expect(document.lastClick.wasWithShiftKey).toBe(false)

        // SHIFT + click
        domUtils.simulateClick(document.querySelector('rect'), 'shift')
        expect(document.lastClick.wasWithShiftKey).toBe(true)
        expect(document.lastClick.wasWithCtrlKey).toBe(false)
        expect(document.lastClick.wasWithAltKey).toBe(false)
        expect(document.lastClick.wasWithMetaKey).toBe(false)


        // CTRL + click
        domUtils.simulateClick(document.querySelector('rect'), 'ctrl')
        expect(document.lastClick.wasWithCtrlKey).toBe(true)
        expect(document.lastClick.wasWithShiftKey).toBe(false)
        expect(document.lastClick.wasWithAltKey).toBe(false)
        expect(document.lastClick.wasWithMetaKey).toBe(false)


        // ALT + click
        domUtils.simulateClick(document.querySelector('rect'), 'alt')
        expect(document.lastClick.wasWithAltKey).toBe(true)
        expect(document.lastClick.wasWithCtrlKey).toBe(false)
        expect(document.lastClick.wasWithShiftKey).toBe(false)
        expect(document.lastClick.wasWithMetaKey).toBe(false)


        // META + click
        domUtils.simulateClick(document.querySelector('rect'), 'meta')
        expect(document.lastClick.wasWithMetaKey).toBe(true)
        expect(document.lastClick.wasWithCtrlKey).toBe(false)
        expect(document.lastClick.wasWithShiftKey).toBe(false)
        expect(document.lastClick.wasWithAltKey).toBe(false)



    })


    test ('BAD SELECTOR: Catch error if a bad selector is given', () => {

        // PREPARATION //

        // Clear DOM and create elements in it
        document.body.innerHTML = `<a>my link text<\a>`

        // Listen for clicks and record the type of the element clicked on
        let wasOnTag
        let wasOnClass
        let wasOnId
        document.addEventListener('click', (event) => {
            wasOnTag = event.target.tagName
            wasOnClass = event.target.className.baseVal
            wasOnId = event.target.id
        })



        // TEST SUCCESSFUL CLICKING //
        domUtils.simulateClick(document.querySelector('a'))
        expect(wasOnTag).toBe('A')


        // UNSUCCESSFUL CLICK DUE TO BAD ELEMENT PARAMETER => ERROR //
        expect( () => {
            domUtils.simulateClick(document.querySelector('b'))
        }).toThrow(`An invalid element is likely provided for the 'element' parameter. The provided 'element' is "null".`)

    })


    test ('BAD MODIFIER KEY: Give error if a bad modifier name is provided as a parameter', () => {

        // PREPARATION //
        // Clear DOM and create elements in it
        document.body.innerHTML = `<a>my link text<\a>`
        document.listenForClicksAndRecordLastClickProperties()

        expect( document.lastClick ).toTabulateAs(`\
┌─────────────────┬────────┐
│     (index)     │ Values │
├─────────────────┼────────┤
│    wasOnTag     │  null  │
│   wasOnClass    │  null  │
│     wasOnId     │  null  │
│ wasWithShiftKey │ false  │
│ wasWithCtrlKey  │ false  │
│  wasWithAltKey  │ false  │
│ wasWithMetaKey  │ false  │
└─────────────────┴────────┘`)


        // Select element on DOM
        const element = document.querySelector( 'a' )

        // Click on the element
        domUtils.simulateClick(element)
        expect( document.lastClick.wasOnTag ).toBe( 'A' )
        expect( document.lastClick.wasWithShiftKey ).toBe( false )

        // Click on the element with a valid modifier key
        domUtils.simulateClick(element, 'shift')
        expect( document.lastClick.wasOnTag ).toBe( 'A' )
        expect( document.lastClick.wasWithShiftKey ).toBe( true )


        // Try to click with an invalid modifier key and fail
        expect( () => {
            domUtils.simulateClick('a', 'cmd')
        }).toThrow(`'cmd' is not a valid value. Expected values are: 'ctrl, alt, shift, meta'.`)

    })


})


//// SIMULATE CLICK ON ///////////////////////////////////////////////////////////////

describe ('SIMULATE CLICK ON', () => {

    test ('TAG: Simulate click by tag name', () => {

        // PREPARATION //
        clearDomAndCreateSampleContainerWithTwoRectangles()
        document.listenForClicksAndRecordLastClickProperties()

        // Simulate click on link
        domUtils.simulateClickOn('a')
        expect(document.lastClick.wasOnTag).toBe('A')

        // Simulate click on SVG
        domUtils.simulateClickOn('svg')
        expect(document.lastClick.wasOnTag).toBe('svg')

        // Simulate click on the first rectangle found in DOM
        domUtils.simulateClickOn('rect')
        expect(document.lastClick.wasOnTag).toBe('rect')

    })

    test ('CLASS: Simulate click by class name', () => {

        // PREPARATION //
        clearDomAndCreateSampleContainerWithTwoRectangles()
        document.listenForClicksAndRecordLastClickProperties()

        // Simulate click on the first '.my-rectangle' class element found in DOM
        domUtils.simulateClickOn('.my-rectangle')
        expect(document.lastClick.wasOnClass).toBe('my-rectangle')
    })

    test ('ID: Simulate click by ID', () => {

        // PREPARATION //
        clearDomAndCreateSampleContainerWithTwoRectangles()
        document.listenForClicksAndRecordLastClickProperties()

        domUtils.simulateClickOn('#rectangle-1')
        expect(document.lastClick.wasOnId).toBe('rectangle-1')

        domUtils.simulateClickOn('#rectangle-2')
        expect(document.lastClick.wasOnId).toBe('rectangle-2')

    })

    test ('COMBINED SELECTORS: Simulate click for complex selectors', () => {

        // PREPARATION //
        clearDomAndCreateSampleContainerWithTwoRectangles()
        document.listenForClicksAndRecordLastClickProperties()

        domUtils.simulateClickOn('.my-group rect')
        expect(document.lastClick.wasOnId).toBe('rectangle-1')

    })


    test ('NESTED ELEMENTS AND CONTAINERS: Click on a group, then click on a group element; both should produce the same effect', () => {

        // PREPARATION //
        let myGroup = clearDomAndCreateSampleContainerWithTwoRectangles()
        document.listenForClicksAndRecordLastClickProperties()

        // Prepare a listener specific to group
        myGroup.on('click', () => {
            console.log('Clicked on a group')
        })

        // Clear console history
        clearConsoleHistory()
        expectConsoleHistory(``)

        // Click on group
        domUtils.simulateClickOn('#group-1')
        expect(document.lastClick.wasOnId).toBe('group-1')
        expectConsoleHistory(`\
Clicked on a group\
`)

        // Click on a group element
        domUtils.simulateClickOn('#rectangle-1')
        expect(document.lastClick.wasOnId).toBe('rectangle-1')
        expectConsoleHistory(`\
Clicked on a group\
Clicked on a group\
`)

        // Click on another group element
        domUtils.simulateClickOn('#rectangle-2')
        expect(document.lastClick.wasOnId).toBe('rectangle-2')
        expectConsoleHistory(`\
Clicked on a group\
Clicked on a group\
Clicked on a group\
`)

        // Click on a group element using a different selector (tag name)
        domUtils.simulateClickOn('rect')
        expect(document.lastClick.wasOnTag).toBe('rect')
        expectConsoleHistory(`\
Clicked on a group\
Clicked on a group\
Clicked on a group\
Clicked on a group\
`)

        // Click on a an element outside the group
        domUtils.simulateClickOn('svg')
        expect(document.lastClick.wasOnTag).toBe('svg')
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
        document.listenForClicksAndRecordLastClickProperties()


        // CLICK WITH MODIFIER KEYS

        // Normal click
        domUtils.simulateClickOn('rect')
        expect(document.lastClick.wasWithShiftKey).toBe(false)


        // SHIFT + click
        domUtils.simulateClickOn('rect', 'shift')
        expect(document.lastClick.wasWithShiftKey).toBe(true)
        expect(document.lastClick.wasWithCtrlKey).toBe(false)
        expect(document.lastClick.wasWithAltKey).toBe(false)
        expect(document.lastClick.wasWithMetaKey).toBe(false)


        // CTRL + click
        domUtils.simulateClickOn('rect', 'ctrl')
        expect(document.lastClick.wasWithCtrlKey).toBe(true)
        expect(document.lastClick.wasWithShiftKey).toBe(false)
        expect(document.lastClick.wasWithAltKey).toBe(false)
        expect(document.lastClick.wasWithMetaKey).toBe(false)


        // ALT + click
        domUtils.simulateClickOn('rect', 'alt')
        expect(document.lastClick.wasWithAltKey).toBe(true)
        expect(document.lastClick.wasWithCtrlKey).toBe(false)
        expect(document.lastClick.wasWithShiftKey).toBe(false)
        expect(document.lastClick.wasWithMetaKey).toBe(false)


        // META + click
        domUtils.simulateClickOn('rect', 'meta')
        expect(document.lastClick.wasWithMetaKey).toBe(true)
        expect(document.lastClick.wasWithCtrlKey).toBe(false)
        expect(document.lastClick.wasWithShiftKey).toBe(false)
        expect(document.lastClick.wasWithAltKey).toBe(false)



    })



    test ('BAD SELECTOR: Catch error if a bad selector is given', () => {

        // PREPARATION
        // Clear DOM and create elements in it
        document.body.innerHTML = `<a>my link text<\a>`
        document.listenForClicksAndRecordLastClickProperties()


        // Test successful clicking
        domUtils.simulateClickOn('a')
        expect(document.lastClick.wasOnTag).toBe('A')


        // Unsuccessful click due to bad element parameter => Error
        expect( () => {
            domUtils.simulateClickOn('b')
        }).toThrow(`An invalid selectors string is likely provided for the 'selectors' parameter. The provided selector(s) was "b".`)

    })


    test ('BAD MODIFIER KEY: Give error if a bad modifier name is provided as a parameter', () => {

        // PREPARATION //
        // Clear DOM and create elements in it
        document.body.innerHTML = `<a>my link text<\a>`
        document.listenForClicksAndRecordLastClickProperties()

        expect( document.lastClick ).toTabulateAs(`\
┌─────────────────┬────────┐
│     (index)     │ Values │
├─────────────────┼────────┤
│    wasOnTag     │  null  │
│   wasOnClass    │  null  │
│     wasOnId     │  null  │
│ wasWithShiftKey │ false  │
│ wasWithCtrlKey  │ false  │
│  wasWithAltKey  │ false  │
│ wasWithMetaKey  │ false  │
└─────────────────┴────────┘`)
        
        
        // Click on the element
        domUtils.simulateClickOn('a')
        expect( document.lastClick.wasOnTag ).toBe( 'A' )
        expect( document.lastClick.wasWithShiftKey ).toBe( false )

        // Click on the element with a valid modifier key
        domUtils.simulateClickOn('a', 'shift')
        expect( document.lastClick.wasOnTag ).toBe( 'A' )
        expect( document.lastClick.wasWithShiftKey ).toBe( true )

        // Try to click with an invalid modifier key and fail
        expect( () => {
            domUtils.simulateClickOn('a', 'cmd')
        }).toThrow(`'cmd' is not a valid value. Expected values are: 'ctrl, alt, shift, meta'.`)


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
        .attr('fill', 'red')
        .attr('width', 100)
        .attr('height', 100)

    myGroup.append('rect')
        .attr('class', 'my-rectangle')
        .attr('id', 'rectangle-2')
        .attr('width', 100)
        .attr('height', 100)
        .attr('x', 100)

    return myGroup
}


//// LISTEN AND RECORD CLICKS ///////////////////////////////////////////////////////////////

describe ('LISTEN AND RECORD CLICKS', () => {
   
    test ('CLICK AND INQUIRE: Get information about the last click', () => {

        // PREPARATION //

        // Clear DOM and create elements in it
        clearDomAndCreateSampleContainerWithTwoRectangles()

        writeDomToFile('/Users/jlokman/Projects/Code/TEPAIV/CPC/libraries/cpc/tests/dom-out/2.html')

        document.listenForClicksAndRecordLastClickProperties()

        // Check initial properties
        expect( document.lastClick.wasOnTag ).toBe( null )
        expect( document.lastClick.wasOnClass ).toBe( null )
        expect( document.lastClick.wasOnId ).toBe( null )
        expect( document.lastClick.wasWithShiftKey ).toBe( false )
        expect( document.lastClick.wasWithCtrlKey ).toBe( false )
        expect( document.lastClick.wasWithAltKey ).toBe( false )
        expect( document.lastClick.wasWithMetaKey ).toBe( false )

        // Simulate normal click
        domUtils.simulateClickOn( '#rectangle-1')

        expect( document.lastClick.wasOnTag ).toBe( 'rect' )
        expect( document.lastClick.wasOnClass ).toBe( 'my-rectangle' )
        expect( document.lastClick.wasOnId ).toBe( 'rectangle-1' )
        expect( document.lastClick.wasWithShiftKey ).toBe( false )
        expect( document.lastClick.wasWithCtrlKey ).toBe( false )
        expect( document.lastClick.wasWithAltKey ).toBe( false )
        expect( document.lastClick.wasWithMetaKey ).toBe( false )


        // Simulate click with modifier: Shift
        domUtils.simulateClickOn( '#rectangle-1', 'shift')
        expect( document.lastClick.wasOnTag ).toBe( 'rect' )
        expect( document.lastClick.wasOnClass ).toBe( 'my-rectangle' )
        expect( document.lastClick.wasOnId ).toBe( 'rectangle-1' )
        expect( document.lastClick.wasWithShiftKey ).toBe( true )
        expect( document.lastClick.wasWithCtrlKey ).toBe( false )
        expect( document.lastClick.wasWithAltKey ).toBe( false )
        expect( document.lastClick.wasWithMetaKey ).toBe( false )


        // Simulate click with modifier: Ctrl
        domUtils.simulateClickOn( '#rectangle-1', 'ctrl')

        expect( document.lastClick.wasOnTag ).toBe( 'rect' )
        expect( document.lastClick.wasOnClass ).toBe( 'my-rectangle' )
        expect( document.lastClick.wasOnId ).toBe( 'rectangle-1' )
        expect( document.lastClick.wasWithShiftKey ).toBe( false )
        expect( document.lastClick.wasWithCtrlKey ).toBe( true )
        expect( document.lastClick.wasWithAltKey ).toBe( false )
        expect( document.lastClick.wasWithMetaKey ).toBe( false )


        // Simulate click with modifier: Alt
        domUtils.simulateClickOn( '#rectangle-1', 'alt')

        expect( document.lastClick.wasOnTag ).toBe( 'rect' )
        expect( document.lastClick.wasOnClass ).toBe( 'my-rectangle' )
        expect( document.lastClick.wasOnId ).toBe( 'rectangle-1' )
        expect( document.lastClick.wasWithShiftKey ).toBe( false )
        expect( document.lastClick.wasWithCtrlKey ).toBe( false )
        expect( document.lastClick.wasWithAltKey ).toBe( true )
        expect( document.lastClick.wasWithMetaKey ).toBe( false )


        // Simulate click with modifier: Meta
        domUtils.simulateClickOn( '#rectangle-1', 'meta')

        expect( document.lastClick.wasOnTag ).toBe( 'rect' )
        expect( document.lastClick.wasOnClass ).toBe( 'my-rectangle' )
        expect( document.lastClick.wasOnId ).toBe( 'rectangle-1' )
        expect( document.lastClick.wasWithShiftKey ).toBe( false )
        expect( document.lastClick.wasWithCtrlKey ).toBe( false )
        expect( document.lastClick.wasWithAltKey ).toBe( false )
        expect( document.lastClick.wasWithMetaKey ).toBe( true )

    })
    

})