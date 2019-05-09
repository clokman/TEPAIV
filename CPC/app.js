const dataset = titanicDataset
    , ignoredColumns = ['Name']
    , svgContainerWidth = 600
    , svgContainerHeight = 300
    , padding = 8
    , panelBackgroundPadding = 8
    , barHeight = 80
    , preferences = ['contextAsBackground']
  // ['absoluteWidths','contextAsBackground']

console.log(titanicDataset)
console.log('abcdefghi')

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
