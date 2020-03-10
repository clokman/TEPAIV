//// SVG  ////

const parentD3Element = d3.select( '.navigator-area' )

let mySvg = new container.Svg(15000, 15000, parentD3Element)


//// NAVIGATOR ////
const horizontalDistanceBetweenNavigators = 1600
const verticalDistanceBetweenNavigators = 900

// Navigator 1

const navigator1 = new navigator.Navigator()

navigator1.loadDataset(
    'http://localhost:3000/data/titanic.csv',
    ['NAME']
).then(that => {

    that.colorSet('Titanic')
        .build()

})


// Navigator 2

const navigator2 = new navigator.Navigator()

navigator2.loadDataset(
    'http://localhost:3000/data/titanic-embark-partial.csv',
    ['Name']
).then(that => {

    that.x( navigator1.x() + horizontalDistanceBetweenNavigators )
        .colorSet('Titanic-2')
        .build()

})

// Navigator 3

const navigator3 = new navigator.Navigator()

navigator3.loadDataset(
    'http://localhost:3000/data/sophia.csv',
    ['Name']
).then(that => {

    that
        .colorSet('Plasma')
        .x( navigator2.x() + horizontalDistanceBetweenNavigators )
        .build()

})


// Navigator 4

const navigator4 = new navigator.Navigator()

navigator4.loadDataset(
    'http://localhost:3000/data/mushrooms/mushrooms-4columns.csv',
    ['Name']
).then(that => {

    that
        .x( navigator3.x() + horizontalDistanceBetweenNavigators )
        .build()

})


// Navigator 5

const navigator5 = new navigator.Navigator()

navigator5.loadDataset(
    'http://localhost:3000/data/mushrooms/mushrooms-8columns.csv',
    ['Name']
).then(that => {

    that
        .x( navigator4.x() + horizontalDistanceBetweenNavigators )
        .build()

})


// Navigator 6

// const navigator6 = new navigator.Navigator()
//
// navigator6.loadDataset(
//     'http://localhost:3000/data/mushrooms/mushrooms.csv',
//     ['Name']
// ).then(that => {
//     that.update()
//
//     that
//         .x( navigator5.x() + horizontalDistanceBetweenNavigators )
//         .update()
//
//     navigator6.objects('panel-0')
//         .height(7500)
//         .update()

// })



// Navigator B1

const navigatorB1 = new navigator.Navigator()
navigatorB1.initParams.quantilesForContinuousColumns = ['Very Low', 'Low', 'High', 'Very High' ]

navigatorB1.loadDataset(
    'http://localhost:3000/data/SampleMixedData.csv',
    ['NAME']
).then(that => {

    that.x( navigator5.x() + horizontalDistanceBetweenNavigators )
        .colorSet('Titanic')
        .build()

})


// Navigator B2

const navigatorB2 = new navigator.Navigator()

navigatorB2.loadDataset(
    'http://localhost:3000/data/Wine/Wine-FiveColumns.csv',
    ['NAME']
).then(that => {

    that.x( navigatorB1.x() + horizontalDistanceBetweenNavigators )
        .colorSet('Titanic')
        .build()

})



// Navigator B3

const navigatorB3 = new navigator.Navigator()

navigatorB3.loadDataset(
    'http://localhost:3000/data/titanicTinyWithMockPredictions.csv',
    ['Name']
).then(that => {

    that.x( navigatorB2.x() + horizontalDistanceBetweenNavigators )
        .colorSet('Titanic')
        .build()

})