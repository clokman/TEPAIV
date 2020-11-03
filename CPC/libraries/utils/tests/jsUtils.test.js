//// IMPORTS SPECIFIC TO THIS TEST FILE ////////////////////////////////////////////////////////////////////////////////


//// TESTS /////////////////////////////////////////////////////////////////////////////////////////////////////////////


test( 'HAS TYPE: Return the type of an object', () => {

    const myNumber = 5

    expect( [ 'a', 'b', 'c' ].hasType() ).toBe( 'Array' )
    expect( new Map().hasType() ).toBe( 'Map' )
    expect( 'a'.hasType() ).toBe( 'String' )
    expect( myNumber.hasType() ).toBe( 'Number' )
    expect( false.hasType() ).toBe( 'Boolean' )
    expect( new container.Svg().hasType() ).toBe( 'Svg' )

} )


test( 'HAS TYPE: Compare the type of an object', () => {

    const myNumber = 5

    expect( [ 'a', 'b', 'c' ].hasType( 'Array' ) ).toBe( true )
    expect( new Map().hasType() ).toBe( 'Map' )
    expect( 'a'.hasType() ).toBe( 'String' )
    expect( myNumber.hasType() ).toBe( 'Number' )
    expect( false.hasType() ).toBe( 'Boolean' )
    expect( new container.Svg().hasType() ).toBe( 'Svg' )

} )

