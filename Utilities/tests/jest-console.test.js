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
│    0    │   [32m'John'[39m   │ [32m'Survived'[39m │  [32m'Male'[39m  │ [32m'1st class'[39m │
│    1    │  [32m'Carla'[39m   │ [32m'Survived'[39m │ [32m'Female'[39m │ [32m'2nd class'[39m │
│    2    │   [32m'Jane'[39m   │ [32m'Survived'[39m │ [32m'Female'[39m │ [32m'1st class'[39m │
│    3    │ [32m'Gertrude'[39m │ [32m'Survived'[39m │ [32m'Female'[39m │ [32m'1st class'[39m │
│    4    │  [32m'Bobby'[39m   │ [32m'Survived'[39m │  [32m'Male'[39m  │ [32m'2nd class'[39m │
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
│    0    │   [32m'John'[39m   │ [32m'Survived'[39m │  [32m'Male'[39m  │ [32m'1st class'[39m │
│    1    │  [32m'Carla'[39m   │ [32m'Survived'[39m │ [32m'Female'[39m │ [32m'2nd class'[39m │
│    2    │   [32m'Jane'[39m   │ [32m'Survived'[39m │ [32m'Female'[39m │ [32m'1st class'[39m │
│    3    │ [32m'Gertrude'[39m │ [32m'Survived'[39m │ [32m'Female'[39m │ [32m'1st class'[39m │
│    4    │  [32m'Bobby'[39m   │ [32m'Survived'[39m │  [32m'Male'[39m  │ [32m'2nd class'[39m │
└─────────┴────────────┴────────────┴──────────┴─────────────┘`)

    expectTable(titanicDataset,`\
┌─────────┬─────────┬────────────┬──────────┬─────────────┐
│ (index) │  name   │   status   │  gender  │   ticket    │
├─────────┼─────────┼────────────┼──────────┼─────────────┤
│    0    │ [32m'John'[39m  │ [32m'Survived'[39m │  [32m'Male'[39m  │ [32m'1st class'[39m │
│    1    │ [32m'Carla'[39m │ [32m'Survived'[39m │ [32m'Female'[39m │ [32m'2nd class'[39m │
└─────────┴─────────┴────────────┴──────────┴─────────────┘
... 3 more rows`, 2)

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

