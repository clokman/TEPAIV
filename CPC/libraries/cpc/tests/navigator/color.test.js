//// IMPORTS SPECIFIC TO THIS TEST FILE ////////////////////////////////////////////////////////////////////////////////


// Navigator class of CPC //
const navigator = require( '../../navigator' )




//// TESTS /////////////////////////////////////////////////////////////////////////////////////////////////////////////

//// INIITALIZATION ////

test( 'LIST: List scheme sets and the schemes they contain', () => {

    expect( navigator.color ).toBeDefined()
    expect( navigator.color.schemeSets ).toTabulateAs( `\
┌─────────┬──────────────┬──────────────────────────────────────────────────────┐
│ (index) │      0       │                          1                           │
├─────────┼──────────────┼──────────────────────────────────────────────────────┤
│    0    │  'Titanic'   │ [ 'Purples', 'Inferno', 'PuBuGn', ... 3 more items ] │
│    1    │ 'Titanic-2'  │  [ 'Greys', 'Purples', 'Plasma', ... 3 more items ]  │
│    2    │   'Embark'   │ [ 'Greys', 'Inferno', 'Purples', ... 3 more items ]  │
│    3    │ 'Single-Hue' │  [ 'Purples', 'Blues', 'Greens', ... 3 more items ]  │
│    4    │ 'Multi-Hue'  │     [ 'RdPu', 'BuPu', 'PuBu', ... 9 more items ]     │
│    5    │   'Blues'    │                     [ 'Blues' ]                      │
│    6    │   'Greens'   │                     [ 'Greens' ]                     │
│    7    │   'Greys'    │                     [ 'Greys' ]                      │
│    8    │  'Oranges'   │                    [ 'Oranges' ]                     │
│    9    │  'Purples'   │                    [ 'Purples' ]                     │
└─────────┴──────────────┴──────────────────────────────────────────────────────┘
˅˅˅ NaN more rows`, 0, 10 )

} )




//// CIRCULAR INDEXING ////

test( 'CIRCULAR INDEXING: Circular scheme indexing and iteration', () => {

    // View color scheme sets
    expect( navigator.color.schemeSets ).toTabulateAs( `\
┌───────────────────┬────────────────────┬──────────────────────────────────────────────────────┐
│ (iteration index) │        Key         │                        Values                        │
├───────────────────┼────────────────────┼──────────────────────────────────────────────────────┤
│         0         │     'Titanic'      │ [ 'Purples', 'Inferno', 'PuBuGn', ... 3 more items ] │
│         1         │    'Titanic-2'     │  [ 'Greys', 'Purples', 'Plasma', ... 3 more items ]  │
│         2         │      'Embark'      │ [ 'Greys', 'Inferno', 'Purples', ... 3 more items ]  │
│         3         │    'Single-Hue'    │  [ 'Purples', 'Blues', 'Greens', ... 3 more items ]  │
│         4         │    'Multi-Hue'     │     [ 'RdPu', 'BuPu', 'PuBu', ... 9 more items ]     │
│         5         │      'Blues'       │                     [ 'Blues' ]                      │
│         6         │      'Greens'      │                     [ 'Greens' ]                     │
│         7         │      'Greys'       │                     [ 'Greys' ]                      │
│         8         │     'Oranges'      │                    [ 'Oranges' ]                     │
│         9         │     'Purples'      │                    [ 'Purples' ]                     │
│        10         │       'Reds'       │                      [ 'Reds' ]                      │
│        11         │       'BuGn'       │                      [ 'BuGn' ]                      │
│        12         │       'BuPu'       │                      [ 'BuPu' ]                      │
│        13         │       'GnBu'       │                      [ 'GnBu' ]                      │
│        14         │       'OrRd'       │                      [ 'OrRd' ]                      │
│        15         │      'PuBuGn'      │                     [ 'PuBuGn' ]                     │
│        16         │       'PuBu'       │                      [ 'PuBu' ]                      │
│        17         │       'PuRd'       │                      [ 'PuRd' ]                      │
│        18         │       'RdPu'       │                      [ 'RdPu' ]                      │
│        19         │       'RdGy'       │                      [ 'RdGy' ]                      │
│        20         │      'YlGnBu'      │                     [ 'YlGnBu' ]                     │
│        21         │       'YlGn'       │                      [ 'YlGn' ]                      │
│        22         │      'YlOrBr'      │                     [ 'YlOrBr' ]                     │
│        23         │      'YlOrRd'      │                     [ 'YlOrRd' ]                     │
│        24         │     'Viridis'      │                    [ 'Viridis' ]                     │
│        25         │     'Inferno'      │                    [ 'Inferno' ]                     │
│        26         │      'Magma'       │                     [ 'Magma' ]                      │
│        27         │       'Warm'       │                      [ 'Warm' ]                      │
│        28         │       'Cool'       │                      [ 'Cool' ]                      │
│        29         │ 'CubehelixDefault' │                [ 'CubehelixDefault' ]                │
│        30         │      'Plasma'      │                     [ 'Plasma' ]                     │
│        31         │     'Rainbow'      │                    [ 'Rainbow' ]                     │
│        32         │     'Sinebow'      │                    [ 'Sinebow' ]                     │
│        33         │     'Spectral'     │                    [ 'Spectral' ]                    │
└───────────────────┴────────────────────┴──────────────────────────────────────────────────────┘` )

    // Retrieve some color scheme names by index
    const firstSchemeOfSingleHueTheme = navigator.color.getChartSchemeBySchemeSetNameAndCircularIndex( 'Single-Hue', 0 )
    expect( firstSchemeOfSingleHueTheme ).toBe( 'Purples' )

    const thirdSchemeOfSingleHueTheme = navigator.color.getChartSchemeBySchemeSetNameAndCircularIndex( 'Single-Hue', 2 )
    expect( thirdSchemeOfSingleHueTheme ).toBe( 'Greens' )


    // Iterate through the schemes in a scheme set
    const schemeNamesInSingleHueSet = []

    const noOfSchemesInSingleHueSchemeSet = navigator.color.schemeSets.get( 'Single-Hue' ).length
    const limit = noOfSchemesInSingleHueSchemeSet + 5  // addition is to test circular indexing (index should be out of
                                                       // range)
    d3.range( limit ).forEach( i => {
        const schemeName = navigator.color.getChartSchemeBySchemeSetNameAndCircularIndex( 'Single-Hue', i )
        schemeNamesInSingleHueSet.push( schemeName )

    } )

    expect( schemeNamesInSingleHueSet ).toTabulateAs( `\
┌─────────┬───────────┐
│ (index) │  Values   │
├─────────┼───────────┤
│    0    │ 'Purples' │
│    1    │  'Blues'  │
│    2    │ 'Greens'  │
│    3    │ 'Oranges' │
│    4    │  'Greys'  │
│    5    │  'Reds'   │
│    6    │ 'Purples' │
│    7    │  'Blues'  │
│    8    │ 'Greens'  │
│    9    │ 'Oranges' │
│   10    │  'Greys'  │
└─────────┴───────────┘` )  // repetition is not an error; it shows that circular indexing works

} )




