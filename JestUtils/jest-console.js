
consoleHistory = ''
lastConsoleOutput = ''

// Reroute console to jest.fn
console["log"] = jest.fn(input => {
    lastConsoleOutput = input
    consoleHistory += input
})


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




expectTable = function (tabularData, expectedOutput, startAt, maxRows){

    const consoleOutput = _printVariableAsFormattedTable(tabularData, startAt, maxRows)
    expect(consoleOutput).toBe(expectedOutput)

}


_printVariableAsFormattedTable = function(tabularData, startAt, maxRows) {

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


expectLog = function(variable, expectedOutput, format='single-line'){

    console.log(variable)

    if (format==='single-line'){
        expect(JSON.stringify(lastConsoleOutput)).toBe(expectedOutput)
    }

    if (format==='pretty'){
        expect(JSON.stringify(lastConsoleOutput, null, 2)).toBe(expectedOutput)
    }

}


expectConsoleHistory = function(expectedHistory){
    expect(consoleHistory).toBe(expectedHistory)
}


clearConsoleHistory = function () {
    consoleHistory = ''
}


exports.expectTable = expectTable
exports.expectLog = expectLog
exports.clearConsoleHistory = clearConsoleHistory
exports.expectConsoleHistory = expectConsoleHistory
exports.consoleHistory = consoleHistory
exports.lastConsoleOutput = lastConsoleOutput
