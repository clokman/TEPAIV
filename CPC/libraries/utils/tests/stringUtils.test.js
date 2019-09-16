const stringUtils = require('../stringUtils')

//// Width ////
test ('WIDTH: Calculate string width in pixels', () => {

    // Cannot test more precisely than these tests, because canvas is problematic in JEST,
    expect( 'my string'.width() ).not.toBeNull()
    expect( 'my string'.width('arial') ).not.toBeNull()

})

//// formatAsCssSelector() ////

test ('Should format string as CSS selector', () => {

    expect(stringUtils.formatAsCssSelector('UNformatted String 035'))
     .toBe('unformatted-string-035')

})


test ('Should fail due to string starting with number', () => {

    expect( () => {
        stringUtils.formatAsCssSelector('01UNformatted String 035')
    })
        .toThrow("Input string should not start with a number. The current string is \"01UNformatted String 035\".")

})




//// startsWithNumber() ////

test ('Should return true if string starts with a number', () => {

    expect(stringUtils.startsWithNumber('0553 UNformatted Strin 035g'))
     .toBe(true)

    expect(stringUtils.startsWithNumber('0'))
     .toBe(true)

})


test ('Should return false if string does not start with a number', () => {

    const result = stringUtils.startsWithNumber('0553 UNformatted String 035')

    expect(stringUtils.startsWithNumber('UNformatted String'))
        .toBe(false)

})





//// formatNumberAsPercentage() ////

test ('Should return formatted string with a  percentage sign', () => {

    expect(stringUtils.formatNumberAsPercentage(4))
        .toBe('4%')

})