//// SCHEME NAME ==> D3 INTERPOLATOR ARGUMENT STRING ////

test( 'MAKE D3 ARGUMENT: Convert scheme name to D3 interpolator argument string', () => {

    // Iterate through the schemes in a scheme set
    const schemeNamesInSingleHueSet = []

    const noOfSchemesInSingleHueSchemeSet = navigator.color.schemeSets.get( 'Single-Hue' ).length
    const limit = noOfSchemesInSingleHueSchemeSet + 5  // addition is to test circular indexing (index should be out of
                                                       // range)
    d3.range( limit ).forEach( i => {
        const schemeName = navigator.color.getChartSchemeBySchemeSetNameAndCircularIndex( 'Single-Hue', i )
        schemeNamesInSingleHueSet.push( schemeName )

    } )

    expect( schemeNamesInSingleHueSet ).toTabulateAs( `\
┌─────────┬───────────┐
│ (index) │  Values   │
├─────────┼───────────┤
│    0    │ 'Purples' │
│    1    │  'Blues'  │
│    2    │ 'Greens'  │
│    3    │ 'Oranges' │
│    4    │  'Greys'  │
│    5    │  'Reds'   │
│    6    │ 'Purples' │
│    7    │  'Blues'  │
│    8    │ 'Greens'  │
│    9    │ 'Oranges' │
│   10    │  'Greys'  │
└─────────┴───────────┘` )  // repetition is not an error; it shows that circular indexing works


    // Convert scheme names to D3 interpolator arguments
    const interpolatorArgumentsForSingleHueSchemes = []
    schemeNamesInSingleHueSet.forEach( schemeName => {
        interpolatorArgument = navigator.color.convertColorSchemeNameToD3InterpolatorArgument( schemeName )
        interpolatorArgumentsForSingleHueSchemes.push( interpolatorArgument )
    } )

    expect( interpolatorArgumentsForSingleHueSchemes ).toTabulateAs( `\
┌─────────┬─────────────────────────┐
│ (index) │         Values          │
├─────────┼─────────────────────────┤
│    0    │ 'd3.interpolatePurples' │
│    1    │  'd3.interpolateBlues'  │
│    2    │ 'd3.interpolateGreens'  │
│    3    │ 'd3.interpolateOranges' │
│    4    │  'd3.interpolateGreys'  │
│    5    │  'd3.interpolateReds'   │
│    6    │ 'd3.interpolatePurples' │
│    7    │  'd3.interpolateBlues'  │
│    8    │ 'd3.interpolateGreens'  │
│    9    │ 'd3.interpolateOranges' │
│   10    │  'd3.interpolateGreys'  │
└─────────┴─────────────────────────┘` )  // repetition is not an error; it is a result of circular indexing

    const exampleColorScale = d3.scaleSequential()
        .domain( [ 1, 10 ] )  // palette size
        .interpolator( eval( interpolatorArgumentsForSingleHueSchemes[ 0 ] ) )  // palette

    // Values inside the domain are hue values that can be referred to in this way:
    expect( exampleColorScale( 1 ) ).toBe( 'rgb(252, 251, 253)' ) // full white
    expect( exampleColorScale( 7 ) ).toBe( 'rgb(121, 110, 178)' ) // hue step

} )




