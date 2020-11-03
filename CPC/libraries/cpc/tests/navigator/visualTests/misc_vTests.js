//// SVG  ////
let mySvg = new container.Svg( 15000, 15000 )


//// RECTANGLE /////////////////////////////////////////////////////////////////
//
// myRectangle = new shape.Rectangle().x(400).y(25).update()
// myRectangle.fill('blue').update()
//
//
//
// //// TEXT  ////
//
// myText = new shape.Text()
// myText.x(450).fill('red').update()
//
//


const distanceOfVisualTestsFromTopOfWindow = 50  // default: 700

//// CATEGORY  ////
const parentElementForCategory = d3.select( 'body' ).select( 'svg' )

myCategory = new navigator.Category( parentElementForCategory )
myCategory
    .x( 85 )
    .y( distanceOfVisualTestsFromTopOfWindow )
    .fill( 'dodgerblue' )
    .label( 'A label' )
    .update()



//// CAPTIONED RECTANGLE /////////////////////////////////////////////////////////////////

// // CAPTION AT CENTER
// const parentElementForCaptionedRectangle = d3
//     .select('body')
//     .select('svg')
//     .append('g')
//       .attr('id', 'parent-container-of-captioned-rectangle')
//
// myCaptionedRectangleCenter = new shape.CaptionedRectangle(parentElementForCaptionedRectangle)
// myCaptionedRectangleCenter
//     .x(400)
//     .y(175)
//     .width(250)
//     .height(100)
//     .fill('green')
//     .text('Caption')
//     .update()
//
// // CAPTION AT TOP LEFT
// myCaptionedRectangleTopLeft = new shape.CaptionedRectangle()
// myCaptionedRectangleTopLeft
//     .textAlignment('top-left')
//     .x(400)
//     .y(300)
//     .width(250)
//     .height(100)
//     .fill('green')
//     .text('Caption')
//     .update()
//
//
// // DEMO
// myCaptionedRectangleTopLeft.x(350).y(350).fill('blue').width('300').height('200').text('Hello').textAlignment('center').update()




// CHART /////////////////////////////////////////////////////////////////

// Without labels
const parentElementForChart = d3.select( 'body' ).select( 'svg' )
myChart = new navigator.Chart( parentElementForChart )
myChart.x( 450 ).y( distanceOfVisualTestsFromTopOfWindow ).update()

// Update data of chart
// tempStack = new data.Stack()
//     .populateWithExampleData('gender')
// myChart.stack(tempStack)


// Chart with labels
myChart = new navigator.Chart()
myChart.x( 325 ).y( distanceOfVisualTestsFromTopOfWindow ).categoryLabels( true ).update()
myChart.chartLabel( 'MY CHART LABEL' ).update()



// //// DATASET /////////////////////////////////////////////////////////////////


// Categorical data
const titanicSummaryPanel = new navigator.Panel()
    .bgText( 'Titanic summary' )
    .x( 800 )
    .yAxisLabels( true )
    .update()

const titanicDataset = new dataset.Dataset( 'http://localhost:3000/libraries/cpc/tests/dataset/titanic.csv', 'Name' )
titanicDataset.build()
    .then( () => {

            const titanicSummary = titanicDataset.summarize()

            const titanicStacks = new data.Stacks()
            titanicStacks.fromNestedMap( titanicSummary )

            titanicSummaryPanel.stacks( titanicStacks ).update()
        }
    )


// Continuous data
const bigFiveSummaryPanel = new navigator.Panel()
    .bgText( 'Big five summary' )
    .x( 1100 )
    .yAxisLabels( true )
    .update()




// const bigFiveValueArrays = new Map()

const bigFiveDataset = new dataset.Dataset( 'http://localhost:3000/libraries/cpc/tests/dataset/BigFivePersonalityTraits-Small.csv', 'Name' )
bigFiveDataset.build()
    .then( () => {

            // const bigFiveDataset.

            // const bigFiveSummary = bigFiveDataset.summarize()
            //
            // const bigFiveStacks = new data.Stacks()
            // bigFiveStacks.fromNestedMap(bigFiveSummary)
            //
            // bigFiveSummaryPanel.stacks(bigFiveStacks).update()


            // d3.csv("data.csv", function(error, data) {
            //     color.domain(d3.keys(data[0]).filter(function(key) {
            //         return key == "avg" || key == "additional_columns";
            //     });
            // });

            // bigFiveDataset.columnNames.forEach( (columnName) => {
            //
            //     bigFiveDataset.data.filter( (columnKey) => {
            //         return columnKey === columnName
            //     })
            //
            // })



            // var rowConverter = function(d) {
            //         return {
            //             Food: d.Food,  //No conversion
            //             Deliciousness: parseFloat(d.Deliciousness)
            //         };
            //     }
            //
            //     d3.csv("food.csv", rowConverter, function(data) {
            //         console.log(data);
            //     });




            bigFiveDataset.data.forEach( row => {

                Object.keys( row ).forEach( ( columnName ) => {
                    bigFiveValueArrays.set( columnName, [] )
                } )

                Object.entries( row ).forEach( ( value, columnName ) => {
                    bigFiveValueArrays
                        .get( columnName )
                        .push( value )
                } )
            } )




        }
    )



function splitToQuantiles( valuesArray, thresholds ) {

    const split = d3.histogram()
        .thresholds( 3 )
        .domain( [ d3.min( valuesArray ), d3.max( valuesArray ) ] )

    const splittedValues = split( valuesArray )

    return splittedValues

}




const bigFiveSummaryPanel2 = new navigator.Panel()
    .bgText( 'Big five summary 2' )
    .x( 1400 )
    .yAxisLabels( true )
    .update()




// // BG CHART /////////////////////////////////////////////////////////////////
// TODO: THIS INVISIBLE BACKGROUND CHART MUST BE REMOVED
//
// const parentElementForChart = d3.select('body').select('svg')
//
// myChart = new navigator.Chart(parentElementForChart)
// myChart
//     .x(400)
//     .update()
//
// myChart.objects().forEach( (chartObject, chartName) => {
//     chartObject
//         .fill('white')
//         .text('')
//         .x(0)
//         .y(0)
//         .height(500)
//         .width(1280)
//         .update()
// })




const mixedDataset = new dataset.Dataset( 'http://localhost:3000/libraries/cpc/tests/dataset/SampleMixedData.csv' )
mixedDataset.build()
    .then( () => {

            //...

        }
    )