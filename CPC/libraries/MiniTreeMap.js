// export { MiniTreeMap as default
//        , tests_MiniTreeMap
//
// }

// import DictionariesArray  from '../common/DictionariesArray.js'
// import clog  from '../common/consoleTools.js'

class MiniTreeMap {


    constructor() {

        // PARAMETERS /////////////////////////////////////////////////////////////////////////////////

        this.defaultBarHeight = 100
        this.baseBarPadding = 8

        this.svgContainerWidth = null
        this.svgContainerHeight = null


        // DATA /////////////////////////////////////////////////////////////////////////////////

        this._columnNames = []

        this._frontFrequenciesArray = []
        this._baseFrequenciesArray = []

        this._frontSeriesData = []
        this._baseSeriesData = []

        this._baseMax = 0
        this._noOfSubcharts = 0


        // SELECTIONS /////////////////////////////////////////////////////////////////////////////////

        // Color scales
        this._frontColorScale = d3.scaleOrdinal(d3.schemeCategory10)

        this._baseColorScale10 = ["Gainsboro", "LightGray", "Silver", "DarkGray", "Gray", "DimGray",
            "LightSlateGray", "SlateGray", "DarkSlateGray", "Black"]

        this.baseRectangles = null
        this.baseGroups = null

        this.frontRectangles = null
        this.frontGroups = null

        this.xScale = null
        this.yScale = null

    }

    // Prepare the data

    /**
     * Sets data of a MiniTreeMap object.
     * @param {FrequenciesArray} frontFrequenciesArray
     * @param {FrequenciesArray} baseFrequenciesArray
     */
    importFrequencies(frontFrequenciesArray, baseFrequenciesArray, columnNames) {

        this._frontFrequenciesArray = frontFrequenciesArray
        this._baseFrequenciesArray = baseFrequenciesArray
        this._columnNames = columnNames

        this._calculateOtherInstanceProperties()
    }


    /**
     * @param dataset {Dataset}
     */
    importDataset(dataset){

        this._frontFrequenciesArray = dataset.frequenciesArray
        this._baseFrequenciesArray = dataset.totalsArray
        this._columnNames = dataset.columnNames

        this._calculateOtherInstanceProperties()

    }


    _calculateOtherInstanceProperties(){

        // Convert front and base arrays to stack data
        this._frontSeriesData = this._convertObjectsArrayToStack(this._frontFrequenciesArray)
        this._baseSeriesData = this._convertObjectsArrayToStack(this._baseFrequenciesArray)

        // Check for errors
        this._preventDifferentBaseAndFrontDataSizes()

        // Get database statistics
        this._baseMax = this._baseFrequenciesArray.maxValue
        this._noOfSubcharts = this._getNoOfSubCharts()
    }

    /**
     * @param widthAndHeight {Array}
     * @param shiftCoordinates {Array} : Default is [0,0]
     */
    draw(widthAndHeight, shiftCoordinates=[0,0]){
        let width = widthAndHeight[0]
          , height = widthAndHeight[1]
          , x = shiftCoordinates[0]
          , y = shiftCoordinates[1]


        // let dropdown = d3.select('body')
        //                  .append('div')
        //                  .append('span')
        //                  .append('select')  // adds the dropdown widget
        //                    .attr('class', 'ui dropdown')
        //
        // dropdown.append('option')
        //           .attr('value', 'Male')
        //           .text('Male')
        //
        // dropdown.append('option')
        //     .attr('value', 'Female')
        //     .text('Female')


        this._appendSVGContainer([width, height], [x,y])
        this._setupScales()  // Set up scales according to SVG dimensions
        this._drawBaseCharts()
        this._drawFrontCharts()
    }

