
//// UMD HEAD ////////////////////////////////////////////////////////////////////////
// UMD head and foot patterns adapted from d3.js (Copyright 2019 Mike Bostock)
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
        typeof define === 'function' && define.amd ? define(['exports'], factory) :
            (factory((global.shape = global.shape || {})));
}(this, (function (exports) { 'use strict';
//////////////////////////////////////////////////////////////////////////////////////






// Module content goes here. 
    const version = "1.0"





    class Shape {

        constructor(parentContainerSelection=d3.select('body').select('svg')){

            // Public Parameters //
            this._parentContainerSelection = parentContainerSelection  // gets first existing SVG on DOM

            // Private Parameters //
            this._x = 0
            this._y = 0
            this._fill = 'gray'

            this._htmlClass = null
            this._htmlId = null

            this._data = [null]

            // Private Variables //
            this._selection = null  // gets updated later as a d3 selection by _draw method

            // Initialize //
        }


        select(){
            return this._selection
        }


        remove(){
            this.select().remove()  // .remove() method in the end belongs to d3
        }


        fill(value) {
            if (!arguments.length) {
                return this._fill
            } else {
                this._fill = value

                return this
            }
        }


        x(value) {

            if (!arguments.length) {
                return this._x
            } else {
                this._x = value

                return this
            }
        }


        y(value) {
            if (!arguments.length) {
                return this._y
            } else {
                this._y = value

                return this
            }
        }


        class(value) {
            if (!arguments.length) {
                return this._htmlClass
            } else {
                this._htmlClass = value

                return this
            }
        }


        id(value) {
            if (!arguments.length) {
                return this._htmlId
            } else {
                this._htmlId = value
                this._htmlIdSelector = '#' + this._htmlId

                return this
            }
        }

    }






    let rectangleCounter = 0  // for assigning unique default rectangle Ids

    class Rectangle extends Shape {
        /*
        param svg {SvgCanvas}
         */
        constructor(parentContainerSelection=d3.select('body').select('svg')) {

            // Superclass Init //
            super(parentContainerSelection)
            this.class('rectangle')
                .id(`rectangle-${rectangleCounter}`)
            rectangleCounter++


            // Private Parameters //
            this._width = 50
            this._height = 50

            // Initialize //
            this._draw()

        }


        _draw() {
            this._selection = this._parentContainerSelection
                .selectAll('rect' + ' ' + this._htmlIdSelector)
                // .select(this._htmlIdSelector)
                .data(this._data)
                .enter()
                .append('rect')
                .attr('class', this._htmlClass)
                .attr('id', this._htmlId)
                .attr('x', this._x)
                .attr('y', this._y)
                .attr('width', this._width)
                .attr('height', this._height)
                .attr('fill', this._fill)
        }


        update(transitionDuration=500) {

            this._selection
            // .data(this._data)
                .transition().duration(transitionDuration)
                .attr('class', this._htmlClass)
                .attr('id', this._htmlId)
                .attr('x', this._x)
                .attr('y', this._y)
                .attr('width', this._width)
                .attr('height', this._height)
                .attr('fill', this._fill)

            return this
        }


        width(value) {

            if (!arguments.length) {
                return this._width
            } else {
                this._width = value

                return this
            }
        }


        height(value) {
            if (!arguments.length) {
                return this._height
            } else {
                this._height = value

                return this
            }
        }

    }






    class Text extends Shape {

        constructor(parentContainerSelection=d3.select('body').select('svg')){

            // Superclass Init //
            super(parentContainerSelection)
            this.x(25)
                .y(25)
                .fill('black')


            // Private Parameters //
            this._text = "Text"

            this._fontFamily = 'sans-serif'
            this._fontSize = '14px'
            this._textAnchor = 'start'
            this._dominantBaseline = 'hanging'


            // Initialize //
            this._draw()

        }


        _draw(){

            this._selection = this._parentContainerSelection
            // .select(this._htmlIdSelector)
                .append('text')
                .text(this._text)
                .attr('class', this._htmlClass)
                .attr('id', this._htmlId)
                .attr('x', this._x)
                .attr('y', this._y)
                .attr('fill', this._fill)
                .attr('font-family', this._fontFamily)
                .attr('font-size', this._fontSize)
                .attr('text-anchor', this._textAnchor)
                .attr('dominant-baseline', this._dominantBaseline)

        }


        update(transitionDuration=500){

            this._selection
                .transition().duration(transitionDuration)
                .text(this._text)
                .attr('class', this._htmlClass)
                .attr('id', this._htmlId)
                .attr('x', this._x)
                .attr('y', this._y)
                .attr('fill', this._fill)
                .attr('font-family', this._fontFamily)
                .attr('font-size', this._fontSize)
                .attr('text-anchor', this._textAnchor)
                .attr('dominant-baseline', this._dominantBaseline)

        }


        text (value) {

            if (!arguments.length) {
                return this._text
            }
            else {
                this._text = value

                return this
            }
        }


        fontSize(value) {

            if (!arguments.length) {
                return this._fontSize
            }
            else {
                this._fontSize = value

                return this
            }
        }

        /**
         *
         * @param value {string} - Options: 'start', 'middle', 'end'
         * @return {Text|string}
         */
        textAnchor(value) {

            if (!arguments.length) {
                return this._textAnchor
            }
            else {
                this._textAnchor = value

                return this
            }
        }

        /**
         *
         * @param value {string} - Use 'auto' for anchoring at bottom, 'hanging' for anchoring on top
         * @return {Text|string}
         */
        dominantBaseline(value) {

            if (!arguments.length) {
                return this._dominantBaseline
            }
            else {
                this._dominantBaseline = value

                return this
            }
        }

    }





    class CaptionedRectangle extends container.Group{

        constructor(parentContainerSelection=d3.select('body').select('svg')) {


            // Superclass Init //
            super(parentContainerSelection)

            // Interfaced Private Parameters //
            this._x = 25
            this._y = 25
            this._width = 50
            this._height = 50

            this._text = 'Text'
            this._textAlignment = 'center'
            this._textFill = 'white'


            // Private Parameters //
            this._textPadding = 10        // for text at corners or edges
            this._centerTextOffsetX = 0  // for text at the center of rectangle
            this._centerTextOffsetY = 3


            // Initialize //
            this._rectangleObject = new shape.Rectangle(this._selection)
            this.objects('rectangle', this._rectangleObject)  // add object to container registry

            this._textObject = new shape.Text(this._selection)
            this.objects('text', this._textObject)  // add object to container registry

            this.initializeRectangle()
            this.initializeText()

            this.update()

        }


        initializeRectangle() {
            this.x(this._x)
            this.y(this._y)
            this.width(this._width)
            this.height(this._height)
        }


        initializeText(){

            this._calculateAndUpdateTextPositionProperties()

            this._textObject.fill(this._textFill)

        }


        text(value) {

            // Getter
            if (!arguments.length){
                return this._text
            }
            // Setter
            else{

                this._text = value

                this._textObject.text(this._text)

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

                // Update x value of category
                this._x = value

                // Update x value of rectangle
                this._rectangleObject.x(value)

                // Recalculate percentage text position based on new rectangle parameters
                this._calculateAndUpdateTextPositionProperties()

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

                this._calculateAndUpdateTextPositionProperties()

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
                this._calculateAndUpdateTextPositionProperties()

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
                this._calculateAndUpdateTextPositionProperties()

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


        textFill(value) {

            // Getter
            if (!arguments.length){
                return this._textObject.fill()
            }
            // Setter
            else{
                this._textObject.fill(value)
                return this
            }
        }


        textAlignment(value){

            // Getter
            if (!arguments.length){
                return this._textAlignment
            }
            // Setter
            else{
                this._textAlignment = value

                this._calculateAndUpdateTextPositionProperties()

                return this
            }

        }


        _calculateAndUpdateTextPositionProperties(textAlignment=this._textAlignment){

            if (textAlignment === 'top-left'){
                this._textObject
                    .dominantBaseline('hanging')
                    .textAnchor('start')
            }

            if (textAlignment === 'center'){
                this._textObject
                    .dominantBaseline('auto')
                    .textAnchor('middle')
            }

            this._textPositionX = this._calculateHorizontalTextPositionBasedOnRectangleParameters(textAlignment)
            this._textPositionY = this._calculateVerticalTextPositionBasedOnRectangleParameters(textAlignment)

            this._textObject.x(this._textPositionX)
            this._textObject.y(this._textPositionY)

        }


        _calculateHorizontalTextPositionBasedOnRectangleParameters(textAlignment=this._textAlignment){

            const x = this._rectangleObject.x()
                , horizontalMidPoint = this._rectangleObject.width()/2
                , offset = this._centerTextOffsetX
                , padding = this._textPadding


            if (textAlignment === 'center'){
                return x + horizontalMidPoint + offset
            }

            if (textAlignment === 'top-left'){
                return x + padding
            }

        }


        _calculateVerticalTextPositionBasedOnRectangleParameters(textAlignment=this._textAlignment){

            const y = this._rectangleObject.y()
                , verticalMidPoint = this._rectangleObject.height() / 2
                , offset = this._centerTextOffsetY
                , padding = this._textPadding


            if (textAlignment === 'center') {
                return y + verticalMidPoint + offset
            }

            if (textAlignment === 'top-left'){
                return y + padding
            }

        }


    }



//// UMD FOOT ////////////////////////////////////////////////////////////////////////

    //// MODULE.EXPORTS ////
    exports.version = version;
    exports.Shape = Shape;
    exports.Rectangle = Rectangle;
    exports.Text = Text;
    exports.CaptionedRectangle = CaptionedRectangle;


    Object.defineProperty(exports, '__esModule', { value: true });

})));
//////////////////////////////////////////////////////////////////////////////////////

