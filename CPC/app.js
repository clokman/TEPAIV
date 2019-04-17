// let titanicDataset = Papa.parse('./data/titanic/titanic-4columns.csv', {
//     download: true,
//     complete: function(results) {
//         console.log(results);
//     }
// })
// clog(titanicDataset)


// READ DATA FROM FILE ============================================================================================================


// Convert CSV to front ObjectsArray (frequencies data)
let dataset = new Dataset('./data/titanic/titanic-4columns.csv', () => {

    const frontCountsArray = dataset.frequenciesArray
    const baseCountsArray = dataset.totalsArray

    let miniTreeMap = new MiniTreeMap()
    miniTreeMap.importFrequencies(frontCountsArray, baseCountsArray)
    miniTreeMap.draw([150, 300])


    d3.selectAll('rect')
        .on('click', function(){
            console.log(this)
        })

})

