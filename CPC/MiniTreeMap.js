export { MiniTreeMap as default
       , tests_MiniTreeMap

}

import DictionariesArray  from '../common/DictionariesArray.js'
import clog  from '../common/consoleTools.js'

export class MiniTreeMap {

    /**
     * Initializes a MiniTreeMap object.
     * @param {DictionariesArray} frontData
     * @param {DictionariesArray} baseData
     */
    constructor() {

        // PARAMETERS /////////////////////////////////////////////////////////////////////////////////

        this.defaultBarHeight = 100
        this.baseBarPadding = 8

        this.svgContainerWidth = null
        this.svgContainerHeight = null


        // PROPERTIES /////////////////////////////////////////////////////////////////////////////////

        // Color scales
        this._frontColorScale = d3.scaleOrdinal(d3.schemeCategory10)

        this._baseColorScale10 = ["Gainsboro", "LightGray", "Silver", "DarkGray", "Gray", "DimGray",
            "LightSlateGray", "SlateGray", "DarkSlateGray", "Black"]

        this.baseRectangles = null
        this.baseGroups = null

        this.frontRectangles = null
        this.frontGroups = null


        this._frontData = []
        this._baseData = []

        this._frontSeriesData = []
        this._baseSeriesData = []

        this._baseMax = 0
        this._noOfSubcharts = 0

        this.xScale = null
        this.yScale = null


    }

    // Prepare the data
    setData(frontData, baseData) {

        this._frontData = frontData
        this._baseData = baseData

        let frontDataKeys = frontData.uniqueKeys
        let baseDataKeys = baseData.uniqueKeys

        // Set up stack constructor
        let stack = d3.stack()
            .keys(frontDataKeys)
            .order(d3.stackOrderDescending)

        // Convert datasets to stack data
        this._frontSeriesData = stack(frontData.data)
        this._baseSeriesData = stack(baseData.data)

        // Check for errors
        this._preventDifferentBaseAndFrontDataSizes()

        // Get database statistics
        this._baseMax = baseData.maxValue
        this._noOfSubcharts = this._getNoOfSubCharts()
    }

    draw(widthAndHeight, shiftCoordinates=[0,0]){
        let width = widthAndHeight[0]
          , height = widthAndHeight[1]
          , x = shiftCoordinates[0]
          , y = shiftCoordinates[1]

        d3.select('body')
            .append('div')
            .append('span')
            .append('select')


        this._appendSVGContainer([width, height], [x,y])
        this._setupScales()  // Set up scales according to SVG dimensions
        this._drawBaseCharts()
        this._drawFrontCharts()
    }

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

        const baseSeriesData = this._baseSeriesData
            , baseColorScale10 = this._baseColorScale10
            , baseBarPadding = this.baseBarPadding
            , barHeight = this.svgContainerHeight/this._noOfSubcharts
            , xScale = this.xScale
            , yScale = this.yScale

        // Create groups to hold each base chart and save d3 selection as property
        this.baseGroups = this.svg.selectAll('g baseGroup')
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

    }


    _setupScales(){

        this.xScale = d3.scaleLinear()
            .domain([0, this._baseMax])
            .rangeRound([0, this.svgContainerWidth-this.baseBarPadding*2])


        this.yScale = d3.scaleBand()
            .domain(d3.range(this._frontData.data.length))  // leftover from chart with multiple stacks. For positioning N stacks on X axis side by side.
            .rangeRound([0, this.svgContainerHeight])
            .paddingInner(1)

    }

    _getNoOfSubCharts(){

        return this._baseData.data.length
    }

    _preventDifferentBaseAndFrontDataSizes(){

        const baseDataLength = this._baseData.data.length
        const frontDataLength = this._frontData.data.length

        if (baseDataLength !== frontDataLength){
            alert('Front and base data has different lengths')
        }
    }

}




// UNIT TESTS //////////////////////////////////////////////////////////////

function tests_MiniTreeMap() {

    // Preparation

    let frontData = [
        { firstClass: 10,  secondClass: 8,  thirdClass: 25 }
        ,{ firstClass: 4,  secondClass: 12, thirdClass: 28 }
        ,{ firstClass: 2,  secondClass: 19, thirdClass: 32 }
        ,{ firstClass: 7,  secondClass: 23, thirdClass: 35 }
        ,{ firstClass: 23, secondClass: 17, thirdClass: 43 }
    ]

    frontData = new DictionariesArray(frontData)

    let baseData = [
        { firstClass: 110, secondClass: 8,  thirdClass: 25 }
        ,{ firstClass: 6,  secondClass: 122, thirdClass: 28 }
        ,{ firstClass: 50, secondClass: 60, thirdClass: 20 }
        ,{ firstClass: 50, secondClass: 60, thirdClass: 70 }
        ,{ firstClass: 30, secondClass: 40, thirdClass: 50 }
    ]
    baseData = new DictionariesArray(baseData)

    let miniTreeMap = new MiniTreeMap()
    miniTreeMap.setData(frontData, baseData)
    // d3.select('body').append('div')
    //     .attr('height', 100)
    //     .attr('width', 100)
    //     .attr('fill', 'black')
    miniTreeMap.draw([200, 500], [0,0])


    QUnit.module('MiniTreeMap')

    // Check the Data that has been set
    QUnit.test('_frontData', (assert) => {

        const result = JSON.stringify(miniTreeMap._frontData)
        const expected = "{\"data\":[{\"firstClass\":10,\"secondClass\":8,\"thirdClass\":25},{\"firstClass\":4,\"secondClass\":12,\"thirdClass\":28},{\"firstClass\":2,\"secondClass\":19,\"thirdClass\":32},{\"firstClass\":7,\"secondClass\":23,\"thirdClass\":35},{\"firstClass\":23,\"secondClass\":17,\"thirdClass\":43}],\"maxValue\":43,\"uniqueKeys\":[\"firstClass\",\"secondClass\",\"thirdClass\"]}"
        assert.equal(result, expected, 'The result should match the exact template.')

    })

    QUnit.test('_baseData', (assert) => {

        const result = JSON.stringify(miniTreeMap._baseData)
        const expected = "{\"data\":[{\"firstClass\":110,\"secondClass\":8,\"thirdClass\":25},{\"firstClass\":6,\"secondClass\":122,\"thirdClass\":28},{\"firstClass\":50,\"secondClass\":60,\"thirdClass\":20},{\"firstClass\":50,\"secondClass\":60,\"thirdClass\":70},{\"firstClass\":30,\"secondClass\":40,\"thirdClass\":50}],\"maxValue\":122,\"uniqueKeys\":[\"firstClass\",\"secondClass\",\"thirdClass\"]}"
        assert.equal(result, expected, 'The result should match the exact template.')

    })

    // Scales
    QUnit.test('.xScale and .yScale', (assert) => {

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
    QUnit.test('.getNoOfSubCharts', (assert) => {

        assert.equal(miniTreeMap._getNoOfSubCharts()
            , 5
            , 'The number of subCharts should be 5.'
        )

    })
}