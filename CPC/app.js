
// // Set initial slider dial position from Svg element
// slider.value = svgCanvas.width()
// monitor.innerText = slider.value


//// SVG  ////

let mySvg = new container.Svg(15000, 15000)


// //// RECTANGLE  ////
//
// myRectangle = new shape.Rectangle().x(400).y(25).update()
// myRectangle.fill('blue').update()
//
//
//
// //// TEXT  ////
//
// myText = new shape.Text()
// myText.x(450).fill('red').update()
//
//


const distanceOfVisualTestsFromTopOfWindow = 700  // default: 700

//// CATEGORY  ////
const parentElementForCategory = d3.select('body').select('svg')

myCategory = new navigator.Category(parentElementForCategory)
myCategory
    .x(85)
    .y(distanceOfVisualTestsFromTopOfWindow)
    .fill('dodgerblue')
    .label('A label')
    .update()



// //// CAPTIONED RECTANGLE ////

// // CAPTION AT CENTER
// const parentElementForCaptionedRectangle = d3
//     .select('body')
//     .select('svg')
//     .append('g')
//       .attr('id', 'parent-container-of-captioned-rectangle')

// myCaptionedRectangleCenter = new shape.CaptionedRectangle(parentElementForCaptionedRectangle)
// myCaptionedRectangleCenter
//     .x(400)
//     .y(175)
//     .width(250)
//     .height(100)
//     .fill('green')
//     .text('Caption')
//     .update()

// // CAPTION AT TOP LEFT
// myCaptionedRectangleTopLeft = new shape.CaptionedRectangle()
// myCaptionedRectangleTopLeft
//     .textAlignment('top-left')
//     .x(400)
//     .y(300)
//     .width(250)
//     .height(100)
//     .fill('green')
//     .text('Caption')
//     .update()
//
//
// // DEMO
// // myCaptionedRectangleTopLeft.x(350).y(350).fill('blue').width('300').height('200').text('Hello').textAlignment('center').update()





// CHART  ////

// Without labels
const parentElementForChart = d3.select('body').select('svg')
myChart = new navigator.Chart(parentElementForChart)
myChart.x(450).y(distanceOfVisualTestsFromTopOfWindow).update()

// Update data of chart
// tempStack = new data.Stack()
//     .populateWithExampleData('gender')
// myChart.stack(tempStack)


// Chart with labels
myChart = new navigator.Chart()
myChart.x(325).y(distanceOfVisualTestsFromTopOfWindow).categoryLabels(true).update()
myChart.chartLabel('MY CHART LABEL').update()




//// PANEL ////

const parentElementForPanel = d3.select('body').select('svg')
myPanel = new navigator.Panel()
    .bgText('myPanel')
    .bgFill('#deebf7')
    .x(700).y(distanceOfVisualTestsFromTopOfWindow)
    .yAxisLabels(true)
    .update()

myPanel.yAxisLabels()


myPanel2 = new navigator.Panel()
    .bgText('myPanel2')
    .bgFill('#deebf7')
    .x(850).y(distanceOfVisualTestsFromTopOfWindow)
    .update()
myPanel2.objects('gender').colorScheme('Blues').update()
myPanel2.objects('class').colorScheme('RdPu').update()
myPanel2.objects('status').colorScheme('Oranges').update()


myPanel3 = new navigator.Panel()
    .bgText('myPanel3')
    .bgFill('#deebf7')
    .x(750).y(distanceOfVisualTestsFromTopOfWindow)
    .update()
myPanel3.objects('gender').colorScheme('YlGn').update()
myPanel3.objects('class').colorScheme('YlGnBu').update()
myPanel3.objects('status').colorScheme('BuPu').update()


myPanel4 = new navigator.Panel()
    .bgText('myPanel4')
    .bgFill('#deebf7')
    .x(1150).y(distanceOfVisualTestsFromTopOfWindow)
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
    .x(1400).y(distanceOfVisualTestsFromTopOfWindow)
    .update(0)


// // Demo Code //
// // myPanel.objects('gender').x(300).y(25).height(100).width(100).update()
// // myPanel.objects('status').x(300).y(135).height(100).width(100).update()
// // myPanel.objects('class').x(300).y(245).height(100).width(100).update()
// // myPanel.objects('class').objects('first-class').fill('blue').update()


