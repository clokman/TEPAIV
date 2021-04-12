//// SETUP ///////////////////////////////////////////////////////////////////

// Create SVG
const mySvg = new container.Svg()
mySvg
    .width( 1280 )
    .height( 960 )
    .update()

// Create background
const background = new shape.Rectangle()
timeStep.next( () => {
    background
        .x( 10 )
        .y( 10 )
        .width( 800 )
        .height( 600 )
        .fill( 'GhostWhite' )
        .stroke( 'Gray' )
        .update()
} )



//// CREATE OBSTACLES //////////////////////////////////////////////////////

const obstaclesData = [

    // Bottom shelf
    { x: 50, y: 585, width: 720, height: 25 },

    // Bottom left shelves
    { x: 90, y: 400, width: 280, height: 25 },
    { x: 90, y: 500, width: 280, height: 25 },

    // Bottom right shelves
    { x: 450, y: 400, width: 280, height: 25 },
    { x: 450, y: 500, width: 280, height: 25 },

    // Bottom vertical shelf
    { x: 20, y: 330, width: 25, height: 100 },

    // Middle row
    { x: 20, y: 300, width: 200, height: 25 },
    { x: 300, y: 300, width: 500, height: 25 },

    // Top vertical shelf
    { x: 10, y: 40, width: 50, height: 80 },

    // Upper left shelves
    { x: 80, y: 70, width: 300, height: 25 },
    { x: 80, y: 150, width: 280, height: 25 },
    { x: 80, y: 230, width: 280, height: 25 },

    // Upper right shelves
    { x: 450, y: 70, width: 280, height: 25 },
    { x: 450, y: 150, width: 280, height: 25 },
    { x: 450, y: 230, width: 280, height: 25 },

    // Top shelves
    { x: 10, y: 10, width: 400, height: 25 },
    { x: 420, y: 10, width: 390, height: 10 }

]

// Create the obstacles
obstaclesData.forEach( obstacleParameters => {
    new obstacle.Obstacle( obstacleParameters )
} )



// CREATE AGENTS ///////////////////////////////////////////////////////////
const agentsData = [
    // left agent
    { x: 20, y: 620 },
    { x: 800, y: 620 }

]

// Create the agents
agentsRegistry = new Map()

agentsData.forEach( (agentParameters, index)  => {
    const currentAgent = new agent.Agent( agentParameters )
    agentsRegistry.set(index, currentAgent)
} )

agentsRegistry.get(1).object.fill('FireBrick').update()

// MOVE AGENTS //////////////////////////////////////////////////////

timeStep.next(() => {
    agentsRegistry.get(0).moveBy( { x: 0, y: -100, duration: 2000 } )
    agentsRegistry.get(1).moveBy( { x: -50, y: -100, duration: 2000 } )
}, 1000)

timeStep.next(() => {
    agentsRegistry.get(0).moveBy( { x: 50, y: 0, duration: 2000 } )
    agentsRegistry.get(0).moveBy( { x: 0, y: -50, duration: 2000 } )
}, 2000 )

timeStep.next(() => {
    agentsRegistry.get(0).moveBy( { x: 0, y: -100, duration: 2000 } )
    agentsRegistry.get(1).moveBy( { x: 0, y: -150, duration: 2000 } )
}, 2000 )

timeStep.next(() => {
    agentsRegistry.get(0).moveBy( { x: 160, y: 0, duration: 4000 } )
    agentsRegistry.get(1).moveBy( { x: -500, y: -10, duration: 4000 } )
}, 3000 )

timeStep.next(() => {
    agentsRegistry.get(0).object.fill('FireBrick').update()
}, 5000 )

timeStep.next(() => {
    agentsRegistry.get(0).moveBy( { x: 500, y: 0, duration: 4000 } )
    agentsRegistry.get(1).moveBy( { x: 0, y: -70, duration: 2000 } )
}, 2000 )
