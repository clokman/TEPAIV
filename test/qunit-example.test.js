import {MiniTreeMap} from "../CPC/MiniTreeMap.js"

// Qunit tests
QUnit.module("Example Qunit tests") // Assign test group name
QUnit.test( "a basic test example", function( assert ) {
    let value = "hello";
    assert.equal( value, "hello", "We expect value to be hello" );
})

QUnit.test( "Another example", function( assert ) {
    let value = "bye";
    assert.equal( value, "bye", "We expect value to be bye" );
})


