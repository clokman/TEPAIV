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
require("../../../../../JestUtils/jest-console")

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

    expect.assertions(2)

    const titanicDataset = await d3.csv('http://localhost:3000/libraries/cpc/tests/dataset/titanic.csv')

    expect(titanicDataset.length).toBe(1309)
    
    expectTable(titanicDataset, `\
┌─────────┬─────────────┬────────────┬──────────┬─────────────────────────────────────────────────────┐
│ (index) │   Ticket    │   Status   │  Gender  │                        Name                         │
├─────────┼─────────────┼────────────┼──────────┼─────────────────────────────────────────────────────┤
│    0    │ '1st class' │ 'Survived' │ 'Female' │           'Allen, Miss. Elisabeth Walton'           │
│    1    │ '1st class' │ 'Survived' │  'Male'  │          'Allison, Master. Hudson Trevor'           │
│    2    │ '1st class' │   'Died'   │ 'Female' │           'Allison, Miss. Helen Loraine'            │
│    3    │ '1st class' │   'Died'   │  'Male'  │       'Allison, Mr. Hudson Joshua Creighton'        │
│    4    │ '1st class' │   'Died'   │ 'Female' │  'Allison, Mrs. Hudson J C (Bessie Waldo Daniels)'  │
│    5    │ '1st class' │ 'Survived' │  'Male'  │                'Anderson, Mr. Harry'                │
│    6    │ '1st class' │ 'Survived' │ 'Female' │         'Andrews, Miss. Kornelia Theodosia'         │
│    7    │ '1st class' │   'Died'   │  'Male'  │              'Andrews, Mr. Thomas Jr'               │
│    8    │ '1st class' │ 'Survived' │ 'Female' │   'Appleton, Mrs. Edward Dale (Charlotte Lamson)'   │
│    9    │ '1st class' │   'Died'   │  'Male'  │              'Artagaveytia, Mr. Ramon'              │
│   10    │ '1st class' │   'Died'   │  'Male'  │              'Astor, Col. John Jacob'               │
│   11    │ '1st class' │ 'Survived' │ 'Female' │ 'Astor, Mrs. John Jacob (Madeleine Talmadge Force)' │
│   12    │ '1st class' │ 'Survived' │ 'Female' │           'Aubart, Mme. Leontine Pauline'           │
│   13    │ '1st class' │ 'Survived' │ 'Female' │            'Barber, Miss. Ellen Nellie'             │
│   14    │ '1st class' │ 'Survived' │  'Male'  │       'Barkworth, Mr. Algernon Henry Wilson'        │
└─────────┴─────────────┴────────────┴──────────┴─────────────────────────────────────────────────────┘
˅˅˅ 1294 more rows`, 0, 15)


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

    expect.assertions(11)

    const titanicDataset = new dataset.Dataset('http://localhost:3000/libraries/cpc/tests/dataset/titanic.csv')
    await titanicDataset.build()


    expect(titanicDataset.data).toBeDefined()
    expect(titanicDataset.data).toHaveLength(1309)

    expectTable(titanicDataset.data, `\
┌─────────┬─────────────┬────────────┬──────────┬─────────────────────────────────────────────────────┐
│ (index) │   Ticket    │   Status   │  Gender  │                        Name                         │
├─────────┼─────────────┼────────────┼──────────┼─────────────────────────────────────────────────────┤
│    0    │ '1st class' │ 'Survived' │ 'Female' │           'Allen, Miss. Elisabeth Walton'           │
│    1    │ '1st class' │ 'Survived' │  'Male'  │          'Allison, Master. Hudson Trevor'           │
│    2    │ '1st class' │   'Died'   │ 'Female' │           'Allison, Miss. Helen Loraine'            │
│    3    │ '1st class' │   'Died'   │  'Male'  │       'Allison, Mr. Hudson Joshua Creighton'        │
│    4    │ '1st class' │   'Died'   │ 'Female' │  'Allison, Mrs. Hudson J C (Bessie Waldo Daniels)'  │
│    5    │ '1st class' │ 'Survived' │  'Male'  │                'Anderson, Mr. Harry'                │
│    6    │ '1st class' │ 'Survived' │ 'Female' │         'Andrews, Miss. Kornelia Theodosia'         │
│    7    │ '1st class' │   'Died'   │  'Male'  │              'Andrews, Mr. Thomas Jr'               │
│    8    │ '1st class' │ 'Survived' │ 'Female' │   'Appleton, Mrs. Edward Dale (Charlotte Lamson)'   │
│    9    │ '1st class' │   'Died'   │  'Male'  │              'Artagaveytia, Mr. Ramon'              │
│   10    │ '1st class' │   'Died'   │  'Male'  │              'Astor, Col. John Jacob'               │
│   11    │ '1st class' │ 'Survived' │ 'Female' │ 'Astor, Mrs. John Jacob (Madeleine Talmadge Force)' │
│   12    │ '1st class' │ 'Survived' │ 'Female' │           'Aubart, Mme. Leontine Pauline'           │
│   13    │ '1st class' │ 'Survived' │ 'Female' │            'Barber, Miss. Ellen Nellie'             │
│   14    │ '1st class' │ 'Survived' │  'Male'  │       'Barkworth, Mr. Algernon Henry Wilson'        │
└─────────┴─────────────┴────────────┴──────────┴─────────────────────────────────────────────────────┘
˅˅˅ 1294 more rows`, 0, 15)


    expectTable(titanicDataset.data, `\
˄˄˄ 1300 preceding rows
┌─────────┬─────────────┬────────────┬──────────┬───────────────────────────────────────────┐
│ (index) │   Ticket    │   Status   │  Gender  │                   Name                    │
├─────────┼─────────────┼────────────┼──────────┼───────────────────────────────────────────┤
│    0    │ '3rd class' │ 'Survived' │ 'Female' │ 'Yasbeck, Mrs. Antoni (Selini Alexander)' │
│    1    │ '3rd class' │   'Died'   │  'Male'  │          'Youseff, Mr. Gerious'           │
│    2    │ '3rd class' │   'Died'   │  'Male'  │            'Yousif, Mr. Wazli'            │
│    3    │ '3rd class' │   'Died'   │  'Male'  │          'Yousseff, Mr. Gerious'          │
│    4    │ '3rd class' │   'Died'   │ 'Female' │          'Zabour, Miss. Hileni'           │
│    5    │ '3rd class' │   'Died'   │ 'Female' │          'Zabour, Miss. Thamine'          │
│    6    │ '3rd class' │   'Died'   │  'Male'  │        'Zakarian, Mr. Mapriededer'        │
│    7    │ '3rd class' │   'Died'   │  'Male'  │           'Zakarian, Mr. Ortin'           │
│    8    │ '3rd class' │   'Died'   │  'Male'  │           'Zimmerman, Mr. Leo'            │
└─────────┴─────────────┴────────────┴──────────┴───────────────────────────────────────────┘
˅˅˅ 0 more rows`,1300, 9)


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



    // Verify that a dataset summary is calculated upon initiation dataset
        // This test is skipped due to excessive output due to inclusion of 'Name' column.
        // The test is carried out in [REF-1], where this column is not included.


    }
)




