
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

    return this.constructor.name

}

                                                
//// UMD FOOT ////////////////////////////////////////////////////////////////////////
                             
    //// MODULE.EXPORTS ////
    exports.version = version;


	Object.defineProperty(exports, '__esModule', { value: true });

})));
//////////////////////////////////////////////////////////////////////////////////////

