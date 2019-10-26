
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

    // Error handling
    // NOTE: This is not redundant even though this check is also done by the simulateClick method the current method calls.
    _validateModifierKey(modifierKey)

    // NOTE: This try-except block is NOT redundant, even though a try-except block exists in simulateClick method.
    // The try-except blocks of two functions enable two different error messages.
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
 * @param element {Element} element the element to simulate a click on
 * @param modifierKey {String}
 */
function simulateClick (element, modifierKey) {

    // Error handling
    _validateModifierKey(modifierKey)

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


function _validateModifierKey(modifierKey) {
    if (modifierKey) {
        const acceptableValuesForModifierKey = ['ctrl', 'alt', 'shift', 'meta']
        modifierKey.mustBeAnElementIn(acceptableValuesForModifierKey)
        modifierKey.mustBeOfType('String')
    }
}


Document.prototype.listenForClicksAndRecordLastClickProperties = function(){

    // Add a property to Document object with default properties
    Document.prototype.lastClick = {
        wasOnTag: null,
        wasOnClass: null,
        wasOnId: null,

        wasWithShiftKey: false,
        wasWithCtrlKey: false,
        wasWithAltKey: false,
        wasWithMetaKey: false,
    }

    this.addEventListener('click', (event) => {

        this.lastClick.wasOnTag = event.target.tagName
        this.lastClick.wasOnClass = event.target.className.baseVal
        this.lastClick.wasOnId = event.target.id

        this.lastClick.wasWithShiftKey = event.shiftKey
        this.lastClick.wasWithCtrlKey = event.ctrlKey
        this.lastClick.wasWithAltKey = event.altKey
        this.lastClick.wasWithMetaKey = event.metaKey
    })

}


                                                
//// UMD FOOT ////////////////////////////////////////////////////////////////////////

    //// MODULE.EXPORTS ////
    exports.version = version;
    exports.simulateClick = simulateClick;
    exports.simulateClickOn = simulateClickOn;



	Object.defineProperty(exports, '__esModule', { value: true });

})));
//////////////////////////////////////////////////////////////////////////////////////
