
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


Object.prototype.hasName = function (value) {

    let nameOfObject

    // A convoluted way of getting the name of the parent object of the method. Inspired from https://stackoverflow.com/a/4602375/3102060).
    // Minimalistic methods such as `Object.keys({myOject})[0]` does not allow methods to get the variable name of their parent object.
    var that = this
    for(that in window){
        if(window[that] === this){
            nameOfObject = that
        }
    }


    if(!arguments.length){
        return nameOfObject
    }
    else{

        const comparison = value === nameOfObject
        return comparison

    }

}


/**
 * From SO answer of Chong Lip Phang at https://stackoverflow.com/a/45332959/3102060
 * NOTE: The properties and methods of classes that occur later in the arguments of this method will overwrite
 * NOTE: This may not work with React `Component`.
 * the previous properties and methods with the same names.
 * @param mixins - Other classes to be added
 * @return {base}
 */
Object.prototype.mixin = function (...mixins) {

    class base extends this {
        constructor (...args) {
            super(...args);
            mixins.forEach((mixin) => {
                copyProps(this,(new mixin));
            });
        }
    }

    let copyProps = (target, source) => {  // this function copies all properties and symbols, filtering out some special ones
        Object.getOwnPropertyNames(source)
            .concat(Object.getOwnPropertySymbols(source))
            .forEach((prop) => {
                if (!prop.match(/^(?:constructor|prototype|arguments|caller|name|bind|call|apply|toString|length)$/))
                    Object.defineProperty(target, prop, Object.getOwnPropertyDescriptor(source, prop));
            })
    }

    mixins.forEach((mixin) => { // outside contructor() to allow classes(A,B,C).staticFunction() to be called etc.
        copyProps(base.prototype, mixin.prototype);
        copyProps(base, mixin);
    });

    return base;
}



//// UMD FOOT ////////////////////////////////////////////////////////////////////////
                             
    //// MODULE.EXPORTS ////
    exports.version = version;


	Object.defineProperty(exports, '__esModule', { value: true });

})));
//////////////////////////////////////////////////////////////////////////////////////

