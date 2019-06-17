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

//// TESTING LIBRARIES ////
require("../../../../../Utilities/jest-console")

//// REQUIREMENTS ////

global.d3 = {
    ...require("../../../external/d3/d3"),
    ...require("../../../external/d3/d3-array")
}
global.data = require("../../data")
global._ = require("../../../external/lodash")
global.classUtils = require("../../../utils/classUtils")

//// MODULES BEING TESTED ////
const dataset = require("../../dataset")






//// UNIT TESTS /////////////////////////////////////////////////////////////////////////////////////////////////////////////




test ('Should read data with d3', async () => {

    expect.assertions(1)

    const titanicDataset = await d3.csv('http://localhost:3000/libraries/cpc/tests/dataset/titanic.csv')

    expect(titanicDataset.length).toBe(1309)


})


test ('Should read data with d3.csv wrapped in a function', async () => {

    expect.assertions(1)

    async function wrapper(){

        return await d3.csv('http://localhost:3000/libraries/cpc/tests/dataset/titanic.csv')

    }

    const titanicDataset = await wrapper()

    expect(titanicDataset.length).toBe(1309)


})


//// DATASET ////

test ('Should initiate a Dataset instance, read data into it, and calculate properties', async () => {

    expect.assertions(9)

    const titanicDataset = new dataset.Dataset('http://localhost:3000/libraries/cpc/tests/dataset/titanic.csv')
    await titanicDataset.build()


    expect(titanicDataset.data).toBeDefined()
    expect(titanicDataset.data).toHaveLength(1309)

    expect(titanicDataset.columnNames).toEqual(["Ticket", "Status", "Gender", "Name"])
    // For category names, see the test that initiates the dataset with an omitted column.
    // (Category names are not tested here due to excessive number of them caused by 'Name' column to be included.)

    // Verify that dataset structure is correctly mapped
    expect(titanicDataset.structure).toBeInstanceOf(Map)
    expect(titanicDataset.structure.size).toBe(4)
    expect(titanicDataset.structure.get('Gender')).toBeInstanceOf(Array)
    expect(titanicDataset.structure.get('Gender')).toEqual(["Female", "Male"])
    expect(titanicDataset.structure.get('Ticket')).toEqual(["1st class", "2nd class", "3rd class"])
    expect(titanicDataset.structure.get('Status')).toEqual(["Survived", "Died"])

    }
)

test ('Dataset should initiate with an omitted column', async () => {

    expect.assertions(10)

    const titanicDataset = new dataset.Dataset(
          'http://localhost:3000/libraries/cpc/tests/dataset/titanic.csv',
          'Name'
    )
    await titanicDataset.build()


    expect(titanicDataset.data).toBeDefined()
    expect(titanicDataset.data).toHaveLength(1309)

    expect(titanicDataset.columnNames).toEqual(["Ticket", "Status", "Gender"])
    expect(titanicDataset.categoryNames).toEqual(["1st class", "2nd class", "3rd class", "Survived", "Died", "Female", "Male"])

    // Verify that dataset structure is correctly mapped
    expect(titanicDataset.structure).toBeInstanceOf(Map)
    expect(titanicDataset.structure.size).toBe(3)
    expect(titanicDataset.structure.get('Gender')).toBeInstanceOf(Array)
    expect(titanicDataset.structure.get('Gender')).toEqual(["Female", "Male"])
    expect(titanicDataset.structure.get('Ticket')).toEqual(["1st class", "2nd class", "3rd class"])
    expect(titanicDataset.structure.get('Status')).toEqual(["Survived", "Died"])

})




