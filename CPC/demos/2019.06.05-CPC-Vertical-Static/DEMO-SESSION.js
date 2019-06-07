//// DEMO SESSION  ///////////////////////////////////////////////////////
// Presented to Jack van Wijk and Michel Westenberg in June 2019

// INSTRUCTIONS:
// These commands can be ran line by line in the Javascript console of a web browser to
// showcase functionality of the CPC package.


//// BASIC SHAPES ////

mySvg.clear()

// Create rectangle
rectangleBackground = new shape.Rectangle()

// Move horizontally
rectangleBackground.x(400).update()

// Move vertically AND slowly
rectangleBackground.y(400).update(4000)

// Move AND change color
rectangleBackground.x(0).fill('dodgerblue').update(3000)

// Change width
rectangleBackground.width(400).update(1500)

// Multiple transformations
rectangleBackground.y(0).height(400).width(100).update(1500)



// Add category inside
categoryFemale = new navigator.Category()

// Change category percentage AND color
categoryFemale.percentage(12).fill('lightblue').update(1000)

// Change caption color
categoryFemale.textFill('black').update(3000)



// Enlarge background
rectangleBackground.width(rectangleBackground.width() + 100).update()
rectangleBackground.width(rectangleBackground.width() - 50).update()

// Transform category to panel
categoryFemale
    .text('Females')
    .textAlignment('top-left')
    .height(350)
    .width(100)
    .update(1500)


// Create three categories inside the new panel
categoryA = new navigator.Category().x(50).y(75).percentage(33).update()
categoryB = new navigator.Category().x(50).y(125).percentage(33).update()
categoryFirstClass = new navigator.Category().x(50).y(175).percentage(33).update()

// Increase vertical space between categories
categoryB.y( categoryB.y() + 5 ).update()
categoryFirstClass.y( categoryFirstClass.y() + 10 ).update()



// Enlarge the 1st class category to span panel height
categoryFirstClass.height(150).update(1500)

// Update percentages
categoryA.percentage(20).update()
categoryB.percentage(20).update()
categoryFirstClass.percentage(60).update()

// Color one category
categoryFirstClass.fill('salmon').update()

// Make room for another panel
rectangleBackground.width( rectangleBackground.width() + 90 ).update()
categoryFemale.width( rectangleBackground.width() - 50 ).update()

// Maximize the 1st class category into a second panel
categoryFirstClass.x(120).y(35).width(75).height(325).update()
categoryFirstClass.textAlignment('top-left').update()
categoryFirstClass.text('1st class').update()


/// Add three categories in 1st class
categoryX = new navigator.Category().x(133).y(75).height(50).percentage(20).update()
categoryY = new navigator.Category().x(133).y(130).height(60).percentage(30).update()
categoryZ = new navigator.Category().x(133).y(195).height(150).percentage(50).update()

// Change category colours
categoryX.fill('#fee6e4').textFill('darkgray').update()
categoryY.fill('#fdc4be').update()
categoryZ.fill('#fba298').update()

// Remove categories
categoryA.remove()
categoryB.remove()



// Maximize females
eulerPadding = 10
categoryFemale
    .x( rectangleBackground.x() + eulerPadding )
    .y( rectangleBackground.y() + eulerPadding )
    .width( rectangleBackground.width() - eulerPadding - categoryFemale.x() )
    .height( rectangleBackground.height() - eulerPadding - categoryFemale.y() )
    .text('')
    .update(1500)

// Maximize 1st class
categoryFirstClass
    .x( categoryFemale.x() + eulerPadding )
    .y( categoryFemale.y() + eulerPadding )
    .width( categoryFemale.width() - eulerPadding - categoryFemale.x() )
    .height( categoryFemale.height() - eulerPadding - categoryFemale.y() )
    .update(1500)

// Enlarge categories
categoryX.x(35).width(173).update()
categoryY.x(35).width(173).update()
categoryZ.x(35).width(173).update()





//// COMPLEX SHAPES ////


// CHART //

// Create a chart
myChart = new navigator.Chart()
    .x(280)
    .update()

// Generate example data
myStack = new data.Stack()
    .populateWithExampleData('gender')

// Feed the new data to existing chart
myChart.stack(myStack).update(0)  // update(0) is rather a quick hack; it makes the new DOM elements (that are created upon entering new data) look like they replace the old elements in-place, instead of spawning somewhere else and then moving to the place of the old DOM elements with an animation.

// Modify chart
myChart.width(150).height(400).update()
myChart.width(80).height(380).y( myChart.y() - 10  ).update()






// PANEL //

// Create a panel
myPanel = new navigator.Panel()

// Change parameters
myPanel
    .bgFill('#deebf7')
    .y(450)
    .bgText('Passengers')
    .update()

// Add child panel
myChildPanel1 = new navigator.Panel(myPanel)
    .bgFill('#9ecae1')
    .update()

// Add another child panel
myChildPanel2 = new navigator.Panel(myChildPanel1)
    .bgFill('#3182bd')
    .update()


// Demo Code //
myPanel.objects('class').objects('first-class').fill('teal').update()
myPanel.objects('class').x(400).y(490).height(100).width(100).update()

// myPanel.objects('gender').x(300).y(450).height(100).width(100).update()
// myPanel.objects('status').x(300).y(470).height(100).width(100).update()





