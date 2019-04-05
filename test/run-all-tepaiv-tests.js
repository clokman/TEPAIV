/*
 This script runs all tests in TEPAIV.
 It must be ran from an HTML file that has the necessary QUnit set up.
 Such HTML files that call this file may exist in multiple places in the project.

*/

// DictionariesArray
import {tests_dictionariesArray} from '../common/DictionariesArray.js'
tests_dictionariesArray()

//MiniTreeMap
import {tests_MiniTreeMap} from "../CPC/MiniTreeMap.js";
tests_MiniTreeMap()

