//// DEPENDENCIES /////////////////////////////////////////////////////////////////////////////////////////////////////////////

//// POLYFILLS ////

// Import polyfill for fetch() method
if (typeof fetch !== 'function') {
    global.fetch =  require('node-fetch-polyfill')
}

// Import polyfill for Object.fromEntries() method
if (typeof Object.fromEntries !== 'function') {
    Object.fromEntries = require('object.fromentries')
}

require('jest-canvas-mock')


//// PURE NODE DEPENDENCIES ////
const jestConsole = require('../../JestUtils/jest-console')
const expectConsoleHistory = jestConsole.expectConsoleHistory
const clearConsoleHistory = jestConsole.clearConsoleHistory

require('../../JestUtils/jest-dom')


//// UMD DEPENDENCIES ////
global.$ = require('../../CPC/libraries/external/jquery-3.1.1.min')

global.d3 = {
    ...require("../../CPC/libraries/external/d3/d3"),
    ...require("../../CPC/libraries/external/d3/d3-array")
}
// Disable d3 transitions
d3.selection.prototype.transition = jest.fn( function(){return this} )
d3.selection.prototype.duration = jest.fn( function(){return this} )

global._ = require("../../CPC/libraries/external/lodash")


//// EXTENSIONS ////
require("../../CPC/libraries/utils/errorUtils")
require("../../CPC/libraries/utils/jsUtils")
require("../../CPC/libraries/utils/mapUtils")

global.classUtils = require("../../CPC/libraries/utils/classUtils")
global.arrayUtils = require("../../CPC/libraries/utils/arrayUtils")
global.domUtils = require("../../CPC/libraries/utils/domUtils")
global.stringUtils = require("../../CPC/libraries/utils/stringUtils")

//// CPC CLASSES ////
global.data = require("../../CPC/libraries/cpc/data")
global.dataset = require("../../CPC/libraries/cpc/dataset")
global.container = require("../../CPC/libraries/cpc/container")
global.shape = require("../../CPC/libraries/cpc/shape")
const navigator = require("../../CPC/libraries/cpc/navigator")






//// TESTS /////////////////////////////////////////////////////////////////////////////////////////////////////////////

test ('Event delegation with D3 selectAll (listen all, filter later)', async () => {

    // Clear JEST's DOM to prevent leftovers from previous tests
    document.body.innerHTML = ''
    // Create SVG
    const mySvg = new container.Svg()
    // Create Navigator object
    const myNavigator = new navigator.Navigator()
    // Load a dataset into the navigator
    await myNavigator.loadDataset(
        'http://localhost:3000/libraries/cpc/tests/dataset/titanicSmall.csv',
        ['Name']
    )
    myNavigator.update()


    d3.selectAll("*").on('click', (d, i, g) => {

        const clickedElement = g[i]
        const clickedElementClass = g[i].getAttribute('class')

        if (clickedElementClass === 'background'){
            console.log('Clicked on a background')
        }

        if (clickedElementClass === 'category'){
            console.log('Clicked on a category')
        }

    })

    // writeDomToFile('/Users/jlokman/Projects/Code/TEPAIV/Learning Tests/d3/jest-dom-1.html')

    // Click on a background
    clearConsoleHistory()
    domUtils.simulateClickOn( '.background'  )
    expectConsoleHistory("Clicked on a background")

    // Click on a category
    clearConsoleHistory()
    domUtils.simulateClickOn( '.category'  )
    expectConsoleHistory("Clicked on a category")



})