test ('Dataset should initiate with an omitted column', async () => {

    expect.assertions(11)

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


    // Verify that a dataset summary is calculated upon initiation dataset
    // [REF-1]
    expectTable(titanicDataset.summary, `\
┌───────────────────┬──────────┬────────────────────────────────────────────────────────────────────┐
│ (iteration index) │   Key    │                               Values                               │
├───────────────────┼──────────┼────────────────────────────────────────────────────────────────────┤
│         0         │ 'Ticket' │ Map { '1st class' => 323, '2nd class' => 277, '3rd class' => 709 } │
│         1         │ 'Status' │              Map { 'Survived' => 500, 'Died' => 809 }              │
│         2         │ 'Gender' │               Map { 'Female' => 466, 'Male' => 843 }               │
└───────────────────┴──────────┴────────────────────────────────────────────────────────────────────┘`)

})




test ('SPLIT dataset by column using .splitBy(), and then manually drilldown with .get()', async () => {

    // Query terminology:
    // SPLIT: d3.group()
    // DRILLDOWN: d3.group().get()
    // SPLIT+SUMMARIZE: d3.rollup()

    const titanicDataset = new dataset.Dataset('http://localhost:3000/libraries/cpc/tests/dataset/titanic.csv', 'Name')
    await titanicDataset.build()

    // SPLIT using column name
    const dataByGender = titanicDataset.splitBy('Gender')  // gender is a column name
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


    // SPLIT using 2 column names
    const dataByGenderAndStatus = titanicDataset.splitBy('Gender', 'Status')
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


    // SPLIT & COUNT the drilled down category by another category using d3.rollup()
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
        titanicDataset.splitBy('Gender', '1st class')
    ).toThrow(Error)

})



