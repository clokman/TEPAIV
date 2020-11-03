//// SVG  ////
let mySvg = new container.Svg( 150000, 15000 )

const yCoordinateOfTestRow1 = 50
const yCoordinateOfTestRow2 = 600
const yCoordinateOfTestRow3 = 1150


//// HELPER METHODS ////

// Helper methods:
navigator.Panel.prototype.describe = function ( description ) {

    const descriptionObject = new shape.Text()
    descriptionObject
        .x( this.x() - this.bgExtensionLeft() )
        .y( this.y() - 20 )
        .text( `${description}` )
        .update()
}


const timeStep = {

    timeOfLastStep: 0,
    stepDuration: 1000,

    next: ( oneTimeCustomStepDuration ) => {
        const timeOfThisStep = ( oneTimeCustomStepDuration
                ? timeStep.timeOfLastStep + oneTimeCustomStepDuration
                : timeStep.timeOfLastStep + timeStep.stepDuration
        )
        timeStep.timeOfLastStep = timeOfThisStep
        return timeOfThisStep
    },

    reset: () => {
        timeStep.timeOfLastStep = 0
        timeStep.stepDuration = 1000
    }

}


//// PANEL ////////////////////////////////////////////////////////////////////////////////


const parentElementForPanel = d3.select( 'body' ).select( 'svg' )
myPanel = new navigator.Panel()
    .bgText( 'myPanel' )
    .bgFill( '#deebf7' )
    .x( 200 ).y( yCoordinateOfTestRow2 )
    .yAxisLabels( true )
    .build()

myPanel.yAxisLabels()


myPanel2 = new navigator.Panel()
    .bgText( 'myPanel2' )
    .bgFill( '#deebf7' )
    .x( 50 ).y( yCoordinateOfTestRow3 )
    .build()
myPanel2.objects( 'gender' ).colorScheme( 'Blues' ).update()
myPanel2.objects( 'class' ).colorScheme( 'RdPu' ).update()
myPanel2.objects( 'status' ).colorScheme( 'Oranges' ).update()


myPanel3 = new navigator.Panel()
    .bgText( 'myPanel3' )
    .bgFill( '#deebf7' )
    .x( 175 ).y( yCoordinateOfTestRow3 )
    .build()
myPanel3.objects( 'gender' ).colorScheme( 'YlGn' ).update()
myPanel3.objects( 'class' ).colorScheme( 'YlGnBu' ).update()
myPanel3.objects( 'status' ).colorScheme( 'BuPu' ).update()


myPanel4 = new navigator.Panel()
    .bgText( 'myPanel4' )
    .bgFill( '#deebf7' )
    .x( 300 ).y( yCoordinateOfTestRow3 )
    .build()
myPanel4.objects( 'gender' ).colorScheme( 'Greys' ).update()
myPanel4.objects( 'class' ).colorScheme( 'Greys' ).update()
myPanel4.objects( 'status' ).colorScheme( 'Greys' ).update()



//// NESTED PANEL ////

nestedPanel = new navigator.NestedPanel()
    .id( 'parent-panel' )
    .bgFill( '#deebf7' )
    .bgText( 'nestedPanel' )
    .colorSet( 'Viridis' )
    .x( 25 ).y( yCoordinateOfTestRow1 )
    .build()


// Embed child panel 1

spawnObjectForChild1 = nestedPanel.objects( 'gender' ).objects( 'female' )

childPanel1 = new navigator.NestedPanel( nestedPanel, spawnObjectForChild1 )
childPanel1
    .id( 'child-panel-1' )
    .bgText( 'child-panel-1' )
    .build()


// EMBED child panel 2

spawnObjectForChild2 = childPanel1.objects( 'gender' ).objects( 'male' )

setTimeout( () => {
    childPanel2 = new navigator.NestedPanel( childPanel1, spawnObjectForChild2 )
    childPanel2
        .id( 'child-panel-2' )
        .bgText( 'child-panel-2' )
        .build()

}, 1000 )


