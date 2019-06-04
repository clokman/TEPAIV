
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

        this._selection = null  // set by .create()

        this.create()
    }

    create(){
        this._selection = d3.select('body')
            .append('svg')
              .attr('width', this._width)
              .attr('height', this._height)
    }


    select(){
        return this._selection
    }


    clear(){

        this.select().selectAll('*').remove()

        return this
    }


    update(){
        this.select()
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

        if (!arguments.length){
            return this._height
        }
        else{
            this._height = value
        }

        this.update()

        return this
    }
}





/**
 * NOTE: For this class to be instantiated, there must be <b>at least</b> a SVG element existing in DOM.
 * This is true even if the class is initiated with default parameters.
 */
class Group {


    constructor(parentContainerSelection=d3.select('body').select('svg')) {

        // Public Parameters
        this._parentContainerSelection = parentContainerSelection
        this._objects = new Map


        // Private Parameters
        this._htmlClass = null
        this._htmlId = null

        this._x = 25
        this._width = 100
        // For horizontal CPC, `this._y` and `this._height` were not included in this generic class. These values require specific calculations, and are handled by more specific children classes.

        this._data = [null]   // WARNING: If data.length is more than 1, multiple containers may be created

        // Private Variables
        this._selection = null  // will store d3 selection of self


        // Initialize
        this.create()  // creates without any attributes
        this.update()  // initializes attributes

    }


    create(){

        this._selection = this._parentContainerSelection
            .selectAll('g' + ' #' + this._htmlId)  // must indeed contain id selector. Otherwise would select existing groups, and this would prevent creating more than one container within the svg.
            .data(this._data)  // dummy data
            .enter()
            .append('g')
    }


    // WARNING: Update method requires all objects within the container
    // to have an .update() method with transitionDuration parameter.
    update(transitionDuration=500){

        // Update container attributes
        this._selection
            .attr('class', this.class())
            .attr('id', this.id())

        // Call the update method of each object contained within container (e.g., svg.rect or svg.text)
        this.objects().forEach(
            (eachInstance, eachId) => {

                // TODO: This error COULD be tested
                // Make sure the object has an update function of its own
                if (!eachInstance.update){throw Error (`The object contained within the container does not appear to have an update() method. The id of this object is ${eachId} `)}

                eachInstance.update(transitionDuration)

            }
        )

        return this

    }


    select(){
        return this._selection
    }


    remove(){
        this.select().remove()  // .remove() method in the end belongs to d3
    }


    removeLast(n=1){

        // LOOP
        d3.range(n).forEach(i => {

            const lastIndexOfMap = this.objects().size-1
                , arrayifiedMap = Array.from(this.objects())
                , lastKeyAndValueOfMap = arrayifiedMap[lastIndexOfMap]
                , lastKeyOfMap = lastKeyAndValueOfMap[0]

            const lastObject = this.objects().get(lastKeyOfMap)

            // Remove element from DOM
            const domSelection = lastObject.remove()

            // Remove object from registry
            this.objects().delete(lastKeyOfMap)

            return this
        })
    }

    removeAll(){

        const numberOfObjects = this.objects().size
        this.removeLast(numberOfObjects )

    }

    selectSelf(){  // TODO: This method SHOULD be deleted because it is replaced by select()
        return this._selection
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


    x(value){

        if (!arguments.length){
            return this._x
        }
        else{
            this._x = value

            // LOOP //
            this.objects().forEach(
                (eachObjectInGroup, eachObjectId) => {

                    eachObjectInGroup.x(this._x)

                }
            )

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
                (eachObjectInGroup, eachObjectId) => {

                    eachObjectInGroup.width(this._width)

                }
            )

            return this
        }

    }


    /**
     *
     * @param id {string}
     * @param instance - Instance of a class
     */
    objects(id, instance){

        if (!arguments.length){
            return this._objects
        }
        else if (arguments.length === 1){
            return this._objects.get(id)
        }
        else {
            this._objects.set(id, instance)
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

