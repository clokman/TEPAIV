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
        this._domainStack = new data.Stack()
        this._x = 400
        this._y = 20
        this._height = 300
        this._width = 75


        // Private variables
        this._container = super.selectSelf()

        this._stackMin = this._domainStack.min()
        this._stackMax = this._domainStack.max()

        this._rangeStart = this._y + this._height  // bottom edge of chart
        this._rangeEnd = this._y                   // top edge

        this._scaleFunction = d3.scaleLinear()
            .domain([this._stackMin, this._stackMax])
            .rangeRound([this._rangeStart, this._rangeEnd])

        this._rangeStack = this._domainStack.scale(this._scaleFunction)


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
                this._scaleFunction.rangeRound([this._rangeStart, this._rangeEnd])

                // Rescale stack data
                this._rangeStack = this._domainStack.scale(this._scaleFunction)



                // Update y coordinates of each category

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


    _draw(){

        // LOOP //
        this._rangeStack.data().forEach(
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
                    // .id(eachCategoryId)
                    .class('category-rectangle')
                    .update()

                categoryObject.percentage(start).update()

                // Update registry
                this.objects(eachCategoryId, categoryObject)
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
            this.objects().forEach(
                (eachCategoryObject, eachCategoryId) => {

                    eachCategoryObject.x(this._x)

                }
            )

            return this
        }

    }


    // y(value){
    //
    //     if (!arguments.length){
    //         return this._y
    //     }
    //     else{
    //         // this.registry().forEach(
    //         //     (eachCategoryObject, eachCategoryId) => {
    //         //
    //         //         eachCategoryObject
    //         //
    //         //     }
    //         //
    //         // )
    //
    //         this._y = value
    //
    //
    //         return this
    //     }
    //
    // }


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
        this._rectangleObject = new shape.Rectangle(this._parentContainerSelection)
        this.objects('rectangle', this._rectangleObject)  // add object to container registry

        this._percentageTextObject = new shape.Text(this._parentContainerSelection)
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


    // update(transitionDuration){
    //
    //     // this._calculateAndUpdatePercentageTextPosition()
    //     this._rectangleObject.update(transitionDuration)
    //     this._percentageTextObject.update(transitionDuration)
    // }


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
    exports.Chart = Chart;
    exports.Category = Category;


    Object.defineProperty(exports, '__esModule', {value: true});

})));
//////////////////////////////////////////////////////////////////////////////////////

