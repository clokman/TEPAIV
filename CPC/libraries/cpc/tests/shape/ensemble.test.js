//// IMPORTS
// /////////////////////////////////////////////////////////////////////////////////////////////////////////////

//// POLYFILLS ////

// Import polyfill for fetch() method
if ( typeof fetch !== 'function' ) {
    global.fetch = require( 'node-fetch-polyfill' )
}

// Import polyfill for Object.fromEntries() method
if ( typeof Object.fromEntries !== 'function' ) {
    Object.fromEntries = require( 'object.fromentries' )
}


//// REQUIREMENTS ////
require( '../../../../../JestUtils/jest-console' )


global.d3 = {
    ...require( '../../../external/d3/d3' ),
    ...require( '../../../external/d3/d3-array' )
}

// Disable d3 transitions
d3.selection.prototype.transition = jest.fn( function () {return this} )
d3.selection.prototype.duration = jest.fn( function () {return this} )


global.classUtils = require( '../../../utils/classUtils' )
global.functionUtils = require( '../../../utils/functionUtils' )
global.jsUtils = require( '../../../utils/jsUtils' )
global.errorUtils = require( '../../../utils/errorUtils' )
global.container = require( '../../container' )
global.shape = require( '../../shape' )
global.stringUtils = require( '../../../utils/stringUtils' )
global.data = require( '../../../cpc/data' )
global._ = require( '../../../external/lodash' )

const { initializeDomWithSvg } = require( '../../../../../JestUtils/jest-dom' )
const { hasType } = require( '../../../utils/jsUtils' )
const { writeDomToFile } = require( '../../../../../JestUtils/jest-dom' )

//// MODULES BEING TESTED ////




//// UNIT TESTS
// /////////////////////////////////////////////////////////////////////////////////////////////////////////////


//// Instantiation ////////////////////////////////////////////////////////////


describe( 'Instantiation', () => {

    test( 'Instantiate an Ensemble Object', () => {

        const myEnsemble = new container.Ensemble()
        expect( myEnsemble ).toBeDefined()

    } )


    //// ID generation ///////////////////////////////////////////////////////////////

    describe( 'ID generation', () => {


        test( 'Each ensemble should have a unique ID number', () => {

            // Unique ID counter should be reset t
            container.Ensemble.uniqueIdNumber( 0 )


            const firstEnsemble = new container.Ensemble()
            expect( firstEnsemble.id() ).toBe( 'ensemble-0' )


            const secondEnsemble = new container.Ensemble()
            expect( secondEnsemble.id() ).toBe( 'ensemble-1' )


        } )

        test( 'It should be possible to reset Ensemble counter', () => {

            // Unique ID counter should be reset to 0 (may not be so due to previous tests)
            container.Ensemble.uniqueIdNumber( 0 )
            expect( container.Ensemble.uniqueIdNumber() ).toBe( 0 )


            // First Object //

            // Id postfix should be 0 for the first Ensemble
            initializeDomWithSvg()
            const ensemble0 = new container.Ensemble()

            // Current id number and id should be 0
            expect( ensemble0.id() ).toBe( 'ensemble-0' )

            // Unique ID counter should be incremented for the next object
            expect( container.Ensemble.uniqueIdNumber() ).toBe( 1 )



            // Second Object //

            // Id postfix should be incremented by now
            initializeDomWithSvg()
            const ensemble1 = new container.Ensemble()

            // Current ID
            expect( ensemble1.id() ).toBe( 'ensemble-1' )




            // Reset ID Counter //
            container.Ensemble.uniqueIdNumber( 0 )



            // Third Object //

            const ensemble2 = new container.Ensemble()

            // Current ID
            expect( ensemble2.id() ).toBe( 'ensemble-0' )


        } )


        test( 'idNumber() should return the unique id `Number`, but if it is used to set a value, it should return an error', () => {

            // Reset unique id counter
            container.Ensemble.uniqueIdNumber( 0 )


            // First Object //

            // Id postfix should be 0 for the first Ensemble
            initializeDomWithSvg()
            const ensemble0 = new container.Ensemble()

            // Current id number and id should be 0
            expect( ensemble0.id() ).toBe( 'ensemble-0' )
            expect( ensemble0.idNumber() ).toBe( 0 )

            // Unique ID counter should be incremented for the next object
            expect( container.Ensemble.uniqueIdNumber() ).toBe( 1 )


            expect( () => {
                ensemble0.idNumber( '2' )
            } ).toThrow( 'This method cannot be used to set unique ids. Use `Ensemble.uniqueIdNumber()` instead.' )


        } )


    } )

} )




//// Adding Members ///////////////////////////////////////////////////////////////