// Embed child panel 1

spawnObjectForChild1 = nestedPanel.objects('gender').objects('female')

childPanel1 = new navigator.NestedPanel(nestedPanel, spawnObjectForChild1)
childPanel1
    .id('child-panel-1')
    .update()


// EMBED child panel 2

spawnObjectForChild2 = childPanel1.objects('gender').objects('male')

setTimeout(() => {
    childPanel2 = new navigator.NestedPanel(childPanel1, spawnObjectForChild2)
    childPanel2.id('child-panel-2').update()

},5000)


// REPLACE child panel 2 child panel 3

spawnObjectForChild3 = childPanel1.objects('class').objects('first-class')

setTimeout(() => {
    childPanel3 = new navigator.NestedPanel(childPanel1, spawnObjectForChild3)
    childPanel3.id('child-panel-3').update()

},8000)


// REMOVE child panel 3
setTimeout( () => {

    childPanel3.remove()

}, 10000)


// REMOVE child panel 1
setTimeout( () => {

    childPanel1.remove()

}, 12000)


// Embed child panel 4

setTimeout( () => {
    
    spawnObjectForChild4 = nestedPanel.objects('status').objects('survived')
    
    childPanel4 = new navigator.NestedPanel(nestedPanel, spawnObjectForChild4)
    childPanel4
        .id('child-panel-4')
        .update()
    
}, 16000)

setTimeout( () => {
    
    nestedPanel.colorSet('Magma').update()
    
}, 18000)





//// PANEL: COMPARISON VIEW  ////

comparisonPanel = new navigator.NestedPanel()
    .bgFill('#deebf7')
    .bgText('comparisonPanel')
    .colorSet('Viridis')
    .x(2000).y(distanceOfVisualTestsFromTopOfWindow)
    .yAxisLabels(true)
    .update(0)


setTimeout( () => {
    
    spawnObjectForComparisonChild1 = comparisonPanel.objects('gender').objects('female')
    
    comparisonChild1 = new navigator.NestedPanel(comparisonPanel, spawnObjectForComparisonChild1)
    comparisonChild1
        .bgText('comp.Ch.1')
        .update()
    
}, 5000)



setTimeout( () => {
    spawnObjectForComparisonChild2 = comparisonPanel.objects('gender').objects('male')

    comparisonChild2 = new navigator.NestedPanel(comparisonPanel, spawnObjectForComparisonChild2, 'sibling')
    comparisonChild2
        .bgText('comp.Ch.2')
        .update()
    
}, 6000)


setTimeout( () => {
    
    spawnObjectForComparisonChild3 = comparisonPanel.objects('status').objects('died')
    comparisonChild3 = new navigator.NestedPanel(comparisonPanel, spawnObjectForComparisonChild3, 'sibling')
    comparisonChild3
        .bgText('comp.Ch.3')
        .update()
    
}, 7000)



// //// DATASET  ////
//
// let mySummaryPanel = new navigator.Panel()
//     .x(400).update()
//
// const titanicDataset = new dataset.Dataset('http://localhost:3000/libraries/cpc/tests/dataset/titanic.csv', 'Name')
// titanicDataset.build()
//     .then( () => {
//
//         const titanicSummary = titanicDataset.summarize()
//
//         const titanicStacks = new data.Stacks()
//         titanicStacks.fromNestedMap(titanicSummary)
//
//         mySummaryPanel.bgFill('salmon').update()
//         mySummaryPanel.stacks(titanicStacks).update()
//     }
//
// )







// // BG CHART  ////  TODO: THIS INVISIBLE BACKGROUND CHART MUST BE REMOVED
//
// const parentElementForChart = d3.select('body').select('svg')
//
// myChart = new navigator.Chart(parentElementForChart)
// myChart
//     .x(400)
//     .update()
//
// myChart.objects().forEach( (chartObject, chartName) => {
//     chartObject
//         .fill('white')
//         .text('')
//         .x(0)
//         .y(0)
//         .height(500)
//         .width(1280)
//         .update()
// })


//// NAVIGATOR ////
const distanceBetweenNavigators = 1600

// Navigator 1

const navigator1 = new navigator.Navigator()

