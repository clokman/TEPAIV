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
//...

//// MODULES BEING TESTED ////
const jestConsole = require('../jest-console')
const expectTable = jestConsole.expectTable
const expectLog = jestConsole.expectLog
const clearConsoleHistory = jestConsole.clearConsoleHistory
const expectConsoleHistory = jestConsole.expectConsoleHistory
const destroyWarnings = jestConsole.destroyWarnings


global.d3 = {
    ...require("../external/d3/d3"),
    ...require("../external/d3/d3-array")
}
global._ = require("../external/lodash")


//// TESTS /////////////////////////////////////////////////////////////////////////////////////////////////////////////


//// EXPECT-TABLE() ////

test ('Tabulate variable and compare with expected output using a function', () => {

    const titanicDataset = [
        {name: "John",   status: "Survived",   gender: "Male", ticket: '1st class'},
        {name: "Carla",  status: "Survived", gender: "Female", ticket: '2nd class'},
        {name: "Jane", status: "Survived",  gender: "Female", ticket: '1st class'},
        {name: "Gertrude", status: "Survived",  gender: "Female", ticket: '1st class'},
        {name: "Bobby", status: "Survived",  gender: "Male", ticket: '2nd class'}
    ]

    expectTable(titanicDataset,`\
┌─────────┬────────────┬────────────┬──────────┬─────────────┐
│ (index) │    name    │   status   │  gender  │   ticket    │
├─────────┼────────────┼────────────┼──────────┼─────────────┤
│    0    │   'John'   │ 'Survived' │  'Male'  │ '1st class' │
│    1    │  'Carla'   │ 'Survived' │ 'Female' │ '2nd class' │
│    2    │   'Jane'   │ 'Survived' │ 'Female' │ '1st class' │
│    3    │ 'Gertrude' │ 'Survived' │ 'Female' │ '1st class' │
│    4    │  'Bobby'   │ 'Survived' │  'Male'  │ '2nd class' │
└─────────┴────────────┴────────────┴──────────┴─────────────┘`)

})


test ('Truncate table output', () => {

    const titanicDataset = [
        {name: "John",   status: "Survived",   gender: "Male", ticket: '1st class'},
        {name: "Carla",  status: "Survived", gender: "Female", ticket: '2nd class'},
        {name: "Jane", status: "Survived",  gender: "Female", ticket: '1st class'},
        {name: "Gertrude", status: "Survived",  gender: "Female", ticket: '1st class'},
        {name: "Bobby", status: "Survived",  gender: "Male", ticket: '2nd class'}
    ]

    expectTable(titanicDataset,`\
┌─────────┬────────────┬────────────┬──────────┬─────────────┐
│ (index) │    name    │   status   │  gender  │   ticket    │
├─────────┼────────────┼────────────┼──────────┼─────────────┤
│    0    │   'John'   │ 'Survived' │  'Male'  │ '1st class' │
│    1    │  'Carla'   │ 'Survived' │ 'Female' │ '2nd class' │
│    2    │   'Jane'   │ 'Survived' │ 'Female' │ '1st class' │
│    3    │ 'Gertrude' │ 'Survived' │ 'Female' │ '1st class' │
│    4    │  'Bobby'   │ 'Survived' │  'Male'  │ '2nd class' │
└─────────┴────────────┴────────────┴──────────┴─────────────┘`)

    expectTable(titanicDataset,`\
┌─────────┬─────────┬────────────┬──────────┬─────────────┐
│ (index) │  name   │   status   │  gender  │   ticket    │
├─────────┼─────────┼────────────┼──────────┼─────────────┤
│    0    │ 'John'  │ 'Survived' │  'Male'  │ '1st class' │
│    1    │ 'Carla' │ 'Survived' │ 'Female' │ '2nd class' │
└─────────┴─────────┴────────────┴──────────┴─────────────┘
˅˅˅ 3 more rows`, 0, 2)

})



//// TO-TABULATE-AS() ////

test('Tabulate and compare using JEST matcher', () => {

    // Tabulate array
    expect([1,2,3]).toTabulateAs(`\
┌─────────┬────────┐
│ (index) │ Values │
├─────────┼────────┤
│    0    │   1    │
│    1    │   2    │
│    2    │   3    │
└─────────┴────────┘`)

    // Tabulate object
    expect({'a':'first', 'b':'second'}).toTabulateAs(`\
┌─────────┬──────────┐
│ (index) │  Values  │
├─────────┼──────────┤
│    a    │ 'first'  │
│    b    │ 'second' │
└─────────┴──────────┘`)

})


//// TO-LOG-AS() ////

test('Log and compare using JEST matcher', () => {

    // Single-line log
    expect([1,2,3]).toLogAs(`[1,2,3]`)


    // Pretty log
    expect([1,2,3]).toLogAs(`\
[
  1,
  2,
  3
]`, 'pretty')
})


test ('expectLog()', () => {

    const titanicDataset = [
        {name: "John",   status: "Survived",   gender: "Male", ticket: '1st class'},
        {name: "Carla",  status: "Survived", gender: "Female", ticket: '2nd class'},
        {name: "Jane", status: "Survived",  gender: "Female", ticket: '1st class'},
        {name: "Gertrude", status: "Survived",  gender: "Female", ticket: '1st class'},
        {name: "Bobby", status: "Survived",  gender: "Male", ticket: '2nd class'}
    ]

    expectLog(titanicDataset[0], `\
{
  "name": "John",
  "status": "Survived",
  "gender": "Male",
  "ticket": "1st class"
}`, 'pretty')

})


test ('clearConsoleHistory()', () => {

    console.log('a')
    expect( jestConsole.getConsoleHistory() ).toBe( 'a' )

    clearConsoleHistory()
    expect( jestConsole.getConsoleHistory() ).toBe( '' )

    console.log('b')
    expect( jestConsole.getConsoleHistory() ).toBe( 'b' )

})


test ('expectConsoleHistory()', () => {

    clearConsoleHistory()


    // Log an item with console.log() and check it in history
    console.log('first log')
    expectConsoleHistory('first log')

    // Log another item and check it in history
    console.log('second log')
    expectConsoleHistory(`\
first log\
second log\
`)

    // Clear console history and see if comparison is OK afterward
    clearConsoleHistory()
    expectConsoleHistory(``)

    // Add a third item and check if comparison is OK
    console.log('third log')
    expectConsoleHistory(`third log`)

})



test ('Mocking warnings', () => {

    expectConsoleHistory('')

    console.warn('Warning: This is a warning!')

    expectConsoleHistory('Warning: This is a warning!')

    destroyWarnings()

})