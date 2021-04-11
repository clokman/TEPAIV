//// UMD HEAD ////////////////////////////////////////////////////////////////////////
// UMD head and foot patterns adapted from d3.js
( function ( global, factory ) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory( exports ) :
        typeof define === 'function' && define.amd ? define( [ 'exports' ], factory ) :
            ( factory( ( global.agent = global.agent || {} ) ) )
}( this, ( function ( exports ) {
    'use strict'
//////////////////////////////////////////////////////////////////////////////////////


    const defaults = {
        fill: 'DodgerBlue',
        x: 20,
        y: 20,
        width: 10,
        height: 10
    }




    class Agent {

        /**
         *
         * @param x {number}
         * @param y {number}
         * @param fill {string}
         */
        constructor( { x = defaults.x, y = defaults.y, fill = defaults.fill } = {} ) {
            this.object = new shape.Rectangle()
            this.object.x( x )
            this.object.y( y )
            this.object.width( defaults.width )
            this.object.height( defaults.height )
            this.object.fill( fill )
            this.object.class( 'agent' )
            this.object.update()
        }


        /**
         * Move element by x and y pixels in given duration
         * @param x {number}
         * @param y {number}
         * @param duration {number}: How long it takes to complete the move
         */
        moveBy( { x, y, duration = 500 } = {} ) {

            this.object.x( this.object.x() + x )
            this.object.y( this.object.y() + y )
            this.object.update( duration )

        }


        /**
         * Move element by x and y pixels in given duration
         * @param x {number}
         * @param y {number}
         * @param duration {string}: How long it takes to complete the move
         */
        moveTo( { x, y, duration = 500 } = {} ) {

            this.object.x( x )
            this.object.y( y )
            this.object.update( duration )

        }

    }




//// UMD FOOT ////////////////////////////////////////////////////////////////////////

    //// MODULE.EXPORTS ////
    exports.Agent = Agent

    Object.defineProperty( exports, '__esModule', { value: true } )

} ) ) )
//////////////////////////////////////////////////////////////////////////////////////

