//// UNIT TESTS ////////////////////////////////////////////////////////////////////////////////////////////////////////



//// D3 General ///////////////////////////////////////////////////////////////

describe( 'D3: Learning tests for async reading with D3', () => {



    test( 'Should read data with d3', async () => {

        expect.assertions( 2 )

        const titanicDataset = await d3.csv( 'http://localhost:3000/TEPAIV/CPC/libraries/cpc/tests/dataset/titanic.csv' )

        expect( titanicDataset.length ).toBe( 1309 )

        expectTable( titanicDataset, `\
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
˅˅˅ 1294 more rows`, 0, 15 )


    } )


    test( 'Should read data with d3.csv wrapped in a function', async () => {

        expect.assertions( 1 )

        async function wrapper() {

            return await d3.csv( 'http://localhost:3000/TEPAIV/CPC/libraries/cpc/tests/dataset/titanic.csv' )

        }

        const titanicDataset = await wrapper()

        expect( titanicDataset.length ).toBe( 1309 )


    } )



} )


//// DATASET ////

//// INITIALIZE ///////////////////////////////////////////////////////////////

describe( 'Initialization', () => {

    test( 'Initiate a Dataset instance, read data into it, and calculate properties', async () => {

            expect.assertions( 11 )

            const titanicDataset = new dataset.Dataset( 'http://localhost:3000/TEPAIV/CPC/libraries/cpc/tests/dataset/titanic.csv' )
            await titanicDataset.build()

            expect( titanicDataset.data ).toBeDefined()
            expect( titanicDataset.data ).toHaveLength( 1309 )

            expectTable( titanicDataset.data, `\
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
˅˅˅ 1294 more rows`, 0, 15 )


            expectTable( titanicDataset.data, `\
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
˅˅˅ 0 more rows`, 1300, 9 )


            expect( titanicDataset.columnNames ).toEqual( [ 'Ticket', 'Status', 'Gender', 'Name' ] )
            // For category names, see the test that initiates the dataset with an omitted column.
            // (Category names are not tested here due to excessive number of them caused by 'Name' column to be
            // included.)

            // Verify that dataset structure is correctly mapped
            expect( titanicDataset.structure ).toBeInstanceOf( Map )
            expect( titanicDataset.structure.size ).toBe( 4 )
            expect( titanicDataset.structure.get( 'Gender' ) ).toBeInstanceOf( Array )
            expect( titanicDataset.structure.get( 'Gender' ) ).toEqual( [ 'Female', 'Male' ] )
            expect( titanicDataset.structure.get( 'Ticket' ) ).toEqual( [ '1st class', '2nd class', '3rd class' ] )
            expect( titanicDataset.structure.get( 'Status' ) ).toEqual( [ 'Survived', 'Died' ] )



            // Verify that a dataset summary is calculated upon initiation dataset
            // This test is skipped due to excessive output due to inclusion of 'Name' column.
            // The test is carried out in [REF-1], where this column is not included.


        }
    )


    test( 'Continuous data: Read continuous data without discretization', async () => {

        const bigFiveDatasetContinous = new dataset.Dataset( 'http://localhost:3000/TEPAIV/CPC/libraries/cpc/tests/dataset/BigFivePersonalityTraits-Small.csv' )
        bigFiveDatasetContinous.initParams.transformContinuousColumnsToQuantiles = false
        await bigFiveDatasetContinous.build()


        expect( bigFiveDatasetContinous.data ).toBeDefined()
        expect( bigFiveDatasetContinous.data ).toHaveLength( 99 )

        expectTable( bigFiveDatasetContinous.data, `\
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
˅˅˅ 84 more rows`, 0, 15 )
    } )

    test( 'Continuous data: Read continuous data with discretization', async () => {

        const bigFiveDatasetDiscretized = new dataset.Dataset( 'http://localhost:3000/TEPAIV/CPC/libraries/cpc/tests/dataset/BigFivePersonalityTraits-Small.csv' )
        await bigFiveDatasetDiscretized.build()


        expect( bigFiveDatasetDiscretized.data ).toBeDefined()
        expect( bigFiveDatasetDiscretized.data ).toHaveLength( 99 )

        expectTable( bigFiveDatasetDiscretized.data, `\
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
˅˅˅ 84 more rows`, 0, 15 )
    } )

} )




//// INFERENCES ///////////////////////////////////////////////////////////////

describe( 'Inferences', () => {

    test( 'Get column names in the imported dataset', async () => {

        const titanicDataset = new dataset.Dataset( 'http://localhost:3000/TEPAIV/CPC/libraries/cpc/tests/dataset/titanic.csv' )
        await titanicDataset.build()

        // Verify that the property that holds column names is correctly set upon initiation
        let propertyThatHoldsColumnNames

        propertyThatHoldsColumnNames = JSON.stringify( titanicDataset.columnNames )
        expect( propertyThatHoldsColumnNames ).toBe( `["Ticket","Status","Gender","Name"]` )



        const titanicDatasetWithOmittedColumn = new dataset.Dataset( 'http://localhost:3000/TEPAIV/CPC/libraries/cpc/tests/dataset/titanic.csv', 'Name' )
        await titanicDatasetWithOmittedColumn.build()

        // Verify that the property that holds column names is correctly set upon initiation
        propertyThatHoldsColumnNames = JSON.stringify( titanicDataset.columnNames )
        expect( propertyThatHoldsColumnNames ).toBe( `["Ticket","Status","Gender","Name"]` )

    } )

    test( 'Return column name when provided a category name', async () => {

        const titanicDataset = new dataset.Dataset( 'http://localhost:3000/TEPAIV/CPC/libraries/cpc/tests/dataset/titanic.csv', 'Name' )
        await titanicDataset.build()

        // Infer column name from given category name
        expect( titanicDataset._inferColumnFromCategory( 'Female' ) ).toBe( 'Gender' )
        expect( titanicDataset._inferColumnFromCategory( 'Male' ) ).toBe( 'Gender' )
        expect( titanicDataset._inferColumnFromCategory( '1st class' ) ).toBe( 'Ticket' )
        expect( titanicDataset._inferColumnFromCategory( '2nd class' ) ).toBe( 'Ticket' )
        expect( titanicDataset._inferColumnFromCategory( 'Survived' ) ).toBe( 'Status' )
        expect( titanicDataset._inferColumnFromCategory( 'Died' ) ).toBe( 'Status' )


        // Specified category does not exist in dataset
        expect( () => titanicDataset._inferColumnFromCategory( 'Non-existent category' ) )
            .toThrow( `The category name "Non-existent category" does not occur in the dataset. One column in the dataset should contain the specified category.` )

        // Category occurs in more than one column
        titanicDataset.structure.set( 'Sex', [ 'Male', 'Female' ] )
        expect( () => titanicDataset._inferColumnFromCategory( 'Male' ) )
            .toThrow( `The category name "Male" occurs in these columns: "Gender,Sex". Columns in the dataset should not share category names.` )

    } )


    test( 'Column Type: Detect whether a column is continuous or categorical', async () => {


        const mixedDataset = new dataset.Dataset( 'http://localhost:3000/TEPAIV/CPC/libraries/cpc/tests/dataset/SampleMixedData.csv' )
        mixedDataset.initParams.transformContinuousColumnsToQuantiles = false
        await mixedDataset.build()

        expectTable( mixedDataset.data, `\
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
˅˅˅ 84 more rows`, 0, 15 )


        const columnTypes = mixedDataset._inferColumnTypes()

        const neuroticismColumnType = columnTypes.get( 'Neuroticism' )
        expect( neuroticismColumnType ).toBe( 'continuous' )

        const extraversionColumnType = columnTypes.get( 'Extraversion' )
        expect( extraversionColumnType ).toBe( 'continuous' )

        const genderColumnType = columnTypes.get( 'Gender' )
        expect( genderColumnType ).toBe( 'categorical' )

        const monthMeasuredColumnType = columnTypes.get( 'MonthMeasured' )
        expect( monthMeasuredColumnType ).toBe( 'categorical' )

    } )

    test( 'Column Type: Column types should be detected during instantiation', async () => {


        const mixedDataset = new dataset.Dataset( 'http://localhost:3000/TEPAIV/CPC/libraries/cpc/tests/dataset/SampleMixedData.csv' )
        mixedDataset.initParams.transformContinuousColumnsToQuantiles = false

        await mixedDataset.build()

        expectTable( mixedDataset.data, `\
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
˅˅˅ 84 more rows`, 0, 15 )

        expect( mixedDataset.columnTypes ).toTabulateAs( `\
┌───────────────────┬─────────────────┬───────────────┐
│ (iteration index) │       Key       │    Values     │
├───────────────────┼─────────────────┼───────────────┤
│         0         │  'Neuroticism'  │ 'continuous'  │
│         1         │ 'Extraversion'  │ 'continuous'  │
│         2         │    'Gender'     │ 'categorical' │
│         3         │ 'MonthMeasured' │ 'categorical' │
└───────────────────┴─────────────────┴───────────────┘` )

    } )

} )




