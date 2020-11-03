// Also see: `Notebooks/D3:Grouping and Summarizing (Nested) Data`


//// GROUP /////////////////////////////////////////////////////////////////////////////////////////////////////////////

test( 'SPLIT data into groups with d3.group()', () => {

    const titanicDataset = [
        { name: 'John', status: 'Survived', gender: 'Male', ticket: '1st class' },
        { name: 'Carla', status: 'Survived', gender: 'Female', ticket: '2nd class' },
        { name: 'Jane', status: 'Survived', gender: 'Female', ticket: '1st class' },
        { name: 'Gertrude', status: 'Survived', gender: 'Female', ticket: '1st class' },
        { name: 'Bobby', status: 'Survived', gender: 'Male', ticket: '2nd class' }
    ]

    expectTable( titanicDataset, `\
┌─────────┬────────────┬────────────┬──────────┬─────────────┐
│ (index) │    name    │   status   │  gender  │   ticket    │
├─────────┼────────────┼────────────┼──────────┼─────────────┤
│    0    │   'John'   │ 'Survived' │  'Male'  │ '1st class' │
│    1    │  'Carla'   │ 'Survived' │ 'Female' │ '2nd class' │
│    2    │   'Jane'   │ 'Survived' │ 'Female' │ '1st class' │
│    3    │ 'Gertrude' │ 'Survived' │ 'Female' │ '1st class' │
│    4    │  'Bobby'   │ 'Survived' │  'Male'  │ '2nd class' │
└─────────┴────────────┴────────────┴──────────┴─────────────┘` )

    // Divide data into two subgroups using group()
    const dataSplittedByGender = d3.group( titanicDataset, d => d[ 'gender' ] )
    expectTable( dataSplittedByGender, `\
┌───────────────────┬──────────┬──────────────────────────────────┐
│ (iteration index) │   Key    │              Values              │
├───────────────────┼──────────┼──────────────────────────────────┤
│         0         │  'Male'  │      [ [Object], [Object] ]      │
│         1         │ 'Female' │ [ [Object], [Object], [Object] ] │
└───────────────────┴──────────┴──────────────────────────────────┘` )

} )


test( 'DRILLDOWN with d3.group().get()', () => {

    const titanicDataset = [
        { name: 'John', status: 'Survived', gender: 'Male', ticket: '1st class' },
        { name: 'Carla', status: 'Survived', gender: 'Female', ticket: '2nd class' },
        { name: 'Jane', status: 'Survived', gender: 'Female', ticket: '1st class' },
        { name: 'Gertrude', status: 'Survived', gender: 'Female', ticket: '1st class' },
        { name: 'Bobby', status: 'Survived', gender: 'Male', ticket: '2nd class' }
    ]
    expectTable( titanicDataset, `\
┌─────────┬────────────┬────────────┬──────────┬─────────────┐
│ (index) │    name    │   status   │  gender  │   ticket    │
├─────────┼────────────┼────────────┼──────────┼─────────────┤
│    0    │   'John'   │ 'Survived' │  'Male'  │ '1st class' │
│    1    │  'Carla'   │ 'Survived' │ 'Female' │ '2nd class' │
│    2    │   'Jane'   │ 'Survived' │ 'Female' │ '1st class' │
│    3    │ 'Gertrude' │ 'Survived' │ 'Female' │ '1st class' │
│    4    │  'Bobby'   │ 'Survived' │  'Male'  │ '2nd class' │
└─────────┴────────────┴────────────┴──────────┴─────────────┘` )

    // Divide data into two subgroups using group().get() construct
    const femaleOnlySubsetOfData = d3.group( titanicDataset, d => d[ 'gender' ] )
        .get( 'Female' )

    expectTable( femaleOnlySubsetOfData, `\
┌─────────┬────────────┬────────────┬──────────┬─────────────┐
│ (index) │    name    │   status   │  gender  │   ticket    │
├─────────┼────────────┼────────────┼──────────┼─────────────┤
│    0    │  'Carla'   │ 'Survived' │ 'Female' │ '2nd class' │
│    1    │   'Jane'   │ 'Survived' │ 'Female' │ '1st class' │
│    2    │ 'Gertrude' │ 'Survived' │ 'Female' │ '1st class' │
└─────────┴────────────┴────────────┴──────────┴─────────────┘` )


    const maleOnlySubsetOfData = d3.group( titanicDataset, d => d[ 'gender' ] )
        .get( 'Male' )

    expectTable( maleOnlySubsetOfData, `\
┌─────────┬─────────┬────────────┬────────┬─────────────┐
│ (index) │  name   │   status   │ gender │   ticket    │
├─────────┼─────────┼────────────┼────────┼─────────────┤
│    0    │ 'John'  │ 'Survived' │ 'Male' │ '1st class' │
│    1    │ 'Bobby' │ 'Survived' │ 'Male' │ '2nd class' │
└─────────┴─────────┴────────────┴────────┴─────────────┘` )


} )


