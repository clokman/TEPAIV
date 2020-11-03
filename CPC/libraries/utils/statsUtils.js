//// UMD HEAD ////////////////////////////////////////////////////////////////////////
// UMD head and foot patterns adapted from d3.js
( function ( global, factory ) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory( exports ) :
        typeof define === 'function' && define.amd ? define( [ 'exports' ], factory ) :
            ( factory( ( global.arrayUtils = global.arrayUtils || {} ) ) )
}( this, ( function ( exports ) {
    'use strict'
//////////////////////////////////////////////////////////////////////////////////////


// CREDITS:
// Based on code from:
// https://stackoverflow.com/questions/48719873/how-to-get-median-and-quartiles-percentiles-of-an-array-in-javascript-or-php



// Module content goes here.
    const version = '1.0'


// Sort array ascending
    function sortAscending() {
        return this.sort( ( a, b ) => a - b )
    }

    function sortDescending() {
        return this.sort( ( a, b ) => b - a )
    }

    function sum() {
        return this.reduce( ( a, b ) => a + b, 0 )
    }


    function mean() {
        return this.sum() / this.length
    }



// Sample standard deviation
    function standardDeviation() {

        const mu = this.mean()
        const diffArr = this.map( a => ( a - mu ) ** 2 )
        return Math.sqrt( diffArr.sum() / ( this.length - 1 ) )

    }


    function quantile( quantile ) {

        const sorted = this.sortAscending()
        const pos = ( sorted.length - 1 ) * quantile
        const base = Math.floor( pos )
        const rest = pos - base

        if( sorted[ base + 1 ] !== undefined ) {
            return sorted[ base ] + rest * ( sorted[ base + 1 ] - sorted[ base ] )
        }
        else {
            return sorted[ base ]
        }

    }

    function quantile0() {
        return this.quantile( 0 )
    }

    function quantile25() {
        return this.quantile( .25 )
    }

    function quantile50() {
        return this.quantile( .50 )
    }

    function quantile75() {
        return this.quantile( .75 )
    }

    function quantile1() {
        return this.quantile( 1 )
    }

    function quartiles() {

        const quartiles = [
            this.quantile( 0 ),
            this.quantile( .25 ),
            this.quantile( .50 ),
            this.quantile( .75 ),
            this.quantile( 1 )
        ]

        return quartiles
    }


    function median() {
        return this.quantile50()
    }


//// UMD FOOT ////////////////////////////////////////////////////////////////////////

    //// MODULE.EXPORTS ////
    exports.version = version

    Array.prototype.sortAscending = sortAscending
    Array.prototype.sortDescending = sortDescending
    Array.prototype.sum = sum
    Array.prototype.mean = mean
    Array.prototype.median = median
    Array.prototype.standardDeviation = standardDeviation
    Array.prototype.quantile = quantile
    Array.prototype.quantile0 = quantile0
    Array.prototype.quantile25 = quantile25
    Array.prototype.quantile50 = quantile50
    Array.prototype.quantile75 = quantile75
    Array.prototype.quantile1 = quantile1
    Array.prototype.quartiles = quartiles


    Object.defineProperty( exports, '__esModule', { value: true } )

} ) ) )
//////////////////////////////////////////////////////////////////////////////////////

