//// UMD HEAD ////////////////////////////////////////////////////////////////////////
// UMD head and foot patterns adapted from d3.js
( function ( global, factory ) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory( exports ) :
        typeof define === 'function' && define.amd ? define( [ 'exports' ], factory ) :
            ( factory( ( global.mapUtils = global.mapUtils || {} ) ) )
}( this, ( function ( exports ) {
    'use strict'
//////////////////////////////////////////////////////////////////////////////////////




// Module content goes here.
    const version = '1.0'


    Map.prototype.convertKeysToString = function () {

        let keysAsString = ''

        this.forEach( ( value, key ) => {
            keysAsString = keysAsString + `${key}, `
        } )
        keysAsString = keysAsString.slice( 0, -2 )

        return keysAsString
    }


    Map.prototype.sortAccordingTo = function ( templateMap ) {

        let templateMapKeys = []
        templateMap.forEach( ( value, key ) => {templateMapKeys.push( key )} )

        const targetMapAsArray = Array.from( this )

        const customSortedResults = targetMapAsArray.sort( ( a, b ) => {

            let categoryNameA = a[ 0 ]
            let categoryNameB = b[ 0 ]

            let categoryNameAScore = 0.0
            let categoryNameBScore = 0.0


            // Give a higher penalty for being late in the order of template array
            let i = 0
            templateMap.forEach( templateCategoryName => {
                if( categoryNameA === templateMapKeys[ i ] ) {categoryNameAScore += 1 / i}
                if( categoryNameB === templateMapKeys[ i ] ) {categoryNameBScore += 1 / i}
                i++
            } )

            if( categoryNameAScore < categoryNameBScore ) {return +1}
            if( categoryNameAScore > categoryNameBScore ) {return -1}

        } )

        const targetMapAsMapAgain = new Map( customSortedResults )

        return targetMapAsMapAgain

    }




//// UMD FOOT ////////////////////////////////////////////////////////////////////////

    //// MODULE.EXPORTS ////
    exports.version = version


    Object.defineProperty( exports, '__esModule', { value: true } )

} ) ) )
//////////////////////////////////////////////////////////////////////////////////////

