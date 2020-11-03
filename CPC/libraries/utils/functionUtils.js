//// UMD HEAD ////////////////////////////////////////////////////////////////////////
// UMD head and foot patterns adapted from d3.js
( function ( global, factory ) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory( exports ) :
        typeof define === 'function' && define.amd ? define( [ 'exports' ], factory ) :
            ( factory( ( global.functionUtils = global.functionUtils || {} ) ) )
}( this, ( function ( exports ) {
    'use strict'
//////////////////////////////////////////////////////////////////////////////////////




// Module content goes here.
    const version = '1.0'


    /**
     * Injects a callback to the target function that runs BEFORE the function body and returns to function with the
     *  injected code
     * @param targetFunction {Function}
     * @param callback {Function}
     * @returns {function(...[*]=): *}
     */
    const injectIntoFunction = function ( targetFunction, callback ) {

        const cachedFunction = Object.assign( targetFunction )

        return function ( ...args ) {
            callback.apply( this, args )
            return cachedFunction.apply( this, args )  // `apply(this, ...args)` preserves the value of this in the
                                                       // original method
        }

    }




// Alias
    const injectIntoMethod = injectIntoFunction



//// UMD FOOT ////////////////////////////////////////////////////////////////////////

    //// MODULE.EXPORTS ////
    exports.version = version
    exports.injectIntoFunction = injectIntoFunction
    exports.injectIntoMethod = injectIntoMethod


    Object.defineProperty( exports, '__esModule', { value: true } )

} ) ) )
//////////////////////////////////////////////////////////////////////////////////////

