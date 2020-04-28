
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

    paddingBetweenSiblingPanels: 7,  // in pixels

}


const panel = {

    // Coordinates (px)
    x: 25,
    y: 25,

    // Dimensions (px)
    width: 100,
    height: 500,


    // Inner Padding (px)
    innerPaddingTop: 30,
    innerPaddingBottom: 10,
    innerPaddingLeft: 10,
    innerPaddingRight: 15,
    innerPaddingExtraForLeftEdgeOfPanel0Bg: 20,

    // Vertical padding between charts (%)
    paddingBetweenCharts: 0.05,


    // Outer Padding (px)
    // (Also controls distance between parent and child panel in NestedPanel)
    outerPaddingTop: 15,
    outerPaddingBottom: 30,


    // Fill
    /* Affects only the background color of panel 0 in a Navigator.
       (Child panels mirror parents, so they can override this value) */
    bgFill: 'lightgray',


    // Stroke
    strokeWidth: '0.5px',
    stroke: 'rgba(255, 255, 255, 1.0)'


}


const chart = {

    attributeLabelFill: 'rgba(0, 0, 0, 0.35)',

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
