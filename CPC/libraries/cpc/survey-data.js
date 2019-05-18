//// UMD HEAD ////////////////////////////////////////////////////////////////////////
// UMD head and foot patterns adapted from d3.js (Copyright 2019 Mike Bostock)
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
        typeof define === 'function' && define.amd ? define(['exports'], factory) :
            (factory((global.surveyData = global.surveyData || {})));
}(this, (function (exports) {
    'use strict';
//////////////////////////////////////////////////////////////////////////////////////


    // Module content goes here. 
    const version = "1.0"




    /**
     * @param omitColumns {Array}
     * @return {Map}
     */
    function surveyData(data, omitColumns=[], onlyGetRowCountForUppermostLevel=false){

        // const columnNames = data.columns

        // NOTE - COLUMN NAMES MUST BE CALCULATED FOR GENERALIZABILITY OF THIS METHOD: d3.csvParse method returns an Array object with an additional property '.columns'. This is not the case for the d3Array.group() method; d3Array.group() returns only an array (which does not have the .columns property). Therefore, the surveyData function extracts column names from the first object in the results array.
        // WARNING - ONLY THE KEYS OF THE FIRST OBJECT IN A RESULT ARRAY IS CHECKED FOR COLUMN NAMES : The column names are calculated only by looking at the first object in an array. E.g. the first object's keys in this results array: '[{Ticket: "1st class", Status: "Survived", Gender: "Male", Name: "John, X"}, {...}]'
        const columnNames = Object.keys(data[0])

        const filteredColumnNames = columnNames.filter(element => !(omitColumns.includes(element)) )


        let outerMap = new Map()
            , innerMap


        if (onlyGetRowCountForUppermostLevel){

            innerMap = new Map()
            innerMap.set('All categories', d3.rollup(data, v => v.length))

            outerMap.set('All columns', innerMap)
        }
        else{
            filteredColumnNames.forEach( columnName => {

                innerMap = d3.rollup(data, v => v.length, d => d[columnName])

                outerMap.set(columnName, innerMap)
            })
        }


        return outerMap

    }


//// UMD FOOT ////////////////////////////////////////////////////////////////////////

    //// MODULE.EXPORTS ////
    exports.surveyData = surveyData;        // public method


    Object.defineProperty(exports, '__esModule', {value: true});

})));
//////////////////////////////////////////////////////////////////////////////////////

