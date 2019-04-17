// export { Dataset as default
//        , tests_Dataset
// }

'use strict'

class Dataset {

    /**
     *
     * @param path {string}
     * @param callback {function} - Optional
     */
    constructor(path, callback){

            this.data = null

            this.columnNames = null  // will be assigned by ._readCsv().

            this._frequenciesMap = null
            this.frequenciesArray = null
            this.totalsArray = null  // base frequencies

            this.rowCount = null
            this.columnCount = null

            this._readCsv(path, callback) // assigns value to 'this.data'

    }


    /**
     *
     * @param path {string}
     * @param callback {function} - Optional
     * @private
     */
    _readCsv (path, callback = ()=>{}) {

            d3.csv(path)
                .then( data => {

                    this.data = data

                    this._calculateProperties()

                    callback()

                })
                .catch((console.error))

    }

    _calculateProperties(){
        this.columnNames = this._getColumnNames()
        this._frequenciesMap = this._survey()
        this.frequenciesArray = this._convertFrequenciesMapToFrequenciesArray(this._frequenciesMap)
        this.totalsArray = this._generateTotalsArrayFromFrequenciesArray()
        this.columnCount = this.columnNames.length
        this.rowCount = this.data.length
    }

    /**
     * Calculate frequency of each value for each column
     * @return {Map<any, any>}
     * @private
     */
    _survey(){

        let outerMap = new Map()
          , innerMap
          , groupedData

       this.columnNames.forEach(columnName => {

           groupedData = this._getFrequenciesWithinNestedGroup(columnName)

           innerMap = new Map()
           groupedData.forEach((key, value) => {

               innerMap.set(value, key)

               outerMap.set(columnName, innerMap)

           })

       })

        return outerMap

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

        const totalsArray = new FrequenciesArray(nativeArray)
        return totalsArray

    }

    /**
     * Calculate the frequencies within a specified nested category (e.g., status=>gender=>ticket)
     * @param drilldownOrder {rest}
     * @return {null}
     */
    _getFrequenciesWithinNestedGroup (...drilldownOrder){

        const queryString = new _DrilldownQueryString(drilldownOrder).queryString

        return eval(queryString)

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

        const categoryCountsMap = this._frequenciesMap

        for (const [columnName, categoryNamesAndValues] of categoryCountsMap) {

            eachObject = {}
            for (const [categoryName, categoryCount] of categoryNamesAndValues) {

                eachObject[categoryName] = categoryCount

            }
            nativeArray.push(eachObject)

        }

        const countsArray = new FrequenciesArray(nativeArray)
        return countsArray

    }


}


class _DrilldownQueryString {

    /**
     @param drilldownOrder {array}
     @return {null}
     */
    constructor (drilldownOrder) {

        this._drilldownOrder = drilldownOrder

        this._keyFunctionSubstring = null
        this.queryString = null

        // Construct the query string
        this._constructSubstringForKeyFunctionChain()
        this._constructQueryString()

    }


    _constructQueryString(){

        this.queryString =  "d3.rollup(this.data, v => v.length, " + this._keyFunctionSubstring + ")"

    }

    _constructSubstringForKeyFunctionChain(){

        let parameterSubstring = ''

        for (let eachItem of this._drilldownOrder){

            parameterSubstring +=  'd => d.' + eachItem + ', '  // e.g., "d => d.gender,"


            // OLD METHOD
            // substring +=  ".key(data => data['" + eachItem +"'])"

        }

        // Omit the last comma and the space after it (e.g., "d => d.gender, ")
        parameterSubstring = parameterSubstring.slice(0, parameterSubstring.length-2)

        this._keyFunctionSubstring = parameterSubstring

    }


}




// TESTS ===============================================================================================================


