//// IMPORTS /////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Navigator class of CPC //
const navigator = require("../../navigator")






//// UNIT TESTS ///////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


//// Instantiation ///////////////////////////////////////////////////////////////

describe ('Instantiation', () => {


    test ('Instantiate Category', () => {

        const myCategory = new navigator.Category()

        expect(myCategory).toBeDefined()

    })

})




//// Coordinates ///////////////////////////////////////////////////////////////

describe ('Coordinates', () => {


    test ('Get and set coordinates (and positions of objects in category)', () => {

        // Clear JEST's DOM to prevent leftovers from previous tests
        document.body.innerHTML = ''
        // Create svg
        const mySvg = new container.Svg()
        // Create category
        const myCategory = new navigator.Category()

        // Also create a label, so that it can be moved as well
        myCategory.label('My label').update()


        // SELECTIONS //
        const categoryElement = document.querySelector('.category')
        const rectangleElement = document.querySelector('.category rect')
        const labelObject = myCategory.objects('label')
            , labelElement = document.querySelector('.category-label')
        const percentageObject = myCategory.objects('text')
            , percentageElement = document.querySelector('.rectangle-caption')


        // X() ///////////////

        const initialX = myCategory.x()
            , initialXForPercentage = percentageObject.x()
            , initialXForLabel = labelObject.x()
        const newX = initialX + 50
            , newXForPercentage = initialXForPercentage + 50
            , newXForLabel = initialXForLabel + 50

        // Update x coordinate
        myCategory.x(newX).update()

        // Properties and attributes of all objects/elements should be updated
        expect(myCategory.x()).toBe(newX)
        expect(rectangleElement.getAttribute('x')).toBe(String(newX))
        expect(percentageElement.getAttribute('x')).toBe(String(newXForPercentage))
        expect(labelElement.getAttribute('x')).toBe(String(newXForLabel))



        // Y() ///////////////

        const initialY = myCategory.y()
            , initialYForPercentage = percentageObject.y()
            , initialYForLabel = labelObject.y()
        const newY = initialY + 50
            , newYForPercentage = initialYForPercentage + 50
            , newYForLabel = initialYForLabel + 50

        // Update y coordinate
        myCategory.y(newY).update()

        // Properties and attributes of all objects/elements should be updated
        expect(myCategory.y()).toBe(newY)
        expect(rectangleElement.getAttribute('y')).toBe(String(newY))
        expect(percentageElement.getAttribute('y')).toBe(String(newYForPercentage))
        expect(labelElement.getAttribute('y')).toBe(String(newYForLabel))


    })


    test ('Chain syntax', () => {

        // Clear JEST's DOM to prevent leftovers from previous tests
        document.body.innerHTML = ''
        // Create svg
        const mySvg = new container.Svg()
        // Create category
        const myCategory = new navigator.Category()


        // CHAIN SYNTAX //
        // x().y()
        myCategory.x(11).y(11)
        expect(myCategory.x()).toBe(11)
        expect(myCategory.y()).toBe(11)

        // y().x()
        myCategory.y(22).x(22)
        expect(myCategory.y()).toBe(22)
        expect(myCategory.x()).toBe(22)

    })


})




//// Height ///////////////////////////////////////////////////////////////

describe ('Height', () => {


    test ('Get and set height (and positions of objects in category)', () => {

        // Clear JEST's DOM to prevent leftovers from previous tests
        document.body.innerHTML = ''
        // Create svg
        const mySvg = new container.Svg()
        // Create category
        const myCategory = new navigator.Category()

        // Also create a label, so that it can be moved as well
        myCategory.label('My label').update()


        // SELECTIONS //
        const categoryElement = document.querySelector('.category')
        const rectangleElement = document.querySelector('.category rect')
        const labelObject = myCategory.objects('label')
            , labelElement = document.querySelector('.category-label')
        const percentageObject = myCategory.objects('text')
            , percentageElement = document.querySelector('.rectangle-caption')


        // HEIGHT() ////////////////

        // Update height
        myCategory.height(111).update()

        // Object property and element attribute should be updated
        expect(myCategory.height()).toBe(111)
        expect(rectangleElement.getAttribute('height')).toBe(String(111))

        // Properties and attributes of all objects/elements in category should be updated
        expect(percentageElement.getAttribute('y')).toBe("83.5")
        expect(labelElement.getAttribute('y')).toBe("83.5")


    })


})




//// Fill ///////////////////////////////////////////////////////////////

