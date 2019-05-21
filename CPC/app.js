
// // Set initial slider dial position from Svg element
// slider.value = svgCanvas.width()
// monitor.innerText = slider.value



const svgCanvas = new navigator.Svg()
    .height(850)




const width_slider = new controls.Slider("Svg Width", svgCanvas.width(), 100, 1000, svgCanvas, svgCanvas.width)
const height_slider = new controls.Slider("Svg Height", svgCanvas.height(), 100, 1000, svgCanvas, svgCanvas.height)




const padding = 10
    , distanceBetweenPanels = 110


const label1 = new navigator.Text()
label1.x(12).y(85).fontSize('15px').fill('#fed976\n').id('label-1').text('Unknown').update()


const label2 = new navigator.Text()
label2.x(15).y(130).fontSize('15px').fill('#fd8d3c\n').id('label-2').text('Survived').update()

const label3 = new navigator.Text()
label3.x(40).y(210).fontSize('15px').fill('#fc4e2a\n').id('label-3').text('Died').update()




const x1 = 90


const background1 = new navigator.Rectangle()
background1.x(x1-padding).y(10).height(830).width(340).update()

const category1 = new navigator.Category()
category1.x(x1).y(50).height(50).width(75).fill('#fed976\n').id('rectangle-1').update()
category1.percentage(25).update()

const category2 = new navigator.Category()
category2.x(x1).y(100).height(50).width(75).fill('#fd8d3c\n').id('rectangle-2').update()
category2.percentage(25).update()

const category3 = new navigator.Category()
category3.x(x1).y(150).height(100).width(75).fill('#fc4e2a\n').id('rectangle-3').update()
category3.percentage(50).update()


const connector1 = new navigator.Rectangle()
connector1.x(x1+74).y(100).height(50).width(27).fill('#fd8d3c\n').id('connector-1').update()




const label4 = new navigator.Text()
label4.x(20).y(350).fontSize('15px').fill('#fed976\n').id('label-7').text('NA').update()


const label5 = new navigator.Text()
label5.x(20).y(410).fontSize('15px').fill('#fd8d3c\n').id('label-8').text('Female').update()

const label6 = new navigator.Text()
label6.x(20).y(480).fontSize('15px').fill('#fc4e2a\n').id('label-9').text('Male').update()



const category4 = new navigator.Category()
category4.x(x1).y(325).height(50).width(75).fill('#d9d9d9').id('rectangle-4').update()
category4.percentage(16).update()

const category5 = new navigator.Category()
category5.x(x1).y(365).height(75).width(75).fill('#969696').id('rectangle-5').update()
category5.percentage(42).update()

const category6 = new navigator.Category()
category6.x(x1).y(440).height(70).width(75).fill('#737373').id('rectangle-6').update()
category6.percentage(42).update()





const label7 = new navigator.Text()
label7.x(10).y(610).fontSize('15px').fill('#a6bddb\n').id('label-7').text('1st class').update()


const label8 = new navigator.Text()
label8.x(10).y(675).fontSize('15px').fill('#3690c0\n').id('label-8').text('2nd class').update()

const label9 = new navigator.Text()
label9.x(10).y(750).fontSize('15px').fill('#0570b0\n').id('label-9').text('3rd class').update()



const category7 = new navigator.Category()
category7.x(x1).y(575).height(50).width(75).fill('#a6bddb\n').id('rectangle-7').update()
category7.percentage(20).update()

const category8 = new navigator.Category()
category8.x(x1).y(625).height(75).width(75).fill('#3690c0\n').id('rectangle-8').update()
category8.percentage(30).update()

const category9 = new navigator.Category()
category9.x(x1).y(700).height(100).width(75).fill('#0570b0\n').id('rectangle-9').update()
category9.percentage(50).update()




const x2 = x1 + distanceBetweenPanels

const background2 = new navigator.Rectangle()
background2.x(x2-padding).y(25).height(800).width(215).fill('#fd8d3c\n').update()


// const category10 = new navigator.Category()
// category10.x(x2).y(50).height(50).width(75).fill('crimson').id('rectangle-10').update()
//
// const category11 = new navigator.Category()
// category11.x(x2).y(100).height(50).width(75).fill('dodgerblue').id('rectangle-11').update()
// category11.percentage(40).update()
//
// const category12= new navigator.Category()
// category12.x(x2).y(150).height(100).width(75).fill('spring').id('rectangle-12').update()
// category12.percentage(40).update()



