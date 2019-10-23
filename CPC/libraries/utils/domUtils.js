
//// UMD HEAD ////////////////////////////////////////////////////////////////////////
// UMD head and foot patterns adapted from d3.js (Copyright 2019 Mike Bostock)
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
        typeof define === 'function' && define.amd ? define(['exports'], factory) :
            (factory((global.domUtils = global.domUtils || {})));
}(this, (function (exports) { 'use strict';
//////////////////////////////////////////////////////////////////////////////////////





               
// Module content goes here. 
const version = "1.0"


/**
 * Convenience method for .simulateClick(). Takes a selector string and simulates a click on the specified element.
 * @param selectors {string}
 */
function simulateClickOn(selector, modifierKey){

    try{

        const element = document.querySelector(selector)
        simulateClick(element, modifierKey)

    }
    catch (e) {

        if (e.message === `An invalid element is likely provided for the 'element' parameter. The provided 'element' is "null".`) {
            throw new Error(`An invalid selectors string is likely provided for the 'selectors' parameter. The provided selector(s) was "${selector}".`)
        }

    }

}


/**
 * Takes an element selection and simulates a click event on the element.
 * Adapted from ChrisFerdinandi's code at `https://gomakethings.com/how-to-simulate-a-click-event-with-javascript/`
 * @param {Element} element the element to simulate a click on
 */
function simulateClick (element, modifierKey) {

    try{

        // Create a click event with options
        const event = new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            ctrlKey: modifierKey === 'ctrl',
            altKey: modifierKey === 'alt',
            shiftKey: modifierKey === 'shift',
            metaKey: modifierKey === 'meta',
            view: window
        })

        // If cancelled, don't dispatch the event
        const canceled = !element.dispatchEvent(event)

    }
    catch (e) {
        if (e.message === "Cannot read property 'dispatchEvent' of null"){
            throw new Error(`An invalid element is likely provided for the 'element' parameter. The provided 'element' is "${element}".`)
        }

    }

}


                                                
//// UMD FOOT ////////////////////////////////////////////////////////////////////////
                             
    //// MODULE.EXPORTS ////
    exports.version = version;
    exports.simulateClick = simulateClick;
    exports.simulateClickOn = simulateClickOn;


	Object.defineProperty(exports, '__esModule', { value: true });

})));
//////////////////////////////////////////////////////////////////////////////////////

