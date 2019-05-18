const dataset = datasets.titanic
    , ignoredColumns = ignoredColumnsFromInput
    , svgContainerWidth = 600
    , svgContainerHeight = 450
    , padding = 8
    , panelBackgroundPadding = 8
    , barHeight = 110
    , preferences = ['drawContextAsBackground']
  // ['absoluteRectangleWidths','drawContextAsBackground', drawContextAsForeground]
  // NOTE: The order in this parameter array does not matter, as this array is
  // scanned with array.includes() method)

const cpc = new CPC.CPC(
    dataset,
    ignoredColumns,
    svgContainerWidth,
    svgContainerHeight,
    padding,
    panelBackgroundPadding,
    barHeight,
    preferences
)


// cpc.show()
