
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

    constructor( width=500, height=500, parentContainerSelectionOrObject=d3.select('body') ){

        this._width = width
        this._height = height

        this._parentContainerSelection = container.Group.getD3SelectionFromVariousParameterTypes(parentContainerSelectionOrObject)
        this._selection = null  // set by .create()

        this.create()
    }


    create(){
        this._selection = this._parentContainerSelection
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


    constructor(parentContainerSelectionOrObject=d3.select('body').select('svg')) {

        // TODO: If there is  no SVG element already existing in DOM, init method should return an error
        this.parentContainerSelection = container.Group.getD3SelectionFromVariousParameterTypes(parentContainerSelectionOrObject)


        this._objects = new Map()
        this._visibility = 'visible'

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

        this._selection = this.parentContainerSelection
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
            .attr('visibility', this.visibility())

        // Call the update method of each object contained within container (e.g., svg.rect or svg.text)
        this.objects().forEach(
            (eachInstance, eachId) => {

                eachInstance.visibility( this.visibility() )

                // TODO: This error COULD be tested
                // Make sure the object has an update function of its own
                if (!eachInstance.update){throw Error (`The object contained within the container does not appear to have an update() method. The id of this object is ${eachId} `)}

                eachInstance.update(transitionDuration)

            }
        )

        return this

    }


    /**
     * Returns D3 selection. Statement can be continued with D3's .attr() method.
     * @return {d3.Selection}
     */
    select(){
        return this._selection
    }


    remove(){
        this.select().remove()  // .remove() method in the end belongs to d3
    }


    removeAll(){

        const numberOfObjects = this.objects().size
        this.removeLast(numberOfObjects)

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


    selectSelf(){  // TODO: This method SHOULD be deleted because it is replaced by select()
        return this._selection
    }

    // Standard getters and setters //
    visibility(value){ return !arguments.length ? this._visibility : ( value.mustBeOfType('String'), this._visibility = value, this ) }
    class(value){ return !arguments.length ? this._htmlClass : ( value.mustBeOfType('String'), this._htmlClass = value, this ) }
    id(value){ return !arguments.length ? this._htmlId : ( value.mustBeOfType('String'), this._htmlId = value, this ) }


    // Custom Getters and Setters //

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

    /**
     * If the parameter is already a D3 Selection, returns it as it is. If the parameter is an object that an return a D3 selection via one of its method, calls this method and returns the returned D3 selection.
     * @param parentSpecifier {Object|Selection}
     * @return {*}
     */
    static getD3SelectionFromVariousParameterTypes(parentSpecifier){

        const parameterIsAD3Selection = classUtils.isInstanceOf(parentSpecifier, 'Selection')

        const parameterIsAnObject = classUtils.isInstanceOf(parentSpecifier, 'Panel')
        const parameterIsASelectableObject = !!parentSpecifier.select  // checks if method exists

        if (parameterIsAD3Selection) {
            return parentSpecifier
        }

        if (parameterIsASelectableObject) {
            return parentSpecifier.select()
        }


        // Error if parent is not a D3 selection or an object that can return a D3 selection
        if(!parameterIsAD3Selection && !parameterIsASelectableObject){
            throw Error(`Parent parameter must either be an instance of either D3 Selection or an Object with a select() method that returns a D3 selection. The current parent parameter is ${parent}`)
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

