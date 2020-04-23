
test ('Call a single color', () => {

    let myColor = d3.color('steelblue')

    expect(myColor).toEqual({"b": 180, "g": 130, "opacity": 1, "r": 70})

})




test ('DISCREET (categorical) color scales: A different color per datum', () => {

    // CATEGORICAL: IMPLEMENTATION #1: ARGUMENT-ONLY (NO DOMAIN OR RANGE SPECIFICATION) //

    const myOrdinalColorScale = d3.scaleOrdinal(d3.schemeAccent)

    expect(myOrdinalColorScale(0)).toBe('#7fc97f') // green
    expect(myOrdinalColorScale(1)).toBe('#beaed4') // purple
    expect(myOrdinalColorScale(2)).toBe('#fdc086') // orange
    expect(myOrdinalColorScale(100)).toBe('#ffff99') // yellow
    expect(myOrdinalColorScale(-1000)).toBe('#386cb0') // blue



    // CATEGORICAL: IMPLEMENTATION #2: SPECIFIED DOMAIN AND RANGE //

    const myOrdinalColorScale2 = d3.scaleOrdinal()
        .domain([0,4])  // palette size
        .range(d3.schemeSet1)  // palette

    // Values inside the domain
    expect(myOrdinalColorScale2(0)).toBe('#e41a1c') // red
    expect(myOrdinalColorScale2(1)).toBe('#4daf4a') // green
    expect(myOrdinalColorScale2(2)).toBe('#984ea3') // purple
    expect(myOrdinalColorScale2(3)).toBe('#ff7f00') // orange
    expect(myOrdinalColorScale2(4)).toBe('#377eb8') // blue

    // Values outside the domain are still generated (no floor or ceiling effect)
    // , although some colors may be repeated (e.g., purple in the blocks above and below)
    expect(myOrdinalColorScale2(5)).toBe('#ffff33') // yellow
    expect(myOrdinalColorScale2(-1)).toBe('#a65628') // purple
    expect(myOrdinalColorScale2(500)).toBe('#f781bf') // pink



    // CATEGORICAL: CUSTOM COLOR NAMES //

    const myCustomColorScale = d3.scaleOrdinal()
        .domain([0, 4]) // palette size
        .range(["gold", "blue", "green", "yellow", "red"])  // palette
    expect(myCustomColorScale(0)).toBe('gold')
    expect(myCustomColorScale(1)).toBe('green')
    expect(myCustomColorScale(2)).toBe('yellow')
    expect(myCustomColorScale(3)).toBe('red')
    expect(myCustomColorScale(4)).toBe('blue')

    // Values outside the domain will be assigned via a rotation strategy
    expect(myCustomColorScale(10)).toBe('gold')
    expect(myCustomColorScale(20)).toBe('blue')
    expect(myCustomColorScale(-10)).toBe('green')
    expect(myCustomColorScale(-9)).toBe('yellow')


})