test ('BREAKDOWN (d3.group) dataset by column using .breakdown(), and then manually drilldown with .get()', async () => {


    const titanicDataset = new dataset.Dataset('http://localhost:3000/libraries/cpc/tests/dataset/titanic.csv', 'Name')
    await titanicDataset.build()

    // BREAKDOWN using column name
    const dataByGender = titanicDataset.breakdown('Gender')  // gender is a column name
    expectTable(dataByGender, `\
┌───────────────────┬──────────┬──────────────────────────────────────────────────────┐
│ (iteration index) │   Key    │                        Values                        │
├───────────────────┼──────────┼──────────────────────────────────────────────────────┤
│         0         │ 'Female' │ [ [Object], [Object], [Object], ... 463 more items ] │
│         1         │  'Male'  │ [ [Object], [Object], [Object], ... 840 more items ] │
└───────────────────┴──────────┴──────────────────────────────────────────────────────┘`)

    expect(dataByGender.size).toBe(2)
    expect(dataByGender.get('Female')).toHaveLength(466)
    expect(dataByGender.get('Male')).toHaveLength(843)


    // BREAKDOWN using 2 column names
    const dataByGenderAndStatus = titanicDataset.breakdown('Gender', 'Status')
    expectTable(dataByGenderAndStatus, `\
┌───────────────────┬──────────┬──────────────────────────────────────────────────┐
│ (iteration index) │   Key    │                      Values                      │
├───────────────────┼──────────┼──────────────────────────────────────────────────┤
│         0         │ 'Female' │ Map { 'Survived' => [Array], 'Died' => [Array] } │
│         1         │  'Male'  │ Map { 'Survived' => [Array], 'Died' => [Array] } │
└───────────────────┴──────────┴──────────────────────────────────────────────────┘`)

    // DRILLDOWN on one of the categories (i.e., 'Male') of the broken down data
    const malesByStatus = dataByGenderAndStatus.get('Male')
    expectTable(malesByStatus, `\
┌───────────────────┬────────────┬──────────────────────────────────────────────────────┐
│ (iteration index) │    Key     │                        Values                        │
├───────────────────┼────────────┼──────────────────────────────────────────────────────┤
│         0         │ 'Survived' │ [ [Object], [Object], [Object], ... 158 more items ] │
│         1         │   'Died'   │ [ [Object], [Object], [Object], ... 679 more items ] │
└───────────────────┴────────────┴──────────────────────────────────────────────────────┘`)

    // DRILLDOWN further on the drilled down category (i.e., 'Male')
    const survivingMales = malesByStatus.get('Survived')
    expectTable(survivingMales, `\
┌─────────┬─────────────┬────────────┬────────┐
│ (index) │   Ticket    │   Status   │ Gender │
├─────────┼─────────────┼────────────┼────────┤
│    0    │ '1st class' │ 'Survived' │ 'Male' │
│    1    │ '1st class' │ 'Survived' │ 'Male' │
│    2    │ '1st class' │ 'Survived' │ 'Male' │
│    3    │ '1st class' │ 'Survived' │ 'Male' │
│    4    │ '1st class' │ 'Survived' │ 'Male' │
│    5    │ '1st class' │ 'Survived' │ 'Male' │
│    6    │ '1st class' │ 'Survived' │ 'Male' │
│    7    │ '1st class' │ 'Survived' │ 'Male' │
│    8    │ '1st class' │ 'Survived' │ 'Male' │
│    9    │ '1st class' │ 'Survived' │ 'Male' │
└─────────┴─────────────┴────────────┴────────┘
˅˅˅ 151 more rows`, 0, 10)


    // BREAKDOWN & COUNT the drilled down category by another category using d3.rollup()
    const survivingMalesByTicket =
        d3.rollup(survivingMales, v=>v.length, g=>g['Ticket'])
    expectTable(survivingMalesByTicket, `\
┌───────────────────┬─────────────┬────────┐
│ (iteration index) │     Key     │ Values │
├───────────────────┼─────────────┼────────┤
│         0         │ '1st class' │   61   │
│         1         │ '2nd class' │   25   │
│         2         │ '3rd class' │   75   │
└───────────────────┴─────────────┴────────┘`)


    // Attempting to query with both column and category names should give error
    expect(() =>
        titanicDataset.breakdown('Gender', '1st class')
    ).toThrow(Error)

})