//// ERRORS ////

test( 'WRONG SCHEME SET REQUESTED: Wrong scheme set name during circular indexing should return error', () => {

    // Initialize

    // View color themes
    expect( navigator.color.schemeSets ).toTabulateAs( `\
┌─────────┬──────────────┬──────────────────────────────────────────────────────┐
│ (index) │      0       │                          1                           │
├─────────┼──────────────┼──────────────────────────────────────────────────────┤
│    0    │  'Titanic'   │ [ 'Purples', 'Inferno', 'PuBuGn', ... 3 more items ] │
│    1    │ 'Titanic-2'  │  [ 'Greys', 'Purples', 'Plasma', ... 3 more items ]  │
│    2    │   'Embark'   │ [ 'Greys', 'Inferno', 'Purples', ... 3 more items ]  │
│    3    │ 'Single-Hue' │  [ 'Purples', 'Blues', 'Greens', ... 3 more items ]  │
│    4    │ 'Multi-Hue'  │     [ 'RdPu', 'BuPu', 'PuBu', ... 9 more items ]     │
│    5    │   'Blues'    │                     [ 'Blues' ]                      │
│    6    │   'Greens'   │                     [ 'Greens' ]                     │
│    7    │   'Greys'    │                     [ 'Greys' ]                      │
└─────────┴──────────────┴──────────────────────────────────────────────────────┘
˅˅˅ NaN more rows`, 0, 8 )

    // Retrieve some color scheme names by index
    const firstSchemeOfSingleHueTheme = navigator.color.getChartSchemeBySchemeSetNameAndCircularIndex( 'Single-Hue', 0 )
    expect( firstSchemeOfSingleHueTheme ).toBe( 'Purples' )

    expect( () => {
        navigator.color.getChartSchemeBySchemeSetNameAndCircularIndex( 'WRONG-THEME-NAME', 0 )
    } ).toThrow( '\'WRONG-THEME-NAME\' is not as valid value. Expected values are: \'Titanic, Titanic-2, Embark, Single-Hue, Multi-Hue, Blues, Greens, Greys, Oranges, Purples, Reds, BuGn, BuPu, GnBu, OrRd, PuBuGn, PuBu, PuRd, RdPu, RdGy, YlGnBu, YlGn, YlOrBr, YlOrRd, Viridis, Inferno, Magma, Warm, Cool, CubehelixDefault, Plasma, Rainbow, Sinebow, Spectral\'.' )

    expect( () => {
        navigator.color.getChartSchemeBySchemeSetNameAndCircularIndex( 'Grays', 0 )
    } ).toThrow( '\'Grays\' is not as valid value. Expected values are: \'Titanic, Titanic-2, Embark, Single-Hue, Multi-Hue, Blues, Greens, Greys, Oranges, Purples, Reds, BuGn, BuPu, GnBu, OrRd, PuBuGn, PuBu, PuRd, RdPu, RdGy, YlGnBu, YlGn, YlOrBr, YlOrRd, Viridis, Inferno, Magma, Warm, Cool, CubehelixDefault, Plasma, Rainbow, Sinebow, Spectral\'.' ) // Should be 'Greys', not 'Gray'

    expect( () => {
        navigator.color.getChartSchemeBySchemeSetNameAndCircularIndex( 'greys', 0 )
    } ).toThrow( '\'greys\' is not as valid value. Expected values are: \'Titanic, Titanic-2, Embark, Single-Hue, Multi-Hue, Blues, Greens, Greys, Oranges, Purples, Reds, BuGn, BuPu, GnBu, OrRd, PuBuGn, PuBu, PuRd, RdPu, RdGy, YlGnBu, YlGn, YlOrBr, YlOrRd, Viridis, Inferno, Magma, Warm, Cool, CubehelixDefault, Plasma, Rainbow, Sinebow, Spectral\'.' ) // Should be 'Greys', not 'grey'
} )