describe ('Fill', () => {

    test ('Should get and set fill color using single and chain syntax', () => {

        const myCategory = new navigator.Category()

        // Single method
        expect(myCategory.fill('green').fill()).toBe('green')
        expect(myCategory.fill('red').fill()).toBe('red')

        // Chain syntax
        expect(myCategory.x(111).fill('red').fill()).toBe('red')
        expect(myCategory.fill('blue').y(222).fill()).toBe('blue')


    })


})




//// Percentage Value & Percentage Text ///////////////////////////////////////////////////////////////

describe ('Percentage Value & Percentage Text', () => {


    test ('Should get and set percentage using single and chain syntax', () => {

        const myCategory = new navigator.Category()

        // Single method
        expect(myCategory.percentage(10).percentage()).toBe(10)
        expect(myCategory._textObject.text()).toBe('10%')

        expect(myCategory.percentage(20).percentage()).toBe(20)
        expect(myCategory._textObject.text()).toBe('20%')


        // Chain syntax
        expect(myCategory.x(111).percentage(30).percentage()).toBe(30)
        expect(myCategory._textObject.text()).toBe('30%')


        expect(myCategory.percentage(40).y(222).percentage()).toBe(40)
        expect(myCategory._textObject.text()).toBe('40%')


    })


    test ('Should get and set percentage text fill color using single and chain syntax', () => {

        const myCategory = new navigator.Category()

        // Single method
        expect(myCategory.textFill('green').textFill()).toBe('green')
        expect(myCategory.textFill('red').textFill()).toBe('red')

        // Chain syntax
        expect(myCategory.x(111).textFill('red').textFill()).toBe('red')
        expect(myCategory.textFill('blue').y(222).textFill()).toBe('blue')

    })


})




//// Class ///////////////////////////////////////////////////////////////

describe ('Class', () => {
    
    
    test ('Should get and set parent group class of the category using single and chain syntax', () => {

        const myCategory = new navigator.Category()


        // SINGLE METHOD //

        // Class
        expect(myCategory.class()).toBe('category')
        // expect(myCategory.class('class-1').class()).toBe('class-1')

        // ID
        expect(myCategory.id()).toBe(null)
        expect(myCategory.id('id-1').id()).toBe('id-1')



        // CHAIN SYNTAX //

        // ID and Class
        myCategory.class('M').id('Earth')
        expect(myCategory.class()).toBe('M')
        expect(myCategory.id()).toBe('Earth')


        // ID and Class with other methods
        myCategory.x(8888).class('M').id('Vulcan').y(9999)
        expect(myCategory.class()).toBe('M')
        expect(myCategory.id()).toBe('Vulcan')
        expect(myCategory.x()).toBe(8888)
        expect(myCategory.y()).toBe(9999)

    })


})





//// Label ///////////////////////////////////////////////////////////////