test ('DRILLDOWN (d3.group().get()) dataset by category using drilldown()', async () => {

    const titanicDataset = new dataset.Dataset('http://localhost:3000/libraries/cpc/tests/dataset/titanic.csv', 'Name')
    await titanicDataset.build()

    // DRILDOWN using a category name (i.e., 'Female')
    const femaleSubset = titanicDataset.drilldown({'Gender':'Female'})  // 'Gender' is a column name, while 'Female' is a category in the 'Gender' column

    expectTable(femaleSubset, `\
┌─────────┬─────────────┬────────────┬──────────┐
│ (index) │   Ticket    │   Status   │  Gender  │
├─────────┼─────────────┼────────────┼──────────┤
│    0    │ '1st class' │ 'Survived' │ 'Female' │
│    1    │ '1st class' │   'Died'   │ 'Female' │
│    2    │ '1st class' │   'Died'   │ 'Female' │
│    3    │ '1st class' │ 'Survived' │ 'Female' │
│    4    │ '1st class' │ 'Survived' │ 'Female' │
│    5    │ '1st class' │ 'Survived' │ 'Female' │
│    6    │ '1st class' │ 'Survived' │ 'Female' │
│    7    │ '1st class' │ 'Survived' │ 'Female' │
│    8    │ '1st class' │ 'Survived' │ 'Female' │
│    9    │ '1st class' │ 'Survived' │ 'Female' │
│   10    │ '1st class' │ 'Survived' │ 'Female' │
│   11    │ '1st class' │ 'Survived' │ 'Female' │
│   12    │ '1st class' │ 'Survived' │ 'Female' │
│   13    │ '1st class' │ 'Survived' │ 'Female' │
│   14    │ '1st class' │ 'Survived' │ 'Female' │
└─────────┴─────────────┴────────────┴──────────┘
˅˅˅ 451 more rows`, 0, 15)
    // Sample from further down in the data to see differing Ticket classes, while still only having 'Female' as gender.
    expectTable(femaleSubset, `\
˄˄˄ 150 preceding rows
┌─────────┬─────────────┬────────────┬──────────┐
│ (index) │   Ticket    │   Status   │  Gender  │
├─────────┼─────────────┼────────────┼──────────┤
│    0    │ '2nd class' │ 'Survived' │ 'Female' │
│    1    │ '2nd class' │ 'Survived' │ 'Female' │
│    2    │ '2nd class' │ 'Survived' │ 'Female' │
│    3    │ '2nd class' │ 'Survived' │ 'Female' │
│    4    │ '2nd class' │ 'Survived' │ 'Female' │
│    5    │ '2nd class' │ 'Survived' │ 'Female' │
│    6    │ '2nd class' │ 'Survived' │ 'Female' │
│    7    │ '2nd class' │ 'Survived' │ 'Female' │
│    8    │ '2nd class' │ 'Survived' │ 'Female' │
│    9    │ '2nd class' │ 'Survived' │ 'Female' │
│   10    │ '2nd class' │   'Died'   │ 'Female' │
│   11    │ '2nd class' │   'Died'   │ 'Female' │
│   12    │ '2nd class' │ 'Survived' │ 'Female' │
│   13    │ '2nd class' │ 'Survived' │ 'Female' │
│   14    │ '2nd class' │ 'Survived' │ 'Female' │
└─────────┴─────────────┴────────────┴──────────┘
˅˅˅ 301 more rows`, 150, 15)  // 'The remaining rows is not 0'  // TODO: Remaining rows in sliced array inputs are not correctly calculated. This COULD be fixed.


        // DRILDOWN using two category names (i.e., 'Female' and 'Survived')
    const femaleSurvivorsSubset = titanicDataset.drilldown({'Gender':'Female'}, {'Status':'Survived'})

    expectTable(femaleSurvivorsSubset, `\
┌─────────┬─────────────┬────────────┬──────────┐
│ (index) │   Ticket    │   Status   │  Gender  │
├─────────┼─────────────┼────────────┼──────────┤
│    0    │ '1st class' │ 'Survived' │ 'Female' │
│    1    │ '1st class' │ 'Survived' │ 'Female' │
│    2    │ '1st class' │ 'Survived' │ 'Female' │
│    3    │ '1st class' │ 'Survived' │ 'Female' │
│    4    │ '1st class' │ 'Survived' │ 'Female' │
│    5    │ '1st class' │ 'Survived' │ 'Female' │
│    6    │ '1st class' │ 'Survived' │ 'Female' │
│    7    │ '1st class' │ 'Survived' │ 'Female' │
│    8    │ '1st class' │ 'Survived' │ 'Female' │
│    9    │ '1st class' │ 'Survived' │ 'Female' │
│   10    │ '1st class' │ 'Survived' │ 'Female' │
│   11    │ '1st class' │ 'Survived' │ 'Female' │
│   12    │ '1st class' │ 'Survived' │ 'Female' │
│   13    │ '1st class' │ 'Survived' │ 'Female' │
│   14    │ '1st class' │ 'Survived' │ 'Female' │
└─────────┴─────────────┴────────────┴──────────┘
˅˅˅ 324 more rows`, 0, 15)

    expectTable(femaleSurvivorsSubset, `\
˄˄˄ 150 preceding rows
┌─────────┬─────────────┬────────────┬──────────┐
│ (index) │   Ticket    │   Status   │  Gender  │
├─────────┼─────────────┼────────────┼──────────┤
│    0    │ '2nd class' │ 'Survived' │ 'Female' │
│    1    │ '2nd class' │ 'Survived' │ 'Female' │
│    2    │ '2nd class' │ 'Survived' │ 'Female' │
│    3    │ '2nd class' │ 'Survived' │ 'Female' │
│    4    │ '2nd class' │ 'Survived' │ 'Female' │
│    5    │ '2nd class' │ 'Survived' │ 'Female' │
│    6    │ '2nd class' │ 'Survived' │ 'Female' │
│    7    │ '2nd class' │ 'Survived' │ 'Female' │
│    8    │ '2nd class' │ 'Survived' │ 'Female' │
│    9    │ '2nd class' │ 'Survived' │ 'Female' │
│   10    │ '2nd class' │ 'Survived' │ 'Female' │
│   11    │ '2nd class' │ 'Survived' │ 'Female' │
│   12    │ '2nd class' │ 'Survived' │ 'Female' │
│   13    │ '2nd class' │ 'Survived' │ 'Female' │
│   14    │ '2nd class' │ 'Survived' │ 'Female' │
└─────────┴─────────────┴────────────┴──────────┘
˅˅˅ 174 more rows`, 150, 15)

    expectTable(femaleSurvivorsSubset, `\
˄˄˄ 250 preceding rows
┌─────────┬─────────────┬────────────┬──────────┐
│ (index) │   Ticket    │   Status   │  Gender  │
├─────────┼─────────────┼────────────┼──────────┤
│    0    │ '3rd class' │ 'Survived' │ 'Female' │
│    1    │ '3rd class' │ 'Survived' │ 'Female' │
│    2    │ '3rd class' │ 'Survived' │ 'Female' │
│    3    │ '3rd class' │ 'Survived' │ 'Female' │
│    4    │ '3rd class' │ 'Survived' │ 'Female' │
│    5    │ '3rd class' │ 'Survived' │ 'Female' │
│    6    │ '3rd class' │ 'Survived' │ 'Female' │
│    7    │ '3rd class' │ 'Survived' │ 'Female' │
│    8    │ '3rd class' │ 'Survived' │ 'Female' │
│    9    │ '3rd class' │ 'Survived' │ 'Female' │
│   10    │ '3rd class' │ 'Survived' │ 'Female' │
│   11    │ '3rd class' │ 'Survived' │ 'Female' │
│   12    │ '3rd class' │ 'Survived' │ 'Female' │
│   13    │ '3rd class' │ 'Survived' │ 'Female' │
│   14    │ '3rd class' │ 'Survived' │ 'Female' │
└─────────┴─────────────┴────────────┴──────────┘
˅˅˅ 74 more rows`, 250, 15)


})