test ('GRADIENT (i.e., continuous or sequential) color scale: A different hue per datum (using COLOR BREWER)', () => {

    // CONTINUOUS: MULTI-HUE //

    const myMultiHueColorScale = d3.scaleSequential()
        .domain([1, 10])  // palette size
        .interpolator(d3.interpolatePuRd)  // palette: Uses color brewer steps

    // Values smaller than the domain are floored:
    expect(myMultiHueColorScale(-1)).toBe('rgb(247, 244, 249)') // floor white as floor
    expect(myMultiHueColorScale(0)).toBe('rgb(247, 244, 249)') // floor white as floor

    // Values inside the domain are hue values that can be referred to in this way:
    expect(myMultiHueColorScale(1)).toBe('rgb(247, 244, 249)') // full white
    expect(myMultiHueColorScale(2)).toBe('rgb(232, 225, 239)') // hue step
    expect(myMultiHueColorScale(3)).toBe('rgb(217, 194, 223)') // hue step
    expect(myMultiHueColorScale(4)).toBe('rgb(206, 160, 205)') // full purple
    expect(myMultiHueColorScale(5)).toBe('rgb(213, 121, 186)') // hue step
    expect(myMultiHueColorScale(6)).toBe('rgb(226, 75, 158)') // hue step
    expect(myMultiHueColorScale(7)).toBe('rgb(221, 35, 120)') // hue step
    expect(myMultiHueColorScale(8)).toBe('rgb(192, 14, 84)') // full red
    expect(myMultiHueColorScale(9)).toBe('rgb(147, 2, 61)') // hue step
    expect(myMultiHueColorScale(10)).toBe('rgb(103, 0, 31)') // hue step

    // Values greater than the domain are 'ceiled':
    expect(myMultiHueColorScale(11)).toBe('rgb(103, 0, 31)') // repeated purple as ceiling
    expect(myMultiHueColorScale(50)).toBe('rgb(103, 0, 31)') // repeated purple as ceiling


    // GRADIENT: SINGLE HUE //

    const mySingleHueColorScale = d3.scaleSequential()
        .domain([0, 4])  // palette size
        .interpolator(d3.interpolateGreens)  // palette: Uses color brewer steps

    // Values inside the domain are hue values that can be referred to in this way:
    expect(mySingleHueColorScale(0)).toBe('rgb(247, 252, 245)') // full white
    expect(mySingleHueColorScale(1)).toBe('rgb(198, 232, 191)') // hue step
    expect(mySingleHueColorScale(2)).toBe('rgb(115, 195, 120)') // hue step
    expect(mySingleHueColorScale(3)).toBe('rgb(34, 139, 69)') // hue step
    expect(mySingleHueColorScale(4)).toBe('rgb(0, 68, 27)') // full green


    // GRADIENT: DIVERGING HUE //

    const myDivergingColorScale = d3.scaleSequential()
        .domain([0, 7]) // palette size
        .interpolator(d3.interpolateBrBG)   // palette: Uses color brewer steps

    // Values inside the domain are hue values that can be referred to in this way:
    expect(myDivergingColorScale(0)).toBe('rgb(84, 48, 5)') // full white
    expect(myDivergingColorScale(1)).toBe('rgb(161, 102, 27)') // hue step
    expect(myDivergingColorScale(2)).toBe('rgb(217, 182, 113)') // hue step
    expect(myDivergingColorScale(3)).toBe('rgb(244, 234, 208)') // hue step
    expect(myDivergingColorScale(4)).toBe('rgb(210, 236, 232)') // full green
    expect(myDivergingColorScale(5)).toBe('rgb(117, 195, 184)') // full green
    expect(myDivergingColorScale(6)).toBe('rgb(25, 123, 115)') // full green
    expect(myDivergingColorScale(7)).toBe('rgb(0, 60, 48)') // full green


    // GRADIENT: CYCLICAL //

    const myCyclicalColorScale = d3.scaleSequential()
        .domain([0, 7])  // palette size
        .interpolator(d3.interpolateRainbow)  // palette: Uses color brewer steps

    // Values inside the domain are hue values that can be referred to in this way:
    expect(myCyclicalColorScale(0)).toBe('rgb(110, 64, 170)') // full white
    expect(myCyclicalColorScale(1)).toBe('rgb(223, 64, 161)') // hue step
    expect(myCyclicalColorScale(2)).toBe('rgb(255, 112, 78)') // hue step
    expect(myCyclicalColorScale(3)).toBe('rgb(210, 201, 52)') // hue step
    expect(myCyclicalColorScale(4)).toBe('rgb(107, 247, 92)') // full green
    expect(myCyclicalColorScale(5)).toBe('rgb(27, 217, 172)') // full green
    expect(myCyclicalColorScale(6)).toBe('rgb(57, 136, 225)') // full green
    expect(myCyclicalColorScale(7)).toBe('rgb(110, 64, 170)') // full green


    // GRADIENT: 2 CUSTOM COLORS //

    const myCustomColorScale = d3.scaleLinear()
        .domain([0, 9])  // palette size
        .range(['green', 'red'])  // palette: Uses custom gradient

    // Values inside the domain are hue values that can be referred to in this way:
    expect(myCustomColorScale(0)).toBe('rgb(0, 128, 0)') // full white
    expect(myCustomColorScale(1)).toBe('rgb(28, 114, 0)') // hue step
    expect(myCustomColorScale(2)).toBe('rgb(57, 100, 0)') // hue step
    expect(myCustomColorScale(3)).toBe('rgb(85, 85, 0)') // hue step
    expect(myCustomColorScale(4)).toBe('rgb(113, 71, 0)') // full green
    expect(myCustomColorScale(5)).toBe('rgb(142, 57, 0)') // full green
    expect(myCustomColorScale(6)).toBe('rgb(170, 43, 0)') // full green
    expect(myCustomColorScale(7)).toBe('rgb(198, 28, 0)') // full green



    // GRADIENT: 3 CUSTOM COLORS //
    // TODO: 3-color custom gradients are problematic, and should be tried again.
})




test ('GRADIENT (i.e., continuous or sequential) color scale: Different hues of the same color using VIRIDIS', () => {

    // GRADIENT: VIRIDIS ORIGINAL //

    const myViridisColorScale = d3.scaleSequential()
        .domain([0,5])  // palette size
        .interpolator(d3.interpolateViridis)  // palette

    expect(myViridisColorScale(0)).toBe('#440154')  // purple
    expect(myViridisColorScale(1)).toBe('#414487')  // blue--purple
    expect(myViridisColorScale(2)).toBe('#2a788e')  // blue
    expect(myViridisColorScale(3)).toBe('#22a884')  // green
    expect(myViridisColorScale(4)).toBe('#7ad151')  // light green
    expect(myViridisColorScale(5)).toBe('#fde725')  // yellow


    // GRADIENT: VIRIDIS MAGMA

    const magmaColorScale = d3.scaleSequential()
        .domain([0,3])  // palette size
        .interpolator(d3.interpolateMagma)  // palette

    expect(magmaColorScale(0)).toBe('#000004')  // dark purple
    expect(magmaColorScale(1)).toBe('#721f81')  // purple
    expect(magmaColorScale(2)).toBe('#f1605d')  // red
    expect(magmaColorScale(3)).toBe('#fcfdbf')  // yellow


    // GRADIENT: VIRIDIS PLASMA //

    const plasmaColorScale = d3.scaleSequential()
        .domain([0,3])  // palette size
        .interpolator(d3.interpolatePlasma)  // palette

    expect(plasmaColorScale(0)).toBe('#0d0887')  // dark purple
    expect(plasmaColorScale(1)).toBe('#9c179e')  // purple
    expect(plasmaColorScale(2)).toBe('#ed7953')  // orange
    expect(plasmaColorScale(3)).toBe('#f0f921')  // yellow


    // GRADIENT: OTHER VIRIDIS OPTIONS:
    // Inferno
    d3.interpolateInferno

})