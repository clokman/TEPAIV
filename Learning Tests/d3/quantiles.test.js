
describe ('d3.quantile', () => {
   
    test ('Get quantiles of an arrray', () => {

        const myArray = [1,2,3,4,5,6,7,8,9,10]
        const upperQuartile = d3.quantile(myArray , 0.75, d => d)

        expect( upperQuartile ).toBe( 7.75 )
        
    })
    
})



describe ('d3.scaleQuantile', () => {


    test ('Calculate quantiles of an homogeneous array', () => {

        const quantileScale = d3.scaleQuantile()
            .domain([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10])
            .range( ['0%-25%', '25%-50%', '50%-75%', '75%-100%'] )

        expect( quantileScale.quantiles() ).toEqual( [2.5, 5, 7.5] )

    })


    test ('Calculate quantiles of an heterogeneous (and unordered) array', () => {

        const quantileScale = d3.scaleQuantile()
            .domain([0, 5, 6, 7,8, 8, 8,8 ,8,1,1,1, 10])
            .range( ['0%-25%', '25%-50%', '50%-75%', '75%-100%'] )

        expect( quantileScale.quantiles() ).toEqual( [1, 7, 8] )

    })


    test ('Transform an array of continuous values to a categorical values using quantiles', () => {


        const continuousArray = [0, 5, 6, 7,8, 8, 8, 8, 8, 1, 1, 1, 10]
        const quantileScale = d3.scaleQuantile()
            .domain( continuousArray )
            .range( ['q1', 'q2', 'q3', 'q4'] )

        const transformedArray = transformArrayWithQuantileScale(continuousArray, quantileScale)

        expect( transformedArray ).toEqual( ["q1", "q2", "q2", "q3", "q4", "q4", "q4", "q4", "q4", "q2", "q2", "q2", "q4"] )

    })
    
    
    test ('When an array is provided in reverse order, quantileScale should still give the quantiles ordered from smallest to greatest (and transform the array correctly)', () => {

        const continuousArray = [100, 90, 80, 70, 60, 50, 40, 30, 20, 10, 0]
        const quantileScale = d3.scaleQuantile()
            .domain( continuousArray )
            .range( ['q1', 'q2', 'q3', 'q4'] )

        expect( quantileScale.quantiles() ).toEqual( [25, 50, 75] )

        const transformedArray = transformArrayWithQuantileScale( continuousArray, quantileScale )

        expect( transformedArray ).toEqual( ["q4", "q4", "q4", "q3", "q3", "q3", "q2", "q2", "q1", "q1", "q1"] )

    })


test( 'Many zero values and quantile function', () => {

        const continuousArray = [100, 90, 80, 70, 60, 50, 0, 0, 0, 0, 0]

        const quantileScale = d3.scaleQuantile()
            .domain( continuousArray )
            .range( ['q1', 'q2', 'q3', 'q4'] )

        expect( quantileScale.quantiles() ).toEqual( [0, 50, 75] )

        const transformedArray = transformArrayWithQuantileScale( continuousArray, quantileScale )

        expect( transformedArray ).toEqual( [ "q4", "q4", "q4", "q3", "q3", "q3", "q2", "q2", "q2", "q2", "q2" ] )

    } )



    // Helper Functions

    function transformArrayWithQuantileScale(continuousArray, quantileScale) {

        const transformedArray = []
        continuousArray.forEach((element) => {
            transformedArray.push( quantileScale(element) )
        })
        return transformedArray
    }

})