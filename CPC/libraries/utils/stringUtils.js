//// UMD HEAD ////////////////////////////////////////////////////////////////////////
// UMD head and foot patterns adapted from d3.js (Copyright 2019 Mike Bostock)
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
        typeof define === 'function' && define.amd ? define(['exports'], factory) :
            (factory((global.stringUtils = global.stringUtils || {})));
}(this, (function (exports) {
    'use strict';
//////////////////////////////////////////////////////////////////////////////////////






// Module content goes here.
const version = "2.0"

    /**
     *
     * @param input {string}
     * @return {string}
     */
    function formatAsCssSelector(input){

    if(startsWithNumber(input)){
        throw new Error(`Input string should not start with a number. The current string is "${input}".`)
    }

    const stringWithoutSpaces = input.replace(/ /g,'-')  // '/ /g' replace all instances of space character with empty string (global behavior in the scope of the string)
        , stringWithoutPunctuation = stringWithoutSpaces.replace(/[^a-zA-Z-0-9]/g, '')
        , stringLowerCase = stringWithoutPunctuation.toLowerCase()

    return stringLowerCase
}


    /**
     *
     * @param input {string}
     * @return {boolean}
     */
    function startsWithNumber(input){
    const firstCharacter = input[0]
        , conversionAttempt = Number(firstCharacter)
        , isNumber = !(isNaN(conversionAttempt))  // returns true or false

    return isNumber
}


    /**
     *
     * @param input {Number}
     * @return {string}
     */
    function formatNumberAsPercentage(input){

        return input + '%'

    }



//// UMD FOOT ////////////////////////////////////////////////////////////////////////

    //// MODULE.EXPORTS ////
    exports.version = version
    exports.formatAsCssSelector = formatAsCssSelector
    exports.startsWithNumber = startsWithNumber
    exports.formatNumberAsPercentage = formatNumberAsPercentage



    Object.defineProperty(exports, '__esModule', {value: true});

})));
//////////////////////////////////////////////////////////////////////////////////////

