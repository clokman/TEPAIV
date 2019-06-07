//// UMD HEAD ////////////////////////////////////////////////////////////////////////
// UMD head and foot patterns adapted from d3.js (Copyright 2019 Mike Bostock)
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
        typeof define === 'function' && define.amd ? define(['exports'], factory) :
            (factory((global.data = global.data || {})));
}(this, (function (exports) {
    'use strict';
//////////////////////////////////////////////////////////////////////////////////////






// Module content goes here. 
const version = "1.0"



class Stack {


    constructor() {

        this._data = new Map()
        this.generateSample()

        this._scaleFunction = null  // will be set if scale() method is used

    }


    data(){
        return this._data
    }


    scale(scaleFunction){

        this._scaleFunction = scaleFunction

        const unscaledData = this._data

        unscaledData.forEach(
            (eachCategoryData, eachCategoryId) => {

                const eachUnscaledStart = eachCategoryData.get('start')
                    , eachUnscaledEnd = eachCategoryData.get('end')

                const eachScaledStart = this._scaleFunction(eachUnscaledStart)
                    , eachScaledEnd = this._scaleFunction(eachUnscaledEnd)

                eachCategoryData.set('start', eachScaledStart)
                eachCategoryData.set('end', eachScaledEnd)

            }
        )

        return this
    }


    max(){

        let ends = []

        this._data.forEach(
            (eachCategoryData, eachCategoryName) => {
                const eachEnd = eachCategoryData.get('end')
                ends.push(eachEnd)
            }
        )

        const maximumValue = d3.max(ends)

        return maximumValue

    }


    min(){

        let starts = []

        this._data.forEach(
            (eachCategoryData, eachCategoryName) => {
                const eachStart = eachCategoryData.get('start')
                starts.push(eachStart)
            }
        )

        const minimumValue = d3.min(starts)

        return minimumValue

    }


    generateSample(){

        this._data.set('category-1', new Map())
            .get('category-1')
            .set('label', 'Category One')
            .set('start', 0)
            .set('end', 10)

        this._data.set('category-2', new Map())
            .get('category-2')
            .set('label', 'Category Two')
            .set('start', 10)
            .set('end', 20)

        this._data.set('category-3', new Map())
            .get('category-3')
            .set('label', 'Category Three')
            .set('start', 20)
            .set('end', 30)

        return this

    }

}








//// UMD FOOT ////////////////////////////////////////////////////////////////////////

    //// MODULE.EXPORTS ////
    exports.Stack = Stack;


    Object.defineProperty(exports, '__esModule', {value: true});

})));
//////////////////////////////////////////////////////////////////////////////////////
