//// UMD HEAD ////////////////////////////////////////////////////////////////////////
// UMD head and foot patterns adapted from d3.js (Copyright 2019 Mike Bostock)
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
        typeof define === 'function' && define.amd ? define(['exports'], factory) :
            (factory((global.navigator = global.navigator || {})));
}(this, (function (exports) {
    'use strict';
//////////////////////////////////////////////////////////////////////////////////////






// Module content goes here.
    const version = "3.0"


    /**
     * NOTE: For this class to be instantiated, there must be <b>at least</b> a SVG element existing in DOM.
     * This is true even if the class is initiated with default parameters.
     */
    class Navigator extends container.Group{

        constructor (parentContainerSelectionOrObject){

            // Superclass Init //
            super(parentContainerSelectionOrObject)
                .class('navigator')
                .update()


            // Public Parameters //
            this.datasetObject = null


            // Private Variables //
            this._awaitingDomUpdateAfterDataChange = false


            this._currentPanelDepth = -1  // `-1`, so that the first panel can be labeled as `panel-0`

            this._lastClickedCategoryName = null
            this._lastClickedChartName = null
            this._lastClickedPanelName = null
            this._lastClickedPanelDepth = null

            this._lastClickedCategoryObject = null
            this._lastClickedPanelObject = null

            this._lastCreatedPanelName = null

            this._currentDrilldownPathParameter = []  // stores the drilldown path that generated whatever is being visualized in the navigator at a point in time

            this._frontColorScale = d3.scaleOrdinal(d3.schemeCategory10)
            this._categoryColorRegistry = new Map()


            // Initialize //
            this._addListenerToFirstPanel()

        }


        _addListenerToFirstPanel(){
            this._whenACategoryIsClicked(
                ()=> this._queryDataAndUpdateVisualization()
            )

        }


        /**
         * Collects information on what is clicked, and then runs the callback function, if one is provided.
         * @param callback {function}
         * @private
         */
        _whenACategoryIsClicked(callback){

            this.select() // this first select is not a D3 method
                .selectAll('.category')
                .on('click', (d, i, g) => {

                    const clickedCategory = g[i]
                    const clickedChart  = g[i].parentNode
                    const clickedPanelElement = g[i].parentNode.parentNode

                    if (clickedPanelElement.getAttribute('class') === 'panel') {   // TODO: This if block is a workaround to prevent non-panel .category class objects from being processed. When the d3.selection issue is fixed, this block should not be in an if statement.

                        this._lastClickedCategoryName = clickedCategory.getAttribute('id')
                        this._lastClickedChartName = clickedChart.getAttribute('id')
                        this._lastClickedPanelName = clickedPanelElement.getAttribute('id')
                        this._lastClickedPanelDepth = Number(clickedPanelElement.getAttribute('depth'))

                        this._lastClickedCategoryObject = this
                            .objects(this._lastClickedPanelName)
                            .objects(this._lastClickedChartName)
                            .objects(this._lastClickedCategoryName)
                        this._lastClickedPanelObject = this.objects(this._lastClickedPanelName)

                        // this._goingDeeper = clickedPanelDepth === this._currentPanelDepth
                        // this._stayingAtSameLevel = clickedPanelDepth === this._currentPanelDepth - 1
                        // this._goingUpward = clickedPanelDepth === this._currentPanelDepth - 2  // TODO: This MUST be changed from a magic number to a generalizable algorithm
                        callback.call(this)

                    }

                    this._whenACategoryIsClicked(callback)  // keep listening

                })

        }


        _queryDataAndUpdateVisualization() {

            // Remove any panels if necessary
            this._removeAnyOutdatedPanels()

            // Query the data based on the clicked category
            this._updateCurrentDrillDownPathParameterBasedOnLastClickedCategory()
            let drilldownResult = this.datasetObject.drilldownAndSummarize(this._currentDrilldownPathParameter)

            // Sort drilldown results so that categories always appear in the same order as in panel-0
            drilldownResult.forEach( (columnObject, columnName) => {
                const columnObjectInDatasetSummary = this.datasetObject.summary.get(columnName)
                const sortedColumnObject = columnObject.sortAccordingTo(columnObjectInDatasetSummary)
                drilldownResult.set(columnName, sortedColumnObject)
            })

            // Convert query resuts to Stacks
            const drilldownResultStacks = new data.Stacks()
                .fromNestedMap(drilldownResult)



            // Create a new child panel based on query results
            this._createChildPanelBasedOnStacks(drilldownResultStacks)

            // Shrink all previous panels so that they fit the inner height of the new child panel
            this._compressInnerHeightOfPanelsToFitLastPanel()


        }


        _updateCurrentDrillDownPathParameterBasedOnLastClickedCategory() {

            const column = this._lastClickedChartName
            const category = this._lastClickedCategoryName

            // Modify last query based on clicked panel depth
            this._currentDrilldownPathParameter = this._currentDrilldownPathParameter.slice(0, this._lastClickedPanelDepth)
            this._currentDrilldownPathParameter.push({[column]: category})

            // Update panel depth according to the new query
            this._currentPanelDepth = this._currentDrilldownPathParameter.length -1

        }


        _createChildPanelBasedOnStacks(drilldownResultStacks) {

            // Update instance registry
            this._currentPanelDepth += 1
            this._lastCreatedPanelName = `panel-${this._currentPanelDepth}`



            // Pick a color for the new child panel's background


            // Create the new child panel as the child of the last clicked panel
            const childPanelObject = new Panel(this._lastClickedPanelObject, this._lastClickedCategoryObject)
            const totalDurationOfChildPanelInitializationAnimations = childPanelObject.animationDuration.extendBridge + childPanelObject.animationDuration.maximizePanelCover;

            childPanelObject.stacks(drilldownResultStacks)
                .id(this._lastCreatedPanelName)
                .bgText(this._lastClickedCategoryName)
                .bgTextFill('white')
                .update(totalDurationOfChildPanelInitializationAnimations)  // If too short, update duration cuts off animation times in Panel object.


            // Add depth property to child panel element in DOM
            childPanelObject.select()
                .attr('depth', this._currentPanelDepth)   // TODO: Panel.depth() method MUST be implemented and used here instead


            // Add the newly related child panel to objects registry
            this.objects(this._lastCreatedPanelName, childPanelObject)


            // Remove categories of the child panel that are already represented by the child panel's background
            this._currentDrilldownPathParameter.forEach((step) => {

                Object.entries(step).forEach(([columnName, categoryName]) => {

                    childPanelObject
                        .objects(columnName)
                        .remove(categoryName)
                })

            })

            // Colorize
            this._assignColorsToAnyNewCategoriesInNavigator()

            return this

        }


        /* Adjusts vertical inner space of all panels to fit the vertical inner space of the last panel, so that all charts start and end at same vertical positions between panels)
         */
        _compressInnerHeightOfPanelsToFitLastPanel() {

            const lastCreatedPanelObject = this.objects(this._lastCreatedPanelName)

            const innerPaddingTopIncrement = lastCreatedPanelObject.innerPaddingTop() + this._lastClickedPanelObject._paddingBetweenCharts + lastCreatedPanelObject.innerPaddingTop()
            const innerPaddingBottomIncrement = lastCreatedPanelObject.innerPaddingBottom() + this._lastClickedPanelObject._paddingBetweenCharts + lastCreatedPanelObject.innerPaddingBottom()

            // Shrink previous panel(s)
            this.objects().forEach((panelObject, panelName) => {

                if (panelName !== this._lastCreatedPanelName) {  // do not shrink the newly created panel

                    panelObject.innerPaddingTop(innerPaddingTopIncrement * 0.75)
                        .innerPaddingBottom(innerPaddingBottomIncrement)
                        .update()
                }
            })

        }


        _assignColorsToAnyNewCategoriesInNavigator(){  // TODO: MUST BE TESTED

            let i = 0

            this.objects().forEach( (panelObject, panelId) => {
                panelObject.objects().forEach( (chartObject) => {

                    chartObject.objects().forEach( (categoryObject, categoryName) => {


                        let categoryAlreadyAssignedColor = false
                        if (this._categoryColorRegistry.has(categoryName)){
                            categoryAlreadyAssignedColor = true
                        }

                        if (!categoryAlreadyAssignedColor){
                            const assignedColor = this._frontColorScale(i)
                            categoryObject.fill(assignedColor).update()
                            this._categoryColorRegistry.set(categoryName, assignedColor)
                        }

                        if(categoryAlreadyAssignedColor){
                            const existingColor = this._categoryColorRegistry.get(categoryName)
                            categoryObject.fill(existingColor).update()
                        }

                        i++
                    })
                })
            })
        }


        _removeAnyOutdatedPanels(){

            const numberOfPanelsThatWillRemainUnchangedAfterClick = this._lastClickedPanelDepth + 1

            if (this.objects().size >= numberOfPanelsThatWillRemainUnchangedAfterClick){

                const numberOfExtraPanels = this.objects().size - numberOfPanelsThatWillRemainUnchangedAfterClick
                this.removeLast(numberOfExtraPanels)
            }
        }


        update(transitionDuration){

            this._updateDomIfStacksDataHasChanged()

            super.update(transitionDuration)

            return this

        }


        _updateDomIfStacksDataHasChanged(){

            if (this._awaitingDomUpdateAfterDataChange){
                //
                //     this.removeAll()
                this._createPanelZeroBasedOnDataset()

                this._awaitingDomUpdateAfterDataChange = false
            }

        }


        _createPanelZeroBasedOnDataset(){

            const levelZeroDatasetSummary = this.datasetObject.summary // returns Map

            const summaryStacks = new data.Stacks()
            summaryStacks.fromNestedMap(levelZeroDatasetSummary)


            this._currentPanelDepth += 1
            const panelId = `panel-${this._currentPanelDepth}`
            const panelObject = new Panel(this.select())
                .stacks(summaryStacks)
                .id(panelId)
                .bgText('Dataset')
                .bgTextFill('white')
                .height(600)   // TODO: Magic number removed
                .update()

            panelObject.select()
                .attr('depth', this._currentPanelDepth)   // TODO: Panel.depth() method MUST be implemented and used here instead

            this.objects(panelId, panelObject)

            this._assignColorsToAnyNewCategoriesInNavigator()

            this._addListenerToFirstPanel()

        }




        async loadDataset(path, omitColumns){

            this._awaitingDomUpdateAfterDataChange = true

            this.datasetObject = new dataset.Dataset(path, omitColumns)
            await this.datasetObject.build()


            return this

        }




    }






    /**
     * NOTE: For this class to be instantiated, there must be <b>at least</b> a SVG element existing in DOM.
     * This is true even if the class is initiated with default parameters.
     */
    class Panel extends container.Group {


        constructor(parentContainerSelectionOrObject, objectToSpawnFrom, animationDuration=300){

            // Superclass Init //
            super(parentContainerSelectionOrObject)


            this.class('panel')
                .update()

            // Private Parameters //
            let thisPanelIsBeingEmbeddedInAnotherPanel =
                arguments.length ?
                    classUtils.isInstanceOf(parentContainerSelectionOrObject, 'Panel') :
                    false

            if (thisPanelIsBeingEmbeddedInAnotherPanel && !objectToSpawnFrom){
                throw Error('The panel is a child of another panel, but no object to spawn from is specified.')
            }


            this.parentObject = thisPanelIsBeingEmbeddedInAnotherPanel
                ? parentContainerSelectionOrObject
                : null

            this.childObject = null

            this.thisPanelIsBeingSpawnedFromACategoryOfParentPanel = !!objectToSpawnFrom

            this._objectToSpawnFrom = objectToSpawnFrom


            this._bgExtension = 0

            this._bgFill = thisPanelIsBeingEmbeddedInAnotherPanel
                ? this._objectToSpawnFrom.fill()
                : 'lightgray'

            this._bgText = 'Panel label'
            this._bgTextFill = 'darkgray'


            if (thisPanelIsBeingEmbeddedInAnotherPanel){
                this.propertiesAtTheEndOfEmbedAnimation = {
                    x: this.parentObject.x() + 100,
                    y: this.parentObject.y() + 15,
                    width: this.parentObject.width(),
                    height: this.parentObject.height() - 38
                }
            }

            this._x = thisPanelIsBeingEmbeddedInAnotherPanel
                ? 0 - this.propertiesAtTheEndOfEmbedAnimation.x  // start off-canvas
                : 25
            this._y = 25
            this._width = thisPanelIsBeingEmbeddedInAnotherPanel
                ? 0
                : 100
            this._height = 500


            this._innerPadding = {  // pixels
                top: 30,
                bottom: 10,
                left: 10,
                right: 10
            }
            this._paddingBetweenCharts = 0.05  // proportion


            this._innerX = () => this._x + this._innerPadding.left
            this._innerY = () =>  this._y + this._innerPadding.top
            this._innerWidth = () =>  this._width - this._innerPadding.left - this._innerPadding.right
            this._innerHeight = () => this._height - this._innerPadding.top - this._innerPadding.bottom


            this._stacks = new data.Stacks()
            this._populateWithExampleData()

            this._awaitingDomUpdateAfterDataChange = false

            this.animationDuration = {
                extendBridge: animationDuration,
                maximizePanelCover: animationDuration,
                parentBgExtension: animationDuration  // longer durations are cut off, probably by animations that follow
            }

            // Initialize //
            // TODO: Container.objects() implementation SHOULD be changed so that _backgroundObject and _bridgeObject would also be included in objects()
            this._backgroundObject = null
            this._createBackgroundObject()

            this._bridgeObject = null

            this._yAxisLabelsObject = new Map()
            this._yAxisLabelsObject.set('columns', new Map())
            this._yAxisLabelsObject.set('categories', new Map())


            this._createChartsBasedOnStacksData()

            this.update(0)

            if (thisPanelIsBeingEmbeddedInAnotherPanel){
                this._embedAsChildPanel()
            }

        }


        update(transitionDuration){

            if (this._backgroundObject){
                this._backgroundObject.update(transitionDuration)
            }

            if (this._bridgeObject){
                this._bridgeObject.update(transitionDuration)
            }

            this._updateDomIfStacksDataHasChanged()

            super.update(transitionDuration)

            return this

        }


        _updateDomIfStacksDataHasChanged() {  // TODO: This method introduces a new pattern: Now, aftr the data of an object is updated, myObject.update() method must be called to update DOM. This behavior MUST be implemented also for navigator.Chart() and other classes that allow updating their data with a setter.

            if (this._awaitingDomUpdateAfterDataChange){

                this.removeAll()
                this._createChartsBasedOnStacksData()

                this._awaitingDomUpdateAfterDataChange = false
            }

        }


        _embedAsChildPanel(){

            this._extendParentPanelBackground()
            this._createBridgeFromSpawnRoot()
            this._verticallyMaximizeFromBridgeAsChildPanel()

            // Register the current object as a child of its parent panel
            this.parentObject.childObject = this


            // TODO: This is a temporary solution to get parent and grandparent objects, until a recursive version is implemented
            // TODO: A possible solution is to implement a try-while loop

            try{
                const grandParentObject = this.parentObject.parentObject
                grandParentObject.bgExtension(230).update()  // TODO: MUST remove magic number --- What is this 230?
            }
            catch (e) {console.warn(e)}

        }


        _verticallyMaximizeFromBridgeAsChildPanel() {

            const bridgeWidth = this.parentObject._innerPadding.right

            // Create a cover (initiate invisible)
            const childPanelCover = new shape.Rectangle()
                .width(0)
                .fill(this._objectToSpawnFrom.fill())
                .height(0)
                .update(0)


            // Move the newly created cover to its initial position. Also set the bridge width to its final value
            setTimeout(() => {

                childPanelCover
                    .x(this.propertiesAtTheEndOfEmbedAnimation.x)
                    .y(this._bridgeObject.y())
                    .width(this.propertiesAtTheEndOfEmbedAnimation.width)
                    .height(this._bridgeObject.height())
                    .update(0)

                this._bridgeObject
                    .width(bridgeWidth)
                    .update(0)

            }, this.animationDuration.extendBridge)


            // Vertically maximize the cover
            setTimeout(() => {
                childPanelCover
                    .x(this.propertiesAtTheEndOfEmbedAnimation.x)
                    .y(this.propertiesAtTheEndOfEmbedAnimation.y)
                    .height(this.propertiesAtTheEndOfEmbedAnimation.height)
                    .width(this.propertiesAtTheEndOfEmbedAnimation.width)
                    .update(this.animationDuration.maximizePanelCover)
            }, this.animationDuration.extendBridge)


            // Remove the child panel's cover and move child panel to its final position
            setTimeout(() => {

                childPanelCover.remove()

                // Modify current panel's properties to fit it to the room created in parent panel
                this.x(this.propertiesAtTheEndOfEmbedAnimation.x)
                    .y(this.propertiesAtTheEndOfEmbedAnimation.y)
                    .width(this.propertiesAtTheEndOfEmbedAnimation.width)
                    .height(this.propertiesAtTheEndOfEmbedAnimation.height)
                    .update(0)

            }, this.animationDuration.extendBridge + this.animationDuration.maximizePanelCover)
        }

        _extendParentPanelBackground() {

            // Make room in parent panel
            const totalHorizontalPaddingInParentPanel = this.parentObject._innerPadding.right + this.parentObject._innerPadding.left
            const parentBgExtensionValue = this.propertiesAtTheEndOfEmbedAnimation.width + totalHorizontalPaddingInParentPanel

            this.parentObject
                .bgExtension(parentBgExtensionValue)
                .update(this.animationDuration.parentBgExtension)
        }


        _createBridgeFromSpawnRoot() {

            const parentBgExtensionValue = this.parentObject.bgExtension()

            const bridgeId = `${this._objectToSpawnFrom.id()}-bridge`

            const temporaryMaximumBridgeWidthDuringAnimation = parentBgExtensionValue - this.parentObject._innerPadding.right

            // Create a bridge (with 0 width at the right edge of the element to spawn from)
            this._bridgeObject = new shape.Rectangle(this.select())
                .class('bridge')
                .id(bridgeId)
                .fill(this._objectToSpawnFrom.fill())
                .x(this._objectToSpawnFrom.x() + this._objectToSpawnFrom.width())
                .y(this._objectToSpawnFrom.y())
                .height(this._objectToSpawnFrom.height())
                .width(0)
                .update(0)


            // Expand the width of the bridge to its temporary maximum
            this._bridgeObject
                .width(temporaryMaximumBridgeWidthDuringAnimation)
                .update(this.animationDuration.extendBridge)
        }


        _chartCount(){
            return this.stacks().size
        }


        _chartHeights(){

            const totalPaddingBetweenCharts = this._innerHeight() * this._paddingBetweenCharts

            const chartHeights = (this._innerHeight() - totalPaddingBetweenCharts) / this._chartCount()
            const roundedChartHeights = Math.round(chartHeights)

            return roundedChartHeights
        }


        _yScale(value){

            const rangeStart = this._innerY() + this._innerHeight()
            const rangeEnd = this._innerY()

            const yScale = d3.scaleBand()
                .domain(d3.range(this._chartCount()))
                .rangeRound([rangeStart, rangeEnd])
                .paddingInner(this._paddingBetweenCharts)

            return yScale(value)
        }


        _createBackgroundObject() {

            this._backgroundObject = new shape.CaptionedRectangle(this.select())

            this._backgroundObject
                .textAlignment('top-left')
                .class('background')
                .x(this.x())
                .y(this.y())
                .height(this.height())
                .width(this.width())
                .fill(this._bgFill)
                .text(this._bgText)
                .textFill(this._bgTextFill)
        }


        _createChartsBasedOnStacksData() {

            // loop //
            let i = 0
            this.stacks().forEach(
                (eachStack, eachStackId) => {

                    const chart = new Chart(this.select())
                        .stack(eachStack)
                        .id(eachStackId)
                        .x(this._innerX())
                        .y(this._yScale(i))
                        .height(this._chartHeights())
                        .width(this._innerWidth())
                        .update(0)

                    this.objects(eachStackId, chart)

                    i++

                }
            )
        }


        drawYAxisLabels() {  // TODO: Proper testing is necessary
            // TODO: When panel height etc is changed, label position does not update.

            // Create the overall container for y axis labels
            const yAxisAllLabels_group = new container.Group()
            yAxisAllLabels_group
                .class('y-axis-labels')
                .update()

            // Create the container for category labels
            const yAxisCategoryLabels_group = new container.Group(yAxisAllLabels_group)
                .class('category-labels')
                .update()

            this._drawYAxisCategoryLabels(yAxisCategoryLabels_group.select())

            return self

        }


        _drawYAxisCategoryLabels(parentSelection) {

            this.objects().forEach((chartObject, chartObjectName) => {
                chartObject.objects().forEach((categoryObject, categoryObjectName) => {

                    const verticalMidPointOfCategory = categoryObject.y() + categoryObject.height() / 1.8

                    const yCoordinateOfLabel = Math.round(verticalMidPointOfCategory)  // TODO: Magic number should be elimiated
                    const xCoordinateOfLabel = this.x() - this._innerPadding.left



                    const categoryTextObject = new shape.Text(parentSelection)
                    categoryTextObject
                        .x(xCoordinateOfLabel)
                        .y(yCoordinateOfLabel)
                        .dominantBaseline('bottom')
                        .text(categoryObjectName)
                        .textAnchor('end')
                        .fill('gray')
                        .class('category-label')
                        .id(categoryObjectName)
                        .update()

                    // Add to registry
                    this._yAxisLabelsObject.get('categories').set(categoryObjectName, categoryTextObject)

                })

            })
        }


        stacks(value){

            // this._data = value
            // this._numberOfCharts = this_data.size


            // Establish conditions for parameter
            const parameterIsNull = !arguments.length
                , parameterIsString = typeof value === 'string'
                , parameterIsObject = typeof value === 'object'


            // Get data
            if(parameterIsNull){
                return this._stacks.data()
            }


            // Query data
            if (parameterIsString){
                return this._stacks.data(value)  // returns the requested Stack object
            }


            // Set new data
            if (parameterIsObject){

                this._stacks = value  // value is a Stacks object in this case

                this._awaitingDomUpdateAfterDataChange = true

                return this
            }

        }


        x(value){

            // Getter
            if (!arguments.length){
                return this._x
            }

            // Setter
            else{

                this._x = value

                // Update background object
                this._backgroundObject
                    .x(this._x)


                // Update charts
                // LOOP //
                this.objects().forEach(
                    (eachObjectInGroup, eachObjectId) => {

                        eachObjectInGroup.x(this._innerX())

                    }
                )

                return this
            }

        }


        y(value){

            // Getter
            if (!arguments.length) {
                return this._y
            }

            // Setter
            else {

                this._y = value
                // range of this._yScale is not recalculated in this method as it is a live variable


                // Update background object
                this._backgroundObject
                    .y(this._y)


                // Update charts
                // loop //
                let i = 0
                this.objects().forEach(
                    (eachChartObject, eachChartId) => {

                        eachChartObject
                            .y(this._yScale(i))

                        i ++

                    }
                )

                return this
            }

        }


        width(value){

            // Getter
            if (!arguments.length){
                return this._width
            }

            // Setter
            else{

                this._width = value


                // Update background object
                this._backgroundObject
                    .width(this._width)


                // Update charts
                // LOOP //
                this.objects().forEach(
                    (eachObjectInGroup, eachObjectId) => {

                        eachObjectInGroup.width(this._innerWidth())

                    }
                )

                return this
            }

        }


        height(value){

            // Getter
            if (!arguments.length) {
                return this._height
            }

            // Setter
            else {
                this._height = value


                // Update background
                this._backgroundObject
                    .height(this._height)


                // Update charts
                // loop //
                let i = 0
                this.objects().forEach(
                    (eachChartObject, eachChartId) => {

                        eachChartObject
                            .y(this._yScale(i))
                            .height(this._chartHeights())

                        i ++

                    }
                )

                return this
            }

        }


        bgText(value){

            // Getter
            if (!arguments.length) {
                return this._bgText
            }

            // Setter
            else {

                this._bgText = value

                // Update background
                this._backgroundObject
                    .text(this._bgText)


                return this
            }

        }


        bgTextFill(value){

            // Getter
            if (!arguments.length) {
                return this._bgTextFill
            }

            // Setter
            else {

                this._bgTextFill = value

                // Update background
                this._backgroundObject
                    .textFill(this._bgTextFill)


                return this
            }

        }



        bgFill(value){

            // Getter
            if (!arguments.length) {
                return this._bgFill
            }

            // Setter
            else {

                this._bgFill = value

                // Update background
                this._backgroundObject
                    .fill(this._bgFill)


                return this
            }

        }


        bgExtension(value){

            // Getter
            if (!arguments.length) {
                return this._bgExtension
            }

            // Setter
            else {

                this._bgExtension = value

                // Update background
                this._backgroundObject
                    .width(this._width + this._bgExtension)


                return this
            }


        }



        innerPaddingBottom(value){   // TODO: NOT TESTED

            // Getter
            if (!arguments.length) {
                return this._innerPadding.bottom
            }

            // Setter
            else {

                this._innerPadding.bottom = value

                // Update charts
                let i = 0
                this.objects().forEach(
                    (eachChartObject, eachChartId) => {

                        eachChartObject
                            .y(this._yScale(i))
                            .height(this._chartHeights())

                        i ++

                    }
                )


                // Set bridge position
                if (this.childObject){
                    this.childObject._bridgeObject
                        .y(this.childObject._objectToSpawnFrom.y())
                        .height(this.childObject._objectToSpawnFrom.height())
                }

                return this
            }

        }



        innerPaddingTop(value){   // TODO: NOT TESTED

            // Getter
            if (!arguments.length) {
                return this._innerPadding.top
            }

            // Setter
            else {

                this._innerPadding.top = value

                // Update charts
                // loop //
                let i = 0
                this.objects().forEach(
                    (eachChartObject, eachChartId) => {

                        eachChartObject
                            .y(this._yScale(i))
                            .height(this._chartHeights())

                        i ++

                    }
                )


                // Set bridge position
                if (this.childObject){
                    this.childObject._bridgeObject
                        .y(this.childObject._objectToSpawnFrom.y())
                        .height(this.childObject._objectToSpawnFrom.height())
                }

                return this
            }

        }


        innerPaddingTop(value){   // TODO: NOT TESTED

            // Getter
            if (!arguments.length) {
                return this._innerPadding.top
            }

            // Setter
            else {

                this._innerPadding.top = value

                // Update charts
                // loop //
                let i = 0
                this.objects().forEach(
                    (eachChartObject, eachChartId) => {

                        eachChartObject
                            .y(this._yScale(i))
                            .height(this._chartHeights())

                        i ++

                    }
                )


                // Set bridge position
                if (this.childObject){
                    this.childObject._bridgeObject
                        .y(this.childObject._objectToSpawnFrom.y())
                        .height(this.childObject._objectToSpawnFrom.height())
                }

                return this
            }

        }


        _populateWithExampleData(){

            // Generate example Stack x 3
            const genderStack = new data.Stack().populateWithExampleData('gender')
                , classStack = new data.Stack().populateWithExampleData('class')
                , statusStack = new data.Stack().populateWithExampleData('status')

            // Combine example stacks in a Stack object
            const exampleStacks = new data.Stacks()
            exampleStacks.add('gender', genderStack)
            exampleStacks.add('class', classStack)
            exampleStacks.add('status', statusStack)

            this.stacks(exampleStacks)

            return this
        }

    }





    /**
     * NOTE: For this class to be instantiated, there must be <b>at least</b> a SVG element existing in DOM.
     * This is true even if the class is initiated with default parameters.
     */
    class Chart extends container.Group{


        constructor(parentContainerSelection){

            // Superclass init //
            super(parentContainerSelection)  // Creates a container that is a child of parent container

            super.class('chart')
                .update()


            // Private parameters //
            this._label = 'Chart Label'
            this._x = 25
            this._y = 25
            this._height = 300
            this._width = 100


            // Private variables //
            this._container = super.selectSelf()

            // Range
            this._rangeStack = null
            this._rangeStart = this._y + this._height  // bottom edge of chart; always has greater value than rangeEnd (e.g., 400)
            this._rangeEnd = this._y                   // top edge of chart (e.g., 0)

            // Domain
            this._domainStack = new data.Stack()  // initiate with example data
            this._domainMin = null
            this._domainMax = null

            // Scale function
            this._scaleFunction = d3.scaleLinear()


            // Initialize //
            this._calculateVariablesDependentOnDomainStack()
            this._updatePropertiesOfCategoryObjects()
            this._draw()

        }


        /**
         * Provides access to domain stack data of the chart.
         * @param value
         * @return {Chart|*|Map<any, any>|Map}
         */
        stack(value){

            // Establish conditions for parameter
            const parameterIsNull = !arguments.length
                , parameterIsString = typeof value === 'string'
                , parameterIsObject = typeof value === 'object'


            // Get data
            if(parameterIsNull){
                return this._domainStack.data()
            }


            // Query data
            if (parameterIsString){
                return this._domainStack.data(value)
            }


            // Set new data
            if (parameterIsObject){

                this._domainStack = value  // value is a Stack object in this case

                this._updateData()
                this.update()

                return this
            }

        }


        y(value){

            if (!arguments.length){
                return this._y
            }
            else{

                this._y = value

                // Height is calculated on the spot here instead of using this._height, in order to prevent dependency to this._height.
                // Such a dependency is problematic, because range method modifies both y and height by calling related setter methods
                // (which, in turn, also calls range()). The issue is the this._y or this._height may not have been updated by their
                // setter methods at the time the y() method needs the new values.
                // Because this._rangeStart and this._rangeEnd are updated with new values the first thing
                // when the range() is called, referring to this._rangeStart and this._rangeEnd variables is used as the standard method
                // to calculate height and y throughout this class.
                const currentChartHeight = this._rangeStart - this._rangeEnd  // e.g., 400-0

                const newRangeStart = this._y + currentChartHeight
                const newRangeEnd = this._y

                this.range([newRangeStart, newRangeEnd])

                return this
            }

        }


        height(value){

            if (!arguments.length){
                return this._height
            }
            else{

                this._height = value

                // Add height on it to calculate the new end point
                const currentRangeEnd = this._rangeEnd  // e.g., 0, which is the coordinate of left upper corner of the chart
                    , newRangeStart = currentRangeEnd + this._height  // e.g., rangeEnd+height=rangeStart could be equivalent to 0+400=400

                this.range([newRangeStart, currentRangeEnd])

                return this
            }

        }


        /**
         *
         * @param value {Array} - Format: [yStart, yEnd].
         * @return {(number|*)[]|Chart}
         *
         * @example <caption>Note that the first value is higher than the first value. A chart with this range would start at 400 pixels away from the top of the Svg container, and end at the very top of it. </caption>
         * myChart.range([400,0])
         *
         * @example <caption>If the user enters order of items in the wrong order the method correct this instead of raising an error. </caption>
         * myChart.range([0,400])
         */
        range(value){

            if (!arguments.length){
                return [this._rangeStart, this._rangeEnd]
            }
            else{

                // If necessary, reverse the coordinates so that the start is always at the bottom of the graph (i.e., start is greater than the end in the y coordinate). If the user specified the range in reverse (e.g., [0,400] instead of [400,0]), this corrects the issue.
                if (value[0] < value[1]){_.reverse(value)}

                // Set new range properties for the instance
                let [start, end] = value

                // Update instance variables for range
                this._rangeStart = start
                this._rangeEnd = end

                // Update chart y coordinate (top left edge)
                if (this._rangeEnd !== this._y){
                    this.y(this._rangeEnd)
                }

                // Update chart height
                const newChartHeight = this._rangeStart - this._rangeEnd  // e.g., 400-0
                if (newChartHeight !== this.height()) {  // if height is not already updated to this new value by another method before...
                    // WARNING: This if statement prevents .height() and .range() methods from calling each other infinitely
                    // What this if statement effectively means is:
                    // - If this._height is already the same with the calculated value, this means that the .range() is
                    //      being called by another function that has already updated the height of the chart.
                    //      If this is the case, then don't do anything.
                    // - If this._height is not already the same with the calculated value, then .range() is not being
                    //      called by a method that has already dealt with the height value (e.g., height()).
                    //      In this case, call height() to update the chart height. (The height() would also call back .range()
                    //      but this would not lead to an infinite call stack, because this if block would prevent the second
                    //      chart height update attempt).
                    this.height(newChartHeight)
                }

                // Update scale function
                this._scaleFunction.rangeRound([this._rangeStart, this._rangeEnd])

                // Rescale stack data
                this._rangeStack = this._domainStack.copy()
                this._rangeStack.scale(this._scaleFunction)

                // Update width and y coordinates of each category
                // LOOP //
                this.objects().forEach(
                    (eachCategoryObject, eachCategoryId) => {

                        const newStart = this._rangeStack.data().get(eachCategoryId).get('start')
                            , newEnd = this._rangeStack.data().get(eachCategoryId).get('end')

                        eachCategoryObject
                            .y(newEnd)
                            .height(newStart-newEnd)
                    }
                )

                return this
            }

        }


        /**
         * Iteratively initializes Category instances
         * @private
         */
        _draw(){

            this._createCategoryObjectsFromRangeStack()

            this._updatePropertiesOfCategoryObjects()

            // Update the DOM
            this.update()

        }

        _updateData() {
            this._calculateVariablesDependentOnDomainStack()
            this._replaceOldCategoriesWithNewOnes()
            this._updatePropertiesOfCategoryObjects()
        }


        /**
         * (Re-)calculates the values for domain stack related variables
         * @return {Chart}
         * @private
         */
        _calculateVariablesDependentOnDomainStack(){

            //// CALCULATE VARIABLES THAT DEPEND ON DATA ////
            // This is necessary both for inital data and for setting new data

            // Recalculate stats for the new data
            this._domainMin = this._domainStack.min()
            this._domainMax = this._domainStack.max()

            // Update scale function
            this._scaleFunction
                .domain([this._domainMin, this._domainMax])
                .rangeRound([this._rangeStart, this._rangeEnd])

            // Update range stack
            this._rangeStack = this._domainStack.copy()
            this._rangeStack.scale(this._scaleFunction)

            return this
        }


        _replaceOldCategoriesWithNewOnes() {

            // TODO: This can be achieved more gracefully by using Group.removeLast(), etc. The current method simply removes the old categories and creates new ones without transitions.

            // Remove old category objects in chart
            this.removeAll()

            // Re-create new category objects to chart
            this._createCategoryObjectsFromRangeStack()
        }


        _createCategoryObjectsFromRangeStack() {

            // LOOP //
            this._rangeStack.data().forEach(
                (eachCategoryData, eachCategoryId) => {

                    // Instantiate a Category object for each category in Stack
                    const categoryObject = new Category(this._container)

                    // Add the created objects to container registry
                    this.objects(eachCategoryId, categoryObject)
                }
            )
        }


        _updatePropertiesOfCategoryObjects(){

            // LOOP //
            this.objects().forEach(
                (eachCategoryObject, eachCategoryId) => {

                    const start = this._rangeStack.data(eachCategoryId).get('start')
                    const end = this._rangeStack.data(eachCategoryId).get('end')
                    const percentage = this._rangeStack.data(eachCategoryId).get('percentage')

                    eachCategoryObject
                        .x(this._x)
                        .y(end)
                        .height(start-end)
                        .width(this._width)
                        .id(eachCategoryId)
                        .class('category')
                        .percentage(percentage)

                }
            )

        }

    }






    /**
     * NOTE: For this class to be instantiated, there must be <b>at least</b> a SVG element existing in DOM.
     * This is true even if the class is initiated with default parameters.
     */
    class Category extends shape.CaptionedRectangle{


        constructor(parentContainerSelection=d3.select('body').select('svg')) {

            super(parentContainerSelection)

            // Private Parameters //

            this._percentage = 10
            this.percentage(this._percentage)  // format and set percentageText object's inner text



        }


        percentage(value) {

            // Getter
            if (!arguments.length){
                return this._percentage
            }
            // Setter
            else{

                this._percentage = value

                const formattedPercentageString = stringUtils.formatNumberAsPercentage(this._percentage)
                this._textObject.text(formattedPercentageString)

                return this
            }
        }


        text(value){
            console.warn(
                '.text() method should not be used for Category class instances. ' +
                'Instead, .percentage() method must be used modify percentage text.')

            return super.text(value)

        }

    }




//// UMD FOOT ////////////////////////////////////////////////////////////////////////

    //// MODULE.EXPORTS ////
    exports.version = version;
    exports.Navigator = Navigator;
    exports.Panel = Panel;
    exports.Chart = Chart;
    exports.Category = Category;


    Object.defineProperty(exports, '__esModule', {value: true});

})));
//////////////////////////////////////////////////////////////////////////////////////