//// ROLLUP
// /////////////////////////////////////////////////////////////////////////////////////////////////////////////

test( 'SPLIT data to groups and COUNT the rows in new groups', () => {

    const titanicDataset = [
        { name: 'John', status: 'Survived', gender: 'Male', ticket: '1st class' },
        { name: 'Carla', status: 'Survived', gender: 'Female', ticket: '2nd class' },
        { name: 'Jane', status: 'Survived', gender: 'Female', ticket: '1st class' },
        { name: 'Gertrude', status: 'Survived', gender: 'Female', ticket: '1st class' },
        { name: 'Bobby', status: 'Survived', gender: 'Male', ticket: '2nd class' }
    ]
    expectTable( titanicDataset, `\
┌─────────┬────────────┬────────────┬──────────┬─────────────┐
│ (index) │    name    │   status   │  gender  │   ticket    │
├─────────┼────────────┼────────────┼──────────┼─────────────┤
│    0    │   'John'   │ 'Survived' │  'Male'  │ '1st class' │
│    1    │  'Carla'   │ 'Survived' │ 'Female' │ '2nd class' │
│    2    │   'Jane'   │ 'Survived' │ 'Female' │ '1st class' │
│    3    │ 'Gertrude' │ 'Survived' │ 'Female' │ '1st class' │
│    4    │  'Bobby'   │ 'Survived' │  'Male'  │ '2nd class' │
└─────────┴────────────┴────────────┴──────────┴─────────────┘` )

    // DIVIDE data into two subgroups using rollup(), and at the same time,
    // count the length each new group using `v.length`
    const dataDividedByGenderAndCountedInEachGroup =
        d3.rollup( titanicDataset, v => v.length, d => d[ 'gender' ] )

    expectTable( dataDividedByGenderAndCountedInEachGroup, `\
┌───────────────────┬──────────┬────────┐
│ (iteration index) │   Key    │ Values │
├───────────────────┼──────────┼────────┤
│         0         │  'Male'  │   2    │
│         1         │ 'Female' │   3    │
└───────────────────┴──────────┴────────┘` )

    // The same operation would return the reported number of rows if group() was used
    const dataSplittedByGender =
        d3.group( titanicDataset, d => d[ 'gender' ] )

    expectTable( dataSplittedByGender, `\
┌───────────────────┬──────────┬──────────────────────────────────┐
│ (iteration index) │   Key    │              Values              │
├───────────────────┼──────────┼──────────────────────────────────┤
│         0         │  'Male'  │      [ [Object], [Object] ]      │
│         1         │ 'Female' │ [ [Object], [Object], [Object] ] │
└───────────────────┴──────────┴──────────────────────────────────┘` )

} )


