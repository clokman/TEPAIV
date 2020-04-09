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
     * Manages mouse interaction and queries to data.
     *
     * NOTE: For this class to be instantiated, there must be <b>at least</b> a SVG element existing in DOM.
     * This is true even if the class is initiated with default parameters.
     */
    class Navigator extends container.Group {

        constructor(parentContainerSelectionOrObject) {

            // Superclass Init //
            super(parentContainerSelectionOrObject)
                .class('navigator')

            // Public Parameters //
            this.initParams = {

                datasetPath: '',  // string
                omitColumns: [],  // array of strings that should contain column names
                quantilesForContinuousColumns: [ 'Q1', 'Q2', 'Q3', 'Q4' ],

                x: 200,
                y: 25,
                width: 100,
                height: 700
            }



            this.datasetObject = null


            // Private Variables //
            this._awaitingDomUpdateAfterDataChange = false

            this._x = this.initParams.x
            this._y = this.initParams.y
            this._width = this.initParams.width
            this._height = this.initParams.height

            this._colorSet = 'Single-Hue'
            this._showAbsoluteValues = false
            this._showAbsoluteChartWidths = false
            this._animationDuration = 600
            this._strokeWidth = '0.5px'
            this._stroke = 'rgba(255, 255, 255, 1.0)'

            this._currentPanelDepth = -1  // `-1`, so that the first panel can be labeled as `panel-0`

            this._lastClickedCategoryName = null
            this._lastClickedChartName = null
            this._lastClickedPanelName = null
            this._lastClickedPanelDepth = null

            this._lastClickedCategoryObject = null
            this._lastClickedPanelObject = null

            this._modifierKeyPressedWithLastClick = null

            this._lastCreatedPanelName = null

            this._currentDrilldownPathParameter = []  // stores the drilldownTo path that generated whatever is being visualized in the navigator at a point in time

        }


        async build() {

            super.update()
            this.update()

            if (!!this.initParams.datasetPath ){
                await this.loadDataset(
                    this.initParams.datasetPath,
                    this.initParams.omitColumns,
                    this.initParams.quantilesForContinuousColumns
                )
            }


            // document.removeEventListener('click', domUtils._assessAndRecordClickProperties, true)
            document.listenForClicksAndRecordLastClickProperties()

            this._addListenerToFirstPanel()

            return this
        }

        _createPanelZeroBasedOnDataset() {

            const levelZeroDatasetSummary = this.datasetObject.summary // returns Map

            const summaryStacks = new data.Stacks()
            summaryStacks.fromNestedMap(levelZeroDatasetSummary)



            const panelObject = new NestedPanel(this.select())
                .x(this.x())
                .y(this.y())
                .width(this.width())
                .height(this.height())
                .stacks(summaryStacks)
                .showAbsoluteChartWidths( this.showAbsoluteChartWidths() )
                .bgText('Dataset')
                .bgTextFill('white')
                .height(600)   // TODO: Magic number removed
                .build()

            panelObject.yAxisLabels(true) // TODO: Why is this not chainable with the setters above?


            this.colorSet(this._colorSet)

            this._addListenerToFirstPanel()

            // Update object registry
            this.objects(panelObject.id(), panelObject)

            // Update instance registry
            this._lastCreatedPanelName = panelObject.id()
            this._currentPanelDepth += 1

        }


        /**
         *
         * @param path {String}
         * @param omitColumns {Array} - An array of strings. Each item should be a column name.
         * @param quantiles {Array} - An array of strings. Each item should be a quantile name. Any continuous column will be discretized using the number and names of quantiles given in this argument.
         * @param update {Boolean} - Should be set to false only for testing and debugging purposes
         * @return {Promise<Navigator>}
         */
        async loadDataset(
            path=this.initParams.datasetPath,
            omitColumns=this.initParams.omitColumns,
            quantiles=this.initParams.quantilesForContinuousColumns,
            update=true) {

            this._awaitingDomUpdateAfterDataChange = true

            this.datasetObject = new dataset.Dataset(path, omitColumns)
            this.datasetObject.initParams.quantilesForContinuousColumns = quantiles
            await this.datasetObject.build()

            if (update){  // should be set to false only for testing and debugging
                this.update()
            }

            return this

        }


        _addListenerToFirstPanel() {

            // TODO: REF 1: THERE MAY BE NO NEED FOR _when a category is clicked method
            // Here, simply document.listenForClicksAndRecordLastClickProperties can be used
            // And as a callback to the listenForClicksAndRecordLastClickProperties method, the clicked categories, etc may be inferred.


            this._whenACategoryIsClicked( () =>
                this._queryDataAndUpdateVisualization()
            )

        }


        /**
         * Collects information on what is clicked, and then runs the callback function, if one is provided.
         * @param callback {function}
         * @private
         */
        _whenACategoryIsClicked(callback) {

            // TODO: THIS FUNCTION IS NOT NEEDED. SEE REF-1.
            // document.listenForClicksAndRecordLastClickProperties( () => {
            //
            //     // console.log(`navigator click event records last click with shift: ${document.lastClick.wasWithShiftKey}`)
            //
            //     const clickedElement = document.lastClick.wasOnElement
            //
            //     const aNavigatorCategoryIsClicked = (
            //         clickedElement.parentElement // category
            //         && clickedElement.parentElement.parentElement // chart
            //         && clickedElement.parentElement.parentElement.parentElement // panel
            //         && clickedElement.parentElement.parentElement.parentElement.parentElement // navigator
            //
            //         && clickedElement.parentElement.className.baseVal === 'category'
            //         && clickedElement.parentElement.parentElement.parentElement.parentElement.className.baseVal === 'navigator'
            //     )
            //
            //
            //     if ( aNavigatorCategoryIsClicked ){
            //
            //         const clickedCategoryElement = clickedElement.parentElement
            //         const clickedChartElement = clickedCategory.parentElement
            //         const clickedPanelElement = clickedChartElement.parentElement
            //
            //         this._lastClickedCategoryName = clickedCategoryElement.getAttribute('id')
            //         this._lastClickedChartName = clickedChartElement.getAttribute('id')
            //         this._lastClickedPanelName = clickedPanelElement.getAttribute('id')
            //         this._lastClickedPanelDepth = Number(clickedPanelElement.getAttribute('depthIndex'))
            //
            //         this._lastClickedCategoryObject = this
            //             .objects( this._lastClickedPanelName )
            //             .objects( this._lastClickedChartName )
            //             .objects( this._lastClickedCategoryName )
            //         this._lastClickedPanelObject = this.objects( this._lastClickedPanelName )
            //
            //
            //         if ( document.lastClick.wasWithShiftKey ) {this._modifierKeyPressedWithLastClick = 'shift'}
            //         if ( document.lastClick.wasWithCtrlKey ) {this._modifierKeyPressedWithLastClick = 'ctrl'}
            //         if ( document.lastClick.wasWithAltKey ) {this._modifierKeyPressedWithLastClick = 'alt'}
            //         if ( document.lastClick.wasWithMetaKey ) {this._modifierKeyPressedWithLastClick = 'meta'}
            //         if (   !document.lastClick.wasWithShiftKey
            //             && !document.lastClick.wasWithCtrlKey
            //             && !document.lastClick.wasWithAltKey
            //             && !document.lastClick.wasWithMetaKey ) {
            //
            //             this._modifierKeyPressedWithLastClick = null
            //         }
            //
            //
            //         callback.call(this)  // execute the callback statement
            //
            //         this._whenACategoryIsClicked(callback) // keep listening
            //     }
            //
            //
            //
            // })




            // this._goingDeeper = clickedPanelDepth === this._currentPanelDepth
            // this._stayingAtSameLevel = clickedPanelDepth === this._currentPanelDepth - 1
            // this._goingUpward = clickedPanelDepth === this._currentPanelDepth - 2  // TODO: This MUST be changed from a magic number to a generalizable algorithm
            // callback.call(this)  // execute the callback statement


            // this._whenACategoryIsClicked(callback)  // keep listening


            this.select() // this first select is not a D3 method
                .selectAll('.category')
                .on('click', (d, i, g) => {

                    // console.log('local listener reporting')

                    // console.log(`navigator click event records last click with shift: ${document.lastClick.wasWithShiftKey}`)

                    const clickedCategory = g[i]
                    const clickedChart = g[i].parentNode
                    const clickedPanelElement = g[i].parentNode.parentNode

                    if (clickedPanelElement.getAttribute('class') === 'panel') {   // TODO: This if block is a workaround to prevent non-panel .category class objects from being processed. When the d3.selection issue is fixed, this block should not be in an if statement.

                        this._lastClickedCategoryName = clickedCategory.getAttribute('id')
                        this._lastClickedChartName = clickedChart.getAttribute('id')
                        this._lastClickedPanelName = clickedPanelElement.getAttribute('id')
                        this._lastClickedPanelDepth = Number(clickedPanelElement.getAttribute('depthIndex'))

                        this._lastClickedCategoryObject = this
                            .objects(this._lastClickedPanelName)
                            .objects(this._lastClickedChartName)
                            .objects(this._lastClickedCategoryName)
                        this._lastClickedPanelObject = this.objects(this._lastClickedPanelName)


                        this._registerLastClickedModifierKey()


                        // this._goingDeeper = clickedPanelDepth === this._currentPanelDepth
                        // this._stayingAtSameLevel = clickedPanelDepth === this._currentPanelDepth - 1
                        // this._goingUpward = clickedPanelDepth === this._currentPanelDepth - 2  // TODO: This MUST be changed from a magic number to a generalizable algorithm
                        callback.call(this)  // execute the callback statement

                    }

                    this._whenACategoryIsClicked(callback)  // keep listening

                })

        }


        _registerLastClickedModifierKey() {

            if (document.lastClick.wasWithShiftKey) {
                this._modifierKeyPressedWithLastClick = 'shift'
            }
            if (document.lastClick.wasWithCtrlKey) {
                this._modifierKeyPressedWithLastClick = 'ctrl'
            }
            if (document.lastClick.wasWithAltKey) {
                this._modifierKeyPressedWithLastClick = 'alt'
            }
            if (document.lastClick.wasWithMetaKey) {
                this._modifierKeyPressedWithLastClick = 'meta'
            }
            if (!document.lastClick.wasWithShiftKey
                && !document.lastClick.wasWithCtrlKey
                && !document.lastClick.wasWithAltKey
                && !document.lastClick.wasWithMetaKey) {

                this._modifierKeyPressedWithLastClick = null
            }
        }


        _whenABackgorundIsClicked(callback) {

            this.select() // this first select is not a D3 method
                .selectAll('.background')
                .on('click', (d, i, g) => {

                    const clickedBackgroundElement = g[i]
                    const clickedPanelElement = g[i].parentNode
                    const clickedOnAPanelBackground = clickedPanelElement.getAttribute('class') === 'panel'

                    if ( clickedOnAPanelBackground ) {   // TODO: This if block is a workaround to prevent non-panel .category class objects from being processed. When the d3.selection issue is fixed, this block should NOT be in an if statement.

                        this._lastClickedCategoryName = null
                        // this._lastClickedCategoryName = clickedBackgroundElement.textContent // this is not a mistake; the id of a panel is the name of the category it is spawned from
                        this._lastClickedPanelName = clickedPanelElement.getAttribute('id')

                        // const clickedChart = this
                        //     .objects( this._lastClickedPanelName )  // get panel
                        //     ._objectToSpawnFrom
                        //     .select().element.parentElement
                        // this._lastClickedChartName = clickedChart.getAttribute('id')

                        this._lastClickedPanelDepth = Number(clickedPanelElement.getAttribute('depthIndex'))

                        // this._lastClickedCategoryObject = this
                        //     .objects(this._lastClickedPanelName)
                        //     .objects(this._lastClickedChartName)
                        //     .objects(this._lastClickedCategoryName)
                        this._lastClickedPanelObject = this.objects(this._lastClickedPanelName)

                        callback.call(this)  // execute the callback statement

                    }

                    this._whenABackgorundIsClicked(callback)  // keep listening

                })

        }


        update(transitionDuration) {

            // Keep DOM in line with underlying data
            this._updateDomIfStacksDataHasChanged()

            // Update panel zero (which, in turn, will update its children)
            const panelZero = this.get('panelZero')
            if (!!panelZero){
                panelZero
                    .x( this.x() )
                    .y( this.y() )
                    .width( this.width() )
                    .height( this.height() )
                    .showAbsoluteValues( this.showAbsoluteValues() )
                    .showAbsoluteChartWidths( this.showAbsoluteChartWidths() )
                    .colorSet( this.colorSet() )
                    .animationDuration( this.animationDuration() )
                    .strokeWidth( this.strokeWidth() )
                    .stroke( this.stroke() )
            }




            super.update(transitionDuration)

            return this

        }


        get( query ){

            let result

            if ( query === 'panelZero' ){

                const navigatorContainsAtLeastOnePanel = this.objects().size

                result = navigatorContainsAtLeastOnePanel
                    ? this.objects().values().next().value
                    : null
            }

            return result

        }

        _updateDomIfStacksDataHasChanged() {

            if (this._awaitingDomUpdateAfterDataChange) {

                this._createPanelZeroBasedOnDataset()

                this._awaitingDomUpdateAfterDataChange = false
            }

        }


        _queryDataAndUpdateVisualization() {

            // Remove any panels if necessary
            // this._removeAnyPanelsDeeperThanTheClickedOne()

            // Query the data based on the clicked category
            this._updateCurrentDrillDownPathParameterBasedOnLastClickedCategory()
            let drilldownResult = this.datasetObject.drilldownAndSummarize(this._currentDrilldownPathParameter)

            // Sort drilldown results so that categories always appear in the same order as in panel-0
            drilldownResult.forEach((columnObject, columnName) => {
                const columnObjectInDatasetSummary = this.datasetObject.summary.get(columnName)
                const sortedColumnObject = columnObject.sortAccordingTo(columnObjectInDatasetSummary)
                drilldownResult.set(columnName, sortedColumnObject)
            })

            // Convert query results to Stacks
            const drilldownResultStacks = new data.Stacks()
                .fromNestedMap(drilldownResult)


            // Create a new child panel based on query results
            this._createChildPanelBasedOnStacks(drilldownResultStacks)

            this._listenForClicksOnPanelBackgroundsAndTreatClickedBackgroundsAsCollapsePoints()
        }


        _listenForClicksOnPanelBackgroundsAndTreatClickedBackgroundsAsCollapsePoints() {
            this._whenABackgorundIsClicked(
                () => {

                    this._removeAnyPanelsDeeperThanTheClickedOne()

                })
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

            const childIsASibling = (this._modifierKeyPressedWithLastClick === 'shift')

            let childPanelObject


            // Create the new child panel as the child of the last clicked panel

            if (!childIsASibling){
                childPanelObject = new NestedPanel(
                    this._lastClickedPanelObject,
                    this._lastClickedCategoryObject
                )
            }

            if (childIsASibling){
                childPanelObject = new NestedPanel(
                    this._lastClickedPanelObject,
                    this._lastClickedCategoryObject,
                    'sibling'
                )
            }

            childPanelObject
                .stacks(drilldownResultStacks)
                .build()

            const totalDurationOfChildPanelInitializationAnimations = (
                childPanelObject._animation.duration.extendBridge
                + childPanelObject._animation.duration.maximizePanelCover
            )

            childPanelObject
                .bgText(this._lastClickedCategoryName)
                .bgTextFill('white')
                .update(totalDurationOfChildPanelInitializationAnimations)  // If too short, update duration cuts off animation times in Panel object.

            // Add the newly related child panel to objects registry
            this.objects(childPanelObject.id(), childPanelObject)

            // Update instance registry
            this._lastCreatedPanelName = childPanelObject.id()
            this._currentPanelDepth += 1


            // Remove the chart of the child panel that is being drilled down in parent
            // (i.e., if user clicked on 'Male' on parent, 'Gender' category should not be visible in child panel)
            this._currentDrilldownPathParameter.forEach((step) => {

                Object.entries(step).forEach(([columnName, categoryName]) => {

                    // Remove chart element
                    childPanelObject.objects(columnName).remove()
                    // Remove chart from objects registry
                    childPanelObject.objects().delete(columnName)

                })

            })

            return this

        }


        _removeAnyPanelsDeeperThanTheClickedOne() {

            const numberOfPanelsThatWillRemainUnchangedAfterClick = this._lastClickedPanelDepth + 1

            if (this.objects().size >= numberOfPanelsThatWillRemainUnchangedAfterClick) {

                const numberOfExtraPanels = this.objects().size - numberOfPanelsThatWillRemainUnchangedAfterClick

                // Remove panels
                this.objects().forEach( (panelObject, panelName) => {

                    if ( panelObject.depthIndex() > this._lastClickedPanelDepth ){
                        panelObject.remove()
                    }

                })

                // Clear object registry from the removed panels
                this.removeLast(numberOfExtraPanels)

                this._lastClickedPanelObject.childrenPanels.clear()
            }
        }


        showAbsoluteValues(value) {

            // Getter
            if (!arguments.length){
                return this._showAbsoluteValues
            }

            // Setter
            else{
                value.mustBeOfType('Boolean')
                this._showAbsoluteValues = value

                return this
            }

        }


        showAbsoluteChartWidths(value) {

            // Getter
            if (!arguments.length){
                return this._showAbsoluteChartWidths
            }

            // Setter
            else{
                value.mustBeOfType('Boolean')
                this._showAbsoluteChartWidths = value

                return this
            }

        }


        colorSet(value){

            // Getter
            if (!arguments.length) {
                return this._colorSet
            }

            // Setter
            else {

                this._colorSet = value

                return this
            }
        }

        animationDuration(value) {

            // Getter
            if (!arguments.length){
                return this._animationDuration
            }

            // Setter
            else{
                value.mustBeOfType('Number')
                this._animationDuration = value

                return this
            }

        }

        strokeWidth(value){

            if (!arguments.length) {
                return this._strokeWidth
            }
            else {
                this._strokeWidth = value
                return this
            }
        }

        stroke(value){

            if (!arguments.length) {
                return this._stroke
            }
            else {
                this._stroke = value
                return this
            }
        }


        x(value) {

            // Getter
            if (!arguments.length){
                return this._x
            }

            // Setter
            else{
                value.mustBeOfType('Number')
                this._x = value

                return this
            }

        }



        // TODO: If multiple panels are open, this moves only the first panel
        //  NestedPanel's .y() method should be changed to accommodate child panels.
        y(value) {

            // Getter
            if (!arguments.length){
                return this._y
            }

            // Setter
            else{
                value.mustBeOfType('Number')
                this._y = value

                return this
            }

        }


        width(value) {

            // Getter
            if (!arguments.length){
                return this._width
            }

            // Setter
            else{
                value.mustBeOfType('Number')
                this._width = value

                return this
            }

        }


        // TODO: If multiple panels are open, this moves only the first panel
        //  NestedPanel's .height() method should be changed to accommodate child panels.
        height(value) {

            // Getter
            if (!arguments.length){
                return this._height
            }

            // Setter
            else{
                value.mustBeOfType('Number')
                this._height = value

                return this
            }

        }

    }




    /**
     * Manages panel creation, modification, nesting, and removal
     *
     * NOTE: For this class to be instantiated, there must be <b>at least</b> a SVG element existing in DOM.
     * This is true even if the class is initiated with default parameters.
     */
    class Panel extends container.Group {

        constructor(parentContainerSelectionOrObject) {

            // Superclass Init //
            super(parentContainerSelectionOrObject)

            this.class('panel')
                .update()

            this._backgroundObject = null

            this._bgExtension = {
                left: 0,
                right: 0
            }


            this._defaults = {
                x: 25,
                y: 25,
                width: 100,
                height: 500,

                innerPadding: {
                    top: 30,
                    bottom: 10,
                    left: 10,
                    right: 10,
                    extraPaddingForLeftEdgeOfPanel0Bg: 20
                },

                paddingBetweenCharts: 0.05,  // proportion

                bgFill: 'lightgray',

                strokeWidth: '0.5px',
                stroke: 'rgba(255, 255, 255, 1.0)'

            }


            this._bgFill = this._defaults.bgFill

            this._bgText = 'Panel label'
            this._bgTextFill = 'darkgray'

            this._backgroundObject = null

            this._strokeWidth = this._defaults.strokeWidth
            this._stroke = this._defaults.stroke

            this._yAxisLabelsAreVisible = false

            this._outerPadding = {  // distance between parent and child panel in pixels
                top: 15,
                bottom: 38
            }


            this._x = this._defaults.x
            this._y = this._defaults.y


            this._width = this._defaults.width
            this._height = this._defaults.height


            this._innerPadding = {  // reflects current values in a given time
                top: this._defaults.innerPadding.top,
                bottom: this._defaults.innerPadding.bottom,
                left: this._defaults.innerPadding.left,
                right: this._defaults.innerPadding.right,
                extraPaddingForLeftEdgeOfPanel0Bg: this._defaults.innerPadding.extraPaddingForLeftEdgeOfPanel0Bg
            }

            // Formulas
            this.innerX = () => this._x + this._innerPadding.left
            this.innerY = () => this._y + this._innerPadding.top
            this.innerWidth = () => this._width - this._innerPadding.left - this._innerPadding.right
            this.innerHeight = () => this._height - this._innerPadding.top - this._innerPadding.bottom
            this.rightEdge = () => this.x() + this.width() + this.bgExtensionRight()
            this.leftEdge = () => this.x() - this.bgExtensionLeft()
            this.rightEdgeOfCharts = () => this.rightEdge() - this._innerPadding.right - this.bgExtensionRight()
            this.leftEdgeOfCharts = () => this.x() + this._innerPadding.left

            // Inferences
            this.has = { // this object groups methods that report a primitives (with the exception of formulas)
                numberOfVisibleCategories: () => this._numberOfVisibleCategories()
            }

            this._colorTheme = 'Single-Hue'

            this._showAbsoluteValues = false

            this._stacks = null

        }


        /**
         * Besides allowing loading datasets asynchronously, this async block separates
         * initialization of the Panel instance from drawing it on DOM. This way, instance parameters
         * can be modified before the panel is drawn on DOM for the first time.
         */
        build( ) {

            // If no data specified, build panel with example data
            if ( !this.stacks() ) {
                this._populateWithExampleData()
            }

            // Draw the panel //
            // TODO: Container.objects() implementation SHOULD be changed so that _backgroundObject and _bridgeObject would also be included in objects()
            this._createBackgroundObject()

            this._createChartsBasedOnStacksData()

            this.update(0)

            return this
        }

        remove(){

            // Remove self
            super.remove()

        }


        update(transitionDuration) {

            this._updateDomIfStacksDataHasChanged()
            this._adjustAll()

            this._updateYAxisLabels()
            if (this._backgroundObject){
                this._backgroundObject.update(transitionDuration)
            }

            super.update(transitionDuration)  // triggers chart updates

            // Post-super update statements
            this._verticallyAlignYAxisChartLabels()  // must come after super update; otherwise chart labels do not align (for Panel class only they are OK for Navigator class, even though Navigator uses Panel class too).

            return this

        }


        /**
         * When testing this functionality an async test should be used
         * WARNING: Panel or NestedPanel does not have query capabilities!
         *  Therefore, the lack of a `loadDataset` method is intentional.
         * @param {string} path
         * @param {string} omitColumns
         */
        async summarizeDataset(path, omitColumns){

            // Load data to Dataset object
            const datasetObject = new dataset.Dataset(path, omitColumns)
            await datasetObject.build()

            // Generate stacks from dataset object
            const datasetSummary = datasetObject.summarize()
            const stacksObject = new data.Stacks()
            stacksObject.fromNestedMap(datasetSummary)

            // Load Stacks object into panel
            this.stacks(stacksObject)

            return this
        }


        _adjustAll(){

            if ( !!this._backgroundObject ){
                this._adjustBackgroundProperties()
            }
            this._adjustCategoryCaptions()
            this._adjustChartProperties()
        }


        _adjustChartProperties() {


            let i = 0
            this.objects().forEach(
                (chartObject, chartName) => {

                    const currentColorScheme = color.getChartSchemeBySchemeSetNameAndCircularIndex(this._colorTheme, i)

                    chartObject
                        .x( this.innerX() )
                        .y( this._yScale(i) )
                        .width( this.innerWidth() )
                        .height( this._chartHeights() )
                        .colorScheme( currentColorScheme )
                        .strokeWidth( this._strokeWidth )
                        .stroke( this._stroke )

                    i++

                }
            )
        }


        _updateDomIfStacksDataHasChanged() {  // TODO: This method introduces a new pattern: Now, after the data of an object is updated, myObject.update() method must be called to update DOM. This behavior MUST be implemented also for navigator.Chart() and other classes that allow updating their data with a setter.

            if (this._awaitingDomUpdateAfterDataChange) {

                this.removeAll()
                this._createChartsBasedOnStacksData()

                this._awaitingDomUpdateAfterDataChange = false
            }

        }


        _createBackgroundObject() {

            this._backgroundObject = new shape.CaptionedRectangle( this.select() )

            this._adjustBackgroundProperties()

        }


        _adjustBackgroundProperties() {

            this._backgroundObject
                .textAlignment('top-left')
                .class('background')
                .x( this.x() - this.bgExtensionLeft() )
                .y( this.y() )
                .height( this.height() )
                .width( this.bgExtensionLeft() + this.width() + this.bgExtensionRight() )
                .fill( this._bgFill )
                .text( this._bgText )
                .textFill( this._bgTextFill )
                .strokeWidth( this.strokeWidth() )
                .stroke ( this.stroke() )

        }


        _createChartsBasedOnStacksData() {

            // loop //
            let i = 0
            this.stacks().data().forEach(
                (eachStackObject, eachStackId) => {

                    const chart = new Chart(this.select())
                        .stack(eachStackObject)
                        .id(eachStackId)
                        .x(this.innerX())
                        .y(this._yScale(i))
                        .height(this._chartHeights())
                        .width(this.innerWidth())
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


        _resetVerticalInnerPadding(){

            // Set padding values to their default values
            this.innerPaddingTop( this._defaults.innerPadding.top )
            this.innerPaddingBottom ( this._defaults.innerPadding.bottom )

            return this
        }


        _chartCount() {
            return this.stacks().data().size
        }


        _chartHeights() {

            const totalPaddingBetweenCharts = this.innerHeight() * this._defaults.paddingBetweenCharts

            const chartHeights = (this.innerHeight() - totalPaddingBetweenCharts) / this._chartCount()
            const roundedChartHeights = Math.round(chartHeights)

            return roundedChartHeights
        }


        _yScale(value) {

            const rangeStart = this.innerY() + this.innerHeight()
            const rangeEnd = this.innerY()

            const yScale = d3.scaleBand()
                .domain(d3.range(this._chartCount()))
                .rangeRound([rangeStart, rangeEnd])
                .paddingInner(this._defaults.paddingBetweenCharts)

            return yScale(value)
        }


        yAxisLabels(value) {

            if (value === true) {
                this._yAxisLabelsAreVisible = true
            }

            if (value === false) {
                this._yAxisLabelsAreVisible = false
            }

            return this

        }


        _updateYAxisLabels () {

            if ( this._yAxisLabelsAreVisible ) {


                let chartLabelFontSize = 0

                this.objects().forEach( (chartObject, chartObjectName) => {

                    chartObject
                        .categoryLabels(true)
                        .chartLabel(true)
                        .chartLabel(chartObjectName)
                        .update()  // this update must be here or things may break

                        const chartLabelFontSizeAsString = chartObject._chartLabelObject.fontSize()
                        chartLabelFontSize = parseInt(chartLabelFontSizeAsString.match(/\d+/), 10)

                })


                const farthestLeftPointOfLabelsArea =
                    this._getXCoordinateOfFarthestChartLabel()
                    - chartLabelFontSize

                const leftExtensionValue =
                    Math.abs(
                         Math.abs( this.x() )
                          - Math.abs( farthestLeftPointOfLabelsArea )
                    ) + this._innerPadding.left + this._innerPadding.extraPaddingForLeftEdgeOfPanel0Bg
                this.bgExtensionLeft( leftExtensionValue )


            }


            if ( !this._yAxisLabelsAreVisible ) {

                this.objects().forEach((chartObject, chartObjectName) => {
                    chartObject
                        .categoryLabels(false)
                        .chartLabel(false)

                })

            }

            return this

        }


        _verticallyAlignYAxisChartLabels () {

            const targetXCoordinateForAllLabels = this._getXCoordinateOfFarthestChartLabel()

            this.objects().forEach( (chartObject, chartName) => {

                if ( chartObject._chartLabelObject ){

                    const xCoordinateOfLabel = chartObject._chartLabelObject.x()
                    const currentPadding = chartObject.chartLabelPaddingRight()
                    const paddingToBeAdded = Math.abs( Math.abs(targetXCoordinateForAllLabels) - Math.abs(xCoordinateOfLabel) ) // absolute values, because coordinates may be negative
                    chartObject
                        .chartLabelPaddingRight( currentPadding + paddingToBeAdded)
                        .update()

                }
            })

        }


        _getXCoordinateOfFarthestChartLabel () {  // 'farthest' is not a typo

            // Collect all x coordinates of chart labels
            let xCoordinatesOfAllChartLabels = []
            this.objects().forEach( (chartObject, chartName) => {

                if (chartObject._chartLabelObject){
                    const xCoordinate = chartObject._chartLabelObject.x()
                    xCoordinatesOfAllChartLabels.push(xCoordinate)
                }
            })

            // If any x coordinates are found (i.e., labels are on/initialized),
            // get the leftmost x coordinate in relation to the panel
            let farthestXCoordinate
            if (xCoordinatesOfAllChartLabels.length){
                farthestXCoordinate = _.min(xCoordinatesOfAllChartLabels)
            }

            return farthestXCoordinate

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
                return this._stacks
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

                this._adjustAll()

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

                this._adjustAll()

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

                this._adjustAll()

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

                this._adjustAll()

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

                return this
            }

        }



        showAbsoluteValues(value) {

            // Getter
            if (!arguments.length){
                return this._showAbsoluteValues
            }

            // Setter
            else{
                value.mustBeOfType('Boolean')

                this._showAbsoluteValues = value

                return this
            }

        }


        _adjustCategoryCaptions() {

            this.objects().forEach( (categoryObject, categoryName) => {

                categoryObject.showAbsoluteValues( this._showAbsoluteValues )

            })
        }


        bgText(value) {

            // Getter
            if (!arguments.length) {
                return this._bgText
            }

            // Setter
            else {

                this._bgText = value

                this._adjustAll()

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

                this._adjustAll()

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

                this._adjustAll()

                return this
            }

        }


        /**
         * @param value
         * @return {number|Panel}
         */
        bgExtensionRight(value) {

            // Getter
            if (!arguments.length) {
                return this._bgExtension.right
            }

            // Setter
            else {

                this._bgExtension.right = value

                this._adjustAll()

                return this
            }

        }


        /**
         * @param value
         * @return {number|Panel}
         */
        bgExtensionLeft(value) {

            // Getter
            if (!arguments.length) {
                return this._bgExtension.left
            }

            // Setter
            else {

                // Set new property
                this._bgExtension.left = value

                this._adjustAll()

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

                this._adjustAll()

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

                this._adjustAll()

                return this
            }

        }

        strokeWidth(value){

            if (!arguments.length) {
                return this._strokeWidth
            }
            else {
                this._strokeWidth = value
                return this
            }
        }

        stroke(value){

            if (!arguments.length) {
                return this._stroke
            }
            else {
                this._stroke = value
                return this
            }
        }


        largestTotalCount(){

            return this.stacks().largestTotalCount()

        }


        /**
         * Use via `Panel.get` object
         * @return {number}
         * @private
         */
        _numberOfVisibleCategories(){
            let categoryCount = 0
            const numberOfCategoriesInPanel = this.objects().forEach((chartObject, chartName) => {
                chartObject.objects().forEach((categoryObject, categoryName) => {

                    if( categoryObject.visibility() === 'visible' ){
                        categoryCount++
                    }

                })
            })
            return categoryCount
        }

    }


    class NestedPanel extends Panel {


        constructor(parentContainerSelectionOrObject, objectToSpawnFrom, addAs='singleton') {

            // Superclass Init //
            super(...arguments)

            // Register arguments
            this.arguments = {
                parentContainerSelectionOrObject: parentContainerSelectionOrObject,
                objectToSpawnFrom: objectToSpawnFrom,
                addAs: addAs
            }


            // Infer objects from arguments

            this.objectToSpawnFrom = this.arguments.objectToSpawnFrom

            // Do not move this block to _inferParentChildRelationships method. This inference must be done before the _inferParentChildRelationships() inferences.
            this.parentPanel = (
                this.arguments.parentContainerSelectionOrObject
                && this.arguments.parentContainerSelectionOrObject.hasType( this.hasType() )
            )
                ? parentContainerSelectionOrObject
                : null


            // Parameters
            this._showAbsoluteChartWidths = false

            // Formulas
            this.absoluteWidthOfChildPanel = (childPanelObject) => {
                const width = this._width *  (childPanelObject.largestTotalCount() / this.largestTotalCount() ) + this._innerPadding.left + this._innerPadding.right
                const roundedWidth = _.round(width, 1)
                return roundedWidth
            }


            this.childrenPanels = new Map()
            this._bridgeObject = null


            this.class('panel')
                // .update()   // `update()` commented out during init-build split


            this._animation = {

                spawnStyle: null,

                duration: {  // in milliseconds

                    total: (!!this.parentPanel
                        ? this.parentPanel.animationDuration()
                        : 600  // arbitrary value; can be modified
                    ),

                    // Stage 1
                    extendBridge: null,
                    appendSibling: null,
                    retractAndExtend: null,
                    retract: null,
                    lateralSwitch: null,

                    // Stage 2
                    maximizePanelCover: null,
                    backgroundAdjustment: null,
                    collapseBackground: null

                }
            }


            // Add defaults for the NestedPanel to the defaults property of Panel
            // NOTE: Defaults should ONLY be called to get default values, and not current values
            this._defaults.paddingBetweenSiblingPanels = 5  // in pixels

            this._paddingBetweenSiblingPanels = this._defaults.paddingBetweenSiblingPanels


            // TODO: `has` object should report only primitives. All properties in `has` object that returns
            //   objects (e.g., a NestedPanel object) should be moved to a `get`, `grab`, or `retrieve` method.
            // Inferences (mainly parent-child relationships, which are to be calculated by `_inferParentChildRelationships()` method
            this.has = {
                // childPanel: false, // Not supported. Should be calculated manually, real-time
                ...this.has,  // inherit items form super's `has` object (`super` keyword does not work here)
                sibling: false,
                numberOfSiblings: 0,
                siblingObjectsOnRightSide: null,
                parentWithNumberOfChildren: 0,
                beenAddedAsSibling: false,
                parentWithRightmostChildPanelObject: null,
                parentPanel: false,
                grandParentPanel: false,
                parentWithAnyChild: false,
                parentWithAnotherChild: false,
                parentWithAnyGrandChild: false,
                parentWithAnyChildButNoGrandchildren: false,
                parentWithIdenticalChild: false,
                beenFullyInstantiated: false
            }


        }


        build() {

            // Infer animation durations
            this._inferAnimationDurations()

            // At this point in code, this panel is still not added to parent panel
            // Therefore, inferences are form a state where this panel is not yet in the picture
            this._inferParentChildRelationships()

            // At this point in code, these are equal (once nestedPanel is fully instantiated, parentWithRightmostChildPanelObject would be inferred as the current panel)
            // NOTE: Use `this.has.leftSiblingObject` property instead. `this._leftSiblingObject` is here for one-time private storage of `this.has.parentWithRightmostChildPanelObject` at init time.
            this._leftSiblingObject = this.has.parentWithRightmostChildPanelObject



            // Throw error if no parent specified
            if (this.has.parentPanel && !this.objectToSpawnFrom) {
                throw Error('The panel is specified to be a child of another panel, but no object is specified as spawn source (missing argument).')
            }

            this._numberOfAlreadyExistingSiblingsBeforeAddingThisPanel =
                this.has.parentWithNumberOfChildren

            // Assign  depth index value
            this._depthIndexValue = this.has.parentPanel
                ? this.parentPanel.depthIndex() + 1
                : 0


            // Automatically generate and assign panel id
            const panelId =
                !!this.id()       // if an id is provided by user
                    ? this.id()   // use that id
                    : this.has.parentPanel
                        ? this.has.beenAddedAsSibling
                            ? `panel-${ this.depthIndex() }-${ this.has.parentWithNumberOfChildren }`
                            : `panel-${ this.depthIndex() }-${ 0 }`
                        : 'panel-0-0'  // if there is no user-assigned id nor parent panel, give this id
            this.id(panelId)//.update(0)  //   // `update()` commented out during init-build split


            // Automatically assign background color based on the parent (if there is one)
            this._bgFill = this.has.parentPanel
                ? this.objectToSpawnFrom.fill()
                : this._defaults.bgFill


            // Set properties based on parent
            if (this.has.parentPanel) {

                // Start off-screen
                this.x(  0 - this.parentPanel.x() - this.parentPanel.width() )
                    // .update(0)    // `update()` commented out during init-build split

                const shouldShowAbsoluteChartWidths = this.showAbsoluteChartWidths() || this.parentPanel.showAbsoluteChartWidths()
                if ( shouldShowAbsoluteChartWidths  ){
                    this.showAbsoluteChartWidths(true)
                }

                const dataIsProvidedDuringInit = !!this.stacks()

                if ( shouldShowAbsoluteChartWidths && !dataIsProvidedDuringInit  ) {

                    // Warn if absolute chart widths is asked for but no data is provided during init
                    console.warn(`[Build warning]: "showAbsoluteChartWidths()" is set to "true" but no data is provided during NestedPanel instance initialization. 
                    In this scenario, the NestedPanel is initiated with example data and it may not really visualize absolute values. 
                    Importantly, build parameters are calculated from this example data. If some other data is provided to the 
                    NestePanel after the build operation with example data, animation glitches may occur. To display absolute values 
                    correctly, a "Stacks" object should be provided as data before building the NestedPanel.`)

                    // If no data specified, build panel with example data
                    if ( !this.stacks() ) {
                        this._populateWithExampleData()
                    }
                }


                this._width = this.showAbsoluteChartWidths() ||
                ( !!this.parentPanel && this.parentPanel.showAbsoluteChartWidths() )
                    ? this.parentPanel.absoluteWidthOfChildPanel( this )
                    : this.parentPanel.width()

                if (this.objectToSpawnFrom){

                    this.preAnimationProperties = {
                        objectToSpawnFrom: {
                            height: this.objectToSpawnFrom.height(),
                            y: this.objectToSpawnFrom.y()
                        }
                    }
                }

                const siblingPanelOnLeftSide = this.has.parentWithRightmostChildPanelObject

                this.postCreationAnimationProperties = {

                    x: this.has.beenAddedAsSibling

                        ?    siblingPanelOnLeftSide.x()
                           + siblingPanelOnLeftSide.width()
                           + this._paddingBetweenSiblingPanels

                        : this.parentPanel.x() + this.parentPanel.width(),

                    y: this.parentPanel.y() + this._outerPadding.top,
                    width: this.width(),
                    height: this.parentPanel.height() - this._outerPadding.bottom

                }
            }


            super.build()
            // Update the single panel that is created by superclass so that the
            // ... properties unique to NestedPanel are updated and reflected to DOM
            // this.update(0)  // `update()` commented out during init-build split

            // Create as a child panel
             if (this.has.parentPanel) {
                 this._inferSpawnAnimationType()
                 this._embedAsChildPanel()
                 this._adjustAllPanels()
            }


            setTimeout(() => {
                // this.updateAllPanels()  // if an update needs to be added to the end, this could be a harmless way to do it (i.e., without cutting a previous update operation in half)
                this.has.beenFullyInstantiated = true
            }, this.animationDuration())

            return this
        }


        updateAllPanels(transitionDuration) {

            this.topmostAncestor().update(transitionDuration)

        }


        /**
         * Updates the current panel and triggers updates downstream
         */
        update( transitionDuration, thisPanel=this ) {

            const thereIsAChildPanel = (
                !!thisPanel.childrenPanels
                && !!thisPanel.childrenPanels.size
            )


            thisPanel._adjustAllPanels()

            thisPanel.select()
                .attr( 'depthIndex', thisPanel.depthIndex() )

            if (!!thisPanel.objectToSpawnFrom) {
                thisPanel._backgroundObject.update()
            }

            if (!!thisPanel._bridgeObject){
                thisPanel._bridgeObject.update( transitionDuration )
            }

            super.update(transitionDuration)


            if (thereIsAChildPanel){
                thisPanel.childrenPanels.forEach( (childPanelObject, childPanelName) => {

                    // Recursion
                    childPanelObject.update(transitionDuration, childPanelObject)

                })
            }

            return this

        }


        _adjustAllPanels() {
            // Unlike the _adjustAll of superclass, this method affects other panels
            // The functionality of the _adjustAll method of superclass is covered in _adjust method

            // Uppropagate to the topmost ancestor (so it can downpropagate)
            if ( this._animation ){  // TODO: Why is `this._animation` condition necessary? Don't all panels have an _animation property?
                this.topmostAncestor().animationDuration( this.animationDuration() )
            }


            // Adjust top ancestor and all panels downstream from it
            this.topmostAncestor()._adjustDownstream()

        }

        /**
         * Adjusts the current panel and triggers adjustments downstream
         */
        _adjustDownstream(thisPanel=this ){

            super._adjustAll.call(thisPanel)  // super's `_adjustAll` does not propagate any values to other panels

            // Infer parent-child relationships
            if ( !!thisPanel.parentPanel || (!!thisPanel.childrenPanels && !!thisPanel.childrenPanels.size) ){
                thisPanel._inferParentChildRelationships()
            }

            // Downpropagate animation duration of `this` panel
            if( !!thisPanel._animation ) {
                thisPanel.animationDuration( this.animationDuration() )  // use of `this` is intentional
            }

            // Adjust bridge
            if (!!thisPanel._bridgeObject) {
                thisPanel._adjustBridgeProperties()
            }

            // Adjust background color
            if (!!thisPanel.objectToSpawnFrom) {
                thisPanel.bgFill( thisPanel.objectToSpawnFrom.fill() )
            }


            // If there are child panels
            if (!!thisPanel.childrenPanels && !!thisPanel.childrenPanels.size){
                thisPanel.childrenPanels.forEach( (childPanelObject, childPanelId) => {

                    // Propagate values that need to be passed to child
                    childPanelObject
                        .showAbsoluteValues( this.showAbsoluteValues() )  // use of 'this' is not a mistake here
                        .showAbsoluteChartWidths( this.showAbsoluteChartWidths() )
                        .colorSet( this.colorSet() )
                        .strokeWidth( this.strokeWidth() )
                        .stroke( this.stroke() )


                    // Set absolute chart widths if necessary
                    const newWidth = childPanelObject.showAbsoluteChartWidths()
                        ? thisPanel.absoluteWidthOfChildPanel( childPanelObject )
                        : thisPanel._width
                    childPanelObject.width( newWidth )


                    if (childPanelObject._animation) {
                        childPanelObject.animationDuration ( this.animationDuration() )
                    }


                    // Recursion
                    this._adjustDownstream( childPanelObject )

                })
            }

        }


        _embedAsChildPanel() {

            this.preAnimationProperties.objectToSpawnFrom.y = this.objectToSpawnFrom.y()
            this.preAnimationProperties.objectToSpawnFrom.height = this.objectToSpawnFrom.height()

            if ( this._animation.spawnStyle === 'instant' ){
                // console.log('instant')

                this._respawnInPlaceOfExistingSiblingPanel()
                this._recursivelyAdjustBackgroundExtensionsOfParentPanelsToFitThisPanel()
                this._recursivelyAlignChartsInParentPanelsWithChartsInThisPanel()


                this.updateAllPanels(0)

            }

            if ( this._animation.spawnStyle === 'extend'  ){
                // console.log('extend')

                this._pushAnySiblingsOfParentRightward()
                this._recursivelyAdjustBackgroundExtensionsOfParentPanelsToFitThisPanel()
                this._recursivelyAlignChartsInParentPanelsWithChartsInThisPanel()
                this._createBridgeFromSpawnRoot()
                this._verticallyMaximizeFromBridgeAsChildPanel()
                this.updateAllPanels( this._animation.duration.extendBridge )
            }


            if ( this._animation.spawnStyle === 'lateralSwitch' ||
                this._animation.spawnStyle === 'retract' ||
                this._animation.spawnStyle === 'retractAndExtend'){

                this._collapseAllPanelsDownstreamAndSpawnThisPanelLateralToSiblingBeingReplaced()

            }

            if ( this._animation.spawnStyle === 'appendSibling' ) {

                this._pushAnySiblingsOfParentRightward()
                this._recursivelyAdjustBackgroundExtensionsOfParentPanelsToFitThisPanel()
                this._createBridgeFromSpawnRoot()
                this._verticallyMaximizeFromBridgeAsChildPanel()
                this.updateAllPanels( this._animation.duration.appendSibling )

            }


            // Register the current object as a child of its parent panel
            const nameOfThisPanel = this.id()
            this.parentPanel.childrenPanels.set(nameOfThisPanel, this)

            // Set color set to be inherited from parent
            this.colorSet( this.parentPanel.colorSet() )
            this.showAbsoluteValues( this.parentPanel.showAbsoluteValues() )


        }


        remove(){

            // Remove self
            super.remove()

            if ( this.has.parentPanel ){

                // De-register self from children registry
                this.parentPanel.childrenPanels.delete( this.id() )

                // Update inferences
                this._adjustDownstream()

            }


            if ( !this.has.parentPanel){

                // Clear children (in case the panel re-appears in some future, it should not have any items in its registry)
                this.childrenPanels.clear()

                // Remove self
                super.remove()

            }


            // If this panel is  the only child of a panel
            if ( !this.has.parentWithAnotherChild
              && this.has.parentPanel){

                // Adjust parent panel
                this._resetParentPanelAndPropagate()

            }


            if ( this.has.parentWithAnotherChild){

                // Select rightmost sibling
                const rightmostSiblingObject = this.has.parentWithRightmostChildPanelObject

                // Get the x coordinate of right edge of children area
                const rightmostEdgeOfRightmostSiblingRemainingInParentPanel =
                      rightmostSiblingObject.x()
                    + rightmostSiblingObject.width()

                const rightmostEdgeOfParentPanelIfThereWereNoBgExtension =
                      this.parentPanel.x()
                    + this.parentPanel.width()

                const newBgExtensionValue =
                      rightmostEdgeOfRightmostSiblingRemainingInParentPanel
                    - rightmostEdgeOfParentPanelIfThereWereNoBgExtension
                    + this.parentPanel._innerPadding.right

                this.parentPanel.bgExtensionRight(newBgExtensionValue)
                this.parentPanel._recursivelyAdjustBackgroundExtensionsOfParentPanelsToFitThisPanel()

            }

            this.updateAllPanels()

        }


        _resetParentPanelAndPropagate() {

            const parent = this.parentPanel

            // Reset the parameters of parent
            parent._resetVerticalInnerPadding()
            parent.bgExtensionRight(0)

            // Given the new parameters of parent, tell all ancestors to acknowledge the changes
            parent._recursivelyAlignChartsInParentPanelsWithChartsInThisPanel()
            parent._recursivelyAdjustBackgroundExtensionsOfParentPanelsToFitThisPanel()

        }


        _adjustBridgeProperties() {


            if (this.has.parentPanel){

                // Formulas

                const rightEdgeOfChartsInParentPanel = this.parentPanel.x() + this.parentPanel.width() - this.parentPanel._innerPadding.right
                const leftEdgeOfThisPanel = (
                    this.has.beenFullyInstantiated
                        ? this.x()
                        : this.postCreationAnimationProperties.x
                )
                const distanceBetweenThisPanelBackgroundAndParentPanelCharts = leftEdgeOfThisPanel - ( rightEdgeOfChartsInParentPanel)

                const verticalTearPreventionOffset = 1  // for preventing vertical cuts that appear during zoom in some browsers
                const extraDistanceForSiblingPanelIfNecessary = this.has.parentWithAnotherChild
                    ? this._paddingBetweenSiblingPanels
                    : 0

                const bridgeId = `${ this.id() }-bridge`
                    , className = 'bridge'
                    , fill = this.objectToSpawnFrom.fill()
                    , x = this.objectToSpawnFrom.x() + this.objectToSpawnFrom.width() - verticalTearPreventionOffset
                    , y = this.objectToSpawnFrom.y()
                    , height = this.objectToSpawnFrom.height()
                    , width =
                        // Difference between this panel's location and parent panel's end point, plus some other values
                        distanceBetweenThisPanelBackgroundAndParentPanelCharts
                        + extraDistanceForSiblingPanelIfNecessary
                        + (verticalTearPreventionOffset * 2) // x2 to add the offset for for each side

                // Create a bridge (with 0 width at the right edge of the element to spawn from)
                this._bridgeObject
                    .class( className )
                    .id( bridgeId )
                    .fill( fill )
                    .x( x )
                    .y( y )
                    .width( width )
                    .height( height )
            }

        }


        topmostAncestor(){

            const selectParentPanel = (panel) => {return panel.parentPanel}

            let topmostAncestorSoFar = this
            while (topmostAncestorSoFar.parentPanel
            && topmostAncestorSoFar.parentPanel.hasType( this.hasType() ) )
            {
                topmostAncestorSoFar = selectParentPanel(topmostAncestorSoFar)
            }

            return topmostAncestorSoFar
        }


        _createBridgeFromSpawnRoot() {

            // Create a bridge (with 0 width at the right edge of the element to spawn from)
            this._bridgeObject = new shape.Rectangle( this.select() )

            this._adjustBridgeProperties()

            this._bridgeObject
                .height( this.preAnimationProperties.objectToSpawnFrom.height )
                .y( this.preAnimationProperties.objectToSpawnFrom.y )
                .width( 0 )
                .update( 0 )


            if ( this._animation.spawnStyle === 'extend' || 'retract' || 'retractAndExtend' || 'instant' ) {

                const parentBgExtensionValue = this.parentPanel.bgExtensionRight()
                const temporaryMaximumBridgeWidthDuringAnimation =
                    parentBgExtensionValue - this.parentPanel._innerPadding.right

                this._adjustBridgeProperties()
                // Expand the width of the bridge to its temporary maximum
                this._bridgeObject
                    .width( temporaryMaximumBridgeWidthDuringAnimation )
                    .update( this._animation.duration.extendBridge )

            }

            if ( this._animation.spawnStyle === 'lateralSwitch' ) {

                this._adjustBridgeProperties()
                this._bridgeObject
                    .update( this._animation.duration.lateralSwitch )

            }

            if( this._animation.spawnStyle === 'appendSibling'
                && !!this.has.parentWithAnotherChild){

                const siblingPanelObjects = Array.from( this.parentPanel.childrenPanels.values() )
                const siblingPanelObjectsFromRightToLeft = _.reverse(siblingPanelObjects)

                siblingPanelObjectsFromRightToLeft.forEach( (siblingPanelObject) => {
                    siblingPanelObject.select().raise()
                })

            }

        }


        _verticallyMaximizeFromBridgeAsChildPanel() {

            // Create a cover (initiate invisible)
            const childPanelCover = new shape.Rectangle()
                .width(0)
                .fill(this.objectToSpawnFrom.fill())
                .height(0)
                .update(0)


            // Move the newly created panel cover to its initial position (which is on top of the bridge).
            setTimeout(() => {

                // Set the bridge width to its final value
                this._adjustBridgeProperties()
                this._bridgeObject
                    .update( 0 )

                // Move child panel cover next to bridge
                childPanelCover
                    .x( this.postCreationAnimationProperties.x )
                    .y( this._bridgeObject.y() )
                    .width( this.postCreationAnimationProperties.width )
                    .height( this._bridgeObject.height() )
                    .update( 0 )


            }, this._animation.duration.extendBridge)  // do after bridge is extended



            // Vertically maximize the cover
            setTimeout(() => {

                childPanelCover
                    .x( this.postCreationAnimationProperties.x )
                    .y( this.postCreationAnimationProperties.y )
                    .height( this.postCreationAnimationProperties.height )
                    .width( this.postCreationAnimationProperties.width )
                    .update( this._animation.duration.maximizePanelCover )

            }, this._animation.duration.extendBridge)  // do after bridge is extended


            // Remove the child panel's cover and teleport child panel to its final position
            setTimeout(() => {

                childPanelCover.remove()

                // Modify current panel's properties to fit it to the room created in parent panel
                this.x( this.postCreationAnimationProperties.x )
                    .y( this.postCreationAnimationProperties.y )
                    .width( this.postCreationAnimationProperties.width )
                    .height( this.postCreationAnimationProperties.height )
                    .update( 0 )

            }, this._animation.duration.extendBridge + this._animation.duration.maximizePanelCover)  // do after bridge extended and cover is maximized
        }


        _pushAnySiblingsOfParentRightward( thisPanel=this ){

            // Push parent's sibling to right
            if ( thisPanel.has.parentPanel && thisPanel.parentPanel.has.siblingObjectsOnRightSide ){

                const rightwardSiblingsOfParent = thisPanel.parentPanel.has.siblingObjectsOnRightSide

                rightwardSiblingsOfParent.forEach( ( siblingObjectOfParent, parentSiblingId ) => {

                    const horizontalSpaceAddedByThisPanel = thisPanel.postCreationAnimationProperties.width + thisPanel.parentPanel._innerPadding.right
                    siblingObjectOfParent.x( siblingObjectOfParent.x() + horizontalSpaceAddedByThisPanel )

                })


            }


            // Recurse with parent
            if ( thisPanel.has.parentPanel ){
                this._pushAnySiblingsOfParentRightward( thisPanel.parentPanel )
            }

        }


        // TODO: Should be tested
        x(value) {

            // Getter
            if (!arguments.length){
                return super.x()
            }

            // Setter
            else{

                const oldValue = this.x()

                super.x(value)

                if ( !!this.childrenPanels.size ){

                    const difference = value - oldValue

                    this.childrenPanels.forEach( (childPanelObject, childPanelId) => {

                        const oldLocation = childPanelObject.x()
                        const newLocation = oldLocation + difference
                        childPanelObject.x(newLocation)

                    })

                    // BRIDGE object is not adjusted here because
                    // ... it is managed by _adjustBridgeProperties method.

                }

                return this
            }

        }

        width(value){

            // Getter
            if (!arguments.length){
                return super.width()
            }

            // Setter
            else{

                // Save current width
                const oldValue =  this.width()

                // Find the x-coordinate difference this change will cause
                const difference = this.has.beenFullyInstantiated
                    ? value - oldValue
                    : 0  // report no difference is this panel is just being created (because getting the difference between the default width and initial width is not desirable)

                // Change width
                super.width(value)

                // this._inferParentChildRelationships()

                // Adjust siblings
                if ( !!this.has.siblingObjectsOnRightSide ){
                    this.has.siblingObjectsOnRightSide.forEach( (siblingObject) => {
                        siblingObject.x( siblingObject.x() + difference )
                    })
                }

                // Adjust parent panels to accommodate the new width
                const recursivelyAdjustParentPanelsAndTheirSiblings = (thisPanel=this) => {
                    if (!!thisPanel.parentPanel){
                        const parentPanel = thisPanel.parentPanel

                        // Adjust background extensions of parent panels to accommodate the new width
                        parentPanel
                            .bgExtensionRight( parentPanel.bgExtensionRight() + difference )


                        // Push parents of siblings rightward to make room for the new width
                        if (!!parentPanel.has.siblingObjectsOnRightSide){
                            parentPanel.has.siblingObjectsOnRightSide.forEach( (siblingObject) => {
                                siblingObject.x( siblingObject.x() + difference )
                            })
                        }
                        recursivelyAdjustParentPanelsAndTheirSiblings(parentPanel)
                    }
                }
                recursivelyAdjustParentPanelsAndTheirSiblings()


                // Adjust child panels
                if ( !!this.childrenPanels.size ){

                    // Shift child panels to accommodate the difference
                    this.childrenPanels.forEach( (childPanelObject, childPanelId) => {

                        const oldLocation = childPanelObject.x()
                        const newLocation = oldLocation + difference
                        childPanelObject.x( newLocation )

                    })

                    // BRIDGE object is not adjusted here because
                    // ... it is managed by _adjustBridgeProperties method.

                }

                return this
            }

        }


        showAbsoluteChartWidths(value) {

            // Getter
            if (!arguments.length){
                return this._showAbsoluteChartWidths
            }

            // Setter
            else{
                value.mustBeOfType('Boolean')
                this._showAbsoluteChartWidths = value

                return this
            }

        }


        _recursivelyAdjustAndUpdateDOWNSTREAM(thisPanel=this, transitionDuration){

            this.update(thisPanel, transitionDuration)

        }



        /**
         * WARNING: DO NOT ATTEMPT TO IMPLEMENT THIS METHOD UNLESS ABSOLUTELY NECESSARY. Explanation:
         *      Because the .update() method contains a downstream update method,
         *      Using this upstream method will also trigger downstream updates
         *      at each step up. This may result in undesired behavior.
         */
        _recursivelyTriggerUpdatesUPSTREAM(thisPanel=this, transitionDuration){

            if( this.has.parentPanel ){

                // Update the parent panel
                thisPanel.parentPanel
                    .update( transitionDuration )

                // Call this function for child panel (so its child is subjected to this method)
                this._recursivelyTriggerUpdatesUPSTREAM(thisPanel.parentPanel)

            }

        }



        _recursivelyAlignChartsInParentPanelsWithChartsInThisPanel(thisPanel=this) {

            // Establish conditions

            if ( thisPanel.has.parentPanel ){

                // Infer parent during recursion
                const parentPanel = arguments.length
                    ? thisPanel.parentPanel
                    : this.parentPanel

                // Get padding values
                const selfInnerPaddingTop = thisPanel.innerPaddingTop()
                const selfInnerPaddingBottom = thisPanel.innerPaddingBottom()

                const selfOuterPaddingTop = thisPanel._outerPadding.top
                const selfOuterPaddingBottom = thisPanel._outerPadding.bottom

                // Adjust padding values of previous panel(s)
                parentPanel
                    .innerPaddingTop( selfInnerPaddingTop + selfOuterPaddingTop )
                    .innerPaddingBottom(selfInnerPaddingBottom + selfOuterPaddingBottom - selfOuterPaddingTop)


                // Bubble up if parent also has a parent
                if ( thisPanel.has.grandParentPanel ){
                    this._recursivelyAlignChartsInParentPanelsWithChartsInThisPanel(parentPanel)
                }



            }


            return this

        }

        _recursivelyAdjustBackgroundExtensionsOfParentPanelsToFitThisPanel(thisPanel=this) {

            if ( thisPanel.has.parentPanel ) {

                // Establish conditions
                const recursingForThePanelBeingAdded = (
                    thisPanel === this
                )
                const recursingForAParentOfPanelBeingAdded = (
                    thisPanel !== this
                )


                // Calculate variables

                const rightEdgeOfPanelBeingAddedPanel =
                    + this.postCreationAnimationProperties.x  // because this.x() starts at a default location (e.g., off-screen) for the panel being added
                    + this.postCreationAnimationProperties.width


                const existingRightmostSiblingOrSelfIfThereAreNoSiblings = (
                    recursingForAParentOfPanelBeingAdded
                        ? thisPanel.has.parentWithRightmostChildPanelObject
                        : null
                )

                const rightEdgeOfExistingRightmostSiblingOrSelf = (
                    !!existingRightmostSiblingOrSelfIfThereAreNoSiblings
                        ? existingRightmostSiblingOrSelfIfThereAreNoSiblings.rightEdge()
                        : null
                )

                const rightmostEdgeOfParentPanelIfThereWereNoBgExtension =
                    + thisPanel.parentPanel.x()
                    + thisPanel.parentPanel.width()



                // Calculate the new right edge of parent panel //
                let newRightEdgeOfOfParentPanel

                if( recursingForThePanelBeingAdded ){
                    newRightEdgeOfOfParentPanel = rightEdgeOfPanelBeingAddedPanel + thisPanel.parentPanel._innerPadding.right
                }

                if( recursingForAParentOfPanelBeingAdded ){
                    // bear in mind that the parent panel's bgExtension is already expanded ...
                    // before this iteration of recursion (while `recursingForThePanelBeingAdded`).
                    // So, there is no need to include `rightEdgeOfPanelBeingAddedPanel` or new panel's width
                    newRightEdgeOfOfParentPanel = rightEdgeOfExistingRightmostSiblingOrSelf + thisPanel.parentPanel._innerPadding.right
                }



                // Calculate the rightward bg extension value //
                const newRightBgExtensionValueOfParent = (
                      newRightEdgeOfOfParentPanel
                    - rightmostEdgeOfParentPanelIfThereWereNoBgExtension
                )

                // Set bg extension of parent  //
                thisPanel.parentPanel
                    .bgExtensionRight( newRightBgExtensionValueOfParent )


                // Bubble up if parent also has a parent //
                if ( thisPanel.has.parentPanel ){
                    this._recursivelyAdjustBackgroundExtensionsOfParentPanelsToFitThisPanel(thisPanel.parentPanel)
                }

            }

            return this

        }


        _inferParentChildRelationships(){

            // TODO: Child panels SHOULD be supported
            // Does this panel has a child panel?
            // NOT SUPPORTED. This information should be computed manually when needed.
            //
            // this.has.childPanel = (
            //     this.childrenObjects
            //     && this.childrenObjects.size
            // )

            // Does this panel have a parent panel?
            this.has.parentPanel = (
                !!this.parentPanel
            )

            // Does this panel have a grandparent panel?
            this.has.grandParentPanel = (
                  this.has.parentPanel
               && !!this.parentPanel.parentPanel
               && (   this.parentPanel.parentPanel.hasType( 'Panel' )
                   || this.parentPanel.parentPanel.hasType( 'NestedPanel' )
               )
            )

            // Does parent have a child?
            // NOTE: This is not an unnecessary condition, even though it sounds like the parent will always have a child---at least the current panel being embedded.
            // However, if this method is called before this panel is added (e.g, in constructor of this panel), this condition returns useful information.
            this.has.parentWithAnyChild = (
                   this.has.parentPanel
                && !!this.parentPanel.childrenPanels
                && !!this.parentPanel.childrenPanels.size
            )

            // Is the existing child of parent identical to the current panel that is being created?
            this.has.parentWithIdenticalChild = (
                this.has.parentWithAnyChild
                && Array.from( this.parentPanel.childrenPanels.values() ).some( (childPanelObject) => {
                    return ( childPanelObject.objectToSpawnFrom === this.objectToSpawnFrom )
                })
            )

            // Does parent have a child that is different from the current one?
            this.has.parentWithAnotherChild = (
                   this.has.parentWithAnyChild
                && Array.from( this.parentPanel.childrenPanels.values() ).some( (childPanelObject) => {
                    return childPanelObject.objectToSpawnFrom !== this.objectToSpawnFrom
                })
            )

            // Does this panel have siblings?
            this.has.sibling = (
                this.has.parentWithAnotherChild
            )

            // How many siblings does this panel have?
            this.has.numberOfSiblings =
                !!this.has.sibling
                    ? this.parentPanel.childrenPanels.size - 1
                    : 0

            // How many children does the parent panel have?
            this.has.parentWithNumberOfChildren =
                !!this.has.parentPanel
                    ? this.parentPanel.childrenPanels.size
                    : 0

            // Is this panel being added as a sibling?
            this.has.beenAddedAsSibling = (
                this.arguments.addAs === 'sibling' && this.has.sibling
            )

            // Does parent have a grandchild?
            this.has.parentWithAnyGrandChild = (
                   this.has.parentWithAnyChild
                && Array.from( this.parentPanel.childrenPanels.values() ).some( (childPanelObject) => {
                    return (!!childPanelObject.childrenPanels
                         && !!childPanelObject.childrenPanels.size
                    )
                })
            )

            // Does parent have a child but no grandchildren?
            this.has.parentWithAnyChildButNoGrandchildren = (
                   this.has.parentWithAnyChild
                && !this.has.parentWithAnyGrandChild
            )

            // What panel object is the last added/rightmost one?
            this.has.parentWithRightmostChildPanelObject = (
                   this.has.parentPanel
                && this.has.parentWithNumberOfChildren > 0
                    ? Array.from( this.parentPanel.childrenPanels.values() ).slice(-1)[0] // Get the last child of parent
                    : null
            )

            // What sibling panel object is at the immediate left side?
            this.has.leftSiblingObject = ( () => {
                return !!this._leftSiblingObject
                    ? this._leftSiblingObject  // This has to be stored in the external variable `this._leftSiblingObject`,
                                               // because after `build()` is completed, this.has.leftSiblingObject should
                                               // not be updated. This is because at the time of init, this._leftSiblingObject
                                               // stores the result from `this.has.parentWithRightmostChildPanelObject`,
                                               // which points to the left sibling at init time. However, after the build is
                                               // completed, `this.has.parentWithRightmostChildPanelObject` points to self.
                    : null
            })()

            // What are the sibling panels on the right side?
            this.has.siblingObjectsOnRightSide = (
                   this.has.parentWithAnotherChild
                && this.has.beenFullyInstantiated // only calculate this if this panel is fully instantiated
                       // The `.has` method above is different; it is the `has` method of Map class.
                    ? ( () => {
                           // Find this panel's index in parent's registry
                           const childrenIdsInParentPanelRegistry = Array.from( this.parentPanel.childrenPanels.keys() )
                           const indexOfThisPanel = childrenIdsInParentPanelRegistry.findIndex( (id) => { return id === this.id() } )
                           const inclusiveStartIndexOfSlice = indexOfThisPanel + 1

                           // Get all objects that are on the right side of this index
                            const allObjectsInParentPanelRegistry = Array.from( this.parentPanel.childrenPanels )
                            const objectsOnTheRightSideOfThisPanel_asArray = allObjectsInParentPanelRegistry.slice( inclusiveStartIndexOfSlice )
                            const objectsOnTheRightSideOfThisPanel = (
                                objectsOnTheRightSideOfThisPanel_asArray.length
                                    ? new Map(objectsOnTheRightSideOfThisPanel_asArray)
                                    : null
                            )

                            return objectsOnTheRightSideOfThisPanel
                    }) ()

                    : null

            )



        }

        _inferSpawnAnimationType(){

            // Infer animation type from parent-child relationships //
            const append =
                this.has.beenAddedAsSibling
                && this.has.parentWithAnyChildButNoGrandchildren
                && !this.has.parentWithIdenticalChild

            const instant =
                this.has.parentWithIdenticalChild
                && this.has.parentWithAnyChildButNoGrandchildren
                && !this.has.beenAddedAsSibling

            const lateralSwitch =
                !this.has.parentWithIdenticalChild
                && this.has.parentWithAnyChildButNoGrandchildren
                && !this.has.beenAddedAsSibling

            const extend =
                !this.has.parentWithAnyChild
                && !this.has.beenAddedAsSibling

            const retract =
                this.has.parentWithAnyGrandChild
                && this.has.parentWithIdenticalChild
                && !this.has.beenAddedAsSibling

            const retractAndExtend =
                this.has.parentWithAnyGrandChild
                && !this.has.parentWithIdenticalChild
                && !this.has.beenAddedAsSibling


            // Register animation type for panel //
            if (append) {this._animation.spawnStyle = 'appendSibling'}
            if (instant) {this._animation.spawnStyle = 'instant'}
            if (lateralSwitch) {this._animation.spawnStyle = 'lateralSwitch'}
            if (extend) {this._animation.spawnStyle = 'extend'}
            if (retractAndExtend) {this._animation.spawnStyle = 'retractAndExtend'}
            if (retract) {this._animation.spawnStyle = 'retract'}

        }


        animationDuration(value) {

            // Getter
            if (!arguments.length){
                return this._animation.duration.total
            }

            // Setter
            else{
                value.mustBeOfType('Number')
                this._animation.duration.total = value
                this._inferAnimationDurations()

                return this
            }

        }


        _inferAnimationDurations(){

            const total = this._animation.duration.total
            const durationOfOneStage = _.round( total/2 )
            const oneThirdOfStageDuration = _.round( (durationOfOneStage/3) * 2 )

            // Stage 1 animations
            this._animation.duration.extendBridge = durationOfOneStage
            this._animation.duration.appendSibling = durationOfOneStage
            this._animation.duration.retractAndExtend = durationOfOneStage
            this._animation.duration.retract = durationOfOneStage
            this._animation.duration.lateralSwitch = oneThirdOfStageDuration

            // Stage 2 animations
            this._animation.duration.maximizePanelCover = durationOfOneStage
            this._animation.duration.backgroundAdjustment = durationOfOneStage  // longer than 300 are cut off, probably by animations that follow
            this._animation.duration.collapseBackground = durationOfOneStage
        }


        _respawnInPlaceOfExistingSiblingPanel() {

            this._removeExistingSiblingPanels()

            // Refresh the clicked panel (recreate it with no animations)
            this._animation.duration.extendBridge = 0
            this._animation.duration.maximizePanelCover = 0


            this._recursivelyAdjustBackgroundExtensionsOfParentPanelsToFitThisPanel()
            this._createBridgeFromSpawnRoot()
            this._verticallyMaximizeFromBridgeAsChildPanel()
        }

        _collapseAllPanelsDownstreamAndSpawnThisPanelLateralToSiblingBeingReplaced() {

            let duration
            if( this._animation.spawnStyle === 'lateralSwitch' ){ duration = this._animation.duration.lateralSwitch }
            if( this._animation.spawnStyle === 'retractAndExtend' ){ duration = this._animation.duration.retractAndExtend }
            if( this._animation.spawnStyle === 'retract' ){ duration = this._animation.duration.retract }


            const firstAlreadyExistingSibling = Array.from(this.parentPanel.childrenPanels)[0][1]

            // Create a copy of the existing bridge, immediately
            const bridgeObjectOfFirstSibling = firstAlreadyExistingSibling._bridgeObject

            const siblingBridgeCover = new shape.Rectangle()
            siblingBridgeCover
                .x(bridgeObjectOfFirstSibling.x())
                .y(bridgeObjectOfFirstSibling.y())
                .width(bridgeObjectOfFirstSibling.width())
                .height(bridgeObjectOfFirstSibling.height())
                .fill(bridgeObjectOfFirstSibling.fill())
                .update(0)

            // Create a copy of the existing sibling background, immediately
            const siblingBackgroundObject = firstAlreadyExistingSibling._backgroundObject

            const siblingBackgroundCover = new shape.Rectangle()
            siblingBackgroundCover
                .x(siblingBackgroundObject.x())
                .y(siblingBackgroundObject.y())
                .width(siblingBackgroundObject.width())
                .height(siblingBackgroundObject.height())
                .fill(siblingBackgroundObject.fill())
                .update(0)


            // Retract the bridge copy
            const initialBridgeCoverWidth = this._animation.spawnStyle === 'retract'
                ? bridgeObjectOfFirstSibling.width()  // if retracting, start the bridge at full width (no extension animation)
                : 0

            siblingBridgeCover
                .width(initialBridgeCoverWidth)
                .update(duration)


            // Remove the existing sibling
            this._removeExistingSiblingPanels()



            // Alternative: Use this block for moving the bridge instead of closing it
            // copyOfSiblingBridge
            //     .y( this._objectToSpawnFrom.y() )
            //     .height( this._objectToSpawnFrom.height() )
            //     .fill( this._objectToSpawnFrom.fill() )
            //     .update( this.spawnAnimation.duration.moveBridge )


            // Change the color of the copy background
            siblingBackgroundCover
                .width(this.postCreationAnimationProperties.width)
                .fill(this.objectToSpawnFrom.fill())
                .update(duration)


            // Save default animation durations to be restored later
            const defaultMaximizePanelCoverDuration = this._animation.duration.maximizePanelCover
            const defaultExtendBridgeDuration = this._animation.duration.extendBridge

            // Set temporary animation durations so that bridge creation and spawn
            // animations can be reused here with new animation durations
            this._animation.duration.maximizePanelCover = 0
            this._animation.duration.extendBridge = duration

            // Main procedure
            this._recursivelyAdjustBackgroundExtensionsOfParentPanelsToFitThisPanel()

            this._recursivelyAlignChartsInParentPanelsWithChartsInThisPanel()
            this._createBridgeFromSpawnRoot()
            this._verticallyMaximizeFromBridgeAsChildPanel()
            this.updateAllPanels( this._animation.duration.collapseBackground )

            setTimeout(() => {
                siblingBackgroundCover.remove()
                siblingBridgeCover.remove()
            }, duration)


            // Reset the animation durations that were temporarily changed
            this._animation.duration.maximizePanelCover = defaultMaximizePanelCoverDuration
            this._animation.duration.extendBridge = defaultExtendBridgeDuration

        }

        _removeExistingSiblingPanels() {

            this.parentPanel.childrenPanels.forEach( (childPanelObject, childPanelName) => {
                childPanelObject.remove()
            })

            this.parentPanel.childrenPanels.clear()
        }


        innerPaddingTop(value) {   // TODO: NOT TESTED

            // Getter
            if (!arguments.length) {
                return super.innerPaddingTop()
            }

            // Setter
            else {

                super.innerPaddingTop(value)

                // Adjust bridge position
                if ( !!this.childrenPanels.size ){

                    this.childrenPanels.forEach( (childObject, childName) => {

                        childObject._bridgeObject
                            .y(childObject.objectToSpawnFrom.y())
                            .height(childObject.objectToSpawnFrom.height())
                    })

                }

                return this
            }

        }


        innerPaddingBottom(value) {   // TODO: NOT TESTED

            // Getter
            if (!arguments.length) {
                return super.innerPaddingBottom()
            }

            // Setter
            else {

                super.innerPaddingBottom(value)

                // Adjust bridge position
                if ( !!this.childrenPanels.size ) {

                    this.childrenPanels.forEach( (childObject, childName) => {

                        childObject._bridgeObject
                            .y(childObject.objectToSpawnFrom.y())
                            .height(childObject.objectToSpawnFrom.height())
                    })

                }

                return this
            }

        }


        colorSet(value){

            // Getter
            if (!arguments.length) {
                return super.colorSet()
            }

            // Setter
            else {

                super.colorSet(value)

                // Set color of background and bridge
                if ( !!this.objectToSpawnFrom ){

                    const spawnSourceColor = this.objectToSpawnFrom.fill()

                    this._bridgeObject.fill( spawnSourceColor  )

                }

                return this
            }

        }


        depthIndex(value) {

            // Getter
            if( !arguments.length ){
                return this._depthIndexValue
            }
            // Setter
            else {

                value.mustBeOfType('Number')

                this._depthIndexValue = value

                super._adjustAll()

                return this
            }

        }


        getEquivalentCategoryObjectInLeftPanel(chartId, categoryId ){

            let equivalentObjectOnLeftPanel

            // In case of panelZero
            if (!this.has.parentPanel){
                equivalentObjectOnLeftPanel = null
            }

            // In case of singleton
            if (this.has.parentPanel){

                const parentPanelHasTheSameChart = !!this.parentPanel.objects(chartId)
                const parentPanelHasTheSameChartAndCategory = parentPanelHasTheSameChart && !!this.parentPanel.objects(chartId).objects(categoryId)

                equivalentObjectOnLeftPanel = parentPanelHasTheSameChartAndCategory
                    ? this.parentPanel.objects(chartId).objects(categoryId)
                    : null  // if no matching chart and category is found in parentPanel
            }


            // In case of siblings
            if (this.has.beenAddedAsSibling && this.has.parentPanel){
                // Note: The first siblings in a panel are NOT added as a sibling. So if this method is ran on a first sibling, then the parent of the first sibling will be queried.

                const panelOnLeftHasTheSameChart = !!this.has.leftSiblingObject.objects(chartId)
                const panelOnLeftHasTheSameChartAndCategory = panelOnLeftHasTheSameChart && !!this.has.leftSiblingObject.objects(chartId).objects(categoryId)

                equivalentObjectOnLeftPanel = panelOnLeftHasTheSameChartAndCategory
                    ? this.has.leftSiblingObject.objects(chartId).objects(categoryId)
                    : null  // if no matching chart and category is found in panel on the left
            }


            return equivalentObjectOnLeftPanel

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

            // Initial values for chart label
            this._chartLabel = {

                // Dynamic:
                x: null,
                y: null,
                fontSize: 16,
                text: 'Chart label',

                // Static:
                paddingRight: 35,
                fill: 'darkgray'
            }
            this._chartLabelObject = null


            this._categoryLabelsArea = {
                isVisible: false,
                width: null,
                leftEdgeXCoordinate: null
            }
            // category label objects are part of navigator.Category class, and not included at this level of the navigator hierarchy

            this._x = 25
            this._y = 25
            this._height = 300
            this._width = 100
            this._colorScheme = 'Greys'  // TODO: Should be replaced with dynamic statement (e.g., this.colorScheme('Greys'))
            this._colorScale = null  // Dynamically populated by .colorScheme()
            this._showAbsoluteValues = false
            this._stroke = 'rgba(255, 255, 255, 1.0)'
            this._strokeWidth = '0.5px'

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
            this._adjustPropertiesOfCategoryObjects()
            this._draw()

        }


        /**
         * Iteratively initializes Category instances
         * @private
         */
        _draw() {

            this._createCategoryObjectsFromRangeStack()

            this._adjustPropertiesOfCategoryObjects()

            // Update the DOM
            this.update()

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


        update(transitionDuration){

            this._updateChartLabel(transitionDuration)
            this._adjustPropertiesOfCategoryObjects()

            super.update(transitionDuration)
            return this

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
                return this._domainStack
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

        _updateData() {

            // Check if labels are on while changing dataset
            // const changingDataWhileLabelsAreOn = (this._categoryLabelsArea && this._categoryLabelsArea.isVisible)
            //
            // Toggle category labels off
            // if (changingDataWhileLabelsAreOn){this.categoryLabels(false)}

            this._calculateVariablesDependentOnDomainStack()
            this._replaceOldCategoriesWithNewOnes()
            this._adjustPropertiesOfCategoryObjects()
            this._adjustCategoryLabelsAndPropertiesOfCategoryLabelsArea()

            // Toggle category labels back on (and thus, update them according to the new data)
            // if (changingDataWhileLabelsAreOn){this.categoryLabels(true)}

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


        _adjustPropertiesOfCategoryObjects() {

            // LOOP //
            this.objects().forEach(
                (eachCategoryObject, eachCategoryId) => {

                    const start = this._rangeStack.data(eachCategoryId).get('start')
                    const end = this._rangeStack.data(eachCategoryId).get('end')
                    const percentage = this._rangeStack.data(eachCategoryId).get('percentage')
                    const count = this._rangeStack.data(eachCategoryId).get('count')
                        ? this._rangeStack.data(eachCategoryId).get('count')
                        : 'N/A'

                    eachCategoryObject
                        .x(this._x)
                        .y(end)
                        .height(start - end)
                        .width(this._width)
                        .stroke(this._stroke)
                        .strokeWidth(this._strokeWidth)
                        .id(eachCategoryId)

                    if ( this._showAbsoluteValues ) {
                        eachCategoryObject.text(count)
                    }
                    if ( !this._showAbsoluteValues ) {
                        eachCategoryObject.percentage(percentage)
                    }

                }


            )

        }


        chartLabel(value) {

            // Establish conditions
            const querying = !arguments.length
            const settingNewLabel = ( arguments.length && value.hasType('String') )
            const togglingOn = ( arguments.length && value.hasType('Boolean') && value === true )
            const togglingOff = ( arguments.length && value.hasType('Boolean') && value === false )


            // Getter
            if (querying) {
                return this._chartLabel.text
            }

            // Setter: Set label
            if (settingNewLabel)  {

                // TODO: Must play well with category labels. (Ensure they are on, etc.)
                this._chartLabel.text = value

                return this

            }


            // Setter: Toggle on
            if (togglingOn) {

                this._chartLabel.text.mustBeOfType(String)

                if (!this._chartLabelObject) {
                    this._chartLabelObject = new shape.Text( this.select() )
                }

                return this

            }

            // Setter: Toggle off and remove label
            if (togglingOff) {

                if (this._chartLabelObject){
                    this._chartLabelObject.remove()
                    this._chartLabelObject = null
                }

                return this
            }

        }





        _updateChartLabel(transitionDuration) {

            if (this._chartLabelObject) {

                this._adjustChartLabelPosition()

                this._chartLabelObject
                    .text(this._chartLabel.text)
                    .fontSize(this._chartLabel.fontSize)
                    .x(this._chartLabel.x)
                    .y(this._chartLabel.y)
                    .fill(this._chartLabel.fill)
                    .class('chart-label')
                    .textAnchor('middle')
                    .dominantBaseline('auto')
                    .rotate(270)
                    .update(transitionDuration)

            }
        }


        _adjustChartLabelPosition() {

            // Update coordinates (and other properties) of the category labels area
            this._adjustCategoryLabelsAndPropertiesOfCategoryLabelsArea()

            // Update chart label position
            const {x, y} = this._calculateChartLabelPosition()
            this._chartLabel.x = x
            this._chartLabel.y = y

        }


        chartLabelPaddingRight(value){

            // Getter
            if (!arguments.length){
                return this._chartLabel.paddingRight
            }
            // Setter
            else {

                value.mustBeOfType('Number')

                this._chartLabel.paddingRight = value

                return this
            }

        }


        /**
         *
         * @param value {boolean}
         * @return {Chart|[]}
         */
        categoryLabels(value) {

            // Establish conditions
            const gettingCurrentLabels = (!arguments.length)
            const togglingOn = ( value === true )
            const togglingOff = ( value === false )


            // Getter (calculates)
            if (gettingCurrentLabels) {

                const categoryLabels = []

                this.objects().forEach( (categoryObject, categoryName) => {
                    const categoryLabel = categoryObject.label()
                    categoryLabels.push(categoryLabel)
                })

                return categoryLabels
            }


            // Setter: Toggle on from off state
            if (togglingOn){

                // Register status and update the properties of the CATEGORY labels area (necessary for positioning CHART label)
                this._categoryLabelsArea.isVisible = true
                this._adjustCategoryLabelsAndPropertiesOfCategoryLabelsArea()

                return this
            }


            // Setter: Toggle off
            if (togglingOff) {

                // Register status and update related variables
                this._categoryLabelsArea.isVisible = false
                this._adjustCategoryLabelsAndPropertiesOfCategoryLabelsArea()

                return this
            }

        }


        _adjustCategoryLabelsAndPropertiesOfCategoryLabelsArea() {

            // If category labels area has been turned off
            if( !this._categoryLabelsArea.isVisible ){

                this.objects().forEach( (categoryObject, categoryName) => {

                    // If any category has a label, turn it off
                    if (categoryObject.label()) {
                        categoryObject
                            .label(false)
                    }
                })

                // Clear variables related to category labels area
                this._categoryLabelsArea.width = null
                this._categoryLabelsArea.leftEdgeXCoordinate = null

            }


            // If category labels area is on, make sure that labels are toggled on
            if( this._categoryLabelsArea.isVisible ){

                this.objects().forEach( (categoryObject, categoryName) => {

                    // If any category object does not have a label, turn it on
                    if (!categoryObject.label()){
                        categoryObject
                            .label(categoryName)
                    }

                })

                // Measure values of the category labels area and record them to relevant instance variables
                const widestCategoryLabelWidth = this._getWidestCategoryLabelWidth()

                // Get the category label object that has the largest width, and register its properties as instance properties
                this.objects().forEach( (categoryObject, categoryName) => {

                    const categoryLabelObject = categoryObject.objects('label')
                    const categoryLabelWidth = categoryLabelObject.width()

                    if ( categoryLabelWidth === widestCategoryLabelWidth ){

                        const firstWidestCategoryLabelObject = categoryLabelObject   // 'first' because there can multiple labels that has the same length. We need only one.

                        this._categoryLabelsArea.width = firstWidestCategoryLabelObject.width()
                        this._categoryLabelsArea.leftEdgeXCoordinate = firstWidestCategoryLabelObject.x() - firstWidestCategoryLabelObject.width()  // because text is right-anchored, .x() would return the coordinate of the right edge

                        // WARNING: y coordinate of the object should not be requested, as it can be unstable if there are
                        // more than one 'widest' object (e.g., two label objects with the width of 50px). In such cases,
                        // both objects would have the same width and x coordinate, but not the same y coordinate.

                    }
                })
            }

            return this

        }

        /**
         *
         * @return {{x: *, y: *}}
         * @private
         */
        _calculateChartLabelPosition() {

            // Establish conditions
            const chartLabelOnly = ( !this._categoryLabelsArea.isVisible )
            const chartLabelTogetherWithCategoryLabels = ( this._categoryLabelsArea.isVisible )

            const padding = this._chartLabel.paddingRight

            const y = this.y() + this.height() / 2
            let x

            if (chartLabelOnly) {
                x = this.x() - padding
            }

            if ( chartLabelTogetherWithCategoryLabels ) {

                const leftEdgeOfChartLabelsArea = this._categoryLabelsArea.leftEdgeXCoordinate

                x = leftEdgeOfChartLabelsArea - padding
            }


            return {x, y}
        }


        _getWidestCategoryLabelWidth() {

            // Don't continue if category labels are not toggled on
            this._categoryLabelsArea.isVisible.mustBe(
                true,
                `Cannot measure the widths of the category labels because the category labels are NOT toggled on.`)

            // Get width of every category label
            const categoryWidths = []
            this.objects().forEach( (categoryObject, categoryName) => {

                const categoryLabelObject = categoryObject.objects('label')
                const categoryLabelWidth = categoryLabelObject.width()

                categoryWidths.push(categoryLabelWidth)

            })

            // Get the largest category label width
            const widestCategoryLabelWidth = Math.max(...categoryWidths)
            return widestCategoryLabelWidth

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


        showAbsoluteValues(value) {

             // Getter
             if (!arguments.length){
                 return this._showAbsoluteValues
             }

             // Setter
             else{

                 value.mustBeOfType('Boolean')
                 this._showAbsoluteValues = value

                 return this
             }

        }


        stroke(value){
            if (!arguments.length) {
                return this._stroke
            }
            else {
                this._stroke = value
                return this
            }
        }

        strokeWidth(value){
            if (!arguments.length) {
                return this._strokeWidth
            }
            else {
                this._strokeWidth = value
                return this
            }
        }

        totalCount(){

            return this.stack().totalCount()

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

            this.class('category')
                .update()

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
                this.text(formattedPercentageString)

                return this
            }
        }


        text(value) {

            // Getter
            if (!arguments.length){
                return super.text()
            }
            // Setter
            else{
                super.text(value)
                return this
            }

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
            .set('Titanic', ['Purples', 'Inferno', 'PuBuGn', 'Oranges', 'Greys', 'Blues'])
            .set('Titanic-2', ['Greys', 'Purples', 'Plasma', 'PuBu'])
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
            .set('Plasma', ['Plasma'])


        , getChartSchemeBySchemeSetNameAndCircularIndex: function (schemeSet, i) {

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
    exports.NestedPanel = NestedPanel;
    exports.Chart = Chart;
    exports.Category = Category;
    exports.color = color;


    Object.defineProperty(exports, '__esModule', {value: true});

})));
//////////////////////////////////////////////////////////////////////////////////////