describe( 'Ensemble registry operations', () => {


    //// Add member ///////////////////////////////////////////////////////////////

    describe( 'Add member', () => {


        test( 'Add an EnsembleMember to Ensemble', () => {

            initializeDomWithSvg()

            const myEnsemble = new container.Ensemble()

            const member1 = new shape.LinkableRectangle() // this one stays unbuilt to see if it affects anything
            const member2 = new shape.LinkableRectangle().build()


            myEnsemble.members( member1.id(), member1 )
            myEnsemble.members( member2.id(), member2 )

//         expect( myEnsemble.members() ).toTabulateAs(`\
// ┌───────────────────┬────────────────────────┬─────────────────────┐
// │ (iteration index) │          Key           │       Values        │
// ├───────────────────┼────────────────────────┼─────────────────────┤
// │         0         │ 'linkable-rectangle-0' │ [LinkableRectangle] │
// │         1         │ 'linkable-rectangle-1' │ [LinkableRectangle] │
// └───────────────────┴────────────────────────┴─────────────────────┘`)
            // As long as the below assertions are true, the table should be true
            expect( Array.from( myEnsemble.members().keys() ) ).toEqual( ['linkable-rectangle-0', 'linkable-rectangle-1'] )
            expect( myEnsemble.members().size ).toBe( 2 )

        } )


    } )


    //// Invalid queries ///////////////////////////////////////////////////////////////

    describe( 'Invalid queries', () => {


        test( 'Ensemble should not accept any other class than EnsembleMember', () => {


            initializeDomWithSvg()
            const myText = new shape.Text()
                .id( 'my-text' )
                .update()

            const myEnsemble = new container.Ensemble()


            expect( () => {
                myEnsemble.members( myText.id(), myText )
            } ).toThrow( '\'.members()\' method of an Ensemble instance attempted register a \'Text\' class object into Ensemble registry. Ensemble registry only accepts \'EnsembleMember\' instances.' )



        } )


        test( 'Bad queries to Ensemble registry should return undefined', () => {

            const myEnsemble = new container.Ensemble()

            // Attempt to query empty registry
            expect( myEnsemble.members() ).toBeUndefined()

            // Attempt to query non-existent value in registry
            expect( myEnsemble.members( 'nonExistentMember' ) ).toBeUndefined()


        } )


    } )



    //// Removing members ///////////////////////////////////////////////////////////////

    describe( 'Removing members', () => {

        let myEnsemble,
            temporaryMember,
            permanentMember,
            memberIdsInEnsembleRegistry


        // Setup
        beforeEach( () => {

            // Create ensemble
            myEnsemble = new container.Ensemble()

            // Create members
            temporaryMember = new shape.LinkableRectangle()
                .id( 'temporary-middle-member' )
                .build()
            permanentMember = new shape.LinkableRectangle()
                .id( 'permanent-right-member' )
                .build()


            // Add members to Ensemble's registry
            myEnsemble.members( permanentMember.id(), permanentMember )
            myEnsemble.members( temporaryMember.id(), temporaryMember )



            // Helper function(s) //

            // TODO: Removed this function
            memberIdsInEnsembleRegistry = () => Array.from(
                myEnsemble.members().keys()
            )

        } )


        test( 'Remove a member from Ensemble registry', () => {

            expect( memberIdsInEnsembleRegistry() ).toEqual( [
                'permanent-right-member',
                'temporary-middle-member'
            ] )


            // Remove a member from Ensemble's registry
            myEnsemble.removeMember( temporaryMember.id() )

            expect( memberIdsInEnsembleRegistry() ).toEqual( [
                'permanent-right-member'
            ] )
        } )


        test( 'Trying to synchronize an empty Ensemble should not lead to problems', () => {

            const myEmptyEnsemble = new container.Ensemble()

            expect( () => {
                myEmptyEnsemble.synchronizeAnySharedFieldsOfMembers()
            } ).not.toThrow()

        } )

    } )

} )




//// Shared properties of EnsembleMembers ///////////////////////////////////////////////////////////////