//// OMIT ///////////////////////////////////////////////////////////////

describe( 'Omitting Columns', () => {

    test( 'Initiate Dataset with an omitted column', async () => {

        expect.assertions( 11 )

        const titanicDataset = new dataset.Dataset(
            'http://localhost:3000/TEPAIV/CPC/libraries/cpc/tests/dataset/titanic.csv',
            'Name'
        )
        await titanicDataset.build()


        expect( titanicDataset.data ).toBeDefined()
        expect( titanicDataset.data ).toHaveLength( 1309 )

        expect( titanicDataset.columnNames ).toEqual( [ 'Ticket', 'Status', 'Gender' ] )
        expect( titanicDataset.categoryNames ).toEqual( [ '1st class', '2nd class', '3rd class', 'Survived', 'Died', 'Female', 'Male' ] )

        // Verify that dataset structure is correctly mapped
        expect( titanicDataset.structure ).toBeInstanceOf( Map )
        expect( titanicDataset.structure.size ).toBe( 3 )
        expect( titanicDataset.structure.get( 'Gender' ) ).toBeInstanceOf( Array )
        expect( titanicDataset.structure.get( 'Gender' ) ).toEqual( [ 'Female', 'Male' ] )
        expect( titanicDataset.structure.get( 'Ticket' ) ).toEqual( [ '1st class', '2nd class', '3rd class' ] )
        expect( titanicDataset.structure.get( 'Status' ) ).toEqual( [ 'Survived', 'Died' ] )


        // Verify that a dataset summary is calculated upon initiation dataset
        // [REF-1]
        expectTable( titanicDataset.summary, `\
┌───────────────────┬──────────┬───────────────────────────────────────────────────────────────────────┐
│ (iteration index) │   Key    │                                Values                                 │
├───────────────────┼──────────┼───────────────────────────────────────────────────────────────────────┤
│         0         │ 'Ticket' │ Map(3) { '1st class' => 323, '2nd class' => 277, '3rd class' => 709 } │
│         1         │ 'Status' │              Map(2) { 'Died' => 809, 'Survived' => 500 }              │
│         2         │ 'Gender' │               Map(2) { 'Female' => 466, 'Male' => 843 }               │
└───────────────────┴──────────┴───────────────────────────────────────────────────────────────────────┘` )

    } )

} )



//// SPLIT ///////////////////////////////////////////////////////////////

