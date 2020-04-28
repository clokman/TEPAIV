
//// UMD HEAD ////////////////////////////////////////////////////////////////////////
// UMD head and foot patterns adapted from d3.js (Copyright 2019 Mike Bostock)
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
        typeof define === 'function' && define.amd ? define(['exports'], factory) :
            (factory((global.preferences = global.preferences || {})));
}(this, (function (exports) { 'use strict';
//////////////////////////////////////////////////////////////////////////////////////


const navigator = {

}


const nestedPanel = {

    paddingBetweenSiblingPanels: 5  // in pixels

}


const panel = {

}


const chart = {

    attributeLabelFill: 'rgba(0, 0, 0, 0.35)'

}


const category = {

}



const rectangle = {

}


const text = {

}




//// UMD FOOT ////////////////////////////////////////////////////////////////////////

    //// MODULE.EXPORTS ////
    exports.navigator = navigator;
    exports.nestedPanel = nestedPanel;
    exports.panel = panel;
    exports.chart = chart;
    exports.category = category;
    exports.rectangle = rectangle;
    exports.text = text;


    Object.defineProperty(exports, '__esModule', { value: true });

})));
//////////////////////////////////////////////////////////////////////////////////////
