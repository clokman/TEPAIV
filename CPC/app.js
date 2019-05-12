const dataset = titanicDataset
    , ignoredColumns = ['Name']
    , svgContainerWidth = 600
    , svgContainerHeight = 300
    , padding = 8
    , panelBackgroundPadding = 8
    , barHeight = 80
    , preferences = ['drawContextAsBackground']
  // ['absoluteRectangleWidths','drawContextAsBackground', drawContextAsForeground]
  // NOTE: The order in this parameter array does not matter, as this array is
  // scanned with array.includes() method)

const cpc = new CPC(
    dataset,
    ignoredColumns,
    svgContainerWidth,
    svgContainerHeight,
    padding,
    panelBackgroundPadding,
    barHeight,
    preferences[0],
    preferences[1]
)


// cpc.show()
