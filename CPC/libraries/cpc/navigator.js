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
    constructor (){
        super()
        // this._ignoredColumns = ignoredColumns
        //
        // this._datasetSurveyResults = surveyData(dataset, this._ignoredColumns)
        // this._lastQuery = surveyData(dataset, this._ignoredColumns)
        //
        // this._noOfPanels = 0
        //
        // this.xScale = d3.linear()
        //
        // this._lastClickedColumnSelector = ''
        // this._lastClickedCategorySelector = ''
        // this._lastClickedCategoryLabel = ''
        //
        // this._lastClickedPanelDepth = 0
        //
        // this._frontColorScale = d3.scaleOrdinal(d3.schemeCategory10)
        // this._rectangleColorRegistry = new Map()



        // const panel0_ranges = this._calculateRangesForGivenNumberOfPanels(this._deepestPanelDepth + 1) // +1, because depth count starts from zero

    }
}






/**
 * NOTE: For this class to be instantiated, there must be <b>at least</b> a SVG element existing in DOM.
 * This is true even if the class is initiated with default parameters.
 */
class Panel extends container.Group {

    constructor(parentContainerSelection){

        // if (!arguments.length){
        //     parentContainerSelection = new container.Svg
        // }

        // Superclass Init //
        super(parentContainerSelection)

        super.class('panel')
            .update()

        // Public Parameters //
        // this._eulerPadding_horizontal = 20
        // this._eulerPadding_vertical = 10


        // Private Parameters //
        // this._query =
        this._data = this._generateSampleData()


        // Private Variables //
        this._noOfCharts = this._data.size
        this._yScale = d3.scaleBand()
            .domain(d3.range(this._noOfCharts))
            .rangeRound([0, this._parentContainerSelection.attr('height')])

        // this._currentMaxPossibleValue = dataset.length // initial value.


        // Initialize //

        // LOOP //
        let i = 0
        this._data.forEach(
            (eachStack, eachStackId) => {

                const chart = new Chart()


                this.objects(eachStackId, chart)

                // chart.data(eachColumnStack)  // TODO: Added a .data() method to Chart class for getting and setting _domainStack. The challenge will be to let this the setter functionality to redraw the chart upon entering new data.
                // chart.x(...)
                // chart.y(this._yScale(i))


                i++


            }
        )







    }


    data(){

        // this._data = value
        // this._numberOfCharts = this_data.size
    }


    _generateSampleData(){

        // Genetate stacks
        const stack1 = new data.Stack()
            , stack2 = new data.Stack()
            , stack3 = new data.Stack()

        // Add custom data to one of the stacks
        stack2.populateWithExampleData('gender')

        // Combine stacks in one map
        const sampleData = new Map()
        sampleData.set('status', stack1)
        sampleData.set('gender', stack2)
        sampleData.set('class', stack3)


        return sampleData
    }

}





/**
 * NOTE: For this class to be instantiated, there must be <b>at least</b> a SVG element existing in DOM.
 * This is true even if the class is initiated with default parameters.
 */
class Chart extends container.Group {


