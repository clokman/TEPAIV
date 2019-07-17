
// // Set initial slider dial position from Svg element
// slider.value = svgCanvas.width()
// monitor.innerText = slider.value


//// SVG  ////

mySvg = new container.Svg(1600, 1280)


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
//
// // //// CATEGORY  ////
// // const parentElementForCategory = d3.select('body').select('svg')
// //
// // myCategory = new navigator.Category(parentElementForCategory)
// // myCategory.x(400).y(100).fill('dodgerblue').update()
//
//
// //// CAPTIONED RECTANGLE ////
//
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
// // myCaptionedRectangleTopLeft.x(350).y(350).fill('blue').width('300').height('200').text('Hello').textAlignment('center').update()
//
//
// CHART  ////
//
// const parentElementForChart = d3.select('body').select('svg')
//
// myChart = new navigator.Chart(parentElementForChart)
// myChart.x(400).update()
//
// // Update data of chart
// const tempStack = new data.Stack()
//     .populateWithExampleData('gender')
// myChart.stack(tempStack)

//
// // Update data of chart
// const tempStack = new data.Stack()
//     .populateWithExampleData('gender')
// myChart.stack(tempStack)

//
//
//
// //// PANEL ////
//
const parentElementForPanel = d3.select('body').select('svg')
myPanel = new navigator.Panel()
    .bgFill('#deebf7')
    .x(400)
    .update()
//
//
//
myParentPanel = new navigator.Panel()
    .bgFill('#deebf7')
    .x(550)
    .update()

// //
// // Demo Code //
// // myPanel.objects('gender').x(300).y(25).height(100).width(100).update()
// // myPanel.objects('status').x(300).y(135).height(100).width(100).update()
// // myPanel.objects('class').x(300).y(245).height(100).width(100).update()
// // myPanel.objects('class').objects('first-class').fill('blue').update()
//


spawnObjectForChild1 = myParentPanel.objects('gender').objects('female')
spawnObjectForChild1.fill('salmon')

myChildPanel1 = new navigator.Panel(myParentPanel, spawnObjectForChild1, 0)

spawnObjectForChild2 = myChildPanel1.objects('gender').objects('male')
spawnObjectForChild2.fill('lightblue')

setTimeout(() => {
    myChildPanel2 = new navigator.Panel(myChildPanel1, spawnObjectForChild2, 0)
},500)




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

const myNavigator = new navigator.Navigator()

myNavigator.loadDataset(
    'http://localhost:3000/data/titanic.csv',
    ['Name']
).then(that => {
    that.update()

    that.x(100).update()

    // myNavigator.objects('panel-0').height(1500).update()
    myNavigator.objects('panel-0').drawYAxisLabels()


})

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