test ('DRILLDOWN (d3.group().get()) the dataset and BREAKDOWN+SUMMARIZE (d3.rollup) of all categories in the context of the drilled down data', async () => {


    const titanicDataset = new dataset.Dataset('http://localhost:3000/libraries/cpc/tests/dataset/titanic.csv', 'Name')
    await titanicDataset.build()



    // DRILLDOWN, and then BREAKDOWN+SUMMARIZE --- Zero depth (summary of initial/surface data without drilling down)
    const datasetSummary = titanicDataset.drilldownAndSummarize()

    expectTable(datasetSummary, `\
┌───────────────────┬──────────┬────────────────────────────────────────────────────────────────────┐
│ (iteration index) │   Key    │                               Values                               │
├───────────────────┼──────────┼────────────────────────────────────────────────────────────────────┤
│         0         │ 'Ticket' │ Map { '1st class' => 323, '2nd class' => 277, '3rd class' => 709 } │
│         1         │ 'Status' │              Map { 'Survived' => 500, 'Died' => 809 }              │
│         2         │ 'Gender' │               Map { 'Female' => 466, 'Male' => 843 }               │
└───────────────────┴──────────┴────────────────────────────────────────────────────────────────────┘`)




    // DRILLDOWN, and then BREAKDOWN+SUMMARIZE --- One category deep
    const femaleSubsetSummary = titanicDataset.drilldownAndSummarize({'Gender':'Female'})

    expectTable(femaleSubsetSummary, `\
┌───────────────────┬──────────┬────────────────────────────────────────────────────────────────────┐
│ (iteration index) │   Key    │                               Values                               │
├───────────────────┼──────────┼────────────────────────────────────────────────────────────────────┤
│         0         │ 'Ticket' │ Map { '1st class' => 144, '2nd class' => 106, '3rd class' => 216 } │
│         1         │ 'Status' │              Map { 'Survived' => 339, 'Died' => 127 }              │
│         2         │ 'Gender' │                      Map { 'Female' => 466 }                       │
└───────────────────┴──────────┴────────────────────────────────────────────────────────────────────┘`)



    // DRILLDOWN, and then BREAKDOWN+SUMMARIZE --- Two categories deep

    const femaleSurvivorsSubsetSummary =
        titanicDataset.drilldownAndSummarize({'Gender':'Female'}, {'Status':'Survived'})

    expectTable(femaleSurvivorsSubsetSummary, `\
┌───────────────────┬──────────┬───────────────────────────────────────────────────────────────────┐
│ (iteration index) │   Key    │                              Values                               │
├───────────────────┼──────────┼───────────────────────────────────────────────────────────────────┤
│         0         │ 'Ticket' │ Map { '1st class' => 139, '2nd class' => 94, '3rd class' => 106 } │
│         1         │ 'Status' │                     Map { 'Survived' => 339 }                     │
│         2         │ 'Gender' │                      Map { 'Female' => 339 }                      │
└───────────────────┴──────────┴───────────────────────────────────────────────────────────────────┘`)



    // DRILLDOWN, and then BREAKDOWN+SUMMARIZE --- Three categories deep

    const firstClassFemaleSurvivorsSubsetSummary =
        titanicDataset.drilldownAndSummarize({'Gender':'Female'}, {'Status':'Survived'}, {'Ticket':'1st class'})

    expectTable(firstClassFemaleSurvivorsSubsetSummary, `\
┌───────────────────┬──────────┬────────────────────────────┐
│ (iteration index) │   Key    │           Values           │
├───────────────────┼──────────┼────────────────────────────┤
│         0         │ 'Ticket' │ Map { '1st class' => 139 } │
│         1         │ 'Status' │ Map { 'Survived' => 139 }  │
│         2         │ 'Gender' │  Map { 'Female' => 139 }   │
└───────────────────┴──────────┴────────────────────────────┘`)

})




