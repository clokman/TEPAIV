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

        this._data = null
        this.populateWithExampleData()

        this._scaleFunction = null  // will be set if scale() method is used

    }


    /**
     *
     * @param {None|Map|String} value
     * @return {*|Map<any, any>|Map|Map|Map|Map|Map}
     */
    data(value){

        // Establish conditions for parameter
        const parameterIsNull = !arguments.length
            , parameterIsString = typeof value === 'string'
            , parameterIsObject = typeof value === 'object'


        // Get data
        if(parameterIsNull){
            return this._data
        }


        // Query data
        if (parameterIsString){
            return this._data.get(value)
        }


        // Set new data
        if (parameterIsObject){
            this._data = value
            return this
        }

    }


    copy(){

        return _.cloneDeep(this)

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


    populateWithExampleData(variant='generic'){

        const exampleData = new Map()

        if (variant === 'generic'){


            exampleData.set('category-1', new Map())
                .get('category-1')
                .set('label', 'Category One')
                .set('start', 0)
                .set('end', 10)
                .set('percentage', 33)

            exampleData.set('category-2', new Map())
                .get('category-2')
                .set('label', 'Category Two')
                .set('start', 10)
                .set('end', 20)
                .set('percentage', 33)

            exampleData.set('category-3', new Map())
                .get('category-3')
                .set('label', 'Category Three')
                .set('start', 20)
                .set('end', 30)
                .set('percentage', 33)
        }


        if (variant === 'gender'){

            exampleData.set('male', new Map())
                .get('male')
                .set('label', 'Male')
                .set('start', 0)
                .set('end', 33)
                .set('percentage', 33)

            exampleData.set('female', new Map())
                .get('female')
                .set('label', 'Female')
                .set('start', 33)
                .set('end', 100)
                .set('percentage', 67)
        }


        this.data(exampleData)

        return this
    }

}








//// UMD FOOT ////////////////////////////////////////////////////////////////////////

    //// MODULE.EXPORTS ////
    exports.Stack = Stack;


    Object.defineProperty(exports, '__esModule', {value: true});

})));
//////////////////////////////////////////////////////////////////////////////////////
