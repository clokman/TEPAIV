// Import navigator
const navigator = require( '../../CPC/libraries/cpc/navigator' )

//// TESTS /////////////////////////////////////////////////////////////////////////////////////////////////////////////

test( 'Event delegation with D3 selectAll (listen all, filter later)', async () => {

    // Clear JEST's DOM to prevent leftovers from previous tests
    document.body.innerHTML = ''
    // Create SVG
    const mySvg = new container.Svg()
    // Create Navigator object
    const myNavigator = new navigator.Navigator()
    // Load a dataset into the navigator
    await myNavigator.loadDataset(
        'http://localhost:3000/TEPAIV/CPC/libraries/cpc/tests/dataset/titanicSmall.csv',
        [ 'Name' ]
    )
    myNavigator.update()


    d3.selectAll( '*' ).on( 'click', ( d, i, g ) => {

        const clickedElement = g[ i ]
        const clickedElementClass = g[ i ].getAttribute( 'class' )

        if( clickedElementClass === 'background' ) {
            console.log( 'Clicked on a background' )
        }

        if( clickedElementClass === 'category' ) {
            console.log( 'Clicked on a category' )
        }

    } )

    // writeDomToFile('/Users/jlokman/Projects/Code/TEPAIV/Learning Tests/d3/jest-dom-1.html')

    // Click on a background
    clearConsoleHistory()
    domUtils.simulateClickOn( '.background' )
    expectConsoleHistory( 'Clicked on a background' )

    // Click on a category
    clearConsoleHistory()
    domUtils.simulateClickOn( '.category' )
    expectConsoleHistory( 'Clicked on a category' )



} )