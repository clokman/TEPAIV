//// UNIT TESTS ////////////////////////////////////////////////////////////////////////////////////////////////////////


//// CHECK INSTANCE CLASS ////
test( 'Should return class name of instances', () => {


    mySvg = new container.Svg() // a random class


    // Second parameter is a class constructor

    expect( classUtils.isInstanceOf( 'my string', String ) )
        .toBe( true )
    expect( classUtils.isInstanceOf( 'my string', Number ) )
        .toBe( false )

    expect( classUtils.isInstanceOf( Number( 1 ), Number ) )
        .toBe( true )
    expect( classUtils.isInstanceOf( Number( 1 ), String ) )
        .toBe( false )

    expect( classUtils.isInstanceOf( mySvg, container.Svg ) )
        .toBe( true )
    expect( classUtils.isInstanceOf( mySvg, String ) )
        .toBe( false )


    // Second parameter is a string

    expect( classUtils.isInstanceOf( 'my string', 'String' ) )
        .toBe( true )
    expect( classUtils.isInstanceOf( 'my string', 'Number' ) )
        .toBe( false )

    expect( classUtils.isInstanceOf( Number( 1 ), 'Number' ) )
        .toBe( true )
    expect( classUtils.isInstanceOf( Number( 1 ), 'String' ) )
        .toBe( false )

    expect( classUtils.isInstanceOf( mySvg, 'Svg' ) )
        .toBe( true )
    expect( classUtils.isInstanceOf( mySvg, 'String' ) )
        .toBe( false )

} )



//// CHECK EXISTENCE INSTANCE PROPERTIES////

test( 'Should pass (return error) if an instance property does (not) exist', () => {

    class MyClass {
        constructor() {

            this.property1 = 0
            this.property2 = 1
            this.property3 = 'a'
            this.property4 = true
            this.property5 = false
            this.property6 = null
            // this.property7  // would throw error if uncommented

        }
    }




    const myInstance = new MyClass()

    // Should return error if a property is missing
    expect( () =>
        classUtils.requireProperties( myInstance, [ 'property1', 'a' ] )
    ).toThrow( 'Properties "a" do not exist in the provided MyClass instance.' )


    // Should return no error if all properties exist
    expect( classUtils.requireProperties( myInstance,
        [ 'property1', 'property2', 'property3', 'property4', 'property5', 'property6' ]
    ) ).toBe()

} )



//// Mixin ///////////////////////////////////////////////////////////////

describe( 'Mix-in Class', () => {

    test( 'mixInClass() method should enable multiple inheritance', () => {

        class ClassOne {
            constructor() {
            }


            returnOne() { return 1 }
        }




        class ClassTwo {
            constructor() {
            }


            returnTwo() { return 2 }
        }




        class MultiClass extends ClassOne.mixInClass( ClassTwo ) {
            constructor() {
                super()
            }


            returnSum() {
                return this.returnOne() + this.returnTwo()
            }
        }




        const multiClassObject = new MultiClass()


        expect( multiClassObject ).toBeDefined()
        expect( multiClassObject.returnOne() ).toBe( 1 )
        expect( multiClassObject.returnTwo() ).toBe( 2 )
        expect( multiClassObject.returnSum() ).toBe( 3 )


    } )

} )