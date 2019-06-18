
//// UMD HEAD ////////////////////////////////////////////////////////////////////////
// UMD head and foot patterns adapted from d3.js (Copyright 2019 Mike Bostock)
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
        typeof define === 'function' && define.amd ? define(['exports'], factory) :
            (factory((global.arrayUtils = global.arrayUtils || {})));
}(this, (function (exports) { 'use strict';
//////////////////////////////////////////////////////////////////////////////////////





               
// Module content goes here. 
const version = "1.0"





function toPercentages(array){

    const percentages = []
    const total = _.sum(array)

    array.forEach( (element) => {

        const percentage = (element/total) * 100
        const roundedPercentage = _.round(percentage, 1)

        percentages.push(roundedPercentage)

    })

    return percentages

}


function toStackData(array){

    const stack = []

    let i = 0
    array.forEach( (number) => {

        const start = stack[i-1] ? stack[i-1][1] : 0
        const end = start + array[i]

        const stackItem = [start, end]

        stack.push(stackItem)

        i++

    })

    return stack


}


                                                
//// UMD FOOT ////////////////////////////////////////////////////////////////////////
                             
    //// MODULE.EXPORTS ////
    exports.version = version;

    exports.toPercentages = toPercentages;
    exports.toStackData = toStackData;


	Object.defineProperty(exports, '__esModule', { value: true });

})));
//////////////////////////////////////////////////////////////////////////////////////