// REPLACE child panel 2 with child panel 3

spawnObjectForChild3 = childPanel1.objects( 'class' ).objects( 'first-class' )

setTimeout( () => {
    childPanel3 = new navigator.NestedPanel( childPanel1, spawnObjectForChild3 )
    childPanel3
        .id( 'child-panel-3' )
        .bgText( 'child-panel-3' )
        .build()

}, 2000 )


// REMOVE child panel 3
setTimeout( () => {

    childPanel3.remove()

}, 3000 )


// REMOVE child panel 1
setTimeout( () => {

    childPanel1.remove()

}, 4000 )


// Embed child panel 4

setTimeout( () => {

    spawnObjectForChild4 = nestedPanel.objects( 'status' ).objects( 'survived' )

    childPanel4 = new navigator.NestedPanel( nestedPanel, spawnObjectForChild4 )
    childPanel4
        .id( 'child-panel-4' )
        .bgText( 'child-panel-4' )
        .build()

}, 5000 )

setTimeout( () => {

    nestedPanel.colorSet( 'Magma' ).update()

}, 6000 )



// Embed child panel 5

setTimeout( () => {

    spawnObjectForChild5 = childPanel4.objects( 'status' ).objects( 'died' )

    childPanel5 = new navigator.NestedPanel( childPanel4, spawnObjectForChild5 )
    childPanel5
        .id( 'child-panel-5' )
        .bgText( 'child-panel-5' )
        .build()

}, 7000 )


// Embed child panel 6

setTimeout( () => {

    spawnObjectForChild6 = childPanel4.objects( 'gender' ).objects( 'female' )

    childPanel6 = new navigator.NestedPanel( childPanel4, spawnObjectForChild6 )
    childPanel6
        .id( 'child-panel-6' )
        .bgText( 'child-panel-6' )
        .build()

}, 8000 )

// Embed child panel 7

setTimeout( () => {

    spawnObjectForChild7 = childPanel4.objects( 'class' ).objects( 'first-class' )

    childPanel7 = new navigator.NestedPanel( childPanel4, spawnObjectForChild7 )
    childPanel7
        .id( 'child-panel-7' )
        .bgText( 'child-panel-7' )
        .build()

}, 9000 )


// Remove child panel 7
setTimeout( () => {

    childPanel7.remove()

}, 10000 )




//// PANEL: COMPARISON VIEW: Simple comparison ///////////////////////////////////////////////////

comparisonPanel = new navigator.NestedPanel()
    .bgFill( '#deebf7' )
    .bgText( 'comparisonPanel: Simple comparison' )
    .colorSet( 'Viridis' )
    .x( 650 ).y( yCoordinateOfTestRow1 )
    .yAxisLabels( true )
    .build()


spawnObjectForComparisonChild1 = comparisonPanel.objects( 'gender' ).objects( 'female' )

comparisonChild1 = new navigator.NestedPanel( comparisonPanel, spawnObjectForComparisonChild1 )
comparisonChild1
    .bgText( 'comp.Ch.1' )
    .build()


setTimeout( () => {
    spawnObjectForComparisonChild2 = comparisonPanel.objects( 'gender' ).objects( 'male' )

    comparisonChild2 = new navigator.NestedPanel( comparisonPanel, spawnObjectForComparisonChild2, 'sibling' )
    comparisonChild2
        .bgText( 'comp.Ch.2' )
        .build()

}, 1500 )


setTimeout( () => {

    spawnObjectForComparisonChild3 = comparisonPanel.objects( 'status' ).objects( 'died' )
    comparisonChild3 = new navigator.NestedPanel( comparisonPanel, spawnObjectForComparisonChild3, 'sibling' )
    comparisonChild3
        .bgText( 'comp.Ch.3' )
        .build()

}, 3500 )




//// PANEL: COMPARISON VIEW: REMOVALS ///////////////////////////////////////////////////

