
// // Set initial slider dial position from Svg element
// slider.value = svgCanvas.width()
// monitor.innerText = slider.value


const svgCanvas = new navigator.Svg(250, 250)

const width_slider = new controls.Slider("Svg Width", svgCanvas.width(), 100, 1000, svgCanvas, svgCanvas.width)
const height_slider = new controls.Slider("Svg Height", svgCanvas.height(), 100, 1000, svgCanvas, svgCanvas.height)


myRectangle = new navigator.Rectangle()

myLabel = new navigator.Label()

// myCategory = new navigator.Category()


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
