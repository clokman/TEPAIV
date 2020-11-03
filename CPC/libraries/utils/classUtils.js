//// UMD HEAD ////////////////////////////////////////////////////////////////////////
// UMD head and foot patterns adapted from d3.js
( function ( global, factory ) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory( exports ) :
        typeof define === 'function' && define.amd ? define( [ 'exports' ], factory ) :
            ( factory( ( global.classUtils = global.classUtils || {} ) ) )
}( this, ( function ( exports ) {
    'use strict'
//////////////////////////////////////////////////////////////////////////////////////




// Module content goes here.
    const version = '1.0'




    /**
     * From SO answer of Chong Lip Phang at https://stackoverflow.com/a/45332959/3102060
     * NOTE: The properties and methods of classes that occur later in the arguments of this method will overwrite
     * NOTE: This may not work with React `Component`.
     * the previous properties and methods with the same names.
     * @param mixins - Other classes to be added
     * @return {base}
     */
    Object.prototype.mixInClass = function ( ...mixins ) {

        class base extends this {
            constructor( ...args ) {
                super( ...args )
                mixins.forEach( ( mixin ) => {
                    copyProps( this, ( new mixin ) )
                } )
            }
        }




        let copyProps = ( target, source ) => {  // this function copies all properties and symbols, filtering out some special ones
            Object.getOwnPropertyNames( source )
                .concat( Object.getOwnPropertySymbols( source ) )
                .forEach( ( prop ) => {
                    if( !prop.match( /^(?:constructor|prototype|arguments|caller|name|bind|call|apply|toString|length)$/ ) )
                        Object.defineProperty( target, prop, Object.getOwnPropertyDescriptor( source, prop ) )
                } )
        }

        mixins.forEach( ( mixin ) => { // outside contructor() to allow classes(A,B,C).staticFunction() to be called etc.
            copyProps( base.prototype, mixin.prototype )
            copyProps( base, mixin )
        } )

        return base
    }


    function isInstanceOf( instance, expectedClass ) {
        if( expectedClass.constructor.name === 'String' ) {
            return instance.constructor.name === expectedClass
        }
        else {
            return instance.constructor.name === expectedClass.name
        }
    }


    function requireProperties( instance, propertyKeys ) {

        const requiredProperties = propertyKeys
        let missingProperties = []

        // If any property is missing from the Dataset instance, add them to array
        requiredProperties.forEach( ( propertyKey ) => {

            if( !instance.hasOwnProperty( propertyKey ) ) {
                missingProperties.push( propertyKey )
            }
        } )

        // If array is not emty, this means that at least one required property is missing from Dataset instance
        if( missingProperties.length !== 0 ) {

            throw Error( `Properties "${missingProperties}" do not exist in the provided ${instance.constructor.name} instance.` )

        }

    }



//// UMD FOOT ////////////////////////////////////////////////////////////////////////

    //// MODULE.EXPORTS ////
    exports.version = version
    exports.isInstanceOf = isInstanceOf
    exports.requireProperties = requireProperties


    Object.defineProperty( exports, '__esModule', { value: true } )

} ) ) )
//////////////////////////////////////////////////////////////////////////////////////