test ('Should query the dataset for counts of nested categories using private interface', async () => {


    const titanicDataset = new dataset.Dataset('http://localhost:3000/libraries/cpc/tests/dataset/titanic.csv')
    await titanicDataset.build()


    const initialSurveyResults = titanicDataset._countOccurrencesOfEachCategory()

    const females = initialSurveyResults.get('Gender').get('Female')
        , firstClass = initialSurveyResults.get('Ticket').get('1st class')
        , thirdClass = initialSurveyResults.get('Ticket').get('3rd class')
        , died = initialSurveyResults.get('Status').get('Died')

    expect(females).toHaveLength(466)
    expect(firstClass).toHaveLength(323)
    expect(thirdClass).toHaveLength(709)
    expect(died).toHaveLength(809)

})


test ('Should query the dataset for counts of nested categories using private interface', async () => {

    const titanicDataset = new dataset.Dataset('http://localhost:3000/libraries/cpc/tests/dataset/titanic.csv')
    await titanicDataset.build()


    // Query depth: 1
    const status = titanicDataset.breakdown('Status')
        , survived = status.get('Survived')
        , died = status.get('Died')

    expect(survived).toHaveLength(500)
    expect(died).toHaveLength(809)


    // Query depth: 2
    const statusByGender = titanicDataset.breakdown('Status', 'Gender')
        , survivedFemales = statusByGender.get('Survived').get('Female')
        , survivedMales = statusByGender.get('Survived').get('Male')

    expect(survivedFemales).toHaveLength(339)
    expect(survivedMales).toHaveLength(161)


    // Query depth: 3
    const survivedFirstClassFemales =
        titanicDataset.breakdown('Status', 'Gender', 'Ticket')
            .get('Survived').get('Female').get('1st class')

    expect(survivedFirstClassFemales).toHaveLength(139)

})



