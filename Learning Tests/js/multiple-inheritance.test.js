
//// Multiple inheritance ///////////////////////////////////////////////////////////////

describe ('Multiple inheritance in ES6 classes', () => {


    test ("Use Chong Lip Phang's algorithm to achieve multiple inheritance", () => {

        /**
         * From SO answer of Chong Lip Phang at https://stackoverflow.com/a/45332959/3102060
         * NOTE: The properties and methods of classes that occur later in the arguments of this method will overwrite
         * the previous properties and methods with the same names.
         * NOTE: This may not work with React `Component`.
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


        class MultiClass extends classes(ClassOne, ClassTwo) {
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


//// Mixins ///////////////////////////////////////////////////////////////

describe ('Mixins', () => {

        test ('', () => {

            const mixIn = {

                returnSimpleValue : () => {return 'simpleValue'},

                _field: 'value of this_field',
                returnFieldClassic: function() {return this._field},
                returnFieldArrow: () => {return this._field},

                returnThisClassic: function() {return this},
                returnThisArrow: () => {return this},
            }


            class BaseClass {
                constructor() {
                    Object.assign(BaseClass.prototype, mixIn)  // This statement does the mixing in
                }
                returnBaseClass(){return 'rectangle'}
            }

            const baseClassInstance = new BaseClass()

            // Both base class and mixIn methods should be accessible from base class instance
            expect( baseClassInstance.returnBaseClass() ).toBe( 'rectangle' )
            expect( baseClassInstance.returnSimpleValue() ).toBe( 'simpleValue' )

            // While accessing `this`, classic function syntax should be used
            expect( baseClassInstance.returnThisClassic().constructor.name ).toBe( 'BaseClass' )
            expect( baseClassInstance.returnThisArrow().constructor.name ).toBe( 'Object' )

            // While accessing mixed-in properties and getters, also classic function syntax should be used
            expect( baseClassInstance._field ).toBe( 'value of this_field' )
            expect( baseClassInstance.returnFieldClassic() ).toBe( 'value of this_field' )
            expect( baseClassInstance.returnFieldArrow() ).toBe( undefined )

        })

})