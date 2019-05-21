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






class Chart extends Container {


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

        const stackMin = this._stack.min()
            , stackMax = this._stack.max()

        const rangeStart = this._y + this._height  // bottom edge of chart
            , rangeEnd = this._y                   // top edge

        this._scaleFunction = d3.scaleLinear()
            .domain([stackMin, stackMax])
            .rangeRound([rangeStart, rangeEnd])

        this._scaledStack = this._stack.scale(this._scaleFunction)

        this._categoryObjectsInChart = new Map()   // acts as object registry


        // Initialize


        this._draw()
        this.updateChart()

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

                this._categoryObjectsInChart.set(eachCategoryId, categoryObject)
            }

        )


    }


    updateChart(){  // TODO: Method name SHOULD be changed to update(). This has been problematic due to the existence of the update method also in the superclass.

        super.update()

        // LOOP //
        this._categoryObjectsInChart.forEach(
            (eachCategoryObject, eachCategoryId) => {

                eachCategoryObject.update()

            }
        )

        return this
    }


    x(value){

        if (!arguments.length){
            return this._x
        }
        else{
            this._x = value

            // LOOP //
            this._categoryObjectsInChart.forEach(
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
            this._categoryObjectsInChart.forEach(
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


    height(){}
    width(){}


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






class Category extends Rectangle {


    constructor(parentContainer=d3.select('body').select('svg'), x=25, y=25, percentage='0', percentageTextOffsetX=0, percentageTextOffsetY=3, percentageTextFill='white', percentageTextAnchor='middle') {

        super(parentContainer)


        super.x(x)
        super.y(y)

        this._percentage = percentage

        this._percentageTextOffsetX = percentageTextOffsetX
        this._percentageTextOffsetY = percentageTextOffsetY

        this._percentageTextFill = percentageTextFill
        this._percentageTextAnchor = percentageTextAnchor

        this._percentageText = new Text(parentContainer)

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
    exports.Container = Container;
    exports.Chart = Chart;
    exports.Category = Category;
    exports.Rectangle = Rectangle;
    exports.Text = Text;
    exports.Svg = Svg;


    Object.defineProperty(exports, '__esModule', {value: true});

})));
//////////////////////////////////////////////////////////////////////////////////////