function tests_Dataset(){


    QUnit.module('Dataset')

        // Dataset should be loaded outside the test environment due to asynchronous reading
        let titanicDataset = new Dataset('../data/titanic/titanic-4columns.csv')

        QUnit.test('Data is loaded and automatic properties are OK.', assert => {

            assert.equal(titanicDataset.data.length, 1309, 'Number of rows in the dataset is OK.')


            const frequenciesArrayHead = titanicDataset.frequenciesArray.data.slice(0,3)
            assert.equal(
                JSON.stringify(frequenciesArrayHead)
                , "[{\"1st class\":323,\"2nd class\":277,\"3rd class\":709},{\"Survived\":500,\"Died\":809},{\"Female\":466,\"Male\":843}]"
                , '".frequenciesArray" property is automatically calculated.'
            )


            // Check totalsArray property
            assert.equal(
                JSON.stringify(titanicDataset.totalsArray)
                , "{\"data\":[{\"Total\":1309},{\"Total\":1309},{\"Total\":1309},{\"Total\":1309}],\"maxValue\":1309,\"uniqueKeys\":[\"Total\"]}"
                , "'.totalsArray' property of the instance has been calculated while importing data to the instance."
            )

        })


    // Generate totals array using the frequencies
    QUnit.test('_generateTotalsArrayFromFrequenciesArray()', (assert) => {

        // Check if .frequenciesArray property is OK.
        assert.equal(
            JSON.stringify(titanicDataset.frequenciesArray.data.slice(0,3))
            , "[{\"1st class\":323,\"2nd class\":277,\"3rd class\":709},{\"Survived\":500,\"Died\":809},{\"Female\":466,\"Male\":843}]"
            , ".frequenciesArray property exists and has expected value."
        )

        // Generate totalsArray
        const totalsArray = titanicDataset._generateTotalsArrayFromFrequenciesArray()

        assert.equal(
            JSON.stringify(totalsArray.data)  // NOTE: Only checks the data property
            , "[{\"Total\":1309},{\"Total\":1309},{\"Total\":1309},{\"Total\":1309}]"
            , '.totalsArray is generated using .frequenciesArray.')


    })


    QUnit.test('._getFrequenciesWithinNestedGroup()', assert => {

            const survivedVsDied = titanicDataset._getFrequenciesWithinNestedGroup('Status')
                , survived = survivedVsDied.get('Survived')
                , died = survivedVsDied.get('Died')

            assert.equal(survived, 500, 'Correct counts must be returned.')
            assert.equal(died, 809, 'Correct counts must be returned.')


            const survivalByGender = titanicDataset._getFrequenciesWithinNestedGroup('Status', 'Gender')
                , survivedFemales = survivalByGender.get('Survived').get('Female')
                , survivedMales = survivalByGender.get('Survived').get('Male')

            assert.equal(survivedFemales, 339, 'Correct counts must be returned.')
            assert.equal(survivedMales, 161, 'Correct counts must be returned.')


            // Chaining complex queries
            const survivedFirstClassFemales =
                titanicDataset._getFrequenciesWithinNestedGroup('Status', 'Gender', 'Ticket')
                              .get('Survived').get('Female').get('1st class')

            assert.equal(survivedFirstClassFemales, 139, 'Returned count is correct.')

        })


        QUnit.test('._survey()', assert => {

            const surveyResults = titanicDataset._survey()

            const females = surveyResults.get('Gender').get('Female')
                , firstClass = surveyResults.get('Ticket').get('1st class')
                , thirdClass = surveyResults.get('Ticket').get('3rd class')
                , dead = surveyResults.get('Status').get('Died')

            assert.equal(females, 466, 'No. of females should be 466.')
            assert.equal(firstClass, 323, 'No. of first class tickets should be 323.')
            assert.equal(thirdClass, 709, 'No. of third class tickets should be 709.')
            assert.equal(dead, 809, 'No. of casualties should be 809.')

        })


        QUnit.test('._getColumnNames()', assert => {

            const result = JSON.stringify(titanicDataset._getColumnNames())
                , expected = "[\"Ticket\",\"Status\",\"Gender\",\"Name\"]"

            assert.equal(result, expected, 'Column names must match template.')


            // Check the property that holds the column names
            const columnNamesProperty = JSON.stringify(titanicDataset.columnNames)
            assert.equal(columnNamesProperty , expected, 'Column names should be written to property upon instantiation')
        })




        QUnit.test('_convertFrequenciesMapToFrequenciesArray()', (assert) => {

                const countsArray = titanicDataset._convertFrequenciesMapToFrequenciesArray(titanicDataset._frequenciesMap)
                    , countsArrayHead = countsArray.data.slice(0,3)

                assert.equal(JSON.stringify(countsArrayHead), "[{\"1st class\":323,\"2nd class\":277,\"3rd class\":709},{\"Survived\":500,\"Died\":809},{\"Female\":466,\"Male\":843}]")

        })




    QUnit.module('DrilldownQueryString generator')

        QUnit.test('Construct query substring and string generation', assert => {


            let myQuery1 = new _DrilldownQueryString( ['survived'])
            let myQuery2 = new _DrilldownQueryString( ['survived', 'gender'])
            let myQuery3 = new _DrilldownQueryString( ['survived', 'gender', 'class'])

            const expected1 = "d3.rollup(this.data, v => v.length, d => d.survived)"
                , expected2 = "d3.rollup(this.data, v => v.length, d => d.survived, d => d.gender)"
                , expected3 = "d3.rollup(this.data, v => v.length, d => d.survived, d => d.gender, d => d.class)"


            assert.equal(myQuery1.queryString, expected1, 'Constructed query string must match template.')
            assert.equal(myQuery2.queryString, expected2, 'Constructed query string must match template.')
            assert.equal(myQuery3.queryString, expected3, 'Constructed query string must match template.')

        })


        QUnit.test('Construct query substring and string generation', assert => {

            let myQuery1 = new _DrilldownQueryString( ['survived'])
            let myQuery2 = new _DrilldownQueryString( ['survived', 'gender'])
            let myQuery3 = new _DrilldownQueryString( ['survived', 'gender', 'class'])


            // Test substring generation
            const expectedSubString1 = "d => d.survived"
                , expectedSubString2 = "d => d.survived, d => d.gender"
                , expectedSubString3 = "d => d.survived, d => d.gender, d => d.class"

            const resultSubString1 = myQuery1._keyFunctionSubstring
                , resultSubString2 = myQuery2._keyFunctionSubstring
                , resultSubString3 = myQuery3._keyFunctionSubstring

            assert.equal(resultSubString1, expectedSubString1, 'Constructed query subString must match template.')
            assert.equal(resultSubString2, expectedSubString2, 'Constructed query subString must match template.')
            assert.equal(resultSubString3, expectedSubString3, 'Constructed query subString must match template.')

        })

}

