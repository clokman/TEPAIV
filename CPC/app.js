
// // Set initial slider dial position from Svg element
// slider.value = svgCanvas.width()
// monitor.innerText = slider.value


//// SVG  ////

mySvg = new container.Svg(5000, 15000)


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



//// CATEGORY  ////
const parentElementForCategory = d3.select('body').select('svg')

myCategory = new navigator.Category(parentElementForCategory)
myCategory
    .x(85)
    .y(700)
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
myChart.x(450).y(650).update()

// Update data of chart
// tempStack = new data.Stack()
//     .populateWithExampleData('gender')
// myChart.stack(tempStack)


// Chart with labels
myChart = new navigator.Chart()
myChart.x(325).y(650).categoryLabels(true).update()
myChart.chartLabel('MY CHART LABEL').update()




//// PANEL ////

const parentElementForPanel = d3.select('body').select('svg')
myPanel = new navigator.Panel()
    .bgFill('#deebf7')
    .x(650).y(650)
    .update()

myPanel.yAxisLabels()


myPanel2 = new navigator.Panel()
    .bgFill('#deebf7')
    .x(800).y(650)
    .update()
myPanel2.objects('gender').colorScheme('Blues').update()
myPanel2.objects('class').colorScheme('RdPu').update()
myPanel2.objects('status').colorScheme('Oranges').update()


myPanel3 = new navigator.Panel()
    .bgFill('#deebf7')
    .x(950).y(650)
    .update()
myPanel3.objects('gender').colorScheme('YlGn').update()
myPanel3.objects('class').colorScheme('YlGnBu').update()
myPanel3.objects('status').colorScheme('BuPu').update()


myPanel4 = new navigator.Panel()
    .bgFill('#deebf7')
    .x(1100).y(650)
    .update()
myPanel4.objects('gender').colorScheme('Greys').update()
myPanel4.objects('class').colorScheme('Greys').update()
myPanel4.objects('status').colorScheme('Greys').update()



//// NESTED PANEL ////
//
myParentPanel = new navigator.Panel()
    .bgFill('#deebf7')
    .x(1350).y(650)
    .update()


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

// Navigator 1

const navigator1 = new navigator.Navigator()

navigator1.loadDataset(
    'http://localhost:3000/data/titanic.csv',
    ['Name']
).then(that => {
    that.update()

    that.x(125).update()

    // navigator1.objects('panel-0').height(1500).update()
    navigator1.objects('panel-0').yAxisLabels()

})


// Navigator 2

const navigator2 = new navigator.Navigator()

navigator2.loadDataset(
    'http://localhost:3000/data/titanic-embark-partial.csv',
    ['Name']
).then(that => {
    that.update()

    that.x(600).update()

    // navigator2.objects('panel-0').height(1500).update()
    navigator2.objects('panel-0').yAxisLabels()
})



// Navigator 3

const navigator3 = new navigator.Navigator()

navigator3.loadDataset(
    'http://localhost:3000/data/sophia.csv',
    ['Name']
).then(that => {
    that.update()

    that.x(1200).update()

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
        .x(1800)
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
        .x(2400)
        .update()

    navigator5.objects('panel-0').height(1000).update()
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
        .x(3000)
        .update()

    navigator6.objects('panel-0').height(10000).update()
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
