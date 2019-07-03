
consoleHistory = ''
lastConsoleOutput = ''

// Reroute console to jest.fn
console["log"] = jest.fn(input => {
    lastConsoleOutput = input
    consoleHistory += input
})

expectTable = function (tabularData, expectedOutput, startAt, maxRows){
    let postfix = ''
      , prefix = ''
      , remainingRows
      , preceedingRows

    if (startAt || maxRows){

        if (startAt > 0){
            preceedingRows = startAt
            prefix = `˄˄˄ ${preceedingRows} preceding rows\n`
        }

        remainingRows = (tabularData.length) - (startAt + maxRows)

        tabularData = Array.from(tabularData).slice(startAt, startAt+maxRows)

        postfix = `\n˅˅˅ ${remainingRows} more rows`
    }

    console.table(tabularData)
    expect(prefix + lastConsoleOutput + postfix).toBe(expectedOutput)

}


expectLog = function(variable, expectedOutput, format='pretty'){

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
