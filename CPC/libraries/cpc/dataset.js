
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
     * @param omitColumns {Array}
     * @param callback {function} - Optional
     */
    constructor(path, omitColumns=[]){

        this._path = path
        this._omitColumns = typeof omitColumns === 'string' ? [omitColumns] : omitColumns

        this.data = null

        this.columnNames = []
        this.categoryNames = []
        this.structure = new Map()
        this._queryPath = new Map()

        this.counts = null
        this.frequenciesArray = null
        this.totalsArray = null  // base frequencies

        this.rowCount = null
        this.columnCount = null


    }


    async build(){

        this.data = await d3.csv(this._path, (d) => {

            this._omitColumns.forEach( (omittedColumnName) => {
                delete d[omittedColumnName]  // d3 reads each column cell as a row property. This line deletes the property that matches an omitted column name from the row being currently read.
                // TODO: This is a hack. If there is a legit way to ignore a column when D3 is reading it, that method should be used.
            })

            return d

        }) // when testing this functionality use an async test

        // Manually delete the omitted column name from columns list // TODO: Deleting columns from registry this way is a hack and it COULD be fixed for more robust code. The hack is needed because columns were ignored also with a hack (a few lines above), and hence D3 still lists the ignored column name in the list of columns in the data.
        this.data.columns = this.data.columns.filter(
            (e) => !this._omitColumns.includes(e)
        )


        this._calculateInstanceProperties()

    }


     _calculateInstanceProperties(){

         this.columnNames = this.data.columns
         this.columnCount = this.columnNames.length
         this.rowCount = this.data.length

         this.counts = this._countOccurrencesOfEachCategory()

         this.structure = this._mapDatasetStructure()
         this.categoryNames = this._getCategoryNames()
     }


     /**
      * Calculate the frequencies within a specified nested category (e.g., status=>gender=>ticket)
      * @param breakdownPath {rest}
      * @return {null}
      */
     breakdown (...breakdownPath){

         let queryString
         queryString = new BreakdownQuery(this, breakdownPath).queryString

         return eval(queryString)

     }


     drilldown (...drilldownPath){

         let queryString

         const returningTheDataWithoutDrillingDown = !arguments.length

         if (returningTheDataWithoutDrillingDown) {
             queryString = new DrilldownQuery(this).queryString
         }

         if (!returningTheDataWithoutDrillingDown){
             queryString = new DrilldownQuery(this, drilldownPath).queryString
         }

         return eval(queryString)

     }


     summarize(){
         return this.drilldownAndSummarize()
     }


     drilldownAndSummarize (...drilldownPath){

         const resultingDataFromDrilldown = this.drilldown(...drilldownPath)


         const allCategoryFrequenciesInData = new Map()

         this.columnNames.forEach( (columnName) => {
             const categoryFrequenciesInColumn = d3.rollup(resultingDataFromDrilldown, v=>v.length, d=>d[columnName])
             allCategoryFrequenciesInData.set(columnName, categoryFrequenciesInColumn)
         })

         return allCategoryFrequenciesInData
     }



     _getCategoryNames() {

         const categoriesAsObjects = this.structure.values()
         const categoriesAsArrays =  Array.from(categoriesAsObjects)
         const categoriesAsSingleArray = _.flattenDeep(categoriesAsArrays)

         return categoriesAsSingleArray

     }


     inferColumnFromCategory(category) {

         const columnsThatContainCategory = []

         this.structure.forEach( (categories, column) => {
             if(categories.includes(category)){
                 columnsThatContainCategory.push(column)
             }
         })

         const moreThanOneColumnContainsTheCategory = columnsThatContainCategory.length > 1
         const noColumnContainsTheCategory = columnsThatContainCategory.length === 0


         if (moreThanOneColumnContainsTheCategory) {
             throw Error(`The category name "${category}" occurs in these columns: "${columnsThatContainCategory}". Columns in the dataset should not share category names.`)
         }

         if(noColumnContainsTheCategory){
             throw Error(`The category name "${category}" does not occur in the dataset. One column in the dataset should contain the specified category.`)
         }


         // if no errors are thrown...
         return columnsThatContainCategory[0]  // just to get the element out of the array. If no error was thrown, there is only one item in the array.


     }


     /**
      * Creates a map from dataset that consists of entries such as 'Gender' => ['Male', 'Female']
      * @private
      */
    _mapDatasetStructure(){

        const structure = new Map()

        // loop //
        this.columnNames.forEach( (eachColumnName) => {

                const levelOneBreakDownResult = this.breakdown(eachColumnName)  // returns object
                const categoryNamesInEachColumn = Array.from(levelOneBreakDownResult.keys())  // returns array
                structure.set(eachColumnName, categoryNamesInEachColumn)  // e.g.,  'Gender' => ['Male', 'Female']

        })

        return structure

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

            groupedData = this.breakdown(columnName)

            innerMap = new Map()
            groupedData.forEach((key, value) => {

                innerMap.set(value, key)
                outerMap.set(columnName, innerMap)

            })

        })

        // console.log(outerMap)
        return outerMap

    }


}


class BreakdownQuery {

