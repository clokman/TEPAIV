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
jestConsole = require("../../../../../JestUtils/jest-console")
expectTable = jestConsole.expectTable

//// REQUIREMENTS ////

global.d3 = {
    ...require("../../../external/d3/d3"),
    ...require("../../../external/d3/d3-array")
}
global.data = require("../../data")
global._ = require("../../../external/lodash")
global.classUtils = require("../../../utils/classUtils")
global.jsUtils = require("../../../utils/jsUtils")
global.arrayUtils = require("../../../utils/arrayUtils")

//// MODULES BEING TESTED ////
const dataset = require("../../dataset")





//// UNIT TESTS /////////////////////////////////////////////////////////////////////////////////////////////////////////////



//// D3 General ///////////////////////////////////////////////////////////////

describe ('D3: Learning tests for async reading with D3', () => {



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

    
    
})


//// DATASET ////

//// INITIALIZE ///////////////////////////////////////////////////////////////

describe ('Initialization', () => {

    test ('Initiate a Dataset instance, read data into it, and calculate properties', async () => {

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


    test ('Continuous data: Read continuous data without discretization', async () => {

        const bigFiveDatasetContinous = new dataset.Dataset('http://localhost:3000/libraries/cpc/tests/dataset/BigFivePersonalityTraits-Small.csv')
        bigFiveDatasetContinous.transformContinuousColumns.toQuantiles = false
        await bigFiveDatasetContinous.build()


        expect(bigFiveDatasetContinous.data).toBeDefined()
        expect(bigFiveDatasetContinous.data).toHaveLength(99)

        expectTable(bigFiveDatasetContinous.data, `\
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

    test ('Continuous data: Read continuous data with discretization', async () => {

        const bigFiveDatasetDiscretized = new dataset.Dataset('http://localhost:3000/libraries/cpc/tests/dataset/BigFivePersonalityTraits-Small.csv')
        await bigFiveDatasetDiscretized.build()


        expect(bigFiveDatasetDiscretized.data).toBeDefined()
        expect(bigFiveDatasetDiscretized.data).toHaveLength(99)

        expectTable(bigFiveDatasetDiscretized.data, `\
┌─────────┬─────────────┬──────────────┬───────────┬───────────────┬───────────────────┐
│ (index) │ Neuroticism │ Extraversion │ Openness  │ Agreeableness │ Conscientiousness │
├─────────┼─────────────┼──────────────┼───────────┼───────────────┼───────────────────┤
│    0    │   '0-25%'   │  '75-100%'   │ '75-100%' │   '75-100%'   │     '75-100%'     │
│    1    │  '25-50%'   │   '0-25%'    │ '75-100%' │   '25-50%'    │     '50-75%'      │
│    2    │  '25-50%'   │   '0-25%'    │ '25-50%'  │    '0-25%'    │     '75-100%'     │
│    3    │  '50-75%'   │   '50-75%'   │ '25-50%'  │    '0-25%'    │      '0-25%'      │
│    4    │  '50-75%'   │   '25-50%'   │ '75-100%' │    '0-25%'    │     '25-50%'      │
│    5    │   '0-25%'   │   '25-50%'   │ '25-50%'  │   '75-100%'   │      '0-25%'      │
│    6    │   '0-25%'   │  '75-100%'   │ '75-100%' │    '0-25%'    │     '50-75%'      │
│    7    │   '0-25%'   │   '50-75%'   │  '0-25%'  │   '75-100%'   │     '25-50%'      │
│    8    │  '75-100%'  │  '75-100%'   │ '75-100%' │   '75-100%'   │     '25-50%'      │
│    9    │  '25-50%'   │   '50-75%'   │ '50-75%'  │   '25-50%'    │     '25-50%'      │
│   10    │  '25-50%'   │   '25-50%'   │  '0-25%'  │   '50-75%'    │     '50-75%'      │
│   11    │   '0-25%'   │  '75-100%'   │  '0-25%'  │   '50-75%'    │     '75-100%'     │
│   12    │  '50-75%'   │   '25-50%'   │ '50-75%'  │   '75-100%'   │     '50-75%'      │
│   13    │  '75-100%'  │   '0-25%'    │  '0-25%'  │   '75-100%'   │     '50-75%'      │
│   14    │   '0-25%'   │   '0-25%'    │ '25-50%'  │   '50-75%'    │     '75-100%'     │
└─────────┴─────────────┴──────────────┴───────────┴───────────────┴───────────────────┘
˅˅˅ 84 more rows`, 0, 15)
    })

})





//// INFERENCES ///////////////////////////////////////////////////////////////

describe ('Inferences', () => {

    test ('Get column names in the imported dataset', async () => {

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

    test ('Return column name when provided a category name', async () => {

        const titanicDataset = new dataset.Dataset('http://localhost:3000/libraries/cpc/tests/dataset/titanic.csv', 'Name')
        await titanicDataset.build()

        // Infer column name from given category name
        expect(titanicDataset._inferColumnFromCategory('Female')).toBe('Gender')
        expect(titanicDataset._inferColumnFromCategory('Male')).toBe('Gender')
        expect(titanicDataset._inferColumnFromCategory('1st class')).toBe('Ticket')
        expect(titanicDataset._inferColumnFromCategory('2nd class')).toBe('Ticket')
        expect(titanicDataset._inferColumnFromCategory('Survived')).toBe('Status')
        expect(titanicDataset._inferColumnFromCategory('Died')).toBe('Status')


        // Specified category does not exist in dataset
        expect(() => titanicDataset._inferColumnFromCategory('Non-existent category'))
            .toThrow(`The category name "Non-existent category" does not occur in the dataset. One column in the dataset should contain the specified category.`)

        // Category occurs in more than one column
        titanicDataset.structure.set('Sex', ['Male', 'Female'])
        expect(() => titanicDataset._inferColumnFromCategory('Male'))
            .toThrow(`The category name "Male" occurs in these columns: "Gender,Sex". Columns in the dataset should not share category names.`)

    })


    test ('Column Type: Detect whether a column is continuous or categorical', async () => {


        const mixedDataset = new dataset.Dataset('http://localhost:3000/libraries/cpc/tests/dataset/SampleMixedData.csv')
        mixedDataset.transformContinuousColumns.toQuantiles = false
        await mixedDataset.build()

        expectTable(mixedDataset.data, `\
┌─────────┬─────────────┬──────────────┬──────────┬───────────────┐
│ (index) │ Neuroticism │ Extraversion │  Gender  │ MonthMeasured │
├─────────┼─────────────┼──────────────┼──────────┼───────────────┤
│    0    │  '2.47917'  │  '4.20833'   │  'Male'  │   'January'   │
│    1    │  '2.60417'  │   '3.1875'   │  'Male'  │  'February'   │
│    2    │  '2.52083'  │  '2.89583'   │  'Male'  │    'March'    │
│    3    │  '3.29167'  │  '3.29167'   │ 'Female' │    'April'    │
│    4    │  '3.02083'  │  '3.29167'   │ 'Female' │     'May'     │
│    5    │  '2.52083'  │  '3.29167'   │  'Male'  │    'June'     │
│    6    │  '2.35417'  │  '4.41667'   │  'Male'  │    'July'     │
│    7    │  '2.52083'  │    '3.5'     │  'Male'  │   'August'    │
│    8    │  '3.10417'  │   '3.8125'   │  'Male'  │  'September'  │
│    9    │  '2.6875'   │  '3.54708'   │  'Male'  │   'October'   │
│   10    │   '2.625'   │  '3.45833'   │  'Male'  │  'November'   │
│   11    │   '2.375'   │  '3.77083'   │  'Male'  │  'December'   │
│   12    │  '3.0625'   │  '3.41667'   │  'Male'  │   'January'   │
│   13    │   '3.125'   │  '2.52083'   │  'Male'  │  'February'   │
│   14    │  '2.58333'  │  '3.02083'   │  'Male'  │    'March'    │
└─────────┴─────────────┴──────────────┴──────────┴───────────────┘
˅˅˅ 84 more rows`, 0, 15)


        const columnTypes = mixedDataset._inferColumnTypes()

        const neuroticismColumnType = columnTypes.get('Neuroticism')
        expect( neuroticismColumnType ).toBe( 'continuous' )

        const extraversionColumnType = columnTypes.get('Extraversion')
        expect( extraversionColumnType ).toBe( 'continuous' )

        const genderColumnType = columnTypes.get('Gender')
        expect( genderColumnType ).toBe( 'categorical' )

        const monthMeasuredColumnType = columnTypes.get('MonthMeasured')
        expect( monthMeasuredColumnType ).toBe( 'categorical' )

    })
    
    test ('Column Type: Column types should be detected during instantiation', async () => {


        const mixedDataset = new dataset.Dataset('http://localhost:3000/libraries/cpc/tests/dataset/SampleMixedData.csv')
        mixedDataset.transformContinuousColumns.toQuantiles = false

        await mixedDataset.build()

        expectTable(mixedDataset.data, `\
┌─────────┬─────────────┬──────────────┬──────────┬───────────────┐
│ (index) │ Neuroticism │ Extraversion │  Gender  │ MonthMeasured │
├─────────┼─────────────┼──────────────┼──────────┼───────────────┤
│    0    │  '2.47917'  │  '4.20833'   │  'Male'  │   'January'   │
│    1    │  '2.60417'  │   '3.1875'   │  'Male'  │  'February'   │
│    2    │  '2.52083'  │  '2.89583'   │  'Male'  │    'March'    │
│    3    │  '3.29167'  │  '3.29167'   │ 'Female' │    'April'    │
│    4    │  '3.02083'  │  '3.29167'   │ 'Female' │     'May'     │
│    5    │  '2.52083'  │  '3.29167'   │  'Male'  │    'June'     │
│    6    │  '2.35417'  │  '4.41667'   │  'Male'  │    'July'     │
│    7    │  '2.52083'  │    '3.5'     │  'Male'  │   'August'    │
│    8    │  '3.10417'  │   '3.8125'   │  'Male'  │  'September'  │
│    9    │  '2.6875'   │  '3.54708'   │  'Male'  │   'October'   │
│   10    │   '2.625'   │  '3.45833'   │  'Male'  │  'November'   │
│   11    │   '2.375'   │  '3.77083'   │  'Male'  │  'December'   │
│   12    │  '3.0625'   │  '3.41667'   │  'Male'  │   'January'   │
│   13    │   '3.125'   │  '2.52083'   │  'Male'  │  'February'   │
│   14    │  '2.58333'  │  '3.02083'   │  'Male'  │    'March'    │
└─────────┴─────────────┴──────────────┴──────────┴───────────────┘
˅˅˅ 84 more rows`, 0, 15)

        expect( mixedDataset.columnTypes ).toTabulateAs(`\
┌───────────────────┬─────────────────┬───────────────┐
│ (iteration index) │       Key       │    Values     │
├───────────────────┼─────────────────┼───────────────┤
│         0         │  'Neuroticism'  │ 'continuous'  │
│         1         │ 'Extraversion'  │ 'continuous'  │
│         2         │    'Gender'     │ 'categorical' │
│         3         │ 'MonthMeasured' │ 'categorical' │
└───────────────────┴─────────────────┴───────────────┘`)

    })

})




//// OMIT ///////////////////////////////////////////////////////////////

describe ('Omitting Columns', () => {

    test ('Initiate Dataset with an omitted column', async () => {

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

})



//// SPLIT ///////////////////////////////////////////////////////////////

describe ('Splitting', () => {


    test ('Parse SplitQuery parameters', async () => {

        const titanicDataset = new dataset.Dataset('http://localhost:3000/libraries/cpc/tests/dataset/titanic.csv')
        await titanicDataset.build()


        const myQuery1 = new dataset.SplitQuery( titanicDataset, ['Status'] )
        expect(myQuery1.queryString).toBe(`d3.group(this.data, d => d["Status"])`)

        const myQuery2 = new dataset.SplitQuery( titanicDataset, ['Status', 'Gender'] )
        expect(myQuery2.queryString).toBe(`d3.group(this.data, d => d["Status"], d => d["Gender"])`)

        const myQuery3 = new dataset.SplitQuery( titanicDataset, ['Status', 'Gender', 'Ticket'] )
        expect(myQuery3.queryString).toBe(`d3.group(this.data, d => d["Status"], d => d["Gender"], d => d["Ticket"])`)


    })


    test ('Return error if split query is invalid because of a bad column or category name', async () => {


        const titanicDataset = new dataset.Dataset('http://localhost:3000/libraries/cpc/tests/dataset/titanic.csv')
        await titanicDataset.build()



        expect( () => {

            const myColumnQuery = new dataset.SplitQuery( titanicDataset, ['random column name'] )

        }).toThrow(`Provided split query argument(s), "[random column name]", do not correspond to a column or category in the dataset.`)

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








    test ('Query the dataset for counts of nested categories using private interface', async () => {

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


//     TODO
//     test ('Continous SPLIT: Split dataset by column using .splitBy(), and then manually drilldown with .get()', async () => {
//
//         // Query terminology:
//         // SPLIT: d3.group()
//         // DRILLDOWN: d3.group().get()
//         // SPLIT+SUMMARIZE: d3.rollup()
//
//         const bigFiveDataset = new dataset.Dataset('http://localhost:3000/libraries/cpc/tests/dataset/BigFivePersonalityTraits-Small.csv', 'Name')
//         await bigFiveDataset.build()
//
//         // SPLIT using column name
//         const dataByOpenness = bigFiveDataset.splitBy('Openness')  // Openness is a column name
// //         expectTable(dataByOpenness, `\
// // `)
//
//         expect(dataByOpenness.size).toBe(2)
//         expect(dataByOpenness.get('Female')).toHaveLength(466)
//         expect(dataByOpenness.get('Male')).toHaveLength(843)
//
//
//         // SPLIT using 2 column names
//         const dataByGenderAndStatus = bigFiveDataset.splitBy('Gender', 'Status')
//         expectTable(dataByGenderAndStatus, `\
// ┌───────────────────┬──────────┬──────────────────────────────────────────────────┐
// │ (iteration index) │   Key    │                      Values                      │
// ├───────────────────┼──────────┼──────────────────────────────────────────────────┤
// │         0         │ 'Female' │ Map { 'Survived' => [Array], 'Died' => [Array] } │
// │         1         │  'Male'  │ Map { 'Survived' => [Array], 'Died' => [Array] } │
// └───────────────────┴──────────┴──────────────────────────────────────────────────┘`)
//
//         // DRILLDOWN on one of the categories (i.e., 'Male') of the broken down data
//         const malesByStatus = dataByGenderAndStatus.get('Male')
//         expectTable(malesByStatus, `\
// ┌───────────────────┬────────────┬──────────────────────────────────────────────────────┐
// │ (iteration index) │    Key     │                        Values                        │
// ├───────────────────┼────────────┼──────────────────────────────────────────────────────┤
// │         0         │ 'Survived' │ [ [Object], [Object], [Object], ... 158 more items ] │
// │         1         │   'Died'   │ [ [Object], [Object], [Object], ... 679 more items ] │
// └───────────────────┴────────────┴──────────────────────────────────────────────────────┘`)
//
//         // DRILLDOWN further on the drilled down category (i.e., 'Male')
//         const survivingMales = malesByStatus.get('Survived')
//         expectTable(survivingMales, `\
// ┌─────────┬─────────────┬────────────┬────────┐
// │ (index) │   Ticket    │   Status   │ Gender │
// ├─────────┼─────────────┼────────────┼────────┤
// │    0    │ '1st class' │ 'Survived' │ 'Male' │
// │    1    │ '1st class' │ 'Survived' │ 'Male' │
// │    2    │ '1st class' │ 'Survived' │ 'Male' │
// │    3    │ '1st class' │ 'Survived' │ 'Male' │
// │    4    │ '1st class' │ 'Survived' │ 'Male' │
// │    5    │ '1st class' │ 'Survived' │ 'Male' │
// │    6    │ '1st class' │ 'Survived' │ 'Male' │
// │    7    │ '1st class' │ 'Survived' │ 'Male' │
// │    8    │ '1st class' │ 'Survived' │ 'Male' │
// │    9    │ '1st class' │ 'Survived' │ 'Male' │
// └─────────┴─────────────┴────────────┴────────┘
// ˅˅˅ 151 more rows`, 0, 10)
//
//
//         // SPLIT & COUNT the drilled down category by another category using d3.rollup()
//         const survivingMalesByTicket =
//             d3.rollup(survivingMales, v=>v.length, g=>g['Ticket'])
//         expectTable(survivingMalesByTicket, `\
// ┌───────────────────┬─────────────┬────────┐
// │ (iteration index) │     Key     │ Values │
// ├───────────────────┼─────────────┼────────┤
// │         0         │ '1st class' │   61   │
// │         1         │ '2nd class' │   25   │
// │         2         │ '3rd class' │   75   │
// └───────────────────┴─────────────┴────────┘`)
//
//
//         // Attempting to query with both column and category names should give error
//         expect(() =>
//             bigFiveDataset.splitBy('Gender', '1st class')
//         ).toThrow(Error)
//
//     })


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



//// DRILLDOWN ///////////////////////////////////////////////////////////////

describe ('Drillling Down ', () => {
   
    test ('Parse DrilldownQuery parameters', async () => {

        const titanicDataset = new dataset.Dataset('http://localhost:3000/libraries/cpc/tests/dataset/titanic.csv')
        await titanicDataset.build()


        const myQuery1 = new dataset.DrilldownQuery( titanicDataset, [{'Status':'Survived'}] )
        expect(myQuery1.queryString).toBe(`d3.group(this.data, g=>g['Status']).get('Survived')`)

        const myQuery2 = new dataset.DrilldownQuery( titanicDataset, [{'Status':'Survived'}, {'Gender':'Male'}] )
        expect(myQuery2.queryString).toBe(`d3.group(this.data, g=>g['Status'], g=>g['Gender']).get('Survived').get('Male')`)

        const myQuery3 = new dataset.DrilldownQuery( titanicDataset, [{'Status':'Survived'}, {'Gender':'Male'}, {'Ticket':'1st class'}] )
        expect(myQuery3.queryString).toBe(`d3.group(this.data, g=>g['Status'], g=>g['Gender'], g=>g['Ticket']).get('Survived').get('Male').get('1st class')`)


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


    test ('DRILLDOWN and then SPLIT+SUMMARIZE of all categories in the context of the drilled down data', async () => {

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

})



//// SUMMARIZE ///////////////////////////////////////////////////////////////

describe ('Summarizing', () => {


    test ('summarize(): SPLIT+SUMMARIZE level-0/SURFACE data with summarize()', async () => {

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

    test ('drilldownAndSummarize(): SUMMARIZE of all categories in the context of the drilled down data', async () => {

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


    test ('lvl0 continuous drilldownAndSummarize: drilldownAndSummarize level 0 continuous data', async () => {

        const mixedDataset = new dataset.Dataset('http://localhost:3000/libraries/cpc/tests/dataset/SampleMixedData.csv')
        mixedDataset.transformContinuousColumns.toQuantiles = false
        await mixedDataset.build()

        expectTable(mixedDataset.data, `\
┌─────────┬─────────────┬──────────────┬──────────┬───────────────┐
│ (index) │ Neuroticism │ Extraversion │  Gender  │ MonthMeasured │
├─────────┼─────────────┼──────────────┼──────────┼───────────────┤
│    0    │  '2.47917'  │  '4.20833'   │  'Male'  │   'January'   │
│    1    │  '2.60417'  │   '3.1875'   │  'Male'  │  'February'   │
│    2    │  '2.52083'  │  '2.89583'   │  'Male'  │    'March'    │
│    3    │  '3.29167'  │  '3.29167'   │ 'Female' │    'April'    │
│    4    │  '3.02083'  │  '3.29167'   │ 'Female' │     'May'     │
│    5    │  '2.52083'  │  '3.29167'   │  'Male'  │    'June'     │
│    6    │  '2.35417'  │  '4.41667'   │  'Male'  │    'July'     │
│    7    │  '2.52083'  │    '3.5'     │  'Male'  │   'August'    │
│    8    │  '3.10417'  │   '3.8125'   │  'Male'  │  'September'  │
│    9    │  '2.6875'   │  '3.54708'   │  'Male'  │   'October'   │
│   10    │   '2.625'   │  '3.45833'   │  'Male'  │  'November'   │
│   11    │   '2.375'   │  '3.77083'   │  'Male'  │  'December'   │
│   12    │  '3.0625'   │  '3.41667'   │  'Male'  │   'January'   │
│   13    │   '3.125'   │  '2.52083'   │  'Male'  │  'February'   │
│   14    │  '2.58333'  │  '3.02083'   │  'Male'  │    'March'    │
└─────────┴─────────────┴──────────────┴──────────┴───────────────┘
˅˅˅ 84 more rows`, 0, 15)


        expect( mixedDataset.drilldownAndSummarize() ).toTabulateAs(`\
┌───────────────────┬─────────────────┬──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ (iteration index) │       Key       │                                                                                            Values                                                                                            │
├───────────────────┼─────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│         0         │  'Neuroticism'  │                                                          Map { '3.4-3.9' => 12, '2.8-3.3' => 52, '2.2-2.8' => 30, '1.6-2.2' => 5 }                                                           │
│         1         │ 'Extraversion'  │                                                          Map { '4.0-4.4' => 8, '3.5-3.9' => 42, '3.0-3.5' => 38, '2.5-3.0' => 11 }                                                           │
│         2         │    'Gender'     │                                                                             Map { 'Male' => 47, 'Female' => 52 }                                                                             │
│         3         │ 'MonthMeasured' │ Map { 'January' => 9, 'February' => 9, 'March' => 9, 'April' => 8, 'May' => 8, 'June' => 8, 'July' => 8, 'August' => 8, 'September' => 8, 'October' => 8, 'November' => 8, 'December' => 8 } │
└───────────────────┴─────────────────┴──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘`)

    })


    test ('Lvl1 continuous drilldownAndSummarize: drilldownAndSummarize Level 1 continuous data', async () => {

        const mixedDataset = new dataset.Dataset('http://localhost:3000/libraries/cpc/tests/dataset/SampleMixedData.csv')
        mixedDataset.transformContinuousColumns.toQuantiles = false
        await mixedDataset.build()

        expectTable(mixedDataset.data, `\
┌─────────┬─────────────┬──────────────┬──────────┬───────────────┐
│ (index) │ Neuroticism │ Extraversion │  Gender  │ MonthMeasured │
├─────────┼─────────────┼──────────────┼──────────┼───────────────┤
│    0    │  '2.47917'  │  '4.20833'   │  'Male'  │   'January'   │
│    1    │  '2.60417'  │   '3.1875'   │  'Male'  │  'February'   │
│    2    │  '2.52083'  │  '2.89583'   │  'Male'  │    'March'    │
│    3    │  '3.29167'  │  '3.29167'   │ 'Female' │    'April'    │
│    4    │  '3.02083'  │  '3.29167'   │ 'Female' │     'May'     │
│    5    │  '2.52083'  │  '3.29167'   │  'Male'  │    'June'     │
│    6    │  '2.35417'  │  '4.41667'   │  'Male'  │    'July'     │
│    7    │  '2.52083'  │    '3.5'     │  'Male'  │   'August'    │
│    8    │  '3.10417'  │   '3.8125'   │  'Male'  │  'September'  │
│    9    │  '2.6875'   │  '3.54708'   │  'Male'  │   'October'   │
│   10    │   '2.625'   │  '3.45833'   │  'Male'  │  'November'   │
│   11    │   '2.375'   │  '3.77083'   │  'Male'  │  'December'   │
│   12    │  '3.0625'   │  '3.41667'   │  'Male'  │   'January'   │
│   13    │   '3.125'   │  '2.52083'   │  'Male'  │  'February'   │
│   14    │  '2.58333'  │  '3.02083'   │  'Male'  │    'March'    │
└─────────┴─────────────┴──────────────┴──────────┴───────────────┘
˅˅˅ 84 more rows`, 0, 15)


        // Level 0 drilldown
        expect( mixedDataset.drilldownAndSummarize() ).toTabulateAs(`\
┌───────────────────┬─────────────────┬──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ (iteration index) │       Key       │                                                                                            Values                                                                                            │
├───────────────────┼─────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│         0         │  'Neuroticism'  │                                                          Map { '3.4-3.9' => 12, '2.8-3.3' => 52, '2.2-2.8' => 30, '1.6-2.2' => 5 }                                                           │
│         1         │ 'Extraversion'  │                                                          Map { '4.0-4.4' => 8, '3.5-3.9' => 42, '3.0-3.5' => 38, '2.5-3.0' => 11 }                                                           │
│         2         │    'Gender'     │                                                                             Map { 'Male' => 47, 'Female' => 52 }                                                                             │
│         3         │ 'MonthMeasured' │ Map { 'January' => 9, 'February' => 9, 'March' => 9, 'April' => 8, 'May' => 8, 'June' => 8, 'July' => 8, 'August' => 8, 'September' => 8, 'October' => 8, 'November' => 8, 'December' => 8 } │
└───────────────────┴─────────────────┴──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘`)

        // Level 1 drilldown for categorical data
        expect( mixedDataset.drilldownTo({'Gender':'Male'}) ).toTabulateAs(`\
┌─────────┬─────────────┬──────────────┬────────┬───────────────┐
│ (index) │ Neuroticism │ Extraversion │ Gender │ MonthMeasured │
├─────────┼─────────────┼──────────────┼────────┼───────────────┤
│    0    │  '2.47917'  │  '4.20833'   │ 'Male' │   'January'   │
│    1    │  '2.60417'  │   '3.1875'   │ 'Male' │  'February'   │
│    2    │  '2.52083'  │  '2.89583'   │ 'Male' │    'March'    │
│    3    │  '2.52083'  │  '3.29167'   │ 'Male' │    'June'     │
│    4    │  '2.35417'  │  '4.41667'   │ 'Male' │    'July'     │
│    5    │  '2.52083'  │    '3.5'     │ 'Male' │   'August'    │
│    6    │  '3.10417'  │   '3.8125'   │ 'Male' │  'September'  │
│    7    │  '2.6875'   │  '3.54708'   │ 'Male' │   'October'   │
│    8    │   '2.625'   │  '3.45833'   │ 'Male' │  'November'   │
│    9    │   '2.375'   │  '3.77083'   │ 'Male' │  'December'   │
└─────────┴─────────────┴──────────────┴────────┴───────────────┘
˅˅˅ 37 more rows`, 0, 10)


        // Level 1 drilldown + summarize for categorical data
        expect( mixedDataset.drilldownAndSummarize({'Gender':'Male'}) ).toTabulateAs(`\
┌───────────────────┬─────────────────┬──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│ (iteration index) │       Key       │                                                                                            Values                                                                                            │
├───────────────────┼─────────────────┼──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┤
│         0         │  'Neuroticism'  │                                                           Map { '3.7-3.7' => 2, '2.8-3.2' => 21, '2.4-2.8' => 18, '1.9-2.4' => 6 }                                                           │
│         1         │ 'Extraversion'  │                                                           Map { '4.1-4.4' => 5, '3.5-3.8' => 23, '3.0-3.5' => 16, '2.5-2.9' => 3 }                                                           │
│         2         │    'Gender'     │                                                                                     Map { 'Male' => 47 }                                                                                     │
│         3         │ 'MonthMeasured' │ Map { 'January' => 5, 'February' => 4, 'March' => 4, 'June' => 4, 'July' => 4, 'August' => 4, 'September' => 4, 'October' => 4, 'November' => 4, 'December' => 4, 'April' => 3, 'May' => 3 } │
└───────────────────┴─────────────────┴──────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────┘`)


        // Level 1 drilldown for continuous data
//         expect( mixedDataset.drilldownTo({'Neuroticism':'3.46-4.23'}) ).toTabulateAs(`\
// `) // TODO

        // Level 1 drilldown + summarize for continuous data
//         expect( mixedDataset.drilldownAndSummarize({'Neuroticism':'3.46-4.23'}) ).toTabulateAs(`\
// `) // TODO


    })


})



//// Continuous Data ///////////////////////////////////////////////////////////////


describe ('Handling continous data', () => {


        describe ('Utility methods', () => {


            test ('When number of quantiles is provided, the quantile cutoff points should be calculated', () => {

                const cutoffPointsForFourQuantiles = dataset.Dataset.calculateQuantileCutoffPercentages( 4 )
                expect( cutoffPointsForFourQuantiles ).toEqual( [0, 0.25, 0.5, 0.75, 1] )

                const cutoffPointsForThreeQuantiles = dataset.Dataset.calculateQuantileCutoffPercentages( 3 )
                expect( cutoffPointsForThreeQuantiles ).toEqual( [0, 0.33333333333333337, 0.6666666666666667, 1] )

                const cutoffPointsForFiveQuantiles = dataset.Dataset.calculateQuantileCutoffPercentages( 5 )
                expect( cutoffPointsForFiveQuantiles ).toEqual( [0, 0.2, 0.4, 0.6000000000000001, 0.8, 1] )

            })


            test ('Get names of continuous columns', async () => {

                const mixedDataset = new dataset.Dataset('http://localhost:3000/libraries/cpc/tests/dataset/SampleMixedData.csv')
                mixedDataset.transformContinuousColumns.toQuantiles = false
                await mixedDataset.build()

                expect( mixedDataset.getNamesOfContinuousColumns() ).toEqual( ["Neuroticism", "Extraversion"] )

            })


            test ('Calculate quantiles of a column', async () => {

                const mixedDataset = new dataset.Dataset('http://localhost:3000/libraries/cpc/tests/dataset/SampleMixedData.csv')
                mixedDataset.transformContinuousColumns.toQuantiles = false
                await mixedDataset.build()

                const neuroticismQuantileValues = mixedDataset.calculateQuantileValuesOfColumn('Neuroticism', 4)
                const extraversionQuantileValues = mixedDataset.calculateQuantileValuesOfColumn('Extraversion', 4)

                expect( neuroticismQuantileValues ).toEqual( [1.64583, 2.59375, 2.875, 3.114585, 3.875] )
                expect( extraversionQuantileValues ).toEqual( [2.52083, 3.28125, 3.47917, 3.65625, 4.41667] )

                // Confirm that the values are mathematically correct

                const neuroticismMin = d3.min(mixedDataset.data, d=>d['Neuroticism'])
                const neuroticismMedian = d3.median(mixedDataset.data, d=>d['Neuroticism'])
                const neuroticismMax = d3.max(mixedDataset.data, d=>d['Neuroticism'])

                const extraversionMin = d3.min(mixedDataset.data, d=>d['Extraversion'])
                const extraversionMedian = d3.median(mixedDataset.data, d=>d['Extraversion'])
                const extraversionMax = d3.max(mixedDataset.data, d=>d['Extraversion'])

                expect( neuroticismMin === String( neuroticismQuantileValues[0] )).toBeTruthy()  // d3 returns string values from d3.max and d3.min
                expect( neuroticismMedian === neuroticismQuantileValues[2] ).toBeTruthy()
                expect( neuroticismMax === String( neuroticismQuantileValues[4] ) ).toBeTruthy()

                expect( extraversionMin === String( extraversionQuantileValues[0] ) ).toBeTruthy()
                expect( extraversionMedian === extraversionQuantileValues[2] ).toBeTruthy()
                expect( extraversionMax === String( extraversionQuantileValues[4] ) ).toBeTruthy()

            })



        })


        test ('When a dataset with continuous column(s) is initialized, continuous values should automatically be discretized using quantiles', async () => {

            const mixedDataset = new dataset.Dataset('http://localhost:3000/libraries/cpc/tests/dataset/SampleMixedData.csv')
            await mixedDataset.build()

            expect( mixedDataset.data ).toTabulateAs(`\
┌─────────┬─────────────┬──────────────┬──────────┬───────────────┐
│ (index) │ Neuroticism │ Extraversion │  Gender  │ MonthMeasured │
├─────────┼─────────────┼──────────────┼──────────┼───────────────┤
│    0    │   '0-25%'   │  '75-100%'   │  'Male'  │   'January'   │
│    1    │  '25-50%'   │   '0-25%'    │  'Male'  │  'February'   │
│    2    │   '0-25%'   │   '0-25%'    │  'Male'  │    'March'    │
│    3    │  '75-100%'  │   '25-50%'   │ 'Female' │    'April'    │
│    4    │  '50-75%'   │   '25-50%'   │ 'Female' │     'May'     │
│    5    │   '0-25%'   │   '25-50%'   │  'Male'  │    'June'     │
│    6    │   '0-25%'   │  '75-100%'   │  'Male'  │    'July'     │
│    7    │   '0-25%'   │   '50-75%'   │  'Male'  │   'August'    │
│    8    │  '50-75%'   │  '75-100%'   │  'Male'  │  'September'  │
│    9    │  '25-50%'   │   '50-75%'   │  'Male'  │   'October'   │
│   10    │  '25-50%'   │   '25-50%'   │  'Male'  │  'November'   │
│   11    │   '0-25%'   │  '75-100%'   │  'Male'  │  'December'   │
│   12    │  '50-75%'   │   '25-50%'   │  'Male'  │   'January'   │
│   13    │  '75-100%'  │   '0-25%'    │  'Male'  │  'February'   │
│   14    │   '0-25%'   │   '0-25%'    │  'Male'  │    'March'    │
└─────────┴─────────────┴──────────────┴──────────┴───────────────┘
˅˅˅ 84 more rows`, 0, 15)

        })


        test ('If a Dataset is built without discretization, it should still be possible to call transformContinuousColumnsToQuantiles() method for discretizing the data after the built', async () => {

        const mixedDatasetWithoutDiscretization = new dataset.Dataset('http://localhost:3000/libraries/cpc/tests/dataset/SampleMixedData.csv')
        mixedDatasetWithoutDiscretization.transformContinuousColumns.toQuantiles = false
        await mixedDatasetWithoutDiscretization.build()

        expect( mixedDatasetWithoutDiscretization.data ).toTabulateAs(`\
┌─────────┬─────────────┬──────────────┬──────────┬───────────────┐
│ (index) │ Neuroticism │ Extraversion │  Gender  │ MonthMeasured │
├─────────┼─────────────┼──────────────┼──────────┼───────────────┤
│    0    │  '2.47917'  │  '4.20833'   │  'Male'  │   'January'   │
│    1    │  '2.60417'  │   '3.1875'   │  'Male'  │  'February'   │
│    2    │  '2.52083'  │  '2.89583'   │  'Male'  │    'March'    │
│    3    │  '3.29167'  │  '3.29167'   │ 'Female' │    'April'    │
│    4    │  '3.02083'  │  '3.29167'   │ 'Female' │     'May'     │
│    5    │  '2.52083'  │  '3.29167'   │  'Male'  │    'June'     │
│    6    │  '2.35417'  │  '4.41667'   │  'Male'  │    'July'     │
│    7    │  '2.52083'  │    '3.5'     │  'Male'  │   'August'    │
│    8    │  '3.10417'  │   '3.8125'   │  'Male'  │  'September'  │
│    9    │  '2.6875'   │  '3.54708'   │  'Male'  │   'October'   │
│   10    │   '2.625'   │  '3.45833'   │  'Male'  │  'November'   │
│   11    │   '2.375'   │  '3.77083'   │  'Male'  │  'December'   │
│   12    │  '3.0625'   │  '3.41667'   │  'Male'  │   'January'   │
│   13    │   '3.125'   │  '2.52083'   │  'Male'  │  'February'   │
│   14    │  '2.58333'  │  '3.02083'   │  'Male'  │    'March'    │
└─────────┴─────────────┴──────────────┴──────────┴───────────────┘
˅˅˅ 84 more rows`, 0, 15)

        mixedDatasetWithoutDiscretization.transformContinuousColumnsToQuantiles( 4, 1 )
        expect( mixedDatasetWithoutDiscretization.data ).toTabulateAs(`\
┌─────────┬─────────────┬──────────────┬──────────┬───────────────┐
│ (index) │ Neuroticism │ Extraversion │  Gender  │ MonthMeasured │
├─────────┼─────────────┼──────────────┼──────────┼───────────────┤
│    0    │   '0-25%'   │  '75-100%'   │  'Male'  │   'January'   │
│    1    │  '25-50%'   │   '0-25%'    │  'Male'  │  'February'   │
│    2    │   '0-25%'   │   '0-25%'    │  'Male'  │    'March'    │
│    3    │  '75-100%'  │   '25-50%'   │ 'Female' │    'April'    │
│    4    │  '50-75%'   │   '25-50%'   │ 'Female' │     'May'     │
│    5    │   '0-25%'   │   '25-50%'   │  'Male'  │    'June'     │
│    6    │   '0-25%'   │  '75-100%'   │  'Male'  │    'July'     │
│    7    │   '0-25%'   │   '50-75%'   │  'Male'  │   'August'    │
│    8    │  '50-75%'   │  '75-100%'   │  'Male'  │  'September'  │
│    9    │  '25-50%'   │   '50-75%'   │  'Male'  │   'October'   │
│   10    │  '25-50%'   │   '25-50%'   │  'Male'  │  'November'   │
│   11    │   '0-25%'   │  '75-100%'   │  'Male'  │  'December'   │
│   12    │  '50-75%'   │   '25-50%'   │  'Male'  │   'January'   │
│   13    │  '75-100%'  │   '0-25%'    │  'Male'  │  'February'   │
│   14    │   '0-25%'   │   '0-25%'    │  'Male'  │    'March'    │
└─────────┴─────────────┴──────────────┴──────────┴───────────────┘
˅˅˅ 84 more rows`, 0, 15)

    })


        describe ('Obsolete methods', () => {

            test ('Quantize a column', async () => {


                const mixedDataset = new dataset.Dataset('http://localhost:3000/libraries/cpc/tests/dataset/SampleMixedData.csv')
                mixedDataset.transformContinuousColumns.toQuantiles = false
                await mixedDataset.build()

                expectTable(mixedDataset.data, `\
┌─────────┬─────────────┬──────────────┬──────────┬───────────────┐
│ (index) │ Neuroticism │ Extraversion │  Gender  │ MonthMeasured │
├─────────┼─────────────┼──────────────┼──────────┼───────────────┤
│    0    │  '2.47917'  │  '4.20833'   │  'Male'  │   'January'   │
│    1    │  '2.60417'  │   '3.1875'   │  'Male'  │  'February'   │
│    2    │  '2.52083'  │  '2.89583'   │  'Male'  │    'March'    │
│    3    │  '3.29167'  │  '3.29167'   │ 'Female' │    'April'    │
│    4    │  '3.02083'  │  '3.29167'   │ 'Female' │     'May'     │
│    5    │  '2.52083'  │  '3.29167'   │  'Male'  │    'June'     │
│    6    │  '2.35417'  │  '4.41667'   │  'Male'  │    'July'     │
│    7    │  '2.52083'  │    '3.5'     │  'Male'  │   'August'    │
│    8    │  '3.10417'  │   '3.8125'   │  'Male'  │  'September'  │
│    9    │  '2.6875'   │  '3.54708'   │  'Male'  │   'October'   │
│   10    │   '2.625'   │  '3.45833'   │  'Male'  │  'November'   │
│   11    │   '2.375'   │  '3.77083'   │  'Male'  │  'December'   │
│   12    │  '3.0625'   │  '3.41667'   │  'Male'  │   'January'   │
│   13    │   '3.125'   │  '2.52083'   │  'Male'  │  'February'   │
│   14    │  '2.58333'  │  '3.02083'   │  'Male'  │    'March'    │
└─────────┴─────────────┴──────────────┴──────────┴───────────────┘
˅˅˅ 84 more rows`, 0, 15)


                const quantizedData = dataset.Dataset._splitDataByQuantilesOfColumn( mixedDataset.data, 'Neuroticism', 4, 1)
                expect( quantizedData ).toTabulateAs(`\
┌───────────────────┬───────────┬─────────────────────────────────────────────────────┐
│ (iteration index) │    Key    │                       Values                        │
├───────────────────┼───────────┼─────────────────────────────────────────────────────┤
│         0         │ '3.4-3.9' │ [ [Object], [Object], [Object], ... 9 more items ]  │
│         1         │ '2.8-3.3' │ [ [Object], [Object], [Object], ... 49 more items ] │
│         2         │ '2.2-2.8' │ [ [Object], [Object], [Object], ... 27 more items ] │
│         3         │ '1.6-2.2' │ [ [Object], [Object], [Object], ... 2 more items ]  │
└───────────────────┴───────────┴─────────────────────────────────────────────────────┘`)

                const quantileBoundariesVsQuantileNamesForNeuroticism =
                    dataset.Dataset._findBoundariesVsQuantileNamesInQuantiledData(quantizedData, 'Neuroticism')

                expect( quantileBoundariesVsQuantileNamesForNeuroticism ).toTabulateAs(`\
┌───────────────────┬───────────┬────────────────────────────────────────────────┐
│ (iteration index) │    Key    │                     Values                     │
├───────────────────┼───────────┼────────────────────────────────────────────────┤
│         0         │ '3.4-3.9' │  Map { 'min' => '3.39583', 'max' => '3.875' }  │
│         1         │ '2.8-3.3' │ Map { 'min' => '2.77083', 'max' => '3.3125' }  │
│         2         │ '2.2-2.8' │  Map { 'min' => '2.20833', 'max' => '2.75' }   │
│         3         │ '1.6-2.2' │ Map { 'min' => '1.64583', 'max' => '2.16667' } │
└───────────────────┴───────────┴────────────────────────────────────────────────┘`)


                const quantizedAndRenamedData = d3.group( mixedDataset.data,
                    d=> dataset.Dataset._translateValueToQuantileName(mixedDataset.data, 'Neuroticism', d['Neuroticism'])
                )

                expect( quantizedAndRenamedData ).toTabulateAs(`\
┌───────────────────┬───────────┬─────────────────────────────────────────────────────┐
│ (iteration index) │    Key    │                       Values                        │
├───────────────────┼───────────┼─────────────────────────────────────────────────────┤
│         0         │ '2.2-2.8' │ [ [Object], [Object], [Object], ... 27 more items ] │
│         1         │ '2.8-3.3' │ [ [Object], [Object], [Object], ... 49 more items ] │
│         2         │ '1.6-2.2' │ [ [Object], [Object], [Object], ... 2 more items ]  │
│         3         │ '3.4-3.9' │ [ [Object], [Object], [Object], ... 9 more items ]  │
└───────────────────┴───────────┴─────────────────────────────────────────────────────┘`)




            })

        })


})