    /**
     *
     * @param widthAndHeight {Array}
     * @param coordinates {Array} - Optional
     * @private
     */
    _appendSVGContainer(widthAndHeight, coordinates=[0,0]) {

        this.svgContainerWidth = widthAndHeight[0]
        this.svgContainerHeight = widthAndHeight[1]

        let x = coordinates[0]
          , y = coordinates[1]

        // Create SVG canvas and store selection
        this.svg = d3.select('body')
            .append('svg')
              .attr('width', this.svgContainerWidth)
              .attr('height', this.svgContainerHeight)
              .attr('transform', 'translate(' + x + ',' + y + ')')
    }

    _drawBaseCharts(){

        const svg = this.svg
            , baseSeriesData = this._baseSeriesData
            , baseColorScale10 = this._baseColorScale10
            , baseBarPadding = this.baseBarPadding
            , barHeight = this.svgContainerHeight/this._noOfSubcharts
            , xScale = this.xScale
            , yScale = this.yScale

        // Create groups to hold each base chart and save d3 selection as property
        this.baseGroups = svg.selectAll('g baseGroup')
            .data(baseSeriesData)
            .enter()
            .append('g')
              .attr('class', 'baseGroup')
              .attr('fill', (d,i) => baseColorScale10[i])
              .attr('transform', 'translate(' + baseBarPadding + ',' + (-baseBarPadding) +  ')')  // padding at left

        // Draw a rectangle for each data value and save d3 selection as property
        this.baseRectangles = this.baseGroups.selectAll('rect')
            .data(d => d)  // iterate within the 3 arrays and bind each apple, orange, and grape value
            .enter()
            .append('rect')
              .attr('y', (d,i) => yScale(i) + baseBarPadding*2)
              .attr('x', (d,i) => xScale(d[0]))
              .attr('width', (d) => xScale(d[1]) - xScale(d[0]))
              .attr('height', barHeight + baseBarPadding*2)
    }

    _drawFrontCharts(){

        const svg = this.svg
            , frontSeriesData = this._frontSeriesData
            , frontColorScale = this._frontColorScale
            , baseBarPadding = this.baseBarPadding
            , barHeight = this.svgContainerHeight/this._noOfSubcharts
            , xScale = this.xScale
            , yScale = this.yScale



        // Create groups (each layer of stacks gets a group: apples, oranges, grapes)
        this.frontGroups = svg.selectAll('g frontGroup')
            .data(frontSeriesData)
            .enter()
            .append('g')
              .attr('class', 'frontGroup')
              .attr('fill', (d,i) => frontColorScale(i))
              .attr('transform', 'translate(' + baseBarPadding + ',0)')  // padding at left


        // Draw a rectangle for each data value
        this.frontRectangles = this.frontGroups.selectAll('rect')
            .data(d => d)  // iterate within the 3 arrays and bind each apple, orange, and grape value
            .enter()
            .append('rect')
              .attr('y', (d,i) => yScale(i) + baseBarPadding*2)
              .attr('x', (d,i) => xScale(d[0]))
              .attr('width', (d) => xScale(d[1]) - xScale(d[0]))
              .attr('height', barHeight)
              .attr('class', (d,i) => i)
    }


    _setupScales(){

        this.xScale = d3.scaleLinear()
            .domain([0, this._baseMax])
            .rangeRound([0, this.svgContainerWidth-this.baseBarPadding*2])

        this.yScale = d3.scaleBand()
            .domain(d3.range(this._frontFrequenciesArray.data.length))  // leftover from chart with multiple stacks. For positioning N stacks on X axis side by side.
            .rangeRound([0, this.svgContainerHeight])
            .paddingInner(1)

    }

    /**
     * Converts ObjectsArray object to stack
     * @param objectsArray {FrequenciesArray}
     * @private
     * @return d3.stack
     */
    _convertObjectsArrayToStack(objectsArray){

        // Setup stack constuctor
        const stackConstructor = d3.stack()
            .keys(objectsArray.uniqueKeys)
            .order(d3.stackOrderDescending)

        // Do the conversion to stack
        const stack = stackConstructor(objectsArray.data)
        console.log(stack)
        return stack
    }

