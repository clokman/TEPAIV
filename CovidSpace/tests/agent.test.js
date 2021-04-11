//// INSTANTIATE ///////////////////////////////////////////////////////////////

describe( 'Instantiate...', () => {

    test( 'With default parameters', () => {

        // Generate agent with default values
        const myAgent = new agent.Agent()

        expect( myAgent ).toBeDefined()
        expect( myAgent.object.x() ).toBe( 20 )
        expect( myAgent.object.y() ).toBe( 20 )
        expect( myAgent.object.fill() ).toBe( 'DodgerBlue' )

    } )

    test( 'With custom parameters', () => {

        // Generate agent with default values
        const myAgent = new agent.Agent(
            { x: 50, y: 50, fill: 'GoldenRod' }
        )

        expect( myAgent ).toBeDefined()
        expect( myAgent.object.x() ).toBe( 50 )
        expect( myAgent.object.y() ).toBe( 50 )
        expect( myAgent.object.fill() ).toBe( 'GoldenRod' )

    } )


} )



//// Move  ///////////////////////////////////////////////////////////////

describe( 'Move ', () => {


    test( 'moveBy', () => {

        initializeDomWithSvg()
        const myAgent = new agent.Agent()

        // Check initial position
        expect( myAgent.object.x() ).toBe( 20 )
        expect( myAgent.object.y() ).toBe( 20 )

        // Do the move
        myAgent.moveBy( { x: 10, y: 10 } )

        // Check position in JS
        expect( myAgent.object.x() ).toBe( 30 )
        expect( myAgent.object.y() ).toBe( 30 )

        // Check position on DOM
        const agentElement = document.querySelector( '.agent' )
        expect( agentElement.getAttribute( 'x' ) ).toBe( '30' )
        expect( agentElement.getAttribute( 'y' ) ).toBe( '30' )

    } )


    test( 'moveTo', () => {

        initializeDomWithSvg()
        const myAgent = new agent.Agent()

        // Check initial position
        expect( myAgent.object.x() ).toBe( 20 )
        expect( myAgent.object.y() ).toBe( 20 )

        // Do the move
        myAgent.moveTo( { x: 10, y: 10 } )

        // Check position in JS
        expect( myAgent.object.x() ).toBe( 10 )
        expect( myAgent.object.y() ).toBe( 10 )

        // Check position on DOM
        const agentElement = document.querySelector( '.agent' )
        expect( agentElement.getAttribute( 'x' ) ).toBe( '10' )
        expect( agentElement.getAttribute( 'y' ) ).toBe( '10' )



    } )

} )