navigator1.loadDataset(
    'http://localhost:3000/data/titanic.csv',
    ['NAME']
).then(that => {
    that.update()

    that.x( 200 )
        .colorSet('Titanic')
        .update()

    // navigator1.objects('panel-0').height(1500).update()
    navigator1.objects('panel-0').yAxisLabels()

    // CAPITALIZE CHART LABELS
    navigator1.objects('panel-0').objects('Status')._chartLabelObject.text('STATUS').update()
    navigator1.objects('panel-0').objects('Ticket')._chartLabelObject.text('TICKET').update()
    navigator1.objects('panel-0').objects('Gender')._chartLabelObject.text('GENDER').update()
})


// Navigator 2

const navigator2 = new navigator.Navigator()

navigator2.loadDataset(
    'http://localhost:3000/data/titanic-embark-partial.csv',
    ['Name']
).then(that => {
    that.update()

    that.x( navigator1.x() + distanceBetweenNavigators )
        .colorSet('Titanic-2')
        .update()

    // navigator2.objects('panel-0').height(1500).update()
    navigator2.objects('panel-0').yAxisLabels()

    // CAPITALIZE CHART LABELS
    navigator2.objects('panel-0').objects('Survived')._chartLabelObject.text('SURVIVED').update()
    navigator2.objects('panel-0').objects('Pclass')._chartLabelObject.text('PCLASS').update()
    navigator2.objects('panel-0').objects('Sex')._chartLabelObject.text('SEX').update()
    navigator2.objects('panel-0').objects('Embarked')._chartLabelObject.text('EMBARKED').update()

})


// Navigator 3

const navigator3 = new navigator.Navigator()

navigator3.loadDataset(
    'http://localhost:3000/data/sophia.csv',
    ['Name']
).then(that => {
    that.update()

    that
        .colorSet('Plasma')
        .x( navigator2.x() + distanceBetweenNavigators )
        .update()

    // navigator3.objects('panel-0').height(1500).update()
    navigator3.objects('panel-0').yAxisLabels()

})


// Navigator 4

const navigator4 = new navigator.Navigator()

navigator4.loadDataset(
    'http://localhost:3000/data/mushrooms/mushrooms-4columns.csv',
    ['Name']
).then(that => {
    that.update()

    that
        .x( navigator3.x() + distanceBetweenNavigators )
        .update()

    navigator4.objects('panel-0').yAxisLabels()
})


// Navigator 5

const navigator5 = new navigator.Navigator()

navigator5.loadDataset(
    'http://localhost:3000/data/mushrooms/mushrooms-8columns.csv',
    ['Name']
).then(that => {
    that.update()

    that
        .x( navigator4.x() + distanceBetweenNavigators )
        .update()

    navigator5.objects('panel-0').height(750).update()
    navigator5.objects('panel-0').yAxisLabels()
})


// Navigator 6

const navigator6 = new navigator.Navigator()

navigator6.loadDataset(
    'http://localhost:3000/data/mushrooms/mushrooms.csv',
    ['Name']
).then(that => {
    that.update()

    that
        .x( navigator5.x() + distanceBetweenNavigators )
        .update()

    navigator6.objects('panel-0').height(7500).update()
    navigator6.objects('panel-0').yAxisLabels()
})




    // myNavigator.objects('panel-0').objects('Ticket').colorScheme('Purples').update()
    // myNavigator.objects('panel-0').objects('Status').colorScheme('Blues').update()
    // myNavigator.objects('panel-0').objects('Gender').colorScheme('Greens').update()

// Alternative Dataset paths //
// http://localhost:3000/data/titanic.csv
// http://localhost:3000/data/titanic-embark-partial.csv
// http://clokman.com/hosting/tepaiv/datasets/titanic/titanic-embark-partial.csv

// 'http://localhost:3000/data/mushrooms/mushrooms.csv',
// 'http://localhost:3000/data/mushrooms/mushrooms-8columns.csv',
// 'http://localhost:3000/data/mushrooms/mushrooms-4columns.csv',

// http://localhost:3000/data/sophia.csv


// Exploration possibilities //
// - Who survived?
// - Who died?


// - Composition of Males and Females
    // - Distribution of males and females to classes
    // - Distribution to survival

// - Survival rate of first class females
