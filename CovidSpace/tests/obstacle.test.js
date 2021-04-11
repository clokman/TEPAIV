//// INSTANTIATE ///////////////////////////////////////////////////////////////

describe( 'Instantiate...', () => {

    test( 'With default parameters', () => {

        // Generate obstacle with default values
        const myObstacle = new obstacle.Obstacle()

        expect( myObstacle ).toBeDefined()
        expect( myObstacle.object.x() ).toBe( 20 )
        expect( myObstacle.object.y() ).toBe( 20 )
        expect( myObstacle.object.fill() ).toBe( 'LightGray' )

    } )

    test( 'With custom parameters', () => {

        // Generate obstacle with default values
        const myObstacle = new obstacle.Obstacle(
            { x: 50, y: 50, fill: 'GoldenRod' }
        )

        expect( myObstacle ).toBeDefined()
        expect( myObstacle.object.x() ).toBe( 50 )
        expect( myObstacle.object.y() ).toBe( 50 )
        expect( myObstacle.object.fill() ).toBe( 'GoldenRod' )

    } )


} )