test ('Should get column names in the imported dataset', async () => {

    const titanicDataset = new dataset.Dataset('http://localhost:3000/libraries/cpc/tests/dataset/titanic.csv')
    await titanicDataset.build()

    // Verify that the property that holds column names is correctly set upon initiation
    let propertyThatHoldsColumnNames

    propertyThatHoldsColumnNames = JSON.stringify(titanicDataset.columnNames)
    expect(propertyThatHoldsColumnNames).toBe( `["Ticket","Status","Gender","Name"]`)



    const titanicDatasetWithOmittedColumn = new dataset.Dataset('http://localhost:3000/libraries/cpc/tests/dataset/titanic.csv', 'Name')
    await titanicDatasetWithOmittedColumn.build()

    // Verify that the property that holds column names is correctly set upon initiation
    propertyThatHoldsColumnNames = JSON.stringify(titanicDataset.columnNames)
    expect(propertyThatHoldsColumnNames).toBe( `["Ticket","Status","Gender","Name"]`)

})

test ('Should return column name when provided a category name', async () => {

    const titanicDataset = new dataset.Dataset('http://localhost:3000/libraries/cpc/tests/dataset/titanic.csv', 'Name')
    await titanicDataset.build()

    // Infer column name from given category name
    expect(titanicDataset.inferColumnFromCategory('Female')).toBe('Gender')
    expect(titanicDataset.inferColumnFromCategory('Male')).toBe('Gender')
    expect(titanicDataset.inferColumnFromCategory('1st class')).toBe('Ticket')
    expect(titanicDataset.inferColumnFromCategory('2nd class')).toBe('Ticket')
    expect(titanicDataset.inferColumnFromCategory('Survived')).toBe('Status')
    expect(titanicDataset.inferColumnFromCategory('Died')).toBe('Status')


    // Specified category does not exist in dataset
    expect(() => titanicDataset.inferColumnFromCategory('Non-existent category'))
        .toThrow(`The category name "Non-existent category" does not occur in the dataset. One column in the dataset should contain the specified category.`)

    // Category occurs in more than one column
    titanicDataset.structure.set('Sex', ['Male', 'Female'])
    expect(() => titanicDataset.inferColumnFromCategory('Male'))
        .toThrow(`The category name "Male" occurs in these columns: "Gender,Sex". Columns in the dataset should not share category names.`)

})