test( 'BREAKDOWN the DRILLED DOWN group by categories', () => {

    const titanicDataset = [
        { name: 'John', status: 'Survived', gender: 'Male', ticket: '1st class' },
        { name: 'Carla', status: 'Survived', gender: 'Female', ticket: '2nd class' },
        { name: 'Jane', status: 'Survived', gender: 'Female', ticket: '1st class' },
        { name: 'Gertrude', status: 'Survived', gender: 'Female', ticket: '1st class' },
        { name: 'Bobby', status: 'Survived', gender: 'Male', ticket: '2nd class' }
    ]
    expectTable( titanicDataset, `\
┌─────────┬────────────┬────────────┬──────────┬─────────────┐
│ (index) │    name    │   status   │  gender  │   ticket    │
├─────────┼────────────┼────────────┼──────────┼─────────────┤
│    0    │   'John'   │ 'Survived' │  'Male'  │ '1st class' │
│    1    │  'Carla'   │ 'Survived' │ 'Female' │ '2nd class' │
│    2    │   'Jane'   │ 'Survived' │ 'Female' │ '1st class' │
│    3    │ 'Gertrude' │ 'Survived' │ 'Female' │ '1st class' │
│    4    │  'Bobby'   │ 'Survived' │  'Male'  │ '2nd class' │
└─────────┴────────────┴────────────┴──────────┴─────────────┘` )


    // DRILLDOWN to females using group().get()
    const femaleSubset =
        d3.group( titanicDataset, d => d.gender ).get( 'Female' )

    expectTable( femaleSubset, `\
┌─────────┬────────────┬────────────┬──────────┬─────────────┐
│ (index) │    name    │   status   │  gender  │   ticket    │
├─────────┼────────────┼────────────┼──────────┼─────────────┤
│    0    │  'Carla'   │ 'Survived' │ 'Female' │ '2nd class' │
│    1    │   'Jane'   │ 'Survived' │ 'Female' │ '1st class' │
│    2    │ 'Gertrude' │ 'Survived' │ 'Female' │ '1st class' │
└─────────┴────────────┴────────────┴──────────┴─────────────┘` )


    // BREAKDOWN the DRILLED DOWN category by ticket
    const ticketCountsInFemaleSubset =
        d3.rollup( femaleSubset, v => v.length, d => d[ 'ticket' ] )

    expectTable( ticketCountsInFemaleSubset, `\
┌───────────────────┬─────────────┬────────┐
│ (iteration index) │     Key     │ Values │
├───────────────────┼─────────────┼────────┤
│         0         │ '2nd class' │   1    │
│         1         │ '1st class' │   2    │
└───────────────────┴─────────────┴────────┘` )


    // BREAKDOWN the DRILLDOWNED category by status
    const statusCountsInFemaleSubset =
        d3.rollup( femaleSubset, v => v.length, d => d[ 'status' ] )

    expectTable( statusCountsInFemaleSubset, `\
┌───────────────────┬────────────┬────────┐
│ (iteration index) │    Key     │ Values │
├───────────────────┼────────────┼────────┤
│         0         │ 'Survived' │   3    │
└───────────────────┴────────────┴────────┘` )

} )




test( 'Get a BREAKDOWN of all possible non-nested (level-0 / surface) categories', () => {

    const titanicDataset = [
        { name: 'John', status: 'Survived', gender: 'Male', ticket: '1st class' },
        { name: 'Carla', status: 'Survived', gender: 'Female', ticket: '2nd class' },
        { name: 'Jane', status: 'Survived', gender: 'Female', ticket: '1st class' },
        { name: 'Gertrude', status: 'Survived', gender: 'Female', ticket: '1st class' },
        { name: 'Bobby', status: 'Survived', gender: 'Male', ticket: '2nd class' }
    ]
    expectTable( titanicDataset, `\
┌─────────┬────────────┬────────────┬──────────┬─────────────┐
│ (index) │    name    │   status   │  gender  │   ticket    │
├─────────┼────────────┼────────────┼──────────┼─────────────┤
│    0    │   'John'   │ 'Survived' │  'Male'  │ '1st class' │
│    1    │  'Carla'   │ 'Survived' │ 'Female' │ '2nd class' │
│    2    │   'Jane'   │ 'Survived' │ 'Female' │ '1st class' │
│    3    │ 'Gertrude' │ 'Survived' │ 'Female' │ '1st class' │
│    4    │  'Bobby'   │ 'Survived' │  'Male'  │ '2nd class' │
└─────────┴────────────┴────────────┴──────────┴─────────────┘` )


    // BREAKDOWN by gender
    const genderBreakdown =
        d3.rollup( titanicDataset, v => v.length, d => d.gender )

    expectTable( genderBreakdown, `\
┌───────────────────┬──────────┬────────┐
│ (iteration index) │   Key    │ Values │
├───────────────────┼──────────┼────────┤
│         0         │  'Male'  │   2    │
│         1         │ 'Female' │   3    │
└───────────────────┴──────────┴────────┘` )


    // BREAKDOWN by ticket
    const ticketBreakdown =
        d3.rollup( titanicDataset, v => v.length, d => d.ticket )

    expectTable( ticketBreakdown, `\
┌───────────────────┬─────────────┬────────┐
│ (iteration index) │     Key     │ Values │
├───────────────────┼─────────────┼────────┤
│         0         │ '1st class' │   3    │
│         1         │ '2nd class' │   2    │
└───────────────────┴─────────────┴────────┘` )



    // BREAKDOWN by status
    const statusBreakdown =
        d3.rollup( titanicDataset, v => v.length, d => d.status )

    expectTable( statusBreakdown, `\
┌───────────────────┬────────────┬────────┐
│ (iteration index) │    Key     │ Values │
├───────────────────┼────────────┼────────┤
│         0         │ 'Survived' │   5    │
└───────────────────┴────────────┴────────┘` )


} )



