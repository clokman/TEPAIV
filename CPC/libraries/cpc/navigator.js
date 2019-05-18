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




class Svg {

    constructor(width, height){

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

// const svg = new Svg(800,800)



//
//
// // Str = Str.Str
// // surveyData = surveyData.surveyData
//     console.log('aaaaa')
//
//
// // class Browser  extends Rectangle{
// //
// //     constructor() {
// //
// //         super()
// //
// //     }
// //
// // }
// //
// //
// //
// // class Panel extends Rectangle{
// //
// //     constructor() {
// //
// //         super()
// //
// //     }
// //
// // }
// //
// //



class Chart {

    constructor() {

        this._svg = d3.select('body').select('svg')
        this._group = null  // will be replaced by selection of the chart

        this._label = String

        this._x = Number
        this._y = Number

        this._height = Number
        this._width = Number

        this._yStackConstructor
        this._labeledRectangleSpecs = Map()  // {0: {label:'Male' 'y': 10, 'height': 50, 'class': 'chartRectangle', etc...} }


    }

    draw(){}
    label(){}
    x(){}
    y(){}
    height(){}
    width(){}


}




// //
// // class Background extends Rectangle {
// //
// //
// //     constructor() {
// //
// //         super()
// //
// //     }
// //
// // }
// //
// //
//
//
//





class Rectangle {
    /*
    param svg {SvgCanvas}
     */
    constructor(x = 0, y = 0, width = 25, height = 25, fill = 'gray', htmlClass = '', htmlId = '', datum = [null]) {

        // this._datum = datum
        this._svg = d3.select('body').select('svg')  // gets first existing SVG on DOM
        this._rectangle = null  // gets updated later as a d3 selector

        this._htmlClass = htmlClass
        this._htmlId = htmlId

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
        this._rectangle = this._svg.selectAll('rect')
            .data(this._data)
            .enter()
            .append('rect')
            .attr('class', this._htmlClass)
            .attr('class', this._htmlId)
            .attr('x', this._x)
            .attr('y', this._y)
            .attr('width', this._width)
            .attr('height', this._height)
            .attr('fill', this._fill)
    }


    width(value) {

        if (!arguments.length) {
            return this._width
        } else {
            this._width = value
            this._rectangle
                .attr('width', this._width)

            return this
        }
    }


    height(value) {
        if (!arguments.length) {
            return this._height
        } else {
            this._height = value
            this._rectangle
                .attr('height', this._height)

            return this
        }
    }


    fill(value) {
        if (!arguments.length) {
            return this._fill
        } else {
            this._fill = value
            this._rectangle
                .attr('fill', this._fill)

            return this
        }
    }

    x(value) {

        if (!arguments.length) {
            return this._x
        } else {
            this._x = value
            this._rectangle
                .attr('x', this._x)

            return this
        }
    }

    y(value) {
        if (!arguments.length) {
            return this._y
        } else {
            this._y = value
            this._rectangle
                .attr('y', this._y)

            return this
        }
    }

    class(value) {
        if (!arguments.length) {
            return this._htmlClass
        } else {
            this._htmlClass = value
            this._rectangle
                .attr('class', this._htmlClass )

            return this
        }
    }

    id(value) {
        if (!arguments.length) {
            return this._htmlId
        } else {
            this._htmlId = value
            this._rectangle
                .attr('id', this._htmlId)

            return this
        }
    }

}



class Label {

    constructor(label = "Label", x=25, y=25, fontFamily='sans-serif', fontSize='11px', fill='black', textAnchor='left'){

        this._label = label

        this._x = x
        this._y = y
        this._fontFamily = fontFamily
        this._fontSize = fontSize
        this._fill = fill
        this._textAnchor = textAnchor

        this._labelSelection = null    // is populated by method as d3.selection
        this._parentSelection = d3.select('body').select('svg')


        this._draw()
    }

    _draw(){
        this._parentSelection.append('text')
            .text(this._label)
            .attr('x', this._x)
            .attr('y', this._y)
            .attr('font-family', this._fontFamily)
            .attr('font-size', this._fontSize)
            .attr('fill', this._fill)
            .attr('text-anchor', this._textAnchor)
    }

    // label(value) {
    //
    //     if (!arguments.length) {
    //         return this._label
    //     }
    //     else {
    //         this._label = value
    //
    //         this._labelSelection
    //             .attr('label', this._label)
    //
    //         return this
    //     }
    // }

}





    class Category {

        constructor(label = 'Label') {

            this._label = label
            // this._selector = formatAsCssSelector(this._label)

            this._svg = d3.select('body').select('svg')
            this._group = this._svg.append('g')


            // this._draw()

        }


        _draw(){
            this._drawRectangle()
            this._drawLabel()
        }


        label(value) {

            if (!arguments.length) {
                return this._label
            }
            else {
                this._label = value

                this._group
                    .attr('label', this._label)

                // this._insertLabel()

                return this
            }
        }




        _drawLabel(){
            this._svg.append('text')
                .text(this._label)
                .attr('x', 100)
                .attr('y', 100)
                .attr('font-family', 'sans-serif')
                .attr('font-size', '11px')
                .attr('fill', 'black')
                .attr('text-anchor', 'left')
        }

        _drawRectangle(){

            const rectangle = new Rectangle()
            rectangle.x(100)
            rectangle.y(100)

        }
    }




    /*
    @param instancePropertyName {String}
    @param htmlAttribute {String}
     */
    // comboGetSet(instancePropertyName, htmlAttribute, newValue=null) {
    //
    //     eval(`
    //
    //     if (!${newValue}) {
    //         return this.${instancePropertyName}
    //     }
    //     else {
    //
    //         this.${instancePropertyName} = ${newValue}
    //
    //         this._rectangle
    //             .attr(${htmlAttribute}, this.${instancePropertyName})
    //
    //     `
    //     )
    //     return this
    //     }
    //
    // }


//
//
//
//
//
// class Text{
//
//     constructor() {
//
//
//     }
//
// }






//// UMD FOOT ////////////////////////////////////////////////////////////////////////

    //// MODULE.EXPORTS ////
    exports.version = version;
    exports.Category = Category;
    exports.Rectangle = Rectangle;
    exports.Label = Label;
    exports.Svg = Svg;


    Object.defineProperty(exports, '__esModule', {value: true});

})));
//////////////////////////////////////////////////////////////////////////////////////