describe( 'Splitting', () => {


    test( 'Parse SplitQuery parameters', async () => {

        const titanicDataset = new dataset.Dataset( 'http://localhost:3000/TEPAIV/CPC/libraries/cpc/tests/dataset/titanic.csv' )
        await titanicDataset.build()


        const myQuery1 = new dataset.SplitQuery( titanicDataset, [ 'Status' ] )
        expect( myQuery1.queryString ).toBe( `d3.group(this.data, d => d["Status"])` )

        const myQuery2 = new dataset.SplitQuery( titanicDataset, [ 'Status', 'Gender' ] )
        expect( myQuery2.queryString ).toBe( `d3.group(this.data, d => d["Status"], d => d["Gender"])` )

        const myQuery3 = new dataset.SplitQuery( titanicDataset, [ 'Status', 'Gender', 'Ticket' ] )
        expect( myQuery3.queryString ).toBe( `d3.group(this.data, d => d["Status"], d => d["Gender"], d => d["Ticket"])` )


    } )


    test( 'Return error if split query is invalid because of a bad column or category name', async () => {


        const titanicDataset = new dataset.Dataset( 'http://localhost:3000/TEPAIV/CPC/libraries/cpc/tests/dataset/titanic.csv' )
        await titanicDataset.build()



        expect( () => {

            const myColumnQuery = new dataset.SplitQuery( titanicDataset, [ 'random column name' ] )

        } ).toThrow( `Provided split query argument(s), "[random column name]", do not correspond to a column or category in the dataset.` )

    } )



    test( 'SPLIT dataset by column using .splitBy(), and then manually drilldown with .get()', async () => {

        // Query terminology:
        // SPLIT: d3.group()
        // DRILLDOWN: d3.group().get()
        // SPLIT+SUMMARIZE: d3.rollup()

        const titanicDataset = new dataset.Dataset( 'http://localhost:3000/TEPAIV/CPC/libraries/cpc/tests/dataset/titanic.csv', 'Name' )
        await titanicDataset.build()

        // SPLIT using column name
        const dataByGender = titanicDataset.splitBy( 'Gender' )  // gender is a column name
        expectTable( dataByGender, `\
┌───────────────────┬──────────┬──────────────────────────────────────────────────────┐
│ (iteration index) │   Key    │                        Values                        │
├───────────────────┼──────────┼──────────────────────────────────────────────────────┤
│         0         │ 'Female' │ [ [Object], [Object], [Object], ... 463 more items ] │
│         1         │  'Male'  │ [ [Object], [Object], [Object], ... 840 more items ] │
└───────────────────┴──────────┴──────────────────────────────────────────────────────┘` )

        expect( dataByGender.size ).toBe( 2 )
        expect( dataByGender.get( 'Female' ) ).toHaveLength( 466 )
        expect( dataByGender.get( 'Male' ) ).toHaveLength( 843 )


        // SPLIT using 2 column names
        const dataByGenderAndStatus = titanicDataset.splitBy( 'Gender', 'Status' )
        expectTable( dataByGenderAndStatus, `\
┌───────────────────┬──────────┬─────────────────────────────────────────────────────┐
│ (iteration index) │   Key    │                       Values                        │
├───────────────────┼──────────┼─────────────────────────────────────────────────────┤
│         0         │ 'Female' │ Map(2) { 'Survived' => [Array], 'Died' => [Array] } │
│         1         │  'Male'  │ Map(2) { 'Survived' => [Array], 'Died' => [Array] } │
└───────────────────┴──────────┴─────────────────────────────────────────────────────┘` )

        // DRILLDOWN on one of the categories (i.e., 'Male') of the broken down data
        const malesByStatus = dataByGenderAndStatus.get( 'Male' )
        expectTable( malesByStatus, `\
┌───────────────────┬────────────┬──────────────────────────────────────────────────────┐
│ (iteration index) │    Key     │                        Values                        │
├───────────────────┼────────────┼──────────────────────────────────────────────────────┤
│         0         │ 'Survived' │ [ [Object], [Object], [Object], ... 158 more items ] │
│         1         │   'Died'   │ [ [Object], [Object], [Object], ... 679 more items ] │
└───────────────────┴────────────┴──────────────────────────────────────────────────────┘` )

        // DRILLDOWN further on the drilled down category (i.e., 'Male')
        const survivingMales = malesByStatus.get( 'Survived' )
        expectTable( survivingMales, `\
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
˅˅˅ 151 more rows`, 0, 10 )


        // SPLIT & COUNT the drilled down category by another category using d3.rollup()
        const survivingMalesByTicket =
            d3.rollup( survivingMales, v => v.length, g => g[ 'Ticket' ] )
        expectTable( survivingMalesByTicket, `\
┌───────────────────┬─────────────┬────────┐
│ (iteration index) │     Key     │ Values │
├───────────────────┼─────────────┼────────┤
│         0         │ '1st class' │   61   │
│         1         │ '2nd class' │   25   │
│         2         │ '3rd class' │   75   │
└───────────────────┴─────────────┴────────┘` )


        // Attempting to query with both column and category names should give error
        expect( () =>
            titanicDataset.splitBy( 'Gender', '1st class' )
        ).toThrow( Error )

    } )




    test( 'Query the dataset for counts of nested categories using private interface', async () => {

        const titanicDataset = new dataset.Dataset( 'http://localhost:3000/TEPAIV/CPC/libraries/cpc/tests/dataset/titanic.csv' )
        await titanicDataset.build()


        // Query depth: 1
        const status = titanicDataset.splitBy( 'Status' )
            , survived = status.get( 'Survived' )
            , died = status.get( 'Died' )

        expect( survived ).toHaveLength( 500 )
        expect( died ).toHaveLength( 809 )


        // Query depth: 2
        const statusByGender = titanicDataset.splitBy( 'Status', 'Gender' )
            , survivedFemales = statusByGender.get( 'Survived' ).get( 'Female' )
            , survivedMales = statusByGender.get( 'Survived' ).get( 'Male' )

        expect( survivedFemales ).toHaveLength( 339 )
        expect( survivedMales ).toHaveLength( 161 )


        // Query depth: 3
        const survivedFirstClassFemales =
            titanicDataset.splitBy( 'Status', 'Gender', 'Ticket' )
                .get( 'Survived' ).get( 'Female' ).get( '1st class' )

        expect( survivedFirstClassFemales ).toHaveLength( 139 )

    } )


//     TODO
//     test ('Continous SPLIT: Split dataset by column using .splitBy(), and then manually drilldown with .get()',
// async () => {  // Query terminology: // SPLIT: d3.group() // DRILLDOWN: d3.group().get() // SPLIT+SUMMARIZE:
// d3.rollup()  const bigFiveDataset = new
// dataset.Dataset('http://localhost:3000/TEPAIV/CPC/libraries/cpc/tests/dataset/BigFivePersonalityTraits-Small.csv',
// 'Name') await bigFiveDataset.build()  // SPLIT using column name const dataByOpenness =
// bigFiveDataset.splitBy('Openness')  // Openness is a column name //         expectTable(dataByOpenness, `\ // `)
// expect(dataByOpenness.size).toBe(2) expect(dataByOpenness.get('Female')).toHaveLength(466)
// expect(dataByOpenness.get('Male')).toHaveLength(843)   // SPLIT using 2 column names const dataByGenderAndStatus =
// bigFiveDataset.splitBy('Gender', 'Status') expectTable(dataByGenderAndStatus, `\
// ┌───────────────────┬──────────┬──────────────────────────────────────────────────┐ │ (iteration index) │   Key    │
//                      Values                      │
// ├───────────────────┼──────────┼──────────────────────────────────────────────────┤ │         0         │ 'Female' │
// Map { 'Survived' => [Array], 'Died' => [Array] } │ │         1         │  'Male'  │ Map { 'Survived' => [Array],
// 'Died' => [Array] } │ └───────────────────┴──────────┴──────────────────────────────────────────────────┘`)  //
// DRILLDOWN on one of the categories (i.e., 'Male') of the broken down data const malesByStatus =
// dataByGenderAndStatus.get('Male') expectTable(malesByStatus, `\
// ┌───────────────────┬────────────┬──────────────────────────────────────────────────────┐ │ (iteration index) │
// Key     │                        Values                        │
// ├───────────────────┼────────────┼──────────────────────────────────────────────────────┤ │         0         │
// 'Survived' │ [ [Object], [Object], [Object], ... 158 more items ] │ │         1         │   'Died'   │ [ [Object],
// [Object], [Object], ... 679 more items ] │
// └───────────────────┴────────────┴──────────────────────────────────────────────────────┘`)  // DRILLDOWN further on
// the drilled down category (i.e., 'Male') const survivingMales = malesByStatus.get('Survived')
// expectTable(survivingMales, `\ ┌─────────┬─────────────┬────────────┬────────┐ │ (index) │   Ticket    │   Status
// │ Gender │ ├─────────┼─────────────┼────────────┼────────┤ │    0    │ '1st class' │ 'Survived' │ 'Male' │ │    1
// │ '1st class' │ 'Survived' │ 'Male' │ │    2    │ '1st class' │ 'Survived' │ 'Male' │ │    3    │ '1st class' │
// 'Survived' │ 'Male' │ │    4    │ '1st class' │ 'Survived' │ 'Male' │ │    5    │ '1st class' │ 'Survived' │ 'Male'
// │ │    6    │ '1st class' │ 'Survived' │ 'Male' │ │    7    │ '1st class' │ 'Survived' │ 'Male' │ │    8    │ '1st
// class' │ 'Survived' │ 'Male' │ │    9    │ '1st class' │ 'Survived' │ 'Male' │
// └─────────┴─────────────┴────────────┴────────┘ ˅˅˅ 151 more rows`, 0, 10)   // SPLIT & COUNT the drilled down
// category by another category using d3.rollup() const survivingMalesByTicket = d3.rollup(survivingMales, v=>v.length,
// g=>g['Ticket']) expectTable(survivingMalesByTicket, `\ ┌───────────────────┬─────────────┬────────┐ │ (iteration
// index) │     Key     │ Values │ ├───────────────────┼─────────────┼────────┤ │         0         │ '1st class' │
// 61   │ │         1         │ '2nd class' │   25   │ │         2         │ '3rd class' │   75   │
// └───────────────────┴─────────────┴────────┘`)   // Attempting to query with both column and category names should
// give error expect(() => bigFiveDataset.splitBy('Gender', '1st class') ).toThrow(Error)  })


} )




