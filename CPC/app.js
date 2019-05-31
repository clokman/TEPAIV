
// // Set initial slider dial position from Svg element
// slider.value = svgCanvas.width()
// monitor.innerText = slider.value

mySvg = new container.Svg()

myRectangle = new shape.Rectangle().x(50).update()
myRectangle.fill('blue').update()

myText = new shape.Text()
myText.x(100).fill('red').update()


const parentElementForCategory = d3.select('body').select('svg')

myCategory = new navigator.Category(parentElementForCategory)
myCategory.x(10).y(100).fill('dodgerblue').update()




const parentElementForChart = d3.select('body').select('svg')

myChart = new navigator.Chart(parentElementForChart)
myChart.x(300).update()


// TODO: This block is a temporary solution until Chart.stack() is fixed
const tempStack = new data.Stack()
    .populateWithExampleData('gender')
myChart.stack(tempStack)



const parentElementForPanel = d3.select('body').select('svg')
myPanel = new navigator.Panel(parentElementForChart)


// const dataset = datasets.titanic
//     , ignoredColumns = ignoredColumnsFromInput
//     , svgContainerWidth = 600
//     , svgContainerHeight = 450
//     , padding = 8
//     , panelBackgroundPadding = 8
//     , barHeight = 110
//     , preferences = ['drawContextAsBackground']
//   // ['absoluteRectangleWidths','drawContextAsBackground', drawContextAsForeground]
//   // NOTE: The order in this parameter array does not matter, as this array is
//   // scanned with array.includes() method)
//
//
// const cpc = new CPC.CPC(
//     dataset,
//     ignoredColumns,
//     svgContainerWidth,
//     svgContainerHeight,
//     padding,
//     panelBackgroundPadding,
//     barHeight,
//     preferences
// )