describe ('Label', () => {


    test ('Get label', () => {

        // Clear JEST's DOM to prevent leftovers from previous tests
        document.body.innerHTML = ''
        // Create svg
        const mySvg = new container.Svg()
        // Create category
        const myCategory = new navigator.Category()


        // Get label before setting it
        expect(myCategory.label()).toBeNull()

        // Set label
        myCategory.label('My label').update()

        // Get label after setting it
        expect(myCategory.label()).toBe('My label')

    })


    test ('Set label', () => {

        // Clear JEST's DOM to prevent leftovers from previous tests
        document.body.innerHTML = ''
        // Create svg
        const mySvg = new container.Svg()
        // Create category
        const myCategory = new navigator.Category()

        // Check that there are no label objects or elements already
        // property
        expect(myCategory.label()).toBe(null)
        // object
        expect(myCategory.objects('label')).toBeUndefined()
        // element
        expect(document.querySelectorAll('.category-label')).toHaveLength(0)


        // Set label
        myCategory
            .label('My label')
            .update()

        // Select label and percentage objects and elements
        const labelObject = myCategory.objects('label')
            , percentageObject = myCategory.objects('text')
        const labelElement = document.querySelector('.category-label')
            , percentageElement = document.querySelector('.rectangle-caption')

        // Label property should be set and an object and element should have been created
        expect(myCategory.label()).toBe('My label')
        expect(labelElement.textContent).toBe('My label')
        expect(labelObject).toBeDefined()
        expect(labelElement).not.toBeNull()

        // Label element should be a child of category element (which is a group)
        expect(labelElement.parentElement.className.baseVal).toBe('category')



        // Y coordinate of the label object should be equal to that of percentage object
        expect(labelObject.y()).toBe(percentageObject.y())

        // Check the Y coordinates of label and percentage also on the DOM
        expect(labelElement.getAttribute('y')).toBe(percentageElement.getAttribute('y'))


        // Check other object properties and element attributes of label //

        // x
        const expectedLabelPosition = myCategory.x() - myCategory.labelDistance();
        expect(labelObject.x()).toBe(expectedLabelPosition)
        expect(labelElement.getAttribute('x')).toBe(String(expectedLabelPosition))

        // Fill
        expect(labelObject.fill()).toBe('gray')
        expect(labelElement.getAttribute('fill')).toBe('gray')

        // Text anchor
        expect(labelObject.textAnchor()).toBe('end')
        expect(labelElement.getAttribute('text-anchor')).toBe('end')

        // Dominant baseline
        expect(labelObject.dominantBaseline()).toBe(percentageObject.dominantBaseline())
        expect(labelElement.getAttribute('dominant-baseline')).toBe(percentageElement.getAttribute('dominant-baseline'))

        // Class
        expect(labelObject.class()).toBe('category-label')

    })


    test ('Turn label off', () => {

        // Clear JEST's DOM to prevent leftovers from previous tests
        document.body.innerHTML = ''
        // Create svg
        const mySvg = new container.Svg()
        // Create category
        const myCategory = new navigator.Category()

        // Set label
        myCategory
            .label('My label')
            .update()

        // Select label and percentage objects and elements
        const labelObject = myCategory.objects('label')
        const labelElement = document.querySelector('.category-label')

        // Label property should be set and an object and element should have been created
        expect(myCategory.label()).toBe('My label')
        expect(labelObject).toBeDefined()
        expect(labelElement).not.toBeNull()

        myCategory
            .label(false)
            .update()

        // Label property should be set to null, and an object and element should have been created
        const labelObjectAfterRemoval = myCategory.objects('label')
        const labelElementAfterRemoval = document.querySelector('.category-label')
        expect(myCategory.label()).toBe(null)
        expect(labelObjectAfterRemoval).toBeUndefined()
        expect(labelElementAfterRemoval).toBeNull()
    })


    test ('Get/set label distance', () => {

        // Clear JEST's DOM to prevent leftovers from previous tests
        document.body.innerHTML = ''
        // Create svg
        const mySvg = new container.Svg()
        // Create category
        const myCategory = new navigator.Category()


        // Save initial label distance for later comparison
        const initialLabelDistance = myCategory.labelDistance()

        // Verify that using labelDistance as a getter worked
        expect(initialLabelDistance.constructor.name).toBe('Number')

        // Set label
        myCategory
            .label('My label')
            .update()

        const labelObject = myCategory.objects('label')
        const labelElement = document.querySelector('.category-label')

        // Check initial X coordinates of label //
        const expectedXCoordinateOfLabel = myCategory.x() - myCategory.labelDistance()
        // property
        expect(labelObject.x()).toBe(expectedXCoordinateOfLabel)
        // attribute
        expect(labelElement.getAttribute('x')).toBe(String(expectedXCoordinateOfLabel))


        // Set new label distance
        const newLabelDistance = initialLabelDistance + 25
        myCategory
            .labelDistance(newLabelDistance)
            .update()


        // X coordinate of label should be updated //
        const newExpectedXCoordinateOfLabel = myCategory.x() - myCategory.labelDistance()
        // property
        expect(labelObject.x()).toBe(newExpectedXCoordinateOfLabel)
        // attribute
        expect(labelElement.getAttribute('x')).toBe(String(newExpectedXCoordinateOfLabel))


    })


    test ('Get/set label color', () => {

        // Clear JEST's DOM to prevent leftovers from previous tests
        document.body.innerHTML = ''
        // Create svg
        const mySvg = new container.Svg()
        // Create category
        const myCategory = new navigator.Category()
        // Toggle label
        myCategory.label('My label').update()


        // Selections
        const labelObject = myCategory.objects('label')
        const labelElement = document.querySelector('.category-label')


        // Save initial label color for later comparison
        const initialFill = myCategory.labelFill()

        // Verify that using labelFill as a getter worked
        expect(initialFill.constructor.name).toBe('String')

        // Set new label fill
        expect('salmon').not.toBe(initialFill)

        myCategory
            .labelFill('salmon')
            .update()

        // Verify that object properties and element attributes are updated
        // properties
        expect(myCategory.labelFill()).toBe('salmon')  // category object's property
        expect(labelObject.fill()).toBe('salmon')  // text object's property
        // attributes
        expect(labelElement.getAttribute('fill')).toBe('salmon')

    })


})