//// DRILLDOWN QUERY TEMPLATE ////  //TODO: TESTS OF THIS CLASS MUST BE MOVED TO ITS OWN TEST FILE
//
// test ('Should construct a query string', async () => {
//
//     const titanicDataset = new dataset.Dataset('http://localhost:3000/libraries/cpc/tests/dataset/titanic.csv')
//     await titanicDataset.build()
//
//     let myQuery1 = new dataset.DrilldownQueryTemplate( titanicDataset, ['Status'] )
//       , myQuery2 = new dataset.DrilldownQueryTemplate( titanicDataset, ['Status', 'Gender'] )
//       , myQuery3 = new dataset.DrilldownQueryTemplate( titanicDataset, ['Status', 'Gender', 'Ticket'] )
//
//     const expected1 = `d3.group(this.data, d => d["Status"])`
//         , expected2 = `d3.group(this.data, d => d["Status"], d => d["Gender"])`
//         , expected3 = `d3.group(this.data, d => d["Status"], d => d["Gender"], d => d["Ticket"])`
//
//     // Verify the entire query string generated (static + dynamic)
//     expect(myQuery1.queryString).toBe(expected1)
//     expect(myQuery2.queryString).toBe(expected2)
//     expect(myQuery3.queryString).toBe(expected3)
//
//     // Verify the dynamic part of the query
//     expect(myQuery1._argumentsSubstring).toBe(`d => d["Status"]`)
//     expect(myQuery2._argumentsSubstring).toBe(`d => d["Status"], d => d["Gender"]`)
//     expect(myQuery3._argumentsSubstring).toBe(`d => d["Status"], d => d["Gender"], d => d["Ticket"]`)
//
// })

test ('Should parse query parameters', async () => {

    const titanicDataset = new dataset.Dataset('http://localhost:3000/libraries/cpc/tests/dataset/titanic.csv')
    await titanicDataset.build()



    // let myQuery1 = new dataset.DrilldownQueryTemplate( titanicDataset, [{'Status':'Survived'}] )
      // , myQuery2 = new dataset.DrilldownQueryTemplate( titanicDataset, [{'Status':'Survived'}, {'Gender':'Male'}] )
      // , myQuery3 = new dataset.DrilldownQueryTemplate( titanicDataset, [{'Status':'Survived'}, {'Gender':'Male'}, {'Ticket':'1st class'}] )

    expect()

})

test ('Should return error if query is invalid because of a bad column or category name', async () => {


    const titanicDataset = new dataset.Dataset('http://localhost:3000/libraries/cpc/tests/dataset/titanic.csv')
    await titanicDataset.build()



    expect( () => {

        const myColumnQuery = new dataset.BreakdownQuery( titanicDataset, ['random column name'] )

    }).toThrow(`Provided breakdown query argument(s), "[random column name]", do not correspond to a column or category in the dataset.`)

})


test ('Should determine whether the query is column-based, category-based, or hybrid, and return error if hybrid', async () => {

    const titanicDataset = new dataset.Dataset('http://localhost:3000/libraries/cpc/tests/dataset/titanic.csv')
    await titanicDataset.build()

    const myColumnQuery = new dataset.BreakdownQuery( titanicDataset, ['Status'] )
    const myCategoryQuery = new dataset.BreakdownQuery( titanicDataset, ['Survived'] )

    expect(myColumnQuery._breakdownType).toBe('column')
    expect(myCategoryQuery._breakdownType).toBe('category')
    // hybrid category is not tested with the private method, because the class constructor does not allow initialization with a hybrid breakdown query.

    expect( () => {
        const myHybridQuery = new dataset.BreakdownQuery( titanicDataset, ['Gender', 'Survived'] )
    }).toThrow(`Both a column name and a category name exists in breakdown path argument "[Gender,Survived]". Breakdown path must consist of either only column names, or only category names.`)

})