    constructor(parentContainerSelection){

        // Superclass init //
        super(parentContainerSelection)  // Creates a container that is a child of parent container

        super.class('chart')
            .update()


        // Private parameters //
        this._label = 'Chart Label'
        this._x = 400
        this._y = 20
        this._height = 300
        this._width = 75


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


    x(value){

        if (!arguments.length){
            return this._x
        }
        else{
            this._x = value

            // LOOP //
            this.objects().forEach(
                (eachCategoryObject, eachCategoryId) => {

                    eachCategoryObject.x(this._x)

                }
            )

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


    width(value){

        if (!arguments.length){
            return this._width
        }
        else{
            this._width = value

            // LOOP //
            this.objects().forEach(
                (eachCategoryObject, eachCategoryId) => {

                    eachCategoryObject.width(this._width)

                }
            )

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

        // TODO: This can be achieved more gracefully by using .removeLast(), etc. The current method simply removes the old categories and creates new ones without transitions.

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
class Category extends container.Group {


    constructor(parentContainerSelection=d3.select('body').select('svg')) {

        super(parentContainerSelection)

        // Private Parameters //
        this._x = 25
        this._y = 25
        this._width = 20
        this._height = 100
        this._percentage = '0'
        this._percentageTextOffsetX = 0
        this._percentageTextOffsetY = 3
        this._percentageTextFill = 'white'
        this._percentageTextAnchor = 'middle'


        // Initialize //
        this._rectangleObject = new shape.Rectangle(this._selection)
        this.objects('rectangle', this._rectangleObject)  // add object to container registry

        this._percentageTextObject = new shape.Text(this._selection)
        this.objects('percentage-text', this._percentageTextObject)  // add object to container registry

        this.initializePercentageText()

        this.update()
    }


    initializePercentageText(){

        this.percentage(this._percentage)  // format and set percentageText object's inner text
        this._calculateAndUpdatePercentageTextPosition()

        this._percentageTextObject.fill(this._percentageTextFill)
        this._percentageTextObject.textAnchor(this._percentageTextAnchor)

    }


    x(value) {

        // Getter
        if (!arguments.length) {
            return this._x
        }
        // Setter
        else {

            // Update x value of category
            this._x = value

            // Update x value of rectangle
            this._rectangleObject.x(value)

            // Recalculate percentage text position based on new rectangle parameters
            const newPercentageTextCoordinateX = this._calculateHorizontalPercentageTextPositionBasedOnRectangleParameters()
            this._percentageTextObject.x(newPercentageTextCoordinateX)

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

            // Update y value of category
            this._y = value

            // Update y value of rectangle
            this._rectangleObject.y(value)

            const newPercentageTextCoordinateY = this._calculateVerticalPercentageTextPositionBasedOnRectangleParameters()
            this._percentageTextObject.y(newPercentageTextCoordinateY)

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

            // Update width value of category
            this._width = value

            // Update width value of rectangle
            this._rectangleObject.width(value)

            // Recalculate percentage text position based on new rectangle parameters
            const newPercentageTextCoordinateX = this._calculateHorizontalPercentageTextPositionBasedOnRectangleParameters()
            this._percentageTextObject.x(newPercentageTextCoordinateX)

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

            // Update width value of category
            this._height = value

            // Update width value of rectangle
            this._rectangleObject.height(value)

            // Recalculate percentage text position based on new rectangle parameters
            const newPercentageTextCoordinateY = this._calculateVerticalPercentageTextPositionBasedOnRectangleParameters()
            this._percentageTextObject.y(newPercentageTextCoordinateY)

            return this
        }

    }


    fill(value) {
        if (!arguments.length) {
            return this._rectangleObject.fill()
        }
        else {
            this._rectangleObject.fill(value)

            return this
        }
    }


    percentage(value) {

        // Getter
        if (!arguments.length){
            return this._percentage
        }
        // Setter
        else{

            this._percentage = value

            const formattedPercentageString = str.formatNumberAsPercentage(this._percentage)
            this._percentageTextObject.text(formattedPercentageString)

            return this
        }
    }


    percentageTextFill(value) {

        // Getter
        if (!arguments.length){
            return this._percentageTextObject.fill()
        }
        // Setter
        else{
            this._percentageTextObject.fill(value)
            return this
        }
    }


    _calculateAndUpdatePercentageTextPosition(){

        this._percentageTextPositionX = this._calculateHorizontalPercentageTextPositionBasedOnRectangleParameters()
        this._percentageTextPositionY = this._calculateVerticalPercentageTextPositionBasedOnRectangleParameters()
        this._percentageTextObject.x(this._percentageTextPositionX)
        this._percentageTextObject.y(this._percentageTextPositionY)

    }


    _calculateHorizontalPercentageTextPositionBasedOnRectangleParameters(){

        const x = this._rectangleObject.x()
            , horizontalMidPoint = this._rectangleObject.width()/2
            , offset = this._percentageTextOffsetX

        return x + horizontalMidPoint + offset

    }


    _calculateVerticalPercentageTextPositionBasedOnRectangleParameters(){

        const y = this._rectangleObject.y()
            , verticalMidPoint = this._rectangleObject.height()/2
            , offset = this._percentageTextOffsetY

        return y + verticalMidPoint + offset

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

