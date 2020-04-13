
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


Array.prototype.convertToString = function () {

    let arrayAsString = ''

    this.forEach( e => {
        arrayAsString = arrayAsString + `${e}, `
    })

    arrayAsString = arrayAsString.slice(0,-2)  // for the ', ' at the end

    return arrayAsString
}


Array.prototype.containsMostlyNumbers = function (sampleSize=25, requiredRatioOfNumbers=0.9){

    const result = {
        isANumber: 0,
        notANumber: 0
    }
    let judgment

    const actualSampleSize =
        this.length < sampleSize
            ? this.length
            : sampleSize


    const dataSample = this.slice(0, actualSampleSize)

    dataSample.forEach( (sampleValue) => {

        const omittedValues = [true, false, '', null]  // so that these are not converted to 0 and 1

        // Establish Conditions
        const sampleValueIsNotAmongOmittedValues = sampleValue !== omittedValues
        const sampleValueIsConvertibleToANumber =
            sampleValue !== null &&
            sampleValue !== undefined &&
            !isNaN(sampleValue) &&
            sampleValue !== '' &&
            !(sampleValue).hasType('Boolean') &&
            ( !!Number(sampleValue) || Number(sampleValue) === 0 )

        if (sampleValueIsNotAmongOmittedValues && sampleValueIsConvertibleToANumber){
            result.isANumber += 1
        }
        else{
            result.notANumber += 1
        }

    })


    const ratioOfNumbers = result.isANumber / actualSampleSize

        // ratioOfNonNumberElements <= tolerance
       if ( ratioOfNumbers >= requiredRatioOfNumbers ){
           judgment = true
       }
       else {
           judgment = false
       }


    return judgment

}


function toPercentages(array){

    const percentages = []
    const total = _.sum(array)

    array.forEach( (element) => {

        const percentage = (element/total) * 100
        const roundedPercentage = _.round(percentage, 0)

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

