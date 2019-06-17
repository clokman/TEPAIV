//// IMPORTS /////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Import polyfill for fetch() method
if (typeof fetch !== 'function') {
    global.fetch =  require('node-fetch-polyfill')
}

// Import polyfill for Object.fromEntries() method
if (typeof Object.fromEntries !== 'function') {
    Object.fromEntries = require('object.fromentries')
}

// NODE-ONLY DEPENDENCIES //
require("../../../../../Utilities/jest-console")


// UMD DEPENDENCIES //
global.d3 = {
    ...require("../../../external/d3/d3"),
    ...require("../../../external/d3/d3-array")
}
global._ = require("../../../external/lodash")

global.str = require("../../str")
global.arrayUtils = require("../../../../../Utilities/arrayUtils")


// THE MODULE BEING TESTED //
const data = require("../../data")






//// UNIT TESTS /////////////////////////////////////////////////////////////////////////////////////////////////////////////


//// INITIATE ////

test ('Instantiate the class with initial sample data and summary statistics' , () => {

    const myStacks = new data.Stacks()

    expect(myStacks).toBeDefined()


    expectTable(myStacks.data(), `\
┌───────────────────┬──────────┬──────────────────────────────────────────────┐
│ (iteration index) │   Key    │                    Values                    │
├───────────────────┼──────────┼──────────────────────────────────────────────┤
│         0         │ 'gender' │ Stack { _data: [Map], _scaleFunction: null } │
│         1         │ 'class'  │ Stack { _data: [Map], _scaleFunction: null } │
│         2         │ 'status' │ Stack { _data: [Map], _scaleFunction: null } │
└───────────────────┴──────────┴──────────────────────────────────────────────┘`)
    expectTable(myStacks.data('gender').data('male'), `\
┌───────────────────┬──────────────┬────────┐
│ (iteration index) │     Key      │ Values │
├───────────────────┼──────────────┼────────┤
│         0         │   'label'    │ 'Male' │
│         1         │   'start'    │   0    │
│         2         │    'end'     │   64   │
│         3         │ 'percentage' │   64   │
└───────────────────┴──────────────┴────────┘`)
    expectTable(myStacks.data('class').data('first-class'), `\
┌───────────────────┬──────────────┬───────────────┐
│ (iteration index) │     Key      │    Values     │
├───────────────────┼──────────────┼───────────────┤
│         0         │   'label'    │ 'First Class' │
│         1         │   'start'    │       0       │
│         2         │    'end'     │      25       │
│         3         │ 'percentage' │      25       │
└───────────────────┴──────────────┴───────────────┘`)
    expectTable(myStacks.data('status').data('survived'), `\
┌───────────────────┬──────────────┬────────────┐
│ (iteration index) │     Key      │   Values   │
├───────────────────┼──────────────┼────────────┤
│         0         │   'label'    │ 'Survived' │
│         1         │   'start'    │     0      │
│         2         │    'end'     │     38     │
│         3         │ 'percentage' │     38     │
└───────────────────┴──────────────┴────────────┘`)

})




// GET/SET/QUERY DATA ////

test ('Return the data in Stacks' , () => {

    const myStacks = new data.Stacks()

    expect(myStacks.data().size).toBe(3)

    expectTable(myStacks.data(), `\
┌───────────────────┬──────────┬──────────────────────────────────────────────┐
│ (iteration index) │   Key    │                    Values                    │
├───────────────────┼──────────┼──────────────────────────────────────────────┤
│         0         │ 'gender' │ Stack { _data: [Map], _scaleFunction: null } │
│         1         │ 'class'  │ Stack { _data: [Map], _scaleFunction: null } │
│         2         │ 'status' │ Stack { _data: [Map], _scaleFunction: null } │
└───────────────────┴──────────┴──────────────────────────────────────────────┘`)


})




test ('Set new data for Stacks', () => {

    const myStacks = new data.Stacks()


    // Check initial Stacks data
    expectTable(myStacks.data(), `\
┌───────────────────┬──────────┬──────────────────────────────────────────────┐
│ (iteration index) │   Key    │                    Values                    │
├───────────────────┼──────────┼──────────────────────────────────────────────┤
│         0         │ 'gender' │ Stack { _data: [Map], _scaleFunction: null } │
│         1         │ 'class'  │ Stack { _data: [Map], _scaleFunction: null } │
│         2         │ 'status' │ Stack { _data: [Map], _scaleFunction: null } │
└───────────────────┴──────────┴──────────────────────────────────────────────┘`)


    // Generate new data
    const genericStack = new data.Stack()
    map = new Map()
        .set('generic', genericStack)

    // Add new data to stacks
    myStacks.data(map)

    expectTable(myStacks.data(), `\
┌───────────────────┬───────────┬──────────────────────────────────────────────┐
│ (iteration index) │    Key    │                    Values                    │
├───────────────────┼───────────┼──────────────────────────────────────────────┤
│         0         │ 'generic' │ Stack { _data: [Map], _scaleFunction: null } │
└───────────────────┴───────────┴──────────────────────────────────────────────┘`)

})