// Create panel 0
const p8_panel0_0 = new navigator.NestedPanel()
    .bgFill( '#deebf7' )
    .bgText( 'p8_panel0_0 (removals test)' )
    .x( 650 ).y( yCoordinateOfTestRow2 )
    .yAxisLabels( true )
    .build()

p8_panel0_0.describe( 'Removals' )

// Create panel-1-0
const spawnObjectForP8_panel1_0 = p8_panel0_0.objects( 'gender' ).objects( 'female' )
const p8_panel1_0 = new navigator.NestedPanel( p8_panel0_0, spawnObjectForP8_panel1_0 )
p8_panel1_0.build()

// Create panel-2-0
let carPanel2_0
setTimeout( () => {
    const spawnObjectForP8_panel2_0 = p8_panel1_0.objects( 'class' ).objects( 'first-class' )
    p8_panel2_0 = new navigator.NestedPanel( p8_panel1_0, spawnObjectForP8_panel2_0 )
    p8_panel2_0.build()
}, 1000 )


// Create panel-2-1
let p8_panel2_1
setTimeout( () => {
    const spawnObjectForCarPanel2_1 = p8_panel1_0.objects( 'class' ).objects( 'second-class' )
    p8_panel2_1 = new navigator.NestedPanel( p8_panel1_0, spawnObjectForCarPanel2_1, 'sibling' )
    p8_panel2_1.build()
}, 3000 )


let p8_panel2_2
setTimeout( () => {
    // Create panel-2-2
    const spawnObjectForP8_panel2_2 = p8_panel1_0.objects( 'class' ).objects( 'third-class' )
    p8_panel2_2 = new navigator.NestedPanel( p8_panel1_0, spawnObjectForP8_panel2_2, 'sibling' )
    p8_panel2_2.build()
}, 4000 )
setTimeout( () => {p8_panel2_1.remove()}, 5000 )
setTimeout( () => {p8_panel2_2.remove()}, 6000 )
setTimeout( () => {p8_panel2_0.remove()}, 7000 )
setTimeout( () => {p8_panel1_0.remove()}, 8000 )




//// PANEL: COMPARISON VIEW: Lateral switch in comparison view ///////////////////////////////////////////////////
timeStep.reset()
timeStep.stepDuration = 2000


compPan2 = new navigator.NestedPanel()
    .bgFill( '#deebf7' )
    .bgText( `compPan2: Lateral switch from comparison'  ` )
    .colorSet( 'Viridis' )
    .x( 1250 ).y( yCoordinateOfTestRow1 )
    .yAxisLabels( true )
    .build()

compPan2.describe( `'Lateral switch in comparison view: Died' category should NOT have buggy bridge at the end.` )

// Generation 1

// Gen 1 sibling 1

setTimeout( () => {

    spawnObjectForGen1sib1 = compPan2.objects( 'status' ).objects( 'died' )
    gen1sib1 = new navigator.NestedPanel( compPan2, spawnObjectForGen1sib1 )
    gen1sib1
        .bgText( 'gen1sib1' )
        .build()

}, timeStep.next() )


// Gen 1 sibling 2
setTimeout( () => {

    spawnObjectForGen1sib2 = compPan2.objects( 'status' ).objects( 'survived' )
    gen1sib2 = new navigator.NestedPanel( compPan2, spawnObjectForGen1sib2, 'sibling' )
    gen1sib2
        .bgText( 'gen1sib2' )
        .build()

}, timeStep.next() )



// TODO:
//   ISSUE: There is no animation when a 2nd generation singleton is created
// Gen 2 singleton 1
setTimeout( () => {

    spawnObjectForGen2sing1 = compPan2.objects( 'gender' ).objects( 'female' )
    gen2sing1 = new navigator.NestedPanel( compPan2, spawnObjectForGen2sing1 )
    gen2sing1
        .bgText( 'gen2sing1' )
        .build()

}, timeStep.next() )


// Generation 2 //

