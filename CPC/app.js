
// // Set initial slider dial position from Svg element
// slider.value = svgCanvas.width()
// monitor.innerText = slider.value


// //// SVG  ////

mySvg = new container.Svg(1600, 1280)


//// RECTANGLE  ////

myRectangle = new shape.Rectangle().x(400).y(25).update()
myRectangle.fill('blue').update()



//// TEXT  ////

myText = new shape.Text()
myText.x(450).fill('red').update()



// //// CATEGORY  ////
// const parentElementForCategory = d3.select('body').select('svg')
//
// myCategory = new navigator.Category(parentElementForCategory)
// myCategory.x(400).y(100).fill('dodgerblue').update()


//// CAPTIONED RECTANGLE ////

// CAPTION AT CENTER
const parentElementForCaptionedRectangle = d3
    .select('body')
    .select('svg')
    .append('g')
      .attr('id', 'parent-container-of-captioned-rectangle')

myCaptionedRectangleCenter = new shape.CaptionedRectangle(parentElementForCaptionedRectangle)
myCaptionedRectangleCenter
    .x(400)
    .y(175)
    .width(250)
    .height(100)
    .fill('green')
    .text('Caption')
    .update()

// CAPTION AT TOP LEFT
myCaptionedRectangleTopLeft = new shape.CaptionedRectangle()
myCaptionedRectangleTopLeft
    .textAlignment('top-left')
    .x(400)
    .y(300)
    .width(250)
    .height(100)
    .fill('green')
    .text('Caption')
    .update()


// DEMO
// myCaptionedRectangleTopLeft.x(350).y(350).fill('blue').width('300').height('200').text('Hello').textAlignment('center').update()


//// CHART  ////

const parentElementForChart = d3.select('body').select('svg')

myChart = new navigator.Chart(parentElementForChart)
myChart.x(280).update()

// Update data of chart
const tempStack = new data.Stack()
    .populateWithExampleData('gender')
myChart.stack(tempStack)



//// PANEL ////

// const parentElementForPanel = d3.select('body').select('svg')
myPanel = new navigator.Panel()
    .bgFill('#deebf7')
    .update()

// Demo Code //
// myPanel.objects('gender').x(300).y(25).height(100).width(100).update()
// myPanel.objects('status').x(300).y(135).height(100).width(100).update()
// myPanel.objects('class').x(300).y(245).height(100).width(100).update()
// myPanel.objects('class').objects('first-class').fill('blue').update()

myChildPanel1 = new navigator.Panel(myPanel)
    .bgFill('#9ecae1')
    .update()

myChildPanel2 = new navigator.Panel(myChildPanel1)
    .bgFill('#3182bd')
    .update()




//// DATASET  ////

let mySummaryPanel = new navigator.Panel()
    .x(400).update()

const titanicDataset = new dataset.Dataset('http://localhost:3000/libraries/cpc/tests/dataset/titanic.csv', 'Name')
titanicDataset.build()
    .then( () => {

        const titanicSummary = titanicDataset.summarize()

        const titanicStacks = new data.Stacks()
        titanicStacks.fromNestedMap(titanicSummary)

        mySummaryPanel.bgFill('salmon').update()
        mySummaryPanel.stacks(titanicStacks).update()
    }


)



//// NAVIGATOR ////

const myNavigator = new navigator.Navigator()
myNavigator.loadDataset(
    'http://localhost:3000/libraries/cpc/tests/dataset/titanic.csv',
    'Name'
)