    /**
     @param dataset {Dataset}
     @param breakdownPath {array} - e.g., ['Gender', 'Male', 'First class']
     @return {null}
     */
    constructor (dataset, breakdownPath) {


        // Public Parameters //
        this._datasetObject = dataset
        this._breakdownPath = breakdownPath

        // Private Variables //
        this._categoryPath = []
        this._columnPath = []

        this._breakdownType = this._inferBreakdownType.call(this)  // e.g., 'column' type

        this._argumentsSubstring =  this._constructArgumentsSubstring.call(this)
        this._gettersSubstring = this._constructGettersSubstring.call(this)

        this.queryString = this._constructQueryString.call(this)


        // Initialize //
        classUtils.requireProperties(this._datasetObject,
            ['data', 'columnNames', 'categoryNames', '_omitColumns']
        )

        this._requireBreakdownPathToNotContainColumnAndCategoryNamesAtTheSameTime()
        this._validateBreakdownPath()

    }


    _requireBreakdownPathToNotContainColumnAndCategoryNamesAtTheSameTime(){

        if (this._breakdownType === 'hybrid'){
            throw Error (`Both a column name and a category name exists in breakdown path argument "[${this._breakdownPath}]". Breakdown path must consist of either only column names, or only category names.`)
        }

    }

    _validateBreakdownPath(){

        let stepDoesNotCorrespondToAColumnOrCategory = false

        const erroneousSteps = []

        // loop
        this._breakdownPath.forEach( (step) => {

            let stepIsAmongColumns = false
            let stepIsAmongCategories = false

            if (this._datasetObject.columnNames.includes(step)) {
                stepIsAmongColumns= true
            }

            if (this._datasetObject.categoryNames.includes(step)) {
                stepIsAmongCategories = true
            }

            if (!stepIsAmongColumns && !stepIsAmongCategories){
                stepDoesNotCorrespondToAColumnOrCategory = true
                erroneousSteps.push(step)

            }

        })

        if (stepDoesNotCorrespondToAColumnOrCategory){
            throw Error(`Provided breakdown query argument(s), "[${erroneousSteps}]", do not correspond to a column or category in the dataset.`)
        }



    }


    _inferBreakdownType(){

        let isColumnPath = false
            , isCategoryPath =  false
            , isHybridPath = false

        // loop //
        this._breakdownPath.forEach( (breakdownStep) => {
            if (this._datasetObject.categoryNames.includes(breakdownStep)){isCategoryPath = true}
            if (this._datasetObject.columnNames.includes(breakdownStep)){isColumnPath = true}
        })

        isHybridPath = isCategoryPath && isColumnPath

        if(isHybridPath) {return 'hybrid'}
        else {
            if(isColumnPath){return 'column'}
            if(isCategoryPath){return 'category'}
        }
    }


    _constructArgumentsSubstring(
        type = this._breakdownType,
        breakdownPath = this._breakdownPath,
        datasetObject = this._datasetObject
        ){

        let substring = ''


        if (type === 'category') {

            let substring = ''

            // Infer the column path from categories
            breakdownPath.forEach( (category) => {
                const column = datasetObject.inferColumnFromCategory(category)
                substring += `d => d["${column}"], `  // e.g., "d => d['gender'],"

            })

        }


        if (type === 'column') {

            for (let eachBreakdownStep of this._breakdownPath) {
                substring += `d => d["${eachBreakdownStep}"], `  // e.g., "d => d['gender'],"
            }

        }

        // Omit the last comma and the space at the very end (e.g., "d => d['gender'], ")
        substring = substring.slice(0, substring.length - 2)


        return substring

    }


    _constructGettersSubstring(){

        let substring = ''


        if (this._breakdownType === 'column'){
            return ''
        }

        if (this._breakdownType === 'category'){


            // Build the getters substring


            return `.get('Male')`
        }

    }


    _constructQueryString(){

        return  `d3.group(this.data, ${this._argumentsSubstring})${this._gettersSubstring}`

    }

}





class DrilldownQuery{

    constructor(dataset, drilldownPath) {

        // Public Parameters //
        this._datasetObject = dataset
        this._drilldownPath = drilldownPath

        // Public Variables
        this.queryString = ''

        // Initialize //
        classUtils.requireProperties(this._datasetObject,
            ['data', 'columnNames', 'categoryNames', '_omitColumns']
        )

        // this._validateBreakdownPath()  // TODO: Validation of path SHOULD BE DONE, so that incorrectly typed column and category names returns an appropriate error

        this._constructDrilldownQuery()

    }


    _constructDrilldownQuery(){

        let argumentsSubstring = ''
          , gettersSubstring = ''

        if (this._drilldownPath){

            this._drilldownPath.forEach(step => {  // e.g., {'Gender':'Male'}
                Object.entries(step).forEach( ([column, category]) => {

                    argumentsSubstring += `, g=>g['${column}']`
                    gettersSubstring += `.get('${category}')`

                })
            })
        }

        this.queryString = `d3.group(this.data${argumentsSubstring})${gettersSubstring}`

    }


}


//// UMD FOOT ////////////////////////////////////////////////////////////////////////
                             
    //// MODULE.EXPORTS ////
    exports.version = version;
    exports.Dataset = Dataset;
    exports.BreakdownQuery = BreakdownQuery;  // TODO: Exposed for development. MUST be removed or the class name should be made public.


	Object.defineProperty(exports, '__esModule', { value: true });

})));
//////////////////////////////////////////////////////////////////////////////////////

