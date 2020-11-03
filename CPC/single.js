//// SVG  ////

const parentD3Element = d3.select( '.navigator-area' )

let mySvg = new container.Svg( 15000, 15000, parentD3Element )


//// NAVIGATOR ////

// Navigator
const navigator1 = new navigator.Navigator()

navigator1.loadDataset(
    'http://localhost:3000/TEPAIV/CPC/data/titanic-embark-partial.csv',
    [ 'EMBARKED', 'CLASS', 'STATUS' ]
).then( that => {

    that.colorSet( 'Titanic-2' )
        .build()

} )