// Gen 2 sibling 1
setTimeout( () => {

    spawnObjectForGen2sib1 = compPan2.objects( 'status' ).objects( 'died' )
    gen2sib1 = new navigator.NestedPanel( compPan2, spawnObjectForGen2sib1 )
    gen2sib1
        .bgText( 'gen2sib1' )
        .build()

}, timeStep.next() )


// Gen 2 sibling 2
setTimeout( () => {

    spawnObjectForGen2sib2 = compPan2.objects( 'status' ).objects( 'survived' )
    gen2sib2 = new navigator.NestedPanel( compPan2, spawnObjectForGen2sib2, 'sibling' )
    gen2sib2
        .bgText( 'gen2sib2' )
        .build()

}, timeStep.next() )



// Gen 2 singleton 1
setTimeout( () => {

    spawnObjectForGen2sing2 = compPan2.objects( 'gender' ).objects( 'female' )
    gen2sing2 = new navigator.NestedPanel( compPan2, spawnObjectForGen2sing2 )
    gen2sing2
        .bgText( 'gen2sing2' )
        .build()

}, timeStep.next() )




//// COMPARISON VIEW: DEEP EXPANSION OF INNER SIBLING ///////////////////////////////////////////////////

timeStep.reset()
timeStep.stepDuration = 2000


// Panel 0-0


p7_panel0_0 = new navigator.NestedPanel()
    .bgFill( '#deebf7' )
    .colorSet( 'Viridis' )
    .bgText( `p7_panel0_0'  ` )
    .x( 1250 )
    .y( yCoordinateOfTestRow2 )
    .yAxisLabels( true )
    .build()

p7_panel0_0.describe( `'COMPARISON VIEW: DEEP EXPANSION OF INNER SIBLING: Outer sibling should move rightward and backgrounds should look correct in the end.` )



// Panel 1-0

setTimeout( () => {

    spawnObjectForP7_panel1_0 = p7_panel0_0.objects( 'status' ).objects( 'died' )
    P7_panel1_0 = new navigator.NestedPanel( p7_panel0_0, spawnObjectForP7_panel1_0 )
    P7_panel1_0
        .bgText( 'P7_panel1_0' )
        .build()

}, timeStep.next() )



// Panel 1-1

setTimeout( () => {

    spawnObjectForP7_panel1_1 = p7_panel0_0.objects( 'status' ).objects( 'survived' )
    P7_panel_1_1 = new navigator.NestedPanel( p7_panel0_0, spawnObjectForP7_panel1_1, 'sibling' )
    P7_panel_1_1
        .bgText( 'P7_panel_1_1' )
        .build()

}, timeStep.next() )


// Panel 1-0--1

setTimeout( () => {

    spawnObjectForP7_panel1_1 = P7_panel1_0.objects( 'status' ).objects( 'survived' )
    P7_panel_1_0__1 = new navigator.NestedPanel( P7_panel1_0, spawnObjectForP7_panel1_1 )
    P7_panel_1_0__1
        .bgText( 'P7_panel_1_0__1' )
        .build()

}, timeStep.next() )




//// PANEL: COMPARISON VIEW: Deep Expansions ///////////////////////////////////////////////////

timeStep.reset()
timeStep.stepDuration = 2000


panel9_0 = new navigator.NestedPanel()
    .bgFill( '#deebf7' )
    .bgText( `panel9_0: Deep expansions in comparison view'  ` )
    .colorSet( 'Viridis' )
    .x( 1900 ).y( yCoordinateOfTestRow1 )
    .yAxisLabels( true )
    .build()

panel9_0.describe( `'Expansion of outer panel should shrink previous panels properly, and not lead to extra right BG extension for the panel 0 background.` )


// Level 1 Comparisons

setTimeout( () => {

    spawnObjectForP9_Panel1_0 = panel9_0.objects( 'status' ).objects( 'died' )
    p9_panel1_0 = new navigator.NestedPanel( panel9_0, spawnObjectForP9_Panel1_0 )
    p9_panel1_0
        .bgText( 'p9_panel1_0' )
        .build()

}, timeStep.next() )


