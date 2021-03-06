//// TESTS /////////////////////////////////////////////////////////////////////////////////////////////////////////////




test( 'EQUIVALENCY: Value must be equal to the specified value', () => {

    // Validate against a value
    a = 2
    a.mustBe( 2 )


    // Error with default error message
    expect( () => {
        a.mustBe( 3 )
    } ).toThrow( 'The value of variable must be "3" but is "2".' )


    // Error with custom error message
    expect( () => {
        a.mustBe( 3, `${a} is smaller than 3.` )
    } ).toThrow( '2 is smaller than 3.' )


} )


test( 'VALIDATION: Value must be an element in an array', () => {

    // VALIDATE AGAINST AN ARRAY
    const acceptableParameters_array = [ 'a', 'b', 'c' ]

    // Valid value
    expect( () => {
        'a'.mustBeAnElementIn( acceptableParameters_array )
    } ).not.toThrow()

    // Invalid value
    expect( () => {
        'x'.mustBeAnElementIn( acceptableParameters_array )
    } ).toThrow( '\'x\' is not a valid value. Expected values are: \'a, b, c\'.' )

} )



test( 'VALIDATION: Value must be an key in a map', () => {

    // VALIDATE AGAINST A MAP (KEYS)
    const acceptableParameters_map = new Map()
        .set( 'cold', [ 'blue', 'green', 'teal' ] )
        .set( 'warm', [ 'orange', 'red', 'yellow' ] )

    // Valid value
    expect( () => {
        'cold'.mustBeAKeyIn( acceptableParameters_map )
    } ).not.toThrow()

    // Invalid value
    expect( () => {
        'hot'.mustBeAKeyIn( acceptableParameters_map )
    } ).toThrow( '\'hot\' is not as valid value. Expected values are: \'cold, warm\'.' )

} )



test( 'FORCE TYPE: Force a value to be of specified type', () => {

    // Acceptable type parameters are entered as both strings and instances (examples) of the expected class
    expect( () => {

        'a'.mustBeOfType( 'String' )
        'a'.mustBeOfType( String )

        // Dot notation following numbers is not possible
        // (e.g., `1.mustBeOfType` is not possible). Instead,
        // a number must first be assigned to a variable:
        const myNumber = 1
        myNumber.mustBeOfType( 'Number' )
        myNumber.mustBeOfType( Number )

        // Alternative way to use dot notation for a number:
        Number( 1 ).mustBeOfType( 'Number' )
        Number( 1 ).mustBeOfType( Number )


        const myFloatingNumber = 1.2  // in JS, there is no float type; all floats are numbers
        myFloatingNumber.mustBeOfType( 'Number' )
        myFloatingNumber.mustBeOfType( Number )

        false.mustBeOfType( 'Boolean' )
        false.mustBeOfType( Boolean )

        // Custom class
        new container.Svg().mustBeOfType( container.Svg )
        new container.Svg().mustBeOfType( 'Svg' )

    } ).not.toThrow()


    // Mismatches using primitives
    const aNumber = 1
    expect( () => { aNumber.mustBeOfType( 'String' ) } ).toThrow( `Type error: Expected the type 'String' but the value '1' has the type 'Number'.` )
    expect( () => { aNumber.mustBeOfType( String ) } ).toThrow( `Type error: Expected the type 'String' but the value '1' has the type 'Number'.` )

    expect( () => { false.mustBeOfType( 'String' ) } ).toThrow( `Type error: Expected the type 'String' but the value 'false' has the type 'Boolean'.` )
    expect( () => { false.mustBeOfType( 'Number' ) } ).toThrow( `Type error: Expected the type 'Number' but the value 'false' has the type 'Boolean'.` )

    expect( () => { 'a'.mustBeOfType( 'Number' ) } ).toThrow( `Type error: Expected the type 'Number' but the value 'a' has the type 'String'.` )
    expect( () => { 'a'.mustBeOfType( Number ) } ).toThrow( `Type error: Expected the type 'Number' but the value 'a' has the type 'String'.` )

    // Mismatches using a custom class
    expect( () => { new container.Svg().mustBeOfType( 'String' ) } ).toThrow( `Type error: Expected the type 'String' but the value '[object Object]' has the type 'Svg'.` )
    expect( () => { 'a'.mustBeOfType( container.Svg ) } ).toThrow( 'Type error: Expected the type \'Svg\' but the value \'a\' has the type \'String\'.' )

} )

