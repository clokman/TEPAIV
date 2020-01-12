
// // Set initial slider dial position from Svg element
// slider.value = svgCanvas.width()
// monitor.innerText = slider.value


//// SVG  ////

const parentD3Element = d3.select( '.navigator-area' )

let mySvg = new container.Svg(15000, 15000, parentD3Element)



//// NAVIGATOR ////
const distanceBetweenNavigators = 1600

// Navigator 1

const navigator1 = new navigator.Navigator()

navigator1.loadDataset(
    'http://localhost:3000/data/titanic.csv',
    ['NAME']
).then(that => {
    that.update()

    that.x( 200 )
        .colorSet('Titanic')
        .update()

    // navigator1.objects('panel-0').height(1500).update()
    navigator1.objects('panel-0').yAxisLabels()

    // CAPITALIZE CHART LABELS
    navigator1.objects('panel-0').objects('Status')._chartLabelObject.text('STATUS').update()
    navigator1.objects('panel-0').objects('Ticket')._chartLabelObject.text('TICKET').update()
    navigator1.objects('panel-0').objects('Gender')._chartLabelObject.text('GENDER').update()
})


// Navigator 2

const navigator2 = new navigator.Navigator()

navigator2.loadDataset(
    'http://localhost:3000/data/titanic-embark-partial.csv',
    ['Name']
).then(that => {
    that.update()

    that.x( navigator1.x() + distanceBetweenNavigators )
        .colorSet('Titanic-2')
        .update()

    // navigator2.objects('panel-0').height(1500).update()
    navigator2.objects('panel-0').yAxisLabels()

    // CAPITALIZE CHART LABELS
    navigator2.objects('panel-0').objects('Survived')._chartLabelObject.text('SURVIVED').update()
    navigator2.objects('panel-0').objects('Pclass')._chartLabelObject.text('PCLASS').update()
    navigator2.objects('panel-0').objects('Sex')._chartLabelObject.text('SEX').update()
    navigator2.objects('panel-0').objects('Embarked')._chartLabelObject.text('EMBARKED').update()

})


// Navigator 3

const navigator3 = new navigator.Navigator()

navigator3.loadDataset(
    'http://localhost:3000/data/sophia.csv',
    ['Name']
).then(that => {
    that.update()

    that
        .colorSet('Plasma')
        .x( navigator2.x() + distanceBetweenNavigators )
        .update()

    // navigator3.objects('panel-0').height(1500).update()
    navigator3.objects('panel-0').yAxisLabels()

})


// Navigator 4

const navigator4 = new navigator.Navigator()

navigator4.loadDataset(
    'http://localhost:3000/data/mushrooms/mushrooms-4columns.csv',
    ['Name']
).then(that => {
    that.update()

    that
        .x( navigator3.x() + distanceBetweenNavigators )
        .update()

    navigator4.objects('panel-0').yAxisLabels()
})


// Navigator 5

const navigator5 = new navigator.Navigator()

navigator5.loadDataset(
    'http://localhost:3000/data/mushrooms/mushrooms-8columns.csv',
    ['Name']
).then(that => {
    that.update()

    that
        .x( navigator4.x() + distanceBetweenNavigators )
        .update()

    navigator5.objects('panel-0').height(750).update()
    navigator5.objects('panel-0').yAxisLabels()
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
//         .x( navigator5.x() + distanceBetweenNavigators )
//         .update()
//
//     navigator6.objects('panel-0').height(7500).update()
//     navigator6.objects('panel-0').yAxisLabels()
// })




    // myNavigator.objects('panel-0').objects('Ticket').colorScheme('Purples').update()
    // myNavigator.objects('panel-0').objects('Status').colorScheme('Blues').update()
    // myNavigator.objects('panel-0').objects('Gender').colorScheme('Greens').update()

// Alternative Dataset paths //
// http://localhost:3000/data/titanic.csv
// http://localhost:3000/data/titanic-embark-partial.csv
// http://clokman.com/hosting/tepaiv/datasets/titanic/titanic-embark-partial.csv

// 'http://localhost:3000/data/mushrooms/mushrooms.csv',
// 'http://localhost:3000/data/mushrooms/mushrooms-8columns.csv',
// 'http://localhost:3000/data/mushrooms/mushrooms-4columns.csv',

// http://localhost:3000/data/sophia.csv


// Exploration possibilities //
// - Who survived?
// - Who died?


// - Composition of Males and Females
    // - Distribution of males and females to classes
    // - Distribution to survival

// - Survival rate of first class females
