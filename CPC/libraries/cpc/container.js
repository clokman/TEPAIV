//// UMD HEAD ////////////////////////////////////////////////////////////////////////
// UMD head and foot patterns adapted from d3.js
( function ( global, factory ) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory( exports ) :
        typeof define === 'function' && define.amd ? define( [ 'exports' ], factory ) :
            ( factory( ( global.container = global.container || {} ) ) )
}( this, ( function ( exports ) {
    'use strict'
//////////////////////////////////////////////////////////////////////////////////////




// Module content goes here.
    const version = '1.0'




    class Svg {

        constructor( width = 500, height = 500, parentContainerSelectionOrObject = d3.select( 'body' ) ) {

            this._width = width
            this._height = height

            this._parentContainerSelection = container.Group.getD3SelectionFromVariousParameterTypes( parentContainerSelectionOrObject )
            this._selection = null  // set by .create()

            this.create()
        }


        create() {
            this._selection = this._parentContainerSelection
                .append( 'svg' )
                .attr( 'width', this._width )
                .attr( 'height', this._height )
        }


        select() {
            return this._selection
        }


        clear() {

            this.select().selectAll( '*' ).remove()

            return this
        }


        update() {
            this.select()
                .attr( 'width', this._width )
                .attr( 'height', this._height )

        }


        width( value ) {

            if( !arguments.length ) {
                return this._width
            }
            else {
                this._width = value
                this.update()

                return this
            }
        }


        height( value ) {

            if( !arguments.length ) {
                return this._height
            }
            else {
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


        constructor( parentContainerSelectionOrObject = d3.select( 'body' ).select( 'svg' ) ) {

            this.parentObject = container.Group.getAnyObject( parentContainerSelectionOrObject )

            // TODO: If there is  no SVG element already existing in DOM, init method should return an error
            this.parentContainerSelection = container.Group.getD3SelectionFromVariousParameterTypes( parentContainerSelectionOrObject )


            this._objects = new Map()
            this._visibility = 'visible'

            this._htmlClass = null
            this._htmlId = null

            this._x = 25
            this._width = 100
            // For horizontal CPC, `this._y` and `this._height` were not included in this generic class. These values
            // require specific calculations, and are handled by more specific children classes.

            this._data = [ null ]   // WARNING: If data.length is more than 1, multiple containers may be created

            // Private Variables
            this._selection = null  // will store d3 selection of self


            // Initialize
            this.create()  // creates without any attributes
            this.update()  // initializes attributes

        }


        create() {

            this._selection = this.parentContainerSelection
                .selectAll( 'g' + ' #' + this._htmlId )  // must indeed contain id selector. Otherwise would select
                                                         // existing groups, and this would prevent creating more than
                                                         // one container within the svg.
                .data( this._data )  // dummy data
                .enter()
                .append( 'g' )
        }


        // WARNING: Update method requires all objects within the container
        // to have an .update() method with transitionDuration parameter.
        update( transitionDuration = 500 ) {

            // Update container attributes
            this._selection
                .attr( 'class', this.class() )
                .attr( 'id', this.id() )
                .attr( 'visibility', this.visibility() )

            // Call the update method of each object contained within container (e.g., svg.rect or svg.text)
            this.objects().forEach(
                ( eachInstance, eachId ) => {

                    eachInstance.visibility( this.visibility() )

                    // TODO: This error COULD be tested
                    // Make sure the object has an update function of its own
                    if( !eachInstance.update ) {throw Error( `The object contained within the container does not appear to have an update() method. The id of this object is ${eachId} ` )}

                    eachInstance.update( transitionDuration )

                }
            )

            return this

        }


        /**
         * Returns D3 selection. During usage, the returned object can be continued with D3's .attr() method.
         * @return {d3.Selection}
         */
        select() {
            return this._selection
        }


        remove() {
            this.select().remove()  // .remove() method in the end belongs to d3
            this.removeAll()
        }


        removeAll() {

            const numberOfObjects = this.objects().size
            this.removeLast( numberOfObjects )

        }


        removeLast( n = 1 ) {

            // LOOP
            d3.range( n ).forEach( i => {

                const lastIndexOfMap = this.objects().size - 1
                    , arrayifiedMap = Array.from( this.objects() )
                    , lastKeyAndValueOfMap = arrayifiedMap[ lastIndexOfMap ]
                    , lastKeyOfMap = lastKeyAndValueOfMap[ 0 ]

                const lastObject = this.objects().get( lastKeyOfMap )

                // Remove element from DOM
                const domSelection = lastObject.remove()

                // Remove object from registry
                this.objects().delete( lastKeyOfMap )

                return this
            } )
        }


        /**
         * @deprecated
         * @return {Selection}
         */
        selectSelf() {  // TODO: This method SHOULD be deleted because it is replaced by select()
            return this._selection
        }


        // Standard getters and setters //
        visibility( value ) { return !arguments.length ? this._visibility : ( value.mustBeOfType( 'String' ), this._visibility = value, this ) }


        class( value ) { return !arguments.length ? this._htmlClass : ( value.mustBeOfType( 'String' ), this._htmlClass = value, this ) }


        id( value ) { return !arguments.length ? this._htmlId : ( value.mustBeOfType( 'String' ), this._htmlId = value, this ) }


        // Custom Getters and Setters //

        x( value ) {

            if( !arguments.length ) {
                return this._x
            }
            else {
                this._x = value

                // LOOP //
                this.objects().forEach(
                    ( eachObjectInGroup, eachObjectId ) => {

                        eachObjectInGroup.x( this._x )

                    }
                )

                return this
            }

        }


        width( value ) {

            if( !arguments.length ) {
                return this._width
            }
            else {
                this._width = value

                // LOOP //
                this.objects().forEach(
                    ( eachObjectInGroup, eachObjectId ) => {

                        eachObjectInGroup.width( this._width )

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
        objects( id, instance ) {

            if( !arguments.length ) {
                return this._objects
            }
            else if( arguments.length === 1 ) {
                return this._objects.get( id )
            }
            else {
                this._objects.set( id, instance )
                return this
            }

        }


        /**
         * Convenience method for interacting with _getLineage(). Returns either complete ancestry information if no
         * parameter is provided. If a parameter is provided, returns the parent that matches that ID. If parameter is
         * provided but no matching ID was found, returns undefined.
         * returns
         * @param id {string}
         * @returns {Map|Object|undefined}
         * @see Group._getLineage
         */
        parentObjects( id ) {

            const parentObjects = this._getLineage()

            if( !arguments.length ) {
                return parentObjects
            }
            else {
                return parentObjects.get( id )
            }

        }


        /**
         * Traverses the object hierarchy from child to parents and returns all of the parent objects in which the
         * current object is nested. Outputs a `Map` that contains information such as:
         * { grandparent: <Object>, parent: <Object> }
         * @returns {Map<any, any>}
         */
        _getLineage() {

            const lineage = new Map()

            function traverseAndRegisterLineage( object ) {

                if( !!object.parentObject &&  // because an object may not always have a parent (e.g., panel-0)
                    !!object.parentObject.id ) {  // parent object must also have an id method
                    lineage.set(
                        object.parentObject.id(),
                        object.parentObject
                    )

                    traverseAndRegisterLineage( object.parentObject )
                }

            }

            traverseAndRegisterLineage( this )

            return lineage
        }


        /**
         * If `parentContainerSelectionOrObject` parameter was provided an object, returns this object. If the parent
         * selection has been given as a D3 `Selection`, returns undefined.
         * @returns {Object|undefined}
         */
        static getAnyObject( parentSpecifier ) {

            const parameterIsAnObject =
                parentSpecifier.constructor.name !== 'Selection'  // if parent is not a D3 selection
                && typeof parentSpecifier === 'object'  // just a very general check, so it's not a string, etc.

            return parameterIsAnObject
                ? parentSpecifier
                : undefined

        }


        /**
         * If the parameter is already a D3 Selection, returns it as it is. If the parameter is an object that an
         * return a D3 selection via one of its method, calls this method and returns the returned D3 selection.
         * @param parentSpecifier {Object|Selection}
         * @return {*}
         */
        static getD3SelectionFromVariousParameterTypes( parentSpecifier ) {

            const parameterIsAD3Selection = classUtils.isInstanceOf( parentSpecifier, 'Selection' )

            const parameterIsASelectableObject = !!parentSpecifier.select  // checks if method exists

            if( parameterIsAD3Selection ) {
                return parentSpecifier
            }

            if( parameterIsASelectableObject ) {
                return parentSpecifier.select()
            }


            // Error if parent is not a D3 selection or an object that can return a D3 selection
            if( !parameterIsAD3Selection && !parameterIsASelectableObject ) {
                throw Error( `Parent parameter must either be an instance of either D3 Selection or an Object with a select() method that returns a D3 selection. The current parent parameter is ${parent}` )
            }
        }

    }




    let _uniqueIdCounterForEnsembles = 0  // for assigning unique ids


    /**
     * A container class that acts as registry and does not have any DOM functionality.
     * @see shape.EnsembleMember
     * @see shape.LinkableRectangle
     */
    class Ensemble extends Group {


        /**
         *
         * @param parentContainerSelectionOrObject {Element} - If unspecified sets the parent to the SVG object by
         * default.
         */
        constructor( parentContainerSelectionOrObject = d3.select( 'body' ).select( 'svg' ) ) {

            super( parentContainerSelectionOrObject )

            // Assign ID number and unique ID
            this._idNumber = Ensemble.uniqueIdNumber()

            this.id( `ensemble-${this.idNumber()}` )

            // Increment unique ID counter
            Ensemble.uniqueIdNumber( Ensemble.uniqueIdNumber() + 1 )


            this._sharedSettersAndValues = null

        }


        // Standard getters/setters
        static uniqueIdNumber( value ) { return !arguments.length ? _uniqueIdCounterForEnsembles : ( value.mustBeOfType( 'Number' ), _uniqueIdCounterForEnsembles = value ) }


        // An Enhanced version of Group.objects().
        // TODO: Enhancements in this method should be transferred to Group.objects()
        members( key, newObject ) {

            super.objects()

            const thereIsNoArgument = !arguments.length
            const thereIsOnlyOneArgument = arguments.length === 1
            const thereAreTwoArguments = arguments.length === 2

            // Get all objects
            if( thereIsNoArgument ) {
                return this.objects().size > 0
                    ? this.objects()
                    : undefined
            }

            // Get an existing object
            if( thereIsOnlyOneArgument ) {

                key.mustBeOfType( 'String' )


                // If requested key is not found, or if registry is empty, return null
                if( !this.objects( key ) ) {return undefined}

                return this.objects( key )
            }

            // Set a new object
            if( thereAreTwoArguments ) {

                key.mustBeOfType( 'String' )
                if( !newObject.usesEnsembleMemberMixIn ) {
                    throw new Error( `'.members()' method of an Ensemble instance attempted register a '${newObject.hasType()}' class object into Ensemble registry. Ensemble registry only accepts 'EnsembleMember' instances.` )
                }


                this.objects( key, newObject )

                return this
            }

        }


        /**
         * Removes a member from Ensemble registry.
         * @param memberId{String} - Key to delete in Ensemble registry
         */
        removeMember( memberId ) {

            this.members().delete( memberId )

        }


        /**
         *
         * @param methodName{String}
         * @param fieldValue{*}
         * @returns {null|Ensemble|undefined|*}
         */
        sharedSettersAndValues( methodName, fieldValue ) {

            // Establish conditions
            const thereIsNoArgument = !arguments.length
            const thereIsOnlyOneArgument = arguments.length === 1
            const thereAreTwoArguments = arguments.length === 2


            // Get all objects
            if( thereIsNoArgument ) {
                return this._sharedSettersAndValues
            }


            // Get an existing object
            if( thereIsOnlyOneArgument ) {

                methodName.mustBeOfType( 'String' )

                // If requested methodName is not found, or if registry is empty, return null
                if( !this._sharedSettersAndValues ) {return undefined}
                // if(!this._sharedSettersAndValues.get(methodName.name)){return undefined}

                // Return registry value
                return this._sharedSettersAndValues.get( methodName )
            }

            // Add a new object and SET its value
            // (Allowing some duplicate code in this block for clear separation of all modes of this methodName)
            if( thereAreTwoArguments ) {

                methodName.mustBeOfType( 'String' )

                // Initialize a Map object for _sharedSettersAndValues if this is not done before
                if( !this._sharedSettersAndValues ) {this._sharedSettersAndValues = new Map()}


                this._sharedSettersAndValues.set( methodName, fieldValue )

                return this
            }

        }


        /**
         * Grabs the first argument from a setter and writes it to and Ensemble registry
         * @returns - nothing
         */
        hookRegistryToSharedSetters() {

            thereMustBeAtLeastOneSharedGetterSpecified.call( this )

            this.sharedSettersAndValues().forEach( ( getterValue, getterName ) => {

                this.members().forEach( ( member, memberName ) => {

                    const sharedSettersAndValues = this.sharedSettersAndValues()

                    // Grab the first argument and write it to Ensemble registry
                    eval( `
                        member.${getterName} = functionUtils.injectIntoMethod(
                            member.${getterName}, function(){
                                if(arguments.length === 1){
                                    member.ensembleObject.sharedSettersAndValues('${getterName}', arguments[0])
                                }
                            }
                        )                    
                    ` )


                } )
            } )

            function thereMustBeAtLeastOneSharedGetterSpecified() {
                if( !this.sharedSettersAndValues() ) {
                    throw new Error( `Cannot hook registry to setters because 'this._sharedSettersAndGetters' is empty. Did you forget to add shared getters using 'this.sharedSettersAndValues()'?` )
                }
            }

        }


        synchronizeAnySharedFieldsOfMembers() {

            if( !!this.sharedSettersAndValues() ) {
                this.sharedSettersAndValues().forEach( ( setterValue, setterName ) => {
                    this.members().forEach( ( memberObject, memberName ) => {
                        eval( `memberObject.${setterName}(setterValue)` )
                    } )
                } )
            }

        }


        idNumber() {

            // Getter
            if( !arguments.length ) {
                return this._idNumber
            }

            else {
                throw 'This method cannot be used to set unique ids. Use `Ensemble.uniqueIdNumber()` instead.'
            }

        }

    }




//// UMD FOOT ////////////////////////////////////////////////////////////////////////

    //// MODULE.EXPORTS ////
    exports.version = version

    exports.Svg = Svg
    exports.Group = Group
    exports.Ensemble = Ensemble

    Object.defineProperty( exports, '__esModule', { value: true } )

} ) ) )
//////////////////////////////////////////////////////////////////////////////////////

