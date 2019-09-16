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
    class Navigator extends container.Group {

        constructor(parentContainerSelectionOrObject) {

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

            this._colorSet = 'Single-Hue'
            this.categoryColorRegistry = new Map()

            // Initialize //
            this._addListenerToFirstPanel()

        }


        _createPanelZeroBasedOnDataset() {

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

            panelObject.yAxisLabels(true) // TODO: Why is this not chainable with the setters above?

            panelObject.select()
                .attr('depth', this._currentPanelDepth)   // TODO: Panel.depth() method MUST be implemented and used here instead


            this.objects(panelId, panelObject)

            this.colorSet(this._colorSet)

            this._addListenerToFirstPanel()

        }


        async loadDataset(path, omitColumns) {

            this._awaitingDomUpdateAfterDataChange = true

            this.datasetObject = new dataset.Dataset(path, omitColumns)
            await this.datasetObject.build()


            return this

        }


        _addListenerToFirstPanel() {
            this._whenACategoryIsClicked(
                () => this._queryDataAndUpdateVisualization()
            )

        }


        /**
         * Collects information on what is clicked, and then runs the callback function, if one is provided.
         * @param callback {function}
         * @private
         */
        _whenACategoryIsClicked(callback) {

            this.select() // this first select is not a D3 method
                .selectAll('.category')
                .on('click', (d, i, g) => {

                    const clickedCategory = g[i]
                    const clickedChart = g[i].parentNode
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


        update(transitionDuration) {

            this._updateDomIfStacksDataHasChanged()

            super.update(transitionDuration)

            return this

        }


        _updateDomIfStacksDataHasChanged() {

            if (this._awaitingDomUpdateAfterDataChange) {

                this._createPanelZeroBasedOnDataset()

                this._awaitingDomUpdateAfterDataChange = false
            }

        }


        _queryDataAndUpdateVisualization() {

            // Remove any panels if necessary
            this._removeAnyOutdatedPanels()

            // Query the data based on the clicked category
            this._updateCurrentDrillDownPathParameterBasedOnLastClickedCategory()
            let drilldownResult = this.datasetObject.drilldownAndSummarize(this._currentDrilldownPathParameter)

            // Sort drilldown results so that categories always appear in the same order as in panel-0
            drilldownResult.forEach((columnObject, columnName) => {
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
            this._currentPanelDepth = this._currentDrilldownPathParameter.length - 1

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
            this._assignColorsToCategoriesInNewSubpanelsFromRegistry()

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


        _removeAnyOutdatedPanels() {

            const numberOfPanelsThatWillRemainUnchangedAfterClick = this._lastClickedPanelDepth + 1

            if (this.objects().size >= numberOfPanelsThatWillRemainUnchangedAfterClick) {

                const numberOfExtraPanels = this.objects().size - numberOfPanelsThatWillRemainUnchangedAfterClick
                this.removeLast(numberOfExtraPanels)
            }
        }


        _assignColorsToCategoriesInNewSubpanelsFromRegistry() {


            this.objects().forEach( (panelObject, panelId) => {
                panelObject.objects().forEach( chartObject => {
                    chartObject.objects().forEach( (categoryObject, categoryName) => {

                        const categoryColorInRegistry = this.categoryColorRegistry.get(categoryName)
                        categoryObject.fill(categoryColorInRegistry).update()

                    })
                })
            })
        }


        colorSet(value){

            // Getter
            if (!arguments.length) {
                return this._colorSet
            }

            // Setter
            else {

                this._colorSet = value

                // Update the color sets of panels
                this.objects().forEach( (panelObject, panelId) => {
                        panelObject.colorSet(value)
                    }
                )

                // Update the color registry
                this.objects().forEach( (panelObject, panelId) => {
                    panelObject.objects().forEach( chartObject => {
                        chartObject.objects().forEach( (categoryObject, categoryName) => {

                            const newColorOfCategory = categoryObject.fill()
                            this.categoryColorRegistry.set(categoryName, newColorOfCategory)

                        })
                    })
                })


                // Update the background colors of child panels if the category from which they spawned has changed color
                this.objects().forEach( (panelObject, panelId) => {

                    if (panelObject._objectToSpawnFrom){
                        const newColorOfCategoryTheChildPanelSpawnedFrom = panelObject._objectToSpawnFrom.fill()
                        panelObject.bgFill(newColorOfCategoryTheChildPanelSpawnedFrom)

                    }

                })


                return this
            }
        }

    }


    /**
     * NOTE: For this class to be instantiated, there must be <b>at least</b> a SVG element existing in DOM.
     * This is true even if the class is initiated with default parameters.
     */
    class Panel extends container.Group {


        constructor(parentContainerSelectionOrObject, objectToSpawnFrom, animationDuration = 300) {

            // Superclass Init //
            super(parentContainerSelectionOrObject)


            this.class('panel')
                .update()

            // Private Parameters //
            let thisPanelIsBeingEmbeddedInAnotherPanel =
                arguments.length ?
                    classUtils.isInstanceOf(parentContainerSelectionOrObject, 'Panel') :
                    false

            if (thisPanelIsBeingEmbeddedInAnotherPanel && !objectToSpawnFrom) {
                throw Error('The panel is specified to be a child of another panel, but no object is specified as spawn source (missing argument).')
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


            if (thisPanelIsBeingEmbeddedInAnotherPanel) {
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
            this._innerY = () => this._y + this._innerPadding.top
            this._innerWidth = () => this._width - this._innerPadding.left - this._innerPadding.right
            this._innerHeight = () => this._height - this._innerPadding.top - this._innerPadding.bottom

            this._colorTheme = 'Single-Hue'


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

            // this._yAxisLabelsObject = new Map()
            // this._yAxisLabelsObject.set('columns', new Map())
            // this._yAxisLabelsObject.set('categories', new Map())


            this._createChartsBasedOnStacksData()

            this.update(0)

            if (thisPanelIsBeingEmbeddedInAnotherPanel) {
                this._embedAsChildPanel()
            }

        }


        update(transitionDuration) {

            if (this._backgroundObject) {
                this._backgroundObject.update(transitionDuration)
            }

            if (this._bridgeObject) {
                this._bridgeObject.update(transitionDuration)
            }

            this._updateDomIfStacksDataHasChanged()

            super.update(transitionDuration)
            // this._updateYAxisLabels()

            return this

        }


        _updateDomIfStacksDataHasChanged() {  // TODO: This method introduces a new pattern: Now, after the data of an object is updated, myObject.update() method must be called to update DOM. This behavior MUST be implemented also for navigator.Chart() and other classes that allow updating their data with a setter.

            if (this._awaitingDomUpdateAfterDataChange) {

                this.removeAll()
                this._createChartsBasedOnStacksData()

                this._awaitingDomUpdateAfterDataChange = false
            }

        }


        // _updateYAxisLabels() {
        //
        //
        // this.objects().forEach((chartObject, chartObjectName) => {
        //     chartObject.objects().forEach((categoryObject, categoryObjectName) => {
        //
        //         const percentageTextObject = categoryObject.objects('text')
        //
        //         const yCoordinateOfLabel = percentageTextObject.y()
        //         const xCoordinateOfLabel = this.x() - this._innerPadding.left
        //
        //         const categoryLabelObject = new shape.Text(parentSelection)
        //         categoryLabelObject
        //             .x(xCoordinateOfLabel)
        //             .y(yCoordinateOfLabel)
        //             .dominantBaseline('bottom')
        //             .text(categoryObjectName)
        //             .textAnchor('end')
        //             .fill('gray')
        //             .class('category-label')
        //             .id(categoryObjectName)
        //             .update()
        //
        //     })
        //
        // this._yAxisLabelsObject.get('categories').set(categoryObjectName, categoryLabelObject)
        //
        //
        // })

        // }


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
                        .colorScheme(color.getChartSchemeBySchemeSetNameAndCircularIndex(this._colorTheme, i))
                        .update(0)

                    this.objects(eachStackId, chart)

                    i++

                }
            )
        }


        _populateWithExampleData() {

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


        _embedAsChildPanel() {

            this._extendParentPanelBackground()
            this._createBridgeFromSpawnRoot()
            this._verticallyMaximizeFromBridgeAsChildPanel()

            // Register the current object as a child of its parent panel
            this.parentObject.childObject = this


            // TODO: This is a temporary solution to get parent and grandparent objects, until a recursive version is implemented
            // TODO: A possible solution is to implement a try-while loop

            try {
                const grandParentObject = this.parentObject.parentObject
                grandParentObject.bgExtension(230).update()  // TODO: MUST remove magic number --- What is this 230?
            } catch (e) {
                console.warn(e)
            }

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


        _verticallyMaximizeFromBridgeAsChildPanel() {

            const finalBridgeWidth = this.parentObject._innerPadding.right

            // Create a cover (initiate invisible)
            const childPanelCover = new shape.Rectangle()
                .width(0)
                .fill(this._objectToSpawnFrom.fill())
                .height(0)
                .update(0)


            // Move the newly created cover to its initial position (which is on top of the bridge).
            setTimeout(() => {
                childPanelCover
                    .x(this.propertiesAtTheEndOfEmbedAnimation.x)
                    .y(this._bridgeObject.y())
                    .width(this.propertiesAtTheEndOfEmbedAnimation.width)
                    .height(this._bridgeObject.height())
                    .update(0)

                // Set the bridge width to its final value
                this._bridgeObject
                    .width(finalBridgeWidth)
                    .update(0)

            }, this.animationDuration.extendBridge)  // do after bridge is extended


            // Vertically maximize the cover
            setTimeout(() => {
                childPanelCover
                    .x(this.propertiesAtTheEndOfEmbedAnimation.x)
                    .y(this.propertiesAtTheEndOfEmbedAnimation.y)
                    .height(this.propertiesAtTheEndOfEmbedAnimation.height)
                    .width(this.propertiesAtTheEndOfEmbedAnimation.width)
                    .update(this.animationDuration.maximizePanelCover)
            }, this.animationDuration.extendBridge)  // do after bridge is extended


            // Remove the child panel's cover and teleport child panel to its final position
            setTimeout(() => {

                childPanelCover.remove()

                // Modify current panel's properties to fit it to the room created in parent panel
                this.x(this.propertiesAtTheEndOfEmbedAnimation.x)
                    .y(this.propertiesAtTheEndOfEmbedAnimation.y)
                    .width(this.propertiesAtTheEndOfEmbedAnimation.width)
                    .height(this.propertiesAtTheEndOfEmbedAnimation.height)
                    .update(0)

            }, this.animationDuration.extendBridge + this.animationDuration.maximizePanelCover)  // do after bridge extended and cover is maximized
        }


        _chartCount() {
            return this.stacks().size
        }


        _chartHeights() {

            const totalPaddingBetweenCharts = this._innerHeight() * this._paddingBetweenCharts

            const chartHeights = (this._innerHeight() - totalPaddingBetweenCharts) / this._chartCount()
            const roundedChartHeights = Math.round(chartHeights)

            return roundedChartHeights
        }


        _yScale(value) {

            const rangeStart = this._innerY() + this._innerHeight()
            const rangeEnd = this._innerY()

            const yScale = d3.scaleBand()
                .domain(d3.range(this._chartCount()))
                .rangeRound([rangeStart, rangeEnd])
                .paddingInner(this._paddingBetweenCharts)

            return yScale(value)
        }


        yAxisLabels(value) {

            if (value === true) {
                this.objects().forEach((chartObject, chartObjectName) => {
                    chartObject.categoryLabels(true)
                })
            }

            if (value === false) (
                this.objects().forEach((chartObject, chartObjectName) => {
                    chartObject.categoryLabels(false)
                })
            )

            return this

        }


        stacks(value) {

            // this._data = value
            // this._numberOfCharts = this_data.size


            // Establish conditions for parameter
            const parameterIsNull = !arguments.length
                , parameterIsString = typeof value === 'string'
                , parameterIsObject = typeof value === 'object'


            // Get data
            if (parameterIsNull) {
                return this._stacks.data()
            }


            // Query data
            if (parameterIsString) {
                return this._stacks.data(value)  // returns the requested Stack object
            }


            // Set new data
            if (parameterIsObject) {

                this._stacks = value  // value is a Stacks object in this case

                this._awaitingDomUpdateAfterDataChange = true

                return this
            }

        }


        x(value) {

            // Getter
            if (!arguments.length) {
                return this._x
            }

            // Setter
            else {

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


        y(value) {

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

                        i++

                    }
                )

                return this
            }

        }


        width(value) {

            // Getter
            if (!arguments.length) {
                return this._width
            }

            // Setter
            else {

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


        height(value) {

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

                        i++

                    }
                )

                return this
            }

        }


        colorSet(value){

            // Getter
            if (!arguments.length) {
                return this._colorTheme
            }

            // Setter
            else {
                this._colorTheme = value

                let i = 0
                this.objects().forEach( chartObject => {

                    const currentScheme = color.getChartSchemeBySchemeSetNameAndCircularIndex(this._colorTheme, i)

                    chartObject.colorScheme(currentScheme)

                    i++

                })

                return this
            }

        }


        bgText(value) {

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


        bgTextFill(value) {

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


        bgFill(value) {

            // Getter
            if (!arguments.length) {
                return this._bgFill
            }

            // Setter
            else {

                this._bgFill = value

                // Update panel background fill color
                this._backgroundObject
                    .fill(this._bgFill)

                // Update panel bridge fill color
                if(this._bridgeObject){
                    this._bridgeObject.fill(this._bgFill)
                }


                return this
            }

        }


        bgExtension(value) {

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


        innerPaddingBottom(value) {   // TODO: NOT TESTED

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

                        i++

                    }
                )


                // Set bridge position
                if (this.childObject) {
                    this.childObject._bridgeObject
                        .y(this.childObject._objectToSpawnFrom.y())
                        .height(this.childObject._objectToSpawnFrom.height())
                }

                return this
            }

        }


        innerPaddingTop(value) {   // TODO: NOT TESTED

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

                        i++

                    }
                )


                // Set bridge position
                if (this.childObject) {
                    this.childObject._bridgeObject
                        .y(this.childObject._objectToSpawnFrom.y())
                        .height(this.childObject._objectToSpawnFrom.height())
                }

                return this
            }

        }

        innerPaddingTop(value) {   // TODO: NOT TESTED

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

                        i++

                    }
                )


                // Set bridge position
                if (this.childObject) {
                    this.childObject._bridgeObject
                        .y(this.childObject._objectToSpawnFrom.y())
                        .height(this.childObject._objectToSpawnFrom.height())
                }

                return this
            }

        }
    }


    /**
     * NOTE: For this class to be instantiated, there must be <b>at least</b> a SVG element existing in DOM.
     * This is true even if the class is initiated with default parameters.
     */
    class Chart extends container.Group {


        constructor(parentContainerSelection) {

            // Superclass init //
            super(parentContainerSelection)  // Creates a container that is a child of parent container

            super.class('chart')
                .update()


            // Private parameters //
            this._label = null
            this._labelFill = 'gray'
            this._labelObject = null

            this._x = 25
            this._y = 25
            this._height = 300
            this._width = 100
            this._colorScheme = 'Greys'  // TODO: Should be replaced with dynamic statement (e.g., this.colorScheme('Greys'))
            this._colorScale = null  // Dynamically populated by .colorScheme()


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
        stack(value) {

            // Establish conditions for parameter
            const parameterIsNull = !arguments.length
                , parameterIsString = typeof value === 'string'
                , parameterIsObject = typeof value === 'object'


            // Get data
            if (parameterIsNull) {
                return this._domainStack.data()
            }


            // Query data
            if (parameterIsString) {
                return this._domainStack.data(value)
            }


            // Set new data
            if (parameterIsObject) {

                this._domainStack = value  // value is a Stack object in this case

                this._updateData()
                this.update()

                return this
            }

        }


        y(value) {

            if (!arguments.length) {
                return this._y
            } else {

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


        height(value) {

            if (!arguments.length) {
                return this._height
            } else {

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
        range(value) {

            if (!arguments.length) {
                return [this._rangeStart, this._rangeEnd]
            } else {

                // If necessary, reverse the coordinates so that the start is always at the bottom of the graph (i.e., start is greater than the end in the y coordinate). If the user specified the range in reverse (e.g., [0,400] instead of [400,0]), this corrects the issue.
                if (value[0] < value[1]) {
                    _.reverse(value)
                }

                // Set new range properties for the instance
                let [start, end] = value

                // Update instance variables for range
                this._rangeStart = start
                this._rangeEnd = end

                // Update chart y coordinate (top left edge)
                if (this._rangeEnd !== this._y) {
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
                            .height(newStart - newEnd)
                    }
                )

                return this
            }

        }


        /**
         * @param value: A D3 color scheme name. A list can be found at 'https://observablehq.com/@d3/color-schemes'.
         */
        colorScheme(value) {

            // Getter
            if (!arguments.length) {
                return this._colorScheme
            }
            // Setter
            else {

                // Set instance variable
                this._colorScheme = value

                // Generate color scale
                const interpolatorArgumentString = color.convertColorSchemeNameToD3InterpolatorArgument(value)
                const numberOfCategoriesInChart = this.objects().size

                this._colorScale = d3.scaleSequential()
                    .domain([-1, numberOfCategoriesInChart + 1])  // this domain is two items larger than the number of categories in chart, because '-1'th shade (very bright) and noOfCategories+1'th shade (very dark) will be ignored.
                    .interpolator(eval(interpolatorArgumentString))


                // Color the categories
                let i = 0
                this.objects().forEach(category => {
                    category.fill(this._colorScale(numberOfCategoriesInChart - i))  // reversed indexing, so that darker colors appear at bottom of the charts
                    i++
                })

                return this
            }

        }


        /**
         * Returns the fill colors of rectangle elements of the current chart.
         * @return {[]}
         */
        actualColors() {

            const fillColors = []

            this.objects().forEach(category => {

                const rectangle = category.objects('rectangle')
                const rectangleD3Selection = rectangle.select()
                const rectangleElement = rectangleD3Selection.nodes()[0]

                const rectangleFill = rectangleElement.getAttribute('fill')

                fillColors.push(rectangleFill)
            })

            return fillColors
        }


        update(){

            if (this._labelObject){
                this._labelObject.update()
            }

            super.update()

            return this
        }


        label(value) {

            // Getter
            if (!arguments.length) {

                return this._label

            }

            // Setter: Set label
            if ( arguments.length && value !== false )  {

                this._labelObject = new shape.Text( this.select() )

                this._labelObject.class('chart-label')
                    .text(value)
                    .x( this.x() - 125 )
                    .y( this.y() + this.height()/2 )
                    .textAnchor('middle')
                    .dominantBaseline('auto')
                    .fill(this._labelFill)
                    .rotation(270)

                return this

            }

            // // Setter: Toggle off and remove label
            // if (value === false) {
            //
            //
            //     return this
            // }

        }


        categoryLabels(value) {

            // Getter (calculates)
            if (!arguments.length) {

                const categoryLabels = []

                this.objects().forEach( (categoryObject, categoryName) => {
                    const categoryLabel = categoryObject.label()
                    categoryLabels.push(categoryLabel)
                })
                return categoryLabels
            }

            // Setter: Toggle on
            if (value === true) {

                this.objects().forEach( (categoryObject, categoryName) => {

                    categoryObject
                        .label(categoryName)
                        .update()  // TODO: This should be part of Chart.update()

                })

                return this
            }

            // Setter: Toggle off
            if (value === false) {

                this.objects().forEach((categoryObject, categoryName) => {

                    categoryObject
                        .label(false)
                        .update()  // TODO: This should be part of Chart.update()

                })

                return this
            }

        }

        /**
         * Iteratively initializes Category instances
         * @private
         */
        _draw() {

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
        _calculateVariablesDependentOnDomainStack() {

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


        _updatePropertiesOfCategoryObjects() {

            // LOOP //
            this.objects().forEach(
                (eachCategoryObject, eachCategoryId) => {

                    const start = this._rangeStack.data(eachCategoryId).get('start')
                    const end = this._rangeStack.data(eachCategoryId).get('end')
                    const percentage = this._rangeStack.data(eachCategoryId).get('percentage')

                    eachCategoryObject
                        .x(this._x)
                        .y(end)
                        .height(start - end)
                        .width(this._width)
                        .id(eachCategoryId)
                        .percentage(percentage)

                }
            )

        }

    }


    /**
     * NOTE: For this class to be instantiated, there must be <b>at least</b> a SVG element existing in DOM.
     * This is true even if the class is initiated with default parameters.
     */
    class Category extends shape.CaptionedRectangle {


        constructor(parentContainerSelection = d3.select('body').select('svg')) {

            super(parentContainerSelection)

            // Private Parameters //
            this._percentage = 10
            this.percentage(this._percentage)  // format and set percentageText object's inner text

            this._label = null
            this._labelDistance = 20
            this._labelFill = 'gray'


            this.class('category').update()

        }


        x(value) {

            // Getter
            if (!arguments.length) {
                return super.x()
            }
            // Setter
            else {

                super.x(value)

                // Update label position too, if a label exists
                if (this.objects('label')) {
                    const newXCoordinateOfLabel = this._calculateXCoordinateOfLabel()
                    this.objects('label').x(newXCoordinateOfLabel)
                }

                return this
            }
        }


        y(value) {

            // Getter
            if (!arguments.length) {
                return super.y()
            }
            // Setter
            else {

                super.y(value)

                const percentageObject = this.objects('text')

                // Update label position too, if a label exists
                if (this.objects('label')) {
                    this.objects('label').y(percentageObject.y())  // mirrors the y coord. of percentage
                }

                return this
            }
        }


        height(value) {

            // Getter
            if (!arguments.length) {
                return super.height()
            }
            // Setter
            else {

                super.height(value)

                const percentageObject = this.objects('text')

                // Update label position, if a label exists
                if (this.objects('label')) {
                    this.objects('label').y(percentageObject.y())  // mirrors the y coord. of percentage
                }

                return this
            }

        }


        percentage(value) {

            // Getter
            if (!arguments.length) {
                return this._percentage
            }
            // Setter
            else {

                this._percentage = value

                const formattedPercentageString = stringUtils.formatNumberAsPercentage(this._percentage)
                this._textObject.text(formattedPercentageString)

                return this
            }
        }


        text(value) {

            console.warn(
                '.text() method should not be used for Category class instances. ' +
                'Instead, .percentage() method must be used modify percentage text.')

            return super.text(value)

        }


        label(value) {

            // Determine what type of argument is given (if given)
            let valueType = arguments.length
                ? value.constructor.name
                : null

            // Getter
            if (valueType === null) {
                return this._label
            }

            // Setter
            if (valueType === 'String') {
                this._label = value
                this._createLabel()
                return this
            }

            // Toggle off
            if (valueType === 'Boolean' && value === false) {
                this._deleteLabel()
                return this

            }


        }


        _createLabel() {

            const labelObject = new shape.Text(this.select())
            this.objects().set('label', labelObject)

            this._updateLabel()


        }


        _updateLabel() {

            const labelObject = this.objects('label')
            const percentageObject = this.objects('text')

            const xCoordinateOfLabel = this._calculateXCoordinateOfLabel()

            labelObject
                .text(this.label())
                .class('category-label')
                .y(percentageObject.y())
                .x(xCoordinateOfLabel)
                .fill(this._labelFill)
                .textAnchor('end')
                .dominantBaseline(percentageObject.dominantBaseline())

        }


        _calculateXCoordinateOfLabel() {
            return this.x() - this.labelDistance()
        }


        _deleteLabel() {
            this._label = null
            this.objects('label').remove()
            this.objects().delete('label')
        }


        labelDistance(value) {

            // Getter
            if (!arguments.length) {
                return this._labelDistance
            }
            // Setter
            else {
                this._labelDistance = value
                const newXCoordinateOfLabel = this._calculateXCoordinateOfLabel()
                this.objects('label').x(newXCoordinateOfLabel)
                return this
            }

        }


        labelFill(value) {

            // Getter
            if (!arguments.length) {
                return this._labelFill
            }
            // Setter
            else {

                this._labelFill = value
                this.objects('label').fill(value)

                return this
            }
        }


    }


    const color = {

        schemeSets: new Map()
            .set('Single-Hue', ['Purples', 'Blues', 'Greens', 'Oranges', 'Greys', 'Reds'])
            .set('Multi-Hue', ['RdPu', 'BuPu', 'PuBu', 'YlGn', 'OrRd', 'PuBuGn', 'PuRd', 'PuRd', 'BuGn', 'YlGnBu', 'YlOrBr', 'YlOrRd'])
            .set('Blues', ['Blues'])
            .set('Greens', ['Greens'])
            .set('Greys', ['Greys'])
            .set('Oranges', ['Oranges'])
            .set('Purples', ['Purples'])
            .set('Reds', ['Reds'])
            .set('BuGn', ['BuGn'])
            .set('BuPu', ['BuPu'])
            .set('GnBu', ['GnBu'])
            .set('OrRd', ['OrRd'])
            .set('PuBuGn', ['PuBuGn'])
            .set('PuBu', ['PuBu'])
            .set('PuRd', ['PuRd'])
            .set('RdPu', ['RdPu'])
            .set('YlGnBu', ['YlGnBu'])
            .set('YlGn', ['YlGn'])
            .set('YlOrBr', ['YlOrBr'])
            .set('YlOrRd', ['YlOrRd'])
            .set('Viridis', ['Viridis'])
            .set('Inferno', ['Inferno'])
            .set('Magma', ['Magma'])
            .set('Warm', ['Warm'])
            .set('Cool', ['Cool'])
            .set('CubehelixDefault', ['CubehelixDefault'])
            .set('Plasma', ['Plasma']),


        getChartSchemeBySchemeSetNameAndCircularIndex: function (schemeSet, i) {

            schemeSet.mustBeAKeyIn(color.schemeSets)

            const specifiedTheme = color.schemeSets.get(schemeSet)
            const numberOfSchemesInSpecifiedTheme = specifiedTheme.length

            const rotatingIndex = i % numberOfSchemesInSpecifiedTheme  // ensures that i is never out of range (so that i rotates if out range).

            return specifiedTheme[rotatingIndex]
        },


        convertColorSchemeNameToD3InterpolatorArgument: function(value){

            return `d3.interpolate${value}`

        }

    }


//// UMD FOOT ////////////////////////////////////////////////////////////////////////

    //// MODULE.EXPORTS ////
    exports.version = version;
    exports.Navigator = Navigator;
    exports.Panel = Panel;
    exports.Chart = Chart;
    exports.Category = Category;
    exports.color = color;


    Object.defineProperty(exports, '__esModule', {value: true});

})));
//////////////////////////////////////////////////////////////////////////////////////

