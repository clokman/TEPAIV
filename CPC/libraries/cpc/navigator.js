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




class Chart extends container.Group {


    constructor(parentContainer){

        // Superclass init
        super(parentContainer)  // Creates a container that is a child of parent container

        super.class('chart')
            .update()


        // Private parameters
        this._label = 'Chart Label'
        this._stack = new data.Stack()
        this._x = 400
        this._y = 20
        this._height = 300
        this._width = 75


        // Private variables
        this._container = super.selectSelf()

        this._stackMin = this._stack.min()
        this._stackMax = this._stack.max()

        this._rangeStart = this._y + this._height  // bottom edge of chart
        this._rangeEnd = this._y                   // top edge

        this._scaleFunction = d3.scaleLinear()
            .domain([this._stackMin, this._stackMax])
            .rangeRound([this._rangeStart, this._rangeEnd])

        this._scaledStack = this._stack.scale(this._scaleFunction)


        // Initialize
        this._draw()
        this.update()

    }


    /**
     *
     * @param value {Array}
     * @return {(number|*)[]|Chart}
     */
    range(value){

            if (!arguments.length){
                return [this._rangeStart, this._rangeEnd]
            }
            else{

                // Set new range properties for the instance
                const [start, end] = value
                this._rangeStart = start
                this._rangeEnd = end

                // Update scale function
                this._scaleFunction.rangeRound([start, end])

                // Rescale stack data
                this._scaledStack = this._stack.scale(this._scaleFunction)

                return this
            }

        }

    update(){

        super.update()

    }

    _draw(){

        // LOOP //
        this._scaledStack.data().forEach(
            (eachCategoryData, eachCategoryId) => {

                const start = eachCategoryData.get('start')
                const end = eachCategoryData.get('end')

                const parentContainerForCategory = this._container
                    .selectAll('g' + '#' + eachCategoryId)
                    .data([[start, end]])
                    .enter()
                    .append('g')
                    .attr('class', 'category')
                    .attr('id', eachCategoryId)

                const categoryObject = new Category(parentContainerForCategory)


                categoryObject
                    .x(this._x)
                    .y(end)
                    .height(start-end)
                    .width(this._width)
                    .id(eachCategoryId)
                    .class('categoryObject')
                    .update()

                categoryObject.percentage(start).update()

                // Update registry
                this.registry(eachCategoryId, categoryObject)
            }

        )

    }


    x(value){

        if (!arguments.length){
            return this._x
        }
        else{
            this._x = value

            // LOOP //
            this.registry().forEach(
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
            this.registry().forEach(
                (eachCategoryObject, eachCategoryId) => {

                    eachCategoryObject

                }

            )

            this._y = value


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
            this.registry().forEach(
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

            return this
        }

    }



    _generateDefaultStackMap(){

        let stackMap = new Map()

        stackMap.set('summary', new Map())
            .get('summary')
            .set('stack min value', 0)
            .set('stack max value', 30)

        stackMap.set('category-1', new Map())
            .get('category-1')
            .set('label', 'Category One')
            .set('start', 0)
            .set('end', 10)

        stackMap.set('category-2', new Map())
            .get('category-2')
            .set('label', 'Category Two')
            .set('start', 10)
            .set('end', 20)

        stackMap.set('category-3', new Map())
            .get('category-3')
            .set('label', 'Category Three')
            .set('start', 20)
            .set('end', 30)

        return stackMap
    }


}






class Category extends shape.Rectangle {


    constructor(parentContainer=d3.select('body').select('svg'), x=25, y=25, percentage='0', percentageTextOffsetX=0, percentageTextOffsetY=3, percentageTextFill='white', percentageTextAnchor='middle') {

        super(parentContainer)


        super.x(x)
        super.y(y)

        this._percentage = percentage

        this._percentageTextOffsetX = percentageTextOffsetX
        this._percentageTextOffsetY = percentageTextOffsetY

        this._percentageTextFill = percentageTextFill
        this._percentageTextAnchor = percentageTextAnchor

        this._percentageText = new shape.Text(parentContainer)

        this.initiatePercentageText()

        this.update()
    }


    initiatePercentageText(){

        this.percentage(this._percentage)  // format and set percentageText object's inner text
        this._calculateAndUpdatePercentageTextPosition()

        this._percentageText.fill(this._percentageTextFill)
        this._percentageText.textAnchor(this._percentageTextAnchor)

    }


    update(transitionDuration){

        this._calculateAndUpdatePercentageTextPosition()
        super.update(transitionDuration)
        this._percentageText.update(transitionDuration)
    }

    _calculateAndUpdatePercentageTextPosition(){

        this._percentageTextPositionX = this._calculateHorizontalPercentageTextPositionBasedOnRectangleParameters()
        this._percentageTextPositionY = this._calculateVerticalPercentageTextPositionBasedOnRectangleParameters()
        this._percentageText.x(this._percentageTextPositionX)
        this._percentageText.y(this._percentageTextPositionY)

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
            this._percentageText.text(formattedPercentageString)

            return this
        }
    }


    percentageTextFill(value) {

        // Getter
        if (!arguments.length){
            return this._percentageText.fill()
        }
        // Setter
        else{
            this._percentageText.fill(value)
            return this
        }
    }


    x(value) {

        // Getter
        if (!arguments.length) {
            return super.x()
        }
        // Setter
        else {

            // Update x value of rectangle
            super.x(value)

            // Recalculate percentage text position based on new rectangle parameters
            const newPercentageTextCoordinateX = this._calculateHorizontalPercentageTextPositionBasedOnRectangleParameters()
            this._percentageText.x(newPercentageTextCoordinateX)

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

            // Update y value of rectangle
            super.y(value)

            const newPercentageTextCoordinateY = this._calculateVerticalPercentageTextPositionBasedOnRectangleParameters()

            this._percentageText.y(newPercentageTextCoordinateY)

            return this
        }

    }


    _calculateHorizontalPercentageTextPositionBasedOnRectangleParameters(){

        const x = super.x()
            , horizontalMidPoint = super.width()/2
            , offset = this._percentageTextOffsetX

        return x + horizontalMidPoint + offset

    }


    _calculateVerticalPercentageTextPositionBasedOnRectangleParameters(){

        const y = super.y()
            , verticalMidPoint = super.height()/2
            , offset = this._percentageTextOffsetY

        return y + verticalMidPoint + offset

    }


}








//// UMD FOOT ////////////////////////////////////////////////////////////////////////

    //// MODULE.EXPORTS ////
    exports.version = version;
    exports.Chart = Chart;
    exports.Category = Category;


    Object.defineProperty(exports, '__esModule', {value: true});

})));
//////////////////////////////////////////////////////////////////////////////////////