test ('Add a new Stack to Stacks', () => {

    const myStacks = new data.Stacks()


    // Check initial Stacks data
    expectTable(myStacks.data(), `\
┌───────────────────┬──────────┬──────────────────────────────────────────────┐
│ (iteration index) │   Key    │                    Values                    │
├───────────────────┼──────────┼──────────────────────────────────────────────┤
│         0         │ 'gender' │ Stack { _data: [Map], _scaleFunction: null } │
│         1         │ 'class'  │ Stack { _data: [Map], _scaleFunction: null } │
│         2         │ 'status' │ Stack { _data: [Map], _scaleFunction: null } │
└───────────────────┴──────────┴──────────────────────────────────────────────┘`)


    // Generate new Stack
    const genericStack = new data.Stack()

    // Add new Stack to Stacks
    myStacks.add('generic', genericStack)

    expectTable(myStacks.data(), `\
┌───────────────────┬───────────┬──────────────────────────────────────────────┐
│ (iteration index) │    Key    │                    Values                    │
├───────────────────┼───────────┼──────────────────────────────────────────────┤
│         0         │ 'gender'  │ Stack { _data: [Map], _scaleFunction: null } │
│         1         │  'class'  │ Stack { _data: [Map], _scaleFunction: null } │
│         2         │ 'status'  │ Stack { _data: [Map], _scaleFunction: null } │
│         3         │ 'generic' │ Stack { _data: [Map], _scaleFunction: null } │
└───────────────────┴───────────┴──────────────────────────────────────────────┘`)

})




test ('Should query the data in Stacks', () => {

    const myStacks = new data.Stacks()

    // Check initial Stacks data
    expectTable(myStacks.data(), `\
┌───────────────────┬──────────┬──────────────────────────────────────────────┐
│ (iteration index) │   Key    │                    Values                    │
├───────────────────┼──────────┼──────────────────────────────────────────────┤
│         0         │ 'gender' │ Stack { _data: [Map], _scaleFunction: null } │
│         1         │ 'class'  │ Stack { _data: [Map], _scaleFunction: null } │
│         2         │ 'status' │ Stack { _data: [Map], _scaleFunction: null } │
└───────────────────┴──────────┴──────────────────────────────────────────────┘`)


    expectTable(myStacks.data('status'), `\
┌────────────────┬────────┐
│    (index)     │ Values │
├────────────────┼────────┤
│     _data      │        │
│ _scaleFunction │  null  │
└────────────────┴────────┘`)

    expectTable(myStacks.data('status').data('survived'), `\
┌───────────────────┬──────────────┬────────────┐
│ (iteration index) │     Key      │   Values   │
├───────────────────┼──────────────┼────────────┤
│         0         │   'label'    │ 'Survived' │
│         1         │   'start'    │     0      │
│         2         │    'end'     │     38     │
│         3         │ 'percentage' │     38     │
└───────────────────┴──────────────┴────────────┘`)


})





//// IMPORT NESTED MAP ////

test ('Convert a nested map object to a Stack', () => {

    // Create a Stacks object
    const myStacks = new data.Stacks()

    expectTable(myStacks.data(), `\
┌───────────────────┬──────────┬──────────────────────────────────────────────┐
│ (iteration index) │   Key    │                    Values                    │
├───────────────────┼──────────┼──────────────────────────────────────────────┤
│         0         │ 'gender' │ Stack { _data: [Map], _scaleFunction: null } │
│         1         │ 'class'  │ Stack { _data: [Map], _scaleFunction: null } │
│         2         │ 'status' │ Stack { _data: [Map], _scaleFunction: null } │
└───────────────────┴──────────┴──────────────────────────────────────────────┘`)


    // Create a nested map
    const myNestedMap = new Map([
        ['Class',
            new Map([ ['First', 323], ['Second', 277], ['Third', 709] ])
        ],
        ['Sex',
            new Map([ ['M', 843], ['F', 466] ])
        ],
        ['Survival',
            new Map([ ['Y', 500], ['N', 843] ])
        ]
    ])

    expectTable(myNestedMap, `\
┌───────────────────┬────────────┬─────────────────────────────────────────────────────────┐
│ (iteration index) │    Key     │                         Values                          │
├───────────────────┼────────────┼─────────────────────────────────────────────────────────┤
│         0         │  'Class'   │ Map { 'First' => 323, 'Second' => 277, 'Third' => 709 } │
│         1         │   'Sex'    │             Map { 'M' => 843, 'F' => 466 }              │
│         2         │ 'Survival' │             Map { 'Y' => 500, 'N' => 843 }              │
└───────────────────┴────────────┴─────────────────────────────────────────────────────────┘`)


    // Replace the data in the Stacks object with the nested map
    myStacks.fromNestedMap(myNestedMap)

    expectTable(myStacks.data(), `\
┌───────────────────┬────────────┬──────────────────────────────────────────────┐
│ (iteration index) │    Key     │                    Values                    │
├───────────────────┼────────────┼──────────────────────────────────────────────┤
│         0         │  'Class'   │ Stack { _data: [Map], _scaleFunction: null } │
│         1         │   'Sex'    │ Stack { _data: [Map], _scaleFunction: null } │
│         2         │ 'Survival' │ Stack { _data: [Map], _scaleFunction: null } │
└───────────────────┴────────────┴──────────────────────────────────────────────┘`)

    // Probe a Stack in the newly set Stacks data
    expectTable(myStacks.data('Class'), `\
┌────────────────┬────────┐
│    (index)     │ Values │
├────────────────┼────────┤
│     _data      │        │
│ _scaleFunction │  null  │
└────────────────┴────────┘`)
    expectTable(myStacks.data('Class').data('First'), `\
┌───────────────────┬──────────────┬─────────┐
│ (iteration index) │     Key      │ Values  │
├───────────────────┼──────────────┼─────────┤
│         0         │   'label'    │ 'First' │
│         1         │   'count'    │   323   │
│         2         │ 'percentage' │  24.7   │
│         3         │   'start'    │    0    │
│         4         │    'end'     │   323   │
└───────────────────┴──────────────┴─────────┘`)

})