const category13 = new navigator.Category()
category13.x(x2).y(325).height(50).width(75).fill('#d9d9d9').id('rectangle-13').update()
category13.percentage(16).update()

const category14 = new navigator.Category()
category14.x(x2).y(365).height(75).width(75).fill('#969696').id('rectangle-14').update()
category14.percentage(42).update()

const category15 = new navigator.Category()
category15.x(x2).y(440).height(70).width(75).fill('#737373').id('rectangle-15').update()
category15.percentage(42).update()



const category16 = new navigator.Category()
category16.x(x2).y(575).height(50).width(75).fill('#a6bddb\n').id('rectangle-16').update()
category16.percentage(20).update()

const category17 = new navigator.Category()
category17.x(x2).y(625).height(75).width(75).fill('#3690c0\n').id('rectangle-17').update()
category17.percentage(30).update()

const category18 = new navigator.Category()
category18.x(x2).y(700).height(100).width(75).fill('#0570b0\n').id('rectangle-18').update()
category18.percentage(50).update()


const connector2 = new navigator.Rectangle()
connector2.x(x2+74).y(575).height(50).width(27).fill('#a6bddb\n').id('rectangle-16').update()





const x3 = x2 + distanceBetweenPanels

const background3 = new navigator.Rectangle()
background3.x(x3-padding).y(40).height(775).width(95).fill('#a6bddb\n').update()


// const category19 = new navigator.Category()
// category19.x(x3).y(50).height(50).width(75).fill('#fed976\n').id('rectangle-19').update()
//
// const category20 = new navigator.Category()
// category20.x(x3).y(100).height(50).width(75).fill('#fd8d3c\n').id('rectangle-20').update()
// category20.percentage(40).update()
//
// const category21= new navigator.Category()
// category21.x(x3).y(150).height(100).width(75).fill('#fc4e2a\n').id('rectangle-21').update()
// category21.percentage(40).update()


const category22 = new navigator.Category()
category22.x(x3).y(325).height(50).width(75).fill('#d9d9d9').id('rectangle-22').update()
category22.percentage(16).update()

const category23 = new navigator.Category()
category23.x(x3).y(365).height(75).width(75).fill('#969696').id('rectangle-23').update()
category23.percentage(42).update()

const category24 = new navigator.Category()
category24.x(x3).y(440).height(70).width(75).fill('#737373').id('rectangle-24').update()
category24.percentage(42).update()


//
// const category25 = new navigator.Category()
// category25.x(x3).y(575).height(50).width(75).fill('goldenrod').id('rectangle-25').update()
// category25.percentage(20).update()
//
// const category26 = new navigator.Category()
// category26.x(x3).y(625).height(75).width(75).fill('dodgerblue').id('rectangle-26').update()
// category26.percentage(30).update()
//
// const category27 = new navigator.Category()
// category27.x(x3).y(700).height(100).width(75).fill('spring').id('rectangle-27').update()
// category27.percentage(50).update()







// Demo commands:
// category1.x(10).width(400).height(800).percentage(100).update(3000)






















// myRectangle = new navigator.Rectangle().x(50).update()
// myText = new navigator.Text()
// myText.x(100).fill('red').update()
//
//
// parentSelection = d3.select('body').select('svg')
// myContainer = new navigator.Container()
// myContainer2 = new navigator.Container()
// myContainer.id('Earth').class('M').update()
//
// myContainer2.class('container').update()
// myContainer2.id('container-1').update()


// myChart = new navigator.Chart()
// myChart.x(300)


// myCategory = new navigator.Category()


// const dataset = datasets.titanic
//     , ignoredColumns = ignoredColumnsFromInput
//     , svgContainerWidth = 600
//     , svgContainerHeight = 450
//     , padding = 8
//     , panelBackgroundPadding = 8
//     , barHeight = 110
//     , preferences = ['drawContextAsBackground']
//   // ['absoluteRectangleWidths','drawContextAsBackground', drawContextAsForeground]
//   // NOTE: The order in this parameter array does not matter, as this array is
//   // scanned with array.includes() method)
//
//
// const cpc = new CPC.CPC(
//     dataset,
//     ignoredColumns,
//     svgContainerWidth,
//     svgContainerHeight,
//     padding,
//     panelBackgroundPadding,
//     barHeight,
//     preferences
// )
