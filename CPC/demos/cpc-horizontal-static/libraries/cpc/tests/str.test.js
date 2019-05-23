const str = require('../str')




//// formatAsCssSelector() ////

test ('Should format string as CSS selector', () => {

    expect(str.formatAsCssSelector('UNformatted String 035'))
     .toBe('unformatted-string-035')

})


test ('Should fail due to string starting with number', () => {

    expect( () => {
        str.formatAsCssSelector('01UNformatted String 035')
    })
        .toThrow("Input string should not start with a number. The current string is \"01UNformatted String 035\".")

})




//// startsWithNumber() ////

test ('Should return true if string starts with a number', () => {

    expect(str.startsWithNumber('0553 UNformatted Strin 035g'))
     .toBe(true)

    expect(str.startsWithNumber('0'))
     .toBe(true)

})


test ('Should return false if string does not start with a number', () => {

    const result = str.startsWithNumber('0553 UNformatted String 035')

    expect(str.startsWithNumber('UNformatted String'))
        .toBe(false)

})





//// formatNumberAsPercentage() ////

test ('Should return formatted string with a  percentage sign', () => {

    expect(str.formatNumberAsPercentage(4))
        .toBe('4%')

})