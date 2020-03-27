
//// UMD HEAD ////////////////////////////////////////////////////////////////////////
// UMD head and foot patterns adapted from d3.js (Copyright 2019 Mike Bostock)
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
        typeof define === 'function' && define.amd ? define(['exports'], factory) :
            (factory((global.jsUtils = global.jsUtils || {})));
}(this, (function (exports) { 'use strict';
//////////////////////////////////////////////////////////////////////////////////////





               
// Module content goes here. 
const version = "1.0"

Object.prototype.hasType = function (value) {

    const typeOfObject = this.constructor.name

    if(!arguments.length){
        return typeOfObject
    }
    else{

        const comparison = value === typeOfObject
        return comparison

    }

}


/**
 * Returns the name of the function or method. Does not work for functions that are assigned
 *  to variables (i.e., `const myFunc = function(){}`)
 */
Object.prototype.hasFunctionName = function(){

    const functionAsString = this.toString()  // e.g., this string: "function myFunction(){return 'something'}"
    const functionNameExtract = functionAsString.split('(')[0] // e.g., 'function myFunction'

    const functionName = functionNameExtract.includes('function')
        ? functionNameExtract.split('function ')[1]  // e.g., 'myFunction' in 'function myFunction'
        : functionNameExtract  // when methods are stringified, the strings do not start with 'function', but directly with method's name, hence the different treatment here

    return functionName

}


//// UMD FOOT ////////////////////////////////////////////////////////////////////////
                             
    //// MODULE.EXPORTS ////
    exports.version = version;


	Object.defineProperty(exports, '__esModule', { value: true });

})));
//////////////////////////////////////////////////////////////////////////////////////