setTimeout( () => {

    spawnObjectForP9_Panel1_1 = panel9_0.objects( 'status' ).objects( 'survived' )
    p9_panel1_1 = new navigator.NestedPanel( panel9_0, spawnObjectForP9_Panel1_1, 'sibling' )
    p9_panel1_1
        .bgText( 'p9_panel1_1' )
        .build()

}, timeStep.next() )


// Deep Expansion: Outer

setTimeout( () => {

    spawnObjectForP9_Panel1_1__0 = p9_panel1_1.objects( 'gender' ).objects( 'female' )
    p9_panel1_1__0 = new navigator.NestedPanel( p9_panel1_1, spawnObjectForP9_Panel1_1__0 )
    p9_panel1_1__0
        .bgText( 'p9_panel1_1__0' )
        .build()

}, timeStep.next() )




//// PANEL: DEEP EXTENSIONS IN REGULAR VIEW ///////////////////////////////////////////////////
timeStep.reset()

// Create panel 0
const p10_panel0_0 = new navigator.NestedPanel()
    .bgFill( '#deebf7' )
    .bgText( 'p10_panel0_0' )
    .x( 2750 ).y( yCoordinateOfTestRow1 )
    .yAxisLabels( true )
    .build()

p10_panel0_0.describe( 'DEEP EXTENSION: Backgrounds should look OK after adding many children panels' )


// // Create panel-1-0
const spawnObjectForP10_Panel1_0 = p10_panel0_0.objects( 'gender' ).objects( 'female' )
const p10_panel1_0 = new navigator.NestedPanel( p10_panel0_0, spawnObjectForP10_Panel1_0 )
p10_panel1_0
    .bgText( 'p10_panel1_0' )
    .build()

// Create panel-2-0
let p10_panel2_0
setTimeout( () => {
    const spawnObjectForP10_Panel2_0 = p10_panel1_0.objects( 'class' ).objects( 'first-class' )
    p10_panel2_0 = new navigator.NestedPanel( p10_panel1_0, spawnObjectForP10_Panel2_0 )
    p10_panel2_0
        .bgText( 'p10_panel2_0' )
        .build()
}, timeStep.next() )


// Create panel-3-0
let p10_panel3_0
setTimeout( () => {
    const spawnObjectForP10_Panel3_0 = p10_panel2_0.objects( 'class' ).objects( 'second-class' )
    p10_panel3_0 = new navigator.NestedPanel( p10_panel2_0, spawnObjectForP10_Panel3_0 )
    p10_panel3_0
        .bgText( 'p10_panel3_0' )
        .build()
}, timeStep.next() )




//// PANEL: COMPARISON VIEW: BACKGROUNDS ///////////////////////////////////////////////////

timeStep.reset()
timeStep.stepDuration = 2000

// Create panel-0-0
const p11_panel0_0 = new navigator.NestedPanel()
    .bgFill( '#deebf7' )
    .bgText( 'p11_panel0_0' )
    .x( 2750 ).y( yCoordinateOfTestRow2 )
    .yAxisLabels( true )
    .bgText( 'p11_panel0_0' )
    .build()


p11_panel0_0.describe( 'COMPARISON VIEW: BACKGROUNDS: Backgrounds should look OK in the end.' )


// Create panel-1-0
const spawnObjectForP11_Panel1_0 = p11_panel0_0.objects( 'gender' ).objects( 'female' )
const p11_panel1_0 = new navigator.NestedPanel( p11_panel0_0, spawnObjectForP11_Panel1_0 )
p11_panel1_0
    .bgText( 'p11_panel1_0' )
    .build()


// Create panel-2-0
let p11_panel2_0
setTimeout( () => {
    const spawnObjectForP11_panel2_0 = p11_panel1_0.objects( 'class' ).objects( 'first-class' )
    p11_panel2_0 = new navigator.NestedPanel( p11_panel1_0, spawnObjectForP11_panel2_0 )
    p11_panel2_0
        .bgText( 'p11_panel2_0' )
        .build()
}, timeStep.next() )