//// DRILLDOWN QUERY TEMPLATE ////  //TODO: TESTS OF THIS CLASS MUST BE MOVED TO ITS OWN TEST FILE
//
// test ('Should construct a query string', async () => {
//
//     const titanicDataset = new
//     dataset.Dataset('http://localhost:3000/TEPAIV/CPC/libraries/cpc/tests/dataset/titanic.csv')
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

describe( 'Drilling Down ', () => {

    test( 'Parse DrilldownQuery parameters', async () => {

        const titanicDataset = new dataset.Dataset( 'http://localhost:3000/TEPAIV/CPC/libraries/cpc/tests/dataset/titanic.csv' )
        await titanicDataset.build()


        const myQuery1 = new dataset.DrilldownQuery( titanicDataset, [ { 'Status': 'Survived' } ] )
        expect( myQuery1.queryString ).toBe( `d3.group(this.data, g=>g['Status']).get('Survived')` )

        const myQuery2 = new dataset.DrilldownQuery( titanicDataset, [ { 'Status': 'Survived' }, { 'Gender': 'Male' } ] )
        expect( myQuery2.queryString ).toBe( `d3.group(this.data, g=>g['Status'], g=>g['Gender']).get('Survived').get('Male')` )

        const myQuery3 = new dataset.DrilldownQuery( titanicDataset, [ { 'Status': 'Survived' }, { 'Gender': 'Male' }, { 'Ticket': '1st class' } ] )
        expect( myQuery3.queryString ).toBe( `d3.group(this.data, g=>g['Status'], g=>g['Gender'], g=>g['Ticket']).get('Survived').get('Male').get('1st class')` )


    } )



    test( 'DRILLDOWN dataset by category using drilldownTo()', async () => {

        // Query terminology:
        // SPLIT: d3.group()
        // DRILLDOWN: d3.group().get()
        // SPLIT+SUMMARIZE: d3.rollup()

        const titanicDataset = new dataset.Dataset( 'http://localhost:3000/TEPAIV/CPC/libraries/cpc/tests/dataset/titanic.csv', 'Name' )
        await titanicDataset.build()

        // DRILDOWN using a category name (i.e., 'Female')
        const femaleSubset = titanicDataset.drilldownTo( { 'Gender': 'Female' } )  // 'Gender' is a column name, while
                                                                                   // 'Female' is a category in the
                                                                                   // 'Gender' column

        expectTable( femaleSubset, `\
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
˅˅˅ 451 more rows`, 0, 15 )
        // Sample from further down in the data to see differing Ticket classes, while still only having 'Female' as
        // gender.
        expectTable( femaleSubset, `\
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
˅˅˅ 301 more rows`, 150, 15 )  // 'The remaining rows is not 0'  // TODO: Remaining rows in sliced array inputs are not
                               // correctly calculated. This COULD be fixed.


        // DRILDOWN using two category names (i.e., 'Female' and 'Survived')
        const femaleSurvivorsSubset = titanicDataset.drilldownTo( { 'Gender': 'Female' }, { 'Status': 'Survived' } )

        expectTable( femaleSurvivorsSubset, `\
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
˅˅˅ 324 more rows`, 0, 15 )

        expectTable( femaleSurvivorsSubset, `\
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
˅˅˅ 174 more rows`, 150, 15 )

        expectTable( femaleSurvivorsSubset, `\
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
˅˅˅ 74 more rows`, 250, 15 )


    } )


    test( 'DRILLDOWN and then SPLIT+SUMMARIZE of all categories in the context of the drilled down data', async () => {

        // Query terminology:
        // SPLIT: d3.group()
        // DRILLDOWN: d3.group().get()
        // SPLIT+SUMMARIZE: d3.rollup()

        const titanicDataset = new dataset.Dataset( 'http://localhost:3000/TEPAIV/CPC/libraries/cpc/tests/dataset/titanic.csv', 'Name' )
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
            titanicDataset.drilldownAndSummarize( [ { 'Gender': 'Female' }, { 'Status': 'Survived' } ] )

        expectTable( arrayParameterSummary, `\
┌───────────────────┬──────────┬──────────────────────────────────────────────────────────────────────┐
│ (iteration index) │   Key    │                                Values                                │
├───────────────────┼──────────┼──────────────────────────────────────────────────────────────────────┤
│         0         │ 'Ticket' │ Map(3) { '1st class' => 139, '2nd class' => 94, '3rd class' => 106 } │
│         1         │ 'Status' │                     Map(1) { 'Survived' => 339 }                     │
│         2         │ 'Gender' │                      Map(1) { 'Female' => 339 }                      │
└───────────────────┴──────────┴──────────────────────────────────────────────────────────────────────┘` )



    } )

} )



//// SUMMARIZE ///////////////////////////////////////////////////////////////

describe( 'Summarizing', () => {


    test( 'summarize(): SPLIT+SUMMARIZE level-0/SURFACE data with summarize()', async () => {

        // Query terminology:
        // SPLIT: d3.group()
        // DRILLDOWN: d3.group().get()
        // SPLIT+SUMMARIZE: d3.rollup()

        const titanicDataset = new dataset.Dataset( 'http://localhost:3000/TEPAIV/CPC/libraries/cpc/tests/dataset/titanic.csv', 'Name' )
        await titanicDataset.build()

        const datasetSummary = titanicDataset.summarize()


        expectTable( datasetSummary, `\
┌───────────────────┬──────────┬───────────────────────────────────────────────────────────────────────┐
│ (iteration index) │   Key    │                                Values                                 │
├───────────────────┼──────────┼───────────────────────────────────────────────────────────────────────┤
│         0         │ 'Ticket' │ Map(3) { '1st class' => 323, '2nd class' => 277, '3rd class' => 709 } │
│         1         │ 'Status' │              Map(2) { 'Died' => 809, 'Survived' => 500 }              │
│         2         │ 'Gender' │               Map(2) { 'Female' => 466, 'Male' => 843 }               │
└───────────────────┴──────────┴───────────────────────────────────────────────────────────────────────┘` )

    } )

    test( 'drilldownAndSummarize(): SUMMARIZE of all categories in the context of the drilled down data', async () => {

        // Query terminology:
        // SPLIT: d3.group()
        // DRILLDOWN: d3.group().get()
        // SPLIT+SUMMARIZE: d3.rollup()

        const titanicDataset = new dataset.Dataset( 'http://localhost:3000/TEPAIV/CPC/libraries/cpc/tests/dataset/titanic.csv', 'Name' )
        await titanicDataset.build()



        // DRILLDOWN, and then SPLIT+SUMMARIZE --- Zero depth (summary of initial/surface data without drilling down)
        const datasetSummary = titanicDataset.drilldownAndSummarize()

        expectTable( datasetSummary, `\
┌───────────────────┬──────────┬───────────────────────────────────────────────────────────────────────┐
│ (iteration index) │   Key    │                                Values                                 │
├───────────────────┼──────────┼───────────────────────────────────────────────────────────────────────┤
│         0         │ 'Ticket' │ Map(3) { '1st class' => 323, '2nd class' => 277, '3rd class' => 709 } │
│         1         │ 'Status' │              Map(2) { 'Died' => 809, 'Survived' => 500 }              │
│         2         │ 'Gender' │               Map(2) { 'Female' => 466, 'Male' => 843 }               │
└───────────────────┴──────────┴───────────────────────────────────────────────────────────────────────┘` )




        // DRILLDOWN, and then SPLIT+SUMMARIZE --- One category deep
        const femaleSubsetSummary = titanicDataset.drilldownAndSummarize( { 'Gender': 'Female' } )

        expectTable( femaleSubsetSummary, `\
┌───────────────────┬──────────┬───────────────────────────────────────────────────────────────────────┐
│ (iteration index) │   Key    │                                Values                                 │
├───────────────────┼──────────┼───────────────────────────────────────────────────────────────────────┤
│         0         │ 'Ticket' │ Map(3) { '1st class' => 144, '2nd class' => 106, '3rd class' => 216 } │
│         1         │ 'Status' │              Map(2) { 'Died' => 127, 'Survived' => 339 }              │
│         2         │ 'Gender' │                      Map(1) { 'Female' => 466 }                       │
└───────────────────┴──────────┴───────────────────────────────────────────────────────────────────────┘` )



        // DRILLDOWN, and then SPLIT+SUMMARIZE --- Two categories deep

        const femaleSurvivorsSubsetSummary =
            titanicDataset.drilldownAndSummarize( { 'Gender': 'Female' }, { 'Status': 'Survived' } )

        expectTable( femaleSurvivorsSubsetSummary, `\
┌───────────────────┬──────────┬──────────────────────────────────────────────────────────────────────┐
│ (iteration index) │   Key    │                                Values                                │
├───────────────────┼──────────┼──────────────────────────────────────────────────────────────────────┤
│         0         │ 'Ticket' │ Map(3) { '1st class' => 139, '2nd class' => 94, '3rd class' => 106 } │
│         1         │ 'Status' │                     Map(1) { 'Survived' => 339 }                     │
│         2         │ 'Gender' │                      Map(1) { 'Female' => 339 }                      │
└───────────────────┴──────────┴──────────────────────────────────────────────────────────────────────┘` )



        // DRILLDOWN, and then SPLIT+SUMMARIZE --- Three categories deep

        const firstClassFemaleSurvivorsSubsetSummary =
            titanicDataset.drilldownAndSummarize( { 'Gender': 'Female' }, { 'Status': 'Survived' }, { 'Ticket': '1st class' } )

        expectTable( firstClassFemaleSurvivorsSubsetSummary, `\
┌───────────────────┬──────────┬───────────────────────────────┐
│ (iteration index) │   Key    │            Values             │
├───────────────────┼──────────┼───────────────────────────────┤
│         0         │ 'Ticket' │ Map(1) { '1st class' => 139 } │
│         1         │ 'Status' │ Map(1) { 'Survived' => 139 }  │
│         2         │ 'Gender' │  Map(1) { 'Female' => 139 }   │
└───────────────────┴──────────┴───────────────────────────────┘` )

    } )


} )



