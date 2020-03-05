

let consoleHistory = ''
let lastConsoleOutput = ''

beforeEach( () => {

    // Clear any possible leftovers from previous tests
    clearConsoleHistory()
    lastConsoleOutput = ''

    // Reroute console to jest.fn (i.e., mock console.log)
    console.log = jest.fn( argument => {
        lastConsoleOutput = argument
        consoleHistory += argument
    })

    console.warn = jest.fn( argument => {
        lastConsoleOutput = argument
        consoleHistory += argument
    })

})

const originalConsoleLog = console.log
const originalConsoleWarn = console.warn

afterEach( () => {
    console.log = originalConsoleLog
    console.warn = originalConsoleWarn
})  // restore the original functions after each test


expect.extend({

    toTabulateAs(tabularData, expectedOutput, startAt, maxRows) {

        expectTable(tabularData, expectedOutput, startAt, maxRows)

        // If the assertions in the function above did not fail:
        return {pass:true, message:`Variable is tabulated as expected in given template`}

    },


    toLogAs(variable, expectedOutput, format) {

        expectLog(variable, expectedOutput, format)

        // If the assertions in the function above did not fail:
        return {pass:true, message:`Variable is logged as expected in given template`}

    }

})




const expectTable = function (tabularData, expectedOutput, startAt, maxRows){

    const consoleOutput = _printVariableAsFormattedTable(tabularData, startAt, maxRows)
    expect(consoleOutput).toBe(expectedOutput)

}


const _printVariableAsFormattedTable = function(tabularData, startAt, maxRows) {

    let consolePrefix = ''
        , consolePostfix = ''
        , preceedingNoOfRows
        , remainingNoOfRows

    if (startAt || maxRows) {

        if (startAt > 0) {
            preceedingNoOfRows = startAt
            consolePrefix = `˄˄˄ ${preceedingNoOfRows} preceding rows\n`
        }

        remainingNoOfRows = (tabularData.length) - (startAt + maxRows)

        tabularData = Array.from(tabularData).slice(startAt, startAt + maxRows)

        consolePostfix = `\n˅˅˅ ${remainingNoOfRows} more rows`
    }

    console.table(tabularData)
    const consoleOutput = consolePrefix + lastConsoleOutput + consolePostfix
    return consoleOutput
}


const expectLog = function(variable, expectedOutput, format='single-line'){

    console.log(variable)

    if (format==='single-line'){
        expect(JSON.stringify(lastConsoleOutput)).toBe(expectedOutput)
    }

    if (format==='pretty'){
        expect(JSON.stringify(lastConsoleOutput, null, 2)).toBe(expectedOutput)
    }

}


const expectConsoleHistory = function(expectedHistory){
    expect(consoleHistory).toBe(expectedHistory)
}


const getConsoleHistory = function(){
    return consoleHistory
}

const clearConsoleHistory = function () {
    consoleHistory = ''
}



exports.expectTable = expectTable
exports.expectLog = expectLog
exports.getConsoleHistory = getConsoleHistory
exports.clearConsoleHistory = clearConsoleHistory
exports.expectConsoleHistory = expectConsoleHistory
exports.consoleHistory = consoleHistory
exports.lastConsoleOutput = lastConsoleOutput