describe( 'Shared properties of EnsembleMembers', () => {

    test( 'Register shared properties of members', () => {

        // Create objects
        const myEnsemble = new container.Ensemble()
        const myMember = new shape.LinkableRectangle()  // `.build()` is not yet used on purpose, as
        // the shared setters of a LinkableRectangle
        // will likely be registered into the
        // Ensemble before or during the build operation
        // most of the time.

        // Set
        myEnsemble.sharedSettersAndValues( myMember.fill.name, null )


        // Get
        expect( myEnsemble.sharedSettersAndValues().size ).toBe( 1 )
        expect( myMember.fill.hasType() ).toBe( 'Function' )

        expect( myEnsemble.sharedSettersAndValues( 'fill' ) ).toBeNull()


    } )



    test( 'Update all shared properties in an ensemble with two members', () => {

        initializeDomWithSvg()
        const myEnsemble = new container.Ensemble()

        const member1 = new shape.LinkableRectangle()  // `.build()` is not yet used on purpose, as this state reflects
                                                       // the most likely use scenario
        const member2 = new shape.LinkableRectangle()

        // Register members
        myEnsemble.members( member1.id(), member1 )
        myEnsemble.members( member2.id(), member2 )


        // Register a shared setter and set its value manually
        expect( member1.fill() ).not.toBe( 'salmon' )
        expect( member2.fill() ).not.toBe( 'salmon' )
        myEnsemble.sharedSettersAndValues( member1.fill.name, 'salmon' )  // Value 'salmon' is set here manually
        // for testing purposes. Normally, this
        // value would have been set automatically
        // to the last user-specified value.

        // Read the last user-set value from Ensemble registry
        expect( myEnsemble.sharedSettersAndValues( 'fill' ) ).toBe( 'salmon' )

        // Synchronize properties (manually; normally, this would be done automatically every time an ensemble member
        // sets a value for one of its shared fields)
        myEnsemble.synchronizeAnySharedFieldsOfMembers()




        // The property values of both members should now be the same
        expect( member1.fill() ).toBe( 'salmon' )
        expect( member2.fill() ).toBe( 'salmon' )


    } )


    test( 'Registry hooking: When a shared setter is called, its argument should be registered', () => {

        initializeDomWithSvg()
        const myEnsemble = new container.Ensemble()

        const member1 = new shape.LinkableRectangle()  // `.build()` is not yet used on purpose, as this state reflects
                                                       // the most likely use scenario
        const member2 = new shape.LinkableRectangle()

        // Register members
        myEnsemble.members( member1.id(), member1 )
        myEnsemble.members( member2.id(), member2 )

        // Register shared setters
        myEnsemble.sharedSettersAndValues( member1.fill.name, null )




    } )


    test( 'It should be possible to attach registry hooks to shared setters of the ensemble ', () => {

        initializeDomWithSvg()
        const myEnsemble = new container.Ensemble()

        const member1 = new shape.LinkableRectangle()  // `.build()` is not yet used on purpose, as this state reflects
                                                       // the most likely use scenario
        const member2 = new shape.LinkableRectangle()

        // Register members into the Ensemble
        myEnsemble.members( member1.id(), member1 )
        myEnsemble.members( member2.id(), member2 )

        // Specify which setters are shared
        myEnsemble.sharedSettersAndValues( member1.fill.name, null )
        myEnsemble.sharedSettersAndValues( member1.stroke.name, null )
        myEnsemble.sharedSettersAndValues( member1.strokeWidth.name, null )


        // Register the Ensemble in members
        member1.ensembleObject = myEnsemble
        member2.ensembleObject = myEnsemble


        // Inject code to shared setters, so their arguments are registered into the Ensemble registry
        myEnsemble.hookRegistryToSharedSetters() // This is explicitly done here for this test during development
        // but is automatically done in the final code


        // Update fill property value of one member
        expect( member1.fill() ).not.toBe( 'salmon' )
        expect( member2.fill() ).not.toBe( 'salmon' )
        member1
            .fill( 'salmon' )
            .stroke( 'black' )
            .strokeWidth( '5px' )
            .update()


        // The values used in the arguments should be in the Ensemble registry now
        expect( myEnsemble.sharedSettersAndValues( 'fill' ) ).toBe( 'salmon' )
        expect( myEnsemble.sharedSettersAndValues( 'stroke' ) ).toBe( 'black' )
        expect( myEnsemble.sharedSettersAndValues( 'strokeWidth' ) ).toBe( '5px' )



    } )


    test( 'When one member updates its property value, the other members in the Ensemble should synchronize their own property values', () => {

        initializeDomWithSvg()
        const myEnsemble = new container.Ensemble()

        const member1 = new shape.LinkableRectangle()  // `.build()` is not yet used on purpose, as this state reflects
                                                       // the most likely use scenario
        const member2 = new shape.LinkableRectangle()

        // Register members into Ensemble
        myEnsemble.members( member1.id(), member1 )
        myEnsemble.members( member2.id(), member2 )

        // Specify which setters are shared
        myEnsemble.sharedSettersAndValues( member1.fill.name, null )


        // Register Ensemble in members
        member1.ensembleObject = myEnsemble
        member2.ensembleObject = myEnsemble


        // Inject code to shared setters, so their arguments are registered
        myEnsemble.hookRegistryToSharedSetters() // This is explicitly done here for this test during development
        // but is automatically done in the final code


        // Update fill property value of one member
        expect( member1.fill() ).not.toBe( 'salmon' )
        expect( member2.fill() ).not.toBe( 'salmon' )
        member1.fill( 'salmon' ).update()



        myEnsemble.synchronizeAnySharedFieldsOfMembers()


        // The property values of both members should now be the same
        expect( member1.fill() ).toBe( 'salmon' )
        expect( member2.fill() ).toBe( 'salmon' )

    } )



    test( '`hookRegistryToSharedSetters` should return error if registry is empty', () => {

        initializeDomWithSvg()
        const myEnsemble = new container.Ensemble()

        const member1 = new shape.LinkableRectangle()  // `.build()` is not yet used on purpose, as this state reflects
                                                       // the most likely use scenario
        const member2 = new shape.LinkableRectangle()

        // Register members
        myEnsemble.members( member1.id(), member1 )
        myEnsemble.members( member2.id(), member2 )


        // Attempt to inject registry hooks to objects while registry is empty (i.e., no shared properties is defined)
        expect( () => {
            myEnsemble.hookRegistryToSharedSetters() // This is explicitly done here for this test during development
            // but is automatically done in the final code
        } ).toThrow( `Cannot hook registry to setters because 'this._sharedSettersAndGetters' is empty. Did you forget to add shared getters using 'this.sharedSettersAndValues()'?` )

    } )

} )
