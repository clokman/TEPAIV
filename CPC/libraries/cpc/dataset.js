
//// UMD HEAD ////////////////////////////////////////////////////////////////////////
// UMD head and foot patterns adapted from d3.js (Copyright 2019 Mike Bostock)
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
        typeof define === 'function' && define.amd ? define(['exports'], factory) :
            (factory((global.dataset = global.dataset || {})));
}(this, (function (exports) { 'use strict';
//////////////////////////////////////////////////////////////////////////////////////





               
// Module content goes here. 
const version = "1.0"






 class Dataset {

    /**
     *
     * @param path {string}
     * @param callback {function} - Optional
     */
    constructor(path){

        this._path = path

        this.data = null

        this.columnNames = null  // will be assigned by

        this.counts = null
        this.frequenciesArray = null
        this.totalsArray = null  // base frequencies

        this.rowCount = null
        this.columnCount = null


    }


    async build(){

        this.data = await d3.csv(this._path) // should be tested with an async test
        this._calculateInstanceProperties()

    }


    _calculateInstanceProperties(){

        this.columnNames = this._getColumnNames()
        this.columnCount = this.columnNames.length
        this.rowCount = this.data.length

        this.counts = this._countOccurrencesOfEachCategory()
        this.frequenciesArray = this._convertFrequenciesMapToFrequenciesArray(this.counts)
        this.totalsArray = this._generateTotalsArrayFromFrequenciesArray()
    }


    /**
     * Calculate frequency of each value for each column
     * @return {Map<any, any>}
     * @private
     */
    _countOccurrencesOfEachCategory(){

        let outerMap = new Map()
            , innerMap
            , groupedData

        this.columnNames.forEach(columnName => {

            groupedData = this.drilldown(columnName)

            innerMap = new Map()
            groupedData.forEach((key, value) => {

                innerMap.set(value, key)
                outerMap.set(columnName, innerMap)

            })

        })

        // console.log(outerMap)
        return outerMap

    }


     /**
      * Calculate the frequencies within a specified nested category (e.g., status=>gender=>ticket)
      * @param drilldownOrder {rest}
      * @return {null}
      */
     drilldown (...drilldownOrder){

         const queryString = new DrilldownQueryTemplate(drilldownOrder).queryString

         return eval(queryString)

     }

    _generateTotalsArrayFromFrequenciesArray(){

        let nativeArray = []
            , eachValueGroupTotal = 0


        for (const eachObject of this.frequenciesArray.data){

            // console.log(eachObject)

            eachValueGroupTotal = 0
            for (const [name, values] of Object.entries(eachObject)){
                eachValueGroupTotal += values
            }

            nativeArray.push(
                {'Total':eachValueGroupTotal}
            )

        }

        const totalsArray = new data.FrequenciesArray(nativeArray)
        return totalsArray

    }


    _getColumnNames(){

        return this.data.columns
    }

    /**
     *
     * @param Map {Map}
     * @return {FrequenciesArray}
     * @private
     */
    _convertFrequenciesMapToFrequenciesArray(Map){

        let nativeArray = []
            , eachObject = {}

        const categoryCountsMap = this.counts
        window.categoryCountsMap = categoryCountsMap

        for (const [columnName, categoryNamesAndValues] of categoryCountsMap) {

            eachObject = {}
            for (const [categoryName, categoryCount] of categoryNamesAndValues) {

                eachObject[categoryName] = categoryCount

            }
            nativeArray.push(eachObject)

        }

        const countsArray = new data.FrequenciesArray(nativeArray)
        return countsArray

    }


}


class DrilldownQueryTemplate {

    /**
     @param drilldownPath {array} - e.g., ['Gender', 'Male', 'First class']
     @return {null}
     */
    constructor (drilldownPath) {

        this._drilldownPath = drilldownPath

        this._querySubstring = null
        this.queryString = null

        // Construct the query string
        this._constructSubstringForKeyFunctionChain()
        this._constructQueryString()

    }


    _constructSubstringForKeyFunctionChain(){

        let parameterSubstring = ''

        for (let eachDrilldownStep of this._drilldownPath){

            parameterSubstring +=  `d => d["${eachDrilldownStep}"], `  // e.g., "d => d['gender'],"

        }

        // Omit the last comma and the space after it (e.g., "d => d.gender, ")
        parameterSubstring = parameterSubstring.slice(0, parameterSubstring.length-2)

        this._querySubstring = parameterSubstring

    }

    _constructQueryString(){

        this.queryString =  "d3.rollup(this.data, v => v.length, " + this._querySubstring + ")"

    }


}






//// UMD FOOT ////////////////////////////////////////////////////////////////////////
                             
    //// MODULE.EXPORTS ////
    exports.version = version;
    exports.Dataset = Dataset;
    exports.DrilldownQueryTemplate = DrilldownQueryTemplate;  // TODO: Exposed for development. MUST be removed or the class name should be made public.


	Object.defineProperty(exports, '__esModule', { value: true });

})));
//////////////////////////////////////////////////////////////////////////////////////

