const d3 = require("../../external/d3/d3")

test('Basic example', () => {
    expect(1).toBe(1)
})

test('External package', () => {
    expect(d3.range(3)[0]).toBe(0)
})

