//// SVG  ////
let mySvg = new container.Svg(15000, 15000)

const yCoordinateOfTestRow1 = 50
const yCoordinateOfTestRow2 = 600
const yCoordinateOfTestRow3 = 1150


//// HELPER METHODS ////

// Helper methods:
navigator.Panel.prototype.describe = function(description) {

    const descriptionObject = new shape.Text()
    descriptionObject
        .x(this.x() - this.bgExtensionLeft())
        .text(`${description}`)
        .update()
}


const timeStep = {

    timeOfLastStep: 0,
    stepDuration: 1000,

    next: (oneTimeCustomStepDuration) => {
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


const parentElementForPanel = d3.select('body').select('svg')
myPanel = new navigator.Panel()
    .bgText('myPanel')
    .bgFill('#deebf7')
    .x(200).y(yCoordinateOfTestRow2)
    .yAxisLabels(true)
    .update()

myPanel.yAxisLabels()


myPanel2 = new navigator.Panel()
    .bgText('myPanel2')
    .bgFill('#deebf7')
    .x(50).y(yCoordinateOfTestRow3)
    .update()
myPanel2.objects('gender').colorScheme('Blues').update()
myPanel2.objects('class').colorScheme('RdPu').update()
myPanel2.objects('status').colorScheme('Oranges').update()


myPanel3 = new navigator.Panel()
    .bgText('myPanel3')
    .bgFill('#deebf7')
    .x(175).y(yCoordinateOfTestRow3)
    .update()
myPanel3.objects('gender').colorScheme('YlGn').update()
myPanel3.objects('class').colorScheme('YlGnBu').update()
myPanel3.objects('status').colorScheme('BuPu').update()


myPanel4 = new navigator.Panel()
    .bgText('myPanel4')
    .bgFill('#deebf7')
    .x(300).y(yCoordinateOfTestRow3)
    .update()
myPanel4.objects('gender').colorScheme('Greys').update()
myPanel4.objects('class').colorScheme('Greys').update()
myPanel4.objects('status').colorScheme('Greys').update()



//// NESTED PANEL ////

nestedPanel = new navigator.NestedPanel()
    .id('parent-panel')
    .bgFill('#deebf7')
    .bgText('nestedPanel')
    .colorSet('Viridis')
    .x(25).y(yCoordinateOfTestRow1)
    .update(0)


// Embed child panel 1

spawnObjectForChild1 = nestedPanel.objects('gender').objects('female')

childPanel1 = new navigator.NestedPanel(nestedPanel, spawnObjectForChild1)
childPanel1
    .id('child-panel-1')
    .bgText('child-panel-1')
    .update()


// EMBED child panel 2

spawnObjectForChild2 = childPanel1.objects('gender').objects('male')

setTimeout(() => {
    childPanel2 = new navigator.NestedPanel(childPanel1, spawnObjectForChild2)
    childPanel2
        .id('child-panel-2')
        .bgText('child-panel-2')
        .update()

},1000)


// REPLACE child panel 2 with child panel 3

spawnObjectForChild3 = childPanel1.objects('class').objects('first-class')

setTimeout(() => {
    childPanel3 = new navigator.NestedPanel(childPanel1, spawnObjectForChild3)
    childPanel3
        .id('child-panel-3')
        .bgText('child-panel-3')
        .update()

},2000)


// REMOVE child panel 3
setTimeout( () => {

    childPanel3.remove()

}, 3000)


// REMOVE child panel 1
setTimeout( () => {

    childPanel1.remove()

}, 4000)


// Embed child panel 4

setTimeout( () => {

    spawnObjectForChild4 = nestedPanel.objects('status').objects('survived')

    childPanel4 = new navigator.NestedPanel(nestedPanel, spawnObjectForChild4)
    childPanel4
        .id('child-panel-4')
        .bgText('child-panel-4')
        .update()

}, 5000)

setTimeout( () => {

    nestedPanel.colorSet('Magma').update()

}, 6000)



// Embed child panel 5

setTimeout( () => {

    spawnObjectForChild5 = childPanel4.objects('status').objects('died')

    childPanel5 = new navigator.NestedPanel(childPanel4, spawnObjectForChild5)
    childPanel5
        .id('child-panel-5')
        .bgText('child-panel-5')
        .update()

}, 7000)


// Embed child panel 6

setTimeout( () => {

    spawnObjectForChild6 = childPanel4.objects('gender').objects('female')

    childPanel6 = new navigator.NestedPanel(childPanel4, spawnObjectForChild6)
    childPanel6
        .id('child-panel-6')
        .bgText('child-panel-6')
        .update()

}, 8000)

// Embed child panel 7

setTimeout( () => {

    spawnObjectForChild7 = childPanel4.objects('class').objects('first-class')

    childPanel7 = new navigator.NestedPanel(childPanel4, spawnObjectForChild7)
    childPanel7
        .id('child-panel-7')
        .bgText('child-panel-7')
        .update()

}, 9000)


// Remove child panel 7
setTimeout( () => {

    childPanel7.remove()

}, 10000)






//// PANEL: COMPARISON VIEW: Simple comparison ///////////////////////////////////////////////////

comparisonPanel = new navigator.NestedPanel()
    .bgFill('#deebf7')
    .bgText('comparisonPanel: Simple comparison')
    .colorSet('Viridis')
    .x(650).y(yCoordinateOfTestRow1)
    .yAxisLabels(true)
    .update(0)


spawnObjectForComparisonChild1 = comparisonPanel.objects('gender').objects('female')

comparisonChild1 = new navigator.NestedPanel(comparisonPanel, spawnObjectForComparisonChild1)
comparisonChild1
    .bgText('comp.Ch.1')
    .update()


setTimeout( () => {
    spawnObjectForComparisonChild2 = comparisonPanel.objects('gender').objects('male')

    comparisonChild2 = new navigator.NestedPanel(comparisonPanel, spawnObjectForComparisonChild2, 'sibling')
    comparisonChild2
        .bgText('comp.Ch.2')
        .update()

}, 1500)


setTimeout( () => {

    spawnObjectForComparisonChild3 = comparisonPanel.objects('status').objects('died')
    comparisonChild3 = new navigator.NestedPanel(comparisonPanel, spawnObjectForComparisonChild3, 'sibling')
    comparisonChild3
        .bgText('comp.Ch.3')
        .update()

}, 3500)






//// PANEL: COMPARISON VIEW: Lateral switch in comparison view ///////////////////////////////////////////////////
timeStep.reset()
timeStep.stepDuration = 2000


compPan2 = new navigator.NestedPanel()
    .bgFill('#deebf7')
    .bgText(`compPan2: Lateral switch from comparison'  `)
    .colorSet('Viridis')
    .x(1250).y(yCoordinateOfTestRow1)
    .yAxisLabels(true)
    .update(0)

compPan2.describe(`'Lateral switch in comparison view: Died' category should NOT have buggy bridge at the end.`);

// Generation 1

// Gen 1 sibling 1

setTimeout( () => {

    spawnObjectForGen1sib1 = compPan2.objects('status').objects('died')
    gen1sib1 = new navigator.NestedPanel(compPan2, spawnObjectForGen1sib1)
    gen1sib1
        .bgText('gen1sib1')
        .update(500)

}, timeStep.next() )


// Gen 1 sibling 2
setTimeout( () => {

    spawnObjectForGen1sib2 = compPan2.objects('status').objects('survived')
    gen1sib2 = new navigator.NestedPanel(compPan2, spawnObjectForGen1sib2, 'sibling')
    gen1sib2
        .bgText('gen1sib2')
        .update(500)

}, timeStep.next() )



// TODO:
//   ISSUE: There is no animation when a 2nd generation singleton is created
// Gen 2 singleton 1
setTimeout( () => {

    spawnObjectForGen2sing1 = compPan2.objects('gender').objects('female')
    gen2sing1 = new navigator.NestedPanel(compPan2, spawnObjectForGen2sing1)
    gen2sing1
        .bgText('gen2sing1')
        .update(500)

}, timeStep.next() )


// Generation 2 //

// Gen 2 sibling 1
setTimeout( () => {

    spawnObjectForGen2sib1 = compPan2.objects('status').objects('died')
    gen2sib1 = new navigator.NestedPanel(compPan2, spawnObjectForGen2sib1)
    gen2sib1
        .bgText('gen2sib1')
        .update(500)

}, timeStep.next() )


// Gen 2 sibling 2
setTimeout( () => {

    spawnObjectForGen2sib2 = compPan2.objects('status').objects('survived')
    gen2sib2 = new navigator.NestedPanel(compPan2, spawnObjectForGen2sib2, 'sibling')
    gen2sib2
        .bgText('gen2sib2')
        .update(500)

}, timeStep.next() )



// Gen 2 singleton 1
setTimeout( () => {

    spawnObjectForGen2sing2 = compPan2.objects('gender').objects('female')
    gen2sing2 = new navigator.NestedPanel(compPan2, spawnObjectForGen2sing2)
    gen2sing2
        .bgText('gen2sing2')
        .update(500)

}, timeStep.next() )








//// PANEL: COMPARISON VIEW: REMOVALS ///////////////////////////////////////////////////

// Create panel 0
// CAR: Compare and Remove
const carPanel0 = new navigator.NestedPanel()
    .bgFill('#deebf7')
    .bgText('carPanel (removals test)')
    .x(650).y(yCoordinateOfTestRow2)
    .yAxisLabels(true)
    .update(0)

// Create panel-1-0
const spawnObjectForCarPanel1_0 = carPanel0.objects('gender').objects('female')
const carPanel1_0 = new navigator.NestedPanel(carPanel0, spawnObjectForCarPanel1_0)
carPanel1_0.update()

// Create panel-2-0
let carPanel2_0
setTimeout( () => {
    const spawnObjectForCarPanel2_0 = carPanel1_0.objects('class').objects('first-class')
    carPanel2_0 = new navigator.NestedPanel(carPanel1_0, spawnObjectForCarPanel2_0)
    carPanel2_0.update()
}, 1000)


// Create panel-2-1
let carPanel2_1
setTimeout( () => {
    const spawnObjectForCarPanel2_1 = carPanel1_0.objects('class').objects('second-class')
    carPanel2_1 = new navigator.NestedPanel(carPanel1_0, spawnObjectForCarPanel2_1, 'sibling')
    carPanel2_1.update()
}, 3000)


let carPanel2_2
setTimeout( () => {
    // Create panel-2-2
    const spawnObjectForCarPanel2_2 = carPanel1_0.objects('class').objects('third-class')
    carPanel2_2 = new navigator.NestedPanel(carPanel1_0, spawnObjectForCarPanel2_2, 'sibling')
    carPanel2_2.update()
}, 4000)
setTimeout( () => {carPanel2_1.remove()}, 5000)
setTimeout( () => {carPanel2_2.remove()}, 6000)
setTimeout( () => {carPanel2_0.remove()}, 7000)
setTimeout( () => {carPanel1_0.remove()}, 8000)