test ('DRILLDOWN dataset by category using drilldownTo()', async () => {

    // Query terminology:
    // SPLIT: d3.group()
    // DRILLDOWN: d3.group().get()
    // SPLIT+SUMMARIZE: d3.rollup()

    const titanicDataset = new dataset.Dataset('http://localhost:3000/libraries/cpc/tests/dataset/titanic.csv', 'Name')
    await titanicDataset.build()

    // DRILDOWN using a category name (i.e., 'Female')
    const femaleSubset = titanicDataset.drilldownTo({'Gender':'Female'})  // 'Gender' is a column name, while 'Female' is a category in the 'Gender' column

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
    const femaleSurvivorsSubset = titanicDataset.drilldownTo({'Gender':'Female'}, {'Status':'Survived'})

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




test ('DRILLDOWN the dataset and SPLIT+SUMMARIZE of all categories in the context of the drilled down data', async () => {

    // Query terminology:
    // SPLIT: d3.group()
    // DRILLDOWN: d3.group().get()
    // SPLIT+SUMMARIZE: d3.rollup()

    const titanicDataset = new dataset.Dataset('http://localhost:3000/libraries/cpc/tests/dataset/titanic.csv', 'Name')
    await titanicDataset.build()

//
//
//     // DRILLDOWN, and then SPLIT+SUMMARIZE --- Zero depth (summary of initial/surface data without drilling down)
//     const datasetSummary = titanicDataset.drilldownAndSummarize()
//
//     expectTable(datasetSummary, `\
// ┌───────────────────┬──────────┬────────────────────────────────────────────────────────────────────┐
// │ (iteration index) │   Key    │                               Values                               │
// ├───────────────────┼──────────┼────────────────────────────────────────────────────────────────────┤
// │         0         │ 'Ticket' │ Map { '1st class' => 323, '2nd class' => 277, '3rd class' => 709 } │
// │         1         │ 'Status' │              Map { 'Survived' => 500, 'Died' => 809 }              │
// │         2         │ 'Gender' │               Map { 'Female' => 466, 'Male' => 843 }               │
// └───────────────────┴──────────┴────────────────────────────────────────────────────────────────────┘`)
//
//
//
//
//     // DRILLDOWN, and then SPLIT+SUMMARIZE --- One category deep
//     const femaleSubsetSummary = titanicDataset.drilldownAndSummarize({'Gender':'Female'})
//
//     expectTable(femaleSubsetSummary, `\
// ┌───────────────────┬──────────┬────────────────────────────────────────────────────────────────────┐
// │ (iteration index) │   Key    │                               Values                               │
// ├───────────────────┼──────────┼────────────────────────────────────────────────────────────────────┤
// │         0         │ 'Ticket' │ Map { '1st class' => 144, '2nd class' => 106, '3rd class' => 216 } │
// │         1         │ 'Status' │              Map { 'Survived' => 339, 'Died' => 127 }              │
// │         2         │ 'Gender' │                      Map { 'Female' => 466 }                       │
// └───────────────────┴──────────┴────────────────────────────────────────────────────────────────────┘`)
//
//
//
//     // DRILLDOWN, and then SPLIT+SUMMARIZE --- Two categories deep
//
//     const femaleSurvivorsSubsetSummary =
//         titanicDataset.drilldownAndSummarize({'Gender':'Female'}, {'Status':'Survived'})
//
//     expectTable(femaleSurvivorsSubsetSummary, `\
// ┌───────────────────┬──────────┬───────────────────────────────────────────────────────────────────┐
// │ (iteration index) │   Key    │                              Values                               │
// ├───────────────────┼──────────┼───────────────────────────────────────────────────────────────────┤
// │         0         │ 'Ticket' │ Map { '1st class' => 139, '2nd class' => 94, '3rd class' => 106 } │
// │         1         │ 'Status' │                     Map { 'Survived' => 339 }                     │
// │         2         │ 'Gender' │                      Map { 'Female' => 339 }                      │
// └───────────────────┴──────────┴───────────────────────────────────────────────────────────────────┘`)
//
//
//
//     // DRILLDOWN, and then SPLIT+SUMMARIZE --- Three categories deep
//
//     const firstClassFemaleSurvivorsSubsetSummary =
//         titanicDataset.drilldownAndSummarize({'Gender':'Female'}, {'Status':'Survived'}, {'Ticket':'1st class'})
//
//     expectTable(firstClassFemaleSurvivorsSubsetSummary, `\
// ┌───────────────────┬──────────┬────────────────────────────┐
// │ (iteration index) │   Key    │           Values           │
// ├───────────────────┼──────────┼────────────────────────────┤
// │         0         │ 'Ticket' │ Map { '1st class' => 139 } │
// │         1         │ 'Status' │ Map { 'Survived' => 139 }  │
// │         2         │ 'Gender' │  Map { 'Female' => 139 }   │
// └───────────────────┴──────────┴────────────────────────────┘`)


    // DRILLDOWN, and then SPLIT+SUMMARIZE --- Providing an array as parameter

    const arrayParameterSummary =
        titanicDataset.drilldownAndSummarize([{'Gender':'Female'}, {'Status':'Survived'}])

    expectTable(arrayParameterSummary, `\
┌───────────────────┬──────────┬───────────────────────────────────────────────────────────────────┐
│ (iteration index) │   Key    │                              Values                               │
├───────────────────┼──────────┼───────────────────────────────────────────────────────────────────┤
│         0         │ 'Ticket' │ Map { '1st class' => 139, '2nd class' => 94, '3rd class' => 106 } │
│         1         │ 'Status' │                     Map { 'Survived' => 339 }                     │
│         2         │ 'Gender' │                      Map { 'Female' => 339 }                      │
└───────────────────┴──────────┴───────────────────────────────────────────────────────────────────┘`)




})



test ('SPLIT+SUMMARIZE level-0/SURFACE data with summarize()', async () => {

    // Query terminology:
    // SPLIT: d3.group()
    // DRILLDOWN: d3.group().get()
    // SPLIT+SUMMARIZE: d3.rollup()

    const titanicDataset = new dataset.Dataset('http://localhost:3000/libraries/cpc/tests/dataset/titanic.csv', 'Name')
    await titanicDataset.build()

    const datasetSummary = titanicDataset.summarize()


    expectTable(datasetSummary, `\
┌───────────────────┬──────────┬────────────────────────────────────────────────────────────────────┐
│ (iteration index) │   Key    │                               Values                               │
├───────────────────┼──────────┼────────────────────────────────────────────────────────────────────┤
│         0         │ 'Ticket' │ Map { '1st class' => 323, '2nd class' => 277, '3rd class' => 709 } │
│         1         │ 'Status' │              Map { 'Survived' => 500, 'Died' => 809 }              │
│         2         │ 'Gender' │               Map { 'Female' => 466, 'Male' => 843 }               │
└───────────────────┴──────────┴────────────────────────────────────────────────────────────────────┘`)

})





test ('DRILLDOWN the dataset and SPLIT+SUMMARIZE of all categories in the context of the drilled down data', async () => {

    // Query terminology:
    // SPLIT: d3.group()
    // DRILLDOWN: d3.group().get()
    // SPLIT+SUMMARIZE: d3.rollup()

    const titanicDataset = new dataset.Dataset('http://localhost:3000/libraries/cpc/tests/dataset/titanic.csv', 'Name')
    await titanicDataset.build()



    // DRILLDOWN, and then SPLIT+SUMMARIZE --- Zero depth (summary of initial/surface data without drilling down)
    const datasetSummary = titanicDataset.drilldownAndSummarize()

    expectTable(datasetSummary, `\
┌───────────────────┬──────────┬────────────────────────────────────────────────────────────────────┐
│ (iteration index) │   Key    │                               Values                               │
├───────────────────┼──────────┼────────────────────────────────────────────────────────────────────┤
│         0         │ 'Ticket' │ Map { '1st class' => 323, '2nd class' => 277, '3rd class' => 709 } │
│         1         │ 'Status' │              Map { 'Survived' => 500, 'Died' => 809 }              │
│         2         │ 'Gender' │               Map { 'Female' => 466, 'Male' => 843 }               │
└───────────────────┴──────────┴────────────────────────────────────────────────────────────────────┘`)




    // DRILLDOWN, and then SPLIT+SUMMARIZE --- One category deep
    const femaleSubsetSummary = titanicDataset.drilldownAndSummarize({'Gender':'Female'})

    expectTable(femaleSubsetSummary, `\
┌───────────────────┬──────────┬────────────────────────────────────────────────────────────────────┐
│ (iteration index) │   Key    │                               Values                               │
├───────────────────┼──────────┼────────────────────────────────────────────────────────────────────┤
│         0         │ 'Ticket' │ Map { '1st class' => 144, '2nd class' => 106, '3rd class' => 216 } │
│         1         │ 'Status' │              Map { 'Survived' => 339, 'Died' => 127 }              │
│         2         │ 'Gender' │                      Map { 'Female' => 466 }                       │
└───────────────────┴──────────┴────────────────────────────────────────────────────────────────────┘`)



    // DRILLDOWN, and then SPLIT+SUMMARIZE --- Two categories deep

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



    // DRILLDOWN, and then SPLIT+SUMMARIZE --- Three categories deep

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



test ('SPLIT+SUMMARIZE level-0/SURFACE data with summarize()', async () => {

    // Query terminology:
    // SPLIT: d3.group()
    // DRILLDOWN: d3.group().get()
    // SPLIT+SUMMARIZE: d3.rollup()

    const titanicDataset = new dataset.Dataset('http://localhost:3000/libraries/cpc/tests/dataset/titanic.csv', 'Name')
    await titanicDataset.build()

    const datasetSummary = titanicDataset.summarize()


    expectTable(datasetSummary, `\
┌───────────────────┬──────────┬────────────────────────────────────────────────────────────────────┐
│ (iteration index) │   Key    │                               Values                               │
├───────────────────┼──────────┼────────────────────────────────────────────────────────────────────┤
│         0         │ 'Ticket' │ Map { '1st class' => 323, '2nd class' => 277, '3rd class' => 709 } │
│         1         │ 'Status' │              Map { 'Survived' => 500, 'Died' => 809 }              │
│         2         │ 'Gender' │               Map { 'Female' => 466, 'Male' => 843 }               │
└───────────────────┴──────────┴────────────────────────────────────────────────────────────────────┘`)

})



test ('Should query the dataset for counts of nested categories using private interface', async () => {

    const titanicDataset = new dataset.Dataset('http://localhost:3000/libraries/cpc/tests/dataset/titanic.csv')
    await titanicDataset.build()


    // Query depth: 1
    const status = titanicDataset.splitBy('Status')
        , survived = status.get('Survived')
        , died = status.get('Died')

    expect(survived).toHaveLength(500)
    expect(died).toHaveLength(809)


    // Query depth: 2
    const statusByGender = titanicDataset.splitBy('Status', 'Gender')
        , survivedFemales = statusByGender.get('Survived').get('Female')
        , survivedMales = statusByGender.get('Survived').get('Male')

    expect(survivedFemales).toHaveLength(339)
    expect(survivedMales).toHaveLength(161)


    // Query depth: 3
    const survivedFirstClassFemales =
        titanicDataset.splitBy('Status', 'Gender', 'Ticket')
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

        const myColumnQuery = new dataset.SplitQuery( titanicDataset, ['random column name'] )

    }).toThrow(`Provided split query argument(s), "[random column name]", do not correspond to a column or category in the dataset.`)

})


//// CONTINUOUS DATA ///////////////////////////////////////////////////////////////

describe ('Continuous Data: ', () => {
   
    test ('Read: Continuous data should be read', async () => {

        const bigFiveDataset = new dataset.Dataset('http://localhost:3000/libraries/cpc/tests/dataset/BigFivePersonalityTraits-Small.csv')
        await bigFiveDataset.build()


        expect(bigFiveDataset.data).toBeDefined()
        expect(bigFiveDataset.data).toHaveLength(99)

        expectTable(bigFiveDataset.data, `\
┌─────────┬─────────────┬──────────────┬───────────┬───────────────┬───────────────────┐
│ (index) │ Neuroticism │ Extraversion │ Openness  │ Agreeableness │ Conscientiousness │
├─────────┼─────────────┼──────────────┼───────────┼───────────────┼───────────────────┤
│    0    │  '2.47917'  │  '4.20833'   │ '3.9375'  │   '3.95833'   │     '3.45833'     │
│    1    │  '2.60417'  │   '3.1875'   │ '3.95833' │   '3.39583'   │     '3.22917'     │
│    2    │  '2.8125'   │  '2.89583'   │ '3.41667' │    '2.75'     │       '3.5'       │
│    3    │  '2.89583'  │   '3.5625'   │ '3.52083' │   '3.16667'   │     '2.79167'     │
│    4    │  '3.02083'  │  '3.33333'   │ '4.02083' │   '3.20833'   │     '2.85417'     │
│    5    │  '2.52083'  │  '3.29167'   │ '3.4375'  │   '3.70833'   │       '2.5'       │
│    6    │  '2.35417'  │  '4.41667'   │ '4.58333' │   '3.0625'    │     '3.33333'     │
│    7    │  '2.52083'  │    '3.5'     │ '2.89583' │   '3.66667'   │     '3.0625'      │
│    8    │  '3.10417'  │   '3.8125'   │ '4.0625'  │   '3.77083'   │     '2.83333'     │
│    9    │  '2.6875'   │  '3.54708'   │ '3.78667' │   '3.35417'   │     '3.10417'     │
│   10    │   '2.625'   │  '3.45833'   │ '2.89583' │   '3.45833'   │      '3.375'      │
│   11    │   '2.375'   │  '3.77083'   │ '3.16667' │     '3.5'     │     '3.52083'     │
│   12    │  '3.0625'   │  '3.41667'   │ '3.77083' │   '3.8125'    │      '3.125'      │
│   13    │   '3.125'   │  '2.52083'   │ '2.64583' │    '3.75'     │     '3.20833'     │
│   14    │  '2.58333'  │  '3.02083'   │   '3.5'   │   '3.41667'   │     '3.58333'     │
└─────────┴─────────────┴──────────────┴───────────┴───────────────┴───────────────────┘
˅˅˅ 84 more rows`, 0, 15)
    })




    test ('DRILLDOWN: Split dataset by column using .splitBy(), and then manually drilldown with .get()', async () => {

        // Query terminology:
        // SPLIT: d3.group()
        // DRILLDOWN: d3.group().get()
        // SPLIT+SUMMARIZE: d3.rollup()

        const bigFiveDataset = new dataset.Dataset('http://localhost:3000/libraries/cpc/tests/dataset/BigFivePersonalityTraits-Small.csv', 'Name')
        await bigFiveDataset.build()

        // SPLIT using column name
        const dataByOpenness = bigFiveDataset.splitBy('Openness')  // Openness is a column name
        expectTable(dataByOpenness, `\
┌───────────────────┬──────────┬──────────────────────────────────────────────────────┐
│ (iteration index) │   Key    │                        Values                        │
├───────────────────┼──────────┼──────────────────────────────────────────────────────┤
│         0         │ 'Female' │ [ [Object], [Object], [Object], ... 463 more items ] │
│         1         │  'Male'  │ [ [Object], [Object], [Object], ... 840 more items ] │
└───────────────────┴──────────┴──────────────────────────────────────────────────────┘`)

        expect(dataByOpenness.size).toBe(2)
        expect(dataByOpenness.get('Female')).toHaveLength(466)
        expect(dataByOpenness.get('Male')).toHaveLength(843)


        // SPLIT using 2 column names
        const dataByGenderAndStatus = bigFiveDataset.splitBy('Gender', 'Status')
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


        // SPLIT & COUNT the drilled down category by another category using d3.rollup()
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
            bigFiveDataset.splitBy('Gender', '1st class')
        ).toThrow(Error)

    })



})