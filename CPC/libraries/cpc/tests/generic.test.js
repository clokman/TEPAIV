//// IMPORTS SPECIFIC TO THIS TEST FILE ////////////////////////////////////////////////////////////////////////////////

const datasets = require( '../../../data/datasets' )



//// IMPORTING D3 //////////////////////////////////////////////////////////////////////////////////////////////////////


test( 'Different D3 modules should import OK', () => {

    // A method from d3.js
    const rangeTen = d3.range( 10 )
    expect( rangeTen ).toHaveLength( 10 )

    // A method from d3-array.js
    const minimum = d3.max( [10, 20] )
    expect( minimum ).toBe( 20 )

    // Another method from d3-array.js
    const rollupResult = d3.rollup( datasets.titanic, v => v.length )
    expect( rollupResult ).toBe( 1114 )

} )


//// PREVENT D3 TRANSITIONS FROM INTERRUPTING //////////////////////////////////////////////////////////////////////////

test( 'Should update position of element in DOM', async () => {

    // Disable d3 transitions
    d3.selection.prototype.duration = jest.fn( function () {return this} )
    d3.selection.prototype.transition = jest.fn( function () {return this} )


    const mySvg = new container.Svg()

    // Create rectangle
    const myRectangle = new shape.Rectangle()
    // Select the rectangle in DOM
    const rectangleElement = document.querySelector( 'rect' )

    // Check initial x property of rectangle object and actual position on DOM
    expect( myRectangle.x() ).toBe( 0 ) // object
    expect( rectangleElement.getAttribute( 'x' ) ).toBe( '0' )  // element

    // Update the x coordinate of the rectangle
    myRectangle.x( 300 ).update()

    // Check if the x property has changed and the rectangle indeed changed position
    expect( myRectangle.x() ).toBe( 300 )
    expect( rectangleElement.getAttribute( 'x' ) ).toBe( '300' )   /* THIS WOULD HAVE FAILED IF D3
                                                                                           TRANSITIONS WERE NOT
                                                                                           DISABLED */

} )