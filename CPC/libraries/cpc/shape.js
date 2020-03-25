
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
            this._parentContainerSelection = parentContainerSelection  // gets first existing SVG on DOM
            this._x = 0
            this._y = 0
            this._fill = 'gray'
            this._strokeWidth = '1px'
            this._stroke = 'rgba(0, 0, 0, 0.0)'
            this._visibility = 'visible'
            this._htmlClass = null
            this._htmlId = null
            this._data = [null]
            this._selection = null  // gets updated later as a d3 selection by _draw methods in e.g., Rectangle
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


        stroke(value){
            if (!arguments.length) {
                return this._stroke
            } else {
                this._stroke = value
                return this
            }
        }

        strokeWidth(value){
            if (!arguments.length) {
                return this._strokeWidth
            } else {
                this._strokeWidth = value
                return this
            }
        }


        /**
         *
         * @param value{String} - Takes the values `visible` or `hidden`.
         * @return {string|Shape}
         */
        visibility(value) {

            // Getter
            if (!arguments.length){
                return this._visibility
            }

            // Setter
            else{
                value.mustBeOfType('String')
                this._visibility = value

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
                .transition().duration(transitionDuration)
                .attr('fill', this._fill)
                .attr('stroke', this._stroke)
                .attr('stroke-width', this._strokeWidth)
                .attr('visibility', this._visibility)
                .attr('x', this._x)
                .attr('y', this._y)
                .attr('class', this._htmlClass)
                .attr('id', this._htmlId)
                .attr('width', this._width)
                .attr('height', this._height)

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


        topLeftCorner(){
            const x = this.x()
            const y = this.y()
            return [x, y]
        }


        topRightCorner(){
            const x = this.x() + this.width()
            const y = this.y()
            return [x, y]
        }


        bottomLeftCorner(){
            const x = this.x()
            const y = this.y() + this.height()
            return [x, y]
        }


        bottomRightCorner(){
            const x = this.x() + this.width()
            const y = this.y() + this.height()
            return [x, y]
        }

    }




    // MixIn
    class EnsembleMember {

        constructor(){

            this._linkedObjects = null  // is later set to a Map


            /**
             * Registry method that sets values and returns `null` if a requested value cannot be found.
             * @param key{String} - e.g., 'left'
             * @param newObject - e.g., a LinkableRectangle object
             * @return {EnsembleMember|null|V|Map|Map|Map|Map|Map<any, any>} - if called as get-all method, returns {key => object}.
             * If called as a get-one method, returns the object key corresponds to. If called as a setter, returns `this`.
             * If a requested object cannot be found, it returns null.
             */
            this.linkedObjects = function(key, newObject) {

                const thereIsNoArgument = !arguments.length
                const thereIsOnlyOneArgument = arguments.length === 1
                const thereAreTwoArguments = arguments.length === 2

                // Get all objects
                if (thereIsNoArgument){
                    return this._linkedObjects
                }

                // Get an existing object
                if(thereIsOnlyOneArgument){

                    key.mustBeOfType('String')

                    if(!this._linkedObjects){return undefined}
                    if(!this._linkedObjects.get(key)){return undefined}

                    return this._linkedObjects.get(key)
                }

                // Set a new object
                if(thereAreTwoArguments){

                    key.mustBeOfType('String')
                    // newObject.mustBeOfType('Object') // TODO: mustBeOfType does not accept this, but another method in errorUtils should me made, so that it is possilbe to allow only complex objects (and not primitives)

                    // Initialize a Map object for _linkedObjects if this is not done before
                    if (!this._linkedObjects){this._linkedObjects = new Map()}

                    this._linkedObjects.set(key, newObject)

                    return this
                }

            }


            /**
             * Makes sure that an object's registry of linked objects does not contain the self or duplicate items.
             *  This is to ensure that each 'connection slot' of an object (e.g., 'left' or 'top') is occuped by only
             *  one other member of the ensemble.
             */
            this.validateLinkingLogic = function() {

                // Get linked objects
                const thereIsAtLeastOneLinkedObject = !!this.linkedObjects()
                const linkedObjects = thereIsAtLeastOneLinkedObject  // array
                    ? Array.from( this.linkedObjects().values() )
                    : [null]

                // Ensure that the object is not connected to itself
                const thisObjectIsConnectedToItself = linkedObjects.includes(this)
                if (thisObjectIsConnectedToItself) {
                    throw new Error( `An ensemble member cannot be linked to itself. The attempt was made to link the object with the id '${this.id()}' with type '${this.hasType()}' to itself.` )
                }

                // Ensure that the an object is not added to the ensemble more than one time
                linkedObjects.forEach( linkedObject => {

                    // Copy linkedObjects, so the original array is not modified
                    const remainingObjects = [...linkedObjects]

                    // Remove each object from the list
                    const i = remainingObjects.indexOf(linkedObject)
                    delete remainingObjects[i]  // delete the item without changing index. Yields to e.g., [1,2, empty, 4].

                    // If the list still contains (another of) the same item after removal, throw error
                    if( remainingObjects.includes(linkedObject) ){
                        throw new Error(`It was attempted to add the same object more than once to the 'linkedObjects' registry of the ensemble member with the id (if available) '${this.id()}'. This may indicate the use of the same object in more than one link slot or a recurrent link between two ensemble members. The type of the object that was attempted to be added to the registry is '${linkedObject.hasType()}' and its id is (if available) '${linkedObject.id()}'.`)
                    }

                })

            }

            /**
             * Returns only non-default, user specified field values. This relies
             *  on default values being `null`.
             * @param ensemble {Array} - An array of objects. E.g., [this, this.linkLeft(),
             *  this.linkRight()]. The array can contain `null` values (e.g., `this.linkLeft()` may return `null`).
             * @param sharedFieldNames{Array} - An array of strings. E.g., ['_customParentContainerSelectionForConnectors']
             * @return {Map<string, Map<any, any>>} - Map[ sharedFieldName, Map[ objectId, sharedFieldValue ]].
             */
            this.collectSharedUserSpecifiedPropertiesInEnsemble = function (ensemble,sharedFieldNames) {

                let sharedPropertiesInEnsemble = new Map()

                sharedFieldNames.forEach( sharedFieldName => {

                    // Register shared field name
                    sharedPropertiesInEnsemble.set( sharedFieldName, new Map() )

                    // Add user specified (i.e., non-null) values to shared properties Map
                    ensemble.forEach( objectInEnsemble => {
                        if(!!objectInEnsemble &&  // in case e.g. this.linkLeft returns null
                            !!objectInEnsemble[sharedFieldName]
                        ){
                            sharedPropertiesInEnsemble
                                .get( sharedFieldName )
                                .set( objectInEnsemble.id(), objectInEnsemble[sharedFieldName] )
                        }
                    })

                })

                return sharedPropertiesInEnsemble

            }


            /**
             *
             * @param ensemble{Array} - An array of objects.
             * @param sharedFieldNames {Array} An array of strings.
             */
            this.validateSharedPropertiesInEnsemble = function(ensemble, sharedFieldNames) {

                const sharedUserSpecifiedPropertiesInEnsemble = this.collectSharedUserSpecifiedPropertiesInEnsemble(ensemble, sharedFieldNames)

                sharedUserSpecifiedPropertiesInEnsemble.forEach( (objectIdVsPropertyValueMap, propertyName) => {

                    let propertyValueInPreviousLoop
                    let objectIdInPreviousLoop
                    objectIdVsPropertyValueMap.forEach( (propertyValue, objectId) => {

                        let twoValuesDiffer = false

                        if(!!propertyValueInPreviousLoop){
                            twoValuesDiffer = !(propertyValue === propertyValueInPreviousLoop)
                        }

                        if(twoValuesDiffer){
                            throw(`Property "${propertyName}" is given conflicting values in the ensemble. The conflicts occur in objects with IDs "${objectIdInPreviousLoop}" and "${objectId}".`)
                        }

                        propertyValueInPreviousLoop = propertyValue
                        objectIdInPreviousLoop = objectId

                    })
                })
            }



            this.equalizeSharedPropertiesInEnsemble = function(ensemble, sharedFieldNames){

                // Error checking
                this.validateSharedPropertiesInEnsemble(ensemble, sharedFieldNames)

                // Get shared user-defined field values
                const sharedUserSpecifiedPropertiesInEnsemble = this.collectSharedUserSpecifiedPropertiesInEnsemble(ensemble, sharedFieldNames)

                // Loop over every user-defined field value and assign it to shared fields of all ensemble members
                sharedUserSpecifiedPropertiesInEnsemble.forEach( (objectIdVsPropertyValueMap, propertyName) => {
                    objectIdVsPropertyValueMap.forEach( (propertyValue, objectId) => {
                        ensemble.forEach( objectInEnsemble => {
                            if (!!objectInEnsemble){ // e.g.. LinkableRectangle.linkRight() may have returned an empty object
                                objectInEnsemble[propertyName] = propertyValue
                            }
                        })

                    })
                })



                // sharedFieldNamesInEnsemble.forEach( sharedFieldName => {
                //
                //     [sharedFieldName]
                //
                // })

            }

        }
    }



    let _uniqueIdCounterForLinkableRectangle = 0  // for assigning unique ids

    class LinkableRectangle extends Rectangle{

        constructor(parentContainerSelection=d3.select('body').select('svg')){
            super(parentContainerSelection)

            // Do mix-ins
            const ensembleMember = new EnsembleMember()
            Object.assign(LinkableRectangle.prototype, ensembleMember)


            // Assign class
            this.class('linkable-rectangle')

            // Assign ID number and unique ID
            this._idNumber = LinkableRectangle.uniqueIdCounter()
            this.id( `linkable-rectangle-${ this.idNumber() }` )

            // Increment unique ID counter
            LinkableRectangle.uniqueIdCounter( LinkableRectangle.uniqueIdCounter() + 1 )

            // Private Variables //
            this.sharedFieldNamesInEnsemble = [
                '_customParentContainerSelectionForConnectors'
            ]


            this._connectorObjects = null  // a Map object

            this._customParentContainerSelectionForConnectors = null
            this.updateTriggeredByEnsembleMember = false
        }


        build(){
            this.update()
            return super.update()
        }

        update(transitionDuration = 500) {


            this.validateLinkingLogic()
            registerAnyLinkedObjectsInEachOther.call(this)

            const ensemble = [ this, this.linkLeft(), this.linkRight() ]
            this.equalizeSharedPropertiesInEnsemble(ensemble, this.sharedFieldNamesInEnsemble)

            createAnyConnectorsAndRegisterThemInObjectsTheyConnect.call(this)

            // Trigger updates in all ensemble members
            ensemble.forEach( objectInEnsemble => {
                if(!!objectInEnsemble && objectInEnsemble !== this && !objectInEnsemble.updateTriggeredByEnsembleMember){
                    objectInEnsemble.updateTriggeredByEnsembleMember = true
                    objectInEnsemble.update()
                }
            })
            ensemble.forEach( objectInEnsemble => {
                if(objectInEnsemble){
                    objectInEnsemble.updateTriggeredByEnsembleMember = false
                }
            })

            super.update(transitionDuration)
            return this

            // Helper Functions //

            function registerAnyLinkedObjectsInEachOther() {
                // If there is a linked object on right, register `this` object also in that object

                const anObjectIsLinkedAtLeftSide = !!this.linkLeft()
                const anObjectIsLinkedAtRightSide = !!this.linkRight()

                // If there is a linked object on left, register `this` object also in that object
                if (anObjectIsLinkedAtLeftSide) {
                    const leftLinkableRectangleObject = this.linkLeft()
                    leftLinkableRectangleObject.linkRight(this)
                }

                // If there is a linked object on right, register `this` object also in that object
                if (anObjectIsLinkedAtRightSide) {
                    const rightLinkableRectangleObject = this.linkRight()
                    rightLinkableRectangleObject.linkLeft(this)
                }


            }

            function createAnyConnectorsAndRegisterThemInObjectsTheyConnect() {

                const anObjectIsLinkedAtLeftSide = !!this.linkLeft()
                const anObjectIsLinkedAtRightSide = !!this.linkRight()

                const aConnectorAlreadyExistsAtLeftSide =
                    !!this.connectorObjects('left') ||
                    ( !!this.linkLeft() && !!this.linkLeft().connectorObjects('right') )

                const aConnectorAlreadyExistsAtRightSide =
                    !!this.connectorObjects('right') ||
                    ( !!this.linkRight() && !!this.linkRight().connectorObjects('left') )

                const aCustomParentContainerSelectionIsSpecifiedForConnectors = !!this.customParentContainerSelectionForConnectors()


                // WARNING: THINK TWICE BEFORE FIXING THE DUPLICATE CODE BELOW
                // Even There is some duplication in the following two `if` blocks,
                //  Abstracting the code in them into one method is not recommended
                //  This is due to existence of many 'right' and 'left' strings that,
                //  if generated via an abstract method automatically, could be too
                //  confusing to read/debug.
                if (anObjectIsLinkedAtRightSide) {

                    const connectorId = `connector-linkable-rectangles-${this.idNumber()}-${this.linkRight().idNumber()}`

                    // Create connector Polygon
                    const connectorPolygon = aConnectorAlreadyExistsAtRightSide
                       // Select
                        ? this.connectorObjects('right') || this.linkRight().connectorObjects('left')
                       // Create
                        : aCustomParentContainerSelectionIsSpecifiedForConnectors
                           // Create with custom parent container
                            ? new Polygon( this.customParentContainerSelectionForConnectors() )
                           // Create with default parent container
                            : new Polygon( )

                    connectorPolygon
                        .points(
                            this.topRightCorner(),
                            this.linkRight().topLeftCorner(),
                            this.linkRight().bottomLeftCorner(),
                            this.bottomRightCorner()
                        )

                    aConnectorAlreadyExistsAtRightSide
                        ? connectorPolygon.update()
                        : connectorPolygon
                            .id(connectorId)
                            .build()

                    // Register connector Polygon in self and in linked object's registry
                    this.connectorObjects('right', connectorPolygon)
                    this.linkRight().connectorObjects('left', connectorPolygon)
                }

                if (anObjectIsLinkedAtLeftSide) {

                    const connectorId = `connector-linkable-rectangles-${this.idNumber()}-${this.linkLeft().idNumber()}`

                    // Create connector Polygon
                    const connectorPolygon = aConnectorAlreadyExistsAtLeftSide
                        // Select
                        ? this.connectorObjects('left') || this.linkLeft().connectorObjects('right')
                        // Create
                        : aCustomParentContainerSelectionIsSpecifiedForConnectors
                            // Create with custom parent container
                            ? new Polygon( this.customParentContainerSelectionForConnectors() )
                            // Create with default parent container
                            : new Polygon( )

                    connectorPolygon
                        .points(
                            this.linkLeft().topRightCorner(),
                            this.topLeftCorner(),
                            this.bottomLeftCorner(),
                            this.linkLeft().bottomRightCorner()
                        )

                    aConnectorAlreadyExistsAtLeftSide
                        ? connectorPolygon.update()
                        : connectorPolygon
                            .id(connectorId)
                            .build()


                    // Register connector Polygon in self and in linked object's registry
                    this.connectorObjects('left', connectorPolygon)
                    this.linkLeft().connectorObjects('right', connectorPolygon)

                }
            }

        }


        // Standard Getters //
        

        // Standard Getters/Setters //
        customParentContainerSelectionForConnectors(value){ return !arguments.length ? this._customParentContainerSelectionForConnectors : ( value.mustBeOfType('Selection'), this._customParentContainerSelectionForConnectors = value, this ) }
        // (Almost standard) This getter/setter refers to an extra-class variable
        static uniqueIdCounter(value){ return !arguments.length ? _uniqueIdCounterForLinkableRectangle : ( value.mustBeOfType('Number'), _uniqueIdCounterForLinkableRectangle = value ) }
        linkRight(value){ return !arguments.length ? this.linkedObjects('right') : ( value.mustBeOfType('LinkableRectangle'), this.linkedObjects('right', value), this ) }
        linkLeft(value){ return !arguments.length ? this.linkedObjects('left') : ( value.mustBeOfType('LinkableRectangle'), this.linkedObjects('left', value), this ) }

        // Custom Getters/Setters //
        
        /**
         * @param position{String} - e.g., `left` or `right`
         * @param connectorObject - a Polygon object
         * @return {LinkableRectangle|null|*} - If used for get, returns {positionString => Object}. E.g., {'left' => Polygon}
         */
        connectorObjects(position, connectorObject) {

            const thereIsNoArgument = !arguments.length
            const thereIsOnlyOneArgument = arguments.length === 1
            const thereAreTwoArguments = arguments.length === 2

            // Get all objects
            if (thereIsNoArgument){
                return this._connectorObjects
            }

            // Get a specific object
            if(thereIsOnlyOneArgument){
                position.mustBeOfType('String')

                if(!this._connectorObjects){return undefined}
                if(!this._connectorObjects.get(position)){return undefined}

                return this._connectorObjects.get(position)
            }

            // Set an object
            if(thereAreTwoArguments){

                position.mustBeOfType('String')
                connectorObject.mustBeOfType('Polygon')

                // Initialize a Map object for _connectorObjects if this is not done before
                if (!this._connectorObjects){this._connectorObjects = new Map()}

                this._connectorObjects.set(position, connectorObject)

                return this
            }

        }


        idNumber() {
        
            // Getter
            if (!arguments.length){
                return this._idNumber
            }
        
            else{
                throw('This method cannot be used to set unique ids. Use `LinkableRectangle.uniqueIdCounter()` instead.')
            }
            
        }


        _numberOfCustomParentsForConnectorsSpecifiedInLinkedObjects(){

            let numberOfTimesACustomParentForConnectorsIsSpecifiedInEnsemble = 0

            const linkedObjects = [this, this.linkLeft(), this.linkRight()]
            linkedObjects.forEach( linkedObject => {
                if(!!linkedObject &&
                    !!linkedObject.customParentContainerSelectionForConnectors()
                ){
                    numberOfTimesACustomParentForConnectorsIsSpecifiedInEnsemble++
                }
            })

            return numberOfTimesACustomParentForConnectorsIsSpecifiedInEnsemble

        }


        inferences(){

            const aCustomParentElementForConnectorsIsSpecified =
                this._numberOfCustomParentsForConnectorsSpecifiedInLinkedObjects() > 0

            const customParentElementsForConnectorsAreSpecifiedInMoreThanOneObject =
                this._numberOfCustomParentsForConnectorsSpecifiedInLinkedObjects() > 1



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
            this._fontStyle = 'normal'
            this._fontWeight = 'normal'
            this._rotate = 0
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
                .attr('font-style', this._fontStyle)
                .attr('font-weight', this._fontWeight)
                .attr('text-anchor', this._textAnchor)
                .attr('dominant-baseline', this._dominantBaseline)
                .attr('visibility', this._visibility)

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
                .attr('font-style', this._fontStyle)
                .attr('font-weight', this._fontWeight)
                .attr('transform', `rotate( ${this._rotate}, ${this._x}, ${this._y} )`)
                .attr('text-anchor', this._textAnchor)
                .attr('dominant-baseline', this._dominantBaseline)
                .attr('visibility', this._visibility)

            return this

        }

        /**
         *
         * @param value {string}
         * @return {Text|string}
         */
        text (value) {

            if (!arguments.length) {
                return this._text
            }
            else {
                this._text = value

                return this
            }
        }


        /**
         *
         * @param value {string|number} : e.g.,: '14px' or 14
         * @return {Text|string}
         */
        fontSize(value) {

            if (!arguments.length) {
                return this._fontSize
            }
            else {
                this._fontSize = value.hasType('Number')
                    ? `${value}px`  // If no unit is specified in argument, treat it as pixels
                    : value

                return this
            }
        }


        /**
         *
         * @param value {string} : e.g.,: 'arial'
         * @return {Text|string}
         */
        fontFamily(value) {

            if (!arguments.length) {
                return this._fontFamily
            }
            else {
                this._fontFamily = value

                return this
            }
        }


        /**
         *
         * @param value {string} : Should be either 'italic' or 'normal'.
         * @return {Text|string}
         */
        fontStyle(value) {

            if (!arguments.length) {
                return this._fontStyle
            }
            else {
                this._fontStyle = value

                return this
            }
        }


        /**
         *
         * @param value {string} : Should be either 'bold', 'normal', or take a value.
         * @return {Text|string}
         */
        fontWeight(value) {

            if (!arguments.length) {
                return this._fontWeight
            }
            else {
                this._fontWeight = value.hasType('Number')
                    ? `${value}`
                    : value

                return this
            }
        }


        /**
         *
         * @param value {number}
         * @return {Text|number}
         */
        rotate(value) {

            if (!arguments.length) {
                return this._rotate
            }
            else {

                this._rotate = value

                return this
            }

        }


        /**
         * Returns text width in pixels.
         * @return {number}
         */
        width() {

            const text = this.text()
            const font = this.fontFamily()
            const size = this.fontSize()
            const weight = this.fontWeight()
            // 'this.fontStyle()' is not included because style does not have an effect as a .width() method parameter.

            const textWidth = text.width(`${weight} ${size} ${font}`)

            return textWidth

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

            this.minWidthForTextDisplay = 30  // px
            this.minHeightForTextDisplay = 20  // px

            // Private Parameters //
            this._textPadding = 10        // for text at corners or edges
            this._centerTextOffsetX = 0  // for text at the center of rectangle
            this._centerTextOffsetY = 3


            // Initialize //
            this._rectangleObject = new shape.Rectangle(this._selection)
            this.objects('rectangle', this._rectangleObject)  // add object to container registry

            this._textObject = new shape.Text(this._selection)
            this.objects('text', this._textObject)  // add object to container registry

            this._initializeRectangle()
            this._initializeText()

            this.update()

        }


        _initializeRectangle() {
            this.x(this._x)
            this.y(this._y)
            this.width(this._width)
            this.height(this._height)
        }


        _initializeText(){

            this._calculateAndAdjustTextPositionProperties()
            this._calculateAndAdjustTextVisiblity()

            this._textObject
                .fill( this._textFill )
                .class( 'rectangle-caption' )

        }


        update(transitionDuration=500) {

            super.update(transitionDuration)

            // If rectangle is too small, make text invisible; otherwise make it visible
            const textShouldBeHidden = this.width() < this.minWidthForTextDisplay || this.height() < this.minHeightForTextDisplay
            if ( !!this._textObject ){
                this._calculateAndAdjustTextVisiblity()
                this._textObject.update(transitionDuration)
            }

            return this

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
                this._calculateAndAdjustTextPositionProperties()

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

                this._calculateAndAdjustTextPositionProperties()

                return this
            }

        }


        width(value) {
            if (!arguments.length) {
                return this._width
            }
            else {
                this._width = value
                this._rectangleObject.width(value)
                this._calculateAndAdjustTextPositionProperties()
                return this
            }
        }



        height(value) {
            if (!arguments.length) {
                return this._height
            }
            else {
                this._height = value
                this._rectangleObject.height(value)
                this._calculateAndAdjustTextPositionProperties()
                return this
            }
        }


        stroke(value){
            if (!arguments.length) {
                return this._rectangleObject.stroke()
            }
            else {
                this._rectangleObject.stroke(value)
                return this
            }
        }

        strokeWidth(value){
            if (!arguments.length) {
                return this._rectangleObject.strokeWidth()
            }
            else {
                this._rectangleObject.strokeWidth(value)
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
            if (!arguments.length){
                return this._textObject.fill()
            }
            else{
                this._textObject.fill(value)
                return this
            }
        }


        textAlignment(value){
            if (!arguments.length){
                return this._textAlignment
            }
            // Setter
            else{
                this._textAlignment = value

                this._calculateAndAdjustTextPositionProperties()

                return this
            }

        }


        _calculateAndAdjustTextVisiblity(){

            const textShouldBeHidden = this.width() < this.minWidthForTextDisplay || this.height() < this.minHeightForTextDisplay
            if ( !!this._textObject ){
                if ( textShouldBeHidden ){ this._textObject.visibility('hidden') }
                if ( !textShouldBeHidden ){ this._textObject.visibility('visible') }
            }

        }


        _calculateAndAdjustTextPositionProperties(textAlignment=this._textAlignment){

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


    let polygonCounter = 0  // for assigning unique default polygon Ids

    class Polygon extends Shape {

        constructor( parentContainerSelection=d3.select('body').select('svg') ) {

            // Superclass Init //
            super( parentContainerSelection )
            this.id(`polygon-${rectangleCounter}`)
            polygonCounter++

            this._points = "0,100 200,0 200,200 0,200"

        }

        build(){

            this._selection = this._parentContainerSelection
                .selectAll('polygon' + ' ' + this._htmlIdSelector)
                // .select(this._htmlIdSelector)
                .data(this._data)
                .enter()
                .append('polygon')

            this.update(0)


            return this
        }

        update(transitionDuration=500){

            this._selection
                .transition().duration(transitionDuration)
                .attr( 'class', this._htmlClass )
                .attr( 'id', this._htmlId )
                .attr( 'fill', this._fill )
                .attr( 'points', this.points() )
                .attr( 'stroke-width', this.strokeWidth() )
                .attr( 'stroke', this.stroke() )
                .attr( 'visibility', this.visibility() )

        }



        // Getter/setter methods

        x(){ console.warn('`Polygon.x()` method was called but this method has no effect on polygons. `Polygon.points()` method should be used instead.'); if(!!arguments.length){return this} }
        y(){ console.warn('`Polygon.y()` method was called but this method has no effect on polygons. `Polygon.points()` method should be used instead.'); if(!!arguments.length){return this} }

        /**
         *
         * @param value {Null|String|Array} - If null, returns the points as a string. If String, the coordinates should be entered in the form of `x1,y1 x2,y2` (this is the SVG-compliant way). If Arrays, the coordinates can be entered as `[x1, y1], [x2, y2]`.
         * @return {string|Polygon}
         */
        points(value){

            // Establish conditions
            const argumentsAreArrays = !!arguments.length && value.hasType('Array')
            const argumentIsString = !!arguments.length && value.hasType('String')
            const thereIsNoArgument = !arguments.length

            if( thereIsNoArgument ){
               return this._points
            }

            if( argumentIsString ){
                this._points = value
                return this
            }

            if( argumentsAreArrays ){

                let pointsAsStringExpression = '';  // this semicolon is necessary

                [...arguments].forEach( (xyCoordinate) => {
                    pointsAsStringExpression += xyCoordinate.toString() + ' '
                })

                // Remove the last space character in points string
                pointsAsStringExpression = pointsAsStringExpression.substring(0, pointsAsStringExpression.length - 1)

                this._points = pointsAsStringExpression

                return this
            }


        }


        /**
         * As a getter, gets points as string, converts them, and returns them into an array of numbers.
         * As a setter, accepts an arrays of numbers.
         * @value{} - An array of numbers in the format of  [ [x1, y1], [x2, y2] ]
         * @return {[]} -- An array of numbers in the format of  [ [x1, y1], [x2, y2] ]
         */
        pointsAsNumbers(...value){

            // Getter
            if(!arguments.length){

                const coordinatesAsString = this.points()
                const coordinatesAsArrayOfStrings = coordinatesAsString.split(' ')

                const coordinatesAsStringCouples = []
                coordinatesAsArrayOfStrings.forEach( e => {coordinatesAsStringCouples.push(e.split(','))} )

                const coordinatesAsNumberCouples = []
                coordinatesAsStringCouples.forEach( stringCouple => {
                    coordinatesAsNumberCouples.push([+stringCouple[0], +stringCouple[1]])
                })

                return coordinatesAsNumberCouples
            }

            // Setter
            else {
                this.points(...value)
                return this
            }


        }


    }

//// UMD FOOT ////////////////////////////////////////////////////////////////////////

    //// MODULE.EXPORTS ////
    exports.version = version;
    exports.Shape = Shape;
    exports.Rectangle = Rectangle;
    exports.LinkableRectangle = LinkableRectangle;
    exports.Text = Text;
    exports.CaptionedRectangle = CaptionedRectangle;
    exports.Polygon = Polygon;


    Object.defineProperty(exports, '__esModule', { value: true });

})));
//////////////////////////////////////////////////////////////////////////////////////

