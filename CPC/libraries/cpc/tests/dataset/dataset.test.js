//// IMPORTS /////////////////////////////////////////////////////////////////////////////////////////////////////////////

//// POLYFILLS ////

// Import polyfill for fetch() method
if (typeof fetch !== 'function') {
    global.fetch =  require('node-fetch-polyfill')
}

// Import polyfill for Object.fromEntries() method
if (typeof Object.fromEntries !== 'function') {
    Object.fromEntries = require('object.fromentries')
}


//// REQUIREMENTS ////

global.d3 = {
    ...require("../../../external/d3/d3"),
    ...require("../../../external/d3/d3-array")
}
global.data = require("../../data")

//// MODULES BEING TESTED ////
const dataset = require("../../dataset")






//// UNIT TESTS /////////////////////////////////////////////////////////////////////////////////////////////////////////////




test ('Should read data with d3', async () => {

    expect.assertions(1)


    // TODO: Dataset MUST be copied to test directory
    const titanicDataset = await d3.csv('http://localhost:3000/libraries/cpc/tests/dataset/titanic.csv')

    expect(titanicDataset.length).toBe(1309)


})


test ('Should read data with d3.csv wrapped in a function', async () => {

    expect.assertions(1)

    async function wrapper(){

        return await d3.csv('http://localhost:3000/libraries/cpc/tests/dataset/titanic.csv')

    }

    const titanicDataset = await wrapper()

    // const titanicDataset = await d3.csv('http://localhost:3000/data/titanic.csv')


    expect(titanicDataset.length).toBe(1309)


})


//// DATASET ////

test ('Should initiate a Dataset instance, read data into it, and calculate properties', async () => {

    expect.assertions(5)

    const titanicDataset = new dataset.Dataset('http://localhost:3000/libraries/cpc/tests/dataset/titanic.csv')
    await titanicDataset.build()


    expect(titanicDataset.data).toBeDefined()
    expect(titanicDataset.data).toHaveLength(1309)

    expect(titanicDataset.columnNames).toEqual(["Ticket", "Status", "Gender", "Name"])
    expect(titanicDataset.frequenciesArray.data).toHaveLength(4)
    expect(titanicDataset.totalsArray.data).toHaveLength(4)

    }
)


test ('Should query the dataset for counts of nested categories using public interface', async () => {


    const titanicDataset = new dataset.Dataset('http://localhost:3000/libraries/cpc/tests/dataset/titanic.csv')
    await titanicDataset.build()


    const initialSurveyResults = titanicDataset.counts

    const females = initialSurveyResults.get('Gender').get('Female')
        , firstClass = initialSurveyResults.get('Ticket').get('1st class')
        , thirdClass = initialSurveyResults.get('Ticket').get('3rd class')
        , died = initialSurveyResults.get('Status').get('Died')

    expect(females).toBe(466)
    expect(firstClass).toBe(323)
    expect(thirdClass).toBe(709)
    expect(died).toBe(809)

})


test ('Should query the dataset for counts of nested categories using private interface', async () => {


    const titanicDataset = new dataset.Dataset('http://localhost:3000/libraries/cpc/tests/dataset/titanic.csv')
    await titanicDataset.build()


    const initialSurveyResults = titanicDataset._countOccurrencesOfEachCategory()

    const females = initialSurveyResults.get('Gender').get('Female')
        , firstClass = initialSurveyResults.get('Ticket').get('1st class')
        , thirdClass = initialSurveyResults.get('Ticket').get('3rd class')
        , died = initialSurveyResults.get('Status').get('Died')

    expect(females).toBe(466)
    expect(firstClass).toBe(323)
    expect(thirdClass).toBe(709)
    expect(died).toBe(809)

})


test ('Should query the dataset for counts of nested categories using private interface', async () => {

    const titanicDataset = new dataset.Dataset('http://localhost:3000/libraries/cpc/tests/dataset/titanic.csv')
    await titanicDataset.build()


    // Query depth: 1
    const status = titanicDataset.drilldown('Status')
        , survived = status.get('Survived')
        , died = status.get('Died')

    expect(survived).toBe(500)
    expect(died).toBe(809)


    // Query depth: 2
    const statusByGender = titanicDataset.drilldown('Status', 'Gender')
        , survivedFemales = statusByGender.get('Survived').get('Female')
        , survivedMales = statusByGender.get('Survived').get('Male')

    expect(survivedFemales).toBe(339)
    expect(survivedMales).toBe(161)


    // Query depth: 3
    const survivedFirstClassFemales =
        titanicDataset.drilldown('Status', 'Gender', 'Ticket')
            .get('Survived').get('Female').get('1st class')

    expect(survivedFirstClassFemales).toBe(139)

})



test ('Should get column names in the imported dataset', async () => {

    const titanicDataset = new dataset.Dataset('http://localhost:3000/libraries/cpc/tests/dataset/titanic.csv')
    await titanicDataset.build()


    // Verify that the method that gets the column names work as expected
    const columnNames = JSON.stringify(titanicDataset._getColumnNames())
    expect(columnNames).toBe( "[\"Ticket\",\"Status\",\"Gender\",\"Name\"]")

    // Verify that the property that holds column names is correctly set upon initiation
    const propertyThatHoldsColumnNames = JSON.stringify(titanicDataset.columnNames)
    expect(propertyThatHoldsColumnNames).toBe( "[\"Ticket\",\"Status\",\"Gender\",\"Name\"]")

})


test ('Should convert frequencies array to frequencies map', async () => {

    const titanicDataset = new dataset.Dataset('http://localhost:3000/libraries/cpc/tests/dataset/titanic.csv')
    await titanicDataset.build()

    const countsArray = titanicDataset._convertFrequenciesMapToFrequenciesArray(titanicDataset.counts)
        , countsArrayHead = countsArray.data.slice(0,3)

    expect(JSON.stringify(countsArrayHead))
        .toEqual("[{\"1st class\":323,\"2nd class\":277,\"3rd class\":709},{\"Survived\":500,\"Died\":809},{\"Female\":466,\"Male\":843}]")


})



//// DRILLDOWN QUERY GENERATOR ////

test ('Should construct a query string', () => {

    let myQuery1 = new dataset.DrilldownQueryTemplate( ['survived'] )
      , myQuery2 = new dataset.DrilldownQueryTemplate( ['survived', 'gender'] )
      , myQuery3 = new dataset.DrilldownQueryTemplate( ['survived', 'gender', 'class'] )

    const expected1 = `d3.rollup(this.data, v => v.length, d => d["survived"])`
        , expected2 = `d3.rollup(this.data, v => v.length, d => d["survived"], d => d["gender"])`
        , expected3 = `d3.rollup(this.data, v => v.length, d => d["survived"], d => d["gender"], d => d["class"])`

    // Verify the entire query string generated (static + dynamic)
    expect(myQuery1.queryString).toBe(expected1)
    expect(myQuery2.queryString).toBe(expected2)
    expect(myQuery3.queryString).toBe(expected3)

    // Verify the dynamic part of the query
    expect(myQuery1._querySubstring).toBe(`d => d["survived"]`)
    expect(myQuery2._querySubstring).toBe(`d => d["survived"], d => d["gender"]`)
    expect(myQuery3._querySubstring).toBe(`d => d["survived"], d => d["gender"], d => d["class"]`)

})
