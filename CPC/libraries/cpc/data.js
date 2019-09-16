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


class Stacks{

    constructor(){

        this._data = new Map()

    }


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


    add(label, stack){

        this.data().set(label, stack)

        return this
    }


    clear(){

        this.data().clear()

        return this
    }


    populateWithExampleData(){


        const genderStack = new Stack().populateWithExampleData('gender')
        const classStack = new Stack().populateWithExampleData('class')
        const statusStack = new Stack().populateWithExampleData('status')

        this.data()
            .set('gender', genderStack)
            .set('class', classStack)
            .set('status', statusStack)

        return this
    }


    /**
     * A nested map is a Map with other Maps in itself.
     */
    fromNestedMap(map){

        this.clear()

        map.forEach( (categoriesSummary, columnName) => {

            const stack = new Stack().fromShallowMap(categoriesSummary)
            this.add(columnName, stack)

        })

        return this

    }



}

class Stack {


    constructor() {

        this._data = new Map()

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

    /**
     * A shallow map is a Map with no maps nested in it. (e.g., Map([ ['a',1], ['b',2] ])
     * @param map {Map}
     * @return {Stack}
     */
    fromShallowMap(map){

        const stackData = new Map()

        let counts = []
        map.forEach( (count, categoryName) => { counts.push(count) })

        const percentages = arrayUtils.toPercentages(counts)
        const stackValues = arrayUtils.toStackData(counts)

        let i = 0
        map.forEach( (count, categoryName) => {

            stackData.set(categoryName, new Map())
                .get(categoryName)
                  .set('label', categoryName)
                  .set('count', count)
                  .set('percentage', percentages[i])
                  .set('start', stackValues[i][0])
                  .set('end', stackValues[i][1])

            i++
        })

        this.data(stackData)

        return this


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

        if (variant === 'generic with spaces in category names'){

            exampleData.set('category 1', new Map())
                .get('category 1')
                    .set('label', 'Category One')
                    .set('start', 0)
                    .set('end', 10)
                    .set('percentage', 33)

            exampleData.set('category 2', new Map())
                .get('category 2')
                    .set('label', 'Category Two')
                    .set('start', 10)
                    .set('end', 20)
                    .set('percentage', 33)

            exampleData.set('category 3', new Map())
                .get('category 3')
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






//// UMD FOOT ////////////////////////////////////////////////////////////////////////

    //// MODULE.EXPORTS ////
    exports.Stacks = Stacks;
    exports.Stack = Stack;


    Object.defineProperty(exports, '__esModule', {value: true});

})));
//////////////////////////////////////////////////////////////////////////////////////