//// Continuous Data ///////////////////////////////////////////////////////////////


describe( 'Handling continuous data', () => {


    //// Utility Methods ///////////////////////////////////////////////////////////////

    describe( 'Utility methods', () => {


        test( 'When number of quantiles is provided, the quantile cutoff points should be calculated', () => {

            const cutoffPointsForFourQuantiles = dataset.Dataset.calculateQuantileCutoffPercentages( 4 )
            expect( cutoffPointsForFourQuantiles ).toEqual( [ 0, 0.25, 0.5, 0.75, 1 ] )

            const cutoffPointsForThreeQuantiles = dataset.Dataset.calculateQuantileCutoffPercentages( 3 )
            expect( cutoffPointsForThreeQuantiles ).toEqual( [ 0, 0.33333333333333337, 0.6666666666666667, 1 ] )

            const cutoffPointsForFiveQuantiles = dataset.Dataset.calculateQuantileCutoffPercentages( 5 )
            expect( cutoffPointsForFiveQuantiles ).toEqual( [ 0, 0.2, 0.4, 0.6000000000000001, 0.8, 1 ] )

        } )


        test( 'Get names of continuous columns', async () => {

            const mixedDataset = new dataset.Dataset( 'http://localhost:3000/TEPAIV/CPC/libraries/cpc/tests/dataset/SampleMixedData.csv' )
            mixedDataset.initParams.transformContinuousColumnsToQuantiles = false
            await mixedDataset.build()

            expect( mixedDataset.getNamesOfContinuousColumns() ).toEqual( [ 'Neuroticism', 'Extraversion' ] )

        } )


        test( 'Calculate quantiles of a column', async () => {

            const mixedDataset = new dataset.Dataset( 'http://localhost:3000/TEPAIV/CPC/libraries/cpc/tests/dataset/SampleMixedData.csv' )
            mixedDataset.initParams.transformContinuousColumnsToQuantiles = false
            await mixedDataset.build()

            const neuroticismQuantileCutoffValues = mixedDataset.calculateQuantileCutoffValuesOfColumn( 'Neuroticism', 4 )
            const extraversionQuantileCutoffValues = mixedDataset.calculateQuantileCutoffValuesOfColumn( 'Extraversion', 4 )

            expect( neuroticismQuantileCutoffValues ).toEqual( [ 1.64583, 2.59375, 2.875, 3.114585, 3.875 ] )
            expect( extraversionQuantileCutoffValues ).toEqual( [ 2.52083, 3.28125, 3.47917, 3.65625, 4.41667 ] )

            // Confirm that the values are mathematically correct

            const neuroticismMin = d3.min( mixedDataset.data, d => d[ 'Neuroticism' ] )
            const neuroticismMedian = d3.median( mixedDataset.data, d => d[ 'Neuroticism' ] )
            const neuroticismMax = d3.max( mixedDataset.data, d => d[ 'Neuroticism' ] )

            const extraversionMin = d3.min( mixedDataset.data, d => d[ 'Extraversion' ] )
            const extraversionMedian = d3.median( mixedDataset.data, d => d[ 'Extraversion' ] )
            const extraversionMax = d3.max( mixedDataset.data, d => d[ 'Extraversion' ] )

            expect( neuroticismMin === String( neuroticismQuantileCutoffValues[ 0 ] ) ).toBeTruthy()  // d3 returns
                                                                                                      // string values
                                                                                                      // from d3.max
                                                                                                      // and d3.min
            expect( neuroticismMedian === neuroticismQuantileCutoffValues[ 2 ] ).toBeTruthy()
            expect( neuroticismMax === String( neuroticismQuantileCutoffValues[ 4 ] ) ).toBeTruthy()

            expect( extraversionMin === String( extraversionQuantileCutoffValues[ 0 ] ) ).toBeTruthy()
            expect( extraversionMedian === extraversionQuantileCutoffValues[ 2 ] ).toBeTruthy()
            expect( extraversionMax === String( extraversionQuantileCutoffValues[ 4 ] ) ).toBeTruthy()

        } )


        test( 'Calculate quantiles of a column if a column has many `0` values in it (previously, a bug) ', async () => {

            const mixedDataset = new dataset.Dataset(
                'http://localhost:3000/TEPAIV/CPC/libraries/cpc/tests/dataset/Covid19Geographic-Tiny.csv',
                [ 'dateRep', 'day', 'year', 'month', 'countriesAndTerritories', 'geoId', 'countryterritoryCode', 'popData2018' ]
            )
            mixedDataset.initParams.transformContinuousColumnsToQuantiles = true
            await mixedDataset.build()


            expect( mixedDataset.data ).toTabulateAs( `\
┌─────────┬───────────┬───────────┐
│ (index) │   cases   │  deaths   │
├─────────┼───────────┼───────────┤
│    0    │ '75-100%' │ '75-100%' │
│    1    │ '75-100%' │ '75-100%' │
│    2    │ '75-100%' │ '75-100%' │
│    3    │ '50-75%'  │ '75-100%' │
│    4    │ '75-100%' │ '75-100%' │
│    5    │ '75-100%' │ '75-100%' │
│    6    │ '75-100%' │ '75-100%' │
│    7    │ '75-100%' │ '75-100%' │
│    8    │ '75-100%' │ '75-100%' │
│    9    │ '75-100%' │ '75-100%' │
└─────────┴───────────┴───────────┘
˅˅˅ 40 more rows`, 0, 10 )


        } )


    } )



    test( 'When a dataset with continuous column(s) is initialized, continuous values should automatically be discretized using quantiles', async () => {

        const mixedDataset = new dataset.Dataset( 'http://localhost:3000/TEPAIV/CPC/libraries/cpc/tests/dataset/SampleMixedData.csv' )
        await mixedDataset.build()

        expect( mixedDataset.data ).toTabulateAs( `\
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
˅˅˅ 84 more rows`, 0, 15 )

    } )




    //// COVID-19 Dataset ///////////////////////////////////////////////////////////////

    describe( 'COVID-19 Dataset', () => {

        test( 'Detect continuous columns but do NOT transform them', async () => {

            const dataset_detectContinuousButDontTransform = new dataset.Dataset( 'http://localhost:3000/TEPAIV/CPC/libraries/cpc/tests/dataset/Covid19Geographic-Tiny.csv' )
            dataset_detectContinuousButDontTransform.initParams.transformContinuousColumnsToQuantiles = false

            await dataset_detectContinuousButDontTransform.build()


            expect( dataset_detectContinuousButDontTransform.data ).toTabulateAs( `\
┌─────────┬───────────┬──────┬───────┬────────┬────────┬────────┬─────────────────────────┬───────┬──────────────────────┬─────────────┐
│ (index) │  dateRep  │ day  │ month │  year  │ cases  │ deaths │ countriesAndTerritories │ geoId │ countryterritoryCode │ popData2018 │
├─────────┼───────────┼──────┼───────┼────────┼────────┼────────┼─────────────────────────┼───────┼──────────────────────┼─────────────┤
│    0    │ '4/11/20' │ '11' │  '4'  │ '2020' │ '1335' │ '115'  │      'Netherlands'      │ 'NL'  │        'NLD'         │ '17231017'  │
│    1    │ '4/10/20' │ '10' │  '4'  │ '2020' │ '1213' │ '148'  │      'Netherlands'      │ 'NL'  │        'NLD'         │ '17231017'  │
│    2    │ '4/9/20'  │ '9'  │  '4'  │ '2020' │ '969'  │ '147'  │      'Netherlands'      │ 'NL'  │        'NLD'         │ '17231017'  │
│    3    │ '4/8/20'  │ '8'  │  '4'  │ '2020' │ '777'  │ '234'  │      'Netherlands'      │ 'NL'  │        'NLD'         │ '17231017'  │
│    4    │ '4/7/20'  │ '7'  │  '4'  │ '2020' │ '952'  │ '101'  │      'Netherlands'      │ 'NL'  │        'NLD'         │ '17231017'  │
│    5    │ '4/6/20'  │ '6'  │  '4'  │ '2020' │ '1224' │ '115'  │      'Netherlands'      │ 'NL'  │        'NLD'         │ '17231017'  │
│    6    │ '4/5/20'  │ '5'  │  '4'  │ '2020' │ '904'  │ '164'  │      'Netherlands'      │ 'NL'  │        'NLD'         │ '17231017'  │
│    7    │ '4/4/20'  │ '4'  │  '4'  │ '2020' │ '1026' │ '148'  │      'Netherlands'      │ 'NL'  │        'NLD'         │ '17231017'  │
│    8    │ '4/3/20'  │ '3'  │  '4'  │ '2020' │ '1083' │ '166'  │      'Netherlands'      │ 'NL'  │        'NLD'         │ '17231017'  │
│    9    │ '4/2/20'  │ '2'  │  '4'  │ '2020' │ '1019' │ '134'  │      'Netherlands'      │ 'NL'  │        'NLD'         │ '17231017'  │
│   10    │ '4/1/20'  │ '1'  │  '4'  │ '2020' │ '845'  │ '175'  │      'Netherlands'      │ 'NL'  │        'NLD'         │ '17231017'  │
│   11    │ '3/31/20' │ '31' │  '3'  │ '2020' │ '884'  │  '93'  │      'Netherlands'      │ 'NL'  │        'NLD'         │ '17231017'  │
│   12    │ '3/30/20' │ '30' │  '3'  │ '2020' │ '1104' │ '132'  │      'Netherlands'      │ 'NL'  │        'NLD'         │ '17231017'  │
│   13    │ '3/29/20' │ '29' │  '3'  │ '2020' │ '1159' │  '93'  │      'Netherlands'      │ 'NL'  │        'NLD'         │ '17231017'  │
│   14    │ '3/28/20' │ '28' │  '3'  │ '2020' │ '1172' │ '112'  │      'Netherlands'      │ 'NL'  │        'NLD'         │ '17231017'  │
└─────────┴───────────┴──────┴───────┴────────┴────────┴────────┴─────────────────────────┴───────┴──────────────────────┴─────────────┘
˅˅˅ 35 more rows`, 0, 15 )


            // Without transformation, numerical categorical data is seen as continuous (addressed in tests /**/below)
            expect( dataset_detectContinuousButDontTransform.columnTypes ).toTabulateAs( `\
┌───────────────────┬───────────────────────────┬───────────────┐
│ (iteration index) │            Key            │    Values     │
├───────────────────┼───────────────────────────┼───────────────┤
│         0         │         'dateRep'         │ 'categorical' │
│         1         │           'day'           │ 'continuous'  │
│         2         │          'month'          │ 'continuous'  │
│         3         │          'year'           │ 'continuous'  │
│         4         │          'cases'          │ 'continuous'  │
│         5         │         'deaths'          │ 'continuous'  │
│         6         │ 'countriesAndTerritories' │ 'categorical' │
│         7         │          'geoId'          │ 'categorical' │
│         8         │  'countryterritoryCode'   │ 'categorical' │
│         9         │       'popData2018'       │ 'continuous'  │
└───────────────────┴───────────────────────────┴───────────────┘` )



        } )


        test( 'Detect continuous columns and transform them to quartiles', async () => {

            const dataset_detectContinuousAndTransform = new dataset.Dataset( 'http://localhost:3000/TEPAIV/CPC/libraries/cpc/tests/dataset/Covid19Geographic-Tiny.csv' )
            dataset_detectContinuousAndTransform.initParams.transformContinuousColumnsToQuantiles = true

            await dataset_detectContinuousAndTransform.build()

            expect( dataset_detectContinuousAndTransform.data ).toTabulateAs( `\
┌─────────┬───────────┬───────────┬───────────┬───────────┬───────────┬───────────┬─────────────────────────┬───────┬──────────────────────┬─────────────┐
│ (index) │  dateRep  │    day    │   month   │   year    │   cases   │  deaths   │ countriesAndTerritories │ geoId │ countryterritoryCode │ popData2018 │
├─────────┼───────────┼───────────┼───────────┼───────────┼───────────┼───────────┼─────────────────────────┼───────┼──────────────────────┼─────────────┤
│    0    │ '4/11/20' │ '25-50%'  │ '75-100%' │ '75-100%' │ '75-100%' │ '75-100%' │      'Netherlands'      │ 'NL'  │        'NLD'         │  '75-100%'  │
│    1    │ '4/10/20' │ '25-50%'  │ '75-100%' │ '75-100%' │ '75-100%' │ '75-100%' │      'Netherlands'      │ 'NL'  │        'NLD'         │  '75-100%'  │
│    2    │ '4/9/20'  │ '25-50%'  │ '75-100%' │ '75-100%' │ '75-100%' │ '75-100%' │      'Netherlands'      │ 'NL'  │        'NLD'         │  '75-100%'  │
│    3    │ '4/8/20'  │ '25-50%'  │ '75-100%' │ '75-100%' │ '50-75%'  │ '75-100%' │      'Netherlands'      │ 'NL'  │        'NLD'         │  '75-100%'  │
│    4    │ '4/7/20'  │ '25-50%'  │ '75-100%' │ '75-100%' │ '75-100%' │ '75-100%' │      'Netherlands'      │ 'NL'  │        'NLD'         │  '75-100%'  │
│    5    │ '4/6/20'  │  '0-25%'  │ '75-100%' │ '75-100%' │ '75-100%' │ '75-100%' │      'Netherlands'      │ 'NL'  │        'NLD'         │  '75-100%'  │
│    6    │ '4/5/20'  │  '0-25%'  │ '75-100%' │ '75-100%' │ '75-100%' │ '75-100%' │      'Netherlands'      │ 'NL'  │        'NLD'         │  '75-100%'  │
│    7    │ '4/4/20'  │  '0-25%'  │ '75-100%' │ '75-100%' │ '75-100%' │ '75-100%' │      'Netherlands'      │ 'NL'  │        'NLD'         │  '75-100%'  │
│    8    │ '4/3/20'  │  '0-25%'  │ '75-100%' │ '75-100%' │ '75-100%' │ '75-100%' │      'Netherlands'      │ 'NL'  │        'NLD'         │  '75-100%'  │
│    9    │ '4/2/20'  │  '0-25%'  │ '75-100%' │ '75-100%' │ '75-100%' │ '75-100%' │      'Netherlands'      │ 'NL'  │        'NLD'         │  '75-100%'  │
│   10    │ '4/1/20'  │  '0-25%'  │ '75-100%' │ '75-100%' │ '50-75%'  │ '75-100%' │      'Netherlands'      │ 'NL'  │        'NLD'         │  '75-100%'  │
│   11    │ '3/31/20' │ '75-100%' │ '75-100%' │ '75-100%' │ '50-75%'  │ '50-75%'  │      'Netherlands'      │ 'NL'  │        'NLD'         │  '75-100%'  │
│   12    │ '3/30/20' │ '75-100%' │ '75-100%' │ '75-100%' │ '75-100%' │ '75-100%' │      'Netherlands'      │ 'NL'  │        'NLD'         │  '75-100%'  │
│   13    │ '3/29/20' │ '75-100%' │ '75-100%' │ '75-100%' │ '75-100%' │ '50-75%'  │      'Netherlands'      │ 'NL'  │        'NLD'         │  '75-100%'  │
│   14    │ '3/28/20' │ '75-100%' │ '75-100%' │ '75-100%' │ '75-100%' │ '75-100%' │      'Netherlands'      │ 'NL'  │        'NLD'         │  '75-100%'  │
└─────────┴───────────┴───────────┴───────────┴───────────┴───────────┴───────────┴─────────────────────────┴───────┴──────────────────────┴─────────────┘
˅˅˅ 35 more rows`, 0, 15 )

            // All numeric data is now turned to categorical via quantilization. However, day, month, year, and
            // popData2018 are numerical categorical data, and should not have been treated as continuous data
            // (which is quantilized). This is addressed in the test(s) below.
            expect( dataset_detectContinuousAndTransform.columnTypes ).toTabulateAs( `\
┌───────────────────┬───────────────────────────┬───────────────┐
│ (iteration index) │            Key            │    Values     │
├───────────────────┼───────────────────────────┼───────────────┤
│         0         │         'dateRep'         │ 'categorical' │
│         1         │           'day'           │ 'categorical' │
│         2         │          'month'          │ 'categorical' │
│         3         │          'year'           │ 'categorical' │
│         4         │          'cases'          │ 'categorical' │
│         5         │         'deaths'          │ 'categorical' │
│         6         │ 'countriesAndTerritories' │ 'categorical' │
│         7         │          'geoId'          │ 'categorical' │
│         8         │  'countryterritoryCode'   │ 'categorical' │
│         9         │       'popData2018'       │ 'categorical' │
└───────────────────┴───────────────────────────┴───────────────┘` )


        } )


        test( `Force categorical data for columns with numeric categories`, async () => {

            /* When a dataset column is made of numeric category values (e.g., "1") and not numbers (e.g., 1) columns,
            these number strings should NOT be read as continuous data (and not quantilized)' */

            const dataset_detectContinuousForceCategoricalAndTransform = new dataset.Dataset( 'http://localhost:3000/TEPAIV/CPC/libraries/cpc/tests/dataset/Covid19Geographic-Tiny.csv' )
            dataset_detectContinuousForceCategoricalAndTransform.initParams.transformContinuousColumnsToQuantiles = true
            dataset_detectContinuousForceCategoricalAndTransform.initParams.forcedCategoricalColumns = [ 'dateRep', 'day', 'month', 'year' ]

            await dataset_detectContinuousForceCategoricalAndTransform.build()
            // expect( dataset_detectContinuousForceCategoricalAndTransform.getNamesOfContinuousColumns() ).toBe( `` )


            expect( dataset_detectContinuousForceCategoricalAndTransform.data ).toTabulateAs( `\
┌─────────┬───────────┬──────┬───────┬────────┬───────────┬───────────┬─────────────────────────┬───────┬──────────────────────┬─────────────┐
│ (index) │  dateRep  │ day  │ month │  year  │   cases   │  deaths   │ countriesAndTerritories │ geoId │ countryterritoryCode │ popData2018 │
├─────────┼───────────┼──────┼───────┼────────┼───────────┼───────────┼─────────────────────────┼───────┼──────────────────────┼─────────────┤
│    0    │ '4/11/20' │ '11' │  '4'  │ '2020' │ '75-100%' │ '75-100%' │      'Netherlands'      │ 'NL'  │        'NLD'         │  '75-100%'  │
│    1    │ '4/10/20' │ '10' │  '4'  │ '2020' │ '75-100%' │ '75-100%' │      'Netherlands'      │ 'NL'  │        'NLD'         │  '75-100%'  │
│    2    │ '4/9/20'  │ '9'  │  '4'  │ '2020' │ '75-100%' │ '75-100%' │      'Netherlands'      │ 'NL'  │        'NLD'         │  '75-100%'  │
│    3    │ '4/8/20'  │ '8'  │  '4'  │ '2020' │ '50-75%'  │ '75-100%' │      'Netherlands'      │ 'NL'  │        'NLD'         │  '75-100%'  │
│    4    │ '4/7/20'  │ '7'  │  '4'  │ '2020' │ '75-100%' │ '75-100%' │      'Netherlands'      │ 'NL'  │        'NLD'         │  '75-100%'  │
│    5    │ '4/6/20'  │ '6'  │  '4'  │ '2020' │ '75-100%' │ '75-100%' │      'Netherlands'      │ 'NL'  │        'NLD'         │  '75-100%'  │
│    6    │ '4/5/20'  │ '5'  │  '4'  │ '2020' │ '75-100%' │ '75-100%' │      'Netherlands'      │ 'NL'  │        'NLD'         │  '75-100%'  │
│    7    │ '4/4/20'  │ '4'  │  '4'  │ '2020' │ '75-100%' │ '75-100%' │      'Netherlands'      │ 'NL'  │        'NLD'         │  '75-100%'  │
│    8    │ '4/3/20'  │ '3'  │  '4'  │ '2020' │ '75-100%' │ '75-100%' │      'Netherlands'      │ 'NL'  │        'NLD'         │  '75-100%'  │
│    9    │ '4/2/20'  │ '2'  │  '4'  │ '2020' │ '75-100%' │ '75-100%' │      'Netherlands'      │ 'NL'  │        'NLD'         │  '75-100%'  │
│   10    │ '4/1/20'  │ '1'  │  '4'  │ '2020' │ '50-75%'  │ '75-100%' │      'Netherlands'      │ 'NL'  │        'NLD'         │  '75-100%'  │
│   11    │ '3/31/20' │ '31' │  '3'  │ '2020' │ '50-75%'  │ '50-75%'  │      'Netherlands'      │ 'NL'  │        'NLD'         │  '75-100%'  │
│   12    │ '3/30/20' │ '30' │  '3'  │ '2020' │ '75-100%' │ '75-100%' │      'Netherlands'      │ 'NL'  │        'NLD'         │  '75-100%'  │
│   13    │ '3/29/20' │ '29' │  '3'  │ '2020' │ '75-100%' │ '50-75%'  │      'Netherlands'      │ 'NL'  │        'NLD'         │  '75-100%'  │
│   14    │ '3/28/20' │ '28' │  '3'  │ '2020' │ '75-100%' │ '75-100%' │      'Netherlands'      │ 'NL'  │        'NLD'         │  '75-100%'  │
└─────────┴───────────┴──────┴───────┴────────┴───────────┴───────────┴─────────────────────────┴───────┴──────────────────────┴─────────────┘
˅˅˅ 35 more rows`, 0, 15 )

            expect( dataset_detectContinuousForceCategoricalAndTransform.columnTypes ).toTabulateAs( `\
┌───────────────────┬───────────────────────────┬───────────────┐
│ (iteration index) │            Key            │    Values     │
├───────────────────┼───────────────────────────┼───────────────┤
│         0         │         'dateRep'         │ 'categorical' │
│         1         │           'day'           │ 'categorical' │
│         2         │          'month'          │ 'categorical' │
│         3         │          'year'           │ 'categorical' │
│         4         │          'cases'          │ 'categorical' │
│         5         │         'deaths'          │ 'categorical' │
│         6         │ 'countriesAndTerritories' │ 'categorical' │
│         7         │          'geoId'          │ 'categorical' │
│         8         │  'countryterritoryCode'   │ 'categorical' │
│         9         │       'popData2018'       │ 'categorical' │
└───────────────────┴───────────────────────────┴───────────────┘` )


        } )

    } )




    test( 'If a Dataset is built without discretization, it should still be possible to call transformContinuousColumnsToQuantiles() method for discretizing the data after the built', async () => {

        const mixedDatasetWithoutDiscretization = new dataset.Dataset( 'http://localhost:3000/TEPAIV/CPC/libraries/cpc/tests/dataset/SampleMixedData.csv' )
        mixedDatasetWithoutDiscretization.initParams.transformContinuousColumnsToQuantiles = false
        await mixedDatasetWithoutDiscretization.build()

        expect( mixedDatasetWithoutDiscretization.data ).toTabulateAs( `\
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
˅˅˅ 84 more rows`, 0, 15 )

        mixedDatasetWithoutDiscretization.transformContinuousColumnsToQuantiles( 4, 1 )
        expect( mixedDatasetWithoutDiscretization.data ).toTabulateAs( `\
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
˅˅˅ 84 more rows`, 0, 15 )

    } )



    //// Preferences ///////////////////////////////////////////////////////////////

    describe( 'Preferences', () => {

        test( 'If specified during init, discretized categories should be named with Q1, Q2, etc instead of percentage ranges such as "25-50%" ', async () => {

            const myDataset = new dataset.Dataset( 'http://localhost:3000/TEPAIV/CPC/libraries/cpc/tests/dataset/SampleMixedData.csv' )
            myDataset.initParams.quantilesForContinuousColumns = [ 'Q1', 'Q2', 'Q3', 'Q4' ]
            await myDataset.build()

            expect( myDataset.data ).toTabulateAs( `\
┌─────────┬─────────────┬──────────────┬──────────┬───────────────┐
│ (index) │ Neuroticism │ Extraversion │  Gender  │ MonthMeasured │
├─────────┼─────────────┼──────────────┼──────────┼───────────────┤
│    0    │    'Q1'     │     'Q4'     │  'Male'  │   'January'   │
│    1    │    'Q2'     │     'Q1'     │  'Male'  │  'February'   │
│    2    │    'Q1'     │     'Q1'     │  'Male'  │    'March'    │
│    3    │    'Q4'     │     'Q2'     │ 'Female' │    'April'    │
│    4    │    'Q3'     │     'Q2'     │ 'Female' │     'May'     │
│    5    │    'Q1'     │     'Q2'     │  'Male'  │    'June'     │
│    6    │    'Q1'     │     'Q4'     │  'Male'  │    'July'     │
│    7    │    'Q1'     │     'Q3'     │  'Male'  │   'August'    │
│    8    │    'Q3'     │     'Q4'     │  'Male'  │  'September'  │
│    9    │    'Q2'     │     'Q3'     │  'Male'  │   'October'   │
│   10    │    'Q2'     │     'Q2'     │  'Male'  │  'November'   │
│   11    │    'Q1'     │     'Q4'     │  'Male'  │  'December'   │
│   12    │    'Q3'     │     'Q2'     │  'Male'  │   'January'   │
│   13    │    'Q4'     │     'Q1'     │  'Male'  │  'February'   │
│   14    │    'Q1'     │     'Q1'     │  'Male'  │    'March'    │
└─────────┴─────────────┴──────────────┴──────────┴───────────────┘
˅˅˅ 84 more rows`, 0, 15 )


        } )


        test( 'Order of quantiles should be as specified', async () => {


            const myDataset = new dataset.Dataset( 'http://localhost:3000/TEPAIV/CPC/libraries/cpc/tests/dataset/SampleMixedData.csv' )
            myDataset.initParams.quantilesForContinuousColumns = [ 'Q1', 'Q2', 'Q3', 'Q4' ]
            await myDataset.build()


            expect( myDataset.summary.get( 'Neuroticism' ) ).toTabulateAs( `\
┌───────────────────┬──────┬────────┐
│ (iteration index) │ Key  │ Values │
├───────────────────┼──────┼────────┤
│         0         │ 'Q1' │   25   │
│         1         │ 'Q2' │   23   │
│         2         │ 'Q3' │   26   │
│         3         │ 'Q4' │   25   │
└───────────────────┴──────┴────────┘` )


        } )

    } )

} )

