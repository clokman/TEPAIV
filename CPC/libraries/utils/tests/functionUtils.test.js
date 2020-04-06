//// IMPORTS /////////////////////////////////////////////////////////////////////////////////////////////////////////////

//// POLYFILLS ////

// Import polyfill for fetch() method
if (typeof fetch !== 'function') {
    global.fetch =  require('node-fetch-polyfill')
}

// Import polyfill for Object.fromEntries() method
if (typeof Object.fromEntries !== 'function') {
    Object.fromEntries = require('object.fromentries')
}


//// REQUIREMENTS ////

global.d3 = {
    ...require("../../external/d3/d3"),
    ...require("../../external/d3/d3-array")
}

global.container = require("../../cpc/container")


//// MODULES BEING TESTED ////
const functionUtils = require("../functionUtils")
    , injectCallbackIntoNamedFunction = functionUtils.injectIntoFunction
    , injectCallbackIntoMethod = functionUtils.injectIntoMethod



//// Inject code to function ///////////////////////////////////////////////////////////////

describe ('injectIntoFunction()', () => {

       test ('Inject callback to function', () => {

           let myFunction = function(){
               return 'myFunction output'
           }

           let log = null

           expect( myFunction() ).toBe( 'myFunction output' )
           expect( log ).toBeNull()


           myFunction = injectCallbackIntoNamedFunction( myFunction, () => { log = 1 } )

           expect( myFunction() ).toBe( 'myFunction output' )
           expect( log ).toBe(1)


       })


       test ('Use the alias `injectIntoMethod()` for an instance method', () => {


           class myClass{

               constructor() {
                   this.myProperty = 'my property value'
                   this.log = 0
               }

               method(){
                   return "Output of 'method'"
               }

               get(){
                   return this.myProperty
               }

               set(value){
                   this.myProperty = value
               }

           }

           const myInstance = new myClass()

           let log = 0

           // Modify a generic method //
           expect( myInstance.method() ).toBe( "Output of 'method'" )
           expect( log ).toBe(0)


           myInstance.method = injectCallbackIntoMethod( myInstance.method, () => {
               myInstance.log = 1
               log = 1
           })

           expect( myInstance.method() ).toBe( "Output of 'method'" )
           expect( log ).toBe(1)
           expect( myInstance.log ).toBe(1)




           // Modify a getter //
           myInstance.get = injectCallbackIntoMethod( myInstance.get, () => {
               myInstance.log = 2
               log = 2
           })

           expect( myInstance.get() ).toBe( "my property value" )
           expect( log ).toBe(2)
           expect( myInstance.log ).toBe(2)



           // Modify a setter //
           myInstance.set = injectCallbackIntoMethod( myInstance.set, () => {
               myInstance.log = 3
               log = 3
           })

           expect( myInstance.set('new value') ).toBe()
           expect( myInstance.myProperty ).toBe("new value")
           expect( log ).toBe(3)
           expect( myInstance.log ).toBe(3)


       })


        test ('Injection callback that has arguments', () => {


            let myFunction = function(){
                return 'myFunction output'
            }



            // Callback with One Argument //

            let log = 0

            const one = 1
            // Inject callback
            const myNewFunction = injectCallbackIntoNamedFunction( myFunction, (number) => {
                log += number
            })

            expect( myNewFunction( one ) ).toBe( 'myFunction output' )
            expect( log ).toBe( 1 )




            // Callback with Multiple Arguments //

            const two = 2
            const three = 3
            const four = 4
            let myOtherFunction = function(){
                return 'myOtherFunction output'
            }

            // Inject callback
            let result = 0
            myOtherFunction = injectCallbackIntoNamedFunction( myOtherFunction, (arg1, arg2, arg3) =>  {
                result = arg1 + arg2 + arg3
            })

            expect( myOtherFunction(two, three, four) ).toBe( 'myOtherFunction output' )
            expect( result ).toBe( 9 )

        })



    
        test ('Inject code into hoisted function', () => {

            function myHoistedFunction(){
                return 'myFunction output'
            }

            let log = 0

            const one = 1
            // Inject callback
            myHoistedFunction = injectCallbackIntoNamedFunction( myHoistedFunction, (number) => {
                log += number
            })


            expect( myHoistedFunction( one ) ).toBe( 'myFunction output' )
            expect( log ).toBe( 1 )


        })



})





//// UNIT TESTS /////////////////////////////////////////////////////////////////////////////////////////////////////////////
