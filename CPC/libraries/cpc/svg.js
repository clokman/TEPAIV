
//// UMD HEAD ////////////////////////////////////////////////////////////////////////
// UMD head and foot patterns adapted from d3.js (Copyright 2019 Mike Bostock)
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
        typeof define === 'function' && define.amd ? define(['exports'], factory) :
            (factory((global.svg = global.svg || {})));
}(this, (function (exports) { 'use strict';
//////////////////////////////////////////////////////////////////////////////////////





               
// Module content goes here. 
const version = "1.0"


class Svg {

    constructor(width=500, height=500){

        this._width = width
        this._height = height

        this.create()
    }

    create(){
        d3.select('body')
            .append('svg')
            .attr('width', this._width)
            .attr('height', this._height)
    }

    update(){
        const svgElement = d3.select('svg')
            .attr('width', this._width)
            .attr('height', this._height)
    }

    width(value){

        if (!arguments.length){
            return this._width
        }
        else{
            this._width = value
            this.update()
            return this
        }
    }

    height(value){

        if (!arguments.length){return this._height}
        else{this._height = value}
        this.update()
        return this
    }
}






class Container {

    constructor( parentContainer=d3.select('body').select('svg') ) {

        // Public parameters
        this._parentContainer = parentContainer


        // Private parameters
        this._htmlClass = null
        this._htmlId = null
        this._data = [null]   // WARNING: If data.length is more than 1, multiple containers may be created


        // Private variables
        this._containerSelection = null  // will store d3 selection of self


        // Initialize
        this.create()  // creates without any attributes
        this.update()  // initializes attributes

    }


    create(){

        this._containerSelection = this._parentContainer
            .selectAll('g' + ' #' + this._htmlId)  // must indeed contain id selector. Otherwise would select existing groups, and this would prevent creating more than one container within the svg.
            .data(this._data)  // dummy data
            .enter()
            .append('g')
    }


    update(){
        this._containerSelection
            .attr('class', this.class())
            .attr('id', this.id())
    }


    selectSelf(){
        return this._containerSelection
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

            return this
        }
    }
}






class Rectangle {
    /*
    param svg {SvgCanvas}
     */
    constructor(parentContainer=d3.select('body').select('svg'), x = 0, y = 0, width = 50, height = 50, fill = 'gray', htmlClass = null, htmlId = null, datum = [null]) {

        // this._datum = datum
        this._parentContainer = parentContainer  // gets first existing SVG on DOM
        this._rectangle = null  // gets updated later as a d3 selector

        this._htmlClass = htmlClass
        this._htmlId = htmlId
        this._htmlIdSelector = '#' + this._htmlId

        this._data = [datum]

        this._x = x
        this._y = y
        this._width = width
        this._height = height
        this._fill = fill

        this._draw()

        return this
    }


    _draw() {
        this._rectangle = this._parentContainer
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

        this._rectangle
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

            return this
        }
    }

}






class Text {

        constructor(parentContainer = d3.select('body').select('svg'), text = "Text", x=25, y=25, fontFamily='sans-serif', fontSize='14px', fill='black', textAnchor='left', htmlClass=null, htmlId=null){

            this._parentContainer = parentContainer
            this._text = text

            this._x = x
            this._y = y
            this._fontFamily = fontFamily
            this._fontSize = fontSize
            this._fill = fill
            this._textAnchor = textAnchor

            this._htmlClass = htmlClass
            this._htmlId = htmlId
            this._htmlIdSelector = '#' + htmlId

            this._textSelection = null    // is populated by method as d3.selection


            this._draw()
        }


        _draw(){

            this._textSelection = this._parentContainer
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

            this._textSelection
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


        fill(value) {

            if (!arguments.length) {
                return this._fill
            }
            else {
                this._fill = value

                return this
            }
        }


        x(value) {

            if (!arguments.length) {
                return this._x
            }
            else {
                this._x = value

                return this
            }
        }


        y(value) {

            if (!arguments.length) {
                return this._y
            }
            else {
                this._y = value

                return this
            }
        }


        class(value) {

            if (!arguments.length) {
                return this._htmlClass
            }
            else {
                this._htmlClass = value

                return this
            }
        }


        id(value) {

            if (!arguments.length) {
                return this._htmlId
            }
            else {
                this._htmlId = value

                return this
            }
        }

    }






                                                
//// UMD FOOT ////////////////////////////////////////////////////////////////////////
                             
    //// MODULE.EXPORTS ////
    exports.version = version;
    exports.Svg = Svg;
    exports.Container = Container;
    exports.Rectangle = Rectangle;
    exports.Text = Text;


	Object.defineProperty(exports, '__esModule', { value: true });

})));
//////////////////////////////////////////////////////////////////////////////////////

