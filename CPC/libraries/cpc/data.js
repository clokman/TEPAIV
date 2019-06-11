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
                .set('end', 64)
                .set('percentage', 64)

            exampleData.set('female', new Map())
                .get('female')
                .set('label', 'Female')
                .set('start', 64)
                .set('end', 100)
                .set('percentage', 36)
        }


        if (variant === 'class'){

            exampleData.set('first-class', new Map())
                .get('first-class')
                .set('label', 'First Class')
                .set('start', 0)
                .set('end', 25)
                .set('percentage', 25)

            exampleData.set('second-class', new Map())
                .get('second-class')
                .set('label', 'Second Class')
                .set('start', 25)
                .set('end', 46)
                .set('percentage', 21)

            exampleData.set('third-class', new Map())
                .get('third-class')
                .set('label', 'Third Class')
                .set('start', 46)
                .set('end', 100)
                .set('percentage', 54)
        }


        if (variant === 'status'){

            exampleData.set('survived', new Map())
                .get('survived')
                .set('label', 'Survived')
                .set('start', 0)
                .set('end', 38)
                .set('percentage', 38)

            exampleData.set('died', new Map())
                .get('died')
                .set('label', 'Died')
                .set('start', 38)
                .set('end', 100)
                .set('percentage', 62)
        }


        this.data(exampleData)

        return this
    }

}



    class FrequenciesArray {

        /**
         * @param dictionariesArray {Array} - An array that contains dictionaries of frequencies.
         *                                   An example of such an array is:
         *                                   let frontData = [
         *                                        { firstClass: 10,  secondClass: 8,  thirdClass: 25 }
         *                                       ,{ firstClass: 4,  secondClass: 12, thirdClass: 28 }
         *                                       ,{ firstClass: 2,  secondClass: 19, thirdClass: 32 }
         *                                       ,{ firstClass: 7,  secondClass: 23, thirdClass: 35 }
         *                                       ,{ firstClass: 23, secondClass: 17, thirdClass: 43 }
         *                                   ]
         */
        constructor(dictionariesArray) {

            this.data = dictionariesArray

            // Calculate database statistics
            this.maxValue = this._findMaxValue()
            this.uniqueKeys = this._extractUniqueKeys()

        }

        /**
         * @return {number}
         */

        _findMaxValue() {
            let values = []

            let dictionaryArray = this.data

            for (let eachArrayIndex in dictionaryArray){
                for (let eachDictionaryKey in dictionaryArray[eachArrayIndex]){

                    let eachDictionaryValue = dictionaryArray[eachArrayIndex][eachDictionaryKey]
                    values.push(eachDictionaryValue)
                    // cLog(eachDictionaryValue)
                }
            }

            let maxValue = d3.max(values)
            return maxValue
        }


        /**
         * @return {Array} - An array of unique keys in the dictionary
         */
        _extractUniqueKeys() {

            let dictionariesArray = this.data

            let keys = []
            for (let eachArrayIndex in dictionariesArray){
                for (let eachDictKey in dictionariesArray[eachArrayIndex]){

                    if (!(keys.includes(eachDictKey)) ){
                        let newKey = eachDictKey
                        keys.push(eachDictKey)
                    }
                }
            }
            return keys
        }
    }



//
//     function tests_dictionariesArray() {
//
//         // Preparation
//
//         let frontData = [
//             { firstClass: 10,  secondClass: 8,  thirdClass: 25 }
//             ,{ firstClass: 4,  secondClass: 12, thirdClass: 28 }
//             ,{ firstClass: 2,  secondClass: 19, thirdClass: 32 }
//             ,{ firstClass: 7,  secondClass: 23, thirdClass: 35 }
//             ,{ firstClass: 23, secondClass: 17, thirdClass: 43 }
//         ]
//
//         frontData = new FrequenciesArray(frontData)
//
//         let baseData = [
//             { firstClass: 110, secondClass: 8,  thirdClass: 25 }
//             ,{ firstClass: 6,  secondClass: 122, thirdClass: 28 }
//             ,{ firstClass: 50, secondClass: 60, thirdClass: 20 }
//             ,{ firstClass: 50, secondClass: 60, thirdClass: 70 }
//             ,{ firstClass: 30, secondClass: 40, thirdClass: 50 }
//         ]
//         baseData = new FrequenciesArray(baseData)
//
//
//         QUnit.module('DictionariesArray')
//         QUnit.test('.data()', (assert) => {
//             assert.equal(typeof(baseData.data), 'object', 'baseData.data must be an array/object.')
//             assert.equal(typeof(baseData.data[0]), 'object', 'baseData must be an array/object.')
//             assert.equal(
//                 JSON.stringify(baseData.data[0])
//                 , "{\"firstClass\":110,\"secondClass\":8,\"thirdClass\":25}"
//                 , 'baseData.data[0] must exactly match the template.')
//         })
//
//         QUnit.test('.maxValue', (assert) => {
//             assert.equal(
//                 frontData.maxValue
//                 , 43
//                 , 'Max value must be 43.')
//         })
//
//     }



//// UMD FOOT ////////////////////////////////////////////////////////////////////////

    //// MODULE.EXPORTS ////
    exports.Stack = Stack;
    exports.FrequenciesArray = FrequenciesArray;


    Object.defineProperty(exports, '__esModule', {value: true});

})));
//////////////////////////////////////////////////////////////////////////////////////
