
//// UMD HEAD ////////////////////////////////////////////////////////////////////////
// UMD head and foot patterns adapted from d3.js (Copyright 2019 Mike Bostock)
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
        typeof define === 'function' && define.amd ? define(['exports'], factory) :
            (factory((global.container = global.container || {})));
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






class Group {


    constructor( parentContainer=d3.select('body').select('svg') ) {

        // Public parameters
        this._parentContainer = parentContainer
        this._containedInstancesRegistry = new Map


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


    // WARNING: Update method requires all objects within the container
    // to have an .update() method with transitionDuration parameter.
    update(transitionDuration=500){

        // Update container attributes
        this._containerSelection
            .attr('class', this.class())
            .attr('id', this.id())


        // Call the update method of each object contained within container (e.g., svg.rect or svg.text)
        this.registry().forEach(
            (eachInstance, eachId) => {

                if (!eachInstance.update){throw Error (`The object contained within the container does not appear to have an update() method. The id of this object is ${eachId} `)}

                eachInstance.update(transitionDuration)

            }
        )

        return this

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


    /**
     *
     * @param id {string}
     * @param instance - Instance of a class
     */
    registry(id, instance){

        if (!arguments.length){
            return this._containedInstancesRegistry
        }
        else {
            this._containedInstancesRegistry.set(id, instance)
            return this
        }

    }
}




                                                
//// UMD FOOT ////////////////////////////////////////////////////////////////////////
                             
    //// MODULE.EXPORTS ////
    exports.version = version;

    exports.Svg = Svg;
    exports.Group = Group;

	Object.defineProperty(exports, '__esModule', { value: true });

})));
//////////////////////////////////////////////////////////////////////////////////////

