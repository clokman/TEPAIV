//// SVG  ////
let mySvg = new container.Svg(15000, 15000)


//// RECTANGLE /////////////////////////////////////////////////////////////////
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


const distanceOfVisualTestsFromTopOfWindow = 50  // default: 700

//// CATEGORY  ////
const parentElementForCategory = d3.select('body').select('svg')

myCategory = new navigator.Category(parentElementForCategory)
myCategory
    .x(85)
    .y(distanceOfVisualTestsFromTopOfWindow)
    .fill('dodgerblue')
    .label('A label')
    .update()



//// CAPTIONED RECTANGLE /////////////////////////////////////////////////////////////////

// // CAPTION AT CENTER
// const parentElementForCaptionedRectangle = d3
//     .select('body')
//     .select('svg')
//     .append('g')
//       .attr('id', 'parent-container-of-captioned-rectangle')
//
// myCaptionedRectangleCenter = new shape.CaptionedRectangle(parentElementForCaptionedRectangle)
// myCaptionedRectangleCenter
//     .x(400)
//     .y(175)
//     .width(250)
//     .height(100)
//     .fill('green')
//     .text('Caption')
//     .update()
//
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
// myCaptionedRectangleTopLeft.x(350).y(350).fill('blue').width('300').height('200').text('Hello').textAlignment('center').update()





// CHART /////////////////////////////////////////////////////////////////

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



// //// DATASET /////////////////////////////////////////////////////////////////
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




// // BG CHART /////////////////////////////////////////////////////////////////
// TODO: THIS INVISIBLE BACKGROUND CHART MUST BE REMOVED
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
