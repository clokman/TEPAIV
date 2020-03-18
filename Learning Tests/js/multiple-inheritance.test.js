//// DEPENDENCIES /////////////////////////////////////////////////////////////////////////////////////////////////////////////

//// POLYFILLS ////

// Import polyfill for fetch() method
if (typeof fetch !== 'function') {
    global.fetch =  require('node-fetch-polyfill')
}

// Import polyfill for Object.fromEntries() method
if (typeof Object.fromEntries !== 'function') {
    Object.fromEntries = require('object.fromentries')
}


//// PURE NODE DEPENDENCIES ////
require('../../JestUtils/jest-console')
require('../../JestUtils/jest-dom')


//// UMD DEPENDENCIES ////
global.$ = require('../../CPC/libraries/external/jquery-3.1.1.min')

global.d3 = {
    ...require("../../CPC/libraries/external/d3/d3"),
    ...require("../../CPC/libraries/external/d3/d3-array")
}
// Disable d3 transitions
d3.selection.prototype.transition = jest.fn( function(){return this} )
d3.selection.prototype.duration = jest.fn( function(){return this} )

global._ = require("../../CPC/libraries/external/lodash")


//// EXTENSIONS ////
require("../../CPC/libraries/utils/errorUtils")
require("../../CPC/libraries/utils/jsUtils")
require("../../CPC/libraries/utils/mapUtils")

global.classUtils = require("../../CPC/libraries/utils/classUtils")
global.arrayUtils = require("../../CPC/libraries/utils/arrayUtils")
global.domUtils = require("../../CPC/libraries/utils/domUtils")
global.stringUtils = require("../../CPC/libraries/utils/stringUtils")
global.stringUtils = require("../../CPC/libraries/utils/statsUtils")

//// MODULE BEING TESTED IN CURRENT FILE ////







//// TESTS /////////////////////////////////////////////////////////////////////////////////////////////////////////////



//// Multiple inheritance ///////////////////////////////////////////////////////////////

describe ('Multiple inheritance', () => {


    test ('MI in ES6 classes', () => {

        /**
         * From SO answer of Chong Lip Phang at https://stackoverflow.com/a/45332959/3102060
         * NOTE: The properties and methods of classes that occur later in the arguments of this method will overwrite
         * the previous properties and methods with the same names.
         * @param baseClass
         * @param mixins - Other classes to be added
         * @return {base}
         */
        function classes (baseClass, ...mixins) {

            class base extends baseClass {
                constructor (...args) {
                    super(...args);
                    mixins.forEach((mixin) => {
                        copyProps(this,(new mixin));
                    });
                }
            }

            let copyProps = (target, source) => {  // this function copies all properties and symbols, filtering out some special ones
                Object.getOwnPropertyNames(source)
                    .concat(Object.getOwnPropertySymbols(source))
                    .forEach((prop) => {
                        if (!prop.match(/^(?:constructor|prototype|arguments|caller|name|bind|call|apply|toString|length)$/))
                            Object.defineProperty(target, prop, Object.getOwnPropertyDescriptor(source, prop));
                    })
            }

            mixins.forEach((mixin) => { // outside contructor() to allow classes(A,B,C).staticFunction() to be called etc.
                copyProps(base.prototype, mixin.prototype);
                copyProps(base, mixin);
            });

            return base;
        }





        class ClassOne{
            constructor() {
            }
            returnOne (){ return 1 }
        }


        class ClassTwo{
            constructor() {
            }
            returnTwo (){ return 2 }
        }


        class MultiClass extends ClassOne.mixin(ClassTwo) {
            constructor() {
                super()
            }
            returnSum(){
                return this.returnOne() + this.returnTwo()
            }
        }

        const multiClassObject = new MultiClass()


        expect( multiClassObject ).toBeDefined( )
        expect( multiClassObject.returnOne() ).toBe( 1 )
        expect( multiClassObject.returnTwo() ).toBe( 2 )
        expect( multiClassObject.returnSum() ).toBe( 3 )


    })




})