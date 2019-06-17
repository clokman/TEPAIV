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
require('../jest-console')


global.d3 = {
    ...require("../../Learning Tests/libraries/d3/d3"),
    ...require("../../Learning Tests/libraries/d3/d3-array")
}

global._ = require("../../Learning Tests/libraries/lodash")



//// TESTS /////////////////////////////////////////////////////////////////////////////////////////////////////////////

test ('Table output', () => {

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




test ('Line output', () => {

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
}`)

})


test ('Clear console history', () => {

    consoleHistory = ''

    console.log('a')
    expect(consoleHistory).toBe('a')

    clearConsoleHistory()
    expect(consoleHistory).toBe('')

    console.log('b')
    expect(consoleHistory).toBe('b')

})

