//// IMPORTS /////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Import polyfill for fetch() method
if (typeof fetch !== 'function') {
    global.fetch =  require('node-fetch-polyfill')
}

// Import polyfill for Object.fromEntries() method
if (typeof Object.fromEntries !== 'function') {
    Object.fromEntries = require('object.fromentries')
}

global.d3 = {
    ...require("../../external/d3/d3"),
    ...require("../../external/d3/d3-array")
}

const datasets = require("../../../data/datasets")
const navigator = require("../navigator")






//// SVG /////////////////////////////////////////////////////////////////////////////////////////////////////////////

test ('Should instantiate Svg class object', () => {

    const mySvg = new navigator.Svg(111, 222)

    expect(mySvg).toBeDefined()

})

test ('Should get and set Svg width and height correctly in single and chain syntax', () => {

    mySvg = new navigator.Svg(111, 222)


    //// SINGLE METHOD ////

    // Get
    expect(mySvg.width()).toBe(111)
    expect(mySvg.height()).toBe(222)

    // Set (and then get to see what is set)
    expect(mySvg.width(11).width()).toBe(11)
    expect(mySvg.height(22).height()).toBe(22)


    //// CHAIN SYNTAX////

    // width().height()
    mySvg.width(33).height(44)
    expect(mySvg.width()).toBe(33)
    expect(mySvg.height()).toBe(44)

    // height().width()
    mySvg.height(888).width(999)
    expect(mySvg.width()).toBe(999)
    expect(mySvg.height()).toBe(888)


})






//// CATEGORY /////////////////////////////////////////////////////////////////////////////////////////////////////////////


//// INSTANTIATE ///

test ('Should instantiate a Category class object', () => {

    myCategory = new navigator.Category()

    expect(myCategory).toBeDefined()

})





//// CATEGORY /////////////////////////////////////////////////////////////////////////////////////////////////////////////

test ('Should instantiate a Label class object', () => {

    myLabel = new navigator.Label()

    expect(myLabel).toBeDefined()

})



test ('Should get and set label', () => {

    myLabel = new navigator.Category()

    //// SINGLE METHOD ///

    expect(myLabel.label('my label').label()).toBe('my label')
})



//// RECTANGLE /////////////////////////////////////////////////////////////////////////////////////////////////////////////


//// INSTANTIATE ///

test ('Should instantiate a Rectangle class object', () => {

    myRectangle = new navigator.Rectangle()

    expect(myRectangle).toBeDefined()

})




//// X and Y COORDINATES ///
test ('Should set rectangle x and y coordinates', () => {

    myRectangle = new navigator.Rectangle()

    //// SINGLE METHOD ///

    // X
    expect(myRectangle.x()).toBe(0)
    expect(myRectangle.x(111).x()).toBe(111)


    // Y
    expect(myRectangle.y()).toBe(0)
    expect(myRectangle.y(222).y()).toBe(222)


    //// CHAIN SYNTAX ///

    // x().y()
    myRectangle.x(888).y(999)
    expect(myRectangle.x()).toBe(888)
    expect(myRectangle.y()).toBe(999)

    // y().x()
    myRectangle.y(444).x(555)
    expect(myRectangle.y()).toBe(444)
    expect(myRectangle.x()).toBe(555)


    // x().y() and other methods
    myRectangle.class('S').x(8888).y(9999).id('Sun')
    expect(myRectangle.x()).toBe(8888)
    expect(myRectangle.y()).toBe(9999)

})




//// WIDTH AND HEIGHT ///

test ('Should get and set rectangle width and height correctly in single and chain syntax', () => {

    myRectangle = new navigator.Rectangle()

    //// SINGLE METHOD ////

    // Get
    expect(myRectangle.width()).toBe(25)
    expect(myRectangle.height()).toBe(25)

    // Set (and then get to see what is set)
    expect(myRectangle.width(100).width()).toBe(100)
    expect(myRectangle.height(100).height()).toBe(100)


    //// CHAIN SYNTAX////

    // width().height()
    myRectangle.width(999).height(111)
    expect(myRectangle.width()).toBe(999)
    expect(myRectangle.height()).toBe(111)

    // height().width()
    myRectangle.height(555).width(444)
    expect(myRectangle.width()).toBe(444)
    expect(myRectangle.height()).toBe(555)
})




//// COLOR ///

test ('Should get and set fill color using single and chain syntax', () => {

    myRectangle = new navigator.Rectangle()

    // Single method
    expect(myRectangle.fill('green').fill()).toBe('green')
    expect(myRectangle.fill('red').fill()).toBe('red')

    // Chain syntax
    expect(myRectangle.width(111).fill('red').fill()).toBe('red')
    expect(myRectangle.fill('blue').height(222).fill()).toBe('blue')


})




//// CLASS AND ID ///

test ('Should set rectangle class and ID with single and chain syntax', () => {

    myRectangle = new navigator.Rectangle()


    //// SINGLE METHOD ///

    // Class
    expect(myRectangle.class()).toBe('')
    expect(myRectangle.class('class-1').class()).toBe('class-1')

    // ID
    expect(myRectangle.id()).toBe('')
    expect(myRectangle.id('id-1').id()).toBe('id-1')



    //// CHAIN SYNTAX ////

    // ID and Class
    myRectangle.class('M').id('Earth')
    expect(myRectangle.class()).toBe('M')
    expect(myRectangle.id()).toBe('Earth')


    //// CHAIN SYNTAX ////

    // ID and Class with other methods
    myRectangle.class('M').id('Vulcan').width(8888).height(9999)
    expect(myRectangle.class()).toBe('M')
    expect(myRectangle.id()).toBe('Vulcan')


})





// const dataset = datasets.titanic
//     , ignoredColumns = ['Name']
//     , svgContainerWidth = 600
//     , svgContainerHeight = 450
//     , padding = 8
//     , panelBackgroundPadding = 8
//     , barHeight = 110
//     , preferences = ['drawContextAsBackground']
// // ['absoluteRectangleWidths','drawContextAsBackground', drawContextAsForeground]
// // NOTE: The order in this parameter array does not matter, as this array is
// // scanned with array.includes() method)
//
//
// test('CPC should initialize with properties', () => {
//
//         const cpc = new CPC(
//             dataset,
//             ignoredColumns,
//             svgContainerWidth,
//             svgContainerHeight,
//             padding,
//             panelBackgroundPadding,
//             barHeight,
//             ['drawContextAsBackground']
//         )
//
//         expect(cpc).toBeDefined()
//         expect(cpc).toBeInstanceOf(CPC)
//         expect(cpc).toHaveProperty('_dataset')
//         expect(cpc).toHaveProperty('_frontColorScales')
//         expect(cpc).toHaveProperty('_rectangleColorRegistry')
//         expect(cpc).toHaveProperty('_svg')
//         expect(cpc).toHaveProperty('_svgContainerWidth')
//         expect(cpc).toHaveProperty('_svgContainerHeight')
//
// })