
//// UMD HEAD ////////////////////////////////////////////////////////////////////////
// UMD head and foot patterns adapted from d3.js (Copyright 2019 Mike Bostock)
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
        typeof define === 'function' && define.amd ? define(['exports'], factory) :
            (factory((global.classUtils = global.classUtils || {})));
}(this, (function (exports) { 'use strict';
//////////////////////////////////////////////////////////////////////////////////////





               
// Module content goes here. 
const version = "1.0"



function isInstanceOf (instance, expectedClass){
    if (expectedClass.constructor.name === 'String'){
        return instance.constructor.name === expectedClass
    }
    else{
        return instance.constructor.name === expectedClass.name
    }
}


function requireProperties (instance, propertyKeys){

    const requiredProperties = propertyKeys
    let missingProperties = []

    // If any property is missing from the Dataset instance, add them to array
    requiredProperties.forEach( (propertyKey) => {

        if(!instance.hasOwnProperty(propertyKey)){
            missingProperties.push(propertyKey)
        }
    })

    // If array is not emty, this means that at least one required property is missing from Dataset instance
    if (missingProperties.length !== 0){

        throw Error(`Properties "${missingProperties}" do not exist in the provided ${instance.constructor.name} instance.`)

    }

}



//// UMD FOOT ////////////////////////////////////////////////////////////////////////
                             
    //// MODULE.EXPORTS ////
    exports.version = version;
    exports.isInstanceOf = isInstanceOf;
    exports.requireProperties = requireProperties;


	Object.defineProperty(exports, '__esModule', { value: true });

})));
//////////////////////////////////////////////////////////////////////////////////////

