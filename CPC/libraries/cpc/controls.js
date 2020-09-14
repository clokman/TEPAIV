//// UMD HEAD ////////////////////////////////////////////////////////////////////////
// UMD head and foot patterns adapted from d3.js
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
        typeof define === 'function' && define.amd ? define(['exports'], factory) :
            (factory((global.controls = global.controls || {})));
}(this, (function (exports) {
    'use strict';
//////////////////////////////////////////////////////////////////////////////////////






const version = "1.0"




class Slider{

    constructor(label, value, min, max, instanceToCallOnUpdate, instanceMethodToCallOnUpdate, parentHtmlElement=document.body){

        const formattedLabel = stringUtils.formatAsCssSelector(label)

        this._sliderId = formattedLabel + '-slider'
        this._monitorId = this._sliderId + '-monitor'


        // Call the getter method of instance to get the current value
        const currentValueInInstance = instanceMethodToCallOnUpdate.call(instanceToCallOnUpdate)
        this._value = currentValueInInstance

        this._label = label
        this._max = max
        this._min = min
        this._instanceToCallOnUpdate = instanceToCallOnUpdate
        this._comboGetterSetterMethodOfCalledInstance = instanceMethodToCallOnUpdate


        this._parentHtmlElement = parentHtmlElement

        this._create()
        this._listen()

    }


    value(value){
        if(!arguments.length){
            return this._value
        }
        else {
            this._value = value

            const slider = document.getElementById(this._sliderId)
            const monitor = document.getElementById(this._monitorId)

            slider.value = this._value

            this.sendValueToSetterMethodOfInstance()
            monitor.innerText = this._value
        }
    }


    sendValueToSetterMethodOfInstance() {
        this._comboGetterSetterMethodOfCalledInstance.call(this._instanceToCallOnUpdate, this._value)
    }


    _create(){

        const sliderDiv = document.createElement('DIV')

        sliderDiv.innerHTML =
            `<input type="range"
            class="slider preference-control"
            id=${this._sliderId}
            value=${this._value}
            max=${this._max}
            min=${this._min}
            ><p>${this._label}: <span id="${this._monitorId}"></span></p>`

        this._parentHtmlElement.appendChild(sliderDiv)
    }


    _listen(){

        const slider = document.getElementById(this._sliderId)
        const monitor = document.getElementById(this._monitorId)

        slider.oninput = () => {
            this._comboGetterSetterMethodOfCalledInstance.call(this._instanceToCallOnUpdate, slider.value)
            monitor.innerText = slider.value
        }

    }

}






//// UMD FOOT ////////////////////////////////////////////////////////////////////////

    //// MODULE.EXPORTS ////
    exports.version = version;
    exports.Slider = Slider;


    Object.defineProperty(exports, '__esModule', {value: true});

})));
//////////////////////////////////////////////////////////////////////////////////////

