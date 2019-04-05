
import clog from "./consoleTools.js"

export { DictionariesArray as default
       , tests_dictionariesArray
}

class DictionariesArray {

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


// UNIT TESTS //////////////////////////////////////////////////////////////

function tests_dictionariesArray() {

    // Preparation

    let frontData = [
        { firstClass: 10,  secondClass: 8,  thirdClass: 25 }
        ,{ firstClass: 4,  secondClass: 12, thirdClass: 28 }
        ,{ firstClass: 2,  secondClass: 19, thirdClass: 32 }
        ,{ firstClass: 7,  secondClass: 23, thirdClass: 35 }
        ,{ firstClass: 23, secondClass: 17, thirdClass: 43 }
    ]

    frontData = new DictionariesArray(frontData)

    let baseData = [
        { firstClass: 110, secondClass: 8,  thirdClass: 25 }
        ,{ firstClass: 6,  secondClass: 122, thirdClass: 28 }
        ,{ firstClass: 50, secondClass: 60, thirdClass: 20 }
        ,{ firstClass: 50, secondClass: 60, thirdClass: 70 }
        ,{ firstClass: 30, secondClass: 40, thirdClass: 50 }
    ]
    baseData = new DictionariesArray(baseData)


    QUnit.module('DictionariesArray')
    QUnit.test('.data()', (assert) => {
        assert.equal(typeof(baseData.data), 'object', 'baseData.data must be an array/object.')
        assert.equal(typeof(baseData.data[0]), 'object', 'baseData must be an array/object.')
        assert.equal(
            JSON.stringify(baseData.data[0])
            , "{\"firstClass\":110,\"secondClass\":8,\"thirdClass\":25}"
            , 'baseData.data[0] must exactly match the template.')
    })

    QUnit.test('.maxValue', (assert) => {
        assert.equal(
            frontData.maxValue
            , 43
            , 'Max value must be 43.')
    })

}