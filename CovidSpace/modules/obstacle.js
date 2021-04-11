//// UMD HEAD ////////////////////////////////////////////////////////////////////////
// UMD head and foot patterns adapted from d3.js
( function ( global, factory ) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory( exports ) :
        typeof define === 'function' && define.amd ? define( [ 'exports' ], factory ) :
            ( factory( ( global.obstacle = global.obstacle || {} ) ) )
}( this, ( function ( exports ) {
    'use strict'
//////////////////////////////////////////////////////////////////////////////////////


    const defaults = {
        fill: 'LightGray',
        stroke: 'Gray',
        x: 20,
        y: 20,
        width: 100,
        height: 10
    }




    class Obstacle {

        /**
         *
         * @param x {number}
         * @param y {number}
         * @param fill {string}
         */
        constructor( {
                         x = defaults.x,
                         y = defaults.y,
                         width = defaults.width,
                         height = defaults.height,
                         fill = defaults.fill
                     } = {}
        ) {
            this.object = new shape.Rectangle()
            this.object.x( x )
            this.object.y( y )
            this.object.width( width )
            this.object.height( height )
            this.object.fill( fill )
            this.object.class( 'obstacle' )
            this.object.update()
        }

    }




//// UMD FOOT ////////////////////////////////////////////////////////////////////////

    //// MODULE.EXPORTS ////
    exports.Obstacle = Obstacle

    Object.defineProperty( exports, '__esModule', { value: true } )

} ) ) )
//////////////////////////////////////////////////////////////////////////////////////

