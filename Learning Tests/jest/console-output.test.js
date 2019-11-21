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
//...


//// TESTS /////////////////////////////////////////////////////////////////////////////////////////////////////////////

let consoleHistory = ''
  , lastConsoleOutput = ''

console["log"] = jest.fn(input => {
    lastConsoleOutput = input
    consoleHistory += input
})


test("View console history", () => {

    console.log("Hello World")
    expect(consoleHistory).toBe("Hello World")

    console.log(". Hi again")
    expect(consoleHistory).toBe("Hello World. Hi again")

})


test("Clear console history", () => {

    consoleHistory = ''

    console.log("An entirely new entry")

    expect(consoleHistory).toBe("An entirely new entry")

})

test("View last item in console", () => {

    // Console history is not reset

    consoleHistory = ''

    console.log("First entry")
    console.log(", ")
    console.log("Second entry")

    expect(lastConsoleOutput).toBe('Second entry')
    expect(consoleHistory).toBe("First entry, Second entry")

})



test ('Table output', () => {

    const titanicDataset = [
        {name: "John",   status: "Survived",   gender: "Male", ticket: '1st class'},
        {name: "Carla",  status: "Survived", gender: "Female", ticket: '2nd class'},
        {name: "Jane", status: "Survived",  gender: "Female", ticket: '1st class'},
        {name: "Gertrude", status: "Survived",  gender: "Female", ticket: '1st class'},
        {name: "Bobby", status: "Survived",  gender: "Male", ticket: '2nd class'}
    ]


    console.table(titanicDataset)

    expect(lastConsoleOutput).toBe(`\
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