    _getNoOfSubCharts(){

        return this._baseFrequenciesArray.data.length
    }


    _preventDifferentBaseAndFrontDataSizes(){

        const baseDataLength = this._baseFrequenciesArray.data.length
        const frontDataLength = this._frontFrequenciesArray.data.length

        if (baseDataLength !== frontDataLength){
            alert('Front and base data has different lengths')
        }
    }

}



// UNIT TESTS //////////////////////////////////////////////////////////////

function tests_MiniTreeMap() {

    // IMPORT DATASET OBJECT  ///////////////////////////////////////////////////////////

    QUnit.module('MiniTreeMap - Import dataset file')

        // Dataset should be loaded outside the test environment due to asynchronous reading
        let titanicDataset = new Dataset('./test-data/titanic-4x50.csv')


        // Check if properties are initialized correctly
        QUnit.test('CSV read in and instance properties set.', (assert) => {

            // Import Dataset object into MiniTreeMap instance
            let myMiniTreeMap = new MiniTreeMap()
            myMiniTreeMap.importDataset(titanicDataset)


            // Front frequencies array loaded OK?
            const frontFrequenciesArraySample = myMiniTreeMap._frontFrequenciesArray.data.slice(0,3)
            assert.equal(
                  JSON.stringify(frontFrequenciesArraySample)
                , "[{\"1st class\":50},{\"Survived\":33,\"Died\":17},{\"Female\":24,\"Male\":26}]"
                , '"_frontFrequenciesArray" property loaded OK.'
            )

            // Base frequencies array loaded OK?
            const baseFrequenciesArraySample = myMiniTreeMap._baseFrequenciesArray.data.slice(0,3)
            assert.equal(
                JSON.stringify(baseFrequenciesArraySample)
                , "[{\"Total\":50},{\"Total\":50},{\"Total\":50}]"
                , '"_baseFrequenciesArray" property loaded OK.'
            )

            // Column names loaded OK?
            const columnNames = myMiniTreeMap._columnNames
            assert.equal(
                JSON.stringify(columnNames),
                "[\"Ticket\",\"Status\",\"Gender\",\"Name\"]",
                '_columnNames property loaded OK.'
            )

        })

        // Use the imported CSV file to create the visualization


        QUnit.test('Expectation', (assert) => {

            // Import Dataset object into MiniTreeMap instance
            let myMiniTreeMap = new MiniTreeMap()
            myMiniTreeMap.importDataset(titanicDataset)

            myMiniTreeMap.draw([300,300])

            //
            assert.equal(
                JSON.stringify(0),
                '0',
                '... OK.'
            )

        })


    // IMPORT FREQUENCIES DIRECTLY ///////////////////////////////////////////////////////////
    QUnit.module('MiniTreeMap - Import frequencies directly')

        // Preparation

        let frontData = [
             { firstClass: 10,  secondClass: 8,  thirdClass: 25 }
            ,{ firstClass: 4,  secondClass: 12, thirdClass: 28 }
            ,{ firstClass: 2,  secondClass: 19, thirdClass: 32 }
            ,{ firstClass: 7,  secondClass: 23, thirdClass: 35 }
            ,{ firstClass: 23, secondClass: 17, thirdClass: 43 }
        ]

        frontData = new FrequenciesArray(frontData)

        let baseData = [
             { firstClass: 110, secondClass: 8,  thirdClass: 25 }
            ,{ firstClass: 6,  secondClass: 122, thirdClass: 28 }
            ,{ firstClass: 50, secondClass: 60, thirdClass: 20 }
            ,{ firstClass: 50, secondClass: 60, thirdClass: 70 }
            ,{ firstClass: 30, secondClass: 40, thirdClass: 50 }
        ]
        baseData = new FrequenciesArray(baseData)

        let miniTreeMap = new MiniTreeMap()
        miniTreeMap.importFrequencies(frontData, baseData)
        // d3.select('body').append('div')
        //     .attr('height', 100)
        //     .attr('width', 100)
        //     .attr('fill', 'black')
        miniTreeMap.draw([200, 500], [0,0])


        // Check the Data that has been set
        QUnit.test('_frontFrequenciesArray initialized OK', (assert) => {

            const result = JSON.stringify(miniTreeMap._frontFrequenciesArray)
            const expected = "{\"data\":[{\"firstClass\":10,\"secondClass\":8,\"thirdClass\":25},{\"firstClass\":4,\"secondClass\":12,\"thirdClass\":28},{\"firstClass\":2,\"secondClass\":19,\"thirdClass\":32},{\"firstClass\":7,\"secondClass\":23,\"thirdClass\":35},{\"firstClass\":23,\"secondClass\":17,\"thirdClass\":43}],\"maxValue\":43,\"uniqueKeys\":[\"firstClass\",\"secondClass\",\"thirdClass\"]}"
            assert.equal(result, expected, 'The result should match the exact template.')

        })

        QUnit.test('_baseFrequenciesArray initialized OK', (assert) => {

            const result = JSON.stringify(miniTreeMap._baseFrequenciesArray)
            const expected = "{\"data\":[{\"firstClass\":110,\"secondClass\":8,\"thirdClass\":25},{\"firstClass\":6,\"secondClass\":122,\"thirdClass\":28},{\"firstClass\":50,\"secondClass\":60,\"thirdClass\":20},{\"firstClass\":50,\"secondClass\":60,\"thirdClass\":70},{\"firstClass\":30,\"secondClass\":40,\"thirdClass\":50}],\"maxValue\":122,\"uniqueKeys\":[\"firstClass\",\"secondClass\",\"thirdClass\"]}"
            assert.equal(result, expected, 'The result should match the exact template.')

        })


        QUnit.test('_baseSeriesData and _frontSeriesData properties are initialized OK', (assert) => {

            const baseSeriesData = miniTreeMap._baseSeriesData
                , frontSeriesData = miniTreeMap._frontSeriesData

            assert.equal(JSON.stringify(baseSeriesData), "[[[8,118],[122,128],[60,110],[60,110],[40,70]],[[0,8],[0,122],[0,60],[0,60],[0,40]],[[118,143],[128,156],[110,130],[110,180],[70,120]]]")

        })


        // Scales
        QUnit.test('.xScale and .yScale initialized OK.', (assert) => {

            assert.equal(miniTreeMap.xScale(35)
                , 53
                , 'Given that width is 200, .xScale(10) should return'
            )
            assert.equal(miniTreeMap.yScale(2)
                , 250
                , 'Given that height is 500, .yScale(2) should return 250'
            )
        })

        // Calculate number of Subcharts
        QUnit.test('.getNoOfSubCharts works OK.', (assert) => {

            assert.equal(miniTreeMap._getNoOfSubCharts()
                , 5
                , 'The number of subCharts should be 5.'
            )

        })


        QUnit.test('._convertObjectsArrayToStack works OK.', (assert) => {

            const frontStack = miniTreeMap._convertObjectsArrayToStack(miniTreeMap._frontFrequenciesArray)
                , baseStack = miniTreeMap._convertObjectsArrayToStack(miniTreeMap._baseFrequenciesArray)

            assert.equal(JSON.stringify(frontStack), "[[[33,43],[40,44],[51,53],[58,65],[60,83]],[[25,33],[28,40],[32,51],[35,58],[43,60]],[[0,25],[0,28],[0,32],[0,35],[0,43]]]")
            assert.equal(JSON.stringify(baseStack), "[[[8,118],[122,128],[60,110],[60,110],[40,70]],[[0,8],[0,122],[0,60],[0,60],[0,40]],[[118,143],[128,156],[110,130],[110,180],[70,120]]]")

        })



}