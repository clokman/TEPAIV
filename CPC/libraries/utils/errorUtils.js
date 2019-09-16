
//// UMD HEAD ////////////////////////////////////////////////////////////////////////
// UMD head and foot patterns adapted from d3.js (Copyright 2019 Mike Bostock)
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
        typeof define === 'function' && define.amd ? define(['exports'], factory) :
            (factory((global.errorUtils = global.errorUtils || {})));
}(this, (function (exports) { 'use strict';
//////////////////////////////////////////////////////////////////////////////////////



// Module content goes here.
const version = "1.0"



Object.prototype.mustBeOfType = function(acceptableType) {

    // If user enters the object instance directly as an acceptable type, get the class of the object
    if (acceptableType.constructor.name !== "String"){
        acceptableType = acceptableType.name
    }

    let valueTypeIsOk = false

    // Check if the value is of acceptable type
    const typeOfValue = this.constructor.name
    if(typeOfValue === acceptableType){valueTypeIsOk = true}

    // Throw error if type is not OK
    if(!valueTypeIsOk){
        throw Error(`Type error: Expected the type '${acceptableType}' but the value '${this}' has the type '${typeOfValue}'.`)
    }
}


Object.prototype.mustBeAnElementIn = function(array){

    // Validate the value
    let valueIsFoundInArray = false

    if( array.includes(this) ){
        valueIsFoundInArray = true
    }

    // If value is not validated, throw error
    if (!valueIsFoundInArray){

        let arrayAsString = array.convertToString()

        throw Error(`'${this}' is not a valid value. Expected values are: '${arrayAsString}'.`)
    }

}


Object.prototype.mustBeAKeyIn = function(map){

    // Validate the value
    let valueIsFoundInMapKeys = false

    if( map.has(this) ){  // checks map keys
        valueIsFoundInMapKeys = true
    }

    // If value is not validated, throw error
    if (!valueIsFoundInMapKeys){

        let mapKeysAsString = map.convertKeysToString()

        throw Error(`'${this}' is not as valid value. Expected values are: '${mapKeysAsString}'.`)
    }
}



                                                
//// UMD FOOT ////////////////////////////////////////////////////////////////////////
                             
    //// MODULE.EXPORTS ////
    exports.version = version;


	Object.defineProperty(exports, '__esModule', { value: true });

})));
//////////////////////////////////////////////////////////////////////////////////////

