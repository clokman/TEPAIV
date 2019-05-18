//// UMD HEAD ////////////////////////////////////////////////////////////////////////
// UMD head and foot patterns adapted from d3.js (Copyright 2019 Mike Bostock)
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
        typeof define === 'function' && define.amd ? define(['exports'], factory) :
            (factory((global.str = global.str || {})));
}(this, (function (exports) {
    'use strict';
//////////////////////////////////////////////////////////////////////////////////////






// Module content goes here.
const version = "2.0"


function formatAsCssSelector(inputString){

    if(startsWithNumber(inputString)){
        throw new Error(`Input string should not start with a number. The current string is "${inputString}".`)
    }

    const stringWithoutSpaces = inputString.replace(/ /g,'-')  // '/ /g' replace all instances of space character with empty string (global behavior in the scope of the string)
        , stringWithoutPunctuation = stringWithoutSpaces.replace(/[^a-zA-Z-0-9]/g, '')
        , stringLowerCase = stringWithoutPunctuation.toLowerCase()

    return stringLowerCase
}




function startsWithNumber(inputString){
    const firstCharacter = inputString[0]
        , conversionAttempt = Number(firstCharacter)
        , isNumber = !(isNaN(conversionAttempt))  // returns true or false

    return isNumber
}






//// UMD FOOT ////////////////////////////////////////////////////////////////////////

    //// MODULE.EXPORTS ////
    exports.version = version
    exports.formatAsCssSelector = formatAsCssSelector
    exports.startsWithNumber = startsWithNumber



    Object.defineProperty(exports, '__esModule', {value: true});

})));
//////////////////////////////////////////////////////////////////////////////////////