test( 'Change the order of DRILLDOWN+BREAKDOWN results', () => {

    const titanicDataset = [
        { name: 'John', status: 'Survived', gender: 'Male', ticket: '1st class' },
        { name: 'Carla', status: 'Survived', gender: 'Female', ticket: '2nd class' },
        { name: 'Jane', status: 'Survived', gender: 'Female', ticket: '1st class' },
        { name: 'Gertrude', status: 'Survived', gender: 'Female', ticket: '1st class' },
        { name: 'Bobby', status: 'Survived', gender: 'Male', ticket: '2nd class' }
    ]
    expectTable( titanicDataset, `\
┌─────────┬────────────┬────────────┬──────────┬─────────────┐
│ (index) │    name    │   status   │  gender  │   ticket    │
├─────────┼────────────┼────────────┼──────────┼─────────────┤
│    0    │   'John'   │ 'Survived' │  'Male'  │ '1st class' │
│    1    │  'Carla'   │ 'Survived' │ 'Female' │ '2nd class' │
│    2    │   'Jane'   │ 'Survived' │ 'Female' │ '1st class' │
│    3    │ 'Gertrude' │ 'Survived' │ 'Female' │ '1st class' │
│    4    │  'Bobby'   │ 'Survived' │  'Male'  │ '2nd class' │
└─────────┴────────────┴────────────┴──────────┴─────────────┘` )

    // DIVIDE data into two subgroups using rollup(), and at the same time,
    // count the length each new group using `v.length`
    const results =
        d3.rollup( titanicDataset, v => v.length, d => d[ 'gender' ] )

    expectTable( results, `\
┌───────────────────┬──────────┬────────┐
│ (iteration index) │   Key    │ Values │
├───────────────────┼──────────┼────────┤
│         0         │  'Male'  │   2    │
│         1         │ 'Female' │   3    │
└───────────────────┴──────────┴────────┘` )

    desiredOrder = [ 'Female', 'Male' ]

    resultsAsArray = Array.from( results )

    customSortedResults = resultsAsArray.sort( ( a, b ) => {

        categoryNameA = a[ 0 ]
        categoryNameB = b[ 0 ]

        categoryNameAScore = 0.0
        categoryNameBScore = 0.0


        // Give a higher score for being early in the order of template array
        let i = 0
        desiredOrder.forEach( templateCategoryName => {

            if( categoryNameA === desiredOrder[ i ] ) {categoryNameAScore += 1 / i}
            if( categoryNameB === desiredOrder[ i ] ) {categoryNameAScore += 1 / i}
            i++

        } )

        if( categoryNameAScore < categoryNameBScore ) {return +1}
        if( categoryNameAScore > categoryNameBScore ) {return -1}

    } )

    resultsAsMapAgain = new Map( customSortedResults )

    expectTable( resultsAsMapAgain, `\
┌───────────────────┬──────────┬────────┐
│ (iteration index) │   Key    │ Values │
├───────────────────┼──────────┼────────┤
│         0         │ 'Female' │   3    │
│         1         │  'Male'  │   2    │
└───────────────────┴──────────┴────────┘` )

} )
