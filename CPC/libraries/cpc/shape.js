
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
        this._textAnchor = 'left'


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
    }


    update(transitionDuration){

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


    textAnchor(value) {

        if (!arguments.length) {
            return this._textAnchor
        }
        else {
            this._textAnchor = value

            return this
        }
    }

}



                                                
//// UMD FOOT ////////////////////////////////////////////////////////////////////////
                             
    //// MODULE.EXPORTS ////
    exports.version = version;
    exports.Shape = Shape;
    exports.Rectangle = Rectangle;
    exports.Text = Text;


	Object.defineProperty(exports, '__esModule', { value: true });

})));
//////////////////////////////////////////////////////////////////////////////////////

