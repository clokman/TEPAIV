class CPC {

    /**
     @param dataset {Array} - An array of objects in the following format:
     _dataset: Array [
     0: Object {Ticket: "1st class", Status: "Survived", Gender: "Female", Name: "Bob"}
     1: Object {Ticket: "1st class", Status: "Survived", Gender: "Male", Name: "Harry"}
     ...
     ]
     */

    constructor(dataset, ignoredColumns, svgContainerWidth=600, svgContainerHeight=300, padding=8, panelBackgroundPadding=8, barHeight=80, absoluteRectangleWidths=false, drawContextAsBackground=true){

        this._svgContainerWidth = svgContainerWidth
        this._svgContainerHeight = svgContainerHeight
        this._padding = padding
        this._barHeight = barHeight
        this._panelBackgroundPadding = panelBackgroundPadding

        this._eulerPadding_horizontal = 20 // TODO: Could be added as a parameter

        this._absoluteRectangleWidths = false
        if (preferences.includes('absoluteRectangleWidths')){this._absoluteRectangleWidths = true}

        this._drawContextAsBackground = false
        if (preferences.includes('drawContextAsBackground')){this._drawContextAsBackground = true}

        this._drawContextAsForeground = false
        if (preferences.includes('drawContextAsForeground')){this._drawContextAsForeground = true}


        this._ignoredColumns = ignoredColumns

        this._dataset = dataset

        this._currentMaxPossibleValue = dataset.length // initial value.
        this._datasetSurveyResults = surveyData(dataset, this._ignoredColumns) // returns nested map



        // Store information for each panel here
        this._CpcRegistry = new Map()
        this._colorCount = 0


        this._deepestPanelDepth = 0
        this._initialPanelBackgroundAlreadyDrawn = false


        this._lastClickedColumnSelector = ''
        this._lastClickedCategorySelector = ''
        this._lastClickedCategoryLabel = ''

        this._lastClickedPanelDepth = 0



        this._svg = d3.select('body')
                      .append('svg')
                        .attr('width', svgContainerWidth)
                        .attr('height', svgContainerHeight)

        this._frontColorScale = d3.scaleOrdinal(d3.schemeCategory10)
        this._rectangleColorRegistry = new Map()



        //// SET UP SCALES FOR THE INITIAL PANEL ////

        // Get panel ranges for the current number of visible panels
        const panel0_ranges = this._calculatePanelRanges(this._deepestPanelDepth + 1) // +1, because depth count starts from zero
        const [ panel0_rangeStart, panel0_rangeEnd ] = panel0_ranges[0]

        // Set up xScale
        const xScaleForInitialPanel = d3.scaleLinear()
            .domain([0, this._currentMaxPossibleValue])
            .rangeRound([ panel0_rangeStart, panel0_rangeEnd ])


        // Set up yScales
        this._yScale = d3.scaleBand()
            .domain(d3.range(this._datasetSurveyResults.size))
            .rangeRound([0, this._svgContainerHeight-(this._barHeight+this._padding)])
            .paddingInner(1)

        // If the option to draw backgrounds is selected,
        // update yScales' ranges to add padding between the stacked bar charts and the panel background
        if(this._drawContextAsBackground){

            // Add padding to front yScale
            const start = this._yScale.range()[0]
                , end = this._yScale.range()[1]
            this._yScale.range([start+this._panelBackgroundPadding, end-this._panelBackgroundPadding])
        }



        // CREATE AND POPULATE LABELS AND SELECTORS DICTIONARY /////////////////////////////////////////////////////////

        //// PREPARE THE DICTIONARY ////

        this._selectorsAndLabelsDictionary = new Map()

        this._selectorsAndLabelsDictionary.set('column', new Map())
        this._selectorsAndLabelsDictionary.get('column').set('selector from', new Map())
        this._selectorsAndLabelsDictionary.get('column').set('label from', new Map())


        this._selectorsAndLabelsDictionary.set('category', new Map())
        this._selectorsAndLabelsDictionary.get('category').set('selector from', new Map())
        this._selectorsAndLabelsDictionary.get('category').set('label from', new Map())



        //// ADD UNIVERSAL LABELS AND SELECTORS ////

        // Add labels and selectors for the universal column (e.g., All Titanic passengers)
        const topColumnLabel = 'All columns'
        let topColumnSelector = new Str(topColumnLabel)
        topColumnSelector = topColumnSelector.formatAsCssSelector().returnString()
        this._selectorsAndLabelsDictionary.get('column').get('selector from').set(topColumnLabel, topColumnSelector)
        this._selectorsAndLabelsDictionary.get('column').get('label from').set(topColumnSelector, topColumnLabel)

        // Add labels and selectors for the universal category (e.g., All Titanic passengers)
        const topCategoryLabel = 'All categories'
        let topCategorySelector = new Str(topCategoryLabel)
        topCategorySelector = topCategorySelector.formatAsCssSelector().returnString()
        this._selectorsAndLabelsDictionary.get('category').get('selector from').set(topCategoryLabel, topCategorySelector)
        this._selectorsAndLabelsDictionary.get('category').get('label from').set(topCategorySelector, topCategoryLabel)



        //// ADD CATEGORY LABELS AND SELECTORS ////

        // Add column names and labels to the conversion dictionary
        this._dataset.forEach(rowData => {

            Object.entries(rowData).forEach( ([columnLabel, categoryLabel]) => {

                // Add column selectors to selectors dictionary
                let columnSelector = new Str(columnLabel)
                columnSelector = columnSelector.formatAsCssSelector()

                if (columnSelector.startsWithNumber) {
                    throw (`Column names in the dataset should not start with numbers. The name '${columnSelector.returnString()}' starts with a number.`)
                }

                columnSelector = columnSelector.returnString()

                this._selectorsAndLabelsDictionary.get('column').get('label from').set(columnLabel, columnSelector)
                this._selectorsAndLabelsDictionary.get('column').get('selector from').set(columnSelector, columnLabel)



                // Add purified category names (i.e., values of cells) to selectors dictionary
                let categorySelector = new Str(categoryLabel)
                categorySelector = categorySelector.formatAsCssSelector()

                if (categorySelector.startsWithNumber) {
                    throw (`Cell values in the dataset should not start with numbers. The value '${categorySelector.returnString()}' starts with a number.`)
                }

                categorySelector = categorySelector.returnString()

                this._selectorsAndLabelsDictionary.get('category').get('selector from').set(categoryLabel, categorySelector)
                this._selectorsAndLabelsDictionary.get('category').get('label from').set(categorySelector, categoryLabel)

            })

        })

        ////////////////////////////////////////////////////////////////////////////////////////////////////////////////


        // Draw the first panel
        this._drawPanel(xScaleForInitialPanel, this._dataset)

        this._makeNewPanelOnClick()
    }


    _makeNewPanelOnClick(){

        //// CREATE NEW PANEL UPON CLICKING ////
        this._svg.selectAll('.foreground-rectangle')
            .on('click', (d, i, g) => {


                console.log('New Click -------------------------------------')


                //// GET DETAILS ON WHAT IS CLICKED ////

                // Get clicked HTML element
                const clickedElement = g[i] // an HTML element

                // Create D3 selections for selected element ant its parent elements
                const clickedCategory = d3.select(clickedElement) // a d3 selection
                    , clickedPanel = d3.select(clickedElement.parentNode.parentNode)
                    , clickedChart = d3.select(clickedElement.parentNode)



                // Get names and details of what is clicked
                this._lastClickedColumnLabel = clickedChart.attr('column')
                this._lastClickedCategoryLabel = clickedCategory.attr('category')

                this._lastClickedColumnSelector = this._selectorsAndLabelsDictionary
                  .get('column')
                  .get('selector from')
                  .get(this._lastClickedColumnLabel)

                this._lastClickedCategorySelector = this._selectorsAndLabelsDictionary
                  .get('category')
                  .get('selector from')
                  .get(this._lastClickedCategoryLabel)

                this._lastClickedPanelDepth = Number(clickedPanel.attr('depth')) // returns string, hence the conversion

                console.log('_lastClickedPanelDepth:' + this._lastClickedPanelDepth + ', ' +
                    '_deepestPanelDepth:' + this._deepestPanelDepth + ', ' +
                    '\nSelectors:\n' +
                    this._lastClickedColumnSelector + ', ' + this._lastClickedCategorySelector +
                    '\nLabels:\n' +
                    this._lastClickedColumnLabel + ', ' + this._lastClickedCategoryLabel)



                //// REMOVE PANELS IF NECESSARY ////

                // Remove panels coming after the clicked panel
                if (this._lastClickedPanelDepth < this._deepestPanelDepth){

                    const iterableForAllPanels = d3.range(this._deepestPanelDepth+1) // TODO: THIS '+1' DOES NOT MAKE SENSE, AND LIKELY IS A POINTER TO A FAULTY INCREMENTATION PROCEDURE FOR '_deepestPanelDepth'. THE LOGIC OF THE CLASS SHOULD BE FIXED, SO THAT THIS +1 WOULD NOT BE NEEDED.
                        , iterableForPanelsToRemove = iterableForAllPanels.filter(e => e > this._lastClickedPanelDepth)
                    console.log('iterableForAllPanels:', iterableForAllPanels)
                    console.log('iterableForPanelsToRemove:', iterableForPanelsToRemove)

                    iterableForPanelsToRemove.forEach( e => {
                        const eachPanelSelector = '#panel-' + e

                        // Delete the panel in HTML
                        this._svg
                            .selectAll(eachPanelSelector)
                            .remove()

                        //Delete the panel's entry from registry
                        const eachPanelId = 'panel-' + e
                        this._CpcRegistry.delete(eachPanelId)

                    })


                    //Update panel depth record
                    this._deepestPanelDepth = this._lastClickedPanelDepth

                }




                //// READJUST WIDTH OF EXISTING PANELS  ////

                // Calculate the ranges for the current number of visible panels + 1 more panel
                const numberOfPanelsThatWillBeVisibleAfterAddition = this._deepestPanelDepth + 1 + 1  // +1 because the counting starts at 0, and +1 in order to refer to the depth of the panel to be added.






                // Update the xScales in the panel registry for the currently visible panels
                const currentNumberOfVisiblePanels = this._deepestPanelDepth + 1  // +1 because the counting starts at 0

                const iterationArray = d3.range(currentNumberOfVisiblePanels)
                iterationArray.forEach(i => {

                    const eachPanelId = 'panel-' + i

                      // Update foreground scales
                    const updatedFrontRanges = this._calculatePanelRanges(numberOfPanelsThatWillBeVisibleAfterAddition, 'front')  //

                    const [ eachUpdatedFrontRange_start, eachUpdatedFrontRange_end ] = updatedFrontRanges[i]

                      const outdatedXScaleFront = this._CpcRegistry.get(eachPanelId)
                          .get('xScaleFront')

                      const updatedXScaleFront = outdatedXScaleFront.rangeRound([eachUpdatedFrontRange_start, eachUpdatedFrontRange_end])

                      this._CpcRegistry.get(eachPanelId)
                          .set('xScaleFront', updatedXScaleFront)



                      // Update background scales
                      const updatedBackgroundRanges = this._calculatePanelRanges(numberOfPanelsThatWillBeVisibleAfterAddition, 'background')  //

                      const [ eachUpdatedBackgroundRange_start, eachUpdatedBackgroundRange_end ] = updatedBackgroundRanges[i]

                      const outdatedXScaleBackground = this._CpcRegistry.get(eachPanelId)
                        .get('xScaleBackground')

                      const updatedXScaleBackground = outdatedXScaleBackground.rangeRound([eachUpdatedBackgroundRange_start, eachUpdatedBackgroundRange_end])

                      this._CpcRegistry.get(eachPanelId)
                        .set('xScaleBackground', updatedXScaleBackground)


                      //
                      // // Update the background scales for the previous panel
                      // if (i>0){
                      // const [ eachUpdatedPreviousBackgroundRange_start, eachUpdatedPreviousBackgroundRange_end ] = newBackgroundRanges[i-1]
                      //
                      // const previousXScaleBackground = this._CpcRegistry.get(previousPanelId)
                      //   .get('xScaleBackground')
                      //
                      // const updatedPreviousXScaleBackground = previousXScaleBackground.rangeRound([eachUpdatedPreviousBackgroundRange_start, this._svgContainerWidth])
                      //
                      // this._CpcRegistry.get(previousPanelId)
                      //   .set('xScaleBackground', updatedPreviousXScaleBackground)
                      // }

                })

                this._updatePanels()




                //// QUERY THE PRECEEDING PANEL'S DATA ////

                // Select preceeding panel's data
                let targetSubsetOfData = {}

                let queryingEntireDataset = false
                if (this._lastClickedPanelDepth === 0){queryingEntireDataset = true}

                if (queryingEntireDataset) {
                    targetSubsetOfData = this._dataset
                }
                else {

                    const clickedPanelId = 'panel-' + (this._lastClickedPanelDepth)

                    const clickedPanelData = this._CpcRegistry
                      .get(clickedPanelId)
                      .get('data')

                    targetSubsetOfData = clickedPanelData

                }

                // Make the query on the clicked panel's data
                const drilledDownSubsetOfData =
                    d3.group(targetSubsetOfData,
                        d => d[this._lastClickedColumnSelector]
                    ).get(this._lastClickedCategoryLabel)

                const summaryOfDrilledDownSubsetOfData =
                  d3.rollup(targetSubsetOfData,
                      v => v.length,
                      d => d[this._lastClickedColumnSelector]
                  ).get(this._lastClickedCategorySelector)




                //// ADD NEW PANEL ////

                // Increment panel counter
                this._deepestPanelDepth += 1

                // Get panel ranges for the current number of visible panels
                const newPanel_ranges = this._calculatePanelRanges(this._deepestPanelDepth + 1) // +1, because depth count starts from zero
                const [ newPanel_rangeStart, newPanel_rangeEnd ] = newPanel_ranges[newPanel_ranges.length-1]  // get last element (newly added range)

                // Create an xScale for the new panel
                const xScaleForNewPanel = d3.scaleLinear()
                    .domain([0, this._currentMaxPossibleValue])
                    .rangeRound([ newPanel_rangeStart, newPanel_rangeEnd ])

                // Draw the new panel
                this._drawPanel(xScaleForNewPanel, drilledDownSubsetOfData, this._lastClickedCategoryLabel)
                // Re-run this method again (necessary for updating the selection that is being watched)
                this._makeNewPanelOnClick()

            })

    }




    show(){

        return this._svg

    }




    /**
     * @param xScale {d3.scale}
     * @param data {d3 data}
     * @returns d3 selection for the created panel
     */
    _drawPanel(xScale, data, backgroundCategoryLabel=null){

        let chartCount = 0

        const xScaleFront = xScale

        const surveyResults = surveyData(data, this._ignoredColumns)

        // If absolute values is being shown, update xScale domains
        let drawingPanelZero = false
        if(this._deepestPanelDepth === 0){drawingPanelZero = true}

        if (!drawingPanelZero && !this._absoluteRectangleWidths){

            // Find the maximum count value in survey
            let allCountsInSurvey = []
            surveyResults.forEach( (countArray, columnName) => {
                countArray.forEach( (count, categoryName) => {

                    allCountsInSurvey.push(count)

                })
            })
            const maximumCountInSurvey = d3.max(allCountsInSurvey)

            // Update the domain
            xScaleFront.domain([0, maximumCountInSurvey])

        }


        // If backgrounds are drawn, update xScale ranges to add padding between
        // the stacked bar charts and the panel background
        let xScaleBackground = null
        if(this._drawContextAsBackground){

            xScaleBackground = xScaleFront.copy()

            // Change xScale
            const start = xScaleFront.range()[0]
                , end = xScaleFront.range()[1]
            xScaleFront.range([start+this._panelBackgroundPadding, end-this._panelBackgroundPadding])

        }




        // Create panel ID and add it to the panel registry
        const panelId = 'panel-' + this._deepestPanelDepth
        this._CpcRegistry.set(panelId, new Map())
            .get(panelId)
            .set('id', panelId)
            .set('xScaleFront', xScaleFront)
            .set('xScaleBackground', xScaleBackground)
            .set('data', data)
            .set('surveyResults', surveyResults)

        // Create the group for panel
        const panel = this._svg
            .selectAll('g .panel')
            .data([0])
            .enter()
            .append('g')
            .attr('class', 'panel')
            .attr('id', panelId)
            .attr('depth', this._deepestPanelDepth)

        // Loop columns and categories in survey results
        surveyResults.forEach((categoriesCountsMap, eachColumnName) => {

            const eachChartSelector = this._selectorsAndLabelsDictionary
              .get('column')
              .get('selector from')
              .get(eachColumnName)

            const eachCategoryCountsObject = Object.fromEntries(categoriesCountsMap)
                , eachCategoryCountsArray = Array(eachCategoryCountsObject)

            // Setup stack constuctor
            const stackConstructor = d3.stack()
                .keys(Object.keys(eachCategoryCountsObject))
                .order(d3.stackOrderDescending)

            // Do the conversion to stack
            const eachForegroundStack = stackConstructor(eachCategoryCountsArray)
                , maxValueInArray = d3.max(eachForegroundStack.flat(2))

            // Append a group for each stacked bar chart
            const chart = panel.selectAll('g .' + eachChartSelector)
                .data([0])
                .enter()
                .append('g')
                .attr('class', eachChartSelector)
                .attr('column', eachColumnName)



            ////  ESTABLISH CONDITIONS ////

            let backgroundCategoryLabelParameterIsProvided = false
            // If the background parameter is provided
            if (backgroundCategoryLabel) {
                backgroundCategoryLabelParameterIsProvided = true
            }


            let drawingFirstPanelForFirstTimeWithBackground = false
            if (this._drawContextAsBackground &&
                !this._initialPanelBackgroundAlreadyDrawn &&
                this._deepestPanelDepth===0 &&
                !backgroundCategoryLabelParameterIsProvided){

                drawingFirstPanelForFirstTimeWithBackground = true

            }



            //// GENERATE BACKGROUND STACK FOR THE INITIAL PANEL ////

            let backgroundStack = []

            if (drawingFirstPanelForFirstTimeWithBackground){

                const surveyResultForFirstPanelBackground = surveyData(data, [], true)

                surveyResultForFirstPanelBackground.forEach((categoriesCountsMap, eachColumnName) => {

                    const eachCategoryCountsObject = Object.fromEntries(categoriesCountsMap)
                      , eachCategoryCountsArray = Array(eachCategoryCountsObject)

                    // Setup stack constuctor
                    const backgroundStackConstructor = d3.stack()
                      .keys(Object.keys(eachCategoryCountsObject))
                      .order(d3.stackOrderDescending)

                    // Do the conversion to stack
                    backgroundStack = backgroundStackConstructor(eachCategoryCountsArray)

                })
            }



            //// GENERATE BACKGROUND STACK FOR PANELS OTHER THAN THE INITIAL PANEL ////

            if(backgroundCategoryLabelParameterIsProvided){

                eachForegroundStack.forEach(e => {  // NOTE: Iteration of eachForegroundStack is NOT a mistake;
                                                    // it is done in order to filter it so that the background stack is not in it.

                    const currentCategoryLabelInStack = e.key

                    // If the current category in iteration is the background category,
                    // add that category in its separate stack
                    if (currentCategoryLabelInStack === backgroundCategoryLabel) {

                        backgroundStack.push(e)

                        // If user selected NOT to draw the context category as bar a that encompasses...
                        // the entire width of panel, do not include that element.
                        if (!this._drawContextAsForeground){
                            eachForegroundStack.pop(e)
                        }
                    }
                })
            }




            //// DRAW BACKGROUND RECTANGLES ////
            // this._initialPanelBackgroundAlreadyDrawn = false


            if (this._drawContextAsBackground || drawingFirstPanelForFirstTimeWithBackground ){

                const backgroundRectangle = panel.selectAll('.background-rectangle')
                  .data(backgroundStack)
                  .enter()
                  .append('rect')
                  .attr('class', d => {
                      const rectangleSelector = this._selectorsAndLabelsDictionary
                        .get('category')
                        .get('selector from')
                        .get(d.key)

                      return rectangleSelector
                  })
                  .classed('background-rectangle', true)
                  .attr('x', d => xScaleBackground(d[0][0]))
                  .attr('width', d => xScaleBackground(d[0][1]) - xScaleBackground(d[0][0]))
                  .attr('y', 0)
                  .attr('height', this._svgContainerHeight)
                  .attr('fill', d => this._assignColor(d))
                  .attr('opacity', 0.50) // 0.90
                  .attr('z', (d,i,g) => {
                      d3.select(g[i]).lower()

                      // if (g[i].attr('class').includes('All-'))

                  })

                if (drawingFirstPanelForFirstTimeWithBackground){
                    this._initialPanelBackgroundAlreadyDrawn = true
                }
            }


            //// DRAW FOREGROUND RECTANGLES ////

            const foregroundRectangles = chart.selectAll('.foreground-rectangle')
                .data(eachForegroundStack, d => d )
                .enter()
                .append('rect')
                .attr('class', d => {
                    // Return the selector name for the related category name in the dataset
                    const rectangleSelector = this._selectorsAndLabelsDictionary
                      .get('category')
                      .get('selector from')
                      .get(d.key)
                    return rectangleSelector
                })
                .attr('category', d => d.key)
                .classed('foreground-rectangle', true)
                .attr('x', d => xScaleFront(d[0][0]))
                .attr('y', (d) => this._yScale(chartCount) + this._padding*2 )
                .attr('width', (d) => xScaleFront(d[0][1]) - xScaleFront(d[0][0]))
                .attr('height', this._barHeight - this._padding)
                .attr('fill', (d) => this._assignColor(d))



            const barLabels = chart
                .selectAll('text')
                .data(eachForegroundStack)
                .enter()
                .append('text')
                .text(d => d.key)
                .attr('x', d => xScaleFront(d[0][0])+3)
                .attr('y', d => this._yScale(chartCount) + this._padding*1.5)
                .attr('font-family', 'sans-serif')
                .attr('font-size', '11px')
                .attr('fill', 'black')
                .attr('text-anchor', 'left')

            chartCount += 1

        })
        return panel

    }

    /*
    @parameter d - d3's datum object (the first parameter of d3's anonymous functions)
    @returns {String} - A CSS color name
     */
    _assignColor(d) {
        // Check if the category name is in the color registry
        const eachCategoryLabel = d.key

        let categoryIsAlreadyAssignedColor = false
        if (this._rectangleColorRegistry.get(eachCategoryLabel) !== undefined) {
            categoryIsAlreadyAssignedColor = true
        }

        // If category is NOT in the color registry, assign color and add it to registry
        if (!categoryIsAlreadyAssignedColor) {
            this._rectangleColorRegistry.set(eachCategoryLabel, this._frontColorScale(this._colorCount))

            this._colorCount += 1
        }

        return this._rectangleColorRegistry.get(eachCategoryLabel)
    }

    _updatePanels(){

        this._CpcRegistry.forEach( (values, panelKey) => {

            const panelRecord = this._CpcRegistry.get(panelKey)
            const panelId = panelRecord.get('id')

            // Get changed variables
            const updatedXScaleFront = panelRecord.get('xScaleFront')
                , updatedXScaleBackground = panelRecord.get('xScaleBackground')

            //// UPDATE WIDTHS ////

            const allElementsInPanel = this._svg
                .select('#' + panelId)

            // Select rectangles in panel
            const foreGroundRectanglesInPanel = allElementsInPanel
                .selectAll('.foreground-rectangle')

            // Update foreground rectangles
            foreGroundRectanglesInPanel
                .transition()
                .duration(500)
                .attr('x', d => {

                    if (this._drawContextAsBackground){
                        return updatedXScaleFront(d[0][0])  // TODO: Placeholder; needs to be changed. (First modify the panel resize function so that it can accomodate padding.)
                    }
                    else{
                        return updatedXScaleFront(d[0][0])
                    }

                })
                .attr('width', d => {

                    return updatedXScaleFront(d[0][1]) - updatedXScaleFront(d[0][0])

                })
                .on('end', () => {
                    // callback can be entered here
                })

            const backgroundRectanglesInPanel = allElementsInPanel
              .selectAll('.background-rectangle')


            // Update background rectangles
            backgroundRectanglesInPanel
                .transition()
                .duration(500)
                .attr('x', d => {

                    if (this._drawContextAsBackground){
                        return updatedXScaleBackground(d[0][0])  // TODO: Placeholder; needs to be changed. (First modify the panel resize function so that it can accomodate padding.)
                    }
                    else{
                        return updatedXScaleBackground(d[0][0])
                    }

                })
                .attr('width', d => {

                    return updatedXScaleBackground(d[0][1]) - updatedXScaleBackground(d[0][0])

                })
                .on('end', () => {
                    // callback can be entered here
                })





            // Select labels
            const textsInPanel = allElementsInPanel
                .selectAll('text')

            // Reposition labels
            textsInPanel
                .transition()
                .duration(500)
                .attr('x', d => updatedXScaleFront(d[0][0]) + 3)
        })
    }


    _calculatePanelRanges (numberOfPanels, eulerMode=false) {

        let panelRanges = []

        // Generate data for inputting it to the d3's stack generator
        // The format is: [ {0:1, 1:1, 2:1 } ]
        const panels = [{}]
        d3.range(numberOfPanels).forEach(e => {
            panels[0][e]=1
        })

        // Extract panel Ids (which are just 1,2,3 etc. for this function)
        const panelKeys = Object.keys(panels[0])

        // Construct stack
        const constructStack = d3.stack()
            .keys(panelKeys)
            .order(d3.stackOrderNone)
        const panelSeries = constructStack(panels)
        // e.g., panel series: [[0,1], [1,2], [2,3]]

        // Make an xScale that spans the entire SVG element
        const cpcXSpanScale = d3.scaleLinear()
            .domain([0, panelSeries.length])

        if (!eulerMode){
            cpcXSpanScale.rangeRound([0,  this._svgContainerWidth])
        }
        else{
            cpcXSpanScale.rangeRound([0, this._svgContainerWidth - (this._eulerPadding_horizontal * numberOfPanels)])
        }


        // Scale the stack
        let i = 1 // must NOT be 0, because will be used in multiplication below.
        panelSeries.forEach(panelDataArray => {
            // e.g., panelDataArray: [[0,1]]

            const eachPanelCoordinates = panelDataArray[0]
            // e.g.: [0, 1]

            const [eachDomainStart, eachDomainEnd] = eachPanelCoordinates

            let scaledPanelCoordinates
            if (!eulerMode || eulerMode === 'front'){
                scaledPanelCoordinates = [cpcXSpanScale(eachDomainStart)+this._padding, cpcXSpanScale(eachDomainEnd)]
            }
            else if (eulerMode === 'background') {
                scaledPanelCoordinates = [
                    cpcXSpanScale(eachDomainStart) + this._padding,
                    this._svgContainerWidth - (this._eulerPadding_horizontal * (numberOfPanels-i))
                ]
            }

            panelRanges.push(scaledPanelCoordinates)

            i += 1


        })

        // Remove padding at the beginning of the first range
        panelRanges[0][0] -= this._padding

        // Return the scaled stack, which corresponds to ranges for each panel
        return panelRanges

    }


}