// Create panel-2-1
let p11_panel2_1
setTimeout( () => {
    const spawnObjectForP11_panel2_1 = p11_panel1_0.objects( 'class' ).objects( 'second-class' )
    p11_panel2_1 = new navigator.NestedPanel( p11_panel1_0, spawnObjectForP11_panel2_1, 'sibling' )
    p11_panel2_1
        .bgText( 'p11_panel2_1' )
        .build()
}, timeStep.next() )

// // Create panel-2-2
// let p11_panel2_2
// setTimeout( () => {
//     const spawnObjectForP11_panel2_2 = p11_panel1_0.objects('class').objects('third-class')
//     p11_panel2_2 = new navigator.NestedPanel(p11_panel1_0, spawnObjectForP11_panel2_2, 'sibling')
//     p11_panel2_2
//         .bgText( 'p11_panel2_2' )
//         .build()
// }, timeStep.next() )


//// PANEL: LOAD DATASET ///////////////////////////////////////////////////
timeStep.reset()
timeStep.stepDuration = 3000


// Create panel 0
const p12_panel0_0 = new navigator.NestedPanel()
    .bgFill( '#deebf7' )
    .bgText( 'p12_panel0_0' )
    .x( 3500 ).y( yCoordinateOfTestRow1 )
    .yAxisLabels( true )
    .build()

setTimeout( async () => {
    await p12_panel0_0.summarizeDataset(
        'http://localhost:3000/libraries/cpc/tests/dataset/titanicTiny.csv',
        'Name' )
    p12_panel0_0.update()
}, timeStep.next() )

setTimeout( async () => {
    await p12_panel0_0.summarizeDataset(
        'http://localhost:3000/libraries/cpc/tests/dataset/BigFivePersonalityTraits-Small.csv',
        'Name' )
    p12_panel0_0.update()
}, timeStep.next() )

// setTimeout( async () => {
//     await p12_panel0_0.summarizeDataset(
//         'http://localhost:3000/libraries/cpc/tests/dataset/titanicTiny.csv',
//         'Name')
//     p12_panel0_0.update()
// }, timeStep.next() )

// setTimeout( async () => {
//     await p12_panel0_0.summarizeDataset(
//         'http://localhost:3000/libraries/cpc/tests/dataset/SampleMixedData.csv',
//         'Name')
//     p12_panel0_0.update()
// }, timeStep.next() )


p12_panel0_0.describe( 'LOAD DATA: Should load a few datasets in tandem and update category proportions each time' )




//// PANEL: ABSOLUTE CHART WIDTHS ///////////////////////////////////////////////////

timeStep.reset()
timeStep.stepDuration = 2000

// Create panel-0-0
const p14_panel0_0 = new navigator.NestedPanel()
    .bgFill( '#deebf7' )
    .bgText( 'p14_panel0_0' )
    .x( 4250 )
    .y( yCoordinateOfTestRow1 )
    .yAxisLabels( true )
    .bgText( 'p14_panel0_0' )
    .animationDuration( 3000 )
    .showAbsoluteChartWidths( true )
    .build()


p14_panel0_0.describe( 'INITIATE WITH ABSOLUTE WIDTHS: Panel edges and backgrounds should look OK in the end.' )

setTimeout( async () => {
    // Create panel-1-0
    const spawnObjectForP14_Panel1_0 = p14_panel0_0.objects( 'gender' ).objects( 'female' )
    const p14_panel1_0 = new navigator.NestedPanel( p14_panel0_0, spawnObjectForP14_Panel1_0 )

    // Summarize a dataset in panel0
    await p14_panel1_0
        .summarizeDataset(
            'http://localhost:3000/libraries/cpc/tests/dataset/titanicTiny.csv',
            'Name'
        )
    p14_panel1_0
        .bgText( 'p14_panel1_0' )
        // .showAbsoluteChartWidths(true)
        .build()

}, timeStep.next() )