/**
 * @param omitColumns {Array}
 * @return {Map}
 */
function surveyData(data, omitColumns=[], onlyGetRowCountForUppermostLevel=false){

    // const columnNames = data.columns

    // NOTE - COLUMN NAMES MUST BE CALCULATED FOR GENERALIZABILITY OF THIS METHOD: d3.csvParse method returns an Array object with an additional property '.columns'. This is not the case for the d3Array.group() method; d3Array.group() returns only an array (which does not have the .columns property). Therefore, the surveyData function extracts column names from the first object in the results array.
    // WARNING - ONLY THE KEYS OF THE FIRST OBJECT IN A RESULT ARRAY IS CHECKED FOR COLUMN NAMES : The column names are calculated only by looking at the first object in an array. E.g. the first object's keys in this results array: '[{Ticket: "1st class", Status: "Survived", Gender: "Male", Name: "John, X"}, {...}]'
    const columnNames = Object.keys(data[0])

    const filteredColumnNames = columnNames.filter(element => !(omitColumns.includes(element)) )


    let outerMap = new Map()
      , innerMap


        if (onlyGetRowCountForUppermostLevel){

            innerMap = new Map()
            innerMap.set('All categories', d3.rollup(data, v => v.length))

            outerMap.set('All columns', innerMap)
        }
        else{
            filteredColumnNames.forEach( columnName => {

                innerMap = d3.rollup(data, v => v.length, d => d[columnName])

                outerMap.set(columnName, innerMap)
            })
        }



    return outerMap

}


class Str{

    constructor (string){

        this.content = string

        this.startsWithNumber = this._startsWithNumber()

    }


    returnString(){

        return this.content

    }


    formatAsCssSelector(){

        const uncleanString = this.content

        const stringWithoutSpaces = uncleanString.replace(/ /g,'-')  // '/ /g' replace all instances of space character with empty string (global behavior in the scope of the string)
            , stringWithoutPunctuation = stringWithoutSpaces.replace(/[^a-zA-Z-0-9]/g, '')
            // , stringLowerCase = stringWithoutPunctuation.toLowerCase() // TODO: Lowercase selector names should be implemented, but implementation breaks the app.

        this.content = stringWithoutPunctuation

        return this
    }


    /*
    Checks if the string is convertable to a number.
    @returns {Boolean}
     */
    _startsWithNumber(){
        const firstCharacter = this.content[0]
            , conversionAttempt = Number(firstCharacter)
            , isNumber = !(isNaN(conversionAttempt))

        return isNumber
    }


}